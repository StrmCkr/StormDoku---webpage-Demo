const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/als-core.js');
require('../src/als-dof-core.js');

const core = globalThis.StormDoku;
const rows = [
  '7 2 9 45 1 48 6 58 3',
  '58 58 1 36 2 36 4 9 7',
  '3 4 6 9 58 7 2 15 158',
  '1 7 35 246 9 246 358 3458 2456',
  '4 69 35 8 7 126 1359 2345 256',
  '2 69 8 14 3 5 19 7 146',
  '58 3 4 7 6 128 158 125 9',
  '6 58 2 13 458 9 7 34 1458',
  '9 1 7 235 45 238 358 6 2458',
];
const cand = rows.join(' ').split(' ')
  .map(text => text.length === 1 ? [] : [...text].map(Number));
const groups = [[80], [25, 26], [7, 25, 61], [22, 76], [59, 66, 75, 77]];
const catalogue = core.alsConstructor(cand, { maxSizeDOF: 4, maxSizeFox: 4 });
const alsList = groups.map(cells => catalogue.find(node =>
  node.alsAllCells.length === cells.length
  && cells.every(cell => node.alsAllCells.includes(cell))));

// Assign each physical cell once, independently of the ALS memberships.
function hasJointPlacement(forced, candidateGrid = cand) {
  const cells = [...new Set(groups.flat())]
    .sort((left, right) => candidateGrid[left].length - candidateGrid[right].length);
  const assigned = forced ? [forced] : [];
  function visit(index) {
    if (index === cells.length) return true;
    const cell = cells[index];
    for (const digit of candidateGrid[cell]) {
      if (assigned.some(other =>
        (other.cell === cell && other.digit !== digit)
        || (other.digit === digit && core.peersOf(cell).includes(other.cell)))) continue;
      assigned.push({ cell, digit });
      if (visit(index + 1)) return true;
      assigned.pop();
    }
    return false;
  }
  return visit(0);
}

function findExample() {
  return core.findAlsDofAlmostDdsNets(cand, {
    alsList, maxDigits: 5, maxAuxiliary: 4,
  }).results[0];
}

test('Almost DDS finds the DOF-3 hub with overlapping A/B auxiliaries', () => {
  assert.ok(alsList.every(Boolean));
  assert.equal(alsList[0].alsDOF, 3);
  assert.deepEqual(alsList.slice(1).map(node => node.alsDOF), [1, 1, 1, 1]);
  const result = findExample();
  assert.ok(result);
  assert.equal(result.primaryA.cells[0], 80);
  assert.deepEqual(result.auxiliary.map(node => node.rccDigits), [[8], [2], [4], [5]]);
  assert.deepEqual(result.eliminations.map(item => [item.cell, item.digit]), [[5, 8], [67, 8]]);
  assert.ok(hasJointPlacement());
  for (const item of result.eliminations) assert.equal(hasJointPlacement(item), false);
  assert.deepEqual(core.verifyAlsDofNet(cand, result, { alsList }).errors, []);
});

test('ALS DOF dispatcher returns the overlapping auxiliary collection', () => {
  const report = core.findAlsDofNets(cand, {
    alsList, maxDigits: 5, maxAuxiliary: 4, includeChain: true,
  });
  assert.ok(report.results.some(result => result.mode === 'almost-dds'
    && result.primaryA.cells[0] === 80
    && result.eliminations.some(item => item.cell === 67 && item.digit === 8)));
});

test('verifier rejects unsupported deletions in a shared cell and hub', () => {
  const result = findExample();
  for (const item of [{ cell: 25, digit: 1 }, { cell: 80, digit: 8 }]) {
    assert.ok(hasJointPlacement(item));
    const verification = core.verifyAlsDofNet(cand, {
      ...result, eliminations: [...result.eliminations, item],
    }, { alsList });
    assert.equal(verification.ok, false);
  }
});

test('auxiliary overlap stays restricted to Almost DDS', () => {
  const verification = core.verifyAlsDofNet(cand, {
    ...findExample(), mode: 'dds', ringForm: 'collection',
  }, { alsList });
  assert.ok(verification.errors.includes('overlapping ALS cell 25'));
});

test('Almost DDS still requires every auxiliary and respects search limits', () => {
  for (const options of [
    { alsList: alsList.filter((_, index) => index !== 1), maxDigits: 5, maxAuxiliary: 4 },
    { alsList, maxDigits: 5, maxAuxiliary: 3 },
    { alsList, maxDigits: 4, maxAuxiliary: 4 },
  ]) assert.equal(core.findAlsDofAlmostDdsNets(cand, options).results.length, 0);
});

test('unreduced pasted grid does not prove the screenshot hub eliminations', () => {
  const pastedRows = [
    '7 2 9 45 1 48 6 58 3',
    '58 58 1 36 2 36 4 9 7',
    '3 4 6 9 58 7 2 158 158',
    '1 7 35 246 9 246 358 23458 24568',
    '4 69 35 8 7 126 1359 1235 1256',
    '2 69 8 146 3 5 19 7 146',
    '58 3 4 7 6 128 158 1258 9',
    '6 58 2 135 458 9 7 13458 1458',
    '9 1 7 235 458 238 358 6 2458',
  ];
  const pastedCand = pastedRows.join(' ').split(' ')
    .map(text => text.length === 1 ? [] : [...text].map(Number));
  const pastedCatalogue = core.alsConstructor(pastedCand, {
    maxSizeDOF: 4, maxSizeFox: 4,
  });
  const pastedAls = groups.map(cells => pastedCatalogue.find(node =>
    node.alsAllCells.length === cells.length
    && cells.every(cell => node.alsAllCells.includes(cell))));
  assert.ok(pastedAls.every(Boolean));
  const report = core.findAlsDofAlmostDdsNets(pastedCand, {
    alsList: pastedAls, maxDigits: 5, maxAuxiliary: 4,
  });
  assert.equal(report.results.length, 0);
  assert.ok(hasJointPlacement({ cell: 5, digit: 8 }, pastedCand));
  assert.ok(hasJointPlacement({ cell: 67, digit: 8 }, pastedCand));
});
