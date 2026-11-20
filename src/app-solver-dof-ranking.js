/* DOF result selection adapters used by the solver hierarchy. */
(function installSolverDofRanking(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    selection,
    alsDofMoveEnabled,
    alsDofStepFromResult,
    modularAhsDofStepFromResult,
    modularAlsDofChainStepFromResult,
    modularAhsDofChainStepFromResult,
    directMovePriority,
    isHigherPriorityMove,
  }) {
    function bestAlsDofMoveFromReport(candidateGrid, report, enabledTypes, profile = null) {
      return selection.bestMove(candidateGrid, report, enabledTypes, profile, {
        moveEnabled: alsDofMoveEnabled,
        stepFromResult: alsDofStepFromResult,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
      });
    }

    function bestAhsDofMoveFromReport(candidateGrid, report, profile = null) {
      return selection.bestAhsMove(candidateGrid, report, profile, {
        stepFromResult: modularAhsDofStepFromResult,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
      });
    }

    function bestAlsDofChainMoveFromReport(candidateGrid, report, profile = null) {
      return selection.bestChainMove(candidateGrid, report, profile, {
        stepFromResult: modularAlsDofChainStepFromResult,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
        reportKey: 'alsDofChainReport',
        indexKey: 'alsDofChainIndex',
      });
    }

    function bestAhsDofChainMoveFromReport(candidateGrid, report, profile = null) {
      return selection.bestChainMove(candidateGrid, report, profile, {
        stepFromResult: modularAhsDofChainStepFromResult,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
        reportKey: 'ahsDofChainReport',
        indexKey: 'ahsDofChainIndex',
      });
    }

    return {
      bestAlsDofMoveFromReport,
      bestAhsDofMoveFromReport,
      bestAlsDofChainMoveFromReport,
      bestAhsDofChainMoveFromReport,
    };
  }

  app.solverDofRanking = { create };
})(window);
