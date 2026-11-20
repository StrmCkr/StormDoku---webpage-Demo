/* Restore the editable puzzle and clear all state tied to its previous grid. */
(function installPuzzleReset(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state, actions }) {
    function reset(
      message = 'Candidates reset from the current puzzle.',
      startingCandidates = null,
      nextRating = null,
    ) {
      actions.leaveHistoryPreview();
      actions.clearToyAutomorphResults();
      actions.clearToyMiniLex();
      actions.clearToyMinimizerResults();
      actions.setManualMode(false, false);
      state.puzzle = [...state.originalPuzzle];
      state.promotedValues = new Array(81).fill(0);
      state.cand = startingCandidates
        ? core.cloneCandidates(startingCandidates)
        : core.allCandidates(state.puzzle);
      // Keep every technique panel and selection on the same reset path.
      actions.resetAnalysisAfterPlayerEdit();
      state.cycle = 0;
      state.activeStep = null;
      state.lastRemoved = [];
      state.promotionQueue = [];
      state.logEntries = [];
      state.ratingReport = nextRating;
      state.pomReport = null;
      state.alsReport = null;
      state.alsLinkReport = null;
      state.alsDofReport = null;
      state.alsDofChainReport = null;
      state.alsHydraReport = null;
      state.ahsHydraReport = null;
      state.alcHydraReport = null;
      state.selectedAlsHydraIndex = null;
      state.selectedHydraFamily = null;
      state.ahsReport = null;
      state.alcXzReport = null;
      state.ahsLinkReport = null;
      state.mslsReport = null;
      state.selectedAlsDof = null;
      state.selectedAlsDofIndex = null;
      state.selectedAlsDofSource = 'net';
      state.selectedAlsId = null;
      state.openAlsSizeGroups.clear();
      state.selectedAhsDof = null;
      state.selectedAhsDofNetIndex = null;
      state.selectedAhsDofChainIndex = null;
      state.selectedAhsId = null;
      state.openAhsSizeGroups.clear();
      state.strongLinkReport = null;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.simpleColoringReport = null;
      state.selectedSimpleColoringIndex = null;
      state.threeDMedusaReport = null;
      state.selectedThreeDMedusaIndex = null;
      state.threeDMedusaMultiReport = null;
      state.selectedThreeDMedusaMultiIndex = null;
      state.multiColoringReport = null;
      state.selectedMultiColoringIndex = null;
      state.selectedThreeDMedusaMultiIndex = null;
      state.fishReport = null;
      state.selectedFishCategory = null;
      state.selectedFishSize = null;
      state.selectedFishKey = null;
      state.nakedSubsetReport = null;
      state.selectedNakedSubsetSize = null;
      state.selectedNakedSubsetKey = null;
      state.hiddenSubsetReport = null;
      state.selectedHiddenSubsetSize = null;
      state.selectedHiddenSubsetKey = null;
      state.chainReport = null;
      actions.closeSolutionPanel();
      state.selectedPlayerCell = null;
      state.selectedPlayerDigit = null;
      state.playerPromotionMode = false;
      state.playerSolveBackups = new Map();
      state.undoStack = [];
      state.redoStack = [];
      actions.setStatus(message, 'ok');
      actions.render();
    }

    return { reset };
  }

  app.puzzleReset = { create };
})(window);
