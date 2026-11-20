/* StormDoku almost-fish chain overlay drawing. */
(function installAlmostFishOverlayDrawing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core, documentRef = global.document, sideAnchors, digitBoxBounds,
    digitAnchor, drawSideDigitBoxes, drawStrongConnection,
  }) {
    return function drawAlmostFishOverlay(svg, step) {
      const construction = step.view?.node?.raw?.xorConstruction;
      if (construction?.kind !== 'almost-fish') return;
      const digit = Number(construction.digit);
      const fishCells = [...new Set(construction.fishCells || [])];
      const extraCells = [...new Set(construction.extraCells || [])];
      const fish = construction.fish || {};
      if (!Number.isInteger(digit) || !fishCells.length) return;

      const fishSide = { cells: fishCells, digits: [digit] };
      for (const anchor of sideAnchors(fishSide, digit, true)) {
        const box = digitBoxBounds(anchor, .16);
        const rect = documentRef.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(box.left));
        rect.setAttribute('y', String(box.top));
        rect.setAttribute('width', String(Math.max(.8, box.right - box.left)));
        rect.setAttribute('height', String(Math.max(.8, box.bottom - box.top)));
        rect.setAttribute('rx', '.32');
        rect.setAttribute('ry', '.32');
        rect.setAttribute('class', 'almost-fish-digit-box');
        svg.appendChild(rect);
      }

      // Draw each cover as a paired dashed connection between the fish digits
      // it covers, separate from the ordinary cell XOR endpoint.
      for (const sector of fish.coverSectors || []) {
        const covered = fishCells
          .filter(cell => core.UNITS?.[sector]?.includes(cell))
          .map(cell => digitAnchor(cell, digit))
          .filter(Boolean);
        if (covered.length < 2) continue;
        covered.sort((left, right) => left.x - right.x || left.y - right.y);
        for (let index = 1; index < covered.length; index += 1) {
          const from = covered[index - 1];
          const to = covered[index];
          for (const lane of [-.72, .72]) {
            const line = documentRef.createElementNS('http://www.w3.org/2000/svg', 'line');
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.hypot(dx, dy) || 1;
            const nx = -dy / length * lane;
            const ny = dx / length * lane;
            line.setAttribute('x1', String(from.x + nx));
            line.setAttribute('y1', String(from.y + ny));
            line.setAttribute('x2', String(to.x + nx));
            line.setAttribute('y2', String(to.y + ny));
            line.setAttribute('class', 'almost-fish-cover-line');
            svg.appendChild(line);
          }
        }
      }

      drawSideDigitBoxes(
        svg,
        { cells: extraCells, digits: [digit] },
        'strong-link-side-box strong-link-start-box',
      );
      drawStrongConnection(
        svg,
        { cells: extraCells, digits: [digit] },
        fishSide,
      );
    };
  }

  app.almostFishOverlayDrawing = { create };
})(window);
