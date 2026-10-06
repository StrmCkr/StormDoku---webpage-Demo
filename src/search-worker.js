/* StormDoku search worker.
 *
 * This file has no DOM responsibilities. It loads the same solver cores as
 * the page and returns structured-cloneable search results to the UI thread.
 */
importScripts(
  './browser-core.js?v=20261001-2',
  './set-tools-core.js?v=20260928-1',
  './pom-core.js?v=20261004-2',
  './als-core.js?v=20260928-1',
  './als-dof-core.js?v=20260928-1',
  './als-link-core.js?v=20260928-1',
  './ahs-core.js?v=20260928-2',
  './ahs-link-core.js?v=20261001-28',
  './subset-report-core.js?v=20260928-2',
  './mini-sectors-core.js?v=20260928-1',
  './strong-link-core.js?v=20261006-2',
  './chain-core.js?v=20261006-12',
  './alc-core.js?v=20261004-1',
  './ahs-xy-core.js?v=20261001-4',
  './ahs-dof-core.js?v=20261002-1',
  './msls-core.js?v=20261004-1',
);

const core = globalThis.StormDoku;
const cancelled = new Set();
let chainInventoryCache = null;

function candidateGridKey(candidateGrid) {
  return (candidateGrid || []).map(cell => (cell || []).join('')).join('/');
}

