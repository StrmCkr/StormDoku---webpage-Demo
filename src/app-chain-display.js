/* StormDoku chain display normalization helpers. */
(function installChainDisplay(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ normalizedChainStructureName, openXWingSubclass, chainText }) {
    function displayChainForUi(chain) {
      const structureName = normalizedChainStructureName(chain);
      let displayChain = structureName === chain?.structureName
        ? chain
        : { ...chain, structureName };
      if (/^(?:X-Chain|AIC)$/i.test(structureName)) {
        const subclass = openXWingSubclass(chain);
        if (subclass) displayChain = { ...displayChain, structureName: subclass };
      }
      return displayChain;
    }

    function folderChainText(chain, folder) {
      if (folder?.displayName) return folder.displayName;
      return chainText(chain);
    }

    return { displayChainForUi, folderChainText };
  }

  app.chainDisplay = { create };
})(window);
