/* StormDoku ALS-Hydra build orchestration. */
(function installAlsHydraBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAlsHydraBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALS-Hydra continuations...');
      actions.scheduleSearch(async () => {
        try {
          const maxDigits = Math.min(9, Math.max(2, Number(elements.maxDigits.value) || 5));
          const maxAuxiliary = Math.min(9, Math.max(1, Number(elements.maxAuxiliary.value) || 5));
          const maxResults = Math.min(5000, Math.max(1, Number(elements.maxResults.value) || 500));
          state.alsHydraReport = await actions.runSearchWorker('hydra-als-dof', {
            candidateGrid: state.cand,
            maxDigits,
            maxAuxiliary,
            maxResults,
            aicDepth: 4,
            strongLinkTypes: [0, 1, 2, 3, 4],
            includeHydra: elements.hydraEnabled.checked,
            includeAhs: true,
          });
          state.selectedAlsHydraIndex = null;
          state.selectedHydraFamily = null;
          state.selectedAlsDof = null;
          state.selectedAlsDofIndex = null;
          state.selectedAlsDofSource = 'net';
          state.selectedAlsId = null;
          actions.renderAlsHydraReport();
          actions.openReportPanel(elements.results);
          const count = state.alsHydraReport.results.length;
          actions.setStatus(
            `ALS-Hydra search complete. ${count} result${count === 1 ? '' : 's'} found.`,
            count ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alsHydraReport = null;
          state.selectedAlsHydraIndex = null;
          actions.renderAlsHydraReport();
          actions.setStatus(`Could not search ALS-Hydra continuations: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.alsHydraBuild = { create };
})(window);
