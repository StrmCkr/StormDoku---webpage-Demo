/* StormDoku search worker.
 *
 * This file has no DOM responsibilities. It loads the same solver cores as
 * the page and returns structured-cloneable search results to the UI thread.
 */
importScripts(
  './browser-core.js?v=20261027-14',
  './set-tools-core.js?v=20261027-14',
  './pom-core.js?v=20261027-14',
  './als-core.js?v=20261027-14',
  './als-dof-core.js?v=20261027-14',
  './hydra-core.js?v=20261027-14',
  './als-link-core.js?v=20261027-14',
  './ahs-core.js?v=20261027-14',
  './ahs-link-core.js?v=20261027-14',
  './subset-report-core.js?v=20261027-14',
  './mini-sectors-core.js?v=20261027-14',
  './strong-link-core.js?v=20261027-14',
  './chain-core.js?v=20261027-14',
  './alc-core.js?v=20261027-14',
  './ahs-xy-core.js?v=20261027-14',
  './ahs-dof-core.js?v=20261027-14',
  './msls-core.js?v=20261027-14',
  './chromatic-core.js?v=20261027-14',
  './chromatic-als-core.js?v=20261027-14',
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
  if (payload.directType === 'box-line') {
    return core.boxLineStep(payload.candidateGrid);
  }
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

function runChains(payload, onProgress = null) {
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
  const requestedLimits = payload.limits || {};
  const interactiveDeepLimits = payload.budget === 'interactive' && payload.maxDepth >= 5
    ? {
      maxChains: Math.min(requestedLimits.maxChains ?? 500, 500),
      maxResultAttempts: Math.min(requestedLimits.maxResultAttempts ?? 5000, 5000),
      maxResultAttemptsPerStart: Math.min(requestedLimits.maxResultAttemptsPerStart ?? 150, 150),
      maxStates: Math.min(requestedLimits.maxStates ?? 12000, 12000),
      maxQueue: Math.min(requestedLimits.maxQueue ?? 12000, 12000),
      maxBranching: Math.min(requestedLimits.maxBranching ?? 150, 150),
      maxStartViews: Math.min(requestedLimits.maxStartViews ?? 500, 500),
      maxAlsLinks: Math.min(requestedLimits.maxAlsLinks ?? 1500, 1500),
    }
    : {};
  const limits = payload.budget === 'interactive' && payload.maxDepth >= 5
    ? {
      ...requestedLimits,
      ...interactiveDeepLimits,
    }
    : payload.maxDepth >= 8
    ? {
      ...requestedLimits,
      maxStates: Math.min(requestedLimits.maxStates ?? 30000, 30000),
      maxQueue: Math.min(requestedLimits.maxQueue ?? 30000, 30000),
      maxBranching: Math.min(requestedLimits.maxBranching ?? 250, 250),
      maxStartViews: Math.min(requestedLimits.maxStartViews ?? 900, 900),
      maxAlsLinks: Math.min(requestedLimits.maxAlsLinks ?? 3000, 3000),
    }
    : requestedLimits;
  const inventory = chainInventory(payload);
  const strongSet = inventory.strongSet;
  const alsList = includeAls ? inventory.alsList : null;
  const alsLinkSet = includeAls ? inventory.alsLinkSet : null;
  const filteredAlsLinkSet = payload.alsModuleKinds && alsLinkSet
    ? alsLinkSet.map(bucket => bucket.filter(link => payload.alsModuleKinds.includes(link.moduleKind)))
    : alsLinkSet;
  const scopedAlsLinkSet = payload.alsLinkMode === 'rcc-only' && filteredAlsLinkSet
    ? filteredAlsLinkSet.map((bucket, index) => index === core.ALS_RCC ? bucket : [])
    : filteredAlsLinkSet;
  const chromaticLinkSet = payload.includeChromatic
    ? (payload.chromaticLinkSet || runChromaticChainLinks({
      candidateGrid,
      ...(payload.chromaticOptions || {}),
      maxResults: payload.chromaticOptions?.maxResults || 120,
    }).links)
    : [];

  const report = core.findAicChains(candidateGrid, {
    onProgress,
    strongLinkSet: strongSet,
    alsList,
    alsLinkSet: scopedAlsLinkSet,
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
    excludePureAhs: payload.excludePureAhs === true,
    includeHydra: payload.includeHydra === true,
    hydraLinkSet: payload.hydraLinkSet || [],
    includeChromatic: payload.includeChromatic === true,
    chromaticLinkSet,
  });

  // The UI only needs chain data and statistics for generator ranking. Keeping
  // the large graph/link indexes in the worker avoids a needless clone.
  return {
    chains: report.chains || [],
    stats: report.stats || {},
  };
}

function runChromaticChainLinks(payload) {
  const options = {
    unitType: payload.unitType || 'box',
    minSectors: Math.max(4, Number(payload.minSectors) || 4),
    maxSectors: Math.min(6, Math.max(4, Number(payload.maxSectors) || 6)),
    minDigits: Math.max(2, Number(payload.minDigits) || 2),
    maxDigits: Math.min(6, Math.max(2, Number(payload.maxDigits) || 5)),
    maxCells: Math.max(12, Number(payload.maxCells) || 32),
    maxResults: Math.min(500, Math.max(1, Number(payload.maxResults) || 200)),
  };
  const plain = globalThis.StormChromaticCore.find(payload.candidateGrid, options);
  const als = globalThis.StormChromaticAlsCore.find(payload.candidateGrid, options);
  const records = [...(plain.results || []), ...(als.results || [])];
  return {
    links: globalThis.StormChromaticCore.buildChromaticType3Links(
      payload.candidateGrid, records,
    ),
    stats: {
      records: records.length,
      plain: plain.results?.length || 0,
      als: als.results?.length || 0,
    },
  };
}

function hydraAicParticipants(payload, alsList, onProgress = null, forChaining = false) {
  const strongLinkTypes = Array.isArray(payload.strongLinkTypes) && payload.strongLinkTypes.length
    ? payload.strongLinkTypes
    : [0, 1, 2, 3, 4];
  const strongLinkSet = core.buildStrongLinks(payload.candidateGrid, { strongLinkTypes });
  const alsLinkSet = core.buildAlsLinks(payload.candidateGrid, {
    alsList,
    strictSingleCommon: true,
    maxLinks: payload.maxAlsLinks,
  });
  const includeAhs = payload.includeAhs !== false;
  const ahsList = includeAhs ? core.ahsConstructor(payload.candidateGrid, {
    maxSize: Math.max(1, Number(payload.maxDigits) - 1 || 4),
    maxSizeFox: Math.max(1, Number(payload.maxDigits) - 1 || 4),
  }) : [];
  const ahsLinkSet = includeAhs ? core.buildAhsLinks(payload.candidateGrid, {
    ahsList,
    strongLinkSet,
    minDof: 1,
    maxDof: 3,
    strictSingleCommon: false,
    maxLinks: payload.maxAhsLinks || 5000,
  }) : [];
  const participants = [];
  let aicChainsChecked = 0;
  const maxParticipants = Math.max(1, Number(payload.maxParticipants) || 2000);
  const maxChains = Math.min(2000, Math.max(1, Number(payload.maxAicChains) || 500));
  for (const auxiliary of alsList) {
    if (participants.length >= maxParticipants) break;
    const aicReport = core.findAicChains(payload.candidateGrid, {
      onProgress,
      strongLinkSet,
      alsList,
      alsLinkSet,
      includeAls: true,
      ahsList,
      ahsLinkSet,
      includeAhs,
      collectAlsBranches: forChaining,
      maxAlsBranches: maxParticipants,
      strongLinkTypes,
      startNodeIds: [auxiliary.uniqueID || auxiliary.id],
      startNodeCells: auxiliary.alsAllCells || auxiliary.cells || [],
      maxDepth: Math.max(2, Number(payload.aicDepth) || 4),
      maxChains,
    });
    const chains = [...(aicReport.chains || []), ...(aicReport.alsBranches || [])];
    aicChainsChecked += chains.length;
    // Resolve every ALS touched by the walk.  A branch may start at an
    // auxiliary and arrive at the hub or another auxiliary; limiting this
    // list to the start node prevents those endpoints becoming Hydra nodes.
    participants.push(...core.hydraParticipantsFromAicChains(
      payload.candidateGrid,
      chains,
      alsList,
      alsLinkSet,
      { maxParticipants: maxParticipants - participants.length, forChaining },
    ));
  }
  return { participants, aicChainsChecked };
}

function normaliseHydraAhsNodes(ahsList = []) {
  return ahsList.map((ahs, index) => ({
    ...ahs,
    family: 'AHS',
    id: ahs.uniqueID || `ahs-${index}`,
    uniqueID: ahs.uniqueID || `ahs-${index}`,
    cells: [...(ahs.ahsAllCells || [])],
    digits: [...(ahs.ahsDigits || [])],
    dof: Number.isInteger(ahs.ahsDOF) ? ahs.ahsDOF : 0,
    rccList: (ahs.rccList || []).flatMap(rcc =>
      (rcc.rccDigits || []).map(digit => ({
        digit,
        cells: [rcc.rccCell],
        sectors: [...(rcc.rccSectors || [])],
      }))),
  }));
}

function hydraFamilyParticipants(payload, family, sourceNodes, onProgress = null) {
  const strongLinkTypes = Array.isArray(payload.strongLinkTypes) && payload.strongLinkTypes.length
    ? payload.strongLinkTypes : [0, 1, 2, 3, 4];
  const strongLinkSet = core.buildStrongLinks(payload.candidateGrid, { strongLinkTypes });
  const isAhs = family === 'AHS';
  const alsList = isAhs ? [] : sourceNodes.filter(node => node.family !== 'AHS');
  const ahsList = isAhs ? sourceNodes : [];
  const alsLinkSet = alsList.length ? core.buildAlsLinks(payload.candidateGrid, {
    alsList, strictSingleCommon: true, maxLinks: payload.maxAlsLinks,
  }) : [];
  const ahsLinkSet = ahsList.length ? core.buildAhsLinks(payload.candidateGrid, {
    ahsList: ahsList.map(node => node.source || node), strongLinkSet,
    minDof: 1, maxDof: 3, strictSingleCommon: false,
    maxLinks: payload.maxAhsLinks || 5000,
  }) : [];
  const links = family === 'AHS' ? ahsLinkSet : alsLinkSet;
  const participants = [];
  let aicChainsChecked = 0;
  const maxParticipants = Math.max(1, Number(payload.maxParticipants) || 2000);
  const maxChains = Math.min(2000, Math.max(1, Number(payload.maxAicChains) || 500));
  for (const source of sourceNodes) {
    if (participants.length >= maxParticipants) break;
    const report = core.findAicChains(payload.candidateGrid, {
      onProgress, strongLinkSet, alsList, alsLinkSet, includeAls: !!alsList.length,
      ahsList: ahsList.map(node => node.source || node), ahsLinkSet,
      includeAhs: !!ahsList.length, collectAlsBranches: true,
      maxAlsBranches: maxParticipants, strongLinkTypes,
      startNodeIds: [source.uniqueID || source.id],
      startNodeCells: source.ahsAllCells || source.alsAllCells || source.cells || [],
      maxDepth: Math.max(2, Number(payload.aicDepth) || 4),
      maxChains,
    });
    const chains = [...(report.chains || []), ...(report.alsBranches || [])]
      .filter(chain => chain.steps?.some(step => step.family === family));
    aicChainsChecked += chains.length;
    participants.push(...core.hydraParticipantsFromAicChains(
      payload.candidateGrid, chains, sourceNodes, links,
      { maxParticipants: maxParticipants - participants.length, forChaining: true, family },
    ));
  }
  return { participants, aicChainsChecked };
}

function runHydraFamily(payload, family, onProgress = null) {
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 9));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 9));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1, maxSizeFox: maxDigits - 1,
  }).map(node => ({ ...node, family: 'ALS', cells: node.alsAllCells, digits: node.alsDigits,
    dof: node.alsDOF, id: node.uniqueID }));
  const ahsList = normaliseHydraAhsNodes(core.ahsConstructor(payload.candidateGrid, {
    maxSize: Math.min(8, maxDigits), maxSizeFox: Math.min(7, maxDigits - 1),
  }));
  const sourceNodes = family === 'ALS' ? alsList : family === 'AHS' ? ahsList : [...alsList, ...ahsList];
  const participantFamily = family === 'ALC' ? null : family;
  const aic = participantFamily
    ? hydraFamilyParticipants(payload, participantFamily, sourceNodes, onProgress)
    : {
      participants: [
        ...hydraFamilyParticipants(payload, 'ALS', alsList, onProgress).participants,
        ...hydraFamilyParticipants(payload, 'AHS', ahsList, onProgress).participants,
      ],
      aicChainsChecked: 0,
    };
  const report = core.findHydraDof(payload.candidateGrid, {
    sourceNodes,
    participants: aic.participants,
    nodeFamilies: family === 'ALC' ? ['ALS', 'AHS'] : [family],
    families: family === 'ALC' ? ['ALS', 'AHS'] : [family],
    maxDigits, maxAuxiliary, maxResults: payload.maxResults,
    requireVerifiedParticipants: payload.requireVerifiedParticipants !== false,
    name: `Hydra ${family} DOF`, type: `HYDRA_${family}_DOF`, family,
  });
  return { ...report, stats: { ...(report.stats || {}), aicChainsChecked: aic.aicChainsChecked,
    hydraParticipants: aic.participants.length } };
}

