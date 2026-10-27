/* StormDoku example-puzzle event wiring. */
(function installExampleEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ buttons, input, load, closePanel, scrollBoard, special }) {
    for (const button of buttons) {
      button.addEventListener('click', () => {
        input.value = button.dataset.exampleKey === 'non-colourable-chromatic'
          ? special.nonColourable()
          : button.dataset.exampleKey === 'blank-candidate-grid'
            ? special.blankCandidate()
            : button.dataset.examplePuzzle;
        load();
        closePanel();
        scrollBoard();
      });
    }
  }

  app.exampleEvents = { install };
})(window);
