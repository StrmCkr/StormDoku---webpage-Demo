/* ALS-DOF result selection helpers. */
(function installAlsDofSelection(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function bestMove(candidateGrid, report, enabledTypes, profile, {
    moveEnabled,
    stepFromResult,
    directPriority,
    isHigherPriority,
  }) {
    let best = null;
    for (let index = 0; index < (report?.results || []).length; index++) {
      const result = report.results[index];
      if (!moveEnabled(result, enabledTypes)) continue;
      const step = stepFromResult(result, report, index, candidateGrid);
      if (!step) continue;
      if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
      const candidate = {
        step,
        chain: null,
        alsDofReport: report,
        alsDofIndex: index,
        priority: directPriority(step),
      };
      if (isHigherPriority(candidate, best)) best = candidate;
    }
    return best;
  }

  function bestAhsMove(candidateGrid, report, profile, {
    stepFromResult,
    directPriority,
    isHigherPriority,
  }) {
    let best = null;
    for (let index = 0; index < (report?.results || []).length; index++) {
      const step = stepFromResult(report.results[index], report, index, candidateGrid);
      if (!step) continue;
      if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
      const candidate = {
        step,
        chain: null,
        ahsDofReport: report,
        ahsDofIndex: index,
        priority: directPriority(step),
      };
      if (isHigherPriority(candidate, best)) best = candidate;
    }
    return best;
  }

  function bestChainMove(candidateGrid, report, profile, {
    stepFromResult,
    directPriority,
    isHigherPriority,
    reportKey,
    indexKey,
  }) {
    let best = null;
    for (let index = 0; index < (report?.results || []).length; index++) {
      const step = stepFromResult(report.results[index], report, index, candidateGrid);
      if (!step) continue;
      if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
      const candidate = {
        step,
        chain: null,
        [reportKey]: report,
        [indexKey]: index,
        priority: directPriority(step),
      };
      if (isHigherPriority(candidate, best)) best = candidate;
    }
    return best;
  }

  app.alsDofSelection = { bestMove, bestAhsMove, bestChainMove };
})(window);
