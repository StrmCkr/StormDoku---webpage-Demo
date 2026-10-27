/* StormDoku MSLS tool event wiring. */
(function installMslsEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }

  app.mslsEvents = { install };
})(window);
