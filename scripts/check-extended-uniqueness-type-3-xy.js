const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const operation = 'uniqueness-extended-type-3-xy';
function search(candidateGrid, type = operation, variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

function fixture(cells, first, second, lastExtraCell) {
  const grid = Array.from({ length: 81 }, () => []);
  cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
  grid[52].push(4);
  grid[61].push(5);
  grid[lastExtraCell].push(7);
  grid[43] = [4, 6];
  grid[34] = [5, 6];
  grid[25] = [6, 8];
  grid[70] = [7, 8];
  grid[16] = [6, 8, 9];
  return grid;
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const grid = fixture(cells, '121323132', '213131223', 68);
const ascending = (a, b) => a - b;
const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
const groupKey = groups => groups.map(group => [...group].sort(ascending).join()).join('|');
const pathKey = groups => [groupKey(groups), groupKey([...groups].reverse())].sort()[0];
const alsPath = [[43], [25, 34], [70]];

for (const [mapCell, mapDigit] of [[identity, identity], [transpose, digit => 10 - digit]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
  const expectedCells = cells.map(mapCell).sort(ascending);
  const expectedPath = pathKey(alsPath.map(group => group.map(mapCell)));
  const matches = search(transformed).results.filter(record => record.cells.join() === expectedCells.join()
    && pathKey(record.alsRecords.map(als => als.alsAllCells)) === expectedPath);
  assert.equal(matches.length, 1);
  const [result] = matches;
  assert.equal(result.tech, operation);
  assert.equal(result.alsRecords.length, 3);
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.plusDigits, [4, 5, 7].map(mapDigit).sort(ascending));
  assert.deepEqual([...result.rccDigits].sort(ascending), [6, 8].map(mapDigit).sort(ascending));
  assert.equal(result.rccConnections.length, 2);
  for (const [digit, sources] of [[6, [25, 34, 43]], [8, [25, 70]]]) {
    const connection = result.rccConnections.find(link => link.digit === mapDigit(digit));
    assert.ok(connection);
    assert.deepEqual([...connection.leftCells, ...connection.rightCells].sort(ascending),
      sources.map(mapCell).sort(ascending));
  }
  assert.deepEqual(result.eliminations.map(item => [item.cell, item.digit]).sort((a, b) => a[1] - b[1]),
    [6, 8].map(digit => [mapCell(16), mapDigit(digit)]).sort((a, b) => a[1] - b[1]));
}

const widened = grid.map((values, cell) =>
  cells.includes(cell) ? [1, 2, 3, ...values.filter(digit => digit > 3)] : values);
assert.ok(!search(widened).results.some(record => record.cells.join() === cells.join()));
assert.deepEqual(search(grid, operation, { diagonal: true }).unsupportedVariants, ['diagonal']);

const ordinary = fixture([52, 53, 61, 62], '1221', '2112', 62);
assert.ok(search(ordinary, 'uniqueness-type-3-xy').results.some(record => record.size === 4
  && pathKey(record.alsRecords.map(als => als.alsAllCells)) === pathKey(alsPath)
  && [6, 8].every(digit => record.eliminations.some(item => item.cell === 16 && item.digit === digit))));
assert.deepEqual(search(ordinary).results, []);

console.log('eUR Type 3 ALS-XY checks passed for the verified nine-cell trade, both RCCs, and the relabeled elimination.');
