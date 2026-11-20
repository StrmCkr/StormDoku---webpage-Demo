/* StormDoku Multi-colouring and 3D-Medusa multi report selection. */
(function installMultiColoringReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ view, elements, eureka, state, actions }) {
    function clearOtherSelections() {
      state.selectedSimpleIndex = null;
      state.selectedMedusaIndex = null;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.selectedChainIndex = null;
      state.selectedFishKey = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;
      state.activeStep = null;
      state.lastRemoved = [];
    }

    function renderMulti() {
      view.render({
        report: state.multiReport,
        container: elements.multi,
        label: 'Multi-colouring',
        emptyText: 'No Multi-colouring search has been run.',
        noResultText: 'No Multi-colouring results were found using type-0 strong-link nodes.',
        eureka: eureka.multi,
        selectedIndex: state.selectedMultiIndex,
        onSelect: index => selectMulti(index),
      });
    }

    function renderMedusaMulti() {
      view.render({
        report: state.medusaMultiReport,
        container: elements.medusaMulti,
        label: '3D-Medusa {Multi-colouring}',
        emptyText: 'No 3D-Medusa {Multi-colouring} search has been run.',
        noResultText: 'No legal 3D-Medusa Multi-colouring constructions were found.',
        eureka: eureka.medusaMulti,
        selectedIndex: state.selectedMedusaMultiIndex,
        onSelect: index => selectMedusaMulti(index),
      });
    }

    function renderPair() {
      renderMulti();
      renderMedusaMulti();
    }

    function selectMulti(index) {
      state.selectedMultiIndex = index;
      state.multiBreadth = 1;
      state.selectedMedusaMultiIndex = null;
      clearOtherSelections();
      actions.renderBoard();
      actions.renderOtherColouringReports();
      renderPair();
      actions.setStatus(`Multi-colouring result ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    function selectMedusaMulti(index) {
      state.selectedMedusaMultiIndex = index;
      state.medusaMultiBreadth = 1;
      state.selectedMultiIndex = null;
      clearOtherSelections();
      actions.renderBoard();
      actions.renderOtherColouringReports();
      renderPair();
      actions.setStatus(`3D-Medusa Multi-colouring result ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { renderMulti, renderMedusaMulti };
  }

  app.multiColoringReportController = { create };
})(window);
