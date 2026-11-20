/* Eureka text selection for the currently highlighted search result. */
(function installHighlightedEureka(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    getActiveStep,
    getChainText,
    getChromaticGraph,
    getChromaticGraphEureka,
    getSelectedAhsDofChainRecord,
    getSelectedAhsDofNetRecord,
    getSelectedAlsDofRecord,
    getSelectedHydraRecord,
    getHydraResultText,
    getSelectedFishStep,
    getSelectedBoxLineStep,
    getSelectedSubsetStep,
    getSelectedChainStep,
  }) {
    function selectedFishEureka() {
      return getSelectedFishStep()?.desc || '';
    }

    function selectedSubsetEureka(kind) {
      return getSelectedSubsetStep(kind)?.desc || '';
    }

    function selectedChainEureka() {
      return getSelectedChainStep()?.desc || '';
    }

    function highlightedEurekaText() {
      const activeStep = getActiveStep();
      if (activeStep?.chain) return getChainText()(activeStep.chain);
      if (activeStep?.desc) return activeStep.desc;
      const chromaticGraph = getChromaticGraph();
      if (chromaticGraph) return getChromaticGraphEureka()(chromaticGraph);
      const ahsDofChain = getSelectedAhsDofChainRecord();
      if (ahsDofChain) return `AHS-DOF Chain: ${core.formatAhsDofChain(ahsDofChain)}`;
      const ahsDof = getSelectedAhsDofNetRecord();
      if (ahsDof) return `AHS-DOF: ${core.formatAhsDofNet(ahsDof)}`;
      const alsDof = getSelectedAlsDofRecord();
      if (alsDof) return core.formatAlsDof(alsDof);
      const hydra = getSelectedHydraRecord();
      if (hydra) return getHydraResultText()(hydra);
      return selectedFishEureka()
        || getSelectedBoxLineStep()?.desc
        || selectedSubsetEureka('hidden')
        || selectedSubsetEureka('naked')
        || selectedChainEureka();
    }

    return { highlightedEurekaText };
  }

  app.highlightedEureka = { create };
})(window);
