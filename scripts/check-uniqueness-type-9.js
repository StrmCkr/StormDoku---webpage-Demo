const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
vm.runInContext(globalThis.StormDokuSearchWorkerSource, vm.createContext({ self }));
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);

for (const mapCell of [cell => cell, transpose]) {
  const cells = [0, 3, 9, 12].map(mapCell).sort((a, b) => a - b);
  const noise = [1, 2, 5, 6, 7, 8, 9];
  const grid = Array.from({ length: 81 }, () => [...noise]);
  for (const cell of cells) grid[cell] = [1, 2];
  grid[mapCell(0)].push(3);
  grid[mapCell(12)].push(4);
  grid[mapCell(27)] = [3, 5, 6];
  grid[mapCell(30)] = [3, 4];
  grid[mapCell(34)] = [3, 7, 8];
  const search = variantSettings => {
    self.onmessage({ data: { id: 1, type: 'uniqueness-type-9', payload: { candidateGrid: grid, variantSettings } } });
    assert.ok(response.result, JSON.stringify(response));
    return JSON.parse(JSON.stringify(response.result));
  };
  const find = () => search().results.find(result => result.cells.join() === cells.join()
    && result.digits.join() === '1,2');
  const open = find();
  assert.ok(open, 'Expected the open guardian AIC');
  assert.equal(open.ring, false, 'A one-way implication must not force both guardians');
  assert.deepEqual(open.forcedGuardians, []);
  const witness = open.witnesses.find(item => item.cell === mapCell(27) && item.digit === 3);
  assert.ok(witness, 'Expected r4c1<>3 from the two ends');
  assert.ok(witness.paths.some(path => path.length === 2));
  assert.ok(witness.paths.some(path => path.some(item => item.cell === mapCell(30) && item.on)));

  grid[mapCell(9)].push(3);
  const grouped = find();
  assert.ok(grouped && !grouped.ring);
  assert.deepEqual(grouped.guardians[0].cells, [0, 9].map(mapCell).sort((a, b) => a - b));
  assert.equal(grouped.witnesses.find(item => item.cell === mapCell(27) && item.digit === 3).paths.length, 3);
  grid[mapCell(9)].pop();

  grid[mapCell(27)] = [3, 4];
  grid[mapCell(34)] = noise;
  const ring = find();
  assert.ok(ring?.ring, 'Expected the two-way guardian ring');
  assert.deepEqual(ring.forcedGuardians, [
    { digit: 3, cells: [mapCell(0)] }, { digit: 4, cells: [mapCell(12)] },
  ]);
  assert.equal(ring.ringPaths.length, 2);
  for (const [cell, digit] of [[0, 1], [0, 2], [12, 1], [12, 2], [27, 3], [30, 4]]) {
    assert.ok(ring.eliminations.some(item => item.cell === mapCell(cell) && item.digit === digit));
  }
  assert.deepEqual(search({ diagonal: true }).unsupportedVariants, ['diagonal']);
  grid[mapCell(3)].push(7);
  assert.ok(!find(), 'A third guardian digit prevents the two-group UR argument');
}
const scaled = Array.from({ length: 81 }, () => [1, 2, 5, 6, 7, 8, 9]);
const scaledCells = [9, 10, 28, 31, 36, 40];
for (const cell of scaledCells) scaled[cell] = [1, 2];
scaled[9].push(3);
scaled[31].push(4);
scaled[58] = [3, 4];
scaled[54] = [3, 5, 6];
scaled[61] = [3, 7, 8];
self.onmessage({ data: { id: 1, type: 'uniqueness-type-9', payload: { candidateGrid: scaled } } });
assert.ok(response.result?.results.some(result => result.cells.join() === scaledCells.join() && !result.ring
  && result.eliminations.some(item => item.cell === 54 && item.digit === 3)),
'The six-cell trade should support the same open guardian deduction');
console.log('UR Type 9 passed open chains, two-way rings, transposes, a six-cell trade, and guardian premise rejection.');

for (const mapCell of [cell => cell, transpose]) {
  const cells = [0, 1, 2, 27, 28, 29].map(mapCell).sort((a, b) => a - b);
  const noise = [1, 2, 3, 6, 7, 8, 9];
  const grid = Array.from({ length: 81 }, () => [...noise]);
  for (const cell of cells) grid[cell] = [1, 2, 3];
  grid[mapCell(0)].push(4);
  grid[mapCell(29)].push(5);
  grid[mapCell(54)] = [4, 6, 7];
  grid[mapCell(56)] = [4, 5];
  grid[mapCell(55)] = [4, 7, 8];
  const find = () => {
    self.onmessage({ data: { id: 1, type: 'uniqueness-extended-type-9', payload: { candidateGrid: grid } } });
    assert.ok(response.result, JSON.stringify(response));
    return JSON.parse(JSON.stringify(response.result.results)).find(result =>
      result.cells.join() === cells.join() && result.digits.join() === '1,2,3');
  };
  const open = find();
  assert.ok(open?.extended && !open.ring, 'Expected the extended open-chain proof');
  assert.equal(open.tech, 'uniqueness-extended-type-9');
  assert.ok(open.eliminations.some(item => item.cell === mapCell(54) && item.digit === 4));
  assert.deepEqual(open.forcedGuardians, []);
  grid[mapCell(54)] = [4, 5];
  grid[mapCell(55)] = noise;
  const ring = find();
  assert.ok(ring?.ring, 'Expected a two-way extended guardian ring');
  assert.deepEqual(ring.forcedGuardians, [{ digit: 4, cells: [mapCell(0)] }, { digit: 5, cells: [mapCell(29)] }]);
  assert.equal(ring.ringPaths.length, 2);
  for (const cell of [0, 29]) for (const digit of [1, 2, 3]) {
    assert.ok(ring.eliminations.some(item => item.cell === mapCell(cell) && item.digit === digit));
  }
  grid[mapCell(1)] = [1, 2, 3, 6];
  assert.ok(!find(), 'A third extra digit invalidates the two-group premise');
  grid[mapCell(1)] = [1, 2];
  grid[mapCell(2)] = [1, 2];
  assert.ok(!find(), 'An extended base with a singleton footprint must be rejected');
}
console.log('eUR Type 9 passed open chains, two-way rings, transposes, and extended premise checks.');

