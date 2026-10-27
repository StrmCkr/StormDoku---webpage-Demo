/* StormDoku board-level event wiring. */
(function installBoardEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ fixedToggle, getFixed, setFixed, renderBoard, handleKeydown, gridView, setGridView }) {
    fixedToggle.addEventListener('change', () => {
      setFixed(fixedToggle.checked);
      renderBoard();
    });
    document.addEventListener('keydown', handleKeydown);
    gridView.addEventListener('change', () => setGridView(gridView.value));
  }

  app.boardEvents = { install };
})(window);
