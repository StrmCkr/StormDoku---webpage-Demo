/* StormDoku top-level presentation render cycle. */
(function installRenderCycle(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(callbacks) {
    function render() {
      callbacks.renderDigitFocusButtons();
      callbacks.renderBoard();
      callbacks.renderStrings();
      callbacks.renderRatingReport();
      callbacks.renderLog();
      callbacks.renderSolutionActions();
      callbacks.renderPomReport();
      callbacks.renderAlsReport();
      callbacks.renderAlsLinkReport();
      callbacks.renderAhsReport();
      callbacks.renderAhsLinkReport();
      callbacks.renderStrongLinkReport();
      callbacks.renderSimpleColoringReport();
      callbacks.renderThreeDMedusaReport();
      callbacks.renderMultiColoringReport();
      callbacks.renderThreeDMedusaMultiReport();
      callbacks.renderChromaticGraphReport();
      callbacks.renderChromaticAlsGraphReport();
      callbacks.renderFishReport();
      callbacks.renderMslsReport();
      callbacks.renderAlsDofReport();
      callbacks.renderAlsHydraReport();
      callbacks.renderNakedSubsetReport();
      callbacks.renderBoxLineReport();
      callbacks.renderHiddenSubsetReport();
      callbacks.renderChainReport();
      callbacks.updateHistoryButtons();
    }

    return { render };
  }

  app.renderCycle = { create };
})(window);
