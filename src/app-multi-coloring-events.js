/* StormDoku Multi-colouring tool event wiring. */
(function installMultiColoringEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.multiColoringEvents = { install };
})(window);
