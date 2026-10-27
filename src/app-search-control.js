/* StormDoku search cancellation and epoch-safe scheduling. */
(function installSearchControl(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getEpoch }) {
    function cancellationError(reason = 'Search cancelled.') {
      const error = new Error(reason);
      error.name = 'AbortError';
      return error;
    }

    function isCancelled(error) {
      return error?.name === 'AbortError';
    }

    function schedule(callback, delay = 20) {
      const epoch = getEpoch();
      setTimeout(() => {
        if (epoch === getEpoch()) void callback();
      }, delay);
    }

    return { cancellationError, isCancelled, schedule };
  }

  app.searchControl = { create };
})(window);
