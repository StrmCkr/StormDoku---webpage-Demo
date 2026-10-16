const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/als-core.js');
require('../src/als-dof-core.js');
require('../src/mini-sectors-core.js');
require('../src/strong-link-core.js');
require('../src/chain-core.js');
require('../src/hydra-core.js');

const core = globalThis.StormDoku;

function syntheticCandidates() {
  const cand = Array.from({ length: 81 }, () => []);
  for (const [cell, digit] of [
    [0, 1], [1, 2], [2, 3],
    [9, 1], [10, 2], [11, 3],
    [18, 1], [19, 2], [20, 3],
  ]) cand[cell] = [digit];
  cand[27] = [1];
  return cand;
}

function node(id, cells, digits = [1, 2, 3], dof = 1) {
  return {
    id,
    cells,
    digits,
    dof,
    rccList: [
      { digit: 1, cells: [cells[0]], sectors: [18] },
      { digit: 2, cells: [cells[1]], sectors: [18] },
      ...(cells[2] == null ? [] : [{ digit: 3, cells: [cells[2]], sectors: [18] }]),
    ],
  };
}

test('Hydra accepts a verified AIC participant as an ALS auxiliary', () => {
  const cand = syntheticCandidates();
  const primaryA = node('A', [0, 1, 2]);
  const primaryC = node('C', [9, 10, 11]);
  const auxiliary = node('S', [18, 19, 20], [1, 2, 3, 4]);
  const participant = core.hydraParticipant(cand, {
    family: 'ALS',
    node: auxiliary,
    verified: true,
    chain: {
      verified: true,
      steps: [
        { entry: { cells: [18], digits: [1] }, exit: { cells: [29], digits: [5] } },
      ],
    },
  });

  assert.equal(participant.kind, 'HYDRA_AIC');
  assert.deepEqual(participant.chainCells, [18, 29]);
  assert.equal(core.verifyHydraParticipant(cand, participant).ok, true);

  const report = core.findHydraAlsDof(cand, {
    alsList: [primaryA, primaryC],
    participants: [participant],
    maxDigits: 3,
    maxAuxiliary: 1,
  });
  assert.equal(report.results.length, 1);
  assert.equal(report.results[0].name, 'Hydra ALS DOF');
  assert.deepEqual(report.results[0].eliminations.map(item => [item.cell, item.digit]), [[27, 1]]);
});

