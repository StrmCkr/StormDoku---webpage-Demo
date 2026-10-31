/* StormDoku solution-action button state rendering. */
(function installSolutionActionsView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ eurekaButton, listButton, applyButton }) {
    function render({ hasHighlightedMove, hasLogEntries, canApply }) {
      if (eurekaButton) eurekaButton.disabled = !hasHighlightedMove;
      if (listButton) listButton.disabled = !hasLogEntries;
      if (applyButton) applyButton.disabled = !canApply;
    }
    return { render };
  }

  app.solutionActionsView = { create };
})(window);
