const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const self = { postMessage(message) { response = message; } };
const context = vm.createContext({ self });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);

function search(candidateGrid, type = 'uniqueness-extended-type-2-5', variantSettings) {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}

function fixture(cells, first, second, roofs, target) {
  const grid = Array.from({ length: 81 }, () => []);
  cells.forEach((cell, index) => {
    grid[cell] = [Number(first[index]), Number(second[index])];
    if (roofs.includes(cell)) grid[cell].push(4);
  });
  grid[target] = [4, 5];
  return grid;
}

function expectElimination(grid, size, type, cell) {
  const result = search(grid).results.find(record => record.size === size && record.type === type);
  assert.ok(result, `Expected eUR Type ${type} of size ${size}`);
  assert.deepEqual(result.digits, [1, 2, 3]);
  assert.deepEqual(result.eliminations, [{ cell, digit: 4 }]);
}

const six = fixture([27, 31, 35, 45, 49, 53], '123231', '231123', [27, 31], 29);
expectElimination(six, 6, 2, 29);
assert.deepEqual(search(six, undefined, { windoku: true }).results, []);

// The three-digit size-9 minlex UA and its verified interchangeable filling.
const nineCells = [52, 53, 59, 61, 65, 68, 71, 74, 79];
const nineRoofs = [52, 68];
const nineTarget = 70;
const nine = fixture(nineCells, '121323132', '213131223', nineRoofs, nineTarget);

const identity = value => value;
const swap = (a, b) => value => value === a ? b : value === b ? a : value;
const mapRow = map => cell => map(Math.floor(cell / 9)) * 9 + cell % 9;
const mapColumn = map => cell => Math.floor(cell / 9) * 9 + map(cell % 9);
const transpose = cell => (cell % 9) * 9 + Math.floor(cell / 9);
const swapGroups = (a, b) => index => swap(a, b)(Math.floor(index / 3)) * 3 + index % 3;
const transforms = [
  ['original', identity, identity],
  ['transpose', transpose, identity],
];
for (let group = 0; group < 3; group += 1) {
  for (let first = 0; first < 3; first += 1) {
    for (let second = first + 1; second < 3; second += 1) {
      const a = group * 3 + first;
      const b = group * 3 + second;
      transforms.push([`swap rows ${a + 1}/${b + 1}`, mapRow(swap(a, b)), identity]);
      transforms.push([`swap columns ${a + 1}/${b + 1}`, mapColumn(swap(a, b)), identity]);
    }
  }
}
for (let a = 0; a < 3; a += 1) {
  for (let b = a + 1; b < 3; b += 1) {
    transforms.push([`swap bands ${a + 1}/${b + 1}`, mapRow(swapGroups(a, b)), identity]);
    transforms.push([`swap stacks ${a + 1}/${b + 1}`, mapColumn(swapGroups(a, b)), identity]);
  }
}
for (let digit = 1; digit < 9; digit += 1) {
  transforms.push([`swap digits ${digit}/${digit + 1}`, identity, swap(digit, digit + 1)]);
}
transforms.push([
  'combined spatial and digit relabeling',
  cell => transpose(mapColumn(swapGroups(0, 2))(mapRow(swap(6, 8))(cell))),
  digit => 10 - digit,
]);

const ascending = (a, b) => a - b;
for (const [label, mapCell, mapDigit] of transforms) {
  const grid = Array.from({ length: 81 }, () => []);
  nine.forEach((values, cell) => { grid[mapCell(cell)] = values.map(mapDigit); });
  const cells = nineCells.map(mapCell).sort(ascending);
  const matches = search(grid).results.filter(record => record.type === 5 && record.size === cells.length
    && record.cells.every((cell, index) => cell === cells[index]));
  assert.equal(matches.length, 1, label);
  const [result] = matches;
  assert.deepEqual(result.digits, [1, 2, 3].map(mapDigit).sort(ascending), label);
  assert.equal(result.extraDigit, mapDigit(4), label);
  assert.deepEqual(result.zCells, nineRoofs.map(mapCell).sort(ascending), label);
  assert.deepEqual(result.eliminations, [{ cell: mapCell(nineTarget), digit: mapDigit(4) }], label);
}

// Widening every domain admits fillings with no same-signature alternative.
for (const cell of nineCells) nine[cell] = nineRoofs.includes(cell) ? [1, 2, 3, 4] : [1, 2, 3];
assert.deepEqual(search(nine).results, []);

const solution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const twentySeven = Array.from(solution, Number).map(digit => digit <= 3 ? [digit, digit % 3 + 1] : []);
twentySeven[1].push(4);
twentySeven[7].push(4);
twentySeven[0] = [4, 5];
expectElimination(twentySeven, 27, 2, 0);

const ordinary = fixture([0, 3, 9, 12], '1221', '2112', [0, 3], 6);
assert.ok(search(ordinary, 'uniqueness-type-2-5').results.some(record => record.type === 2));
assert.deepEqual(search(ordinary).results, []);

console.log('eUR Type 2/5 worker checks passed for 6, 9, and 27 cells, including negative cases.');
console.log(`The minlex nine-cell Type 5 passed all ${transforms.length} isomorphism cases.`);
