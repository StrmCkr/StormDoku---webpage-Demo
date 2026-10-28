/* StormDoku manual player-mode UI. */
(function installPlayerMode(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create({ element, setDisabled, setStatus }) {
    function setManualMode(enabled, announce = true) {
      const disabled = !!enabled;
      setDisabled(disabled);
      element.setAttribute('aria-pressed', String(disabled));
      if (announce) setStatus(
        disabled ? 'Manual grid building enabled. Promotion security disabled.' : 'Manual grid building disabled. Promotion security restored.',
        disabled ? 'warn' : 'ok',
      );
    }
    return { setManualMode };
  }
  app.playerMode = { create };
})(window);
