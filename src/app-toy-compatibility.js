/* StormDoku Toy transformation compatibility checks. */
(function installToyCompatibility(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function preservesActiveVariants(permutation, core, settings) {
    const sameSet = (left, right) => left.size === right.size && [...left].every(value => right.has(value));
    const unitKey = unit => unit.slice().sort((a, b) => a - b).join(',');
    const activeUnitKinds = ['diagonal', 'antiDiagonal', 'windoku'].filter(name => settings[name]);
    for (const kind of activeUnitKinds) {
      const original = new Set((core.VARIANT_UNITS[kind] || []).map(unitKey));
      const transformed = new Set((core.VARIANT_UNITS[kind] || []).map(unit => unitKey(unit.map(cell => permutation[cell]))));
      if (!sameSet(original, transformed)) return false;
    }
    const relationPairs = predicate => {
      const pairs = new Set();
      for (let first = 0; first < 81; first++) {
        const firstRow = Math.floor(first / 9); const firstColumn = first % 9;
        for (let second = first + 1; second < 81; second++) {
          const secondRow = Math.floor(second / 9); const secondColumn = second % 9;
          if (predicate(Math.abs(firstRow - secondRow), Math.abs(firstColumn - secondColumn))) pairs.add(`${first}:${second}`);
        }
      }
      return pairs;
    };
    const mappedPairs = pairs => new Set([...pairs].map(pair => {
      const [first, second] = pair.split(':').map(Number); const mapped = [permutation[first], permutation[second]].sort((a, b) => a - b);
      return `${mapped[0]}:${mapped[1]}`;
    }));
    const relations = [];
    if (settings.antiKing) relations.push((dr, dc) => dr === 1 && dc === 1);
    if (settings.antiKnight) relations.push((dr, dc) => (dr === 1 && dc === 2) || (dr === 2 && dc === 1));
    if (settings.nonConsecutive) relations.push((dr, dc) => (dr === 1 && dc === 0) || (dr === 0 && dc === 1));
    for (const relation of relations) {
      const original = relationPairs(relation);
      if (!sameSet(original, mappedPairs(original))) return false;
    }
    return true;
  }
  function variantTransformMessage(settings) {
    const active = Object.entries(settings).filter(([, enabled]) => enabled).map(([name]) => name);
    return active.length ? `The transformation is not compatible with active variations: ${active.join(', ')}.`
      : 'The transformation is not a valid Sudoku permutation.';
  }
  app.toyCompatibility = { preservesActiveVariants, variantTransformMessage };
})(window);
