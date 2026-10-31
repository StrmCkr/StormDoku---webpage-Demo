/* StormDoku fish report rendering. */
(function installFishView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, core, getSelectedCategory, getSelectedSize, getSelectedKey, onSelect }) {
    function render(report, container) {
      container.textContent = '';
      if (!report) return;

      const categories = ['Basic', 'Franken', 'Mutant'];
      const groups = categories.map(category => report.filter(fish => fish.category === category));
      const summary = documentRef.createElement('p');
      summary.textContent = `${report.length} N x (N + K) fish reports.`
        + ` ${categories.map((category, index) => `${category} ${groups[index].length}`).join(', ')}.`;
      container.appendChild(summary);
      const categoriesEl = documentRef.createElement('div');
      categoriesEl.className = 'chain-categories';
      categories.forEach((category, categoryIndex) => {
        const records = groups[categoryIndex];
        const categoryPanel = documentRef.createElement('details');
        categoryPanel.className = 'chain-category';
        categoryPanel.open = getSelectedCategory() === category;

        const categorySummary = documentRef.createElement('summary');
        const categoryName = documentRef.createElement('strong');
        categoryName.className = 'chain-category-name';
        categoryName.textContent = category;
        const categoryCount = documentRef.createElement('span');
        categoryCount.className = 'chain-category-count';
        categoryCount.textContent = `${records.length} fish`;
        categorySummary.appendChild(categoryName);
        categorySummary.appendChild(categoryCount);
        categoryPanel.appendChild(categorySummary);
        if (!records.length) {
          categoriesEl.appendChild(categoryPanel);
          return;
        }

        const sizes = [...new Set(records.map(fish => fish.size))].sort((a, b) => a - b);
        const sizePanels = documentRef.createElement('div');
        sizePanels.className = 'chain-subcategories';
        for (const size of sizes) {
          const sizeRecords = records.filter(fish => fish.size === size);
          const sizePanel = documentRef.createElement('details');
          sizePanel.className = 'chain-subcategory';
          sizePanel.open = getSelectedCategory() === category && getSelectedSize() === size;
          const sizeSummary = documentRef.createElement('summary');
          const sizeName = documentRef.createElement('strong');
          sizeName.textContent = `Size ${size}`;
          const sizeCount = documentRef.createElement('span');
          sizeCount.className = 'chain-category-count';
          sizeCount.textContent = `${sizeRecords.length} fish`;
          sizeSummary.appendChild(sizeName);
          sizeSummary.appendChild(sizeCount);
          sizePanel.appendChild(sizeSummary);

          const list = documentRef.createElement('ul');
          list.className = 'chain-list';
          const visible = sizeRecords.slice(0, 200);
          for (const fish of visible) {
            const index = records.indexOf(fish);
            const item = documentRef.createElement('li');
            const button = documentRef.createElement('button');
            button.type = 'button';
            button.className = 'chain-result';
            const key = `${category}:${index}`;
            if (getSelectedKey() === key) button.classList.add('selected');
            const removals = fish.cells.map(cell => ({ cell, digit: fish.digit }));
            button.textContent = `${fish.name}: (${fish.digit}) `
              + `${core.sectorGroupName(fish.baseSectors)} / `
              + `${core.sectorGroupName(fish.coverSectors)} => ${core.formatRemovals(removals)}`;
            button.addEventListener('click', () => onSelect(category, index));
            item.appendChild(button);
            list.appendChild(item);
          }
          if (sizeRecords.length > visible.length) {
            const more = documentRef.createElement('li');
            more.textContent = `Showing ${visible.length} of ${sizeRecords.length} ${category} records.`;
            list.appendChild(more);
          }
          sizePanel.appendChild(list);
          sizePanels.appendChild(sizePanel);
        }
        categoryPanel.appendChild(sizePanels);
        categoriesEl.appendChild(categoryPanel);
      });
      container.appendChild(categoriesEl);
    }

    return { render };
  }

  app.fishView = { create };
})(window);
