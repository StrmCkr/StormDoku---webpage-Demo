/* Bivalve Universal Grave candidate selections and their common consequences. */
(function installBugCore(global) {
  'use strict';
  const core = global.StormDoku;

  function findBug(candidateGrid, options = {}) {
    const mode = options.mode || 'n';
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => core.getVariantSettings?.()[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
    const houses = candidates.map((_, cell) => units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const peers = candidates.map((_, cell) => new Set(core.peersOf(cell)));
    const forcingCache = new Map();
    function guardianConsequences(guardian) {
      const key = guardian.cell + ':' + guardian.digit;
      if (forcingCache.has(key)) return forcingCache.get(key);
      const domains = candidates.map(values => [...values]);
      const originalLocations = units.map(unit => Array.from({ length: 10 }, (_, digit) =>
        unit.filter(cell => candidates[cell].includes(digit))));
      const queue = [guardian];
      const assigned = new Map();
      const removed = new Map();
      function remove(cell, digit) {
        if (!domains[cell].includes(digit)) return true;
        domains[cell] = domains[cell].filter(value => value !== digit);
        removed.set(cell + ':' + digit, { cell, digit });
        if (!domains[cell].length) return false;
        if (domains[cell].length === 1 && !assigned.has(cell)) queue.push({ cell, digit: domains[cell][0] });
        return true;
      }
      let valid = true;
      for (let cursor = 0; cursor < queue.length && valid; cursor += 1) {
        const { cell, digit } = queue[cursor];
        if (assigned.has(cell)) { if (assigned.get(cell) !== digit) valid = false; continue; }
        if (!domains[cell].includes(digit)) { valid = false; break; }
        assigned.set(cell, digit);
        for (const other of [...domains[cell]]) if (other !== digit && !remove(cell, other)) valid = false;
        for (const peer of peers[cell]) if (!remove(peer, digit)) valid = false;
        if (!valid) break;
        for (const locations of originalLocations) {
          for (let value = 1; value <= 9; value += 1) {
            if (!locations[value].length) continue;
            const remaining = locations[value].filter(cell => domains[cell].includes(value));
            if (!remaining.length) { valid = false; break; }
            if (remaining.length === 1 && !assigned.has(remaining[0])) queue.push({ cell: remaining[0], digit: value });
          }
          if (!valid) break;
        }
      }
      const result = valid ? { removed, assignments: [...assigned].map(([cell, digit]) => ({ cell, digit })) } : null;
      forcingCache.set(key, result);
      return result;
    }
    const cells = candidates.flatMap((values, cell) => values.length > 1 ? [cell] : []);
    const poly = cells.filter(cell => candidates[cell].length > 2);
    if (!poly.length || (mode === '1' && poly.length !== 1)
      || (mode === 'n' && poly.length < 2)) return { results: [], stats: { states: 0 } };
    const pairs = candidates.map(values => values.flatMap((digit, index) =>
      values.slice(index + 1).map(other => [digit, other])));
    const counts = Array.from({ length: units.length }, () => new Uint8Array(10));
    const selection = new Map();
    const results = [];
    const seen = new Set();
    const visited = new Set();
    let states = 0;
    const fits = (cell, pair) => pair.every(digit => houses[cell].every(unit => counts[unit][digit] < 2));
    function assign(cell, pair, direction) {
      if (direction > 0) selection.set(cell, pair);
      else selection.delete(cell);
      for (const unit of houses[cell]) for (const digit of pair) counts[unit][digit] += direction;
    }
    function report() {
      const selectedCells = [...selection.keys()].sort((a, b) => a - b);
      if (selectedCells.length < 4) return;
      const fullGrid = selectedCells.length === cells.length;
      // Dedicated type searches still need the full inventory of patterns.
      // The combined Type 1 search already obtains full grids via +1/+n.
      if (mode === 'lite' && fullGrid && !options.includePatterns) return;
      // A present single in the same house excludes that digit from a BUG.
      if (units.some((unit, index) => unit.some(cell => candidates[cell].length === 1
        && counts[index][candidates[cell][0]]))) return;
      const guardians = selectedCells.flatMap(cell => candidates[cell]
        .filter(digit => !selection.get(cell).includes(digit)).map(digit => ({ cell, digit })));
      if (!guardians.length && !options.includeBareSeeds) return;
      const key = selectedCells.map(cell => cell + ':' + selection.get(cell).join('')).join(',');
      if (seen.has(key)) return;
      seen.add(key);
      const eliminations = cells.flatMap(cell => candidates[cell].flatMap(digit =>
        guardians.every(guardian => guardian.cell === cell ? guardian.digit !== digit
          : guardian.digit === digit && peers[cell].has(guardian.cell)) ? [{ cell, digit }] : []));
      let forcingBranches = [];
      let forcingEliminations = [];
      if (!options.includePatterns) {
        const branches = guardians.map(guardian => ({ guardian, consequence: guardianConsequences(guardian) }));
        const possible = branches.filter(branch => branch.consequence);
        if (possible.length) {
          const merged = new Map();
          for (const [atom, item] of possible[0].consequence.removed) {
            if (possible.every(branch => branch.consequence.removed.has(atom))) forcingEliminations.push(item);
          }
          for (const branch of branches.filter(branch => !branch.consequence)) {
            merged.set(branch.guardian.cell + ':' + branch.guardian.digit, branch.guardian);
          }
          eliminations.push(...merged.values());
          forcingBranches = branches.map(({ guardian, consequence }) => ({
            guardian, contradiction: !consequence, assignments: consequence?.assignments || [],
          }));
        }
      }
      if (!eliminations.length && !options.includePatterns) return;
      const resultMode = fullGrid ? poly.length === 1 ? '1' : 'n' : 'lite';
      const polyCells = selectedCells.filter(cell => candidates[cell].length > 2);
      results.push({
        tech: 'bug-' + resultMode, name: resultMode === '1' ? 'B.U.G +1'
          : resultMode === 'lite' ? 'B.U.G -Lite +' + polyCells.length : 'B.U.G +' + polyCells.length,
        cells: selectedCells, polyCells, extraCellCount: polyCells.length,
        basePairs: selectedCells.map(cell => ({ cell, digits: [...selection.get(cell)] })),
        guardians, eliminations, forcingBranches, forcingEliminations,
      });
    }
    function visit() {
      if (options.maxStates && states >= options.maxStates) return;
      if (mode === 'lite') {
        const key = [...selection].sort((a, b) => a[0] - b[0])
          .map(([cell, pair]) => cell + ':' + pair.join('')).join(',');
        if (visited.has(key)) return;
        visited.add(key);
      }
      states += 1;
      if ((states & 8191) === 0) options.onProgress?.({ stage: 'bug-' + mode, states, results: results.length });
      let moves = null;
      for (let unit = 0; unit < units.length; unit += 1) {
        for (let digit = 1; digit <= 9; digit += 1) {
          if (counts[unit][digit] !== 1) continue;
          const available = units[unit].flatMap(cell => selection.has(cell) ? []
            : pairs[cell].filter(pair => pair.includes(digit) && fits(cell, pair)).map(pair => ({ cell, pair })));
          if (!available.length) return;
          if (!moves || available.length < moves.length) moves = available;
        }
      }
      if (!moves && mode !== 'lite') {
        const remaining = cells.filter(cell => !selection.has(cell));
        if (remaining.length) {
          let chosen;
          for (const cell of remaining) {
            const available = pairs[cell].filter(pair => fits(cell, pair));
            if (!available.length) return;
            if (!chosen || available.length < chosen.length) chosen = available.map(pair => ({ cell, pair }));
          }
          moves = chosen;
        }
      }
      if (!moves) { report(); return; }
      for (const { cell, pair } of moves) {
        assign(cell, pair, 1);
        visit();
        assign(cell, pair, -1);
      }
    }
    if (mode === 'lite') {
      const starts = options.includeBareSeeds ? [...poly, ...cells.filter(cell => candidates[cell].length === 2)] : poly;
      for (const cell of starts) for (const pair of pairs[cell]) {
        assign(cell, pair, 1);
        visit();
        assign(cell, pair, -1);
      }
    } else {
      for (const cell of cells.filter(cell => candidates[cell].length === 2)) {
        if (!fits(cell, candidates[cell])) return { results: [], stats: { states } };
        assign(cell, candidates[cell], 1);
      }
      visit();
    }
    // Preserve every structurally valid BUG-Lite result. A larger pattern is
    // not invalid merely because a smaller contained pattern also exists.
    return { results, stats: { states } };
  }
  core.findBug = findBug;
})(globalThis);
