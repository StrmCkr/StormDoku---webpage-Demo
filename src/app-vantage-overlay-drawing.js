/* Drawing primitives for Rn/Cn/Bn chain overlays. */
(function installVantageOverlayDrawing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    vantageAtomAnchor,
    chainCandidateIsVisible,
    applyAlsColorVars,
    resolvedWeakDigits,
    resolvedStrongDigit,
    drawGroupedEndpointBox,
    drawArc,
  }) {
    function vantageSideAnchors(side, forcedDigit = null, existingOnly = true) {
      const sideDigits = side?.digits || [];
      const digits = forcedDigit == null ? sideDigits : [forcedDigit];
      const anchors = [];

      for (const cell of side?.cells || []) {
        for (const digit of digits) {
          if (!sideDigits.includes(digit)) continue;
          if (existingOnly && !chainCandidateIsVisible(cell, digit)) continue;
          anchors.push(vantageAtomAnchor(cell, digit));
        }
      }

      return anchors;
    }

    function vantageClosestAnchorPair(fromSide, toSide, forcedDigit = null, toDigit = forcedDigit) {
      const fromAnchors = vantageSideAnchors(fromSide, forcedDigit);
      const toAnchors = vantageSideAnchors(toSide, toDigit);
      let best = null;

      for (const from of fromAnchors) {
        for (const to of toAnchors) {
          const dx = from.x - to.x;
          const dy = from.y - to.y;
          const distance = dx * dx + dy * dy;
          if (!best || distance < best.distance) best = { from, to, distance };
        }
      }

      return best;
    }

    function drawVantageSideBoxes(svg, side, className, color = null, onlyDigits = null) {
      for (const anchor of vantageSideAnchors(side, null, true)) {
        if (onlyDigits && !onlyDigits.includes(anchor.digit)) continue;
        const half = anchor.markSize * 0.4;
        const rect = documentRef.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(anchor.x - half));
        rect.setAttribute('y', String(anchor.y - half));
        rect.setAttribute('width', String(anchor.markSize * .8));
        rect.setAttribute('height', String(anchor.markSize * .8));
        rect.setAttribute('rx', '.35');
        rect.setAttribute('ry', '.35');
        rect.setAttribute('class', className);
        applyAlsColorVars(rect, color);
        svg.appendChild(rect);
      }
    }

    function drawVantageStrongConnection(svg, fromSide, toSide) {
      const digit = resolvedStrongDigit(fromSide, toSide);
      const pair = vantageClosestAnchorPair(fromSide, toSide, digit);
      if (!pair) return;
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, -0.22);
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, 0.22);
    }

    function drawVantageWeakConnection(svg, fromSide, toSide, weakFromDigit = null, weakToDigit = weakFromDigit) {
      ({ fromDigit: weakFromDigit, toDigit: weakToDigit } = resolvedWeakDigits(
        fromSide, toSide, weakFromDigit, weakToDigit,
      ));
      const pair = vantageClosestAnchorPair(fromSide, toSide, weakFromDigit, weakToDigit);
      if (!pair) return;
      for (const [side, digit] of [[fromSide, weakFromDigit], [toSide, weakToDigit]]) {
        if (digit == null) continue;
        const cells = (side.cells || []).filter(cell => chainCandidateIsVisible(cell, digit));
        if (cells.length > 1) drawGroupedEndpointBox(svg,
          { ...side, cells, digits: [digit] }, 'strong-link-side-box chain-weak-group');
      }
      drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
    }

    function drawVantageWeakConnections(svg, fromSide, toSide, weakDigits = []) {
      const digits = [...new Set((Array.isArray(weakDigits) ? weakDigits : [weakDigits])
        .filter(digit => digit != null))];
      if (!digits.length) {
        drawVantageWeakConnection(svg, fromSide, toSide);
        return;
      }

      for (const digit of digits) {
        drawVantageWeakConnection(svg, fromSide, toSide, digit, digit);
      }
    }

    return {
      vantageSideAnchors,
      vantageClosestAnchorPair,
      drawVantageSideBoxes,
      drawVantageStrongConnection,
      drawVantageWeakConnection,
      drawVantageWeakConnections,
    };
  }

  app.vantageOverlayDrawing = { create };
})(window);
