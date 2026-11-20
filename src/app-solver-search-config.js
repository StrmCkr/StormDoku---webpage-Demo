/* Fish settings and worker payload construction for solver searches. */
(function installSolverSearchConfig(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    solverPhase,
    currentSolverMoveTypes,
    getPomFishOptions,
    getChainSearchOptions,
    getRequestedDepth,
    getChromaticOptions,
  }) {
    const basicFishMoveType = solverPhase.basicMoveType;

    function solverFishSizes(moveTypes = null, maxFishSize = 4) {
      const enabledTypes = currentSolverMoveTypes(moveTypes);
      return solverPhase.fishSizes(enabledTypes, maxFishSize, basicFishMoveType);
    }

    function solverFishMoveType(spec, k, category = 'Basic') {
      return solverPhase.moveType(spec, k, category, basicFishMoveType);
    }

    function solverFishOptions(candidateGrid, fixedGrid, moveTypes = null, profile = null) {
      const enabledTechniques = currentSolverMoveTypes(moveTypes);
      return solverPhase.fishOptions(
        candidateGrid,
        fixedGrid,
        enabledTechniques,
        getPomFishOptions(),
        core.omissionFishStep,
        solverFishSizes(enabledTechniques, profile?.maxFishSize ?? 4),
      );
    }

    function generatorWorkerConfig(candidateGrid, fixedGrid, profile, budget = 'generator', phase = null) {
      const requestedDepth = Math.min(8, Math.max(2, Number(getRequestedDepth()) || 8));
      const search = getChainSearchOptions(candidateGrid, requestedDepth, budget, profile, false, phase);
      const chromatic = getChromaticOptions();
      return {
        candidateGrid,
        fixedGrid: [...fixedGrid],
        budget,
        moveTypes: [...currentSolverMoveTypes(profile?.moveTypes)],
        fishOptions: {
          ...getPomFishOptions(),
          fishSizes: solverFishSizes(profile?.moveTypes, profile?.maxFishSize ?? 4),
        },
        chain: {
          maxDepth: search.maxDepth,
          minDepth: phase?.minDepth ?? 1,
          fixedGrid: [...fixedGrid],
          includeAls: search.includeAlsRcc,
          includeAhs: search.includeAhs,
          includeChromatic: chromatic.enabled,
          chromaticOptions: chromatic.options,
          excludePureAhs: search.includeAhs && !phase?.family,
          strongLinkTypes: search.strongLinkTypes,
          almostFish: search.almostFish,
          alsCellCount: phase?.alsCellCount ?? null,
          alsCellCounts: phase?.alsCellCounts ?? null,
          alsModuleKinds: phase?.alsModuleKinds ?? null,
          alsLinkMode: phase?.alsLinkMode ?? null,
          ahsMode: phase?.ahsMode ?? null,
          alsMaxDigits: search.alsMaxDigits,
          alsMaxSizeDOF: search.alsMaxSizeDOF,
          alsMaxSizeFox: search.alsMaxSizeFox,
          alsSearchLimit: search.alsSearchLimit,
          ahsMaxDof: 3,
          ahsMaxDigits: search.ahsMaxDigits,
          ahsMaxSize: search.ahsMaxSize,
          ahsMaxFox: search.ahsMaxFox,
          ahsMaxCells: search.ahsMaxCells,
          ahsMaxLinks: search.maxAlsLinks,
          limits: {
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          },
        },
      };
    }

    return { solverFishSizes, solverFishMoveType, solverFishOptions, generatorWorkerConfig };
  }

  app.solverSearchConfig = { create };
})(window);
