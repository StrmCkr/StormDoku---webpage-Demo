/* StormDoku search worker.
 *
 * This file has no DOM responsibilities. It loads the same solver cores as
 * the page and returns structured-cloneable search results to the UI thread.
 */
importScripts(
  './browser-core.js',
  './set-tools-core.js',
  './pom-core.js',
  './als-core.js?v=20260923-1',
  './als-dof-core.js?v=20260924-5',
  './als-link-core.js?v=20260923-1',
  './ahs-core.js',
  './subset-report-core.js',
  './mini-sectors-core.js',
  './strong-link-core.js?v=20260924-37',
  './chain-core.js?v=20260923-1',
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
    Boolean(payload.includeAls),
    payload.alsMaxSizeDOF ?? '',
    payload.alsMaxSizeFox ?? '',
    payload.alsSearchLimit === true,
    (payload.alsCellCounts || []).join(','),
  ].join('::');

  if (!chainInventoryCache || chainInventoryCache.key !== inventoryKey) {
    chainInventoryCache = {
      key: inventoryKey,
      strongSet: core.buildStrongLinks(candidateGrid),
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
      linkSets: new Map(),
    };
  }

  if (!payload.includeAls) {
    return { strongSet: chainInventoryCache.strongSet, alsList: null, alsLinkSet: null };
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
  const linkKey = `${cellCount}:${[...(cellCounts || [])].join(',')}:${linkMode}:${maxDigits}:${maxLinks}`;
  let cachedLinks = chainInventoryCache.linkSets.get(linkKey);
  if (!cachedLinks) {
    const digitFilter = als => maxDigits == null
      || (als.alsDigits || []).length <= maxDigits;
    const alsList = cellCount === '*' && !cellCounts
      ? chainInventoryCache.alsList.filter(digitFilter)
      : chainInventoryCache.alsList.filter(als => (cellCounts
        ? cellCounts.has((als.alsAllCells || []).length)
        : (als.alsAllCells || []).length === cellCount)
        && digitFilter(als));
    const alsLinkSet = core.buildAlsLinks(candidateGrid, {
      alsList,
      strictSingleCommon: true,
      xzOnly: linkMode === 'xz-only',
      maxLinks,
    });
    cachedLinks = { alsList, alsLinkSet };
    chainInventoryCache.linkSets.set(linkKey, cachedLinks);
  }

  return {
    strongSet: chainInventoryCache.strongSet,
    alsList: cachedLinks.alsList,
    alsLinkSet: cachedLinks.alsLinkSet,
  };
}

function reportError(id, error) {
  self.postMessage({
    id,
    error: error instanceof Error ? error.message : String(error),
  });
}

function runSimple(payload) {
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
    includeChain: false,
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
