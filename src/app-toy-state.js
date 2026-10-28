/* StormDoku Toy state transformations. */
(function installToyState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function mapCellState(state, permutation, mapValues, mapCandidates) {
    return {
      ...state,
      originalPuzzle: mapValues(state.originalPuzzle, permutation),
      puzzle: mapValues(state.puzzle, permutation),
      promotedValues: mapValues(state.promotedValues, permutation),
      cand: mapCandidates(state.cand, permutation),
      solution: state.solution ? mapValues(state.solution, permutation) : state.solution
    };
  }

  function exchangeDigitState(state, first, second, remapDigit, remapDigitSet) {
    const remapValues = values => values?.map(value => remapDigit(value, first, second));
    const selectedDigits = remapDigitSet(state.activeDigitHighlights, first, second);
    const activeDigitHighlights = new Set(selectedDigits);
    const pomFishSettings = {
      ...state.pomFishSettings,
      digits: remapDigitSet(state.pomFishSettings.digits, first, second)
    };
    return {
      ...state,
      originalPuzzle: remapValues(state.originalPuzzle),
      puzzle: remapValues(state.puzzle),
      promotedValues: remapValues(state.promotedValues),
      cand: state.cand.map(values => remapValues(values).sort((left, right) => left - right)),
      solution: state.solution ? remapValues(state.solution) : state.solution,
      activeDigitHighlights,
      pomFishSettings
    };
  }

  app.toyState = { mapCellState, exchangeDigitState };
})(window);
