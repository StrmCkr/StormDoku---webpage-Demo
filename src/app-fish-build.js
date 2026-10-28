/* StormDoku fish build orchestration. */
(function installFishBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runFishBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching N x (N + K) fish...');

      actions.scheduleSearch(async () => {
        try {
          state.fishReport = await actions.runSearchWorker('fish', {
            candidateGrid: state.cand,
            fixedGrid: state.puzzle,
            options: actions.currentPomFishOptions(),
          });
          state.selectedFishCategory = null;
          state.selectedFishSize = null;
          state.selectedFishKey = null;
          actions.renderFishReport();
          actions.openReportPanel(elements.results);
          actions.setStatus(
            'N x (N + K) fish search complete. ' + state.fishReport.length
              + ' reports. Grid and solving history unchanged.',
            state.fishReport.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.fishReport = null;
          state.selectedFishCategory = null;
          actions.renderFishReport();
          actions.setStatus('Could not search N x (N + K) fish.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.fishBuild = { create };
})(window);
