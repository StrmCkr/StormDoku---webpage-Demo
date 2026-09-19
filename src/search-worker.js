/* StormDoku search worker.
 *
 * This file has no DOM responsibilities. It loads the same solver cores as
 * the page and returns structured-cloneable search results to the UI thread.
 */
importScripts(
  './browser-core.js',
  './set-tools-core.js',
  './pom-core.js',
  './als-core.js?v=20260917-1',
  './als-dof-core.js?v=20260918-15',
  './als-link-core.js?v=20260918-2',
  './ahs-core.js',
  './subset-report-core.js',
  './mini-sectors-core.js',
  './strong-link-core.js?v=20260917-1',
  './chain-core.js?v=20260918-3',
);

const core = globalThis.StormDoku;
const cancelled = new Set();

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
  const strongSet = core.buildStrongLinks(candidateGrid);
  const alsList = includeAls
    ? core.alsConstructor(candidateGrid, {
        maxSizeDOF: payload.alsMaxSizeDOF || 4,
        maxSizeFox: payload.alsMaxSizeFox || 5,
        searchLimit: true,
      }).filter(als => payload.alsCellCount == null
        || (als.alsAllCells || []).length === payload.alsCellCount)
    : null;
  const alsLinkSet = includeAls
    ? core.buildAlsLinks(candidateGrid, {
        alsList,
        strictSingleCommon: true,
        xzOnly: payload.alsLinkMode === 'xz-only',
        maxLinks: limits.maxAlsLinks || 750,
      })
    : null;
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
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 6));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 3));
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
