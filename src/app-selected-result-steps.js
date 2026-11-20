/* Selected search-result to solution-step adapters. */
(function installSelectedResultSteps(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    getFishReport,
    getSelectedFishKey,
    fishStepFromReport,
    getSubsetReport,
    getSubsetKey,
    subsetStepFromReport,
    getBoxLineReport,
    getSelectedBoxLineIndex,
    getChainReport,
    getSelectedChainIndex,
    getChainStepFromResult,
    getCandidates,
  }) {
    function selectedFishStep() {
      const report = getFishReport();
      const key = getSelectedFishKey();
      if (!report || !key) return '';
      const separator = key.lastIndexOf(':');
      const category = key.slice(0, separator);
      const index = Number(key.slice(separator + 1));
      const fish = report.filter(item => item.category === category)[index];
      return fish ? fishStepFromReport(fish) : null;
    }

    function selectedSubsetStep(kind) {
      const report = getSubsetReport(kind);
      const key = getSubsetKey(kind);
      if (!report || !key) return null;
      const [sizeText, indexText] = key.split(':');
      const size = Number(sizeText);
      const index = Number(indexText);
      const item = report.filter(record => record.size === size)[index];
      return item ? subsetStepFromReport(kind, item) : null;
    }

    function selectedBoxLineStep() {
      return getBoxLineReport()?.[getSelectedBoxLineIndex()] || null;
    }

    function selectedChainStep() {
      const report = getChainReport();
      const index = getSelectedChainIndex();
      const chain = report?.chains?.[index];
      return chain ? getChainStepFromResult()(chain, report, index, getCandidates()) : null;
    }

    return { selectedFishStep, selectedSubsetStep, selectedBoxLineStep, selectedChainStep };
  }

  app.selectedResultSteps = { create };
})(window);
