/* RC/Rn/Cn/Bn vantage-view helpers. */
(function installVantageView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function renderHeaders({ view, selector, title, numbers, rows }) {
    const isCellView = view === 'RC';
    const rowPrefix = isCellView ? '' : view.charAt(0).toUpperCase();
    selector.value = view;
    title.textContent = isCellView ? 'Columns' : 'Digits';
    numbers.textContent = '';
    rows.textContent = '';
    for (let index = 1; index <= 9; index += 1) {
      const column = document.createElement('span');
      column.textContent = String(index);
      numbers.appendChild(column);
      const row = document.createElement('span');
      row.textContent = rowPrefix ? `${rowPrefix}${index}` : String(index);
      rows.appendChild(row);
    }
  }

  function extractSlice({ view, cand, puzzle, core, showFixed, vantageCellFromSlot }) {
    const state = core.buildSpaces(cand);
    const offset = view === 'Rn' ? 0 : view === 'Cn' ? 9 : 18;
    return Array.from({ length: 9 }, (_, sector) =>
      Array.from({ length: 9 }, (_, digitIndex) => {
        const mask = state.M[offset + sector][digitIndex];
        const positions = new Set();
        for (let position = 0; position < 9; position += 1) {
          if (mask & (1 << position)) positions.add(position);
        }
        if (showFixed) {
          const digit = digitIndex + 1;
          for (let position = 0; position < 9; position += 1) {
            const cell = vantageCellFromSlot(view, sector, position);
            if (puzzle[cell] === digit) positions.add(position);
          }
        }
        return positions;
      }),
    );
  }

  function switchView(view, { setView, renderHeaders, renderBoard } = {}) {
    if (!['RC', 'Rn', 'Cn', 'Bn'].includes(view)) return false;
    setView?.(view);
    renderHeaders?.();
    renderBoard?.();
    return true;
  }

  app.vantageView = { renderHeaders, extractSlice, switchView };
})(window);
