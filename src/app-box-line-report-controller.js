/* StormDoku Box–Line Reduction report selection and grid highlighting. */
(function installBoxLineReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ stepListView, container, state, actions }) {
    function renderBoxLineReport() {
      stepListView.render({
        report: state.report,
        container,
        label: 'Box Line Reduction reports',
        selectedIndex: state.selectedIndex,
        descriptionFor: step => step.desc,
        onSelect: index => selectBoxLineReport(index),
      });
    }

    function selectBoxLineReport(index) {
      const report = state.report;
      if (!report?.[index]) return;
      state.selectedIndex = index;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedChainIndex = null;
      state.selectedFishKey = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;
      const step = report[index];
      state.activeStep = step;
      state.lastRemoved = step.elim?.items || [];
      actions.renderBoard();
      renderBoxLineReport();
      actions.setStatus(`Box Line Reduction ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { renderBoxLineReport, selectBoxLineReport };
  }

  app.boxLineReportController = { create };
})(window);
