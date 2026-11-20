/* Assemble the standard board's reusable view components. */
(function installBoardViewRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    appNamespace,
    boardEl,
    documentRef,
    updateColouringSequenceControls,
    variantCellClasses,
    applyCandidateSizeFilterStyle,
    digitHighlightIsVisible,
    applyAlsColorVars,
    applyAhsColorVars,
    applyAlsPartitionColors,
    bindPlayerCellElement,
    renderSectorFrames,
    renderChainOverlay,
    renderHydraAlsDofOverlay,
    renderAlsDofOverlay,
    renderStrongLinkOverlay,
    renderUniquenessRccLinks,
  }) {
    const boardContainerView = appNamespace.boardContainerView.create({
      boardEl,
      updateColouringSequenceControls,
    });
    const boardCellView = appNamespace.boardCellView.create({
      variantCellClasses,
      applyCandidateSizeFilterStyle,
      digitHighlightIsVisible,
      applyAlsColorVars,
      applyAhsColorVars,
      applyAlsPartitionColors,
      bindPlayerCellElement,
    });
    const boardCandidateView = appNamespace.boardCandidateView.create({ documentRef });
    const boardOverlayView = appNamespace.boardOverlayView.create({
      renderSectorFrames,
      renderChainOverlay,
      renderHydraAlsDofOverlay,
      renderAlsDofOverlay,
      renderStrongLinkOverlay,
      renderUniquenessRccLinks,
    });
    return { boardContainerView, boardCellView, boardCandidateView, boardOverlayView };
  }

  app.boardViewRuntime = { create };
})(window);
