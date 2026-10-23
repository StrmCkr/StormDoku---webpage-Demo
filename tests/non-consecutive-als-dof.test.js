const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/pom-core.js');
require('../src/mini-sectors-core.js');
require('../src/strong-link-core.js');

const core = globalThis.StormDoku;

test('Non-Consecutive ALS-DOF expands contradictory source sets through size three', () => {
  core.configureVariants({ nonConsecutive: true });
  const cand = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Removing 3 from these three cells leaves only {4,5} in a classic box:
  // every pair can be assigned, but all three cannot be assigned distinctly.
  cand[0] = [3, 4, 5];
  cand[1] = [3, 4, 5];
  cand[2] = [3, 4, 5];
  cand[9] = [3, 4, 5];

  const report = core.findBoxLineReports(cand).find(step =>
    step.tech === 'non-consecutive-als-dof'
    && step.digits?.[0] === 3
    && step.at?.length === 3
    && step.at.every(cell => [0, 1, 2].includes(cell)));

  assert.ok(report, 'the size-three ALS-DOF contradiction should be reported');
  assert.ok(report.elim.items.some(item => item.cell === 9 && item.digit === 3));
});

test('Non-Consecutive ALS-DOF peer contradiction eliminates the assumed origin', () => {
  core.configureVariants({ nonConsecutive: true });
  const cand = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Assuming 3 at r1c3 removes 3 from the ALS cells r1c1/r1c2.
  // Both then become {1,2}; because they are orthogonally adjacent, every
  // assignment is either equal or consecutive and is therefore illegal.
  cand[0] = [1, 2, 3];
  cand[1] = [1, 2, 3];
  cand[2] = [3];

  const report = core.findBoxLineReports(cand).find(step =>
    step.tech === 'non-consecutive-als-dof-peer'
    && step.elim.items.some(item => item.cell === 2 && item.digit === 3));

  assert.ok(report, 'the origin candidate should be rejected by its peer ALS');
  assert.equal(report.clause.label, 'N');
  assert.equal(report.clause.digit, 3);
  assert.ok(report.clause.cells.includes(0));
  assert.ok(report.clause.cells.includes(1));
  assert.ok(!report.clause.cells.includes(2));
});

test('Non-Consecutive ALS-DOF N-Peer finds a row DOF-2 consecutive set', () => {
  core.configureVariants({ nonConsecutive: true });
  const cand = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // r3c2/r3c4 carry {3,4,5,6}.  If r3c3 is 4, the row peer rule removes 4
  // and the non-consecutive rule removes 3 and 5 from both cells, leaving
  // only 6 for two cells.
  cand[19] = [4, 5, 6];
  cand[20] = [4, 7];
  cand[21] = [3, 4, 5, 6];

  const report = core.findBoxLineReports(cand).find(step =>
    step.tech === 'non-consecutive-als-dof-peer'
    && step.elim.items.some(item => item.cell === 20 && item.digit === 4)
    && step.clause.cells.includes(19)
    && step.clause.cells.includes(21));

  assert.ok(report, 'the row DOF-2 consecutive peer should be reported');
  assert.match(report.desc, /r3c24 consecutive DOF=2 \(3,4,5\)/);
});

test('Non-Consecutive ERI recognizes the four-cell occupied-I form', () => {
  core.configureVariants({ nonConsecutive: true });
  const cand = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // In box 5, digit 8 is confined to b5p359 plus the occupied I cell b5p6.
  // The three other occurrences are orthogonally adjacent to the I cell, so
  // r5c6 cannot contain either adjacent value 7 or 9.
  for (const cell of [30, 31, 33, 39, 42, 48, 49]) {
    cand[cell] = cand[cell].filter(digit => digit !== 8);
  }
  cand[32] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // b5p3
  cand[40] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // b5p5
  cand[41] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // b5p6 (I)
  cand[50] = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // b5p9

  const report = core.findBoxLineReports(cand).find(step =>
    step.tech === 'non-consecutive-eri'
    && step.desc.includes('box 5 N-quad')
    && step.elim.items.some(item => item.cell === 41 && item.digit === 9));

  assert.ok(report, 'the occupied-I four-cell ERI should be reported');
  assert.deepEqual(report.at.sort((a, b) => a - b), [32, 40, 41, 50]);
});

test('Non-Consecutive ALS-DOF N-Peer rechecks reductions for a 9-origin', () => {
  core.configureVariants({ nonConsecutive: true });
  const cand = Array.from({ length: 81 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // r5c234 is the ALS-DOF.  Assuming r6c3=9 removes 9 from its box/row
  // peers, then removes 8 from adjacent r5c3.  The ALS is left with the
  // illegal consecutive 4/5/6 structure, so r6c3 cannot be 9.
  cand[37] = [4, 5, 6, 9]; // r5c2
  cand[38] = [6, 8, 9]; // r5c3
  cand[39] = [4, 5]; // r5c4
  cand[47] = [3, 4, 9]; // r6c3

  const report = core.findBoxLineReports(cand).find(step =>
    step.tech === 'non-consecutive-als-dof-peer'
    && step.elim.items.some(item => item.cell === 47 && item.digit === 9)
    && step.clause.cells.join(',') === '37,38,39');

  assert.ok(report, 'the 9-origin reduction should reject r6c3=9');
  assert.match(report.desc, /r5c234 consecutive DOF=2 \(4,5,6\)/);
});

