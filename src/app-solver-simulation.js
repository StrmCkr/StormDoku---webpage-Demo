/* Candidate-grid simulation for generated-puzzle rating. */
(function installSolverSimulation(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, getSearchWorkerDisabled, chooseSolverStepInWorker, chooseSolverStep, isSearchCancelled }) {
    function applySimulationPromotion(candidateGrid, grid, step) {
      const cell = (step?.at || step?.vertices || [])[0];
      const digit = step?.digits?.[0];
      if (!Number.isInteger(cell) || !digit || grid[cell] || candidateGrid[cell]?.length !== 1) {
        return false;
      }

      if (candidateGrid[cell][0] !== digit) return false;
      grid[cell] = digit;
      candidateGrid[cell] = [];
      for (const peer of core.peersOf(cell)) {
        candidateGrid[peer] = (candidateGrid[peer] || []).filter(value => value !== digit);
      }
      return true;
    }

    async function simulateSolverInWorker(
      grid,
      expectedSolution,
      profile = null,
      budget = 'generator',
    ) {
      const simulationCand = core.allCandidates(grid);
      const simulationGrid = [...grid];
      const steps = [];
      const maxCycles = 100;
      let useWorker = !getSearchWorkerDisabled();

      for (let count = 0; count < maxCycles; count++) {
        let choice;
        if (useWorker) {
          try {
            choice = await chooseSolverStepInWorker(
              simulationCand,
              simulationGrid,
              expectedSolution,
              profile,
              'generator',
            );
          } catch (error) {
            if (isSearchCancelled(error)) throw error;
            if (budget === 'generator') throw error;
            // A file:// page or an older browser may reject workers. Keep the
            // existing synchronous solver as a transparent fallback.
            useWorker = false;
            choice = chooseSolverStep(
              simulationCand,
              simulationGrid,
              'generator',
              expectedSolution,
              profile,
            );
          }
        } else {
          choice = chooseSolverStep(
            simulationCand,
            simulationGrid,
            'generator',
            expectedSolution,
            profile,
          );
        }
        if (!choice?.step) break;

        const items = core.eliminationItems(choice.step.elim, simulationCand);
        if (!items.length) {
          if (choice.step.tech !== 'last-man-standing'
            || !applySimulationPromotion(simulationCand, simulationGrid, choice.step)) break;
          steps.push({ ...choice.step, elim: { items: [] } });
          continue;
        }
        const removed = core.applyEliminations(simulationCand, { items });
        if (!removed.length) break;

        steps.push({
          ...choice.step,
          elim: { items: removed },
        });
      }

      return {
        cand: simulationCand,
        grid: simulationGrid,
        steps,
        cycles: steps.length,
      };
    }

    return { simulateSolverInWorker };
  }

  app.solverSimulation = { create };
})(window);
