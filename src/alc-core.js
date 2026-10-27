(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core?.alsConstructor || !core?.ahsConstructor) {
    throw new Error('ALS and AHS constructors must load before alc-core.js');
  }

  function isMixedAlcChain(chain) {
    const families = new Set((chain?.steps || [])
      .map(step => step.family ?? step.view?.node?.family)
      .filter(Boolean));
    return families.has('ALS') && families.has('AHS');
  }

  function subsetKey(subset) {
    if (!subset) return null;
    const cells = [...(subset.cells || subset.alsAllCells || subset.ahsAllCells || [])]
      .map(Number).sort((a, b) => a - b).join(',');
    const digits = [...(subset.digits || subset.alsDigits || subset.ahsDigits || [])]
      .map(Number).sort((a, b) => a - b).join('');
    return `${cells}|${digits}`;
  }

  function expandedAlcNodeCount(steps) {
    const nodes = new Set();
    for (const step of steps || []) {
      const module = step.module || step.view?.node?.module;
      const subsets = module
        ? [module.entrySubset, module.exitSubset]
        : [step.entry, step.exit];
      for (const subset of subsets) {
        const key = subsetKey(subset);
        if (key) nodes.add(key);
      }
    }
    return nodes.size;
  }

  function isBasicAlcXzSteps(steps) {
    return steps.length === 2
      && steps.some(step => (step.family ?? step.view?.node?.family) === 'ALS')
      && steps.some(step => (step.family ?? step.view?.node?.family) === 'AHS')
      && expandedAlcNodeCount(steps) === 2;
  }

  const candidateKey = (cell, digit) => `${cell}:${digit}`;
  const sees = (left, right) => left !== right && core.peersOf(left).includes(right);

  // ALC-XZ is a direct two-module proof: one ALS and one AHS.  Keep its
  // completion check independent from the longer ALC graph walker so a valid
  // pair cannot be lost to graph breadth, RCC endpoint orientation, or a
  // later chain classifier.
  function placementEliminations(cand, als = null, ahs = null, work = null) {
    const variables = [];
    if (als) {
      for (const cell of als.alsAllCells || []) {
        variables.push((cand[cell] || []).map(digit => ({ cell, digit })));
      }
    }
    if (ahs) {
      for (const digit of ahs.ahsDigits || []) {
        variables.push((ahs.ahsAllCells || [])
          .filter(cell => (cand[cell] || []).includes(digit))
          .map(cell => ({ cell, digit })));
      }
    }
    if (variables.some(choices => !choices.length)) return null;
    variables.sort((left, right) => left.length - right.length);
    let common = null;
    let completions = 0;
    const assigned = [];

    const visit = (index, excluded) => {
      if (work && work.statesVisited >= work.maxStates) {
        work.exhausted = true;
        return;
      }
      if (work) work.statesVisited += 1;
      if (index === variables.length) {
        common = common === null
          ? new Set(excluded)
          : new Set([...common].filter(key => excluded.has(key)));
        completions += 1;
        return;
      }
      for (const choice of variables[index]) {
        if (assigned.some(previous =>
          (choice.cell === previous.cell && choice.digit !== previous.digit)
          || (choice.digit === previous.digit && sees(choice.cell, previous.cell)))) continue;
        assigned.push(choice);
        const nextExcluded = new Set(excluded);
        for (const digit of cand[choice.cell] || []) {
          if (digit !== choice.digit) nextExcluded.add(candidateKey(choice.cell, digit));
        }
        for (const peer of core.peersOf(choice.cell)) {
          if ((cand[peer] || []).includes(choice.digit)) {
            nextExcluded.add(candidateKey(peer, choice.digit));
          }
        }
        visit(index + 1, nextExcluded);
        assigned.pop();
        if (work?.exhausted || common?.size === 0) return;
      }
    };

    visit(0, new Set());
    return !work?.exhausted && completions ? common : null;
  }

  function sharedDigitContacts(cand, als, ahs) {
    const contacts = [];
    for (const digit of als.alsDigits || []) {
      if (!(ahs.ahsDigits || []).includes(digit)) continue;
      const alsCells = (als.alsAllCells || []).filter(cell => (cand[cell] || []).includes(digit));
      const ahsCells = (ahs.ahsAllCells || []).filter(cell => (cand[cell] || []).includes(digit));
      const pairs = alsCells.flatMap(left => ahsCells
        .filter(right => sees(left, right))
        .map(right => [left, right]));
      // An RCC is not merely a shared digit with one touching pair. Every
      // occurrence of the digit in one set must see every occurrence in the
      // other set. Other shared digits are ordinary Z/common digits.
      const restricted = alsCells.length > 0
        && ahsCells.length > 0
        && alsCells.every(left => ahsCells.every(right => sees(left, right)));
      if (pairs.length) contacts.push({ digit, pairs, restricted });
    }
    return contacts;
  }

  function sharedDigits(cand, als, ahs) {
    return (als.alsDigits || []).filter(digit => {
      if (!(ahs.ahsDigits || []).includes(digit)) return false;
      const alsCells = (als.alsAllCells || []).filter(cell => (cand[cell] || []).includes(digit));
      const ahsCells = (ahs.ahsAllCells || []).filter(cell => (cand[cell] || []).includes(digit));
      return alsCells.length > 0 && ahsCells.length > 0
        && alsCells.some(left => ahsCells.some(right => sees(left, right)));
    });
  }

  function directAlcSteps(cand, als, ahs) {
    const sideFor = (cells, digits, side) => ({
      side,
      cells: [...cells],
      digits: [...digits],
      // ALS/AHS digit lists are unions. Preserve the actual cell membership
      // for the UI so Eureka and the overlay never paint a union digit into a
      // cell where it is not a candidate.
      digitsByCell: Object.fromEntries([...cells].map(cell => [
        String(cell), (cand[cell] || []).filter(digit => digits.includes(digit)),
      ])),
    });
    return [
      {
        family: 'ALS', linkType: 5, linkTypeName: 'ALS_RCC', linkId: als.uniqueID,
        direction: 'F', originSectors: [als.alsSector],
        entry: sideFor(als.alsAllCells, als.alsDigits, 'left'),
        exit: sideFor(als.alsAllCells, als.alsDigits, 'right'),
      },
      {
        family: 'AHS', linkType: 6, linkTypeName: 'AHS_RCC', linkId: ahs.uniqueID,
        direction: 'F', originSectors: [ahs.ahsSector],
        entry: sideFor(ahs.ahsAllCells, ahs.ahsDigits, 'left'),
        exit: sideFor(ahs.ahsAllCells, ahs.ahsDigits, 'right'),
      },
    ];
  }

  function formatAlcXz(chain) {
    const { als, ahs, contacts } = chain.alcXz;
    const alsSideData = chain.steps?.[0]?.entry;
    const ahsSideData = chain.steps?.[1]?.entry;
    const validContacts = (contacts || []).map(contact => ({
      ...contact,
      pairs: (contact.pairs || []).filter(pair =>
        (alsSideData?.digitsByCell?.[String(pair[0])] || als.digits).includes(Number(contact.digit))
        && (ahsSideData?.digitsByCell?.[String(pair[1])] || ahs.digits).includes(Number(contact.digit))),
    })).filter(contact => contact.pairs.length);
    const restrictedDisplayContacts = validContacts.filter(contact => contact.restricted);
    const displayContacts = restrictedDisplayContacts.length
      ? restrictedDisplayContacts.slice(0, 1)
      : validContacts.slice(0, 1);
    const rccDigits = [...new Set(displayContacts.map(contact => Number(contact.digit)))]
      .filter(Number.isInteger)
      .sort((left, right) => left - right);
    const alsRccCells = [...new Set(displayContacts.flatMap(contact =>
      (contact.pairs || []).map(pair => pair[0])))].sort((left, right) => left - right);
    const ahsRccCells = [...new Set(displayContacts.flatMap(contact =>
      (contact.pairs || []).map(pair => pair[1])))].sort((left, right) => left - right);
    const alsSide = `(${als.digits.join('')})${core.cellGroupName(als.cells)}`;
    // An AHS RCC is a restricted cell/contact in the hidden set. It reduces
    // the AHS degree of freedom by a cell; it does not remove the RCC digit
    // from the AHS digit label as it would from an ALS digit expression.
    const ahsSide = `(${ahs.digits.join('')})${core.cellGroupName(ahs.cells)}`;
    const leftRcc = `(${rccDigits.join('') || '?'})${core.cellGroupName(alsRccCells)}`;
    const rightRcc = `(${rccDigits.join('') || '?'})${core.cellGroupName(ahsRccCells)}`;
    const name = chain.isRing ? 'ALC - XZ Ring' : 'ALC - XZ';
    const closure = chain.isRing ? ' - ring' : '';
    return `${name}: ${alsSide} = ${leftRcc} - ${rightRcc} = ${ahsSide}${closure} => ${core.formatRemovals(chain.eliminations)}`;
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
        // ALC is specifically the mixed ALS/AHS bridge.  An AHS+AHS walk
        // with a bivalent/grouped link belongs to the AHS/AIC engines and
        // must not be relabeled as ALC-XZ.
        && steps.some(step => step.view.node.family === 'ALS')
        && steps.some(step => step.view.node.family === 'AHS')
        && steps.some(step => step.view.node.family === 'SL' && step.view.node.linkType === 4)
        && (steps.length === 2 || steps.some(step => step.view.node.family === 'SL'
          && [0, 1].includes(step.view.node.linkType))),
    });
    return {
      ...report,
      chains: (report.chains || []).filter(isMixedAlcChain).map(chain => ({
        ...chain,
        structureName: chain.isRing ? 'ALC - XZ Ring' : 'ALC - XZ',
        structureFamily: 'ALC',
      })),
    };
  }

  function findAlcXz(cand, options = {}) {
    const maxAlsCells = Math.min(8, Math.max(1, options.maxAlsCells ?? 4));
    const maxAhsDigits = Math.min(8, Math.max(1, options.maxAhsDigits ?? 4));
    const maxAhsCells = Math.min(9, Math.max(2, options.maxAhsCells ?? 5));
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
    })).filter(als => als.alsDOF === 1 && als.alsAllCells.length <= maxAlsCells)
      .sort((left, right) => left.alsAllCells.length - right.alsAllCells.length
        || left.alsDigits.length - right.alsDigits.length);
    const allAhs = (options.ahsList || core.ahsConstructor(cand, {
      maxSize: ahsMaxSize, maxSizeFox: ahsMaxFox,
      searchLimit: false,
    })).filter(ahs => ahs.ahsDOF >= 1 && ahs.ahsDOF <= maxAhsDof
      && ahs.ahsDigits.length <= maxAhsDigits
      && ahs.ahsAllCells.length <= maxAhsCells)
      .sort((left, right) => left.ahsDigits.length - right.ahsDigits.length
        || left.ahsAllCells.length - right.ahsAllCells.length);
    const maxChains = Math.max(1, options.maxChains ?? 500);
    const work = {
      maxStates: Number.isInteger(options.maxStates) ? Math.max(1, options.maxStates) : Infinity,
      statesVisited: 0,
      exhausted: false,
    };
    const alsAlone = new Map();
    const ahsAlone = new Map();
    const chains = [];
    const seen = new Set();
    let pairsChecked = 0;
    let compatiblePairs = 0;

    outer: for (const als of allAls) {
      for (const ahs of allAhs) {
        if (work.statesVisited >= work.maxStates) {
          work.exhausted = true;
          break outer;
        }
        work.statesVisited += 1;
        if ((als.alsAllCells || []).some(cell => (ahs.ahsAllCells || []).includes(cell))) continue;
        const contacts = sharedDigitContacts(cand, als, ahs);
        const commonDigits = sharedDigits(cand, als, ahs);
        // A direct ring needs a contact and a second shared digit. The contact
        // may be witnessed in either traversal direction; do not require the
        // stricter all-to-all RCC test here because the placement proof below
        // is the authority for this ALC ring form.
        if (!contacts.length || commonDigits.length < 2) continue;
        pairsChecked += 1;
        const both = placementEliminations(cand, als, ahs, work);
        if (work.exhausted) break outer;
        if (!both) continue;
        compatiblePairs += 1;
        if (!alsAlone.has(als.uniqueID)) alsAlone.set(als.uniqueID, placementEliminations(cand, als, null, work));
        if (!ahsAlone.has(ahs.uniqueID)) ahsAlone.set(ahs.uniqueID, placementEliminations(cand, null, ahs, work));
        if (work.exhausted) break outer;
        const alone = new Set([
          ...(alsAlone.get(als.uniqueID) || []),
          ...(ahsAlone.get(ahs.uniqueID) || []),
        ]);
        const newEliminations = [...both].filter(key => !alone.has(key));
        const eliminations = newEliminations.map(key => {
          const [cell, digit] = key.split(':').map(Number);
          return { cell, digit };
        }).filter(item => (cand[item.cell] || []).includes(item.digit));
        if (!eliminations.length) continue;
        const key = `${als.alsAllCells.join(',')}|${als.alsDigits.join('')}|${ahs.ahsSector}|${ahs.ahsDigits.join('')}|${eliminations.map(item => `${item.cell}:${item.digit}`).join(',')}`;
        if (seen.has(key)) continue;
        seen.add(key);
        chains.push({
          length: 2,
          // A direct two-module XZ has two reciprocal RCC contacts.  The
          // proof closes back through the second contact, so it is a ring;
          // leaving this open made Eureka render each module as a self-edge
          // such as (459=459) and omitted the closure marker.
          structureName: 'ALC - XZ Ring',
          structureFamily: 'ALC',
          isRing: true,
          eliminations,
          steps: directAlcSteps(cand, als, ahs),
          alcXz: {
            als: { cells: [...als.alsAllCells], digits: [...als.alsDigits], sector: als.alsSector },
            ahs: { cells: [...ahs.ahsAllCells], digits: [...ahs.ahsDigits], sector: ahs.ahsSector },
            contacts,
          },
        });
        if (chains.length >= maxChains) break outer;
      }
    }

    options.onProgress?.({ stage: 'complete', statesVisited: work.statesVisited });
    return {
      chains,
      technique: 'ALC-XZ',
      stats: {
        alsNodes: allAls.length,
        ahsNodes: allAhs.length,
        maxAlsCells, maxAhsDigits, maxAhsCells, maxAhsDof,
        alsMaxSizeDOF, alsMaxSizeFox, ahsMaxSize, ahsMaxFox,
        pairsChecked, compatiblePairs, chainsFound: chains.length,
        truncated: work.exhausted || chains.length >= maxChains,
        statesVisited: work.statesVisited,
        stopReason: work.exhausted ? 'maxStates' : chains.length >= maxChains ? 'maxChains' : null,
      },
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
        if (steps.length < 3
          && !(chainMode && steps.length === 2 && expandedAlcNodeCount(steps) >= 3)) {
          return false;
        }
        const hasAls = steps.some(step => step.view.node.family === 'ALS');
        const hasAhs = steps.some(step => step.view.node.family === 'AHS');
        if (!hasAls || !hasAhs) return false;
        if (chainMode && steps.some(step => !['ALS', 'AHS'].includes(step.view.node.family))) {
          return false;
        }
        // ALC-XY is valid as an open three-step chain; it does not require a
        // closing bridge or three distinct graph IDs. ALC-Chain retains the
        // expanded-node guard for its two-link modular form.
        const graphNodeCount = new Set(steps.map(step => step.view.node.graphId)).size;
        return !chainMode
          || graphNodeCount >= 3
          || (steps.length === 2 && expandedAlcNodeCount(steps) >= 3);
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
