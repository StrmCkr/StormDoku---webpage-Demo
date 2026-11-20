(function installReverseBugLite(global) {
  'use strict';
  const core = global.StormDoku;
  function findReverseBugLite(candidateGrid, options = {}) {
    const givens = options.originalGivens;
    if (!Array.isArray(givens) || givens.length !== 81) throw new Error('Reverse-BUG-Lite requires the original givens.');
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => core.getVariantSettings?.()[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const fixed = options.fixedGrid || givens;
    const domains = Array.from({ length: 81 }, (_, cell) => fixed[cell] ? [fixed[cell]] : [...(candidateGrid[cell] || [])]);
    const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
    const peers = domains.map((_, cell) => core.peersOf(cell));
    const digitLocations = Array.from({ length: 10 }, (_, digit) =>
      units.map(unit => unit.filter(cell => domains[cell].includes(digit))));
    const linePairs = [];
    for (const axis of ['row', 'column']) {
      for (let group = 0; group < 3; group += 1) {
        for (let left = group * 3; left < group * 3 + 2; left += 1) {
          for (let right = left + 1; right < group * 3 + 3; right += 1) {
            const pairs = Array.from({ length: 9 }, (_, offset) =>
              axis === 'row' ? [left * 9 + offset, right * 9 + offset] : [offset * 9 + left, offset * 9 + right]);
            const givenCells = pairs.flat().filter(cell => givens[cell]);
            if (!givenCells.length) continue;
            const required = pairs.reduce((mask, pair, offset) =>
              pair.some(cell => givens[cell]) ? mask | (1 << offset) : mask, 0);
            linePairs.push({ axis, left, right, pairs, givenCells, required });
          }
        }
      }
    }
    const results = [];
    let states = 0;
    function assume(root, digit) {
      const values = domains.map(values => [...values]);
      const queue = [root];
      const forced = [];
      const links = [];
      values[root] = [digit];
      const visited = new Set();
      const queued = new Set(queue);
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const cell = queue[cursor];
        if (visited.has(cell)) continue;
        visited.add(cell);
        forced.push({ cell, digit });
        for (const peer of peers[cell]) {
          if (!values[peer].includes(digit)) continue;
          if (values[peer].length === 1) return null;
          values[peer] = values[peer].filter(value => value !== digit);
        }
        for (const original of digitLocations[digit]) {
          if (!original.length) continue;
          const remaining = original.filter(cell => values[cell].includes(digit));
          if (!remaining.length) return null;
          if (original.length > 1 && remaining.length === 1 && !visited.has(remaining[0])) {
            const next = remaining[0];
            values[next] = [digit];
            if (!queued.has(next)) {
              queued.add(next);
              queue.push(next);
              links.push({ digit, cells: original, forcedCell: next });
            }
          }
        }
      }
      return { values, forced, links };
    }
    for (let root = 0; root < 81; root += 1) {
      if (fixed[root] || givens[root] || domains[root].length < 2) continue;
      for (const digit of domains[root]) {
        states += 1;
        if ((states & 63) === 0) options.onProgress?.({ stage: 'reverse-bug-lite', states, results: results.length });
        const branch = assume(root, digit);
        if (!branch) continue;
        let reported = false;
        for (const { axis, left, right, pairs, givenCells, required } of linePairs) {
          if (reported) break;
          const eligible = [];
          for (let offset = 0; offset < 9; offset += 1) {
            const [a, b] = pairs[offset].map(cell => branch.values[cell]);
            if (a.length === 1 && b.length === 1 && a[0] !== b[0]) eligible.push(offset);
          }
          if (eligible.length < 2) continue;
          const available = eligible.reduce((mask, offset) => mask | (1 << offset), 0);
          if ((required & available) !== required) continue;
          for (let mask = available; mask; mask = (mask - 1) & available) {
            if (mask === 511 || (mask & required) !== required) continue;
            const offsets = eligible.filter(offset => mask & (1 << offset));
            if (offsets.length < 2) continue;
            let a = 0;
            let b = 0;
            let distinct = true;
            for (const offset of offsets) {
              const leftBit = 1 << branch.values[pairs[offset][0]][0];
              const rightBit = 1 << branch.values[pairs[offset][1]][0];
              if ((a & leftBit) || (b & rightBit)) { distinct = false; break; }
              a |= leftBit;
              b |= rightBit;
            }
            if (!distinct || a !== b) continue;
            const cells = offsets.flatMap(offset => pairs[offset]).sort((a, b) => a - b);
            if (!cells.some(cell => branch.forced.some(item => item.cell === cell))) continue;
            results.push({
              tech: 'reverse-bug-lite', name: 'Reverse-BUG-Lite', axis, lines: [left, right],
              cells, digits: Array.from({ length: 9 }, (_, i) => i + 1).filter(digit => a & (1 << digit)), givenCells,
              assignments: cells.map(cell => ({ cell, digit: branch.values[cell][0] })),
              forcingAssignments: branch.forced, forcingLinks: branch.links,
              eliminations: [{ cell: root, digit }],
            });
            reported = true;
            break;
          }
        }
      }
    }
    return { results, stats: { states } };
  }
  core.findReverseBugLite = findReverseBugLite;
})(globalThis);
