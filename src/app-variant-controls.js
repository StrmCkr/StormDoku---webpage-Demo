/* StormDoku variation checkbox synchronization. */
(function installVariantControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ settings, inputs }) {
    function read() {
      for (const [key, input] of Object.entries(inputs)) {
        settings[key] = Boolean(input?.checked);
      }
      return settings;
    }

    function write() {
      for (const [key, input] of Object.entries(inputs)) {
        if (input) input.checked = Boolean(settings[key]);
      }
      return settings;
    }

    return { read, write };
  }

  app.variantControls = { create };
})(window);
