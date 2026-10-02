const assert = require('node:assert/strict');

require('../src/browser-core.js');
require('../src/set-tools-core.js');
require('../src/pom-core.js');
require('../src/mini-sectors-core.js');
require('../src/strong-link-core.js');

const core = globalThis.StormDoku;
const puzzle = '.64.5.......9..5..3..4.69...4...7.....95...7.2.......64.....1...2......7.9..68.5.';
const grid = [...puzzle].map(value => value === '.' ? 0 : Number(value));
const cand = core.allCandidates(grid);
const strongLinks = core.buildStrongLinks(cand, {
  includeAlmostFish: true,
  almostFish: { grid, minSize: 2, maxSize: 2, maxK: 1, maxReports: 40 },
});

assert.equal(strongLinks.length, 8, 'AF keeps the reserved ALS/AHS type slots');
assert.ok(strongLinks[7].length > 0, 'the selected omission-fish pass creates AF links');
for (const link of strongLinks[7]) {
  assert.equal(link.linkType, 7);
  assert.equal(link.linkTypeName, 'AF');
  assert.equal(link.xorConstruction.kind, 'almost-fish');
  assert.ok(link.potentialElimStart[link.startingDigits[0]]?.length);
  assert.ok(link.potentialElimEnd[link.startingDigits[0]]?.length);
}

const disabled = core.buildStrongLinks(cand, {
  includeAlmostFish: true,
  almostFish: { grid, minSize: 2, maxSize: 2, minK: 1, maxK: 1, basicsEnabled: false, frankenEnabled: false, mutantEnabled: false },
});
assert.equal(disabled[7].length, 0, 'AF formation toggles can disable every fish family');

console.log(`Almost Fish: ${strongLinks[7].length} type-7 links validated.`);
