/* StormDoku chain scoring modifiers. */
(function installChainModifiers(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(getModuleSubsets) {
    const linkModifiers = Object.freeze({ 0: 0.01, 1: 0.03, 2: 0.04, 3: 0.05, 4: 0.06 });

    function chainAlsRccDigitModifier(chain) {
      const seen = new Set(); let modifier = 0;
      for (const step of chain?.steps || []) {
        if (step.family !== 'ALS' || String(step.linkTypeName || '').toUpperCase() !== 'ALS_RCC') continue;
        for (const subset of getModuleSubsets(step.module)) {
          if (!subset) continue;
          const digits = [...new Set((subset.digits || []).map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
          const key = [subset.id ?? '', (subset.cells || []).join(','), digits.join('')].join('|');
          if (seen.has(key)) continue;
          seen.add(key); modifier += 0.01 * digits.length;
        }
      }
      return modifier;
    }

    function chainAhsRccCellModifier(chain) {
      const seen = new Set(); let modifier = 0;
      for (const step of chain?.steps || []) {
        if (step.family !== 'AHS' || String(step.linkTypeName || '').toUpperCase() !== 'AHS_RCC') continue;
        for (const subset of getModuleSubsets(step.module)) {
          if (!subset) continue;
          const cells = [...new Set((subset.cells || []).map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
          const digits = [...new Set((subset.digits || []).map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
          const key = [subset.id ?? '', cells.join(','), digits.join('')].join('|');
          if (seen.has(key)) continue;
          seen.add(key); modifier += 0.01 * cells.length;
        }
      }
      return modifier;
    }

    function chainLinkScoreModifier(chain) {
      let modifier = chainAlsRccDigitModifier(chain) + chainAhsRccCellModifier(chain);
      for (const step of chain?.steps || []) {
        if (step.family !== 'SL') continue;
        const value = linkModifiers[Number(step.linkType)];
        if (value != null) modifier += value;
      }
      return Number(modifier.toFixed(3));
    }

    return { chainAlsRccDigitModifier, chainAhsRccCellModifier, chainLinkScoreModifier };
  }

  app.chainModifiers = { create };
})(window);
