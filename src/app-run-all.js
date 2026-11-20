/* Run All cycle orchestration over the configured solver hierarchy. */
(function installRunAll(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    async function runAll() {
      const context = getContext();
      if (context.busy) return;
      context.leaveHistoryPreview();
      if (context.boardIsComplete()) {
        context.ratingReport = context.ratingFromLog(context.logEntries, true);
        context.setStatus('Completed. The board is already solved.', 'ok');
        context.render();
        return;
      }
      let ran = 0;
      let stopReason = null;
      const searchToken = context.setBusy(true);
      context.setStatus('Run All started. Applying the enabled hierarchy from the first phase on each cycle.');
      try {
        while (ran < 100) {
          if (searchToken !== context.searchEpoch) return;
          const before = context.snapshotState();
          const promoted = context.applyQueuedPromotions();
          if (context.boardIsComplete()) {
            if (context.applyCycleChoice(before, promoted, null)) ran += 1;
            break;
          }
          context.setStatus(`Run All: searching cycle ${ran + 1}...`);
          let choice = await context.chooseInteractiveStep({
            allowSynchronousFallback: false,
          });
          if (!choice && context.lastInteractiveSearchError
            && context.lastInteractiveSearchError.code !== 'INTERACTIVE_SEARCH_TIMEOUT') {
            context.setStatus('Run All search worker restarted; retrying the current cycle...', 'warn');
            await new Promise(resolve => setTimeout(resolve, 0));
            choice = await context.chooseInteractiveStep({
              allowSynchronousFallback: true,
            });
          }
          if (!choice) {
            stopReason = context.lastInteractiveSearchError?.code === 'INTERACTIVE_SEARCH_TIMEOUT'
              ? `Run All stopped in ${context.activeHierarchyPhase || 'the current phase'} after 15 seconds without worker progress.`
              : context.lastInteractiveSearchError
                ? `Run All stopped: search worker failed after retry (${context.lastInteractiveSearchError.message}).`
              : 'Run All stopped: no enabled move was returned by the configured hierarchy.';
            break;
          }
          if (!context.applyCycleChoice(before, promoted, choice)) {
            stopReason = 'Run All stopped: the returned move could not be applied.';
            break;
          }
          ran += 1;
          context.renderLog();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } catch (error) {
        if (context.isSearchCancelled(error)) return;
        stopReason = `Run All stopped: ${error.message || error}`;
      } finally {
        context.setBusy(false, searchToken);
      }
      if (context.logEntries.length) {
        context.ratingReport = context.ratingFromLog(
          context.logEntries,
          context.candidateGridIsSolved(context.cand, context.puzzle),
        );
      }
      if (stopReason) {
        context.setStatus(stopReason, 'warn');
      } else if (context.solution && !context.candidateGridIsSolved(context.cand, context.puzzle)) {
        context.setStatus('Run All stopped: enabled moves stalled before the puzzle was solved.', 'warn');
      }
      if (ran === 100) context.setStatus('Run All stopped at 100 cycles.', 'warn');
      if (ran > 0 && ran < 100
        && (!context.solution || context.candidateGridIsSolved(context.cand, context.puzzle))) {
        context.setStatus(`Run All complete. ${ran} enabled move${ran === 1 ? '' : 's'} applied in hierarchy order.`, 'ok');
      }
      context.render();
    }

    return { runAll };
  }

  app.runAll = { create };
})(window);
