const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const extendedOperation = 'uniqueness-extended-type-3-xz';
function search(candidateGrid, type = extendedOperation, variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

function fixture(cells, first, second, extraCells, alsCells, target) {
  const grid = Array.from({ length: 81 }, () => []);
  cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
  extraCells.forEach((cell, index) => { grid[cell].push(4 + index); });
  alsCells.forEach((cell, index) => { grid[cell] = [4 + index, 6]; });
  grid[target] = [6, 7];
  return grid;
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const alsCells = [43, 70];
const grid = fixture(cells, '121323132', '213131223', [52, 68], alsCells, 34);
const ascending = (a, b) => a - b;
const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
for (const [mapCell, mapDigit] of [[identity, identity], [transpose, digit => 10 - digit]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
  const expectedCells = cells.map(mapCell).sort(ascending);
  const expectedAlsCells = alsCells.map(mapCell).sort(ascending);
  const matches = search(transformed).results.filter(record => record.cells.join() === expectedCells.join()
    && [...record.alsCells].sort(ascending).join() === expectedAlsCells.join());
  assert.equal(matches.length, 1);
  const [result] = matches;
  assert.equal(result.tech, extendedOperation);
  assert.equal(result.alsRecords.length, 2);
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.plusDigits, [4, 5].map(mapDigit).sort(ascending));
  assert.deepEqual(result.rccDigits, [mapDigit(6)]);
  assert.deepEqual([...result.rccConnections[0].leftCells, ...result.rccConnections[0].rightCells]
    .sort(ascending), expectedAlsCells);
  assert.deepEqual(result.eliminations, [{ cell: mapCell(34), digit: mapDigit(6) }]);
}

const widened = grid.map((values, cell) =>
  cells.includes(cell) ? [1, 2, 3, ...values.filter(digit => digit > 3)] : values);
assert.ok(!search(widened).results.some(record => record.cells.join() === cells.join()));
assert.deepEqual(search(grid, extendedOperation, { diagonal: true }).unsupportedVariants, ['diagonal']);

const ordinary = fixture([0, 3, 9, 12], '1221', '2112', [0, 12], [6, 15], 24);
assert.ok(search(ordinary, 'uniqueness-type-3-xz').results.some(record => record.size === 4
  && record.alsCells.join() === '6,15' && record.rccDigits.join() === '6'
  && record.eliminations.some(item => item.cell === 24 && item.digit === 6)));
assert.deepEqual(search(ordinary).results, []);
console.log('eUR Type 3 ALS-XZ checks passed for the nine-cell trade and its transformed RCC elimination.');
