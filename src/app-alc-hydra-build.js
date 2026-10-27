/* StormDoku ALC-Hydra build orchestration. */
(function installAlcHydraBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return async function runAlcHydraBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALC-Hydra continuations...');
      try {
        state.alcHydraReport = await actions.runSearchWorker('hydra-alc-dof', {
          candidateGrid: state.cand,
          maxDigits: Math.max(2, Math.min(9, Number(elements.alcDofMaxDigits.value) || 5)),
          maxAuxiliary: Math.max(1, Math.min(9, Number(elements.alcDofMaxAuxiliary.value) || 5)),
          maxResults: Math.max(1, Math.min(5000, Number(elements.alcDofMaxResults.value) || 300)),
          maxParticipants: 1000,
          aicDepth: 4,
          includeHydra: elements.alcDofHydraEnabled.checked,
        });
        state.selectedAlsHydraIndex = null;
        state.selectedHydraFamily = null;
        actions.renderAlcHydraReport();
        actions.openReportPanel(elements.alcHydraResults);
        const count = (state.alcHydraReport.results || []).length;
        actions.setStatus(`ALC-Hydra search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
      } catch (error) {
        if (actions.isSearchCancelled(error)) return;
        state.alcHydraReport = null;
        actions.renderAlcHydraReport();
        actions.setStatus(`Could not search ALC-Hydra: ${error.message || error}`, 'warn');
      } finally {
        actions.setBusy(false, searchToken);
      }
    };
  }

  app.alcHydraBuild = { create };
})(window);
