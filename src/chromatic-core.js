/* Non-Colourable Chromatic Graphs.
 * Candidate cells are vertices; Sudoku visibility is an edge.
 * A selected digit set is the available colour set. A non-colourable graph
 * with one guardian forces that guardian outside the selected digit set.
 */
(function attachChromaticCore(global) {
  'use strict';
  const units = [];
  const unitNames = [];
  for (let row = 0; row < 9; row++) {
    units.push(Array.from({ length: 9 }, (_, col) => row * 9 + col));
    unitNames.push(`r${row + 1}`);
  }
  for (let col = 0; col < 9; col++) {
    units.push(Array.from({ length: 9 }, (_, row) => row * 9 + col));
    unitNames.push(`c${col + 1}`);
  }
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells = [];
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) cells.push(row * 9 + col);
      }
      units.push(cells);
      unitNames.push(`b${boxRow * 3 + boxCol + 1}`);
    }
  }
  const peers = Array.from({ length: 81 }, () => new Set());
  for (const unit of units) for (const cell of unit) for (const peer of unit) {
    if (peer !== cell) peers[cell].add(peer);
  }

  function combinations(values, size, start = 0, prefix = [], output = []) {
    if (prefix.length === size) { output.push([...prefix]); return output; }
    for (let i = start; i <= values.length - (size - prefix.length); i++) {
      prefix.push(values[i]);
      combinations(values, size, i + 1, prefix, output);
      prefix.pop();
    }
    return output;
  }
  const intersects = (values, digits) => values.some(value => digits.includes(value));
  const subsetOf = (values, digits) => values.length > 0 && values.every(value => digits.includes(value));

  function graphIsKColorable(cells, digits, cand) {
    const domains = new Map(cells.map(cell => [cell, (cand[cell] || []).filter(d => digits.includes(d))]));
    if ([...domains.values()].some(domain => !domain.length)) return false;
    const assigned = new Map();
    function visit(remaining) {
      if (!remaining.length) return true;
      let selected = remaining[0];
      let values = domains.get(selected).filter(value =>
        ![...peers[selected]].some(peer => assigned.get(peer) === value));
      for (const cell of remaining.slice(1)) {
        const next = domains.get(cell).filter(value =>
          ![...peers[cell]].some(peer => assigned.get(peer) === value));
        if (next.length < values.length) { selected = cell; values = next; }
      }
      for (const value of values) {
        assigned.set(selected, value);
        if (visit(remaining.filter(cell => cell !== selected))) return true;
        assigned.delete(selected);
      }
      return false;
    }
    return visit([...cells]);
  }

  function graphEdges(cells) {
    const selected = new Set(cells);
    const edges = [];
    for (const left of cells) for (const right of peers[left]) {
      if (selected.has(right) && left < right) edges.push([left, right]);
    }
    return edges;
  }

  function find(cand, options = {}) {
    const minSectors = Math.max(2, Number(options.minSectors) || 4);
    const maxSectors = Math.min(9, Math.max(minSectors, Number(options.maxSectors) || 5));
    const minDigits = Math.max(2, Number(options.minDigits) || 2);
    const maxDigits = Math.min(9, Math.max(minDigits, Number(options.maxDigits) || 5));
    const maxCells = Math.max(12, Number(options.maxCells) || 32);
    const maxResults = Math.max(1, Number(options.maxResults) || 100);
    const results = [];
    const seen = new Set();
    let tested = 0;
    let truncated = false;
    const unitType = options.unitType || 'box';
    const sectorIndexes = unitType === 'row'
      ? Array.from({ length: 9 }, (_, index) => index)
      : unitType === 'column'
        ? Array.from({ length: 9 }, (_, index) => index + 9)
        : unitType === 'all'
          ? units.map((_, index) => index)
          : Array.from({ length: 9 }, (_, index) => index + 18);
    const digitValues = Array.from({ length: 9 }, (_, index) => index + 1);

    outer:
    for (let sectorCount = minSectors; sectorCount <= maxSectors; sectorCount++) {
      for (const sectorSet of combinations(sectorIndexes, sectorCount)) {
        const sectorCells = [...new Set(sectorSet.flatMap(index => units[index]))];
        for (let digitCount = minDigits; digitCount <= maxDigits; digitCount++) {
          for (const digits of combinations(digitValues, digitCount)) {
            const relevant = sectorCells.filter(cell => intersects(cand[cell] || [], digits));
            if (relevant.length < digits.length || relevant.length > maxCells) continue;
            const coreCells = relevant.filter(cell => subsetOf(cand[cell] || [], digits));
            const guardians = relevant.filter(cell => !subsetOf(cand[cell] || [], digits));
            if (!coreCells.length || !guardians.length) continue;

            for (const guardian of guardians) {
              const graphCells = [...coreCells, guardian];
              if (graphCells.length > maxCells) continue;
              tested++;
              if (graphIsKColorable(graphCells, digits, cand)) continue;
              const guardianDigits = (cand[guardian] || []).filter(digit => digits.includes(digit));
              if (!guardianDigits.length) continue;
              const classification = 'Non-Colourable Chromatic Graph';
              results.push({
                tech: 'non-colourable-chromatic-graph',
                name: classification,
                classification,
                k: digits.length,
                digits,
                sectors: sectorSet,
                sectorNames: sectorSet.map(index => unitNames[index]),
                cells: graphCells,
                coreCells,
                guardians: [guardian],
                edges: graphEdges(graphCells),
                eliminations: guardianDigits.map(digit => ({ cell: guardian, digit })),
              });
              if (results.length >= maxResults) { truncated = true; break outer; }
            }

          }
        }
      }
    }
    return { tech: 'non-colourable-chromatic-graph', results, stats: { tested, truncated } };
  }
  global.StormChromaticCore = { find, units, unitNames, peers };
}(typeof window !== 'undefined' ? window : globalThis));
