/* StormDoku strong-link build orchestration. */
(function installStrongLinkBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runStrongLinkBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Building strong links...');

      actions.scheduleSearch(async () => {
        try {
          const strongLinkTypes = elements.strongTypes
            .map((element, index) => element.checked ? index : null)
            .filter(index => index !== null);
          actions.chainNodeLimitOptions('chain');
          const includeAlmostFish = strongLinkTypes.includes(7);
          state.strongLinkReport = await actions.runCoreSearch('buildStrongLinks', state.cand, {
            includeAlmostFish,
            almostFish: includeAlmostFish
              ? { grid: [...(state.puzzle || [])], ...actions.currentAlmostFishOptions() }
              : {},
          });
          state.selectedStrongLinkType = null;
          state.selectedStrongLinkIndex = null;
          state.chainReport = null;
          actions.renderStrongLinkReport();
          actions.openReportPanel(elements.results);
          actions.renderChainReport();
          const count = actions.flattenStrongLinks(state.strongLinkReport).length;
          actions.setStatus(
            `Strong-link build complete. ${count} links. Grid and solving history unchanged.`,
            'ok',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.strongLinkReport = null;
          state.chainReport = null;
          actions.renderStrongLinkReport();
          actions.renderChainReport();
          actions.setStatus('Could not build strong links.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.strongLinkBuild = { create };
})(window);
