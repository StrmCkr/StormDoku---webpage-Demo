/* Apply the currently highlighted move when it remains applicable. */
(function installHighlightedMoveActions(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    getHighlightedMoveStep,
    getBoardComplete,
    getPromotionQueue,
    getCandidates,
    setStatus,
    snapshotState,
    applyCycleChoice,
    clearSearchResultsAfterApply,
    render,
    getHighlightedEurekaText,
    getLogEntries,
    renderActionButtons,
  }) {
    function canApply(step) {
      if (!step || getBoardComplete()) return false;
      if (step.tech === 'last-man-standing') return !getPromotionQueue().length;
      const candidates = getCandidates();
      return (step.elim?.items || []).some(item =>
        (candidates[item.cell] || []).includes(item.digit));
    }

    function applyHighlightedMove() {
      const step = getHighlightedMoveStep();
      if (!canApply(step)) {
        setStatus('No applicable highlighted move.', 'warn');
        return false;
      }

      const before = snapshotState();
      if (!applyCycleChoice(before, [], { step })) return false;
      clearSearchResultsAfterApply(step?.tech === 'colouring' ? step.colouringMethod : null);
      render();
      return true;
    }

    function renderSolutionActions() {
      renderActionButtons({
        hasHighlightedMove: !!getHighlightedEurekaText(),
        hasLogEntries: getLogEntries().length > 0,
        canApply: canApply(getHighlightedMoveStep()),
      });
    }

    return { canApply, applyHighlightedMove, renderSolutionActions };
  }

  app.highlightedMoveActions = { create };
})(window);
