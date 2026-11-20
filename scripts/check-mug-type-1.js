const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
let response;
const self = { postMessage(message) { response = message; } };
const context = vm.createContext({ self });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);

const fixtures = [
  { rows: [4, 7], columns: [0, 1, 2], digits: [2, 6, 7], fillings: 12 },
  { rows: [0, 2], columns: [1, 3, 5, 7], digits: [1, 2, 3, 4], fillings: 96 },
  { rows: [0, 2], columns: [1, 2, 3, 5, 7], digits: [1, 2, 3, 4, 5], fillings: 1920 },
  { rows: [0, 2], columns: [1, 2, 3, 5, 7, 8], digits: [1, 2, 3, 4, 5, 6], fillings: 57600 },
];
const run = (candidateGrid, variantSettings, type = 'mug-type-1') => {
  self.onmessage({ data: { id: 1, type, payload: { candidateGrid, variantSettings } } });
  assert.ok(response.result, JSON.stringify(response));
  return JSON.parse(JSON.stringify(response.result));
};
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const { rows, columns, digits, fillings } of fixtures) {
  for (const mapCell of [cell => cell, transpose]) {
    const cells = rows.flatMap(row => columns.map(column => mapCell(row * 9 + column))).sort((a, b) => a - b);
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[cell] = [...digits];
    const guardian = cells[0];
    grid[guardian].push(8, 9);
    const result = run(grid).results.find(record => record.cells.join() === cells.join());
    assert.ok(result, 'Expected MUG on ' + cells.join(','));
    assert.equal(result.proof.fillings, fillings);
    assert.deepEqual(result.guardians, [8, 9].map(digit => ({ cell: guardian, digit })));
    assert.deepEqual(result.eliminations, digits.map(digit => ({ cell: guardian, digit })));
    assert.deepEqual(run(grid, { diagonal: true }).unsupportedVariants, ['diagonal']);
    grid[cells[1]].push(9);
    assert.ok(!run(grid).results.some(record => record.cells.join() === cells.join()));
  }
}
const verify = context.StormDoku.verifyMugFootprints;
const irregularRows = [
  '3 4 158 9 258 17 12 6 78',
  '27 9 18 6 28 17 3 5 4',
  '27 6 158 25 4 3 12 9 78',
  '5 3 6 4 7 9 8 1 2',
  '9 2 4 3 1 8 5 7 6',
  '1 8 7 25 25 6 9 4 3',
  '8 5 3 1 6 4 7 2 9',
  '6 7 2 8 9 5 4 3 1',
  '4 1 9 7 3 2 6 8 5',
];
for (const mapCell of [cell => cell, transpose]) {
  const grid = Array.from({ length: 81 }, () => []);
  irregularRows.join(' ').split(' ').forEach((value, cell) => {
    grid[mapCell(cell)] = [...value].map(Number);
  });
  const expectedCells = [2, 4, 5, 6, 8, 11, 14, 20, 21, 24, 26, 48, 49]
    .map(mapCell).sort((a, b) => a - b);
  const result = run(grid).results.find(record => record.cells.join() === expectedCells.join());
  assert.ok(result, 'Expected the irregular 13-cell MUG');
  assert.deepEqual(result.eliminations, [1, 5].map(digit => ({ cell: mapCell(2), digit })));
  assert.deepEqual(result.guardians, [{ cell: mapCell(2), digit: 8 }]);
  assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 2, footprints: 1 });
}
for (const [cells, digits] of [
  [[2, 3, 11, 12], [1, 2, 3]],
  [[14, 17, 19, 20, 23, 25, 28, 29, 34, 35], [1, 2, 3, 4]],
]) {
  const proof = verify(cells.map(cell => ({ cell, digits })));
  assert.ok(proof.complete && proof.fillings > 1);
  assert.equal(proof.verified, false, 'A distinct house footprint can have only one filling');
}
console.log('MUG Type 1 passed paired formations, transposes, multiple-guardian rejection, and footprint counterexamples.');

