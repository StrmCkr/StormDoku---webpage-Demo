const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/mini-sectors-core.js');
require('../src/strong-link-core.js');
require('../src/ahs-core.js');
require('../src/ahs-link-core.js');
require('../src/chain-core.js');

const core = globalThis.StormDoku;
const rows = [
  '7 1589 1589 6 2 49 1489 48 3',
  '3 89 269 1 49 5 24789 478 467',
  '26 129 4 7 8 3 5 29 169',
  '2458 3 258 9 7 1 24 6 45',
  '1 29 7 4 5 6 3 29 8',
  '45 6 59 8 3 2 479 1 4579',
  '58 4578 3 2 1 489 6 4578 479',
  '2568 12458 2568 3 49 7 1489 458 149',
  '9 1478 18 5 6 48 1478 3 2',
];
const cand = rows.join(' ').split(' ')
  .map(text => text.length === 1 ? [] : [...text].map(Number));
const endpoints = [[7, 4, 26, 1], [25, 2, 16, 8], [11, 2, 17, 6]];
const ahsList = core.ahsConstructor(cand, { maxSize: 8, maxSizeFox: 7 });
const links = core.flattenAhsLinks(core.buildAhsLinks(cand, {
  ahsList, strongLinkSet: core.buildStrongLinks(cand), minDof: 1, maxDof: 3, maxLinks: 5000,
}));
const endpointMatches = (cells, digits, cell, digit) =>
  cells.length === 1 && cells[0] === cell && digits.length === 1 && digits[0] === digit;
const targetedLinks = links.filter(link => endpoints.some(([left, a, right, b]) =>
  (endpointMatches(link.activeCells, link.startingDigits, left, a)
    && endpointMatches(link.linkedCells, link.linkDigits, right, b))
  || (endpointMatches(link.activeCells, link.startingDigits, right, b)
    && endpointMatches(link.linkedCells, link.linkDigits, left, a))));
const report = core.findAicChains(cand, {
  includeStrong: false, includeAls: false, includeAhs: true,
  ahsList, ahsLinkSet: targetedLinks, maxDepth: 4, maxChains: 2000, maxStates: 30000,
});
const example = [...report.chains, ...(report.rejectedChains || [])].find(chain => chain.steps.length === 3
  && chain.steps.every((step, index) => {
    const [left, a, right, b] = endpoints[index];
    return endpointMatches(step.entry.cells, step.entry.digits, left, a)
      && endpointMatches(step.exit.cells, step.exit.digits, right, b);
  }));

test('the reported AHS chain is reproduced with its parent hidden sets and rejected', () => {
  assert.ok(example);
  assert.equal(example.structureName, 'AHS - Chain');
  assert.deepEqual(example.eliminations.map(item => [item.cell, item.digit]), [[7, 8], [16, 4], [17, 4]]);
  assert.ok(example.steps.every(step => step.module.entrySideSubset && step.module.exitSideSubset));
  assert.equal(report.chains.includes(example), false);
  assert.equal(example.verification.ok, false);
  assert.ok(report.stats.ahsPlacementRejected > 0);
});

test('all three removals remain possible in the complete reported AHS cells', () => {
  const cells = [...new Set(example.steps.flatMap(step => [
    ...step.module.entrySideSubset.cells, ...step.module.exitSideSubset.cells,
  ]))];
  const witnesses = [
    [8, 4, 1, 5, 9, 8, 2, 4, 7, 9, 2, 6],
    [8, 4, 1, 5, 9, 8, 2, 4, 6, 7, 2, 9],
    [8, 4, 1, 5, 9, 8, 6, 7, 4, 2, 9, 6],
  ];
  const orderedCells = [7, 5, 6, 1, 2, 10, 11, 16, 17, 15, 25, 26];
  assert.deepEqual([...cells].sort((a, b) => a - b), [...orderedCells].sort((a, b) => a - b));
  example.eliminations.forEach((target, index) => {
    const placement = new Map(orderedCells.map((cell, position) => [cell, witnesses[index][position]]));
    assert.equal(placement.get(target.cell), target.digit);
    for (const [cell, digit] of placement) {
      assert.ok(cand[cell].includes(digit));
      for (const peer of core.peersOf(cell)) assert.notEqual(placement.get(peer), digit);
    }
    for (const step of example.steps) {
      for (const subset of [step.module.entrySideSubset, step.module.exitSideSubset]) {
        for (const digit of subset.digits) assert.ok(subset.cells.some(cell => placement.get(cell) === digit));
      }
    }
  });
});

