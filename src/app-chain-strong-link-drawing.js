/* Shared strong-link SVG strokes for chain overlays. */
(function installChainStrongLinkDrawing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ resolvedStrongDigit, groupedAnchorPair, drawArc }) {
    function drawStrongConnection(svg, fromSide, toSide, allowMissing = false) {
      const digit = resolvedStrongDigit(fromSide, toSide);
      const pair = groupedAnchorPair(fromSide, toSide, digit, digit, allowMissing);
      if (!pair) return;
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, -0.38);
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, 0.38);
    }

    return { drawStrongConnection };
  }

  app.chainStrongLinkDrawing = { create };
})(window);
