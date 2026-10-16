const assert = require('node:assert/strict');
const test = require('node:test');
const { createSolverHarness } = require('./helpers/solver-harness.js');

test('chromatic Type 3 exposes two XOR sides and their peer envelopes', async t => {
  const solver = createSolverHarness();
  try {
    const result = JSON.parse(solver.evaluate(`(() => {
    const grid = Array.from({ length: 81 }, () => []);
    grid[0] = [1];
    grid[10] = [2, 3];
    const links = StormChromaticCore.buildChromaticType3Links(grid, [{
      classification: 'Non-Colourable Chromatic Graph (Type 3)',
      type: 3,
      digits: [1],
      coreCells: [0],
      guardians: [10],
      cells: [0, 10],
    }]);
    const link = links[0];
    const report = core.findAicChains(grid, {
      includeStrong: false,
      includeAls: false,
      includeAhs: false,
      includeChromatic: true,
      chromaticLinkSet: links,
      maxDepth: 1,
      maxChains: 5,
    });
    return JSON.stringify({
      link: {
        name: link.linkTypeName,
        left: link.startingDigits,
        right: link.linkDigits,
        leftPeers: link.potentialElimStart,
        rightPeers: link.potentialElimEnd,
      },
      count: report.stats.chromaticLinks,
    });
    })()`));
    assert.equal(result.link.name, 'CHROMATIC_TYPE_3');
    assert.deepEqual(result.link.left, [1]);
    assert.deepEqual(result.link.right, [2, 3]);
    assert.deepEqual(result.link.leftPeers[1], []);
    assert.deepEqual(result.link.rightPeers[2], []);
    assert.equal(result.count, 1);
  } finally {
    await solver.close();
  }
});

