(function (root) {
  const app = root.StormDokuApp = root.StormDokuApp || {};

  function buildActiveStepHighlightContext({
    activeStep = null,
    removed = [],
    chainRemoved = [],
    activeStepRemoved = [],
    activeCandidateSizeFilters = new Set(),
    candidateSizeFilterMatches = () => false,
    cellsForSectorsFn = () => new Set(),
    cellsForHouseFn = () => new Set(),
  } = {}) {
    const removedMarks = new Set([
      ...removed,
      ...chainRemoved,
      ...activeStepRemoved,
    ].map(item => `${item.cell}:${item.digit}`));
    const vertices = new Set(activeStep?.vertices || activeStep?.at || []);
    const alsDofClause = activeStep?.clause || null;
    const alsDofClauseCells = new Set(alsDofClause?.cells || []);
    const alsDofClauseDigit = Number.isInteger(alsDofClause?.digit)
      ? alsDofClause.digit
      : Number.isInteger(activeStep?.clauseDigit) ? activeStep.clauseDigit : null;
    const isNonConsecutiveAlsDof = activeStep?.tech === 'non-consecutive-als-dof'
      || activeStep?.tech === 'non-consecutive-als-dof-peer';
    const isMsls = activeStep?.tech === 'msls';
    const mslsBaseCells = new Set(activeStep?.mslsBaseCells || []);
    const mslsCoverCells = new Set(activeStep?.mslsCoverCells || []);
    const mslsCoverAtoms = new Set(activeStep?.mslsCoverAtoms || []);
    const rawFins = new Set(activeStep?.fins || []);
    const endofins = new Set(activeStep?.endofins || activeStep?.endoFins || []);
    const patternDigits = new Set(activeStep?.digits || []);
    const chromaticRecord = activeStep?.chromaticRecord || null;
    const chromaticCells = new Set(chromaticRecord?.cells || []);
    const chromaticCoreCells = new Set(chromaticRecord?.coreCells || []);
    const chromaticGuardians = new Set(chromaticRecord?.guardians || []);
    const chromaticDigits = new Set(chromaticRecord?.digits || []);
    const candidateSizeFilterCells = new Set();
    if (activeCandidateSizeFilters.size) {
      for (let cell = 0; cell < 81; cell++) {
        if (candidateSizeFilterMatches(cell)) candidateSizeFilterCells.add(cell);
      }
    }
    const baseCells = activeStep?.baseSectors
      ? cellsForSectorsFn(activeStep.baseSectors)
      : cellsForHouseFn(activeStep?.base);
    const coverCells = activeStep?.coverSectors
      ? cellsForSectorsFn(activeStep.coverSectors)
      : cellsForHouseFn(activeStep?.cover);
    const fins = new Set([...rawFins].filter(cell => baseCells.has(cell)));
    const fishCells = new Set(activeStep?.fishCells || [...baseCells]
      .filter(cell => coverCells.has(cell)));
    const fishBaseIntersections = new Set(activeStep?.baseIntersections || []);
    const fishPeersOfBaseIntersection = new Set(activeStep?.peersOfBaseIntersection || []);
    const fishDoubleCover = new Set(activeStep?.overcovered || []);
    const fishTripleCover = new Set(activeStep?.triCovered || []);
    const isFish = ['fish', 'pointing', 'claiming', 'non-consecutive-line', 'non-consecutive-eri']
      .includes(activeStep?.tech);
    const isSubset = !!activeStep && activeStep.tech !== 'chain' && !isFish && !chromaticRecord;
    const isHiddenSubset = !!activeStep && activeStep.tech.startsWith('hidden-');
    return {
      removedMarks,
      vertices,
      alsDofClause,
      alsDofClauseCells,
      alsDofClauseDigit,
      isNonConsecutiveAlsDof,
      isMsls,
      mslsBaseCells,
      mslsCoverCells,
      mslsCoverAtoms,
      fins,
      endofins,
      patternDigits,
      isChromatic: !!chromaticRecord,
      chromaticRecord,
      chromaticCells,
      chromaticCoreCells,
      chromaticGuardians,
      chromaticDigits,
      candidateSizeFilterCells,
      baseCells,
      coverCells,
      fishCells,
      fishBaseIntersections,
      fishPeersOfBaseIntersection,
      fishDoubleCover,
      fishTripleCover,
      isFish,
      isSubset,
      isHiddenSubset,
    };
  }

  function buildStrongLinkHighlightContext({
    strongLink = null,
    selectedStrongLinkType = null,
    cellHasCandidateFn = () => false,
  } = {}) {
    const startMarks = new Set();
    const endMarks = new Set();
    const partitionByCell = new Map();
    if (!strongLink) return { startMarks, endMarks, partitionByCell };
    const visualConstruction = selectedStrongLinkType === 3
      && strongLink.secondaryXorConstruction?.kind === 'eri'
      ? strongLink.secondaryXorConstruction
      : null;
    const activeCells = visualConstruction?.activeCells || strongLink.activeCells || [];
    const linkedCells = visualConstruction?.linkedCells || strongLink.linkedCells || [];
    for (const cell of activeCells) {
      for (const digit of strongLink.startingDigits || []) {
        if (cellHasCandidateFn(cell, digit)) startMarks.add(`${cell}:${digit}`);
      }
    }
    for (const cell of linkedCells) {
      for (const digit of strongLink.linkDigits || []) {
        if (cellHasCandidateFn(cell, digit)) endMarks.add(`${cell}:${digit}`);
      }
    }
    const construction = selectedStrongLinkType === 3
      && strongLink.secondaryXorConstruction?.kind === 'eri'
      ? strongLink.secondaryXorConstruction
      : strongLink.xorConstruction;
    if (construction?.kind === 'mini-sector' || construction?.kind === 'variant-sector-xor') {
      for (const [index, cells] of (construction.partitionCells || []).entries()) {
        const role = index === construction.activePartition
          ? 'active'
          : index === construction.linkedPartition
            ? 'linked'
            : index === construction.emptyPartition
              ? 'empty'
              : null;
        if (role) for (const cell of cells) partitionByCell.set(cell, role);
      }
    }
    if (construction?.kind === 'eri') {
      for (const cell of construction.emptyCells || []) partitionByCell.set(cell, 'empty');
    }
    return { startMarks, endMarks, partitionByCell };
  }

  function buildAlsAhsHighlightContext({
    alsRecord = null,
    alsDofRecord = null,
    ahsRecord = null,
    ahsDofChainRecord = null,
    ahsDofRecord = null,
    alsColorAtFn = () => null,
    alsChainColors = [],
    hashStringFn = value => value,
    cellHasCandidateFn = () => false,
    atomKeyFn = (cell, digit) => `${cell}:${digit}`,
    ahsRecordColor = null,
  } = {}) {
    const alsRecordCells = new Set(alsRecord?.alsAllCells || []);
    const alsRecordMarks = new Set();
    for (const cell of alsRecord?.alsAllCells || []) {
      for (const digit of alsRecord?.alsDigits || []) {
        if (cellHasCandidateFn(cell, digit)) alsRecordMarks.add(atomKeyFn(cell, digit));
      }
    }
    const alsRecordColor = alsRecord
      ? alsChainColors[hashStringFn(String(alsRecord.uniqueID)) % alsChainColors.length]
      : null;
    const alsDofMarks = new Set();
    const alsDofCells = new Set();
    const alsDofStyleByCell = new Map();
    const alsDofStylesByCell = new Map();
    const alsDofStyleByAtom = new Map();
    if (alsDofRecord) {
      const auxiliary = alsDofRecord.auxiliary || [];
      const nodes = [
        { node: alsDofRecord.primaryA, color: alsColorAtFn(0) },
        ...auxiliary.map((node, index) => ({ node, color: alsColorAtFn(index + 1) })),
        ...(alsDofRecord.primaryC
          ? [{ node: alsDofRecord.primaryC, color: alsColorAtFn(auxiliary.length + 1) }]
          : []),
      ];
      for (const { node, color } of nodes) {
        for (const cell of node?.cells || []) {
          alsDofCells.add(cell);
          const cellColors = alsDofStylesByCell.get(cell) || [];
          if (!cellColors.includes(color)) cellColors.push(color);
          alsDofStylesByCell.set(cell, cellColors);
          if (!alsDofStyleByCell.has(cell)) alsDofStyleByCell.set(cell, color);
          for (const digit of node?.digits || []) {
            if (!cellHasCandidateFn(cell, digit)) continue;
            const atom = atomKeyFn(cell, digit);
            alsDofMarks.add(atom);
            alsDofStyleByAtom.set(atom, color);
          }
        }
      }
    }
    const alsDofElimMarks = new Set(
      (alsDofRecord?.eliminations || []).map(item => atomKeyFn(item.cell, item.digit)),
    );
    const ahsRecordCells = new Set(ahsRecord?.ahsAllCells || []);
    const ahsRecordMarks = new Set();
    for (const cell of ahsRecord?.ahsAllCells || []) {
      for (const digit of ahsRecord?.ahsDigits || []) {
        if (cellHasCandidateFn(cell, digit)) ahsRecordMarks.add(atomKeyFn(cell, digit));
      }
    }
    const ahsDofRecordCells = new Set();
    const ahsDofRecordMarks = new Set();
    const ahsDofDisplayNodes = ahsDofChainRecord
      ? ahsDofChainRecord.nets.flatMap(net => [net.hub, ...(net.auxiliary || [])])
      : ahsDofRecord ? [ahsDofRecord.hub, ...(ahsDofRecord.auxiliary || [])] : [];
    const ahsDofRecordElimMarks = new Set(
      (ahsDofChainRecord?.eliminations || ahsDofRecord?.eliminations || [])
        .map(item => atomKeyFn(item.cell, item.digit)),
    );
    for (const node of ahsDofDisplayNodes.filter(Boolean)) {
      for (const cell of node.cells || []) {
        ahsDofRecordCells.add(cell);
        for (const digit of node.digits || []) {
          if (cellHasCandidateFn(cell, digit)) ahsDofRecordMarks.add(atomKeyFn(cell, digit));
        }
      }
    }
    return {
      alsRecordCells,
      alsRecordMarks,
      alsRecordColor,
      alsDofMarks,
      alsDofCells,
      alsDofStyleByCell,
      alsDofStylesByCell,
      alsDofStyleByAtom,
      alsDofElimMarks,
      ahsRecordCells,
      ahsRecordMarks,
      ahsDofRecordCells,
      ahsDofRecordMarks,
      ahsDofRecordElimMarks,
      ahsDofRecordColor: ahsDofChainRecord || ahsDofRecord ? ahsRecordColor : null,
    };
  }

  function mergeChainHighlightView(target, source) {
    if (!target || !source) return target;
    for (const [key, value] of Object.entries(source)) {
      if (value instanceof Set) {
        for (const item of value) target[key]?.add(item);
      } else if (value instanceof Map) {
        for (const [item, detail] of value) {
          if (target[key] && !target[key].has(item)) target[key].set(item, detail);
        }
      }
    }
    return target;
  }

  app.highlightContext = {
    buildActiveStepHighlightContext,
    buildStrongLinkHighlightContext,
    buildAlsAhsHighlightContext,
    mergeChainHighlightView,
  };
})(window);
