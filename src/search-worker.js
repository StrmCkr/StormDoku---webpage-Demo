/* StormDoku search worker.
 *
 * This file has no DOM responsibilities. It loads the same solver cores as
 * the page and returns structured-cloneable search results to the UI thread.
 */
importScripts(
  './browser-core.js?v=20260929-1',
  './set-tools-core.js?v=20260928-1',
  './pom-core.js?v=20260928-2',
  './als-core.js?v=20260928-1',
  './als-dof-core.js?v=20260928-1',
  './als-link-core.js?v=20260928-1',
  './ahs-core.js?v=20260928-2',
  './ahs-link-core.js?v=20260929-12',
  './subset-report-core.js?v=20260928-2',
  './mini-sectors-core.js?v=20260928-1',
  './strong-link-core.js?v=20260928-1',
  './chain-core.js?v=20260929-8',
  './ahs-xy-core.js?v=20260929-3',
  './ahs-dof-core.js?v=20260929-2',
);

const core = globalThis.StormDoku;
const cancelled = new Set();
let chainInventoryCache = null;

function candidateGridKey(candidateGrid) {
  return (candidateGrid || []).map(cell => (cell || []).join('')).join('/');
}

function chainInventory(payload) {
  const candidateGrid = payload.candidateGrid || [];
  const inventoryKey = [
    candidateGridKey(candidateGrid),
    payload.includeStrong !== false,
    Boolean(payload.includeAls),
    payload.alsMaxSizeDOF ?? '',
    payload.alsMaxSizeFox ?? '',
    payload.alsSearchLimit === true,
    payload.includeAhs === true,
    payload.ahsMaxDof ?? '',
    payload.ahsMaxLinks ?? '',
    payload.ahsMode || 'all',
    payload.ahsSearchLimit === true,
    payload.ahsMaxSize ?? '',
    payload.ahsMaxCells ?? '',
    payload.ahsMaxFox ?? '',
    payload.ahsMaxNodes ?? '',
    (payload.alsCellCounts || []).join(','),
  ].join('::');

  if (!chainInventoryCache || chainInventoryCache.key !== inventoryKey) {
    chainInventoryCache = {
      key: inventoryKey,
      strongSet: payload.includeStrong === false ? [] : core.buildStrongLinks(candidateGrid),
      alsList: payload.includeAls
        ? core.alsConstructor(candidateGrid, {
            ...(Number.isInteger(payload.alsMaxSizeDOF)
              ? { maxSizeDOF: payload.alsMaxSizeDOF }
              : {}),
            ...(Number.isInteger(payload.alsMaxSizeFox)
              ? { maxSizeFox: payload.alsMaxSizeFox }
              : {}),
            searchLimit: payload.alsSearchLimit === true,
          })
        : null,
      ahsList: payload.includeAhs
        ? core.ahsConstructor(candidateGrid, {
            maxSize: Number.isInteger(payload.ahsMaxSize) ? payload.ahsMaxSize : 8,
            maxSizeFox: Number.isInteger(payload.ahsMaxFox) ? payload.ahsMaxFox : 7,
            searchLimit: payload.ahsSearchLimit === true,
            ...(Number.isInteger(payload.ahsMaxNodes) && payload.ahsMaxNodes > 0
              ? { maxResults: payload.ahsMaxNodes }
              : {}),
          }).filter(ahs => payload.ahsMaxCells == null
            || (ahs.ahsAllCells || []).length <= Number(payload.ahsMaxCells))
        : null,
      linkSets: new Map(),
    };
  }

  if (!payload.includeAls && !payload.includeAhs) {
    return {
      strongSet: chainInventoryCache.strongSet,
      alsList: null,
      alsLinkSet: null,
      ahsList: chainInventoryCache.ahsList,
      ahsLinkSet: null,
    };
  }

  const requestedMaxLinks = Number(payload.limits?.maxAlsLinks);
  const maxLinks = Number.isInteger(requestedMaxLinks) && requestedMaxLinks > 0
    ? requestedMaxLinks
    : undefined;
  const requestedMaxDigits = Number(payload.alsMaxDigits);
  const maxDigits = Number.isInteger(requestedMaxDigits) && requestedMaxDigits > 0
    ? requestedMaxDigits
    : null;
  const cellCount = payload.alsCellCount == null ? '*' : payload.alsCellCount;
  const cellCounts = Array.isArray(payload.alsCellCounts)
    ? new Set(payload.alsCellCounts.map(Number))
    : null;
  const linkMode = payload.alsLinkMode || 'all';
  const ahsMaxDof = Number.isInteger(Number(payload.ahsMaxDof))
    ? Math.max(1, Number(payload.ahsMaxDof))
    : 3;
  const ahsMaxLinks = Number.isInteger(Number(payload.ahsMaxLinks))
    ? Math.max(1, Number(payload.ahsMaxLinks))
    : maxLinks;
  const linkKey = `${cellCount}:${[...(cellCounts || [])].join(',')}:${linkMode}:${maxDigits}:${maxLinks}:${payload.includeAhs === true}:${ahsMaxDof}:${ahsMaxLinks}`;
  let cachedLinks = chainInventoryCache.linkSets.get(linkKey);
  if (!cachedLinks) {
    const digitFilter = als => maxDigits == null
      || (als.alsDigits || []).length <= maxDigits;
    const alsList = payload.includeAls
      ? (cellCount === '*' && !cellCounts
        ? chainInventoryCache.alsList.filter(digitFilter)
        : chainInventoryCache.alsList.filter(als => (cellCounts
          ? cellCounts.has((als.alsAllCells || []).length)
          : (als.alsAllCells || []).length === cellCount)
          && digitFilter(als)))
      : null;
    const alsLinkSet = payload.includeAls
      ? core.buildAlsLinks(candidateGrid, {
          alsList,
          strictSingleCommon: true,
          xzOnly: linkMode === 'xz-only',
          maxLinks,
        })
      : null;
    const ahsLinkSet = payload.includeAhs
      ? core.buildAhsLinks(candidateGrid, {
          ahsList: chainInventoryCache.ahsList,
          strongLinkSet: payload.includeStrong === false ? [] : chainInventoryCache.strongSet,
          minDof: 1,
          maxDof: ahsMaxDof,
          mode: payload.ahsMode,
          strictSingleCommon: false,
          maxLinks: ahsMaxLinks,
        })
      : null;
    cachedLinks = { alsList, alsLinkSet, ahsLinkSet };
    chainInventoryCache.linkSets.set(linkKey, cachedLinks);
  }

  return {
    strongSet: chainInventoryCache.strongSet,
    alsList: cachedLinks.alsList,
    alsLinkSet: cachedLinks.alsLinkSet,
    ahsList: chainInventoryCache.ahsList,
    ahsLinkSet: cachedLinks.ahsLinkSet,
  };
}

