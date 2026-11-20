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
        './src/search-worker-source.js?v=20261119-03',
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

  function createSearchWorkerLifecycle({ state, diagnostics, workerPath, onProgressActivity }) {
    function releaseBlobUrl() {
      if (state.blobUrl === null) return;
      URL.revokeObjectURL(state.blobUrl);
      state.blobUrl = null;
    }

    function disable(error = null) {
      state.disabled = true;
      diagnostics.finish(error?.message || 'Search worker unavailable.');
      if (state.worker) state.worker.terminate();
      state.worker = null;
      releaseBlobUrl();
      for (const job of state.jobs.values()) {
        job.reject(error || new Error('Search worker unavailable.'));
      }
      state.jobs.clear();
    }

    async function ensure() {
      if (state.disabled) return null;
      if (state.worker) return state.worker;
      if (typeof Worker === 'undefined') {
        disable(new Error('Web Workers are not supported.'));
        return null;
      }

      try {
        releaseBlobUrl();
        let workerUrl = resolveWorkerUrl(workerPath);
        if (document.baseURI.startsWith('file:')) {
          state.blobUrl = await createOfflineWorkerBlobUrl();
          workerUrl = state.blobUrl;
        }
        state.worker = createWorker(workerUrl, { type: 'classic' });
        const currentWorker = state.worker;
        currentWorker.onmessage = event => {
          if (state.worker !== currentWorker) return;
          const { id, result, error, type } = event.data || {};
          const job = state.jobs.get(id);
          if (!job) return;
          if (type === 'progress') {
            onProgressActivity?.();
            job.onProgress?.(event.data);
            return;
          }
          releaseBlobUrl();
          state.jobs.delete(id);
          if (error) {
            diagnostics.finish(error);
            job.reject(new Error(error));
          } else {
            diagnostics.finish(null, result);
            job.resolve(result);
          }
        };
        currentWorker.onerror = event => {
          if (state.worker !== currentWorker) return;
          const details = describeWorkerErrorEvent(event);
          const error = new Error(details || 'Search worker failed.');
          diagnostics.finish(error.message);
          state.worker = null;
          currentWorker.terminate();
          releaseBlobUrl();
          for (const job of state.jobs.values()) job.reject(error);
          state.jobs.clear();
        };
        return state.worker;
      } catch (error) {
        disable(error);
        return null;
      }
    }

    async function run(type, payload, options = {}, {
      getVariantSettings,
      getActiveHierarchyPhase,
    } = {}) {
      const worker = await ensure();
      if (!worker) throw new Error('Search worker unavailable.');

      const id = ++state.jobId;
      const variantSettings = getVariantSettings?.();
      const workerPayload = withVariantSettings(payload, variantSettings);
      diagnostics.begin(
        type,
        diagnosticsPayload(workerPayload, options, getActiveHierarchyPhase?.()),
      );
      return new Promise((resolve, reject) => {
        state.jobs.set(id, {
          resolve,
          reject,
          onProgress: progress => {
            diagnostics.update(progress);
            options.onProgress?.(progress);
          },
        });
        try {
          onProgressActivity?.();
          worker.postMessage({ id, type, payload: workerPayload });
        } catch (error) {
          state.jobs.delete(id);
          diagnostics.finish(error);
          reject(error);
        }
      });
    }

    return { releaseBlobUrl, disable, ensure, run };
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
    createSearchWorkerLifecycle,
  };
})(window);
