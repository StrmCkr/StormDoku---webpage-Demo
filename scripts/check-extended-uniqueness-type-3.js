const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

function search(candidateGrid, type = 'uniqueness-extended-type-3', variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

function fixture(cells, first, second) {
  const grid = Array.from({ length: 81 }, () => []);
  cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
  return grid;
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const grid = fixture(cells, '121323132', '213131223');
grid[52].push(4);
grid[68].push(5);
grid[70] = [4, 5];
grid[43] = [4, 6];
grid[69] = [5, 6];

const ascending = (a, b) => a - b;
const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
for (const [mapCell, mapDigit] of [[identity, identity], [transpose, digit => 10 - digit]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
  const expectedCells = cells.map(mapCell).sort(ascending);
  const result = search(transformed).results.find(record => record.cells.join() === expectedCells.join()
    && record.alsCells.length === 1 && record.alsCells[0] === mapCell(70));
  assert.ok(result, 'Expected the verified nine-cell trade with the single ALS');
  assert.equal(result.tech, 'uniqueness-extended-type-3');
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.plusDigits, [4, 5].map(mapDigit).sort(ascending));
  assert.deepEqual(result.eliminations.sort((a, b) => a.cell - b.cell), [
    { cell: mapCell(43), digit: mapDigit(4) },
    { cell: mapCell(69), digit: mapDigit(5) },
  ].sort((a, b) => a.cell - b.cell));
}

const widened = grid.map((values, cell) =>
  cells.includes(cell) ? [1, 2, 3, ...values.filter(digit => digit > 3)] : values);
assert.ok(!search(widened).results.some(record => record.cells.join() === cells.join()));
assert.deepEqual(search(grid, undefined, { diagonal: true }).unsupportedVariants, ['diagonal']);

const ordinary = fixture([0, 3, 9, 12], '1221', '2112');
ordinary[0].push(4);
ordinary[6] = [4, 5];
ordinary[7] = [5, 6];
assert.ok(search(ordinary, 'uniqueness-type-3').results.some(record => record.size === 4
  && record.alsCells.length === 1 && record.alsCells[0] === 6
  && record.eliminations.some(item => item.cell === 7 && item.digit === 5)));
assert.deepEqual(search(ordinary).results, []);

console.log('Single-ALS eUR Type 3 worker checks passed for the verified nine-cell trade and its relabeling.');
