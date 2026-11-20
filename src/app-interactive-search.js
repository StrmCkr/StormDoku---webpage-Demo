/* Interactive Next/Run All search dispatch and worker recovery. */
(function installInteractiveSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    async function chooseInteractiveStep({ allowSynchronousFallback = false } = {}) {
      const context = getContext();
      context.syncVariantSettingsFromControls();
      context.configureVariants(context.variantSettings);
      context.lastInteractiveSearchError = null;
      context.lastChainSelectionDiagnostics = null;
      const profile = context.interactiveTechniqueProfile();
      const fallback = () => context.chooseSolverStep(
        context.cand,
        context.puzzle,
        'interactive',
        context.solution,
        profile,
      );
      // Keep the cheap hierarchy phases synchronous and authoritative. A
      // worker that starts with a stale/empty subset result must not expose a
      // size-2 fish before singles, BLR, or size-2 subsets have been checked.
      for (const phase of context.solverPhasePlan(profile)) {
        if (phase.kind !== 'direct') break;
        if (phase.name === 'very-easy-fish') break;
        const direct = context.directSolverPhaseStep(context.cand, context.puzzle, phase, profile);
        if (direct?.step) return direct;
      }
      try {
        // Bound each worker operation, rather than the sum of all successful
        // hierarchy phases. Progress resets the inactivity timeout.
        let timeoutId;
        let refreshTimeout;
        const timeout = new Promise((_, reject) => {
          refreshTimeout = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              const error = new Error('Interactive search worker timed out.');
              error.code = 'INTERACTIVE_SEARCH_TIMEOUT';
              reject(error);
            }, 15000);
          };
          refreshTimeout();
        });
        context.interactiveSearchProgress = refreshTimeout;
        try {
          const workerChoice = await Promise.race([
            context.chooseSolverStepInWorker(
              context.cand, context.puzzle, context.solution, profile, 'interactive',
            ),
            timeout,
          ]);
          if (workerChoice?.step || workerChoice?.incomplete) return workerChoice;
          // The worker runs the same ordered hierarchy. Repeating its complete
          // no-move search synchronously can freeze the page on hard grids.
          return null;
        } finally {
          if (context.interactiveSearchProgress === refreshTimeout) {
            context.interactiveSearchProgress = null;
          }
          clearTimeout(timeoutId);
        }
      } catch (error) {
        if (context.isSearchCancelled(error)) throw error;
        context.finishSearchDiagnostics(error.message || 'Search failed.');
        context.lastInteractiveSearchError = error;
        // Keep file:// pages and browsers without worker support usable, and
        // recover from a worker that is stuck in an older/high-cost phase.
        const worker = context.searchWorker;
        context.searchWorker = null;
        if (worker) worker.terminate();
        context.releaseSearchWorkerBlobUrl();
        for (const job of context.searchWorkerJobs.values()) job.reject(error);
        context.searchWorkerJobs.clear();
        if (error?.code === 'INTERACTIVE_SEARCH_TIMEOUT') return null;
        if (!allowSynchronousFallback) return null;
        return fallback();
      }
    }

    return { chooseInteractiveStep };
  }

  app.interactiveSearch = { create };
})(window);
