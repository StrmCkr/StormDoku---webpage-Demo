(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core.setTools) throw new Error('set-tools-core.js must load before ahs-core.js');
  const DUPLICATES_A = new Set([9, 10, 17, 30, 31, 35, 42, 43, 44]);
  const DUPLICATES_B = new Set([45, 109, 128]);
  const { combinations, powerSetIndexes, candidateDigits } = core.setTools;
  let nextAhsId = 0;

  function boxEnforcer(sector, powerSetIndex, dof) {
    if (sector >= 18 || dof <= 0) return false;
    return DUPLICATES_A.has(powerSetIndex) || DUPLICATES_B.has(powerSetIndex);
  }

  function candidateCellsForDigits(cand, sectorCells, digits) {
    const selected = new Set(digits);
    return sectorCells.filter(cell => (cand[cell] || []).some(digit => selected.has(digit)));
  }

  function normaliseOptions(options = {}) {
    return {
      maxSize: Number.isInteger(options.maxSize) ? Math.max(0, Math.min(8, options.maxSize)) : 8,
      maxSizeFox: Number.isInteger(options.maxSizeFox) ? Math.max(0, Math.min(8, options.maxSizeFox)) : 7,
      searchLimit: options.searchLimit ?? false,
      sizeLimit: options.sizeLimit ?? false,
    };
  }

  function buildAhs(cand, sector, positionSize, fox, digits, cells, digitPowerSet, cellPowerSet) {
    const selected = new Set(digits);
    const rccList = cells.map(cell => ({
      rccCell: cell,
      rccDigits: (cand[cell] || []).filter(digit => !selected.has(digit)),
      rccPotentialElim: [cell],
      rccSectors: [sector],
    }));

    return {
      ahsSector: sector,
      ahsSize: positionSize,
      ahsFOX: fox,
      ahsDOF: fox - positionSize,
      ahsDigits: [...digits],
      ahsAllCells: [...cells],
      PowerSet: digitPowerSet,
      cellPowerSet: cellPowerSet,
      rccList,
      uniqueID: `ahs-${nextAhsId++}`,
    };
  }

  function ahsConstructor(cand, options = {}) {
    const opts = normaliseOptions(options);
    const ahsList = [];

    for (let sector = 0; sector < core.UNITS.length; sector++) {
      const sectorCells = core.UNITS[sector];
      const activeCells = sectorCells.filter(cell => (cand[cell] || []).length > 0);
      const sectorDigits = candidateDigits(cand, activeCells);
      if (!activeCells.length) continue;

      for (let positionSize = 0; positionSize <= opts.maxSize; positionSize++) {
        const digitCount = positionSize + 1;
        if (digitCount > sectorDigits.length) continue;

        for (const digits of combinations(sectorDigits, digitCount)) {
          // PowerSet indexes use the absolute digit positions 0..8, not the
          // compressed list of digits present in this sector.
          const digitPositions = digits.map(digit => digit - 1);
          const digitPowerSet = powerSetIndexes.get(digitPositions.join(','));
          if (digitPowerSet === undefined) continue;

          const cells = candidateCellsForDigits(cand, activeCells, digits);
          const cellCount = cells.length;
          const fox = cellCount - 1;
          const dof = fox - positionSize;
          if (fox < positionSize || fox > opts.maxSizeFox + 1) continue;
          if (opts.searchLimit && dof !== 1) continue;
          if (opts.sizeLimit && dof > 0) continue;
          const cellPositions = cells.map(cell => sectorCells.indexOf(cell));
          const cellPowerSet = powerSetIndexes.get(cellPositions.join(','));
          if (cellPowerSet === undefined) continue;
          if (boxEnforcer(sector, cellPowerSet, dof)) continue;
          ahsList.push(buildAhs(cand, sector, positionSize, fox, digits, cells, digitPowerSet, cellPowerSet));
        }
      }
    }

    return ahsList;
  }

  core.ahsConstructor = ahsConstructor;
  core.buildAhs = ahsConstructor;
})(globalThis);
