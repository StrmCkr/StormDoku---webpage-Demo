/* StormDoku ALC-XZ build orchestration. */
(function installAlcBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function createXz(context) {
    const { elements, state, actions } = context;
    return function runAlcXzBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALC-XZ...');
      actions.scheduleSearch(async () => {
        try {
          state.alcXzReport = await actions.runSearchWorker('alc-xz', {
            candidateGrid: state.cand,
            maxChains: 500,
            maxResultAttempts: 10000,
            maxResultAttemptsPerStart: 1000,
            maxStates: 30000,
            maxQueue: 30000,
            maxBranching: 200,
            maxAlsLinks: 5000,
            maxAhsLinks: 5000,
          });
          state.chainReport = state.alcXzReport;
          state.selectedChainIndex = state.alcXzReport.chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.alsSearchFamily = null;
          state.ahsSearchFamily = null;
          actions.renderChainReport();
          actions.renderAlcXzResults();
          actions.renderBoard();
          actions.openReportPanel(elements.alcSearchResults);
          const count = state.alcXzReport.chains.length;
          actions.setStatus(`ALC-XZ search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alcXzReport = null;
          state.chainReport = null;
          state.selectedChainIndex = null;
          actions.renderAlcXzResults();
          actions.setStatus(`Could not search ALC-XZ: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  function createXy(context) {
    const { elements, state, actions } = context;
    return function runAlcXyBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALC-XY...');
      actions.scheduleSearch(async () => {
        try {
          state.alcXyReport = await actions.runSearchWorker('alc-xy', {
            candidateGrid: state.cand,
            maxDepth: 3,
            maxChains: 500,
            maxResultAttempts: 20000,
            maxResultAttemptsPerStart: 1000,
            maxStates: 50000,
            maxQueue: 50000,
            maxBranching: 200,
            maxAlsLinks: 5000,
            maxAhsLinks: 5000,
          });
          state.chainReport = state.alcXyReport;
          state.selectedChainIndex = state.alcXyReport.chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.alsSearchFamily = null;
          state.ahsSearchFamily = null;
          actions.renderChainReport();
          actions.renderAlcXyResults();
          actions.renderBoard();
          actions.openReportPanel(elements.alcSearchResults);
          const count = state.alcXyReport.chains.length;
          actions.setStatus(`ALC-XY search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alcXyReport = null;
          state.chainReport = null;
          state.selectedChainIndex = null;
          actions.renderAlcXyResults();
          actions.setStatus(`Could not search ALC-XY: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  function createChain(context) {
    const { elements, state, actions } = context;
    return function runAlcChainBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALC-Chain...');
      actions.scheduleSearch(async () => {
        try {
          state.alcChainReport = await actions.runSearchWorker('alc-chain', {
            candidateGrid: state.cand,
            maxDepth: 6,
            maxChains: 500,
            maxResultAttempts: 30000,
            maxResultAttemptsPerStart: 1200,
            maxStates: 60000,
            maxQueue: 60000,
            maxBranching: 200,
            maxAlsLinks: 5000,
            maxAhsLinks: 5000,
          });
          state.chainReport = state.alcChainReport;
          state.selectedChainIndex = state.alcChainReport.chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.alsSearchFamily = null;
          state.ahsSearchFamily = null;
          actions.renderChainReport();
          actions.renderAlcChainResults();
          actions.renderBoard();
          actions.openReportPanel(elements.alcSearchResults);
          const count = state.alcChainReport.chains.length;
          actions.setStatus(`ALC-Chain search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alcChainReport = null;
          state.chainReport = null;
          state.selectedChainIndex = null;
          actions.renderAlcChainResults();
          actions.setStatus(`Could not search ALC-Chain: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  function createDof(context) {
    const { elements, state, actions } = context;
    return function runAlcDofBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Searching ALC-DOF Chain...');
      actions.scheduleSearch(async () => {
        try {
          state.alcDofReport = await actions.runSearchWorker('alc-dof', {
            candidateGrid: state.cand,
            maxDepth: 8,
            maxResults: 300,
            maxDofRoots: 500,
            maxAlsDigits: 5,
            maxAlsAuxiliary: 5,
            maxAhsDof: 3,
            maxAhsAuxiliary: 5,
            maxAhsCells: 7,
            maxSearchChains: 1500,
            maxResultAttempts: 30000,
            maxResultAttemptsPerStart: 1500,
            maxStates: 60000,
            maxQueue: 60000,
            maxBranching: 200,
            includeHydra: elements.alcDofHydraEnabled.checked,
          });
          state.alcHydraReport = state.alcDofReport.hydraReport || null;
          state.chainReport = state.alcDofReport;
          state.selectedChainIndex = state.alcDofReport.chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.alsSearchFamily = null;
          state.ahsSearchFamily = null;
          actions.renderChainReport();
          actions.renderAlcDofResults();
          actions.renderAlcHydraReport();
          actions.renderBoard();
          actions.openReportPanel(elements.alcSearchResults);
          const count = state.alcDofReport.chains.length;
          actions.setStatus(`ALC-DOF Chain search complete. ${count} result${count === 1 ? '' : 's'} found.`, count ? 'ok' : 'warn');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alcDofReport = null;
          state.chainReport = null;
          state.selectedChainIndex = null;
          actions.renderAlcDofResults();
          actions.setStatus(`Could not search ALC-DOF Chain: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.alcBuild = { createXz, createXy, createChain, createDof };
})(window);