test('AHS-XZ cannot remove the solution 9 from r3c2 or r2c7', () => {
  const grid = rows.join(' ').split(' ').map(text => text.length === 1 ? Number(text) : 0);
  const solved = core.solveDlx(grid, 2);
  assert.equal(solved.count, 1);
  assert.equal(solved.solution[19], 9);
  assert.equal(solved.solution[15], 9);
  const badXz = links.filter(link => ['AHS_XZ', 'AHS_XZ_RING'].includes(link.moduleKind)
    && (link.intrinsicEliminations || []).some(item => [15, 19].includes(item.cell) && item.digit === 9));
  assert.ok(badXz.length > 0);
  const xzReport = core.findAicChains(cand, {
    includeStrong: false, includeAls: false, includeAhs: true,
    ahsList, ahsLinkSet: badXz, maxDepth: 2, maxChains: 100,
  });
  assert.equal(xzReport.chains.some(chain => chain.eliminations.some(item =>
    [15, 19].includes(item.cell) && item.digit === 9)), false);
  assert.ok(xzReport.rejectedChains?.length > 0);
});

test('generic AIC phases cannot bypass the AHS XZ -> XY -> Chain hierarchy', async t => {
  const { createSolverHarness } = require('./helpers/solver-harness');
  const solver = createSolverHarness();
  t.after(() => solver.close());
  for (const [name, family] of [['AHS - XZ', 'ahs-xz'], ['AHS - XY', 'ahs-xy'], ['AHS - Chain', 'ahs-chain']]) {
    const chain = { ...example, structureName: name };
    assert.equal(solver.evaluate(`chainMatchesSearchPhase(${JSON.stringify(chain)}, { family: null, includeAhs: true })`), false);
    assert.equal(solver.evaluate(`chainMatchesSearchPhase(${JSON.stringify(chain)}, { family: '${family}', includeAhs: true })`), true);
  }
  const names = Array.from(solver.evaluate('solverPhasePlan({ maxRank: 130, maxDepth: 8 }).map(phase => phase.name)'));
  assert.ok(names.indexOf('hard-ahs-xz') >= 0);
  assert.ok(names.indexOf('hard-ahs-xz') < names.indexOf('demanding-ahs-xy'));
  assert.ok(names.indexOf('demanding-ahs-xy') < names.indexOf('brutal-ahs-chain'));
  for (const name of ['challenging-aic', 'irritating-aic', 'frustrating-aic', 'hard-aic-full-depth']) {
    const configured = solver.evaluate(`(() => {
      const phase = solverPhasePlan({ maxRank: 140, maxDepth: 8 })
        .find(phase => phase.name === '${name}').chainPhase;
      const profile = phaseProfile({}, phase);
      return generatorWorkerConfig(cand, puzzle, profile, 'interactive', phase).chain;
    })()`);
    assert.equal(configured.includeAhs, true, name);
    assert.equal(configured.alsLinkMode, 'rcc-only', name);
  }
  const full = solver.evaluate(`(() => {
    const phase = solverPhasePlan({ maxRank: 140, maxDepth: 8 })
      .find(phase => phase.name === 'nightmare-full-aic').chainPhase;
    return phaseProfile({}, phase);
  })()`);
  assert.equal(full.includeAlsRcc, true);
  assert.equal(full.includeAhs, true);
  assert.equal(solver.evaluate(`generatorWorkerConfig(cand, puzzle, { includeAhs: true }, 'interactive',
    { family: null, includeAhs: true, strongLinkTypes: [0,1], maxDepth: 4 }).chain.excludePureAhs`), true);
  assert.equal(solver.evaluate(`generatorWorkerConfig(cand, puzzle, { includeAhs: true }, 'interactive',
    { family: 'ahs-xz', includeAhs: true, strongLinkTypes: [0,1], maxDepth: 2 }).chain.excludePureAhs`), false);
});

