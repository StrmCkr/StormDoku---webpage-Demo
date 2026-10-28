/* StormDoku 3D-Medusa Simple build orchestration. */
(function installThreeDMedusaBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runThreeDMedusaBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching 3D - Medusa {Simple}...');

      actions.scheduleSearch(async () => {
        try {
          const currentStrongLinks = await actions.runCoreSearch('buildStrongLinks', state.cand);
          state.threeDMedusaReport = actions.annotateColouringReports(
            await actions.runCoreSearch('buildThreeDMedusa', state.cand, currentStrongLinks),
          );
          state.selectedThreeDMedusaIndex = state.threeDMedusaReport.length ? 0 : null;
          state.selectedSimpleColoringIndex = null;
          state.selectedMultiColoringIndex = null;
          state.selectedSuperMultiColoringIndex = null;
          state.selectedThreeDMedusaMultiIndex = null;
          state.activeStep = null;
          state.lastRemoved = [];
          actions.renderSimpleColoringReport();
          actions.renderThreeDMedusaReport();
          actions.renderBoard();
          actions.openReportPanel(elements.results);
          actions.setStatus(
            state.threeDMedusaReport.length
              ? `3D-Medusa found ${state.threeDMedusaReport.length} result${state.threeDMedusaReport.length === 1 ? '' : 's'}.`
              : '3D-Medusa found no legal eliminations.',
            state.threeDMedusaReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.threeDMedusaReport = null;
          state.selectedThreeDMedusaIndex = null;
          actions.renderThreeDMedusaReport();
          actions.renderBoard();
          actions.setStatus('Could not search 3D-Medusa.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.threeDMedusaBuild = { create };
})(window);
