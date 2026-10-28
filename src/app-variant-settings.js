/* StormDoku variant settings application orchestration. */
(function installVariantSettings(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { state, actions } = context;
    function sync() {
      return actions.variantControls.read();
    }

    function apply() {
      sync();
      actions.configureVariants(state.variantSettings);
      actions.fishControls.syncVariantSectors(true);
      actions.fishControls.renderSectorGrid('baseSectors');
      actions.fishControls.renderSectorGrid('coverSectors');
      state.cand = actions.allCandidates(state.puzzle);
      state.solution = actions.solveFully(state.puzzle);
      actions.resetAnalysisAfterPlayerEdit();
      state.undoStack = [];
      state.redoStack = [];
      actions.render();
      const active = Object.entries(state.variantSettings)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);
      actions.setStatus(
        state.solution
          ? `Variations updated${active.length ? `: ${active.join(', ')}.` : '.'}`
          : 'Variations updated. The current givens have no solution under these rules.',
        state.solution ? 'ok' : 'warn',
      );
    }

    return { sync, apply };
  }

  app.variantSettings = { create };
})(window);
