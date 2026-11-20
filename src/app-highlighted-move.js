/* Resolve the selected report or active step to its applicable move. */
(function installHighlightedMove(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext }) {
    function highlightedMoveStep() {
          const {
            activeStep,
            selectedAhsDofChainRecord,
            modularAhsDofChainStepFromResult,
            ahsDofChainReport,
            selectedAhsDofChainIndex,
            cand,
            selectedAhsDofNetRecord,
            modularAhsDofStepFromResult,
            ahsDofReport,
            selectedAhsDofNetIndex,
            selectedAlsDofRecord,
            selectedAlsDofSource,
            alsDofStepFromResult,
            alsDofChainReport,
            selectedAlsDofIndex,
            selectedHydraRecord,
            alsHydraStepFromResult,
            selectedAlsHydraIndex,
            selectedFishStep,
            selectedBoxLineStep,
            selectedChromaticGraphIndex,
            chromaticGraphReport,
            chromaticStepFromResult,
            selectedChromaticAlsGraphIndex,
            chromaticAlsGraphReport,
            selectedSubsetStep,
            selectedChainStep,
            selectedChainIndex,
            alcXzReport,
            alcXyReport,
            alcChainReport,
            alcDofReport,
            chainStepFromResult,
            selectedMslsIndex,
            mslsReport,
            mslsStepFromResult,
            selectedSimpleColoringIndex,
            simpleColoringReport,
            colouringStepFromResult,
            selectedThreeDMedusaIndex,
            threeDMedusaReport,
            selectedMultiColoringIndex,
            multiColoringReport,
            selectedThreeDMedusaMultiIndex,
            threeDMedusaMultiReport
          } = getContext();
      if (activeStep?.elim?.items?.length || activeStep?.tech === 'last-man-standing') {
        return activeStep;
      }
    
      const ahsDofChain = selectedAhsDofChainRecord();
      if (ahsDofChain) {
        return modularAhsDofChainStepFromResult(
          ahsDofChain,
          ahsDofChainReport,
          selectedAhsDofChainIndex,
          cand,
        );
      }
      const ahsDof = selectedAhsDofNetRecord();
      if (ahsDof) {
        return modularAhsDofStepFromResult(ahsDof, ahsDofReport, selectedAhsDofNetIndex, cand);
      }
      const alsDof = selectedAlsDofRecord();
      if (alsDof) {
        return selectedAlsDofSource === 'chain'
          ? alsDofStepFromResult(alsDof, alsDofChainReport, selectedAlsDofIndex, cand)
          : alsDofStepFromResult(alsDof, alsDofReport, selectedAlsDofIndex, cand);
      }
      const hydra = selectedHydraRecord();
      if (hydra) return alsHydraStepFromResult(hydra, selectedAlsHydraIndex, cand);
    
      const fish = selectedFishStep();
      if (fish) return fish;
      const boxLine = selectedBoxLineStep();
      if (boxLine) return boxLine;
      if (selectedChromaticGraphIndex !== null && chromaticGraphReport?.results?.[selectedChromaticGraphIndex]) {
        return chromaticStepFromResult(chromaticGraphReport.results[selectedChromaticGraphIndex]);
      }
      if (selectedChromaticAlsGraphIndex !== null
        && chromaticAlsGraphReport?.results?.[selectedChromaticAlsGraphIndex]) {
        return chromaticStepFromResult(
          chromaticAlsGraphReport.results[selectedChromaticAlsGraphIndex],
        );
      }
      const hiddenSubset = selectedSubsetStep('hidden');
      if (hiddenSubset) return hiddenSubset;
      const nakedSubset = selectedSubsetStep('naked');
      if (nakedSubset) return nakedSubset;
      const chain = selectedChainStep();
      if (chain) return chain;
    
      if (selectedChainIndex !== null) {
        const dedicated = [
          alcXzReport,
          alcXyReport,
          alcChainReport,
          alcDofReport,
        ].find(report => report?.chains?.[selectedChainIndex]);
        if (dedicated) {
          return chainStepFromResult(
            dedicated.chains[selectedChainIndex],
            dedicated,
            selectedChainIndex,
            cand,
          );
        }
      }
    
      if (selectedMslsIndex !== null && mslsReport?.results?.[selectedMslsIndex]) {
        return mslsStepFromResult(mslsReport.results[selectedMslsIndex]);
      }
      if (selectedSimpleColoringIndex !== null && simpleColoringReport?.[selectedSimpleColoringIndex]) {
        return colouringStepFromResult(simpleColoringReport[selectedSimpleColoringIndex], 'simple');
      }
      if (selectedThreeDMedusaIndex !== null && threeDMedusaReport?.[selectedThreeDMedusaIndex]) {
        return colouringStepFromResult(threeDMedusaReport[selectedThreeDMedusaIndex], 'medusa');
      }
      if (selectedMultiColoringIndex !== null && multiColoringReport?.[selectedMultiColoringIndex]) {
        return colouringStepFromResult(multiColoringReport[selectedMultiColoringIndex], 'multi');
      }
      if (selectedThreeDMedusaMultiIndex !== null && threeDMedusaMultiReport?.[selectedThreeDMedusaMultiIndex]) {
        return colouringStepFromResult(
          threeDMedusaMultiReport[selectedThreeDMedusaMultiIndex],
          'medusaMulti',
        );
      }
      return null;
    }

    return { highlightedMoveStep };
  }

  app.highlightedMove = { create };
})(window);
