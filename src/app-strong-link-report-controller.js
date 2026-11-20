/* StormDoku strong-link report grouping and selection state. */
(function installStrongLinkReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, view, container, state, actions }) {
    function getGroups() {
      if (!state.report) return [];
      const groups = state.report.map(group => [...group]);
      const typeIndexes = {
        BILOCAL: 0,
        CELL_TO_GROUP: 1,
        GROUP_TO_GROUP: 2,
        ERI: 3,
        ALS: 4,
      };
      for (const link of core.flattenStrongLinks(state.report)) {
        for (const secondaryType of link.secondaryTypes || []) {
          const index = typeIndexes[secondaryType];
          if (index === undefined || groups[index].includes(link)) continue;
          groups[index].push(link);
        }
      }
      return groups;
    }

    function render() {
      view.render(state.report, container);
    }

    function selectType(index) {
      state.selectedType = index;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedIndex = null;
      state.selectedChainIndex = null;
      state.selectedFishKey = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;
      state.activeStep = null;
      state.lastRemoved = [];
      actions.renderBoard();
      render();
    }

    function selectLink(index) {
      const selectedGroup = getGroups()[state.selectedType] || [];
      if (!selectedGroup[index]) return;
      state.selectedIndex = index;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedChainIndex = null;
      state.selectedFishKey = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;
      state.activeStep = null;
      state.lastRemoved = [];
      actions.renderBoard();
      render();
      actions.setStatus(`Strong Link ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { getGroups, render, selectType, selectLink };
  }

  app.strongLinkReportController = { create };
})(window);