function reportError(id, error) {
  self.postMessage({
    id,
    error: error instanceof Error ? error.message : String(error),
  });
}

function runSimple(payload) {
  if (payload.subsetOnly) {
    const enabledTechniques = new Set(payload.moveTypes || []);
    return core.subsetOrFishStep(payload.candidateGrid, { enabledTechniques });
  }
  const fishOptions = {
    ...(payload.fishOptions || {}),
    grid: [...(payload.fixedGrid || [])],
    omissionFishSearch: core.omissionFishStep,
    enabledTechniques: new Set(payload.moveTypes || []),
  };
  return core.subsetOrFishStep(payload.candidateGrid, fishOptions);
}

function runFish(payload) {
  return core.findOmissionFishReports(payload.candidateGrid, {
    ...(payload.options || {}),
    grid: [...(payload.fixedGrid || [])],
  });
}

function runChains(payload) {
  const candidateGrid = payload.candidateGrid;
  if (payload.ahsMode === 'xy') {
    return core.findAhsXyChains(candidateGrid, {
      maxSize: payload.ahsMaxSize,
      maxSizeFox: payload.ahsMaxFox,
      maxNodes: payload.ahsMaxNodes,
      maxTriples: payload.maxTriples,
      maxChains: payload.limits?.maxChains,
    });
  }
  const strongLinkTypes = payload.strongLinkTypes || [];
  const includeAls = Boolean(payload.includeAls);
  const limits = payload.limits || {};
  const inventory = chainInventory(payload);
  const strongSet = inventory.strongSet;
  const alsList = includeAls ? inventory.alsList : null;
  const alsLinkSet = includeAls ? inventory.alsLinkSet : null;
  const filteredAlsLinkSet = payload.alsModuleKinds && alsLinkSet
    ? alsLinkSet.map(bucket => bucket.filter(link => payload.alsModuleKinds.includes(link.moduleKind)))
    : alsLinkSet;

  const report = core.findAicChains(candidateGrid, {
    strongLinkSet: strongSet,
    alsList,
    alsLinkSet: filteredAlsLinkSet,
    ahsList: payload.includeAhs ? inventory.ahsList : null,
    ahsLinkSet: payload.includeAhs ? inventory.ahsLinkSet : null,
    includeAls,
    strongLinkTypes,
    maxDepth: payload.maxDepth,
    maxChains: limits.maxChains,
    maxResultAttempts: limits.maxResultAttempts,
    maxResultAttemptsPerStart: limits.maxResultAttemptsPerStart,
    maxStates: limits.maxStates,
    maxQueue: limits.maxQueue,
    maxBranching: limits.maxBranching,
    maxStartViews: limits.maxStartViews,
    maxAlsLinks: limits.maxAlsLinks,
    maxAhsLinks: limits.maxAhsLinks,
    includeAhs: payload.includeAhs === true,
  });

  // The UI only needs chain data and statistics for generator ranking. Keeping
  // the large graph/link indexes in the worker avoids a needless clone.
  return {
    chains: report.chains || [],
    stats: report.stats || {},
  };
}


