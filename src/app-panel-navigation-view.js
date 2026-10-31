/* StormDoku report-panel navigation helpers. */
(function installPanelNavigationView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ boardEl, solutionPanel, requestFrame = global.requestAnimationFrame.bind(global), alertFn = global.alert.bind(global) }) {
    function openReportPanel(resultEl) {
      let panel = resultEl?.closest?.('.pom-panel');
      while (panel) {
        panel.open = true;
        panel = panel.parentElement?.closest?.('.pom-panel') || null;
      }
    }

    function focusMap() {
      const map = boardEl?.closest?.('.grid-frame') || boardEl;
      requestFrame(() => map?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' }));
    }

    function hideSolution() {
      if (solutionPanel) solutionPanel.open = false;
    }

    function showLoadWarning(message) {
      alertFn(message);
    }

    return { openReportPanel, focusMap, hideSolution, showLoadWarning };
  }

  app.panelNavigationView = { create };
})(window);
