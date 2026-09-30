const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = {StormDoku:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/msls-core.js'),'utf8'),context);
const core=context.StormDoku;
const parse = text => text.trim().split(/\s+/).map(s=>[...s].map(Number));
const grid=parse(`
9 8 124 7 125 1235 6 1234 1345
1246 12346 5 2368 9 12368 348 7 1348
1267 1236 126 4 1256 123568 3589 1238 13589
3 12469 12469 269 8 12679 479 5 479
1468 5 14689 369 167 13679 34789 3468 2
268 269 7 23569 256 4 1 368 389
124568 7 12468 2568 3 2568 458 9 1458
14568 1469 3 5689 4567 56789 2 148 14578
2458 249 2489 1 2457 25789 34578 348 6`);
const signature = result => result.links.map(x=>x.digits.join('')+x.sector.kind[0]+(x.sector.index+1)).join(',');
const report=core.findMsls(grid);
assert.equal(report.stats.truncated,false);
for (let i=1;i<report.results.length;i++) {
  assert.ok(report.results[i-1].ns <= report.results[i].ns, 'MSLS results are grouped by cell count');
}
const firstText=core.formatMsls(report.results[0]);
assert.ok(firstText.includes('Cells '), 'MSLS formatter includes the greedy cell grouping');
assert.ok(report.results[0].baseCellIds.length===report.results[0].cellIds.length, 'MSLS base cells are retained for graphics');
assert.ok(report.results[0].coverCellIds.length>0, 'MSLS cover cells are retained for graphics');
assert.ok(report.results[0].coverAtoms.length>0, 'MSLS covered candidate marks are retained for graphics');

for(const [sig,n] of [['1234r1,12368r3,5b2,59b3',12],['124568c1,124567c5,123468c8',18]]) {
  const result=report.results.find(x=>signature(x)===sig);
  assert.ok(result,`Missing ${sig}`);
  assert.equal(result.cellIds.length,n);
  assert.equal(result.rank,0);
  assert.equal(result.eliminations.map(e=>`${e.r},${e.c},${e.digit}`).join('|'),'2,0,1|2,0,2|2,0,6');
}
// The former HS=DC+1 shortcut does not constitute a cell-base fish proof.
const disputed=parse(`
4 3 567 8 16 15 157 2 9
1579 25679 25679 1246 12346 12345 8 135 1357
15 8 25 7 123 9 6 4 135
2 1 45679 49 8 47 3 569 457
379 79 3479 1249 5 6 1279 8 1247
579 5679 8 3 12479 1247 12579 1569 12457
359 4 2359 1269 12369 123 1259 7 8
6 2579 23579 129 12379 8 4 1359 1235
8 279 1 5 23479 2347 29 39 6`);
assert.equal(core.evaluateMslsCovers(disputed,[2,4,11,29,38,56,65],
  [{house:0,digit:6},...[3,4,6,7,9].map(digit=>({house:11,digit}))]),null);
assert.equal(core.findMsls(grid,{maxStates:1}).stats.truncated,true);
console.log(`MSLS: both reference fish found; ${report.results.length} results, ${report.stats.states} states.`);
