/* StormDoku shared ALS node normalization. */
(function installChainNodeAnalysis(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ chainModuleSubsets }) {
    function alsChainNodes(chain) {
      const steps = chain.steps || [];
      const isAlsRcc = step => step.family === 'ALS'
        && (
          String(step.linkTypeName || '').toUpperCase() === 'ALS_RCC'
          || chainModuleSubsets(step.module).length === 2
        );
      const isBivalentAls = step => step.family === 'SL'
        && Number(step.linkType) === 4
        && step.entry?.cells?.length === 1
        && step.exit?.cells?.length === 1
        && step.entry.cellKey === step.exit.cellKey;
      const isGroupedAls = step => {
        if (!['SL', 'ALS'].includes(step.family)) return false;
        if (step.family === 'SL' && Number(step.linkType) !== 4) return false;
        const cells = new Set([
          ...(step.entry?.cells || []),
          ...(step.exit?.cells || []),
        ]);
        const digits = new Set([
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
        ]);
        return cells.size > 1 && digits.size === cells.size + 1;
      };
      if (!steps.length || !steps.every(step =>
        isAlsRcc(step) || isBivalentAls(step) || isGroupedAls(step)
      )) return null;

      const nodes = [];
      const seen = new Set();
      for (const step of steps) {
        if (isBivalentAls(step) || isGroupedAls(step)) {
          const cells = [...new Set([
            ...(step.entry.cells || []),
            ...(step.exit.cells || []),
          ])].sort((a, b) => a - b);
          const digits = [...new Set([
            ...(step.entry.digits || []),
            ...(step.exit.digits || []),
          ])].sort((a, b) => a - b);
          const key = `BIVALVE|${cells.join(',')}|${digits.join('')}`;
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push({ id: key, cells, digits });
          }
          continue;
        }
        for (const subset of chainModuleSubsets(step.module)) {
          if (!subset) return null;
          const key = [
            subset.id ?? '',
            subset.cells.join(','),
            subset.digits.join(''),
          ].join('|');
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push(subset);
          }
        }
      }
      return nodes.length ? nodes : null;
    }

    return { alsChainNodes };
  }

  app.chainNodeAnalysis = { create };
})(window);
