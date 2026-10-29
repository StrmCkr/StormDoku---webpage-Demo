/* StormDoku example-puzzle event wiring. */
(function installExampleEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ buttons, input, load, closePanel, scrollBoard }) {
    for (const button of buttons) {
      button.addEventListener('click', () => {
        input.value = button.dataset.examplePuzzle;
        load();
        closePanel();
        scrollBoard();
      });
    }
  }

  app.exampleEvents = { install };
})(window);
