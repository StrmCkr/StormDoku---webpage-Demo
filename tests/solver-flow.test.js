const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { buildSearchWorkerBundle } = require('../scripts/build-search-worker.js');
const { createSolverHarness } = require('./helpers/solver-harness.js');

const stoppedGrid = [
  '89 7 369 68 4 168 13 2 5',
  '5 38 1 28 238 9 4 7 6',
  '4 36 2 67 1367 5 13 9 8',
  '17 13 5 9 68 2 68 4 37',
  '6 4 8 3 5 7 2 1 9',
  '2 9 37 4 168 168 5 68 37',
  '3 5 67 1 9 4 678 68 2',
  '1789 1268 679 2678 2678 3 67 5 4',
  '78 268 4 5 2678 68 9 3 1',
];

const alcStopGrid = [
  '4 358 1367 2356 236 12568 1237 9 1236',
  '1356 135 9 4 7 1256 123 236 8',
  '2 138 167 36 369 1689 1347 5 146',
  '369 7 346 8 2469 2469 2345 1 2345',
  '169 1249 8 26 5 3 249 24 7',
  '39 2349 5 7 1 249 6 8 2349',
  '3579 1349 2 356 346 4567 8 3467 13469',
  '8 3459 34 1 2346 24567 23459 23467 234569',
  '357 6 134 9 8 2457 12345 2347 12345',
];

async function withSolver(protocol, action) {
  const solver = createSolverHarness(protocol);
  try { return await action(solver); }
  finally { await solver.close(); }
}

test('offline worker bundle matches the current imported solver cores', () => {
  const bundle = fs.readFileSync(path.join(__dirname, '../src/search-worker-source.js'), 'utf8')
    .replace(/\r\n/g, '\n');
  assert.equal(bundle, buildSearchWorkerBundle());
});

for (const protocol of ['file:', 'http:']) {
  test(`${protocol} worker returns the expected move at the reported stop point`, () => withSolver(protocol, async solver => {
    solver.loadCandidates(stoppedGrid);
    const choice = await solver.evaluate('chooseInteractiveStep({ allowSynchronousFallback: false })');
    assert.equal(solver.evaluate('lastInteractiveSearchError'), null);
    assert.match(choice.step.desc, /^L\(1\)-Wing:.*=> r1c6<>6$/);
    assert.ok(solver.progressEvents.some(event => event.stage === 'walk' && event.statesVisited > 0));
    assert.ok(solver.requests.some(request => request.type === 'simple' && request.payload.fishOptions));
    assert.ok(solver.requests.every(request =>
      request.payload.fishOptions?.omissionFishSearch === undefined));
    if (protocol === 'file:') {
      assert.ok(solver.workerUrls.every(url => url.startsWith('blob:')));
      assert.equal(solver.blobs.size, 0, 'worker releases its source URL after startup');
    }
  }));
}

test('chain progress reports preserve the same proofs and search counts', () => withSolver('file:', async solver => {
  solver.loadCandidates(stoppedGrid);
  const result = solver.evaluate(`(() => {
    const options = { includeAls: false, strongLinkTypes: [0, 1, 2, 3, 4],
      maxDepth: 3, maxChains: 50, maxStates: 1000, maxQueue: 1000 };
    const plain = core.findAicChains(cand, options);
    const progress = [];
    const observed = core.findAicChains(cand, {
      ...options, onProgress: event => progress.push(event),
    });
    return { plain: JSON.stringify({ chains: plain.chains, stats: plain.stats }),
      observed: JSON.stringify({ chains: observed.chains, stats: observed.stats }), progress };
  })()`);
  assert.equal(result.observed, result.plain);
  assert.ok(result.progress.some(event => event.stage === 'walk' && event.statesVisited > 0));
  assert.equal(result.progress.at(-1).stage, 'complete');
}));

test('ALC-XZ honors the work budget at the original Run All timeout state', () => withSolver('file:', async solver => {
  solver.loadCandidates(alcStopGrid);
  const report = await solver.evaluate(`runSearchWorker('alc-xz', {
    candidateGrid: cand, maxStates: 60000, maxChains: 500,
    maxAlsCells: 5, maxAhsDigits: 5, maxAhsCells: 7, maxAhsDof: 5,
    alsMaxSizeDOF: 4, alsMaxSizeFox: 5, ahsMaxSize: 4, ahsMaxFox: 7,
  })`);
  assert.ok(report.stats.statesVisited <= 60000);
  assert.equal(report.stats.stopReason, 'maxStates');
  assert.ok(solver.progressEvents.some(event => event.stage === 'placements'));
  const solution = solver.evaluate('solution');
  for (const chain of report.chains) {
    for (const elimination of chain.eliminations) {
      assert.notEqual(elimination.digit, solution[elimination.cell]);
    }
  }
}));