test('an early generic AIC search does not spend its result quota on pure AHS families', () => {
  const genericReport = core.findAicChains(cand, {
    includeStrong: false, includeAls: false, includeAhs: true, excludePureAhs: true,
    ahsList, ahsLinkSet: targetedLinks, maxDepth: 4, maxChains: 1, maxStates: 30000,
  });
  assert.equal(genericReport.chains.length, 0);
  assert.equal(genericReport.stats.stopReason, null);
  assert.equal(genericReport.stats.resultAttempts, 0);
});

test('Eureka identifies each parent AHS once and retains its RCC candidates', () => {
  const before = JSON.stringify(example);
  const text = core.formatChainEureka(example);
  const nodes = [
    'AHS {14}r1c23678@r1 DOF:3',
    'AHS {129}b3p1489@b3 DOF:1',
    'AHS {28}r2c2378@r2 DOF:2',
    'AHS {69}b3p14689@b3 DOF:3',
  ];
  let last = -1;
  for (const node of nodes) {
    assert.equal(text.split(node).length - 1, 1);
    const position = text.indexOf(node);
    assert.ok(position > last);
    last = position;
  }
  assert.ok(text.includes('(4)r1c8 {RCC (589)r1c2, (9)r1c6, (89)r1c7}'));
  assert.ok(text.includes('(1)r3c9 {RCC (48)r1c7} - (2)r3c8 {RCC (478)r2c7}'));
  assert.ok(text.includes('(8)r2c8 {RCC (9)r2c2, (479)r2c7} - (2)r2c3 {RCC (479)r2c7, (47)r2c8}'));
  assert.ok(text.endsWith('=> r2c89<>4, r1c8<>8'));
  assert.equal(JSON.stringify(example), before);
  assert.equal(core.formatChainEureka(structuredClone(example)), text);
});

test('reverse AHS paths keep set membership and RCC information in walk order', () => {
  const reversed = {
    ...example,
    steps: [...example.steps].reverse().map(step => ({
      ...step,
      entry: step.exit,
      exit: step.entry,
      module: {
        ...step.module,
        entrySideSubset: step.module.exitSideSubset,
        exitSideSubset: step.module.entrySideSubset,
        entrySideRccDigitsByCell: step.module.exitSideRccDigitsByCell,
        exitSideRccDigitsByCell: step.module.entrySideRccDigitsByCell,
      },
    })),
  };
  const text = core.formatChainEureka(reversed);
  assert.ok(text.startsWith('AHS - Chain: AHS {69}b3p14689@b3'));
  assert.ok(text.indexOf('AHS {28}') < text.indexOf('AHS {129}'));
  assert.ok(text.indexOf('AHS {129}') < text.indexOf('AHS {14}'));
  assert.ok(text.includes('(2)r3c8 {RCC (478)r2c7} - (1)r3c9 {RCC (48)r1c7}'));
});

test('a same-cell handoff to an ordinary strong link cannot hide an AHS node', () => {
  const entry = { cells: [7], digits: [4] };
  const exit = { cells: [26], digits: [1] };
  const chain = {
    structureName: 'AIC', eliminations: [], steps: [
      example.steps[0],
      { family: 'SL', linkType: 0, entry: exit, exit: entry },
    ],
  };
  const text = core.formatChainEureka(chain);
  assert.ok(text.includes('AHS {14}'));
  assert.ok(text.includes('AHS {129}'));
  assert.ok(text.includes('RCC (48)r1c7'));
});

