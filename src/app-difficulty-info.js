/* StormDoku shared difficulty information rendering. */
(function installDifficultyInfo(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function renderFlow(groups, list) {
    if (!list) return;
    list.textContent = '';
    groups
      .filter(group => group.category !== 'ANY' && group.category !== 'LULZ')
      .forEach((group, index) => {
        const item = document.createElement('li');
        const heading = document.createElement('strong');
        heading.textContent = `${index + 1}. ${group.category}. `;
        item.appendChild(heading);
        const description = document.createElement('span');
        description.textContent = group.items.map(([name, score]) => `${name} (${score})`).join('; ');
        item.appendChild(description);
        list.appendChild(item);
      });
  }

  function create(context) {
    const { elements } = context;
    return {
      renderFlow(groups) {
        renderFlow(groups, elements.flow);
      },
      renderTable(groups) {
        const table = elements.table;
        if (!table) return;
        table.textContent = '';
        const header = document.createElement('div');
        header.className = 'difficulty-table-header';
        header.setAttribute('role', 'row');
        for (const label of ['Difficulty', 'Score', 'Move']) {
          const cell = document.createElement('span');
          cell.textContent = label;
          cell.setAttribute('role', 'columnheader');
          header.appendChild(cell);
        }
        table.appendChild(header);
        for (const group of groups) {
          const details = document.createElement('details');
          details.className = 'difficulty-category';
          const summary = document.createElement('summary');
          summary.setAttribute('role', 'row');
          for (const value of [group.category, group.score,
            `${group.items.length} ${group.items.length === 1 ? 'item' : 'items'}`]) {
            const cell = document.createElement('span');
            cell.textContent = value;
            summary.appendChild(cell);
          }
          details.appendChild(summary);
          const items = document.createElement('div');
          items.className = 'difficulty-items';
          items.setAttribute('role', 'rowgroup');
          group.items.forEach(([name, itemScore, note, tooltip], index) => {
            const item = document.createElement('div');
            item.className = 'difficulty-item';
            item.setAttribute('role', 'row');
            if (tooltip) item.title = tooltip;
            const itemIndex = document.createElement('span');
            itemIndex.className = 'difficulty-item-index';
            itemIndex.textContent = `${index + 1}.`;
            const itemName = document.createElement('span');
            itemName.textContent = name;
            const itemScoreEl = document.createElement('span');
            itemScoreEl.className = 'difficulty-item-score';
            itemScoreEl.textContent = note ? `${itemScore} ${note}` : itemScore;
            item.append(itemIndex, itemName, itemScoreEl);
            items.appendChild(item);
          });
          details.appendChild(items);
          table.appendChild(details);
        }
      },
    };
  }

  app.difficultyInfo = { create };
})(window);
