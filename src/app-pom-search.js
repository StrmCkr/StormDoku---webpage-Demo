/* POM check worker orchestration and result summary. */
(function installPomSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, elements, actions }) {
    function run() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Running POM check...');

      actions.scheduleSearch(async () => {
        try {
          state.report = await actions.runCoreSearch('pomCheck', state.candidates, state.puzzle);
          actions.renderReport();
          actions.openReportPanel(elements.results);
          const report = state.report;
          const omissionCount = report.omissions.reduce((total, item) => total + item.cells.length, 0);
          const totalReports = report.omissions.length
            + report.hiddenSubsets.length
            + report.nakedSubsets.length
            + report.tkDeletes.length;
          const details = [];
          if (totalReports) details.push(`${totalReports} reports`);
          if (omissionCount) details.push(`${omissionCount} omitted candidate cells`);
          if (report.tkDeletes.length) details.push(`${report.tkDeletes.length} TK-deletes`);
          actions.setStatus(
            `POM check complete.${details.length ? ` ${details.join(', ')}.` : ' No reports.'} Grid and solving history unchanged.`,
            'ok',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          actions.setStatus(`Could not run POM: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    }

    return { run };
  }

  app.pomSearch = { create };
})(window);
