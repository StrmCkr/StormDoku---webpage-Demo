/* StormDoku player board click, focus, and accessibility interactions. */
(function installPlayerInteraction(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ boardEl, state, actions, requestFrame = global.requestAnimationFrame.bind(global) }) {
    function selectPlayerTarget(cell, digit = null) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= 81) return;
      state.selectedCell = cell;
      state.selectedDigit = Number.isInteger(digit) ? digit : state.selectedDigit;
      actions.renderBoard();
      requestFrame(() => {
        boardEl.querySelector(`[data-player-cell="${cell}"]`)?.focus?.({ preventScroll: true });
      });
    }

    function handlePlayerDigitClick(event, cell, digit, remove = false) {
      event.preventDefault();
      event.stopPropagation();
      state.selectedCell = cell;
      state.selectedDigit = digit;
      if (!remove && event.detail === 2) {
        state.promotionMode = false;
        actions.solvePlayerCell(cell, digit);
        return;
      }
      if (remove) {
        actions.removePlayerDigit(cell, digit);
        state.promotionMode = false;
      } else if (state.promotionMode) {
        actions.solvePlayerCell(cell, digit);
        state.promotionMode = false;
      } else if (!actions.cellHasCandidate(cell, digit)) {
        actions.addPlayerCandidate(cell, digit);
      } else {
        actions.renderBoard();
      }
    }

    function handlePlayerCellClick(event, cell) {
      if (event.target.closest('.mark')) return;
      selectPlayerTarget(cell);
    }

    function handlePlayerCellContextMenu(event, cell) {
      event.preventDefault();
      if (event.target.closest('.mark')) return;
      selectPlayerTarget(cell);
    }

    function bindPlayerDigitElement(element, cell, digit) {
      element.dataset.playerCell = String(cell);
      element.dataset.playerDigit = String(digit);
      element.classList.add('player-mark');
      if (state.selectedCell === cell && state.selectedDigit === digit) {
        element.classList.add('player-digit-selected');
      }
      element.addEventListener('click', event => handlePlayerDigitClick(event, cell, digit));
      element.addEventListener('contextmenu', event => handlePlayerDigitClick(event, cell, digit, true));
    }

    function accessibleCellLabel(cell) {
      const row = Math.floor(cell / 9) + 1;
      const column = (cell % 9) + 1;
      const value = state.puzzle[cell] || state.promoted[cell] || 0;
      if (value) {
        return `Row ${row}, Column ${column}, ${state.originalPuzzle[cell] ? 'given ' : 'value '}${value}`;
      }
      const candidates = (state.candidates[cell] || []).join(', ') || 'no candidates';
      return `Row ${row}, Column ${column}, empty, candidates ${candidates}`;
    }

    function bindPlayerCellElement(element, cell) {
      element.dataset.playerCell = String(cell);
      const rovingCell = state.selectedCell ?? 0;
      element.tabIndex = rovingCell === cell ? 0 : -1;
      element.setAttribute('role', 'gridcell');
      element.setAttribute('aria-rowindex', String(Math.floor(cell / 9) + 1));
      element.setAttribute('aria-colindex', String((cell % 9) + 1));
      element.setAttribute('aria-label', accessibleCellLabel(cell));
      if (actions.isPlayerEditableCell(cell)) element.classList.add('player-editable');
      if (state.selectedCell === cell) element.classList.add('player-selected');
      element.addEventListener('focus', () => {
        state.selectedCell = cell;
        state.selectedDigit = null;
        state.promotionMode = false;
        for (const other of boardEl.querySelectorAll('[role="gridcell"].player-selected')) {
          if (other !== element) other.classList.remove('player-selected');
        }
        element.classList.add('player-selected');
      });
      element.addEventListener('click', event => handlePlayerCellClick(event, cell));
      element.addEventListener('contextmenu', event => handlePlayerCellContextMenu(event, cell));
    }

    return {
      selectPlayerTarget,
      bindPlayerDigitElement,
      bindPlayerCellElement,
    };
  }

  app.playerInteraction = { create };
})(window);
