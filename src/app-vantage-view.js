/* RC/Rn/Cn/Bn vantage-view helpers. */
(function installVantageView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function renderHeaders({ view, selector, title, numbers, rows }) {
    const isCellView = view === 'RC';
    const rowPrefix = isCellView ? '' : view.charAt(0).toUpperCase();
    selector.value = view;
    title.textContent = isCellView ? 'Columns' : 'Digits';
    numbers.textContent = '';
    rows.textContent = '';
    for (let index = 1; index <= 9; index += 1) {
      const column = document.createElement('span');
      column.textContent = String(index);
      numbers.appendChild(column);
      const row = document.createElement('span');
      row.textContent = rowPrefix ? `${rowPrefix}${index}` : String(index);
      rows.appendChild(row);
    }
  }

  function extractSlice({ view, cand, puzzle, core, showFixed, vantageCellFromSlot }) {
    const state = core.buildSpaces(cand);
    const offset = view === 'Rn' ? 0 : view === 'Cn' ? 9 : 18;
    return Array.from({ length: 9 }, (_, sector) =>
      Array.from({ length: 9 }, (_, digitIndex) => {
        const mask = state.M[offset + sector][digitIndex];
        const positions = new Set();
        for (let position = 0; position < 9; position += 1) {
          if (mask & (1 << position)) positions.add(position);
        }
        if (showFixed) {
          const digit = digitIndex + 1;
          for (let position = 0; position < 9; position += 1) {
            const cell = vantageCellFromSlot(view, sector, position);
            if (puzzle[cell] === digit) positions.add(position);
          }
        }
        return positions;
      }),
    );
  }

  function switchView(view, { setView, renderHeaders, renderBoard } = {}) {
    if (!['RC', 'Rn', 'Cn', 'Bn'].includes(view)) return false;
    setView?.(view);
    renderHeaders?.();
    renderBoard?.();
    return true;
  }

  function renderBoard({
    view, slice, highlights, boardEl, cand, puzzle, showFixed,
    vantageCellFromSlot, atomKey, digitHighlightIsVisible,
    candidateSizeFilterDigitMatches, cellHasCandidate,
    applyCandidateSizeFilterStyle, applyMultiColoringStyle,
    applyAlsColorVars, applyAhsColorVars, selectedPlayerCell,
    bindPlayerDigitElement, renderVantageChainOverlay,
    renderHydraAlsDofOverlay, renderAlsDofOverlay,
    renderVantageStrongLinkOverlay,
  }) {
    const axis = view === 'Rn' ? 'R' : view === 'Cn' ? 'C' : 'B';
    const positionPrefix = view === 'Rn' ? 'c' : view === 'Cn' ? 'r' : 'p';

    for (let sector = 0; sector < 9; sector++) {
      for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
        const positions = slice[sector][digitIndex];
        const digit = digitIndex + 1;
        const tile = document.createElement('div');
        tile.className = `cell vantage-cell vantage-${view.toLowerCase()}`;
        tile.setAttribute('role', 'gridcell');
        tile.setAttribute('aria-rowindex', String(sector + 1));
        tile.setAttribute('aria-colindex', String(digit));
        if (!positions.size) tile.classList.add('vantage-empty');
        const activePositions = [...positions].map(position => position + 1).join('');
        tile.title = `${axis}${sector + 1}, digit ${digit}: `
          + `${activePositions ? `${positionPrefix}${activePositions}` : 'none'}`;
        tile.setAttribute('aria-label', `${axis}${sector + 1}, digit ${digit}, `
          + `${activePositions ? `${positionPrefix}${activePositions}` : 'no positions'}`);

        const miniGrid = document.createElement('span');
        miniGrid.className = 'vantage-slice-grid';
        for (let position = 0; position < 9; position++) {
          const mark = document.createElement('span');
          mark.className = 'vantage-position';
          mark.textContent = String(position + 1);
          const cell = vantageCellFromSlot(view, sector, position);
          if (highlights.isMsls && highlights.mslsBaseCells.has(cell)) tile.classList.add('msls-base');
          if (highlights.isMsls && highlights.mslsCoverCells.has(cell)) tile.classList.add('msls-cover');
          const atom = atomKey(cell, digit);
          const positionActive = positions.has(position);
          const isFixed = showFixed && puzzle[cell] === digit;
          const isDigitFocus = positionActive && digitHighlightIsVisible(cell, digit);
          const isCandidateSizeFilter = candidateSizeFilterDigitMatches(cell, digit);
          const isAlsDofElim = highlights.alsDofElimMarks.has(atom);
          const isAhsDofElim = highlights.ahsDofRecordElimMarks.has(atom);
          const isSimpleColoringElim = highlights.simpleColoringElimMarks.has(atom);
          const isMultiColoringElim = highlights.multiColoringElimMarks.has(atom);
          const isThreeDMedusaElim = highlights.threeDMedusaElimMarks.has(atom);
          const isThreeDMedusaInvalid = highlights.threeDMedusaInvalidMarks.has(atom);
          const multiColoringTokens = highlights.multiColoringMarks.get(atom);
          const isMultiColoringDigit = !!multiColoringTokens;
          const isElim = highlights.removedMarks.has(atom) || isAlsDofElim || isAhsDofElim || isSimpleColoringElim
            || isMultiColoringElim || isThreeDMedusaElim;
          const simpleColoringRole = highlights.simpleColoringMarks.get(atom);
          const isSimpleColoringDigit = !!simpleColoringRole;
          const threeDMedusaRole = highlights.threeDMedusaMarks.get(atom);
          const isThreeDMedusaDigit = !!threeDMedusaRole;
          const isFishVertex = highlights.isFish
            && highlights.patternDigits.has(digit)
            && highlights.vertices.has(cell);
          const isMslsDigit = highlights.isMsls && highlights.mslsCoverAtoms.has(atom);
          const isFishFin = highlights.isFish
            && highlights.patternDigits.has(digit)
            && highlights.fins.has(cell)
            && !highlights.vertices.has(cell);
          const isFishEndofin = highlights.isFish
            && highlights.patternDigits.has(digit)
            && highlights.endofins.has(cell);
          const isSubsetDigit = highlights.isSubset
            && highlights.patternDigits.has(digit)
            && highlights.vertices.has(cell);
          const isAlsDofClauseDigit = highlights.alsDofClauseDigit === digit
            && highlights.alsDofClauseCells.has(cell)
            && cellHasCandidate(cell, digit);
          const isChain = highlights.isChain && highlights.chainMarks.has(atom);
          const isChainXorEntry = highlights.isChain && highlights.chainXorEntryMarks.has(atom);
          const isChainXorExit = highlights.isChain && highlights.chainXorExitMarks.has(atom);
          const isChainWeak = highlights.isChain && highlights.chainWeakMarks.has(atom);
          const isChainAls = highlights.isChain && highlights.chainAlsMarks.has(atom);
          const isChainAhs = highlights.isChain && highlights.chainAhsMarks.has(atom);
          const isAlsRecord = highlights.isAlsRecord && highlights.alsRecordMarks.has(atom);
          const isAlsDof = highlights.isAlsDof && highlights.alsDofMarks.has(atom);
          const isAhsDof = highlights.isAhsDof && highlights.ahsDofRecordMarks.has(atom);
          const isAhsRecord = highlights.isAhsRecord && highlights.ahsRecordMarks.has(atom);
          const isChainStart = highlights.isChain && highlights.chainStartMarks.has(atom);
          const isChainEnd = highlights.isChain && highlights.chainEndMarks.has(atom);
          const strongLinkPartition = highlights.strongLinkPartitionByCell.get(cell);
          const strongLinkStart = highlights.isStrongLink
            && (highlights.strongLinkStartMarks.has(atom)
              || (strongLinkPartition === 'active'
                && (highlights.strongLink.startingDigits || []).includes(digit)
                && cellHasCandidate(cell, digit)));
          const strongLinkEnd = highlights.isStrongLink
            && (highlights.strongLinkEndMarks.has(atom)
              || (strongLinkPartition === 'linked'
                && (highlights.strongLink.linkDigits || []).includes(digit)
                && cellHasCandidate(cell, digit)));
          const isHiddenGhost = highlights.isHiddenSubset
            && highlights.baseCells.has(cell)
            && highlights.patternDigits.has(digit)
            && !(cand[cell] || []).includes(digit)
            && !isElim;

          if (positionActive) mark.classList.add('active');
          if (isFixed) mark.classList.add('fixed');
          if (isDigitFocus) mark.classList.add('digit-focus', 'digit-focus-' + digit);
          if (isCandidateSizeFilter) {
            mark.classList.add('candidate-size-filter');
            applyCandidateSizeFilterStyle(mark, highlights.candidateSizeFilterStyle);
          }
          if (isElim && !isThreeDMedusaElim && !isMultiColoringElim) mark.classList.add('elim-digit', 'elim');
          if (isFishVertex || isFishFin || isMslsDigit) mark.classList.add('fish');
          if (isFishEndofin) mark.classList.add('fish-endofin');
          if (isSubsetDigit) mark.classList.add('subset');
          if (isAlsDofClauseDigit) mark.classList.add('als-dof-clause');
          if (isChain) mark.classList.add('chain');
          if (isChainXorEntry || isChainStart || strongLinkStart) {
            mark.classList.add(isChainXorEntry || isChainStart ? 'chain-xor-entry' : 'strong-start');
          }
          if (isChainXorExit || isChainEnd || strongLinkEnd) {
            mark.classList.add(isChainXorExit || isChainEnd ? 'chain-xor-exit' : 'strong-end');
          }
          if (isChainWeak) mark.classList.add('chain-weak');
          if (isChainAls || isAlsRecord || isAlsDof) mark.classList.add('chain-als');
          if (isChainAhs || isAhsRecord || isAhsDof) mark.classList.add('ahs-record');
          if (isSimpleColoringDigit) mark.classList.add('simple-colouring-digit', 'simple-colouring-' + simpleColoringRole + '-digit');
          if (isSimpleColoringElim) mark.classList.add('simple-colouring-elim-digit');
          if (isMultiColoringDigit) applyMultiColoringStyle(mark, multiColoringTokens);
          if (isMultiColoringElim) mark.classList.add('multi-colouring-elim-digit', 'simple-colouring-three-d-elim-digit');
          if (isThreeDMedusaDigit) mark.classList.add('simple-colouring-digit', 'simple-colouring-' + threeDMedusaRole + '-digit');
          if (isThreeDMedusaInvalid) mark.classList.add('simple-colouring-invalid-digit');
          if (isThreeDMedusaElim) mark.classList.add('simple-colouring-three-d-elim-digit');
          if (isHiddenGhost && !positionActive) mark.classList.add('active');
          if (isChainAls && !highlights.isHydra) applyAlsColorVars(mark, highlights.chainAlsStyleByAtom.get(atom));
          if (isAlsRecord) applyAlsColorVars(mark, highlights.alsRecordColor);
          if (isAlsDof) applyAlsColorVars(mark, highlights.alsDofStyleByAtom.get(atom));
          if (isAhsRecord) applyAhsColorVars(mark, highlights.ahsRecordColor);
          if (isAhsDof) applyAhsColorVars(mark, highlights.ahsDofRecordColor);
          if (selectedPlayerCell === cell) mark.classList.add('player-cell-selected');
          bindPlayerDigitElement(mark, cell, digit);

          const hasOverlay = isElim || isFishVertex || isFishFin || isFishEndofin || isSubsetDigit
            || isChain || isChainXorEntry || isChainXorExit || isChainWeak || isChainAls || isAlsRecord
            || isAlsDof || isAhsRecord || isAhsDof || isChainStart || isChainEnd || strongLinkStart
            || strongLinkEnd || isHiddenGhost || isDigitFocus || isCandidateSizeFilter || isSimpleColoringDigit
            || isSimpleColoringElim || isMultiColoringDigit || isThreeDMedusaDigit || isThreeDMedusaElim
            || isMultiColoringElim || isMslsDigit;
          if (!positionActive && !hasOverlay) mark.textContent = '';
          miniGrid.appendChild(mark);
        }
        tile.appendChild(miniGrid);
        boardEl.appendChild(tile);
      }
    }

    if (highlights.isChain) renderVantageChainOverlay(highlights.chain);
    for (const hydraChain of highlights.hydraChains || []) {
      if (hydraChain !== highlights.chain) renderVantageChainOverlay(hydraChain);
    }
    if (highlights.isAlsDof) {
      if (highlights.alsDofRecord?.mode === 'hydra') renderHydraAlsDofOverlay(highlights.alsDofRecord, true);
      else renderAlsDofOverlay(highlights.alsDofRecord, true);
    }
    if (highlights.isStrongLink) renderVantageStrongLinkOverlay(highlights.strongLink);
  }

  app.vantageView = { renderHeaders, extractSlice, switchView, renderBoard };
})(window);
