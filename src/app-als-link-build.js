/* StormDoku ALS link-build orchestration. */
(function installAlsLinkBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAlsLinkBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Building ALS graph links...');

      actions.scheduleSearch(async () => {
        try {
          const sourceAls = state.alsReport
            || await actions.runCoreSearch('alsConstructor', state.cand);
          if (!state.alsReport) {
            state.alsReport = sourceAls;
            actions.renderAlsReport();
          }
          state.alsLinkReport = await actions.runCoreSearch('buildAlsLinks', state.cand, {
            alsList: sourceAls,
            strictSingleCommon: true,
          });
          state.chainReport = null;
          actions.renderAlsLinkReport();
          actions.openReportPanel(elements.results);
          actions.renderChainReport();
          const count = actions.flattenAlsLinks(state.alsLinkReport).length;
          actions.setStatus(
            `ALS link build complete. ${count} paired ALS modules. Size-1 Bivalve ALS nodes are in Strong Links as ALS. Grid and solving history unchanged.`,
            'ok',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.alsLinkReport = null;
          state.chainReport = null;
          actions.renderAlsLinkReport();
          actions.renderChainReport();
          actions.setStatus('Could not build ALS graph links.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.alsLinkBuild = { create };
})(window);
