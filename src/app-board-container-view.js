/* StormDoku board container presentation setup. */
(function installBoardContainerView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ boardEl, updateColouringSequenceControls }) {
    function prepare(gridView) {
      boardEl.textContent = '';
      updateColouringSequenceControls();
      boardEl.classList.toggle('vantage-board', gridView !== 'RC');
      boardEl.classList.toggle('vantage-rn', gridView === 'Rn');
      boardEl.classList.toggle('vantage-cn', gridView === 'Cn');
      boardEl.classList.toggle('vantage-bn', gridView === 'Bn');
      boardEl.setAttribute('role', 'grid');
      boardEl.setAttribute('aria-rowcount', '9');
      boardEl.setAttribute('aria-colcount', '9');
      boardEl.tabIndex = gridView === 'RC' ? -1 : 0;
      boardEl.setAttribute('aria-label', gridView === 'RC'
        ? 'Sudoku candidate grid'
        : `Sudoku ${gridView} candidate view`);
    }

    return { prepare };
  }

  app.boardContainerView = { create };
})(window);
