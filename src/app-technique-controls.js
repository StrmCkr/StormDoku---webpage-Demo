/* StormDoku solver-technique checkbox collection. */
(function installTechniqueControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(elements) {
    function currentTypes(override = null) {
      if (override) return new Set(override);
      return new Set([...elements.entries()]
        .filter(([, element]) => element?.checked)
        .map(([type]) => type));
    }
    return { currentTypes };
  }

  app.techniqueControls = { create };
})(window);
