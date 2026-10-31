/* StormDoku AHS-DOF result rendering. */
(function installAhsDofView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, core, getNetIndex, getChainIndex, onNetSelect, onChainSelect }) {
    function renderNet(report, container) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No AHS-DOF search has been run.';
        return;
      }
      const results = report.results || report.links || [];
      const summary = documentRef.createElement('p');
      const rejected = report.rejectedResults?.length || 0;
      summary.textContent = `${results.length} verified AHS-DOF net${results.length === 1 ? '' : 's'} found.`
        + (rejected ? ` ${rejected} rejected by verification.` : '');
      container.appendChild(summary);
      if (!results.length) return;

      const list = documentRef.createElement('ol');
      list.className = 'chain-list';
      results.slice(0, 200).forEach((link, index) => {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (getNetIndex() === index) button.classList.add('selected');
        button.textContent = `${index + 1}. AHS-DOF: ${core.formatAhsDofNet(link)}`;
        button.title = 'Display this AHS-DOF net on the grid';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          onNetSelect(index, report, container);
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    function renderChain(report, container) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No AHS-DOF chain search has been run.';
        return;
      }
      const results = report.results || report.links || [];
      const summary = documentRef.createElement('p');
      summary.textContent = `${results.length} verified AHS-DOF chain${results.length === 1 ? '' : 's'} found.`
        + ` ${report.stats?.nets || 0} nets, ${report.stats?.bridges || 0} bridges checked`
        + `${report.stats?.truncated ? '; result limit reached.' : '.'}`;
      container.appendChild(summary);
      if (!results.length) return;

      const list = documentRef.createElement('ol');
      list.className = 'chain-list';
      results.slice(0, 200).forEach((chain, index) => {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (getChainIndex() === index) button.classList.add('selected');
        button.textContent = `${index + 1}. AHS-DOF Chain: ${core.formatAhsDofChain(chain)}`;
        button.title = 'Display this AHS-DOF chain on the grid';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          onChainSelect(index, report, container);
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    return { renderNet, renderChain };
  }

  app.ahsDofView = { create };
})(window);
