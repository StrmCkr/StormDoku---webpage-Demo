/* Shared SVG arc creation for chain and link overlays. */
(function installChainArcDrawing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, routeArc, arcPath }) {
    function drawArc(svg, from, to, className, bend = 4, lane = 0) {
      const route = routeArc(from, to, bend, lane);
      const path = documentRef.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', arcPath(route.from, route.to, route.bend, route.lane));
      path.setAttribute('class', className);
      svg.appendChild(path);
      return path;
    }

    return drawArc;
  }

  app.chainArcDrawing = { create };
})(window);
