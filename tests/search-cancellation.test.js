const assert = require('node:assert/strict');
const test = require('node:test');
const { createSolverHarness } = require('./helpers/solver-harness');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function holdWorker(solver) {
  solver.evaluate(`
    window.workerTerminated = false;
    searchWorker = {
      postMessage() {},
      terminate() { window.workerTerminated = true; },
    };
    puzzle = new Array(81).fill(0);
    cand = Array.from({ length: 81 }, () => [1,2,3,4,5,6,7,8,9]);
  `);
}

test('Stop terminates work, rejects jobs, preserves the grid, and allows a fresh worker', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  holdWorker(solver);
  const before = solver.evaluate('JSON.stringify({puzzle, cand, logEntries})');
  const pending = solver.evaluate(`
    setBusy(true);
    runSearchWorker('fish', {candidateGrid: cand});
  `);
  const rejected = assert.rejects(pending, { name: 'AbortError' });
  solver.evaluate('stopActiveSearch()');
  await rejected;
  assert.equal(solver.evaluate('window.workerTerminated'), true);
  assert.equal(solver.evaluate('searchWorkerJobs.size'), 0);
  assert.equal(solver.evaluate('busy'), false);
  assert.equal(solver.evaluate('JSON.stringify({puzzle, cand, logEntries})'), before);
  assert.match(solver.statuses.at(-1), /^Stopped\./);
  assert.equal(await solver.evaluate(`runCoreSearch('solveDlx', [
    1,2,3,4,5,6,7,8,9,4,5,6,7,8,9,1,2,3,7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,5,6,7,8,9,1,2,3,4,8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,9,1,2,6,7,8,9,1,2,3,4,5,9,1,2,3,4,5,6,7,8,
  ], 2).then(result => result.count)`), 1);
});

test('Stop before a deferred search starts prevents it from running', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  solver.evaluate('runChainBuild(); stopActiveSearch();');
  await delay(40);
  assert.equal(solver.requests.length, 0);
  assert.equal(solver.evaluate('busy'), false);
  assert.match(solver.statuses.at(-1), /^Stopped\./);
});

test('cancelled fish search does not fall back, clear reports, or unlock a newer search', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  holdWorker(solver);
  solver.evaluate(`
    window.fallbackCalls = 0;
    core.findOmissionFishReports = () => { window.fallbackCalls++; return []; };
    fishReport = [];
    window.retainedFishReport = fishReport;
    runFishBuild();
  `);
  await delay(40);
  assert.equal(solver.evaluate('searchWorkerJobs.size'), 1);
  solver.evaluate(`stopActiveSearch(); window.nextSearchToken = setBusy(true);`);
  await delay(0);
  assert.equal(solver.evaluate('window.fallbackCalls'), 0);
  assert.equal(solver.evaluate('fishReport === window.retainedFishReport'), true);
  assert.equal(solver.evaluate('busy'), true);
  assert.match(solver.statuses.at(-1), /^Stopped\./);
});

for (const command of ['nextCycle', 'runAll', 'applyBasics']) {
  test(`Stop cancels ${command} without applying a result or retrying`, async t => {
    const solver = createSolverHarness();
    t.after(() => solver.close());
    holdWorker(solver);
    const before = solver.evaluate('JSON.stringify({puzzle, cand, logEntries})');
    const running = solver.evaluate(`
      chooseInteractiveStep = () => runSearchWorker('fish', {candidateGrid: cand});
      ${command}();
    `);
    solver.evaluate('stopActiveSearch()');
    await running;
    assert.equal(solver.evaluate('JSON.stringify({puzzle, cand, logEntries})'), before);
    assert.equal(solver.evaluate('busy'), false);
    assert.match(solver.statuses.at(-1), /^Stopped\./);
    assert.equal(solver.statuses.some(status => status.includes('retrying')), false);
  });
}

test('Stop cancels generation without accepting a puzzle or scheduling another attempt', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  holdWorker(solver);
  const before = solver.evaluate('JSON.stringify({puzzle, cand})');
  solver.evaluate(`
    runPuzzleGenerator = () => runCoreSearch('generate', 21);
    generatePuzzle();
  `);
  await delay(40);
  solver.evaluate('stopActiveSearch()');
  await delay(40);
  assert.equal(solver.evaluate('JSON.stringify({puzzle, cand})'), before);
  assert.equal(solver.evaluate('searchWorkerJobs.size'), 0);
  assert.equal(solver.evaluate('busy'), false);
  assert.match(solver.statuses.at(-1), /^Stopped\./);
});

test('worker manual chain search returns the same proofs and cloneable link graphics', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  solver.loadPuzzle('18.695..3.5713486.36.7281.553.416..8.185736.4476982351623859417745361.8.891247536');
  const expected = solver.evaluate(`
    window.manualOptions = {
      strongLinkSet: core.buildStrongLinks(cand), includeAls: false,
      strongLinkTypes: [0,1,2,3], maxDepth: 2, maxChains: 100,
    };
    JSON.stringify(core.findAicChains(cand, manualOptions));
  `);
  const actual = await solver.evaluate(`runCoreSearch('findAicChains', cand, manualOptions)
    .then(report => JSON.stringify(report))`);
  assert.equal(actual, expected);
});

test('an old worker cannot fail or complete jobs belonging to a new search', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  solver.evaluate(`
    window.oldWorker = ensureSearchWorker();
    cancelActiveSearches();
    window.newWorker = ensureSearchWorker();
    oldWorker.onerror({message: 'late error'});
    oldWorker.onmessage({data: {id: searchWorkerJobId, error: 'late result'}});
  `);
  assert.equal(solver.evaluate('searchWorker === window.newWorker'), true);
});

test('worker colouring and chromatic searches preserve their existing reports', async t => {
  const solver = createSolverHarness();
  t.after(() => solver.close());
  solver.loadPuzzle('18.695..3.5713486.36.7281.553.416..8.185736.4476982351623859417745361.8.891247536');
  solver.evaluate('window.testStrongSet = core.buildStrongLinks(cand)');
  for (const method of ['buildSimpleColoring', 'buildThreeDMedusa',
    'buildMultiColoring', 'buildThreeDMedusaMultiColoring']) {
    const expected = solver.evaluate(`JSON.stringify(core.${method}(cand, testStrongSet))`);
    const actual = await solver.evaluate(`runCoreSearch('${method}', cand, testStrongSet).then(JSON.stringify)`);
    assert.equal(actual, expected, method);
  }
  for (const [operation, engine] of [
    ['chromatic', 'StormChromaticCore'], ['chromatic-als', 'StormChromaticAlsCore'],
  ]) {
    const expected = solver.evaluate(`JSON.stringify(window.${engine}.find(cand,
      {unitType: 'boxes', minSectors: 4, maxSectors: 4, minDigits: 3, maxDigits: 3}))`);
    const actual = await solver.evaluate(`runSearchWorker('${operation}', {candidateGrid: cand,
      options: {unitType: 'boxes', minSectors: 4, maxSectors: 4, minDigits: 3, maxDigits: 3}})
      .then(JSON.stringify)`);
    assert.equal(actual, expected, operation);
  }
});
