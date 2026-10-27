/* StormDoku ALS-Link tool event wiring. */
(function installAlsLinkEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', run);
  }

  app.alsLinkEvents = { install };
})(window);
