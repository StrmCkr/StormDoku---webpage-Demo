/* StormDoku puzzle generator worker. */
importScripts('./browser-core.js?v=20261029-01');

self.onmessage = event => {
  try {
    globalThis.StormDoku.configureVariants(event.data?.variantSettings || {});
    const givens = Math.min(81, Math.max(1, Number(event.data?.givens) || 21));
    self.postMessage({ result: globalThis.StormDoku.generate(givens) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
