/* StormDoku main-board strong-link SVG overlay presentation. */
(function installStrongLinkOverlayRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ boardEl, documentRef = global.document, drawSideDigitBoxes, closestAnchorPair, drawArc }) {
    function render(strongLink) {
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay strong-link-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const startSide = { cells: strongLink.activeCells || [], digits: strongLink.startingDigits || [] };
      const endSide = { cells: strongLink.linkedCells || [], digits: strongLink.linkDigits || [] };
      drawSideDigitBoxes(svg, startSide, 'strong-link-side-box strong-link-start-box');
      drawSideDigitBoxes(svg, endSide, 'strong-link-side-box strong-link-end-box');
      const pair = closestAnchorPair(startSide, endSide);
      if (pair) {
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, -0.38);
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, 0.38);
      }
      boardEl.appendChild(svg);
    }

    return { render };
  }

  app.strongLinkOverlayRenderer = { create };
})(window);
