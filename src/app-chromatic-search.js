/* Worker-backed search actions for chromatic graph reports. */
(function installChromaticSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    function runGraph(event) {
      const context = getContext();
      event.preventDefault();
      event.stopPropagation();
      context.activeStep = null;
      context.selectedGraphIndex = null;
      const searchToken = context.setBusy(true);
      context.setStatus('Searching non-colourable chromatic graphs...');
      context.scheduleSearch(async () => {
        try {
          context.graphReport = await context.runSearchWorker('chromatic', {
            candidateGrid: context.candidates,
            options: {
              unitType: context.options.unitType,
              minSectors: context.options.minSectors,
              maxSectors: context.options.maxSectors,
              minDigits: context.options.minDigits,
              maxDigits: context.options.maxDigits,
              maxCells: context.options.maxCells,
            },
          });
          context.selectedGraphIndex = context.graphReport.results.length ? 0 : null;
          if (context.selectedGraphIndex !== null) {
            context.activeStep = context.stepFromResult(context.graphReport.results[0]);
          }
          context.render();
          context.openGraphPanel();
          context.setStatus(
            context.graphReport.results.length
              ? `Chromatic graph search found ${context.graphReport.results.length} result${context.graphReport.results.length === 1 ? '' : 's'}.`
              : 'Chromatic graph search found no non-colourable graphs.',
            context.graphReport.results.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (context.isSearchCancelled(error)) return;
          console.error('Chromatic graph search failed:', error);
          context.graphReport = null;
          context.render();
          context.setStatus('Could not search non-colourable chromatic graphs.', 'warn');
        } finally {
          context.setBusy(false, searchToken);
        }
      }, 0);
    }

    function runAlsGraph(event) {
      const context = getContext();
      event.preventDefault();
      event.stopPropagation();
      context.activeStep = null;
      context.selectedAlsGraphIndex = null;
      const searchToken = context.setBusy(true);
      context.setStatus('Searching ALS-backed non-colourable chromatic graphs...');
      context.scheduleSearch(async () => {
        try {
          context.alsGraphReport = await context.runSearchWorker('chromatic-als', {
            candidateGrid: context.candidates,
            options: {
              unitType: context.options.unitType,
              minSectors: context.options.minSectors,
              maxSectors: context.options.maxSectors,
              minDigits: context.options.minDigits,
              maxDigits: context.options.maxDigits,
              maxCells: context.options.maxCells,
            },
          });
          context.selectedAlsGraphIndex = context.alsGraphReport.results.length ? 0 : null;
          if (context.selectedAlsGraphIndex !== null) {
            context.activeStep = context.stepFromResult(context.alsGraphReport.results[0]);
          }
          context.render();
          context.openAlsGraphPanel();
          context.setStatus(
            context.alsGraphReport.results.length
              ? `ALS chromatic graph search found ${context.alsGraphReport.results.length} result${context.alsGraphReport.results.length === 1 ? '' : 's'}.`
              : 'ALS chromatic graph search found no formations.',
            context.alsGraphReport.results.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (context.isSearchCancelled(error)) return;
          console.error('ALS chromatic graph search failed:', error);
          context.alsGraphReport = null;
          context.render();
          context.setStatus('Could not search ALS-backed chromatic graphs.', 'warn');
        } finally {
          context.setBusy(false, searchToken);
        }
      }, 0);
    }

    return { runGraph, runAlsGraph };
  }

  app.chromaticSearch = { create };
})(window);
