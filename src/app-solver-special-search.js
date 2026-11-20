/* Chromatic and ALS-Hydra solver search adapters. */
(function installSolverSpecialSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    getChromaticOptions,
    syncVariantSettings,
    getVariantSettings,
    chromaticStepFromResult,
    alsHydraStepFromResult,
    ratingForStep,
    directMovePriority,
    isHigherPriorityMove,
    runSearchWorker,
    isHydraEnabled,
    getHydraMaxDigits,
    getHydraMaxAuxiliary,
    getHydraMaxResults,
    setChromaticReport,
    setAlsHydraReport,
  }) {
    function bestChromaticMove(report, phase, profile) {
      let best = null;
      for (const [index, record] of (report?.results || []).entries()) {
        const step = chromaticStepFromResult(record);
        step.rating = ratingForStep(step);
        if (profile?.maxRank != null && step.rating.rank > profile.maxRank) continue;
        step.hierarchyPhase = phase.name;
        const candidate = { step, chain: null, priority: directMovePriority(step) };
        if (isHigherPriorityMove(candidate, best)) best = { ...candidate, index };
      }
      if (!best) return null;
      setChromaticReport(phase.alsBacked, report, best.index);
      const { priority, index, ...move } = best;
      return move;
    }

    function bestAlsHydraMove(candidateGrid, report, phase, profile) {
      let best = null;
      for (const [index, result] of (report?.results || []).entries()) {
        const step = alsHydraStepFromResult(result, index, candidateGrid);
        if (!step) continue;
        if (profile?.maxRank != null && step.rating.rank > profile.maxRank) continue;
        step.hierarchyPhase = phase.name;
        const score = Number(step.rating.value) || Number.POSITIVE_INFINITY;
        if (!best || score < best.score) best = { step, score, index };
      }
      if (!best) return null;
      setAlsHydraReport(report, best.index);
      return { step: best.step, chain: null };
    }

    function chromaticSearchOptions() {
      return getChromaticOptions();
    }

    function findSolverChromaticMove(candidateGrid, phase, profile) {
      syncVariantSettings();
      core.configureVariants(getVariantSettings());
      const engine = phase.alsBacked
        ? globalThis.StormChromaticAlsCore
        : globalThis.StormChromaticCore;
      if (typeof engine?.find !== 'function') return null;
      return bestChromaticMove(engine.find(candidateGrid, chromaticSearchOptions()), phase, profile);
    }

    async function findSolverChromaticMoveInWorker(candidateGrid, phase, profile) {
      const report = await runSearchWorker(phase.alsBacked ? 'chromatic-als' : 'chromatic', {
        candidateGrid,
        options: chromaticSearchOptions(),
      }, { diagnosticPhase: phase.name });
      return bestChromaticMove(report, phase, profile);
    }

    async function findSolverAlsHydraMoveInWorker(candidateGrid, phase, profile, budget) {
      if (!isHydraEnabled()) return null;
      const configuredDigits = Number(profile?.alsMaxDigits);
      const configuredAuxiliary = Number(profile?.alsMaxAuxiliary);
      const report = await runSearchWorker('hydra-als-dof', {
        candidateGrid,
        maxDigits: Math.min(9, Math.max(2,
          Number.isInteger(configuredDigits) && configuredDigits > 0
            ? configuredDigits : (Number(getHydraMaxDigits()) || 5))),
        maxAuxiliary: Math.min(9, Math.max(1,
          Number.isInteger(configuredAuxiliary) && configuredAuxiliary > 0
            ? configuredAuxiliary : (Number(getHydraMaxAuxiliary()) || 5))),
        maxResults: Math.min(5000, Math.max(1,
          budget === 'generator' ? 500 : (Number(getHydraMaxResults()) || 500))),
        aicDepth: 4,
        strongLinkTypes: [0, 1, 2, 3, 4],
        includeHydra: true,
        includeAhs: true,
      }, { diagnosticPhase: phase.name });
      return bestAlsHydraMove(candidateGrid, report, phase, profile);
    }

    function findSolverAlsHydraMove(candidateGrid, phase, profile, budget) {
      if (!isHydraEnabled()) return null;
      const maxDigits = Math.min(9, Math.max(2,
        Number(profile?.alsMaxDigits) || Number(getHydraMaxDigits()) || 5));
      const maxAuxiliary = Math.min(9, Math.max(1,
        Number(profile?.alsMaxAuxiliary) || Number(getHydraMaxAuxiliary()) || 5));
      const maxResults = Math.min(5000, Math.max(1,
        budget === 'generator' ? 500 : (Number(getHydraMaxResults()) || 500)));
      const alsList = core.alsConstructor(candidateGrid, {
        maxSizeDOF: maxDigits - 1,
        maxSizeFox: maxDigits - 1,
      });
      const strongLinkTypes = [0, 1, 2, 3, 4];
      const strongLinkSet = core.buildStrongLinks(candidateGrid, { strongLinkTypes });
      const alsLinkSet = core.buildAlsLinks(candidateGrid, {
        alsList,
        strictSingleCommon: true,
      });
      const ahsList = core.ahsConstructor(candidateGrid, {
        maxSize: Math.max(1, maxDigits - 1),
        maxSizeFox: Math.max(1, maxDigits - 1),
      });
      const ahsLinkSet = core.buildAhsLinks(candidateGrid, {
        ahsList,
        strongLinkSet,
        minDof: 1,
        maxDof: 3,
        strictSingleCommon: false,
        maxLinks: 5000,
      });
      const participants = [];
      const maxParticipants = 2000;
      for (const auxiliary of alsList) {
        if (participants.length >= maxParticipants) break;
        const report = core.findAicChains(candidateGrid, {
          strongLinkSet,
          alsList,
          alsLinkSet,
          includeAls: true,
          ahsList,
          ahsLinkSet,
          includeAhs: true,
          collectAlsBranches: true,
          maxAlsBranches: maxParticipants,
          strongLinkTypes,
          startNodeIds: [auxiliary.uniqueID || auxiliary.id],
          startNodeCells: auxiliary.alsAllCells || auxiliary.cells || [],
          maxDepth: 4,
          maxChains: 500,
        });
        const chains = [...(report.chains || []), ...(report.alsBranches || [])];
        participants.push(...core.hydraParticipantsFromAicChains(
          candidateGrid,
          chains,
          alsList,
          alsLinkSet,
          { maxParticipants: maxParticipants - participants.length, forChaining: true },
        ));
      }
      const report = core.findHydraAlsDof(candidateGrid, {
        alsList,
        participants,
        maxDigits,
        maxAuxiliary,
        maxResults,
        requireVerifiedParticipants: true,
        includeHydra: true,
      });
      return bestAlsHydraMove(candidateGrid, report, phase, profile);
    }

    return {
      findSolverChromaticMove,
      findSolverChromaticMoveInWorker,
      findSolverAlsHydraMove,
      findSolverAlsHydraMoveInWorker,
    };
  }

  app.solverSpecialSearch = { create };
})(window);
