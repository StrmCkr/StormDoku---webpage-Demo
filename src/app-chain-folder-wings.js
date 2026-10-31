/* StormDoku named wing/ring hierarchy branch builder. */
(function installChainFolderWings(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ wChainType, splitChainType, strongChainType, inversionChainType }) {
    function locations(chain) {
      const result = [];
      const wType = wChainType(chain);
      if (wType) {
        result.push({
          family: 'W - Wing | Ring',
          wing: wType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
      }

      const splitType = splitChainType(chain);
      if (splitType) {
        result.push({
          family: 'Split - Wing',
          wing: splitType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
      }

      const strongType = strongChainType(chain);
      if (strongType) {
        result.push({
          family: 'Strong Wing | Ring',
          wing: strongType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
        result.push({
          family: 'Hidden XY-Chain',
          wing: 'Strong Wing | Ring',
          rank: strongType,
          subclass: null,
          path: [strongType],
        });
      }

      const inversionType = inversionChainType(chain);
      if (inversionType) {
        result.push({
          family: 'Inversion',
          wing: inversionType,
          rank: null,
          subclass: null,
        });
      }
      return result;
    }

    return { locations };
  }

  app.chainFolderWings = { create };
})(window);
