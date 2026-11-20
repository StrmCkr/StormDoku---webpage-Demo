/* Apply one solver cycle choice and synchronize its reports and history. */
(function installCycleApplication(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    function apply(before, promoted, choice) {
      const context = getContext();
      if (!choice?.step) {
        context.activeStep = null;
        context.lastRemoved = [];
        if (promoted.length) {
          context.cycle += 1;
          context.undoStack.push(before);
          context.redoStack = [];
          context.setStatus(
            context.boardIsComplete()
              ? `${context.promotionSummary(promoted)} promoted. Completed.`
              : `${context.promotionSummary(promoted)} promoted. No enabled move found.`,
            'ok',
          );
          return true;
        }
        const diagnostics = context.lastChainSelectionDiagnostics;
        const diagnosticText = diagnostics?.received
          ? ` Chain filters: ${diagnostics.received} received, ${diagnostics.phaseRejected} phase, ${diagnostics.toggleRejected} toggle, ${diagnostics.noElimination} empty, ${diagnostics.safetyRejected} safety, ${diagnostics.ratingRejected} rating, ${diagnostics.accepted} accepted.`
          : '';
        context.setStatus(`No enabled move found. Candidate grid is current.${diagnosticText}`, 'warn');
        return false;
      }

      const step = choice.step;
      // Keep the candidate state that produced the selected report so the
      // explanation remains tied to the exact search result after applying it.
      const reportCandidateGrid = choice.report
        ? context.core.cloneCandidates(context.cand)
        : null;

      const verification = context.verifyEliminationsByCompletion(
        context.core.eliminationItems(step.elim, context.cand),
      );
      if (!verification.ok) {
        context.activeStep = null;
        context.lastRemoved = [];
        context.setStatus(
          `Move rejected by independent verification: ${verification.errors.join('; ')}`,
          'warn',
        );
        return false;
      }

      const removed = context.core.applyEliminations(context.cand, step.elim);
      if (!removed.length) {
        if (step.tech === 'last-man-standing') {
          const queued = context.queuePromotions(step, removed);
          if (!queued.length) {
            context.activeStep = null;
            context.lastRemoved = [];
            context.setStatus('Last Man Standing found no promotable cell.', 'warn');
            return false;
          }

          context.cycle += 1;
          context.activeStep = step;
          context.lastRemoved = [];
          context.chainReport = null;
          context.selectedChainIndex = null;
          context.undoStack.push(before);
          context.redoStack = [];
          context.appendStep(step);
          context.setStatus(`${context.displayTech(step.tech)} found. ${context.promotionSummary(queued)} queued for the next cycle. Candidate grid unchanged.`, 'ok');
          return true;
        }

        context.activeStep = null;
        context.lastRemoved = [];
        if (promoted.length) {
          context.cycle += 1;
          context.undoStack.push(before);
          context.redoStack = [];
          context.setStatus(`${context.promotionSummary(promoted)} promoted. No real elimination remained.`, 'ok');
          return true;
        }
        context.setStatus('No real elimination remained. Candidate grid is current.', 'warn');
        return false;
      }

      context.cycle += 1;
      context.activeStep = step;
      context.lastRemoved = removed;
      if (step.tech === 'als-dof' && choice.alsDofReport) {
        context.alsDofReport = choice.alsDofReport;
        context.selectedAlsDofSource = choice.alsDofSource || 'net';
        context.selectedAlsDofIndex = choice.alsDofIndex ?? null;
        context.selectedAlsDof = null;
        context.chainReport = null;
        context.selectedChainIndex = null;
      } else {
        context.selectedAlsDofIndex = null;
        context.chainReport = choice.report
          ? { ...choice.report, candidateGrid: reportCandidateGrid }
          : null;
        context.selectedChainIndex = choice.report ? choice.index : null;
      }
      context.undoStack.push(before);
      context.redoStack = [];

      const queued = context.queuePromotions(step, removed);
      context.appendStep(step);
      const promotionText = queued.length
        ? ` ${context.promotionSummary(queued)} queued for the next cycle.`
        : '';
      const promotedText = promoted.length
        ? ` ${context.promotionSummary(promoted)} promoted.`
        : '';
      context.setStatus(`${context.displayTech(step.tech)} applied.${promotedText}${promotionText} Candidate grid updated for the next cycle.`, 'ok');
      return true;
    }

    return { apply };
  }

  app.cycleApplication = { create };
})(window);
