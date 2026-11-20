/* StormDoku chromatic graph result rendering and selection. */
(function installChromaticReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ view, elements, state, actions }) {
    function renderGraph() {
      view.renderGraphReport({
        element: elements.graph,
        report: state.graphReport,
        selectedIndex: state.selectedGraphIndex,
        onSelect: (record, index) => selectGraph(record, index),
      });
    }

    function renderAlsGraph() {
      view.renderAlsGraphReport({
        element: elements.alsGraph,
        report: state.alsGraphReport,
        selectedIndex: state.selectedAlsGraphIndex,
        onSelect: (record, index) => selectAlsGraph(record, index),
      });
    }

    function selectGraph(record, index) {
      state.selectedGraphIndex = index;
      state.activeStep = view.stepFromResult(record);
      actions.render();
      actions.openReportPanel(elements.graph);
      actions.focusMap();
      actions.setStatus(`Chromatic graph ${index + 1} selected.`, 'ok');
    }

    function selectAlsGraph(record, index) {
      state.selectedAlsGraphIndex = index;
      state.activeStep = view.stepFromResult(record);
      actions.render();
      actions.openReportPanel(elements.alsGraph);
      actions.focusMap();
      actions.setStatus(`ALS chromatic graph ${index + 1} selected.`, 'ok');
    }

    return { renderGraph, renderAlsGraph };
  }

  app.chromaticReportController = { create };
})(window);
