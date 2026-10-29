/* Chromatic report formatting and result conversion helpers. */
(function installChromaticView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, getCandidates }) {
    function eureka(record) {
      const digits = (record.digits || []).join('');
      const sectors = (record.sectorNames || []).join(',');
      const cells = core.cellGroupName(record.cells || []) || 'none';
      const guardians = core.cellGroupName(record.guardians || []) || 'none';
      const eliminations = core.formatRemovals(record.eliminations || []) || 'none';
      return `${record.classification}: K=${record.k} {${digits}} over ${sectors}; `
        + `${cells}; guardian ${guardians} => ${eliminations}`;
    }

    function stepFromResult(record) {
      const items = core.eliminationItems({ items: record.eliminations || [] }, getCandidates());
      return {
        tech: record.tech,
        name: record.classification,
        structureName: record.classification,
        desc: eureka(record),
        elim: { items },
        at: [...(record.cells || [])],
        vertices: [...(record.cells || [])],
        chromaticRecord: record,
      };
    }

    function renderGraphReport({ element, report, selectedIndex, onSelect }) {
      element.textContent = '';
      if (!report) {
        element.textContent = 'No chromatic graph search has been run.';
        return;
      }
      const summary = document.createElement('p');
      summary.textContent = `${report.results.length} non-colourable graph${report.results.length === 1 ? '' : 's'}.`
        + (report.stats?.truncated ? ' Search limit reached.' : '');
      element.appendChild(summary);
      const list = document.createElement('ul');
      list.className = 'log';
      report.results.forEach((record, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        button.textContent = `${index + 1}. ${eureka(record)}`;
        button.title = 'Highlight this chromatic graph and its guardian eliminations';
        if (selectedIndex === index) button.classList.add('selected');
        button.addEventListener('click', () => onSelect(record, index));
        item.appendChild(button);
        list.appendChild(item);
      });
      element.appendChild(list);
    }

    function renderAlsGraphReport({ element, report, selectedIndex, onSelect }) {
      element.textContent = '';
      if (!report) {
        element.textContent = 'No ALS chromatic graph search has been run.';
        return;
      }
      const typeLabels = {
        1: 'Type 1: one ALS DOF guardian',
        '2a': 'Type 2A: one ALS DOF, multiple guardians',
        '2b': 'Type 2B: two ALS DOF, shared-digit guardians',
        '2c': 'Type 2C: three ALS DOF-1 guardians',
      };
      const typeOrder = [1, '2a', '2b', '2c'];
      const typeGroups = new Map(typeOrder.map(type => [type, []]));
      report.results.forEach((record, index) => {
        if (!typeGroups.has(record.type)) typeGroups.set(record.type, []);
        typeGroups.get(record.type).push({ record, index });
      });
      const summary = document.createElement('p');
      const typeSummary = typeOrder
        .map(type => `${typeLabels[type]}: ${typeGroups.get(type).length}`)
        .join(' | ');
      const stats = report.stats || {};
      const diagnosticSummary = [
        Number.isFinite(stats.alsRecords) ? `ALS records: ${stats.alsRecords}` : '',
        Number.isFinite(stats.alsDofZero) ? `DOF 0: ${stats.alsDofZero}` : '',
        Number.isFinite(stats.tested) ? `tests: ${stats.tested}` : '',
      ].filter(Boolean).join(' | ');
      summary.textContent = `${report.results.length} ALS-backed non-colourable graph${report.results.length === 1 ? '' : 's'} (${typeSummary}).`
        + (diagnosticSummary ? ` ${diagnosticSummary}.` : '')
        + (stats.truncated ? ' Search limit reached.' : '');
      element.appendChild(summary);
      typeGroups.forEach((entries, type) => {
        if (!entries.length) return;
        const heading = document.createElement('h3');
        heading.textContent = typeLabels[type] || `Type ${type}`;
        element.appendChild(heading);
        const list = document.createElement('ul');
        list.className = 'log';
        entries.forEach(({ record, index }) => {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          if (selectedIndex === index) button.classList.add('selected');
          button.textContent = `${index + 1}. ${eureka(record)}`;
          button.title = 'Highlight this ALS-backed chromatic graph and its eliminations';
          button.addEventListener('click', () => onSelect(record, index));
          item.appendChild(button);
          list.appendChild(item);
        });
        element.appendChild(list);
      });
    }

    return { eureka, stepFromResult, renderGraphReport, renderAlsGraphReport };
  }

  app.chromaticView = { create };
})(window);
