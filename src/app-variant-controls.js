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

  function cellClasses(cell, settings = {}) {
    const classes = [];
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    if (settings.diagonal && cell % 10 === 0) classes.push('variant-diagonal-cell');
    if (settings.antiDiagonal && row + col === 8) classes.push('variant-anti-diagonal-cell');
    if (settings.windoku) {
      const inWindokuRegion = (row >= 1 && row <= 3 || row >= 5 && row <= 7)
        && (col >= 1 && col <= 3 || col >= 5 && col <= 7);
      if (inWindokuRegion) classes.push('variant-windoku-cell');
    }
    return classes;
  }

  app.variantControls = { create, cellClasses };
})(window);
