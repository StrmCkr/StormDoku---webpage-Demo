/* StormDoku phase-record construction helpers. */
(function installPhaseBuilder(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function createPhase(name, types, maxDepth, options = {}) {
    const phaseDepth = Math.min(maxDepth, options.maxDepth || maxDepth);
    if (phaseDepth < 2) return null;
    return {
      name,
      includeAls: !!options.includeAls,
      strongLinkTypes: [...types],
      maxDepth: phaseDepth,
      requireAls: !!options.requireAls,
      alsCellCount: options.alsCellCount,
      alsCellCounts: options.alsCellCounts || null,
      alsModuleKinds: options.alsModuleKinds || null,
      alsLinkMode: options.alsLinkMode || null,
      barnsSize: options.barnsSize ?? null,
      requireMixed: !!options.requireMixed,
      minAlsNodes: options.minAlsNodes ?? null,
      minDepth: options.minDepth ?? null,
      family: options.family || null,
      allowedMoveKeys: options.allowedMoveKeys || null,
      allowedMoveGroups: options.allowedMoveGroups || null,
      singleDigitOnly: options.singleDigitOnly === true,
      searchLimits: options.searchLimits || null,
    };
  }

  function addPhase(phases, name, types, maxDepth, options = {}) {
    const phase = createPhase(name, types, maxDepth, options);
    if (phase) phases.push(phase);
  }

  function addMixedStage(phases, name, strongLinkTypes, maxDepth, options = {}) {
    if (!strongLinkTypes.length) return;
    addPhase(phases, name, strongLinkTypes, maxDepth, {
      includeAls: true,
      requireAls: true,
      requireMixed: true,
      ...options,
    });
  }

  function resolveStrongLinkTypes(profile, elements) {
    return [...new Set(
      (profile?.strongLinkTypes || elements
        .map((element, index) => element.checked ? index : null)
        .filter(index => index !== null))
        .filter(type => Number.isInteger(type) && type >= 0 && type <= 7),
    )].sort((left, right) => left - right);
  }

  function resolveIncludeAls(profile, checkbox) {
    return profile?.includeAlsRcc ?? checkbox.checked;
  }

  function combinations(values, size) {
    if (size < 1 || size > values.length) return [];
    const result = [];
    const current = [];
    const visit = start => {
      if (current.length === size) {
        result.push([...current]);
        return;
      }
      for (let index = start; index < values.length; index += 1) {
        current.push(values[index]);
        visit(index + 1);
        current.pop();
      }
    };
    visit(0);
    return result;
  }

  app.phaseBuilder = {
    createPhase,
    addPhase,
    addMixedStage,
    resolveStrongLinkTypes,
    resolveIncludeAls,
    combinations,
  };
})(window);
