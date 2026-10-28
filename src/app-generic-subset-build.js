/* StormDoku generic naked/hidden subset build orchestration. */
(function installGenericSubsetBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runGenericSubsetBuild(kind) {
      const hidden = kind === 'hidden';
      const searchToken = actions.setBusy(true);
      actions.setStatus(`Searching ${hidden ? 'hidden' : 'naked'} subsets...`);

      actions.scheduleSearch(async () => {
        try {
          const options = hidden
            ? { kind, ahsList: state.ahsReport || undefined }
            : { kind, alsList: state.alsReport || undefined };
          const report = await actions.runCoreSearch('findGenericSubsetReports', state.cand, options);
          if (hidden) {
            state.hiddenSubsetReport = report;
            state.selectedHiddenSubsetSize = null;
            state.selectedHiddenSubsetKey = null;
            actions.renderHiddenSubsetReport();
            actions.openReportPanel(elements.hiddenResults);
          } else {
            state.nakedSubsetReport = report;
            state.selectedNakedSubsetSize = null;
            state.selectedNakedSubsetKey = null;
            actions.renderNakedSubsetReport();
            actions.openReportPanel(elements.nakedResults);
          }
          actions.setStatus(
            `${hidden ? 'Hidden' : 'Naked'} subset search complete. ${report.length} reports. `
              + 'Grid and solving history unchanged.',
            report.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          if (hidden) {
            state.hiddenSubsetReport = null;
            state.selectedHiddenSubsetSize = null;
            state.selectedHiddenSubsetKey = null;
            actions.renderHiddenSubsetReport();
          } else {
            state.nakedSubsetReport = null;
            state.selectedNakedSubsetSize = null;
            state.selectedNakedSubsetKey = null;
            actions.renderNakedSubsetReport();
          }
          actions.setStatus(`Could not search ${hidden ? 'hidden' : 'naked'} subsets.`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.genericSubsetBuild = { create };
})(window);
