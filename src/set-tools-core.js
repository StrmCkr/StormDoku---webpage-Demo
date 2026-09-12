(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before set-tools-core.js');

  const POWERSET_OFFSETS = Object.freeze([0, 9, 45, 129, 255, 381, 465, 501, 510]);

  function sortedUnique(values) {
    return [...new Set(values)].sort((a, b) => a - b);
  }

  function intersection(left, right) {
    const rightSet = new Set(right);
    return left.filter(value => rightSet.has(value));
  }

  function union(left, right) {
    return sortedUnique([...left, ...right]);
  }

  function combinations(values, size) {
    const out = [];
    const current = [];
    if (size < 0 || size > values.length) return out;

    function visit(start) {
      if (current.length === size) {
        out.push([...current]);
        return;
      }

      for (let index = start; index < values.length; index++) {
        current.push(values[index]);
        visit(index + 1);
        current.pop();
      }
    }

    visit(0);
    return out;
  }

  function buildPowerSetIndexes() {
    const indexes = new Map();
    for (let size = 1; size <= 9; size++) {
      const positions = Array.from({ length: 9 }, (_, index) => index);
      combinations(positions, size).forEach((combo, rank) => {
        indexes.set(combo.join(','), POWERSET_OFFSETS[size - 1] + rank);
      });
    }
    return indexes;
  }

  const powerSetIndexes = buildPowerSetIndexes();

  function candidateDigits(cand, cells) {
    const digits = new Set();
    for (const cell of cells) for (const digit of cand[cell] || []) digits.add(digit);
    return [...digits].sort((a, b) => a - b);
  }

  function peerPotentialEliminations(cand, digit, sourceCells) {
    if (!sourceCells.length) return [];
    const sourceSet = new Set(sourceCells);
    const out = [];

    for (let cell = 0; cell < 81; cell++) {
      if (sourceSet.has(cell) || !(cand[cell] || []).includes(digit)) continue;
      if (sourceCells.every(source => core.peersOf(source).includes(cell))) out.push(cell);
    }

    return out;
  }

  function sectorsForRcc(cand, digit, sourceCells, sector) {
    const sectors = [sector];

    for (let other = 0; other < core.UNITS.length; other++) {
      if (other === sector) continue;
      const locations = core.UNITS[other].filter(cell => (cand[cell] || []).includes(digit));
      if (sourceCells.every(cell => locations.includes(cell))) sectors.push(other);
    }

    return sectors;
  }

  core.setTools = Object.freeze({
    POWERSET_OFFSETS,
    sortedUnique,
    intersection,
    union,
    combinations,
    buildPowerSetIndexes,
    powerSetIndexes,
    candidateDigits,
    peerPotentialEliminations,
    sectorsForRcc,
  });
})(globalThis);
