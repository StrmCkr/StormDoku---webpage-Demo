/* Grid text and 729 export presentation helpers. */
(function installGridTextView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ elements, encode }) {
    function render({ originalPuzzle, puzzle, promotedValues, cand, solution }) {
      elements.puzzle.textContent = encode(originalPuzzle);
      const givenCount = originalPuzzle.reduce((count, value) => count + (value ? 1 : 0), 0);
      const pencilmarkCount = cand.reduce((count, values, cell) =>
        count + (puzzle[cell] || promotedValues[cell] ? 0 : (values || []).length), 0);
      elements.meta.textContent = `Givens [${givenCount}]  Pencilmarks [${pencilmarkCount}]`;
      elements.solution.textContent = solution ? solution.join('') : 'none';
    }

    function current729({ originalPuzzle, puzzle, promotedValues, cand }) {
      const cells = [];
      for (let cell = 0; cell < 81; cell++) {
        const given = originalPuzzle[cell] || 0;
        const solved = given ? 0 : (promotedValues[cell] || puzzle[cell] || 0);
        const values = given ? [given] : solved ? [solved] : [...(cand[cell] || [])];
        cells.push(values.join(''));
      }
      const cellWidth = Math.max(1, ...cells.map(value => value.length));
      const boxWidth = cellWidth * 3 + 4;
      const horizontal = '.' + Array.from({ length: 3 }, () => '-'.repeat(boxWidth)).join('.') + '.';
      const divider = ':' + Array.from({ length: 3 }, () => '-'.repeat(boxWidth)).join('+') + ':';
      const formatRow = row => '|' + Array.from({ length: 3 }, (_, box) => {
        const start = row * 9 + box * 3;
        return ` ${cells[start].padEnd(cellWidth)} ${cells[start + 1].padEnd(cellWidth)} ${cells[start + 2].padEnd(cellWidth)} `;
      }).join('|') + '|';
      const lines = [horizontal];
      for (let row = 0; row < 9; row++) {
        lines.push(formatRow(row));
        if (row === 2 || row === 5) lines.push(divider);
      }
      lines.push(horizontal);
      return lines.join('\n');
    }

    return { render, current729 };
  }

  app.gridTextView = { create };
})(window);
