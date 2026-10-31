/* StormDoku player-board keyboard navigation and shortcuts. */
(function installPlayerKeyboard(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, documentRef = global.document, state, actions,
  }) {
    function select(cell) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= 81) return;
      state.selectedCell = cell;
      actions.renderBoard();
      global.requestAnimationFrame(() => {
        boardEl.querySelector(`[data-player-cell="${cell}"]`)?.focus?.({ preventScroll: true });
      });
    }

    function move(rowDelta, colDelta) {
      const current = state.selectedCell ?? 0;
      const row = Math.floor(current / 9);
      const col = current % 9;
      const wrap = value => (value + 9) % 9;
      select(wrap(row + rowDelta) * 9 + wrap(col + colDelta));
    }

    function isTextEntryTarget(target) {
      return target instanceof documentRef.defaultView.Element
        && Boolean(target.closest('input, select, textarea, button, [contenteditable="true"]'));
    }

    function handleKeydown(event) {
      if (actions.isBusy() || isTextEntryTarget(event.target)) return;

      const viewByFunctionKey = { F1: 'RC', F2: 'Rn', F3: 'Cn', F4: 'Bn' };
      if (viewByFunctionKey[event.key]) {
        event.preventDefault();
        actions.setGridView(viewByFunctionKey[event.key]);
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        const shortcut = event.key.toLowerCase();
        if (shortcut === 'n') {
          event.preventDefault();
          actions.nextCycle();
          return;
        }
        if (shortcut === 'r') {
          event.preventDefault();
          actions.runAll();
          return;
        }
        if (shortcut === 'b') {
          event.preventDefault();
          actions.basics();
          return;
        }
        if (shortcut === 'a') {
          event.preventDefault();
          actions.apply();
          return;
        }
        if (shortcut === 's') {
          event.preventDefault();
          actions.stop();
          return;
        }
        if (state.selectedCell === null) return;
        const ctrlDigitMatch = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
        if (state.ctrlDigitRemovesCandidate && ctrlDigitMatch) {
          event.preventDefault();
          const digit = Number(ctrlDigitMatch[1]);
          if (state.puzzle[state.selectedCell] || state.promoted[state.selectedCell]) {
            actions.setStatus('Solved cells cannot have candidates removed.', 'warn');
          } else {
            actions.removePlayerDigit(state.selectedCell, digit);
          }
          state.promotionMode = false;
          return;
        }
        if (shortcut === 'z') {
          event.preventDefault();
          actions.undoCycle();
        } else if (shortcut === 'y' || (event.shiftKey && shortcut === 'z')) {
          event.preventDefault();
          actions.redoCycle();
        } else if (event.key.toLowerCase() === 'n') {
          event.preventDefault();
          actions.nextCycle();
        } else if (event.key.toLowerCase() === 'r') {
          event.preventDefault();
          actions.runAll();
        }
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        state.promotionMode = true;
        return;
      }

      const digitMatch = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
      const digit = /^[1-9]$/.test(event.key)
        ? Number(event.key) : digitMatch ? Number(digitMatch[1]) : null;
      if (digit !== null && !event.altKey) {
        event.preventDefault();
        if (state.promotionMode) actions.solvePlayerCell(state.selectedCell, digit);
        else actions.addPlayerCandidate(state.selectedCell, digit);
        state.promotionMode = false;
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (state.puzzle[state.selectedCell] || state.promoted[state.selectedCell]) {
          actions.clearPlayerSolvedCell(state.selectedCell);
        } else if (state.selectedDigit !== null) {
          actions.removePlayerDigit(state.selectedCell, state.selectedDigit);
        } else {
          actions.setStatus('Select a candidate before deleting it.', 'warn');
        }
        return;
      }

      if (event.key === 'Home') { event.preventDefault(); select(0); }
      else if (event.key === 'End') { event.preventDefault(); select(80); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1, 0); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); move(1, 0); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); move(0, -1); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); move(0, 1); }
      else if (event.key === 'Escape') {
        event.preventDefault();
        state.selectedCell = null;
        state.selectedDigit = null;
        state.promotionMode = false;
        actions.renderBoard();
      }
    }

    return { handleKeydown, move, isTextEntryTarget };
  }

  app.playerKeyboard = { create };
})(window);
