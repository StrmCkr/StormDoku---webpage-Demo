/* Undo and redo operations for completed solver cycles. */
(function installHistoryCycle(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, leavePreview, snapshot, restore, setStatus, render }) {
    function undo() {
      leavePreview();
      if (!state.undoStack.length) {
        setStatus('Nothing to undo.', 'warn');
        render();
        return false;
      }

      state.redoStack.push(snapshot());
      restore(state.undoStack.pop());
      setStatus('Last cycle undone. Candidate grid restored.', 'ok');
      render();
      return true;
    }

    function redo() {
      leavePreview();
      if (!state.redoStack.length) {
        setStatus('Nothing to redo.', 'warn');
        render();
        return false;
      }

      state.undoStack.push(snapshot());
      restore(state.redoStack.pop());
      setStatus('Last cycle redone. Candidate grid restored.', 'ok');
      render();
      return true;
    }

    return { undo, redo };
  }

  app.historyCycle = { create };
})(window);
