/* Shared SVG digit-group boxes for chain overlays. */
(function installChainSideBoxDrawing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    sideDigitGroups,
    digitBoundsFromAnchors,
    groupedSideDigits,
    applyAlsColorVars,
  }) {
    function drawSideDigitBoxes(svg, side, className, color = null, onlyDigits = null) {
      for (const anchors of sideDigitGroups(side)) {
        if (onlyDigits && !onlyDigits.includes(anchors[0]?.digit)) continue;
        const box = digitBoundsFromAnchors(anchors, true);
        if (!box) continue;
        const rect = documentRef.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(box.left));
        rect.setAttribute('y', String(box.top));
        rect.setAttribute('width', String(Math.max(0.9, box.right - box.left)));
        rect.setAttribute('height', String(Math.max(0.9, box.bottom - box.top)));
        rect.setAttribute('rx', '0.45');
        rect.setAttribute('ry', '0.45');
        rect.setAttribute('class', className);
        applyAlsColorVars(rect, color);
        svg.appendChild(rect);
      }
    }

    function drawGroupedEndpointBox(svg, side, className) {
      const digits = groupedSideDigits(side);
      if (digits.length) drawSideDigitBoxes(svg, side, className, null, digits);
    }

    return { drawSideDigitBoxes, drawGroupedEndpointBox };
  }

  app.chainSideBoxDrawing = { create };
})(window);
