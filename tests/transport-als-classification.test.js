const assert = require('node:assert/strict');
const test = require('node:test');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/als-core.js');
require('../src/als-link-core.js');
require('../src/mini-sectors-core.js');
require('../src/strong-link-core.js');
require('../src/chain-core.js');

const core = globalThis.StormDoku;
const rows = [
  '29 48 7 6 3 19 12 5 48',
  '235 3459 249 457 19 8 17 1247 6',
  '56 1 468 2 457 45 9 78 3',
  '125679 5679 1269 3578 1578 1235 4 16789 15789',
  '8 457 14 9 1457 6 3 17 2',
  '125679 45679 3 4578 12457 1245 1567 16789 15789',
  '169 689 5 48 2489 7 126 3 19',
  '4 37 689 1 589 2359 567 2679 579',
  '37 2 19 35 6 359 8 49 14579',
];
const cand = rows.join(' ').split(' ')
  .map(text => text.length === 1 ? [] : [...text].map(Number));

test('redundant prefix is removed from an ALS H-Wing result', () => {
  const alsList = core.alsConstructor(cand, { maxSizeDOF: 7, maxSizeFox: 7 });
  const strongLinkSet = core.buildStrongLinks(cand);
  const alsLinkSet = core.buildAlsLinks(cand, {
    alsList,
    strictSingleCommon: true,
    maxLinks: 5000,
  });
  const wantedStrongPairs = new Set(['1:55', '20:65']);
  const scopedStrongLinks = strongLinkSet.map(bucket => bucket.filter(link => {
    const cells = [...(link.activeCells || []), ...(link.linkedCells || [])]
      .sort((a, b) => a - b);
    return cells.length === 2 && wantedStrongPairs.has(`${cells[0]}:${cells[1]}`);
  }));
  const wantedAlsCells = new Set(['18,22,23,25', '54,74']);
  const scopedAlsLinks = alsLinkSet.map(bucket => bucket.filter(link => {
    const subsets = [link.LS_L, link.LS_R].filter(Boolean);
    return subsets.some(subset => wantedAlsCells.has([...(subset.alsAllCells || subset.cells || [])]
      .sort((a, b) => a - b).join(',')));
  }));
  const report = core.findAicChains(cand, {
    strongLinkSet: scopedStrongLinks,
    alsList,
    alsLinkSet: scopedAlsLinks,
    includeAls: true,
    strongLinkTypes: [0, 1, 2, 3, 4],
    maxDepth: 4,
    maxChains: 500,
    maxStates: 30000,
    maxQueue: 30000,
    maxBranching: 100,
    maxStartViews: 200,
  });
  const hits = report.chains.filter(chain =>
    core.formatChainEureka(chain).includes('r8c3<>9'));
  const concise = hits.find(chain =>
    /H(?:\(\d+\))?-Wing/i.test(chain.structureName)
    && !core.formatChainEureka(chain).includes('r1c2'));
  const redundant = hits.find(chain =>
    core.formatChainEureka(chain).includes('(8)r1c2=(8)r7c2'));
  assert.ok(concise,
    `concise H-Wing not found; results: ${hits.map(chain => `[length=${chain.length}] ${core.formatChainEureka(chain)}`).join(' | ')}`);
  assert.equal(redundant, undefined,
    redundant ? core.formatChainEureka(redundant) : 'unexpected redundant chain');
});

