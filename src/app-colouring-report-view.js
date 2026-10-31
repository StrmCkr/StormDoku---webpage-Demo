/* StormDoku colouring report list rendering. */
(function installColouringReportView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document }) {
    function render({ report, container, label, emptyText, noResultText, eureka, selectedIndex, onSelect }) {
      container.textContent = '';
      if (!report) {
        container.textContent = emptyText;
        return;
      }
      const summary = documentRef.createElement('p');
      summary.textContent = `${report.length} ${label} result${report.length === 1 ? '' : 's'}.`;
      container.appendChild(summary);
      if (!report.length) {
        const empty = documentRef.createElement('p');
        empty.textContent = noResultText;
        container.appendChild(empty);
        return;
      }

      const list = documentRef.createElement('ul');
      list.className = 'log';
      report.forEach((record, index) => {
        const safetyFlags = record.safetyFlags || [];
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (safetyFlags.length) button.classList.add('chain-result-flagged');
        if (selectedIndex === index) button.classList.add('selected');
        button.textContent = `${safetyFlags.length ? '[FLAGGED] ' : ''}${eureka(record)}`;
        button.title = safetyFlags.length
          ? `Flagged for inspection: ${safetyFlags.join('; ')}`
          : `Highlight this ${label} result on the grid`;
        button.addEventListener('click', () => onSelect(index));
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    return { render };
  }

  app.colouringReportView = { create };
})(window);
