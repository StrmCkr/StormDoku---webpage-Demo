/* Pure runtime helpers for the Toys section. */
(function installToyRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function buildMiniLex(values, dependencies) {
    const { columnMaps, permutations, canonicalize, orientedRows, rowMasks, bestRowMaps, compare, normalize } = dependencies;
    const best = canonicalize(values, columnMaps, permutations, {
      orientedRows,
      rowMasks,
      bestRowMaps,
      compare,
      normalize,
    });
    if (!best) return null;
    return {
      key: best.key,
      values: best.values,
      label: best.orientation ? 'Transpose + full structural search' : 'Full structural search',
      transformation: best.transformation,
    };
  }

  app.toyRuntime = { buildMiniLex };
})(window);
