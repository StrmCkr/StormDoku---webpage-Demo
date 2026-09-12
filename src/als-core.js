(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core.setTools) throw new Error('set-tools-core.js must load before als-core.js');
  const DUPLICATES_A = new Set([9, 10, 17, 30, 31, 35, 42, 43, 44]);
  const DUPLICATES_B = new Set([45, 109, 128]);
  const DUPLICATES_C = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const {
    combinations,
    powerSetIndexes,
    candidateDigits,
    peerPotentialEliminations,
    sectorsForRcc,
  } = core.setTools;
  let nextAlsId = 0;

  function boxEnforcer(sector, positionSize, powerSetIndex) {
    if (sector >= 18) return false;
    if (positionSize === 0 && DUPLICATES_C.has(powerSetIndex)) return true;
    if (positionSize === 2 && DUPLICATES_B.has(powerSetIndex)) return true;
    if (positionSize === 1 && DUPLICATES_A.has(powerSetIndex)) return true;
    return false;
  }

  function normaliseOptions(options = {}) {
    return {
      maxSizeDOF: Number.isInteger(options.maxSizeDOF) ? Math.max(0, Math.min(8, options.maxSizeDOF)) : 8,
      maxSizeFox: Number.isInteger(options.maxSizeFox) ? Math.max(0, Math.min(8, options.maxSizeFox)) : 7,
      searchLimit: options.searchLimit ?? false,
      sizeLimit: options.sizeLimit ?? false,
    };
  }

  function containsDofZeroSubset(cand, cells) {
    for (let size = 1; size < cells.length; size++) {
      for (const subset of combinations(cells, size)) {
        if (candidateDigits(cand, subset).length === size) return true;
      }
    }
    return false;
  }

  function buildAls(cand, sector, positionSize, fox, cells, powerSetIndex) {
    const digits = candidateDigits(cand, cells);
    const rccList = digits.map(digit => {
      const rccCells = cells.filter(cell => cand[cell].includes(digit));
      return {
        rccDigit: digit,
        rccCells,
        rccPotentialElim: peerPotentialEliminations(cand, digit, rccCells),
        rccSectors: sectorsForRcc(cand, digit, rccCells, sector),
      };
    });

    return {
      alsSector: sector,
      alsSize: positionSize,
      alsFOX: fox,
      alsDOF: fox - positionSize,
      PowerSet: powerSetIndex,
      alsDigits: digits,
      alsAllCells: [...cells],
      rccList,
      uniqueID: nextAlsId++,
    };
  }

  function alsConstructor(cand, options = {}) {
    nextAlsId = 0;
    const opts = normaliseOptions(options);
    const alsList = [];

    for (let sector = 0; sector < core.UNITS.length; sector++) {
      const activeCells = core.UNITS[sector].filter(cell => (cand[cell] || []).length >= 2);
      const sectorDigits = new Set(candidateDigits(cand, activeCells));
      if (!activeCells.length) continue;

      for (let positionSize = 0; positionSize <= opts.maxSizeDOF; positionSize++) {
        const cellCount = positionSize + 1;
        if (cellCount > activeCells.length) continue;

        for (const cells of combinations(activeCells, cellCount)) {
          const positions = cells.map(cell => core.UNITS[sector].indexOf(cell));
          const powerSetIndex = powerSetIndexes.get(positions.join(','));
          if (powerSetIndex === undefined) continue;

          for (let fox = positionSize; fox <= opts.maxSizeFox + 1; fox++) {
            const dof = fox - positionSize;
            const digitCount = fox + 1;
            if (opts.searchLimit && dof !== 1) continue;
            if (opts.sizeLimit && dof > 0) continue;
            if (sectorDigits.size < digitCount) continue;
            if (boxEnforcer(sector, positionSize, powerSetIndex) && dof > 0) continue;

            const digits = candidateDigits(cand, cells);
            if (digits.length !== digitCount) continue;
            if (dof === 1 && containsDofZeroSubset(cand, cells)) continue;
            alsList.push(buildAls(cand, sector, positionSize, fox, cells, powerSetIndex));
          }
        }
      }
    }

    return alsList;
  }

  core.alsConstructor = alsConstructor;
  core.buildAls = alsConstructor;
})(globalThis);
