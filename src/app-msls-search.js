/* StormDoku MSLS search controller. */
(function installMslsSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const {
      elements, getCandidateGrid, runSearchWorker, setReport,
      setSelectedIndex, render, openReportPanel, setBusy, setStatus,
      isSearchCancelled
    } = context;

    async function run() {
      const searchToken = setBusy(true);
      setStatus('Searching Multi-Sector Locked Sets...');
      elements.results.textContent = 'Searching MSLS...';
      try {
        const requestedMin = Math.max(3, Math.min(5, Number(elements.minSize.value) || 3));
        const requestedMax = Math.max(requestedMin, Math.min(5, Number(elements.maxSize.value) || 5));
        const stateBudgetPerSize = Math.max(1000, Math.min(20000000, Number(elements.stateBudget.value) || 5000000));
        const stateBudget = Math.min(50000000, stateBudgetPerSize * requestedMax);
        const resultLimit = Math.max(1, Math.min(50000, Number(elements.resultLimit.value) || 10000));
        elements.minSize.value = String(requestedMin);
        elements.maxSize.value = String(requestedMax);
        elements.stateBudget.value = String(stateBudgetPerSize);
        elements.resultLimit.value = String(resultLimit);
        const report = await runSearchWorker('msls', {
          candidateGrid: getCandidateGrid(),
          options: {
            minBaseSectors: requestedMin,
            minCoverSectors: requestedMin,
            maxBaseSectors: requestedMax,
            maxCoverSectors: requestedMax,
            mixedCovers: true,
            maxRemovedCells: 1,
            fastCover: true,
            maxK: 1,
            maxLinks: 81,
            maxCells: requestedMax * 9,
            maxStates: stateBudget,
            maxResults: resultLimit,
          },
        });
        setReport(report);
        setSelectedIndex(null);
        render();
        openReportPanel(elements.results);
        setStatus(`MSLS search complete. ${report.results.length} result${report.results.length === 1 ? '' : 's'}.`, report.results.length ? 'ok' : 'warn');
      } catch (error) {
        if (isSearchCancelled(error)) return;
        elements.results.textContent = `Could not search MSLS: ${error.message || error}`;
        openReportPanel(elements.results);
        setStatus('Could not search MSLS.', 'warn');
      } finally {
        setBusy(false, searchToken);
      }
    }

    return { run };
  }

  function solverOptions(budget = 'interactive') {
    const maxSize = 5;
    return {
      minBaseSectors: 3, minCoverSectors: 3,
      maxBaseSectors: maxSize, maxCoverSectors: maxSize,
      mixedCovers: true, maxRemovedCells: 1, fastCover: true,
      maxK: 1, maxLinks: 81, maxCells: maxSize * 9,
      maxStates: budget === 'generator' ? 5000000 : 20000000,
      maxResults: budget === 'generator' ? 250 : 1000,
    };
  }

  function bestSolverMove(report, profile, {
    stepFromResult, ratingForStep, directPriority, isHigherPriority,
  }) {
    let best = null;
    for (let index = 0; index < (report?.results || []).length; index++) {
      const step = stepFromResult(report.results[index]);
      step.mslsReport = report;
      step.mslsIndex = index;
      step.rating = ratingForStep(step);
      if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
      if (!step.elim.items.length) continue;
      const candidate = {
        step, chain: null, mslsReport: report, mslsIndex: index,
        priority: directPriority(step),
      };
      if (isHigherPriority(candidate, best)) best = candidate;
    }
    return best;
  }

  app.mslsSearch = { create, solverOptions, bestSolverMove };
})(window);
