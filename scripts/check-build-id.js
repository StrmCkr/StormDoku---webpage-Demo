const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const expectedBuildId = '20261029-01';
const files = [
  'index.html',
  'src/search-worker.js',
  'src/generator-worker.js',
].map(relative => ({ relative, text: fs.readFileSync(path.join(root, relative), 'utf8') }));

const ids = [];
for (const { relative, text } of files) {
  for (const line of text.split(/\r?\n/)) {
    if (/\/ocr\//i.test(line)) continue;
    for (const match of line.matchAll(/\?v=([^'"\s)]+)/gi)) {
      ids.push({ file: relative, id: match[1] });
    }
  }
}

if (!ids.length) throw new Error('No StormDoku application build IDs were found.');
const buildId = ids[0].id;
if (buildId !== expectedBuildId) {
  throw new Error(`Unexpected StormDoku build ID. Expected ${expectedBuildId}; found ${buildId}`);
}
const mismatches = ids.filter(entry => entry.id !== buildId);
if (mismatches.length) {
  const details = mismatches.map(entry => `${entry.file}: ${entry.id}`).join(', ');
  throw new Error(`StormDoku build ID drift detected. Expected ${buildId}; found ${details}`);
}

console.log(`StormDoku application build ID is synchronized: ${buildId}`);
