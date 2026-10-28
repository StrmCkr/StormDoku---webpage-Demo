/* StormDoku 3D-Medusa Multi-colouring build orchestration. */
(function installThreeDMedusaMultiBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runThreeDMedusaMultiBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching 3D - Medusa {Multi-colouring}...');

      actions.scheduleSearch(async () => {
        try {
          const currentStrongLinks = await actions.runCoreSearch('buildStrongLinks', state.cand);
          state.threeDMedusaMultiReport = actions.annotateColouringReports(
            await actions.runCoreSearch('buildThreeDMedusaMultiColoring', state.cand, currentStrongLinks),
          );
          state.selectedThreeDMedusaMultiIndex = state.threeDMedusaMultiReport.length ? 0 : null;
          state.selectedSimpleColoringIndex = null;
          state.selectedThreeDMedusaIndex = null;
          state.selectedMultiColoringIndex = null;
          state.selectedSuperMultiColoringIndex = null;
          state.activeStep = null;
          state.lastRemoved = [];
          actions.renderSimpleColoringReport();
          actions.renderThreeDMedusaReport();
          actions.renderMultiColoringReport();
          actions.renderSuperMultiColoringReport();
          actions.renderThreeDMedusaMultiReport();
          actions.renderBoard();
          actions.openReportPanel(elements.results);
          actions.setStatus(
            state.threeDMedusaMultiReport.length
              ? '3D-Medusa Multi-colouring found ' + state.threeDMedusaMultiReport.length
                + ' result' + (state.threeDMedusaMultiReport.length === 1 ? '' : 's') + '.'
              : '3D-Medusa Multi-colouring found no legal eliminations.',
            state.threeDMedusaMultiReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.threeDMedusaMultiReport = null;
          state.selectedThreeDMedusaMultiIndex = null;
          actions.renderThreeDMedusaMultiReport();
          actions.renderBoard();
          console.error('3D-Medusa Multi-colouring search failed:', error);
          actions.setStatus('Could not search 3D-Medusa {Multi-colouring}.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.threeDMedusaMultiBuild = { create };
})(window);
