/* StormDoku simple-colouring and simple 3D-Medusa reports. */
(function installColouringReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, model, view, elements, state, actions }) {
    const simpleEureka = record => model.simpleColoringEureka(core, record);
    const medusaEureka = record => model.threeDMedusaEureka(core, record);

    function clearOtherSelections() {
      state.selectedMultiIndex = null;
      state.selectedMedusaMultiIndex = null;
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

    function renderSimple() {
      view.render({
        report: state.simpleReport,
        container: elements.simple,
        label: 'Simple Colouring',
        emptyText: 'No Simple Colouring search has been run.',
        noResultText: 'No legal eliminations were found using strong-link type 0.',
        eureka: simpleEureka,
        selectedIndex: state.selectedSimpleIndex,
        onSelect: index => selectSimple(index),
      });
    }

    function renderMedusa() {
      view.render({
        report: state.medusaReport,
        container: elements.medusa,
        label: '3D-Medusa {Simple}',
        emptyText: 'No 3D-Medusa search has been run.',
        noResultText: 'No legal eliminations were found using strong-link types 0 and 4.',
        eureka: medusaEureka,
        selectedIndex: state.selectedMedusaIndex,
        onSelect: index => selectMedusa(index),
      });
    }

    function selectSimple(index) {
      state.selectedSimpleIndex = index;
      state.simpleBreadth = 1;
      state.selectedMedusaIndex = null;
      clearOtherSelections();
      actions.renderBoard();
      renderSimple();
      renderMedusa();
      actions.setStatus(`Simple Colouring result ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    function selectMedusa(index) {
      state.selectedMedusaIndex = index;
      state.medusaBreadth = 1;
      state.selectedSimpleIndex = null;
      clearOtherSelections();
      actions.renderBoard();
      renderSimple();
      renderMedusa();
      actions.setStatus(`3D-Medusa result ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { renderSimple, renderMedusa };
  }

  app.colouringReportController = { create };
})(window);