for (const mapCell of [cell => cell, transpose]) {
  const cells = [0, 1, 2, 27, 28, 29];
  const shape = cells.map(mapCell).sort((a, b) => a - b).join();
  for (const [otherGuardian, target, type] of [[1, 3, 2], [27, 9, 2], [28, 10, 5]]) {
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[mapCell(cell)] = [2, 6, 7];
    grid[mapCell(0)].push(8);
    grid[mapCell(otherGuardian)].push(8);
    grid[mapCell(target)] = [8, 9];
    grid[mapCell(80)] = [8, 9];
    const find = () => run(grid, undefined, 'mug-type-2,5').results.find(record => record.cells.join() === shape);
    const result = find();
    assert.ok(result, 'Expected shared guardian elimination for Type ' + type);
    assert.equal(result.name, 'MUG Type ' + type);
    assert.equal(result.proof.fillings, 12);
    assert.deepEqual(result.eliminations, [{ cell: mapCell(target), digit: 8 }]);
    grid[mapCell(otherGuardian)] = [2, 6, 7, 9];
    assert.ok(!find(), 'Different guardian digits cannot prove a common-digit elimination');
  }
}
console.log('MUG Type 2,5 passed same-sector, paired-position and pincer checks, including transposes.');

const vidarino = [
  '8 9 2 17 47 6 3 5 14',
  '14 7 3 125 45 25 6 8 9',
  '1456 1456 456 3 9 8 14 7 2',
  '1457 1458 4578 58 2 3 9 6 147',
  '12567 12568 5678 4 58 9 15 3 17',
  '3 45 9 6 1 7 45 2 8',
  '9 3 58 2578 578 1 27 4 6',
  '267 26 67 9 3 4 8 1 5',
  '45 458 1 2578 6 25 27 9 3',
].join(' ').split(' ').map(value => value.length > 1 ? [...value].map(Number) : []);
for (const mapCell of [cell => cell, transpose]) {
  const grid = Array.from({ length: 81 }, () => []);
  vidarino.forEach((digits, cell) => { grid[mapCell(cell)] = digits; });
  const base = [36, 37, 38, 63, 64, 65].map(mapCell).sort((a, b) => a - b).join();
  for (const [mode, count] of [['3', 1], ['3-xz', 2]]) {
    const result = run(grid, undefined, 'mug-type-' + mode).results.find(record =>
      record.cells.join() === base && record.eliminations.some(item => item.cell === mapCell(44) && item.digit === 1));
    assert.ok(result, 'Vidarino’s 267 MUG should eliminate 1 from r5c9 in mode ' + mode);
    assert.deepEqual(result.digits, [2, 6, 7]);
    assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 2, footprints: 1 });
    assert.equal(result.alsRecords.length, count);
  }
}
console.log('MUG Type 3 passed Vidarino’s r5c9<>1 example and transpose.');

for (const [mode, count] of [['3-xy', 3], ['3-chain', 4]]) {
  const grid = Array.from({ length: 81 }, () => []);
  const cells = [36, 37, 38, 63, 64, 65];
  for (const cell of cells) grid[cell] = [1, 2, 9];
  for (let index = 0; index < count; index += 1) {
    grid[36].push(index + 3);
    grid[39 + index] = [index + 3, index + 4];
  }
  grid[43] = [count + 3, 8];
  const result = run(grid, undefined, 'mug-type-' + mode).results.find(record =>
    record.cells.join() === cells.join() && record.eliminations.some(item =>
      item.cell === 43 && item.digit === count + 3));
  assert.ok(result, 'Expected MUG Type 3 link proof for ' + mode);
  assert.equal(result.alsRecords.length, count);
  assert.equal(result.rccDigits.length, count - 1);
  assert.ok(result.proof.verified && result.proof.complete);
}
console.log('MUG Type 3 ALS-XY and ALS-Chain passed elimination and link checks.');

