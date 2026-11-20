/* Rate generated puzzles through the existing solver worker. */
(function installGeneratedPuzzleRating(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    async function rate(grid, expectedSolution, targetCategory = 'any', profileOverride = undefined) {
      const context = getContext();
      const ratingTimeoutMs = 15000;
      let timeoutId = null;
      try {
        const profile = profileOverride === undefined
          ? context.generationTechniqueProfile(targetCategory)
          : profileOverride;
        const simulation = await Promise.race([
          context.solverSimulation.simulateSolverInWorker(
            grid, expectedSolution, profile, 'generator',
          ),
          new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => {
              const worker = context.searchWorker;
              context.searchWorker = null;
              if (worker) worker.terminate();
              context.releaseSearchWorkerBlobUrl();
              for (const job of context.searchWorkerJobs.values()) {
                job.reject(new Error('Generated-grid rating timed out.'));
              }
              context.searchWorkerJobs.clear();
              reject(new Error('Generated-grid rating timed out.'));
            }, ratingTimeoutMs);
          }),
        ]);
        const rating = context.ratingFromSteps(simulation.steps, 'generated');
        return context.ratingWithSolvedState(
          rating,
          context.candidateGridIsSolved(simulation.cand, simulation.grid, expectedSolution),
        );
      } catch (error) {
        if (context.isSearchCancelled(error)) throw error;
        return {
          ...context.unknownRating(error?.message || 'Rating check failed.'),
          source: 'generated',
          solved: false,
        };
      } finally {
        if (timeoutId !== null) clearTimeout(timeoutId);
      }
    }

    return { rate };
  }

  app.generatedPuzzleRating = { create };
})(window);
