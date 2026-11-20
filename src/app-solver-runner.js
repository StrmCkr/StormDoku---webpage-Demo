/* Ordered synchronous and worker-backed solver phase execution. */
(function installSolverRunner(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    getCandidates, getPuzzle, getSolution,
    solverPhasePlan, currentSolverMoveTypes, setActiveHierarchyPhase, solverPhaseAllowsType,
    findSolverChromaticMove, findSolverChromaticMoveInWorker,
    findSolverAlsHydraMove, findSolverAlsHydraMoveInWorker,
    findSolverAlcMove, findSolverAlcMoveInWorker,
    findSolverChainMove, findSolverChainMoveInWorker,
    findSolverAlsDofMove, bestAlsDofMoveFromReport,
    findSolverAhsDofMove, findSolverAhsDofMoveInWorker,
    findSolverAlsDofChainMove, findSolverAlsDofChainMoveInWorker,
    findSolverAhsDofChainMove, findSolverAhsDofChainMoveInWorker,
    findSolverMslsMove, findSolverMslsMoveInWorker,
    directSolverPhaseStep, directSolverPhaseStepInWorker,
    runSearchWorker, getAlsDofMaxDigits, getAlsDofMaxAuxiliary,
  }) {
    function chooseSolverStep(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      budget = 'interactive',
      expectedSolution = getSolution(),
      profile = null,
    ) {
      const phases = solverPhasePlan(profile);
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      for (const phase of phases) {
        setActiveHierarchyPhase(phase.name);
        if (phase.kind === 'chromatic') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const chromatic = findSolverChromaticMove(candidateGrid, phase, profile);
          if (chromatic?.step) return chromatic;
          continue;
        }
        // ALS-Hydra's verified chain participants are constructed in the
        // worker search path; the synchronous fallback cannot reproduce that
        // inventory and must not reinterpret this as an ordinary chain phase.
        if (phase.kind === 'als-hydra') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const hydra = findSolverAlsHydraMove(candidateGrid, phase, profile, budget);
          if (hydra?.step) return hydra;
          continue;
        }
        if (phase.kind === 'alc') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alc = findSolverAlcMove(
            candidateGrid,
            fixedGrid,
            budget,
            expectedSolution,
            profile,
            phase,
          );
          if (alc?.incomplete) return alc;
          if (alc?.step) return alc;
          continue;
        }
        if (phase.kind === 'als-xz') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsXz = findSolverChainMove(
            candidateGrid,
            fixedGrid,
            budget,
            expectedSolution,
            profile,
            null,
            phase.chainPhase,
          );
          if (alsXz?.incomplete) return alsXz;
          if (alsXz?.step) return alsXz;
          continue;
        }
        if (phase.kind === 'als-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDof = findSolverAlsDofMove(candidateGrid, budget, profile);
          if (alsDof?.step) return alsDof;
          continue;
        }
        if (phase.kind === 'ahs-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDof = findSolverAhsDofMove(candidateGrid, budget, profile);
          if (ahsDof?.step) return ahsDof;
          continue;
        }
        if (phase.kind === 'als-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDofChain = findSolverAlsDofChainMove(candidateGrid, budget, profile);
          if (alsDofChain?.step) return alsDofChain;
          continue;
        }
        if (phase.kind === 'ahs-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDofChain = findSolverAhsDofChainMove(candidateGrid, budget, profile);
          if (ahsDofChain?.step) return ahsDofChain;
          continue;
        }
        if (phase.kind === 'msls') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const msls = findSolverMslsMove(candidateGrid, budget, profile);
          if (msls?.step) return msls;
          continue;
        }
        if (phase.kind === 'direct') {
          const direct = directSolverPhaseStep(candidateGrid, fixedGrid, phase, profile);
          if (direct?.step) return direct;
          continue;
        }
        if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
        const chain = findSolverChainMove(
          candidateGrid,
          fixedGrid,
          budget,
          expectedSolution,
          profile,
          null,
          phase.chainPhase,
        );
        if (chain?.incomplete) return chain;
        if (chain?.step) return chain;
      }
      return null;
    }

    async function chooseSolverStepInWorker(
      candidateGrid = getCandidates(),
      fixedGrid = getPuzzle(),
      expectedSolution = getSolution(),
      profile = null,
      budget = 'interactive',
    ) {
      const phases = solverPhasePlan(profile);
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      for (const phase of phases) {
        setActiveHierarchyPhase(phase.name);
        if (phase.kind === 'chromatic') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const chromatic = await findSolverChromaticMoveInWorker(candidateGrid, phase, profile);
          if (chromatic?.step) return chromatic;
          continue;
        }
        if (phase.kind === 'als-hydra') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const hydra = await findSolverAlsHydraMoveInWorker(candidateGrid, phase, profile, budget);
          if (hydra?.step) return hydra;
          continue;
        }
        if (phase.kind === 'alc') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alc = await findSolverAlcMoveInWorker(
            candidateGrid,
            fixedGrid,
            budget,
            expectedSolution,
            profile,
            phase,
          );
          if (alc?.incomplete) return alc;
          if (alc?.step) return alc;
          continue;
        }
        if (phase.kind === 'als-xz') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsXz = await findSolverChainMoveInWorker(
            candidateGrid,
            fixedGrid,
            expectedSolution,
            profile,
            budget,
            null,
            phase.chainPhase,
          );
          if (alsXz?.incomplete) return alsXz;
          if (alsXz?.step) return alsXz;
          continue;
        }
        if (phase.kind === 'als-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const configuredDigits = Number(profile?.alsMaxDigits);
          const configuredAuxiliary = Number(profile?.alsMaxAuxiliary);
          const alsDofReport = await runSearchWorker('als-dof', {
            candidateGrid,
            maxDigits: Math.min(9, Math.max(2,
              Number.isInteger(configuredDigits) && configuredDigits > 0
                ? configuredDigits : (Number(getAlsDofMaxDigits()) || 9))),
            maxAuxiliary: Math.min(9, Math.max(1,
              Number.isInteger(configuredAuxiliary) && configuredAuxiliary > 0
                ? configuredAuxiliary : (Number(getAlsDofMaxAuxiliary()) || 9))),
            maxResults: budget === 'generator' ? 2500 : 5000,
          });
          const alsDof = bestAlsDofMoveFromReport(
            candidateGrid,
            alsDofReport,
            enabledTypes,
            profile,
          );
          if (alsDof?.step) return alsDof;
          continue;
        }
        if (phase.kind === 'ahs-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDof = await findSolverAhsDofMoveInWorker(candidateGrid, budget, profile);
          if (ahsDof?.step) return ahsDof;
          continue;
        }
        if (phase.kind === 'als-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDofChain = await findSolverAlsDofChainMoveInWorker(candidateGrid, budget, profile);
          if (alsDofChain?.step) return alsDofChain;
          continue;
        }
        if (phase.kind === 'ahs-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDofChain = await findSolverAhsDofChainMoveInWorker(candidateGrid, budget, profile);
          if (ahsDofChain?.step) return ahsDofChain;
          continue;
        }
        if (phase.kind === 'msls') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const msls = await findSolverMslsMoveInWorker(candidateGrid, budget, profile);
          if (msls?.step) return msls;
          continue;
        }
        if (phase.kind === 'direct') {
          const direct = await directSolverPhaseStepInWorker(
            candidateGrid,
            fixedGrid,
            phase,
            profile,
          );
          if (direct?.step) return direct;
          continue;
        }
        if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
        const chain = await findSolverChainMoveInWorker(
          candidateGrid,
          fixedGrid,
          expectedSolution,
          profile,
          budget,
          null,
          phase.chainPhase,
        );
        if (chain?.incomplete) return chain;
        if (chain?.step) return chain;
      }
      return null;
    }

    return { chooseSolverStep, chooseSolverStepInWorker };
  }

  app.solverRunner = { create };
})(window);
