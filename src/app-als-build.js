/* StormDoku ALS constructor build orchestration. */
(function installAlsBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAlsBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Building LS / ALS records...');
      actions.scheduleSearch(async () => {
        try {
          state.alsReport = await actions.runCoreSearch('alsConstructor', state.cand);
          state.selectedAlsDof = null;
          state.selectedAlsDofIndex = null;
          state.selectedAlsId = null;
          state.selectedAhsId = null;
          state.openAlsSizeGroups.clear();
          state.alsLinkReport = null;
          state.chainReport = null;
          actions.renderAlsReport();
          actions.openReportPanel(elements.results);
          actions.renderAlsLinkReport();
          actions.renderChainReport();
          actions.setStatus(`LS / ALS build complete. ${state.alsReport.length} records. Grid and solving history unchanged.`, 'ok');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alsReport = null;
          state.selectedAlsDof = null;
          state.selectedAlsId = null;
          state.selectedAhsId = null;
          state.openAlsSizeGroups.clear();
          state.alsLinkReport = null;
          state.chainReport = null;
          actions.renderAlsReport();
          actions.renderAlsLinkReport();
          actions.renderChainReport();
          actions.setStatus('Could not build LS / ALS records.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.alsBuild = { create };
})(window);
