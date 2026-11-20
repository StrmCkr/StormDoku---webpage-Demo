const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const operation = 'uniqueness-extended-type-7';
function search(candidateGrid, type = operation, variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const first = '121323132';
const second = '213131223';
const grid = Array.from({ length: 81 }, () => []);
cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
grid[52].push(4);
// Allow r6c8=4 by giving digit 1 alternatives outside the trade.
grid[51] = [1, 5];
grid[43] = [1, 6];

const identity = value => value;
const ascending = (a, b) => a - b;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
for (const [mapCell, mapDigit] of [[identity, identity], [transpose, digit => 10 - digit]]) {
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
  const expectedCells = cells.map(mapCell).sort(ascending);
  const matches = search(transformed).results.filter(record => record.cells.join() === expectedCells.join());
  assert.equal(matches.length, 1);
  const [result] = matches;
  assert.equal(result.tech, operation);
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.bivalueCells, cells.slice(1).map(mapCell).sort(ascending));
  assert.ok(result.internalLinks.length > 0);
  assert.ok(result.internalLinks.every(link =>
    [...link.activeCells, ...link.linkedCells].every(cell => expectedCells.includes(cell))));
  assert.deepEqual(result.eliminations.filter(item => item.cell === mapCell(52))
    .map(item => item.digit).sort(ascending), [1, 2].map(mapDigit).sort(ascending));
  // The escape assignment using the first filling and r6c8=4 remains legal.
  const escape = new Map(cells.map((cell, index) => [mapCell(cell), mapDigit(index ? Number(first[index]) : 4)]));
  assert.ok(result.eliminations.every(item => escape.get(item.cell) !== item.digit));
}

const noEscape = grid.map(values => [...values]);
noEscape[52] = [1, 2];
assert.deepEqual(search(noEscape).results, []);
assert.deepEqual(search(grid, operation, { diagonal: true }).unsupportedVariants, ['diagonal']);

const ordinary = Array.from({ length: 81 }, () => []);
for (const cell of [0, 3, 9, 12]) ordinary[cell] = [1, 2];
ordinary[0].push(4);
ordinary[1] = [1, 5];
ordinary[18] = [1, 6];
assert.ok(search(ordinary, 'uniqueness-type-7').results.some(record => record.size === 4
  && record.eliminations.some(item => item.cell === 0 && item.digit === 1)));
assert.deepEqual(search(ordinary).results, []);

console.log('eUR Type 7 passed the verified nine-cell trade, internal links, and transformed eliminations.');
