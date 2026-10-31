/* StormDoku board cell shell and cell-level highlight presentation. */
(function installBoardCellView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ variantCellClasses, applyCandidateSizeFilterStyle, digitHighlightIsVisible,
    applyAlsColorVars, applyAhsColorVars, applyAlsPartitionColors, bindPlayerCellElement }) {
    function decorate({ el, cell, originalPuzzle, promotedValues, puzzle, variantSettings, highlights }) {
      el.className = 'cell';
      if (originalPuzzle[cell]) el.classList.add('given');
      if (promotedValues[cell]) el.classList.add('solved');
      el.classList.add(...variantCellClasses(cell, variantSettings));
      if (highlights.candidateSizeFilterCells.has(cell)) {
        el.classList.add('candidate-size-filter-cell');
        applyCandidateSizeFilterStyle(el, highlights.candidateSizeFilterStyle);
      }
      const fixedDigit = puzzle[cell] || promotedValues[cell] || 0;
      if (fixedDigit && digitHighlightIsVisible(cell, fixedDigit)) {
        el.classList.add('digit-focus-cell', 'digit-focus-' + fixedDigit);
      }
      if (highlights.isChromatic && highlights.chromaticCells.has(cell)) {
        el.classList.add('chromatic-cell');
        if (highlights.chromaticCoreCells.has(cell)) el.classList.add('chromatic-core-cell');
        if (highlights.chromaticGuardians.has(cell)) el.classList.add('chromatic-guardian-cell');
      }
      if (highlights.isFish && highlights.fishCells.has(cell)) el.classList.add('fish-intersection');
      if (highlights.isMsls && highlights.mslsBaseCells.has(cell)) el.classList.add('msls-base');
      if (highlights.isMsls && highlights.mslsCoverCells.has(cell)) el.classList.add('msls-cover');
      if (highlights.isFish && highlights.fins.has(cell) && !highlights.vertices.has(cell)) el.classList.add('fish-fin');
      if (highlights.isSubset && !highlights.isHiddenSubset && highlights.vertices.has(cell)) el.classList.add('subset-vertex');
      if (highlights.isFish && highlights.vertices.has(cell)) el.classList.add('fish-vertex');
      if (highlights.isChain && highlights.chainAlsCells.has(cell)) {
        el.classList.add('chain-als-cell');
        applyAlsColorVars(el, highlights.chainAlsStyleByCell.get(cell));
      }
      if (highlights.isChain && highlights.chainAhsCells.has(cell)) {
        el.classList.add('ahs-record-cell');
        applyAhsColorVars(el, highlights.chainAhsStyleByCell.get(cell));
      }
      if (highlights.isAlsRecord && highlights.alsRecordCells.has(cell)) {
        el.classList.add('chain-als-cell');
        applyAlsColorVars(el, highlights.alsRecordColor);
      }
      if (highlights.isAlsDof && highlights.alsDofCells.has(cell)) {
        el.classList.add('chain-als-cell');
        applyAlsPartitionColors(el, highlights.alsDofStylesByCell.get(cell));
      }
      if (highlights.isNonConsecutiveAlsDof && highlights.alsDofClauseCells.has(cell)) el.classList.add('chain-als-cell');
      if (highlights.isAhsRecord && highlights.ahsRecordCells.has(cell)) {
        el.classList.add('ahs-record-cell');
        applyAhsColorVars(el, highlights.ahsRecordColor);
      }
      if (highlights.isAhsDof && highlights.ahsDofRecordCells.has(cell)) {
        el.classList.add('ahs-record-cell');
        applyAhsColorVars(el, highlights.ahsDofRecordColor);
      }
      if (highlights.isChain && highlights.chainAlsEntryCells.has(cell)) el.classList.add('chain-als-entry');
      if (highlights.isChain && highlights.chainAlsExitCells.has(cell)) el.classList.add('chain-als-exit');
      if (highlights.isStrongLink && highlights.strongLink.activeCells?.includes(cell)) el.classList.add('strong-link-active-cell');
      if (highlights.isStrongLink && highlights.strongLink.linkedCells?.includes(cell)) el.classList.add('strong-link-linked-cell');
      const strongLinkPartition = highlights.strongLinkPartitionByCell.get(cell);
      if (strongLinkPartition === 'active') el.classList.add('strong-link-partition-active');
      if (strongLinkPartition === 'linked') el.classList.add('strong-link-partition-linked');
      if (strongLinkPartition === 'empty') el.classList.add('strong-link-partition-empty');
      bindPlayerCellElement(el, cell);
      return strongLinkPartition;
    }

    return { decorate };
  }

  app.boardCellView = { create };
})(window);
