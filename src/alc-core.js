(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core?.alsConstructor || !core?.ahsConstructor) {
    throw new Error('ALS and AHS constructors must load before alc-core.js');
  }

  const peers = Array.from({ length: 81 }, (_, cell) => new Set(core.peersOf(cell)));
  const candidateIndex = (cell, digit) => cell * 9 + digit - 1;
  const sees = (left, right) => left !== right && peers[left].has(right);

  function exclusionMasks(cand) {
    const masks = Array.from({ length: 81 }, () => ({}));
    for (let cell = 0; cell < 81; cell++) {
      for (const digit of cand[cell] || []) {
        let mask = 0n;
        for (const other of cand[cell]) {
          if (other !== digit) mask |= 1n << BigInt(candidateIndex(cell, other));
        }
        for (const peer of peers[cell]) {
          if ((cand[peer] || []).includes(digit)) {
            mask |= 1n << BigInt(candidateIndex(peer, digit));
          }
        }
        masks[cell][digit] = mask;
      }
    }
    return masks;
  }

  // ALS cells each take one value; every hidden digit of the AHS must take
  // one of its sector positions. These necessary Sudoku constraints provide
  // a local proof for every candidate excluded by all joint completions.
  function placementEliminations(cand, masks, als = null, ahs = null) {
    const variables = [];
    if (als) {
      for (const cell of als.alsAllCells) {
        variables.push((cand[cell] || []).map(digit => ({ cell, digit })));
      }
    }
    if (ahs) {
      for (const digit of ahs.ahsDigits) {
        variables.push(ahs.ahsAllCells
          .filter(cell => (cand[cell] || []).includes(digit))
          .map(cell => ({ cell, digit })));
      }
    }
    if (variables.some(choices => !choices.length)) return null;
    variables.sort((left, right) => left.length - right.length);

    const assigned = [];
    let common = null;
    let completions = 0;
    function visit(index, excluded) {
      if (index === variables.length) {
        common = common === null ? excluded : common & excluded;
        completions++;
        return;
      }
      for (const choice of variables[index]) {
        if (assigned.some(previous =>
          (choice.cell === previous.cell && choice.digit !== previous.digit)
          || (choice.digit === previous.digit && sees(choice.cell, previous.cell)))) continue;
        assigned.push(choice);
        visit(index + 1, excluded | masks[choice.cell][choice.digit]);
        assigned.pop();
        if (common === 0n) return;
      }
    }
    visit(0, 0n);
    return completions ? common : null;
  }

  function sharedDigitContacts(cand, als, ahs) {
    const contacts = [];
    for (const digit of als.alsDigits) {
      if (!ahs.ahsDigits.includes(digit)) continue;
      const alsCells = als.alsAllCells.filter(cell => (cand[cell] || []).includes(digit));
      const ahsCells = ahs.ahsAllCells.filter(cell => (cand[cell] || []).includes(digit));
      const pairs = alsCells.flatMap(left => ahsCells
        .filter(right => sees(left, right))
        .map(right => [left, right]));
      if (pairs.length) contacts.push({ digit, pairs });
    }
    return contacts;
  }

  function resultSteps(als, ahs) {
    return [
      {
        family: 'ALS', linkType: 5, linkTypeName: 'ALS_RCC',
        linkId: als.uniqueID, direction: 'F', originSectors: [als.alsSector],
        entry: { side: 'left', cells: [...als.alsAllCells], digits: [...als.alsDigits] },
        exit: { side: 'right', cells: [...als.alsAllCells], digits: [...als.alsDigits] },
      },
      {
        family: 'AHS', linkType: 6, linkTypeName: 'AHS_RCC',
        linkId: ahs.uniqueID, direction: 'F', originSectors: [ahs.ahsSector],
        entry: { side: 'left', cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits] },
        exit: { side: 'right', cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits] },
      },
    ];
  }

  function formatAlcXz(chain) {
    const { als, ahs, contacts } = chain.alcXz;
    const alsName = `ALS (${als.digits.join('')})${core.cellGroupName(als.cells)}`;
    const ahsName = `AHS (${ahs.digits.join('')})${core.sectorGroupName([ahs.sector])}{${core.cellGroupName(ahs.cells)}}`;
    const bridge = contacts.map(contact => {
      const byAlsCell = new Map();
      for (const [left, right] of contact.pairs) {
        if (!byAlsCell.has(left)) byAlsCell.set(left, []);
        byAlsCell.get(left).push(right);
      }
      return `${contact.digit}:${[...byAlsCell].map(([left, right]) =>
        `${core.cellName(left)}-${core.cellGroupName(right)}`).join('/')}`;
    }).join(', ');
    return `ALC - XZ: ${alsName} + ${ahsName} [NAND ${bridge}] => ${core.formatRemovals(chain.eliminations)}`;
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
    const maxAlsCells = Math.min(5, Math.max(1, options.maxAlsCells ?? 4));
    const maxAhsDigits = Math.min(5, Math.max(2, options.maxAhsDigits ?? 4));
    const maxAhsCells = Math.min(7, Math.max(3, options.maxAhsCells ?? 5));
    const maxAhsDof = Math.min(5, Math.max(1, options.maxAhsDof ?? 3));
    const maxChains = Math.max(1, options.maxChains ?? 500);
    const alsList = (options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: maxAlsCells - 1, maxSizeFox: maxAlsCells,
      searchLimit: true,
    })).filter(als => als.alsDOF === 1 && als.alsAllCells.length <= maxAlsCells);
    const ahsList = (options.ahsList || core.ahsConstructor(cand, {
      maxSize: maxAhsDigits - 1, maxSizeFox: maxAhsCells - 1,
      searchLimit: false,
    })).filter(ahs => ahs.ahsDOF >= 1 && ahs.ahsDOF <= maxAhsDof
      && ahs.ahsDigits.length <= maxAhsDigits
      && ahs.ahsAllCells.length <= maxAhsCells);
    const masks = exclusionMasks(cand);
    const alsAlone = new Map();
    const ahsAlone = new Map();
    const chains = [];
    const seen = new Set();
    let pairsChecked = 0;
    let compatiblePairs = 0;
    let truncated = false;

    outer: for (const als of alsList) {
      for (const ahs of ahsList) {
        if (als.alsAllCells.some(cell => ahs.ahsAllCells.includes(cell))) continue;
        const contacts = sharedDigitContacts(cand, als, ahs);
        if (!contacts.length) continue;
        pairsChecked++;
        const both = placementEliminations(cand, masks, als, ahs);
        if (both === null) continue;
        compatiblePairs++;
        if (!alsAlone.has(als.uniqueID)) {
          alsAlone.set(als.uniqueID, placementEliminations(cand, masks, als));
        }
        if (!ahsAlone.has(ahs.uniqueID)) {
          ahsAlone.set(ahs.uniqueID, placementEliminations(cand, masks, null, ahs));
        }
        const newEliminations = both & ~(alsAlone.get(als.uniqueID) | ahsAlone.get(ahs.uniqueID));
        if (!newEliminations) continue;
        const eliminations = [];
        for (let cell = 0; cell < 81; cell++) {
          for (const digit of cand[cell] || []) {
            if (newEliminations & (1n << BigInt(candidateIndex(cell, digit)))) {
              eliminations.push({ cell, digit });
            }
          }
        }
        if (!eliminations.length) continue;
        const key = `${als.alsAllCells.join(',')}|${als.alsDigits.join('')}|${ahs.ahsSector}|${ahs.ahsDigits.join('')}|${eliminations.map(item => `${item.cell}:${item.digit}`).join(',')}`;
        if (seen.has(key)) continue;
        seen.add(key);
        chains.push({
          length: 2,
          structureName: 'ALC - XZ',
          structureFamily: 'ALC',
          isRing: false,
          eliminations,
          steps: resultSteps(als, ahs),
          alcXz: {
            als: { cells: [...als.alsAllCells], digits: [...als.alsDigits], sector: als.alsSector },
            ahs: { cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits], sector: ahs.ahsSector },
            contacts,
          },
        });
        if (chains.length >= maxChains) { truncated = true; break outer; }
      }
    }
    // Do not fold ordinary bivalve/AIC walks into ALC-XZ.  ALC-XZ is the
    // two-module mixed rule: one ALS and one AHS.  The generic AIC engine
    // already owns bivalve paths, including those that happen to touch an
    // AHS link, and reporting them here creates illegal ALC eliminations.
    const allChains = chains;
    return {
      chains: allChains, technique: 'ALC-XZ',
      stats: { alsNodes: alsList.length, ahsNodes: ahsList.length,
        maxAlsCells, maxAhsDigits, maxAhsCells, maxAhsDof,
        pairsChecked, compatiblePairs, chainsFound: allChains.length, truncated },
    };
  }

  function findAlcXy(cand, options = {}) {
    if (typeof core.findAicChains !== 'function' || typeof core.buildStrongLinks !== 'function') {
      return { chains: [], technique: 'ALC-XY', stats: {} };
    }
    const chainMode = options.mode === 'chain';
    const strongLinkSet = options.strongLinkSet || core.buildStrongLinks(cand);
    const alsList = options.alsList || core.alsConstructor(cand, {
      maxSizeDOF: options.maxAlsCells ?? 4,
      maxSizeFox: options.maxAlsCells ?? 5,
      searchLimit: true,
    });
    const ahsList = options.ahsList || core.ahsConstructor(cand, {
      maxSize: options.maxAhsDigits ?? 4,
      maxSizeFox: options.maxAhsCells ?? 5,
      searchLimit: true,
    });
    const report = core.findAicChains(cand, {
      candidateGrid: cand,
      strongLinkSet,
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
        nodeFamilies: [...new Set((chain.steps || []).map(step => step.view.node.family))],
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
      const module = step.view?.node?.module;
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
      const key = `${rootMatch.type}|${chain.steps.map(step => step.view.node.graphId).join('|')}|${(chain.eliminations || []).map(item => `${item.cell}:${item.digit}`).join(',')}`;
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
