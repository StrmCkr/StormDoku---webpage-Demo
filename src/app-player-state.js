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

  app.playerState = { cloneSolveBackups, restoreSolveBackups, arraysEqual, isEditableCell };
})(window);
