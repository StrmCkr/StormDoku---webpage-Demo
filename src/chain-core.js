(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before chain-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before chain-core.js');
  if (!core.buildStrongLinks) throw new Error('strong-link-core.js must load before chain-core.js');

  const { intersection, sortedUnique, union } = core.setTools;
  const LOCAL_WEAK = 0;
  const SECTOR_WEAK = 1;
  const WEAK_TYPE_NAMES = ['LOCAL', 'SECTOR'];

  function asNumbers(values) {
    if (!values) return [];
    const source = Array.isArray(values)
      ? values
      : values instanceof Set
        ? [...values]
        : typeof values[Symbol.iterator] === 'function'
          ? [...values]
          : [];
    return sortedUnique(source.map(Number).filter(Number.isFinite));
  }

  function digitMap(record) {
    const out = {};
    if (!record) return out;

    const entries = record instanceof Map
      ? [...record.entries()]
      : Object.entries(record);

    for (const [key, values] of entries) {
      const digit = Number(key);
      if (!Number.isInteger(digit) || digit < 1 || digit > 9) continue;
      out[digit] = asNumbers(values);
    }

    return out;
  }

  function mapDigits(map) {
    return Object.keys(map).map(Number).sort((a, b) => a - b);
  }

  function cellsKey(cells) {
    return asNumbers(cells).join(',');
  }

  function mapKey(map) {
    return mapDigits(map)
      .map(digit => `${digit}:${asNumbers(map[digit]).join(',')}`)
      .join('/');
  }

  function sideKey(side) {
    return [
      side.conveyance,
      side.digits.join(''),
      side.cells.join(','),
      side.rccCells.join(','),
      mapKey(side.sectorsByDigit),
      mapKey(side.potentialElimByDigit),
      side.swapDigits.join(','),
    ].join('|');
  }

  function sideAtoms(side) {
    if (side.conveyance === 'CELLS') return side.cells.map(cell => `cell:${cell}`);
    const atoms = [];
    for (const cell of side.cells) {
      for (const digit of side.digits) atoms.push(`${cell}:${digit}`);
    }
    return atoms;
  }

  function sidesShareAtom(left, right) {
    return hasIntersection(sideAtoms(left), sideAtoms(right));
  }

  function viewAtoms(view) {
    const atoms = new Set();
    for (const atom of sideAtoms(view.entry)) atoms.add(atom);
    for (const atom of sideAtoms(view.exit)) atoms.add(atom);
    return [...atoms];
  }

  function viewUsesKnownAtom(usedAtoms, view) {
    return viewAtoms(view).some(atom => usedAtoms.has(atom));
  }

  function withViewAtoms(usedAtoms, view) {
    const next = new Set(usedAtoms);
    for (const atom of viewAtoms(view)) next.add(atom);
    return next;
  }

  function hasIntersection(left, right) {
    const rightSet = new Set(right);
    return left.some(value => rightSet.has(value));
  }

  function isSubsetOf(left, right) {
    const rightSet = new Set(right);
    return left.every(value => rightSet.has(value));
  }

  function symmetricDifference(left, right) {
    const leftSet = new Set(left);
    const rightSet = new Set(right);
    return sortedUnique([
      ...left.filter(value => !rightSet.has(value)),
      ...right.filter(value => !leftSet.has(value)),
    ]);
  }

  function sideFromLink(link, name) {
    const isLeft = name === 'left';
    const sectorsByDigit = digitMap(isLeft ? link.startCellsSector : link.linkCellsSector);
    const cells = asNumbers(isLeft ? link.activeCells : link.linkedCells);
    const digits = asNumbers(isLeft ? link.startingDigits : link.linkDigits);

    return {
      name,
      conveyance: link.conveyance === 'CELLS' ? 'CELLS' : 'DIGITS',
      cells,
      digits,
      cellKey: cellsKey(cells),
      rccCells: asNumbers(isLeft ? link.rccStartCells : link.rccLinkedCells),
      sectorsByDigit,
      potentialElimByDigit: digitMap(isLeft ? link.potentialElimStart : link.potentialElimEnd),
      swapDigits: asNumbers(isLeft ? link.startDigitSwapAvailable : link.endDigitSwapAvailable),
    };
  }

  function subsetNodeLabel(prefix, node) {
    if (!node) return '';

    const id = node.uniqueID ?? '?';
    const digits = asNumbers(node.digits).join('');
    const cells = asNumbers(node.cells);
    const cellText = cells.length ? core.cellGroupName(cells) : 'none';
    const sector = Number.isInteger(node.sector)
      ? ` in ${core.sectorGroupName([node.sector])}`
      : '';

    return `${prefix}#${id} (${digits || '?'}) ${cellText}${sector}`;
  }

  function bridgeLabel(bridge) {
    if (!bridge) return '';

    const digits = asNumbers(bridge.digits || (bridge.digit == null ? [] : [bridge.digit])).join('');
    const cells = union(asNumbers(bridge.leftCells), asNumbers(bridge.rightCells));
    const sectors = asNumbers(bridge.sectors);
    const location = sectors.length
      ? core.sectorGroupName(sectors)
      : cells.length
        ? core.cellGroupName(cells)
        : 'none';
    if (bridge.conveyance === 'CELLS' || (!digits && cells.length)) {
      return `C(${core.cellGroupName(cells)}) ${location}`;
    }
    return `C(${digits || '?'}) ${location}`;
  }

  function publicSubsetNode(prefix, node) {
    if (!node) return null;
    return {
      id: node.uniqueID ?? null,
      sector: Number.isInteger(node.sector) ? node.sector : null,
      cells: asNumbers(node.cells),
      digits: asNumbers(node.digits),
      label: subsetNodeLabel(prefix, node),
    };
  }

  function publicBridge(bridge) {
    if (!bridge) return null;
    const digits = asNumbers(bridge.digits || (bridge.digit == null ? [] : [bridge.digit]));
    const cells = union(asNumbers(bridge.leftCells), asNumbers(bridge.rightCells));
    return {
      conveyance: bridge.conveyance === 'CELLS' ? 'CELLS' : 'DIGITS',
      digit: bridge.digit ?? digits[0] ?? null,
      digits,
      restrictedDigits: asNumbers(bridge.restrictedDigits || (bridge.digit == null ? [] : [bridge.digit])),
      leftCells: asNumbers(bridge.leftCells),
      rightCells: asNumbers(bridge.rightCells),
      cells,
      sectors: asNumbers(bridge.sectors),
      label: bridgeLabel(bridge),
    };
  }

  function orientedModule(view) {
    const link = view.node.raw;
    const isAls = view.node.family === 'ALS' && view.node.linkTypeName === 'ALS_RCC' && link.LS_L && link.LS_R;
    if (!isAls) return null;

    const subsetKind = 'LS';
    const leftSubset = link.LS_L;
    const rightSubset = link.LS_R;
    const entrySubset = view.forward ? rightSubset : leftSubset;
    const exitSubset = view.forward ? leftSubset : rightSubset;
    const entrySideSubset = view.forward ? leftSubset : rightSubset;
    const exitSideSubset = view.forward ? rightSubset : leftSubset;
    const module = {
      family: 'ALS',
      subsetKind,
      entryRcc: view.forward ? 'RCC_L' : 'RCC_R',
      entrySubset: publicSubsetNode(subsetKind, entrySubset),
      common: publicBridge(link.C),
      exitSubset: publicSubsetNode(subsetKind, exitSubset),
      exitRcc: view.forward ? 'RCC_R' : 'RCC_L',
      entrySideSubset: publicSubsetNode(subsetKind, entrySideSubset),
      exitSideSubset: publicSubsetNode(subsetKind, exitSideSubset),
      entryLs: publicSubsetNode('LS', entrySubset),
      exitLs: publicSubsetNode('LS', exitSubset),
      entrySideLs: publicSubsetNode('LS', entrySideSubset),
      exitSideLs: publicSubsetNode('LS', exitSideSubset),
      moduleKind: link.moduleKind,
      displayLeftRcc: link.displayLeftRcc ?? null,
      displayRightRcc: link.displayRightRcc ?? null,
    };

    module.label = [module.entrySubset?.label, module.common?.label, module.exitSubset?.label]
      .filter(Boolean)
      .join(' / ');
    return module;
  }

  function moduleLabelForView(view, module = orientedModule(view)) {
    return module?.label || view.node.moduleLabel;
  }

  function isExpandedRcc(view) {
    const module = orientedModule(view);
    return !!module?.common && !!module.entrySideSubset && !!module.exitSideSubset;
  }

  function modularRingBridgeDigits(raw) {
    return raw.C?.restrictedDigits?.length
      ? asNumbers(raw.C.restrictedDigits)
      : asNumbers(raw.C?.digits || (raw.C?.digit == null ? [] : [raw.C.digit]));
  }

  function isModularRingClosure(raw) {
    if (raw.moduleKind !== 'ALS_XZ' || !raw.C || !raw.RCC_Left || !raw.RCC_Right) return false;
    if (raw.RCC_Left.digit !== raw.RCC_Right.digit) return false;

    const bridgeDigits = modularRingBridgeDigits(raw);
    const endpointDigit = raw.RCC_Left.digit;
    if (!bridgeDigits.some(digit => digit !== endpointDigit)) return false;

    // The return RCC must actually expose the shared endpoint elimination.
    return (raw.intrinsicEliminations || []).some(item => item.digit === endpointDigit);
  }

  function isLockedDigit(cand, subset, digit) {
    const cells = subset?.cells || [];
    const positions = cells.filter(cell => (cand[cell] || []).includes(digit));
    return positions.length >= 2 && core.UNITS.some(unit => positions.every(cell => unit.includes(cell)));
  }

  function isRestrictedCommonDigit(cand, left, right, digit) {
    const leftCells = (left?.cells || []).filter(cell => (cand[cell] || []).includes(digit));
    const rightCells = (right?.cells || []).filter(cell => (cand[cell] || []).includes(digit));
    return leftCells.length > 0
      && rightCells.length > 0
      && leftCells.every(leftCell => rightCells.every(rightCell => core.peersOf(leftCell).includes(rightCell)));
  }

  function hasDistinctReciprocalAlsXz(raw, linkNodes) {
    if (!raw.LS_L || !raw.LS_R) return false;
    const bridgeDigits = modularRingBridgeDigits(raw);
    if (bridgeDigits.length !== 1) return false;

    const bridgeDigit = bridgeDigits[0];
    const endpointDigit = raw.RCC_Left?.digit;
    if (endpointDigit == null) return false;

    return linkNodes.some(node => {
      const candidate = node.raw;
      return node.family === 'ALS'
        && candidate !== raw
        && candidate.moduleKind === 'ALS_XZ'
        && candidate.id !== raw.id
        && candidate.LS_L?.uniqueID === raw.LS_L?.uniqueID
        && candidate.LS_R?.uniqueID === raw.LS_R?.uniqueID
        && candidate.displayLeftRcc === bridgeDigit
        && candidate.displayRightRcc === endpointDigit
        && modularRingBridgeDigits(candidate).includes(endpointDigit)
        && (candidate.intrinsicEliminations || []).some(item => item.digit === bridgeDigit);
    });
  }

  function modularRingClosureDigit(cand, view, linkNodes) {
    const raw = view.node.raw;
    if (!isModularRingClosure(raw) || !raw.LS_L || !raw.LS_R) return null;

    const bridgeDigits = modularRingBridgeDigits(raw);
    const endpointDigit = raw.RCC_Left.digit;
    const excluded = new Set([endpointDigit, ...bridgeDigits]);
    const candidates = intersection(raw.LS_L.digits || [], raw.LS_R.digits || [])
      .filter(digit => !excluded.has(digit));
    const locked = candidates.filter(digit =>
      isLockedDigit(cand, raw.LS_L, digit) && isLockedDigit(cand, raw.LS_R, digit));

    if (isRestrictedCommonDigit(cand, raw.LS_L, raw.LS_R, endpointDigit)) return endpointDigit;
    if (!hasDistinctReciprocalAlsXz(raw, linkNodes)) return null;
    return locked.length === 1 ? locked[0] : endpointDigit;
  }

  function logicalDepth(steps) {
    return steps.reduce((depth, step) => depth + (isExpandedRcc(step.view) ? 2 : 1), 0);
  }

  function modularRingWeak(view) {
    if (!isModularRingClosure(view.node.raw)) return null;
    const module = orientedModule(view);
    if (!module?.common) return null;
    const digit = module.common.restrictedDigits[0] ?? module.common.digits[0];
    if (digit == null) return null;
    return {
      weakType: SECTOR_WEAK,
      weakTypeName: WEAK_TYPE_NAMES[SECTOR_WEAK],
      digit,
      cells: union(module.common.leftCells, module.common.rightCells),
      sectors: [...module.common.sectors],
    };
  }

  function modularRingClosureWeak(view, digit) {
    const bridgeWeak = modularRingWeak(view);
    if (!bridgeWeak) return null;
    const raw = view.node.raw;
    return {
      ...bridgeWeak,
      digit,
      cells: union(raw.RCC_Left?.cells || [], raw.RCC_Right?.cells || []),
      sectors: union(raw.RCC_Left?.sectors || [], raw.RCC_Right?.sectors || []),
    };
  }

  function computeModularRingEliminations(cand, view, out) {
    const raw = view.node.raw;
    if (!isModularRingClosure(raw)) return;
    const bridgeDigits = modularRingBridgeDigits(raw);

    const excludedDigits = new Set([
      raw.RCC_Left.digit,
      raw.RCC_Right.digit,
      ...bridgeDigits,
    ]);
    const cCells = union(raw.C?.leftCells || [], raw.C?.rightCells || []);
    const cCommonDigits = cCells.length
      ? cCells.slice(1).reduce(
          (digits, cell) => intersection(digits, cand[cell] || []),
          [...(cand[cCells[0]] || [])],
        )
      : [];
    const pairedCells = union(raw.LS_L?.cells || [], raw.LS_R?.cells || []);
    for (const subset of [raw.LS_L, raw.LS_R]) {
      if (!subset?.cells?.length || !subset.digits?.length) continue;
      for (const digit of subset.digits) {
        if (excludedDigits.has(digit)) continue;
        const positions = subset.cells.filter(cell => (cand[cell] || []).includes(digit));
        if (positions.length < 2) continue;
        for (const unit of core.UNITS) {
          if (!positions.every(cell => unit.includes(cell))) continue;
          for (const cell of unit) {
            if (!pairedCells.includes(cell)) addElimination(out, cand, digit, [cell], 'ring-modular-locked');
          }

          // A modular ring can cannibalise the C-side cells of the repeated ALS.
          // Valid digits are the C-cell common candidates after both RCCs and
          // the module bridge have been removed.
          if (subset === raw.LS_L && cCommonDigits.includes(digit)) {
            for (const cell of raw.C?.leftCells || []) {
              if (unit.includes(cell) && subset.cells.includes(cell)) {
                addElimination(out, cand, digit, [cell], 'ring-modular-cannibalistic');
              }
            }
          }
        }
      }
    }

    const cells = intersection(raw.RCC_Left.potentialElim, raw.RCC_Right.potentialElim);
    for (const cell of cells) {
      addElimination(out, cand, raw.RCC_Left.digit, [cell], 'ring-modular-weak');
    }

    const bridges = raw.C.bridges?.length
      ? raw.C.bridges
      : bridgeDigits.map(digit => ({
          digit,
          leftCells: raw.C.leftCells || [],
          rightCells: raw.C.rightCells || [],
        }));
    for (const bridge of bridges) {
      if (bridge.digit == null) continue;
      const bridgeCells = union(bridge.leftCells || [], bridge.rightCells || []);
      if (!bridgeCells.length) continue;
      let commonPeers = new Set(core.peersOf(bridgeCells[0]));
      for (const cell of bridgeCells.slice(1)) {
        const cellPeers = new Set(core.peersOf(cell));
        commonPeers = new Set([...commonPeers].filter(peer => cellPeers.has(peer)));
      }
      for (const peer of commonPeers) {
        if (bridgeCells.includes(peer)) continue;
        addElimination(out, cand, bridge.digit, [peer], 'ring-modular-c');
      }
    }
  }

  function moduleLabel(link, family) {
    if (family === 'ALS' && link.LS_L && link.LS_R) {
      if (link.linkTypeName === 'ALS_RCC') {
        return `${subsetNodeLabel('LS', link.LS_R)} / ${bridgeLabel(link.C)} / ${subsetNodeLabel('LS', link.LS_L)}`;
      }
      return `${subsetNodeLabel('LS', link.LS_L)} / ${bridgeLabel(link.C)} / ${subsetNodeLabel('LS', link.LS_R)}`;
    }

    return '';
  }

  function normaliseLink(link, family, index) {
    const id = link.id ?? index;
    const linkTypeNames = [...new Set([
      link.linkTypeName || family,
      ...(Array.isArray(link.secondaryTypes) ? link.secondaryTypes : []),
    ])];
    const node = {
      raw: link,
      family,
      graphId: `${family}:${id}`,
      id,
      linkType: Number.isInteger(link.linkType) ? link.linkType : -1,
      linkTypeName: link.linkTypeName || family,
      linkTypeNames,
      moduleLabel: moduleLabel(link, family),
      originSector: asNumbers(link.originSector),
      left: null,
      right: null,
      allCells: [],
    };

    node.left = sideFromLink(link, 'left');
    node.right = sideFromLink(link, 'right');
    node.allCells = union(node.left.cells, node.right.cells);
    return node;
  }

  function directedView(node, forward) {
    const entry = forward ? node.left : node.right;
    const exit = forward ? node.right : node.left;
    return {
      key: `${node.graphId}:${forward ? 'F' : 'R'}`,
      node,
      forward,
      direction: forward ? 'F' : 'R',
      entry,
      exit,
    };
  }

  function weakKey(weakType, digit) {
    return `${weakType}:${digit ?? ''}`;
  }

  function stepWeakKey(step) {
    return weakKey(step.weakIn, step.weakDigit);
  }

  function connectionWeakKey(weak) {
    return weakKey(weak?.weakType ?? '', weak?.digit ?? null);
  }

  function viewSemanticKey(view, reverse = false) {
    const entry = reverse ? view.exit : view.entry;
    const exit = reverse ? view.entry : view.exit;
    const direction = reverse
      ? (view.forward ? 'R' : 'F')
      : view.direction;

    return [
      view.node.family,
      view.node.linkType,
      view.node.linkTypeName,
      direction,
      sideKey(entry),
      sideKey(exit),
    ].join('>');
  }

  function flattenLinkSet(linkset, flattener) {
    if (!linkset) return [];
    if (!Array.isArray(linkset)) return [];
    if (!linkset.length) return [];
    if (linkset[0] && !Array.isArray(linkset[0])) return linkset;
    return flattener ? flattener(linkset) : linkset.flat();
  }

  function buildLinkInventory(cand, options) {
    const includeStrong = options.includeStrong !== false;
    const includeAls = options.includeAls === true;
    const strongSet = includeStrong
      ? (options.strongLinkSet || core.buildStrongLinks(cand))
      : [];
    const selectedStrongTypes = new Set(options.strongLinkTypes ?? [0, 1, 2, 3, 4]);
    const strongLinks = flattenLinkSet(strongSet, core.flattenStrongLinks)
      .filter(link => selectedStrongTypes.has(Number(link.linkType)));

    let alsSet = [];
    let alsList = options.alsList || [];
    if (includeAls) {
      alsList = alsList.length
        ? alsList
        : core.alsConstructor?.(cand, { maxSizeDOF: 8, maxSizeFox: 7 }) || [];
      alsSet = options.alsLinkSet || core.buildAlsLinks(cand, {
        alsList,
        strictSingleCommon: options.strictAlsSingleCommon ?? true,
        maxLinks: options.maxAlsLinks,
      });
    }
    const alsLinks = flattenLinkSet(alsSet, core.flattenAlsLinks);

    return {
      links: [
        ...strongLinks.map((link, index) => normaliseLink(link, 'SL', index)),
        ...alsLinks.map((link, index) => normaliseLink(link, 'ALS', index)),
      ],
      counts: {
        strong: strongLinks.length,
        als: alsLinks.length,
      },
      source: { strongSet, alsSet, alsList },
    };
  }

  function buildChainGraph(linkNodes) {
    const views = [];
    const viewsByKey = new Map();
    const entryByCells = new Map();
    const entryByDigitSector = new Map();

    for (const node of linkNodes) {
      for (const view of [directedView(node, true), directedView(node, false)]) {
        views.push(view);
        viewsByKey.set(view.key, view);

        const localBucket = entryByCells.get(view.entry.cellKey) || [];
        localBucket.push(view);
        entryByCells.set(view.entry.cellKey, localBucket);

        if (view.entry.conveyance !== 'CELLS') {
          for (const digit of mapDigits(view.entry.sectorsByDigit)) {
            for (const sector of view.entry.sectorsByDigit[digit]) {
              const key = `${digit}|${sector}`;
              const sectorBucket = entryByDigitSector.get(key) || [];
              sectorBucket.push(view);
              entryByDigitSector.set(key, sectorBucket);
            }
          }
        }
      }
    }

    return { nodes: linkNodes, views, viewsByKey, entryByCells, entryByDigitSector };
  }

  function localConnection(fromView, toView) {
    const exit = fromView.exit;
    const entry = toView.entry;
    if (exit.cells.length !== 1 || entry.cells.length !== 1) return null;
    if (exit.cellKey !== entry.cellKey) return null;
    if (!hasIntersection(exit.digits, entry.swapDigits)) return null;
    if (!hasIntersection(entry.digits, exit.swapDigits)) return null;

    // A local weak link may change digits in the same cell. Keep both sides
    // so the renderer can mark the complete (a-b) inference.
    const fromDigit = exit.digits.find(value => entry.swapDigits.includes(value)) ?? null;
    const toDigit = entry.digits.find(value => exit.swapDigits.includes(value)) ?? null;

    return {
      weakType: LOCAL_WEAK,
      weakTypeName: WEAK_TYPE_NAMES[LOCAL_WEAK],
      digit: toDigit,
      fromDigit,
      toDigit,
      cells: [...exit.cells],
      sectors: [],
    };
  }

  function sectorConnection(fromView, toView, forcedDigit = null) {
    const aNode = fromView.node;
    const bNode = toView.node;
    const aSide = fromView.exit;
    const bSide = toView.entry;

    if (hasIntersection(aNode.allCells, bNode.allCells)) return null;
    if (hasIntersection(aSide.cells, bSide.cells)) return null;

    const digits = forcedDigit == null
      ? intersection(mapDigits(aSide.sectorsByDigit), mapDigits(bSide.sectorsByDigit))
      : [forcedDigit];

    for (const digit of digits) {
      const aSectors = aSide.sectorsByDigit[digit] || [];
      const bSectors = bSide.sectorsByDigit[digit] || [];
      const aElims = aSide.potentialElimByDigit[digit] || [];
      const bElims = bSide.potentialElimByDigit[digit] || [];
      const sharedSectors = intersection(aSectors, bSectors);

      if (!sharedSectors.length || !aElims.length || !bElims.length) continue;
      if (!isSubsetOf(aSide.cells, bElims)) continue;
      if (!isSubsetOf(bSide.cells, aElims)) continue;

      return {
        weakType: SECTOR_WEAK,
        weakTypeName: WEAK_TYPE_NAMES[SECTOR_WEAK],
        digit,
        fromDigit: digit,
        toDigit: digit,
        cells: union(aSide.cells, bSide.cells),
        sectors: sharedSectors,
      };
    }

    return null;
  }

  function directConnection(fromView, toView) {
    return localConnection(fromView, toView) || sectorConnection(fromView, toView);
  }

  function expandFrom(view, graph, stats, options) {
    const out = [];
    const seen = new Set();
    const add = (target, weak) => {
      if (!weak || target.key === view.key) return;
      if (view.exit.conveyance !== 'CELLS'
        && target.exit.conveyance !== 'CELLS'
        && sidesShareAtom(view.exit, target.exit)) return;
      const key = `${target.key}|${weak.weakType}|${weak.fromDigit ?? weak.digit ?? ''}|${weak.toDigit ?? weak.digit ?? ''}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ target, ...weak });
    };

    for (const target of graph.entryByCells.get(view.exit.cellKey) || []) {
      if (target.node.graphId === view.node.graphId) continue;
      stats.transitionsChecked += 1;
      add(target, localConnection(view, target));
      if (out.length >= options.maxBranching) return out;
    }

    if (view.exit.conveyance === 'CELLS') return out;

    for (const digit of mapDigits(view.exit.sectorsByDigit)) {
      for (const sector of view.exit.sectorsByDigit[digit]) {
        const candidates = graph.entryByDigitSector.get(`${digit}|${sector}`) || [];
        for (const target of candidates) {
          if (target.node.graphId === view.node.graphId) continue;
          stats.transitionsChecked += 1;
          add(target, sectorConnection(view, target, digit));
          if (out.length >= options.maxBranching) return out;
        }
      }
    }

    return out;
  }

  function addElimination(out, cand, digit, cells, reason) {
    for (const cell of cells) {
      if (!(cand[cell] || []).includes(digit)) continue;
      const key = `${cell}:${digit}`;
      const existing = out.get(key);
      if (existing) {
        if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
      } else {
        out.set(key, { cell, digit, reasons: [reason] });
      }
    }
  }

  function computeType1(cand, leftView, rightView, out) {
    const left = leftView.entry;
    const right = rightView.exit;
    const commonDigits = intersection(left.digits, right.digits);

    for (const digit of commonDigits) {
      const cells = intersection(
        left.potentialElimByDigit[digit] || [],
        right.potentialElimByDigit[digit] || [],
      );
      addElimination(out, cand, digit, cells, 'type1');
    }
  }

  function computeType2(cand, leftView, rightView, out) {
    const left = leftView.entry;
    const right = rightView.exit;

    for (const digit of symmetricDifference(left.digits, right.digits)) {
      const leftSeenByRight = intersection(left.cells, right.potentialElimByDigit[digit] || []);
      const rightSeenByLeft = intersection(right.cells, left.potentialElimByDigit[digit] || []);

      if (left.cells.length === 1 && leftSeenByRight.length === left.cells.length) {
        addElimination(out, cand, digit, left.cells, 'type2');
      }
      if (right.cells.length === 1 && rightSeenByLeft.length === right.cells.length) {
        addElimination(out, cand, digit, right.cells, 'type2');
      }
    }
  }

  function computeSameCellRing(cand, leftSide, rightSide, out) {
    // This is the cellular closure rule only. A multi-cell ALS endpoint that
    // happens to have the same cell set is not a same-cell XOR closure.
    if (leftSide.cells.length !== 1 || rightSide.cells.length !== 1) return;
    if (leftSide.cellKey !== rightSide.cellKey) return;
    const keepDigits = new Set(intersection(leftSide.digits, rightSide.digits));
    if (keepDigits.size !== leftSide.cells.length) return;
    if (![...keepDigits].every(digit => leftSide.cells.some(cell => (cand[cell] || []).includes(digit)))) return;

    for (const cell of leftSide.cells) {
      for (const digit of cand[cell] || []) {
        if (!keepDigits.has(digit)) addElimination(out, cand, digit, [cell], 'ring-cell');
      }
    }
  }

  function computeLockedWeak(cand, fromView, toView, weak, out) {
    if (!weak || weak.weakType !== SECTOR_WEAK || weak.digit == null) return;
    const leftElims = fromView.exit.potentialElimByDigit[weak.digit] || [];
    const rightElims = toView.entry.potentialElimByDigit[weak.digit] || [];
    addElimination(
      out,
      cand,
      weak.digit,
      intersection(leftElims, rightElims),
      'ring-weak-lock',
    );
  }

  function computeEvenRingCellularWeak(cand, fromView, toView, weak, out) {
    if (!weak || weak.weakType !== LOCAL_WEAK || weak.digit == null) return;
    if (fromView.exit.cells.length !== 1 || toView.entry.cells.length !== 1) return;
    if (fromView.exit.digits.length !== 1 || toView.entry.digits.length !== 1) return;
    if (fromView.exit.cellKey !== toView.entry.cellKey) return;

    const cell = fromView.exit.cells[0];
    const keepDigits = union(fromView.exit.digits, toView.entry.digits);
    if (!keepDigits.includes(weak.digit)) return;
    if (!keepDigits.every(digit => (cand[cell] || []).includes(digit))) return;

    for (const digit of cand[cell] || []) {
      if (!keepDigits.includes(digit)) addElimination(out, cand, digit, [cell], 'ring-local-cell');
    }
  }

  function computeOverlapRingEliminations(cand, fromView, toView) {
    if (fromView.exit.conveyance === 'CELLS' || toView.entry.conveyance === 'CELLS') return null;
    const cells = intersection(fromView.exit.cells, toView.entry.cells);
    const digits = intersection(fromView.exit.digits, toView.entry.digits);
    if (fromView.exit.cells.length !== 1 || toView.entry.cells.length !== 1) return null;
    if (fromView.exit.digits.length !== 1 || toView.entry.digits.length !== 1) return null;
    if (cells.length !== 1 || digits.length !== 1) return null;

    const out = new Map();
    const keepDigits = new Set(digits);
    if (!digits.every(digit => cells.some(cell => (cand[cell] || []).includes(digit)))) return null;

    for (const cell of cells) {
      for (const digit of cand[cell] || []) {
        if (!keepDigits.has(digit)) addElimination(out, cand, digit, [cell], 'ring-overlap');
      }
    }

    let commonPeers = new Set(core.peersOf(cells[0]));
    for (const cell of cells.slice(1)) {
      const cellPeers = new Set(core.peersOf(cell));
      commonPeers = new Set([...commonPeers].filter(peer => cellPeers.has(peer)));
    }

    for (const peer of commonPeers) {
      if (cells.includes(peer)) continue;
      for (const digit of digits) addElimination(out, cand, digit, [peer], 'ring-overlap');
    }

    return [...out.values()]
      .sort((a, b) => a.cell - b.cell || a.digit - b.digit);
  }

  function evaluateChain(cand, steps, isRing, ringWeak = null) {
    const out = new Map();
    const boundary = new Map();
    const first = steps[0].view;
    const terminal = steps[steps.length - 1].view;

    if (steps.length === 1) {
      if (isRing && steps[0].view.node.raw.moduleKind === 'ALS_XZ') {
        computeModularRingEliminations(cand, steps[0].view, out);
      } else {
        for (const item of steps[0].view.node.raw.intrinsicEliminations || []) {
          addElimination(out, cand, item.digit, [item.cell], 'als-xz');
        }
      }
    }

    // Every weak junction exposes a smaller chain between the two
    // non-connected edges. Keep those eliminations as the path grows instead
    // of waiting until only the outermost pair is evaluated.
    const junctionCount = isRing ? steps.length : steps.length - 1;
    for (let index = 0; index < junctionCount; index++) {
      const left = steps[index].view;
      const right = steps[(index + 1) % steps.length].view;
      computeType1(cand, left, right, out);
      computeType2(cand, left, right, out);
    }

    if (!isRing) {
      computeType1(cand, first, terminal, boundary);
      computeType2(cand, first, terminal, boundary);
      for (const item of boundary.values()) {
        for (const reason of item.reasons) {
          addElimination(out, cand, item.digit, [item.cell], reason);
        }
      }
    }

    if (isRing && !(steps.length === 1 && steps[0].view.node.raw.moduleKind === 'ALS_XZ')) {
      const evenRing = ringWeak !== null && steps.length % 2 === 0;
      for (let index = 0; index < steps.length; index++) {
        const left = steps[index].view;
        const nextIndex = (index + 1) % steps.length;
        const right = steps[nextIndex].view;
        const weak = index + 1 < steps.length
          ? directConnection(left, right)
          : ringWeak;
        computeLockedWeak(cand, left, right, weak, out);
        if (evenRing) computeEvenRingCellularWeak(cand, left, right, weak, out);
      }

      for (let leftIndex = 0; leftIndex < steps.length; leftIndex++) {
        const left = steps[leftIndex].view;
        for (let rightIndex = leftIndex + 1; rightIndex < steps.length; rightIndex++) {
          const right = steps[rightIndex].view;
          computeSameCellRing(cand, left.entry, right.entry, out);
          computeSameCellRing(cand, left.exit, right.exit, out);
          computeSameCellRing(cand, left.entry, right.exit, out);
          computeSameCellRing(cand, left.exit, right.entry, out);
        }
      }
    }

    return {
      eliminations: [...out.values()]
        .sort((a, b) => a.cell - b.cell || a.digit - b.digit),
      boundaryEliminations: [...boundary.values()]
        .sort((a, b) => a.cell - b.cell || a.digit - b.digit),
    };
  }

  function mergeEliminations(previous, additions) {
    const merged = new Map();
    for (const item of [...previous, ...additions]) {
      const key = `${item.cell}:${item.digit}`;
      const existing = merged.get(key);
      if (existing) {
        existing.reasons = [...new Set([...existing.reasons, ...(item.reasons || [])])];
      } else {
        merged.set(key, { ...item, reasons: [...(item.reasons || [])] });
      }
    }
    return [...merged.values()]
      .sort((a, b) => a.cell - b.cell || a.digit - b.digit);
  }

  function hasOpenTriggerEliminations(evaluation) {
    return evaluation.eliminations.some(item =>
      item.reasons.some(reason => reason === 'type1' || reason === 'type2'));
  }

  function publicSide(side) {
    return {
      side: side.name,
      conveyance: side.conveyance,
      cells: [...side.cells],
      digits: [...side.digits],
      rccCells: [...side.rccCells],
      sectorsByDigit: Object.fromEntries(
        Object.entries(side.sectorsByDigit).map(([digit, sectors]) => [digit, [...sectors]]),
      ),
      potentialElimByDigit: Object.fromEntries(
        Object.entries(side.potentialElimByDigit).map(([digit, cells]) => [digit, [...cells]]),
      ),
      swapDigits: [...side.swapDigits],
    };
  }

  function publicStep(step) {
    const module = orientedModule(step.view);
    return {
      family: step.view.node.family,
      linkId: step.view.node.id,
      graphId: step.view.node.graphId,
      linkType: step.view.node.linkType,
      linkTypeName: step.view.node.linkTypeName,
      linkTypeNames: [...step.view.node.linkTypeNames],
      originSectors: [...step.view.node.originSector],
      moduleLabel: moduleLabelForView(step.view, module),
      module,
      direction: step.view.direction,
      entrySide: step.view.entry.name,
      exitSide: step.view.exit.name,
      entry: publicSide(step.view.entry),
      exit: publicSide(step.view.exit),
      weakIn: step.weakIn,
      weakInName: step.weakIn == null ? null : WEAK_TYPE_NAMES[step.weakIn],
      weakDigit: step.weakDigit,
      weakFromDigit: step.weakFromDigit ?? step.weakDigit,
      weakToDigit: step.weakToDigit ?? step.weakDigit,
    };
  }

  function chainValueToken(step) {
    return step.family !== 'SL' || step.linkType === 4 || step.linkTypeName === 'ALS'
      ? 'V'
      : 'L';
  }

  function chainValuePattern(steps) {
    return steps.map(chainValueToken).join('');
  }

  function chainDigits(steps) {
    const digits = [];
    for (const step of steps) {
      digits.push(...step.entry.digits, ...step.exit.digits);
      if (step.weakDigit != null) digits.push(step.weakDigit);
    }
    return sortedUnique(digits);
  }

  function orientedOpenSteps(steps) {
    const pattern = chainValuePattern(steps);
    if (!pattern || pattern[0] === 'V' || pattern[pattern.length - 1] !== 'V') return [...steps];

    return [...steps].reverse().map(step => ({
      ...step,
      entrySide: step.exitSide,
      exitSide: step.entrySide,
      entry: { ...step.exit, side: 'left' },
      exit: { ...step.entry, side: 'right' },
    }));
  }

  function normalisedOpenPattern(steps) {
    return chainValuePattern(orientedOpenSteps(steps));
  }

  function originKinds(step) {
    const kinds = new Set();
    for (const sector of step.originSectors || []) {
      kinds.add(sector < 9 ? 'R' : sector < 18 ? 'C' : 'B');
    }
    return kinds;
  }

  function classifyTwoLinkXChain(steps) {
    if (steps.length !== 2 || steps.some(step => chainValueToken(step) !== 'L')) return null;
    if (chainDigits(steps).length !== 1) return null;

    const names = steps.flatMap(step => step.linkTypeNames || [step.linkTypeName]);
    const kinds = steps.map(originKinds);
    const lineKinds = kinds.map(value => value.has('R') ? 'R' : value.has('C') ? 'C' : 'B');
    const hasRow = lineKinds.includes('R');
    const hasCol = lineKinds.includes('C');

    if (names.every(name => name === 'BILOCAL')) {
      if (lineKinds.every(kind => kind === 'R' || kind === 'C')
        && new Set(lineKinds).size === 1) return 'X-Wing';
    }
    if (names.some(name => name === 'ERI')) return 'Empty Rectangle';
    if (hasRow && hasCol) return '2-String Kite';
    return 'X-Chain';
  }

  function ringPatternMatches(pattern, target) {
    if (pattern.length !== target.length) return false;
    const variants = [pattern, [...pattern].reverse().join('')];
    return variants.some(variant => [...variant].some((_, index) =>
      `${variant.slice(index)}${variant.slice(0, index)}` === target,
    ));
  }

  function isBivalveStep(step) {
    return step.family === 'SL'
      && step.linkType === 4
      && step.entry.cellKey === step.exit.cellKey
      && step.entry.cells.length === 1
      && step.exit.cells.length === 1;
  }

  function isAlsRccStep(step) {
    return step.family === 'ALS' && step.linkTypeName === 'ALS_RCC';
  }

  function hasWRingValueNodes(steps) {
    const valueNodes = steps.filter(step => chainValueToken(step) === 'V');
    if (valueNodes.length !== 2) return false;
    if (!valueNodes.every(step => isBivalveStep(step) || isAlsRccStep(step))) return false;
    if (valueNodes.some(isAlsRccStep)) return true;

    const digits = step => sortedUnique([...step.entry.digits, ...step.exit.digits]);
    const left = digits(valueNodes[0]);
    const right = digits(valueNodes[1]);
    return left.length === 2
      && right.length === 2
      && left.every((digit, index) => digit === right[index]);
  }

  function locationLinkDigits(steps) {
    const digits = [];
    for (const step of steps) {
      const shared = intersection(step.entry.digits, step.exit.digits);
      if (shared.length !== 1) return null;
      digits.push(shared[0]);
    }
    return digits;
  }

  function digitShape(digits) {
    const labels = new Map();
    let nextLabel = 0;
    return digits.map(digit => {
      if (!labels.has(digit)) labels.set(digit, String.fromCharCode(65 + nextLabel++));
      return labels.get(digit);
    }).join('');
  }

  function weakLocationPattern(steps) {
    return steps.slice(1).map(step =>
      step.weakIn === LOCAL_WEAK ? 'C' : step.weakIn === SECTOR_WEAK ? 'S' : '?'
    ).join('');
  }

  function invertedWingName(steps) {
    if (![4, 5].includes(steps.length)) return null;
    if (chainValuePattern(steps) !== 'L'.repeat(steps.length)) return null;

    const digits = locationLinkDigits(steps);
    if (!digits) return null;
    const weak = weakLocationPattern(steps);
    const variants = [
      { shape: digitShape(digits), weak },
      { shape: digitShape([...digits].reverse()), weak: [...weak].reverse().join('') },
    ];
    const patterns = [
      ['ABBA', 'CSC', 'iW-Wing'],
      ['AABB', 'SCS', 'iS-Wing'],
      ['ABBC', 'CCC', 'iM3-Wing'],
      ['ABBB', 'CSS', 'iH2-Wing'],
      ['ABBCC', 'CSSC', 'iH3-Wing'],
    ];

    for (const variant of variants) {
      for (const [shape, weakPattern, name] of patterns) {
        if (variant.shape === shape && variant.weak === weakPattern) return name;
      }
    }
    return null;
  }

  function invertedRingName(steps, ringWeakDigit) {
    if (![4, 5].includes(steps.length)) return null;
    if (chainValuePattern(steps) !== 'L'.repeat(steps.length)) return null;

    const digits = locationLinkDigits(steps);
    if (!digits || new Set(digits).size !== 2 || ringWeakDigit == null) return null;
    if (ringWeakDigit !== digits[0] && ringWeakDigit !== digits[digits.length - 1]) return null;

    const weak = weakLocationPattern(steps);
    const allowedWeak = steps.length === 4
      ? new Set(['CSC', 'SCS'])
      : new Set(['SSCS', 'CSCS']);
    if (!allowedWeak.has(weak)) return null;

    const shape = digitShape(digits);
    const reverseShape = digitShape([...digits].reverse());
    const allowedShapes = steps.length === 4
      ? new Set(['ABBA', 'AABB'])
      : new Set(['AAABB', 'AABBB', 'ABBAA', 'AABBA']);
    return allowedShapes.has(shape) || allowedShapes.has(reverseShape) ? 'iW-Ring' : null;
  }

  function structurePrefix(steps) {
    const hasAls = steps.some(step => step.family === 'ALS' && step.linkTypeName === 'ALS_RCC');
    if (!hasAls) return '';
    const hasNonAls = steps.some(step =>
      step.family !== 'ALS' || step.linkTypeName !== 'ALS_RCC'
    );
    if (hasNonAls) return 'AIC + ALS';
    return 'ALS';
  }

  function alsOnlyStructureName(steps) {
    if (!steps.length || !steps.every(step =>
      step.family === 'ALS'
      && step.linkTypeName === 'ALS_RCC'
      && step.module
    )) return null;

    const seen = new Set();
    let nodeCount = 0;
    for (const step of steps) {
      for (const subset of [step.module.entrySubset, step.module.exitSubset]) {
        if (!subset) return null;
        const key = [
          subset.id ?? '',
          subset.cells.join(','),
          subset.digits.join(''),
        ].join('|');
        if (!seen.has(key)) {
          seen.add(key);
          nodeCount += 1;
        }
      }
    }

    if (nodeCount === 2) return 'ALS - XZ';
    if (nodeCount === 3) return 'ALS - XY';
    return nodeCount > 3 ? 'ALS - Chain' : null;
  }

  function prefixedStructureName(name, steps) {
    const prefix = structurePrefix(steps);
    return prefix ? `${prefix} - ${name}` : name;
  }

  function isAlsSplitWing(steps) {
    if (steps.length !== 3) return false;
    const isStrong = step => step.family === 'SL'
      && step.linkType !== 4
      && step.linkTypeName !== 'ALS';
    return isStrong(steps[0])
      && steps[1].family === 'ALS'
      && steps[1].linkTypeName === 'ALS_RCC'
      && isStrong(steps[2]);
  }

  function isBivalveSplitWing(steps) {
    if (steps.length !== 3) return false;
    const isStrong = step => step.family === 'SL'
      && step.linkType !== 4
      && step.linkTypeName !== 'ALS';
    return isStrong(steps[0])
      && isBivalveStep(steps[1])
      && isStrong(steps[2]);
  }

  function isSplitWingRing(steps) {
    if (steps.length !== 3 || !ringPatternMatches(chainValuePattern(steps), 'LVL')) {
      return false;
    }
    const valueSteps = steps.filter(step => chainValueToken(step) === 'V');
    return valueSteps.length === 1
      && (isBivalveStep(valueSteps[0]) || isAlsRccStep(valueSteps[0]));
  }

  function classifyChain(steps, isRing, ringWeakDigit = null) {
    const alsStructureName = alsOnlyStructureName(steps);
    if (alsStructureName) return alsStructureName;

    const digits = chainDigits(steps);
    const groupedPrefix = structurePrefix(steps);

    if (isRing) {
      const pattern = chainValuePattern(steps);
      const invertedRing = invertedRingName(steps, ringWeakDigit);
      if (invertedRing) return prefixedStructureName(invertedRing, steps);
      if (ringPatternMatches(pattern, 'LVL') && isSplitWingRing(steps)) {
        return prefixedStructureName('M(2)-Ring', steps);
      }
      if (ringPatternMatches(pattern, 'VVVVL')) return prefixedStructureName('Y-Ring', steps);
      if (ringPatternMatches(pattern, 'VLVLL')) return prefixedStructureName('W-Ring', steps);
      if (ringPatternMatches(pattern, 'VVLL')) return prefixedStructureName('H(2)-Ring', steps);
      if (ringPatternMatches(pattern, 'VLL')) return prefixedStructureName('M(2)-Ring', steps);
      if (ringPatternMatches(pattern, 'VLLL')) return prefixedStructureName('M(2)-Ring', steps);
      if (ringPatternMatches(pattern, 'LVLV') && hasWRingValueNodes(steps)) {
        return prefixedStructureName('W-Ring', steps);
      }
      if (ringPatternMatches(pattern, 'LLLLV')) return prefixedStructureName('Strong-Ring', steps);
      if (pattern && pattern.split('').every(token => token === 'L')) {
      return prefixedStructureName(`L(${Math.max(1, digits.length)})-Ring`, steps);
      }
      return groupedPrefix ? `${groupedPrefix} - Ring` : 'AIC Ring';
    }

    const pattern = normalisedOpenPattern(steps);
    const simpleName = classifyTwoLinkXChain(steps);
    if (simpleName) return prefixedStructureName(simpleName, steps);
    const invertedWing = invertedWingName(steps);
    if (invertedWing) return prefixedStructureName(invertedWing, steps);
    if (pattern === 'VVV' && digits.length === 3) return prefixedStructureName('XY-Wing', steps);
    if (pattern === 'VLV' && digits.length === 2) return prefixedStructureName('W-Wing', steps);
    if (pattern === 'VLLVLL') return prefixedStructureName('Transport', steps);
    if (pattern === 'LVL' && (isBivalveSplitWing(steps) || isAlsSplitWing(steps))) {
      return prefixedStructureName('S-Wing', steps);
    }
    if (pattern === 'VVL' && digits.length >= 2) {
      return prefixedStructureName(`H(${Math.min(3, digits.length)})-Wing`, steps);
    }
    if (pattern === 'VLL') {
      const oriented = orientedOpenSteps(steps);
      const shared = intersection(oriented[0].exit.digits, oriented[1].entry.digits)[0];
      const last = oriented[oriented.length - 1];
      const lastDigits = intersection(last.entry.digits, last.exit.digits);
      if (digits.length <= 2 && shared != null && lastDigits.includes(shared)) {
        return prefixedStructureName('H(1)-Wing', steps);
      }
      return prefixedStructureName(`M(${Math.min(3, Math.max(2, digits.length))})-Wing`, steps);
    }
    if (pattern === 'LLL') {
      return prefixedStructureName(`L(${Math.min(3, Math.max(1, digits.length))})-Wing`, steps);
    }
    if (pattern.split('').every(token => token === 'V') && steps.length >= 3) {
      return prefixedStructureName('XY-Chain', steps);
    }
    return groupedPrefix || 'AIC';
  }

  function openPathKey(steps, reverse) {
    const parts = [];

    if (!reverse) {
      parts.push(viewSemanticKey(steps[0].view));
      for (let index = 1; index < steps.length; index++) {
        parts.push(stepWeakKey(steps[index]));
        parts.push(viewSemanticKey(steps[index].view));
      }
    } else {
      parts.push(viewSemanticKey(steps[steps.length - 1].view, true));
      for (let index = steps.length - 1; index > 0; index--) {
        parts.push(stepWeakKey(steps[index]));
        parts.push(viewSemanticKey(steps[index - 1].view, true));
      }
    }

    return parts.join('-');
  }

  function openEndpointKey(steps) {
    const first = sideKey(steps[0].view.entry);
    const last = sideKey(steps[steps.length - 1].view.exit);
    const forward = `${first}>${last}`;
    const reversed = `${last}>${first}`;
    return forward <= reversed ? forward : reversed;
  }

  function ringEdgeKeys(steps, ringWeak) {
    const edges = [];
    for (let index = 1; index < steps.length; index++) {
      edges[index - 1] = stepWeakKey(steps[index]);
    }
    edges[steps.length - 1] = connectionWeakKey(ringWeak);
    return edges;
  }

  function ringRotationKey(steps, edgeKeys, startIndex, reverse) {
    const parts = [];
    const count = steps.length;
    let index = startIndex;

    for (let offset = 0; offset < count; offset++) {
      parts.push(viewSemanticKey(steps[index].view, reverse));

      if (reverse) {
        const previous = (index - 1 + count) % count;
        parts.push(edgeKeys[previous]);
        index = previous;
      } else {
        parts.push(edgeKeys[index]);
        index = (index + 1) % count;
      }
    }

    return parts.join('-');
  }

  function ringPathKey(steps, ringWeak) {
    const edgeKeys = ringEdgeKeys(steps, ringWeak);
    let best = null;

    for (let index = 0; index < steps.length; index++) {
      const forward = ringRotationKey(steps, edgeKeys, index, false);
      const reversed = ringRotationKey(steps, edgeKeys, index, true);

      if (best === null || forward < best) best = forward;
      if (reversed < best) best = reversed;
    }

    return best || '';
  }

  function canonicalPathKey(steps, isRing, ringWeak = null) {
    if (isRing) return `ring:${ringPathKey(steps, ringWeak)}`;

    const open = openPathKey(steps, false);
    const reversed = openPathKey(steps, true);
    const base = open <= reversed ? open : reversed;
    return `open:${base}`;
  }

  function canonicalReportKey(steps, isRing, ringWeak = null) {
    return canonicalPathKey(steps, isRing, ringWeak);
  }

  function eliminationsKey(eliminations) {
    return eliminations
      .map(item => `${item.digit}:${item.cell}`)
      .join(';');
  }

  function terminalEriStructureName(steps, ringWeak, ringOverlapElims) {
    if ((ringWeak === null && ringOverlapElims === null) || steps.length !== 3) return null;
    const nodes = steps.map(step => step.view?.node || step);
    if (!nodes.every(node => node.family === 'SL')) return null;

    const isEriStep = node => node.linkType === core.ERI
      || node.linkTypeName === 'ERI'
      || (node.linkTypeNames || []).includes('ERI');
    const eriCount = nodes.filter(isEriStep).length;
    if (eriCount !== 1) return null;

    const outside = nodes.filter(node => !isEriStep(node));
    if (outside.length !== 2) return null;
    const bilocalCount = outside.filter(step => step.linkType === core.BILOCAL).length;
    const cellToGroupCount = outside.filter(step => step.linkType === core.CELL_TO_GROUP).length;

    // Type 0 is a bilocal: type 0 - ERI - type 0 is the Dual Empty
    // Rectangle. A type 1 link on either outside edge makes the ERI
    // subclass a Rec'T Kite instead.
    if (bilocalCount === 2) return 'Dual Empty Rectangle';
    if (cellToGroupCount > 0 && bilocalCount + cellToGroupCount === 2) {
      return "Rec'T Kite";
    }
    return null;
  }

  function addChainResult(
    chainsByKey,
    steps,
    eliminations,
    isRing,
    ringWeak,
    ringClosureName = null,
    ringClosureDigit = null,
    isTerminal = false,
    terminalStructureName = null,
  ) {
    if (!eliminations.length) return 'empty';
    const key = `${canonicalReportKey(steps, isRing, ringWeak)}|${eliminationsKey(eliminations)}`;
    const rankKey = `${String(logicalDepth(steps)).padStart(3, '0')}|${canonicalPathKey(steps, isRing, ringWeak)}`;
    const publicSteps = steps.map(publicStep);
    const publicIsRing = isRing && !isTerminal;
    const structureName = terminalStructureName
      || classifyChain(publicSteps, publicIsRing, ringWeak?.digit ?? null);
    const terminalFamily = terminalStructureName ? 'Local - Wing | Ring' : null;
    const terminalWing = terminalStructureName ? (isRing ? 'Ring' : 'Wing') : null;
    const terminalRank = terminalStructureName ? 'L(1)' : null;
    const publicClosureName = isTerminal
      ? null
      : ringClosureName || (ringWeak ? WEAK_TYPE_NAMES[ringWeak.weakType] : null);
    const existing = chainsByKey.get(key);

    if (existing) {
      if (rankKey < existing.rankKey) {
        chainsByKey.set(key, {
          rankKey,
          chain: {
            length: logicalDepth(steps),
            structureName,
            structureFamily: terminalFamily,
            structureWing: terminalWing,
            structureRank: terminalRank,
            structureSubclass: terminalStructureName,
            isRing: publicIsRing,
            isTerminal,
            ringWeakType: ringWeak?.weakType ?? null,
            ringWeakTypeName: ringWeak ? WEAK_TYPE_NAMES[ringWeak.weakType] : null,
            ringWeakDigit: ringWeak?.digit ?? null,
            ringWeakFromDigit: ringWeak?.fromDigit ?? ringWeak?.digit ?? null,
            ringWeakToDigit: ringWeak?.toDigit ?? ringWeak?.digit ?? null,
            ringClosureName: publicClosureName,
            ringClosureDigit,
            eliminations,
            steps: publicSteps,
          },
        });
        return 'replaced';
      }

      return 'duplicate';
    }

    chainsByKey.set(key, {
      rankKey,
      chain: {
        length: logicalDepth(steps),
        structureName,
        structureFamily: terminalFamily,
        structureWing: terminalWing,
        structureRank: terminalRank,
        structureSubclass: terminalStructureName,
        isRing: publicIsRing,
        isTerminal,
        ringWeakType: ringWeak?.weakType ?? null,
        ringWeakTypeName: ringWeak ? WEAK_TYPE_NAMES[ringWeak.weakType] : null,
        ringWeakDigit: ringWeak?.digit ?? null,
        ringWeakFromDigit: ringWeak?.fromDigit ?? ringWeak?.digit ?? null,
        ringWeakToDigit: ringWeak?.toDigit ?? ringWeak?.digit ?? null,
        ringClosureName: publicClosureName,
        ringClosureDigit,
        eliminations,
        steps: publicSteps,
      },
    });
    return 'added';
  }

  function normaliseOptions(options) {
    return {
      includeStrong: options.includeStrong ?? true,
      includeAls: options.includeAls ?? true,
      strictAlsSingleCommon: options.strictAlsSingleCommon ?? true,
      strongLinkTypes: [...new Set(
        (options.strongLinkTypes ?? [0, 1, 2, 3, 4])
          .filter(type => Number.isInteger(type) && type >= 0 && type <= 4),
      )].sort((a, b) => a - b),
      maxAlsLinks: Number.isInteger(options.maxAlsLinks) ? options.maxAlsLinks : 5000,
      maxDepth: Number.isInteger(options.maxDepth) ? Math.max(1, options.maxDepth) : 6,
      maxChains: Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains) : 200,
      maxResultAttempts: Number.isInteger(options.maxResultAttempts)
        ? Math.max(1, options.maxResultAttempts)
        : Math.max(1000, (Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains) : 200) * 50),
      maxResultAttemptsPerStart: Number.isInteger(options.maxResultAttemptsPerStart)
        ? Math.max(1, options.maxResultAttemptsPerStart)
        : Math.max(100, Math.floor((Number.isInteger(options.maxResultAttempts)
          ? Math.max(1, options.maxResultAttempts)
          : Math.max(1000, (Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains) : 200) * 50)) / 20)),
      maxStates: Number.isInteger(options.maxStates) ? Math.max(100, options.maxStates) : 30000,
      maxQueue: Number.isInteger(options.maxQueue) ? Math.max(100, options.maxQueue) : 30000,
      maxBranching: Number.isInteger(options.maxBranching) ? Math.max(1, options.maxBranching) : 200,
      maxStartViews: Number.isInteger(options.maxStartViews) ? Math.max(1, options.maxStartViews) : Infinity,
      strongLinkSet: options.strongLinkSet,
      alsLinkSet: options.alsLinkSet,
      alsList: options.alsList,
    };
  }

  function findAicChains(cand, options = {}) {
    const opts = normaliseOptions(options);
    const inventory = buildLinkInventory(cand, opts);
    const graph = buildChainGraph(inventory.links);
    const chainsByKey = new Map();
    const stats = {
      strongLinks: inventory.counts.strong,
      alsLinks: inventory.counts.als,
      graphLinks: inventory.links.length,
      directedViews: graph.views.length,
      startViews: 0,
      statesVisited: 0,
      transitionsChecked: 0,
      transitionsAccepted: 0,
      resultAttempts: 0,
      duplicatesSuppressed: 0,
      startCapsHit: 0,
      chainsFound: 0,
      truncated: false,
      stopReason: null,
    };

    let stop = false;
    const noteResult = outcome => {
      if (outcome === 'duplicate') stats.duplicatesSuppressed += 1;
      stats.chainsFound = chainsByKey.size;

      if (chainsByKey.size >= opts.maxChains) {
        stats.truncated = true;
        stats.stopReason = 'maxChains';
        stop = true;
        return true;
      }

      if (stats.resultAttempts >= opts.maxResultAttempts) {
        stats.truncated = true;
        stats.stopReason = 'maxResultAttempts';
        stop = true;
        return true;
      }

      return false;
    };

    for (const start of graph.views) {
      if (stop) break;
      if (stats.startViews >= opts.maxStartViews) {
        stats.truncated = true;
        stats.stopReason = 'maxStartViews';
        break;
      }
      stats.startViews += 1;

      let startResultAttempts = 0;
      let skipStart = false;
      const noteStartResult = outcome => {
        if (noteResult(outcome)) return true;

        if (startResultAttempts >= opts.maxResultAttemptsPerStart) {
          stats.startCapsHit += 1;
          skipStart = true;
          return true;
        }

        return false;
      };

      const root = {
        view: start,
        steps: [{ view: start, weakIn: null, weakDigit: null }],
        visited: new Set([start.node.graphId]),
        usedAtoms: withViewAtoms(new Set(), start),
        eliminations: [],
      };
      const startAtoms = new Set(viewAtoms(start));

      const queue = [root];

      const rootBridgeWeak = modularRingWeak(root.view);
      const rootClosureDigit = rootBridgeWeak ? modularRingClosureDigit(cand, root.view, inventory.links) : null;
      const rootRingWeak = rootClosureDigit == null
        ? rootBridgeWeak
        : modularRingClosureWeak(root.view, rootClosureDigit);
      // maxDepth is inclusive: keep a valid root result when a deeper search
      // is requested, including the logical-depth-2 ALS-XZ root.
      if (logicalDepth(root.steps) <= opts.maxDepth
        && root.view.node.raw.intrinsicEliminations?.length) {
        const rootIsRing = rootBridgeWeak !== null && rootClosureDigit !== null;
        const rootEvaluation = evaluateChain(cand, root.steps, rootIsRing, rootRingWeak);
        if (rootEvaluation.eliminations.length) {
          stats.resultAttempts += 1;
          startResultAttempts += 1;
          if (noteStartResult(addChainResult(
            chainsByKey,
            root.steps,
            rootEvaluation.eliminations,
            rootIsRing,
            rootRingWeak,
            null,
            rootIsRing ? rootClosureDigit : null,
          ))) break;
        }
      }

      while (queue.length && !stop && !skipStart) {
        if (stats.statesVisited >= opts.maxStates) {
          stats.truncated = true;
          stats.stopReason = 'maxStates';
          stop = true;
          break;
        }

        const current = queue.shift();
        stats.statesVisited += 1;
        const currentDepth = logicalDepth(current.steps);
        if (currentDepth >= opts.maxDepth) continue;

        for (const edge of expandFrom(current.view, graph, stats, opts)) {
          if (current.visited.has(edge.target.node.graphId)) continue;

          const ringWeak = directConnection(edge.target, start);
          const ringOverlapElims = !ringWeak && current.steps.length + 1 > 2
            ? computeOverlapRingEliminations(cand, edge.target, start)
            : null;
          const sameCellClosure = ringWeak?.weakType === LOCAL_WEAK
            && edge.target.exit.cells.length === 1
            && start.entry.cells.length === 1
            && edge.target.exit.cellKey === start.entry.cellKey;
          const sharedKnownAtoms = viewAtoms(edge.target)
            .filter(atom => current.usedAtoms.has(atom));
          const reusesNonStartAtom = sharedKnownAtoms.some(atom => !startAtoms.has(atom));
          const closesToStart = ringWeak || ringOverlapElims !== null;
          if (reusesNonStartAtom || (sharedKnownAtoms.length && !closesToStart)) continue;

          stats.transitionsAccepted += 1;
          const nextSteps = [
            ...current.steps,
            {
              view: edge.target,
              weakIn: edge.weakType,
              weakDigit: edge.digit,
              weakFromDigit: edge.fromDigit ?? edge.digit,
              weakToDigit: edge.toDigit ?? edge.digit,
            },
          ];
          const nextDepth = logicalDepth(nextSteps);
          if (nextDepth > opts.maxDepth) continue;
          const openEvaluation = evaluateChain(cand, nextSteps, false);
          const openElims = mergeEliminations(current.eliminations, openEvaluation.eliminations);
          const terminalClosure = sameCellClosure || ringOverlapElims !== null;
          const terminalStructureName = ringWeak || terminalClosure
            ? terminalEriStructureName(nextSteps, ringWeak, ringOverlapElims)
            : null;
          // A recognized terminal ERI path owns the report. Do not also emit
          // its open-chain prefix under the generic L1-Wing name.
          const preferTerminal = terminalStructureName !== null;
          // An open chain is reportable when this evaluation produced a real
          // T1/T2 trigger anywhere along the path. The trigger may be internal
          // and may already be present in the cumulative elimination set.
          if (!preferTerminal && hasOpenTriggerEliminations(openEvaluation)) {
            stats.resultAttempts += 1;
            startResultAttempts += 1;
            if (noteStartResult(addChainResult(chainsByKey, nextSteps, openElims, false, null))) break;
          }

          // Two link modules are enough for a closed ring: the final module
          // connects back to the starting module's entry side.
          if (ringWeak || ringOverlapElims !== null) {
            // A same-cell terminal closure is not a full ring. Preserve the
            // open chain's cumulative triggers and add only the closure-cell
            // overlap effects; full ring propagation belongs to true rings.
            const ringElims = terminalClosure
              ? mergeEliminations(openElims, ringOverlapElims || [])
              : mergeEliminations(
                evaluateChain(cand, nextSteps, true, ringWeak).eliminations,
                ringOverlapElims || [],
              );
            // Ring reporting is structural: a ring must have eliminations, but
            // they do not all need to be new relative to the open accumulator.
            if (ringElims.length) {
              stats.resultAttempts += 1;
              startResultAttempts += 1;
              const closureName = ringWeak ? null : 'OVERLAP';
              if (noteStartResult(addChainResult(
                chainsByKey,
                nextSteps,
                ringElims,
                true,
                ringWeak,
                closureName,
                null,
                terminalClosure,
                terminalStructureName,
              ))) break;
            }
          }

          // A same-cell closure is terminal. Do not continue walking after
          // reusing an atom from the starting link.
          if (sharedKnownAtoms.length && closesToStart) continue;

          if (nextDepth < opts.maxDepth) {
            if (queue.length >= opts.maxQueue) {
              stats.truncated = true;
              stats.stopReason = 'maxQueue';
              stop = true;
              break;
            }

            const visited = new Set(current.visited);
            visited.add(edge.target.node.graphId);
            queue.push({
              view: edge.target,
              steps: nextSteps,
              visited,
              usedAtoms: withViewAtoms(current.usedAtoms, edge.target),
              eliminations: openElims,
            });
          }
        }
      }
    }

    const chains = [...chainsByKey.values()]
      .sort((a, b) =>
        a.chain.length - b.chain.length
        || a.chain.eliminations.length - b.chain.eliminations.length
        || a.rankKey.localeCompare(b.rankKey)
      )
      .map(entry => entry.chain);
    stats.chainsFound = chains.length;

    return {
      chains,
      stats,
      linkSets: inventory.source,
    };
  }

  function sideLabel(side) {
    const digits = side.digits.length ? side.digits.join('') : '?';
    const cells = side.cells.length ? core.cellGroupName(side.cells) : 'none';
    return `(${digits}) ${cells}`;
  }

  function endpointSideName(step, side) {
    if (step.family === 'ALS' && step.linkTypeName.endsWith('_RCC')) {
      return side.side === 'left' ? 'RCC_L' : 'RCC_R';
    }
    return side.side;
  }

  function endpointLabel(step, side) {
    return `${endpointSideName(step, side)} ${sideLabel(side)}`;
  }

  function stepLabel(step) {
    const module = step.moduleLabel ? ` [${step.moduleLabel}]` : '';
    return `${step.family}#${step.linkId} ${step.direction} ${step.linkTypeName}${module} `
      + `${endpointLabel(step, step.entry)} -> ${endpointLabel(step, step.exit)}`;
  }

  function formatChainVerbose(chain) {
    const parts = [];
    for (let index = 0; index < chain.steps.length; index++) {
      const step = chain.steps[index];
      if (index > 0) {
        const weak = step.weakDigit
          ? `${step.weakInName} d${step.weakDigit}`
          : step.weakInName;
        parts.push(`--${weak}--`);
      }
      parts.push(stepLabel(step));
    }

    if (chain.isRing) {
      const weak = chain.ringWeakDigit
        ? `${chain.ringWeakTypeName} d${chain.ringWeakDigit}`
        : chain.ringClosureName;
      if (weak) parts.push(`--${weak} ring--`);
    }

    return `${chain.structureName} ${chain.length}: `
      + `${parts.join(' ')} => ${core.formatRemovals(chain.eliminations)}`;
  }

  function eurekaSideText(side) {
    const digits = eurekaDigitsText(side.digits);
    const cells = side.cells.length ? core.cellGroupName(side.cells) : 'none';
    return `(${digits})${cells}`;
  }

  function eurekaDigitsText(digits) {
    return digits && digits.length ? digits.join('') : '?';
  }

  function eurekaUnitText(unit) {
    return unit.text || eurekaSideText(unit.side);
  }

  function sameEurekaLocation(left, right) {
    return left.cells.length > 0
      && left.cells.length === right.cells.length
      && cellsKey(left.cells) === cellsKey(right.cells);
  }

  function sameEurekaUnitLocation(left, right) {
    return left.side && right.side && sameEurekaLocation(left.side, right.side);
  }

  function rccSubsetEurekaUnits(step) {
    const module = step.module;
    if (step.family !== 'ALS' || !step.linkTypeName.endsWith('_RCC') || !module?.common) return null;

    const entrySubset = module.entrySideSubset
      || module.entrySideLs
      || module.entrySubset
      || module.entryLs;
    const exitSubset = module.exitSideSubset
      || module.exitSideLs
      || module.exitSubset
      || module.exitLs;
    if (!entrySubset || !exitSubset) return null;

    if (module.moduleKind === 'ALS_XZ') {
      const bridgeRcc = module.displayRightRcc;
      if (bridgeRcc == null) return null;
      return [
        {
          text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== bridgeRcc))}=${eurekaDigitsText([bridgeRcc])})${core.cellGroupName(entrySubset.cells)}`,
        },
        {
          text: `(${eurekaDigitsText([bridgeRcc])}=${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== bridgeRcc))})${core.cellGroupName(exitSubset.cells)}`,
        },
      ];
    }

    const commonDigits = asNumbers(module.common.digits);
    const restrictedDigits = module.common.restrictedDigits?.length
      ? asNumbers(module.common.restrictedDigits)
      : commonDigits;
    const restrictedSet = new Set(restrictedDigits);
    const exitDigits = asNumbers(exitSubset.digits);
    const exitRemainder = sortedUnique(exitDigits.filter(digit => !restrictedSet.has(digit)));

    return [
      {
        text: `(${eurekaDigitsText(commonDigits)}=${eurekaDigitsText(step.entry.digits)})${core.cellGroupName(entrySubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText(restrictedDigits)}=${eurekaDigitsText(exitRemainder)})${core.cellGroupName(exitSubset.cells)}`,
      },
    ];
  }

  function compactEurekaUnits(nodes, connectors) {
    const units = [];

    for (let index = 0; index < nodes.length; index++) {
      const unit = nodes[index];
      const next = nodes[index + 1];

      if (next && sameEurekaUnitLocation(unit, next)) {
        const side = unit.side;
        const leftDigits = eurekaDigitsText(side.digits);
        const rightDigits = eurekaDigitsText(next.side.digits);
        units.push({
          text: `(${leftDigits}${connectors[index]}${rightDigits})${core.cellGroupName(side.cells)}`,
          endIndex: index + 1,
        });
        index += 1;
      } else {
        units.push({ text: eurekaUnitText(unit), endIndex: index });
      }
    }

    return units;
  }

  function pushEurekaUnit(nodes, connectors, unit, connectorBefore = null) {
    if (nodes.length && connectorBefore) connectors.push(connectorBefore);
    nodes.push(unit);
  }

  function appendStepEureka(nodes, connectors, step, index) {
    const expandedSubset = rccSubsetEurekaUnits(step);
    const weakConnector = index === 0 ? null : '-';

    if (expandedSubset) {
      pushEurekaUnit(nodes, connectors, expandedSubset[0], weakConnector);
      pushEurekaUnit(nodes, connectors, expandedSubset[1], '-');
      return;
    }

    pushEurekaUnit(nodes, connectors, { side: step.entry }, weakConnector);
    pushEurekaUnit(nodes, connectors, { side: step.exit }, '=');
  }

  function modularRingEurekaUnits(step, closureDigit) {
    const module = step.module;
    if (step.family !== 'ALS' || !module || module.moduleKind !== 'ALS_XZ') return null;

    const entrySubset = module.entrySideSubset;
    const exitSubset = module.exitSideSubset;
    const endpointRcc = module.displayLeftRcc;
    const bridgeDigit = module.displayRightRcc;
    if (!entrySubset || !exitSubset || endpointRcc == null || bridgeDigit == null) return null;

    const closureDigits = intersection(entrySubset.digits, exitSubset.digits)
      .filter(digit => digit !== endpointRcc && digit !== bridgeDigit);
    if (closureDigit === endpointRcc) {
      return [
        {
          text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== bridgeDigit))}=${eurekaDigitsText([bridgeDigit])})${core.cellGroupName(entrySubset.cells)}`,
        },
        {
          text: `(${eurekaDigitsText([bridgeDigit])}=${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== bridgeDigit))})${core.cellGroupName(exitSubset.cells)}`,
        },
        {
          text: `(${eurekaDigitsText([closureDigit])}=${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== closureDigit))})${core.cellGroupName(entrySubset.cells)}`,
        },
      ];
    }
    if (closureDigit == null || closureDigits.length !== 1 || closureDigits[0] !== closureDigit) return null;

    return [
      {
        text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== endpointRcc))}=${eurekaDigitsText([endpointRcc])})${core.cellGroupName(entrySubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText([endpointRcc])})(${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== endpointRcc))})${core.cellGroupName(exitSubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText([closureDigit])}=${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== closureDigit))})${core.cellGroupName(entrySubset.cells)}`,
      },
    ];
  }

  function eurekaConnectorText(connector) {
    return connector === '-' ? ' - ' : connector;
  }

  function formatChainEureka(chain) {
    const nodes = [];
    const connectors = [];
    const ringMarker = chain.isRing && chain.steps.length > 0;
    const modularRing = chain.isRing && chain.steps.length === 1
      ? modularRingEurekaUnits(chain.steps[0], chain.ringClosureDigit)
      : null;

    if (modularRing) {
      pushEurekaUnit(nodes, connectors, modularRing[0]);
      pushEurekaUnit(nodes, connectors, modularRing[1], '-');
      pushEurekaUnit(nodes, connectors, modularRing[2], '-');
    } else {
      for (let index = 0; index < chain.steps.length; index++) {
        appendStepEureka(nodes, connectors, chain.steps[index], index);
      }
    }

    const units = compactEurekaUnits(nodes, connectors);
    const body = units.map((unit, index) => {
      const connector = index < units.length - 1 ? connectors[unit.endIndex] : '';
      return unit.text + eurekaConnectorText(connector);
    }).join('');

    const closureMarker = ringMarker ? ' - ring' : '';
    return `${chain.structureName}: ${body}${closureMarker} => ${core.formatRemovals(chain.eliminations)}`;
  }

  core.LOCAL_WEAK = LOCAL_WEAK;
  core.SECTOR_WEAK = SECTOR_WEAK;
  core.WEAK_TYPE_NAMES = WEAK_TYPE_NAMES;
  core.buildChainGraph = buildChainGraph;
  core.findAicChains = findAicChains;
  core.findChains = findAicChains;
  core.formatChainVerbose = formatChainVerbose;
  core.formatChainEureka = formatChainEureka;
  core.formatChain = formatChainEureka;
})(globalThis);
