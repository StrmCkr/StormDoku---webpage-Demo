(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before als-dof-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before als-dof-core.js');

  const {
    intersection,
    sortedUnique,
    union,
    peerPotentialEliminations,
  } = core.setTools;

  function disjoint(left, right) {
    const seen = new Set(left);
    return right.every(cell => !seen.has(cell));
  }

  function cellsSeeEachOther(left, right) {
    return !!left.length
      && !!right.length
      && left.every(leftCell => right.every(rightCell =>
        core.peersOf(leftCell).includes(rightCell)));
  }

  function rccForDigit(als, digit) {
    const record = (als.rccList || []).find(rcc =>
      (rcc.rccDigit ?? rcc.digit) === digit);
    if (!record) return null;
    return {
      ...record,
      cells: [...(record.cells || record.rccCells || [])],
      sectors: [...(record.sectors || record.rccSectors || [])],
    };
  }

  function restrictedCommons(left, right) {
    const bridges = [];
    for (const digit of intersection(left.digits, right.digits)) {
      const leftRcc = rccForDigit(left, digit);
      const rightRcc = rccForDigit(right, digit);
      if (!leftRcc || !rightRcc) continue;
      // A standard RCC is restricted to one occurrence in each ALS. A
      // multi-cell occurrence is a shared candidate, not a valid RCC link.
      if (leftRcc.cells.length !== 1 || rightRcc.cells.length !== 1) continue;
      if (!cellsSeeEachOther(leftRcc.cells, rightRcc.cells)) continue;
      bridges.push({
        digit,
        leftCells: [...leftRcc.cells],
        rightCells: [...rightRcc.cells],
        sectors: sortedUnique([
          ...(leftRcc.sectors || []),
          ...(rightRcc.sectors || []),
        ]),
      });
    }
    return bridges;
  }

  function normaliseAls(als) {
    return {
      id: als.uniqueID,
      cells: [...als.alsAllCells],
      digits: [...als.alsDigits],
      size: als.alsSize,
      fox: als.alsFOX,
      dof: als.alsDOF,
      sector: als.alsSector,
      rccList: (als.rccList || []).map(rcc => ({
        digit: rcc.rccDigit,
        cells: [...rcc.rccCells],
        sectors: [...(rcc.rccSectors || [])],
      })),
    };
  }

  function bridgeDigits(bridges) {
    return sortedUnique(bridges.map(bridge => bridge.digit));
  }

  function alsShapeSignature(node) {
    return `${node.dof}|${node.digits.join(',')}`;
  }

  function endpointBridgeCoverage(primaryA, primaryC, auxiliary, residualDof = 1) {
    const aDigits = sortedUnique(auxiliary.flatMap(entry =>
      bridgeDigits(entry.aBridges || [])));
    const cDigits = sortedUnique(auxiliary.flatMap(entry =>
      bridgeDigits(entry.cBridges || [])));
    return {
      aDigits,
      cDigits,
      requiredA: Math.max(0, primaryA.dof - residualDof),
      requiredC: Math.max(0, primaryC.dof - residualDof),
      valid: aDigits.length >= Math.max(0, primaryA.dof - residualDof)
        && cDigits.length >= Math.max(0, primaryC.dof - residualDof),
    };
  }

  function peersEverywhere(cell, sourceCells) {
    return sourceCells.length > 0
      && sourceCells.every(source => core.peersOf(source).includes(cell));
  }

  // A hub net is closed when two of its auxiliary Z occurrences are linked
  // to each other. The ordinary hub elimination remains the same; this flag
  // only identifies the ring form for notation, display, and rating.
  function hasHubRingClosure(cand, auxiliary, digit) {
    if (auxiliary.length < 2) return false;
    for (let leftIndex = 0; leftIndex < auxiliary.length; leftIndex += 1) {
      const leftCells = (auxiliary[leftIndex].node.cells || [])
        .filter(cell => (cand[cell] || []).includes(digit));
      if (!leftCells.length) continue;
      for (let rightIndex = leftIndex + 1; rightIndex < auxiliary.length; rightIndex += 1) {
        const rightCells = (auxiliary[rightIndex].node.cells || [])
          .filter(cell => (cand[cell] || []).includes(digit));
        if (cellsSeeEachOther(leftCells, rightCells)) return true;
      }
    }
    return false;
  }

  // A shared collection RCC is present in the hub and every auxiliary ALS,
  // with all of its occurrences mutually seeing one another. It contributes
  // one RCC to every auxiliary requirement, but belongs to the collection
  // rather than to any single auxiliary notation entry.
  function collectionRccDigits(cand, hub, auxiliary) {
    if (auxiliary.length < 2) return [];
    const common = hub.digits.filter(digit => auxiliary.every(entry =>
      entry.node.digits.includes(digit)));
    return common.filter(digit => {
      const hubCells = (hub.cells || []).filter(cell =>
        (cand[cell] || []).includes(digit));
      if (!hubCells.length) return false;
      return auxiliary.every((entry, entryIndex) => {
        const auxCells = (entry.node.cells || []).filter(cell =>
          (cand[cell] || []).includes(digit));
        return cellsSeeEachOther(hubCells, auxCells)
          && auxiliary.every((other, otherIndex) => {
            if (otherIndex === entryIndex) return true;
            const otherCells = (other.node.cells || []).filter(cell =>
              (cand[cell] || []).includes(digit));
            return cellsSeeEachOther(auxCells, otherCells);
          });
      });
    }).sort((left, right) => left - right);
  }

  function groupedRccDigits(cand, hub, node) {
    return hub.digits.filter(digit => {
      const hubCells = (hub.cells || []).filter(cell =>
        (cand[cell] || []).includes(digit));
      const nodeCells = (node.cells || []).filter(cell =>
        (cand[cell] || []).includes(digit));
      return cellsSeeEachOther(hubCells, nodeCells);
    }).sort((left, right) => left - right);
  }

  // Higher-DOF collections may use a grouped RCC: every occurrence of the
  // shared digit in the two ALSs is mutually constrained, even when the
  // digit appears in more than one cell of the auxiliary ALS. This is a
  // collection-level bridge, not a standard ALS-XZ RCC, so keep it confined
  // to the DDS/net search.
  function groupedRccBridges(cand, hub, node) {
    return groupedRccDigits(cand, hub, node).map(digit => ({
      digit,
      leftCells: (hub.cells || []).filter(cell =>
        (cand[cell] || []).includes(digit)),
      rightCells: (node.cells || []).filter(cell =>
        (cand[cell] || []).includes(digit)),
      grouped: true,
    }));
  }

  function chainRccBridges(cand, left, right) {
    const strict = restrictedCommons(left, right);
    const strictDigits = new Set(strict.map(bridge => bridge.digit));
    return [
      ...strict,
      ...groupedRccBridges(cand, left, right)
        .filter(bridge => !strictDigits.has(bridge.digit)),
    ];
  }

  function sameDigitSet(left, right) {
    const a = sortedUnique(left);
    const b = sortedUnique(right);
    return a.length === b.length && a.every((digit, index) => digit === b[index]);
  }

  function ringCoverageIsValid(cand, hub, auxiliary) {
    const shared = collectionRccDigits(cand, hub, auxiliary);
    if (!shared.length) return false;
    return auxiliary.every(entry => new Set([
      entry.bridge.digit,
      ...shared,
    ]).size >= hub.dof)
      && auxiliary.every(entry => entry.bridge.digit !== undefined);
  }

  // A chain result can also contain a complete hub ring.  The hub is the
  // endpoint whose DOF is supplied by the auxiliary collection; the other
  // endpoint is the bridge that carries the final common digit Z.  The ring
  // condition is structural and does not require the auxiliaries' Z cells to
  // be peers of one another.
  function endpointReduction(endpoint, auxiliary, bridgeKey, z) {
    const rccDigits = sortedUnique(auxiliary.flatMap(entry =>
      (entry[bridgeKey] || [])
        .map(bridge => bridge.digit)
        .filter(digit => digit !== z)));
    return {
      rccDigits,
      residualDof: Math.max(0, endpoint.dof - rccDigits.length),
    };
  }

  function chainHubRingInfo(primaryA, primaryC, auxiliary, z) {
    const endpoints = [
      { hub: primaryA, bridgeKey: 'aBridges' },
      { hub: primaryC, bridgeKey: 'cBridges' },
    ];

    for (const { hub, bridgeKey } of endpoints) {
      if (!hub || hub.dof < 2 || auxiliary.length !== hub.dof) continue;
      if (!Number.isInteger(z) || !hub.digits.includes(z)) continue;
      if (!auxiliary.every(entry => {
        const node = entry.node || entry;
        return node.dof > 0 && node.digits.includes(z);
      })) continue;

      const reduction = endpointReduction(hub, auxiliary, bridgeKey, z);
      if (reduction.residualDof !== 0) continue;

      const expected = sortedUnique(hub.digits.filter(digit => digit !== z));
      const supplied = reduction.rccDigits;
      if (expected.join(',') !== supplied.join(',')) continue;

      // Every auxiliary must contribute a non-Z bridge to the hub.  The
      // union check above permits shared RCCs, while this check prevents an
      // auxiliary from being present only because it contains Z.
      if (!auxiliary.every(entry => (entry[bridgeKey] || [])
        .some(bridge => bridge.digit !== z))) continue;

      return {
        hubId: hub.id,
        hubDigits: [...hub.digits],
        z,
        rccDigits: supplied,
        form: 'hub-auxiliary-closure',
      };
    }

    return null;
  }

  function eliminationRecords(cand, primaryA, primaryC, auxiliary, digit) {
    const nodes = [primaryA, primaryC, ...auxiliary.map(entry => entry.node)];
    const assignmentResults = nodes.map(node => cachedChainAssignments(cand, node));
    if (assignmentResults.some(item => item.truncated || !item.assignments.length)) {
      return [];
    }
    const nodeAssignments = assignmentResults.map(item => item.assignments);
    const excluded = new Set([
      ...primaryA.cells,
      ...primaryC.cells,
      ...auxiliary.flatMap(entry => entry.node.cells),
    ]);
    const records = [];

    for (let cell = 0; cell < 81; cell++) {
      if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;

      if (!ringCanPlaceTarget(nodeAssignments, nodes, cell, digit)) {
        records.push({
          cell,
          digit,
          reasons: ['A∩C'],
        });
      }
    }

    return records;
  }

  // A bridged ALS-DOF chain has two endpoint hubs and one intermediate hub:
  // A - S1 - C - S2 - B.  The auxiliary ALSs S1/S2 carry the RCCs on their
  // respective sides; the endpoint common digit is therefore eliminated
  // only from cells that see both endpoint occurrences.
  function pathEliminationRecords(cand, primaryA, primaryC, digit) {
    const leftCells = nodeCandidateCells(cand, primaryA, digit);
    const rightCells = nodeCandidateCells(cand, primaryC, digit);
    if (!leftCells.length || !rightCells.length) return [];

    const excluded = new Set([
      ...(primaryA.cells || []),
      ...(primaryC.cells || []),
    ]);
    const records = [];
    for (let cell = 0; cell < 81; cell += 1) {
      if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;
      if (peersEverywhere(cell, [...leftCells, ...rightCells])) {
        records.push({
          cell,
          digit,
          reasons: ['A∩B'],
        });
      }
    }
    return records;
  }

  // Hub form: a DOF-x hub is connected to x disjoint DOF-1 ALS nodes. Each
  // node supplies a different RCC with the hub and shares the common digit Z.
  // This is the ALS-DOF net/DDS form, not an endpoint-to-endpoint chain.
  function hubEliminationRecords(cand, hub, auxiliary, digit) {
    const excluded = new Set([
      ...hub.cells,
      ...auxiliary.flatMap(entry => entry.node.cells),
    ]);
    const sourceCells = [
      ...(rccForDigit(hub, digit)?.cells || []),
      ...auxiliary.flatMap(entry => rccForDigit(entry.node, digit)?.cells || []),
    ];
    const records = [];

    for (let cell = 0; cell < 81; cell++) {
      if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;
      if (!peersEverywhere(cell, sourceCells)) continue;
      records.push({
        cell,
        digit,
        reasons: ['HUB∩S'],
      });
    }

    return records;
  }

  function ringAssignments(cand, node, limit = 20000) {
    const cells = [...(node.cells || [])].sort((left, right) =>
      (cand[left] || []).length - (cand[right] || []).length);
    const assignments = [];
    const usedDigits = new Set();
    const current = [];
    let truncated = false;

    const visit = index => {
      if (assignments.length >= limit) {
        truncated = true;
        return;
      }
      if (index === cells.length) {
        assignments.push(current.map(item => ({ ...item })));
        return;
      }
      const cell = cells[index];
      for (const digit of cand[cell] || []) {
        if (usedDigits.has(digit)) continue;
        usedDigits.add(digit);
        current.push({ cell, digit });
        visit(index + 1);
        current.pop();
        usedDigits.delete(digit);
        if (truncated) return;
      }
    };

    visit(0);
    return { assignments, truncated };
  }

  function assignmentsCompatible(left, right) {
    return left.every(leftItem => right.every(rightItem =>
      leftItem.digit !== rightItem.digit
      || !core.peersOf(leftItem.cell).includes(rightItem.cell)));
  }

  function targetCompatible(assignment, cell, digit) {
    return assignment.every(item =>
      item.digit !== digit || !core.peersOf(cell).includes(item.cell));
  }

  function ringCanPlaceTarget(nodeAssignments, nodes, cell, digit) {
    const ownerIndex = nodes.findIndex(node => (node.cells || []).includes(cell));
    const selected = [];
    const visit = index => {
      if (index === nodeAssignments.length) return true;
      for (const assignment of nodeAssignments[index]) {
        if (index === ownerIndex) {
          if (!assignment.some(item => item.cell === cell && item.digit === digit)) continue;
        } else if (!targetCompatible(assignment, cell, digit)) {
          continue;
        }
        if (selected.some(previous => !assignmentsCompatible(previous, assignment))) continue;
        selected.push(assignment);
        if (visit(index + 1)) return true;
        selected.pop();
      }
      return false;
    };
    return visit(0);
  }

  // RCC counts alone do not prove that several restricted digits are
  // independent when they share the same ALS cell. Cache the finite
  // occupancy model so chain candidates can be checked without rebuilding it.
  const chainAssignmentCache = new WeakMap();

  function cachedChainAssignments(cand, node) {
    let byCandidateGrid = chainAssignmentCache.get(node);
    if (!byCandidateGrid) {
      byCandidateGrid = new WeakMap();
      chainAssignmentCache.set(node, byCandidateGrid);
    }
    const cached = byCandidateGrid.get(cand);
    if (cached) return cached;
    const assignments = ringAssignments(cand, node);
    byCandidateGrid.set(cand, assignments);
    return assignments;
  }

  // Closed rings lock every non-RCC value to its participating ALS. Evaluate
  // the whole ring as a constrained occupancy network so those locked values
  // produce their cumulative external eliminations, not only the common Z.
  function ringEliminationRecords(cand, hub, auxiliary, reason = 'RING occupancy') {
    const nodes = [hub, ...auxiliary.map(entry => entry.node)];
    const assignmentResults = nodes.map(node => ringAssignments(cand, node));
    if (assignmentResults.some(item => item.truncated || !item.assignments.length)) return [];
    const assignments = assignmentResults.map(item => item.assignments);

    const digits = sortedUnique(nodes.flatMap(node => node.digits || []));
    const records = [];
    for (const digit of digits) {
      for (let cell = 0; cell < 81; cell += 1) {
        if (!(cand[cell] || []).includes(digit)) continue;
        if (!ringCanPlaceTarget(assignments, nodes, cell, digit)) {
          const cannibalistic = nodes.some(node => (node.cells || []).includes(cell));
          records.push({
            cell,
            digit,
            reasons: [cannibalistic ? `${reason} cannibalistic` : reason],
            cannibalistic,
          });
        }
      }
    }
    return records;
  }

  function normaliseOptions(options = {}) {
    return {
      maxAuxiliary: Number.isInteger(options.maxAuxiliary)
        ? Math.max(1, Math.min(9, options.maxAuxiliary))
        : 3,
      maxDigits: Number.isInteger(options.maxDigits)
        ? Math.max(2, Math.min(9, options.maxDigits))
        : 6,
      maxResults: Number.isInteger(options.maxResults)
        ? Math.max(1, options.maxResults)
        : 5000,
      requireAuxiliaryZ: options.requireAuxiliaryZ === true,
      includeChain: options.includeChain === true,
      includePathChain: options.includePathChain === true,
      audit: options.audit === true,
    };
  }

  // The existing ALS constructor remains responsible for creating and
  // classifying ALS records. This search consumes that list and only finds
  // auxiliary A/C/S networks on top of it.
  function findAlsDofAuxiliary(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const alsList = source
      .filter(als => als.alsDOF > 0)
      .filter(als => (als.alsDigits || []).length >= 2)
      .filter(als => (als.alsDigits || []).length <= opts.maxDigits)
      .map(normaliseAls);
    const results = [];
    const auditCandidates = [];
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      endpointPairs: 0,
      commonDigits: 0,
      auxiliaryCandidates: 0,
      collections: 0,
      constructionCandidates: 0,
      zeroEliminationCandidates: 0,
      duplicateCandidates: 0,
      truncated: false,
    };

    outer:
    for (let leftIndex = 0; leftIndex < alsList.length; leftIndex++) {
      const primaryA = alsList[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < alsList.length; rightIndex++) {
        const primaryC = alsList[rightIndex];
        if (primaryA.digits.length !== primaryC.digits.length) continue;
        if (!disjoint(primaryA.cells, primaryC.cells)) continue;
        stats.endpointPairs += 1;

        const n = primaryA.digits.length;
        const commonZ = intersection(primaryA.digits, primaryC.digits);
        for (const digit of commonZ) {
          stats.commonDigits += 1;
          const auxiliaryCandidates = [];

          for (const node of alsList) {
            if (node.id === primaryA.id || node.id === primaryC.id) continue;
            if (!disjoint(primaryA.cells, node.cells) || !disjoint(primaryC.cells, node.cells)) continue;
            if (opts.requireAuxiliaryZ
              ? !node.digits.includes(digit)
              : node.digits.includes(digit)) continue;

            const aBridges = chainRccBridges(cand, primaryA, node);
            const cBridges = chainRccBridges(cand, primaryC, node);
            // Each connector ALS must link both ALS-DOF endpoints. A
            // collection-wide RCC union is not enough: an auxiliary with a
            // smaller RCC count than its own DOF has not been reduced to a
            // locked state and cannot transmit the endpoint constraint.
            if (!aBridges.length || !cBridges.length) continue;

            const rccDigits = union(bridgeDigits(aBridges), bridgeDigits(cBridges))
              .filter(value => value !== digit);
            if (rccDigits.length < node.dof) continue;
            auxiliaryCandidates.push({
              node,
              aBridges,
              cBridges,
              rccDigits,
            });
          }

          stats.auxiliaryCandidates += auxiliaryCandidates.length;
          if (!auxiliaryCandidates.length) continue;

          const visit = (start, selected, rccDigits) => {
            if (results.length >= opts.maxResults) {
              stats.truncated = true;
              return;
            }

            const coverageReady = opts.requireAuxiliaryZ
              ? rccDigits.length === n - 1
              : rccDigits.length > 0;
            const endpointCoverage = selected.length
              ? endpointBridgeCoverage(primaryA, primaryC, selected)
              : null;
            if (selected.length && coverageReady && endpointCoverage?.valid) {
              const primaryAReduction = endpointReduction(
                primaryA,
                selected,
                'aBridges',
                digit,
              );
              const primaryCReduction = endpointReduction(
                primaryC,
                selected,
                'cBridges',
                digit,
              );
              const reducedToOne = primaryAReduction.residualDof === 1
                && primaryCReduction.residualDof === 1;
              const ring = opts.requireAuxiliaryZ
                ? chainHubRingInfo(primaryA, primaryC, selected, digit)
                : null;
              if (!reducedToOne && !ring) return;

              const key = [
                primaryA.id,
                primaryC.id,
                digit,
                selected.map(entry => entry.node.id).join(','),
              ].join('|');
              if (!seen.has(key)) {
                seen.add(key);
                stats.constructionCandidates += 1;
                const eliminations = eliminationRecords(cand, primaryA, primaryC, selected, digit);
                const record = {
                  tech: 'als-dof',
                  name: ring ? 'ALS DOF Ring' : 'ALS DOF Chain',
                  type: 'ALS_DOF_CHAIN',
                  mode: 'chain',
                  chainForm: opts.requireAuxiliaryZ
                    ? 'shared-z-auxiliary'
                    : 'shared-auxiliary',
                  isRing: !!ring,
                  ...(ring ? {
                    ringForm: ring.form,
                    ringHubId: ring.hubId,
                    ringRccDigits: ring.rccDigits,
                  } : {}),
                  z: digit,
                  size: n,
                  primaryAResidualDof: primaryAReduction.residualDof,
                  primaryCResidualDof: primaryCReduction.residualDof,
                  primaryA,
                  primaryC,
                  auxiliary: selected.map(entry => ({
                    ...entry.node,
                    rccDigits: [...entry.rccDigits],
                    aBridges: entry.aBridges,
                    cBridges: entry.cBridges,
                  })),
                  rccDigits: [...rccDigits],
                  eliminations,
                  cells: eliminations.map(item => item.cell),
                };
                if (opts.audit) auditCandidates.push(record);
                if (eliminations.length) {
                  stats.collections += 1;
                  results.push(record);
                } else {
                  stats.zeroEliminationCandidates += 1;
                }
              } else {
                stats.duplicateCandidates += 1;
              }
              return;
            }

            if (selected.length >= opts.maxAuxiliary) return;

            for (let index = start; index < auxiliaryCandidates.length; index++) {
              const candidate = auxiliaryCandidates[index];
              if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
              const nextRccDigits = union(rccDigits, candidate.rccDigits);
              if (opts.requireAuxiliaryZ && nextRccDigits.length > n - 1) continue;
              visit(index + 1, [...selected, candidate], nextRccDigits);
              if (results.length >= opts.maxResults) return;
            }
          };

          visit(0, [], []);
          if (stats.truncated) break outer;
        }
      }
    }

    return { results, auditCandidates, stats, options: opts };
  }

  function findAlsDofAuxiliaryPaths(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const alsList = source
      .filter(als => als.alsDOF > 0)
      .filter(als => (als.alsDigits || []).length >= 2)
      .filter(als => (als.alsDigits || []).length <= opts.maxDigits)
      .map(normaliseAls);
    const endpoints = alsList.filter(als => als.dof >= 2);
    const results = [];
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      endpointPairs: 0,
      centralHubs: 0,
      linkCandidates: 0,
      auxiliarySignatureMatches: 0,
      paths: 0,
      truncated: false,
    };

    const addPath = (primaryA, leftAux, central, rightAux, primaryC,
      leftToAux, auxToCentral, centralToAux, auxToRight, digit) => {
      const pathNodes = [primaryA, leftAux, central, rightAux, primaryC];
      const occupied = new Set();
      for (const node of pathNodes) {
        for (const cell of node.cells) {
          if (occupied.has(cell)) return;
          occupied.add(cell);
        }
      }

      const links = [
        { left: primaryA.id, right: leftAux.id, bridges: leftToAux },
        { left: leftAux.id, right: central.id, bridges: auxToCentral },
        { left: central.id, right: rightAux.id, bridges: centralToAux },
        { left: rightAux.id, right: primaryC.id, bridges: auxToRight },
      ];
      const allRccDigits = sortedUnique(links.flatMap(link =>
        bridgeDigits(link.bridges).filter(value => value !== digit)));
      const key = [
        primaryA.id,
        leftAux.id,
        central.id,
        rightAux.id,
        primaryC.id,
        digit,
      ].join('|');
      if (seen.has(key)) return;
      seen.add(key);

      const auxiliary = [
        {
          ...leftAux,
          rccDigits: sortedUnique([
            ...bridgeDigits(leftToAux),
            ...bridgeDigits(auxToCentral),
          ].filter(value => value !== digit)),
          pathPrevBridges: leftToAux,
          pathNextBridges: auxToCentral,
        },
        {
          ...central,
          rccDigits: sortedUnique([
            ...bridgeDigits(auxToCentral),
            ...bridgeDigits(centralToAux),
          ].filter(value => value !== digit)),
          pathPrevBridges: auxToCentral,
          pathNextBridges: centralToAux,
        },
        {
          ...rightAux,
          rccDigits: sortedUnique([
            ...bridgeDigits(centralToAux),
            ...bridgeDigits(auxToRight),
          ].filter(value => value !== digit)),
          pathPrevBridges: centralToAux,
          pathNextBridges: auxToRight,
        },
      ];
      const eliminations = pathEliminationRecords(cand, primaryA, primaryC, digit);
      if (!eliminations.length) return;

      stats.paths += 1;
      results.push({
        tech: 'als-dof',
        name: 'ALS DOF Chain',
        type: 'ALS_DOF_CHAIN',
        mode: 'chain',
        chainForm: 'auxiliary-hub-path',
        isRing: false,
        z: digit,
        size: primaryA.digits.length,
        primaryAResidualDof: Math.max(0,
          primaryA.dof - bridgeDigits(leftToAux).filter(value => value !== digit).length),
        primaryCResidualDof: Math.max(0,
          primaryC.dof - bridgeDigits(auxToRight).filter(value => value !== digit).length),
        primaryA,
        primaryC,
        auxiliary,
        pathLinks: links,
        rccDigits: allRccDigits,
        eliminations,
        cells: eliminations.map(item => item.cell),
      });
    };

    outer:
    for (let leftIndex = 0; leftIndex < endpoints.length; leftIndex += 1) {
      const primaryA = endpoints[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < endpoints.length; rightIndex += 1) {
        const primaryC = endpoints[rightIndex];
        if (primaryA.digits.length !== primaryC.digits.length) continue;
        if (!disjoint(primaryA.cells, primaryC.cells)) continue;
        const commonZ = intersection(primaryA.digits, primaryC.digits);
        if (!commonZ.length) continue;
        stats.endpointPairs += 1;

        for (const digit of commonZ) {
          const centralHubs = alsList.filter(central =>
            central.id !== primaryA.id
            && central.id !== primaryC.id
            && !central.digits.includes(digit)
            && disjoint(primaryA.cells, central.cells)
            && disjoint(primaryC.cells, central.cells));
          stats.centralHubs += centralHubs.length;

          for (const central of centralHubs) {
            const leftLinks = [];
            const rightLinks = [];
            for (const node of alsList) {
              if (node.id === primaryA.id || node.id === primaryC.id || node.id === central.id) continue;
              if (node.digits.includes(digit)) continue;
              if (!disjoint(node.cells, primaryA.cells)
                || !disjoint(node.cells, primaryC.cells)
                || !disjoint(node.cells, central.cells)) continue;

              const leftToAux = chainRccBridges(cand, primaryA, node);
              const auxToCentral = chainRccBridges(cand, node, central);
              if (leftToAux.length && auxToCentral.length
                && bridgeDigits(leftToAux).length >= Math.max(primaryA.dof, node.dof)) {
                leftLinks.push({ node, leftToAux, auxToCentral });
              }

              const centralToAux = chainRccBridges(cand, central, node);
              const auxToRight = chainRccBridges(cand, node, primaryC);
              if (centralToAux.length && auxToRight.length
                && bridgeDigits(auxToRight).length >= Math.max(primaryC.dof, node.dof)) {
                rightLinks.push({ node, centralToAux, auxToRight });
              }
            }
            stats.linkCandidates += leftLinks.length + rightLinks.length;
            const rightBySignature = new Map();
            for (const right of rightLinks) {
              const signature = alsShapeSignature(right.node);
              const entries = rightBySignature.get(signature) || [];
              entries.push(right);
              rightBySignature.set(signature, entries);
            }
            for (const left of leftLinks) {
              const matchingRights = rightBySignature.get(alsShapeSignature(left.node)) || [];
              stats.auxiliarySignatureMatches += matchingRights.length;
              for (const right of matchingRights) {
                if (left.node.id === right.node.id) continue;
                if (!disjoint(left.node.cells, right.node.cells)) continue;
                addPath(
                  primaryA,
                  left.node,
                  central,
                  right.node,
                  primaryC,
                  left.leftToAux,
                  left.auxToCentral,
                  right.centralToAux,
                  right.auxToRight,
                  digit,
                );
                if (results.length >= opts.maxResults) {
                  stats.truncated = true;
                  break outer;
                }
              }
            }
          }
        }
      }
    }

    return { results, stats, options: opts };
  }

  function findAlsDofChains(cand, options = {}) {
    const maxResults = options.maxResults || 5000;
    const chainLimit = Math.max(1, Math.floor(maxResults / 2));
    // The current chain evaluator is deliberately limited to the two ALS
    // endpoints plus their auxiliary collection. The deeper A-S-C-S-B path
    // remains available as a separate experimental finder, but is not part
    // of this evaluated chain mode until its proof and verifier are settled.
    const includePathChain = options.includePathChain === true;
    const chainAuxiliaryCount = 1;
    const chain = findAlsDofAuxiliary(cand, {
      ...options,
      requireAuxiliaryZ: true,
      maxAuxiliary: chainAuxiliaryCount,
      audit: options.audit === true,
      maxResults: chainLimit,
    });
    const connectorChain = findAlsDofAuxiliary(cand, {
      ...options,
      requireAuxiliaryZ: false,
      maxAuxiliary: chainAuxiliaryCount,
      audit: options.audit === true,
      maxResults: chainLimit,
    });
    const pathChain = includePathChain
      ? findAlsDofAuxiliaryPaths(cand, {
          ...options,
          maxResults: chainLimit,
        })
      : {
          results: [],
          stats: {
            alsRecords: Math.max(chain.stats.alsRecords, connectorChain.stats.alsRecords),
            endpointPairs: 0,
            centralHubs: 0,
            linkCandidates: 0,
            auxiliarySignatureMatches: 0,
            paths: 0,
            disabled: true,
            truncated: false,
          },
        };
    const results = [
      ...chain.results,
      ...connectorChain.results,
      ...pathChain.results,
    ].slice(0, maxResults);
    const auditCandidates = [
      ...(chain.auditCandidates || []),
      ...(connectorChain.auditCandidates || []),
    ];
    return {
      results,
      stats: {
        alsRecords: Math.max(
          chain.stats.alsRecords,
          connectorChain.stats.alsRecords,
          pathChain.stats.alsRecords,
        ),
        chainNets: results.length,
        chainCandidates: chain.results.length
          + connectorChain.results.length
          + pathChain.results.length,
        auditCandidates: auditCandidates.length,
        constructionCandidates: chain.stats.constructionCandidates
          + connectorChain.stats.constructionCandidates,
        zeroEliminationCandidates: chain.stats.zeroEliminationCandidates
          + connectorChain.stats.zeroEliminationCandidates,
        duplicateCandidates: chain.stats.duplicateCandidates
          + connectorChain.stats.duplicateCandidates,
        pathChainsEnabled: includePathChain,
        pathChains: pathChain.results.length,
        chainAuxiliaryCount,
        truncated: chain.stats.truncated
          || connectorChain.stats.truncated
          || pathChain.stats.truncated
          || chain.results.length + connectorChain.results.length
            + pathChain.results.length > maxResults,
      },
      auditCandidates,
      options: {
        ...chain.options,
        includePathChain,
        maxAuxiliary: chainAuxiliaryCount,
        audit: options.audit === true,
      },
    };
  }

  function findAlsDofHubNets(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const alsList = source
      .filter(als => (als.alsDigits || []).length >= 2)
      .filter(als => (als.alsDigits || []).length <= opts.maxDigits)
      .map(normaliseAls);
    const hubs = alsList.filter(als => als.dof >= 2);
    const auxiliaries = alsList.filter(als => als.dof === 1);
    const results = [];
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      hubs: 0,
      commonDigits: 0,
      auxiliaryCandidates: 0,
      collections: 0,
      truncated: false,
    };

    for (const hub of hubs) {
      stats.hubs += 1;
      const freedom = hub.dof;

      // A single DOF-1 auxiliary may carry multiple grouped RCCs. For a
      // DOF-2 hub, two RCCs service the hub and a third RCC shared across the
      // auxiliary cells closes the ring and supplies the first-type Z
      // elimination. This is distinct from the two-auxiliary ring below.
      for (const node of auxiliaries) {
        if (!disjoint(hub.cells, node.cells)) continue;
        const grouped = groupedRccDigits(cand, hub, node);
        if (grouped.length < freedom + 1) continue;
        for (const z of grouped) {
          const zCells = node.cells.filter(cell =>
            (cand[cell] || []).includes(z));
          const uniqueRcc = grouped.filter(digit => digit !== z);
          if (zCells.length < 2 || uniqueRcc.length < freedom) continue;

          const auxiliaryEntry = {
            ...node,
            rccDigit: z,
            rccDigits: [...grouped],
          };
          const entries = [{ node: auxiliaryEntry }];
          const collectionLocked = sameDigitSet(grouped, hub.digits);
          const hubLocked = grouped.length > freedom;
          const eliminations = hubLocked || collectionLocked
            ? ringEliminationRecords(cand, hub, entries)
            : hubEliminationRecords(cand, hub, entries, z);
          if (!eliminations.length) continue;
          const key = `${hub.id}|single-ring|${node.id}|${z}`;
          if (seen.has(key)) continue;
          seen.add(key);
          stats.collections += 1;
          results.push({
            tech: 'als-dof',
            name: 'ALS DOF Ring',
            type: 'ALS_DOF_NET',
            mode: 'hub',
            isRing: true,
            ringForm: 'single-auxiliary',
            lockScope: collectionLocked ? 'collection' : hubLocked ? 'hub' : 'z',
            z,
            size: freedom,
            primaryA: hub,
            primaryC: null,
            auxiliary: [auxiliaryEntry],
            rccDigits: [...grouped],
            collectionRccDigits: [z],
            eliminations,
            cells: eliminations.map(item => item.cell),
          });
          if (results.length >= opts.maxResults) {
            stats.truncated = true;
            return { results, stats, options: opts };
          }
        }
      }

      // Fluid form: fewer auxiliary ALSs than the hub DOF are allowed when
      // every participating ALS supplies the full hub-DOF worth of unique
      // RCCs, plus the shared Z that locks the collection. Unique RCC sets
      // may not be reused between auxiliary ALSs.
      if (freedom > 2) {
        for (const z of hub.digits) {
          const candidates = auxiliaries
            .filter(node => node.digits.includes(z) && disjoint(hub.cells, node.cells))
            .map(node => {
              const grouped = groupedRccDigits(cand, hub, node);
              return {
                node,
                grouped,
                uniqueRcc: grouped.filter(digit => digit !== z),
              };
            })
            .filter(entry => entry.grouped.includes(z)
              && entry.uniqueRcc.length >= freedom);

          for (let collectionSize = 2;
            collectionSize < freedom && collectionSize <= opts.maxAuxiliary;
            collectionSize += 1) {
            const selected = [];
            const usedUniqueRcc = new Set();
            const visitFluid = start => {
              if (results.length >= opts.maxResults) {
                stats.truncated = true;
                return;
              }
              if (selected.length === collectionSize) {
                const auxiliaryEntries = selected.map(entry => ({
                  node: entry.node,
                  bridge: { digit: z },
                }));
                const rccUnion = sortedUnique(selected.flatMap(entry => entry.grouped));
                const collectionLocked = sameDigitSet(rccUnion, hub.digits);
                const hubLocked = rccUnion.length > freedom;
                const eliminations = hubLocked || collectionLocked
                  ? ringEliminationRecords(cand, hub, auxiliaryEntries)
                  : hubEliminationRecords(cand, hub, auxiliaryEntries, z);
                if (!eliminations.length) return;
                const key = [
                  hub.id,
                  'fluid-ring',
                  z,
                  selected.map(entry => entry.node.id).join(','),
                ].join('|');
                if (seen.has(key)) return;
                seen.add(key);
                stats.collections += 1;
                results.push({
                  tech: 'als-dof',
                  name: 'ALS DOF Ring',
                  type: 'ALS_DOF_NET',
                  mode: 'hub',
                  isRing: true,
                  ringForm: 'fluid-auxiliary',
                  lockScope: collectionLocked ? 'collection' : hubLocked ? 'hub' : 'z',
                  z,
                  size: freedom,
                  primaryA: hub,
                  primaryC: null,
                  auxiliary: selected.map(entry => ({
                    ...entry.node,
                    rccDigit: z,
                    rccDigits: [...entry.grouped],
                  })),
                  rccDigits: rccUnion,
                  collectionRccDigits: [z],
                  eliminations,
                  cells: eliminations.map(item => item.cell),
                });
                return;
              }

              for (let index = start; index < candidates.length; index += 1) {
                const candidate = candidates[index];
                if (selected.some(entry =>
                  !disjoint(entry.node.cells, candidate.node.cells))) continue;
                if (candidate.uniqueRcc.some(digit => usedUniqueRcc.has(digit))) continue;
                selected.push(candidate);
                for (const digit of candidate.uniqueRcc) usedUniqueRcc.add(digit);
                visitFluid(index + 1);
                for (const digit of candidate.uniqueRcc) usedUniqueRcc.delete(digit);
                selected.pop();
                if (stats.truncated) return;
              }
            };

            visitFluid(0);
            if (stats.truncated) return { results, stats, options: opts };
          }
        }
      }

      for (const digit of hub.digits) {
        stats.commonDigits += 1;
        const candidates = [];

        for (const node of auxiliaries) {
          if (node.id === hub.id) continue;
          if (!node.digits.includes(digit) || !disjoint(hub.cells, node.cells)) continue;

          const bridges = restrictedCommons(hub, node)
            .filter(bridge => bridge.digit !== digit);
          for (const bridge of bridges) candidates.push({ node, bridge });
        }
        stats.auxiliaryCandidates += candidates.length;
        if (candidates.length < freedom) continue;

        const selected = [];
        const usedRcc = new Set();
        const visit = (start) => {
          if (results.length >= opts.maxResults) {
            stats.truncated = true;
            return;
          }
          if (selected.length === freedom) {
            const key = [
              hub.id,
              digit,
              selected.map(entry => `${entry.node.id}:${entry.bridge.digit}`).join(','),
            ].join('|');
            if (seen.has(key)) return;
            seen.add(key);
            const collectionRcc = collectionRccDigits(cand, hub, selected);
            const isRing = hasHubRingClosure(cand, selected, digit)
              && ringCoverageIsValid(cand, hub, selected);
            const eliminations = isRing
              ? ringEliminationRecords(cand, hub, selected)
              : hubEliminationRecords(cand, hub, selected, digit);
            if (!eliminations.length) return;
            stats.collections += 1;
            results.push({
              tech: 'als-dof',
              name: isRing ? 'ALS DOF Ring' : 'ALS DOF',
              type: 'ALS_DOF_NET',
              mode: 'hub',
              isRing,
              collectionRccDigits: collectionRcc,
              z: digit,
              size: freedom,
              primaryA: hub,
              primaryC: null,
              auxiliary: selected.map(entry => ({
                ...entry.node,
                rccDigit: entry.bridge.digit,
                aBridges: [entry.bridge],
              })),
              rccDigits: selected.map(entry => entry.bridge.digit).sort((a, b) => a - b),
              eliminations,
              cells: eliminations.map(item => item.cell),
            });
            return;
          }

          for (let index = start; index < candidates.length; index += 1) {
            const candidate = candidates[index];
            if (usedRcc.has(candidate.bridge.digit)) continue;
            if (selected.some(entry =>
              !disjoint(entry.node.cells, candidate.node.cells))) continue;
            usedRcc.add(candidate.bridge.digit);
            selected.push(candidate);
            visit(index + 1);
            selected.pop();
            usedRcc.delete(candidate.bridge.digit);
            if (stats.truncated) return;
          }
        };

        visit(0);
        if (stats.truncated) return { results, stats, options: opts };
      }
    }

    return { results, stats, options: opts };
  }

  function ddsEliminationRecords(cand, hub, auxiliary) {
    // A single RCC does not eliminate its own digit. It supplies a
    // restriction for a second shared digit, as in ALS-XZ. Auxiliary-only
    // digits are not locked merely because one selected ALS contains them.
    // Those sound cases are collected by cumulative internal ALS-XZ below.
    return [];
  }

  // An outer DOF net may contain an independent ALS-XZ between two of its
  // DOF-1 auxiliary ALSs. Its eliminations are cumulative, even when the
  // target cell belongs to one of the outer auxiliary ALSs.
  function internalAlsXzEliminationRecords(cand, auxiliary, alsPool = null) {
    const records = new Map();
    const addRecord = (cell, digit, proof) => {
      const key = `${cell}:${digit}`;
      const record = records.get(key) || {
        cell,
        digit,
        reasons: [],
        internalized: true,
      };
      for (const reason of proof.reasons) {
        if (!record.reasons.includes(reason)) record.reasons.push(reason);
      }
      record.internalAlsXz = proof.internalAlsXz;
      records.set(key, record);
    };

    const outerNodes = auxiliary.map(entry => entry.node || entry);
    const outerCells = new Set(outerNodes.flatMap(node => node.cells || []));
    const pool = alsPool?.length ? alsPool : outerNodes;
    const nodes = [];
    const seenNodes = new Set();
    for (const node of pool) {
      if (node.dof !== 1 || !(node.cells || []).length) continue;
      if (!(node.cells || []).every(cell => outerCells.has(cell))) continue;
      const key = `${node.id}|${node.cells.join(',')}|${node.digits.join('')}`;
      if (seenNodes.has(key)) continue;
      seenNodes.add(key);
      nodes.push(node);
    }
    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex++) {
      const left = nodes[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex++) {
        const right = nodes[rightIndex];
        if (!disjoint(left.cells, right.cells)) continue;
        const sharedDigits = intersection(left.digits, right.digits);
        for (const x of sharedDigits) {
          const leftX = rccForDigit(left, x)?.cells || [];
          const rightX = rccForDigit(right, x)?.cells || [];
          if (!cellsSeeEachOther(leftX, rightX)) continue;

          for (const y of sharedDigits) {
            if (y === x) continue;
            const leftY = rccForDigit(left, y)?.cells || [];
            const rightY = rccForDigit(right, y)?.cells || [];
            if (!leftY.length || !rightY.length) continue;
            const intrinsic = intersection(
              peerPotentialEliminations(cand, y, leftY),
              peerPotentialEliminations(cand, y, rightY),
            );
            for (const cell of intrinsic) {
              addRecord(cell, y, {
                reasons: ['ALS-XZ'],
                internalAlsXz: {
                  leftId: left.id,
                  rightId: right.id,
                  leftNode: left,
                  rightNode: right,
                  restrictedDigit: x,
                  eliminatedDigit: y,
                },
              });
            }
          }
        }
      }
    }

    return [...records.values()].sort((left, right) =>
      left.cell - right.cell || left.digit - right.digit);
  }

  function cumulativeDdsEliminationRecords(cand, hub, auxiliary, alsPool = null) {
    const direct = ringEliminationRecords(cand, hub, auxiliary, 'DDS occupancy');
    const internal = internalAlsXzEliminationRecords(cand, auxiliary, alsPool);
    const records = new Map();
    for (const item of [...direct, ...internal]) {
      const key = `${item.cell}:${item.digit}`;
      const record = records.get(key) || {
        cell: item.cell,
        digit: item.digit,
        reasons: [],
      };
      for (const reason of item.reasons || []) {
        if (!record.reasons.includes(reason)) record.reasons.push(reason);
      }
      if (item.internalized) record.internalized = true;
      if (item.internalAlsXz) record.internalAlsXz = item.internalAlsXz;
      records.set(key, record);
    }
    return [...records.values()].sort((left, right) =>
      left.cell - right.cell || left.digit - right.digit);
  }

  function auxiliaryRccDigits(entry) {
    return sortedUnique([
      ...(entry.bridges || []).map(bridge => bridge.digit),
      ...(entry.aBridges || []).map(bridge => bridge.digit),
      ...(entry.rccDigits || []),
    ].filter(digit => Number.isInteger(digit)));
  }

  // A compact higher-DOF collection can use fewer auxiliary ALSs than the
  // hub DOF when every selected auxiliary supplies a full DOF-sized grouped
  // RCC set. Digits common to every auxiliary are then locked to the whole
  // collection and may be removed from candidates seeing all their copies.
  function ddsCollectionCommonEliminationRecords(cand, hub, auxiliary) {
    if (!auxiliary.length) return [];
    const shared = auxiliary.reduce(
      (digits, entry) => intersection(digits, auxiliaryRccDigits(entry)),
      [...hub.digits],
    );
    const excluded = new Set([
      ...hub.cells,
      ...auxiliary.flatMap(entry => entry.node?.cells || entry.cells || []),
    ]);
    const records = [];

    for (const digit of shared) {
      const sourceCells = [hub, ...auxiliary.map(entry => entry.node || entry)]
        .flatMap(node => nodeCandidateCells(cand, node, digit));
      if (!sourceCells.length) continue;
      for (let cell = 0; cell < 81; cell += 1) {
        if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;
        if (!peersEverywhere(cell, sourceCells)) continue;
        records.push({
          cell,
          digit,
          reasons: ['DDS collection-common RCC'],
        });
      }
    }

    return records.sort((left, right) =>
      left.cell - right.cell || left.digit - right.digit);
  }

  function compactDdsEliminationRecords(cand, hub, auxiliary, alsPool = null) {
    const direct = ddsCollectionCommonEliminationRecords(cand, hub, auxiliary);
    const internal = internalAlsXzEliminationRecords(cand, auxiliary, alsPool);
    const records = new Map();
    for (const item of [...direct, ...internal]) {
      const key = `${item.cell}:${item.digit}`;
      const record = records.get(key) || {
        cell: item.cell,
        digit: item.digit,
        reasons: [],
      };
      for (const reason of item.reasons || []) {
        if (!record.reasons.includes(reason)) record.reasons.push(reason);
      }
      if (item.internalized) record.internalized = true;
      if (item.internalAlsXz) record.internalAlsXz = item.internalAlsXz;
      records.set(key, record);
    }
    return [...records.values()].sort((left, right) =>
      left.cell - right.cell || left.digit - right.digit);
  }

  function alsDofAuxiliaryCandidates(cand, hub, auxiliaries) {
    return auxiliaries.flatMap(node => {
      if (!disjoint(hub.cells, node.cells)) return [];
      const strictBridges = restrictedCommons(hub, node)
        .filter(bridge => hub.digits.includes(bridge.digit));
      const strictDigits = new Set(strictBridges.map(bridge => bridge.digit));
      const bridges = [
        ...strictBridges,
        ...groupedRccBridges(cand, hub, node)
          .filter(bridge => !strictDigits.has(bridge.digit)),
      ];
      return bridges.length ? [{ node, bridges }] : [];
    });
  }

  function findAlsDofDdsNets(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const alsList = source
      .filter(als => (als.alsDigits || []).length >= 2)
      .filter(als => (als.alsDigits || []).length <= opts.maxDigits)
      .map(normaliseAls);
    const hubs = alsList.filter(als => als.dof >= 2);
    const auxiliaries = alsList.filter(als => als.dof === 1);
    const results = [];
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      hubs: 0,
      auxiliaryCandidates: 0,
      collections: 0,
      truncated: false,
    };

    for (const hub of hubs) {
      if (hub.dof > opts.maxAuxiliary) continue;
      stats.hubs += 1;
      const candidates = alsDofAuxiliaryCandidates(cand, hub, auxiliaries);
      stats.auxiliaryCandidates += candidates.length;
      if (!candidates.length) continue;

      const selected = [];
      const covered = new Set();
      const visit = (start) => {
        if (results.length >= opts.maxResults) {
          stats.truncated = true;
          return;
        }
        if (selected.length === hub.dof) {
          if (covered.size !== hub.digits.length
            || hub.digits.some(digit => !covered.has(digit))) return;
          const key = [
            hub.id,
            selected.map(entry => `${entry.node.id}:${entry.bridges.map(bridge => bridge.digit).join(',')}`).join('|'),
          ].join('||');
          if (seen.has(key)) return;
          seen.add(key);
          const eliminations = cumulativeDdsEliminationRecords(cand, hub, selected, alsList);
          if (!eliminations.length) return;
          stats.collections += 1;
          const isRing = selected.length === hub.dof
            && sameDigitSet(covered, hub.digits);
          results.push({
            tech: 'als-dof',
            name: isRing
              ? 'Disjointed Distributed Subset Ring'
              : 'Disjointed Distributed Subset',
            type: 'ALS_DOF_DDS',
            mode: 'dds',
            isRing,
            ringForm: isRing ? 'collection' : 'dds',
            lockScope: isRing ? 'collection' : null,
            z: null,
            size: hub.dof,
            primaryA: hub,
            primaryC: null,
            auxiliary: selected.map(entry => ({
              ...entry.node,
              rccDigits: entry.bridges.map(bridge => bridge.digit).sort((a, b) => a - b),
              aBridges: entry.bridges,
            })),
            rccDigits: [...covered].sort((a, b) => a - b),
            eliminations,
            cells: eliminations.map(item => item.cell),
          });
          return;
        }

        for (let index = start; index < candidates.length; index += 1) {
          const candidate = candidates[index];
          if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
          const nextDigits = candidate.bridges
            .map(bridge => bridge.digit)
            .filter(digit => !covered.has(digit));
          if (!nextDigits.length) continue;
          for (const digit of nextDigits) covered.add(digit);
          selected.push(candidate);
          visit(index + 1);
          selected.pop();
          for (const digit of nextDigits) covered.delete(digit);
          if (stats.truncated) return;
        }
      };

      visit(0);
      if (stats.truncated) break;

      // Compact DDS ring: fewer auxiliaries are allowed when each selected
      // auxiliary supplies at least hub.dof grouped RCC digits and the
      // collection still covers every hub digit. The common bridge digits
      // are the collection-locked values used for external eliminations.
      const compactCandidates = candidates.filter(entry =>
        entry.bridges.length >= hub.dof);
      const visitCompact = (start, selected, covered, shared) => {
        if (results.length >= opts.maxResults) {
          stats.truncated = true;
          return;
        }

        if (selected.length > 0
          && selected.length < hub.dof
          && hub.digits.every(digit => covered.has(digit))
          && shared.length > 0) {
          const key = [
            hub.id,
            'compact',
            selected.map(entry => `${entry.node.id}:${entry.bridges.map(bridge => bridge.digit).join(',')}`).join('|'),
          ].join('||');
          if (!seen.has(key)) {
            seen.add(key);
            const eliminations = compactDdsEliminationRecords(cand, hub, selected, alsList);
            if (eliminations.length) {
              stats.collections += 1;
              results.push({
                tech: 'als-dof',
                name: 'Disjointed Distributed Subset Ring',
                type: 'ALS_DOF_DDS',
                mode: 'dds',
                isRing: true,
                ringForm: 'compact-collection',
                lockScope: 'collection',
                z: null,
                size: hub.dof,
                primaryA: hub,
                primaryC: null,
                auxiliary: selected.map(entry => ({
                  ...entry.node,
                  rccDigits: entry.bridges.map(bridge => bridge.digit).sort((a, b) => a - b),
                  aBridges: entry.bridges,
                })),
                rccDigits: [...covered].sort((a, b) => a - b),
                collectionRccDigits: [...shared],
                eliminations,
                cells: eliminations.map(item => item.cell),
              });
            }
          }
        }

        if (selected.length >= Math.min(opts.maxAuxiliary, hub.dof - 1)) return;
        for (let index = start; index < compactCandidates.length; index += 1) {
          const candidate = compactCandidates[index];
          if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
          const nextCovered = new Set(covered);
          for (const bridge of candidate.bridges) nextCovered.add(bridge.digit);
          if ([...nextCovered].some(digit => !hub.digits.includes(digit))) continue;
          const candidateDigits = candidate.bridges.map(bridge => bridge.digit);
          const nextShared = selected.length
            ? intersection(shared, candidateDigits)
            : sortedUnique(candidateDigits);
          selected.push(candidate);
          visitCompact(index + 1, selected, nextCovered, nextShared);
          selected.pop();
          if (stats.truncated) return;
        }
      };

      if (compactCandidates.length) visitCompact(0, [], new Set(), []);
      if (stats.truncated) break;
    }

    return { results, stats, options: opts };
  }

  // Almost DDS is the one-auxiliary-over form of a higher-DOF collection.
  // The extra auxiliary supplies the final RCC worth of coverage; once the
  // union exactly covers the hub digits, the complete collection is evaluated
  // with the closed-occupancy rule used for rings.
  function findAlsDofAlmostDdsNets(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const alsList = source
      .filter(als => (als.alsDigits || []).length >= 2)
      .filter(als => (als.alsDigits || []).length <= opts.maxDigits)
      .map(normaliseAls);
    const hubs = alsList.filter(als => als.dof >= 2);
    const auxiliaries = alsList.filter(als => als.dof === 1);
    const results = [];
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      hubs: 0,
      auxiliaryCandidates: 0,
      collections: 0,
      truncated: false,
    };

    for (const hub of hubs) {
      const requiredAuxiliaries = hub.dof + 1;
      if (requiredAuxiliaries > opts.maxAuxiliary) continue;
      stats.hubs += 1;
      const candidates = alsDofAuxiliaryCandidates(cand, hub, auxiliaries);
      stats.auxiliaryCandidates += candidates.length;
      if (candidates.length < requiredAuxiliaries) continue;

      const selected = [];
      const covered = new Set();
      const visit = (start) => {
        if (results.length >= opts.maxResults) {
          stats.truncated = true;
          return;
        }
        if (selected.length === requiredAuxiliaries) {
          if (!sameDigitSet(covered, hub.digits)) return;
          const key = [
            hub.id,
            selected.map(entry => `${entry.node.id}:${entry.bridges.map(bridge => bridge.digit).join(',')}`).join('|'),
          ].join('||');
          if (seen.has(key)) return;
          seen.add(key);

          const eliminations = cumulativeDdsEliminationRecords(cand, hub, selected, alsList);
          if (!eliminations.length) return;
          stats.collections += 1;
          results.push({
            tech: 'als-dof',
            name: 'Almost Disjointed Distributed Subset',
            type: 'ALS_DOF_ALMOST_DDS',
            mode: 'almost-dds',
            isRing: true,
            ringForm: 'almost-dds',
            lockScope: 'collection',
            z: null,
            size: hub.dof,
            primaryA: hub,
            primaryC: null,
            auxiliary: selected.map(entry => ({
              ...entry.node,
              rccDigits: entry.bridges.map(bridge => bridge.digit).sort((a, b) => a - b),
              aBridges: entry.bridges,
            })),
            rccDigits: [...covered].sort((a, b) => a - b),
            collectionRccDigits: [...covered].sort((a, b) => a - b),
            eliminations,
            cells: eliminations.map(item => item.cell),
          });
          return;
        }

        for (let index = start; index < candidates.length; index += 1) {
          const candidate = candidates[index];
          if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
          const nextDigits = candidate.bridges
            .map(bridge => bridge.digit)
            .filter(digit => !covered.has(digit));
          if (!nextDigits.length) continue;
          for (const digit of nextDigits) covered.add(digit);
          selected.push(candidate);
          visit(index + 1);
          selected.pop();
          for (const digit of nextDigits) covered.delete(digit);
          if (stats.truncated) return;
        }
      };

      visit(0);
      if (stats.truncated) break;
    }

    return { results, stats, options: opts };
  }

  function findAlsDofNets(cand, options = {}) {
    const maxResults = options.maxResults || 5000;
    // The endpoint/auxiliary chain remains available, but is opt-in until
    // its updated rules are ready for the normal ALS-DOF report.
    const chainLimit = Math.max(1, Math.floor(maxResults / 2));
    const chain = options.includeChain === true ? findAlsDofAuxiliary(cand, {
      ...options,
      alsList: options.alsList || undefined,
      requireAuxiliaryZ: true,
      maxResults: chainLimit,
    }) : { results: [], stats: { alsRecords: options.alsList?.length || 0, truncated: false } };
    const connectorChain = options.includeChain === true ? findAlsDofAuxiliary(cand, {
      ...options,
      alsList: options.alsList || undefined,
      requireAuxiliaryZ: false,
      maxResults: chainLimit,
    }) : { results: [], stats: { alsRecords: chain.stats.alsRecords, truncated: false } };
    const pathChain = options.includeChain === true ? findAlsDofAuxiliaryPaths(cand, {
      ...options,
      alsList: options.alsList || undefined,
      maxResults: chainLimit,
    }) : { results: [], stats: { alsRecords: chain.stats.alsRecords, truncated: false } };
    const results = [
      ...chain.results,
      ...connectorChain.results,
      ...pathChain.results,
    ].slice(0, maxResults);
    let remaining = maxResults - results.length;
    const hub = remaining > 0 ? findAlsDofHubNets(cand, {
      ...options,
      alsList: options.alsList || undefined,
      maxResults: remaining,
    }) : { results: [], stats: { alsRecords: chain.stats.alsRecords, truncated: true } };
    results.push(...hub.results.slice(0, remaining));
    remaining = maxResults - results.length;
    const dds = remaining > 0 ? findAlsDofDdsNets(cand, {
      ...options,
      alsList: options.alsList || undefined,
      maxResults: remaining,
    }) : { results: [], stats: { alsRecords: hub.stats.alsRecords, truncated: true } };
    results.push(...dds.results.slice(0, remaining));
    remaining = maxResults - results.length;
    const almostDds = remaining > 0 ? findAlsDofAlmostDdsNets(cand, {
      ...options,
      alsList: options.alsList || undefined,
      maxResults: remaining,
    }) : { results: [], stats: { alsRecords: hub.stats.alsRecords, truncated: true } };
    results.push(...almostDds.results.slice(0, remaining));
    return {
      results,
      stats: {
        alsRecords: Math.max(
          chain.stats.alsRecords,
          pathChain.stats.alsRecords,
          hub.stats.alsRecords,
          dds.stats.alsRecords,
          almostDds.stats.alsRecords,
        ),
        chainNets: chain.results.length + connectorChain.results.length
          + pathChain.results.length,
        hubNets: hub.results.length,
        ddsNets: dds.results.length,
        almostDdsNets: almostDds.results.length,
        truncated: chain.stats.truncated || connectorChain.stats.truncated
          || pathChain.stats.truncated
          || hub.stats.truncated || dds.stats.truncated
          || almostDds.stats.truncated
          || chain.results.length + connectorChain.results.length + pathChain.results.length
            + hub.results.length + dds.results.length + almostDds.results.length > maxResults,
      },
      options: hub.options,
    };
  }

  function eliminationKey(item) {
    return `${item.cell}:${item.digit}`;
  }

  function verifyEliminations(proposed, expected) {
    const proposedKeys = new Set();
    const expectedKeys = new Set(expected.map(eliminationKey));
    const errors = [];

    for (const item of proposed || []) {
      const key = eliminationKey(item);
      if (proposedKeys.has(key)) errors.push(`duplicate elimination ${key}`);
      proposedKeys.add(key);
      if (!expectedKeys.has(key)) errors.push(`unverified elimination ${key}`);
    }
    for (const item of expected) {
      const key = eliminationKey(item);
      if (!proposedKeys.has(key)) errors.push(`missing elimination ${key}`);
    }

    return errors;
  }

  function nodeCandidateCells(cand, node, digit) {
    return (node?.cells || []).filter(cell =>
      (cand[cell] || []).includes(digit));
  }

  function verifyInternalAlsXzWitness(cand, result, item) {
    const auxiliary = result?.auxiliary || [];
    const cell = item?.cell;
    const digit = item?.digit;
    if (!Number.isInteger(cell) || !Number.isInteger(digit)
      || !(cand[cell] || []).includes(digit)) return false;

    const proof = item.internalAlsXz;
    const proofPairs = proof?.leftNode && proof?.rightNode
      ? [[proof.leftNode, proof.rightNode]]
      : [];
    if (!proofPairs.length) {
      for (let leftIndex = 0; leftIndex < auxiliary.length; leftIndex++) {
        for (let rightIndex = leftIndex + 1; rightIndex < auxiliary.length; rightIndex++) {
          proofPairs.push([auxiliary[leftIndex], auxiliary[rightIndex]]);
        }
      }
    }

    const outerCells = new Set([
      ...auxiliary.flatMap(node => node.cells || []),
      ...(result.primaryA?.cells || []),
    ]);
    for (const [left, right] of proofPairs) {
        if (left.dof !== 1 || right.dof !== 1) continue;
        if (!(left.cells || []).every(source => outerCells.has(source))
          || !(right.cells || []).every(source => outerCells.has(source))) continue;
        if (!disjoint(left.cells || [], right.cells || [])) continue;
        const sharedDigits = intersection(left.digits || [], right.digits || []);
        for (const restrictedDigit of sharedDigits) {
          const leftRestricted = nodeCandidateCells(cand, left, restrictedDigit);
          const rightRestricted = nodeCandidateCells(cand, right, restrictedDigit);
          if (!cellsSeeEachOther(leftRestricted, rightRestricted)) continue;
          if (!sharedDigits.includes(digit)) continue;
          const leftEliminated = nodeCandidateCells(cand, left, digit);
          const rightEliminated = nodeCandidateCells(cand, right, digit);
          if (peersEverywhere(cell, leftEliminated)
            && peersEverywhere(cell, rightEliminated)) return true;
        }
    }
    return false;
  }

  // Independent witness pass: each proposed deletion must be supported by
  // the raw candidate locations and peer relationships, not only by the
  // finder helper that produced the record.
  function verifyEliminationWitnesses(cand, result, alsPool = null) {
    const errors = [];
    const hub = result?.primaryA;
    const auxiliary = result?.auxiliary || [];
    const excluded = new Set([
      ...(hub?.cells || []),
      ...auxiliary.flatMap(node => node.cells || []),
      ...(result?.primaryC?.cells || []),
    ]);
    const ringWitnesses = result?.mode === 'hub'
      && result?.isRing
      && result?.lockScope !== 'z'
      ? new Set(ringEliminationRecords(
        cand,
        hub,
        auxiliary.map(node => ({
          node,
          bridge: { digit: node.rccDigit },
        })),
      ).map(eliminationKey))
      : null;
    const ddsWitnesses = (result?.mode === 'dds' || result?.mode === 'almost-dds')
      ? new Set((result.ringForm === 'compact-collection'
        ? compactDdsEliminationRecords(
          cand,
          hub,
          auxiliary.map(node => ({
            node,
            rccDigits: node.rccDigits || [],
            aBridges: node.aBridges || [],
          })),
          alsPool,
        )
        : ringEliminationRecords(
          cand,
          hub,
          auxiliary.map(node => ({ node })),
          'DDS occupancy',
        )).map(eliminationKey))
      : null;
    const pathWitnesses = result?.chainForm === 'auxiliary-hub-path'
      ? new Set(pathEliminationRecords(
        cand,
        result.primaryA,
        result.primaryC,
        result.z,
      ).map(eliminationKey))
      : null;
    const chainWitnesses = result?.mode === 'chain'
      && result?.chainForm !== 'auxiliary-hub-path'
      ? new Set(eliminationRecords(
        cand,
        hub,
        result.primaryC,
        auxiliary.map(node => ({
          node,
          aBridges: node.aBridges || [],
          cBridges: node.cBridges || [],
        })),
        result.z,
      ).map(eliminationKey))
      : null;
    const seesAll = (cell, sourceCells) => sourceCells.length > 0
      && sourceCells.every(source => core.peersOf(source).includes(cell));
    const witnessed = (item) => {
      if (!Number.isInteger(item?.cell) || item.cell < 0 || item.cell >= 81
        || !Number.isInteger(item?.digit) || item.digit < 1 || item.digit > 9) {
        return false;
      }
      if (!(cand[item.cell] || []).includes(item.digit)) {
        return false;
      }

      if (item.internalized || item.reasons?.includes('ALS-XZ')) {
        return verifyInternalAlsXzWitness(cand, result, item);
      }
      if (ringWitnesses) return ringWitnesses.has(eliminationKey(item));
      if (ddsWitnesses) return ddsWitnesses.has(eliminationKey(item));
      if (pathWitnesses) return pathWitnesses.has(eliminationKey(item));
      if (chainWitnesses) return chainWitnesses.has(eliminationKey(item));

      if (excluded.has(item.cell)) return false;

      if (result.mode === 'hub') {
        if (item.digit !== result.z) return false;
        const sourceCells = [hub, ...auxiliary]
          .flatMap(node => nodeCandidateCells(cand, node, item.digit));
        return seesAll(item.cell, sourceCells);
      }

      if (result.mode === 'dds') {
        for (const node of auxiliary) {
          const hubCells = nodeCandidateCells(cand, hub, item.digit);
          const nodeCells = nodeCandidateCells(cand, node, item.digit);
          if (hubCells.length && nodeCells.length
            && cellsSeeEachOther(hubCells, nodeCells)
            && seesAll(item.cell, [...hubCells, ...nodeCells])) {
            return true;
          }
        }

        if (!hub.digits.includes(item.digit)) {
          const owners = auxiliary.filter(node => node.digits.includes(item.digit));
          if (owners.length === 1) {
            return seesAll(item.cell, nodeCandidateCells(cand, owners[0], item.digit));
          }
        }
      }

      return false;
    };

    for (const item of result?.eliminations || []) {
      if (!witnessed(item)) {
        errors.push(`no independent witness for elimination ${eliminationKey(item)}`);
      }
    }
    return errors;
  }

  function verifyAlsDofNet(cand, result, options = {}) {
    const errors = [];
    if (!result || !result.primaryA) {
      return { ok: false, errors: ['missing hub ALS'], expectedEliminations: [] };
    }

    const hub = result.primaryA;
    const auxiliary = result.auxiliary || [];
    const allNodes = [hub, ...(result.primaryC ? [result.primaryC] : []), ...auxiliary];
    const occupied = new Set();
    for (const node of allNodes) {
      for (const cell of node.cells || []) {
        if (occupied.has(cell)) errors.push(`overlapping ALS cell ${cell}`);
        occupied.add(cell);
      }
      const actualDigits = sortedUnique(
        (node.cells || []).flatMap(cell => cand[cell] || []),
      );
      if (actualDigits.join(',') !== (node.digits || []).join(',')) {
        errors.push(`stale candidate union for ALS ${node.id}`);
      }
      if (node.digits.length - node.cells.length !== node.dof) {
        errors.push(`incorrect DOF for ALS ${node.id}`);
      }
    }

    let expectedEliminations = [];
    if (result.mode === 'chain' && result.chainForm === 'auxiliary-hub-path') {
      const primaryC = result.primaryC;
      const z = result.z;
      const pathNodes = [hub, ...(result.auxiliary || []), primaryC].filter(Boolean);
      const pathLinks = result.pathLinks || [];
      if (!primaryC) errors.push('ALS DOF path requires endpoint ALS B');
      if (pathNodes.length !== 5 || pathLinks.length !== 4) {
        errors.push('ALS DOF path requires A-S1-C-S2-B');
      }
      if (!Number.isInteger(z)
        || !hub.digits.includes(z)
        || !primaryC?.digits.includes(z)) {
        errors.push(`ALS DOF path endpoints must share Z=${z}`);
      }
      for (const node of result.auxiliary || []) {
        if (node.dof <= 0) errors.push(`path ALS ${node.id} is not an ALS DOF node`);
        if (node.digits.includes(z)) {
          errors.push(`path ALS ${node.id} must not contain endpoint Z=${z}`);
        }
      }
      const covered = new Set();
      for (let index = 0; index < pathLinks.length; index += 1) {
        const link = pathLinks[index];
        const left = pathNodes[index];
        const right = pathNodes[index + 1];
        const actual = left && right ? chainRccBridges(cand, left, right) : [];
        const actualDigits = sortedUnique(actual.map(bridge => bridge.digit));
        const listedDigits = sortedUnique((link.bridges || [])
          .map(bridge => bridge.digit));
        if (link.left !== left?.id || link.right !== right?.id) {
          errors.push(`ALS DOF path link ${index + 1} is out of order`);
        }
        if (!actual.length) errors.push(`ALS DOF path link ${index + 1} has no RCC`);
        if (actualDigits.join(',') !== listedDigits.join(',')) {
          errors.push(`ALS DOF path link ${index + 1} RCC list is stale`);
        }
        for (const digit of actualDigits) {
          if (digit !== z) covered.add(digit);
        }
      }
      const listedRcc = sortedUnique(result.rccDigits || []);
      if (listedRcc.join(',') !== sortedUnique([...covered]).join(',')) {
        errors.push('ALS DOF path RCC list is stale');
      }
      if (!errors.length) {
        expectedEliminations = pathEliminationRecords(cand, hub, primaryC, z);
      }
    } else if (result.mode === 'chain') {
      const primaryC = result.primaryC;
      const z = result.z;
      if (!primaryC) errors.push('ALS DOF chain requires endpoint ALS C');
      if (hub.dof <= 0 || primaryC?.dof <= 0) {
        errors.push('ALS DOF chain endpoints must be ALSs with positive DOF');
      }
      if (primaryC && hub.digits.length !== primaryC.digits.length) {
        errors.push('ALS DOF chain endpoints must expose the same digit count');
      }
      if (primaryC && !disjoint(hub.cells, primaryC.cells)) {
        errors.push('ALS DOF chain endpoints overlap');
      }
      if (!Number.isInteger(z)
        || !hub.digits.includes(z)
        || !primaryC?.digits.includes(z)) {
        errors.push(`ALS DOF chain endpoints must share Z=${z}`);
      }
      if (!auxiliary.length) errors.push('ALS DOF chain requires an auxiliary collection');

      const connectorForm = result.chainForm === 'shared-auxiliary';
      const covered = new Set();
      let hasABridge = false;
      let hasCBridge = false;
      for (const node of auxiliary) {
        if (node.dof <= 0) errors.push(`auxiliary ALS ${node.id} is not an ALS DOF node`);
        if (connectorForm
          ? node.digits.includes(z)
          : !node.digits.includes(z)) {
          errors.push(connectorForm
            ? `auxiliary ALS ${node.id} must not contain endpoint Z=${z}`
            : `auxiliary ALS ${node.id} lacks Z=${z}`);
        }
        if (primaryC && !disjoint(primaryC.cells, node.cells)) {
          errors.push(`auxiliary ALS ${node.id} overlaps endpoint C`);
        }

        const aBridges = chainRccBridges(cand, hub, node);
        const cBridges = primaryC
          ? chainRccBridges(cand, primaryC, node)
          : [];
        if (!aBridges.length || !cBridges.length) {
          errors.push(`auxiliary ALS ${node.id} must have RCCs to both endpoints`);
        }
        const listedA = (node.aBridges || []).map(bridge => bridge.digit);
        const listedC = (node.cBridges || []).map(bridge => bridge.digit);
        const validBridgeDigits = new Set([
          ...aBridges.map(bridge => bridge.digit),
          ...cBridges.map(bridge => bridge.digit),
        ]);
        const expectedNodeRcc = sortedUnique([
          ...aBridges.map(bridge => bridge.digit),
          ...cBridges.map(bridge => bridge.digit),
        ].filter(digit => digit !== z));
        const listedNodeRcc = sortedUnique((node.rccDigits || [])
          .filter(digit => digit !== z));
        if (aBridges.length) hasABridge = true;
        if (cBridges.length) hasCBridge = true;
        if (expectedNodeRcc.join(',') !== listedNodeRcc.join(',')) {
          errors.push(`auxiliary ALS ${node.id} RCC list is stale`);
        }
        if (listedNodeRcc.length < node.dof) {
          errors.push(`auxiliary ALS ${node.id} needs ${node.dof} non-Z RCCs`);
        }
        for (const digit of listedA) {
          if (!aBridges.some(bridge => bridge.digit === digit)) {
            errors.push(`invalid A RCC ${digit} for auxiliary ALS ${node.id}`);
          }
        }
        for (const digit of listedC) {
          if (!cBridges.some(bridge => bridge.digit === digit)) {
            errors.push(`invalid C RCC ${digit} for auxiliary ALS ${node.id}`);
          }
        }
        for (const digit of node.rccDigits || []) {
          if (digit === z || !validBridgeDigits.has(digit)) {
            errors.push(`invalid collection RCC ${digit} for auxiliary ALS ${node.id}`);
          }
          covered.add(digit);
        }
      }

      const listedRcc = sortedUnique(result.rccDigits || []);
      const coveredRcc = sortedUnique([...covered]);
      if (listedRcc.join(',') !== coveredRcc.join(',')) {
        errors.push('ALS DOF chain RCC list is stale');
      }
      if (primaryC) {
        const expectedRccCount = hub.digits.length - 1;
        if (!connectorForm && covered.size !== expectedRccCount) {
          errors.push(`ALS DOF chain requires ${expectedRccCount} unique non-Z RCCs`);
        }
        if (!hasABridge || !hasCBridge) {
          errors.push('ALS DOF chain collection must connect both endpoints');
        }
        const endpointCoverage = endpointBridgeCoverage(
          hub,
          primaryC,
          auxiliary.map(node => ({
            aBridges: node.aBridges || [],
            cBridges: node.cBridges || [],
          })),
        );
        if (!endpointCoverage.valid) {
          errors.push('ALS DOF chain needs each endpoint DOF covered by RCCs');
        }

        const primaryAReduction = endpointReduction(
          hub,
          auxiliary,
          'aBridges',
          z,
        );
        const primaryCReduction = endpointReduction(
          primaryC,
          auxiliary,
          'cBridges',
          z,
        );
        if (result.isRing) {
          if (!chainHubRingInfo(hub, primaryC, auxiliary, z)) {
            errors.push('ALS DOF ring hub is not fully reduced by its auxiliary RCCs');
          }
        } else if (primaryAReduction.residualDof !== 1
          || primaryCReduction.residualDof !== 1) {
          errors.push('ALS DOF chain endpoints must each retain residual DOF 1');
        }
      }
      if (!errors.length) {
        expectedEliminations = eliminationRecords(
          cand,
          hub,
          primaryC,
          auxiliary.map(node => ({
            node,
            aBridges: node.aBridges || [],
            cBridges: node.cBridges || [],
          })),
          z,
        );
      }
    } else if (result.mode === 'hub') {
      if (hub.dof < 2) errors.push('hub net requires hub DOF >= 2');
      const singleAuxiliaryRing = result.ringForm === 'single-auxiliary';
      if (singleAuxiliaryRing
        ? auxiliary.length !== 1
        : auxiliary.length !== hub.dof) {
        errors.push(`hub requires ${hub.dof} auxiliary ALSs`);
      }
      const z = result.z;
      if (!hub.digits.includes(z)) errors.push(`hub does not contain Z=${z}`);
      for (const node of auxiliary) {
        if (node.dof !== 1) errors.push(`auxiliary ALS ${node.id} is not DOF 1`);
        if (!node.digits.includes(z)) errors.push(`auxiliary ALS ${node.id} lacks Z=${z}`);
        if (!disjoint(hub.cells, node.cells)) errors.push(`auxiliary ALS ${node.id} overlaps hub`);
      }
      if (result.isRing) {
        const entries = auxiliary.map(node => ({
          node,
          bridge: { digit: node.rccDigit },
        }));
        const shared = singleAuxiliaryRing
          ? [z]
          : collectionRccDigits(cand, hub, entries);
        const listed = sortedUnique(result.collectionRccDigits || []);
        if (shared.join(',') !== listed.join(',')) {
          errors.push('ring collection RCC list is stale');
        }
        if (singleAuxiliaryRing) {
          const grouped = groupedRccDigits(cand, hub, auxiliary[0]);
          const zCells = nodeCandidateCells(cand, auxiliary[0], z);
          const uniqueRcc = grouped.filter(digit => digit !== z);
          if (grouped.join(',') !== sortedUnique(result.rccDigits || []).join(',')) {
            errors.push('single-auxiliary ring RCC list is stale');
          }
          if (zCells.length < 2 || uniqueRcc.length < hub.dof) {
            errors.push('single-auxiliary ring lacks the required grouped RCCs');
          }
        } else {
          if (!hasHubRingClosure(cand, entries, z)) {
            errors.push('ring auxiliary closure is missing');
          }
          if (!ringCoverageIsValid(cand, hub, entries)) {
            errors.push('ring auxiliaries do not meet the hub DOF RCC requirement');
          }
        }
      }
      if (!errors.length) {
        const entries = auxiliary.map(node => ({
          node,
          bridge: { digit: node.rccDigit },
        }));
        expectedEliminations = result.isRing && result.lockScope !== 'z'
          ? ringEliminationRecords(cand, hub, entries)
          : hubEliminationRecords(cand, hub, entries, z);
      }
    } else if (result.mode === 'dds' || result.mode === 'almost-dds') {
      const almostDds = result.mode === 'almost-dds';
      const compactDds = result.ringForm === 'compact-collection';
      const requiredAuxiliaries = hub.dof + (almostDds ? 1 : 0);
      if (hub.dof < 2) errors.push(`${almostDds ? 'Almost DDS' : 'DDS'} requires hub DOF >= 2`);
      if (compactDds
        ? (auxiliary.length < 1 || auxiliary.length >= hub.dof)
        : auxiliary.length !== requiredAuxiliaries) {
        errors.push(`${almostDds ? 'Almost DDS' : 'DDS'} requires ${requiredAuxiliaries} auxiliary ALSs`);
      }
      const covered = new Set();
      const entries = [];
      for (const node of auxiliary) {
        if (node.dof !== 1) errors.push(`auxiliary ALS ${node.id} is not DOF 1`);
        if (!disjoint(hub.cells, node.cells)) errors.push(`auxiliary ALS ${node.id} overlaps hub`);
        const strictBridges = restrictedCommons(hub, node)
          .filter(bridge => hub.digits.includes(bridge.digit));
        const strictDigits = new Set(strictBridges.map(bridge => bridge.digit));
        const bridges = [
          ...strictBridges,
          ...groupedRccBridges(cand, hub, node)
            .filter(bridge => !strictDigits.has(bridge.digit)),
        ];
        const listedDigits = node.rccDigits || node.aBridges?.map(bridge => bridge.digit) || [];
        for (const digit of listedDigits) {
          if (!bridges.some(bridge => bridge.digit === digit)) {
            errors.push(`invalid RCC ${digit} for auxiliary ALS ${node.id}`);
          }
          covered.add(digit);
        }
        entries.push({
          node,
          bridges: bridges.filter(bridge => listedDigits.includes(bridge.digit)),
        });
        if (compactDds && bridges.length < hub.dof) {
          errors.push(`compact DDS auxiliary ALS ${node.id} must expose at least ${hub.dof} RCCs`);
        }
      }
      for (const digit of hub.digits) {
        if (!covered.has(digit)) errors.push(`hub digit ${digit} is not RCC-covered`);
      }
      for (const digit of covered) {
        if (!hub.digits.includes(digit)) errors.push(`RCC ${digit} is outside hub digits`);
      }
      if (compactDds) {
        const shared = entries.reduce(
          (digits, entry) => intersection(
            digits,
            entry.bridges.map(bridge => bridge.digit),
          ),
          [...hub.digits],
        );
        const listedShared = sortedUnique(result.collectionRccDigits || []);
        if (!shared.length) errors.push('compact DDS has no collection-common RCC');
        if (shared.join(',') !== listedShared.join(',')) {
          errors.push('compact DDS collection RCC list is stale');
        }
      }
      if (!errors.length) {
        const source = options.alsList || core.alsConstructor(cand, {
          maxSizeDOF: 5,
          maxSizeFox: 5,
        });
        const alsPool = source.map(als => als.cells ? als : normaliseAls(als));
        expectedEliminations = compactDds
          ? compactDdsEliminationRecords(cand, hub, entries, alsPool)
          : cumulativeDdsEliminationRecords(cand, hub, entries, alsPool);
      }
    } else {
      errors.push('unsupported ALS-DOF net form');
    }

    errors.push(...verifyEliminationWitnesses(cand, result, options.alsList || null));
    errors.push(...verifyEliminations(result.eliminations, expectedEliminations));
    return {
      ok: errors.length === 0,
      errors,
      expectedEliminations,
    };
  }

  function alsDofNotationNode(node, index, includeRcc = false) {
    const cells = core.cellGroupName?.(node.cells)
      || node.cells.map(cell => core.cellName?.(cell) || `c${cell + 1}`).join(',');
    const dof = Number.isInteger(node.dof) ? ` DOF:${node.dof}` : '';
    const rccDigits = node.rccDigits?.length
      ? node.rccDigits
      : [node.rccDigit ?? node.aBridges?.[0]?.digit ?? node.cBridges?.[0]?.digit]
        .filter(digit => digit != null);
    const rcc = includeRcc && rccDigits.length
      ? ` RCC:{${rccDigits.join(',')}}`
      : '';
    return `${index}) ALS {${node.digits.join('')}}${cells}${dof}${rcc}`;
  }

  function formatAlsDof(record) {
    const eliminations = (record.eliminations || [])
      .map(item => `${core.cellName?.(item.cell) || `c${item.cell + 1}`}<>${item.digit}`)
      .join(', ');
    const objects = [];
    if (record.primaryA) objects.push({ node: record.primaryA, rcc: false });
    for (const node of record.auxiliary || []) objects.push({ node, rcc: true });
    if (record.primaryC) objects.push({ node: record.primaryC, rcc: false });
    const sequence = objects
      .map((entry, index) => alsDofNotationNode(entry.node, index + 1, entry.rcc))
      .join(' - ');
    return `${sequence}${record.isRing ? ' - ring' : ''} => ${eliminations || '?'}`;
  }

  core.findAlsDofAuxiliary = findAlsDofAuxiliary;
  core.findAlsDofAuxiliaryPaths = findAlsDofAuxiliaryPaths;
  core.findAlsDofChains = findAlsDofChains;
  core.findAlsDofHubNets = findAlsDofHubNets;
  core.findAlsDofDdsNets = findAlsDofDdsNets;
  core.findAlsDofAlmostDdsNets = findAlsDofAlmostDdsNets;
  core.findAlsDofNets = findAlsDofNets;
  core.alsDofSearch = findAlsDofNets;
  core.verifyAlsDofNet = verifyAlsDofNet;
  core.formatAlsDof = formatAlsDof;
})(globalThis);
