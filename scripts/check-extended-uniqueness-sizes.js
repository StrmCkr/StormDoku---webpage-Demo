const assert = require('node:assert/strict');
const vm = require('node:vm');
require('../src/search-worker-source');
const context = vm.createContext({ self: { postMessage() {} } });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);
const solution = Array.from(
  '725698143986134257134572968298415376351726489647389512879251634562843791413967825', Number,
);
const houses = cell => [Math.floor(cell / 9), 9 + cell % 9,
  18 + 3 * Math.floor(cell / 27) + Math.floor(cell % 9 / 3)];
function valid(grid) {
  return Array.from({ length: 27 }, (_, house) =>
    new Set(grid.filter((_, cell) => houses(cell).includes(house))).size).every(size => size === 9);
}
assert.ok(valid(solution));
const witnesses = new Map();
for (let first = 1; first <= 7; first += 1) {
  for (let second = first + 1; second <= 8; second += 1) {
    for (let third = second + 1; third <= 9; third += 1) {
      const digits = [first, second, third];
      const cells = solution.flatMap((digit, cell) => digits.includes(digit) ? [cell] : []);
      const used = new Uint8Array(27);
      const filling = [];
      function visit(index) {
        if (index === cells.length) {
          const changed = cells.filter((cell, i) => solution[cell] !== filling[i]);
          if (!changed.length || witnesses.has(changed.length)) return;
          const alternate = [...solution];
          cells.forEach((cell, i) => { alternate[cell] = filling[i]; });
          assert.ok(valid(alternate));
          witnesses.set(changed.length, { changed, alternate, digits });
          return;
        }
        const sectors = houses(cells[index]);
        for (let digit = 0; digit < 3; digit += 1) {
          const bit = 1 << digit;
          if (sectors.some(sector => used[sector] & bit)) continue;
          sectors.forEach(sector => { used[sector] |= bit; });
          filling.push(digits[digit]);
          visit(index + 1);
          filling.pop();
          sectors.forEach(sector => { used[sector] ^= bit; });
        }
      }
      visit(0);
    }
  }
}
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
for (const [size, { changed, alternate }] of witnesses) {
  for (const mapCell of [cell => cell, transpose]) {
    const before = new Array(81);
    const after = new Array(81);
    solution.forEach((digit, cell) => { before[mapCell(cell)] = 10 - digit; });
    alternate.forEach((digit, cell) => { after[mapCell(cell)] = 10 - digit; });
    assert.ok(valid(before) && valid(after));
    assert.equal(after.filter((digit, cell) => digit !== before[cell]).length, size);
    assert.equal(changed.length, size);
  }
}
assert.ok(!witnesses.has(5));
for (const size of [7, 13, 15, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27]) {
  assert.ok(witnesses.has(size), `Missing full-grid trade witness of size ${size}`);
  const { changed, alternate, digits } = witnesses.get(size);
  const grid = Array.from({ length: 81 }, () => []);
  changed.forEach(cell => { grid[cell] = [solution[cell], alternate[cell]]; });
  const extra = Array.from({ length: 9 }, (_, i) => i + 1).find(digit => !digits.includes(digit));
  grid[changed[0]].push(extra);
  const report = context.StormDoku.findExtendedUniquenessType1(grid);
  assert.ok(report.results.some(result => result.size === size
    && result.cells.join() === changed.join()), `Type 1 missed size ${size}`);
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(digit => 10 - digit); });
  const expectedCells = changed.map(transpose).sort((a, b) => a - b);
  assert.ok(context.StormDoku.findExtendedUniquenessType1(transformed).results.some(result =>
    result.size === size && result.cells.join() === expectedCells.join()),
  `Transformed Type 1 missed size ${size}`);
  console.log(`Size ${size}: verified full-grid trade; eUR Type 1 sizes found: ${[...new Set(report.results.map(result => result.size))].join(',')}`);
}
for (const name of [
  'findExtendedUniquenessType1', 'findExtendedUniquenessType2And5',
  'findExtendedUniquenessType3', 'findExtendedUniquenessType3Xz', 'findExtendedUniquenessType3Xy',
  'findExtendedUniquenessType3AlsChain', 'findExtendedUniquenessType4',
  'findExtendedUniquenessType6', 'findExtendedUniquenessType7', 'findExtendedUniquenessType8',
]) {
  const report = context.StormDoku[name](Array.from({ length: 81 }, () => []));
  assert.ok(!report.stats.targetSizes.includes(5));
  for (const size of witnesses.keys()) {
    if (size >= 6) assert.ok(report.stats.targetSizes.includes(size), `${name} excludes size ${size}`);
  }
}
console.log('Full-grid witnesses and their transpose/digit relabeling verified.');
module.exports = { witnesses, solution, houses };
