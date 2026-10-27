/* StormDoku Simple Coloring tool event wiring. */
(function installSimpleColoringEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.simpleColoringEvents = { install };
})(window);
