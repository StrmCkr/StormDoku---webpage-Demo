const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
const context = vm.createContext({ self });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);

const operation = 'uniqueness-extended-type-8';
function search(candidateGrid, variantSettings) {
  self.onmessage({ data: { id: 1, type: operation, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const first = '121323132';
const second = '213131223';
const solution = Array.from(
  '725698143986134257134572968298415376351726489647389512879251634562843791413967825',
  Number,
);
function fixture(guardianDigit) {
  const grid = solution.map(digit => digit === guardianDigit ? [digit, 5] : []);
  cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
  grid[52].push(4);
  return grid;
}

const direct = fixture(4);
const sector = fixture(1);
sector[51] = [1, 5];
sector[43] = [1, 6];

const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
const ascending = (a, b) => a - b;
const match = (results, root, digit, footprint = cells) => results.find(record =>
  record.externalCell === root && record.externalDigit === digit && record.cells.join() === footprint.join());

for (const [grid, root, digit, guardian, expectedSectors] of [
  [direct, 7, 4, 52, []],
  [sector, 6, 1, 51, [5]],
]) {
  for (const [mapCell, mapDigit, mapSector] of [
    [identity, identity, identity],
    [transpose, value => 10 - value, value => 9 + value],
  ]) {
    const transformed = Array.from({ length: 81 }, () => []);
    grid.forEach((values, cell) => { transformed[mapCell(cell)] = values.map(mapDigit); });
    const result = match(search(transformed).results, mapCell(root), mapDigit(digit),
      cells.map(mapCell).sort(ascending));
    assert.ok(result, 'Expected the external assumption to expose the verified nine-cell trade');
    assert.equal(result.tech, operation);
    assert.equal(result.fullyExposed, true);
    assert.equal(result.interchangeable, true);
    assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
    assert.deepEqual(result.breakerCells, [mapCell(guardian)]);
    assert.deepEqual(result.forcingSectors, expectedSectors.map(mapSector));
    assert.deepEqual(result.eliminations, [{ cell: mapCell(root), digit: mapDigit(digit) }]);
  }
}

// r2c6=4 turns off the r2c7 decoy, forcing r1c8=4 in box 3.
// r1c8 then turns off the surplus 4 at r6c8.
const chain = fixture(4);
chain[15] = [4, 6];
const find = (grid, maxDepth) => context.StormDoku.findExtendedUniquenessType8(grid, { maxDepth }).results;
assert.equal(match(find(chain, 1), 14, 4), undefined);
assert.equal(match(find(chain, 2), 14, 4)?.breakerCells.join(), '52');

const extraEscape = fixture(4);
extraEscape[52].push(6);
assert.equal(match(search(extraEscape).results, 7, 4), undefined);
assert.deepEqual(search(direct, { windoku: true }).unsupportedVariants, ['windoku']);

console.log('eUR Type 8 passed direct and sector guardians, isomorphic transformations, and two-step forcing.');
