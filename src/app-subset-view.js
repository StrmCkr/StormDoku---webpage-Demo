/* StormDoku grouped subset report rendering. */
(function installSubsetView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document }) {
    function render({ report, container, kind, selectedKey, subsetSizeName, cellGroupName,
      sectorGroupName, formatRemovals, onSelect }) {
      container.textContent = '';
      if (!report) return;

      const hidden = kind === 'hidden';
      const summary = documentRef.createElement('p');
      summary.textContent = `${report.length} ${hidden ? 'hidden' : 'naked'} subset reports.`;
      container.appendChild(summary);

      const groups = new Map();
      for (const item of report) {
        const bucket = groups.get(item.size) || [];
        bucket.push(item);
        groups.set(item.size, bucket);
      }

      const sizeGroups = documentRef.createElement('div');
      sizeGroups.className = 'chain-categories';
      for (const [size, records] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
        const sizePanel = documentRef.createElement('details');
        sizePanel.className = 'chain-category';
        sizePanel.open = selectedKey?.startsWith(`${size}:`) || false;

        const sizeSummary = documentRef.createElement('summary');
        const sizeName = documentRef.createElement('strong');
        sizeName.className = 'chain-category-name';
        sizeName.textContent = `Size ${size} - ${subsetSizeName(size)}`;
        const sizeCount = documentRef.createElement('span');
        sizeCount.className = 'chain-category-count';
        sizeCount.textContent = `${records.length} ${records.length === 1 ? 'subset' : 'subsets'}`;
        sizeSummary.appendChild(sizeName);
        sizeSummary.appendChild(sizeCount);
        sizePanel.appendChild(sizeSummary);

        const list = documentRef.createElement('ul');
        list.className = 'chain-list';
        const visible = records.slice(0, 200);
        for (const item of visible) {
          const label = `${item.locked ? 'Locked ' : ''}${hidden ? 'Hidden' : 'Naked'} ${subsetSizeName(item.size)}`;
          const entry = documentRef.createElement('li');
          const button = documentRef.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          const index = records.indexOf(item);
          const key = `${size}:${index}`;
          if (selectedKey === key) button.classList.add('selected');
          button.textContent = `${label}: (${item.digits.join('')}) `
            + `${cellGroupName(item.cells)} in ${sectorGroupName([item.sector])} => `
            + `${formatRemovals(item.removals)}`;
          button.addEventListener('click', () => onSelect(index, size));
          entry.appendChild(button);
          list.appendChild(entry);
        }
        if (records.length > visible.length) {
          const more = documentRef.createElement('li');
          more.textContent = `Showing ${visible.length} of ${records.length} ${subsetSizeName(size)} records.`;
          list.appendChild(more);
        }
        sizePanel.appendChild(list);
        sizeGroups.appendChild(sizePanel);
      }
      container.appendChild(sizeGroups);
    }

    return { render };
  }

  app.subsetView = { create };
})(window);
