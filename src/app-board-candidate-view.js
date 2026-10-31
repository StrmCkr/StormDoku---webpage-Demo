/* StormDoku candidate-mark presentation. */
(function installBoardCandidateView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document }) {
    function render({
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
    }) {
      const marks = documentRef.createElement('div');
      marks.className = 'marks';
      for (let digit = 1; digit <= 9; digit += 1) {
        const mark = documentRef.createElement('span');
        mark.className = 'mark';
        const atomKey = `${cell}:${digit}`;
        const isAlsDofElim = highlights.alsDofElimMarks.has(atomKey);
        const isAhsDofElim = highlights.ahsDofRecordElimMarks.has(atomKey);
        const isSimpleColoringElim = highlights.simpleColoringElimMarks.has(atomKey);
        const isMultiColoringElim = highlights.multiColoringElimMarks.has(atomKey);
        const isThreeDMedusaElim = highlights.threeDMedusaElimMarks.has(atomKey);
        const isThreeDMedusaInvalid = highlights.threeDMedusaInvalidMarks.has(atomKey);
        const isElim = highlights.removedMarks.has(atomKey) || isAlsDofElim || isAhsDofElim || isSimpleColoringElim
          || isMultiColoringElim || isThreeDMedusaElim;
        const isSetDigit = highlights.isSubset && highlights.patternDigits.has(digit) && highlights.vertices.has(cell);
        const isAlsDofClauseDigit = highlights.alsDofClauseDigit === digit
          && highlights.alsDofClauseCells.has(cell)
          && cellHasCandidate(cell, digit);
        const isFishVertexDigit = highlights.isFish && highlights.patternDigits.has(digit) && highlights.vertices.has(cell);
        const isFishFinDigit = highlights.isFish && highlights.patternDigits.has(digit)
          && highlights.fins.has(cell) && !highlights.vertices.has(cell);
        const isFishIntersection = highlights.isFish
          && highlights.patternDigits.has(digit)
          && highlights.fishCells.has(cell);
        const isFishBaseIntersection = isFishIntersection
          && (highlights.fishBaseIntersections.has(cell)
            || highlights.fishPeersOfBaseIntersection.has(cell));
        const isFishBase = highlights.isFish
          && highlights.patternDigits.has(digit)
          && highlights.baseCells.has(cell)
          && !highlights.fishCells.has(cell);
        const isFishCover = highlights.isFish
          && highlights.patternDigits.has(digit)
          && highlights.coverCells.has(cell)
          && !highlights.fishCells.has(cell);
        const isFishDoubleCover = isFishCover && highlights.fishDoubleCover.has(cell);
        const isFishTripleCover = isFishCover && highlights.fishTripleCover.has(cell);
        const isFishEndofinDigit = highlights.isFish && highlights.patternDigits.has(digit)
          && highlights.endofins.has(cell);
        const isFishDigit = isFishVertexDigit || isFishFinDigit
          || isFishBase || isFishBaseIntersection || isFishCover;
        const hasCandidate = cellHasCandidate(cell, digit);
        const isChainExplanation = highlights.isChain
          && highlights.chainMarks.has(atomKey);
        const hasChainCandidate = highlights.isChain
          && (chainCandidateIsVisible(cell, digit) || isChainExplanation);
        const isChromaticDigit = highlights.isChromatic
          && highlights.chromaticCells.has(cell)
          && highlights.chromaticDigits.has(digit)
          && hasCandidate;
        const isMslsDigit = highlights.isMsls && highlights.mslsCoverAtoms.has(atomKey);
        const isChainDigit = highlights.isChain && highlights.chainMarks.has(atomKey);
        const isChainXorEntryDigit = highlights.isChain && highlights.chainXorEntryMarks.has(atomKey);
        const isChainXorExitDigit = highlights.isChain && highlights.chainXorExitMarks.has(atomKey);
        const isChainWeakDigit = highlights.isChain && highlights.chainWeakMarks.has(atomKey);
        const isChainAlsDigit = highlights.isChain && highlights.chainAlsMarks.has(atomKey);
        const isChainAhsDigit = highlights.isChain && highlights.chainAhsMarks.has(atomKey);
        const isAlsRecordDigit = highlights.isAlsRecord && highlights.alsRecordMarks.has(atomKey);
        const isAlsDofDigit = highlights.isAlsDof && highlights.alsDofMarks.has(atomKey);
        const isAhsRecordDigit = highlights.isAhsRecord && highlights.ahsRecordMarks.has(atomKey);
        const isAhsDofRecordDigit = highlights.isAhsDof && highlights.ahsDofRecordMarks.has(atomKey);
        const isChainStartDigit = highlights.isChain && highlights.chainStartMarks.has(atomKey);
        const isChainEndDigit = highlights.isChain && highlights.chainEndMarks.has(atomKey);
        const strongLinkPartitionStartDigit = highlights.isStrongLink
          && strongLinkPartition === 'active'
          && (highlights.strongLink.startingDigits || []).includes(digit)
          && cellHasCandidate(cell, digit);
        const strongLinkPartitionEndDigit = highlights.isStrongLink
          && strongLinkPartition === 'linked'
          && (highlights.strongLink.linkDigits || []).includes(digit)
          && cellHasCandidate(cell, digit);
        const isStrongLinkStartDigit = highlights.isStrongLink
          && (highlights.strongLinkStartMarks.has(atomKey) || strongLinkPartitionStartDigit);
        const isStrongLinkEndDigit = highlights.isStrongLink
          && (highlights.strongLinkEndMarks.has(atomKey) || strongLinkPartitionEndDigit);
        const isStrongLinkDigit = isStrongLinkStartDigit || isStrongLinkEndDigit;
        const simpleColoringRole = highlights.simpleColoringMarks.get(atomKey);
        const isSimpleColoringDigit = !!simpleColoringRole;
        const multiColoringTokens = highlights.multiColoringMarks.get(atomKey);
        const isMultiColoringDigit = !!multiColoringTokens;
        const threeDMedusaRole = highlights.threeDMedusaMarks.get(atomKey);
        const isThreeDMedusaDigit = !!threeDMedusaRole;
        const isDigitFocus = hasCandidate && digitHighlightIsVisible(cell, digit);
        const isCandidateSizeFilter = candidateSizeFilterDigitMatches(cell, digit);
        const isHiddenGhostDigit = highlights.isHiddenSubset
          && highlights.baseCells.has(cell)
          && highlights.patternDigits.has(digit)
          && !highlights.vertices.has(cell)
          && !(cand[cell] || []).includes(digit)
          && !isElim;

        const chainDisplayDigit = isElim
          || ((hasCandidate || isChainExplanation || isSimpleColoringDigit)
            && (isFishDigit || isFishEndofinDigit || isChainDigit || isChainWeakDigit || isStrongLinkDigit
              || isAlsRecordDigit || isAlsDofDigit || isAhsRecordDigit || isAhsDofRecordDigit || isChainAhsDigit || isDigitFocus
              || isCandidateSizeFilter || isSimpleColoringDigit || isMultiColoringDigit || isThreeDMedusaDigit
              || isMslsDigit || isChromaticDigit));
        mark.textContent = markFor(cell, digit) || (chainDisplayDigit ? digit : '');
        if (isDigitFocus) mark.classList.add('digit-focus', 'digit-focus-' + digit);
        if (isCandidateSizeFilter) {
          mark.classList.add('candidate-size-filter-digit');
          applyCandidateSizeFilterStyle(mark, highlights.candidateSizeFilterStyle);
        }
        if (isSetDigit) mark.classList.add('set-digit');
        if (isAlsDofClauseDigit) {
          mark.classList.add('als-dof-clause-digit');
          mark.title = 'N clause';
        }
        if (isHiddenGhostDigit) mark.classList.add('hidden-ghost-digit');
        if (isFishDigit) mark.classList.add('fish-digit');
        if (isFishFinDigit) mark.classList.add('fish-fin-digit');
        if (isFishBase) mark.classList.add('fish-base-digit');
        if (isFishBaseIntersection) mark.classList.add('fish-base-intersection-digit');
        if (isFishCover) mark.classList.add('fish-cover-digit');
        if (isFishDoubleCover) mark.classList.add('fish-cover-double-digit');
        if (isFishTripleCover) mark.classList.add('fish-cover-triple-digit');
        if (isMslsDigit) mark.classList.add('fish-digit');
        if (isFishEndofinDigit) mark.classList.add('fish-endofin-digit');
        if (isChromaticDigit) mark.classList.add('chromatic-digit', `chromatic-digit-${digit}`);
        if (isChainDigit && hasChainCandidate) mark.classList.add('chain-digit');
        if (isChainXorEntryDigit && hasChainCandidate) mark.classList.add('chain-xor-entry-digit');
        if (isChainXorExitDigit && hasChainCandidate) mark.classList.add('chain-xor-exit-digit');
        if (isChainAlsDigit && hasChainCandidate) {
          mark.classList.add('chain-als-digit');
          applyAlsColorVars(mark, highlights.chainAlsStyleByAtom.get(atomKey));
        }
        if (isChainAhsDigit && hasChainCandidate) {
          mark.classList.add('ahs-record-digit');
          applyAhsColorVars(mark, highlights.chainAhsStyleByAtom.get(atomKey));
        }
        if (isAlsRecordDigit) {
          mark.classList.add('chain-als-digit');
          applyAlsColorVars(mark, highlights.alsRecordColor);
        }
        if (isAlsDofDigit) {
          mark.classList.add('chain-als-digit');
          applyAlsColorVars(mark, highlights.alsDofStyleByAtom.get(atomKey));
        }
        if (isAhsRecordDigit) {
          mark.classList.add('ahs-record-digit');
          applyAhsColorVars(mark, highlights.ahsRecordColor);
        }
        if (isAhsDofRecordDigit) {
          mark.classList.add('ahs-record-digit');
          applyAhsColorVars(mark, highlights.ahsDofRecordColor);
        }
        if (isChainStartDigit && hasChainCandidate) mark.classList.add('chain-start-digit');
        if (isChainEndDigit && hasChainCandidate) mark.classList.add('chain-end-digit');
        if (isStrongLinkDigit && hasCandidate) mark.classList.add('strong-link-digit');
        if (isStrongLinkStartDigit && hasCandidate) mark.classList.add('strong-link-start-digit');
        if (isStrongLinkEndDigit && hasCandidate) mark.classList.add('strong-link-end-digit');
        if (isSimpleColoringDigit) {
          mark.classList.add('simple-colouring-digit', 'simple-colouring-' + simpleColoringRole + '-digit');
        }
        if (isSimpleColoringElim) mark.classList.add('simple-colouring-elim-digit');
        if (isMultiColoringDigit) applyMultiColoringStyle(mark, multiColoringTokens);
        if (isMultiColoringElim) {
          mark.classList.add('multi-colouring-elim-digit', 'simple-colouring-three-d-elim-digit');
        }
        if (isThreeDMedusaDigit) {
          mark.classList.add('simple-colouring-digit', 'simple-colouring-' + threeDMedusaRole + '-digit');
        }
        if (isThreeDMedusaInvalid) mark.classList.add('simple-colouring-invalid-digit');
        if (isThreeDMedusaElim) mark.classList.add('simple-colouring-three-d-elim-digit');
        if (isElim && !isThreeDMedusaElim && !isMultiColoringElim) mark.classList.add('elim-digit');
        bindPlayerDigitElement(mark, cell, digit);
        marks.appendChild(mark);
      }
      return marks;
    }

    return { render };
  }

  app.boardCandidateView = { create };
})(window);
