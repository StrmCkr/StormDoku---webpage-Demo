/* StormDoku solver phase eligibility rules. */
(function installSolverPhase(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function allowsType(phase, enabledTypes, spec, fishMoveType) {
    if (phase.kind === 'als-dof') return ['als-dof', 'dds', 'adds'].some(type => enabledTypes.has(type));
    if (phase.kind === 'ahs-dof') return enabledTypes.has('ahs-dof');
    if (phase.kind === 'als-dof-chain') return enabledTypes.has('als-dof-chain');
    if (phase.kind === 'ahs-dof-chain') return enabledTypes.has('ahs-dof-chain');
    if (phase.kind === 'msls') return enabledTypes.has('msls');
    if (phase.kind === 'chain') {
      return phase.requiredTypes.every(type => enabledTypes.has(type))
        || (phase.requiredTypes.includes('chains')
          && phase.requiredTypes.slice(1).some(type => enabledTypes.has(type))
          && enabledTypes.has('chains'));
    }
    if (phase.kind === 'alc') return enabledTypes.has('alc-' + phase.alcType);
    if (spec?.kind === 'fish') {
      return (spec.k || [0]).some(k => (spec.categories || ['Basic'])
        .some(category => enabledTypes.has(fishMoveType(spec, k, category))));
    }
    return enabledTypes.has(spec?.type);
  }

  function basicMoveType(size) {
    return size === 2 ? 'x-wing' : size === 3 ? 'swordfish'
      : size === 4 ? 'jellyfish' : `${size}x${size}-fish`;
  }

  function fishSizes(enabledTypes, maxFishSize, basicMoveType) {
    return Array.from({ length: 8 }, (_, index) => index + 2)
      .filter(size => size <= maxFishSize)
      .filter(size => enabledTypes.has(basicMoveType(size))
        || enabledTypes.has(`${size}x${size}+k-fish`));
  }

  function fishOptions(candidateGrid, fixedGrid, enabledTechniques, pomOptions,
    omissionFishSearch, sizes) {
    return {
      ...pomOptions,
      grid: [...fixedGrid],
      omissionFishSearch,
      enabledTechniques,
      fishSizes: sizes,
    };
  }

  function moveType(spec, k, category = 'Basic', basicMoveType) {
    if (category === 'Basic' && k === 0) return basicMoveType(spec.size);
    return `${spec.size}x${spec.size}+k-fish`;
  }

  function minimumRating(phase) {
    if (phase?.name === 'strong-all') return 2.25;
    if (phase?.name === 'strong-depth-2-0-3') return 2.25;
    if (phase?.name === 'strong-depth-3-0-3') return 3.25;
    if (phase?.name === 'strong-depth-4-0-3') return 4.25;
    if (phase?.name === 'strong-depth-5-plus') return 5.25;
    if (phase?.name === 'generic-aic-depth-5-plus') return 5.25;
    if (phase?.name === 'aic-full-depth') return 4.25;
    if (phase?.family === 'barns') {
      const size = Number(phase.barnsSize);
      if (size >= 6) return 6;
      if (size >= 5) return 5;
      return 3.25;
    }
    if (phase?.family === 'barns-transport') return Number(phase.barnsSize) >= 5 ? 6 : 4.75;
    if (phase?.name === 'moderate-als-xz') return 3.25;
    if (phase?.family === 'als-xz' || phase?.family === 'ahs-xz' || phase?.family === 'alc-xz') return 7;
    if (phase?.family === 'als-xy' || phase?.family === 'ahs-xy') return 8;
    if (phase?.family === 'als-chain' || phase?.family === 'ahs-chain') return 10;
    if (phase?.family === 'alc-xy') return 8.5;
    if (phase?.family === 'alc-chain') return 10.5;
    if (phase?.family === 'alc-dof') return 12.5;
    if (phase?.family === 'aic-als') return 11;
    return 0;
  }

  function depthForCeiling(phase, ceiling) {
    const numericCeiling = Number(ceiling);
    if (!Number.isFinite(numericCeiling) || phase?.name !== 'strong-all') return phase?.maxDepth;
    return Math.min(
      phase.maxDepth,
      Math.max(2, Math.floor(numericCeiling - 0.25 + 1e-9)),
    );
  }

  function alsMaxDigits(phase, profile = null) {
    if (!phase?.includeAls) return null;
    const configured = Number(profile?.alsMaxDigits);
    const phaseLimit = Number(phase?.alsMaxDigits);
    if (Number.isInteger(configured) && configured > 0) return configured;
    if (Number.isInteger(phaseLimit) && phaseLimit > 0) return phaseLimit;
    return null;
  }

  function alsDigitPasses(phase, profile = null, budget = 'interactive') {
    const maxDigitsForPhase = alsMaxDigits(phase, profile);
    if (maxDigitsForPhase == null) return [null];
    return Array.from({ length: maxDigitsForPhase - 1 }, (_, index) => index + 2);
  }

  function ahsMaxDigits(phase, profile = null, nodeLimits = () => ({})) {
    if (!phase?.includeAhs) return null;
    const configured = Number(profile?.ahsMaxDigits);
    const selected = Number(nodeLimits('chain').ahsMaxDigits);
    if (phase?.fullFoxRange) {
      return Math.min(8, Number.isInteger(configured) && configured >= 2
        ? configured : Number.isInteger(selected) && selected >= 2 ? selected : 8);
    }
    const phaseLimit = Number(phase?.ahsMaxDigits);
    const values = [configured, phaseLimit, selected]
      .filter(value => Number.isInteger(value) && value >= 2);
    return values.length ? Math.min(9, ...values) : null;
  }

  function ahsMaxCells(phase, profile = null, nodeLimits = () => ({})) {
    if (!phase?.includeAhs) return null;
    const values = [Number(profile?.ahsMaxCells), Number(phase?.ahsMaxCells),
      Number(nodeLimits('chain').ahsMaxCells)]
      .filter(value => Number.isInteger(value) && value >= 2);
    return values.length ? Math.min(9, ...values) : null;
  }

  function ahsCellPasses(phase, profile = null, nodeLimits = () => ({})) {
    const maxDigits = ahsMaxDigits(phase, profile, nodeLimits);
    if (maxDigits == null) return [null];
    return Array.from({ length: maxDigits - 1 }, (_, index) => index + 2);
  }

  function alsMaxCells(phase, profile = null, nodeLimits = () => ({})) {
    if (!phase?.includeAls) return null;
    const values = [Number(profile?.alsMaxCells), Number(phase?.alsMaxCells),
      Number(nodeLimits('chain').alsMaxCells)]
      .filter(value => Number.isInteger(value) && value >= 2);
    return values.length ? Math.min(9, ...values) : null;
  }

  function alsMinimumNodeCount(phase) {
    if (phase?.family === 'als-xy') return 3;
    if (phase?.family === 'als-chain') return 4;
    return 2;
  }

  function searchPasses(phase, profile = null, budget = 'interactive', {
    alsCellPasses,
    ahsCellPasses,
    ahsMaxCells,
  } = {}) {
    const alsPasses = alsCellPasses(phase, profile);
    const ahsPasses = ahsCellPasses(phase, profile);
    const hasAls = alsPasses.some(value => value != null);
    const hasAhs = ahsPasses.some(value => value != null);
    const maxCells = ahsMaxCells(phase, profile);
    const ahsCellsForDigits = digits => maxCells == null
      ? null
      : Math.min(9, digits + 3, maxCells);
    if (!hasAls || !hasAhs) {
      const values = hasAls ? alsPasses : ahsPasses;
      return values.map(value => ({
        alsMaxDigits: null,
        alsCellCounts: hasAls ? alsPasses.filter(item => item <= value) : null,
        ahsMaxDigits: hasAhs ? value : null,
        ahsMaxCells: hasAhs ? ahsCellsForDigits(value) : null,
      }));
    }

    const maxBreadth = Math.max(
      alsPasses[alsPasses.length - 1],
      ahsPasses[ahsPasses.length - 1],
    );
    return Array.from({ length: maxBreadth - 1 }, (_, index) => index + 2)
      .map(breadth => ({
        alsMaxDigits: null,
        alsCellCounts: alsPasses.filter(item => item <= breadth),
        ahsMaxDigits: ahsPasses.includes(breadth)
          ? breadth
          : ahsPasses[ahsPasses.length - 1],
        ahsMaxCells: ahsCellsForDigits(ahsPasses.includes(breadth)
          ? breadth
          : ahsPasses[ahsPasses.length - 1]),
      }))
      .filter((pass, index, passes) => index === 0
        || pass.alsCellCounts.join(',') !== passes[index - 1].alsCellCounts.join(',')
        || pass.ahsMaxDigits !== passes[index - 1].ahsMaxDigits);
  }

  function alsCellPasses(phase, profile = null, nodeLimits = () => ({})) {
    if (!phase?.includeAls) return [null];
    if (phase?.fullFoxRange) {
      const configured = Number(profile?.alsMaxCells);
      const selected = Number(nodeLimits('chain').alsMaxCells);
      const maxCells = Math.min(8, Number.isInteger(configured) && configured >= 2
        ? configured
        : Number.isInteger(selected) && selected >= 2 ? selected : 8);
      return Array.from({ length: Math.max(0, maxCells - 1) }, (_, index) => index + 2);
    }
    const configured = Number(profile?.alsMaxCells);
    const phaseLimit = Number(phase?.alsMaxCells);
    const configuredMax = Number.isInteger(configured) && configured >= 2 ? Math.min(9, configured) : null;
    const phaseMax = Number.isInteger(phaseLimit) && phaseLimit >= 2 ? Math.min(9, phaseLimit) : null;
    const maxCells = Math.min(nodeLimits('chain').alsMaxCells ?? 9, configuredMax ?? phaseMax ?? 9);
    if (phase?.alsCellCount != null) return [Number(phase.alsCellCount)];
    if (Array.isArray(phase?.alsCellCounts) && phase.alsCellCounts.length) {
      return [...new Set(phase.alsCellCounts.map(Number))].sort((a, b) => a - b);
    }
    return Array.from({ length: Math.max(0, maxCells - 1) }, (_, index) => index + 2);
  }

  function chainPhasePlan(maxDepth, profile = null, phasePlanner = () => []) {
    const phases = phasePlanner(maxDepth, profile);
    const firstStrongIndex = phases.findIndex(phase => phase.name.startsWith('strong-'));
    if (firstStrongIndex < 0) return phases;

    const strongLinkTypes = [...new Set(
      phases
        .filter(phase => phase.name.startsWith('strong-'))
        .flatMap(phase => phase.strongLinkTypes),
    )].sort((left, right) => left - right);
    if (!strongLinkTypes.length) return phases;

    return [
      ...phases.slice(0, firstStrongIndex),
      {
        name: 'strong-all',
        includeAls: false,
        strongLinkTypes,
        maxDepth: Math.min(maxDepth, profile?.maxDepth || maxDepth),
        requireAls: false,
        requireMixed: false,
        minDepth: null,
        family: null,
      },
      ...phases.slice(firstStrongIndex).filter(phase => !phase.name.startsWith('strong-')),
    ];
  }

  function phaseProfile(profile, phase) {
    const selectedStrongTypes = Array.isArray(profile?.interactiveStrongLinkTypes)
      ? new Set(profile.interactiveStrongLinkTypes)
      : null;
    const phaseStrongTypes = Array.isArray(phase.strongLinkTypes)
      ? phase.strongLinkTypes
      : [];
    const configuredDepth = Number(profile?.interactiveMaxDepth);
    return {
      ...(profile || {}),
      includeAlsRcc: phase.includeAls === true
        && profile?.interactiveIncludeAls !== false,
      includeAhs: phase.includeAhs === true
        && profile?.interactiveIncludeAhs !== false,
      ahsMaxCells: phase.ahsMaxCells ?? profile?.ahsMaxCells ?? null,
      strongLinkTypes: selectedStrongTypes
        ? phaseStrongTypes.filter(type => selectedStrongTypes.has(type))
        : phaseStrongTypes,
      maxDepth: Number.isInteger(configuredDepth)
        ? Math.min(phase.maxDepth, configuredDepth)
        : phase.maxDepth,
    };
  }

  function alsNodeCount(chain, moduleSubsets = () => []) {
    const nodes = new Set();
    for (const step of chain?.steps || []) {
      if (step.family !== 'ALS' || step.linkTypeName !== 'ALS_RCC') continue;
      for (const subset of moduleSubsets(step.module)) {
        if (!subset) continue;
        nodes.add([
          subset.id ?? '',
          (subset.cells || []).join(','),
          (subset.digits || []).join(''),
        ].join('|'));
      }
    }
    return nodes.size;
  }

  function matchesSearchPhase(chain, phase, {
    chainUniqueDigitCount,
    chainModuleSubsets,
    barnsTransportChainInfo,
    barnsChainInfo,
    chainMoveKeys,
    alsSizeOneChainInfo,
  } = {}) {
    const alsSteps = (chain?.steps || []).filter(step => step.family === 'ALS');
    const ahsSteps = (chain?.steps || []).filter(step => step.family === 'AHS');
    const alcSteps = (chain?.steps || []).filter(step => step.family === 'ALC');
    if (phase?.includeAls !== true && (alsSteps.length || alcSteps.length)) return false;
    if (phase?.includeAhs !== true && (ahsSteps.length || alcSteps.length)) return false;
    if (phase.requireAls && !alsSteps.length) return false;
    if (phase.minDepth != null && Number(chain?.length) < phase.minDepth) return false;
    if (phase.maxDepth != null && Number(chain?.length) > phase.maxDepth) return false;
    if (phase.singleDigitOnly && chainUniqueDigitCount(chain) !== 1) return false;
    if (phase.genericAicOnly
      && (!/^AIC(?:\s*\+\s*(?:ALS|AHS|ALC))?$/i.test(String(chain?.structureName || '').trim())
        || chainUniqueDigitCount(chain) <= 1)) return false;
    if (phase.requireMixed
      && (!alsSteps.length || !(chain?.steps || []).some(step => step.family === 'SL'))) return false;
    if (phase.alsCellCount != null || Array.isArray(phase.alsCellCounts)) {
      const allowed = phase.alsCellCount != null
        ? new Set([phase.alsCellCount])
        : new Set(phase.alsCellCounts.map(Number));
      if (alsSteps.some(step => {
        const [entrySubset, exitSubset] = chainModuleSubsets(step.module);
        const entrySize = (entrySubset?.cells || []).length;
        const exitSize = (exitSubset?.cells || []).length;
        return !allowed.has(entrySize) && !allowed.has(exitSize);
      })) return false;
    }

    const alsCount = alsNodeCount(chain, chainModuleSubsets);
    if (phase.minAlsNodes != null && alsCount < phase.minAlsNodes) return false;

    if (phase.barnsSize != null) {
      const info = phase.family === 'barns-transport'
        ? barnsTransportChainInfo(chain)
        : barnsChainInfo(chain);
      if (!info || info.sizeName.length !== phase.barnsSize) return false;
    }

    const keys = chainMoveKeys(chain);
    if (Array.isArray(phase.allowedMoveKeys)
      && !phase.allowedMoveKeys.some(key => keys.has(key))) return false;
    if (Array.isArray(phase.allowedMoveGroups)
      && !phase.allowedMoveGroups.some(group => group.some(key => keys.has(key)))) return false;
    if (!phase.family && ['ahs-xz', 'ahs-xy', 'ahs-chain'].some(key => keys.has(key))) return false;
    if (!phase.family) return true;
    if (phase.family === 'barns') return keys.has('barns');
    if (phase.family === 'barns-transport') return keys.has('barns-transport');
    if (phase.family === 'als-named') return keys.has('als-named');
    if (phase.family === 'ahs-named') return keys.has('ahs-named');
    if (phase.family === 'alc-named') return keys.has('alc-named');
    if (phase.family === 'als-xz') {
      return keys.has('als-xz') || keys.has('t-als-xz')
        || keys.has('als-named') || alsCount === 2;
    }
    if (phase.family === 'ahs-xz') return keys.has('ahs-xz');
    if (phase.family === 'alc-xz') return keys.has('alc-xz');
    if (phase.family === 'als-xy') {
      const sizeOne = alsSizeOneChainInfo(chain);
      return keys.has('als-xy')
        || keys.has('t-als-xy')
        || alsCount === 3
        || sizeOne?.breakdown === 'XY-Wing';
    }
    if (phase.family === 'ahs-xy') return keys.has('ahs-xy');
    if (phase.family === 'alc-xy') return keys.has('alc-xy');
    if (phase.family === 'als-chain') return keys.has('als-chain') || alsCount > 3;
    if (phase.family === 'ahs-chain') return keys.has('ahs-chain');
    if (phase.family === 'alc-chain') return keys.has('alc-chain');
    if (phase.family === 'alc-dof') return keys.has('alc-dof');
    if (phase.family === 'aic-als') return keys.has('aic-als') || keys.has('als-named') || keys.has('w-transport');
    return true;
  }

  function phaseTechniqueOrder(chain, phase, chainMoveKeys, moveTieOrder) {
    if (Array.isArray(phase?.allowedMoveGroups) && phase.allowedMoveGroups.length) {
      const keys = chainMoveKeys(chain);
      const groupIndex = phase.allowedMoveGroups.findIndex(
        group => group.some(key => keys.has(key)),
      );
      return groupIndex >= 0 ? groupIndex : Number.POSITIVE_INFINITY;
    }
    if (!Array.isArray(phase?.allowedMoveKeys) || !phase.allowedMoveKeys.length) {
      return moveTieOrder(chain, null);
    }
    const keys = chainMoveKeys(chain);
    const index = phase.allowedMoveKeys.findIndex(key => keys.has(key));
    return index >= 0 ? index : Number.POSITIVE_INFINITY;
  }

  function chainMoveEnabled(chain, enabledTypes, moveKeys, solverMoveTypeKeys) {
    if (!enabledTypes.has('chains')) return false;
    const classKeys = [...moveKeys(chain)].filter(key => solverMoveTypeKeys.has(key));
    return !classKeys.length || classKeys.some(key => enabledTypes.has(key));
  }

  function alsPassCanStop() {
    return false;
  }

  function ahsPassCanStop() {
    return false;
  }

  app.solverPhase = {
    allowsType, basicMoveType, fishSizes, fishOptions, moveType,
    minimumRating, depthForCeiling, alsMaxDigits, alsDigitPasses,
    ahsMaxDigits, ahsMaxCells, ahsCellPasses, alsMaxCells, alsMinimumNodeCount,
    searchPasses, alsCellPasses, chainPhasePlan, phaseProfile, alsNodeCount, matchesSearchPhase,
    phaseTechniqueOrder,
    chainMoveEnabled,
    alsPassCanStop,
    ahsPassCanStop,
  };
})(window);
