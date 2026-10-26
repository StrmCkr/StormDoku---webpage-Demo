(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core?.alsConstructor || !core?.ahsConstructor) {
    throw new Error('ALS and AHS constructors must load before alc-core.js');
  }

  function formatAlcXz(chain) {
    const { als, ahs, contacts } = chain.alcXz;
    const rccDigits = [...new Set((contacts || []).map(contact => Number(contact.digit)))]
      .filter(Number.isInteger)
      .sort((left, right) => left - right);
    const alsRccCells = [...new Set((contacts || []).flatMap(contact =>
      (contact.pairs || []).map(pair => pair[0])))].sort((left, right) => left - right);
    const ahsRccCells = [...new Set((contacts || []).flatMap(contact =>
      (contact.pairs || []).map(pair => pair[1])))].sort((left, right) => left - right);
    const alsSide = `(${als.digits.join('')})${core.cellGroupName(als.cells)}`;
    const ahsSide = `(${ahs.digits.join('')})${core.cellGroupName(ahs.cells)}`;
    const leftRcc = `(${rccDigits.join('') || '?'})${core.cellGroupName(alsRccCells)}`;
    const rightRcc = `(${rccDigits.join('') || '?'})${core.cellGroupName(ahsRccCells)}`;
    return `ALC - XZ: ${alsSide} = ${leftRcc} - ${rightRcc} = ${ahsSide} => ${core.formatRemovals(chain.eliminations)}`;
  }

  function findAlcBivalveChains(cand, options = {}) {
    if (typeof core.findAicChains !== 'function' || typeof core.buildStrongLinks !== 'function'
      || typeof core.buildAhsLinks !== 'function') return { chains: [], stats: {} };
    const strongLinkSet = core.buildStrongLinks(cand);
    const ahsList = options.ahsList || core.ahsConstructor(cand, {
      maxSize: options.maxAhsDigits ?? 4,
      maxSizeFox: options.maxAhsCells ?? 4,
      searchLimit: true,
    });
    const ahsLinkSet = core.buildAhsLinks(cand, {
      ahsList,
      strongLinkSet,
      minDof: 1,
      maxDof: options.maxAhsDof ?? 3,
      maxLinks: options.maxAhsLinks ?? 1200,
    });
    const chainMode = options.mode === 'chain';
    const report = core.findAicChains(cand, {
      candidateGrid: cand,
      onProgress: options.onProgress,
      strongLinkSet,
      strongLinkTypes: [0, 1, 4],
      includeStrong: true,
      includeAls: false,
      includeAhs: true,
      includeAlc: true,
      ahsList,
      ahsLinkSet,
      maxDepth: 3,
      maxChains: options.maxChains ?? 300,
      maxResultAttempts: options.maxResultAttempts ?? 10000,
      maxResultAttemptsPerStart: options.maxResultAttemptsPerStart ?? 300,
      maxStates: options.maxStates ?? 30000,
      maxQueue: options.maxQueue ?? 30000,
      maxBranching: options.maxBranching ?? 120,
      resultFilter: steps => (steps.length === 2 || steps.length === 3)
        && steps.some(step => step.view.node.family === 'AHS')
        && steps.some(step => step.view.node.family === 'SL' && step.view.node.linkType === 4)
        && (steps.length === 2 || steps.some(step => step.view.node.family === 'SL'
          && [0, 1].includes(step.view.node.linkType))),
    });
    return {
      ...report,
      chains: (report.chains || []).map(chain => ({
        ...chain,
        structureName: chain.isRing ? 'ALC - XZ Ring' : 'ALC - XZ',
        structureFamily: 'ALC',
      })),
    };
  }

  function findAlcXz(cand, options = {}) {
    const maxAlsCells = Math.min(8, Math.max(1, options.maxAlsCells ?? 8));
    const maxAhsDigits = Math.min(8, Math.max(1, options.maxAhsDigits ?? 8));
    const maxAhsCells = Math.min(9, Math.max(2, options.maxAhsCells ?? 9));
    const maxAhsDof = Math.min(5, Math.max(1, options.maxAhsDof ?? 3));
    const alsMaxSizeDOF = Number.isInteger(options.alsMaxSizeDOF)
      ? Math.max(0, options.alsMaxSizeDOF) : maxAlsCells - 1;
    const alsMaxSizeFox = Number.isInteger(options.alsMaxSizeFox)
      ? Math.max(0, options.alsMaxSizeFox) : maxAlsCells;
    const ahsMaxSize = Number.isInteger(options.ahsMaxSize)
      ? Math.max(1, options.ahsMaxSize) : maxAhsDigits - 1;
    const ahsMaxFox = Number.isInteger(options.ahsMaxFox)
      ? Math.max(1, options.ahsMaxFox) : maxAhsCells - 1;
    const allAls = (options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: alsMaxSizeDOF, maxSizeFox: alsMaxSizeFox,
      searchLimit: true,
    })).filter(als => als.alsDOF === 1 && als.alsAllCells.length <= maxAlsCells);
    const allAhs = (options.ahsList || core.ahsConstructor(cand, {
      maxSize: ahsMaxSize, maxSizeFox: ahsMaxFox,
      searchLimit: false,
    })).filter(ahs => ahs.ahsDOF >= 1 && ahs.ahsDOF <= maxAhsDof);
    const strongLinkSet = options.strongLinkSet || core.buildStrongLinks(cand, {
      strongLinkTypes: [0, 1, 4],
    });
    const maxChains = Math.max(1, options.maxChains ?? 500);
    let lastReport = null;

    // ALC-XZ is breadth 2.  Scale the ALS/AHS node inventories one size at a
    // time, just like the other hierarchy phases, and stop at the first size
    // that produces a verified graph-chain result.
    for (let size = 1; size <= Math.max(maxAlsCells, maxAhsDigits); size++) {
      const alsList = allAls.filter(als => als.alsAllCells.length <= size);
      const ahsList = allAhs.filter(ahs => ahs.ahsDigits.length <= size
        && ahs.ahsAllCells.length <= Math.min(maxAhsCells, size + 1));
      if (!alsList.length || !ahsList.length) continue;

      const alsLinkSet = options.alsLinkSet && size === maxAlsCells
        ? options.alsLinkSet
        : core.buildAlsLinks(cand, {
          alsList,
          strictSingleCommon: true,
          maxLinks: options.maxAlsLinks ?? 5000,
        });
      const ahsLinkSet = options.ahsLinkSet && size === maxAhsDigits
        ? options.ahsLinkSet
        : core.buildAhsLinks(cand, {
          ahsList,
          strongLinkSet,
          minDof: 1,
          maxDof: maxAhsDof,
          strictSingleCommon: false,
          maxLinks: options.maxAhsLinks ?? 5000,
        });
      const report = core.findAicChains(cand, {
        candidateGrid: cand,
        onProgress: progress => options.onProgress?.({ ...progress, stage: `alc-xz-size-${size}` }),
        strongLinkSet,
        alsList,
        alsLinkSet,
        includeAls: true,
        ahsList,
        ahsLinkSet,
        includeAhs: true,
        includeAlc: true,
        startFamilies: ['ALS', 'AHS'],
        alcOnly: true,
        skipAhsPlacementVerification: true,
        strongLinkTypes: [0, 1, 4],
        minDepth: 2,
        maxDepth: 4,
        maxChains,
        maxResultAttempts: options.maxResultAttempts,
        maxResultAttemptsPerStart: options.maxResultAttemptsPerStart,
        maxStates: options.maxStates,
        maxQueue: options.maxQueue,
        maxBranching: options.maxBranching,
        resultFilter: steps => {
          if (steps.length !== 2) return false;
          const families = steps.map(step => step.view.node.family);
          return families.includes('ALS') && families.includes('AHS');
        },
      });
      const chains = (report.chains || []).map(chain => ({
        ...chain,
        structureName: chain.isRing ? 'ALC - XZ Ring' : 'ALC - XZ',
        structureFamily: 'ALC',
      }));
      lastReport = {
        ...report,
        chains,
        technique: 'ALC-XZ',
        stats: {
          ...(report.stats || {}),
          alsNodes: alsList.length,
          ahsNodes: ahsList.length,
          alsSize: size,
          ahsSize: size,
          maxAlsCells, maxAhsDigits, maxAhsCells, maxAhsDof,
          alsMaxSizeDOF, alsMaxSizeFox, ahsMaxSize, ahsMaxFox,
          chainsFound: chains.length,
        },
      };
      if (chains.length || report.stats?.truncated) return lastReport;
    }

    return lastReport || {
      chains: [],
      technique: 'ALC-XZ',
      stats: { chainsFound: 0, truncated: false },
    };
  }

  function findAlcXy(cand, options = {}) {
    if (typeof core.findAicChains !== 'function' || typeof core.buildStrongLinks !== 'function') {
      return { chains: [], technique: 'ALC-XY', stats: {} };
    }
    const chainMode = options.mode === 'chain';
    const strongLinkSet = options.strongLinkSet || core.buildStrongLinks(cand);
    const alsList = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: options.alsMaxSizeDOF ?? options.maxAlsCells ?? 4,
      maxSizeFox: options.alsMaxSizeFox ?? options.maxAlsCells ?? 5,
      searchLimit: true,
    });
    const ahsList = options.ahsList || core.ahsConstructor(cand, {
      maxSize: options.ahsMaxSize ?? options.maxAhsDigits ?? 4,
      maxSizeFox: options.ahsMaxFox ?? options.maxAhsCells ?? 5,
      searchLimit: true,
    });
    const report = core.findAicChains(cand, {
      candidateGrid: cand,
      strongLinkSet,
      onProgress: options.onProgress,
      // ALC-Chain is the modular ALS/AHS continuation. Ordinary AIC strong
      // links belong to the generic AIC search and must not become the third
      // node here.
      strongLinkTypes: chainMode ? [] : (options.strongLinkTypes || [0, 1, 2, 3, 4]),
      includeStrong: !chainMode,
      includeAls: true,
      includeAhs: true,
      includeAlc: true,
      alsList,
      ahsList,
      maxDepth: Math.max(3, options.maxDepth ?? (chainMode ? 6 : 3)),
      maxChains: options.maxChains ?? 500,
      maxResultAttempts: options.maxResultAttempts ?? 20000,
      maxResultAttemptsPerStart: options.maxResultAttemptsPerStart ?? 1000,
      maxStates: options.maxStates ?? 50000,
      maxQueue: options.maxQueue ?? 50000,
      maxBranching: options.maxBranching ?? 200,
      resultFilter: steps => {
        if (steps.length < 3) return false;
        const hasAls = steps.some(step => step.view.node.family === 'ALS');
        const hasAhs = steps.some(step => step.view.node.family === 'AHS');
        if (!hasAls || !hasAhs) return false;
        if (chainMode && steps.some(step => !['ALS', 'AHS'].includes(step.view.node.family))) {
          return false;
        }
        // The third node is another distinct ALS/AHS module in chain mode.
        return new Set(steps.map(step => step.view.node.graphId)).size >= 3;
      },
    });
    const chains = (report.chains || []).map(chain => ({
      ...chain,
      structureName: chain.isRing
        ? (chainMode ? 'ALC - Chain Ring' : 'ALC - XY Ring')
        : (chainMode ? 'ALC - Chain' : 'ALC - XY'),
      structureFamily: 'ALC',
      alcXy: {
        mode: chainMode ? 'chain' : 'xy',
        nodeFamilies: [...new Set((chain.steps || [])
          .map(step => step.family ?? step.view?.node?.family)
          .filter(Boolean))],
      },
    }));
    return {
      ...report,
      chains,
      technique: chainMode ? 'ALC-CHAIN' : 'ALC-XY',
      stats: { ...(report.stats || {}), chainsFound: chains.length },
    };
  }

  function findAlcChain(cand, options = {}) {
    return findAlcXy(cand, { ...options, mode: 'chain' });
  }

  function subsetViewsForChain(steps) {
    return (steps || []).flatMap(step => {
      const module = step.module || step.view?.node?.module;
      const raw = step.view?.node?.raw || {};
      return [
        module?.entrySubset, module?.exitSubset,
        raw.LS_L, raw.LS_R, raw.HS_L, raw.HS_R,
      ].filter(Boolean);
    });
  }

  function sameModularNode(left, right) {
    if (!left || !right) return false;
    if (left.id != null && right.id != null && String(left.id) === String(right.id)) return true;
    const leftCells = [...(left.cells || left.alsAllCells || left.ahsAllCells || [])].sort((a, b) => a - b);
    const rightCells = [...(right.cells || right.alsAllCells || right.ahsAllCells || [])].sort((a, b) => a - b);
    const leftDigits = [...(left.digits || left.alsDigits || left.ahsDigits || [])].sort((a, b) => a - b);
    const rightDigits = [...(right.digits || right.alsDigits || right.ahsDigits || [])].sort((a, b) => a - b);
    return leftCells.join(',') === rightCells.join(',')
      && leftDigits.join('') === rightDigits.join('');
  }

  function rootNodes(root) {
    return [root.hub || root.primaryA, ...(root.auxiliary || [])].filter(Boolean);
  }

  function findAlcDofChains(cand, options = {}) {
    if (typeof core.findAicChains !== 'function'
      || typeof core.findAlsDofNets !== 'function'
      || typeof core.findAhsDofNets !== 'function') {
      return { chains: [], technique: 'ALC-DOF', stats: {} };
    }

    const maxResults = options.maxResults ?? options.maxChains ?? 200;
    const alsDof = core.findAlsDofNets(cand, {
      maxDigits: options.maxAlsDigits ?? 5,
      maxAuxiliary: options.maxAlsAuxiliary ?? 5,
      maxResults: options.maxDofRoots ?? 500,
    });
    const ahsDof = core.findAhsDofNets(cand, {
      minDof: 2,
      maxDof: options.maxAhsDof ?? 3,
      maxCells: options.maxAhsCells ?? 7,
      maxAuxiliary: options.maxAhsAuxiliary ?? 5,
      maxResults: options.maxDofRoots ?? 500,
    });
    const roots = [
      ...(alsDof.results || []).map(root => ({ type: 'ALS-DOF', root })),
      ...(ahsDof.results || []).map(root => ({ type: 'AHS-DOF', root })),
    ];
    if (!roots.length) {
      return { chains: [], technique: 'ALC-DOF', stats: { alsRoots: 0, ahsRoots: 0 } };
    }

    const strongLinkSet = options.strongLinkSet || core.buildStrongLinks(cand);
    const report = core.findAicChains(cand, {
      candidateGrid: cand,
      strongLinkSet,
      strongLinkTypes: [],
      onProgress: options.onProgress,
      includeStrong: false,
      includeAls: true,
      includeAhs: true,
      includeAlc: true,
      alsList: options.alsList,
      ahsList: options.ahsList,
      maxDepth: Math.max(3, options.maxDepth ?? 8),
      maxChains: options.maxSearchChains ?? 1000,
      maxResultAttempts: options.maxResultAttempts ?? 30000,
      maxResultAttemptsPerStart: options.maxResultAttemptsPerStart ?? 1500,
      maxStates: options.maxStates ?? 60000,
      maxQueue: options.maxQueue ?? 60000,
      maxBranching: options.maxBranching ?? 200,
      resultFilter: steps => steps.length >= 3
        && steps.every(step => step.view.node.family === 'ALS' || step.view.node.family === 'AHS')
        && steps.some(step => step.view.node.family === 'ALS')
        && steps.some(step => step.view.node.family === 'AHS'),
    });

    const chains = [];
    const seen = new Set();
    for (const chain of report.chains || []) {
      const available = subsetViewsForChain(chain.steps);
      const rootMatch = roots.find(candidate => {
        const nodes = rootNodes(candidate.root);
        return nodes.length >= 2 && nodes.every(node => available.some(view => sameModularNode(node, view)));
      });
      if (!rootMatch) continue;
      const key = `${rootMatch.type}|${chain.steps.map(step => step.graphId ?? step.view?.node?.graphId).join('|')}|${(chain.eliminations || []).map(item => `${item.cell}:${item.digit}`).join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      chains.push({
        ...chain,
        structureName: chain.isRing ? 'ALC - DOF Chain Ring' : 'ALC - DOF Chain',
        structureFamily: 'ALC',
        alcDof: { rootType: rootMatch.type, root: rootMatch.root },
      });
      if (chains.length >= maxResults) break;
    }
    return {
      ...report,
      chains,
      technique: 'ALC-DOF',
      stats: {
        ...(report.stats || {}),
        alsRoots: alsDof.results?.length || 0,
        ahsRoots: ahsDof.results?.length || 0,
        chainsFound: chains.length,
      },
    };
  }

  core.findAlcXz = findAlcXz;
  core.findALCXz = findAlcXz;
  core.findAlcXy = findAlcXy;
  core.findALCXy = findAlcXy;
  core.findAlcChain = findAlcChain;
  core.findALCChain = findAlcChain;
  core.findAlcDofChains = findAlcDofChains;
  core.findALCDofChains = findAlcDofChains;
  core.formatAlcXz = formatAlcXz;
})(globalThis);
