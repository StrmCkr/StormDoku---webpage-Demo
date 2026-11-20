/* Direct subset and fish phase execution for the solver hierarchy. */
(function installDirectSolverPhase(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    syncVariantSettings,
    getVariantSettings,
    currentSolverMoveTypes,
    solverPhaseAllowsType,
    solverFishMoveType,
    solverFishOptions,
    ratingForStep,
    directMovePriority,
    isHigherPriorityMove,
    runSearchWorker,
  }) {
    function fishPhaseStep(candidateGrid, fixedGrid, spec, enabledTypes, profile) {
      let best = null;
      const categories = spec.categories || ['Basic'];
      for (const k of spec.k || [0]) {
        for (const category of categories) {
          const fishType = solverFishMoveType(spec, k, category);
          if (!enabledTypes.has(fishType)) continue;
          const fishOptions = {
            ...solverFishOptions(candidateGrid, fixedGrid, enabledTypes, profile),
            enabledTechniques: new Set([fishType]),
            fishSizes: [spec.size],
            minSize: spec.size,
            maxSize: spec.size,
            minK: k,
            maxK: k,
            basicsEnabled: category === 'Basic',
            frankenEnabled: category === 'Franken',
            mutantEnabled: category === 'Mutant',
            priorityMode: true,
          };
          const step = core.genericSubsetOrFishStep(candidateGrid, fishOptions);
          if (!step) continue;
          step.rating = ratingForStep(step);
          if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
          const candidate = { step, chain: null, priority: directMovePriority(step) };
          if (isHigherPriorityMove(candidate, best)) best = candidate;
        }
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    function directSolverPhaseStep(candidateGrid, fixedGrid, phase, profile = null) {
      syncVariantSettings();
      core.configureVariants(getVariantSettings());
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      let best = null;
      for (const spec of phase.methods || []) {
        if (!solverPhaseAllowsType(phase, enabledTypes, spec)) continue;
        const step = spec.kind === 'fish'
          ? fishPhaseStep(candidateGrid, fixedGrid, spec, enabledTypes, profile)?.step
          : spec.type === 'box-line'
            // Box-line reduction is a hierarchy phase in its own right. Keep
            // it out of the generic subset dispatcher so a subset-size-1
            // result cannot consume or hide the BLR pass.
            ? core.boxLineStep(candidateGrid)
            : core.genericSubsetOrFishStep(candidateGrid, {
                enabledTechniques: new Set([spec.type]),
              });
        if (!step) continue;
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
        const candidate = { step, chain: null, priority: directMovePriority(step) };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    async function directSolverPhaseStepInWorker(
      candidateGrid,
      fixedGrid,
      phase,
      profile = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      let best = null;
      for (const spec of phase.methods || []) {
        if (!solverPhaseAllowsType(phase, enabledTypes, spec)) continue;
        let step;
        if (spec.kind === 'fish') {
          for (const k of spec.k || [0]) {
            for (const category of spec.categories || ['Basic']) {
              const fishType = solverFishMoveType(spec, k, category);
              if (!enabledTypes.has(fishType)) continue;
              const fishOptions = {
                ...solverFishOptions(candidateGrid, fixedGrid, enabledTypes, profile),
                enabledTechniques: new Set([fishType]),
                fishSizes: [spec.size],
                minSize: spec.size,
                maxSize: spec.size,
                minK: k,
                maxK: k,
                basicsEnabled: category === 'Basic',
                frankenEnabled: category === 'Franken',
                mutantEnabled: category === 'Mutant',
                priorityMode: true,
              };
              // The worker supplies this callback from its own core. Only
              // structured-cloneable fish settings cross the message boundary.
              const { omissionFishSearch, ...workerFishOptions } = fishOptions;
              const result = await runSearchWorker('simple', {
                candidateGrid,
                fixedGrid: [...fixedGrid],
                moveTypes: [fishType],
                fishOptions: workerFishOptions,
              });
              if (!result) continue;
              result.rating = ratingForStep(result);
              if (profile?.maxRank !== undefined && result.rating.rank > profile.maxRank) continue;
              const candidate = { step: result, chain: null, priority: directMovePriority(result) };
              if (isHigherPriorityMove(candidate, best)) best = candidate;
            }
          }
          continue;
        }
        const result = await runSearchWorker('simple', {
          candidateGrid,
          fixedGrid: [...fixedGrid],
          moveTypes: [spec.type],
          subsetOnly: true,
          directType: spec.type === 'box-line' ? 'box-line' : null,
        });
        step = result;
        if (!step) continue;
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
        const candidate = { step, chain: null, priority: directMovePriority(step) };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    return { directSolverPhaseStep, directSolverPhaseStepInWorker };
  }

  app.directSolverPhase = { create };
})(window);
