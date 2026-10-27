/* StormDoku POM tool event wiring. */
(function installPomEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.pomEvents = { install };
})(window);
