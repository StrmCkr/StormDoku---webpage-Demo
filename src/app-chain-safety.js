/* StormDoku shared chain-elimination safety checks. */
(function installChainSafety(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, getCandidates, getSolution, getPuzzle }) {
    function flags(chain, candidateGrid = getCandidates(), expectedSolution = getSolution(), fixedGrid = getPuzzle()) {
      if (!Array.isArray(expectedSolution) || expectedSolution.length !== 81) return [];

      const remaining = candidateGrid.map(values => new Set(values || []));
      const solutionFitsCandidates = expectedSolution.every((digit, cell) => {
        const values = candidateGrid[cell] || [];
        return !values.length || values.includes(digit);
      });
      const fixedGridFitsCandidates = fixedGrid.every((digit, cell) => {
        if (!digit) return true;
        const values = candidateGrid[cell] || [];
        return !values.length || values.includes(digit);
      });
      const reasons = [];
      const seen = new Set();
      const addReason = (key, text) => {
        if (seen.has(key)) return;
        seen.add(key);
        reasons.push(text);
      };

      for (const item of chain.eliminations || []) {
        const cell = Number(item.cell);
        const digit = Number(item.digit);
        if (!Number.isInteger(cell) || cell < 0 || cell >= 81) continue;
        if (!Number.isInteger(digit) || digit < 1 || digit > 9) continue;

        if (solutionFitsCandidates && expectedSolution[cell] === digit) {
          addReason(
            `solution:${cell}:${digit}`,
            `removes solution ${digit} from ${core.cellName(cell)}`,
          );
        }
        remaining[cell]?.delete(digit);
      }

      for (let cell = 0; cell < 81; cell++) {
        if ((candidateGrid[cell] || []).length > 0 && remaining[cell].size === 0) {
          addReason(`empty-cell:${cell}`, `empties ${core.cellName(cell)}`);
        }
      }

      if (fixedGridFitsCandidates) {
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const unit = core.UNITS[sector];
          for (let digit = 1; digit <= 9; digit++) {
            if (unit.some(cell => fixedGrid[cell] === digit)) continue;
            if (unit.some(cell => remaining[cell].has(digit))) continue;
            const name = core.sectorGroupName([sector]);
            addReason(`sector:${sector}:${digit}`, `leaves ${name} with no place for ${digit}`);
          }
        }
      }

      return reasons;
    }

    return { flags };
  }

  app.chainSafety = { create };
})(window);
