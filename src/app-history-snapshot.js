/* Build undo, redo, and solution-preview snapshots. */
(function installHistorySnapshot(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, getContext }) {
    function snapshotVisualState() {
      const state = getContext();
      return {
        originalPuzzle: [...state.originalPuzzle],
        puzzle: [...state.puzzle],
        promotedValues: [...state.promotedValues],
        cand: core.cloneCandidates(state.cand),
        solution: state.solution ? [...state.solution] : null,
        activeStep: state.activeStep,
        lastRemoved: state.lastRemoved.map(item => ({ ...item })),
        promotionQueue: state.promotionQueue.map(item => ({ ...item })),
        visual: {
          pomReport: state.pomReport,
          alsReport: state.alsReport,
          alsLinkReport: state.alsLinkReport,
          alsDofReport: state.alsDofReport,
          alsDofChainReport: state.alsDofChainReport,
          alsHydraReport: state.alsHydraReport,
          ahsHydraReport: state.ahsHydraReport,
          alcHydraReport: state.alcHydraReport,
          selectedAlsHydraIndex: state.selectedAlsHydraIndex,
          selectedHydraFamily: state.selectedHydraFamily,
          ahsReport: state.ahsReport,
          ahsDofReport: state.ahsDofReport,
          ahsDofChainReport: state.ahsDofChainReport,
          strongLinkReport: state.strongLinkReport,
          fishReport: state.fishReport,
          boxLineReport: state.boxLineReport,
          selectedBoxLineIndex: state.selectedBoxLineIndex,
          nakedSubsetReport: state.nakedSubsetReport,
          hiddenSubsetReport: state.hiddenSubsetReport,
          chainReport: state.chainReport,
          alsSearchFamily: state.alsSearchFamily,
          selectedAlsDof: state.selectedAlsDof,
          selectedAlsDofIndex: state.selectedAlsDofIndex,
          selectedAlsDofSource: state.selectedAlsDofSource,
          selectedAlsId: state.selectedAlsId,
          openAlsSizeGroups: [...state.openAlsSizeGroups],
          selectedAhsDof: state.selectedAhsDof,
          selectedAhsDofNetIndex: state.selectedAhsDofNetIndex,
          selectedAhsDofChainIndex: state.selectedAhsDofChainIndex,
          selectedAhsId: state.selectedAhsId,
          openAhsSizeGroups: [...state.openAhsSizeGroups],
          selectedStrongLinkType: state.selectedStrongLinkType,
          selectedStrongLinkIndex: state.selectedStrongLinkIndex,
          selectedFishCategory: state.selectedFishCategory,
          selectedFishSize: state.selectedFishSize,
          selectedFishKey: state.selectedFishKey,
          selectedNakedSubsetSize: state.selectedNakedSubsetSize,
          selectedNakedSubsetKey: state.selectedNakedSubsetKey,
          selectedHiddenSubsetSize: state.selectedHiddenSubsetSize,
          selectedHiddenSubsetKey: state.selectedHiddenSubsetKey,
          selectedChainIndex: state.selectedChainIndex,
          gridView: state.gridView,
          showFixedInVantage: state.showFixedInVantage,
          selectedPlayerCell: state.selectedPlayerCell,
          selectedPlayerDigit: state.selectedPlayerDigit,
          playerSolveBackups: state.clonePlayerSolveBackups(),
          solutionStepsPanelOpen: state.solutionStepsPanelOpen,
        },
      };
    }

    function snapshotState() {
      const state = getContext();
      return {
        ...snapshotVisualState(),
        cycle: state.cycle,
        logEntries: state.logEntries.map(entry => ({ ...entry })),
        ratingReport: state.ratingReport ? { ...state.ratingReport } : null,
      };
    }

    return { snapshotVisualState, snapshotState };
  }

  app.historySnapshot = { create };
})(window);
