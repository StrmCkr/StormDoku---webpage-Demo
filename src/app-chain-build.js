/* StormDoku chain-build orchestration. */
(function installChainBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;

    return function runChainBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Walking chains...');

      actions.scheduleSearch(async () => {
        try {
          const includeAlsRcc = elements.chainAlsRcc.checked;
          const includeAhs = elements.chainAhs.checked;
          const nodeLimits = actions.chainNodeLimitOptions('chain');
          const strongLinkTypes = elements.chainStrongTypeEls
            .map((element, index) => element.checked ? index : null)
            .filter(index => index !== null);
          const includeAlmostFish = strongLinkTypes.includes(7);

          state.strongLinkReport = await actions.runCoreSearch('buildStrongLinks', state.cand, {
            includeAlmostFish,
            almostFish: includeAlmostFish
              ? { grid: [...(state.puzzle || [])], ...actions.currentAlmostFishOptions(), fishXorOnly: true }
              : {},
          });
          state.alsReport = includeAlsRcc ? (await actions.runCoreSearch('alsConstructor', state.cand, {
            ...(nodeLimits.alsMaxSizeDOF == null ? {} : { maxSizeDOF: nodeLimits.alsMaxSizeDOF }),
            ...(nodeLimits.alsMaxSizeFox == null ? {} : { maxSizeFox: nodeLimits.alsMaxSizeFox }),
          })).filter(als => nodeLimits.alsMaxCells == null
            || (als.alsAllCells || []).length <= nodeLimits.alsMaxCells) : null;
          state.alsLinkReport = includeAlsRcc ? await actions.runCoreSearch('buildAlsLinks', state.cand, {
            alsList: state.alsReport,
            strictSingleCommon: true,
            maxLinks: 5000,
          }) : null;
          const ahsList = includeAhs ? (await actions.runCoreSearch('ahsConstructor', state.cand, {
            maxSize: nodeLimits.ahsMaxDigits ?? 8,
            maxSizeFox: nodeLimits.ahsMaxFox ?? 7,
          })).filter(ahs => nodeLimits.ahsMaxCells == null
            || (ahs.ahsAllCells || []).length <= nodeLimits.ahsMaxCells) : null;
          state.ahsReport = ahsList;
          const ahsLinkSet = includeAhs ? await actions.runCoreSearch('buildAhsLinks', state.cand, {
            ahsList,
            strongLinkSet: state.strongLinkReport,
            minDof: 1,
            maxDof: 3,
            strictSingleCommon: false,
            maxLinks: 5000,
          }) : null;
          const chromaticLinkSet = elements.chainChromaticType3.checked
            ? (await actions.runSearchWorker('chromatic-chain-links', {
              candidateGrid: state.cand,
              unitType: elements.chromaticUnitType.value,
              minSectors: elements.chromaticMinSectors.value,
              maxSectors: elements.chromaticMaxSectors.value,
              minDigits: elements.chromaticMinDigits.value,
              maxDigits: elements.chromaticMaxDigits.value,
              maxCells: elements.chromaticMaxCells.value,
              maxResults: 200,
            })).links
            : [];

          state.selectedAhsId = null;
          actions.renderAlsReport();
          actions.renderAlsLinkReport();

          state.chainReport = await actions.runCoreSearch('findAicChains', state.cand, {
            strongLinkSet: state.strongLinkReport,
            alsList: state.alsReport,
            alsLinkSet: state.alsLinkReport,
            ahsLinkSet,
            chromaticLinkSet,
            includeAhs,
            includeAls: includeAlsRcc,
            includeChromatic: elements.chainChromaticType3.checked,
            strongLinkTypes,
            maxDepth: Math.min(8, Math.max(2, Number(elements.chainDepth.value) || 6)),
            maxChains: 5000,
            maxResultAttempts: 100000,
            maxResultAttemptsPerStart: 5000,
            maxStates: 300000,
            maxQueue: 300000,
            maxBranching: 500,
            maxAlsLinks: 5000,
          });

          state.alsSearchFamily = null;
          state.selectedChainIndex = state.chainReport.chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.strongLinkReport = state.chainReport.linkSets.strongSet;
          actions.renderBoard();
          actions.renderChainReport();
          actions.renderAlsSearchResults();
          actions.openReportPanel(elements.chainResults);

          const { stats, chains } = state.chainReport;
          actions.setStatus(
            `Chain BFS complete. ${chains.length} chains with eliminations from ${stats.graphLinks} graph links`
              + ` (strong ${strongLinkTypes.map(type => type + 1).join(',') || 'off'}`
              + `, ALS_RCC ${includeAlsRcc ? 'on' : 'off'})`
              + `${stats.truncated ? `; stopped at ${stats.stopReason}` : ''}. Grid and solving history unchanged.`,
            chains.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.chainReport = null;
          actions.renderChainReport();
          actions.setStatus(`Could not walk chains: ${error?.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.chainBuild = { create };
})(window);