for (const mapCell of [cell => cell, transpose]) {
  for (const secondExtra of [4, 5]) {
    const cells = [2, 3, 6, 11, 12, 15].map(mapCell).sort((a, b) => a - b);
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[cell] = [1, 2, 3];
    const targets = [2, 11].map(mapCell).sort((a, b) => a - b);
    grid[targets[0]].push(4);
    grid[targets[1]].push(secondExtra);
    grid[mapCell(20)] = [2, 3];
    const find = () => run(grid, undefined, 'mug-type-4').results.find(record =>
      record.cells.join() === cells.join() && record.basePairs.every(item => item.digits.join() === '1,2,3'));
    const result = find();
    assert.ok(result, 'Expected a footprint-verified MUG sector lock');
    assert.equal(result.name, 'MUG Type 4');
    assert.ok(result.sectorLocks.some(lock => lock.digit === 1 && lock.sector === (mapCell === transpose ? 2 : 11)));
    assert.deepEqual(result.eliminations, targets.flatMap(cell => [2, 3].map(digit => ({ cell, digit }))));
    assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 12, footprints: 6 });
    grid[mapCell(20)].push(1);
    assert.ok(!find(), 'A third location breaks the lock');
  }
}
const brokenFootprints = Array.from({ length: 81 }, () => []);
for (const cell of [2, 3, 6, 29, 30, 33]) brokenFootprints[cell] = [1, 2, 3];
brokenFootprints[2].push(4);
brokenFootprints[29].push(5);
assert.deepEqual(run(brokenFootprints, undefined, 'mug-type-4').results, [],
  'A sector lock cannot rescue a base with unique house footprints');
console.log('MUG Type 4 passed sector lock, transpose, broken-lock, and unique-footprint checks.');

for (const mapCell of [cell => cell, transpose]) {
  const fish = [2, 3, 11, 12].map(mapCell).sort((a, b) => a - b);
  const cells = [...fish, mapCell(6), mapCell(15)].sort((a, b) => a - b);
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of fish) grid[cell] = [1, 2, 3];
  grid[mapCell(6)] = grid[mapCell(15)] = [2, 3];
  grid[mapCell(2)].push(4);
  grid[mapCell(12)].push(5);
  const find = () => run(grid, undefined, 'mug-type-6').results.find(record => record.cells.join() === cells.join());
  const result = find();
  assert.ok(result, 'Expected a footprint-verified MUG restricted fish');
  assert.equal(result.name, 'MUG Type 6');
  assert.equal(result.fishDigit, 1);
  assert.deepEqual(result.fishCells, fish);
  assert.deepEqual(result.eliminations, [2, 12].map(mapCell).sort((a, b) => a - b)
    .map(cell => ({ cell, digit: 1 })));
  assert.ok(result.proof.verified && result.proof.complete);
  grid[mapCell(20)] = [1, 8];
  assert.ok(!find(), 'An extra fish location breaks the restriction');
  grid[mapCell(20)] = [];
  grid[mapCell(12)].pop();
  grid[mapCell(3)].push(5);
  assert.ok(!find(), 'Guardians on opposite fish placements do not prove an elimination');
}
const nonMugFish = Array.from({ length: 81 }, () => []);
for (const cell of [2, 3, 29, 30]) nonMugFish[cell] = [1, 2, 3];
nonMugFish[6] = nonMugFish[33] = [2, 3];
nonMugFish[2].push(4);
nonMugFish[30].push(5);
assert.deepEqual(run(nonMugFish, undefined, 'mug-type-6').results, [],
  'A restricted fish cannot rescue a base with unique house footprints');
console.log('MUG Type 6 passed restricted fish, transpose, split-guardian, and unique-footprint checks.');

