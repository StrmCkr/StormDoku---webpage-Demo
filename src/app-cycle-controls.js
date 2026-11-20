/* Next and Basics button orchestration for solver cycles. */
(function installCycleControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    async function applyNextCycleInWorker() {
      const context = getContext();
      const before = context.snapshotState();
      const promoted = context.applyQueuedPromotions();
      if (context.boardIsComplete()) return context.applyCycleChoice(before, promoted, null);
      let choice;

      const searchToken = context.setBusy(true);
      context.setStatus('Searching enabled moves...');
      try {
        choice = await context.chooseInteractiveStep({ allowSynchronousFallback: true });
      } catch (error) {
        if (context.isSearchCancelled(error)) return false;
        throw error;
      } finally {
        context.setBusy(false, searchToken);
      }

      if (context.lastInteractiveSearchError?.code === 'INTERACTIVE_SEARCH_TIMEOUT') {
        context.setStatus(`Search stopped in ${context.activeHierarchyPhase || 'the current phase'} after 15 seconds without worker progress.`, 'warn');
        return false;
      }
      return context.applyCycleChoice(before, promoted, choice);
    }

    async function nextCycle() {
      const context = getContext();
      if (context.busy) return false;
      context.leaveHistoryPreview();
      if (context.boardIsComplete()) {
        context.ratingReport = context.ratingFromLog(context.logEntries, true);
        context.setStatus('Completed. The board is already solved.', 'ok');
        context.render();
        return false;
      }
      const changed = await applyNextCycleInWorker();
      if (changed) {
        context.ratingReport = context.ratingFromLog(
          context.logEntries,
          context.candidateGridIsSolved(context.cand, context.puzzle),
        );
      }
      context.render();
      return changed;
    }

    async function applyBasics() {
      const context = getContext();
      if (context.busy) return;
      context.leaveHistoryPreview();
      if (context.boardIsComplete()) {
        context.ratingReport = context.ratingFromLog(context.logEntries, true);
        context.setStatus('Completed. The board is already solved.', 'ok');
        context.render();
        return;
      }
      const maxSteps = 1000;
      let applied = 0;
      const searchToken = context.setBusy(true);
      context.setStatus('Basics started. Applying Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 until exhausted.');

      try {
        while (applied < maxSteps) {
          if (searchToken !== context.searchEpoch) return;
          const before = context.snapshotState();
          const promoted = context.applyQueuedPromotions();
          if (context.boardIsComplete()) {
            if (context.applyCycleChoice(before, promoted, null)) applied += 1;
            break;
          }
          const step = await context.runSearchWorker('simple', {
            candidateGrid: context.cand,
            fixedGrid: context.puzzle,
            moveTypes: [
              'last-man-standing', 'hidden-single', 'naked-single', 'box-line',
              'hidden-pair', 'naked-pair', 'hidden-triple', 'naked-triple',
              'hidden-quad', 'naked-quad', 'x-wing', 'swordfish', 'jellyfish',
            ],
            fishOptions: {
              ...context.currentPomFishOptions(),
              fishSizes: [2, 3, 4], minSize: 2, maxSize: 4, minK: 0, maxK: 0,
              basicsEnabled: true, frankenEnabled: false, mutantEnabled: false,
            },
          });
          if (!context.applyCycleChoice(before, promoted, step ? { step, chain: null } : null)) break;

          applied += 1;
          context.renderLog();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } catch (error) {
        if (context.isSearchCancelled(error)) return;
        context.setStatus(`Basics stopped: ${error.message || error}`, 'warn');
        return;
      } finally {
        context.setBusy(false, searchToken);
      }

      if (context.logEntries.length) {
        context.ratingReport = context.ratingFromLog(
          context.logEntries,
          context.candidateGridIsSolved(context.cand, context.puzzle),
        );
      }
      if (applied === maxSteps) {
        context.setStatus(`Basics stopped after ${maxSteps} cycles. Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 were being applied.`, 'warn');
      } else if (applied > 0) {
        context.setStatus(`Basics complete. ${applied} cycle${applied === 1 ? '' : 's'} applied; Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 are exhausted.`, 'ok');
      } else {
        context.setStatus('Basics found no enabled Last Man Standing, single, Box - Line Reduction, subset, or basic fish move.', 'warn');
      }
      context.render();
    }

    return { applyNextCycleInWorker, nextCycle, applyBasics };
  }

  app.cycleControls = { create };
})(window);
