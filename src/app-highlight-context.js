(function (root) {
  const app = root.StormDokuApp = root.StormDokuApp || {};
  const ALS_LOCKED_SURPLUS_COLORS = [
    { bg: 'rgba(250, 204, 21, .72)', stroke: '#a16207', ink: '#422006' },
    { bg: 'rgba(244, 114, 182, .62)', stroke: '#be185d', ink: '#500724' },
    { bg: 'rgba(74, 222, 128, .62)', stroke: '#15803d', ink: '#052e16' },
    { bg: 'rgba(196, 181, 253, .68)', stroke: '#7c3aed', ink: '#2e1065' },
    { bg: 'rgba(251, 146, 60, .66)', stroke: '#c2410c', ink: '#431407' },
    { bg: 'rgba(103, 232, 249, .66)', stroke: '#0e7490', ink: '#083344' },
  ];

  function alsLockedSurplusColorAt(index) {
    if (ALS_LOCKED_SURPLUS_COLORS[index]) return ALS_LOCKED_SURPLUS_COLORS[index];
    const hue = 24 + ((index * 53) % 320);
    return {
      bg: `hsla(${hue}, 92%, 66%, .7)`,
      stroke: `hsl(${hue}, 82%, 34%)`,
      ink: `hsl(${hue}, 78%, 18%)`,
    };
  }

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
    const externalGuardAtoms = new Set(activeStep?.externalGuardAtoms || []);
    const uniquenessForcingOnAtoms = new Set(activeStep?.uniquenessForcingOnAtoms || []);
    const uniquenessForcingOffAtoms = new Set(activeStep?.uniquenessForcingOffAtoms || []);
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
      externalGuardAtoms,
      uniquenessForcingOnAtoms,
      uniquenessForcingOffAtoms,
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
    alsRecords = null,
    alsExclusionDigits = [],
    uniquenessRccLinks = [],
    uniquenessEliminationsByAls = [],
    uniquenessUrAlsLinks = [],
    uniquenessAlsLockedCandidates = [],
    alsDofRecord = null,
    ahsRecord = null,
    ahsRecords = null,
    ahsDofChainRecord = null,
    ahsDofRecord = null,
    alsColorAtFn = () => null,
    alsChainColors = [],
    hashStringFn = value => value,
    cellHasCandidateFn = () => false,
    atomKeyFn = (cell, digit) => `${cell}:${digit}`,
    ahsRecordColor = null,
  } = {}) {
    const activeAlsRecords = alsRecords?.length ? alsRecords : (alsRecord ? [alsRecord] : []);
    const alsRecordCells = new Set(activeAlsRecords.flatMap(record => record.alsAllCells || []));
    const alsRecordMarks = new Set();
    const alsRecordStylesByCell = new Map();
    const alsRecordStyleByAtom = new Map();
    const alsExclusionMarks = new Set();
    const uniquenessRccMarks = new Set();
    for (const link of uniquenessRccLinks) {
      for (const cell of [...(link.leftCells || []), ...(link.rightCells || [])]) {
        uniquenessRccMarks.add(atomKeyFn(cell, link.digit));
      }
    }
    const uniquenessEliminationColorsByAtom = new Map();
    for (const [index, eliminations] of uniquenessEliminationsByAls.entries()) {
      const color = alsColorAtFn(index);
      for (const item of eliminations || []) {
        const atom = atomKeyFn(item.cell, item.digit);
        const colors = uniquenessEliminationColorsByAtom.get(atom) || [];
        if (!colors.includes(color)) colors.push(color);
        uniquenessEliminationColorsByAtom.set(atom, colors);
      }
    }
    const uniquenessUrAlsColorsByAtom = new Map();
    for (const link of uniquenessUrAlsLinks) {
      if (!Number.isInteger(link.alsIndex) || !cellHasCandidateFn(link.cell, link.digit)) continue;
      const color = alsColorAtFn(link.alsIndex);
      const atom = atomKeyFn(link.cell, link.digit);
      const colors = uniquenessUrAlsColorsByAtom.get(atom) || [];
      if (color && !colors.some(existing => existing.bg === color.bg
        && existing.stroke === color.stroke && existing.ink === color.ink)) colors.push(color);
      if (colors.length) uniquenessUrAlsColorsByAtom.set(atom, colors);
    }
    const uniquenessAlsLockedColorsByAtom = new Map();
    for (const item of uniquenessAlsLockedCandidates) {
      if (!Number.isInteger(item.alsIndex) || !cellHasCandidateFn(item.cell, item.digit)) continue;
      uniquenessAlsLockedColorsByAtom.set(atomKeyFn(item.cell, item.digit),
        alsLockedSurplusColorAt(item.alsIndex));
    }
    for (const [index, record] of activeAlsRecords.entries()) {
      const color = alsColorAtFn(index);
      for (const cell of record.alsAllCells || []) {
        const colors = alsRecordStylesByCell.get(cell) || [];
        if (!colors.includes(color)) colors.push(color);
        alsRecordStylesByCell.set(cell, colors);
        for (const digit of record.alsDigits || []) {
          if (!cellHasCandidateFn(cell, digit)) continue;
          const atom = atomKeyFn(cell, digit);
          alsRecordMarks.add(atom);
          alsRecordStyleByAtom.set(atom, color);
          if (alsExclusionDigits.includes(digit)) alsExclusionMarks.add(atom);
        }
      }
    }
    const alsRecordColor = activeAlsRecords.length
      ? alsColorAtFn(0) || alsChainColors[hashStringFn(String(activeAlsRecords[0].uniqueID)) % alsChainColors.length]
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
    const activeAhsRecords = ahsRecords?.length ? ahsRecords : [ahsRecord].filter(Boolean);
    const ahsRecordCells = new Set(activeAhsRecords.flatMap(record => record.ahsAllCells || []));
    const ahsRecordMarks = new Set();
    for (const record of activeAhsRecords) {
      for (const cell of record.ahsAllCells || []) {
        for (const digit of record.ahsDigits || []) {
        if (cellHasCandidateFn(cell, digit)) ahsRecordMarks.add(atomKeyFn(cell, digit));
        }
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
      alsRecordStylesByCell,
      alsRecordStyleByAtom,
      alsExclusionMarks,
      uniquenessRccMarks,
      uniquenessEliminationColorsByAtom,
      uniquenessUrAlsColorsByAtom,
      uniquenessAlsLockedColorsByAtom,
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
