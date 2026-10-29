/* StormDoku player-edit state helpers. */
(function installPlayerState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function cloneSolveBackups(backups) {
    return [...backups.entries()].map(([cell, backup]) => [cell, {
      digit: backup.digit,
      entries: backup.entries.map(entry => ({ ...entry, cand: [...entry.cand], afterCand: [...entry.afterCand] })),
    }]);
  }

  function restoreSolveBackups(saved) {
    return new Map((saved || []).map(([cell, backup]) => [cell, {
      digit: backup.digit,
      entries: (backup.entries || []).map(entry => ({ ...entry, cand: [...(entry.cand || [])], afterCand: [...(entry.afterCand || [])] })),
    }]));
  }

  function arraysEqual(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function isEditableCell(cell, originalPuzzle) {
    return Number.isInteger(cell) && cell >= 0 && cell < 81 && !originalPuzzle[cell];
  }

  function validatePlayerPromotion({
    cell,
    digit,
    puzzle,
    promotedValues,
    candidates,
    originalPuzzle,
    solution,
    promotionSecurityDisabled = false,
    core,
  } = {}) {
    if (!isEditableCell(cell, originalPuzzle)) return { message: 'Given cells cannot be changed.' };
    if (puzzle[cell] || promotedValues[cell]) return { message: 'That cell is already solved.' };
    if (!(candidates[cell] || []).includes(digit)) {
      return { message: `Candidate ${digit} is not present in ${core.cellName(cell)}.` };
    }
    if (!promotionSecurityDisabled && (!solution || solution[cell] !== digit)) {
      return {
        safeguard: true,
        message: solution
          ? `${core.cellName(cell)} cannot be set to ${digit}: it is not the verified solution value.`
          : 'This grid has no verified solution loaded, so a value cannot be promoted.',
        note: 'Sudoku is not a guessing game: use logic to assert why this can only be this value.',
      };
    }
    if (core.peersOf(cell).some(peer => puzzle[peer] === digit)) {
      return { message: `Digit ${digit} conflicts with a solved peer.` };
    }
    if (typeof core.canPlace === 'function' && !core.canPlace(puzzle, cell, digit)) {
      return { message: `Digit ${digit} conflicts with an active variation constraint.` };
    }
    return null;
  }

  function validatePlayerClear({ cell, puzzle, solution, originalPuzzle, core } = {}) {
    if (solution?.[cell] === puzzle[cell]) {
      return {
        safeguard: true,
        message: `${core.cellName(cell)} contains the verified solution value ${puzzle[cell]} and cannot be deleted.`,
        note: 'Your logic is flawed. Double-check it.',
      };
    }
    if (!isEditableCell(cell, originalPuzzle)) {
      return {
        safeguard: true,
        message: `${core.cellName(cell)} is a given value and cannot be deleted.`,
        note: 'Your logic is flawed. Double-check it.',
      };
    }
    return null;
  }

  function validatePlayerCandidate({ cell, digit, puzzle, promotedValues, candidates, originalPuzzle, core } = {}) {
    if (!isEditableCell(cell, originalPuzzle) || puzzle[cell] || promotedValues[cell]) {
      return { message: 'Given or solved cells cannot receive pencilmarks.' };
    }
    if (core.peersOf(cell).some(peer => puzzle[peer] === digit)) {
      return { message: `Candidate ${digit} conflicts with a solved peer.` };
    }
    if ((candidates[cell] || []).includes(digit)) return { duplicate: true };
    return null;
  }

  function validatePlayerCandidateRemoval({ cell, digit, candidates, solution, core } = {}) {
    const values = candidates[cell] || [];
    if (!values.includes(digit)) return { unchanged: true };
    if (solution?.[cell] === digit) {
      return {
        safeguard: true,
        message: `${core.cellName(cell)} must retain its verified solution candidate ${digit}.`,
        note: 'Your logic is flawed. Double-check it.',
      };
    }
    if (values.length <= 1) return { message: 'A cell must retain at least one candidate.' };
    return null;
  }

  app.playerState = {
    cloneSolveBackups,
    restoreSolveBackups,
    arraysEqual,
    isEditableCell,
    validatePlayerPromotion,
    validatePlayerClear,
    validatePlayerCandidate,
    validatePlayerCandidateRemoval,
  };
})(window);
