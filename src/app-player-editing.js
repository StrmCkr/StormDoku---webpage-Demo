/* StormDoku player candidate and value editing operations. */
(function installPlayerEditing(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state, actions, validators, arraysEqual }) {
    function commitPlayerEdit(mutator, successMessage, failureMessage = 'That player edit could not be applied.', options = {}) {
      if (state.busy) return false;
      actions.leaveHistoryPreview();
      const before = actions.snapshotState();
      if (!mutator()) {
        actions.setStatus(failureMessage, 'warn');
        actions.renderBoard();
        return false;
      }

      // Candidate edits can invalidate the stored solution. Verified promotions
      // preserve it so further correct promotions remain eligible in the session.
      if (options.preserveSolution !== true) state.solution = null;
      actions.resetAnalysisAfterEdit();
      actions.pushUndo(before);
      actions.clearRedo();
      actions.setStatus(successMessage, 'ok');
      actions.render();
      return true;
    }

    function showLogicSafeguardNote(message, note) {
      actions.setStatus(message, 'warn');
      actions.alert(`${message}\n\n${note}`);
    }

    function addPlayerCandidate(cell, digit) {
      const validation = validators.candidate({
        cell, digit, puzzle: state.puzzle, promotedValues: state.promotedValues,
        candidates: state.candidates, originalPuzzle: state.originalPuzzle, core,
      });
      if (validation?.duplicate) return false;
      if (validation) return commitPlayerEdit(() => false, '', validation.message);
      const values = state.candidates[cell] || [];

      state.selectedCell = cell;
      state.selectedDigit = digit;
      return commitPlayerEdit(() => {
        state.candidates[cell] = [...values, digit].sort((left, right) => left - right);
        return true;
      }, `Candidate ${digit} added to ${core.cellName(cell)}.`, undefined, { preserveSolution: true });
    }

    function solvePlayerCell(cell, digit) {
      const validation = validators.promotion({
        cell, digit, puzzle: state.puzzle, promotedValues: state.promotedValues,
        candidates: state.candidates, originalPuzzle: state.originalPuzzle,
        solution: state.solution, promotionSecurityDisabled: state.promotionSecurityDisabled, core,
      });
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      if (validation) return commitPlayerEdit(() => false, '', validation.message);

      state.selectedCell = cell;
      state.selectedDigit = digit;
      return commitPlayerEdit(() => {
        const beforeCandidates = state.candidates.map(values => [...(values || [])]);

        state.puzzle[cell] = digit;
        state.promotedValues[cell] = digit;
        state.candidates[cell] = [];
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || state.puzzle[other] || state.promotedValues[other]) continue;
          const legal = new Set(core.candidatesFor(state.puzzle, other));
          state.candidates[other] = (state.candidates[other] || []).filter(value => legal.has(value));
        }

        const affected = [cell];
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || state.originalPuzzle[other] || state.puzzle[other] || state.promotedValues[other]) continue;
          if (!arraysEqual(beforeCandidates[other], state.candidates[other] || [])) affected.push(other);
        }
        const entries = affected.map(other => ({
          cell: other,
          puzzle: state.puzzle[other],
          promoted: state.promotedValues[other],
          cand: beforeCandidates[other],
          afterPuzzle: state.puzzle[other],
          afterPromoted: state.promotedValues[other],
          afterCand: [...(state.candidates[other] || [])],
        }));
        for (const entry of entries) {
          entry.afterPuzzle = state.puzzle[entry.cell];
          entry.afterPromoted = state.promotedValues[entry.cell];
          entry.afterCand = [...(state.candidates[entry.cell] || [])];
        }
        state.solveBackups.set(cell, { digit, entries });
        return true;
      }, `${core.cellName(cell)} set to ${digit}.`, undefined, { preserveSolution: true });
    }

    function clearPlayerSolvedCell(cell) {
      if (!state.puzzle[cell]) return false;
      const validation = validators.clear({
        cell, puzzle: state.puzzle, solution: state.solution,
        originalPuzzle: state.originalPuzzle, core,
      });
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      const solvedDigit = state.puzzle[cell];
      return commitPlayerEdit(() => {
        const backup = state.solveBackups.get(cell);
        state.puzzle[cell] = 0;
        state.promotedValues[cell] = 0;

        if (backup?.digit === solvedDigit) {
          for (const entry of backup.entries) {
            if (entry.cell === cell) {
              state.candidates[entry.cell] = [...entry.cand];
              continue;
            }
            const unchangedSinceSolve = state.puzzle[entry.cell] === entry.afterPuzzle
              && state.promotedValues[entry.cell] === entry.afterPromoted
              && arraysEqual(state.candidates[entry.cell] || [], entry.afterCand);
            if (unchangedSinceSolve) state.candidates[entry.cell] = [...entry.cand];
          }
        } else {
          const rebuilt = core.allCandidates(state.puzzle);
          state.candidates[cell] = rebuilt[cell] || [];
        }

        state.solveBackups.delete(cell);
        state.selectedDigit = null;
        return true;
      }, `${core.cellName(cell)} cleared.`);
    }

    function removePlayerDigit(cell, digit) {
      if (!actions.isPlayerEditableCell(cell)) {
        showLogicSafeguardNote(
          `${core.cellName(cell)} is a fixed Sudoku value and cannot be deleted.`,
          'Your logic is flawed. Double-check it.',
        );
        return false;
      }
      if (state.puzzle[cell] || state.promotedValues[cell]) return clearPlayerSolvedCell(cell);
      const values = state.candidates[cell] || [];
      const validation = validators.candidateRemoval({
        cell, digit, candidates: state.candidates, solution: state.solution, core,
      });
      if (validation?.unchanged) return false;
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      if (validation) return commitPlayerEdit(() => false, '', validation.message);

      state.selectedCell = cell;
      state.selectedDigit = digit;
      return commitPlayerEdit(() => {
        state.candidates[cell] = values.filter(value => value !== digit);
        return true;
      }, `Candidate ${digit} removed from ${core.cellName(cell)}.`, undefined, { preserveSolution: true });
    }

    return {
      addPlayerCandidate,
      solvePlayerCell,
      clearPlayerSolvedCell,
      removePlayerDigit,
    };
  }

  app.playerEditing = { create };
})(window);
