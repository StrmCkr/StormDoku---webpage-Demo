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

  function eliminationRecords(cand, primaryA, primaryC, auxiliary, digit) {
    const excluded = new Set([
      ...primaryA.cells,
      ...primaryC.cells,
      ...auxiliary.flatMap(entry => entry.node.cells),
    ]);
    const aCells = rccForDigit(primaryA, digit)?.cells || [];
    const cCells = rccForDigit(primaryC, digit)?.cells || [];
    const records = [];

    for (let cell = 0; cell < 81; cell++) {
      if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;

      const reasons = [];
      if (peersEverywhere(cell, aCells) && peersEverywhere(cell, cCells)) {
        reasons.push('A∩C');
      }

      for (const entry of auxiliary) {
        const sCells = rccForDigit(entry.node, digit)?.cells || [];
        if (peersEverywhere(cell, aCells) && peersEverywhere(cell, sCells)) {
          reasons.push('A∩S');
        }
        if (peersEverywhere(cell, cCells) && peersEverywhere(cell, sCells)) {
          reasons.push('C∩S');
        }
      }

      if (reasons.length) records.push({
        cell,
        digit,
        reasons: [...new Set(reasons)],
      });
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
    const seen = new Set();
    const stats = {
      alsRecords: alsList.length,
      endpointPairs: 0,
      commonDigits: 0,
      auxiliaryCandidates: 0,
      collections: 0,
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
            if (opts.requireAuxiliaryZ && !node.digits.includes(digit)) continue;

            const aBridges = restrictedCommons(primaryA, node);
            const cBridges = restrictedCommons(primaryC, node);
            if (!aBridges.length || !cBridges.length) continue;

            auxiliaryCandidates.push({
              node,
              aBridges,
              cBridges,
              rccDigits: union(bridgeDigits(aBridges), bridgeDigits(cBridges))
                .filter(value => value !== digit),
            });
          }

          stats.auxiliaryCandidates += auxiliaryCandidates.length;
          if (!auxiliaryCandidates.length) continue;

          const visit = (start, selected, rccDigits) => {
            if (results.length >= opts.maxResults) {
              stats.truncated = true;
              return;
            }

            if (selected.length && rccDigits.length === n - 1) {
              const key = [
                primaryA.id,
                primaryC.id,
                digit,
                selected.map(entry => entry.node.id).join(','),
              ].join('|');
              if (!seen.has(key)) {
                seen.add(key);
                const eliminations = eliminationRecords(cand, primaryA, primaryC, selected, digit);
                if (eliminations.length) {
                  stats.collections += 1;
                  results.push({
                    tech: 'als-dof',
                    name: 'ALS DOF Chain',
                    type: 'ALS_DOF_CHAIN',
                    mode: 'chain',
                    isRing: false,
                    z: digit,
                    size: n,
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
                  });
                }
              }
              return;
            }

            if (selected.length >= opts.maxAuxiliary || rccDigits.length >= n - 1) return;

            for (let index = start; index < auxiliaryCandidates.length; index++) {
              const candidate = auxiliaryCandidates[index];
              if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
              const nextRccDigits = union(rccDigits, candidate.rccDigits);
              if (nextRccDigits.length > n - 1) continue;
              visit(index + 1, [...selected, candidate], nextRccDigits);
              if (results.length >= opts.maxResults) return;
            }
          };

          visit(0, [], []);
          if (stats.truncated) break outer;
        }
      }
    }

    return { results, stats, options: opts };
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
      if (candidates.length < hub.dof) continue;

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
    const chain = options.includeChain === true ? findAlsDofAuxiliary(cand, {
      ...options,
      alsList: options.alsList || undefined,
      requireAuxiliaryZ: true,
      maxResults,
    }) : { results: [], stats: { alsRecords: options.alsList?.length || 0, truncated: false } };
    const results = chain.results.slice(0, maxResults);
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
          hub.stats.alsRecords,
          dds.stats.alsRecords,
          almostDds.stats.alsRecords,
        ),
        chainNets: chain.results.length,
        hubNets: hub.results.length,
        ddsNets: dds.results.length,
        almostDdsNets: almostDds.results.length,
        truncated: chain.stats.truncated || hub.stats.truncated || dds.stats.truncated
          || almostDds.stats.truncated
          || chain.results.length + hub.results.length + dds.results.length + almostDds.results.length > maxResults,
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
  function verifyEliminationWitnesses(cand, result) {
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
      ? new Set(ringEliminationRecords(
        cand,
        hub,
        auxiliary.map(node => ({ node })),
        'DDS occupancy',
      ).map(eliminationKey))
      : null;
    const chainWitnesses = result?.mode === 'chain'
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
    if (result.mode === 'chain') {
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

      const covered = new Set();
      for (const node of auxiliary) {
        if (node.dof <= 0) errors.push(`auxiliary ALS ${node.id} is not an ALS DOF node`);
        if (!node.digits.includes(z)) errors.push(`auxiliary ALS ${node.id} lacks Z=${z}`);
        if (primaryC && !disjoint(primaryC.cells, node.cells)) {
          errors.push(`auxiliary ALS ${node.id} overlaps endpoint C`);
        }

        const aBridges = restrictedCommons(hub, node);
        const cBridges = primaryC
          ? restrictedCommons(primaryC, node)
          : [];
        if (!aBridges.length) errors.push(`auxiliary ALS ${node.id} lacks an A RCC`);
        if (!cBridges.length) errors.push(`auxiliary ALS ${node.id} lacks a C RCC`);
        const listedA = (node.aBridges || []).map(bridge => bridge.digit);
        const listedC = (node.cBridges || []).map(bridge => bridge.digit);
        const validBridgeDigits = new Set([
          ...aBridges.map(bridge => bridge.digit),
          ...cBridges.map(bridge => bridge.digit),
        ]);
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
        if (covered.size !== expectedRccCount) {
          errors.push(`ALS DOF chain requires ${expectedRccCount} unique non-Z RCCs`);
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
      const requiredAuxiliaries = hub.dof + (almostDds ? 1 : 0);
      if (hub.dof < 2) errors.push(`${almostDds ? 'Almost DDS' : 'DDS'} requires hub DOF >= 2`);
      if (auxiliary.length !== requiredAuxiliaries) {
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
      }
      for (const digit of hub.digits) {
        if (!covered.has(digit)) errors.push(`hub digit ${digit} is not RCC-covered`);
      }
      for (const digit of covered) {
        if (!hub.digits.includes(digit)) errors.push(`RCC ${digit} is outside hub digits`);
      }
      if (!errors.length) {
        const source = options.alsList || core.alsConstructor(cand, {
          maxSizeDOF: 5,
          maxSizeFox: 5,
        });
        const alsPool = source.map(als => als.cells ? als : normaliseAls(als));
        expectedEliminations = cumulativeDdsEliminationRecords(cand, hub, entries, alsPool);
      }
    } else {
      errors.push('unsupported ALS-DOF net form');
    }

    errors.push(...verifyEliminationWitnesses(cand, result));
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
  core.findAlsDofHubNets = findAlsDofHubNets;
  core.findAlsDofDdsNets = findAlsDofDdsNets;
  core.findAlsDofAlmostDdsNets = findAlsDofAlmostDdsNets;
  core.findAlsDofNets = findAlsDofNets;
  core.alsDofSearch = findAlsDofNets;
  core.verifyAlsDofNet = verifyAlsDofNet;
  core.formatAlsDof = formatAlsDof;
})(globalThis);
