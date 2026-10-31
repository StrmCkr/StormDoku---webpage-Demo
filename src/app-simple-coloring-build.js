/* StormDoku Simple Colouring build orchestration. */
(function installSimpleColoringBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runSimpleColoringBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching Simple Colouring...');

      actions.scheduleSearch(async () => {
        try {
          const currentStrongLinks = await actions.runCoreSearch('buildStrongLinks', state.cand);
          state.simpleColoringReport = actions.annotateColouringReports(
            await actions.runCoreSearch('buildSimpleColoring', state.cand, currentStrongLinks),
          );
          state.selectedSimpleColoringIndex = state.simpleColoringReport.length ? 0 : null;
          state.selectedThreeDMedusaIndex = null;
          state.selectedMultiColoringIndex = null;
          state.selectedThreeDMedusaMultiIndex = null;
          state.activeStep = null;
          state.lastRemoved = [];
          actions.renderSimpleColoringReport();
          actions.renderThreeDMedusaReport();
          actions.renderBoard();
          actions.openReportPanel(elements.results);
          actions.setStatus(
            state.simpleColoringReport.length
              ? `Simple Colouring found ${state.simpleColoringReport.length} result${state.simpleColoringReport.length === 1 ? '' : 's'}.`
              : 'Simple Colouring found no legal eliminations.',
            state.simpleColoringReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.simpleColoringReport = null;
          state.selectedSimpleColoringIndex = null;
          state.selectedThreeDMedusaIndex = null;
          actions.renderSimpleColoringReport();
          actions.renderBoard();
          console.error('Simple Colouring search failed:', error);
          actions.setStatus('Could not search Simple Colouring.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.simpleColoringBuild = { create };
})(window);