function runHydraAhsDof(payload, onProgress = null) {
  return runHydraFamily(payload, 'AHS', onProgress);
}

function runHydraAlcDof(payload, onProgress = null) {
  return runHydraFamily(payload, 'ALC', onProgress);
}

function runHydraAlsDof(payload, onProgress = null) {
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 9));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 9));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const includeHydra = payload.includeHydra !== false;
  const aic = includeHydra
    ? hydraAicParticipants(payload, alsList, onProgress, true)
    : { participants: [], aicChainsChecked: 0 };
  const participants = aic.participants;
  const report = core.findHydraAlsDof(payload.candidateGrid, {
    alsList,
    participants: payload.participants?.length ? payload.participants : participants,
    maxDigits,
    maxAuxiliary,
    maxResults: payload.maxResults,
    requireVerifiedParticipants: payload.requireVerifiedParticipants !== false,
    families: payload.families,
    includeHydra,
  });
  return {
    ...report,
    stats: {
      ...(report.stats || {}),
      aicChainsChecked: aic.aicChainsChecked,
      hydraParticipants: participants.length,
    },
  };
}


function runAlsDof(payload) {
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 9));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 9));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const includeHydra = payload.includeHydra === true;
  const aic = includeHydra
    ? hydraAicParticipants(payload, alsList, null, true)
    : { participants: [], aicChainsChecked: 0 };
  const raw = core.findAlsDofNets(payload.candidateGrid, {
    alsList,
    maxAuxiliary,
    maxDigits,
    maxResults: payload.maxResults || 5000,
    includeChain: true,
    includeHydra,
    participants: aic.participants,
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
      aicChainsChecked: aic.aicChainsChecked,
      verifierChecked: (raw.results || []).length,
      verifierRejected: rejected.length,
    },
  };
}

