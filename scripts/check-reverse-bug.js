const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));
const examples = [
  {
    puzzle: '.7.2..3..6.21..45.....7...8....6...4...8.7...5...3....7...5.....69..87.5..5..3.6.',
    rows: [
      '189 7 18 2 4 5 3 19 6', '6 3 2 1 8 9 4 5 7', '19 5 4 3 7 6 129 129 8',
      '1238 1289 1378 5 6 12 129 78 4', '124 1249 6 8 12 7 5 1239 39',
      '5 128 178 9 3 4 6 78 12', '7 128 138 6 5 12 1289 4 39',
      '123 6 9 4 12 8 7 123 5', '1248 1248 5 7 9 3 128 6 12',
    ],
    target: 2, digit: 1, pair: [1, 2],
  },
  {
    puzzle: '...1.49..7..9..42....7..6...6........2...5...8...3...4.8.....7....5.....231.6...5',
    rows: [
      '3 5 6 1 2 4 9 8 7', '7 1 8 9 5 6 4 2 3', '9 4 2 7 8 3 6 5 1',
      '45 6 3459 28 7 19 25 13 89', '1 2 39 68 4 5 7 36 89',
      '8 79 579 26 3 19 25 16 4', '45 8 45 3 9 2 1 7 6',
      '6 79 79 5 1 8 3 4 2', '2 3 1 4 6 7 8 9 5',
    ],
    target: 51, digit: 5, pair: [4, 5],
  },
];
function search(candidateGrid, originalGivens, fixedGrid, variantSettings) {
  self.onmessage({ data: { id: 1, type: 'reverse-bug', payload: {
    candidateGrid, originalGivens, fixedGrid, variantSettings,
  } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}
const ascending = (a, b) => a - b;
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const example of examples) {
  assert.equal(example.puzzle.length, 81);
  const givens = Array.from(example.puzzle, ch => Number(ch) || 0);
  const domains = example.rows.join(' ').split(/\s+/).map(values => Array.from(values, Number));
  const fixed = domains.map(values => values.length === 1 ? values[0] : 0);
  const candidates = domains.map(values => values.length === 1 ? [] : values);
  for (const transformed of [false, true]) {
    const map = transformed ? transpose : cell => cell;
    const digit = value => transformed && value ? 10 - value : value;
    const g = new Array(81), f = new Array(81), c = new Array(81);
    givens.forEach((value, cell) => { g[map(cell)] = digit(value); });
    fixed.forEach((value, cell) => { f[map(cell)] = digit(value); });
    candidates.forEach((values, cell) => { c[map(cell)] = values.map(digit); });
    const pair = example.pair.map(digit).sort(ascending);
    const result = search(c, g, f).results.find(record => record.digits.join() === pair.join()
      && record.eliminations.some(item => item.cell === map(example.target) && item.digit === digit(example.digit)));
    assert.ok(result, 'Expected published Reverse-BUG elimination');
    assert.ok(result.cells.length < 18);
    const expectedGivens = g.flatMap((value, cell) => pair.includes(value) ? [cell] : []);
    assert.deepEqual(result.givenCells, expectedGivens);
    assert.ok(expectedGivens.every(cell => result.cells.includes(cell)));
    for (const cells of [
      ...Array.from({ length: 9 }, (_, row) => Array.from({ length: 9 }, (_, col) => row * 9 + col)),
      ...Array.from({ length: 9 }, (_, col) => Array.from({ length: 9 }, (_, row) => row * 9 + col)),
      ...Array.from({ length: 9 }, (_, box) => Array.from({ length: 9 }, (_, i) =>
        Math.floor(box / 3) * 27 + box % 3 * 3 + Math.floor(i / 3) * 9 + i % 3)),
    ]) {
      const assignments = result.assignments.filter(item => cells.includes(item.cell));
      assert.ok(!assignments.length || assignments.length === 2);
      if (assignments.length) assert.deepEqual(assignments.map(item => item.digit).sort(ascending), pair);
    }
  }
  assert.deepEqual(search(candidates, givens, fixed, { diagonal: true }).unsupportedVariants, ['diagonal']);
}
console.log('Both published Reverse-BUG examples passed, including original-given proofs and transformations.');