for (const puzzle of [
  '4......9...947...82......5..7.8...1...8.53..7..571.68...2...8..8..1......6.98....',
  '.7..4..255.1..94764.2..5.98..59.2.4.64835721929.4..5..35.194..2.....3.54..45..931',
]) {
  test(`offline Run All completes ${puzzle}`, { timeout: 360000 }, async () => {
    const runAll = createSolverHarness();
    const next = createSolverHarness();
    try {
      runAll.loadPuzzle(puzzle);
      next.loadPuzzle(puzzle);
      let heartbeat = 0;
      const timer = setInterval(() => heartbeat++, 10);
      try { await runAll.evaluate('runAll()'); }
      finally { clearInterval(timer); }
      const lastRequest = runAll.requests.at(-1);
      assert.equal(runAll.evaluate('lastInteractiveSearchError'), null, JSON.stringify({
        cycle: runAll.evaluate('cycle'),
        request: lastRequest,
        progress: runAll.progressEvents.at(-1),
        candidates: runAll.evaluate("cand.map((digits, cell) => puzzle[cell] || digits.join(''))"),
      }));
      assert.equal(runAll.evaluate('candidateGridIsSolved(cand, puzzle)'), true,
        runAll.statuses.at(-1));
      assert.ok(heartbeat > 0, 'worker search yields to the page event loop');
      assert.ok(runAll.workerUrls.every(url => url.startsWith('blob:')));
      assert.ok(!runAll.statuses.some(status => /worker failed/.test(status)));
      if (puzzle.startsWith('4')) return;
      for (let cycle = 0; cycle < 100; cycle++) {
        if (next.evaluate('boardIsComplete()')) break;
        if (!await next.evaluate('nextCycle()')) break;
      }
      assert.equal(next.evaluate('candidateGridIsSolved(cand, puzzle)'), true);
      assert.deepEqual(
        Array.from(runAll.evaluate('logEntries.map(entry => entry.desc)')),
        Array.from(next.evaluate('logEntries.map(entry => entry.desc)')),
      );
    } finally {
      await Promise.all([runAll.close(), next.close()]);
    }
  });
}

test('named-wing hierarchy follows L, W, S, M, H, Strong and accepts rings', () => withSolver('file:', async solver => {
  const order = Array.from(solver.evaluate(`solverPhasePlan(interactiveTechniqueProfile())
    .find(phase => phase.name === 'moderate-named-wings').chainPhase.allowedMoveKeys`));
  assert.deepEqual(order, [
    'l2-wing', 'l3-wing', 'w-wing', 's-wing', 'm2-wing', 'm3-wing',
    'h1-wing', 'h2-wing', 'h3-wing', 'strong-wing',
  ]);
  for (const [name, key] of [
    ['L(1)', 'l1-wing'], ['L(2)', 'l2-wing'], ['L(3)', 'l3-wing'],
    ['W', 'w-wing'], ['S', 's-wing'], ['M(2)', 'm2-wing'], ['M(3)', 'm3-wing'],
    ['H(1)', 'h1-wing'], ['H(2)', 'h2-wing'], ['H(3)', 'h3-wing'], ['Strong', 'strong-wing'],
  ]) {
    for (const form of ['Wing', 'Ring']) {
      assert.equal(solver.evaluate(`chainMoveKeys({
        structureName: '${name}-${form}', isRing: ${form === 'Ring'}, steps: []
      }).has('${key}')`), true, `${name}-${form}`);
    }
  }
}));

test('challenging hierarchy checks B.A.R.N.S. WXYZ before deeper XY-Chains', () => withSolver('file:', async solver => {
  const names = Array.from(solver.evaluate(
    'solverPhasePlan({ maxRank: 80, maxDepth: 8 }).map(phase => phase.name)',
  ));
  assert.ok(names.indexOf('challenging-xchains') < names.indexOf('irritating-subsets'));
  assert.ok(names.indexOf('challenging-barns-wxyz') < names.indexOf('irritating-xy'));
  assert.ok(names.indexOf('challenging-barns-wxyz') < names.indexOf('challenging-xy-chain'));
  assert.ok(names.indexOf('irritating-subsets') < names.indexOf('irritating-xchains'));
  assert.ok(names.indexOf('irritating-xchains') < names.indexOf('irritating-xy'));
}));

test('named L(2)-Wing keeps its designator over hidden XY fallback', () => withSolver('file:', async solver => {
  const tag = solver.evaluate(
    'ratingForChain({ structureName: "L(2)-Wing", length: 4, steps: ['
      + '{ family: "SL", linkType: 0, entry: { digits: [8] }, exit: { digits: [8] } },'
      + '{ family: "SL", linkType: 0, entry: { digits: [2] }, exit: { digits: [2] } },'
      + '{ family: "SL", linkType: 0, entry: { digits: [7] }, exit: { digits: [7] } }'
      + '] }).tag',
  );
  assert.match(tag, /^L\(2\)-Wing$/);
}));

test('chain priority uses elimination count only within the same class', () => withSolver('file:', async solver => {
  assert.equal(solver.evaluate(
    'isHigherPriorityMove({ priority: [4, -3, 9] }, { priority: [4, -2, 1] })',
  ), true);
  assert.equal(solver.evaluate(
    'isHigherPriorityMove({ priority: [5, -9, 0] }, { priority: [4, -1, 0] })',
  ), false);
}));
