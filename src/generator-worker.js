/* StormDoku puzzle generator worker. */
importScripts('./browser-core.js?v=20260930-1');

self.onmessage = event => {
  try {
    const givens = Math.min(81, Math.max(17, Number(event.data?.givens) || 21));
    self.postMessage({ result: globalThis.StormDoku.generate(givens) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
