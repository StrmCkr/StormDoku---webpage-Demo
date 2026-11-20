/* Assemble the board's chain, strong-link, and ALS-DOF overlay renderers. */
(function installBoardOverlayRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    appNamespace,
    boardEl,
    documentRef,
    chainSectorFrameData,
    orientedDisplayChainSteps,
    isModuleVisualStep,
    isAlmostFishVisualStep,
    drawAlmostFishOverlay,
    drawSideDigitBoxes,
    drawGroupedEndpointBox,
    visibleChainExitSide,
    visibleChainEntrySide,
    digitAnchor,
    drawArc,
    sideAnchors,
    digitBoundsFromAnchors,
    resolvedWeakDigits,
    moduleVisualSides,
    crossDigitAnchorPair,
    groupedAnchorPair,
    drawStrongConnection,
    isAlsVisualStep,
    drawVantageWeakConnection,
    drawVantageWeakConnections,
    drawVantageStrongConnection,
    drawVantageSideBoxes,
    vantageClosestAnchorPair,
    closestAnchorPair,
  }) {
    const chainSectorFrameRenderer = appNamespace.chainSectorFrameRenderer.create({
      documentRef,
      chainSectorFrameData,
    });
    function drawChainSectorFrames(svg, sectors) {
      return chainSectorFrameRenderer.render(svg, sectors);
    }
    const chainOverlayRenderer = appNamespace.chainOverlayRenderer.create({
      boardEl,
      documentRef,
      orientedDisplayChainSteps,
      isModuleVisualStep,
      isAlmostFishVisualStep,
      drawAlmostFishOverlay,
      drawSideDigitBoxes,
      drawGroupedEndpointBox,
      visibleChainExitSide,
      visibleChainEntrySide,
      drawChainSectorFrames,
      digitAnchor,
      drawArc,
      sideAnchors,
      digitBoundsFromAnchors,
      resolvedWeakDigits,
      moduleVisualSides,
      crossDigitAnchorPair,
      groupedAnchorPair,
      drawStrongConnection,
    });
    const vantageOverlayRenderer = appNamespace.vantageOverlayRenderer.create({
      boardEl,
      documentRef,
      orientedDisplayChainSteps,
      visibleChainExitSide,
      visibleChainEntrySide,
      isAlsVisualStep,
      moduleVisualSides,
      isAlmostFishVisualStep,
      drawVantageWeakConnection,
      drawVantageWeakConnections,
      drawVantageStrongConnection,
      drawVantageSideBoxes,
      vantageClosestAnchorPair,
      drawArc,
    });
    const strongLinkOverlayRenderer = appNamespace.strongLinkOverlayRenderer.create({
      boardEl,
      documentRef,
      drawSideDigitBoxes,
      closestAnchorPair,
      drawArc,
    });
    const alsDofOverlayRenderer = appNamespace.alsDofOverlayRenderer.create({
      boardEl,
      documentRef,
      drawArc,
      vantageClosestAnchorPair,
      groupedAnchorPair,
    });

    return {
      drawChainSectorFrames,
      chainOverlayRenderer,
      vantageOverlayRenderer,
      strongLinkOverlayRenderer,
      alsDofOverlayRenderer,
    };
  }

  app.boardOverlayRuntime = { create };
})(window);
