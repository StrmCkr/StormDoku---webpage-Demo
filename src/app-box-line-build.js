/* StormDoku Box Line Reduction build orchestration. */
(function installBoxLineBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runBoxLineBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching Box Line Reduction...');

      actions.scheduleSearch(async () => {
        try {
          state.boxLineReport = await actions.runCoreSearch('findBoxLineReports', state.cand);
          state.selectedBoxLineIndex = null;
          actions.renderBoxLineReport();
          actions.openReportPanel(elements.results);
          actions.setStatus(
            `Box Line Reduction search complete. ${state.boxLineReport.length} reports. Grid and solving history unchanged.`,
            state.boxLineReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.boxLineReport = null;
          state.selectedBoxLineIndex = null;
          actions.renderBoxLineReport();
          actions.setStatus('Could not search Box Line Reduction.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.boxLineBuild = { create };
})(window);
