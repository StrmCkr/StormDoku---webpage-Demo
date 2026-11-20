/* StormDoku chain-search inventory and worker-option builder. */
(function installChainSearchOptions(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, getVariantSettings, getPuzzle, chainNodeLimitOptions,
    chainAlsRccEl, chainAhsEl, chainStrongTypeEls, currentAlmostFishOptions }) {
    function build(
      candidateGrid,
      maxDepth,
      budget = 'interactive',
      profile = null,
      buildSets = true,
      phase = null,
    ) {
      const variantSettings = getVariantSettings();
      const puzzle = getPuzzle();
      // Re-synchronise the core unit table before constructing any links.
      // Variation toggles can change between searches while the same page and
      // worker remain alive; without this, a previously enabled Windoku unit
      // can leak into the next chain pass.
      core.configureVariants(variantSettings);
      const nodeLimits = chainNodeLimitOptions('chain');
      const includeAlsRcc = profile?.includeAlsRcc ?? chainAlsRccEl.checked;
      const includeAhs = profile?.includeAhs ?? chainAhsEl.checked;
      const generator = budget === 'generator';
      const strongLinkTypes = profile?.strongLinkTypes
        || chainStrongTypeEls
          .map((element, index) => element.checked ? index : null)
          .filter(index => index !== null);
      const rank = Number(profile?.maxRank);
      const generatorScale = !Number.isFinite(rank) || rank <= 30
        ? { maxChains: 40, maxResultAttempts: 300, maxResultAttemptsPerStart: 25, maxStates: 2500, maxQueue: 2500, maxBranching: 50, maxStartViews: 100, maxAlsLinks: 250 }
        : rank <= 50
          ? { maxChains: 75, maxResultAttempts: 750, maxResultAttemptsPerStart: 50, maxStates: 8000, maxQueue: 8000, maxBranching: 100, maxStartViews: 250, maxAlsLinks: 750 }
          : rank <= 70
            ? { maxChains: 150, maxResultAttempts: 1500, maxResultAttemptsPerStart: 75, maxStates: 16000, maxQueue: 16000, maxBranching: 150, maxStartViews: 400, maxAlsLinks: 1500 }
            : rank <= 90
              ? { maxChains: 250, maxResultAttempts: 3500, maxResultAttemptsPerStart: 100, maxStates: 30000, maxQueue: 30000, maxBranching: 250, maxStartViews: 600, maxAlsLinks: 3000 }
              : rank <= 110
                ? { maxChains: 350, maxResultAttempts: 6000, maxResultAttemptsPerStart: 125, maxStates: 45000, maxQueue: 45000, maxBranching: 300, maxStartViews: 750, maxAlsLinks: 4500 }
                : rank <= 130
                  ? { maxChains: 500, maxResultAttempts: 10000, maxResultAttemptsPerStart: 150, maxStates: 65000, maxQueue: 65000, maxBranching: 350, maxStartViews: 900, maxAlsLinks: 6000 }
                  : rank <= 150
                    ? { maxChains: 700, maxResultAttempts: 16000, maxResultAttemptsPerStart: 200, maxStates: 90000, maxQueue: 90000, maxBranching: 400, maxStartViews: 1100, maxAlsLinks: 8000 }
                    : { maxChains: 1000, maxResultAttempts: 24000, maxResultAttemptsPerStart: 250, maxStates: 120000, maxQueue: 120000, maxBranching: 450, maxStartViews: 1400, maxAlsLinks: 10000 };
      const limits = budget === 'generator'
        ? generatorScale
        : {
            maxChains: 5000,
            // Keep interactive Next/Run All searches responsive. Dedicated
            // phases may raise these through searchLimits, but an unbounded
            // fallback phase must not monopolise the worker.
            maxResultAttempts: 10000,
            maxResultAttemptsPerStart: 250,
            maxStates: 30000,
            maxQueue: 30000,
            maxBranching: 250,
            maxStartViews: 900,
            maxAlsLinks: 3000,
          };

      // Depth-4 X-chain discovery is bounded per phase so Next/Run-All
      // cannot exhaust the browser before later ALS phases run.
      const phaseLimits = phase?.searchLimits && typeof phase.searchLimits === 'object'
        ? phase.searchLimits
        : {};
      const boundedAlsPhaseLimits = phase && (maxDepth <= 3 || phase?.alsLinkMode === 'rcc-only')
        ? {
          maxChains: 500,
          maxResultAttempts: 10000,
          maxResultAttemptsPerStart: 250,
          maxStates: 30000,
          maxQueue: 30000,
          maxBranching: 250,
          maxStartViews: 900,
          maxAlsLinks: 3000,
        }
        : {};
      const profileAlsMaxDigits = Number(profile?.alsMaxDigits);
      const phaseAlsMaxDigits = Number(phase?.alsMaxDigits);
      const alsMaxDigits = Number.isInteger(phaseAlsMaxDigits) && phaseAlsMaxDigits > 0
        ? phaseAlsMaxDigits
        : Number.isInteger(profileAlsMaxDigits) && profileAlsMaxDigits > 0
          ? profileAlsMaxDigits
          : null;
      const optionalSize = value => value == null || value === '' ? null : Number(value);
      const profileAlsMaxSizeDOF = optionalSize(profile?.alsMaxSizeDOF);
      const phaseAlsMaxSizeDOF = optionalSize(phase?.alsMaxSizeDOF);
      const configuredAlsMaxSizeDOF = optionalSize(nodeLimits.alsMaxSizeDOF);
      const alsMaxSizeDOFCandidates = [
        phaseAlsMaxSizeDOF,
        profileAlsMaxSizeDOF,
        configuredAlsMaxSizeDOF,
      ].filter(value => Number.isInteger(value) && value >= 0);
      const baseAlsMaxSizeDOF = alsMaxSizeDOFCandidates.length
        ? Math.min(...alsMaxSizeDOFCandidates)
        : null;
      const profileAlsMaxSizeFox = optionalSize(profile?.alsMaxSizeFox);
      const phaseAlsMaxSizeFox = optionalSize(phase?.alsMaxSizeFox);
      const configuredAlsMaxSizeFox = phase?.fullFoxRange
        ? null
        : optionalSize(nodeLimits.alsMaxSizeFox);
      const alsMaxSizeFoxCandidates = [
        phaseAlsMaxSizeFox,
        profileAlsMaxSizeFox,
        configuredAlsMaxSizeFox,
      ].filter(value => Number.isInteger(value) && value >= 0);
      const baseAlsMaxSizeFox = alsMaxSizeFoxCandidates.length
        ? Math.min(...alsMaxSizeFoxCandidates)
        : null;
      const alsSearchLimit = phase?.alsSearchLimit ?? profile?.alsSearchLimit ?? false;
      const strongSet = buildSets ? core.buildStrongLinks(candidateGrid, {
        includeAlmostFish: strongLinkTypes.includes(7),
        strongLinkTypes,
        almostFish: { grid: [...(puzzle || [])], ...currentAlmostFishOptions(), fishXorOnly: true },
      }) : null;
      const allowedAlsCellCounts = Array.isArray(phase?.alsCellCounts)
        ? new Set(phase.alsCellCounts.map(Number))
        : null;
      const passAlsCellLimit = phase?.alsCellCount != null
        ? Number(phase.alsCellCount)
        : Array.isArray(phase?.alsCellCounts) && phase.alsCellCounts.length
          ? Math.max(...phase.alsCellCounts.map(Number))
          : null;
      const digitLimitedAlsMaxSizeDOF = baseAlsMaxSizeDOF == null
        ? (Number.isInteger(passAlsCellLimit) ? Math.max(0, passAlsCellLimit - 1) : null)
        : alsMaxDigits == null
          ? baseAlsMaxSizeDOF
          : Math.min(baseAlsMaxSizeDOF, Math.max(0, alsMaxDigits - 1));
      const passAlsMaxSizeDOF = digitLimitedAlsMaxSizeDOF == null
        ? null
        : Number.isInteger(passAlsCellLimit)
          ? Math.min(digitLimitedAlsMaxSizeDOF, Math.max(0, passAlsCellLimit - 1))
          : digitLimitedAlsMaxSizeDOF;
      const passAlsMaxSizeFox = baseAlsMaxSizeFox == null || alsMaxDigits == null
        ? baseAlsMaxSizeFox
        : Math.min(baseAlsMaxSizeFox, Math.max(0, alsMaxDigits - 1));
      const effectiveAlsMaxCells = phase?.fullFoxRange
        ? Math.min(8, nodeLimits.alsMaxCells ?? 8)
        : nodeLimits.alsMaxCells;
      const alsList = buildSets && includeAlsRcc ? core.alsConstructor(candidateGrid, {
        ...(passAlsMaxSizeDOF == null ? {} : { maxSizeDOF: passAlsMaxSizeDOF }),
        ...(passAlsMaxSizeFox == null ? {} : { maxSizeFox: passAlsMaxSizeFox }),
        searchLimit: alsSearchLimit,
      }).filter(als => effectiveAlsMaxCells == null
        || (als.alsAllCells || []).length <= effectiveAlsMaxCells)
        .filter(als => phase?.alsCellCount == null
        || (allowedAlsCellCounts
          ? allowedAlsCellCounts.has((als.alsAllCells || []).length)
          : (als.alsAllCells || []).length === phase.alsCellCount))
        .filter(als => alsMaxDigits == null || (als.alsDigits || []).length <= alsMaxDigits) : null;
      const alsLinkSet = buildSets && includeAlsRcc ? core.buildAlsLinks(candidateGrid, {
        alsList,
        strictSingleCommon: true,
        xzOnly: phase?.alsLinkMode === 'xz-only',
        maxLinks: limits.maxAlsLinks,
      }) : null;
      const filteredAlsLinkSet = phase?.alsModuleKinds && alsLinkSet
        ? alsLinkSet.map(bucket => bucket.filter(link => phase.alsModuleKinds.includes(link.moduleKind)))
        : alsLinkSet;
      const scopedAlsLinkSet = phase?.alsLinkMode === 'rcc-only' && filteredAlsLinkSet
        ? filteredAlsLinkSet.map((bucket, index) => index === core.ALS_RCC ? bucket : [])
        : filteredAlsLinkSet;
      const ahsDigitLimits = [
        phase?.ahsMaxDigits,
        phase?.fullFoxRange ? Math.min(8, nodeLimits.ahsMaxDigits ?? 8) : nodeLimits.ahsMaxDigits,
      ]
        .map(Number)
        .filter(value => Number.isInteger(value) && value >= 2);
      const effectiveAhsMaxDigits = ahsDigitLimits.length
        ? Math.min(...ahsDigitLimits)
        : null;
      const ahsCellLimits = [
        phase?.ahsMaxCells,
        phase?.fullFoxRange ? Math.min(9, nodeLimits.ahsMaxCells ?? 9) : nodeLimits.ahsMaxCells,
      ]
        .map(Number)
        .filter(value => Number.isInteger(value) && value > 0);
      const effectiveAhsMaxCells = ahsCellLimits.length
        ? Math.min(...ahsCellLimits)
        : null;
      const ahsList = buildSets && includeAhs ? core.ahsConstructor(candidateGrid, {
        maxSize: Math.min(
          effectiveAhsMaxDigits == null ? (nodeLimits.ahsMaxSize ?? 8) : effectiveAhsMaxDigits - 1,
          effectiveAhsMaxCells == null ? (nodeLimits.ahsMaxSize ?? 8) : Math.max(1, effectiveAhsMaxCells - 1),
        ),
        maxSizeFox: effectiveAhsMaxCells == null
          ? (nodeLimits.ahsMaxFox ?? 7)
          : Math.min(nodeLimits.ahsMaxFox ?? 7, Math.max(1, effectiveAhsMaxCells - 1)),
        searchLimit: alsSearchLimit,
      }).filter(ahs => effectiveAhsMaxCells == null
        || (ahs.ahsAllCells || []).length <= effectiveAhsMaxCells)
        .filter(ahs => effectiveAhsMaxDigits == null
          || (ahs.ahsDigits || []).length <= effectiveAhsMaxDigits) : null;
      const ahsLinkSet = buildSets && includeAhs ? core.buildAhsLinks(candidateGrid, {
        ahsList,
        strongLinkSet: strongSet,
        minDof: 1,
        maxDof: 3,
        strictSingleCommon: false,
        maxLinks: limits.maxAlsLinks,
      }) : null;
      return {
        strongSet,
        alsList,
        alsLinkSet: scopedAlsLinkSet,
        ahsList,
        ahsLinkSet,
        includeAlsRcc,
        includeAhs,
        ahsMaxDigits: effectiveAhsMaxDigits,
        ahsMaxCells: effectiveAhsMaxCells,
        alsMaxCells: effectiveAlsMaxCells,
        ahsMaxSize: effectiveAhsMaxDigits == null
          ? nodeLimits.ahsMaxSize
          : Math.min(nodeLimits.ahsMaxSize ?? effectiveAhsMaxDigits - 1, effectiveAhsMaxDigits - 1),
        ahsMaxFox: effectiveAhsMaxCells == null
          ? nodeLimits.ahsMaxFox
          : Math.min(nodeLimits.ahsMaxFox ?? effectiveAhsMaxCells - 1, effectiveAhsMaxCells - 1),
        strongLinkTypes,
        almostFish: { ...currentAlmostFishOptions(), fishXorOnly: true },
        maxDepth: profile?.maxDepth == null ? maxDepth : Math.min(maxDepth, profile.maxDepth),
        alsMaxDigits,
        alsCellCounts: Array.isArray(phase?.alsCellCounts) ? [...phase.alsCellCounts] : null,
        alsMaxSizeDOF: passAlsMaxSizeDOF,
        alsMaxSizeFox: passAlsMaxSizeFox,
        alsSearchLimit,
        ...limits,
        ...boundedAlsPhaseLimits,
        ...phaseLimits,
      };
    }

    return { build };
  }

  app.chainSearchOptions = { create };
})(window);