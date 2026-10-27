/* StormDoku Chain tool event wiring. */
(function installChainEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }
  app.chainEvents = { install };
})(window);
