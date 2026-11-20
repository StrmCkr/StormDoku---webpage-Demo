/* Clue minimizer UI workflow, status, and apply action. */
(function installToyMinimizerController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    isBusy,
    getSource,
    countSolutions,
    resultsEl,
    clearView,
    renderView,
    getReport,
    setReport,
    setStatus,
    setBusy,
    isEpochActive,
    minimize,
    scheduleYield,
    applyReducedGrid,
  }) {
    function clearResults() {
      setReport(null);
      clearView();
    }

    async function run() {
      if (isBusy()) return;
      const source = [...getSource()];
      const sourceGivenCount = source.filter(Boolean).length;
      const sourceCount = countSolutions(source);
      if (sourceCount !== 1) {
        clearResults();
        resultsEl.textContent = sourceCount === 0
          ? 'This grid has no solution, so no clue can be minimized.'
          : 'This grid has more than one solution, so clue minimization is unavailable.';
        setStatus('Clue minimizer requires a uniquely solvable grid.', 'warn');
        return;
      }

      const epoch = setBusy(true);
      try {
        const reduction = await minimize(
          source,
          grid => countSolutions(grid) === 1,
          () => isEpochActive(epoch),
          scheduleYield,
        );
        if (!reduction) return;
        const report = {
          sourceKey: source.join(''),
          sourceGivenCount,
          reducedGivenCount: reduction.reduced.filter(Boolean).length,
          reduced: reduction.reduced,
          removed: reduction.removed,
        };
        setReport(report);
        renderView(report);
        setStatus(`Clue minimizer found ${reduction.removed.length} removable clue${reduction.removed.length === 1 ? '' : 's'}.`, 'ok');
      } catch (error) {
        clearResults();
        setStatus(`Clue minimizer failed: ${error.message || error}`, 'warn');
      } finally {
        setBusy(false, epoch);
      }
    }

    function replace() {
      const report = getReport();
      if (!report || !report.removed.length) return;
      if (report.sourceKey !== getSource().join('')) {
        clearResults();
        setStatus('The grid changed; run the clue minimizer again.', 'warn');
        return;
      }
      applyReducedGrid(report);
    }

    return { clearResults, run, replace };
  }

  app.toyMinimizerController = { create };
})(window);
