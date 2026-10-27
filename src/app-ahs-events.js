/* StormDoku AHS tool event wiring. */
(function installAhsEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', run);
  }

  app.ahsEvents = { install };
})(window);
