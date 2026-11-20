(function installReverseBug(global) {
  'use strict';
  const core = global.StormDoku;
  function findReverseBug(candidateGrid, options = {}) {
    if (!Array.isArray(options.originalGivens) || options.originalGivens.length !== 81) {
      throw new Error('Reverse-BUG requires the original 81-cell givens.');
    }
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => core.getVariantSettings?.()[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const givens = options.originalGivens;
    const fixed = options.fixedGrid || givens;
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      fixed[cell] ? [fixed[cell]] : [...new Set(candidateGrid?.[cell] || [])]);
    const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
    const houses = candidates.map((_, cell) => units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const solvedLocations = units.map(unit => Array.from({ length: 10 }, (_, digit) =>
      unit.filter(cell => candidates[cell].length === 1 && candidates[cell][0] === digit)));
    const results = [];
    let states = 0;
    for (let first = 1; first < 9; first += 1) {
      for (let second = first + 1; second <= 9; second += 1) {
        const digits = [first, second];
        const givenCells = givens.flatMap((digit, cell) => digits.includes(digit) ? [cell] : []);
        if (!givenCells.length || givenCells.length >= 18) continue;
        for (let target = 0; target < 81; target += 1) {
          if (fixed[target] || givens[target]) continue;
          for (const assumed of digits.filter(digit => candidates[target].includes(digit))) {
            states += 1;
            if ((states & 255) === 0) options.onProgress?.({ stage: 'reverse-bug', states, results: results.length });
            const selected = new Map();
            const counts = units.map(() => [0, 0]);
            const queue = [...givenCells.map(cell => ({ cell, digit: givens[cell] })), { cell: target, digit: assumed }];
            let valid = true;
            for (let cursor = 0; cursor < queue.length && valid; cursor += 1) {
              const { cell, digit } = queue[cursor];
              if (selected.has(cell)) {
                if (selected.get(cell) !== digit) valid = false;
                continue;
              }
              const side = digit === first ? 0 : 1;
              if (!candidates[cell].includes(digit) || houses[cell].some(unit => counts[unit][side])) {
                valid = false;
                break;
              }
              selected.set(cell, digit);
              if (selected.size >= 18) { valid = false; break; }
              for (const unit of houses[cell]) {
                counts[unit][side] = 1;
                const opposite = digits[1 - side];
                if (counts[unit][1 - side]) continue;
                const available = assumed === opposite && houses[target].includes(unit)
                  ? [...solvedLocations[unit][opposite], target] : solvedLocations[unit][opposite];
                if (available.length !== 1) { valid = false; break; }
                queue.push({ cell: available[0], digit: opposite });
              }
            }
            if (!valid || selected.size < 4 || counts.some(([a, b]) => a !== b)) continue;
            const cells = [...selected.keys()].sort((a, b) => a - b);
            results.push({
              tech: 'reverse-bug', name: 'Reverse-BUG', digits, cells, givenCells,
              assignments: cells.map(cell => ({ cell, digit: selected.get(cell) })),
              eliminations: [{ cell: target, digit: assumed }],
            });
          }
        }
      }
    }
    return { results, stats: { states } };
  }
  core.findReverseBug = findReverseBug;
})(globalThis);
