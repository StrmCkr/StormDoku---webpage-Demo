/* StormDoku hosted puzzle-generator worker boundary. */
(function installGeneratorRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  const workerRuntime = app.workerRuntime;
  let activeWorker = null;
  let activeReject = null;

  function run(givens, variantSettings) {
    return new Promise((resolve, reject) => {
      let worker;
      try {
        worker = workerRuntime.createWorker(
          './src/generator-worker.js?v=20261027-15',
          { type: 'classic' },
        );
      } catch (error) {
        reject(error);
        return;
      }

      activeWorker = worker;
      activeReject = reject;
      const finish = (callback, value) => {
        if (activeWorker === worker) activeWorker = null;
        if (activeReject === reject) activeReject = null;
        worker.terminate();
        callback(value);
      };
      worker.onmessage = event => {
        const data = event.data || {};
        if (data.error) finish(reject, new Error(data.error));
        else finish(resolve, data.result);
      };
      worker.onerror = event => {
        const details = [
          event.message,
          event.filename && `(${event.filename})`,
          event.lineno && `line ${event.lineno}`,
          event.colno && `column ${event.colno}`,
        ].filter(Boolean).join(' ');
        finish(reject, new Error(details || 'Puzzle generator worker failed.'));
      };
      worker.postMessage({ givens, variantSettings: { ...variantSettings } });
    });
  }

  function cancel(error) {
    const worker = activeWorker;
    const reject = activeReject;
    activeWorker = null;
    activeReject = null;
    if (worker) worker.terminate();
    if (reject) reject(error);
  }

  app.generatorRuntime = { run, cancel };
})(window);
