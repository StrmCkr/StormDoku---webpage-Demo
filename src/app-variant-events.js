/* StormDoku variation checkbox event wiring. */
(function installVariantEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ inputs, settings, apply }) {
    for (const [key, input] of Object.entries(inputs)) {
      input.addEventListener('change', () => {
        settings[key] = input.checked;
        apply();
      });
    }
  }

  app.variantEvents = { install };
})(window);
