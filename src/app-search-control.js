/* StormDoku search cancellation and epoch-safe scheduling. */
(function installSearchControl(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, actions }) {
    function cancellationError(reason = 'Search cancelled.') {
      const error = new Error(reason);
      error.name = 'AbortError';
      return error;
    }

    function isCancelled(error) {
      return error?.name === 'AbortError';
    }

    function schedule(callback, delay = 20) {
      const epoch = state.epoch;
      setTimeout(() => {
        if (epoch === state.epoch) void callback();
      }, delay);
    }

    function cancelActiveSearches(reason = 'Search cancelled.') {
      state.epoch += 1;
      state.advanceGenerationToken();
      const error = cancellationError(reason);
      actions.finishDiagnostics(reason);
      actions.cancelGenerator(error);
      const worker = state.worker;
      state.worker = null;
      if (worker) worker.terminate();
      actions.releaseWorkerBlobUrl();
      for (const job of state.jobs.values()) job.reject(error);
      state.jobs.clear();
      actions.setBusy(false);
    }

    function stopActiveSearch() {
      if (!state.busy) return;
      cancelActiveSearches('Search stopped.');
      actions.render();
      actions.setStatus('Stopped. Current grid and completed steps kept.', 'warn');
    }

    return { cancellationError, isCancelled, schedule, cancelActiveSearches, stopActiveSearch };
  }

  app.searchControl = { create };
})(window);
