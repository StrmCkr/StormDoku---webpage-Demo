/* StormDoku AHS constructor build orchestration. */
(function installAhsRecordBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAhsBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Building HS / AHS records...');

      actions.scheduleSearch(async () => {
        try {
          state.ahsReport = await actions.runCoreSearch('ahsConstructor', state.cand, {
            maxSize: 8,
            maxSizeFox: 7,
          });
          state.selectedAhsDof = null;
          state.selectedAhsId = null;
          state.openAhsSizeGroups.clear();
          state.chainReport = null;
          actions.renderAhsReport();
          actions.openReportPanel(elements.results);
          actions.renderChainReport();
          actions.setStatus(`HS / AHS build complete. ${state.ahsReport.length} records. Grid and solving history unchanged.`, 'ok');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.ahsReport = null;
          state.selectedAhsDof = null;
          state.selectedAhsId = null;
          state.openAhsSizeGroups.clear();
          state.chainReport = null;
          actions.renderAhsReport();
          actions.renderChainReport();
          actions.setStatus('Could not build HS / AHS records.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.ahsRecordBuild = { create };
})(window);
