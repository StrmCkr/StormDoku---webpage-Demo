/* StormDoku board rendering coordinator. */
(function installBoardRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, boardContainerView, boardCellView, boardCandidateView, boardOverlayView,
    vantageView, extractGridViewSlice, documentRef = global.document,
    getCurrentHighlights, getGridView, getActiveStep, getPuzzle, getOriginalPuzzle,
    getPromotedValues, getCandidates, getVariantSettings, getShowFixedInVantage,
    vantageCellFromSlot, atomKey, digitHighlightIsVisible,
    candidateSizeFilterDigitMatches, cellHasCandidate, applyCandidateSizeFilterStyle,
    applyMultiColoringStyle, applyAlsColorVars, applyAhsColorVars, getSelectedPlayerCell,
    bindPlayerDigitElement, markFor, chainCandidateIsVisible,
    renderVantageChainOverlay, renderHydraAlsDofOverlay, renderAlsDofOverlay,
    renderVantageStrongLinkOverlay,
  }) {
    function renderVantageBoard(view, highlights) {
      vantageView.renderBoard({
        view,
        slice: extractGridViewSlice(view),
        highlights,
        boardEl,
        cand: getCandidates(),
        puzzle: getPuzzle(),
        showFixed: getShowFixedInVantage(),
        vantageCellFromSlot,
        atomKey,
        digitHighlightIsVisible,
        candidateSizeFilterDigitMatches,
        cellHasCandidate,
        applyCandidateSizeFilterStyle,
        applyMultiColoringStyle,
        applyAlsColorVars,
        applyAhsColorVars,
        selectedPlayerCell: getSelectedPlayerCell(),
        bindPlayerDigitElement,
        renderVantageChainOverlay,
        renderHydraAlsDofOverlay,
        renderAlsDofOverlay,
        renderVantageStrongLinkOverlay,
      });
    }

    function render() {
      const gridView = getGridView();
      boardContainerView.prepare(gridView);
      const highlights = getCurrentHighlights();
      if (gridView !== 'RC') {
        renderVantageBoard(gridView, highlights);
        return;
      }

      const originalPuzzle = getOriginalPuzzle();
      const promotedValues = getPromotedValues();
      const puzzle = getPuzzle();
      const variantSettings = getVariantSettings();
      const cand = getCandidates();
      for (let cell = 0; cell < 81; cell++) {
        const el = documentRef.createElement('div');
        const strongLinkPartition = boardCellView.decorate({
          el, cell, originalPuzzle, promotedValues, puzzle, variantSettings, highlights,
        });

        if (puzzle[cell]) {
          el.textContent = String(puzzle[cell]);
        } else {
          const marks = boardCandidateView.render({
            cell,
            highlights,
            cand,
            strongLinkPartition,
            cellHasCandidate,
            digitHighlightIsVisible,
            candidateSizeFilterDigitMatches,
            applyCandidateSizeFilterStyle,
            markFor,
            bindPlayerDigitElement,
            applyAlsColorVars,
            applyAhsColorVars,
            applyMultiColoringStyle,
            chainCandidateIsVisible,
          });
          el.appendChild(marks);
        }
        boardEl.appendChild(el);
      }
      boardOverlayView.render({ highlights, activeStep: getActiveStep() });
    }

    return { render };
  }

  app.boardRenderer = { create };
})(window);
