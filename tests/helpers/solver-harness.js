const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { Worker } = require('node:worker_threads');

const root = path.resolve(__dirname, '../..');

function createSolverHarness(protocol = 'file:') {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const elements = new Map();
  const blobs = new Map();
  const workers = [];
  const requests = [];
  const progressEvents = [];
  const workerUrls = [];
  const statuses = [];
  let blobId = 0;

  function element(id = '') {
    const match = new RegExp(`<[^>]*\\bid="${id}"[^>]*>`).exec(html);
    const tag = match?.[0] || '';
    let value = /\bvalue="([^"]*)"/.exec(tag)?.[1] || '';
    if (tag.startsWith('<select')) {
      const options = html.slice(match.index, html.indexOf('</select>', match.index));
      value = /<option\b[^>]*value="([^"]*)"[^>]*selected/.exec(options)?.[1]
        || /<option\b[^>]*value="([^"]*)"/.exec(options)?.[1] || '';
    }
    return {
      id, value, checked: /\bchecked\b/.test(tag), hidden: false,
      style: { setProperty() {} }, dataset: {},
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      addEventListener() {}, setAttribute() {}, appendChild() {}, replaceChildren() {},
      querySelectorAll() { return []; }, querySelector() { return element(); },
      closest() { return null; }, textContent: '', innerHTML: '',
    };
  }

  class HarnessBlob {
    constructor(parts) { this.source = parts.join(''); }
  }
  class HarnessUrl extends URL {
    static createObjectURL(blob) {
      const url = `blob:solver-test/${++blobId}`;
      blobs.set(url, blob.source);
      return url;
    }
    static revokeObjectURL(url) { blobs.delete(url); }
  }
  class BrowserWorker {
    constructor(url) {
      const address = String(url);
      workerUrls.push(address);
      if (address.startsWith('file:') || address.startsWith('./')) {
        // Reproduce the browser's local-script worker restriction.
        queueMicrotask(() => this.onerror?.({ type: 'error' }));
        return;
      }
      const source = blobs.get(address)
        || fs.readFileSync(path.join(root, 'src/search-worker.js'), 'utf8');
      const bootstrap = `
        const fs = require('node:fs');
        const path = require('node:path');
        const vm = require('node:vm');
        const { parentPort, workerData } = require('node:worker_threads');
        globalThis.self = globalThis;
        globalThis.postMessage = value => parentPort.postMessage(value);
        globalThis.importScripts = (...files) => {
          for (const file of files) {
            const filename = path.join(workerData.root, 'src', file.split('?')[0]);
            vm.runInThisContext(fs.readFileSync(filename, 'utf8'), { filename });
          }
        };
        parentPort.on('message', data => globalThis.onmessage({ data }));
        vm.runInThisContext(workerData.source, { filename: 'search-worker.js' });
      `;
      this.worker = new Worker(bootstrap, { eval: true, workerData: { root, source } });
      workers.push(this.worker);
      this.worker.on('message', data => {
        if (data.type === 'progress') progressEvents.push(data);
        this.onmessage?.({ data });
      });
      this.worker.on('error', error => this.onerror?.({
        type: 'error', message: error.message,
      }));
    }
    postMessage(value) {
      const cloned = structuredClone(value);
      requests.push(cloned);
      this.worker?.postMessage(cloned);
    }
    terminate() { return this.worker?.terminate(); }
  }

  const document = {
    baseURI: protocol === 'file:'
      ? 'file:///C:/Users/hells/source/repos/StormDoku/index.html'
      : 'http://127.0.0.1:4179/index.html',
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element(id));
      return elements.get(id);
    },
    querySelectorAll() { return []; }, querySelector() { return element(); },
    addEventListener() {}, createElement() { return element(); },
    documentElement: element(), body: element(),
  };
  const context = vm.createContext({
    console, document, setTimeout, clearTimeout, performance, structuredClone,
    URL: HarnessUrl, Blob: HarnessBlob, Worker: BrowserWorker,
    location: { protocol }, navigator: {},
    localStorage: { getItem() { return null; }, setItem() {} },
  });
  context.window = context;
  context.addEventListener = () => {};
  for (const match of html.matchAll(/<script src="\.\/([^"?]+)[^"]*"><\/script>/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, match[1]), 'utf8'), context, {
      filename: match[1],
    });
  }
  const inline = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
  const initialization = inline.lastIndexOf('    initFishSettings();');
  if (initialization < 0) throw new Error('Page initialization boundary not found.');
  vm.runInContext(inline.slice(0, initialization), context, { filename: 'index-inline.js' });
  context.recordStatus = value => statuses.push(value);
  vm.runInContext(`
    render = () => {};
    renderLog = () => {};
    renderSolutionActions = () => {};
    setStatus = text => { statusEl.textContent = text; recordStatus(text); };
  `, context);

  function evaluate(source) {
    return vm.runInContext(source, context, { timeout: 30000 });
  }
  function loadPuzzle(text) {
    context.testPuzzle = text;
    evaluate(`
      puzzle = [...testPuzzle].map(char => Number(char) || 0);
      originalPuzzle = [...puzzle];
      cand = core.allCandidates(puzzle);
      solution = core.solveFully(puzzle);
    `);
  }
  function loadCandidates(rows) {
    context.testRows = rows;
    evaluate(`
      const values = testRows.join(' ').split(' ');
      puzzle = values.map(value => value.length === 1 ? Number(value) : 0);
      originalPuzzle = [...puzzle];
      cand = values.map(value => value.length === 1 ? [] : [...value].map(Number));
      solution = core.solveFully(puzzle);
    `);
  }
  async function close() {
    evaluate('cancelActiveSearches()');
    await Promise.all(workers.map(worker => worker.terminate()));
  }
  return { evaluate, loadPuzzle, loadCandidates, close,
    requests, workerUrls, statuses, blobs, progressEvents };
}

module.exports = { createSolverHarness };
