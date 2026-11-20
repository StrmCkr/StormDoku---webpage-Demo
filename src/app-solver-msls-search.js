/* MSLS solver search adapters for synchronous and worker execution. */
(function installSolverMslsSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    mslsSearch,
    runSearchWorker,
    getCandidates,
    mslsStepFromResult,
    ratingForStep,
    directMovePriority,
    isHigherPriorityMove,
  }) {
    const solverMslsOptions = (budget = 'interactive') => mslsSearch.solverOptions(budget);

    function bestMslsMoveFromReport(candidateGrid, report, profile = null) {
      return mslsSearch.bestSolverMove(report, profile, {
        stepFromResult: mslsStepFromResult,
        ratingForStep,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
      });
    }

    function findSolverMslsMove(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const options = solverMslsOptions(budget);
      const report = core.findMsls(candidateGrid, options);
      return bestMslsMoveFromReport(candidateGrid, report, profile);
    }

    async function findSolverMslsMoveInWorker(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const report = await runSearchWorker('msls', {
        candidateGrid,
        options: solverMslsOptions(budget),
      });
      return bestMslsMoveFromReport(candidateGrid, report, profile);
    }

    return { findSolverMslsMove, findSolverMslsMoveInWorker };
  }

  app.solverMslsSearch = { create };
})(window);