for (const mapCell of [cell => cell, transpose]) {
  const noise = [1, 2, 5, 6, 7, 8, 9];
  const grid = Array.from({ length: 81 }, () => [...noise]);
  const cells = [0, 3, 9, 12].map(mapCell).sort((a, b) => a - b);
  for (const cell of cells) grid[cell] = [1, 2];
  grid[mapCell(0)].push(3);
  grid[mapCell(12)].push(4);
  grid[mapCell(27)] = [3, 5, 6];
  grid[mapCell(30)] = [3, 4];
  grid[mapCell(34)] = [3, 7, 8];
  const find = () => {
    self.onmessage({ data: { id: 1, type: 'bug-type-9', payload: { candidateGrid: grid } } });
    assert.ok(response.result, JSON.stringify(response));
    return JSON.parse(JSON.stringify(response.result.results)).find(result =>
      result.cells.join() === cells.join() && result.basePairs.every(item => item.digits.join() === '1,2'));
  };
  const open = find();
  assert.ok(open && !open.ring, 'Expected the B.U.G -Lite open chain');
  assert.equal(open.name, 'B.U.G -Lite +2 Type 9');
  assert.ok(open.eliminations.some(item => item.cell === mapCell(27) && item.digit === 3));
  assert.deepEqual(open.forcedGuardians, []);
  grid[mapCell(27)] = [3, 4];
  grid[mapCell(34)] = noise;
  const ring = find();
  assert.ok(ring?.ring, 'Expected the two-way B.U.G -Lite ring');
  assert.equal(ring.name, 'B.U.G -Lite +2 Type 9 Ring');
  assert.deepEqual(ring.forcedGuardians, [{ digit: 3, cells: [mapCell(0)] }, { digit: 4, cells: [mapCell(12)] }]);
  assert.ok(ring.eliminations.some(item => item.cell === mapCell(30) && item.digit === 4));
  grid[mapCell(3)].push(7);
  assert.ok(!find(), 'A third non-BUG guardian digit invalidates the two-group premise');
}
console.log('B.U.G Type 9 passed open chains, two-way rings, transposes, and guardian premise rejection.');

for (const mapCell of [cell => cell, transpose]) {
  const noise = [1, 6, 7, 8, 9];
  const grid = Array.from({ length: 81 }, () => [...noise]);
  const originalGivens = Array(81).fill(0);
  originalGivens[mapCell(0)] = 2;
  const fixedGrid = [...originalGivens];
  fixedGrid[mapCell(12)] = 2;
  grid[mapCell(0)] = grid[mapCell(12)] = [];
  grid[mapCell(3)] = [1, 3];
  grid[mapCell(9)] = [1, 4];
  grid[mapCell(27)] = [3, 4];
  grid[mapCell(30)] = [3, 5, 6];
  grid[mapCell(34)] = [3, 7, 8];
  const cells = [0, 3, 9, 12].map(mapCell).sort((a, b) => a - b);
  const find = (givens = originalGivens) => {
    self.onmessage({ data: { id: 1, type: 'reverse-bug-type-9', payload: {
      candidateGrid: grid, originalGivens: givens, fixedGrid,
    } } });
    assert.ok(response.result, JSON.stringify(response));
    return JSON.parse(JSON.stringify(response.result.results)).find(record =>
      record.cells.join() === cells.join() && record.digits.join() === '1,2');
  };
  const open = find();
  assert.ok(open && !open.ring, 'Expected an original-givens open chain');
  assert.equal(open.name, 'Reverse-BUG Type 9');
  assert.deepEqual(open.givenCells, [mapCell(0)]);
  assert.deepEqual(open.forcedGuardians, []);
  assert.ok(open.eliminations.some(item => item.cell === mapCell(30) && item.digit === 3));
  grid[mapCell(30)] = [3, 4];
  grid[mapCell(34)] = noise;
  const ring = find();
  assert.ok(ring?.ring, 'Expected two-way implications for the Reverse-BUG ring');
  assert.equal(ring.name, 'Reverse-BUG Type 9 Ring');
  assert.deepEqual(ring.forcedGuardians, [{ digit: 3, cells: [mapCell(3)] }, { digit: 4, cells: [mapCell(9)] }]);
  for (const cell of [3, 9]) assert.ok(ring.eliminations.some(item => item.cell === mapCell(cell) && item.digit === 1));
  assert.ok(!find(Array(81).fill(0)), 'Fixed placements alone cannot anchor the trade');
  grid[mapCell(3)].push(6);
  assert.ok(!find(), 'A third guardian digit cannot justify the two-group premise');
}
console.log('Reverse-BUG Type 9 passed original-givens proofs, open chains, two-way rings and transposes.');