test('three ALS nodes plus one ordinary strong link form a T-ALS-XY Ring', () => {
  const ringCand = rows.join(' ').split(' ')
    .map(text => text.length === 1 ? [] : [...text].map(Number));
  const alsList = core.alsConstructor(ringCand, { maxSizeDOF: 7, maxSizeFox: 7 });
  const strongLinkSet = core.buildStrongLinks(ringCand);
  const alsLinkSet = core.buildAlsLinks(ringCand, {
    alsList,
    strictSingleCommon: true,
    maxLinks: 5000,
  });
  const wantedStrongPairs = new Set(['1:8', '25:25']);
  const scopedStrongLinks = strongLinkSet.map(bucket => bucket.filter(link => {
    const cells = [...(link.activeCells || []), ...(link.linkedCells || [])]
      .sort((a, b) => a - b);
    return cells.length === 2 && wantedStrongPairs.has(`${cells[0]}:${cells[1]}`);
  }));
  const wantedAlsCells = new Set(['6,15,60', '54,55,74']);
  const scopedAlsLinks = alsLinkSet.map(bucket => bucket.filter(link => {
    const subsets = [link.LS_L, link.LS_R].filter(Boolean);
    return subsets.some(subset => wantedAlsCells.has([...(subset.alsAllCells || subset.cells || [])]
      .sort((a, b) => a - b).join(',')));
  }));
  const report = core.findAicChains(ringCand, {
    strongLinkSet: scopedStrongLinks,
    alsList,
    alsLinkSet: scopedAlsLinks,
    includeAls: true,
    strongLinkTypes: [0, 1, 2, 3, 4],
    maxDepth: 4,
    maxChains: 500,
    maxStates: 30000,
    maxQueue: 30000,
    maxBranching: 100,
    maxStartViews: 200,
  });
  const hit = report.chains.find(chain => {
    const text = core.formatChainEureka(chain);
    return text.includes('(8)r1c2=(8)r1c9')
      && text.includes('(8=7)r3c8')
      && text.includes('r2c8<>7');
  });
  assert.ok(hit,
    `transport ring not found; results: ${report.chains.map(core.formatChainEureka).join(' | ')}`);
  assert.equal(hit.structureName, 'T-ALS-XY Ring', core.formatChainEureka(hit));
});

test('a redundant interior bilocal link is removed from an ALS H-Wing', () => {
  const alsList = core.alsConstructor(cand, { maxSizeDOF: 7, maxSizeFox: 7 });
  const strongLinkSet = core.buildStrongLinks(cand);
  const alsLinkSet = core.buildAlsLinks(cand, {
    alsList,
    strictSingleCommon: true,
    maxLinks: 5000,
  });
  const wantedStrongPairs = new Set(['16:70', '58:68']);
  const scopedStrongLinks = strongLinkSet.map(bucket => bucket.filter(link => {
    const cells = [...(link.activeCells || []), ...(link.linkedCells || [])]
      .sort((a, b) => a - b);
    return cells.length === 2 && wantedStrongPairs.has(`${cells[0]}:${cells[1]}`);
  }));
  const wantedAlsCells = new Set(['0,1,11', '54,55,60,62']);
  const scopedAlsLinks = alsLinkSet.map(bucket => bucket.filter(link => {
    const subsets = [link.LS_L, link.LS_R].filter(Boolean);
    return subsets.some(subset => wantedAlsCells.has([...(subset.alsAllCells || subset.cells || [])]
      .sort((a, b) => a - b).join(',')));
  }));
  const report = core.findAicChains(cand, {
    strongLinkSet: scopedStrongLinks,
    alsList,
    alsLinkSet: scopedAlsLinks,
    includeAls: true,
    strongLinkTypes: [0, 1, 2, 3, 4],
    maxDepth: 4,
    maxChains: 500,
    maxStates: 30000,
    maxQueue: 30000,
    maxBranching: 100,
    maxStartViews: 200,
  });
  const hits = report.chains.filter(chain =>
    core.formatChainEureka(chain).includes('r2c1<>2'));
  const concise = hits.find(chain => {
    const text = core.formatChainEureka(chain);
    return /H(?:\(\d+\))?-Wing/i.test(chain.structureName)
      && text.includes('(2)r2c8=(2)r8c8')
      && !text.includes('(2)r7c5=(2)r8c6');
  });
  const redundant = hits.find(chain => {
    const text = core.formatChainEureka(chain);
    return text.includes('(2)r2c8=(2)r8c8')
      && text.includes('(2)r7c5=(2)r8c6');
  });
  const genericAlias = hits.find(chain => {
    const text = core.formatChainEureka(chain);
    return chain.structureName === 'AIC + ALS'
      && text.includes('(2)r2c8=(2)r8c8')
      && text.includes('(1269=8)r7c1279')
      && text.includes('(8=249)b1p126');
  });
  assert.ok(concise,
    `concise H-Wing not found; results: ${hits.map(core.formatChainEureka).join(' | ')}`);
  assert.equal(redundant, undefined,
    redundant ? core.formatChainEureka(redundant) : 'unexpected redundant chain');
  assert.equal(genericAlias, undefined,
    genericAlias ? core.formatChainEureka(genericAlias) : 'unexpected generic alias');
});
