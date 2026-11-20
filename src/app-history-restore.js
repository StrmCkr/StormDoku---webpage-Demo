/* Restore undo, redo, and solution-preview snapshots into live app state. */
(function installHistoryRestore(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state, restorePlayerSolveBackups, showFixedInVantageEl, solutionStepsPanelEl }) {
    function restoreVisualState(snapshot) {
      state.originalPuzzle = [...(snapshot.originalPuzzle || state.originalPuzzle)];
      state.puzzle = [...snapshot.puzzle];
      state.promotedValues = [...snapshot.promotedValues];
      state.cand = core.cloneCandidates(snapshot.cand);
      state.solution = Array.isArray(snapshot.solution) ? [...snapshot.solution] : null;
      state.activeStep = snapshot.activeStep;
      state.lastRemoved = (snapshot.lastRemoved || []).map(item => ({ ...item }));
      state.promotionQueue = (snapshot.promotionQueue || []).map(item => ({ ...item }));

      const visual = snapshot.visual || {};
      state.pomReport = visual.pomReport || null;
      state.alsReport = visual.alsReport || null;
      state.alsLinkReport = visual.alsLinkReport || null;
      state.alsDofReport = visual.alsDofReport || null;
      state.alsDofChainReport = visual.alsDofChainReport || null;
      state.alsHydraReport = visual.alsHydraReport || null;
      state.ahsHydraReport = visual.ahsHydraReport || null;
      state.alcHydraReport = visual.alcHydraReport || null;
      state.selectedAlsHydraIndex = visual.selectedAlsHydraIndex ?? null;
      state.selectedHydraFamily = visual.selectedHydraFamily ?? null;
      state.ahsReport = visual.ahsReport || null;
      state.ahsDofReport = visual.ahsDofReport || null;
      state.ahsDofChainReport = visual.ahsDofChainReport || null;
      state.strongLinkReport = visual.strongLinkReport || null;
      state.fishReport = visual.fishReport || null;
      state.boxLineReport = visual.boxLineReport || null;
      state.selectedBoxLineIndex = visual.selectedBoxLineIndex ?? null;
      state.nakedSubsetReport = visual.nakedSubsetReport || null;
      state.hiddenSubsetReport = visual.hiddenSubsetReport || null;
      state.chainReport = visual.chainReport || null;
      state.alsSearchFamily = visual.alsSearchFamily || null;
      state.selectedAlsDof = visual.selectedAlsDof ?? null;
      state.selectedAlsDofIndex = visual.selectedAlsDofIndex ?? null;
      state.selectedAlsDofSource = visual.selectedAlsDofSource || 'net';
      state.selectedAlsId = visual.selectedAlsId ?? null;
      state.openAlsSizeGroups.clear();
      for (const value of visual.openAlsSizeGroups || []) state.openAlsSizeGroups.add(value);
      state.selectedAhsDof = visual.selectedAhsDof ?? null;
      state.selectedAhsDofNetIndex = visual.selectedAhsDofNetIndex ?? null;
      state.selectedAhsDofChainIndex = visual.selectedAhsDofChainIndex ?? null;
      state.selectedAhsId = visual.selectedAhsId ?? null;
      state.openAhsSizeGroups.clear();
      for (const value of visual.openAhsSizeGroups || []) state.openAhsSizeGroups.add(value);
      state.selectedStrongLinkType = visual.selectedStrongLinkType ?? null;
      state.selectedStrongLinkIndex = visual.selectedStrongLinkIndex ?? null;
      state.selectedFishCategory = visual.selectedFishCategory ?? null;
      state.selectedFishSize = visual.selectedFishSize ?? null;
      state.selectedFishKey = visual.selectedFishKey ?? null;
      state.selectedNakedSubsetSize = visual.selectedNakedSubsetSize ?? null;
      state.selectedNakedSubsetKey = visual.selectedNakedSubsetKey ?? null;
      state.selectedHiddenSubsetSize = visual.selectedHiddenSubsetSize ?? null;
      state.selectedHiddenSubsetKey = visual.selectedHiddenSubsetKey ?? null;
      state.selectedChainIndex = visual.selectedChainIndex ?? null;
      state.gridView = visual.gridView || 'RC';
      state.showFixedInVantage = Boolean(visual.showFixedInVantage);
      showFixedInVantageEl.checked = state.showFixedInVantage;
      state.selectedPlayerCell = visual.selectedPlayerCell ?? null;
      state.selectedPlayerDigit = visual.selectedPlayerDigit ?? null;
      restorePlayerSolveBackups(visual.playerSolveBackups);
      if (solutionStepsPanelEl) {
        solutionStepsPanelEl.open = Boolean(visual.solutionStepsPanelOpen);
      }
    }

    function restoreState(snapshot) {
      restoreVisualState(snapshot);
      state.cycle = snapshot.cycle;
      state.logEntries = snapshot.logEntries.map(entry => ({ ...entry }));
      state.ratingReport = snapshot.ratingReport ? { ...snapshot.ratingReport } : null;
    }

    return { restoreVisualState, restoreState };
  }

  app.historyRestore = { create };
})(window);