function runAlsDof(payload) {
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 9));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 9));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const raw = core.findAlsDofNets(payload.candidateGrid, {
    alsList,
    maxAuxiliary,
    maxDigits,
    maxResults: payload.maxResults || 5000,
    includeChain: true,
  });
  const accepted = [];
  const rejected = [];
  for (const result of raw.results || []) {
    const verification = core.verifyAlsDofNet(payload.candidateGrid, result, { alsList });
    if (verification.ok) accepted.push({ ...result, verification });
    else rejected.push({ result, verification });
  }
  return {
    ...raw,
    results: accepted,
    rejectedResults: rejected,
    stats: {
      ...(raw.stats || {}),
      verifierChecked: (raw.results || []).length,
      verifierRejected: rejected.length,
    },
  };
}

function runAlsDofChain(payload) {
  // Dedicated ALS-DOF chains use the temporary safety limits requested by
  // the UI; other ALS-DOF searches keep their independent settings.
  const maxDigits = Math.min(4, Math.max(2, Number(payload.maxDigits) || 4));
  const maxAuxiliary = 1;
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const raw = core.findAlsDofChains(payload.candidateGrid, {
    alsList,
    maxAuxiliary,
    maxDigits,
    maxResults: payload.maxResults || 5000,
    includePathChain: false,
  });
  const accepted = [];
  const rejected = [];
  for (const result of raw.results || []) {
    const verification = core.verifyAlsDofNet(payload.candidateGrid, result, { alsList });
    if (verification.ok) accepted.push({ ...result, verification });
    else rejected.push({ result, verification });
  }
  return {
    ...raw,
    results: accepted,
    rejectedResults: rejected,
    stats: {
      ...(raw.stats || {}),
      verifierChecked: (raw.results || []).length,
      verifierRejected: rejected.length,
    },
  };
}

function runAhsDof(payload) {
  const ahsList = core.ahsConstructor(payload.candidateGrid, {
    maxSize: Number.isInteger(payload.maxAhsSize) ? payload.maxAhsSize : 8,
    maxSizeFox: Number.isInteger(payload.maxAhsFox) ? payload.maxAhsFox : 7,
  });
  const raw = core.findAhsDofNets(payload.candidateGrid, {
    ahsList,
    minDof: payload.minDof,
    maxDof: payload.maxDof,
    maxAhsSize: payload.maxAhsSize,
    maxAhsFox: payload.maxAhsFox,
    maxCells: payload.maxCells,
    maxAuxiliary: payload.maxAuxiliary,
    maxResults: payload.maxResults,
  });
  const accepted = [];
  const rejected = [];
  for (const result of raw.results || []) {
    const verification = core.verifyAhsDofNet(payload.candidateGrid, result);
    if (verification.ok) accepted.push({ ...result, verification });
    else rejected.push({ result, verification });
  }
  return {
    ...raw,
    results: accepted,
    rejectedResults: rejected,
    stats: {
      ...(raw.stats || {}),
      verifierChecked: (raw.results || []).length,
      verifierRejected: rejected.length,
    },
  };
}

self.onmessage = event => {
  const { id, type, payload } = event.data || {};
  if (type === 'cancel') {
    cancelled.add(id);
    return;
  }

  try {
    if (cancelled.has(id)) {
      cancelled.delete(id);
      return;
    }

    let result;
    if (type === 'simple') result = runSimple(payload || {});
    else if (type === 'fish') result = runFish(payload || {});
    else if (type === 'chains') result = runChains(payload || {});
    else if (type === 'als-dof') result = runAlsDof(payload || {});
    else if (type === 'als-dof-chain') result = runAlsDofChain(payload || {});
    else if (type === 'ahs-dof') result = runAhsDof(payload || {});
    else throw new Error(`Unknown search worker operation: ${type}`);

    if (cancelled.has(id)) {
      cancelled.delete(id);
      return;
    }
    self.postMessage({ id, result });
  } catch (error) {
    reportError(id, error);
  }
};
