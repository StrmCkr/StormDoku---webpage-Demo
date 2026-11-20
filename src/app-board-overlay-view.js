/* StormDoku board overlay presentation. */
(function installBoardOverlayView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ renderSectorFrames, renderChainOverlay, renderHydraAlsDofOverlay,
    renderAlsDofOverlay, renderStrongLinkOverlay, renderUniquenessRccLinks }) {
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
      const uniquenessStrongLinks = activeStep?.uniquenessStrongLinks || [];
      const uniquenessRings = activeStep?.uniquenessRings || [];
      if (uniquenessRings.length) {
        for (const ring of uniquenessRings) renderChainOverlay(ring);
      } else {
        if (highlights.isStrongLink && !uniquenessStrongLinks.length) {
          renderStrongLinkOverlay(highlights.strongLink);
        }
        for (const link of uniquenessStrongLinks) renderStrongLinkOverlay(link);
      }
      if (activeStep?.uniquenessRccLinks?.length) {
        renderUniquenessRccLinks(activeStep.uniquenessRccLinks);
      }
    }

    return { render };
  }

  app.boardOverlayView = { create };
})(window);
