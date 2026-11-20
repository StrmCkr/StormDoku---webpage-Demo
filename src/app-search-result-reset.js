/* Clear stale search results after applying a move. */
(function installSearchResultReset(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ state, elements }) {
    function clearAfterApply(preserveColouringMethod = null) {
      for (const key of [
        'pomReport', 'alsReport', 'alsLinkReport', 'alsDofReport', 'alsDofChainReport',
        'alsHydraReport', 'ahsHydraReport', 'alcHydraReport', 'selectedAlsHydraIndex',
        'selectedHydraFamily', 'ahsReport', 'ahsLinkReport', 'ahsDofReport', 'ahsDofChainReport',
        'alcXzReport', 'alcXyReport', 'alcChainReport', 'alcDofReport', 'mslsReport',
        'strongLinkReport', 'fishReport', 'boxLineReport', 'nakedSubsetReport',
        'hiddenSubsetReport', 'chainReport', 'alsSearchFamily', 'ahsSearchFamily',
        'selectedAlsId', 'selectedAhsId', 'selectedAlsDof', 'selectedAlsDofIndex',
        'selectedAhsDof', 'selectedAhsDofNetIndex', 'selectedAhsDofChainIndex',
        'selectedStrongLinkType', 'selectedStrongLinkIndex', 'selectedFishKey',
        'selectedNakedSubsetKey', 'selectedHiddenSubsetKey', 'selectedChainIndex',
        'selectedMslsIndex', 'uniquenessReport', 'uniquenessExtendedType1Report', 'uniquenessExtendedType2Report', 'selectedUniquenessIndex',
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
        'uniquenessType2Report', 'selectedUniquenessType2Index', 'selectedUniquenessType5Index', 'selectedUniquenessType',
        'uniquenessType3Report', 'uniquenessType3XzReport', 'uniquenessType3XyReport',
        'uniquenessType3ChainReport', 'selectedUniquenessType3Index',
        'uniquenessType4Report', 'selectedUniquenessType4Index',
        'uniquenessExtendedType4Report', 'selectedUniquenessExtendedType4Index',
        'uniquenessExtendedType6Report', 'selectedUniquenessExtendedType6Index',
        'uniquenessExtendedType7Report', 'selectedUniquenessExtendedType7Index',
        'uniquenessExtendedType8Report', 'selectedUniquenessExtendedType8Index',
        'uniquenessExtendedType9Report', 'selectedUniquenessExtendedType9Index',
        'uniquenessType6Report', 'selectedUniquenessType6Index',
        'uniquenessType7Report', 'selectedUniquenessType7Index',
        'uniquenessType8Report', 'selectedUniquenessType8Index',
        'uniquenessType9Report', 'selectedUniquenessType9Index',
        'selectedUniquenessType3Family',
      ]) state[key] = null;

      if (preserveColouringMethod !== 'simple') state.simpleColoringReport = null;
      if (preserveColouringMethod !== 'medusa') state.threeDMedusaReport = null;
      if (preserveColouringMethod !== 'medusaMulti') state.threeDMedusaMultiReport = null;
      if (preserveColouringMethod !== 'multi') state.multiColoringReport = null;
      if (preserveColouringMethod !== 'simple') state.selectedSimpleColoringIndex = null;
      if (preserveColouringMethod !== 'medusa') state.selectedThreeDMedusaIndex = null;
      if (preserveColouringMethod !== 'medusaMulti') state.selectedThreeDMedusaMultiIndex = null;
      if (preserveColouringMethod !== 'multi') state.selectedMultiColoringIndex = null;

      // Dedicated auxiliary result panes are reset with the same apply action.
      for (const [element, message] of [
        [elements.als, 'No dedicated ALS search has been run.'],
        [elements.ahs, 'No AHS search has been run.'],
        [elements.alc, 'No ALC search has been run.'],
        [elements.uniqueness, 'No Unique Rectangle search has been run.'],
        [elements.bug, 'No Bivalve Universal Grave search has been run.'],
        [elements.reverseBug, 'No Reverse-BUG search has been run.'],
        [elements.mug, 'No Multivalve Universal Grave search has been run.'],
        [elements.pug, 'No Permeable Universal Grave search has been run.'],
        [elements.uniquenessExtended, 'No Extended Unique Rectangle search has been run.'],
      ]) {
        if (!element) continue;
        element.textContent = message;
      }
    }

    return { clearAfterApply };
  }

  app.searchResultReset = { create };
})(window);
