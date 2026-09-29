const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/ahs-core.js');
require('../src/ahs-xy-core.js');

const core = globalThis.StormDoku;
const rows = [
  '3 158 2458 6 458 7 9 24 14',
  '69 7 46 49 1 2 3 8 5',
  '2589 158 2458 4589 3 4589 146 2467 147',
  '7 6 125 3 245 145 8 9 24',
  '258 58 9 4578 6 458 247 1 3',
  '4 3 128 789 278 189 27 5 6',
  '168 9 678 2 478 3 5 467 1478',
  '568 4 5678 1 9 58 26 3 278',
  '158 2 3 4578 4578 6 14 47 9',
];

const cand = rows.join(' ').split(' ')
  .map(text => text.length === 1 ? [] : [...text].map(Number));

test('AHS-XY requires the full three-set cell walk for r5c1<>5', () => {
  const ahs = core.ahsConstructor(cand, {
    maxSize: 4, maxSizeFox: 4, searchLimit: true,
  });
  const specs = [[4, '247'], [7, '27'], [24, '1568']];
  const sets = specs.map(([sector, digits]) => ahs.find(item =>
    item.ahsSector === sector && item.ahsDigits.join('') === digits));
  assert.ok(sets.every(Boolean));

  const forced = { cell: 36, digit: 5 };
  assert.equal(core.ahsXyHasPlacement(cand, sets), true);
  for (const pair of [[0, 1], [0, 2], [1, 2]]) {
    assert.equal(core.ahsXyHasPlacement(cand, pair.map(index => sets[index]), forced), true);
  }
  assert.equal(core.ahsXyHasPlacement(cand, sets, forced), false);

  const report = core.findAhsXyChains(cand, {
    maxTriples: 300000,
    maxChains: 500,
  });
  assert.ok(report.chains.some(chain => chain.eliminations.some(item =>
    item.cell === 36 && item.digit === 5)));
  assert.ok(report.chains.every(chain => chain.steps.length === 3));
});
