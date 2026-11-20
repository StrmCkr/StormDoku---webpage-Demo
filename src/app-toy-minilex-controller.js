/* Mini-lex canonicalization workflow and view updates. */
(function installToyMiniLexController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    elements,
    getSource,
    getColumnMaps,
    canonicalize,
    permutations,
    orientedRows,
    rowMasks,
    bestRowMaps,
    compare,
    normalize,
    clearView,
    renderView,
  }) {
    function clear() {
      clearView(elements);
    }

    function build() {
      const comparison = getSource();
      const values = comparison.source;
      const { columnMaps } = getColumnMaps();
      const best = canonicalize(values, columnMaps, permutations([0, 1, 2]), {
        orientedRows,
        rowMasks,
        bestRowMaps,
        compare,
        normalize,
      });
      if (!best) {
        clear();
        return null;
      }
      const result = {
        key: best.key,
        values: best.values,
        label: best.orientation ? 'Transpose + full structural search' : 'Full structural search',
        sourceMode: comparison.mode,
        transformation: best.transformation,
      };
      renderView(elements, result);
      return result;
    }

    return { clear, build };
  }

  app.toyMiniLexController = { create };
})(window);
