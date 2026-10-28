/* StormDoku Toy action orchestration. */
(function installToyActions(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(dependencies) {
    const {
      isBusy, leaveHistoryPreview, snapshotState, resetAnalysis,
      clearAutomorphResults, clearMiniLex, clearMinimizerResults,
      resetPlayerState, updateInput, pushUndo, clearRedo,
      setStatus, render,
      cellPermutation, preservesVariants, variantMessage,
      mapCellState, mapValues, mapCandidates,
      exchangeDigitState, remapDigit, remapDigitSet,
      getCellState, setCellState
    } = dependencies;

    function applyStateChange(label, transform) {
      if (isBusy()) return false;
      leaveHistoryPreview();
      const before = snapshotState();
      try {
        transform();
      } catch (error) {
        setStatus(`${label} could not be applied.`, 'warn');
        return false;
      }

      resetAnalysis();
      clearAutomorphResults();
      clearMiniLex();
      clearMinimizerResults();
      resetPlayerState();
      updateInput();
      pushUndo(before);
      clearRedo();
      setStatus(`${label} applied. Analysis reports were cleared for the transformed grid.`, 'ok');
      render();
      return true;
    }

    function applyCellTransform(label, mapper) {
      const permutation = cellPermutation(mapper);
      if (!preservesVariants(permutation)) {
        setStatus(variantMessage(), 'warn');
        return false;
      }
      return applyStateChange(label, () => {
        setCellState(mapCellState(getCellState(), permutation, mapValues, mapCandidates));
      });
    }

    function applyDigitExchange(first, second) {
      if (first === second) return false;
      return applyStateChange(`Digits ${first} and ${second} exchanged`, () => {
        setCellState(exchangeDigitState(getCellState(), first, second, remapDigit, remapDigitSet));
      });
    }

    return { applyStateChange, applyCellTransform, applyDigitExchange };
  }

  app.toyActions = { create };
})(window);
