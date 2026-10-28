/* StormDoku chain ALS/AHS node-limit calculations. */
(function installChainNodeLimits(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(elements) {
    function get(family = 'chain') {
      const useAls = family === 'alc'
        ? elements.useAlc?.checked !== false
        : elements.useAls?.checked !== false;
      const useAhs = family === 'alc'
        ? elements.useAlc?.checked !== false
        : elements.useAhs?.checked !== false;
      const alsSize = Number(elements.alsSize?.value);
      const ahsSize = Number(elements.ahsSize?.value);
      const alcSize = Number(elements.alcSize?.value);
      const selectedAlsSize = family === 'alc' ? alcSize : alsSize;
      const selectedAhsSize = family === 'alc' ? alcSize : ahsSize;
      return {
        alsMaxCells: useAls && Number.isInteger(selectedAlsSize) ? Math.min(9, Math.max(2, selectedAlsSize)) : null,
        alsMaxSizeDOF: useAls && Number.isInteger(selectedAlsSize) ? Math.min(8, Math.max(0, selectedAlsSize - 1)) : null,
        alsMaxSizeFox: useAls && Number.isInteger(selectedAlsSize) ? Math.min(8, Math.max(1, selectedAlsSize)) : null,
        ahsMaxDigits: useAhs && Number.isInteger(selectedAhsSize) ? Math.min(9, Math.max(2, selectedAhsSize)) : null,
        ahsMaxCells: useAhs && Number.isInteger(selectedAhsSize) ? Math.min(9, Math.max(2, selectedAhsSize + 3)) : null,
        ahsMaxSize: useAhs && Number.isInteger(selectedAhsSize) ? Math.min(8, Math.max(1, selectedAhsSize - 1)) : null,
        ahsMaxFox: useAhs && Number.isInteger(selectedAhsSize) ? Math.min(8, Math.max(1, selectedAhsSize + 2)) : null,
      };
    }
    return { get };
  }

  app.chainNodeLimits = { create };
})(window);
