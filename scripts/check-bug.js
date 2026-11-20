const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));
function search(grid, mode, variantSettings) {
  self.onmessage({ data: { id: 1, type: 'bug-' + mode, payload: { candidateGrid: grid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}
function base() {
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of [0, 3, 9, 12]) grid[cell] = [1, 2];
  return grid;
}
const one = base();
one[0].push(3);
const result = search(one, '1').results.find(record => record.guardians.length === 1
  && record.guardians[0].cell === 0 && record.guardians[0].digit === 3);
assert.ok(result);
assert.equal(result.name, 'B.U.G +1');
assert.deepEqual(search(one, 'lite').results, []);
assert.deepEqual(result.eliminations, [{ cell: 0, digit: 1 }, { cell: 0, digit: 2 }]);

const many = base();
many[0].push(3);
many[3].push(3);
for (const cell of [6, 8, 33, 35]) many[cell] = [3, 4];
const n = search(many, 'n').results.find(record => record.eliminations.some(item => item.cell === 6 && item.digit === 3));
assert.ok(n);
assert.equal(n.name, 'B.U.G +2');
assert.ok(!search(many, 'lite').results.some(record => record.cells.join() === n.cells.join()));
assert.deepEqual(n.guardians, [{ cell: 0, digit: 3 }, { cell: 3, digit: 3 }]);

const lite = base();
lite[0].push(3);
lite[80] = [4, 5, 6, 7];
assert.deepEqual(search(lite, '1').results, []);
const partial = search(lite, 'lite').results.find(record => record.cells.join() === '0,3,9,12');
assert.ok(partial);
assert.equal(partial.name, 'B.U.G -Lite +1');
assert.equal(partial.extraCellCount, 1);
assert.deepEqual(partial.eliminations, result.eliminations);
assert.deepEqual(search(base(), 'lite').results, []);

// Regression: BUG-Lite forcing example.  The direct guardian conflict is
// insufficient here; the valid branches force the row-9 9 into r9c1/r9c6,
// so the other row-9 9 candidates must be removed.
const forcingExample = [
  '12 3 9 57 6 57 4 18 28',
  '15 8 56 2 9 4 3 16 7',
  '4 26 7 8 1 3 5 9 26',
  '8 45 45 3 2 6 9 7 1',
  '29 29 3 15 7 15 68 68 4',
  '6 7 1 9 4 8 2 5 3',
  '3 469 46 467 8 79 1 2 5',
  '79 14 8 14 5 2 67 3 69',
  '579 1569 2 16 3 19 78 4 89',
].flatMap(row => row.split(' ').map(value => [...value].map(Number)));
const forcing = search(forcingExample, 'lite').results.find(record =>
  record.cells.includes(72) && record.cells.includes(73) && record.cells.includes(80)
  && record.polyCells.length === 3);
assert.ok(forcing);
assert.equal(forcing.name, 'B.U.G -Lite +3');
assert.ok(forcing.eliminations.some(item => item.cell === 73 && item.digit === 9));
assert.ok(forcing.forcingEliminations.some(item => item.cell === 80 && item.digit === 9));
assert.ok(!forcing.eliminations.some(item => item.cell === 72 && [5, 7].includes(item.digit)));
assert.ok(forcing.forcingBranches?.some(branch => branch.guardian.cell === 72
  && branch.guardian.digit === 9 && !branch.contradiction));
assert.ok(forcing.forcingBranches?.some(branch => branch.guardian.cell === 55
  && branch.guardian.digit === 9 && branch.contradiction));
const broken = base();
broken[0].push(3);
broken[12] = [];
assert.deepEqual(search(broken, '1').results, []);
assert.deepEqual(search(one, '1', { diagonal: true }).unsupportedVariants, ['diagonal']);

const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const [grid, mode, record] of [[one, '1', result], [many, 'n', n], [lite, 'lite', partial]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(digit => 10 - digit); });
  const expectedCells = record.cells.map(transpose).sort((a, b) => a - b);
  const matches = search(transformed, mode).results.filter(item => item.cells.join() === expectedCells.join());
  for (const { cell, digit } of record.eliminations) {
    assert.ok(matches.some(item => item.eliminations.some(elim =>
      elim.cell === transpose(cell) && elim.digit === 10 - digit)));
  }
}
console.log('B.U.G +1, B.U.G +n, and B.U.G -Lite worker checks passed, including transformations and invalid patterns.');
