/* StormDoku ALS-DOF chain build orchestration. */
(function installAlsDofChainBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAlsDofChainBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALS-DOF chains...');

      actions.scheduleSearch(async () => {
        try {
          const maxDigits = Math.min(9, Math.max(2, Number(elements.maxDigits.value) || 5));
          const maxAuxiliary = Math.min(9, Math.max(1, Number(elements.maxAuxiliary.value) || 5));
          const maxResults = Math.min(5000, Math.max(1, Number(elements.maxResults.value) || 500));
          elements.maxDigits.value = String(maxDigits);
          elements.maxAuxiliary.value = String(maxAuxiliary);
          elements.maxResults.value = String(maxResults);
          state.alsDofChainReport = await actions.runSearchWorker('als-dof-chain', {
            candidateGrid: state.cand,
            maxDigits,
            maxAuxiliary,
            maxResults,
            includeHydra: elements.hydraEnabled.checked,
            aicDepth: Math.min(8, Math.max(2, Number(elements.chainDepth.value) || 4)),
            strongLinkTypes: [0, 1, 2, 3, 4],
            includeAhs: true,
          });
          state.selectedAlsHydraIndex = null;
          state.selectedHydraFamily = null;
          state.selectedAlsDof = null;
          state.selectedAlsDofIndex = null;
          state.selectedAlsDofSource = 'chain';
          state.selectedAlsId = null;
          actions.renderAlsReport();
          actions.renderAlsDofReport();
          actions.openReportPanel(elements.results);
          const count = state.alsDofChainReport.results.length;
          actions.setStatus(
            `ALS-DOF chain search complete. ${count} chain${count === 1 ? '' : 's'} found.`,
            count ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alsDofChainReport = null;
          actions.renderAlsDofReport();
          actions.setStatus(`Could not search ALS-DOF chains: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.alsDofChainBuild = { create };
})(window);
