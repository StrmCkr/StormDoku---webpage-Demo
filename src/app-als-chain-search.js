/* Dedicated ALS-XZ, ALS-XY, and longer ALS-chain search orchestration. */
(function installAlsChainSearch(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    function run(family) {
      const context = getContext();
      const phase = family === 'als-xz'
        ? { includeAls: true, maxDepth: 2, minDepth: 2, family: 'als-xz' }
        : family === 'als-xy'
          ? { includeAls: true, maxDepth: 3, minDepth: 3, family: 'als-xy' }
          : {
              includeAls: true,
              maxDepth: Math.max(4, Number(context.chainDepth) || 6),
              minDepth: 4,
              family: 'als-chain',
            };
      const maxDepth = phase.maxDepth;
      const label = family === 'als-xz' ? 'ALS-XZ'
        : family === 'als-xy' ? 'ALS-XY' : 'ALS-Chain';
      // Type 4 is the Bivalve ALS node. Type 5 is supplied separately by
      // includeAlsRcc/alsLinkSet; it is not part of this array.
      const searchStrongLinkTypes = [4];
      phase.searchLimits = {
        maxChains: 5000,
        maxResultAttempts: 100000,
        maxResultAttemptsPerStart: 5000,
        maxStates: 300000,
        maxQueue: 300000,
        maxBranching: Number.MAX_SAFE_INTEGER,
        maxStartViews: Number.MAX_SAFE_INTEGER,
        maxAlsLinks: Number.MAX_SAFE_INTEGER,
      };

      const searchToken = context.setBusy(true);
      context.setStatus(`Searching ${label}...`);
      context.scheduleSearch(async () => {
        try {
          const search = context.chainSearchOptions(
            context.cand, maxDepth, 'interactive',
            { includeAlsRcc: true, strongLinkTypes: searchStrongLinkTypes, includeAhs: false },
            false, phase,
          );
          search.strongSet = await context.runCoreSearch('buildStrongLinks', context.cand, {
            strongLinkTypes: [4],
            includeAlmostFish: search.strongLinkTypes.includes(7),
            almostFish: { grid: [...context.puzzle], ...search.almostFish },
          });
          search.alsList = (await context.runCoreSearch('alsConstructor', context.cand, {
            ...(search.alsMaxSizeDOF == null ? {} : { maxSizeDOF: search.alsMaxSizeDOF }),
            ...(search.alsMaxSizeFox == null ? {} : { maxSizeFox: search.alsMaxSizeFox }),
            searchLimit: search.alsSearchLimit,
          })).filter(als => search.alsMaxCells == null
            || (als.alsAllCells || []).length <= search.alsMaxCells)
            .filter(als => search.alsMaxDigits == null
              || (als.alsDigits || []).length <= search.alsMaxDigits);
          search.alsLinkSet = await context.runCoreSearch('buildAlsLinks', context.cand, {
            alsList: search.alsList,
            strictSingleCommon: true,
            xzOnly: phase.alsLinkMode === 'xz-only',
          });
          if (phase.alsModuleKinds) {
            search.alsLinkSet = search.alsLinkSet.map(bucket => bucket.filter(link =>
              phase.alsModuleKinds.includes(link.moduleKind)));
          }
          const rawReport = await context.runCoreSearch('findAicChains', context.cand, {
            strongLinkSet: search.strongSet,
            alsList: search.alsList,
            alsLinkSet: search.alsLinkSet,
            includeAls: search.includeAlsRcc,
            includeAhs: search.includeAhs,
            strongLinkTypes: search.strongLinkTypes,
            minDepth: phase.minDepth,
            maxDepth: phase.maxDepth,
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          });
          const chains = rawReport.chains.filter(chain => context.chainMatchesSearchPhase(chain, phase));

          context.alsSearchFamily = family;
          context.chainReport = { ...rawReport, chains };
          context.selectedChainIndex = chains.length ? 0 : null;
          context.activeStep = null;
          context.lastRemoved = [];
          context.strongLinkReport = context.chainReport.linkSets?.strongSet || search.strongSet;
          context.alsReport = search.alsList;
          context.alsLinkReport = search.alsLinkSet;
          context.selectedAlsId = null;
          context.selectedAhsId = null;
          context.renderAlsReport();
          context.renderAlsLinkReport();
          context.renderBoard();
          context.renderChainReport();
          context.renderAlsSearchResults();
          context.openReportPanel();
          context.setStatus(
            `${label} search complete. ${chains.length} result${chains.length === 1 ? '' : 's'}.`
              + `${rawReport.stats?.truncated ? ` Stopped at ${rawReport.stats.stopReason}.` : ''}`,
            chains.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (context.isSearchCancelled(error)) return;
          console.error(`Could not search ${label}.`, error);
          context.alsSearchFamily = null;
          context.chainReport = null;
          context.selectedChainIndex = null;
          context.renderChainReport();
          context.renderAlsSearchResults();
          context.setStatus(`Could not search ${label}: ${error?.message || error}`, 'warn');
        } finally {
          context.setBusy(false, searchToken);
        }
      }, 20);
    }

    return { run };
  }

  app.alsChainSearch = { create };
})(window);
