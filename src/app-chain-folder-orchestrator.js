/* StormDoku chain-folder branch orchestration. */
(function installChainFolderOrchestrator(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    chainEriCount,
    chainFolderInfo,
    chainFolderAls,
    chainFolderX,
    chainFolderWings,
    chainLocationDedupe,
  }) {
    function chainFolderInfos(chain) {
      const eriCount = chainEriCount(chain);
      const primary = chainFolderInfo(chain);
      const locations = [];
      locations.push(...chainFolderAls.locations(chain, primary));
      locations.push(...chainFolderX.locations(chain, eriCount));
      locations.push(...chainFolderWings.locations(chain));
      if (!locations.length) locations.push(primary);
      return chainLocationDedupe.uniqueLocations(locations);
    }

    return { chainFolderInfos };
  }

  app.chainFolderOrchestrator = { create };
})(window);
