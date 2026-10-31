/* StormDoku X-chain hierarchy branch builder. */
(function installChainFolderX(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ xChainType, chainUniqueDigitCount }) {
    function locations(chain, eriCount = 0) {
      const result = [];
      const xType = xChainType(chain, eriCount);
      if (xType) {
        const isEriFamily = xType === 'Empty Rectangle';
        const name = String(chain.structureName || '')
          .replace(/^\s*(?:ALS|AHS)\s*-\s*/i, '');
        const finnedSashimi = name.match(/^(Finned|Sashimi) X-Wing$/i);
        const eriSubclass = /^(?:Dual Empty Rectangle|Rec'T Kite|Bridged ERI|Bridged Empty Rectangle|3x ERI)$/i.test(name)
          ? name.replace(/^Bridged Empty Rectangle$/i, 'Bridged ERI')
          : null;
        const l1Subclass = /^Dual Empty Rectangle$/i.test(name)
          ? 'Dual Empty Rectangle'
          : /^Rec'T Kite$/i.test(name)
            ? "Rec'T Kite"
            : /^(?:Bridged ERI|Bridged Empty Rectangle)$/i.test(name)
              ? 'Bridged Rectangles'
              : null;
        const shortXChain = /^(?:2-String Kite|Empty Rectangle|Finned X-Wing|Sashimi X-Wing|Skyscraper|X-Wing|ERI Chain|L\(1\))$/i.test(xType);
        const namedPath = xType === 'L(1)'
          ? ['Local Wing | Ring', 'L(1)', chain.isRing ? 'Ring' : null, l1Subclass].filter(Boolean)
          : shortXChain
            ? [xType]
            : [
                'Single Digit Named Chains',
                xType,
                finnedSashimi
                  ? `${finnedSashimi[1][0].toUpperCase()}${finnedSashimi[1].slice(1).toLowerCase()} X-Wing`
                  : xType === 'X-Wing' ? null
                    : isEriFamily && eriSubclass ? eriSubclass : null,
              ].filter(Boolean);
        result.push({
          family: 'X-Chains',
          wing: xType,
          rank: xType === 'L(1)' && l1Subclass
            ? l1Subclass
            : xType === 'ERI Chain'
              ? `ERI(${eriCount})`
              : finnedSashimi
                ? `${finnedSashimi[1][0].toUpperCase()}${finnedSashimi[1].slice(1).toLowerCase()} X-Wing`
                : xType === 'X-Wing' ? null
                  : isEriFamily && eriSubclass ? eriSubclass : null,
          subclass: null,
          path: namedPath,
        });
        return result;
      }

      if (/^(?:X-Chain|AIC)$/i.test(String(chain.structureName || '').trim())) {
        const genericSteps = chain.steps || [];
        const usesOnlyAicTypes = genericSteps.length > 0
          && genericSteps.every(step => Number(step.linkType) >= 1 && Number(step.linkType) <= 4);
        if (chainUniqueDigitCount(chain) > 1 && usesOnlyAicTypes) {
          result.push({ family: 'A.I.C', wing: null, rank: null, subclass: null, path: [] });
        } else if (chainUniqueDigitCount(chain) === 1) {
          result.push({ family: 'X-Chains', wing: 'Generic', rank: null, subclass: null, path: ['Generic'] });
        }
      }
      return result;
    }

    return { locations };
  }

  app.chainFolderX = { create };
})(window);
