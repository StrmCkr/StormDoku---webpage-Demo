/* StormDoku Chromatic graph event wiring. */
(function(global){
  const app=global.StormDokuApp=global.StormDokuApp||{};
  function install({graph,alsGraph,runGraph,runAlsGraph}){
    graph.addEventListener('click',runGraph);
    alsGraph.addEventListener('click',runAlsGraph);
  }
  app.chromaticEvents={install};
})(window);
