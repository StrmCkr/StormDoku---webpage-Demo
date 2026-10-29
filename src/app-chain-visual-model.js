/* StormDoku chain visual-model helpers. */
(function installChainVisualModel(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function chainModuleSubsets(module) {
    if (!module) return [];
    const entry = module.entrySubset
      || module.entrySideSubset
      || module.entrySideLs
      || module.entryLs
      || module.ex;
    const exit = module.exitSubset
      || module.exitSideSubset
      || module.exitSideLs
      || module.exitLs
      || module.el;
    return [entry, exit].filter(Boolean);
  }

  function isAlsVisualStep(step, alsConstant) {
    const family = step.family || '';
    const typeName = String(step.linkTypeName || '').toUpperCase();
    const linkType = Number(step.linkType);
    const subsets = chainModuleSubsets(step.module);
    const isBivalentCellModule = typeName === 'ALS_RCC'
      && subsets.length === 2
      && subsets.every(subset => (subset.cells || []).length === 1 && (subset.digits || []).length === 2);
    if (isBivalentCellModule) return false;
    // Type-4 bivalves are the single-cell ALS/value nodes used by XY/YZ
    // rings.  They have no ALS module wrapper, so identify them directly for
    // the chain overlay and paint their cells with the ALS palette.
    const isBivalve = family === 'SL'
      && (linkType === 4 || typeName === 'BIVALVE' || typeName === 'BIVALENT')
      && (step.entry?.cells || []).length === 1
      && (step.exit?.cells || []).length === 1
      && step.entry.cells[0] === step.exit.cells[0]
      && (step.entry?.digits || []).length === 2
      && (step.exit?.digits || []).length === 2;
    if (isBivalve) return true;
    return family === 'ALS'
      || typeName === 'ALS'
      || typeName.startsWith('ALS_')
      || linkType === alsConstant;
  }

  function isAhsVisualStep(step) {
    const family = step?.family || '';
    const typeName = String(step?.linkTypeName || '').toUpperCase();
    return family === 'AHS' || typeName === 'AHS' || typeName.startsWith('AHS_');
  }

  function isModuleVisualStep(step, alsConstant) {
    return isAlsVisualStep(step, alsConstant) || isAhsVisualStep(step);
  }

  function isAlmostFishVisualStep(step) {
    return step?.view?.node?.raw?.xorConstruction?.kind === 'almost-fish';
  }

  function alsVisualKey(step) {
    return step.graphId || String(step.family || '') + ':' + String(step.linkId ?? '') + ':' + String(step.linkTypeName || '');
  }

  function alsVisualSideKey(step, side, role) {
    if (step?.view?.node?.raw?.standaloneAls) {
      return 'ALS-STANDALONE:' + String(step.view.node.graphId || step.linkId || '');
    }
    const entryCells = new Set(moduleVisualSides(step).entry?.cells || []);
    const exitCells = new Set(moduleVisualSides(step).exit?.cells || []);
    const overlaps = [...entryCells].some(cell => exitCells.has(cell));
    if (overlaps) return 'ALS-OVERLAP:' + alsVisualKey(step);
    const cells = (side?.cells || []).join(',');
    const digits = (side?.digits || []).join('');
    if (cells || digits) return 'ALS:' + digits + ':' + cells;
    return alsVisualKey(step) + ':' + role;
  }

  function ahsVisualKey(step) {
    const sides = moduleVisualSides(step);
    const sideKey = side => `${(side?.cells || []).join(',')}:${(side?.digits || []).join('')}`;
    const commonDigits = (step?.module?.common?.digits || []).join('');
    return [step?.graphId || '', step?.linkId ?? '', sideKey(sides.entry), sideKey(sides.exit), commonDigits].join('|');
  }

  function ahsVisualSideKey(step, side, role) {
    const cells = (side?.cells || []).join(',');
    const digits = (side?.digits || []).join('');
    if (cells || digits) return `AHS:${digits}:${cells}`;
    return `${ahsVisualKey(step)}:${role}`;
  }

  function alsColorMapForChain(chain, { isAlsVisualStep, moduleVisualSides, alsVisualSideKey, colorAt }) {
    const colors = new Map();
    for (const step of chain?.steps || []) {
      if (!isAlsVisualStep(step)) continue;
      const sides = moduleVisualSides(step);
      for (const [role, side] of [['entry', sides.entry], ['exit', sides.exit]]) {
        const key = alsVisualSideKey(step, side, role);
        if (!colors.has(key)) colors.set(key, colorAt(colors.size));
      }
    }
    return colors;
  }

  function ahsColorMapForChain(chain, { isAhsVisualStep, moduleVisualSides, ahsVisualSideKey, ahsColors }) {
    const colors = new Map();
    for (const step of chain?.steps || []) {
      if (!isAhsVisualStep(step)) continue;
      const sides = moduleVisualSides(step);
      for (const [role, side] of [['entry', sides.entry], ['exit', sides.exit]]) {
        const key = ahsVisualSideKey(step, side, role);
        if (!colors.has(key)) colors.set(key, ahsColors[colors.size % ahsColors.length]);
      }
    }
    return colors;
  }

  function ahsColorForSide(step, side, role, colorMap, { ahsVisualSideKey, ahsRecordColor }) {
    return colorMap?.get(ahsVisualSideKey(step, side, role)) || ahsRecordColor;
  }

  function alsColorForSide(step, side, role, colorMap, { alsVisualSideKey, alsColors, hashString }) {
    const key = alsVisualSideKey(step, side, role);
    if (colorMap?.has(key)) return colorMap.get(key);
    return alsColors[hashString(String(key)) % alsColors.length];
  }

  function chainSideAtoms(side, forcedDigit, existingOnly, { chainCandidateIsVisible, atomKey }) {
    const atoms = [];
    const sideDigits = side.digits || [];
    for (const cell of side.cells || []) {
      const cellDigits = side.digitsByCell?.[String(cell)] || sideDigits;
      const digits = forcedDigit == null ? cellDigits : [forcedDigit];
      for (const digit of digits) {
        if (!cellDigits.includes(digit)) continue;
        if (!chainCandidateIsVisible(cell, digit, existingOnly)) continue;
        atoms.push(atomKey(cell, digit));
      }
    }
    return atoms;
  }

  function addWeakDigitMarks(weakMarks, side, digit, existingOnly, callbacks) {
    if (digit == null) return;
    for (const atom of chainSideAtoms(side, digit, existingOnly, callbacks)) weakMarks.add(atom);
  }

  function addChainSideMarks(side, marks, cells, orderByCell, order, existingOnly, callbacks) {
    for (const atom of chainSideAtoms(side, null, existingOnly, callbacks)) marks.add(atom);
    for (const cell of [...(side.cells || []), ...(side.rccCells || [])]) {
      cells.add(cell);
      const orders = orderByCell.get(cell) || [];
      if (!orders.includes(order)) orders.push(order);
      orderByCell.set(cell, orders);
    }
  }

  function moduleVisualSides(step) {
    const module = step.module;
    if (!module) return { entry: step.entry, exit: step.exit };
    return {
      entry: module.entrySideSubset
        || module.entrySideLs
        || module.entrySubset
        || module.entryLs
        || module.ex
        || step.entry,
      exit: module.exitSideSubset
        || module.exitSideLs
        || module.exitSubset
        || module.exitLs
        || module.el
        || step.exit,
    };
  }

  function visibleChainEntrySide(step, isAlsVisualStep) {
    return isAlsVisualStep(step) ? moduleVisualSides(step).entry : step.entry;
  }

  function visibleChainExitSide(step, isAlsVisualStep) {
    return isAlsVisualStep(step) ? moduleVisualSides(step).exit : step.exit;
  }

  function orientedDisplayChainSteps(steps, peersOf = null) {
    const display = [...(steps || [])].map(step => ({ ...step }));
    const sameLocation = (left, right) => {
      const leftCells = left?.cells || [];
      const rightCells = right?.cells || [];
      return leftCells.length > 0
        && leftCells.length === rightCells.length
        && leftCells.every((cell, index) => cell === rightCells[index]);
    };
    const sideSees = (left, right) => {
      if (typeof peersOf !== 'function') return false;
      const leftCells = left?.cells || [];
      const rightCells = right?.cells || [];
      return leftCells.length > 0 && rightCells.length > 0
        && leftCells.every(leftCell => rightCells.every(rightCell =>
          leftCell !== rightCell && peersOf(leftCell).includes(rightCell)));
    };
    for (let index = 0; index < display.length - 1; index += 1) {
      const current = display[index];
      const next = display[index + 1];
      const entryAligned = sameLocation(current.entry, next.entry)
        || sideSees(current.entry, next.entry);
      const exitAligned = sameLocation(current.exit, next.entry)
        || sideSees(current.exit, next.entry);
      if (entryAligned && !exitAligned) {
        display[index] = {
          ...current,
          entrySide: current.exitSide,
          exitSide: current.entrySide,
          entry: { ...current.exit, side: 'left' },
          exit: { ...current.entry, side: 'right' },
        };
      }
    }
    return display;
  }

  app.chainVisualModel = {
    chainModuleSubsets,
    isAlsVisualStep,
    isAhsVisualStep,
    isModuleVisualStep,
    isAlmostFishVisualStep,
    alsVisualKey,
    alsVisualSideKey,
    ahsVisualKey,
    ahsVisualSideKey,
    alsColorMapForChain,
    ahsColorMapForChain,
    ahsColorForSide,
    alsColorForSide,
    chainSideAtoms,
    addWeakDigitMarks,
    addChainSideMarks,
    moduleVisualSides,
    visibleChainEntrySide,
    visibleChainExitSide,
    orientedDisplayChainSteps,
  };
})(window);
