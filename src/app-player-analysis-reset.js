/* Clear solver reports and selections after a manual player edit. */
(function installPlayerAnalysisReset(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, resetSelections, closeSolutionPanel, clearResultPanes }) {
    function reset() {
      state.cycle = 0;
      state.activeStep = null;
      state.lastRemoved = [];
      state.promotionQueue = [];
      state.logEntries = [];
      state.ratingReport = null;
      for (const key of [
        'pomReport', 'alsReport', 'alsLinkReport', 'alsDofReport', 'alsDofChainReport',
        'ahsReport', 'alcXzReport', 'alcXyReport', 'alcChainReport', 'alcDofReport',
        'ahsDofReport', 'ahsDofChainReport', 'ahsLinkReport', 'mslsReport',
        'strongLinkReport', 'simpleColoringReport', 'threeDMedusaReport',
        'threeDMedusaMultiReport', 'multiColoringReport', 'chromaticGraphReport',
        'chromaticAlsGraphReport', 'fishReport', 'boxLineReport', 'nakedSubsetReport',
        'hiddenSubsetReport', 'chainReport', 'alsSearchFamily', 'ahsSearchFamily',
        'alsHydraReport', 'ahsHydraReport', 'alcHydraReport', 'selectedAlsHydraIndex',
        'selectedHydraFamily', 'uniquenessReport', 'uniquenessExtendedType1Report', 'uniquenessExtendedType2Report', 'uniquenessType2Report',
        'selectedUniquenessExtendedType1Index',
        'selectedUniquenessExtendedType2Index',
        'bugReports',
        'reverseBugReports',
        'mugReports',
        'pugReports',
        'uniquenessExtendedType3Report',
        'uniquenessExtendedType3XzReport',
        'uniquenessExtendedType3XyReport',
        'uniquenessExtendedType3ChainReport',
        'uniquenessExtendedType4Report', 'selectedUniquenessExtendedType4Index',
        'uniquenessExtendedType6Report', 'selectedUniquenessExtendedType6Index',
        'uniquenessExtendedType7Report', 'selectedUniquenessExtendedType7Index',
        'uniquenessExtendedType8Report', 'selectedUniquenessExtendedType8Index',
        'uniquenessExtendedType9Report', 'selectedUniquenessExtendedType9Index',
        'uniquenessType3Report',
        'uniquenessType3XzReport',
        'uniquenessType3XyReport',
        'uniquenessType7Report',
        'uniquenessType9Report',
      ]) state[key] = null;
      resetSelections();
      clearResultPanes?.();
      closeSolutionPanel();
    }

    return { reset };
  }

  app.playerAnalysisReset = { create };
})(window);
