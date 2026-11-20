/* Standalone Unique Rectangle searches and result selection. */
(function installUniquenessSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function type9Step(record, candidates, core) {
    const guardians = record.guardianGroups || record.guardians;
    const groups = guardians.map(group => '(' + group.digit + ')' + core.cellGroupName(group.cells));
    const reverseGroups = record.reverseGroups || [];
    const paths = record.ring ? record.ringPaths.flat()
      : record.twoWay ? record.twoWayPaths.flat().filter(Boolean)
        : reverseGroups.length ? reverseGroups.map(group => group.path)
          : record.witnesses.flatMap(item => item.paths || []);
    const strong = new Map();
    const weak = new Map();
    for (const [pathIndex, path] of paths.entries()) for (let index = 1; index < path.length; index += 1) {
      const left = path[index - 1];
      const right = path[index];
      const startGroup = !record.ring && !record.twoWay ? reverseGroups[pathIndex] : null;
      const startCells = startGroup && index === 1 ? startGroup.cells : [left.cell];
      const endGroup = startGroup && index === path.length - 1
        ? guardians.find(group => group.digit === right.digit && group.cells.includes(right.cell))
        : null;
      const endCells = endGroup ? endGroup.cells : [right.cell];
      const key = [left.cell + ':' + left.digit, right.cell + ':' + right.digit].sort().join(',');
      if (right.on) strong.set(key, {
        activeCells: startCells, linkedCells: endCells,
        startingDigits: [left.digit], linkDigits: [right.digit], linkType: left.cell === right.cell ? 4 : 0,
      });
      else if (left.digit === right.digit) weak.set(key, {
        leftCells: startCells, rightCells: endCells, digit: left.digit,
      });
    }
    const trace = reverseGroups.length
      ? [...reverseGroups.reduce((map, group) => {
        const suffix = group.path.slice(1)
          .map(item => `${item.cell}:${item.digit}:${item.on ? 1 : 0}`).join(',');
        const key = `${group.digit}|${suffix}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(group);
        return map;
      }, new Map()).values()].map(groupsForSuffix => {
        const [{ path, digit }] = groupsForSuffix;
        const [, ...rest] = path;
        const starts = groupsForSuffix.map(group => core.cellGroupName(group.cells));
        const startGroup = starts.length > 1 ? '(' + starts.join(' or ') + ')' : starts[0];
        return '(' + digit + ')' + startGroup
          + rest.map((item, index) => {
            const endGroup = index === rest.length - 1
              ? guardians.find(group => group.digit === item.digit && group.cells.includes(item.cell))
              : null;
            return (item.on ? ' = ' : ' - ') + '(' + item.digit + ')'
              + (endGroup ? core.cellGroupName(endGroup.cells) : core.cellName(item.cell));
          }).join('');
      }).join(' / ')
      : paths.map(path => {
        const [first, ...rest] = path;
        return '(' + first.digit + ')' + core.cellName(first.cell)
          + rest.map(item => (item.on ? ' = ' : ' - ')
            + '(' + item.digit + ')' + core.cellName(item.cell)).join('');
      }).join(' / ');
    const removals = core.formatRemovals(record.eliminations);
    return {
      tech: record.tech, name: record.classification, structureName: record.classification,
      desc: record.classification + ': (' + record.digits.join('') + ') ' + (record.guardianGroups ? '' : record.extended ? 'eUR ' : 'UR ')
        + core.cellGroupName(record.cells)
          + (record.givenCells?.length ? '; original givens ' + core.cellGroupName(record.givenCells) : '')
        + '; ' + groups.join(' or ') + (trace ? '; ' + trace : '')
        + (record.ring ? ' => ' + groups.join(' and ') + ' true' + (removals ? '; ' + removals : '')
          : record.twoWay ? ' => both guardian starts false' + (removals ? '; ' + removals : '')
          : ' => ' + removals),
      elim: { items: core.eliminationItems({ items: record.eliminations }, candidates) },
      at: [...new Set([...record.cells, ...reverseGroups.flatMap(group => group.cells), ...paths.flatMap(path => path.map(item => item.cell))])],
      vertices: record.cells, digits: record.digits,
      externalGuardAtoms: guardians.flatMap(group => group.cells.map(cell => cell + ':' + group.digit)),
      uniquenessStrongLinks: [...strong.values()],
      uniquenessRccLinks: [...weak.values()],
      uniquenessRecord: record,
    };
  }

  function type8ForcingProof(record, core) {
    if (!record.forcingPlacements || record.guardianPair) return null;
    const { externalCell: root, externalDigit: digit } = record;
    const roots = record.externalCells || [root];
    const atom = cell => '(' + digit + ')' + (cell === root && roots.length > 1
      ? core.cellGroupName(roots) : core.cellName(cell));
    const paths = new Map([[root, atom(root)]]);
    const extended = new Set();
    const branches = [];
    const strong = [];
    const weak = [];
    const off = new Set(record.breakerCells || []);
    if (!record.forcingPlacements.length && off.size) {
      const remaining = new Set([...off].filter(cell => roots.every(source => core.peersOf(source).includes(cell))));
      while (remaining.size) {
        const [cell] = remaining;
        const box = core.BOXES.find(unit => unit.includes(cell));
        const lines = [core.ROWS[Math.floor(cell / 9)], core.COLS[cell % 9]];
        const [group] = lines.map(line => line.filter(other => remaining.has(other) && box.includes(other)))
          .sort((a, b) => b.length - a.length);
        for (const other of group) remaining.delete(other);
        weak.push({ leftCells: roots, rightCells: group, digit, forcing: true });
        branches.push(atom(root) + ' - (' + digit + ')' + core.cellGroupName(group));
        extended.add(root);
      }
    }
    for (const placement of record.forcingPlacements) {
      const blockers = placement.blockers.map(item => item.cell);
      strong.push({
        activeCells: blockers, linkedCells: [placement.cell],
        startingDigits: [digit], linkDigits: [digit], forcing: true,
      });
      for (const { cell, source } of placement.blockers) {
        off.add(cell);
        extended.add(source);
        weak.push({ leftCells: source === root ? roots : [source], rightCells: [cell], digit, forcing: true });
      }
      if (blockers.length === 1) {
        const [{ source, cell }] = placement.blockers;
        paths.set(placement.cell, (paths.get(source) || atom(source))
          + ' - ' + atom(cell) + '=' + core.cellName(placement.cell));
      } else {
        for (const { source, cell } of placement.blockers) {
          branches.push((paths.get(source) || atom(source)) + ' - ' + atom(cell));
        }
        paths.set(placement.cell, '(' + digit + ')' + core.cellGroupName(blockers) + '=' + core.cellName(placement.cell));
      }
    }
    const chains = [...branches, ...[...paths].filter(([cell]) => !extended.has(cell)).map(([, text]) => text)];
    return {
      text: chains.join(', '), strong, weak,
      onAtoms: [...new Set([...roots, ...paths.keys()])].map(cell => cell + ':' + digit),
      offAtoms: [...new Set([...off].map(cell => cell + ':' + digit)
        .concat((record.guardianAtoms || []).map(item => item.cell + ':' + item.digit)))],
      cells: [...new Set([...roots, ...paths.keys(), ...off, ...(record.guardianAtoms || []).map(item => item.cell)])],
    };
  }

  function create({ elements, state, actions, core }) {
    const bugSearch = app.bugSearch.create({
      elements: {
        button: document.getElementById('bugBuild'), results: document.getElementById('bugResults'),
      },
      state: {
        get candidates() { return state.candidates; },
        get reports() { return state.bugReports; },
        set reports(value) { state.bugReports = value; },
        set activeStep(value) { state.activeStep = value; },
      },
      actions, core,
    });
    const reverseBugSearch = app.bugSearch.create({
      reverse: true,
      elements: {
        button: document.getElementById('reverseBugBuild'), results: document.getElementById('reverseBugResults'),
      },
      state: {
        get candidates() { return state.candidates; },
        get originalGivens() { return state.originalGivens; },
        get fixedGrid() { return state.fixedGrid; },
        get reports() { return state.reverseBugReports; },
        set reports(value) { state.reverseBugReports = value; },
        set activeStep(value) { state.activeStep = value; },
      },
      actions, core,
    });
    const mugSearch = app.bugSearch.create({
      mug: true,
      elements: {
        button: document.getElementById('mugBuild'), results: document.getElementById('mugResults'),
      },
      state: {
        get candidates() { return state.candidates; },
        get reports() { return state.mugReports; },
        set reports(value) { state.mugReports = value; },
        set activeStep(value) { state.activeStep = value; },
      },
      actions, core,
    });
    const pugSearch = app.bugSearch.create({
      pug: true,
      elements: {
        button: document.getElementById('pugBuild'), results: document.getElementById('pugResults'),
      },
      state: {
        get candidates() { return state.candidates; },
        get reports() { return state.pugReports; },
        set reports(value) { state.pugReports = value; },
        set activeStep(value) { state.activeStep = value; },
      },
      actions, core,
    });
    function candidateGridKey(grid = state.candidates) {
      return JSON.stringify((grid || []).map(values =>
        [...new Set(values || [])].sort((left, right) => left - right)));
    }

    function type3PlusDigits(record) {
      if (Array.isArray(record.plusDigits)) return record.plusDigits;
      return [...new Set((record.plusCells || []).flatMap(cell =>
        (state.candidates[cell] || []).filter(digit => !(record.digits || []).includes(digit))))]
        .sort((left, right) => left - right);
    }

    function type3Label(family) {
      return family === 'extended-3' ? 'Extended Unique Rectangle Type 3 - ALS'
        : family === 'extended-3-xz' ? 'Extended Unique Rectangle Type 3 - ALS-XZ'
        : family === 'extended-3-xy' ? 'Extended Unique Rectangle Type 3 - ALS-XY'
        : family === 'extended-3-chain' ? 'Extended Unique Rectangle Type 3 - ALS-Chain'
        : family === '3b' ? 'Unique Rectangle Type 3 - ALS-XZ'
        : family === '3c' ? 'Unique Rectangle Type 3 - ALS-XY'
        : family === '3d' ? 'Unique Rectangle Type 3 - ALS-Chain'
        : 'Unique Rectangle Type 3 - ALS';
    }

    function type3AlsRecord(record) {
      if (record.alsRecord) return record.alsRecord;
      const records = record.alsRecords || [];
      return records[0] || {
        uniqueID: `uniqueness-type-3:${(record.alsCells || []).join(',')}:${(record.alsDigits || []).join(',')}`,
        alsAllCells: [...(record.alsCells || [])],
        alsDigits: [...(record.alsDigits || [])],
      };
    }

    function type3UrAlsLinks(record) {
      if (Array.isArray(record.urAlsLinks)) return record.urAlsLinks;
      const alsRecords = record.alsRecords?.length ? record.alsRecords : [type3AlsRecord(record)];
      const pair = new Set(record.digits || []);
      const links = [];
      for (const cell of record.plusCells || []) {
        for (const digit of state.candidates[cell] || []) {
          if (pair.has(digit)) continue;
          for (const [alsIndex, als] of alsRecords.entries()) {
            const locations = (als.alsAllCells || []).filter(alsCell =>
              (state.candidates[alsCell] || []).includes(digit));
            if (!locations.length) continue;
            const peers = new Set(core.peersOf(cell));
            if (locations.every(alsCell => peers.has(alsCell))) {
              links.push({ cell, digit, alsIndex });
            }
          }
        }
      }
      return links;
    }

    function type7StrongLinkText(record) {
      const links = record.internalLinks || [];
      const gateText = links.map(link => {
        const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
        return `(${digit})${core.cellGroupName(link.activeCells || [])}=`
          + `(${digit})${core.cellGroupName(link.linkedCells || [])}`;
      });
      const parts = [];
      const bivalves = (record.bivalueCells || []).map(cell =>
        `(${(state.candidates[cell] || []).join('')})${core.cellName(cell)}`);
      if (bivalves.length) parts.push(`Bivalve ${bivalves.join(', ')}`);
      if (gateText.length) {
        parts.push(gateText.join(', '));
      }
      for (const ring of record.internalRings || []) {
        const proof = core.formatChainEureka(ring).split(' => ')[0];
        parts.push(proof);
      }
      return parts.join('; ') || 'internal strong links';
    }

    function type8GuardLinkText(record) {
      return (record.guardLinks || []).map(link =>
        `(${link.digit})${core.cellName(link.cells?.[0])}=${core.cellGroupName((link.cells || []).slice(1))}`)
        .join('; ');
    }

    function type8ForcingText(record) {
      const proof = type8ForcingProof(record, core);
      return proof ? '; ' + proof.text : '';
    }

    function stepFromResult(record, type, family = '3a') {
      if (type === 9 || type === 'extended-9') return type9Step(record, state.candidates, core);
      const isExternalRectangle = type === 8 || type === 'extended-8';
      const forcingProof = isExternalRectangle ? type8ForcingProof(record, core) : null;
      const isHiddenRectangle = type === 7 || type === 'extended-7';
      const isAlsXz = family === '3b' || family === 'extended-3-xz';
      const isAlsXy = family === '3c' || family === 'extended-3-xy';
      const showAlsPath = isAlsXz || isAlsXy || family === '3d' || family === 'extended-3-chain';
      const items = core.eliminationItems({ items: record.eliminations || [] }, state.candidates);
      const cells = [...(record.cells || [])];
      const plusDigits = type === 3 ? type3PlusDigits(record) : [];
      const alsDigits = record.alsDigits || [];
      const digits = type === 2 || type === 5 || type === 'extended-2-5'
        ? [record.extraDigit]
        : type === 3
          ? plusDigits
        : isExternalRectangle && record.guardDigits?.length
          ? [...new Set([...(record.digits || []), ...record.guardDigits])]
        : record.digits || [];
      const label = type === 3 ? type3Label(family)
        : type === 'extended-1' ? 'Extended Unique Rectangle Type 1'
        : type === 'extended-2-5' ? record.classification
        : type === 'extended-4' ? 'Extended Unique Rectangle Type 4'
        : type === 'extended-6' ? 'Extended Unique Rectangle Type 6'
        : type === 'extended-7' ? 'Hidden Extended Unique Rectangle (Type 7)'
        : type === 'extended-8' ? 'External Extended Unique Rectangle (Type 8)'
        : type === 5 ? 'Unique Rectangle Type 5'
        : type === 2 ? 'Unique Rectangle Type 2 | 5'
        : type === 7 ? 'Hidden Unique Rectangle (Type 7)'
        : isExternalRectangle ? 'External Unique Rectangle (Type 8)'
        : `Unique Rectangle Type ${type}`;
      const highlightedCells = type === 'extended-1'
        ? [...new Set([...cells, record.exception].filter(cell => Number.isInteger(cell)))]
        : type === 3
        ? [...new Set([...cells, ...(record.alsCells || []),
          ...(record.alsRecords || []).flatMap(als => als.alsAllCells || [])])]
        : isExternalRectangle
          ? [...new Set([...cells, ...(record.breakerCells || []), ...(record.zCells || []),
            ...(record.guardianCells || []),
            record.externalCell, record.guardianCell,
            ...(forcingProof?.cells || []),
            ...(record.forcingChain?.steps || []).flatMap(step => [
              ...(step.entry?.cells || []), ...(step.exit?.cells || []),
            ])]
            .filter(cell => Number.isInteger(cell)))]
          : cells;
      const description = type === 'extended-1'
        ? `${label}: (${record.digits.join('')}) ${core.cellGroupName(cells)}; `
          + `extra ${core.cellName(record.exception)} => `
          + core.formatRemovals(record.eliminations || [])
        : type === 'extended-2-5'
        ? `${label}: (${record.digits.join('')}) eUR ${core.cellGroupName(cells)}; `
          + `extra ${record.extraDigit} in ${core.cellGroupName(record.zCells)} => `
          + core.formatRemovals(record.eliminations || [])
        : type === 3
        ? `${label}: (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(cells)}; `
          + `${(record.alsRecords || []).length > 1 ? 'ALS sets' : 'ALS'} `
          + `{${(record.alsRecords || []).length > 1
            ? record.alsRecords.map(als => core.cellGroupName(als.alsAllCells || [])).join(' + ')
            : core.cellGroupName(record.alsCells || [])}} `
          + `Digits {${alsDigits.join('')}}${record.rccDigits?.length
            ? `; RCC {${record.rccDigits.join('')}}` : ''} => `
          + core.formatRemovals(record.eliminations || [])
        : type === 5
          ? `${label}: (${record.digits.join('')}) UR ${core.cellGroupName(cells)}; `
            + `pincered ${record.extraDigit} in ${core.cellGroupName(record.zCells)} => `
            + core.formatRemovals(record.eliminations || [])
        : type === 4 || type === 'extended-4'
          ? `${label}: (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(cells)}; `
            + `${record.lockedDigit} bound in ${core.cellGroupName(record.targetCells)} => `
            + core.formatRemovals(record.eliminations || [])
          : type === 6 || type === 'extended-6'
            ? `${label}: (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(cells)}; `
              + `${record.lockedDigit} restricted fish => ${core.formatRemovals(record.eliminations || [])}`
          : isHiddenRectangle
            ? `${label}: (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(cells)}; `
              + `${type7StrongLinkText(record)} => `
              + core.formatRemovals(record.eliminations || [])
          : isExternalRectangle
            ? `${label}: (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(cells)}; `
              + (record.guardianPair
                ? `guardians (${record.breakerDigit}) `
                  + record.guardianCells.map(cell => core.cellName(cell)).join(' or ')
                : `guardian (${record.breakerDigit ?? record.externalDigit}) `)
              + (record.guardianPair ? ''
                : `${record.breakerCells?.length ? core.cellGroupName(record.breakerCells) : core.cellName(record.externalCell)}`)
              + (record.forcingSectors?.length ? ` in sectors ${record.forcingSectors.join(',')}` : '')
              + type8ForcingText(record) + ' => '
              + core.formatRemovals(record.eliminations || [])
          : `${label}: (${digits.join('')}) ${core.cellGroupName(cells)} => `
            + core.formatRemovals(record.eliminations || []);
      return {
        tech: type === 'extended-1' ? 'uniqueness-extended-type-1'
          : type === 'extended-4' ? 'uniqueness-extended-type-4'
          : type === 'extended-6' ? 'uniqueness-extended-type-6'
          : type === 'extended-7' ? 'uniqueness-extended-type-7'
          : type === 'extended-8' ? 'uniqueness-extended-type-8'
          : type === 3 && record.extended ? record.tech
          : type === 'extended-2-5' ? 'uniqueness-extended-type-2-5' : `uniqueness-type-${type}`,
        name: label,
        structureName: label,
        desc: description,
        elim: { items },
        at: highlightedCells,
        vertices: type === 3 || isExternalRectangle || type === 'extended-1' || type === 'extended-2-5'
          ? cells : highlightedCells,
        digits,
        alsRecord: type === 3 ? type3AlsRecord(record) : null,
        alsRecords: type === 3 ? (record.alsRecords || [type3AlsRecord(record)]) : null,
        alsExclusionDigits: type === 3 && !isAlsXz && !isAlsXy
          ? (record.alsExclusionDigits || []) : [],
        uniquenessUrAlsLinks: type === 3 ? type3UrAlsLinks(record) : [],
        uniquenessAlsLockedCandidates: type === 3 ? (record.alsLockedCandidates || []) : [],
        uniquenessRccLinks: forcingProof ? forcingProof.weak : showAlsPath
          ? (record.rccConnections || []) : [],
        uniquenessStrongLinks: forcingProof ? forcingProof.strong : isHiddenRectangle ? (record.internalLinks || [])
          : isExternalRectangle
            ? record.externalMode === 'forcing-chain'
              ? (record.forcingChain?.steps || []).map(step => ({
                activeCells: [...(step.entry?.cells || [])],
                linkedCells: [...(step.exit?.cells || [])],
                startingDigits: [...(step.entry?.digits || [])],
                linkDigits: [...(step.exit?.digits || step.entry?.digits || [])],
                linkType: step.linkType,
              }))
              : (record.guardLinks || []).map(link => ({
                activeCells: [record.externalCell],
                linkedCells: (link.cells || []).filter(cell => cell !== record.externalCell),
                startingDigits: [link.digit],
                linkDigits: [link.digit],
                linkType: 0,
              }))
            : [],
        ahsRecord: isExternalRectangle ? (record.ahsRecord || null) : null,
        ahsRecords: isExternalRectangle ? (record.ahsRecords || []) : null,
        uniquenessForcingOnAtoms: forcingProof?.onAtoms || [],
        uniquenessForcingOffAtoms: forcingProof?.offAtoms || [],
        externalGuardAtoms: isExternalRectangle && !forcingProof
          ? record.breakerCells?.length
            ? record.breakerCells.map(cell => `${cell}:${record.breakerDigit}`)
            : (record.guardDigits || []).map(digit => `${record.externalCell}:${digit}`)
          : [],
        uniquenessRings: isHiddenRectangle
          ? (record.internalRings || [])
          : [],
        uniquenessEliminationsByAls: showAlsPath
          ? (record.eliminationsByAls || []) : [],
        uniquenessRecord: record,
      };
    }

    function appendResultList(container, records, type, family = null) {
      const list = document.createElement('ul');
      list.className = 'chain-list';
      records.forEach(({ record, index }) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        const selectedIndex = type === 'extended-1' ? state.selectedExtendedType1Index
            : type === 'extended-2-5' ? state.selectedExtendedType2Index
            : type === 1 ? state.selectedIndex
            : type === 2 ? state.selectedType2Index
              : type === 5 ? state.selectedType5Index
            : type === 4 ? state.selectedType4Index
              : type === 'extended-4' ? state.selectedExtendedType4Index
              : type === 'extended-6' ? state.selectedExtendedType6Index
              : type === 'extended-7' ? state.selectedExtendedType7Index
              : type === 'extended-8' ? state.selectedExtendedType8Index
              : type === 'extended-9' ? state.selectedExtendedType9Index
              : type === 6 ? state.selectedType6Index
                : type === 7 ? state.selectedType7Index
                  : type === 8 ? state.selectedType8Index
                  : type === 9 ? state.selectedType9Index
                    : state.selectedType3Index;
        if (selectedIndex === index && (type !== 3 || state.selectedType3Family === family)) {
          button.classList.add('selected');
        }
        const eliminations = core.formatRemovals(record.eliminations || []);
        button.textContent = type === 9 || type === 'extended-9' ? (index + 1) + '. ' + type9Step(record, state.candidates, core).desc
          : type === 'extended-1'
                ? `${index + 1}. (${record.digits.join('')}) Extended UR ${core.cellGroupName(record.cells)}; `
            + `${core.cellName(record.exception)} => ${eliminations}`
          : type === 'extended-2-5'
            ? `${index + 1}. Type ${record.type}: (${record.digits.join('')}) eUR ${core.cellGroupName(record.cells)}; `
              + `extra ${record.extraDigit} in ${core.cellGroupName(record.zCells)} => ${eliminations}`
          : type === 1
                ? `${index + 1}. (${record.digits.join('')}) UR ${core.cellGroupName(record.cells)}; `
            + `${core.cellName(record.exception)} => ${eliminations}`
          : type === 2
            ? `${index + 1}. (${record.digits.join('')}) ${core.cellGroupName(record.cells)}; `
              + `+2 cells ${core.cellGroupName(record.zCells)} use ${record.extraDigit} => ${eliminations}`
            : type === 5
              ? `${index + 1}. (${record.digits.join('')}) UR ${core.cellGroupName(record.cells)}; `
                + `pincered ${record.extraDigit} in ${core.cellGroupName(record.zCells)} => ${eliminations}`
            : type === 4 || type === 'extended-4'
              ? `${index + 1}. (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(record.cells)}; `
                + `${record.lockedDigit} bound in ${core.cellGroupName(record.targetCells)} => ${eliminations}`
              : type === 6 || type === 'extended-6'
                ? `${index + 1}. (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(record.cells)}; `
                  + `${record.lockedDigit} restricted fish in ${core.cellGroupName(record.targetCells)} => ${eliminations}`
                : type === 7 || type === 'extended-7'
                  ? `${index + 1}. (${record.digits.join('')}) ${core.cellGroupName(record.cells)}; `
                    + `${type7StrongLinkText(record)} => ${eliminations}`
                  : type === 8 || type === 'extended-8'
                    ? `${index + 1}. (${record.digits.join('')}) UR ${core.cellGroupName(record.cells)}; `
                      + `guardian (${record.breakerDigit ?? record.externalDigit}) `
                      + `${record.breakerCells?.length ? core.cellGroupName(record.breakerCells) : core.cellName(record.externalCell)}`
                      + type8ForcingText(record)
                      + ` => ${eliminations}`
            : `${index + 1}. (${record.digits.join('')}) ${record.extended ? 'eUR' : 'UR'} ${core.cellGroupName(record.cells)}; `
              + `${(record.alsRecords || []).length > 1 ? 'ALS sets' : 'ALS'} {${(record.alsRecords || []).length > 1
                ? record.alsRecords.map(als => core.cellGroupName(als.alsAllCells || [])).join(' + ')
                : core.cellGroupName(record.alsCells || [])}} Digits {${(record.alsDigits || []).join('')}} `
              + `${record.rccDigits?.length ? `RCC {${record.rccDigits.join('')}} ` : ''}`
              + `=> ${eliminations}`;
        button.title = type === 'extended-8' ? 'Highlight External Extended Unique Rectangle'
          : type === 'extended-7' ? 'Highlight Hidden Extended Unique Rectangle'
          : type === 'extended-6' ? 'Highlight Extended Unique Rectangle Type 6'
          : type === 'extended-4' ? 'Highlight Extended Unique Rectangle Type 4' : type === 'extended-1'
          ? 'Highlight Extended Unique Rectangle Type 1'
          : type === 'extended-2-5'
            ? 'Highlight Extended Unique Rectangle Type 2 | 5'
          : type === 3
          ? `Highlight ${type3Label(family)}` : `Highlight Unique Rectangle Type ${type}`;
        button.addEventListener('click', () => select(record, index, type, family));
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    function appendType1Folder(parent, report) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 1;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Type 1';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);

      appendResultList(folder, records.map((record, index) => ({ record, index })), 1);
      parent.appendChild(folder);
    }

    function appendExtendedType1Folder(parent, report) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 'extended-1';
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Extended Type 1';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), 'extended-1');
      parent.appendChild(folder);
    }

    function appendExtendedType2Folder(parent, report) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 'extended-2-5';
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Extended Type 2 | 5';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), 'extended-2-5');
      parent.appendChild(folder);
    }

    function appendType2Folder(parent, report) {
      const records = (report?.results || []).filter(record => (record.type || 2) === 2);
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 2;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Type 2 | 5';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), 2);
      parent.appendChild(folder);
    }

    function appendType5Folder(parent, report) {
      const records = (report?.results || []).filter(record => record.type === 5);
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 5;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Type 5';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), 5);
      parent.appendChild(folder);
    }

    function appendType4Folder(parent, report, type = 4) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === type;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = type === 'extended-4' ? 'Extended Type 4' : 'Type 4';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), type);
      parent.appendChild(folder);
    }

    function appendType6Folder(parent, report, type = 6) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === type;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = type === 'extended-6' ? 'Extended Type 6' : 'Type 6';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), type);
      parent.appendChild(folder);
    }

    function appendType7Folder(parent, report, type = 7) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === type;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = type === 'extended-7' ? 'Hidden Extended Unique Rectangle (Type 7)' : 'Hidden Unique Rectangle (Type 7)';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), type);
      parent.appendChild(folder);
    }

    function appendExternalFolder(parent, report, type = 8) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === type;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = type === 9 || type === 'extended-9' ? 'Type 9'
        : type === 'extended-8' ? 'External Extended Unique Rectangle (Type 8)' : 'External Unique Rectangle (Type 8)';
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = records.length + ' results';
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), type);
      parent.appendChild(folder);
    }

    function appendType3TechniqueFolder(parent, report, family, title) {
      const records = report?.results || [];
      if (!records.length) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = state.activeType === 3 && state.selectedType3Family === family;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = title;
      const count = document.createElement('span');
      count.className = 'chain-category-count';
      count.textContent = `${records.length} results`;
      summary.append(name, count);
      folder.appendChild(summary);
      appendResultList(folder, records.map((record, index) => ({ record, index })), 3, family);
      parent.appendChild(folder);
    }

    function appendType3Folder(parent, techniques) {
      const count = techniques.reduce((sum, [report]) => sum + (report?.results?.length || 0), 0);
      if (!count) return;
      const folder = document.createElement('details');
      folder.className = 'chain-subcategory';
      folder.open = true;
      const summary = document.createElement('summary');
      const name = document.createElement('strong');
      name.textContent = 'Type 3';
      const countLabel = document.createElement('span');
      countLabel.className = 'chain-category-count';
      countLabel.textContent = `${count} results`;
      summary.append(name, countLabel);
      const children = document.createElement('div');
      children.className = 'chain-subcategories';
      for (const [report, family, title] of techniques) {
        appendType3TechniqueFolder(children, report, family, title);
      }
      folder.append(summary, children);
      parent.appendChild(folder);
    }

    function renderFamily(element, label, reports, appendFolders) {
      element.textContent = '';
      if (!reports.some(Boolean)) {
        element.textContent = `No ${label} search has been run.`;
        return;
      }

      const unsupportedVariants = [...new Set(reports.flatMap(report => report?.unsupportedVariants || []))];
      if (unsupportedVariants.length) {
        const names = {
          diagonal: 'Diagonal', antiDiagonal: 'Anti-Diagonal', windoku: 'Windoku',
          antiKing: 'Anti-King', antiKnight: 'Anti-Knight', nonConsecutive: 'Non-Consecutive',
        };
        const note = document.createElement('p');
        note.textContent = `${label} searches are unavailable with ${unsupportedVariants
          .map(name => names[name] || name).join(', ')} active.`;
        element.appendChild(note);
      }

      if (reports.some(report => report?.results?.length)) {
        const folders = document.createElement('div');
        folders.className = 'chain-subcategories';
        appendFolders(folders);
        element.appendChild(folders);
      } else if (!unsupportedVariants.length) {
        element.textContent = `No ${label} results were found.`;
      }
    }

    function render() {
      bugSearch.render();
      reverseBugSearch.render();
      mugSearch.render();
      pugSearch.render();
      const currentKey = candidateGridKey();
      const currentReport = key => state[key]?.candidateGridKey === currentKey ? state[key] : null;
      const ordinary = [
        'report', 'type2Report', 'type3Report', 'type3XzReport', 'type3XyReport',
        'type3ChainReport', 'type4Report', 'type6Report', 'type7Report', 'type8Report', 'type9Report',
      ].map(currentReport);
      const extended = [
        'extendedType1Report', 'extendedType2Report', 'extendedType3Report', 'extendedType3XzReport',
        'extendedType3XyReport', 'extendedType3ChainReport', 'extendedType4Report', 'extendedType6Report', 'extendedType7Report', 'extendedType8Report', 'extendedType9Report',
      ].map(currentReport);

      renderFamily(elements.results, 'Unique Rectangle', ordinary, children => {
        const [type1, type2, type3, xz, xy, chain, type4, type6, type7, type8, type9] = ordinary;
        appendType1Folder(children, type1);
        appendType2Folder(children, type2);
        appendType3Folder(children, [
          [type3, '3a', 'ALS'], [xz, '3b', 'ALS-XZ'], [xy, '3c', 'ALS-XY'], [chain, '3d', 'ALS-Chain'],
        ]);
        appendType4Folder(children, type4);
        appendType5Folder(children, type2);
        appendType6Folder(children, type6);
        appendType7Folder(children, type7);
        appendExternalFolder(children, type8);
        appendExternalFolder(children, type9, 9);
      });

      renderFamily(elements.extendedResults, 'Extended Unique Rectangle', extended, children => {
        const [type1, type2, type3, xz, xy, chain, type4, type6, type7, type8, type9] = extended;
        appendExtendedType1Folder(children, type1);
        appendExtendedType2Folder(children, type2);
        appendType3Folder(children, [
          [type3, 'extended-3', 'ALS'], [xz, 'extended-3-xz', 'ALS-XZ'],
          [xy, 'extended-3-xy', 'ALS-XY'], [chain, 'extended-3-chain', 'ALS-Chain'],
        ]);
        appendType4Folder(children, type4, 'extended-4');
        appendType6Folder(children, type6, 'extended-6');
        appendType7Folder(children, type7, 'extended-7');
        appendExternalFolder(children, type8, 'extended-8');
        appendExternalFolder(children, type9, 'extended-9');
      });
    }

    function resultElement(type, family) {
      return String(type).startsWith('extended-') || family?.startsWith('extended-')
        ? elements.extendedResults : elements.results;
    }

    function select(record, index, type, family = null) {
      state.activeType = type;
      if (type === 'extended-1') state.selectedExtendedType1Index = index;
      else if (type === 'extended-2-5') state.selectedExtendedType2Index = index;
      else if (type === 1) state.selectedIndex = index;
      else if (type === 2) state.selectedType2Index = index;
      else if (type === 5) state.selectedType5Index = index;
      else if (type === 4) state.selectedType4Index = index;
      else if (type === 'extended-4') state.selectedExtendedType4Index = index;
      else if (type === 'extended-6') state.selectedExtendedType6Index = index;
      else if (type === 'extended-7') state.selectedExtendedType7Index = index;
      else if (type === 'extended-8') state.selectedExtendedType8Index = index;
      else if (type === 'extended-9') state.selectedExtendedType9Index = index;
      else if (type === 6) state.selectedType6Index = index;
      else if (type === 7) state.selectedType7Index = index;
      else if (type === 8) state.selectedType8Index = index;
      else if (type === 9) state.selectedType9Index = index;
      else state.selectedType3Index = index;
      if (type === 3) state.selectedType3Family = family;
      state.activeStep = stepFromResult(record, type, family);
      actions.renderBoard();
      render();
      actions.openReportPanel(resultElement(type, family));
      actions.focusMap();
      actions.setStatus(type === 3
        ? `${type3Label(family)} result ${index + 1} selected.`
        : type === 'extended-4' ? `Extended Unique Rectangle Type 4 result ${index + 1} selected.`
        : type === 'extended-6' ? `Extended Unique Rectangle Type 6 result ${index + 1} selected.`
        : type === 'extended-7' ? `Hidden Extended Unique Rectangle (Type 7) result ${index + 1} selected.`
        : type === 'extended-8' ? `External Extended Unique Rectangle (Type 8) result ${index + 1} selected.`
        : type === 'extended-9' ? `${record.classification} result ${index + 1} selected.`
        : `${type === 'extended-1' ? 'Extended Unique Rectangle Type 1' : type === 'extended-2-5' ? 'Extended Unique Rectangle Type 2 | 5' : type === 8 ? 'External Unique Rectangle (Type 8)' : type === 7 ? 'Hidden Unique Rectangle (Type 7)' : type === 2
          ? 'Unique Rectangle Type 2' : type === 5 ? 'Unique Rectangle Type 5'
            : `Unique Rectangle Type ${type}`} result ${index + 1} selected.`, 'ok');
    }

    function run(type, event, family = null) {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      state.activeType = type;
      if (type === 3) state.selectedType3Family = family;
      if (type === 'extended-1') state.selectedExtendedType1Index = null;
      else if (type === 'extended-2-5') state.selectedExtendedType2Index = null;
      else if (type === 1) state.selectedIndex = null;
      else if (type === 2) {
        state.selectedType2Index = null;
        state.selectedType5Index = null;
      }
      else if (type === 5) state.selectedType5Index = null;
      else if (type === 4) state.selectedType4Index = null;
      else if (type === 'extended-4') state.selectedExtendedType4Index = null;
      else if (type === 'extended-6') state.selectedExtendedType6Index = null;
      else if (type === 'extended-7') state.selectedExtendedType7Index = null;
      else if (type === 'extended-8') state.selectedExtendedType8Index = null;
      else if (type === 'extended-9') state.selectedExtendedType9Index = null;
      else if (type === 6) state.selectedType6Index = null;
      else if (type === 7) state.selectedType7Index = null;
      else if (type === 8) state.selectedType8Index = null;
      else if (type === 9) state.selectedType9Index = null;
      else state.selectedType3Index = null;
      state.activeStep = null;
      actions.renderBoard();
      const searchToken = actions.setBusy(true);
      const label = type === 3 ? type3Label(family)
        : type === 'extended-1' ? 'Extended Unique Rectangle Type 1'
        : type === 'extended-2-5' ? 'Extended Unique Rectangle Type 2 | 5'
        : type === 'extended-4' ? 'Extended Unique Rectangle Type 4'
        : type === 'extended-6' ? 'Extended Unique Rectangle Type 6'
        : type === 'extended-7' ? 'Hidden Extended Unique Rectangle (Type 7)'
        : type === 'extended-8' ? 'External Extended Unique Rectangle (Type 8)'
        : type === 2 ? 'Unique Rectangle Type 2 | 5'
        : type === 'extended-9' ? 'Extended Unique Rectangle Type 9'
        : type === 8 ? 'External Unique Rectangle (Type 8)'
        : type === 7 ? 'Hidden Unique Rectangle (Type 7)'
        : `Unique Rectangle Type ${type}`;
      const candidateGrid = state.candidates.map(values => [...(values || [])]);
      const searchedGridKey = candidateGridKey(candidateGrid);
      actions.setStatus(`Searching ${label}...`);
      actions.scheduleSearch(async () => {
        try {
          const operation = type === 'extended-1' ? 'uniqueness-extended-type-1'
            : type === 'extended-2-5' ? 'uniqueness-extended-type-2-5'
            : type === 1 ? 'uniqueness'
            : type === 2 ? 'uniqueness-type-2-5'
              : type === 4 ? 'uniqueness-type-4'
                : type === 'extended-4' ? 'uniqueness-extended-type-4'
                : type === 'extended-6' ? 'uniqueness-extended-type-6'
                : type === 'extended-7' ? 'uniqueness-extended-type-7'
                : type === 'extended-8' ? 'uniqueness-extended-type-8'
                : type === 'extended-9' ? 'uniqueness-extended-type-9'
                : type === 6 ? 'uniqueness-type-6'
                : type === 7 ? 'uniqueness-type-7'
                : type === 8 ? 'uniqueness-type-8'
                : type === 9 ? 'uniqueness-type-9'
              : family === 'extended-3' ? 'uniqueness-extended-type-3'
              : family === 'extended-3-xz' ? 'uniqueness-extended-type-3-xz'
              : family === 'extended-3-xy' ? 'uniqueness-extended-type-3-xy'
              : family === 'extended-3-chain' ? 'uniqueness-extended-type-3-chain'
              : family === '3b' ? 'uniqueness-type-3-xz'
                : family === '3c' ? 'uniqueness-type-3-xy'
                  : family === '3d' ? 'uniqueness-type-3-chain' : 'uniqueness-type-3';
          const report = await actions.runSearchWorker(operation, {
            candidateGrid,
          });
          if (candidateGridKey() !== searchedGridKey) {
            actions.setStatus(`${label} finished after the candidate grid changed; its result was not displayed.`, 'warn');
            return;
          }
          const gridReport = { ...report, candidateGridKey: searchedGridKey };
          if (type === 'extended-1') state.extendedType1Report = gridReport;
          else if (type === 'extended-2-5') state.extendedType2Report = gridReport;
          else if (type === 1) state.report = gridReport;
          else if (type === 2) state.type2Report = gridReport;
          else if (type === 4) state.type4Report = gridReport;
          else if (type === 'extended-4') state.extendedType4Report = gridReport;
          else if (type === 'extended-6') state.extendedType6Report = gridReport;
          else if (type === 'extended-7') state.extendedType7Report = gridReport;
          else if (type === 'extended-8') state.extendedType8Report = gridReport;
          else if (type === 'extended-9') state.extendedType9Report = gridReport;
          else if (type === 6) state.type6Report = gridReport;
          else if (type === 7) state.type7Report = gridReport;
          else if (type === 8) state.type8Report = gridReport;
          else if (type === 9) state.type9Report = gridReport;
          else if (family === 'extended-3') state.extendedType3Report = gridReport;
          else if (family === 'extended-3-xz') state.extendedType3XzReport = gridReport;
          else if (family === 'extended-3-xy') state.extendedType3XyReport = gridReport;
          else if (family === 'extended-3-chain') state.extendedType3ChainReport = gridReport;
          else if (family === '3b') state.type3XzReport = gridReport;
          else if (family === '3c') state.type3XyReport = gridReport;
          else if (family === '3d') state.type3ChainReport = gridReport;
          else state.type3Report = gridReport;
          const records = report.results || [];
          if (records.length) {
            const firstType = String(type).startsWith('extended-') ? type : records[0].type || type;
            state.activeType = firstType;
            if (type === 'extended-1') state.selectedExtendedType1Index = 0;
            else if (type === 'extended-2-5') state.selectedExtendedType2Index = 0;
            else if (firstType === 1) state.selectedIndex = 0;
            else if (firstType === 2) state.selectedType2Index = 0;
            else if (firstType === 5) state.selectedType5Index = 0;
            else if (type === 4) state.selectedType4Index = 0;
            else if (type === 'extended-4') state.selectedExtendedType4Index = 0;
            else if (type === 'extended-6') state.selectedExtendedType6Index = 0;
            else if (type === 'extended-7') state.selectedExtendedType7Index = 0;
            else if (type === 'extended-8') state.selectedExtendedType8Index = 0;
            else if (type === 'extended-9') state.selectedExtendedType9Index = 0;
            else if (type === 6) state.selectedType6Index = 0;
            else if (type === 7) state.selectedType7Index = 0;
            else if (firstType === 8) state.selectedType8Index = 0;
            else if (firstType === 9) state.selectedType9Index = 0;
            else state.selectedType3Index = 0;
            state.activeStep = stepFromResult(records[0], firstType, family);
            actions.renderBoard();
          }
          render();
          actions.openReportPanel(resultElement(type, family));
          actions.setStatus(
            report.unsupportedVariants?.length
              ? `${label} is unavailable for the selected variants.`
              : records.length
                ? `${label} found ${records.length} result${records.length === 1 ? '' : 's'}.`
                : `${label} found no results.`,
            records.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          if (type === 'extended-1') state.extendedType1Report = null;
          else if (type === 'extended-2-5') state.extendedType2Report = null;
          else if (type === 1) state.report = null;
          else if (type === 2) state.type2Report = null;
          else if (type === 4) state.type4Report = null;
          else if (type === 'extended-4') state.extendedType4Report = null;
          else if (type === 'extended-6') state.extendedType6Report = null;
          else if (type === 'extended-7') state.extendedType7Report = null;
          else if (type === 'extended-8') state.extendedType8Report = null;
          else if (type === 'extended-9') state.extendedType9Report = null;
          else if (type === 6) state.type6Report = null;
          else if (type === 7) state.type7Report = null;
          else if (type === 8) state.type8Report = null;
          else if (type === 9) state.type9Report = null;
          else if (family === 'extended-3') state.extendedType3Report = null;
          else if (family === 'extended-3-xz') state.extendedType3XzReport = null;
          else if (family === 'extended-3-xy') state.extendedType3XyReport = null;
          else if (family === 'extended-3-chain') state.extendedType3ChainReport = null;
          else if (family === '3b') state.type3XzReport = null;
          else if (family === '3c') state.type3XyReport = null;
          else if (family === '3d') state.type3ChainReport = null;
          else state.type3Report = null;
          render();
          actions.setStatus(`Could not search ${label}: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 0);
    }

    elements.button.addEventListener('click', event => run(1, event));
    elements.extendedType1Button?.addEventListener('click', event => run('extended-1', event));
    elements.extendedType2Button?.addEventListener('click', event => run('extended-2-5', event));
    elements.extendedType3Button?.addEventListener('click', event => run(3, event, 'extended-3'));
    elements.extendedType3XzButton?.addEventListener('click', event => run(3, event, 'extended-3-xz'));
    elements.extendedType3XyButton?.addEventListener('click', event => run(3, event, 'extended-3-xy'));
    elements.extendedType3ChainButton?.addEventListener('click', event => run(3, event, 'extended-3-chain'));
    elements.type2Button.addEventListener('click', event => run(2, event));
    elements.type4Button?.addEventListener('click', event => run(4, event));
    elements.extendedType4Button?.addEventListener('click', event => run('extended-4', event));
    elements.extendedType6Button?.addEventListener('click', event => run('extended-6', event));
    elements.extendedType7Button?.addEventListener('click', event => run('extended-7', event));
    elements.extendedType8Button?.addEventListener('click', event => run('extended-8', event));
    elements.extendedType9Button?.addEventListener('click', event => run('extended-9', event));
    elements.type6Button?.addEventListener('click', event => run(6, event));
    elements.type7Button?.addEventListener('click', event => run(7, event));
    elements.type8Button?.addEventListener('click', event => run(8, event));
    elements.type9Button?.addEventListener('click', event => run(9, event));
    elements.type3Button.addEventListener('click', event => run(3, event, '3a'));
    elements.type3XzButton.addEventListener('click', event => run(3, event, '3b'));
    elements.type3XyButton?.addEventListener('click', event => run(3, event, '3c'));
    elements.type3ChainButton?.addEventListener('click', event => run(3, event, '3d'));
    function bindType3Menu(toggle, menu) {
      if (!toggle || !menu) return;
      toggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = !menu.hidden;
        toggle.setAttribute('aria-expanded', String(!menu.hidden));
      });
      menu.addEventListener('click', event => event.stopPropagation());
    }
    bindType3Menu(elements.type3MenuToggle, elements.type3Menu);
    bindType3Menu(elements.extendedType3MenuToggle, elements.extendedType3Menu);
    return { run, render };
  }

  app.uniquenessSearch = { create, type9Step, type8ForcingProof };
})(window);
