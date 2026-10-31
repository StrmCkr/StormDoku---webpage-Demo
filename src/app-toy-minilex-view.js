/* Mini-lex presentation helpers. */
(function installToyMiniLexView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function clear(elements) {
    elements.summary.textContent = 'No Mini-lex representation has been built.';
    elements.string.textContent = 'none'; elements.grid.textContent = '';
  }
  function mapLabel(map) {
    return Array.isArray(map) ? map.map(value => Number(value) + 1).join('') : '—';
  }
  function digitLabel(map) {
    if (!Array.isArray(map)) return '—';
    const changes = [];
    for (let digit = 1; digit <= 9; digit += 1) {
      if (Number(map[digit]) && Number(map[digit]) !== digit) {
        changes.push(`${digit}→${map[digit]}`);
      }
    }
    return changes.length ? changes.join(' ') : 'identity';
  }
  function render(elements, result) {
    elements.summary.textContent = `${result.label}; ${result.sourceMode}; R1 anchor; clue pattern first; 3,359,232 layouts.`;
    elements.string.textContent = result.key; elements.grid.textContent = '';
    const transformation = result.transformation || {};
    const transform = elements.grid.ownerDocument.createElement('div');
    transform.className = 'toy-minilex-transformation';
    transform.textContent = `Transform: ${transformation.transposed ? 'transpose' : 'direct'}; rows ${mapLabel(transformation.rowMap)}; columns ${mapLabel(transformation.columnMap)}; digits ${digitLabel(transformation.digitMap)}`;
    elements.grid.appendChild(transform);
    for (const digit of result.values) {
      const cell = elements.grid.ownerDocument.createElement('span');
      cell.className = 'toy-minilex-cell'; cell.textContent = digit ? String(digit) : '.';
      elements.grid.appendChild(cell);
    }
  }
  app.toyMiniLexView = { clear, render };
})(window);
