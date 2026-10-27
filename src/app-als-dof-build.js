/* StormDoku ALS-DOF build orchestration. */
(function installAlsDofBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return async function runAlsDofBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALS-DOF auxiliary nets in the background...');

      try {
        const maxDigits = Math.min(9, Math.max(2, Number(elements.maxDigits.value) || 9));
        const maxAuxiliary = Math.min(9, Math.max(1, Number(elements.maxAuxiliary.value) || 9));
        elements.maxDigits.value = String(maxDigits);
        elements.maxAuxiliary.value = String(maxAuxiliary);

        const report = await actions.runSearchWorker('als-dof', {
          candidateGrid: state.cand,
          maxDigits,
          maxAuxiliary,
          maxResults: 5000,
          includeHydra: elements.hydraEnabled.checked,
          aicDepth: Math.min(8, Math.max(2, Number(elements.chainDepth.value) || 4)),
          strongLinkTypes: [0, 1, 2, 3, 4],
          includeAhs: true,
        });
        state.alsReport = null;
        state.alsDofReport = report;
        state.selectedAlsDof = null;
        state.selectedAlsDofIndex = null;
        state.selectedAlsDofSource = 'net';
        state.selectedAlsId = null;
        actions.renderAlsReport();
        actions.renderAlsDofReport();
        actions.openReportPanel(elements.results);
        const count = state.alsDofReport.results.length;
        actions.setStatus(
          `ALS-DOF net search complete. ${count} net${count === 1 ? '' : 's'} found.`,
          count ? 'ok' : 'warn',
        );
      } catch (error) {
        if (actions.isSearchCancelled(error)) return;
        state.alsDofReport = null;
        actions.renderAlsDofReport();
        console.error('ALS-DOF auxiliary-net search failed:', error);
        actions.setStatus(`Could not search ALS-DOF auxiliary nets: ${error.message || error}`, 'warn');
      } finally {
        actions.setBusy(false, searchToken);
      }
    };
  }

  app.alsDofBuild = { create };
})(window);
