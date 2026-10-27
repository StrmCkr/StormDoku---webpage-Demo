/* StormDoku ALS tool event wiring. */
(function installAlsEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', run);
  }

  app.alsEvents = { install };
})(window);
