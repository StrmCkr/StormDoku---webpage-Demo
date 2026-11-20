/* ALC solver search adapters for synchronous and worker execution. */
(function installSolverAlcSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    alcSearch,
    getAlcNodeLimitOptions,
    bestChainFromReport,
    runSearchWorker,
    getCandidates,
    getPuzzle,
    getSolution,
  }) {
    function options(phase, candidateGrid, budget = 'interactive') {
      return alcSearch.options(phase, budget, getAlcNodeLimitOptions());
    }

    function bestMoveFromReport(candidateGrid, report, phase, fixedGrid, expectedSolution, profile) {
      return alcSearch.bestMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
        bestChainFromReport,
      );
    }

    function findSolverAlcMove(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      budget = 'interactive',
      expectedSolution = getSolution(),
      profile = null,
      phase,
    ) {
      if (!phase?.alcType) return null;
      const searchOptions = options(phase, candidateGrid, budget);
      const report = alcSearch.run(core, candidateGrid, phase, searchOptions);
      const best = bestMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
      );
      if (best) best.alcReport = report;
      return best;
    }

    async function findSolverAlcMoveInWorker(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      budget = 'interactive',
      expectedSolution = getSolution(),
      profile = null,
      phase,
    ) {
      if (!phase?.alcType) return null;
      const searchOptions = options(phase, candidateGrid, budget);
      const report = await runSearchWorker(
        `alc-${phase.alcType}`,
        alcSearch.workerPayload(candidateGrid, searchOptions),
      );
      const best = bestMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
      );
      if (best) best.alcReport = report;
      return best;
    }

    return { findSolverAlcMove, findSolverAlcMoveInWorker };
  }

  app.solverAlcSearch = { create };
})(window);
