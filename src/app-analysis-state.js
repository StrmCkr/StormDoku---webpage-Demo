/* Analysis selection reset policy. */
(function installAnalysisState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function resetAnalysisSelections({ set, clearAlsSizeGroups, clearAhsSizeGroups } = {}) {
    const nullableSelections = [
      'selectedMslsIndex',
      'selectedSimpleColoringIndex',
      'selectedThreeDMedusaIndex',
      'selectedThreeDMedusaMultiIndex',
      'selectedMultiColoringIndex',
      'selectedChromaticGraphIndex',
      'selectedChromaticAlsGraphIndex',
      'selectedBoxLineIndex',
      'selectedUniquenessIndex',
      'selectedUniquenessType2Index',
      'selectedUniquenessType3Index',
      'selectedUniquenessType3Family',
      'selectedUniquenessType',
      'selectedAlsDof',
      'selectedAlsDofIndex',
      'selectedAhsDof',
      'selectedAhsDofNetIndex',
      'selectedAhsDofChainIndex',
      'selectedAlsId',
      'selectedAhsId',
      'selectedStrongLinkType',
      'selectedStrongLinkIndex',
      'selectedFishCategory',
      'selectedFishSize',
      'selectedFishKey',
      'selectedNakedSubsetSize',
      'selectedNakedSubsetKey',
      'selectedHiddenSubsetSize',
      'selectedHiddenSubsetKey',
      'selectedChainIndex',
    ];
    for (const key of nullableSelections) set?.(key, null);
    set?.('selectedAlsDofSource', 'net');
    clearAlsSizeGroups?.();
    clearAhsSizeGroups?.();
  }

  app.analysisState = { resetAnalysisSelections };
})(window);
