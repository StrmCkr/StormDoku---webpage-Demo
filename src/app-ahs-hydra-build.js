/* StormDoku AHS-Hydra build orchestration. */
(function installAhsHydraBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return async function runAhsHydraBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching AHS-Hydra continuations...');
      try {
        state.ahsHydraReport = await actions.runSearchWorker('hydra-ahs-dof', {
          candidateGrid: state.cand,
          maxDigits: Math.max(2, Math.min(8, Number(elements.maxDof.value) + 2 || 5)),
          maxAuxiliary: Math.max(1, Math.min(9, Number(elements.maxAuxiliary.value) || 2)),
          maxResults: Math.max(1, Math.min(5000, Number(elements.maxResults.value) || 500)),
          maxParticipants: 1000,
          aicDepth: Math.max(2, Math.min(7, Number(elements.maxDepth.value) || 3)),
          includeHydra: elements.hydraEnabled.checked,
        });
        state.selectedAlsHydraIndex = null;
        state.selectedHydraFamily = null;
        actions.renderAhsHydraReport();
        actions.openReportPanel(elements.results);
        const count = (state.ahsHydraReport.results || []).length;
        actions.setStatus(`AHS-Hydra search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
      } catch (error) {
        if (actions.isSearchCancelled(error)) return;
        state.ahsHydraReport = null;
        actions.renderAhsHydraReport();
        actions.setStatus(`Could not search AHS-Hydra: ${error.message || error}`, 'warn');
      } finally {
        actions.setBusy(false, searchToken);
      }
    };
  }

  app.ahsHydraBuild = { create };
})(window);
