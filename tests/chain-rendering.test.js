const assert = require('node:assert/strict');
const test = require('node:test');
const { createSolverHarness } = require('./helpers/solver-harness.js');

async function withChain(action) {
  const solver = createSolverHarness();
  try {
    solver.evaluate(`
      puzzle = new Array(81).fill(0);
      cand = Array.from({ length: 81 }, () => []);
      cand[40] = [2, 7]; cand[49] = [3, 7];
      cand[68] = [4, 7, 9]; cand[76] = [4, 7, 9];
      cand[63] = [1, 4]; cand[64] = [1, 5, 9]; cand[73] = [4, 9];
      cand[74] = [1, 7]; cand[75] = [5, 7];
      chainReport = { candidateGrid: cand.map(values => [...values]), chains: [{
        structureName: 'ALS - H-Wing',
        steps: [
          { family: 'SL', linkType: 1, linkTypeName: 'BILOCAL_GROUPED',
            entry: { cells: [40, 49], digits: [7] },
            exit: { cells: [76], digits: [7] } },
          { family: 'ALS', linkType: 5, linkTypeName: 'ALS_RCC',
            entry: { cells: [68, 76], digits: [4, 7] },
            exit: { cells: [68, 76], digits: [9] }, weakDigit: 7 },
          { family: 'ALS', linkType: 5, linkTypeName: 'ALS_RCC',
            entry: { cells: [63, 64, 73], digits: [9] },
            exit: { cells: [63, 64, 73], digits: [1, 4, 5] }, weakDigit: 9 },
          { family: 'SL', linkType: 4, linkTypeName: 'BIVALVE',
            entry: { cells: [74], digits: [1] },
            exit: { cells: [74], digits: [7] }, weakDigit: 1 },
        ],
        eliminations: [{ cell: 75, digit: 7 }, { cell: 76, digit: 7 }],
      }] };
      selectedChainIndex = 0;
      lastRemoved = [];
    `);
    await action(solver);
  } finally {
    await solver.close();
  }
}

test('eliminated intermediate chain node retains its marks and connector anchors', () => withChain(solver => {
  assert.equal(solver.evaluate('chainHighlights(selectedChain()).marks.has("76:7")'), true);
  solver.evaluate('lastRemoved = core.applyEliminations(cand, { items: selectedChain().eliminations });');
  assert.equal(solver.evaluate('cellHasCandidate(76, 7)'), false);
  assert.equal(solver.evaluate('chainCandidateIsVisible(76, 7)'), true);
  assert.equal(solver.evaluate('chainHighlights(selectedChain()).marks.has("76:7")'), true);
  assert.equal(solver.evaluate('chainHighlights(selectedChain()).xorExitMarks.has("76:7")'), true);
  assert.equal(solver.evaluate('sideAnchors(selectedChain().steps[0].exit).length'), 1);
  assert.equal(solver.evaluate('sideAnchors(selectedChain().steps[1].entry, 7).some(x => x.cell === 76)'), true);
  assert.equal(solver.evaluate('closestAnchorPair(selectedChain().steps[0].entry, selectedChain().steps[0].exit).to.cell'), 76);
}));

test('removed chain nodes remain anchored in Rn, Cn and Bn views', () => withChain(solver => {
  solver.evaluate('lastRemoved = core.applyEliminations(cand, { items: selectedChain().eliminations });');
  for (const view of ['Rn', 'Cn', 'Bn']) {
    solver.evaluate(`gridView = '${view}';`);
    assert.equal(solver.evaluate('vantageSideAnchors(selectedChain().steps[0].exit).length'), 1);
    assert.equal(solver.evaluate('vantageClosestAnchorPair(selectedChain().steps[0].entry, selectedChain().steps[0].exit).to.cell'), 76);
  }
}));

test('absent and unapplied candidates do not gain chain badges', () => withChain(solver => {
  solver.evaluate('cand[76] = [4, 9];');
  assert.equal(solver.evaluate('chainCandidateIsVisible(76, 7)'), false);
  assert.equal(solver.evaluate('sideAnchors(selectedChain().steps[0].exit).length'), 0);
  solver.evaluate('lastRemoved = [{ cell: 76, digit: 2 }];');
  assert.equal(solver.evaluate('chainCandidateIsVisible(76, 2)'), false);
  assert.equal(solver.evaluate('chainSideAtoms({ cells: [76], digits: [2] }, null, true).length'), 0);
  solver.evaluate('lastRemoved = [{ cell: 76, digit: 7 }]; selectedChainIndex = null;');
  assert.equal(solver.evaluate('chainCandidateIsVisible(76, 7)'), false);
}));

test('ALS weak links prefer a real digit candidate before geometric fallback slots', () => withChain(solver => {
  solver.evaluate(`
    cand[20] = [4, 6, 8];
    cand[18] = [5, 6];
    cand[22] = [4, 5, 7];
    cand[23] = [4, 5];
    cand[25] = [7, 8];
  `);
  const endpoint = solver.evaluate(`
    groupedAnchorPair(
      { cells: [20], digits: [8] },
      { cells: [18, 22, 23, 25], digits: [4, 5, 6, 7, 8] },
      8,
      8,
      true
    ).to.cell
  `);
  assert.equal(endpoint, 25);
}));

test('weak endpoint digits reconcile to the single shared candidate', () => withChain(solver => {
  const resolved = solver.evaluate(
    'resolvedWeakDigits({ digits: [1, 7] }, { digits: [7] }, 1, 7)',
  );
  assert.equal(resolved.fromDigit, 7);
  assert.equal(resolved.toDigit, 7);
}));
