/* StormDoku Multi-colouring build orchestration. */
(function installMultiColoringBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runMultiColoringBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching Multi-colouring...');

      actions.scheduleSearch(async () => {
        try {
          const currentStrongLinks = await actions.runCoreSearch('buildStrongLinks', state.cand);
          state.multiColoringReport = actions.annotateColouringReports(
            await actions.runCoreSearch('buildMultiColoring', state.cand, currentStrongLinks),
          );
          state.selectedMultiColoringIndex = state.multiColoringReport.length ? 0 : null;
          state.selectedSimpleColoringIndex = null;
          state.selectedThreeDMedusaIndex = null;
          state.selectedSuperMultiColoringIndex = null;
          state.selectedThreeDMedusaMultiIndex = null;
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
            state.multiColoringReport.length
              ? `Multi-colouring found ${state.multiColoringReport.length} result${state.multiColoringReport.length === 1 ? '' : 's'}.`
              : 'Multi-colouring found no legal eliminations.',
            state.multiColoringReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.multiColoringReport = null;
          state.selectedMultiColoringIndex = null;
          state.selectedSuperMultiColoringIndex = null;
          state.selectedThreeDMedusaMultiIndex = null;
          actions.renderMultiColoringReport();
          actions.renderThreeDMedusaMultiReport();
          actions.renderBoard();
          console.error('Multi-colouring search failed:', error);
          actions.setStatus('Could not search Multi-colouring.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.multiColoringBuild = { create };
})(window);
