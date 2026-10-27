/* StormDoku strong-link tool event wiring. */
(function installStrongLinkEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', run);
  }

  app.strongLinkEvents = { install };
})(window);
