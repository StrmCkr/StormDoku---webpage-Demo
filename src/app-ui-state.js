/* StormDoku shared status and busy-state UI updates. */
(function installUiState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ status, renderActions, updateHistory, getBusy, setBusy, getEpoch, advanceEpoch, buttons, exempt }) {
    function setBusyState(nextBusy, epoch = null) {
      if (epoch !== null && epoch !== getEpoch()) return;
      if (nextBusy) advanceEpoch();
      setBusy(nextBusy);
      for (const button of buttons()) {
        if (button.classList.contains('search-stop')) button.disabled = !getBusy();
        else if (!exempt.has(button)) button.disabled = getBusy();
      }
      updateHistory();
      return getEpoch();
    }

    function setStatus(text, kind = '') {
      status.className = `status ${kind}`.trim();
      status.textContent = text;
      renderActions();
    }

    return { setBusy: setBusyState, setStatus };
  }

  app.uiState = { create };
})(window);
