/* Synchronous and worker-backed AIC chain phase execution. */
(function installSolverChainExecution(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    getCandidates,
    getPuzzle,
    getSolution,
    getRequestedDepth,
    currentSolverMoveTypes,
    solverChainPhasePlan,
    solverSearchPasses,
    phaseProfile,
    chainSearchOptions,
    generatorWorkerConfig,
    bestChainFromReport,
    isHigherPriorityMove,
    solverAhsPassCanStop,
    solverAhsMaxCells,
    solverAlsPassCanStop,
    solverAlsMaxCells,
    runSearchWorker,
  }) {
    function findSolverChainMove(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      budget = 'interactive',
      expectedSolution = getSolution(),
      profile = null,
      scoreCeiling = null,
      phaseOverride = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!enabledTypes.has('chains')) return null;

      const requestedDepth = Math.min(8, Math.max(2, Number(getRequestedDepth()) || 8));
      const phases = phaseOverride
        ? [phaseOverride]
        : solverChainPhasePlan(requestedDepth, profile);
      let bestOverall = null;
      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const phase = phases[phaseIndex];
        let stopAllPhases = false;
        const searchPasses = solverSearchPasses(phase, profile, budget);
        for (const { alsMaxDigits, alsCellCounts, ahsMaxDigits, ahsMaxCells } of searchPasses) {
          const searchPhase = {
            ...phase,
            ...(alsMaxDigits == null ? {} : { alsMaxDigits }),
            ...(Array.isArray(alsCellCounts) ? { alsCellCounts } : {}),
            ...(ahsMaxDigits == null ? {} : { ahsMaxDigits }),
            ...(ahsMaxCells == null ? {} : { ahsMaxCells }),
            // Ratings rank results after the phase search; they never reduce
            // the configured graph depth or hide a valid candidate.
            maxDepth: phase.maxDepth,
          };
          const phaseSearchProfile = phaseProfile(profile, searchPhase);
          const search = chainSearchOptions(
            candidateGrid,
            searchPhase.maxDepth,
            budget,
            phaseSearchProfile,
            true,
            searchPhase,
          );
          if (search.maxDepth < 2) break;

          const report = core.findAicChains(candidateGrid, {
            strongLinkSet: search.strongSet,
            alsList: search.alsList,
            alsLinkSet: search.alsLinkSet,
            ahsList: search.ahsList,
            ahsLinkSet: search.ahsLinkSet,
            includeAls: search.includeAlsRcc,
            includeAhs: search.includeAhs,
            excludePureAhs: search.includeAhs && !searchPhase.family,
            strongLinkTypes: search.strongLinkTypes,
            maxDepth: search.maxDepth,
            minDepth: searchPhase.minDepth ?? 1,
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          });
          const best = bestChainFromReport(
            report,
            searchPhase,
            enabledTypes,
            candidateGrid,
            fixedGrid,
            expectedSolution,
            search.maxDepth,
            profile,
          );
          if (best && isHigherPriorityMove(best, bestOverall)) bestOverall = best;

          // Hierarchy selection is phase-first: stop at the first phase with a legal move.
          if (best?.step) {
            const { priority, ...resultMove } = best;
            return resultMove;
          }

          if (solverAhsPassCanStop(
            phase,
            bestOverall,
            ahsMaxCells,
            solverAhsMaxCells(phase, profile),
          )) break;

          const currentAlsBreadth = Array.isArray(alsCellCounts) && alsCellCounts.length
            ? Math.max(...alsCellCounts)
            : alsMaxDigits;
          if (solverAlsPassCanStop(
            phase,
            bestOverall,
            currentAlsBreadth,
            solverAlsMaxCells(phase, profile),
          )) break;
        }
        if (stopAllPhases) break;
      }
      if (!bestOverall) return null;
      const { priority, ...result } = bestOverall;
      return result;
    }

    async function findSolverChainMoveInWorker(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      expectedSolution = getSolution(),
      profile = null,
      budget = 'interactive',
      scoreCeiling = null,
      phaseOverride = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!enabledTypes.has('chains')) return null;

      const requestedDepth = Math.min(8, Math.max(2, Number(getRequestedDepth()) || 8));
      const phases = phaseOverride
        ? [phaseOverride]
        : solverChainPhasePlan(requestedDepth, profile);
      let bestOverall = null;
      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const phase = phases[phaseIndex];
        let stopAllPhases = false;
        const searchPasses = solverSearchPasses(phase, profile, budget);
        for (const { alsMaxDigits, alsCellCounts, ahsMaxDigits, ahsMaxCells } of searchPasses) {
          const searchPhase = {
            ...phase,
            ...(alsMaxDigits == null ? {} : { alsMaxDigits }),
            ...(Array.isArray(alsCellCounts) ? { alsCellCounts } : {}),
            ...(ahsMaxDigits == null ? {} : { ahsMaxDigits }),
            ...(ahsMaxCells == null ? {} : { ahsMaxCells }),
            // Keep the full configured depth; earlier passes do not cap the later breadth.
            maxDepth: phase.maxDepth,
          };
          const searchProfile = phaseProfile(profile, searchPhase);
          const config = generatorWorkerConfig(
            candidateGrid,
            fixedGrid,
            searchProfile,
            budget,
            searchPhase,
          );
          const workerOperation = searchPhase.dedicatedSearch === 'als-xz'
            ? 'als-xz'
            : 'chains';
          const result = await runSearchWorker(workerOperation, {
            candidateGrid: config.candidateGrid,
            ...config.chain,
          }, {
            diagnosticPhase: searchPhase.hierarchyPhase || searchPhase.name,
          });
          const report = {
            chains: result?.chains || [],
            stats: result?.stats || {},
          };
          const best = bestChainFromReport(
            report,
            searchPhase,
            enabledTypes,
            candidateGrid,
            fixedGrid,
            expectedSolution,
            config.chain.maxDepth,
            profile,
          );
          if (best && isHigherPriorityMove(best, bestOverall)) bestOverall = best;

          // Hierarchy selection is phase-first: stop at the first phase with a legal move.
          if (best?.step) {
            const { priority, ...resultMove } = best;
            return resultMove;
          }

          if (solverAhsPassCanStop(
            phase,
            bestOverall,
            ahsMaxCells,
            solverAhsMaxCells(phase, profile),
          )) break;

          const currentAlsBreadth = Array.isArray(alsCellCounts) && alsCellCounts.length
            ? Math.max(...alsCellCounts)
            : alsMaxDigits;
          if (solverAlsPassCanStop(
            phase,
            bestOverall,
            currentAlsBreadth,
            solverAlsMaxCells(phase, profile),
          )) break;
        }
        if (stopAllPhases) break;
      }
      if (!bestOverall) return null;
      const { priority, ...resultMove } = bestOverall;
      return resultMove;
    }

    return { findSolverChainMove, findSolverChainMoveInWorker };
  }

  app.solverChainExecution = { create };
})(window);