test('Hydra rejects an unverified participant by default', () => {
  const cand = syntheticCandidates();
  const result = core.verifyHydraParticipant(cand, {
    node: node('S', [4, 5]),
    chain: { steps: [] },
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('Hydra participant AIC chain is not verified'));
});

test('Hydra preserves a valid non-chain-digit elimination at an AIC endpoint', () => {
  const cand = Array.from({ length: 81 }, () => []);
  cand[18] = [1, 2];
  const participant = core.hydraParticipant(cand, {
    node: node('S', [18], [1, 2], 1),
    verified: true,
    chain: {
      verified: true,
      steps: [
        { entry: { cells: [18], digits: [1] }, exit: { cells: [29], digits: [5] } },
      ],
      eliminations: [{ cell: 18, digit: 2 }],
    },
  });
  assert.deepEqual(participant.eliminations.map(item => [item.cell, item.digit]), [[18, 2]]);
});

test('Hydra exposes the complementary LS digit at the opposite AIC endpoint', () => {
  const cand = Array.from({ length: 81 }, () => []);
  cand[27] = [7, 8];
  const auxiliary = core.hydraParticipant(cand, {
    node: node('S', [18], [4, 6, 7, 8], 3),
    verified: true,
    chain: {
      verified: true,
      steps: [
        {
          entry: { cells: [27], digits: [7] },
          exit: { cells: [18], digits: [4, 6, 7] },
        },
      ],
    },
  });
  const eliminations = core.hydraBoundaryEliminations(cand, auxiliary, {
    digit: 4,
    rightCells: [18],
  });
  assert.deepEqual(eliminations.map(item => [item.cell, item.digit]), [[27, 8]]);
});

test('Hydra does not remove the active AIC endpoint digit', () => {
  const cand = Array.from({ length: 81 }, () => []);
  cand[27] = [1, 8];
  const auxiliary = core.hydraParticipant(cand, {
    node: node('S', [18], [1, 4], 1),
    verified: true,
    chain: {
      verified: true,
      steps: [
        {
          entry: { cells: [27], digits: [1] },
          exit: { cells: [18], digits: [4] },
        },
      ],
    },
  });
  const eliminations = core.hydraBoundaryEliminations(cand, auxiliary, {
    digit: 4,
    rightCells: [18],
  });
  assert.deepEqual(eliminations, []);
});

test('Hydra does not remove an asserted digit on a terminal chain step', () => {
  const cand = Array.from({ length: 81 }, () => []);
  cand[72] = [2];
  const participant = core.hydraParticipant(cand, {
    node: node('S', [72], [2, 6, 9], 2),
    verified: true,
    chain: {
      verified: true,
      steps: [
        { entry: { cells: [10], digits: [8] }, exit: { cells: [11], digits: [2] } },
        { entry: { cells: [72], digits: [2] }, exit: { cells: [72], digits: [9] } },
      ],
      eliminations: [{ cell: 72, digit: 2 }],
    },
  });
  assert.deepEqual(participant.eliminations, []);
});

test('Hydra ALS-DOF exposes an explicit AIC link boundary', () => {
  const record = {
    mode: 'hydra',
    z: 1,
    primaryA: { id: 'A', cells: [0], digits: [1] },
    primaryC: { id: 'C', cells: [1], digits: [1] },
    eliminations: [{ cell: 9, digit: 1 }],
  };
  const link = core.hydraAlsDofLink(record, {
    left: {
      cells: [0],
      digits: [1],
      sectorsByDigit: { 1: [0] },
      potentialElimByDigit: { 1: [9] },
      rccCells: [0],
    },
    right: {
      cells: [1],
      digits: [1],
      sectorsByDigit: { 1: [0] },
      potentialElimByDigit: { 1: [0] },
      rccCells: [1],
    },
  });

  assert.equal(link.linkTypeName, 'HYDRA_ALS_DOF');
  assert.deepEqual(link.activeCells, [0]);
  assert.deepEqual(link.linkedCells, [1]);
  assert.deepEqual(link.startCellsSector, { 1: [0] });
  assert.deepEqual(link.potentialElimEnd, { 1: [0] });

  const inventory = core.buildLinkInventory([], {
    includeStrong: false,
    includeAls: false,
    includeAhs: false,
    includeHydra: true,
    hydraLinkSet: [link],
  });
  assert.equal(inventory.counts.hydra, 1);
  assert.equal(inventory.links[0].family, 'HYDRA');
});

function dofChainFixture() {
  const cand = Array.from({ length: 81 }, () => []);
  cand[0] = [1, 2, 3];
  cand[9] = [1, 2, 3];
  cand[18] = [2, 4];
  cand[20] = [1, 4];
  cand[2] = [1, 5];
  const catalogue = core.alsConstructor(cand, { maxSizeDOF: 2, maxSizeFox: 2 });
  const alsList = [0, 9, 18].map(cell => catalogue.find(item =>
    item.alsAllCells.length === 1 && item.alsAllCells[0] === cell));
  const chain = {
    structureName: 'AIC',
    steps: [
      { family: 'SL', linkType: 4, entry: { cells: [18], digits: [2] }, exit: { cells: [18], digits: [4] } },
      { family: 'SL', linkType: 4, entry: { cells: [20], digits: [4] }, exit: { cells: [20], digits: [1] }, weakDigit: 4 },
    ],
    eliminations: [],
  };
  const participants = [{ id: 'branch', node: alsList[2], chain, verified: true }];
  return { cand, alsList, participants };
}

function fixtureCanPlace(cand, forced) {
  const assigned = forced ? [forced] : [];
  const cells = [0, 9, 18, 20].filter(cell => cell !== forced?.cell);
  const visit = index => {
    if (index === cells.length) return true;
    const cell = cells[index];
    for (const digit of cand[cell]) {
      if (assigned.some(other => other.digit === digit && core.peersOf(cell).includes(other.cell))) continue;
      assigned.push({ cell, digit });
      if (visit(index + 1)) return true;
      assigned.pop();
    }
    return false;
  };
  return visit(0);
}

test('ALS DOF chaining uses a non-eliminating auxiliary branch to reach a new target', () => {
  const { cand, alsList, participants } = dofChainFixture();
  const base = core.findAlsDofChains(cand, { alsList, maxDigits: 3, maxAuxiliary: 1, audit: true });
  assert.equal(base.results.some(record => record.eliminations.some(item => item.cell === 2 && item.digit === 1)), false);
  assert.ok(base.auditCandidates.some(record => !record.eliminations.length));
  const report = core.findAlsDofChains(cand, {
    alsList, maxDigits: 3, maxAuxiliary: 1, includeHydra: true, participants,
  });
  const result = report.results.find(record => record.hasHydra
    && record.eliminations.some(item => item.cell === 2 && item.digit === 1));
  assert.ok(result);
  assert.equal(result.hydraBranches[0].sourceRole, 'auxiliary');
  assert.equal(core.verifyAlsDofNet(cand, result, { alsList }).ok, true);
  assert.equal(fixtureCanPlace(cand, null), true);
  for (const item of result.eliminations) assert.equal(fixtureCanPlace(cand, item), false);
  assert.equal(fixtureCanPlace(cand, { cell: 2, digit: 5 }), true);
  assert.match(core.formatAlsDof(result), /A: auxiliary \{24\}r3c1/);
  assert.doesNotThrow(() => structuredClone(report));
});

test('Hydra DOF chain verifier rejects an unsupported extra endpoint deletion', () => {
  const { cand, alsList, participants } = dofChainFixture();
  const report = core.findAlsDofChains(cand, {
    alsList, maxDigits: 3, maxAuxiliary: 1, includeHydra: true, participants,
  });
  const result = report.results.find(record => record.hasHydra);
  assert.ok(result);
  const verification = core.verifyAlsDofNet(cand, {
    ...result, eliminations: [...result.eliminations, { cell: 2, digit: 5 }],
  }, { alsList });
  assert.equal(verification.ok, false);
  assert.ok(verification.errors.some(error => error.includes('2:5')));
});

test('an exhausted Hydra placement budget cannot produce eliminations', () => {
  const { cand, alsList, participants } = dofChainFixture();
  const report = core.findAlsDofChains(cand, {
    alsList, maxDigits: 3, maxAuxiliary: 1, includeHydra: true, participants, maxProofStates: 1,
  });
  assert.equal(report.results.some(record => record.hasHydra), false);
});

test('AIC collection preserves a branch with no standalone elimination', () => {
  const { cand, alsList } = dofChainFixture();
  const strongLinkSet = core.buildStrongLinks(cand, { strongLinkTypes: [4] });
  const report = core.findAicChains(cand, {
    strongLinkSet, includeAls: false, strongLinkTypes: [4], maxDepth: 2,
    collectAlsBranches: true,
  });
  assert.ok(report.alsBranches.some(chain => !chain.eliminations.length));
  const participants = core.hydraParticipantsFromAicChains(cand, report.alsBranches, alsList, [], { forChaining: true });
  assert.ok(participants.some(participant => participant.node.uniqueID === alsList[2].uniqueID
    && !participant.eliminations.length));
});

test('the existing ALS DOF chain worker searches and returns Hydra paths without a prior Hydra search', async () => {
  const { createSolverHarness } = require('./helpers/solver-harness');
  const solver = createSolverHarness();
  try {
    const { cand } = dofChainFixture();
    const report = await solver.evaluate(`runSearchWorker('als-dof-chain', {
    candidateGrid: ${JSON.stringify(cand)}, maxDigits: 3, maxAuxiliary: 1,
    maxResults: 30, aicDepth: 3, includeAhs: false,
  })`);
  assert.equal(report.stats.hydraChainsEnabled, true);
  assert.ok(report.results.some(record => record.hasHydra
    && record.eliminations.some(item => item.cell === 2 && item.digit === 1)));
  assert.equal(report.stats.verifierRejected, 0);
  assert.doesNotThrow(() => structuredClone(report));
  solver.evaluate(`
    puzzle = new Array(81).fill(0);
    cand = ${JSON.stringify(cand)};
    alsDofChainReport = ${JSON.stringify(report)};
    selectedAlsDofSource = 'chain';
    selectedAlsDofIndex = alsDofChainReport.results.findIndex(record => record.hasHydra);
    window.hydraStep = highlightedMoveStep();
  `);
  assert.equal(solver.evaluate('currentHighlights().isHydra'), true);
  assert.ok(solver.evaluate('currentHighlights().hydraChains.length') > 0);
  assert.ok(solver.evaluate('window.hydraStep.elim.items.some(item => item.cell === 2 && item.digit === 1)'));
  solver.evaluate('lastRemoved = core.applyEliminations(cand, window.hydraStep.elim);');
    assert.equal(solver.evaluate('cand[2].includes(1)'), false);
  } finally {
    await solver.close();
  }
});

test('Hydra chain selection highlights every branch', async () => {
  const { createSolverHarness } = require('./helpers/solver-harness');
  const solver = createSolverHarness();
  try {
    solver.evaluate(`
    puzzle = new Array(81).fill(0);
    cand = Array.from({ length: 81 }, () => []);
    cand[0] = [1,2]; cand[1] = [2,3]; cand[40] = [4,5]; cand[41] = [5,6];
    const node = { id: 'hub', cells: [0], digits: [1,2], dof: 1 };
    const chains = [[0,1,1,2,3], [40,41,4,5,6]].map(([left,right,a,b,c]) => ({
      structureName: 'XY-Chain', eliminations: [], steps: [
        { family: 'SL', linkType: 4, entry: { cells: [left], digits: [a] }, exit: { cells: [left], digits: [b] } },
        { family: 'SL', linkType: 4, weakDigit: b, entry: { cells: [right], digits: [b] }, exit: { cells: [right], digits: [c] } },
      ],
    }));
    alsDofChainReport = { results: [{ hasHydra: true, mode: 'chain', primaryA: node,
      auxiliary: [], eliminations: [], hydraBranches: chains.map(chain => ({ chain })) }] };
    selectedAlsDofSource = 'chain'; selectedAlsDofIndex = 0;
  `);
  assert.equal(solver.evaluate('currentHighlights().hydraChains.length'), 2);
    for (const atom of ['0:1', '1:3', '40:4', '41:6']) {
      assert.equal(solver.evaluate(`currentHighlights().chainMarks.has('${atom}')`), true);
    }
  } finally {
    await solver.close();
  }
});
