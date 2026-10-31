/* StormDoku RC/Rn/Cn/Bn view controller. */
(function installGridViewController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ vantageView, getView, setView, selector, title, numbers, rows, renderBoard,
    getCandidates, getPuzzle, core, getShowFixed, vantageCellFromSlot }) {
    function renderHeaders() {
      vantageView.renderHeaders({ view: getView(), selector, title, numbers, rows });
    }

    function switchView(view) {
      return vantageView.switchView(view, {
        setView,
        renderHeaders,
        renderBoard,
      });
    }

    function extractSlice(view) {
      return vantageView.extractSlice({
        view,
        cand: getCandidates(),
        puzzle: getPuzzle(),
        core,
        showFixed: getShowFixed(),
        vantageCellFromSlot,
      });
    }

    return { renderHeaders, switchView, extractSlice };
  }

  app.gridViewController = { create };
})(window);