function runAlsDofChain(payload, onProgress = null) {
  const maxDigits = Math.min(9, Math.max(2, Number(payload.maxDigits) || 5));
  const maxAuxiliary = Math.min(9, Math.max(1, Number(payload.maxAuxiliary) || 5));
  const alsList = core.alsConstructor(payload.candidateGrid, {
    maxSizeDOF: maxDigits - 1,
    maxSizeFox: maxDigits - 1,
  });
  const includeHydra = payload.includeHydra !== false;
  const aic = includeHydra
    ? hydraAicParticipants(payload, alsList, onProgress, true)
    : { participants: [], aicChainsChecked: 0 };
  onProgress?.({ stage: 'als-dof-chain' });
  const raw = core.findAlsDofChains(payload.candidateGrid, {
    onProgress,
    alsList,
    maxAuxiliary,
    maxDigits,
    maxResults: Math.min(5000, Math.max(1, Number(payload.maxResults) || 500)),
    includePathChain: false,
    includeHydra,
    participants: payload.participants || aic.participants,
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
      aicChainsChecked: aic.aicChainsChecked,
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
  const hydraReport = payload.includeHydra === true
    ? runHydraAhsDof({ ...payload, maxDigits: payload.maxAhsSize || 8 })
    : null;
  return {
    ...raw,
    results: accepted,
    hydraReport,
    rejectedResults: rejected,
    stats: {
      ...(raw.stats || {}),
      verifierChecked: (raw.results || []).length,
      verifierRejected: rejected.length,
    },
  };
}

function runAlcXz(payload, onProgress = null) {
  return core.findAlcXz(payload.candidateGrid, { ...payload, onProgress });
}

function runAlcXy(payload, onProgress = null) {
  return core.findAlcXy(payload.candidateGrid, { ...payload, onProgress });
}

function runAlcChain(payload, onProgress = null) {
  return core.findAlcChain(payload.candidateGrid, { ...payload, onProgress });
}

function runAlcDof(payload, onProgress = null) {
  const report = core.findAlcDofChains(payload.candidateGrid, { ...payload, onProgress });
  return payload.includeHydra === true
    ? { ...report, hydraReport: runHydraAlcDof({ ...payload, maxDigits: payload.maxAlsDigits || 5 }, onProgress) }
    : report;
}

function runMsls(payload) {
  const options=payload.options || {};
  return options.model === 'MS-AHS' && typeof core.findMsAhs === 'function'
    ? core.findMsAhs(payload.candidateGrid, options)
    : core.findMsls(payload.candidateGrid, options);
}

const coreSearchMethods = new Set([
  'pomCheck', 'alsConstructor', 'buildAlsLinks', 'ahsConstructor',
  'buildAhsLinks', 'buildStrongLinks', 'buildSimpleColoring',
  'buildThreeDMedusa', 'buildMultiColoring', 'buildThreeDMedusaMultiColoring',
  'findBoxLineReports', 'findGenericSubsetReports', 'findAicChains', 'findAhsXyChains',
  'findAhsMixedChains', 'generate', 'solveDlx',
]);

function runCoreSearch(payload) {
  const { method, args = [] } = payload;
  if (!coreSearchMethods.has(method)) throw new Error(`Unknown core search: ${method}`);
  // Functions cannot be cloned into a worker; reconstruct this existing filter here.
  if (method === 'findAicChains' && args[1]?.ahsChainOnly) {
    args[1].resultFilter = steps => steps.length > 3
      && steps.some(step => step.view.node.family === 'AHS')
      && steps.every(step => step.view.node.family === 'AHS'
        || (step.view.node.family === 'SL' && [0, 1].includes(step.view.node.linkType)));
  }
  return core[method](...args);
}

self.onmessage = event => {
  const { id, type, payload } = event.data || {};
  if (type === 'cancel') {
    cancelled.add(id);
    return;
  }

  try {
    if (typeof core.configureVariants === 'function') {
      core.configureVariants(payload?.variantSettings || {});
    }
    if (cancelled.has(id)) {
      cancelled.delete(id);
      return;
    }

    let lastProgressTime = 0;
    let lastProgressStage = null;
    const onProgress = progress => {
      const now = Date.now();
      if (progress.stage === lastProgressStage && now - lastProgressTime < 1000) return;
      lastProgressTime = now;
      lastProgressStage = progress.stage;
      self.postMessage({ id, type: 'progress', operation: type, ...progress });
    };
    onProgress({ stage: 'start' });
    let result;
    if (type === 'simple') result = runSimple(payload || {});
    else if (type === 'fish') result = runFish(payload || {});
    else if (type === 'chains') result = runChains(payload || {}, onProgress);
    else if (type === 'chromatic-chain-links') result = runChromaticChainLinks(payload || {});
    else if (type === 'hydra-als-dof') result = runHydraAlsDof(payload || {}, onProgress);
    else if (type === 'hydra-ahs-dof') result = runHydraAhsDof(payload || {}, onProgress);
    else if (type === 'hydra-alc-dof') result = runHydraAlcDof(payload || {}, onProgress);
    else if (type === 'als-dof') result = runAlsDof(payload || {});
    else if (type === 'als-dof-chain') result = runAlsDofChain(payload || {}, onProgress);
    else if (type === 'ahs-dof') result = runAhsDof(payload || {});
    else if (type === 'ahs-dof-chain') result = runAhsDofChain(payload || {});
    else if (type === 'alc-xz') result = runAlcXz(payload || {}, onProgress);
    else if (type === 'alc-xy') result = runAlcXy(payload || {}, onProgress);
    else if (type === 'alc-chain') result = runAlcChain(payload || {}, onProgress);
    else if (type === 'alc-dof') result = runAlcDof(payload || {}, onProgress);
    else if (type === 'msls') result = runMsls(payload || {});
    else if (type === 'core-search') result = runCoreSearch(payload || {});
    else if (type === 'chromatic') result = globalThis.StormChromaticCore.find(payload.candidateGrid, payload.options);
    else if (type === 'chromatic-als') result = globalThis.StormChromaticAlsCore.find(payload.candidateGrid, payload.options);
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

self.postMessage({ type: 'ready' });








