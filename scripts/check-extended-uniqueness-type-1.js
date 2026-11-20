const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');

const context = vm.createContext({
  self: { postMessage() {} },
  console,
});
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);

const candidates = Array.from({ length: 81 }, () => []);
// r4c1/r4c5/r4c9 and r6c1/r6c5/r6c9 from the supplied six-cell pattern.
candidates[27] = [3, 7];
candidates[31] = [4, 7];
candidates[35] = [3, 4];
candidates[45] = [3, 7, 9];
candidates[49] = [4, 7];
candidates[53] = [3, 4];

const report = context.StormDoku.findExtendedUniquenessType1(candidates);
assert.equal(report.results.length, 1);
const result = report.results[0];
assert.deepEqual(Array.from(result.digits), [3, 4, 7]);
assert.deepEqual(Array.from(result.cells), [27, 31, 35, 45, 49, 53]);
assert.equal(result.exception, 45);
assert.deepEqual(Array.from(result.eliminations, item => ({ cell: item.cell, digit: item.digit })),
  [{ cell: 45, digit: 3 }, { cell: 45, digit: 7 }]);
console.log('Extended Unique Rectangle Type 1 check passed for the supplied six-cell example.');

for (let edgeCount = 3; edgeCount <= 9; edgeCount += 1) {
  const mapped = Array.from({ length: 81 }, () => []);
  const digits = Array.from({ length: edgeCount }, (_, index) => index + 1);
  const extra = edgeCount === 9 ? 3 : 9;
  const selectedColumns = [];
  const stackCounts = [0, 0, 0];
  for (let col = 0; col < edgeCount; col += 1) {
    const stack = col % 3;
    selectedColumns[col] = stack * 3 + stackCounts[stack];
    stackCounts[stack] += 1;
    const pair = [digits[col], digits[(col + 1) % edgeCount]];
    mapped[3 * 9 + selectedColumns[col]] = [...pair];
    mapped[6 * 9 + selectedColumns[col]] = [...pair];
  }
  mapped[6 * 9 + selectedColumns[0]] = [digits[0], digits[1], extra];
  const sizeReport = context.StormDoku.findExtendedUniquenessType1(mapped);
  assert.ok(sizeReport.results.some(item => item.size === edgeCount * 2),
    `Expected mapped size ${edgeCount * 2}`);
}
console.log('Extended Unique Rectangle Type 1 cycle mappings passed for sizes 6 through 18.');

