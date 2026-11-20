const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
require('../src/search-worker-source');

let response;
const context = vm.createContext({
  self: { postMessage(message) { if (message.result || message.error) response = message; } },
});
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);
context.window = {};
vm.runInContext(fs.readFileSync(require.resolve('../src/app-uniqueness-search.js'), 'utf8'), context);

const solution = Array.from(
  '832756149715924386496318752647285931281639574359471268168597423524163897973842615',
  Number,
);
const fixtures = [
  { pair: [1, 8], digit: 2, root: 13, guardian: 22, cells: [22, 23, 31, 35, 50, 53] },
  { pair: [2, 5], digit: 1, root: 6, guardian: 25, cells: [25, 26, 30, 32, 57, 61, 77, 80] },
  { pair: [1, 9], digit: 2, root: 2, guardian: 10, cells: [10, 12, 19, 22, 54, 58, 66, 70, 72, 79] },
  { pair: [1, 8], digit: 2, root: 2, guardian: 0, cells: [0, 6, 10, 16, 37, 38, 54, 56, 66, 69, 75, 79] },
  { pair: [1, 3], digit: 2, root: 13, guardian: 21, cells: [21, 22, 34, 35, 38, 40, 45, 50, 54, 62, 66, 68, 74, 79] },
  { pair: [1, 2], digit: 3, root: 1, guardian: 2, cells: [2, 6, 10, 13, 22, 26, 30, 35, 36, 38, 50, 51, 54, 61, 64, 66, 77, 79] },
];

const reportedGrid = `
1458 159 7 38 2 48 3489 139 6
1468 169 134 3678 467 5 34789 1379 2
468 26 234 9 467 1 5 37 348
157 4 159 12578 157 789 6 2359 1359
157 3 6 1257 157 79 249 8 1459
2 8 159 4 3 6 79 579 159
9 1257 1245 157 8 47 23 6 35
1456 12567 1245 1567 14567 3 289 259 589
3 56 8 56 9 2 1 4 7
`.trim().split(/\s+/).map(value => [...value].map(Number));
context.self.onmessage({ data: { id: 1, type: 'uniqueness-type-8',
  payload: { candidateGrid: reportedGrid } } });
assert.ok(response?.result, response?.error);
for (const root of [67, 39, 30]) {
  const record = response.result.results.find(item => (item.externalCells || [item.externalCell]).includes(root)
    && item.breakerDigit === 5 && item.cells.join() === '27,31,36,40');
  assert.ok(record, 'Expected the two-step proof for the reported guardian');
  assert.equal(record.breakerCells.join(), '27,31,36,40');
  assert.equal(record.forcingPlacements.map(item => item.cell).join(), '73,0');
  assert.ok(record.forcingPlacements[0].blockers.some(item => item.cell === 75 && item.source === record.externalCell));
  assert.ok(record.forcingPlacements[1].blockers.some(item => item.cell === 1 && item.source === 73));
  const visual = context.window.StormDokuApp.uniquenessSearch.type8ForcingProof(record, context.StormDoku);
  const grouped = root === 39 || root === 30;
  const rootName = grouped ? 'r45c4' : 'r8c5';
  assert.equal(record.externalCells?.join(), grouped ? '30,39' : undefined);
  assert.equal(visual.text, '(5)' + rootName + ' - (5)r9c4=r9c2 - (5)r1c2=r1c1');
  assert.equal(visual.strong.map(item => item.activeCells[0] + ':' + item.linkedCells[0]).join(), '75:73,1:0');
  assert.equal(visual.weak.map(item => item.leftCells.join('/') + ':' + item.rightCells[0]).join(),
    (grouped ? '30/39' : String(root)) + ':75,73:1');
  assert.equal(visual.onAtoms.join(), (grouped ? '30:5,39:5' : root + ':5') + ',73:5,0:5');
  assert.equal(record.eliminations.map(item => item.cell + ':' + item.digit).join(), grouped ? '30:5,39:5' : root + ':5');
  assert.equal(visual.offAtoms.join(), '27:5,31:5,36:5,40:5,75:5,1:5');
}

function buildCandidates({ pair, digit, guardian, cells }) {
  const alternate = [1, 2, 3, 4].find(value => !pair.includes(value) && value !== digit);
  const candidates = solution.map(value => value === digit ? [digit, alternate] : []);
  for (const cell of cells) candidates[cell] = [...pair];
  candidates[guardian].push(digit);
  return candidates;
}

