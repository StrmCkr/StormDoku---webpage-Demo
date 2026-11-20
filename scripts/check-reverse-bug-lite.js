const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
const context = vm.createContext({ self });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);
const examples = [
  {
    puzzle: '...4...25..9..57..12.7....42.............256...431...2..3..4.........68...1.8...9',
    rows: [
      '.. .. .. 4 .. .. .. 2 5', '.. .. 9 .. .. 5 7 .. 6',
      '1 2 5 7 .. .. .. 9 4', '2 .. .. .. .. .. .. .. ..',
      '.. .. 7 .. 4 2 5 6 ..', '.. .. 4 3 1 .. 9 7 2',
      '.. .. 3 .. .. 4 .. .. ..', '.. .. 2 .. .. .. 6 8 ..',
      '.. .. 1 .. 8 .. .. .. 9',
    ],
    target: 28, digit: 1,
  },
  {
    puzzle: '..76.89..........512...54..2...7.63.318.............9.....978.....4....9.3..2..7.',
    rows: [
      '45 45 7 6 1 8 9 2 3', '689 689 3 279 4 29 17 16 5',
      '1 2 69 79 3 5 4 8 67', '2 59 59 18 7 4 6 3 18',
      '3 1 8 259 6 29 257 45 47', '467 467 46 1258 58 3 25 9 18',
      '456 456 1456 3 9 7 8 1456 2', '5678 5678 2 4 58 16 3 156 9',
      '45689 3 14569 58 2 16 15 7 46',
    ],
    target: 20, digit: 9,
  },
];
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const example of examples) {
  assert.equal(example.puzzle.length, 81);
  const givens = Array.from(example.puzzle, ch => Number(ch) || 0);
  const values = example.rows.join(' ').split(/\s+/).map(text => Array.from(text, Number));
  const fixed = values.map(digits => digits.length === 1 ? digits[0] : 0);
  const candidates = values.map((digits, cell) => digits.length === 1 ? []
    : example.digit === 1 ? context.StormDoku.candidatesFor(fixed, cell) : digits);
  for (const transform of [false, true]) {
    const mapCell = transform ? transpose : cell => cell;
    const mapDigit = digit => transform && digit ? 10 - digit : digit;
    const originalGivens = new Array(81), fixedGrid = new Array(81), candidateGrid = new Array(81);
    givens.forEach((digit, cell) => { originalGivens[mapCell(cell)] = mapDigit(digit); });
    fixed.forEach((digit, cell) => { fixedGrid[mapCell(cell)] = mapDigit(digit); });
    candidates.forEach((digits, cell) => { candidateGrid[mapCell(cell)] = digits.map(mapDigit); });
    self.onmessage({ data: { id: 1, type: 'reverse-bug-lite', payload: { originalGivens, fixedGrid, candidateGrid } } });
    assert.ok(response.result, JSON.stringify(response));
    const result = response.result.results.find(record => record.eliminations.some(item =>
      item.cell === mapCell(example.target) && item.digit === mapDigit(example.digit)));
    assert.ok(result, 'Expected published Reverse-BUG-Lite elimination');
    assert.equal(result.name, 'Reverse-BUG-Lite');
    assert.equal(result.tech, 'reverse-bug-lite');
    assert.ok(result.cells.length < 18);
    const allLineGivens = originalGivens.flatMap((digit, cell) => digit && result.lines.includes(
      result.axis === 'row' ? Math.floor(cell / 9) : cell % 9) ? [cell] : []);
    assert.ok(allLineGivens.every(cell => result.cells.includes(cell)));
    if (example.digit === 9) {
      assert.ok(result.forcingAssignments.some(item => item.cell === mapCell(28) && item.digit === mapDigit(9)));
      assert.ok(result.forcingAssignments.some(item => item.cell === mapCell(72) && item.digit === mapDigit(9)));
    }
  }
}
console.log('Reverse-BUG-Lite published direct and strong-link examples passed, including transformations.');