function chainInventory(payload) {
  const candidateGrid = payload.candidateGrid || [];
  const requestedCellCounts = Array.isArray(payload.alsCellCounts)
    ? payload.alsCellCounts.map(Number).filter(Number.isInteger)
    : [];
  const requestedCellCount = Number(payload.alsCellCount);
  const maxRequestedAlsCells = requestedCellCounts.length
    ? Math.max(...requestedCellCounts)
    : Number.isInteger(requestedCellCount) ? requestedCellCount : null;
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
    payload.ahsMaxDigits ?? '',
    payload.ahsMaxSize ?? '',
    payload.ahsMaxCells ?? '',
    payload.ahsMaxFox ?? '',
    payload.ahsMaxNodes ?? '',
    (payload.strongLinkTypes || []).join(','),
    JSON.stringify(payload.almostFish || {}),
    requestedCellCounts.join(','),
    Number.isInteger(requestedCellCount) ? requestedCellCount : '',
  ].join('::');

  if (!chainInventoryCache || chainInventoryCache.key !== inventoryKey) {
    chainInventoryCache = {
      key: inventoryKey,
      strongSet: payload.includeStrong === false ? [] : core.buildStrongLinks(candidateGrid, {
        includeAlmostFish: (payload.strongLinkTypes || []).includes(7),
        strongLinkTypes: payload.strongLinkTypes,
        almostFish: { grid: [...(payload.fixedGrid || [])], ...(payload.almostFish || {}) },
      }),
      alsList: payload.includeAls
        ? core.alsConstructor(candidateGrid, {
            ...(Number.isInteger(payload.alsMaxSizeDOF) || Number.isInteger(maxRequestedAlsCells)
              ? { maxSizeDOF: Math.min(...[
                  Number.isInteger(payload.alsMaxSizeDOF) ? payload.alsMaxSizeDOF : 8,
                  Number.isInteger(maxRequestedAlsCells) ? Math.max(0, maxRequestedAlsCells - 1) : 8,
                ]) }
              : {}),
            ...(Number.isInteger(payload.alsMaxSizeFox)
              ? { maxSizeFox: payload.alsMaxSizeFox }
              : {}),
            searchLimit: payload.alsSearchLimit === true,
          })
        : null,
      ahsList: payload.includeAhs
        ? core.ahsConstructor(candidateGrid, {
            maxSize: Number.isInteger(payload.ahsMaxDigits)
              ? Math.max(1, payload.ahsMaxDigits - 1)
              : (Number.isInteger(payload.ahsMaxSize) ? payload.ahsMaxSize : 8),
            maxSizeFox: Number.isInteger(payload.ahsMaxFox) ? payload.ahsMaxFox : 7,
            searchLimit: payload.ahsSearchLimit === true,
            ...(Number.isInteger(payload.ahsMaxNodes) && payload.ahsMaxNodes > 0
              ? { maxResults: payload.ahsMaxNodes }
              : {}),
          }).filter(ahs => payload.ahsMaxCells == null
            || (ahs.ahsAllCells || []).length <= Number(payload.ahsMaxCells))
          .filter(ahs => payload.ahsMaxDigits == null
            || (ahs.ahsDigits || []).length <= Number(payload.ahsMaxDigits))
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
  const ahsMaxDigits = Number.isInteger(Number(payload.ahsMaxDigits))
    ? Math.max(2, Number(payload.ahsMaxDigits))
    : null;
  const ahsMaxDof = Number.isInteger(Number(payload.ahsMaxDof))
    ? Math.max(1, Number(payload.ahsMaxDof))
    : 3;
  const ahsMaxLinks = Number.isInteger(Number(payload.ahsMaxLinks))
    ? Math.max(1, Number(payload.ahsMaxLinks))
    : maxLinks;
  const linkKey = `${cellCount}:${[...(cellCounts || [])].join(',')}:${linkMode}:${maxDigits}:${maxLinks}:${payload.includeAhs === true}:${ahsMaxDigits}:${ahsMaxDof}:${ahsMaxLinks}`;
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
          ahsList: chainInventoryCache.ahsList.filter(ahs => ahsMaxDigits == null
            || (ahs.ahsDigits || []).length <= ahsMaxDigits),
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
    const pure = core.findAhsXyChains(candidateGrid, {
      maxSize: payload.ahsMaxSize,
      maxSizeFox: payload.ahsMaxFox,
      maxNodes: payload.ahsMaxNodes,
      maxTriples: payload.maxTriples,
      maxChains: payload.limits?.maxChains,
    });
    const mixed = core.findAhsMixedChains(candidateGrid, {
      mode: 'xy',
      maxChains: payload.limits?.maxChains,
    });
    return { chains: [...pure.chains, ...mixed.chains],
      stats: { ...pure.stats, mixed: mixed.stats } };
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
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 5));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 5));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const raw = core.findAlsDofChains(payload.candidateGrid, {
    alsList,
    maxAuxiliary,
    maxDigits,
    maxResults: Math.min(5000, Math.max(1, Number(payload.maxResults) || 500)),
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

function runAhsDofChain(payload) {
  const ahsList = core.ahsConstructor(payload.candidateGrid, {
    maxSize: Number.isInteger(payload.maxAhsSize) ? payload.maxAhsSize : 8,
    maxSizeFox: Number.isInteger(payload.maxAhsFox) ? payload.maxAhsFox : 7,
  });
  const netReport = core.findAhsDofNets(payload.candidateGrid, {
    ahsList,
    minDof: payload.minDof,
    maxDof: payload.maxDof,
    maxAhsSize: payload.maxAhsSize,
    maxAhsFox: payload.maxAhsFox,
    maxCells: payload.maxCells,
    maxAuxiliary: payload.maxAuxiliary,
    maxResults: payload.maxNetResults || 2000,
  });
  const raw = core.findAhsDofChains(payload.candidateGrid, {
    netReport,
    maxDepth: payload.maxDepth,
    maxResults: payload.maxResults || 500,
  });
  const accepted = [];
  const rejected = [];
  for (const result of raw.results || []) {
    const verification = core.verifyAhsDofChain(payload.candidateGrid, result);
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

function runAlcXz(payload) {
  return core.findAlcXz(payload.candidateGrid, payload);
}

function runAlcXy(payload) {
  return core.findAlcXy(payload.candidateGrid, payload);
}

function runAlcChain(payload) {
  return core.findAlcChain(payload.candidateGrid, payload);
}

function runAlcDof(payload) {
  return core.findAlcDofChains(payload.candidateGrid, payload);
}

function runMsls(payload) {
  const options=payload.options || {};
  return options.model === 'MS-AHS' && typeof core.findMsAhs === 'function'
    ? core.findMsAhs(payload.candidateGrid, options)
    : core.findMsls(payload.candidateGrid, options);
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
    else if (type === 'ahs-dof-chain') result = runAhsDofChain(payload || {});
    else if (type === 'alc-xz') result = runAlcXz(payload || {});
    else if (type === 'alc-xy') result = runAlcXy(payload || {});
    else if (type === 'alc-chain') result = runAlcChain(payload || {});
    else if (type === 'alc-dof') result = runAlcDof(payload || {});
    else if (type === 'msls') result = runMsls(payload || {});
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








