/* StormDoku 3D Medusa Simple Colouring tool event wiring. */
(function installMedusaSimpleColoringEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.medusaSimpleColoringEvents = { install };
})(window);
