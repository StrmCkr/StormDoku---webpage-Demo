/* StormDoku board overlay presentation. */
(function installBoardOverlayView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ renderSectorFrames, renderChainOverlay, renderHydraAlsDofOverlay,
    renderAlsDofOverlay, renderStrongLinkOverlay }) {
    function render({ highlights, activeStep }) {
      if (highlights.isSubset) renderSectorFrames(activeStep?.base);
      if (highlights.isChain) renderChainOverlay(highlights.chain);
      for (const hydraChain of highlights.hydraChains || []) {
        if (hydraChain !== highlights.chain) renderChainOverlay(hydraChain);
      }
      if (highlights.isAlsDof) {
        if (highlights.alsDofRecord?.mode === 'hydra') renderHydraAlsDofOverlay(highlights.alsDofRecord);
        else renderAlsDofOverlay(highlights.alsDofRecord);
      }
      if (highlights.isStrongLink) renderStrongLinkOverlay(highlights.strongLink);
    }

    return { render };
  }

  app.boardOverlayView = { create };
})(window);
