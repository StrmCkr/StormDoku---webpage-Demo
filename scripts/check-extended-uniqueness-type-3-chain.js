const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const operation = 'uniqueness-extended-type-3-chain';
function search(candidateGrid, variantSettings) {
  self.onmessage({ data: { id: 1, type: operation, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

const cells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const first = '121323132';
const second = '213131223';
const grid = Array.from({ length: 81 }, () => []);
cells.forEach((cell, index) => { grid[cell] = [Number(first[index]), Number(second[index])]; });
for (const [cell, digit] of [[52, 4], [61, 5], [68, 7], [79, 9]]) grid[cell].push(digit);
for (const [cell, values] of [
  [43, [4, 6]], [34, [5, 6]], [25, [6, 8]], [70, [7, 8]],
  [69, [6, 7]], [78, [6, 9]], [16, [8, 9]],
]) grid[cell] = values;

const ascending = (a, b) => a - b;
const identity = value => value;
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
const groupKey = groups => groups.map(group => [...group].sort(ascending).join()).join('|');
const path = [[43], [25, 34], [69, 70], [78]];

function expectChain(candidateGrid, groups, rccs, mapCell = identity, mapDigit = identity) {
  const expectedCells = cells.map(mapCell).sort(ascending);
  const expectedGroups = groups.map(group => group.map(mapCell));
  const forward = groupKey(expectedGroups);
  const reverse = groupKey([...expectedGroups].reverse());
  const results = search(candidateGrid).results;
  assert.ok(results.every(record => record.alsRecords.length >= 4));
  const matches = results.filter(record => {
    const key = groupKey(record.alsRecords.map(als => als.alsAllCells));
    return record.cells.join() === expectedCells.join() && (key === forward || key === reverse);
  });
  assert.equal(matches.length, 1);
  const [result] = matches;
  assert.equal(result.tech, operation);
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending));
  assert.deepEqual(result.plusDigits, [4, 5, 7, 9].map(mapDigit).sort(ascending));
  const isForward = groupKey(result.alsRecords.map(als => als.alsAllCells)) === forward;
  const orderedRccs = (isForward ? rccs : [...rccs].reverse()).map(mapDigit);
  assert.deepEqual(result.rccDigits, orderedRccs);
  assert.deepEqual(result.rccConnections.map(link => link.digit), orderedRccs);
  assert.ok(result.eliminations.some(item => item.cell === mapCell(16) && item.digit === mapDigit(8)));
}

expectChain(grid, path, [6, 8, 6]);
const transformed = Array.from({ length: 81 }, () => []);
const relabelDigit = digit => 10 - digit;
grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(relabelDigit); });
expectChain(transformed, path, [6, 8, 6], transpose, relabelDigit);

const longer = grid.map(values => [...values]);
longer[59].push(5);
longer[80] = [8, 9];
longer[62] = [5, 8];
expectChain(longer, [[43], [25, 34], [69, 70], [78, 80], [62]], [6, 8, 6, 8]);

assert.deepEqual(search(grid, { diagonal: true }).unsupportedVariants, ['diagonal']);
console.log('eUR Type 3 ALS-Chain passed four- and five-node checks, including a transformed four-node proof.');
