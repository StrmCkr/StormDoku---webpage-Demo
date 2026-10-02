const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/als-core.js');
require('../src/ahs-core.js');
require('../src/alc-core.js');

const core = globalThis.StormDoku;

function candidates(rows) {
  return rows.join(' ').split(' ')
    .map(text => text.length === 1 ? [] : [...text].map(Number));
}

function hasJointPlacement(cand, als, ahs, forced) {
  const variables = [
    ...als.cells.map(cell => cand[cell].map(digit => ({ cell, digit }))),
    ...ahs.digits.map(digit => ahs.cells
      .filter(cell => cand[cell].includes(digit))
      .map(cell => ({ cell, digit }))),
  ];
  const assigned = forced ? [forced] : [];
  function walk(index) {
    if (index === variables.length) return true;
    for (const choice of variables[index]) {
      if (assigned.some(other =>
        (choice.cell === other.cell && choice.digit !== other.digit)
        || (choice.digit === other.digit && core.peersOf(choice.cell).includes(other.cell)))) continue;
      assigned.push(choice);
      if (walk(index + 1)) return true;
      assigned.pop();
    }
    return false;
  }
  return walk(0);
}

const boxLine = candidates([
  '13 4 2 168 9 38 1356 56 7',
  '6 379 8 5 17 347 1349 49 2',
  '137 379 5 1467 2 347 13469 8 3469',
  '358 3568 369 2 58 458 7 469 1',
  '4 1 79 789 3 6 2 59 589',
  '578 2 679 4789 578 1 4689 3 4689',
  '2 5678 467 3 5678 578 45689 1 45689',
  '9 3568 136 18 4 2 3568 7 3568',
  '3578 35678 13467 178 15678 9 34568 2 34568',
]);

const mixedXz = candidates([
  '7 6 4 138 138 5 9 2 18',
  '2 9 1 48 6 7 58 45 3',
  '5 3 8 149 149 2 6 7 14',
  '3 8 7 59 2 6 1 45 49',
  '9 4 2 1358 1358 18 58 6 7',
  '6 1 5 7 89 4 2 3 89',
  '4 7 6 2 18 18 3 9 5',
  '1 2 9 45 45 3 7 8 6',
  '8 5 3 6 7 9 4 1 2',
]);

const higherDof = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);
for (const cell of [36, 37, 38, 46, 47]) higherDof[cell] = [1, 2, 3, 4, 6, 7, 9];
higherDof[31] = [5, 8];

test('ALC-XZ locks the residual box cell to 5 or 8', () => {
  const report = core.findAlcXz(boxLine);
  const result = report.chains.find(chain =>
    chain.alcXz.als.cells.length === 1
    && chain.alcXz.als.cells[0] === 31
    && chain.alcXz.ahs.sector === 21
    && chain.alcXz.ahs.digits.join('') === '58');
  assert.ok(result, 'expected the r4c5 ALS and box-4 AHS to connect');
  assert.ok(result.eliminations.some(item => item.cell === 45 && item.digit === 7));
  assert.ok(result.eliminations.some(item => item.cell === 32 && item.digit === 5));
  assert.match(core.formatAlcXz(result), /ALS \(58\)r4c5 \+ AHS \(58\)b4/);
  assert.equal(hasJointPlacement(boxLine, result.alcXz.als, result.alcXz.ahs), true);
  for (const elimination of result.eliminations) {
    assert.equal(hasJointPlacement(boxLine, result.alcXz.als, result.alcXz.ahs, elimination), false);
  }
});

test('ALC-XZ never removes a solution digit on regression puzzles', () => {
  const puzzles = [
    '764005920291000003538000600387026100942000067615704230476200395129003786853679412',
    '042090007608500002005020080000200701410036200020001030200300010900042070000009020',
  ];
  for (const puzzle of puzzles) {
    const grid = [...puzzle].map(Number);
    assert.equal(core.countSolutionsDlx(grid, 2), 1);
    const solution = core.solveFully(grid);
    const report = core.findAlcXz(core.allCandidates(grid));
    assert.ok(report.chains.length > 0);
    for (const chain of report.chains) {
      for (const { cell, digit } of chain.eliminations) {
        assert.notEqual(digit, solution[cell], core.formatAlcXz(chain));
      }
    }
  }
});

test('ALC-XZ pair exclusions are not attributed to a component alone', () => {
  const report = core.findAlcXz(boxLine);
  assert.ok(report.chains.length > 0);
  for (const chain of report.chains) {
    assert.equal(chain.steps.length, 2);
    assert.ok(chain.alcXz.contacts.length > 0);
    assert.ok(chain.eliminations.length > 0);
    for (const { cell, digit } of chain.eliminations) {
      assert.ok(boxLine[cell].includes(digit));
    }
  }
});

test('ALC-XZ finds the mixed 49 AHS and 459 ALS example', () => {
  const report = core.findAlcXz(mixedXz);
  const result = report.chains.find(chain =>
    chain.alcXz.als.cells.join(',') === '30,66'
    && chain.alcXz.ahs.cells.join(',') === '12,21,22');
  assert.ok(result);
  assert.deepEqual(result.eliminations, [
    { cell: 22, digit: 1 },
    { cell: 39, digit: 5 },
  ]);
  for (const elimination of result.eliminations) {
    assert.equal(hasJointPlacement(mixedXz, result.alcXz.als, result.alcXz.ahs, elimination), false);
  }
});

test('ALC-XZ supports a DOF-2 AHS and locks its uncovered box cell', () => {
  const report = core.findAlcXz(higherDof);
  const result = report.chains.find(chain =>
    chain.alcXz.als.cells.join(',') === '31'
    && chain.alcXz.ahs.sector === 21
    && chain.alcXz.ahs.digits.join('') === '58');
  assert.ok(result);
  for (const digit of [1, 2, 3, 4, 6, 7, 9]) {
    assert.ok(result.eliminations.some(item => item.cell === 45 && item.digit === digit));
  }
  assert.equal(result.eliminations.some(item => item.cell === 45 && [5, 8].includes(item.digit)), false);
  for (const elimination of result.eliminations) {
    assert.equal(hasJointPlacement(higherDof, result.alcXz.als, result.alcXz.ahs, elimination), false);
  }
});

test('the candidate-grid importer accepts nine whitespace-separated rows', () => {
  const text = Array.from({ length: 9 }, (_, row) =>
    higherDof.slice(row * 9, row * 9 + 9).map(digits => digits.join('')).join(' ')).join('\n');
  const parsed = core.parse729Data(text);
  assert.ok(parsed);
  assert.deepEqual(parsed.candidates[31], [5, 8]);
  assert.deepEqual(parsed.candidates[45], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
