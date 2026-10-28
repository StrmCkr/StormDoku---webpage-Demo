/* StormDoku Toy control helpers. */
(function installToyControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function pairValue(select) { return String(select.value).split(':').map(Number); }
  function fillSelect(select, options) {
    select.textContent = '';
    for (const option of options) {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      select.appendChild(element);
    }
  }
  function initialize(elements) {
    const pairs = [[0, 1], [0, 2], [1, 2]];
    fillSelect(elements.stack, pairs.map(([first, second]) => ({ value: `${first}:${second}`, label: `Stack ${first + 1} ↔ ${second + 1}` })));
    fillSelect(elements.band, pairs.map(([first, second]) => ({ value: `${first}:${second}`, label: `Band ${first + 1} ↔ ${second + 1}` })));
    const rows = []; const columns = [];
    for (let unit = 0; unit < 3; unit++) for (const [first, second] of pairs) {
      rows.push({ value: `${unit}:${first}:${second}`, label: `Band ${unit + 1}: R${unit * 3 + first + 1} ↔ R${unit * 3 + second + 1}` });
      columns.push({ value: `${unit}:${first}:${second}`, label: `Stack ${unit + 1}: C${unit * 3 + first + 1} ↔ C${unit * 3 + second + 1}` });
    }
    fillSelect(elements.row, rows); fillSelect(elements.column, columns);
    const digits = Array.from({ length: 9 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
    fillSelect(elements.digitA, digits); fillSelect(elements.digitB, digits); elements.digitB.value = '2';
  }
  app.toyControls = { pairValue, fillSelect, initialize };
})(window);
