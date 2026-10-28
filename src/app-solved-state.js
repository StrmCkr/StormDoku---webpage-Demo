/* StormDoku solved-state helpers. */
(function installSolvedState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function candidateGridIsSolved(candidateGrid, grid, expectedSolution) {
    if (!Array.isArray(expectedSolution) || expectedSolution.length !== 81) return false;
    return candidateGrid.every((values, cell) => {
      if (grid[cell]) return grid[cell] === expectedSolution[cell];
      return values.length === 1 && values[0] === expectedSolution[cell];
    });
  }

  function boardIsComplete(puzzle, promotedValues) {
    return puzzle.every((value, cell) => value || promotedValues[cell]);
  }

  app.solvedState = { candidateGridIsSolved, boardIsComplete };
})(window);
