/* StormDoku pure chain classification helpers. */
(function installChainClassification(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function isTransportAlsXyRingShape(chain) {
    if (!chain?.isRing) return false;
    const nodes = new Set();
    const addNode = subset => {
      const cells = [...new Set(subset?.cells || [])].sort((a, b) => a - b);
      const digits = [...new Set(subset?.digits || [])].sort((a, b) => a - b);
      if (cells.length && digits.length) nodes.add(`${cells.join(',')}|${digits.join('')}`);
    };
    for (const step of chain.steps || []) {
      const bivalve = step?.family === 'SL' && Number(step.linkType) === 4
        && step.entry?.cells?.length === 1 && step.exit?.cells?.length === 1
        && step.entry.cells[0] === step.exit.cells[0];
      if (bivalve) addNode({
        cells: [...step.entry.cells, ...step.exit.cells],
        digits: [...(step.entry.digits || []), ...(step.exit.digits || [])],
      });
      if (step?.family === 'ALS' || step?.linkTypeName === 'ALS_RCC') {
        addNode(step.module?.entrySideSubset || step.module?.entrySubset);
        addNode(step.module?.exitSideSubset || step.module?.exitSubset);
      }
    }
    const isOrdinaryStrong = step => step?.family === 'SL'
      && Number(step.linkType) >= 0 && Number(step.linkType) <= 3
      && step.linkTypeName !== 'ALS';
    return nodes.size === 3 && chain.steps.filter(isOrdinaryStrong).length === 1;
  }

  function normalizedChainStructureName(chain) {
    return isTransportAlsXyRingShape(chain) ? 'T-ALS-XY Ring' : String(chain?.structureName || 'AIC');
  }

  app.chainClassification = { isTransportAlsXyRingShape, normalizedChainStructureName };
})(window);
