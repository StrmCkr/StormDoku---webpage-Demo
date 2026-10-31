/* StormDoku simple step-report list rendering. */
(function installStepListView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document }) {
    function render({ report, container, label, emptyText = '', selectedIndex, descriptionFor, onSelect }) {
      container.textContent = '';
      if (!report) {
        if (emptyText) container.textContent = emptyText;
        return;
      }
      const summary = documentRef.createElement('p');
      summary.textContent = `${report.length} ${label}.`;
      container.appendChild(summary);
      const list = documentRef.createElement('ul');
      list.className = 'chain-list';
      report.forEach((step, index) => {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedIndex === index) button.classList.add('selected');
        button.textContent = `${index + 1}. ${descriptionFor(step)}`;
        button.addEventListener('click', () => onSelect(index));
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    return { render };
  }

  app.stepListView = { create };
})(window);
