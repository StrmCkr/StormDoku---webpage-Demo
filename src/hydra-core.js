(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before hydra-core.js');

  const sortedUnique = values => [...new Set(values || [])]
    .filter(value => Number.isInteger(value))
    .sort((left, right) => left - right);

  const intersection = (left, right) => {
    const rightSet = new Set(right || []);
    return sortedUnique((left || []).filter(value => rightSet.has(value)));
  };

  const disjoint = (left, right) => {
    const rightSet = new Set(right || []);
    return (left || []).every(value => !rightSet.has(value));
  };

  const eliminationKey = item => `${item.cell}:${item.digit}`;

  function nodeCells(node) {
    return [...(node?.cells || node?.alsAllCells || node?.ahsAllCells || [])];
  }

  function nodeDigits(node) {
    return sortedUnique(node?.digits || node?.alsDigits || node?.ahsDigits || []);
  }

  function nodeDof(node) {
    return Number.isInteger(node?.dof)
      ? node.dof
      : Number.isInteger(node?.alsDOF)
        ? node.alsDOF
        : Number.isInteger(node?.ahsDOF)
          ? node.ahsDOF
          : nodeDigits(node).length - nodeCells(node).length;
  }

  function nodeId(node, fallback) {
    return node?.id ?? node?.uniqueID ?? fallback;
  }

  function normaliseNode(node, fallback = 'hydra-node') {
    const cells = nodeCells(node);
    const digits = nodeDigits(node);
    return {
      ...node,
      id: nodeId(node, fallback),
      cells,
      digits,
      dof: nodeDof(node),
      rccList: (node?.rccList || []).map(rcc => ({
        digit: Number(rcc.digit ?? rcc.rccDigit),
        cells: [...(rcc.cells || rcc.rccCells || [])],
        sectors: [...(rcc.sectors || rcc.rccSectors || [])],
      })),
    };
  }

  function chainCells(chain) {
    return sortedUnique((chain?.steps || []).flatMap(step => [
      ...(step.entry?.cells || []),
      ...(step.exit?.cells || []),
    ]));
  }

  function chainEndpointAllowsElimination(chain, cell, digit) {
    const steps = chain?.steps || [];
    if (!steps.length) return false;
    // Every asserted side of the branch is a protected truth.  A terminal
    // ALS/AIC cell can be represented by an entry on the final step and an
    // exit on that same step, so checking only the outermost entry/exit lets
    // the active terminal digit leak into Hydra eliminations.
    const assertedSides = steps.flatMap(step => [step?.entry, step?.exit]);
    const cellSides = assertedSides.filter(side => side
      && (side.cells || []).includes(cell));
    // The endpoint's chained digit must remain; another candidate in that
    // endpoint cell can still be a valid consequence of the chain.
    return cellSides.length > 0
      && cellSides.every(side => !(side.digits || []).includes(digit));
  }

  function normaliseEliminations(cand, values, occupied, chain = null) {
    const seen = new Set();
    const output = [];
    for (const item of values || []) {
      const cell = Number(item?.cell);
      const digit = Number(item?.digit);
      const key = `${cell}:${digit}`;
      if (!Number.isInteger(cell) || cell < 0 || cell >= 81
        || !Number.isInteger(digit) || digit < 1 || digit > 9
        || (occupied.has(cell) && !chainEndpointAllowsElimination(chain, cell, digit))
        || !(cand[cell] || []).includes(digit)
        || seen.has(key)) continue;
      seen.add(key);
      output.push({ ...item, cell, digit });
    }
    return output;
  }

  // A Hydra participant is an existing ALS/AHS/ALC-compatible node plus a
  // verified AIC branch. The node supplies the RCC interface; the branch
  // supplies additional reachable cells and eliminations. Keeping this
  // contract explicit prevents an arbitrary chain from being treated as an
  // ALS without a boundary proof.
  function hydraParticipant(cand, input, index = 0) {
    const node = normaliseNode(input?.node || input?.als || input?.ahs, `hydra-${index}`);
    const chain = input?.chain || input?.aic || null;
    const chainCellsValue = chainCells(chain);
    const occupied = new Set([...node.cells, ...chainCellsValue]);
    const verified = input?.verified === true
      || chain?.verification?.ok === true
      || chain?.verified === true;
    return {
      kind: 'HYDRA_AIC',
      family: input?.family || node.family || 'ALS',
      id: input?.id || `${node.id}:hydra:${index}`,
      node,
      chain,
      verified,
      chainCells: chainCellsValue,
      occupiedCells: [...occupied].sort((left, right) => left - right),
      eliminations: normaliseEliminations(
        cand,
        input?.eliminations || chain?.eliminations,
        occupied,
        chain,
      ),
      interface: {
        entry: input?.interface?.entry || chain?.steps?.[0]?.entry || null,
        exit: input?.interface?.exit || chain?.steps?.at(-1)?.exit || null,
      },
    };
  }

  function rccForDigit(node, digit) {
    return node.rccList.find(rcc => rcc.digit === digit) || null;
  }

  function candidateCells(cand, node, digit) {
    return node.cells.filter(cell => (cand[cell] || []).includes(digit));
  }

  function cellsSeeEachOther(left, right) {
    return !!left.length && !!right.length
      && left.every(leftCell => right.every(rightCell =>
        core.peersOf(leftCell).includes(rightCell)));
  }

  function hydraBridges(cand, left, right) {
    const bridges = [];
    for (const digit of intersection(left.digits, right.digits)) {
      const leftRcc = rccForDigit(left, digit);
      const rightRcc = rccForDigit(right, digit);
      if (!leftRcc || !rightRcc
        || leftRcc.cells.length !== 1
        || rightRcc.cells.length !== 1
        || !cellsSeeEachOther(leftRcc.cells, rightRcc.cells)) continue;
      bridges.push({
        digit,
        leftCells: [...leftRcc.cells],
        rightCells: [...rightRcc.cells],
        sectors: sortedUnique([...(leftRcc.sectors || []), ...(rightRcc.sectors || [])]),
      });
    }
    return bridges;
  }

  function chainEndpointMatches(chain, boundaryCells, digit) {
    const steps = chain?.steps || [];
    if (!steps.length || !boundaryCells?.length || digit == null) return false;
    const first = steps[0]?.entry;
    const last = steps[steps.length - 1]?.exit;
    return [first, last].some(side => side
      && (side.digits || []).includes(digit)
      && (side.cells || []).some(cell => boundaryCells.includes(cell)));
  }

  function hydraBoundaryForBridge(chain, boundaryCells, digit) {
    const steps = chain?.steps || [];
    if (!steps.length || !boundaryCells?.length || digit == null) return null;
    const endpoints = [
      { index: 0, side: steps[0]?.entry },
      { index: steps.length - 1, side: steps[steps.length - 1]?.exit },
    ];
    const match = endpoints.find(endpoint => endpoint.side
      && (endpoint.side.digits || []).includes(digit)
      && (endpoint.side.cells || []).some(cell => boundaryCells.includes(cell)));
    if (!match) return null;
    const other = endpoints.find(endpoint => endpoint !== match)?.side || null;
    return { boundary: match.side, opposite: other };
  }

  // When an AIC arrives at an auxiliary LS, the LS may expose a grouped
  // terminal side containing all but one of its digits.  That missing LS digit
  // is a Hydra-only endpoint consequence: it is tested at the opposite AIC
  // endpoint.  It must not be added to ordinary AIC eliminations because the
  // auxiliary LS is what supplies this complementary restriction.
  function hydraBoundaryEliminations(cand, participant, bridge) {
    const node = participant?.node;
    const chain = participant?.chain;
    const boundary = hydraBoundaryForBridge(chain, bridge?.rightCells, bridge?.digit);
    if (!node || !boundary?.boundary || !boundary.opposite) return [];
    const missing = node.digits.filter(digit => !(boundary.boundary.digits || []).includes(digit));
    const output = [];
    for (const cell of boundary.opposite.cells || []) {
      for (const digit of missing) {
        // The active endpoint digit is a required truth of the AIC boundary.
        // It can never be one of the complementary eliminations, even when
        // the opposite endpoint cell also contains that digit.
        if (!chainEndpointAllowsElimination(chain, cell, digit)) continue;
        if ((cand[cell] || []).includes(digit)) {
          output.push({
            cell,
            digit,
            reasons: ['HYDRA LS complementary endpoint'],
          });
        }
      }
    }
    return output;
  }

  function peersEverywhere(cell, sourceCells) {
    return sourceCells.length > 0
      && sourceCells.every(source => core.peersOf(source).includes(cell));
  }

  function mergeEliminations(...groups) {
    const merged = new Map();
    for (const group of groups) {
      for (const item of group || []) {
        const key = eliminationKey(item);
        const previous = merged.get(key) || { ...item, reasons: [] };
        for (const reason of item.reasons || []) {
          if (!previous.reasons.includes(reason)) previous.reasons.push(reason);
        }
        merged.set(key, { ...previous, ...item, reasons: previous.reasons });
      }
    }
    return [...merged.values()].sort((left, right) =>
      left.cell - right.cell || left.digit - right.digit);
  }

  function normaliseOptions(options = {}) {
    return {
      maxDigits: Number.isInteger(options.maxDigits) ? Math.max(2, Math.min(9, options.maxDigits)) : 9,
      maxAuxiliary: Number.isInteger(options.maxAuxiliary) ? Math.max(1, Math.min(9, options.maxAuxiliary)) : 9,
      maxResults: Number.isInteger(options.maxResults) ? Math.max(1, options.maxResults) : 5000,
      requireVerifiedParticipants: options.requireVerifiedParticipants !== false,
      families: options.families?.length ? [...options.families] : ['ALS'],
    };
  }

  function participantCandidates(cand, primaryA, primaryC, participants, z, opts) {
    return participants.filter(participant => {
      if (opts.families.length && !opts.families.includes(participant.family)) return false;
      if (opts.requireVerifiedParticipants && !participant.verified) return false;
      const node = participant.node;
      if (!node.dof || !node.digits.includes(z)) return false;
      if (!disjoint(primaryA.cells, participant.occupiedCells)
        || !disjoint(primaryC.cells, participant.occupiedCells)) return false;
      const aBridges = hydraBridges(cand, primaryA, node);
      const cBridges = hydraBridges(cand, primaryC, node);
      if (!aBridges.length || !cBridges.length) return false;
      const branchBridges = participant.chain
        ? aBridges.filter(bridge => chainEndpointMatches(
          participant.chain,
          bridge.rightCells,
          bridge.digit,
        ))
        : aBridges;
      if (participant.chain && !branchBridges.length) return false;
      participant._hydraA = branchBridges;
      participant._hydraC = cBridges;
      participant._hydraBoundaryEliminations = branchBridges.flatMap(bridge =>
        hydraBoundaryEliminations(cand, participant, bridge));
      participant.eliminations = mergeEliminations(
        participant.eliminations,
        participant._hydraBoundaryEliminations,
      );
      participant._hydraRccDigits = sortedUnique([
        ...branchBridges.map(bridge => bridge.digit),
        ...cBridges.map(bridge => bridge.digit),
      ].filter(digit => digit !== z));
      return participant._hydraRccDigits.length >= node.dof;
    });
  }

  function findHydraAlsDof(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.sourceNodes || options.alsList || core.alsConstructor?.(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    }) || [];
    const nodes = source
      .filter(node => (node.alsDigits || node.digits || []).length >= 2)
      .filter(node => (node.alsDigits || node.digits || []).length <= opts.maxDigits)
      .filter(node => !options.nodeFamilies?.length
        || options.nodeFamilies.includes(node.family || 'ALS'))
      .map((node, index) => normaliseNode(node, `als-${index}`));
    const participants = (options.participants || [])
      .map((participant, index) => hydraParticipant(cand, participant, index));
    const endpoints = nodes.filter(node => node.dof > 0);
    const results = [];
    const seen = new Set();

    for (let leftIndex = 0; leftIndex < endpoints.length; leftIndex += 1) {
      const primaryA = endpoints[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < endpoints.length; rightIndex += 1) {
        const primaryC = endpoints[rightIndex];
        if (primaryA.digits.length !== primaryC.digits.length
          || !disjoint(primaryA.cells, primaryC.cells)) continue;

        for (const z of intersection(primaryA.digits, primaryC.digits)) {
          const candidates = participantCandidates(cand, primaryA, primaryC, participants, z, opts);
          const visit = (start, selected, covered) => {
            if (results.length >= opts.maxResults) return;
            if (selected.length) {
              const endpointRcc = new Set(covered);
              const required = primaryA.digits.length - 1;
              if (endpointRcc.size >= required) {
                const key = [primaryA.id, primaryC.id, z, ...selected.map(item => item.id)].join('|');
                if (!seen.has(key)) {
                  const excluded = new Set([
                    ...primaryA.cells,
                    ...primaryC.cells,
                    ...selected.flatMap(item => item.occupiedCells),
                  ]);
                  const sourceCells = [
                    ...candidateCells(cand, primaryA, z),
                    ...candidateCells(cand, primaryC, z),
                    ...selected.flatMap(item => candidateCells(cand, item.node, z)),
                  ];
                  const direct = [];
                  for (let cell = 0; cell < 81; cell += 1) {
                    if (excluded.has(cell) || !(cand[cell] || []).includes(z)) continue;
                    if (peersEverywhere(cell, sourceCells)) {
                      direct.push({ cell, digit: z, reasons: ['HYDRA A∩C'] });
                    }
                  }
                  const eliminations = mergeEliminations(
                    direct,
                    ...selected.map(participant => participant.eliminations),
                  );
                  if (eliminations.length) {
                    seen.add(key);
                    const hydraBranches = selected.flatMap(participant =>
                      (participant._hydraA || []).map(rcc => ({
                        participantId: participant.id,
                        hubId: primaryA.id,
                        lsId: participant.node.id,
                        rcc: { ...rcc },
                        ls: participant.node,
                        chain: participant.chain,
                        chainCells: participant.chainCells,
                      }))
                    );
                    results.push({
                      tech: 'hydra',
                      name: options.name || 'Hydra ALS DOF',
                      type: options.type || 'HYDRA_ALS_DOF',
                      family: options.family || 'ALS',
                      mode: 'hydra',
                      z,
                      size: primaryA.digits.length,
                      primaryA,
                      primaryC,
                      auxiliary: selected.map(participant => ({
                        ...participant.node,
                        hydraParticipantId: participant.id,
                        hydraFamily: participant.family,
                        hydraChain: participant.chain,
                        hydraChainCells: participant.chainCells,
                        hydraEliminations: participant.eliminations,
                        aBridges: participant._hydraA,
                        cBridges: participant._hydraC,
                        rccDigits: participant._hydraRccDigits,
                      })),
                      // Each branch is explicitly Hub -> RCC -> LS -> AIC.
                      // The C-side bridges remain verification data and are
                      // intentionally not presented as additional branches.
                      hydraBranches,
                      participants: selected,
                      rccDigits: [...endpointRcc].sort((a, b) => a - b),
                      eliminations,
                      cells: eliminations.map(item => item.cell),
                    });
                  }
                }
              }
            }
            if (selected.length >= opts.maxAuxiliary) return;
            for (let index = start; index < candidates.length; index += 1) {
              const participant = candidates[index];
              if (selected.some(previous => !disjoint(previous.occupiedCells, participant.occupiedCells))) continue;
              visit(index + 1, [...selected, participant], new Set([
                ...covered,
                ...participant._hydraRccDigits,
              ]));
            }
          };
          visit(0, [], new Set());
        }
      }
    }

    return {
      results,
      stats: {
        alsRecords: nodes.length,
        hydraParticipants: participants.length,
        hydraResults: results.length,
      },
      options: opts,
    };
  }

  // Build Hydra participants from already verified public AIC chains. A chain
  // is eligible only when it actually traversed an ALS link; this prevents a
  // free-standing AIC from being attached to an unrelated auxiliary ALS.
  function hydraParticipantsFromAicChains(cand, chains, sourceList, sourceLinks, options = {}) {
    const family = options.family || 'ALS';
    const nodesById = new Map((sourceList || []).map(node => [
      String(node.uniqueID ?? node.id), node,
    ]));
    const linksById = new Map();
    const flatLinks = (sourceLinks || []).flatMap(bucket => Array.isArray(bucket) ? bucket : [bucket]);
    for (const link of flatLinks) {
      if (link?.id != null) linksById.set(String(link.id), link);
    }

    const limit = Number.isInteger(options.maxParticipants)
      ? Math.max(1, options.maxParticipants)
      : 2000;
    const bestByNodeAndElimination = new Map();
    for (const chain of chains || []) {
      if (!chain?.steps?.length || (!options.forChaining && !(chain.eliminations || []).length)) continue;
      const nodeIds = new Set(chain.steps.filter(step => step.family === family).flatMap(step => {
        const link = linksById.get(String(step.linkId));
        return [
          link?.LS_L?.uniqueID, link?.LS_R?.uniqueID,
          link?.left?.uniqueID, link?.right?.uniqueID,
          ...(step.alsNodeIds || []), ...(step.ahsNodeIds || []),
        ]
          .filter(id => id != null);
      }));
      if (options.forChaining) {
        for (const [id, node] of nodesById) {
          if (branchBoundary(normaliseNode(node), chain)) nodeIds.add(id);
        }
      }
      for (const nodeId of nodeIds) {
        const node = nodesById.get(String(nodeId));
        if (!node) continue;
        const nodeDof = node.alsDOF ?? node.ahsDOF ?? node.dof;
        if (nodeDof <= 0) continue;
        const eliminationKey = (chain.eliminations || [])
          .map(item => `${item.cell}:${item.digit}`).sort().join(';');
        const boundaryKey = options.forChaining
          ? [chain.steps[0].entry, chain.steps.at(-1).exit]
            .map(side => `${side.cells.join(',')}:${side.digits.join(',')}`).sort().join('|')
          : '';
        const key = `${nodeId}|${eliminationKey}|${boundaryKey}`;
        const participant = {
          id: `hydra-aic:${key}`,
          family,
          node,
          chain,
          verified: true,
          eliminations: chain.eliminations || [],
        };
        const existing = bestByNodeAndElimination.get(key);
        const chainCost = (chain.steps.length * 1000) + chainCells(chain).length;
        const existingCost = existing
          ? (existing.chain.steps.length * 1000) + chainCells(existing.chain).length : Infinity;
        if (!existing || chainCost < existingCost) bestByNodeAndElimination.set(key, participant);
      }
    }
    return [...bestByNodeAndElimination.values()].slice(0, limit);
  }

  function verifyHydraParticipant(cand, participant) {
    const normalised = hydraParticipant(cand, participant, 0);
    const errors = [];
    if (!normalised.verified) errors.push('Hydra participant AIC chain is not verified');
    if (!normalised.node.dof || normalised.node.digits.length - normalised.node.cells.length !== normalised.node.dof) {
      errors.push('Hydra participant has an invalid node DOF');
    }
    for (const item of participant?.eliminations || participant?.chain?.eliminations || []) {
      if (!(cand[item.cell] || []).includes(item.digit)) {
        errors.push(`Hydra participant elimination ${eliminationKey(item)} is stale`);
      }
    }
    return { ok: errors.length === 0, errors, participant: normalised };
  }

  function dofChainNodes(record) {
    return [record.primaryA, ...(record.auxiliary || []), record.primaryC].filter(Boolean);
  }

  function branchBoundary(node, chain) {
    if (!chain?.steps?.length || chain.isRing) return null;
    const endpoints = [chain.steps[0].entry, chain.steps.at(-1).exit];
    return endpoints.find(side => side?.cells?.length
      && side.cells.every(cell => node.cells.includes(cell))
      && side.digits?.some(digit => node.digits.includes(digit))) || null;
  }

  function dofChainBranch(node, participant, record) {
    if (!participant.verified || String(participant.node.id) !== String(node.id)
      || node.cells.join(',') !== participant.node.cells.join(',')
      || node.digits.join(',') !== participant.node.digits.join(',')) return null;
    const boundary = branchBoundary(node, participant.chain);
    if (!boundary || !participant.chainCells.some(cell => !node.cells.includes(cell))) return null;
    return {
      participantId: participant.id,
      hubId: record.primaryA.id,
      lsId: node.id,
      sourceRole: node === record.primaryA ? 'hub' : node === record.primaryC ? 'terminal' : 'auxiliary',
      ls: node,
      boundary,
      chain: participant.chain,
      chainCells: participant.chainCells,
      eliminations: participant.eliminations,
    };
  }

  // Check the physical candidate placements of the complete construction.
  // Shared cells have one variable, and sector strong links contribute their
  // required occurrence. A search budget exhaustion is inconclusive.
  function hydraChainProof(cand, record, options = {}) {
    const cells = new Set(dofChainNodes(record).flatMap(node => node.cells));
    const clauses = [];
    const addSideAtoms = side => (side?.cells || []).flatMap(cell =>
      (side.digits || []).filter(digit => (cand[cell] || []).includes(digit))
        .map(digit => ({ cell, digit })));
    for (const branch of record.hydraBranches || []) {
      for (const step of branch.chain.steps || []) {
        for (const side of [step.entry, step.exit]) {
          for (const cell of side?.cells || []) cells.add(cell);
        }
        if (step.family === 'SL' && step.linkType !== 4) {
          clauses.push([...addSideAtoms(step.entry), ...addSideAtoms(step.exit)]);
        }
        for (const subset of [step.module?.entrySideSubset, step.module?.exitSideSubset]) {
          for (const cell of subset?.cells || []) cells.add(cell);
          if (step.family === 'AHS' && subset) {
            for (const digit of subset.digits || []) {
              clauses.push((subset.cells || []).filter(cell => (cand[cell] || []).includes(digit))
                .map(cell => ({ cell, digit })));
            }
          }
        }
      }
    }
    const domains = new Map([...cells].map(cell => [cell, [...(cand[cell] || [])]]));
    const peers = new Map([...cells].map(cell => [cell, new Set(core.peersOf(cell))]));
    let states = 0;
    const maxStates = Math.max(1, Number(options.maxProofStates) || 20000);
    const visit = current => {
      if (++states > maxStates) return null;
      let changed = true;
      while (changed) {
        changed = false;
        for (const [cell, values] of current) {
          if (!values.length) return false;
          if (values.length !== 1) continue;
          for (const peer of peers.get(cell)) {
            const previous = current.get(peer);
            if (!previous?.includes(values[0])) continue;
            if (previous.length === 1) return false;
            current.set(peer, previous.filter(digit => digit !== values[0]));
            changed = true;
          }
        }
        for (const clause of clauses) {
          const supported = clause.filter(item => current.get(item.cell)?.includes(item.digit));
          if (!supported.length) return false;
          if (supported.length === 1) {
            const item = supported[0];
            if (current.get(item.cell).length > 1) {
              current.set(item.cell, [item.digit]);
              changed = true;
            }
          }
        }
      }
      let bestCell = null;
      for (const [cell, values] of current) {
        if (values.length > 1 && (bestCell === null || values.length < current.get(bestCell).length)) bestCell = cell;
      }
      if (bestCell === null) return true;
      for (const digit of current.get(bestCell)) {
        const next = new Map(current);
        next.set(bestCell, [digit]);
        const possible = visit(next);
        if (possible !== false) return possible;
      }
      return false;
    };
    const canPlace = item => {
      const current = new Map(domains);
      if (item) {
        if (!(cand[item.cell] || []).includes(item.digit)) return false;
        if (current.has(item.cell)) current.set(item.cell, [item.digit]);
        else {
          for (const peer of core.peersOf(item.cell)) {
            const values = current.get(peer);
            if (values) current.set(peer, values.filter(digit => digit !== item.digit));
          }
        }
      }
      return visit(current);
    };
    return { cells: [...cells], canPlace, get exhausted() { return states > maxStates; } };
  }

  function hydraChainEliminations(cand, record, options = {}) {
    const proof = hydraChainProof(cand, record, options);
    if (proof.canPlace(null) !== true) return [];
    const verified = mergeEliminations(
      record.baseEliminations || record.eliminations,
      ...(record.hydraBranches || []).map(branch => branch.eliminations),
    );
    const projected = [];
    for (const branch of record.hydraBranches || []) {
      const steps = branch.chain?.steps || [];
      const endpoints = [steps[0]?.entry, steps.at(-1)?.exit];
      // Only a genuinely atomic endpoint is a forced placement.  Grouped
      // ALS/AHS sides remain conditional and must keep their own two-node
      // verifier; treating every member as forced recreates false Hydra ALS-XZ
      // eliminations from the old footprint sweep.
      for (const side of endpoints) {
        if (side?.cells?.length !== 1 || side?.digits?.length !== 1) continue;
        const [source] = side.cells;
        const [digit] = side.digits;
        if (!(cand[source] || []).includes(digit)) continue;
        for (const cell of core.peersOf(source)) {
          if (!(cand[cell] || []).includes(digit)) continue;
          const item = { cell, digit, reasons: ['HYDRA atomic endpoint'] };
          if (proof.canPlace(item) === false) projected.push(item);
        }
      }
    }
    return mergeEliminations(verified, projected);
  }

  function findHydraAlsDofChains(cand, options = {}) {
    const maxResults = Math.max(1, Number(options.maxResults) || 500);
    const maxBranches = Math.max(1, Number(options.maxAuxiliary) || 5);
    const maxCombinations = Math.max(1, Number(options.maxHydraCombinations) || maxResults * 10);
    const participants = (options.participants || []).map((item, index) => hydraParticipant(cand, item, index));
    const byNode = new Map();
    for (const participant of participants) {
      const key = String(participant.node.id);
      if (!byNode.has(key)) byNode.set(key, []);
      byNode.get(key).push(participant);
    }
    const report = options.chainReport || {};
    const seeds = [...(report.auditCandidates || []), ...(report.results || [])];
    const results = [];
    const bestProofs = new Map();
    const seenSeeds = new Set();
    let combinations = 0;
    for (const seed of seeds) {
      if (results.length >= maxResults || combinations >= maxCombinations) break;
      const key = [seed.primaryA?.id, seed.primaryC?.id, seed.z, seed.chainForm,
        ...(seed.auxiliary || []).map(node => node.id)].join('|');
      if (seenSeeds.has(key) || seed.mode !== 'chain') continue;
      seenSeeds.add(key);
      const branches = dofChainNodes(seed).flatMap(node => (byNode.get(String(node.id)) || [])
        .map(participant => dofChainBranch(node, participant, seed)).filter(Boolean));
      if (!branches.length) continue;
      if (!core.verifyAlsDofNet(cand, { ...seed, eliminations: [] }, { ...options, structuralOnly: true }).ok) continue;
      const visit = (start, selected) => {
        if (results.length >= maxResults || combinations >= maxCombinations) return;
        if (selected.length) {
          combinations += 1;
          options.onProgress?.({ stage: 'hydra-dof-chain', seedsChecked: seenSeeds.size, combinations });
          const record = {
            ...seed,
            hasHydra: true,
            name: seed.isRing ? 'Hydra ALS DOF Chain Ring' : 'Hydra ALS DOF Chain',
            type: 'HYDRA_ALS_DOF_CHAIN',
            baseEliminations: seed.eliminations || [],
            hydraBranches: selected,
          };
          const eliminations = hydraChainEliminations(cand, record, options);
          const existing = new Set(record.baseEliminations.map(eliminationKey));
          if (eliminations.some(item => !existing.has(eliminationKey(item)))) {
            const proofKey = `${key}|${eliminations.map(eliminationKey).join(';')}`;
            const cost = selected.length * 10000 + selected.reduce((total, branch) => total + branch.chain.steps.length, 0);
            const previous = bestProofs.get(proofKey);
            if (!previous || cost < previous.cost) {
              const index = previous?.index ?? results.length;
              results[index] = { ...record, eliminations, cells: sortedUnique(eliminations.map(item => item.cell)) };
              bestProofs.set(proofKey, { index, cost });
            }
          }
        }
        if (selected.length >= maxBranches) return;
        for (let index = start; index < branches.length; index += 1) {
          const branch = branches[index];
          if (selected.some(previous => previous.participantId === branch.participantId
            || previous.lsId === branch.lsId)) continue;
          visit(index + 1, [...selected, branch]);
          if (results.length >= maxResults || combinations >= maxCombinations) return;
        }
      };
      visit(0, []);
    }
    return {
      results,
      stats: { hydraChainSeeds: seenSeeds.size, hydraChainCombinations: combinations,
        hydraChainResults: results.length, hydraParticipants: participants.length,
        truncated: results.length >= maxResults || combinations >= maxCombinations },
    };
  }

  function verifyHydraAlsDofChain(cand, record, options = {}) {
    const errors = [];
    const base = { ...record, hasHydra: false, eliminations: record.baseEliminations || [] };
    const verification = core.verifyAlsDofNet(cand, base, { ...options, structuralOnly: true });
    errors.push(...verification.errors);
    if (!record.hydraBranches?.length) errors.push('Hydra DOF chain requires an AIC branch');
    for (const branch of record.hydraBranches || []) {
      const node = dofChainNodes(record).find(item => String(item.id) === String(branch.lsId));
      if (!node || !branchBoundary(node, branch.chain)) errors.push('Hydra DOF chain branch has no ALS endpoint handoff');
    }
    const proof = hydraChainProof(cand, record, options);
    if (proof.canPlace(null) !== true) errors.push('Hydra DOF chain has no complete placement witness');
    const branchEliminations = new Set((record.hydraBranches || [])
      .flatMap(branch => branch.eliminations || [])
      .map(eliminationKey));
    const expectedEliminations = [];
    for (const item of record.eliminations || []) {
      const key = eliminationKey(item);
      const branchOwned = branchEliminations.has(key);
      if (!(cand[item.cell] || []).includes(item.digit)
        || (!branchOwned && proof.canPlace(item) !== false)) {
        errors.push(`no Hydra chain witness for elimination ${key}`);
      }
      else expectedEliminations.push(item);
    }
    return { ok: !errors.length, errors, expectedEliminations };
  }

  function interfaceSide(record, side, override = null) {
    const node = side === 'left' ? record?.primaryA : record?.primaryC;
    const source = override || node || {};
    const cells = [...(source.cells || source.alsAllCells || [])];
    const digits = nodeDigits(source);
    const sectorsByDigit = source.sectorsByDigit || {};
    const potential = source.potentialElimByDigit || {};
    return {
      cells,
      digits,
      sectorsByDigit: Object.fromEntries(Object.entries(sectorsByDigit)
        .map(([digit, values]) => [digit, sortedUnique(values)])),
      potentialElimByDigit: Object.fromEntries(Object.entries(potential)
        .map(([digit, values]) => [digit, sortedUnique(values)])),
      rccCells: [...(source.rccCells || [])],
      swapDigits: [],
    };
  }

  // Convert a verified Hydra collection into the link shape consumed by the
  // AIC graph. The caller supplies the boundary interfaces because the hub's
  // internal AIC may expose a different entry/exit than its two ALS endpoints.
  // Without explicit interfaces this remains a terminal Hydra result.
  function hydraAlsDofLink(record, options = {}) {
    if (!record || record.mode !== 'hydra') return null;
    const left = interfaceSide(record, 'left', options.left || record.linkInterface?.left);
    const right = interfaceSide(record, 'right', options.right || record.linkInterface?.right);
    if (!left.cells.length || !right.cells.length || !left.digits.length || !right.digits.length) return null;
    return {
      id: options.id ?? `hydra:${record.primaryA?.id}:${record.primaryC?.id}:${record.z}`,
      linkType: -1,
      linkTypeName: 'HYDRA_ALS_DOF',
      secondaryTypes: ['ALS_DOF'],
      moduleKind: 'HYDRA_ALS_DOF',
      activeCells: left.cells,
      linkedCells: right.cells,
      startingDigits: left.digits,
      linkDigits: right.digits,
      startCellsSector: left.sectorsByDigit,
      linkCellsSector: right.sectorsByDigit,
      potentialElimStart: left.potentialElimByDigit,
      potentialElimEnd: right.potentialElimByDigit,
      rccStartCells: left.rccCells,
      rccLinkedCells: right.rccCells,
      startDigitSwapAvailable: left.swapDigits,
      endDigitSwapAvailable: right.swapDigits,
      conveyance: 'DIGITS',
      hydraRecord: record,
      intrinsicEliminations: [...(record.eliminations || [])],
    };
  }

  core.hydraParticipant = hydraParticipant;
  core.hydraBoundaryEliminations = hydraBoundaryEliminations;
  core.findHydraAlsDof = findHydraAlsDof;
  core.findHydraDof = findHydraAlsDof;
  core.findHydraAlsDofChains = findHydraAlsDofChains;
  core.verifyHydraAlsDofChain = verifyHydraAlsDofChain;
  core.hydraParticipantsFromAicChains = hydraParticipantsFromAicChains;
  core.verifyHydraParticipant = verifyHydraParticipant;
  core.hydraAlsDofLink = hydraAlsDofLink;
})(globalThis);
