/* StormDoku chain proof text formatting. */
(function installChainText(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    displayChainForUi,
    alsSizeOneChainInfo,
    barnsChainInfo,
    barnsTransportChainInfo,
  }) {
    function format(chain, verbose = false) {
      if (chain?.alcXz && core.formatAlcXz) return core.formatAlcXz(chain);
      if (chain.ahsXy) return core.formatChainEureka(chain);

      let displayChain = displayChainForUi(chain);
      const barnsInfo = barnsChainInfo(displayChain);
      const barnsTransportInfo = barnsTransportChainInfo(displayChain);
      if (barnsInfo) {
        displayChain = {
          ...displayChain,
          structureName: `${barnsInfo.sizeName} ${barnsInfo.form}`,
        };
      } else if (barnsTransportInfo) {
        displayChain = {
          ...displayChain,
          structureName: `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
        };
      }
      return verbose && core.formatChainVerbose
        ? core.formatChainVerbose(displayChain)
        : core.formatChainEureka
          ? core.formatChainEureka(displayChain)
          : core.formatChain(displayChain);
    }

    return { format };
  }

  app.chainText = { create };
})(window);
