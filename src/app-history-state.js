/* StormDoku solution-step history preview state. */
(function installHistoryState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ snapshot, restore, restoreVisual, isBusy, cancel, setStatus, render, focus }) {
    let preview = null;

    function leave() {
      if (!preview) return false;
      const liveState = preview.liveState;
      preview = null;
      restore(liveState);
      return true;
    }

    function inspect(index, entry) {
      if (!entry?.displayState) {
        setStatus('This older step has no saved board snapshot.', 'warn');
        return;
      }
      if (isBusy()) cancel('Search stopped to view a solution step.');
      if (!preview) preview = { index, liveState: snapshot() };
      else preview.index = index;
      restoreVisual(entry.displayState);
      setStatus(`Viewing solution step ${entry.cycle}.`, 'ok');
      render();
      focus();
    }

    return {
      leave,
      inspect,
      get active() { return Boolean(preview); },
      get index() { return preview?.index ?? null; },
    };
  }

  app.historyState = { create };
})(window);
