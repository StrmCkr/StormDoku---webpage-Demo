/* StormDoku fish and technique settings facade. */
(function installSettingsRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { state, actions } = context;
    function fishSettingsChanged() {
      if (!state.pomReport) return;
      state.pomReport = null;
      actions.renderPomReport();
    }

    return {
      fishSettingsChanged,
      initFishSettings: () => actions.fishControls.initialize(),
      syncFishRanges: (changed, controls = null) => actions.fishControls.syncRanges(changed, controls),
      sectorToggleLabel: index => actions.fishControls.sectorLabel(index),
      syncFishVariantSectors: addActive => actions.fishControls.syncVariantSectors(addActive),
      renderFishSectorGrid: kind => actions.fishControls.renderSectorGrid(kind),
      setVariantSectorRange: (kind, names, on) => actions.fishControls.setVariantRange(kind, names, on),
      setSectorRange: (kind, start, end, on) => actions.fishControls.setRange(kind, start, end, on),
      setAllDigits: on => actions.fishControls.setAllDigits(on),
      currentAlmostFishOptions: () => actions.fishControls.almostOptions(),
      currentPomFishOptions: () => actions.fishControls.pomOptions(),
      currentSolverMoveTypes: override => actions.techniqueControls.currentTypes(override),
      currentSolverFishOptions: () => actions.fishControls.solverOptions({
        grid: state.puzzle,
        omissionFishSearch: actions.omissionFishSearch,
        enabledTechniques: actions.techniqueControls.currentTypes(),
      }),
    };
  }

  app.settingsRuntime = { create };
})(window);
