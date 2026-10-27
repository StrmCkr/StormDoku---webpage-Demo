/* StormDoku AHS-DOF chain build orchestration. */
(function installAhsDofChainBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return async function runAhsDofChainBuild() {
      const searchToken = actions.setBusy(true);
      state.selectedAhsDofChainIndex = null;
      state.selectedAhsDofNetIndex = null;
      actions.setStatus('Searching AHS-DOF chains...');
      try {
        const payload = {
          candidateGrid: state.cand,
          minDof: 2,
          maxDof: Math.max(2, Math.min(3, Number(elements.maxDof.value) || 2)),
          maxAhsSize: 8,
          maxAhsFox: 7,
          maxCells: Math.max(2, Math.min(9, Number(elements.maxCells.value) || 6)),
          maxAuxiliary: Math.max(1, Math.min(9, Number(elements.maxAuxiliary.value) || 2)),
          maxDepth: Math.max(2, Math.min(5, Number(elements.maxDepth.value) || 3)),
          maxResults: Math.max(1, Math.min(5000, Number(elements.maxResults.value) || 500)),
          includeHydra: elements.hydraEnabled.checked,
        };
        elements.maxDof.value = String(payload.maxDof);
        elements.maxCells.value = String(payload.maxCells);
        elements.maxAuxiliary.value = String(payload.maxAuxiliary);
        elements.maxDepth.value = String(payload.maxDepth);
        elements.maxResults.value = String(payload.maxResults);
        state.ahsDofChainReport = await actions.runSearchWorker('ahs-dof-chain', payload);
        state.ahsHydraReport = state.ahsDofChainReport.hydraReport || null;
        actions.renderAhsDofChainResults(state.ahsDofChainReport);
        actions.renderAhsHydraReport();
        actions.openReportPanel(elements.results);
        const count = (state.ahsDofChainReport.results || state.ahsDofChainReport.links || []).length;
        actions.setStatus(`AHS-DOF chain search complete. ${count} chain${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
      } catch (error) {
        if (actions.isSearchCancelled(error)) return;
        state.ahsDofChainReport = null;
        actions.renderAhsDofChainResults(null);
        actions.setStatus(`Could not search AHS-DOF chains: ${error.message || error}`, 'warn');
      } finally {
        actions.setBusy(false, searchToken);
      }
    };
  }

  app.ahsDofChainBuild = { create };
})(window);
