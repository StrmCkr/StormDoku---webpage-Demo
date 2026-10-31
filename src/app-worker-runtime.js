/* StormDoku worker runtime helpers. */
(function installWorkerRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  let offlineSourcePromise = null;

  function loadLocalScript(src, globalName, failureMessage) {
    if (global[globalName]) return Promise.resolve(global[globalName]);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => global[globalName]
        ? resolve(global[globalName])
        : reject(new Error(failureMessage));
      script.onerror = () => reject(new Error(failureMessage));
      document.head.appendChild(script);
    });
  }

  function loadOfflineWorkerSource() {
    if (typeof global.StormDokuSearchWorkerSource === 'string') {
      return Promise.resolve(global.StormDokuSearchWorkerSource);
    }
    if (!offlineSourcePromise) {
      offlineSourcePromise = loadLocalScript(
        './src/search-worker-source.js?v=20261031-01',
        'StormDokuSearchWorkerSource',
        'Offline search worker source could not be loaded.',
      );
    }
    return offlineSourcePromise;
  }

  function resolveWorkerUrl(path) {
    return new URL(path, document.baseURI);
  }

  function createWorker(path, options = {}) {
    return new Worker(resolveWorkerUrl(path), options);
  }

  async function createOfflineWorkerBlobUrl() {
    const source = await loadOfflineWorkerSource();
    return URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  }

  function withVariantSettings(payload, variantSettings) {
    return payload && typeof payload === 'object'
      ? { ...payload, variantSettings: { ...variantSettings } }
      : payload;
  }

  function diagnosticsPayload(payload, options = {}, activePhase = null) {
    return {
      ...payload,
      diagnosticPhase: options.diagnosticPhase
        || payload?.diagnosticPhase
        || activePhase,
    };
  }

  function describeWorkerErrorEvent(event) {
    return [
      event?.message,
      event?.filename && `(${event.filename})`,
      event?.lineno && `line ${event.lineno}`,
      event?.colno && `column ${event.colno}`,
      event?.type === 'error' && !event?.message ? 'uncaught worker error' : null,
    ].filter(Boolean).join(' ');
  }

  app.workerRuntime = {
    loadLocalScript,
    loadOfflineWorkerSource,
    resolveWorkerUrl,
    createWorker,
    createOfflineWorkerBlobUrl,
    withVariantSettings,
    diagnosticsPayload,
    describeWorkerErrorEvent,
  };
})(window);
