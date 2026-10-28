/* StormDoku sector geometry and frame rendering. */
(function installSectorView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create({ core, boardEl }) {
    function cellsForHouse(ref) {
      const cells = new Set();
      if (!ref) return cells;
      for (const cell of ref.cells || []) cells.add(cell);
      for (const index of ref.indices) {
        const house = ref.type === 'row' ? core.Rset[index] : ref.type === 'col' ? core.Cset[index] : ref.type === 'box' ? core.Bset[index]
          : ref.type === 'variant-sector' || ref.type === 'diagonal' || ref.type === 'anti-diagonal' ? core.UNITS[index] : null;
        for (const cell of house || []) cells.add(cell);
      }
      return cells;
    }
    function cellsForSectors(sectors) {
      const cells = new Set();
      for (const sector of sectors || []) for (const cell of core.UNITS[sector] || []) cells.add(cell);
      return cells;
    }
    function sectorFrameRects(ref) {
      if (!ref) return [];
      const one = 100 / 9;
      if (['variant-sector', 'diagonal', 'anti-diagonal'].includes(ref.type)) {
        const cells = ref.indices.flatMap(index => core.UNITS[index] || []);
        if (!cells.length) return [];
        const rows = cells.map(cell => Math.floor(cell / 9)); const cols = cells.map(cell => cell % 9);
        const minRow = Math.min(...rows); const maxRow = Math.max(...rows); const minCol = Math.min(...cols); const maxCol = Math.max(...cols);
        const rectangle = [];
        for (let row = minRow; row <= maxRow; row++) for (let col = minCol; col <= maxCol; col++) rectangle.push(row * 9 + col);
        if (rectangle.length === cells.length && rectangle.every(cell => cells.includes(cell))) return [{ left: minCol * one, top: minRow * one, width: (maxCol - minCol + 1) * one, height: (maxRow - minRow + 1) * one }];
        return [...new Set(cells)].map(cell => ({ left: (cell % 9) * one, top: Math.floor(cell / 9) * one, width: one, height: one }));
      }
      return ref.indices.map(index => ref.type === 'row'
        ? { left: 0, top: index * one, width: 100, height: one }
        : ref.type === 'col' ? { left: index * one, top: 0, width: one, height: 100 }
          : { left: (index % 3) * (100 / 3), top: Math.floor(index / 3) * (100 / 3), width: 100 / 3, height: 100 / 3 });
    }
    function renderSectorFrames(ref) {
      for (const rect of sectorFrameRects(ref)) {
        const frame = document.createElement('div'); frame.className = 'sector-frame';
        frame.style.left = `${rect.left}%`; frame.style.top = `${rect.top}%`;
        frame.style.width = `${rect.width}%`; frame.style.height = `${rect.height}%`;
        boardEl.appendChild(frame);
      }
    }
    return { cellsForHouse, cellsForSectors, sectorFrameRects, renderSectorFrames };
  }
  app.sectorView = { create };
})(window);
