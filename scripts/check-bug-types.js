const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
const context = vm.createContext({ self });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);
function search(grid, type) {
  self.onmessage({ data: { id: 1, type: 'bug-type-' + type, payload: { candidateGrid: grid } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
}
function base() {
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of [0, 3, 9, 12]) grid[cell] = [1, 2];
  return grid;
}
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
const plusOne = base();
plusOne[0].push(3);
for (const type of ['2,5', '6', '7', '8', '3', '3-xz', '3-xy', '3-chain']) {
  const results = search(plusOne, type).results;
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'B.U.G +1');
  assert.equal(results[0].tech, 'bug-1');
  assert.deepEqual(results[0].eliminations, [{ cell: 0, digit: 1 }, { cell: 0, digit: 2 }]);
}
for (const type of ['2', '5', '6', '7', '8', '3', '3-xz']) {
  const grid = base();
  const add = (cell, digit) => { grid[cell].push(digit); };
  let expected;
  if (type === '2') { add(0, 3); add(3, 3); grid[6] = [3, 4]; expected = [6, 3]; }
  if (type === '5') { add(0, 3); add(12, 3); grid[10] = [3, 4]; expected = [10, 3]; }
  if (type === '6') { add(0, 3); add(12, 4); expected = [0, 1]; }
  if (type === '7') { add(0, 3); grid[1] = [1, 5]; grid[18] = [1, 6]; expected = [0, 1]; }
  if (type === '8') { add(0, 3); grid[6] = [3, 4]; expected = [6, 3]; }
  if (type === '3') { add(0, 3); add(3, 4); grid[6] = [3, 4]; grid[7] = [3, 5]; expected = [7, 3]; }
  if (type === '3-xz') {
    add(0, 3); add(12, 4); grid[6] = [3, 5]; grid[15] = [4, 5]; grid[24] = [5, 6]; expected = [24, 5];
  }
  const result = search(grid, type).results.find(record => record.eliminations.some(item =>
    item.cell === expected[0] && item.digit === expected[1]));
  assert.ok(result, type);
  const isLite = grid.some((digits, cell) => digits.length > 1 && !result.cells.includes(cell));
  assert.equal(result.isLite, isLite);
  assert.ok(result.name.startsWith(isLite ? 'B.U.G -Lite +' + result.polyCells.length + ' Type ' : 'B.U.G Type '));
  if (type === '2' || type === '5') {
    const combined = search(grid, '2,5').results.find(record =>
      record.eliminations.some(item => item.cell === expected[0] && item.digit === expected[1]));
    assert.ok(combined);
    assert.equal(combined.tech, 'bug-type-' + type);
    assert.equal(combined.name, 'B.U.G -Lite +2 Type ' + type);
  }
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(digit => 10 - digit); });
  assert.ok(search(transformed, type).results.some(record => record.eliminations.some(item =>
    item.cell === transpose(expected[0]) && item.digit === 10 - expected[1])), 'Transformed ' + type);
}

const core = context.StormDoku;
let seed = 9876;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = (random() >>> 8) % (index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
for (const [length, type] of [[3, '3-xy'], [4, '3-chain']]) {
  let verified = false;
  for (let attempt = 0; attempt < 2000 && !verified; attempt += 1) {
    const rows = shuffle([0, 1, 2]).flatMap(group => shuffle([0, 1, 2]).map(index => group * 3 + index));
    const cols = shuffle([0, 1, 2]).flatMap(group => shuffle([0, 1, 2]).map(index => group * 3 + index));
    const map = cell => rows[Math.floor(cell / 9)] * 9 + cols[cell % 9];
    const templates = [
      [[43], [[3, 7]]], [[25, 34], [[7, 8], [4, 7]]],
      length === 3 ? [[70], [[5, 8]]] : [[69, 70], [[7, 5], [5, 8]]],
      ...length === 4 ? [[[78], [[7, 6]]]] : [],
    ];
    const groups = templates.map(([cells]) => cells.map(map));
    const formation = [52, 53, 61, 62];
    if (groups.flat().some(cell => formation.includes(cell))) continue;
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of formation) grid[cell] = [1, 2];
    templates.forEach(([cells, values]) => cells.forEach((cell, index) => { grid[map(cell)] = values[index]; }));
    const used = new Set();
    function assignRoof(index) {
      if (index === groups.length) return true;
      const group = groups[index];
      const digit = index + 3;
      const sources = group.filter(cell => grid[cell].includes(digit));
      for (const cell of formation.filter(cell => !used.has(cell)
        && sources.every(source => core.peersOf(cell).includes(source)))) {
        used.add(cell);
        grid[cell].push(digit);
        if (assignRoof(index + 1)) return true;
        grid[cell].pop();
        used.delete(cell);
      }
      return false;
    }
    if (!assignRoof(0)) continue;
    const sources = groups.flat().filter(cell => grid[cell].includes(8));
    const target = Array.from({ length: 81 }, (_, cell) => cell).find(cell =>
      !formation.includes(cell) && !groups.flat().includes(cell)
      && sources.every(source => core.peersOf(cell).includes(source)));
    if (target === undefined) continue;
    grid[target] = [8, 9];
    const alsList = groups.map((cells, uniqueID) => ({
      uniqueID, alsDOF: 1, alsAllCells: cells, alsDigits: [...new Set(cells.flatMap(cell => grid[cell]))],
    }));
    const report = core.findBugType(grid, { type, alsList });
    if (!report.results.some(record => record.eliminations.some(item => item.cell === target && item.digit === 8))) continue;
    assert.ok(report.results.every(record => record.isLite
      && record.name.startsWith('B.U.G -Lite +' + record.polyCells.length + ' Type 3 - ALS')));
    const transformed = Array.from({ length: 81 }, () => []);
    grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(digit => 10 - digit); });
    const transformedAls = alsList.map(als => ({
      ...als, alsAllCells: als.alsAllCells.map(transpose), alsDigits: als.alsDigits.map(digit => 10 - digit),
    }));
    assert.ok(core.findBugType(transformed, { type, alsList: transformedAls }).results.some(record =>
      record.eliminations.some(item => item.cell === transpose(target) && item.digit === 2)));
    assert.ok(report.results.every(record => record.alsRecords.length >= length
      && record.rccDigits.every((digit, index, digits) => index === 0 || digit !== digits[index - 1])));
    verified = true;
  }
  assert.ok(verified, 'Expected ' + type + ' proof');
}
console.log('Dedicated B.U.G types and all four Type 3 searches passed elimination and transformation checks.');
