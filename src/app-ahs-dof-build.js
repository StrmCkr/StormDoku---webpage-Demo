/* StormDoku AHS-DOF net build orchestration. */
(function installAhsDofBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return async function runAhsDofBuild() {
      const searchToken = actions.setBusy(true);
      state.selectedAhsDofNetIndex = null;
      const maxDof = Math.max(2, Math.min(3, Number(elements.maxDof.value) || 2));
      const maxCells = Math.max(2, Math.min(9, Number(elements.maxCells.value) || 6));
      const maxAuxiliary = Math.max(1, Math.min(9, Number(elements.maxAuxiliary.value) || 2));
      const maxResults = Math.max(1, Math.min(5000, Number(elements.maxResults.value) || 500));
      elements.maxDof.value = String(maxDof);
      elements.maxCells.value = String(maxCells);
      elements.maxAuxiliary.value = String(maxAuxiliary);
      elements.maxResults.value = String(maxResults);
      actions.setStatus('Searching verified AHS-DOF cell nets...');
      try {
        const report = await actions.runSearchWorker('ahs-dof', {
          candidateGrid: state.cand,
          minDof: 2,
          maxDof,
          maxAhsSize: 8,
          maxAhsFox: 7,
          maxCells,
          maxAuxiliary,
          maxResults,
        });
        state.ahsDofReport = report;
        actions.renderAhsDofResults(report);
        actions.openReportPanel(elements.results);
        const count = (report.results || report.links || []).length;
        actions.setStatus(`AHS-DOF search complete. ${count} verified net${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
      } catch (error) {
        if (actions.isSearchCancelled(error)) return;
        state.ahsDofReport = null;
        actions.renderAhsDofResults(null);
        actions.setStatus(`Could not search AHS-DOF: ${error.message || error}`, 'warn');
      } finally {
        actions.setBusy(false, searchToken);
      }
    };
  }

  app.ahsDofBuild = { create };
})(window);
