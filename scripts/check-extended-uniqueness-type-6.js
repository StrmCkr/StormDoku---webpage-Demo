const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const operation = 'uniqueness-extended-type-6';
function search(candidateGrid, type = operation, variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
function fixture(targetCells) {
  const grid = Array.from({ length: 81 }, () => []);
  const first = '121323132';
  const second = '213131223';
  cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
  targetCells.forEach((cell, index) => { grid[cell].push(4 + index); });
  return grid;
}

const targets = [52, 71];
const grid = fixture(targets);
const identity = value => value;
const ascending = (a, b) => a - b;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
for (const [mapCell, mapDigit] of [[identity, identity], [transpose, digit => 10 - digit]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
  const expectedCells = cells.map(mapCell).sort(ascending);
  const results = search(transformed).results.filter(record => record.cells.join() === expectedCells.join());
  assert.equal(results.length, 2);
  for (const [digit, fishCells] of [[1, [52, 53, 59, 61, 68, 71]], [2, [52, 53, 65, 71, 74, 79]]]) {
    const result = results.find(record => record.lockedDigit === mapDigit(digit));
    assert.ok(result);
    assert.equal(result.tech, operation);
    assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
    assert.deepEqual(result.fishCells, fishCells.map(mapCell).sort(ascending));
    assert.deepEqual(result.targetCells, targets.map(mapCell).sort(ascending));
    assert.deepEqual(result.eliminations, targets.map(mapCell).sort(ascending)
      .map(cell => ({ cell, digit: mapDigit(digit) })));
  }
}

const openFish = fixture(targets);
openFish[51] = [1, 8];
assert.ok(!search(openFish).results.some(record => record.cells.join() === cells.join() && record.lockedDigit === 1));
const oppositeSides = fixture([52, 68]);
assert.ok(!search(oppositeSides).results.some(record => record.cells.join() === cells.join()));
assert.deepEqual(search(grid, operation, { diagonal: true }).unsupportedVariants, ['diagonal']);

const ordinary = Array.from({ length: 81 }, () => []);
for (const cell of [0, 3, 9, 12]) ordinary[cell] = [1, 2];
ordinary[0].push(4);
ordinary[12].push(5);
assert.ok(search(ordinary, 'uniqueness-type-6').results.some(record => record.size === 4
  && record.lockedDigit === 1 && record.targetCells.join() === '0,12'));
assert.deepEqual(search(ordinary).results, []);

console.log('eUR Type 6 passed both restricted-fish proofs on the nine-cell trade and their transformed eliminations.');