for (const [operation, digits] of [
  ['bug-type-8', [1, 2]], ['uniqueness-extended-type-8', [1, 2, 3]],
  ['mug-type-8', [1, 2, 3]], ['pug-type-8', [1, 2, 3]],
]) {
  const candidateGrid = Array.from({ length: 81 }, () => []);
  const cells = digits.length === 2 ? [2, 3, 11, 12] : [2, 3, 6, 11, 12, 15];
  for (const cell of cells) candidateGrid[cell] = [...digits];
  candidateGrid[2].push(5);
  candidateGrid[8] = [5, 8];
  candidateGrid[9] = [5, 6];
  candidateGrid[10] = [5, 7];
  candidateGrid[29] = candidateGrid[36] = candidateGrid[55] = [5, 9];
  context.self.onmessage({ data: { id: 1, type: operation, payload: { candidateGrid } } });
  assert.ok(response?.result, response?.error);
  const result = response.result.results.find(record =>
    record.cells.join() === cells.join() && record.externalCells?.join() === '9,10');
  assert.ok(result, 'Expected both mini-sector roots in ' + operation);
  assert.equal(result.eliminations.map(item => item.cell + ':' + item.digit).join(), '9:5,10:5');
  const visual = context.window.StormDokuApp.uniquenessSearch.type8ForcingProof(result, context.StormDoku);
  assert.equal(visual.text, '(5)r2c12 - (5)r1c3');
  assert.equal(visual.weak[0].leftCells.join(), '9,10');
  assert.equal(visual.weak[0].rightCells.join(), '2');
}

const reverseFixed = Array(81).fill(0);
reverseFixed[0] = 2;
reverseFixed[3] = reverseFixed[9] = 1;
const reverseGrid = Array.from({ length: 81 }, () => []);
reverseGrid[12] = [2, 3];
reverseGrid[15] = [3, 5];
reverseGrid[21] = [3, 4];
reverseGrid[22] = [3, 6];
reverseGrid[30] = reverseGrid[58] = [3, 7];
context.self.onmessage({ data: { id: 1, type: 'reverse-bug-type-8', payload: {
  candidateGrid: reverseGrid, originalGivens: reverseFixed, fixedGrid: reverseFixed,
} } });
assert.ok(response?.result, response?.error);
const reverseGroup = response.result.results.find(record => record.externalCells?.join() === '21,22');
assert.ok(reverseGroup, 'Expected the original-givens mini-sector result');
assert.equal(reverseGroup.eliminations.map(item => item.cell + ':' + item.digit).join(), '21:3,22:3');

function checkMatch(results, { pair, digit, root, cells }) {
  return results.find(record => record.externalCell === root
    && record.externalDigit === digit && record.digits.join() === pair.join()
    && record.cells.join() === cells.join());
}

for (const fixture of fixtures) {
  response = null;
  context.self.onmessage({ data: { id: 1, type: 'uniqueness-type-8',
    payload: { candidateGrid: buildCandidates(fixture) } } });
  assert.ok(response?.result, response?.error);
  const result = checkMatch(response.result.results, fixture);
  assert.ok(result, `Expected a ${fixture.cells.length}-cell trade`);
  assert.equal(result.breakerCells.join(), String(fixture.guardian));
  assert.equal(result.templates.length, 2);
  assert.equal(JSON.stringify(result.eliminations), JSON.stringify([{ cell: fixture.root, digit: fixture.digit }]));
}

const find = (candidates, maxDepth) =>
  context.StormDoku.findUniquenessType8(candidates, { maxDepth }).results;
const chain = { ...fixtures[0], root: 2 };
const chainCandidates = buildCandidates(chain);
// r1c3=2 removes the r2c3 decoy, leaving r2c5=2 in row 2.
// This turns off 2 at the guardian r3c5.
chainCandidates[11].push(2);
assert.equal(checkMatch(find(chainCandidates, 1), chain), undefined);
assert.equal(checkMatch(find(chainCandidates, 2), chain)?.breakerCells.join(), '22');

const impossible = { pair: [1, 3], digit: 2, root: 2, guardian: 0,
  cells: [0, 1, 12, 13, 24, 25, 28, 29, 40, 42, 50, 52, 56, 57, 63, 68] };
const impossibleCandidates = Array.from({ length: 81 }, () => []);
for (const cell of [2, 14, 26, 27, 39, 51, 55, 67, 79]) impossibleCandidates[cell] = [2, 4];
for (const cell of impossible.cells) impossibleCandidates[cell] = [...impossible.pair];
impossibleCandidates[impossible.guardian].push(impossible.digit);
assert.ok(!find(impossibleCandidates, 4).some(record => record.size === 16));
console.log('Type 8 checks passed for 6, 8, 10, 12, 14 and 18 cells, the impossible 16-cell case, and two-step forcing.');
