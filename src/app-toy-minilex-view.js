/* Mini-lex presentation helpers. */
(function installToyMiniLexView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function clear(elements) {
    elements.summary.textContent = 'No Mini-lex representation has been built.';
    elements.string.textContent = 'none'; elements.grid.textContent = '';
  }
  function render(elements, result) {
    elements.summary.textContent = `${result.label}; ${result.sourceMode}; R1 anchor; clue pattern first; 3,359,232 layouts.`;
    elements.string.textContent = result.key; elements.grid.textContent = '';
    for (const digit of result.values) {
      const cell = elements.grid.ownerDocument.createElement('span');
      cell.className = 'toy-minilex-cell'; cell.textContent = digit ? String(digit) : '.';
      elements.grid.appendChild(cell);
    }
  }
  app.toyMiniLexView = { clear, render };
})(window);
