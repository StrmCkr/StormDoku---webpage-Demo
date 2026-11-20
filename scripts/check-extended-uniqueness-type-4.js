const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const operation = 'uniqueness-extended-type-4';
function search(candidateGrid, type = operation, variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
function fixture(targetCells) {
  const grid = Array.from({ length: 81 }, () => []);
  cells.forEach((cell, index) => {
    grid[cell] = [Number('121323132'[index]), Number('213131223'[index])];
  });
  targetCells.forEach((cell, index) => { grid[cell].push(4 + index); });
  return grid;
}

const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
const relabel = digit => 10 - digit;
const ascending = (a, b) => a - b;
function expectLock(targetCells, targetUnit, mapCell = identity, mapDigit = identity) {
  const grid = Array.from({ length: 81 }, () => []);
  fixture(targetCells).forEach((values, cell) => { grid[mapCell(cell)] = values.map(mapDigit); });
  const expected = cells.map(mapCell).sort(ascending);
  const result = search(grid).results.find(record => record.cells.join() === expected.join()
    && record.lockedDigit === mapDigit(1));
  assert.ok(result, `Expected an extended Type 4 lock in sector ${targetUnit}`);
  assert.equal(result.tech, operation);
  assert.equal(result.targetUnit, targetUnit);
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.targetCells, targetCells.map(mapCell).sort(ascending));
  assert.deepEqual(result.eliminations.sort((a, b) => a.cell - b.cell), [
    { cell: mapCell(targetCells[0]), digit: mapDigit(3) },
    { cell: mapCell(targetCells[1]), digit: mapDigit(2) },
  ].sort((a, b) => a.cell - b.cell));
}

expectLock([68, 71], 7);
expectLock([68, 71], 16, transpose, relabel);
expectLock([61, 71], 26);

const extraLockLocation = fixture([68, 71]);
extraLockLocation[63] = [1, 8];
assert.ok(!search(extraLockLocation).results.some(record => record.cells.join() === cells.join()));

const thirdEscape = fixture([68, 71]);
thirdEscape[52].push(6);
assert.ok(!search(thirdEscape).results.some(record => record.cells.join() === cells.join()));
assert.deepEqual(search(fixture([68, 71]), operation, { windoku: true }).unsupportedVariants, ['windoku']);

const ordinary = Array.from({ length: 81 }, () => []);
for (const cell of [0, 3, 9, 12]) ordinary[cell] = [1, 2];
ordinary[0].push(4);
ordinary[3].push(5);
ordinary[6] = [2, 8];
assert.ok(search(ordinary, 'uniqueness-type-4').results.some(record => record.size === 4
  && record.lockedDigit === 1 && record.eliminations.length === 2
  && record.eliminations.every(item => item.digit === 2)));
assert.deepEqual(search(ordinary).results, []);

console.log('eUR Type 4 passed row, column, and box sector-lock checks on the verified nine-cell trade.');
