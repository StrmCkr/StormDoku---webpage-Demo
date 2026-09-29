(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core?.setTools) throw new Error('set-tools-core.js must load before ahs-dof-core.js');
  if (!core.ahsConstructor) throw new Error('ahs-core.js must load before ahs-dof-core.js');

  const { combinations, intersection, sortedUnique } = core.setTools;
  let nextLinkId = 0;

  const disjoint = (left, right) => {
    const seen = new Set(left || []);
    return (right || []).every(cell => !seen.has(cell));
  };

  function cellsSeeEachOther(left, right) {
    return !!left?.length && !!right?.length
      && left.every(a => right.every(b => a === b || core.peersOf(a).includes(b)));
  }

  function commonSectors(cells) {
    if (!cells?.length) return [];
    return core.UNITS
      .map((unit, sector) => cells.every(cell => unit.includes(cell)) ? sector : -1)
      .filter(sector => sector >= 0);
  }

  function normaliseAhs(ahs) {
    return {
      id: ahs.uniqueID,
      sector: ahs.ahsSector,
      cells: [...(ahs.ahsAllCells || [])].sort((a, b) => a - b),
      digits: [...(ahs.ahsDigits || [])].sort((a, b) => a - b),
      size: ahs.ahsSize,
      fox: ahs.ahsFOX,
      dof: ahs.ahsDOF,
      powerSet: ahs.PowerSet,
      rccList: (ahs.rccList || []).map(rcc => ({
        cell: rcc.rccCell,
        outsideDigits: [...(rcc.rccDigits || [])].sort((a, b) => a - b),
        sectors: [...(rcc.rccSectors || [])],
      })),
      source: ahs,
    };
  }

  function outsideDigitCells(ahs, digit) {
    return ahs.rccList
      .filter(rcc => rcc.outsideDigits.includes(digit))
      .map(rcc => rcc.cell)
      .sort((a, b) => a - b);
  }

  function hiddenSingleAfterRemoval(cand, ahs, removedCells) {
    const removed = new Set(removedCells);
    const remaining = ahs.cells.filter(cell => !removed.has(cell));
    const hidden = [];
    for (const digit of ahs.digits) {
      const cells = remaining.filter(cell => (cand[cell] || []).includes(digit));
      if (cells.length === 1) hidden.push({ digit, cell: cells[0] });
    }
    return hidden;
  }

  function makeWitness(cand, ahs, removedCells, removedDigit, kind) {
    return hiddenSingleAfterRemoval(cand, ahs, removedCells).map(hidden => ({
      id: `${ahs.id}:${kind}:${removedCells.join(',')}:${removedDigit ?? ''}:${hidden.digit}:${hidden.cell}`,
      kind,
      ahsId: ahs.id,
      ahs,
      removedCells: [...removedCells].sort((a, b) => a - b),
      removedDigit: removedDigit ?? null,
      hiddenDigit: hidden.digit,
      hiddenCell: hidden.cell,
      rccCells: [...removedCells].sort((a, b) => a - b),
      rccDigits: removedDigit == null ? [] : [removedDigit],
      sectors: sortedUnique([ahs.sector, ...commonSectors(removedCells)]),
    }));
  }

  function buildReductionWitnesses(cand, ahs) {
    if (ahs.dof < 1 || ahs.dof > 3 || ahs.digits.length < 2) return [];
    const witnesses = [];
    const eligibleCells = ahs.rccList.map(rcc => rcc.cell);
    for (let count = 1; count <= Math.min(ahs.dof, eligibleCells.length); count += 1) {
      for (const removed of combinations(eligibleCells, count)) {
        witnesses.push(...makeWitness(cand, ahs, removed, null, 'CELL'));
      }
    }
    const outsideDigits = sortedUnique(ahs.rccList.flatMap(rcc => rcc.outsideDigits));
    for (const digit of outsideDigits) {
      const removed = outsideDigitCells(ahs, digit);
      if (!removed.length || removed.length > ahs.dof) continue;
      witnesses.push(...makeWitness(cand, ahs, removed, digit, 'DIGIT'));
    }
    const seen = new Set();
    return witnesses.filter(witness => !seen.has(witness.id) && seen.add(witness.id));
  }

  function hsNode(witness) {
    return {
      id: witness.id,
      uniqueID: witness.ahs.id,
      cells: [witness.hiddenCell],
      digits: [witness.hiddenDigit],
      hiddenCell: witness.hiddenCell,
      hiddenDigit: witness.hiddenDigit,
      sourceCells: [...witness.ahs.cells],
      sourceDigits: [...witness.ahs.digits],
      sourceDof: witness.ahs.dof,
      reductionKind: witness.kind,
      removedCells: [...witness.removedCells],
      removedDigit: witness.removedDigit,
      sectors: [...witness.sectors],
    };
  }

  function buildModularLink(left, right) {
    if (left.ahs.id === right.ahs.id) return null;
    const sharedRcc = intersection(left.rccCells, right.rccCells);
    if (sharedRcc.length !== 1) return null;
    if (left.hiddenCell === sharedRcc[0] || right.hiddenCell === sharedRcc[0]) return null;
    if (!cellsSeeEachOther([left.hiddenCell], [right.hiddenCell])) return null;
    const hsLeft = hsNode(left);
    const hsRight = hsNode(right);
    return {
      id: nextLinkId++,
      tech: 'ahs-dof',
      moduleKind: 'AHS_DOF',
      linkType: 'AHS_DOF_RCC',
      linkTypeName: 'AHS_DOF_RCC',
      conveyance: 'CELLS',
      left: left.ahs,
      right: right.ahs,
      RCC_Left: {
        cells: [...left.rccCells],
        digits: [...left.rccDigits],
        kind: left.kind,
        removedDigit: left.removedDigit,
      },
      HS_L: hsLeft,
      C: {
        kind: 'AHS_DOF_RCC',
        cells: [...sharedRcc],
        sectors: sortedUnique([...left.sectors, ...right.sectors, ...commonSectors(sharedRcc)]),
      },
      HS_R: hsRight,
      RCC_Right: {
        cells: [...right.rccCells],
        digits: [...right.rccDigits],
        kind: right.kind,
        removedDigit: right.removedDigit,
      },
      sharedRccCell: sharedRcc[0],
      activeCells: [left.hiddenCell],
      linkedCells: [right.hiddenCell],
      hiddenDigits: [left.hiddenDigit, right.hiddenDigit],
      potentialEliminations: [],
    };
  }

  function linkKey(link) {
    return [link.left.id, link.right.id, link.sharedRccCell,
      link.HS_L.hiddenDigit, link.HS_R.hiddenDigit,
      link.RCC_Left.cells.join(','), link.RCC_Right.cells.join(',')].join('|');
  }

  function normaliseOptions(options = {}) {
    return {
      minDof: Number.isInteger(options.minDof) ? Math.max(1, options.minDof) : 1,
      maxDof: Number.isInteger(options.maxDof) ? Math.max(1, Math.min(3, options.maxDof)) : 3,
      maxAhsSize: Number.isInteger(options.maxAhsSize) ? Math.max(1, options.maxAhsSize) : 8,
      maxAhsFox: Number.isInteger(options.maxAhsFox) ? Math.max(1, options.maxAhsFox) : 7,
      maxResults: Number.isInteger(options.maxResults) && options.maxResults > 0
        ? options.maxResults : null,
    };
  }

  function findAhsDofLinks(cand, options = {}) {
    const opts = normaliseOptions(options);
    nextLinkId = 0;
    const source = options.ahsList || core.ahsConstructor(cand, {
      maxSize: opts.maxAhsSize, maxSizeFox: opts.maxAhsFox,
    });
    const ahsList = source.map(normaliseAhs)
      .filter(ahs => ahs.dof >= opts.minDof && ahs.dof <= opts.maxDof)
      .filter(ahs => ahs.cells.length <= opts.maxAhsFox + 1);
    const entries = ahsList.map(ahs => ({ ahs, witnesses: buildReductionWitnesses(cand, ahs) }))
      .filter(entry => entry.witnesses.length);
    const witnesses = entries.flatMap(entry => entry.witnesses.map(witness => ({
      id: witness.id,
      ahsId: witness.ahs.id,
      ahsCells: [...witness.ahs.cells],
      ahsDigits: [...witness.ahs.digits],
      ahsDof: witness.ahs.dof,
      kind: witness.kind,
      removedCells: [...witness.removedCells],
      removedDigit: witness.removedDigit,
      hiddenDigit: witness.hiddenDigit,
      hiddenCell: witness.hiddenCell,
    })));
    const links = [];
    const seen = new Set();
    const stats = {
      ahsRecords: ahsList.length,
      reducibleAhs: entries.length,
      witnesses: entries.reduce((sum, entry) => sum + entry.witnesses.length, 0),
      candidatePairs: 0, links: 0, truncated: false,
    };
    for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
      const left = entries[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
        const right = entries[rightIndex];
        if (left.ahs.id === right.ahs.id || disjoint(left.ahs.cells, right.ahs.cells)) continue;
        stats.candidatePairs += 1;
        for (const leftWitness of left.witnesses) {
          for (const rightWitness of right.witnesses) {
            const link = buildModularLink(leftWitness, rightWitness);
            if (!link || seen.has(linkKey(link))) continue;
            seen.add(linkKey(link));
            links.push(link);
            stats.links += 1;
            if (opts.maxResults && links.length >= opts.maxResults) {
              stats.truncated = true;
              return { links, results: links, witnesses, stats, options: opts };
            }
          }
        }
      }
    }
    return { links, results: links, witnesses, stats, options: opts };
  }

  function ahsDofBridgeCells(cand, hub, auxiliary) {
    if (hub.sector === auxiliary.sector) return [];
    return intersection(hub.cells, auxiliary.cells).filter(cell => {
      const values = cand[cell] || [];
      return hub.digits.some(digit => values.includes(digit))
        && auxiliary.digits.some(digit => values.includes(digit));
    });
  }

  function auxiliaryBodiesDisjoint(hub, selected, candidate) {
    const hubCells = new Set(hub.cells);
    const body = candidate.cells.filter(cell => !hubCells.has(cell));
    return selected.every(entry => disjoint(
      body,
      entry.node.cells.filter(cell => !hubCells.has(cell)),
    ));
  }

  function ahsDofTargets(cand, nodes) {
    const targets = new Map();
    const add = (cell, digit) => {
      if (!(cand[cell] || []).includes(digit)) return;
      targets.set(`${cell}:${digit}`, { cell, digit });
    };

    for (const node of nodes) {
      for (const cell of node.cells) {
        for (const digit of cand[cell] || []) {
          if (!node.digits.includes(digit)) add(cell, digit);
        }
      }
      for (const digit of node.digits) {
        const sourceCells = node.cells.filter(cell => (cand[cell] || []).includes(digit));
        if (!sourceCells.length) continue;
        const peers = core.setTools.peerPotentialEliminations
          ? core.setTools.peerPotentialEliminations(cand, digit, sourceCells)
          : [];
        for (const cell of peers) add(cell, digit);
      }
    }
    return [...targets.values()];
  }

  function ahsDofEliminations(cand, nodes, bridgeCells) {
    const hasPlacement = core.ahsXyHasPlacement;
    if (typeof hasPlacement !== 'function') {
      throw new Error('ahs-xy-core.js must load before AHS-DOF verification');
    }
    const source = nodes.map(node => node.source || node);
    if (!hasPlacement(cand, source)) return [];
    const neutral = new Set(bridgeCells);
    const eliminations = [];

    for (const target of ahsDofTargets(cand, nodes)) {
      // An RCC cell is neutral to the net. It cannot verify its own removal.
      if (neutral.has(target.cell)) continue;
      if (hasPlacement(cand, source, target)) continue;

      // The contradiction must require the complete DOF collection. This
      // prevents an ordinary AHS-XZ/XY deduction being relabelled AHS-DOF.
      let dependsOnCollection = true;
      for (let index = 1; index < source.length; index += 1) {
        const reduced = source.filter((_, nodeIndex) => nodeIndex !== index);
        if (!hasPlacement(cand, reduced, target)) {
          dependsOnCollection = false;
          break;
        }
      }
      if (!dependsOnCollection) continue;
      eliminations.push(target);
    }
    return eliminations.sort((a, b) => a.cell - b.cell || a.digit - b.digit);
  }

  function normaliseNetOptions(options = {}) {
    const base = normaliseOptions(options);
    return {
      ...base,
      minDof: Number.isInteger(options.minDof) ? Math.max(2, options.minDof) : 2,
      maxDof: Number.isInteger(options.maxDof) ? Math.max(2, Math.min(3, options.maxDof)) : 3,
      maxCells: Number.isInteger(options.maxCells) ? Math.max(2, Math.min(9, options.maxCells)) : 9,
      maxAuxiliary: Number.isInteger(options.maxAuxiliary)
        ? Math.max(1, Math.min(3, options.maxAuxiliary)) : 3,
      maxResults: Number.isInteger(options.maxResults) && options.maxResults > 0
        ? options.maxResults : 500,
    };
  }

  function findAhsDofNets(cand, options = {}) {
    const opts = normaliseNetOptions(options);
    const source = options.ahsList || core.ahsConstructor(cand, {
      maxSize: opts.maxAhsSize,
      maxSizeFox: opts.maxAhsFox,
    });
    const ahsList = source.map(normaliseAhs)
      .filter(node => node.digits.length >= 2)
      .filter(node => node.cells.length <= opts.maxCells);
    const hubs = ahsList.filter(node => node.dof >= opts.minDof
      && node.dof <= opts.maxDof
      && node.dof <= opts.maxAuxiliary);
    const auxiliaries = ahsList.filter(node => node.dof === 1);
    const results = [];
    const seen = new Set();
    const stats = {
      ahsRecords: ahsList.length,
      hubs: hubs.length,
      auxiliaries: auxiliaries.length,
      bridgeCandidates: 0,
      collectionsChecked: 0,
      zeroEliminationCollections: 0,
      duplicateCollections: 0,
      truncated: false,
    };

    outer: for (const hub of hubs) {
      const candidates = auxiliaries.flatMap(node => {
        if (node.id === hub.id) return [];
        const cells = ahsDofBridgeCells(cand, hub, node);
        return cells.length ? [{ node, cells }] : [];
      });
      stats.bridgeCandidates += candidates.length;
      const selected = [];
      const usedCells = new Set();

      const visit = start => {
        if (results.length >= opts.maxResults) {
          stats.truncated = true;
          return;
        }
        if (selected.length === hub.dof) {
          stats.collectionsChecked += 1;
          const bridgeCells = selected.map(entry => entry.bridgeCell);
          const nodes = [hub, ...selected.map(entry => entry.node)];
          const key = `${hub.id}|${selected.map(entry => `${entry.node.id}:${entry.bridgeCell}`).sort().join('|')}`;
          if (seen.has(key)) {
            stats.duplicateCollections += 1;
            return;
          }
          seen.add(key);
          const eliminations = ahsDofEliminations(cand, nodes, bridgeCells);
          if (!eliminations.length) {
            stats.zeroEliminationCollections += 1;
            return;
          }
          results.push({
            tech: 'ahs-dof',
            name: 'AHS DOF',
            type: 'AHS_DOF_NET',
            mode: 'hub',
            isRing: selected.every((entry, index) => selected.some((other, otherIndex) =>
              index !== otherIndex && intersection(entry.node.cells, other.node.cells).length > 0)),
            size: hub.dof,
            hub,
            primaryA: hub,
            auxiliary: selected.map(entry => ({
              ...entry.node,
              bridgeCell: entry.bridgeCell,
              rccCells: [entry.bridgeCell],
            })),
            rccCells: [...bridgeCells],
            eliminations,
            cells: eliminations.map(item => item.cell),
          });
          return;
        }

        for (let index = start; index < candidates.length; index += 1) {
          const candidate = candidates[index];
          if (!auxiliaryBodiesDisjoint(hub, selected, candidate.node)) continue;
          for (const bridgeCell of candidate.cells) {
            if (usedCells.has(bridgeCell)) continue;
            usedCells.add(bridgeCell);
            selected.push({ node: candidate.node, bridgeCell });
            visit(index + 1);
            selected.pop();
            usedCells.delete(bridgeCell);
            if (stats.truncated) return;
          }
        }
      };

      visit(0);
      if (stats.truncated) break outer;
    }
    return { results, links: results, stats, options: opts };
  }

  function verifyAhsDofNet(cand, result) {
    const errors = [];
    const hub = result?.hub || result?.primaryA;
    const auxiliary = result?.auxiliary || [];
    if (!hub || hub.dof < 2) errors.push('AHS-DOF hub requires DOF 2 or 3');
    if (hub && auxiliary.length !== hub.dof) {
      errors.push(`AHS-DOF hub requires ${hub.dof} auxiliaries`);
    }
    const bridges = auxiliary.map(node => node.bridgeCell);
    if (new Set(bridges).size !== bridges.length) errors.push('AHS-DOF RCC cells must be distinct');
    for (const node of auxiliary) {
      if (node.dof !== 1) errors.push(`auxiliary AHS ${node.id} is not DOF 1`);
      if (!hub?.cells.includes(node.bridgeCell) || !node.cells.includes(node.bridgeCell)) {
        errors.push(`invalid RCC cell for auxiliary AHS ${node.id}`);
      }
    }
    const expectedEliminations = errors.length
      ? []
      : ahsDofEliminations(cand, [hub, ...auxiliary], bridges);
    const expected = new Set(expectedEliminations.map(item => `${item.cell}:${item.digit}`));
    const actual = new Set((result?.eliminations || []).map(item => `${item.cell}:${item.digit}`));
    if (expected.size !== actual.size || [...expected].some(key => !actual.has(key))) {
      errors.push('AHS-DOF elimination list is stale or unsupported');
    }
    return { ok: errors.length === 0, errors, expectedEliminations };
  }

  function ahsDofNotation(link) {
    if (!link) return '?';
    const name = cells => core.cellGroupName?.(cells)
      || (cells || []).map(cell => core.cellName?.(cell) || `c${cell + 1}`).join('');
    const hs = node => `(${node.hiddenDigit})${name(node.cells)}`;
    return `{${name(link.RCC_Left.cells)}} ${hs(link.HS_L)} | ${name(link.C.cells)} | `
      + `${hs(link.HS_R)} {${name(link.RCC_Right.cells)}}`;
  }

  function formatAhsDofNet(record) {
    const name = cells => core.cellGroupName?.(cells)
      || (cells || []).map(cell => core.cellName?.(cell) || `c${cell + 1}`).join('');
    const node = value => `AHS {${value.digits.join('')}}${name(value.cells)} DOF:${value.dof}`;
    const sequence = [node(record.hub), ...(record.auxiliary || []).map(value =>
      `${name([value.bridgeCell])} - ${node(value)}`)].join(' / ');
    const eliminations = (record.eliminations || [])
      .map(item => `${core.cellName?.(item.cell) || `c${item.cell + 1}`}<>${item.digit}`)
      .join(', ');
    return `${sequence}${record.isRing ? ' - ring' : ''} => ${eliminations || 'none'}`;
  }

  core.findAhsDofLinks = findAhsDofLinks;
  core.findAhsDofNets = findAhsDofNets;
  core.ahsDofSearch = findAhsDofNets;
  core.verifyAhsDofNet = verifyAhsDofNet;
  core.formatAhsDof = ahsDofNotation;
  core.formatAhsDofNet = formatAhsDofNet;
  core.AHS_DOF_RCC = 'AHS_DOF_RCC';
})(globalThis);