for (const mapCell of [cell => cell, transpose]) {
  const cells = [2, 3, 6, 11, 12, 15].map(mapCell).sort((a, b) => a - b);
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of [2, 3, 11, 12]) grid[mapCell(cell)] = [1, 2, 3];
  for (const cell of [6, 15]) grid[mapCell(cell)] = [2, 3];
  grid[mapCell(2)].push(4);
  grid[mapCell(7)] = [1, 5];
  const find = () => run(grid, undefined, 'mug-type-7').results.find(record =>
    record.cells.join() === cells.join() && record.eliminations.some(item =>
      item.cell === mapCell(12) && item.digit === 1));
  const result = find();
  assert.ok(result, 'The internal link closing the MUG must eliminate the assumption');
  assert.equal(result.name, 'MUG Type 7');
  assert.ok(result.internalLinks.some(link => link.digit === 1 && link.forcedCell === mapCell(2)));
  assert.ok(result.internalLinks.every(link => link.cells.every(cell => cells.includes(cell))));
  assert.ok(result.proof.complete && result.proof.verified);
  grid[mapCell(20)] = [1, 8];
  assert.ok(!find(), 'An outside candidate removes the internal strong link');
}
const nonMugLinks = Array.from({ length: 81 }, () => []);
for (const cell of [2, 3, 29, 30]) nonMugLinks[cell] = [1, 2, 3];
nonMugLinks[6] = nonMugLinks[33] = [2, 3];
nonMugLinks[2].push(4);
nonMugLinks[7] = [1, 5];
assert.deepEqual(run(nonMugLinks, undefined, 'mug-type-7').results, [],
  'Internal strong links cannot rescue a base with unique house footprints');
console.log('MUG Type 7 passed internal-link, transpose, outside-candidate, and unique-footprint checks.');

for (const mapCell of [cell => cell, transpose]) {
  for (const chained of [false, true]) {
    const cells = [2, 3, 6, 11, 12, 15].map(mapCell).sort((a, b) => a - b);
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[cell] = [1, 2, 3];
    const guardian = mapCell(2);
    const target = mapCell(chained ? 34 : 20);
    grid[guardian].push(4);
    grid[target] = [4, 5];
    grid[mapCell(8)] = [4, 9];
    if (chained) {
      grid[mapCell(20)] = [4, 5];
      grid[mapCell(25)] = [4, 9];
    }
    const find = () => run(grid, undefined, 'mug-type-8').results.find(record =>
      record.cells.join() === cells.join() && record.eliminations.some(item => item.cell === target && item.digit === 4));
    const result = find();
    assert.ok(result, 'Expected an external guardian elimination' + (chained ? ' via a chain' : ''));
    assert.equal(result.name, 'MUG Type 8');
    assert.deepEqual(result.guardians, [{ cell: guardian, digit: 4 }]);
    assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 12, footprints: 6 });
    grid[guardian].push(6);
    assert.ok(!find(), 'A surviving guardian prevents the elimination');
  }
}
const nonMugGuardians = Array.from({ length: 81 }, () => []);
for (const cell of [2, 3, 6, 29, 30, 33]) nonMugGuardians[cell] = [1, 2, 3];
nonMugGuardians[2].push(4);
nonMugGuardians[20] = [4, 5];
nonMugGuardians[8] = [4, 9];
assert.deepEqual(run(nonMugGuardians, undefined, 'mug-type-8').results, [],
  'Removing all guardians cannot rescue a base with unique house footprints');
console.log('MUG Type 8 passed direct and chained guardian, transpose, surviving-guardian, and unique-footprint checks.');

for (const mapCell of [cell => cell, transpose]) {
  const forumCells = [1, 4, 7, 10, 13, 16, 19, 22, 25];
  const shape = forumCells.map(mapCell).sort((a, b) => a - b).join();
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of forumCells) grid[mapCell(cell)] = [1, 2, 3, 4];
  const guardian = mapCell(13);
  grid[guardian].push(5);
  const find = () => run(grid, undefined, 'pug-type-1').results.find(record => record.cells.join() === shape);
  const result = find();
  assert.ok(result, 'Expected the forum’s four-digit PUG');
  assert.equal(result.name, 'PUG Type 1');
  assert.deepEqual(result.guardians, [{ cell: guardian, digit: 5 }]);
  assert.deepEqual(result.eliminations, [1, 2, 3, 4].map(digit => ({ cell: guardian, digit })));
  assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 1056, footprints: 256 });
  grid[mapCell(1)] = [1, 2];
  grid[mapCell(4)] = [1, 2];
  grid[mapCell(7)] = [1, 3];
  assert.ok(!find(), 'A pattern with a unique footprint cannot prove a PUG elimination');
}
const impermeable = irregularRows.join(' ').split(' ').map(value => [...value].map(Number));
const singleFootprintShape = [2, 4, 5, 6, 8, 11, 14, 20, 21, 24, 26, 48, 49].join();
assert.ok(!run(impermeable, undefined, 'pug-type-1').results.some(record => record.cells.join() === singleFootprintShape),
  'The single-footprint MUG is not permeable');
