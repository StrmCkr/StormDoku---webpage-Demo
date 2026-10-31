/* StormDoku Hydra result rendering. */
(function installHydraView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    formatHydraResult,
    getSelectedFamily,
    getSelectedIndex,
    onSelect,
  }) {
    function renderReport(report, container, family) {
      container.textContent = '';
      if (!report) {
        container.textContent = `No ${family}-Hydra search has been run.`;
        return;
      }
      const results = report.results || [];
      const summary = documentRef.createElement('p');
      summary.textContent = `${results.length} ${family}-Hydra result${results.length === 1 ? '' : 's'}. `
        + `${report.stats?.aicChainsChecked || 0} verified AIC chain${(report.stats?.aicChainsChecked || 0) === 1 ? '' : 's'} checked; `
        + `${report.stats?.hydraParticipants || 0} ${family}-chain participant${(report.stats?.hydraParticipants || 0) === 1 ? '' : 's'} tested.`;
      container.appendChild(summary);
      if (!results.length) {
        const empty = documentRef.createElement('p');
        empty.textContent = 'No verified Hydra continuation was found.';
        container.appendChild(empty);
        return;
      }
      const list = documentRef.createElement('ul');
      list.className = 'chain-list';
      results.slice(0, 500).forEach((result, index) => {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (getSelectedFamily() === family && getSelectedIndex() === index) {
          button.classList.add('selected');
        }
        button.textContent = `${index + 1}. ${formatHydraResult(result)}`;
        button.title = `Display this Hydra ${family}-DOF continuation on the grid`;
        button.addEventListener('click', () => onSelect(report, container, family, index));
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    return { renderReport };
  }

  app.hydraView = { create };
})(window);
