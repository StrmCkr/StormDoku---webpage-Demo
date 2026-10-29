/* StormDoku MSLS result-to-step adapter. */
(function installMslsView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function stepFromResult(result, core) {
    const eliminations = (result.eliminations || []).map(item => ({
      cell: item.r * 9 + item.c,
      digit: item.digit,
    }));
    return {
      tech: 'msls',
      name: 'MSLS',
      desc: core.formatMsls(result),
      elim: { items: eliminations },
      digits: [...new Set((result.links || []).flatMap(link => link.digits || []))],
      vertices: result.cellIds || [],
      at: result.cellIds || [],
      mslsLinks: result.links || [],
      mslsBaseCells: result.baseCellIds || result.cellIds || [],
      mslsCoverCells: result.coverCellIds || [],
      mslsCoverAtoms: result.coverAtoms || [],
    };
  }

  function create(context) {
    const { documentRef, resultsEl, core, getReport, getSelectedIndex, onSelect } = context;

    function render() {
      resultsEl.textContent = '';
      const report = getReport();
      if (!report) {
        resultsEl.textContent = 'No MSLS search has been run.';
        return;
      }
      const results = report.results || [];
      const flagged = results.filter(result => (result.safetyFlags || []).length);
      const summary = documentRef.createElement('p');
      summary.textContent = `${results.length} MSLS results found.`
        + (report.stats?.truncated ? ' Search limit reached; results are incomplete.' : '')
        + (flagged.length ? ` ${flagged.length} flagged for inspection.` : '');
      resultsEl.appendChild(summary);
      if (!results.length) {
        const empty = documentRef.createElement('p');
        empty.textContent = 'No MSLS elimination was found.';
        resultsEl.appendChild(empty);
        return;
      }
      const categories = documentRef.createElement('div');
      categories.className = 'chain-categories';
      const groups = new Map();
      const classOrder = ['MS-AHS', 'MS-LS', 'MS-NS', 'MSLS'];
      for (const [index, result] of results.slice(0, 500).entries()) {
        const nameClass = String(result.model || 'MSLS');
        const entries = groups.get(nameClass) || [];
        entries.push({ result, index });
        groups.set(nameClass, entries);
      }
      const orderedGroups = [...groups.entries()].sort((left, right) => {
        const leftIndex = classOrder.indexOf(left[0]);
        const rightIndex = classOrder.indexOf(right[0]);
        return (leftIndex < 0 ? classOrder.length : leftIndex)
          - (rightIndex < 0 ? classOrder.length : rightIndex)
          || left[0].localeCompare(right[0]);
      });
      for (const [nameClass, entries] of orderedGroups) {
        const folder = documentRef.createElement('details');
        folder.className = 'chain-category';
        folder.open = entries.some(({ index }) => index === getSelectedIndex());
        const summary = documentRef.createElement('summary');
        const label = documentRef.createElement('strong');
        label.className = 'chain-category-name';
        label.textContent = nameClass;
        const count = documentRef.createElement('span');
        count.className = 'chain-category-count';
        count.textContent = `${entries.length} ${entries.length === 1 ? 'result' : 'results'}`;
        summary.appendChild(label);
        summary.appendChild(count);
        folder.appendChild(summary);

        const list = documentRef.createElement('ul');
        list.className = 'chain-list';
        for (const { result, index } of entries) {
          const item = documentRef.createElement('li');
          const button = documentRef.createElement('button');
          const safetyFlags = result.safetyFlags || [];
          button.type = 'button';
          button.className = 'chain-result';
          if (safetyFlags.length) button.classList.add('chain-result-flagged');
          if (getSelectedIndex() === index) button.classList.add('selected');
          button.textContent = `${safetyFlags.length ? '[FLAGGED] ' : ''}${index + 1}. ${core.formatMsls(result)}`;
          button.title = safetyFlags.length
            ? `Flagged for inspection: ${safetyFlags.join('; ')}`
            : 'Highlight this MSLS result and its eliminations on the grid';
          button.addEventListener('click', () => onSelect(result, index, safetyFlags));
          item.appendChild(button);
          list.appendChild(item);
        }
        folder.appendChild(list);
        categories.appendChild(folder);
      }
      resultsEl.appendChild(categories);
      if (results.length > 500) {
        const more = documentRef.createElement('p');
        more.textContent = `Showing 500 of ${results.length} results.`;
        resultsEl.appendChild(more);
      }
    }

    return { render };
  }

  app.mslsView = { stepFromResult, create };
})(window);
