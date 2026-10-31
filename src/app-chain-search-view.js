/* StormDoku dedicated chain-search result list rendering. */
(function installChainSearchView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, chainText, getSelectedChainIndex }) {
    function renderReport({
      container,
      report,
      emptyText,
      label,
      summaryText,
      listTag = 'ol',
      titleForChain,
      summarySuffix = '',
      onSelect,
      limit = 200,
    }) {
      container.textContent = '';
      if (!report) {
        container.textContent = emptyText;
        return;
      }

      const chains = report.chains || [];
      const summary = documentRef.createElement('p');
      summary.textContent = summaryText
        ? summaryText(chains, report)
        : `${chains.length} ${label}${chains.length === 1 ? '' : 's'} found.${summarySuffix}`;
      container.appendChild(summary);
      if (!chains.length) return;

      const list = documentRef.createElement(listTag);
      list.className = 'chain-list';
      chains.slice(0, limit).forEach((chain, index) => {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === getSelectedChainIndex() ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        const title = titleForChain?.(chain);
        if (title) button.title = title;
        button.addEventListener('click', () => onSelect(index, chain));
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);

      if (chains.length > limit) {
        const moreText = documentRef.createElement('p');
        moreText.textContent = `Showing ${limit} of ${chains.length} records.`;
        container.appendChild(moreText);
      }
    }

    return { renderReport };
  }

  app.chainSearchView = { create };
})(window);
