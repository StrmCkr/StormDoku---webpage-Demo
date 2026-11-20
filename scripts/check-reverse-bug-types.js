const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));

const puzzle = '3....84....7..46.8....1..7.9....352...1...7...341....6.1..9....6.35..2....24....7';
const rows = [
  '3 256 569 2679 2567 8 4 1 259',
  '1 25 7 239 235 4 6 359 8',
  '2458 24568 5689 2369 1 259 39 7 2359',
  '9 678 68 678 4 3 5 2 1',
  '258 2568 1 2689 2568 259 7 34 34',
  '257 3 4 1 25 257 89 89 6',
  '47 1 58 238 9 27 38 6 345',
  '6 47 3 5 78 1 2 489 49',
  '58 9 2 4 38 6 1 358 7',
];
const values = rows.join(' ').split(/\s+/);
const givens = [...puzzle].map(value => Number(value) || 0);
const fixed = values.map(value => value.length === 1 ? Number(value) : 0);
const candidates = values.map(value => value.length === 1 ? [] : [...value].map(Number));
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const transformed of [false, true]) {
  const mapCell = transformed ? transpose : cell => cell;
  const mapDigit = digit => transformed && digit ? 10 - digit : digit;
  const originalGivens = Array(81), fixedGrid = Array(81), candidateGrid = Array(81);
  for (let cell = 0; cell < 81; cell += 1) {
    originalGivens[mapCell(cell)] = mapDigit(givens[cell]);
    fixedGrid[mapCell(cell)] = mapDigit(fixed[cell]);
    candidateGrid[mapCell(cell)] = candidates[cell].map(mapDigit);
  }
  self.onmessage({ data: { id: 1, type: 'reverse-bug-type-2,5', payload: {
    originalGivens, fixedGrid, candidateGrid,
  } } });
  assert.ok(response.result, JSON.stringify(response));
  const result = response.result.results.find(record => record.eliminations.some(item =>
    item.cell === mapCell(62) && item.digit === mapDigit(3)));
  assert.ok(result, 'Published Type 5 elimination r7c9<>3');
  assert.equal(result.name, 'Reverse-BUG Type 5');
  assert.deepEqual(Array.from(result.digits).sort(), [mapDigit(2), mapDigit(5)].sort());
  assert.ok(result.givenCells.every(cell => originalGivens[cell]));
  assert.ok(result.forced.length >= 3);
}
console.log('Reverse-BUG Type 5 published example and transformation passed.');

for (const [mode, count] of [['3', 1], ['3-xz', 2], ['3-xy', 3], ['3-chain', 4]]) {
  const originalGivens = Array(81).fill(0);
  originalGivens[0] = 2;
  originalGivens[3] = 1;
  originalGivens[9] = 1;
  const candidateGrid = Array.from({ length: 81 }, () => []);
  const root = 22;
  candidateGrid[root] = [5, 9];
  candidateGrid[13] = candidateGrid[14] = [3, 4, 5];
  const digits = [4, 6, 7, 8];
  for (let index = 1; index < count; index += 1) {
    candidateGrid[14 + index] = digits.slice(index - 1, index + 1);
  }
  candidateGrid[12] = [2, digits[count - 1]];
  const run = clues => {
    self.onmessage({ data: { id: 1, type: 'reverse-bug-type-' + mode, payload: {
      originalGivens: clues, fixedGrid: originalGivens, candidateGrid,
    } } });
    assert.ok(response.result, JSON.stringify(response));
    return response.result.results.find(record => record.eliminations.some(item =>
      item.cell === root && item.digit === 5));
  };
  const result = run(originalGivens);
  assert.ok(result, 'Expected original-given ALS proof for ' + mode);
  assert.equal(result.alsRecords.length, count);
  assert.equal(result.rccDigits.length, count - 1);
  assert.deepEqual(Array.from(result.cells), [0, 3, 9, 12]);
  assert.ok(!run(Array(81).fill(0)), 'A trade requires original givens');
}
console.log('Reverse-BUG Type 3 passed for all four ALS options and rejected proofs without givens.');

// If r2c4 is 2, the row lock places 1 at r2c1. The assumption also forces
// r3c4 to 3 and r1c4 to 1, closing the trade anchored at the given r1c1=2.
for (const mapCell of [cell => cell, transpose]) {
  const fixedGrid = Array(81).fill(0);
  fixedGrid[mapCell(0)] = 2;
  const candidateGrid = Array.from({ length: 81 }, () => []);
  candidateGrid[mapCell(3)] = [1, 3];
  candidateGrid[mapCell(9)] = [1, 3, 4];
  candidateGrid[mapCell(12)] = [1, 2, 4];
  candidateGrid[mapCell(21)] = [2, 3];
  const run = originalGivens => {
    self.onmessage({ data: { id: 1, type: 'reverse-bug-type-4', payload: {
      originalGivens, fixedGrid, candidateGrid,
    } } });
    assert.ok(response.result, JSON.stringify(response));
    return response.result.results.find(record => record.eliminations.some(item =>
      item.cell === mapCell(12) && item.digit === 2));
  };
  const result = run(fixedGrid);
  assert.ok(result, 'Expected Reverse-BUG Type 4 sector-lock proof');
  assert.equal(result.name, 'Reverse-BUG Type 4');
  assert.equal(result.lockedDigit, 1);
  assert.equal(result.targetUnit, mapCell(9) === 9 ? 1 : 10);
  assert.deepEqual(Array.from(result.givenCells), [mapCell(0)]);
  assert.ok(!run(Array(81).fill(0)), 'The same fixed value cannot substitute for an original clue');
  candidateGrid[mapCell(17)] = [1, 5];
  assert.ok(!run(fixedGrid), 'A third location in the sector breaks the lock');
}
console.log('Reverse-BUG Type 4 passed row and column lock checks, including missing-given and broken-lock cases.');

