/* ALS/AHS DOF and DOF-chain solver search adapters. */
(function installSolverDofSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    getCandidates,
    getAlsDofMaxDigits,
    getAlsDofMaxAuxiliary,
    currentSolverMoveTypes,
    bestAlsDofMoveFromReport,
    bestAhsDofMoveFromReport,
    bestAlsDofChainMoveFromReport,
    bestAhsDofChainMoveFromReport,
    runSearchWorker,
  }) {
    function findSolverAlsDofMove(
      candidateGrid = getCandidates(),
      budget = 'interactive',
      profile = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!['als-dof', 'dds', 'adds'].some(type => enabledTypes.has(type))) return null;

      const configuredDigits = Number(profile?.alsMaxDigits);
      const configuredAuxiliary = Number(profile?.alsMaxAuxiliary);
      const maxDigits = Math.min(9, Math.max(2,
        Number.isInteger(configuredDigits) && configuredDigits > 0
          ? configuredDigits
          : (Number(getAlsDofMaxDigits()) || 9)));
      const maxAuxiliary = Math.min(9, Math.max(1,
        Number.isInteger(configuredAuxiliary) && configuredAuxiliary > 0
          ? configuredAuxiliary
          : (Number(getAlsDofMaxAuxiliary()) || 9)));
      const sourceAls = core.alsConstructor(candidateGrid, {
        maxSizeDOF: maxDigits - 1,
        maxSizeFox: maxDigits - 1,
      });
      const raw = core.findAlsDofNets(candidateGrid, {
        alsList: sourceAls,
        maxAuxiliary,
        maxDigits,
        maxResults: budget === 'generator' ? 2500 : 5000,
        includeChain: true,
      });
      const accepted = [];
      const rejected = [];
      for (const result of raw.results || []) {
        const verification = core.verifyAlsDofNet(candidateGrid, result, { alsList: sourceAls });
        if (verification.ok) accepted.push({ ...result, verification });
        else rejected.push({ result, verification });
      }
      const report = {
        ...raw,
        results: accepted,
        rejectedResults: rejected,
        stats: {
          ...(raw.stats || {}),
          verifierChecked: (raw.results || []).length,
          verifierRejected: rejected.length,
        },
      };
      return bestAlsDofMoveFromReport(candidateGrid, report, enabledTypes, profile);
    }

    function findSolverAhsDofMove(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const maxCells = Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6));
      const maxAuxiliary = Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2));
      const raw = core.findAhsDofNets(candidateGrid, {
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells,
        maxAuxiliary,
        maxResults: budget === 'generator' ? 1000 : 2500,
      });
      const accepted = [];
      for (const result of raw.results || []) {
        if (core.verifyAhsDofNet(candidateGrid, result).ok) accepted.push(result);
      }
      return bestAhsDofMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAhsDofMoveInWorker(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const report = await runSearchWorker('ahs-dof', {
        candidateGrid,
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxResults: budget === 'generator' ? 1000 : 2500,
      });
      return bestAhsDofMoveFromReport(candidateGrid, report, profile);
    }

    function findSolverAlsDofChainMove(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const payload = {
        maxDigits: Math.min(9, Math.max(2, Number(profile?.alsMaxDigits) || 5)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.alsMaxAuxiliary) || 5)),
        maxResults: budget === 'generator' ? 500 : 1000,
        includeHydra: true,
      };
      const raw = core.findAlsDofChains(candidateGrid, payload);
      const accepted = (raw.results || []).filter(result =>
        core.verifyAlsDofNet(candidateGrid, result, {
          alsList: core.alsConstructor(candidateGrid, {
            maxSizeDOF: payload.maxDigits - 1,
            maxSizeFox: payload.maxDigits - 1,
          }),
        }).ok);
      return bestAlsDofChainMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAlsDofChainMoveInWorker(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const payload = {
        candidateGrid,
        maxDigits: Math.min(9, Math.max(2, Number(profile?.alsMaxDigits) || 5)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.alsMaxAuxiliary) || 5)),
        maxResults: budget === 'generator' ? 500 : 1000,
        includeHydra: true,
      };
      const report = await runSearchWorker('als-dof-chain', payload);
      return bestAlsDofChainMoveFromReport(candidateGrid, report, profile);
    }

    function findSolverAhsDofChainMove(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const payload = {
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxDepth: 5,
        maxResults: budget === 'generator' ? 500 : 1000,
      };
      const ahsList = core.ahsConstructor(candidateGrid, {
        maxSize: payload.maxAhsSize,
        maxSizeFox: payload.maxAhsFox,
      });
      const netReport = core.findAhsDofNets(candidateGrid, { ...payload, ahsList });
      const raw = core.findAhsDofChains(candidateGrid, { ...payload, netReport });
      const accepted = (raw.results || []).filter(result =>
        core.verifyAhsDofChain(candidateGrid, result).ok);
      return bestAhsDofChainMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAhsDofChainMoveInWorker(candidateGrid = getCandidates(), budget = 'interactive', profile = null) {
      const payload = {
        candidateGrid,
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxDepth: 5,
        maxResults: budget === 'generator' ? 500 : 1000,
      };
      const report = await runSearchWorker('ahs-dof-chain', payload);
      return bestAhsDofChainMoveFromReport(candidateGrid, report, profile);
    }

    return {
      findSolverAlsDofMove,
      findSolverAhsDofMove,
      findSolverAhsDofMoveInWorker,
      findSolverAlsDofChainMove,
      findSolverAlsDofChainMoveInWorker,
      findSolverAhsDofChainMove,
      findSolverAhsDofChainMoveInWorker,
    };
  }

  app.solverDofSearch = { create };
})(window);
