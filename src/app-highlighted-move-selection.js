/* Clear the current highlighted result and its associated selection state. */
(function installHighlightedMoveSelection(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, leaveHistoryPreview, render, setStatus }) {
    function clear() {
      leaveHistoryPreview();
      for (const key of [
        'selectedAlsId', 'selectedAhsId', 'selectedChainIndex', 'selectedAlsDof',
        'selectedAlsDofIndex', 'selectedAhsDofNetIndex', 'selectedAhsDofChainIndex',
        'activeStep', 'selectedFishKey', 'selectedBoxLineIndex',
        'selectedNakedSubsetKey', 'selectedHiddenSubsetKey', 'selectedStrongLinkType',
        'selectedStrongLinkIndex', 'selectedSimpleColoringIndex',
        'selectedThreeDMedusaIndex', 'selectedMultiColoringIndex',
        'selectedThreeDMedusaMultiIndex',
      ]) state[key] = null;
      state.selectedAlsDofSource = 'net';
      state.lastRemoved = [];
      render();
      setStatus('Highlighted move cleared.', 'ok');
    }

    return { clear };
  }

  app.highlightedMoveSelection = { create };
})(window);
