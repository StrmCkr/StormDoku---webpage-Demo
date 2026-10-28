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
        './src/search-worker-source.js?v=20261027-15',
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

  app.workerRuntime = { loadLocalScript, loadOfflineWorkerSource, resolveWorkerUrl, createWorker };
})(window);
