/* Assemble the current board highlight model from the active report selections. */
(function installCurrentHighlights(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    function currentHighlights() {
      const {
        selectedAlsDofRecord, selectedHydraRecord, selectedChain, chainHighlights,
        mergeChainHighlightView, selectedAlsRecord, selectedAlsRecords, selectedAhsRecord,
        selectedAhsDofChainRecord, selectedAhsDofNetRecord,
        buildAlsAhsHighlightContext, strongLinkDisplayGroups,
        selectedStrongLinkType, selectedStrongLinkIndex,
        buildStrongLinkHighlightContext, selectColouringHighlightRecords,
        activeStep, threeDMedusaMultiReport, multiColoringReport,
        threeDMedusaReport, simpleColoringReport,
        selectedThreeDMedusaMultiIndex, selectedMultiColoringIndex,
        selectedThreeDMedusaIndex, selectedSimpleColoringIndex,
        buildColouringHighlightMarks, lastRemoved, activeCandidateSizeFilters,
        candidateSizeFilterMatches, buildActiveStepHighlightContext,
        activeDigitHighlights, candidateSizeFilterStyle, AHS_RECORD_COLOR,
      } = getContext();

      const selectedDofRecord = selectedAlsDofRecord();
      const hydraRecord = selectedDofRecord?.hasHydra ? selectedDofRecord : selectedHydraRecord();
      const hydraChains = [...new Set((hydraRecord?.hydraBranches || [])
        .map(branch => branch.chain).filter(Boolean))];
      if (!hydraChains.length) hydraChains.push(...(hydraRecord?.participants || [])
        .map(participant => participant.chain).filter(Boolean));
      const chain = selectedChain() || hydraChains[0] || null;
      const chainView = chainHighlights(chain);
      for (const extraChain of hydraChains) {
        if (extraChain === chain) continue;
        const extraView = chainHighlights(extraChain);
        mergeChainHighlightView(chainView, extraView);
      }
      const alsRecord = activeStep?.alsRecord || selectedAlsRecord();
      const alsRecords = activeStep?.alsRecords?.length
        ? activeStep.alsRecords
        : (selectedAlsRecords ? selectedAlsRecords() : [alsRecord].filter(Boolean));
      const alsDofRecord = selectedDofRecord || hydraRecord;
      const ahsRecord = activeStep?.ahsRecord || selectedAhsRecord();
      const ahsRecords = activeStep?.ahsRecords?.length ? activeStep.ahsRecords : null;
      const ahsDofChainRecord = selectedAhsDofChainRecord();
      const ahsDofRecord = ahsDofChainRecord ? null : selectedAhsDofNetRecord();
      const alsAhsHighlights = buildAlsAhsHighlightContext({
        alsRecord,
        alsRecords,
        alsExclusionDigits: activeStep?.alsExclusionDigits || [],
        uniquenessRccLinks: activeStep?.uniquenessRccLinks || [],
        uniquenessEliminationsByAls: activeStep?.uniquenessEliminationsByAls || [],
        uniquenessUrAlsLinks: activeStep?.uniquenessUrAlsLinks || [],
        uniquenessAlsLockedCandidates: activeStep?.uniquenessAlsLockedCandidates || [],
        alsDofRecord,
        ahsRecord,
        ahsRecords,
        ahsDofChainRecord,
        ahsDofRecord,
      });
      const {
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
        ahsDofRecordColor,
      } = alsAhsHighlights;
      const selectedStrongLinkGroup = strongLinkDisplayGroups()[selectedStrongLinkType] || [];
      const strongLink = selectedStrongLinkType === null || selectedStrongLinkIndex === null
        ? null
        : selectedStrongLinkGroup[selectedStrongLinkIndex] || null;
      const strongLinkMarks = buildStrongLinkHighlightContext({
        strongLink,
        selectedStrongLinkType,
      });
      const {
        startMarks: strongLinkStartMarks,
        endMarks: strongLinkEndMarks,
        partitionByCell: strongLinkPartitionByCell,
      } = strongLinkMarks;
      const colouringRecords = selectColouringHighlightRecords({
        blocked: Boolean((activeStep && activeStep.tech !== 'colouring') || chain || alsRecord || alsDofRecord
          || ahsRecord || ahsDofRecord || strongLink),
        reports: {
          medusaMulti: threeDMedusaMultiReport,
          multi: multiColoringReport,
          medusa: threeDMedusaReport,
          simple: simpleColoringReport,
        },
        indices: {
          medusaMulti: selectedThreeDMedusaMultiIndex,
          multi: selectedMultiColoringIndex,
          medusa: selectedThreeDMedusaIndex,
          simple: selectedSimpleColoringIndex,
        },
      });
      const {
        medusaMulti: threeDMedusaMultiRecord,
        multi: multiColoringRecord,
        medusa: threeDMedusaRecord,
        colouring: colouringRecord,
        activeMulti: activeMultiColoringRecord,
        simple: simpleColoringRecord,
      } = colouringRecords;
      const colouringMarks = buildColouringHighlightMarks({
        simpleRecord: simpleColoringRecord,
        colouringRecord,
        activeMultiRecord: activeMultiColoringRecord,
      });
      const {
        simple: simpleColoringMarks,
        simpleEliminations: simpleColoringElimMarks,
        medusa: threeDMedusaMarks,
        medusaEliminations: threeDMedusaElimMarks,
        medusaInvalid: threeDMedusaInvalidMarks,
        multi: multiColoringMarks,
        multiEliminations: multiColoringElimMarks,
      } = colouringMarks;
      const removed = lastRemoved;
      const chainRemoved = chain?.eliminations || [];
      const activeStepRemoved = activeStep?.elim?.items || [];
      const highlightContext = buildActiveStepHighlightContext({
        activeStep,
        removed,
        chainRemoved,
        activeStepRemoved,
        activeCandidateSizeFilters,
        candidateSizeFilterMatches,
      });
      const {
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
      } = highlightContext;

      return {
        activeDigits: activeDigitHighlights,
        isHydra: !!hydraRecord,
        hydraChains,
        candidateSizeFilterCells,
        candidateSizeFilterStyle: candidateSizeFilterStyle(),
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
        isChromatic: !!chromaticRecord,
        chromaticRecord,
        chromaticCells,
        chromaticCoreCells,
        chromaticGuardians,
        chromaticDigits,
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
        isChain: !!chain,
        isAlsRecord: alsRecords.length > 0,
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
        isAlsDof: !!alsDofRecord,
        alsDofRecord,
        alsDofCells,
        alsDofStyleByCell,
        alsDofStylesByCell,
        alsDofMarks,
        alsDofStyleByAtom,
        alsDofElimMarks,
        isAhsRecord: !!ahsRecord,
        ahsRecordCells,
        ahsRecordMarks,
        ahsRecordColor: ahsRecord ? AHS_RECORD_COLOR : null,
        isAhsDof: !!(ahsDofRecord || ahsDofChainRecord),
        ahsDofRecord,
        ahsDofRecordCells,
        ahsDofRecordMarks,
        ahsDofRecordElimMarks,
        ahsDofRecordColor: (ahsDofRecord || ahsDofChainRecord) ? AHS_RECORD_COLOR : null,
        ahsDofChainRecord,
        isStrongLink: !!strongLink,
        strongLink: strongLink && selectedStrongLinkType === 3
          && strongLink.secondaryXorConstruction?.kind === 'eri'
          ? {
              ...strongLink,
              activeCells: [...(strongLink.secondaryXorConstruction.activeCells || strongLink.activeCells || [])],
              linkedCells: [...(strongLink.secondaryXorConstruction.linkedCells || strongLink.linkedCells || [])],
            }
          : strongLink,
        strongLinkStartMarks,
        strongLinkEndMarks,
        strongLinkPartitionByCell,
        isSimpleColoring: !!simpleColoringRecord,
        simpleColoringRecord,
        simpleColoringMarks,
        simpleColoringElimMarks,
        isMultiColoring: !!activeMultiColoringRecord,
        multiColoringRecord: activeMultiColoringRecord,
        multiColoringMarks,
        multiColoringElimMarks,
        isThreeDMedusa: !!colouringRecord,
        threeDMedusaRecord: colouringRecord,
        threeDMedusaMarks,
        threeDMedusaElimMarks,
        threeDMedusaInvalidMarks,
        chain,
        chainMarks: chainView.marks,
        chainXorEntryMarks: chainView.xorEntryMarks,
        chainXorExitMarks: chainView.xorExitMarks,
        chainWeakMarks: chainView.weakMarks,
        chainAlsMarks: chainView.alsMarks,
        chainAlsStyleByCell: chainView.alsStyleByCell,
        chainAlsStyleByAtom: chainView.alsStyleByAtom,
        chainAhsMarks: chainView.ahsMarks,
        chainAhsStyleByCell: chainView.ahsStyleByCell,
        chainAhsStyleByAtom: chainView.ahsStyleByAtom,
        chainStartMarks: chainView.startMarks,
        chainEndMarks: chainView.endMarks,
        chainCells: chainView.cells,
        chainAlsCells: chainView.alsCells,
        chainAhsCells: chainView.ahsCells,
        chainAlsEntryCells: chainView.alsEntryCells,
        chainAlsExitCells: chainView.alsExitCells,
        chainStartCells: chainView.startCells,
        chainEndCells: chainView.endCells,
        chainOrderByCell: chainView.orderByCell,
      };
    }

    return { currentHighlights };
  }

  app.currentHighlights = { create };
})(window);
