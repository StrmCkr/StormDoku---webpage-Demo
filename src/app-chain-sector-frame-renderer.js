/* StormDoku chain-sector frame overlay presentation. */
(function installChainSectorFrameRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, chainSectorFrameData }) {
    function render(svg, sectors) {
      for (const { name, rect } of chainSectorFrameData(sectors)) {
        const frame = documentRef.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frame.setAttribute('x', String(rect.left));
        frame.setAttribute('y', String(rect.top));
        frame.setAttribute('width', String(rect.width));
        frame.setAttribute('height', String(rect.height));
        frame.setAttribute('class', 'chain-sector-frame');
        frame.dataset.sector = name;
        svg.appendChild(frame);
      }
    }

    return { render };
  }

  app.chainSectorFrameRenderer = { create };
})(window);
