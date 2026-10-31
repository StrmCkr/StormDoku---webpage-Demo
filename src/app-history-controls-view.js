/* StormDoku undo/redo button presentation. */
(function installHistoryControlsView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ undo, redo }) {
    function render({ busy, undoCount, redoCount }) {
      undo.disabled = busy || undoCount === 0;
      redo.disabled = busy || redoCount === 0;
    }

    return { render };
  }

  app.historyControlsView = { create };
})(window);
