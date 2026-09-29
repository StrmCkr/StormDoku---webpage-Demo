(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core?.ahsConstructor) throw new Error('ahs-core.js must load before ahs-xy-core.js');

  const peers = Array.from({ length: 81 }, (_, cell) => new Set(core.peersOf(cell)));
  const sees = (a, b) => a !== b && peers[a].has(b);

  function bridgeBetween(cand, left, right) {
    if (left.ahsSector === right.ahsSector) return null;
    const commonCells = left.ahsAllCells.filter(cell => right.ahsAllCells.includes(cell));
    if (commonCells.length) return { kind: 'Shared cell', cells: commonCells };

    for (const digit of left.ahsDigits) {
      if (!right.ahsDigits.includes(digit)) continue;
      const a = left.ahsAllCells.filter(cell => cand[cell].includes(digit));
      const b = right.ahsAllCells.filter(cell => cand[cell].includes(digit));
      const linked = a.flatMap(cell => b.filter(other => sees(cell, other))
        .map(other => [cell, other]));
      if (linked.length) {
        return { kind: 'Position', digit, pairs: linked };
      }
    }
    return null;
  }

  // Every real solution supplies a cell for each hidden digit in each AHS.
  // Search these necessary assignments, preserving cell uniqueness and Sudoku peers.
  function hasPlacement(cand, sets, forced = null) {
    const variables = new Map();
    for (const ahs of sets) {
      for (const digit of ahs.ahsDigits) {
        const key = `${ahs.ahsSector}:${digit}`;
        if (variables.has(key)) continue;
        const cells = ahs.ahsAllCells.filter(cell => cand[cell].includes(digit)
          && (!forced || (cell === forced.cell
            ? digit === forced.digit
            : digit !== forced.digit || !sees(cell, forced.cell))));
        if (!cells.length) return false;
        variables.set(key, { digit, cells });
      }
    }
    const ordered = [...variables.values()].sort((a, b) => a.cells.length - b.cells.length);
    const assigned = [];

    function walk(index) {
      if (index === ordered.length) return true;
      const { digit, cells } = ordered[index];
      for (const cell of cells) {
        let valid = true;
        for (const previous of assigned) {
          if (cell === previous.cell ? digit !== previous.digit
            : digit === previous.digit && sees(cell, previous.cell)) {
            valid = false;
            break;
          }
        }
        if (!valid) continue;
        assigned.push({ cell, digit });
        if (walk(index + 1)) return true;
        assigned.pop();
      }
      return false;
    }
    return walk(0);
  }

  function findAhsXyChains(cand, options = {}) {
    const ahsList = (options.ahsList || core.ahsConstructor(cand, {
      maxSize: options.maxSize ?? 4,
      maxSizeFox: options.maxSizeFox ?? 4,
      searchLimit: true,
      maxResults: options.maxNodes ?? 800,
    })).filter(ahs => ahs.ahsDOF === 1 && ahs.ahsDigits.length >= 2);
    const adjacency = ahsList.map(() => []);
    const bridges = new Map();
    for (let a = 0; a < ahsList.length; a++) {
      for (let b = a + 1; b < ahsList.length; b++) {
        const bridge = bridgeBetween(cand, ahsList[a], ahsList[b]);
        if (!bridge) continue;
        adjacency[a].push(b);
        adjacency[b].push(a);
        bridges.set(`${a}:${b}`, bridge);
      }
    }

    const maxTriples = options.maxTriples ?? 30000;
    const maxChains = options.maxChains ?? 500;
    const chains = [];
    const seen = new Set();
    let triples = 0;
    let truncated = false;
    const bridgeOf = (a, b) => bridges.get(`${Math.min(a, b)}:${Math.max(a, b)}`);

    outer: for (let middle = 0; middle < ahsList.length; middle++) {
      const neighbours = adjacency[middle];
      for (let i = 0; i < neighbours.length; i++) {
        for (let j = i + 1; j < neighbours.length; j++) {
          if (++triples > maxTriples || chains.length >= maxChains) {
            truncated = true;
            break outer;
          }
          const first = neighbours[i];
          const last = neighbours[j];
          const sets = [ahsList[first], ahsList[middle], ahsList[last]];
          // An AHS-XY walk must pass through three independent sectors.
          // bridgeBetween() rejects same-sector bridges, but an open chain
          // has no closing bridge to perform that check for its endpoints.
          if (new Set(sets.map(ahs => ahs.ahsSector)).size !== sets.length) continue;
          if (!hasPlacement(cand, sets)) continue;
          const closingBridge = bridgeOf(first, last);
          const isRing = Boolean(closingBridge);
          const eliminations = [];
          const targetSets = isRing ? sets : [sets[0], sets[2]];
          const targets = new Set(targetSets.flatMap(ahs => ahs.ahsAllCells));
          for (const cell of targets) {
            for (const digit of cand[cell]) {
              if (!sets.some(ahs => ahs.ahsAllCells.includes(cell)
                && !ahs.ahsDigits.includes(digit))) continue;
              const forced = { cell, digit };
              if (hasPlacement(cand, sets, forced)) continue;
              if (!hasPlacement(cand, [sets[0], sets[1]], forced)
                || !hasPlacement(cand, [sets[0], sets[2]], forced)
                || !hasPlacement(cand, [sets[1], sets[2]], forced)) continue;
              eliminations.push({ cell, digit });
            }
          }
          if (!eliminations.length) continue;
          const key = eliminations.map(item => `${item.cell}:${item.digit}`).join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          const steps = sets.map((ahs, index) => ({
            family: 'AHS',
            linkType: 6,
            linkId: ahs.uniqueID,
            direction: 'forward',
            module: { moduleKind: 'AHS_XY', ahs },
            entry: { cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits], side: 'left' },
            exit: { cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits], side: 'right' },
            originSectors: [ahs.ahsSector],
          }));
          chains.push({
            length: 3,
            structureName: isRing ? 'AHS - XY Ring' : 'AHS - XY',
            isRing,
            ahsXy: { sets: sets.map(ahs => ({
              sector: ahs.ahsSector,
              cells: [...ahs.ahsAllCells],
              digits: [...ahs.ahsDigits],
            })), bridges: [
              bridgeOf(first, middle),
              bridgeOf(middle, last),
              ...(isRing ? [closingBridge] : []),
            ] },
            eliminations,
            steps,
          });
        }
      }
    }
    return { chains, stats: { ahsNodes: ahsList.length, ahsBridges: bridges.size,
      triplesChecked: Math.min(triples, maxTriples), truncated } };
  }

  core.findAhsXyChains = findAhsXyChains;
  core.ahsXyHasPlacement = hasPlacement;
})(globalThis);
