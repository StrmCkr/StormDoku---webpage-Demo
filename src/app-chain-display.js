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
      const formatted = chainText(chain);
      if (!folder?.displayName) return formatted;
      const separator = formatted.indexOf(':');
      const context = separator >= 0 ? formatted.slice(separator + 1).trim() : formatted;
      return context
        ? `${folder.displayName}: ${context}`
        : folder.displayName;
    }

    return { displayChainForUi, folderChainText };
  }

  app.chainDisplay = { create };
})(window);
