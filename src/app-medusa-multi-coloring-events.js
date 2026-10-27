/* StormDoku 3D Medusa Multi-colouring tool event wiring. */
(function installMedusaMultiColoringEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.medusaMultiColoringEvents = { install };
})(window);
