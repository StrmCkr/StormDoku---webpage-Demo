/* Chain naming, node inspection, and folder-classification runtime assembly. */
(function installChainRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, chainClassification, chainModuleSubsets, chainUniqueDigitCount }) {
    const chainNaming = app.chainNaming.create();
    const chainSingleDigit = app.chainSingleDigit.create({
      core,
      openXWingSubclass: chainClassification.openXWingSubclass,
    });
    const chainNodeAnalysis = app.chainNodeAnalysis.create({ chainModuleSubsets });
    const chainAlsInfo = app.chainAlsInfo.create({
      alsChainNodes: chain => chainNodeAnalysis.alsChainNodes(chain),
    });
    const chainBarnsInfo = app.chainBarnsInfo.create({
      alsChainNodes: chain => chainNodeAnalysis.alsChainNodes(chain),
      chainModuleSubsets,
    });
    const chainXyInfo = app.chainXyInfo.create({ chainModuleSubsets, core });
    const chainFolderInfoView = app.chainFolderInfo.create();
    const chainLocationDedupe = app.chainLocationDedupe.create();
    const chainFolderX = app.chainFolderX.create({
      xChainType: (...args) => chainSingleDigit.xChainType(...args),
      chainUniqueDigitCount,
    });
    const chainFolderWings = app.chainFolderWings.create({
      wChainType: (...args) => chainNaming.wChainType(...args),
      splitChainType: (...args) => chainNaming.splitChainType(...args),
      strongChainType: (...args) => chainNaming.strongChainType(...args),
      inversionChainType: (...args) => chainNaming.inversionChainType(...args),
    });
    const chainFolderAls = app.chainFolderAls.create({
      barnsChainInfo: (...args) => chainBarnsInfo.barnsChainInfo(...args),
      barnsTransportChainInfo: (...args) => chainBarnsInfo.barnsTransportChainInfo(...args),
      hiddenXyChainInfo: (...args) => chainXyInfo.hiddenXyChainInfo(...args),
      alsOnlyChainInfo: (...args) => chainAlsInfo.alsOnlyChainInfo(...args),
      alsNamedChainInfo: (...args) => chainAlsInfo.alsNamedChainInfo(...args),
      ahsXzChainInfo: (...args) => chainAlsInfo.ahsXzChainInfo(...args),
      alsSizeOneChainInfo: (...args) => chainXyInfo.alsSizeOneChainInfo(...args),
    });
    const chainFolderOrchestrator = app.chainFolderOrchestrator.create({
      chainEriCount: (...args) => chainSingleDigit.chainEriCount(...args),
      chainFolderInfo: (...args) => chainFolderInfoView.chainFolderInfo(...args),
      chainFolderAls,
      chainFolderX,
      chainFolderWings,
      chainLocationDedupe,
    });

    return {
      chainNaming,
      chainSingleDigit,
      chainNodeAnalysis,
      chainAlsInfo,
      chainBarnsInfo,
      chainXyInfo,
      chainFolderInfoView,
      chainFolderX,
      chainFolderWings,
      chainFolderAls,
      chainFolderOrchestrator,
    };
  }

  app.chainRuntime = { create };
})(window);
