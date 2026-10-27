/* StormDoku AHS link-build orchestration. */
(function installAhsLinkBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { elements, state, actions } = context;
    return function runAhsLinkBuild() {
      const searchToken = actions.setBusy(true);
      actions.setStatus('Building AHS links...');
      actions.scheduleSearch(async () => {
        try {
          const ahsList = state.ahsReport
            || await actions.runCoreSearch('ahsConstructor', state.cand, { maxSize: 8, maxSizeFox: 7 });
          const strongLinkSet = await actions.runCoreSearch('buildStrongLinks', state.cand);
          state.ahsLinkReport = await actions.runCoreSearch('buildAhsLinks', state.cand, {
            ahsList,
            strongLinkSet,
            minDof: 1,
            maxDof: 3,
            maxLinks: 5000,
          });
          actions.renderAhsLinkReport();
          actions.openReportPanel(elements.results);
          const count = actions.flattenAhsLinks(state.ahsLinkReport).length;
          actions.setStatus(`AHS link build complete. ${count} link${count === 1 ? '' : 's'} built.`, count ? 'ok' : 'warn');
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.ahsLinkReport = null;
          actions.renderAhsLinkReport();
          actions.setStatus(`Could not build AHS links: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.ahsLinkBuild = { create };
})(window);
