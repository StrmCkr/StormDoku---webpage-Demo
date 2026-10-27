/* StormDoku search-control event wiring. */
(function installSearchEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function installStopButtons({ buttons, stop }) {
    for (const button of buttons) {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        stop();
      });
    }
  }

  app.searchEvents = { installStopButtons };
})(window);
