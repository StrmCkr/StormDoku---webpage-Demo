const assert = require('node:assert/strict');
const vm = require('node:vm');
const { witnesses, solution } = require('./check-extended-uniqueness-sizes');
const context = vm.createContext({ self: { postMessage() {} } });
vm.runInContext(globalThis.StormDokuSearchWorkerSource, context);
const core = context.StormDoku;
const sizes = [7, 13, 15, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27];
const ascending = (a, b) => a - b;
const transpose = cell => cell % 9 * 9 + Math.floor(cell / 9);
function atomKey(items) {
  return items.map(({ cell, digit }) => cell * 10 + digit).sort(ascending).join();
}
function checkTransformation(find, grid, size) {
  const original = find(grid).results.filter(record => record.size === size);
  assert.ok(original.length, 'Fixture must produce an elimination at the requested size');
  const transformed = Array.from({ length: 81 }, () => []);
  grid.forEach((values, cell) => { transformed[transpose(cell)] = values.map(digit => 10 - digit); });
  const actual = find(transformed).results.filter(record => record.size === size);
  for (const record of original) {
    const cells = record.cells.map(transpose).sort(ascending).join();
    const eliminations = atomKey(record.eliminations.map(({ cell, digit }) =>
      ({ cell: transpose(cell), digit: 10 - digit })));
    const obtained = new Set(actual.filter(result => result.cells.join() === cells)
      .flatMap(result => result.eliminations.map(({ cell, digit }) => cell * 10 + digit)));
    assert.ok(eliminations.split(',').every(atom => obtained.has(Number(atom))),
      JSON.stringify({ size, missing: eliminations.split(',').filter(atom => !obtained.has(Number(atom))),
        actual: [...obtained], rings: record.internalRings?.length }));
  }
}
for (const size of sizes) {
  const { changed, alternate, digits } = witnesses.get(size);
  const outside = Array.from({ length: 81 }, (_, cell) => cell).filter(cell => !changed.includes(cell));
  const extras = Array.from({ length: 9 }, (_, index) => index + 1).filter(digit => !digits.includes(digit));
  const base = () => {
    const grid = Array.from({ length: 81 }, () => []);
    changed.forEach(cell => { grid[cell] = [solution[cell], alternate[cell]]; });
    return grid;
  };
  const coverage = [];
  const alsTarget = outside.find(target => changed.some(cell => core.peersOf(cell).includes(target)));
  const roof = changed.find(cell => core.peersOf(cell).includes(alsTarget));
  const alsGrid = base();
  alsGrid[roof].push(extras[0]);
  alsGrid[alsTarget] = [extras[0], extras[1]];
  checkTransformation(grid => core.findExtendedUniquenessType3(grid), alsGrid, size);
  coverage.push('3 ALS');

  const guardianGrid = base();
  guardianGrid[roof].push(extras[0]);
  solution.forEach((digit, cell) => {
    if (digit === extras[0] && !changed.includes(cell)) guardianGrid[cell] = [extras[0], extras[1]];
  });
  const guardianReport = core.findExtendedUniquenessType8(guardianGrid);
  assert.ok(guardianReport.results.some(record => record.size === size), 'Expected a guardian elimination');
  checkTransformation(grid => core.findExtendedUniquenessType8(grid), guardianGrid, size);
  coverage.push('8');
  for (const [length, method] of [
    [2, 'findExtendedUniquenessType3Xz'], [3, 'findExtendedUniquenessType3Xy'],
    [4, 'findExtendedUniquenessType3AlsChain'],
  ]) {
    let found;
    let seed = 12345 + size;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
    const shuffled = values => {
      const result = [...values];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const other = (random() >>> 8) % (index + 1);
        [result[index], result[other]] = [result[other], result[index]];
      }
      return result;
    };
    for (let attempt = 0; attempt < 1000 && !found; attempt += 1) {
      const rows = shuffled([0, 1, 2]).flatMap(band => shuffled([0, 1, 2]).map(row => band * 3 + row));
      const cols = shuffled([0, 1, 2]).flatMap(stack => shuffled([0, 1, 2]).map(col => stack * 3 + col));
      const map = cell => rows[Math.floor(cell / 9)] * 9 + cols[cell % 9];
      const templates = length === 2 ? [[[43], [[0, 4]]], [[70], [[1, 4]]]]
        : length === 3 ? [[[43], [[0, 4]]], [[25, 34], [[4, 5], [1, 4]]], [[70], [[2, 5]]]]
          : [[[43], [[0, 4]]], [[25, 34], [[4, 5], [1, 4]]],
            [[69, 70], [[4, 2], [2, 5]]], [[78], [[4, 3]]]];
      const groups = templates.map(([cells]) => cells.map(map));
      if (groups.flat().some(cell => changed.includes(cell))) continue;
      const grid = base();
      templates.forEach(([cells, values]) => cells.forEach((cell, index) => {
        grid[map(cell)] = values[index].map(index => extras[index]);
      }));
      const roofs = new Set();
      let compatible = true;
      groups.forEach((group, index) => {
        const locations = group.filter(cell => grid[cell].includes(extras[index]));
        const roof = changed.find(cell => !roofs.has(cell)
          && locations.every(source => core.peersOf(cell).includes(source)));
        if (roof === undefined) { compatible = false; return; }
        roofs.add(roof);
        grid[roof].push(extras[index]);
      });
      if (!compatible) continue;
      const bridge = extras[length === 2 ? 4 : 5];
      const sources = groups.flat().filter(cell => grid[cell].includes(bridge));
      const target = outside.find(cell => !groups.flat().includes(cell)
        && sources.every(source => core.peersOf(source).includes(cell)));
      if (target === undefined) continue;
      grid[target] = [bridge, extras[0]];
      const alsList = groups.map((cells, uniqueID) => ({
        uniqueID, alsDOF: 1, alsAllCells: cells,
        alsDigits: [...new Set(cells.flatMap(cell => grid[cell]))],
      }));
      const run = (grid, mapped = false) => core[method](grid, {
        alsList: alsList.map(als => mapped ? {
          ...als, alsAllCells: als.alsAllCells.map(transpose), alsDigits: als.alsDigits.map(digit => 10 - digit),
        } : als),
      });
      if (!run(grid).results.some(record => record.size === size)) continue;
      let calls = 0;
      checkTransformation(grid => run(grid, calls++ === 1), grid, size);
      found = true;
    }
    assert.ok(found, 'No qualifying ' + length + '-ALS fixture found at size ' + size);
    coverage.push('3 ALS ' + length);
  }
  for (const [name, method] of [
    ['2/5', 'findExtendedUniquenessType2And5'],
    ['4', 'findExtendedUniquenessType4'], ['6', 'findExtendedUniquenessType6'],
  ]) {
    let fixture;
    for (let i = 0; i < changed.length && !fixture; i += 1) {
      for (let j = i + 1; j < changed.length && !fixture; j += 1) {
        const grid = base();
        grid[changed[i]].push(extras[0]);
        grid[changed[j]].push(extras[0]);
        if (name === '2/5') {
          const target = outside.find(cell => core.peersOf(changed[i]).includes(cell)
            && core.peersOf(changed[j]).includes(cell));
          if (target === undefined) continue;
          grid[target] = [extras[0], extras[1]];
        }
        if (core[method](grid).results.some(record => record.size === size)) fixture = grid;
      }
    }
    if (fixture) {
      checkTransformation(grid => core[method](grid), fixture, size);
      coverage.push(name);
    }
  }
  const hidden = base();
  hidden[changed[0]].push(extras[0]);
  if (core.findExtendedUniquenessType7(hidden).results.some(record => record.size === size)) {
    checkTransformation(grid => core.findExtendedUniquenessType7(grid), hidden, size);
    coverage.push('7');
  }
  console.log('Size ' + size + ' positive transformed elimination coverage: ' + coverage.join(','));
}