for (const mapCell of [cell => cell, transpose]) {
  const fixedGrid = Array(81).fill(0);
  fixedGrid[mapCell(3)] = fixedGrid[mapCell(9)] = 1;
  const fishCells = [0, 6, 12, 13, 30, 33, 54, 58];
  const candidateGrid = Array.from({ length: 81 }, () => []);
  for (const cell of fishCells) candidateGrid[mapCell(cell)] = [2, 3, 4];
  const run = originalGivens => {
    self.onmessage({ data: { id: 1, type: 'reverse-bug-type-6', payload: {
      originalGivens, fixedGrid, candidateGrid,
    } } });
    assert.ok(response.result, JSON.stringify(response));
    return response.result.results.find(record =>
      record.eliminations.some(item => item.cell === mapCell(0) && item.digit === 2));
  };
  const result = run(fixedGrid);
  assert.ok(result, 'Expected original-given restricted fish proof');
  assert.equal(result.name, 'Reverse-BUG Type 6');
  assert.equal(result.fishDigit, 2);
  assert.deepEqual(Array.from(result.fishCells).sort(), fishCells.map(mapCell).sort());
  assert.deepEqual(Array.from(result.cells).sort(), [0, 3, 9, 12].map(mapCell).sort());
  assert.ok(result.fishAssignments.some(item => item.cell === mapCell(12) && item.digit === 2));
  assert.ok(!run(Array(81).fill(0)), 'Fixed values alone cannot prove the trade');
  candidateGrid[mapCell(35)] = [2, 5];
  assert.ok(!run(fixedGrid), 'An extra candidate breaks the restricted fish');
}
console.log('Reverse-BUG Type 6 passed restricted fish, transpose, missing-given, and broken-fish checks.');

for (const mapCell of [cell => cell, transpose]) {
  const fixedGrid = Array(81).fill(0);
  fixedGrid[mapCell(0)] = 2;
  const candidateGrid = Array.from({ length: 81 }, () => []);
  candidateGrid[mapCell(3)] = [1, 4];
  candidateGrid[mapCell(9)] = [1, 3];
  candidateGrid[mapCell(12)] = [1, 2];
  const run = originalGivens => {
    self.onmessage({ data: { id: 1, type: 'reverse-bug-type-7', payload: {
      originalGivens, fixedGrid, candidateGrid,
    } } });
    assert.ok(response.result, JSON.stringify(response));
    return response.result.results.find(record =>
      record.eliminations.some(item => item.cell === mapCell(3) && item.digit === 1));
  };
  const result = run(fixedGrid);
  assert.ok(result, 'Expected original-given internal strong-link proof');
  assert.equal(result.name, 'Reverse-BUG Type 7');
  assert.ok(result.internalLinks.some(link => link.digit === 1 && link.forcedCell === mapCell(9)));
  assert.ok(result.internalLinks.every(link => link.cells.every(cell => result.cells.includes(cell))));
  assert.ok(!run(Array(81).fill(0)), 'Fixed values alone cannot prove the trade');
  candidateGrid[mapCell(15)] = [1, 5];
  assert.ok(!run(fixedGrid), 'An outside candidate breaks the internal strong link');
}
console.log('Reverse-BUG Type 7 passed internal link, transpose, missing-given, and outside-candidate checks.');

for (const mapCell of [cell => cell, transpose]) {
  const fixedGrid = Array(81).fill(0);
  fixedGrid[mapCell(0)] = 2;
  fixedGrid[mapCell(3)] = fixedGrid[mapCell(9)] = 1;
  for (const external of [false, true]) {
    const root = external ? 24 : 21;
    const digit = external ? 2 : 3;
    const guardian = external ? 15 : 12;
    const candidateGrid = Array.from({ length: 81 }, () => []);
    candidateGrid[mapCell(12)] = [2, 3];
    candidateGrid[mapCell(root)] = [digit, 4];
    if (external) candidateGrid[mapCell(guardian)] = [2, 5];
    else candidateGrid[mapCell(15)] = [3, 5];
    const run = originalGivens => {
      self.onmessage({ data: { id: 1, type: 'reverse-bug-type-8', payload: {
        originalGivens, fixedGrid, candidateGrid,
      } } });
      assert.ok(response.result, JSON.stringify(response));
      return response.result.results.find(record =>
        record.eliminations.some(item => item.cell === mapCell(root) && item.digit === digit));
    };
    const result = run(fixedGrid);
    assert.ok(result, 'Expected guardian proof anchored by original givens');
    assert.equal(result.name, 'Reverse-BUG Type 8');
    assert.ok(result.guardCells.includes(mapCell(guardian)));
    assert.equal(result.guardDigit, digit);
    assert.equal(result.forcingSectors.length > 0, external);
    assert.ok(!run(Array(81).fill(0)), 'Fixed values alone cannot prove the trade');
    if (external) candidateGrid[mapCell(13)] = [2, 6];
    else candidateGrid[mapCell(12)].push(5);
    assert.ok(!run(fixedGrid), 'A surviving guardian prevents the trade proof');
  }
}
console.log('Reverse-BUG Type 8 passed both guardian forms, transpose, missing-given, and surviving-guardian checks.');
