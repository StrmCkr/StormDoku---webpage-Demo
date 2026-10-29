(function initStormDokuColouringModel(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function colouringNodeKey(node) {
    return `${node.cell}:${node.digit ?? ''}`;
  }

  function selectedColouringRecord(state, method) {
    if (method === 'simple') return state.simpleColoringReport?.[state.selectedSimpleColoringIndex] || null;
    if (method === 'multi') return state.multiColoringReport?.[state.selectedMultiColoringIndex] || null;
    if (method === 'superMulti') return state.superMultiColoringReport?.[state.selectedSuperMultiColoringIndex] || null;
    if (method === 'medusa') return state.threeDMedusaReport?.[state.selectedThreeDMedusaIndex] || null;
    return state.threeDMedusaMultiReport?.[state.selectedThreeDMedusaMultiIndex] || null;
  }

  function colouringSequenceNodes(record, method) {
    if (!record) return [];
    if (method === 'simple') {
      return (record.cellColors || []).map(item => ({
        cell: item.cell,
        digit: record.digit,
        colors: item.colors || [],
        breadth: item.breadth,
      }));
    }
    if (method === 'multi' || method === 'superMulti') {
      return !record.source
        ? (record.cellColours || record.nodes || [])
        : (record.nodes || record.cellColours || []);
    }
    // Multi-colour Medusa keeps named pair tokens on cellColours. Bare graph
    // nodes only carry numeric parity and would lose the visible two sides.
    if (method === 'medusaMulti') return record.cellColours || record.nodes || [];
    return record.nodes || [];
  }

  function colouringSequenceLinkLevels(record) {
    const links = record?.linkColours || [];
    if (!links.length) return new Map();
    const endpointKeys = links.map(link => new Set(
      (link.endpoints || []).map(endpoint => colouringNodeKey(endpoint)),
    ));
    const graphAdjacency = new Map();
    for (const edge of record.edges || []) {
      const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
      const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
      if (!left || !right || left === right) continue;
      if (!graphAdjacency.has(left)) graphAdjacency.set(left, new Set());
      if (!graphAdjacency.has(right)) graphAdjacency.set(right, new Set());
      graphAdjacency.get(left).add(right);
      graphAdjacency.get(right).add(left);
    }
    const linkAdjacency = links.map(() => new Set());
    for (let leftIndex = 0; leftIndex < links.length; leftIndex++) {
      for (let rightIndex = leftIndex + 1; rightIndex < links.length; rightIndex++) {
        let connected = [...endpointKeys[leftIndex]].some(key =>
          endpointKeys[rightIndex].has(key));
        if (!connected) {
          connected = [...endpointKeys[leftIndex]].some(leftKey =>
            [...endpointKeys[rightIndex]].some(rightKey =>
              graphAdjacency.get(leftKey)?.has(rightKey)));
        }
        if (!connected) continue;
        linkAdjacency[leftIndex].add(rightIndex);
        linkAdjacency[rightIndex].add(leftIndex);
      }
    }
    const levels = new Map([[0, 1]]);
    const queue = [0];
    while (queue.length) {
      const index = queue.shift();
      const level = levels.get(index) || 1;
      for (const neighbour of linkAdjacency[index]) {
        if (levels.has(neighbour)) continue;
        levels.set(neighbour, level + 1);
        queue.push(neighbour);
      }
    }
    let nextLevel = Math.max(...levels.values()) + 1;
    for (let index = 0; index < links.length; index++) {
      if (levels.has(index)) continue;
      levels.set(index, nextLevel++);
    }
    return levels;
  }

  function colouringSequenceEdgeLevels(record) {
    const edges = (record?.edges || []).filter(edge =>
      edge.kind !== 'weak-inference'
      && edge.left?.cell != null
      && edge.right?.cell != null,
    );
    if (!edges.length) return { edges, levels: new Map() };
    const endpointKeys = edges.map(edge => new Set([
      colouringNodeKey(edge.left),
      colouringNodeKey(edge.right),
    ]));
    const adjacency = edges.map(() => new Set());
    for (let leftIndex = 0; leftIndex < edges.length; leftIndex++) {
      for (let rightIndex = leftIndex + 1; rightIndex < edges.length; rightIndex++) {
        if (![...endpointKeys[leftIndex]].some(key => endpointKeys[rightIndex].has(key))) continue;
        adjacency[leftIndex].add(rightIndex);
        adjacency[rightIndex].add(leftIndex);
      }
    }
    const levels = new Map([[0, 1]]);
    const queue = [0];
    while (queue.length) {
      const index = queue.shift();
      const level = levels.get(index) || 1;
      for (const neighbour of adjacency[index]) {
        if (levels.has(neighbour)) continue;
        levels.set(neighbour, level + 1);
        queue.push(neighbour);
      }
    }
    let nextLevel = Math.max(...levels.values()) + 1;
    for (let index = 0; index < edges.length; index++) {
      if (levels.has(index)) continue;
      levels.set(index, nextLevel++);
    }
    return { edges, levels };
  }

  function colouringSequenceMedusaLevels(record, nodes) {
    const adjacency = new Map();
    for (const edge of record?.edges || []) {
      if (edge.kind === 'weak-inference') continue;
      const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
      const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
      if (!left || !right || left === right) continue;
      if (!adjacency.has(left)) adjacency.set(left, []);
      if (!adjacency.has(right)) adjacency.set(right, []);
      const flip = edge.kind !== 'overlap-extension';
      adjacency.get(left).push({ key: right, flip });
      adjacency.get(right).push({ key: left, flip });
    }
    const stateLevels = new Map();
    const first = nodes?.[0];
    if (first) {
      const queue = [[colouringNodeKey(first), first.colors?.[0] ?? 0, 1]];
      const seen = new Set();
      while (queue.length) {
        const [key, color, level] = queue.shift();
        const stateKey = `${key}:${color}`;
        if (seen.has(stateKey)) continue;
        seen.add(stateKey);
        const colors = stateLevels.get(key) || new Map();
        if (!colors.has(color) || level < colors.get(color)) colors.set(color, level);
        stateLevels.set(key, colors);
        for (const edge of adjacency.get(key) || []) {
          queue.push([edge.key, edge.flip ? 1 - color : color, level + 1]);
        }
      }
    }
    const nodeLevels = new Map();
    for (const [key, colors] of stateLevels) {
      if (colors.size) nodeLevels.set(key, Math.min(...colors.values()));
    }
    let nextLevel = Math.max(0, ...nodeLevels.values()) + 1;
    for (const node of nodes || []) {
      const key = colouringNodeKey(node);
      if (!nodeLevels.has(key)) nodeLevels.set(key, nextLevel++);
    }
    const linkLevels = new Map();
    for (const [index, link] of (record?.linkColours || []).entries()) {
      const endpointLevels = (link.endpoints || []).map(endpoint => {
        const reached = stateLevels.get(colouringNodeKey(endpoint));
        const levels = (endpoint.colors || [])
          .map(color => reached?.get(color))
          .filter(level => Number.isFinite(level));
        return levels.length ? Math.min(...levels) : (nodeLevels.get(colouringNodeKey(endpoint)) || 1);
      });
      linkLevels.set(index, endpointLevels.length ? Math.max(...endpointLevels) : 1);
    }
    const stateMax = Math.max(0, ...[...stateLevels.values()]
      .flatMap(colors => [...colors.values()]));
    const linkMax = Math.max(0, ...linkLevels.values());
    return {
      stateLevels,
      nodeLevels,
      linkLevels,
      max: Math.max(1, stateMax, linkMax, ...nodeLevels.values()),
    };
  }

  function colouringSequenceLevels(record, method) {
    const nodes = colouringSequenceNodes(record, method);
    const levels = new Map();
    if (!nodes.length) return levels;
    if (method === 'simple') {
      for (const node of nodes) {
        levels.set(colouringNodeKey(node), Number.isInteger(node.breadth) ? node.breadth + 1 : 1);
      }
      return levels;
    }
    if ((method === 'multi' || method === 'superMulti') && !record.source) {
      const linkLevels = colouringSequenceLinkLevels(record);
      for (const node of nodes) {
        const level = linkLevels.get(
          (record.linkColours || []).findIndex(link => link.id === node.linkId),
        ) || 1;
        levels.set(colouringNodeKey(node), level);
      }
      return levels;
    }
    if (method === 'medusaMulti') return colouringSequenceMedusaLevels(record, nodes).nodeLevels;
    if (method === 'medusa') {
      const adjacency = new Map();
      for (const edge of record.edges || []) {
        if (edge.kind === 'weak-inference') continue;
        const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
        const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
        if (!left || !right || left === right) continue;
        if (!adjacency.has(left)) adjacency.set(left, new Set());
        if (!adjacency.has(right)) adjacency.set(right, new Set());
        adjacency.get(left).add(right);
        adjacency.get(right).add(left);
      }
      const root = nodes[0] && colouringNodeKey(nodes[0]);
      if (root) {
        const queue = [[root, 1]];
        while (queue.length) {
          const [key, level] = queue.shift();
          if (levels.has(key)) continue;
          levels.set(key, level);
          for (const neighbour of adjacency.get(key) || []) {
            if (!levels.has(neighbour)) queue.push([neighbour, level + 1]);
          }
        }
      }
      let nextLevel = Math.max(0, ...levels.values()) + 1;
      for (const node of nodes) {
        const key = colouringNodeKey(node);
        if (!levels.has(key)) levels.set(key, nextLevel++);
      }
      return levels;
    }
    const nodeKeys = new Set(nodes.map(colouringNodeKey));
    const adjacency = new Map([...nodeKeys].map(key => [key, new Set()]));
    for (const edge of record.edges || []) {
      const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
      const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
      if (!left || !right || left === right) continue;
      if (!adjacency.has(left)) adjacency.set(left, new Set());
      if (!adjacency.has(right)) adjacency.set(right, new Set());
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    }
    const roots = [nodes[0], ...nodes.slice(1)].map(colouringNodeKey);
    let nextLevel = 1;
    for (const root of roots) {
      if (levels.has(root)) continue;
      const queue = [[root, nextLevel]];
      while (queue.length) {
        const [key, level] = queue.shift();
        if (levels.has(key)) continue;
        levels.set(key, level);
        for (const neighbour of adjacency.get(key) || []) {
          if (!levels.has(neighbour)) queue.push([neighbour, level + 1]);
        }
      }
      nextLevel = Math.max(nextLevel, ...[...levels.values()]) + 1;
    }
    return levels;
  }

  function colouringSequenceInfo(record, method, state = null) {
    const levels = colouringSequenceLevels(record, method);
    const medusaWalk = method === 'medusaMulti'
      ? colouringSequenceMedusaLevels(record, colouringSequenceNodes(record, method))
      : null;
    const max = Math.max(1, ...levels.values(), medusaWalk?.max || 0);
    const breadthState = state?.[method];
    const breadth = breadthState?.enabled ? Math.min(Math.max(1, breadthState.breadth), max) : max;
    const visibleKeys = new Set([...levels]
      .filter(([, level]) => level <= breadth)
      .map(([key]) => key));
    return { levels, max, breadth, visibleKeys, complete: breadth >= max };
  }

  function visibleColouringNodes(record, method, info, assignmentsFn) {
    const assignments = assignmentsFn(
      record,
      method,
      info.levels,
      info.max,
      info.breadth,
    );
    return colouringSequenceNodes(record, method)
      .filter(node => info.visibleKeys.has(colouringNodeKey(node)))
      .map(node => {
        const key = colouringNodeKey(node);
        const colors = (node.colors || []).filter(color =>
          assignments.colourLevels.get(key)?.get(color) <= info.breadth);
        const colourTokens = (node.colourTokens || []).filter(token =>
          assignments.tokenLevels.get(key)?.get(token) <= info.breadth);
        return { ...node, colors, colourTokens };
      })
      .filter(node => node.colors.length || node.colourTokens.length);
  }

  function plausibleColouringEliminations(record, method, info, visibleNodesFn, core) {
    if (!record?.eliminations?.length) return [];
    if (info.complete) return record.eliminations;
    const nodes = visibleNodesFn(record, method, info);
    if (!nodes.length) return [];
    if (method === 'multi' || method === 'superMulti' || method === 'medusaMulti') {
      const visibleTokensByKey = new Map(nodes.map(node => [
        colouringNodeKey(node),
        new Set(node.colourTokens || []),
      ]));
      const pairGroups = new Map();
      for (const link of record.linkColours || []) {
        const pairColours = link.pairColours || [];
        if (pairColours.length < 2) continue;
        const pairKey = link.pairIndex == null
          ? `colours:${pairColours.join('|')}`
          : `pair:${link.pairIndex}`;
        for (const endpoint of link.endpoints || []) {
          const key = colouringNodeKey(endpoint);
          const visibleTokens = visibleTokensByKey.get(key);
          if (!visibleTokens) continue;
          const endpointTokens = endpoint.colourTokens || [];
          const endpointColors = endpoint.colors || [];
          for (let parity = 0; parity < 2; parity++) {
            const token = endpointTokens[endpointColors.indexOf(parity)] || pairColours[parity];
            if (!token || !visibleTokens.has(token)) continue;
            const digit = Number(endpoint.digit);
            if (!Number.isInteger(digit)) continue;
            const groupKey = `${pairKey}|${digit}`;
            const group = pairGroups.get(groupKey) || [[], []];
            group[parity].push(endpoint.cell);
            pairGroups.set(groupKey, group);
          }
        }
      }
      return record.eliminations.filter(item => {
        const itemDigit = Number(item.digit);
        if (!Number.isInteger(itemDigit)) return false;
        for (const [groupKey, group] of pairGroups.entries()) {
          if (!groupKey.endsWith(`|${itemDigit}`)) continue;
          const left = [...new Set(group[0])];
          const right = [...new Set(group[1])];
          if (!left.length || !right.length) continue;
          for (const leftCell of left) {
            for (const rightCell of right) {
              if (leftCell === rightCell || item.cell === leftCell || item.cell === rightCell) continue;
              const peersBoth = core.peersOf(leftCell).includes(item.cell)
                && core.peersOf(rightCell).includes(item.cell);
              const sharedSector = core.UNITS.some(unit =>
                unit.includes(item.cell) && unit.includes(leftCell) && unit.includes(rightCell));
              if (peersBoth || sharedSector) return true;
            }
          }
        }
        return false;
      });
    }
    const byDigit = new Map();
    for (const node of nodes) {
      const digit = Number(node.digit);
      if (!Number.isInteger(digit)) continue;
      if (!byDigit.has(digit)) byDigit.set(digit, []);
      byDigit.get(digit).push(node);
    }
    return record.eliminations.filter(item => {
      const itemDigit = Number(item.digit);
      const sourceDigits = Number.isInteger(record.digit) ? [record.digit] : [...byDigit.keys()];
      for (const sourceDigit of sourceDigits) {
        const sourceNodes = byDigit.get(sourceDigit) || [];
        const terminal = sourceNodes.filter(node => (node.colors || []).length > 1);
        if (terminal.some(node => node.cell === item.cell && itemDigit !== sourceDigit)) return true;
        if (terminal.some(node => core.peersOf(node.cell).includes(item.cell))) return true;
        const sees = [0, 1].map(color => sourceNodes.some(node =>
          (node.colors || []).includes(color) && core.peersOf(node.cell).includes(item.cell)));
        if (sees[0] && sees[1]) return true;
        for (const sector of core.UNITS) {
          if (!sector.includes(item.cell)) continue;
          const inSector = sourceNodes.filter(node => sector.includes(node.cell));
          if (inSector.some(node => (node.colors || []).includes(0))
            && inSector.some(node => (node.colors || []).includes(1))) return true;
          for (const color of [0, 1]) {
            const sameParity = inSector.filter(node => (node.colors || []).includes(color));
            if (sameParity.length >= 2 && sameParity.some(node => node.cell === item.cell)) return true;
          }
        }
      }
      return false;
    });
  }

  function displayColouringRecord(record, method, state, visibleNodesFn, plausibleEliminationsFn) {
    if (!record || !state?.[method]?.enabled) return record;
    const info = colouringSequenceInfo(record, method, state);
    const visibleNodes = visibleNodesFn(record, method, info);
    const visibleKeys = info.visibleKeys;
    const display = {
      ...record,
      eliminations: plausibleEliminationsFn(record, method, info),
    };
    if (method === 'simple') {
      display.cellColors = visibleNodes.map(node => ({
        cell: node.cell,
        colors: node.colors,
        breadth: node.breadth,
      }));
      display.blueCells = visibleNodes.filter(node => node.colors.includes(0)).map(node => node.cell);
      display.purpleCells = visibleNodes.filter(node => node.colors.includes(1)).map(node => node.cell);
      display.trueCells = (record.trueCells || []).filter(cell => visibleKeys.has(`${cell}:${record.digit}`));
      display.terminalTruth = (record.terminalTruth || []).filter(item =>
        visibleKeys.has(colouringNodeKey(item)));
      display.terminalClosure = info.complete ? record.terminalClosure : null;
      return display;
    }
    const visibleNodeKeys = new Set(visibleNodes.map(colouringNodeKey));
    const visibleByKey = new Map(visibleNodes.map(node => [colouringNodeKey(node), node]));
    display.nodes = visibleNodes;
    display.cellColours = (record.cellColours || [])
      .map(item => {
        const visible = visibleByKey.get(colouringNodeKey(item));
        if (!visible) return null;
        return { ...item, colors: visible.colors || [], colourTokens: visible.colourTokens || [] };
      })
      .filter(Boolean);
    display.linkColours = method === 'multi' || method === 'superMulti'
      ? (record.linkColours || []).filter(link => visibleNodeKeys.has(colouringNodeKey(
        link.endpoints?.[0] || { cell: link.cells?.[0], digit: record.digit },
      )))
      : method === 'medusaMulti'
        ? (record.linkColours || []).filter((link, index) =>
          (colouringSequenceMedusaLevels(record, colouringSequenceNodes(record, method))
            .linkLevels.get(index) || 1) <= info.breadth)
        : record.linkColours;
    if (method === 'superMulti') {
      const visibleLinkIds = new Set(display.linkColours.map(link => link.id));
      display.groupColours = (record.groupColours || [])
        .filter(group => visibleLinkIds.has(group.id))
        .map(group => ({
          ...group,
          sides: (group.sides || []).map(side => ({
            ...side,
            cells: [...(side.cells || [])],
            colors: [...(side.colors || [])],
            colourTokens: [...(side.colourTokens || [])],
          })),
        }));
      display.groupEdges = (record.groupEdges || []).filter(edge => visibleLinkIds.has(edge.linkId));
    }
    display.terminalClosure = info.complete ? record.terminalClosure : null;
    display.terminalTruth = (record.terminalTruth || [])
      .filter(item => visibleNodeKeys.has(colouringNodeKey(item)));
    return display;
  }

  function selectColouringHighlightRecords({
    blocked = false,
    reports = {},
    indices = {},
    state = null,
    visibleNodesFn,
    plausibleEliminationsFn,
  } = {}) {
    const pick = (report, index) => report?.[index] || null;
    const raw = {
      superMulti: !blocked ? pick(reports.superMulti, indices.superMulti) : null,
      medusaMulti: !blocked ? pick(reports.medusaMulti, indices.medusaMulti) : null,
      multi: !blocked ? pick(reports.multi, indices.multi) : null,
      medusa: !blocked ? pick(reports.medusa, indices.medusa) : null,
    };
    const display = record => displayColouringRecord(
      record,
      record === raw.superMulti ? 'superMulti' :
        record === raw.medusaMulti ? 'medusaMulti' :
          record === raw.multi ? 'multi' : 'medusa',
      state,
      visibleNodesFn,
      plausibleEliminationsFn,
    );
    const records = {
      superMulti: display(raw.superMulti),
      medusaMulti: display(raw.medusaMulti),
      multi: display(raw.multi),
      medusa: display(raw.medusa),
    };
    records.colouring = records.medusaMulti?.source === 'bivalve'
      ? records.medusaMulti
      : records.medusa;
    records.activeMulti = records.superMulti
      || (records.medusaMulti?.source === 'multi' ? records.medusaMulti : records.multi);
    const simpleRaw = !blocked && !raw.superMulti && !raw.medusaMulti
      && !raw.multi && !raw.medusa
      ? pick(reports.simple, indices.simple)
      : null;
    records.simple = displayColouringRecord(
      simpleRaw,
      'simple',
      state,
      visibleNodesFn,
      plausibleEliminationsFn,
    );
    return { raw, ...records };
  }

  function buildColouringHighlightMarks({
    simpleRecord = null,
    colouringRecord = null,
    activeMultiRecord = null,
    atomKeyFn,
    cellHasCandidateFn,
  } = {}) {
    const colourRole = colors => colors?.length > 1
      ? 'both'
      : colors?.[0] === 0
        ? 'blue'
        : colors?.[0] === 1
          ? 'purple'
          : null;
    const simple = new Map();
    if (simpleRecord) {
      for (const item of simpleRecord.cellColors || []) {
        const role = colourRole(item.colors);
        if (!role || !cellHasCandidateFn(item.cell, simpleRecord.digit)) continue;
        simple.set(atomKeyFn(item.cell, simpleRecord.digit), role);
      }
    }
    const simpleEliminations = new Set(
      (simpleRecord?.eliminations || []).map(item => atomKeyFn(item.cell, item.digit)),
    );
    const medusa = new Map();
    for (const node of colouringRecord?.nodes || []) {
      const role = colourRole(node.colors);
      if (role) medusa.set(atomKeyFn(node.cell, node.digit), role);
    }
    const medusaEliminations = new Set(
      (colouringRecord?.eliminations || []).map(item => atomKeyFn(item.cell, item.digit)),
    );
    const medusaInvalid = new Set(colouringRecord?.invalidColourAtoms || []);
    const multiEliminations = new Set(
      (activeMultiRecord?.eliminations || []).map(item => atomKeyFn(item.cell, item.digit)),
    );
    const multi = new Map();
    for (const item of activeMultiRecord?.cellColours || []) {
      const tokens = [...new Set(item.colourTokens || [])];
      if (!tokens.length) continue;
      const key = atomKeyFn(item.cell, item.digit);
      multi.set(key, [...new Set([...(multi.get(key) || []), ...tokens])]);
    }
    return {
      simple,
      simpleEliminations,
      medusa,
      medusaEliminations,
      medusaInvalid,
      multi,
      multiEliminations,
    };
  }

  function setColouringSequenceEnabled(state, method, enabled) {
    if (!state?.[method]) return;
    state[method].enabled = enabled;
    if (enabled) state[method].breadth = 1;
  }

  function stepColouringSequence(state, method, delta, infoFn) {
    const sequence = state?.[method];
    if (!sequence?.enabled) return;
    const info = infoFn(method);
    sequence.breadth = Math.min(info.max, Math.max(1, sequence.breadth + delta));
  }

  app.colouringModel = {
    colouringNodeKey,
    selectedColouringRecord,
    colouringSequenceNodes,
    colouringSequenceLinkLevels,
    colouringSequenceEdgeLevels,
    colouringSequenceMedusaLevels,
    colouringSequenceLevels,
    colouringSequenceInfo,
    visibleColouringNodes,
    plausibleColouringEliminations,
    displayColouringRecord,
    selectColouringHighlightRecords,
    buildColouringHighlightMarks,
    setColouringSequenceEnabled,
    stepColouringSequence,
  };
})(window);
