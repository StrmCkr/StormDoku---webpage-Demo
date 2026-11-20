/* Solver phase helpers bound to the current chain-node controls. */
(function installSolverPhaseRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ solverPhase, chainNodeLimitOptions, chainSearchPhasePlan }) {
    const solverAhsMaxCells = (phase, profile = null) =>
      solverPhase.ahsMaxCells(phase, profile, chainNodeLimitOptions);
    const solverAhsCellPasses = (phase, profile = null) =>
      solverPhase.ahsCellPasses(phase, profile, chainNodeLimitOptions);
    const solverAlsCellPasses = (phase, profile = null) =>
      solverPhase.alsCellPasses(phase, profile, chainNodeLimitOptions);
    const solverSearchPasses = (phase, profile = null, budget = 'interactive') =>
      solverPhase.searchPasses(phase, profile, budget, {
        alsCellPasses: solverAlsCellPasses,
        ahsCellPasses: solverAhsCellPasses,
        ahsMaxCells: solverAhsMaxCells,
      });
    const solverAlsMaxCells = (phase, profile = null) =>
      solverPhase.alsMaxCells(phase, profile, chainNodeLimitOptions);

    return {
      solverChainPhasePlan: (maxDepth, profile = null) => solverPhase.chainPhasePlan(
        maxDepth,
        profile,
        chainSearchPhasePlan,
      ),
      phaseProfile: (profile, phase) => solverPhase.phaseProfile(profile, phase),
      solverAhsMaxCells,
      solverAhsCellPasses,
      solverAlsCellPasses,
      solverSearchPasses,
      solverAlsMaxCells,
      solverAlsPassCanStop: solverPhase.alsPassCanStop,
      solverAhsPassCanStop: solverPhase.ahsPassCanStop,
    };
  }

  app.solverPhaseRuntime = { create };
})(window);
