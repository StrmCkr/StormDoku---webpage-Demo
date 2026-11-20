/* Select a chain result and refresh the related report panels. */
(function installSelectedChainController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, reports, actions }) {
    function select(index) {
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedChainIndex = index;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.activeStep = null;
      state.lastRemoved = [];
      state.selectedFishKey = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;

      actions.renderBoard();
      actions.renderFishReport();
      actions.renderNakedSubsetReport();
      actions.renderBoxLineReport();
      actions.renderHiddenSubsetReport();
      actions.renderChainReport();
      if (reports.alsSearchFamily()) actions.renderAlsSearchResults();
      if (reports.ahsSearchFamily()) actions.renderAhsSearchResults();
      actions.setStatus(`Chain ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { select };
  }

  app.selectedChainController = { create };
})(window);