test('the placement check retains supported removals and drops unsupported ones', () => {
  const candidates = Array.from({ length: 81 }, () => []);
  candidates[0] = [1, 4]; candidates[1] = [1, 2]; candidates[9] = [1, 3]; candidates[10] = [1, 5];
  const link = {
    id: 'hidden-occupancy',
    HS_L: { sector: 0, digits: [1], cells: [0, 1] },
    HS_R: { sector: 9, digits: [1], cells: [0, 9] },
  };
  const input = {
    chains: [{ steps: [{ family: 'AHS', linkId: link.id }],
      eliminations: [{ cell: 10, digit: 1 }, { cell: 10, digit: 5 }] }],
    linkSets: { ahsSet: [link] },
  };
  const verified = core.verifyMixedChainByPlacement(candidates, input, {
    requireAhsCellOccupancy: true, maxStates: 1000,
  });
  assert.equal(verified.chains.length, 1);
  assert.deepEqual(verified.chains[0].eliminations, [{ cell: 10, digit: 1 }]);
  const incomplete = core.verifyMixedChainByPlacement(candidates, input, {
    requireAhsCellOccupancy: true, maxStates: 1,
  });
  assert.equal(incomplete.chains.length, 0);
  assert.equal(incomplete.placementStats.truncated, true);
  const bounded = core.verifyMixedChainByPlacement(candidates, {
    ...input, chains: [...input.chains, ...input.chains],
  }, { requireAhsCellOccupancy: true, maxTotalStates: 1 });
  assert.equal(bounded.chains.length, 0);
  assert.equal(bounded.rejectedChains.length, 2);
  assert.equal(bounded.placementStats.truncated, true);
  assert.ok(bounded.placementStats.states <= 2);
});

for (const protocol of ['file:', 'http:']) {
  test(`${protocol} worker rejects the unsupported AHS example and preserves its full Eureka`, async t => {
    const { createSolverHarness } = require('./helpers/solver-harness');
    const solver = createSolverHarness(protocol);
    t.after(() => solver.close());
    const options = {
      includeStrong: false, includeAls: false, includeAhs: true,
      ahsList, ahsLinkSet: targetedLinks, maxDepth: 4, maxChains: 2000, maxStates: 30000,
    };
    const workerReport = await solver.evaluate(`runCoreSearch('findAicChains', ${JSON.stringify(cand)}, ${JSON.stringify(options)})`);
    const pathMatches = chain => chain.steps.length === 3 && chain.steps.every((step, index) => {
      const [left, a, right, b] = endpoints[index];
      return endpointMatches(step.entry.cells, step.entry.digits, left, a)
        && endpointMatches(step.exit.cells, step.exit.digits, right, b);
    });
    assert.equal(workerReport.chains.some(pathMatches), false);
    const rejected = workerReport.rejectedChains.find(pathMatches);
    assert.ok(rejected);
    const text = solver.evaluate(`chainText(${JSON.stringify(rejected)})`);
    assert.equal(text, core.formatChainEureka(example));
    const badXz = links.filter(link => ['AHS_XZ', 'AHS_XZ_RING'].includes(link.moduleKind)
      && (link.intrinsicEliminations || []).some(item => [15, 19].includes(item.cell) && item.digit === 9));
    const xzOptions = { ...options, ahsLinkSet: badXz, maxDepth: 2, maxChains: 100 };
    const xzReport = await solver.evaluate(`runCoreSearch('findAicChains', ${JSON.stringify(cand)}, ${JSON.stringify(xzOptions)})`);
    assert.equal(xzReport.chains.some(chain => chain.eliminations.some(item =>
      [15, 19].includes(item.cell) && item.digit === 9)), false);
    assert.ok(xzReport.rejectedChains?.length > 0);
  });
}
