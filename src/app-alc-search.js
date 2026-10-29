/* ALC solver search-option construction. */
(function installAlcSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function options(phase, budget = 'interactive', nodeLimits = {}) {
    const fullFoxRange = phase?.fullFoxRange === true;
    const maxResults = budget === 'generator' ? 250 : 500;
    const common = {
      maxChains: maxResults,
      maxResultAttempts: budget === 'generator' ? 12000 : 30000,
      maxResultAttemptsPerStart: budget === 'generator' ? 600 : 1500,
      maxStates: budget === 'generator' ? 30000 : 60000,
      maxQueue: budget === 'generator' ? 30000 : 60000,
      maxBranching: budget === 'generator' ? 120 : 200,
    };
    const shared = {
      ...(nodeLimits.alsMaxSizeDOF == null ? {} : { alsMaxSizeDOF: nodeLimits.alsMaxSizeDOF }),
      ...(nodeLimits.alsMaxSizeFox == null ? {} : { alsMaxSizeFox: nodeLimits.alsMaxSizeFox }),
      ...(nodeLimits.ahsMaxSize == null ? {} : { ahsMaxSize: nodeLimits.ahsMaxSize }),
      ...(nodeLimits.ahsMaxFox == null ? {} : { ahsMaxFox: nodeLimits.ahsMaxFox }),
      ...(nodeLimits.ahsMaxCells == null ? {} : { maxAhsCells: Math.min(7, nodeLimits.ahsMaxCells) }),
    };
    if (phase.alcType === 'xz') return {
      ...common,
      maxAlsCells: fullFoxRange ? Math.min(8, nodeLimits.alsMaxCells ?? 8) : (nodeLimits.alsMaxCells ?? 5),
      maxAhsDigits: fullFoxRange ? Math.min(8, nodeLimits.ahsMaxDigits ?? 8) : 5,
      maxAhsCells: fullFoxRange ? Math.min(9, nodeLimits.ahsMaxCells ?? 9) : 7,
      maxAhsDof: 5,
      ...shared,
    };
    if (phase.alcType === 'xy') return {
      ...common, maxDepth: 3, maxAlsCells: nodeLimits.alsMaxCells ?? 5,
      maxAhsDigits: 5, maxAhsCells: 7, ...shared,
    };
    if (phase.alcType === 'chain') return {
      ...common, maxDepth: Math.max(4, phase.maxDepth || 8), maxAlsCells: nodeLimits.alsMaxCells ?? 5,
      maxAhsDigits: 5, maxAhsCells: 7, ...shared,
    };
    return {
      ...common,
      maxDepth: Math.max(3, phase.maxDepth || 8),
      maxDofRoots: budget === 'generator' ? 250 : 500,
      maxAlsDigits: nodeLimits.alsMaxSizeDOF == null ? 5 : nodeLimits.alsMaxSizeDOF + 1,
      maxAlsAuxiliary: 5, maxAhsDof: 3, maxAhsAuxiliary: 5,
      maxAhsCells: nodeLimits.ahsMaxCells ?? 7,
      maxSearchChains: budget === 'generator' ? 500 : 1000,
    };
  }

  function bestMoveFromReport(candidateGrid, report, phase, fixedGrid, expectedSolution, profile, bestChainFromReport) {
    const chainPhase = {
      ...(phase.chainPhase || {}),
      alcType: phase.alcType,
      family: `alc-${phase.alcType}`,
    };
    return bestChainFromReport(
      report,
      chainPhase,
      new Set(['chains']),
      candidateGrid,
      fixedGrid,
      expectedSolution,
      chainPhase.maxDepth || 8,
      profile,
    );
  }

  function run(core, candidateGrid, phase, searchOptions) {
    if (phase.alcType === 'xz') return core.findAlcXz(candidateGrid, searchOptions);
    if (phase.alcType === 'xy') return core.findAlcXy(candidateGrid, searchOptions);
    if (phase.alcType === 'chain') return core.findAlcChain(candidateGrid, searchOptions);
    return core.findAlcDofChains(candidateGrid, searchOptions);
  }

  function workerPayload(candidateGrid, searchOptions) {
    return { candidateGrid, ...searchOptions };
  }

  app.alcSearch = { options, bestMoveFromReport, run, workerPayload };
})(window);