console.log('PUG Type 1 passed the forum pattern, transpose, unique-footprint rejection, and single-footprint rejection.');

for (const mapCell of [cell => cell, transpose]) {
  for (const [otherGuardian, target, type] of [[4, 2, 2], [13, 3, 5]]) {
    const forumCells = [1, 4, 7, 10, 13, 16, 19, 22, 25];
    const shape = forumCells.map(mapCell).sort((a, b) => a - b).join();
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of forumCells) grid[mapCell(cell)] = [1, 2, 3, 4];
    grid[mapCell(1)].push(5);
    grid[mapCell(otherGuardian)].push(5);
    grid[mapCell(target)] = [5, 6];
    grid[mapCell(28)] = [5, 6];
    const find = () => run(grid, undefined, 'pug-type-2,5').results.find(record =>
      record.cells.join() === shape && record.eliminations.some(item => item.cell === mapCell(target) && item.digit === 5));
    const result = find();
    assert.ok(result, 'Expected PUG Type ' + type + ' on the forum pattern');
    assert.equal(result.name, 'PUG Type ' + type);
    assert.deepEqual(result.eliminations, [{ cell: mapCell(target), digit: 5 }]);
    assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 1056, footprints: 256 });
    grid[mapCell(1)] = [1, 2, 5];
    grid[mapCell(4)] = otherGuardian === 4 ? [1, 2, 5] : [1, 2];
    grid[mapCell(7)] = [1, 3];
    assert.ok(!find(), 'An unmatched footprint invalidates the guardian deduction');
  }
}
console.log('PUG Type 2,5 passed direct sight, pincers, transpose, and unmatched-footprint checks.');

// Two BUG-Lite rectangles share r1c4 and have disjoint digit pairs.
// The extra unsolved cells put the grid beyond the late-grid expansion limit.
for (const mapCell of [cell => cell, transpose]) {
  const shape = [2, 3, 4, 11, 12, 30, 31].map(mapCell).sort((a, b) => a - b).join();
  const grid = Array.from({ length: 81 }, () => []);
  for (const cell of [2, 11, 12]) grid[mapCell(cell)] = [1, 2];
  for (const cell of [4, 30, 31]) grid[mapCell(cell)] = [3, 4];
  for (let cell = 54; cell < 66; cell += 1) grid[mapCell(cell)] = [6, 7];
  grid[mapCell(3)] = [1, 2, 3, 4, 5];
  const match = record => record.cells.join() === shape;
  const result = run(grid).results.find(match);
  assert.ok(result, 'Expected the irregular BUG-Lite composite on a grid with more than 16 unsolved cells');
  assert.deepEqual(result.eliminations, [1, 2, 3, 4].map(digit => ({ cell: mapCell(3), digit })));
  assert.ok(result.proof.complete && result.proof.verified);
  grid[mapCell(3)].pop();
  grid[mapCell(2)].push(5);
  grid[mapCell(4)].push(5);
  grid[mapCell(7)] = [5, 8];
  const direct = run(grid, undefined, 'mug-type-2,5').results.find(match);
  assert.ok(direct, 'Type 2 should also use the composite bases');
  assert.deepEqual(direct.eliminations, [{ cell: mapCell(7), digit: 5 }]);
}
const falseComposite = Array.from({ length: 81 }, () => []);
for (const cell of [2, 3, 11, 12]) falseComposite[cell] = [1, 2, 3];
falseComposite[2].push(4);
assert.ok(!run(falseComposite).results.some(record =>
  record.cells.join() === '2,3,11,12' && record.basePairs.every(item => item.digits.join() === '1,2,3')),
'Overlaying the three two-digit rectangles does not prove a MUG');
console.log('MUG composites passed irregular Type 1 and Type 2 searches, transposes, and the false-composite check.');

