/* StormDoku ALS/AHS hierarchy branch builder. */
(function installChainFolderAls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    barnsChainInfo,
    barnsTransportChainInfo,
    hiddenXyChainInfo,
    alsOnlyChainInfo,
    alsNamedChainInfo,
    ahsXzChainInfo,
    alsSizeOneChainInfo,
  }) {
    function locations(chain, primary) {
      const result = [];
      const barnsInfo = barnsChainInfo(chain);
      const barnsTransportInfo = barnsTransportChainInfo(chain);
      const hiddenXyInfo = hiddenXyChainInfo(chain);
      const alsInfo = alsOnlyChainInfo(chain) || alsNamedChainInfo(chain);
      const namedAlsWing = String(chain.structureName || '').match(
        /^(?:AIC\s*\+\s*)?ALS\s*-\s*([LMH])(?:\(\d+\))?\s*-\s*(Wing|Ring)$/i,
      );

      const genericXFamily = /^X\s*-\s*Chains?$/i.test(String(primary.family || ''))
        || /^X\s*Chains?$/i.test(String(primary.family || ''));
      if (!genericXFamily
        && !/^ALS$/i.test(String(primary.family || ''))
        && !namedAlsWing
        && !/^Local(?: -)? Wing \| Ring$/i.test(String(primary.family || ''))
        && primary.family !== 'ERI - Chain'
        && ((primary.family === 'AIC + ALS' && primary.wing) || (primary.wing && primary.rank))) {
        result.push(primary);
      }

      const localRank = String(primary.rank || '').match(/^L(?:\((\d+)\)|(\d+))$/i);
      if (/^Local(?: -)? Wing \| Ring$/i.test(String(primary.family || ''))
        && localRank
        && Number(localRank[1] || localRank[2]) >= 2) {
        result.push({
          family: 'Hidden XY-Chain',
          wing: 'Local Wing | Ring',
          rank: primary.rank,
          subclass: null,
        });
      }

      if (namedAlsWing) {
        const rankType = namedAlsWing[1].toUpperCase();
        const form = namedAlsWing[2][0].toUpperCase() + namedAlsWing[2].slice(1).toLowerCase();
        const namedForm = `${rankType}-Wing/Ring`;
        result.push({
          family: 'A.I.C',
          wing: namedForm,
          rank: null,
          subclass: `ALS - ${namedForm}`,
          displayName: `ALS - ${namedForm}`,
        });
      }

      if (alsInfo && !barnsInfo) {
        result.push({
          family: 'Almost Locked Sets',
          wing: alsInfo.category,
          rank: alsInfo.subcategory,
          subclass: alsInfo.subclass,
        });
      }

      const ahsInfo = ahsXzChainInfo(chain);
      if (ahsInfo) {
        result.push({
          family: 'Almost Hidden Sets',
          wing: ahsInfo.category,
          rank: ahsInfo.subcategory,
          subclass: ahsInfo.subclass,
        });
      }

      if (barnsInfo) result.push({
        family: 'Almost Locked Sets',
        wing: 'ALS - XZ rule',
        rank: null,
        subclass: null,
        path: ['ALS - XZ rule', 'B.A.R.N.S.', barnsInfo.sizeName],
      });
      if (barnsTransportInfo) result.push({
        family: 'Almost Locked Sets',
        wing: 'ALS - XZ rule',
        rank: null,
        subclass: null,
        displayName: `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
        path: [
          'ALS - XZ rule',
          'B.A.R.N.S.',
          'Transport',
          `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
        ],
      });

      if (hiddenXyInfo?.remotePair) result.push({
        family: 'Hidden XY-Chain',
        wing: 'Hidden Remote Pair',
        rank: hiddenXyInfo.form === 'Ring' ? 'Ring' : null,
        subclass: null,
      });

      const xyChainInfo = alsSizeOneChainInfo(chain);
      if (xyChainInfo) {
        const type4Only = (chain.steps || []).length > 0
          && (chain.steps || []).every(step =>
            step.family === 'SL' && Number(step.linkType) === 4
          );
        if (type4Only) {
          const xyBranch = xyChainInfo.remotePair
            ? 'Remote Pair'
            : xyChainInfo.breakdown === 'XY-Wing' ? 'XY - Wing' : 'Generic';
          result.push({
            family: 'XY - Chain',
            wing: xyBranch,
            rank: null,
            subclass: null,
            path: [xyBranch, chain.isRing ? 'Ring' : null].filter(Boolean),
          });
        } else if (!xyChainInfo.remotePair) {
          result.push({
            family: 'Almost Locked Sets',
            wing: 'XY - Chain',
            rank: xyChainInfo.breakdown,
            subclass: xyChainInfo.subclass,
          });
        } else {
          result.push({
            family: 'Remote Pair',
            wing: chain.isRing ? 'Ring' : 'Wing',
            rank: null,
            subclass: null,
          });
        }
      }
      return result;
    }

    return { locations };
  }

  app.chainFolderAls = { create };
})(window);
