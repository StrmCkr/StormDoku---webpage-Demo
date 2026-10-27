/* StormDoku ALS-XZ tool event wiring. */
(function installAlsXzEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }
  app.alsXzEvents = { install };
})(window);