for (const mapCell of [cell => cell, transpose]) {
  for (const [mode, count, suffix] of [
    ['3', 1, 'ALS'], ['3-xz', 2, 'ALS-XZ'], ['3-xy', 3, 'ALS-XY'], ['3-chain', 4, 'ALS-Chain'],
  ]) {
    const cells = [1, 4, 7, 10, 13, 16, 19, 22, 25];
    const shape = cells.map(mapCell).sort((a, b) => a - b).join();
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[mapCell(cell)] = [1, 2, 3, 4];
    for (let index = 0; index < count; index += 1) {
      grid[mapCell(1)].push(index + 5);
      grid[mapCell([0, 2, 3, 5][index])] = [index + 5, index + 6];
    }
    grid[mapCell(6)] = [1, count + 5];
    const find = () => run(grid, undefined, 'pug-type-' + mode).results.find(record =>
      record.cells.join() === shape && record.eliminations.some(item =>
        item.cell === mapCell(6) && item.digit === count + 5));
    const result = find();
    assert.ok(result, 'Expected footprint-verified PUG Type 3 - ' + suffix);
    assert.equal(result.name, 'PUG Type 3 - ' + suffix);
    assert.equal(result.alsRecords.length, count);
    assert.equal(result.rccDigits.length, count - 1);
    assert.deepEqual(result.proof, { verified: true, complete: true, fillings: 1056, footprints: 256 });
    if (count === 1) {
      grid[mapCell(1)] = [1, 2, 5];
      grid[mapCell(4)] = [1, 2];
      grid[mapCell(7)] = [1, 3];
      assert.ok(!find(), 'A singleton footprint blocks a PUG Type 3 deduction');
    }
  }
}
console.log('PUG Type 3 passed all four ALS options, transposes and singleton-footprint rejection.');

for (const mapCell of [cell => cell, transpose]) {
  const cells = [2, 3, 6, 11, 12, 15];
  const shape = cells.map(mapCell).sort((a, b) => a - b).join();
  for (const type of [4, 6, 7, 8]) {
    const grid = Array.from({ length: 81 }, () => []);
    for (const cell of cells) grid[mapCell(cell)] = [1, 2, 3];
    grid[mapCell(2)].push(4);
    if (type === 6 || type === 7) {
      grid[mapCell(6)] = grid[mapCell(15)] = [2, 3];
    }
    let target;
    let digit;
    if (type === 4) {
      grid[mapCell(11)].push(5);
      grid[mapCell(20)] = [2, 3];
      target = 2;
      digit = 2;
    } else if (type === 6) {
      grid[mapCell(12)].push(5);
      target = 2;
      digit = 1;
    } else if (type === 7) {
      grid[mapCell(7)] = [1, 5];
      target = 12;
      digit = 1;
    } else {
      grid[mapCell(8)] = [4, 9];
      grid[mapCell(20)] = [4, 5];
      target = 20;
      digit = 4;
    }
    const result = run(grid, undefined, 'pug-type-' + type).results.find(record =>
      record.cells.join() === shape && record.eliminations.some(item =>
        item.cell === mapCell(target) && item.digit === digit));
    assert.ok(result, 'Expected a verified PUG Type ' + type + ' elimination');
    assert.equal(result.name, 'PUG Type ' + type);
    assert.ok(result.proof.complete && result.proof.verified && result.proof.footprints > 1);
  }
}
console.log('PUG Types 4, 6, 7 and 8 passed elimination, transpose and permeability checks.');
