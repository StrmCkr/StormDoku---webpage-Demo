(function installBugSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create({ elements, state, actions, core, reverse = false, mug = false, pug = false }) {
    const grave = mug || pug;
    const title = pug ? 'Permeable Universal Grave' : mug ? 'Multivalve Universal Grave'
      : reverse ? 'Reverse-BUG' : 'Bivalve Universal Grave';
    const gridKey = () => JSON.stringify(reverse
      ? [state.candidates, state.originalGivens, state.fixedGrid] : state.candidates);
    let renderedReports;
    let renderedGridKey;
    function step(record) {
      // Older worker records used the rejected label "pattern". Keep the
      // visible report vocabulary stable even when one of those records is
      // returned from a cached worker/session.
      const displayName = String(record.name || '').replace(/\bpattern\b/gi, 'construct');
      if (record.tech === 'bug-type-9' || record.tech === 'reverse-bug-type-9'
        || record.tech === 'mug-type-9' || record.tech === 'pug-type-9') {
        return app.uniquenessSearch.type9Step(record, state.candidates, core);
      }
      if (record.forcingPlacements && !record.guardianPair) {
        const proof = app.uniquenessSearch.type8ForcingProof(record, core);
        const guardians = record.guardianAtoms.map(item => '(' + item.digit + ')' + core.cellName(item.cell));
        const givens = record.givenCells?.length ? '; original givens ' + core.cellGroupName(record.givenCells) : '';
        const trade = (record.forcingAssignments || []).filter(item => item.digit !== record.externalDigit);
        return {
          tech: record.tech, name: displayName, structureName: displayName,
          desc: displayName + ': (' + record.digits.join('') + ') ' + core.cellGroupName(record.cells)
            + givens + '; guardians ' + guardians.join(', ') + '; ' + proof.text
            + (trade.length ? '; trade ' + trade.map(item => '(' + item.digit + ')' + core.cellName(item.cell)).join(', ') : '')
            + ' => ' + core.formatRemovals(record.eliminations),
          elim: { items: core.eliminationItems({ items: record.eliminations }, state.candidates) },
          at: [...new Set([...record.cells, ...proof.cells])], vertices: record.cells, digits: record.digits,
          uniquenessStrongLinks: proof.strong, uniquenessRccLinks: proof.weak,
          uniquenessForcingOnAtoms: proof.onAtoms.concat(trade.map(item => item.cell + ':' + item.digit)),
          uniquenessForcingOffAtoms: proof.offAtoms,
        };
      }
      if (record.tech === 'reverse-bug' || record.tech === 'reverse-bug-lite'
        || record.tech?.startsWith('reverse-bug-type-')) return {
        tech: record.tech, name: displayName, structureName: displayName,
        desc: displayName + ': (' + record.digits.join('') + ') ' + core.cellGroupName(record.cells)
          + '; original givens ' + core.cellGroupName(record.givenCells)
          + (record.lockedDigit ? '; (' + record.lockedDigit + ') locked in '
            + (record.targetUnit < 9 ? 'r' : record.targetUnit < 18 ? 'c' : 'b')
            + (record.targetUnit % 9 + 1) + ' at ' + core.cellGroupName(record.targetCells) : '')
          + (record.fishCells?.length ? '; restricted fish (' + record.fishDigit + ') '
            + core.cellGroupName(record.fishCells) : '')
          + (record.internalLinks?.length ? '; internal links ' + record.internalLinks.map(link =>
            '(' + link.digit + ')' + core.cellGroupName(link.cells) + ' forces ' + core.cellName(link.forcedCell)).join(', ') : '')
          + (record.guardCells?.length ? '; guardians off (' + record.guardDigit + ') '
            + core.cellGroupName(record.guardCells) : '')
          + (record.alsRecords?.length ? '; ALS {' + record.alsRecords.map(als =>
            core.cellGroupName(als.alsAllCells) + ' {' + als.alsDigits.join('') + '}').join(' + ') + '}' : '')
          + (record.rccDigits?.length ? '; RCC {' + record.rccDigits.join('') + '}' : '')
          + (record.forcingAssignments?.length ? '; assuming ' + record.forcingAssignments
            .map(item => '(' + item.digit + ')' + core.cellName(item.cell)).join(' -> ') : '')
          + ' => ' + core.formatRemovals(record.eliminations),
        elim: { items: core.eliminationItems({ items: record.eliminations }, state.candidates) },
        at: [...new Set([...record.cells, ...(record.fishCells || []), ...(record.guardCells || []),
          ...(record.alsRecords || []).flatMap(als => als.alsAllCells)])],
        vertices: record.cells, digits: record.digits, alsRecords: record.alsRecords,
        externalGuardAtoms: (record.guardCells || []).map(cell => cell + ':' + record.guardDigit)
          .concat((record.forcingAssignments || []).map(item => item.cell + ':' + item.digit)),
      };
      const guardians = record.guardianPair
        ? record.guardianCells.map(cell => '(' + record.breakerDigit + ')' + core.cellName(cell)).join(' or ')
        : record.guardians.map(({ cell, digit }) => '(' + digit + ')' + core.cellName(cell)).join(', ');
      const alsRecords = record.alsRecords?.map(als => ({
        ...als, alsAllCells: [...als.alsAllCells], alsDigits: [...als.alsDigits],
      }));
      return {
        tech: record.tech, name: displayName, structureName: displayName,
        desc: displayName + ': ' + (grave ? '(' + record.digits.join('') + ') ' : 'Bivalve construct ')
          + core.cellGroupName(record.cells)
          + (grave || record.guardianPair ? '; guardians ' : '; non-BUG candidates ') + guardians
          + (record.sectorLocks?.length ? '; locked ' + record.sectorLocks.map(({ sector, digit }) =>
            '(' + digit + ')' + (sector < 9 ? 'r' : sector < 18 ? 'c' : 'b') + (sector % 9 + 1)).join(', ') : '')
          + (grave && record.fishCells?.length ? '; restricted fish (' + record.fishDigit + ') '
            + core.cellGroupName(record.fishCells) : '')
          + (grave && record.internalLinks?.length ? '; internal links ' + record.internalLinks.map(link =>
            '(' + link.digit + ')' + core.cellGroupName(link.cells) + ' forces ' + core.cellName(link.forcedCell)).join(', ') : '')
          + (alsRecords?.length ? '; ALS {' + alsRecords.map(als =>
            core.cellGroupName(als.alsAllCells) + ' {' + als.alsDigits.join('') + '}').join(' + ') + '}' : '')
          + (record.rccDigits?.length ? '; RCC {' + record.rccDigits.join('') + '}' : '')
          + ' => ' + core.formatRemovals(record.eliminations),
        elim: { items: core.eliminationItems({ items: record.eliminations }, state.candidates) },
        at: [...record.cells, ...(record.guardianCells || []), ...(alsRecords || []).flatMap(als => als.alsAllCells)], vertices: record.cells,
        alsRecords,
        digits: [],
        externalGuardAtoms: record.guardianPair
          ? record.guardianCells.map(cell => cell + ':' + record.breakerDigit)
          : record.guardians.map(item => item.cell + ':' + item.digit),
      };
    }
    function select(record) {
      state.activeStep = step(record);
      actions.renderBoard();
      actions.openReportPanel(elements.results);
      actions.focusMap();
      actions.setStatus(record.name + ' selected.', 'ok');
    }
    function render() {
      const key = gridKey();
      if (renderedReports === state.reports && renderedGridKey === key) return;
      renderedReports = state.reports;
      renderedGridKey = key;
      elements.results.textContent = '';
      const reports = Object.values(state.reports || {}).filter(report => report.gridKey === key);
      if (!reports.length) {
        elements.results.textContent = 'No ' + title + ' search has been run.';
        return;
      }
      if (reports.some(report => report.unsupportedVariants?.length)) {
        elements.results.textContent = title + ' is unavailable with the selected variants.';
        return;
      }
      if (!reports.some(report => report.results.length)) {
        elements.results.textContent = 'No ' + title + ' eliminations found.';
        return;
      }
      const groups = new Map();
      for (const record of reports.flatMap(report => report.results)) {
        const displayName = String(record.name || '').replace(/\bpattern\b/gi, 'construct');
        const group = groups.get(displayName) || new Map();
        const signature = JSON.stringify([
          (record.basePairs || record.assignments || []).map(item =>
            [item.cell, item.digits || item.digit]),
          record.cells,
          record.forcingPlacements ? [record.externalDigit, record.externalCells || [record.externalCell]] : null,
          grave ? [record.fishDigit, record.fishCells] : null,
          (record.alsRecords || []).map(als =>
            [als.alsAllCells, als.alsDigits]).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
        ]);
        const existing = group.get(signature);
        if (existing) {
          const eliminations = new Map([...existing.eliminations, ...record.eliminations]
            .map(item => [item.cell + ':' + item.digit, item]));
          group.set(signature, { ...existing, eliminations: [...eliminations.values()] });
        } else group.set(signature, { ...record, name: displayName });
        groups.set(displayName, group);
      }
      for (const [name, records] of groups) {
        const folder = document.createElement('details');
        folder.className = 'chain-subcategory';
        folder.open = true;
        const summary = document.createElement('summary');
        summary.textContent = name + ' · ' + records.size + ' results';
        folder.appendChild(summary);
        for (const record of records.values()) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          button.textContent = step(record).desc;
          button.addEventListener('click', () => select(record));
          folder.appendChild(button);
        }
        elements.results.appendChild(folder);
      }
    }
    function run(event, type = null) {
      event.preventDefault();
      event.stopPropagation();
      const label = type ? (pug ? 'PUG Type ' : mug ? 'MUG Type ' : reverse ? 'Reverse-BUG Type ' : 'B.U.G Type ') + type.split('-')[0]
        + (type === '3' ? ' - ALS' : type.startsWith('3-') ? ' - ALS-' + (type === '3-chain' ? 'Chain' : type.slice(2).toUpperCase()) : '') : null;
      const name = label || (pug ? 'PUG Type 1' : mug ? 'MUG Type 1' : title);
      const key = gridKey();
      const candidateGrid = state.candidates.map(values => [...values]);
      const originalGivens = reverse ? [...state.originalGivens] : undefined;
      const fixedGrid = reverse ? [...state.fixedGrid] : undefined;
      state.activeStep = null;
      actions.renderBoard();
      const token = actions.setBusy(true);
      actions.setStatus('Searching ' + name + '...');
      actions.scheduleSearch(async () => {
        try {
          const reports = { ...state.reports };
          const searches = grave ? [[(pug ? 'pug-type-' : 'mug-type-') + (type || '1'), name]] : reverse
            ? (type ? [['reverse-type-' + type, label]]
              : [['reverse', 'Reverse-BUG'], ['reverse-lite', 'Reverse-BUG-Lite']])
            : type ? [['type-' + type, label]]
            : [['1', 'B.U.G +1'], ['n', 'B.U.G +n'], ['lite', 'B.U.G -Lite']];
          for (const [mode, label] of searches) {
            const report = await actions.runSearchWorker(grave ? mode : reverse
              ? mode.startsWith('reverse-type-') ? 'reverse-bug-type-' + type
                : mode === 'reverse-lite' ? 'reverse-bug-lite' : 'reverse-bug' : 'bug-' + mode, {
              candidateGrid, originalGivens, fixedGrid,
            });
            if (gridKey() !== key) return;
            reports[mode] = { ...report, name: label, gridKey: key };
          }
          state.reports = reports;
          render();
          const first = searches.flatMap(([mode]) => reports[mode].results)[0];
          if (first) select(first);
          else {
            actions.openReportPanel(elements.results);
            actions.setStatus(name + ' found no eliminations.', 'warn');
          }
        } catch (error) {
          if (!actions.isSearchCancelled(error)) actions.setStatus('Could not search ' + name + ': ' + error.message, 'warn');
        } finally {
          actions.setBusy(false, token);
        }
      }, 0);
    }
    elements.button.addEventListener('click', run);
    if (grave) {
      const attribute = pug ? 'data-pug-type' : 'data-mug-type';
      for (const button of document.querySelectorAll('[' + attribute + ']')) {
        button.addEventListener('click', event => run(event, button.getAttribute(attribute)));
      }
    } else if (reverse) {
      for (const button of document.querySelectorAll('[data-reverse-bug-type]')) {
        button.addEventListener('click', event => run(event, button.dataset.reverseBugType));
      }
    } else {
      for (const button of document.querySelectorAll('[data-bug-type]')) {
        button.addEventListener('click', event => run(event, button.dataset.bugType));
      }
    }
    const prefix = pug ? 'pug' : mug ? 'mug' : reverse ? 'reverseBug' : 'bug';
    const toggle = document.getElementById(prefix + 'Type3Toggle');
    const menu = document.getElementById(prefix + 'Type3Menu');
    toggle?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
    });
    return { render };
  }
  app.bugSearch = { create };
})(window);
