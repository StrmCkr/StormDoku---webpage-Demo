(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before als-nrcc-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before als-nrcc-core.js');

  const { intersection, sortedUnique, union } = core.setTools;

  function disjoint(left, right) {
    const seen = new Set(left);
    return right.every(cell => !seen.has(cell));
  }

  function peers(cell, other) {
    return core.peersOf(cell).includes(other);
  }

  function cellsSeeEachOther(left, right) {
    return left.length > 0 && right.length > 0
      && left.every(leftCell => right.every(rightCell => peers(leftCell, rightCell)));
  }

  function normaliseAls(als) {
    return {
      id: als.uniqueID,
      cells: [...(als.alsAllCells || als.cells || [])],
      digits: [...(als.alsDigits || als.digits || [])].sort((a, b) => a - b),
      size: als.alsSize ?? als.size,
      fox: als.alsFOX ?? als.fox,
      dof: als.alsDOF ?? als.dof,
      sector: als.alsSector ?? als.sector,
      rccList: (als.rccList || []).map(rcc => ({
        digit: rcc.rccDigit ?? rcc.digit,
        cells: [...(rcc.rccCells || rcc.cells || [])],
      })),
    };
  }

  function candidateCells(cand, node, digit) {
    return node.cells.filter(cell => (cand[cell] || []).includes(digit));
  }

  // nRCC groups intentionally allow several occurrences of a shared digit.
  // This is separate from restrictedCommons(), whose one-cell rule remains
  // the definition used by ordinary ALS-XZ links.
  function groupedRccDigits(cand, hub, auxiliary) {
    const digits = [];
    const hubDigits = new Set(hub.digits);
    for (const digit of auxiliary.digits) {
      if (!hubDigits.has(digit)) continue;
      const hubCells = candidateCells(cand, hub, digit);
      const auxiliaryCells = candidateCells(cand, auxiliary, digit);
      if (cellsSeeEachOther(hubCells, auxiliaryCells)) digits.push(digit);
    }
    return digits.sort((a, b) => a - b);
  }

  function collectionRccDigits(hub, auxiliary) {
    if (auxiliary.length < 2) return [];
    const common = new Set(hub.digits);
    for (const entry of auxiliary) {
      const digits = new Set(entry.rccDigits || []);
      for (const digit of [...common]) {
        if (!digits.has(digit)) common.delete(digit);
      }
    }
    return [...common].sort((a, b) => a - b);
  }

  function requiredRccCount(hub, auxiliary) {
    // A mutual RCC is locked to the collection and counts once for every
    // auxiliary ALS. The remaining requirement is still at least one RCC.
    return Math.max(1, hub.dof - collectionRccDigits(hub, auxiliary).length);
  }

  function normaliseOptions(options = {}) {
    return {
      maxAuxiliary: Number.isInteger(options.maxAuxiliary)
        ? Math.max(1, Math.min(6, options.maxAuxiliary)) : 4,
      minAuxiliary: Number.isInteger(options.minAuxiliary)
        ? Math.max(1, Math.min(6, options.minAuxiliary)) : 2,
      maxNodeCells: Number.isInteger(options.maxNodeCells)
        ? Math.max(1, Math.min(5, options.maxNodeCells)) : 4,
      maxHubDof: Number.isInteger(options.maxHubDof)
        ? Math.max(2, Math.min(8, options.maxHubDof)) : 6,
      maxDigits: Number.isInteger(options.maxDigits)
        ? Math.max(2, Math.min(9, options.maxDigits)) : 9,
      maxPlacements: Number.isInteger(options.maxPlacements)
        ? Math.max(100, options.maxPlacements) : 20000,
      maxResults: Number.isInteger(options.maxResults)
        ? Math.max(1, options.maxResults) : 2000,
      hubIds: options.hubIds ? new Set(options.hubIds) : null,
      auxiliaryIds: options.auxiliaryIds ? new Set(options.auxiliaryIds) : null,
    };
  }

  function buildAssignments(cand, node, maxPlacements) {
    const cells = [...node.cells].sort((left, right) =>
      (cand[left] || []).length - (cand[right] || []).length);
    const output = [];
    const usedDigits = new Set();
    const current = [];
    let truncated = false;

    function visit(index) {
      if (output.length >= maxPlacements) {
        truncated = true;
        return;
      }
      if (index === cells.length) {
        output.push(current.map(item => ({ ...item })));
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
    }

    visit(0);
    return { assignments: output, truncated };
  }

  function assignmentsCompatible(left, right) {
    for (const leftItem of left) {
      for (const rightItem of right) {
        if (leftItem.digit === rightItem.digit && peers(leftItem.cell, rightItem.cell)) {
          return false;
        }
      }
    }
    return true;
  }

  function targetCompatible(assignment, cell, digit) {
    return assignment.every(item => item.digit !== digit || !peers(cell, item.cell));
  }

  function canPlaceTarget(nodeAssignments, targetCell, targetDigit) {
    const chosen = [];

    function visit(index) {
      if (index === nodeAssignments.length) return true;
      for (const assignment of nodeAssignments[index]) {
        if (!targetCompatible(assignment, targetCell, targetDigit)) continue;
        if (chosen.some(previous => !assignmentsCompatible(previous, assignment))) continue;
        chosen.push(assignment);
        if (visit(index + 1)) return true;
        chosen.pop();
      }
      return false;
    }

    return visit(0);
  }

  function networkEliminations(cand, hub, auxiliary, assignmentCache) {
    const excluded = new Set([
      ...hub.cells,
      ...auxiliary.flatMap(entry => entry.node.cells),
    ]);
    const nodes = [hub, ...auxiliary.map(entry => entry.node)];
    const nodeAssignments = nodes.map(node => assignmentCache.get(node.id)?.assignments || []);
    if (nodeAssignments.some(assignments => assignments.length === 0)) return [];

    const eliminations = [];
    for (const digit of hub.digits) {
      for (let cell = 0; cell < 81; cell++) {
        if (excluded.has(cell) || !(cand[cell] || []).includes(digit)) continue;
        if (!canPlaceTarget(nodeAssignments, cell, digit)) {
          eliminations.push({
            cell,
            digit,
            reasons: ['nRCC occupancy'],
          });
        }
      }
    }
    return eliminations;
  }

  function notationNode(node, index, rccDigits = []) {
    const cells = core.cellGroupName?.(node.cells)
      || node.cells.map(cell => core.cellName?.(cell) || `c${cell + 1}`).join(',');
    const rcc = rccDigits.length ? ` RCC:{${rccDigits.join(',')}}` : '';
    return `${index}) ALS {${node.digits.join('')}}${cells} DOF:${node.dof}${rcc}`;
  }

  function formatAlsDofNrcc(record) {
    const sequence = [notationNode(record.primaryA, 1)]
      .concat((record.auxiliary || []).map((entry, index) =>
        notationNode(entry.node || entry, index + 2, entry.rccDigits || [])))
      .join(' - ');
    const eliminations = (record.eliminations || [])
      .map(item => `${core.cellName?.(item.cell) || `c${item.cell + 1}`}<>${item.digit}`)
      .join(', ');
    return `${sequence} => ${eliminations || '?'}`;
  }

  function findAlsDofNrccNets(cand, options = {}) {
    const opts = normaliseOptions(options);
    const source = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: opts.maxDigits - 1,
      maxSizeFox: opts.maxDigits - 1,
    });
    const all = source
      .map(normaliseAls)
      .filter(node => node.cells.length > 0)
      .filter(node => node.cells.length <= opts.maxNodeCells)
      .filter(node => node.digits.length >= 2 && node.digits.length <= opts.maxDigits);
    const hubs = all.filter(node => node.dof >= 2 && node.dof <= opts.maxHubDof)
      .filter(node => !opts.hubIds || opts.hubIds.has(node.id));
    const auxiliaries = all.filter(node => node.dof >= 1)
      .filter(node => !opts.auxiliaryIds || opts.auxiliaryIds.has(node.id));
    const results = [];
    const seen = new Set();
    const placementCache = new Map();
    const stats = {
      alsRecords: all.length,
      hubs: 0,
      auxiliaryCandidates: 0,
      collections: 0,
      completeCollections: 0,
      rejectedPlacements: 0,
      truncated: false,
    };

    function placementsFor(node) {
      if (!placementCache.has(node.id)) {
        placementCache.set(node.id, buildAssignments(cand, node, opts.maxPlacements));
      }
      return placementCache.get(node.id);
    }

    for (const hub of hubs) {
      if (results.length >= opts.maxResults) {
        stats.truncated = true;
        break;
      }
      stats.hubs += 1;
      const candidates = [];
      for (const node of auxiliaries) {
        if (node.id === hub.id || !disjoint(hub.cells, node.cells)) continue;
        const rccDigits = groupedRccDigits(cand, hub, node);
        if (rccDigits.length < 1) continue;
        if (!rccDigits.length) continue;
        candidates.push({ node, rccDigits });
      }
      stats.auxiliaryCandidates += candidates.length;
      if (candidates.length < opts.minAuxiliary) continue;

      const covered = new Set();
      const selected = [];
      const visit = (start) => {
        if (results.length >= opts.maxResults) {
          stats.truncated = true;
          return;
        }
        if (selected.length >= opts.minAuxiliary
          && covered.size === hub.digits.length
          && hub.digits.every(digit => covered.has(digit))) {
          const required = requiredRccCount(hub, selected);
          if (selected.some(entry => entry.rccDigits.length < required)) return;
          stats.completeCollections += 1;
          const key = `${hub.id}|${selected.map(entry => entry.node.id).join(',')}`;
          if (!seen.has(key)) {
            seen.add(key);
            const hubPlacements = placementsFor(hub);
            const auxiliaryPlacements = selected.map(entry => placementsFor(entry.node));
            if (hubPlacements.truncated || auxiliaryPlacements.some(item => item.truncated)) {
              stats.rejectedPlacements += 1;
            } else {
              const eliminations = networkEliminations(cand, hub, selected, placementCache);
              if (eliminations.length) {
                stats.collections += 1;
                results.push({
                  tech: 'als-nrcc',
                  name: 'ALS-DOF nRCC Net',
                  type: 'ALS_DOF_NRCC',
                  mode: 'nrcc',
                  primaryA: hub,
                  primaryC: null,
                  auxiliary: selected.map(entry => ({
                    ...entry.node,
                    rccDigits: [...entry.rccDigits],
                  })),
                  rccDigits: [...covered].sort((a, b) => a - b),
                  collectionRccDigits: collectionRccDigits(hub, selected),
                  coverage: covered.size,
                  eliminations,
                  cells: eliminations.map(item => item.cell),
                });
              }
            }
          }
          return;
        }
        if (selected.length >= opts.maxAuxiliary) return;

        for (let index = start; index < candidates.length; index += 1) {
          const candidate = candidates[index];
          if (selected.some(entry => !disjoint(entry.node.cells, candidate.node.cells))) continue;
          const nextDigits = union([...covered, ...candidate.rccDigits]);
          selected.push(candidate);
          const added = candidate.rccDigits.filter(digit => !covered.has(digit));
          for (const digit of added) covered.add(digit);
          visit(index + 1);
          for (const digit of added) covered.delete(digit);
          selected.pop();
          if (stats.truncated) return;
        }
      };
      visit(0);
    }

    return { results, stats, options: opts };
  }

  function verifyAlsDofNrccNet(cand, result, options = {}) {
    const errors = [];
    const hub = result?.primaryA;
    const auxiliary = result?.auxiliary || [];
    if (!hub) return { ok: false, errors: ['missing hub ALS'] };
    const allCells = new Set(hub.cells || []);
    for (const entry of auxiliary) {
      const node = entry.node || entry;
      if (node.dof < 1) errors.push(`auxiliary ALS ${node.id} has no DOF`);
      if (!disjoint(hub.cells || [], node.cells || [])) errors.push(`auxiliary ALS ${node.id} overlaps hub`);
      for (const cell of node.cells || []) {
        if (allCells.has(cell)) errors.push(`overlapping ALS cell ${cell}`);
        allCells.add(cell);
      }
      const actual = groupedRccDigits(cand, hub, node);
      const listed = [...(entry.rccDigits || [])].sort((a, b) => a - b);
      if (actual.join(',') !== listed.join(',')) errors.push(`invalid grouped RCCs for ALS ${node.id}`);
    }
    const covered = sortedUnique(auxiliary.flatMap(entry => entry.rccDigits || []));
    if (covered.join(',') !== [...hub.digits].sort((a, b) => a - b).join(',')) {
      errors.push('auxiliary RCC union does not cover the hub digit set');
    }
    const required = requiredRccCount(hub, auxiliary);
    for (const entry of auxiliary) {
      if ((entry.rccDigits || []).length < required) {
        errors.push(`ALS ${(entry.node || entry).id} supplies fewer than ${required} RCCs after collection sharing`);
      }
    }
    if (!errors.length) {
      const placementCache = new Map();
      for (const node of [hub, ...auxiliary.map(entry => entry.node || entry)]) {
        placementCache.set(node.id, buildAssignments(cand, node, options.maxPlacements || 20000));
      }
      const expected = networkEliminations(cand, hub, auxiliary, placementCache);
      const expectedKeys = new Set(expected.map(item => `${item.cell}:${item.digit}`));
      for (const item of result.eliminations || []) {
        if (!expectedKeys.has(`${item.cell}:${item.digit}`)) {
          errors.push(`unverified elimination ${item.cell}:${item.digit}`);
        }
      }
    }
    return { ok: errors.length === 0, errors };
  }

  core.findAlsDofNrccNets = findAlsDofNrccNets;
  core.findAlsNrccNets = findAlsDofNrccNets;
  core.alsDofNrccSearch = findAlsDofNrccNets;
  core.verifyAlsDofNrccNet = verifyAlsDofNrccNet;
  core.formatAlsDofNrcc = formatAlsDofNrcc;
})(globalThis);
