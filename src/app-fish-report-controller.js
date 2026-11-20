/* StormDoku fish report selection and highlighted-step conversion. */
(function installFishReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, fishView, container, state, actions }) {
    function fishStepFromReport(fish) {
      const removals = fish.cells.map(cell => ({ cell, digit: fish.digit }));
      return {
        tech: 'fish',
        name: fish.name,
        category: fish.category,
        size: fish.size,
        k: fish.k,
        desc: `${fish.name}: (${fish.digit}) ${core.sectorGroupName(fish.baseSectors)} / `
          + `${core.sectorGroupName(fish.coverSectors)} => ${core.formatRemovals(removals)}`,
        elim: { items: removals },
        digits: [fish.digit],
        baseSectors: fish.baseSectors,
        coverSectors: fish.coverSectors,
        fishCells: fish.fishCells || [],
        baseIntersections: fish.baseIntersections || [],
        peersOfBaseIntersection: fish.peersOfBaseIntersection || [],
        vertices: fish.vertices || [],
        fins: fish.triggerCells || [],
        endofins: fish.endoFins || [],
        overcovered: fish.overcovered || [],
        triCovered: fish.triCovered || [],
      };
    }

    function renderFishReport() {
      fishView.render(state.report, container);
    }

    function selectFishReport(category, index) {
      const selected = state.report?.filter(fish => fish.category === category) || [];
      const fish = selected[index];
      if (!fish) return;
      state.selectedCategory = category;
      state.selectedSize = fish.size;
      state.selectedKey = `${category}:${index}`;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedChainIndex = null;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.selectedBoxLineIndex = null;
      const step = fishStepFromReport(fish);
      state.activeStep = step;
      state.lastRemoved = step.elim.items;
      actions.renderBoard();
      renderFishReport();
      actions.setStatus(`Fish ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return { fishStepFromReport, renderFishReport, selectFishReport };
  }

  app.fishReportController = { create };
})(window);
