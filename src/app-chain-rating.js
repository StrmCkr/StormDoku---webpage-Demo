/* StormDoku chain-rating classifier. */
(function installChainRating(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(dependencies) {
    const {
      unknownRating,
      normalizedChainStructureName,
      chainLinkScoreModifier,
      ratingCategoryForValue,
      ratingDefinition,
      chainLengthOf,
      chainUniqueDigitCount,
      chainMathScore,
      pureXyChainDepth,
      depthScaledChainRating,
      alsSizeOneChainInfo,
      barnsChainInfo,
      barnsTransportChainInfo,
      chainEriCount,
      hiddenXyChainInfo,
    } = dependencies;
    function ratingForChain(chain, step = chain) {
      if (!chain) return unknownRating(step?.desc || '');

      const fullName = normalizedChainStructureName(chain);
      const hierarchyPhase = String(
        step?.hierarchyPhase || chain?.hierarchyPhase || '',
      ).toLowerCase();
      const isAicAls = /^AIC\s*\+\s*ALS(?:\s*-|$)/i.test(fullName);
      const name = fullName
        .replace(/^\s*(?:AIC\s*\+\s*ALS|ALS|AHS|ALC)\s*-\s*/i, '')
        .trim();
      const ringBonus = chain.isRing ? 0.5 : 0;
      // Some chain constructors encode the ring in structureName (for
      // example W-Ring), while others rely on isRing. Never append it twice.
      const ringSuffix = chain.isRing && !/Ring$/i.test(fullName) ? ' Ring' : '';
      const define = (category, value, tag = name) => {
        const finalValue = Number((value + chainLinkScoreModifier(chain)).toFixed(3));
        return {
        ...ratingDefinition(ratingCategoryForValue(finalValue, category), finalValue, tag),
        hardestMove: step?.desc || '',
        };
      };

      // Some worker records preserve the generic AIC structure name even
      // though one of their links is an ALS_RCC expansion. Resolve that
      // identity before the narrower wing/transport fallbacks can relabel it.
      if (/^AIC$/i.test(fullName)
        && (chain.steps || []).some(step => step?.family === 'ALS'
          || String(step?.linkTypeName || '').toUpperCase() === 'ALS_RCC')) {
        return define('Fiendish', 11 + ringBonus, `AIC + ALS Chain${ringSuffix}`);
      }

      const sizeOne = alsSizeOneChainInfo(chain);
      if (sizeOne?.allBivalve && sizeOne.nodeCount === 3 && !sizeOne.remotePair) {
        const value = chainMathScore(3, chain, 3, 2);
        return define(ratingCategoryForValue(value), value,
          `XY-${chain.isRing ? 'Ring' : 'Wing'}`);
      }
      const barns = barnsChainInfo(chain);
      const barnsTransport = barnsTransportChainInfo(chain);
      if (barnsTransport) {
        const size = barnsTransport.sizeName.length;
        const value = size <= 3 ? 4.75 : size === 4 ? 5 : 6;
        return define(ratingCategoryForValue(value + ringBonus), value + ringBonus,
          `T - ${barnsTransport.sizeName.toUpperCase()} ${barnsTransport.form}${ringSuffix}`);
      }
      if (barns) {
        const size = barns.sizeName.length;
        const form = barns.form;
        if (size === 3) {
          const value = chainMathScore(3, chain, 2, 3);
          return define(ratingCategoryForValue(value), value,
            `XYZ ${form}`);
        }
        if (size === 4) {
          const value = chainMathScore(4, chain, 4, 4);
          return define(ratingCategoryForValue(value), value,
            `WXYZ ${form}`);
        }
        if (size === 5) {
          return define('Irritating', 5 + ringBonus,
            `VWXYZ ${form}`);
        }
        if (size === 6) {
          return define('Frustrating', 6 + ringBonus,
            `UVWXYZ ${form}`);
        }
      }

      // T-ALS-XY is the ALS-XY base (8) plus the transport modifier (+1).
      // Keep it separate from generic AIC + ALS and from B.A.R.N.S. transport.
      if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Expert', 9 + ringBonus, `T-ALS-XY${ringSuffix}`);
      }
      // T-ALS-XZ is the ALS-XZ base (7) plus the transport modifier (+1).
      if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `T-ALS-XZ${ringSuffix}`);
      }

      if (/^AIC\s*\+\s*ALS(?:\s*-\s*Chain)?$/i.test(fullName)) {
        return define('Fiendish', 11 + ringBonus, `AIC + ALS Chain${ringSuffix}`);
      }

      if (/^ALS\s*-\s*Chain$/i.test(fullName)) {
        return define('Brutal', 10 + ringBonus, `ALS Chain${ringSuffix}`);
      }
      if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Brutal', 10 + ringBonus, `AHS Chain${ringSuffix}`);
      }
      if (/^ALS\s*-\s*XY$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `ALS - XY${ringSuffix}`);
      }
      if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `AHS - XY${ringSuffix}`);
      }
      if (/^ALS\s*-\s*XZ$/i.test(fullName)) {
        return define('Hard', 7 + ringBonus, `ALS - XZ${ringSuffix}`);
      }
      if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Hard', 7 + ringBonus, `AHS - XZ${ringSuffix}`);
      }
      if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Hard', 7.5 + ringBonus, `ALC - XZ${ringSuffix}`);
      }
      if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8.5 + ringBonus, `ALC - XY${ringSuffix}`);
      }
      if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Brutal', 10.5 + ringBonus, `ALC Chain${ringSuffix}`);
      }
      if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Abyssal', 13.5 + ringBonus, `ALC - DOF Chain${ringSuffix}`);
      }

      const alcNamed = /^ALC\s*-\s*/i.test(fullName)
        && /(?:Wing|Ring)$/i.test(name);
      if (alcNamed) {
        return define('Demanding', 8 + ringBonus, `ALC - ${name}${ringSuffix}`);
      }

      // Ordinary multi-digit AICs belong to the dedicated Hard full-depth
      // phase. Do not let the generic digit-count scorer promote them into
      // Demanding merely because the chain visits several digits. Named ALS,
      // AHS, and ALC phases are classified above and are intentionally left
      // on their own difficulty bands.
      if (hierarchyPhase === 'hard-aic-full-depth'
        && /^AIC$/i.test(fullName)) {
        return define('Hard', 7, `AIC${ringSuffix}`);
      }
      if (hierarchyPhase === 'nightmare-full-aic'
        && /^AIC$/i.test(fullName)) {
        return define('Nightmare', 12, `AIC${ringSuffix}`);
      }

      const alsNamed = (isAicAls || /^ALS\s*-/i.test(fullName))
        && /(?:Wing|Ring)$/i.test(name);
      if (alsNamed && !/^ALS\s*-\s*(?:XZ|XY|Chain)$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `ALS - ${name}${ringSuffix}`);
      }

      const ahsNamed = /^AHS\s*-\s*/i.test(fullName)
        && /(?:Wing|Ring)$/i.test(name);
      if (ahsNamed) {
        return define('Demanding', 8 + ringBonus, `AHS - ${name}${ringSuffix}`);
      }

      const eriCount = chainEriCount(chain);
      // Named ERI structures must be classified by their structural name
      // before the generic ERI-node count fallback below.
      const namedEriStructure = /(?:^|-)\s*(?:Empty Rectangle|Dual Empty Rectangle|Rec'T Kite|Bridged Empty Rectangle|Bridged ERI|\d+x ERI|L\(1\)-Wing|L1-Wing)$/i.test(name);
      if (eriCount > 0 && !namedEriStructure) {
        if (eriCount === 3) {
          const value = chainMathScore(3, chain, 3, 1);
          return define(ratingCategoryForValue(value), value, `3x ERI${ringSuffix}`);
        }
        if (eriCount === 4) {
          const value = chainMathScore(4, chain, 4, 1);
          return define(ratingCategoryForValue(value), value, `4x ERI${ringSuffix}`);
        }
        return define('Irritating', 5 + ringBonus, `ERI Chain${ringSuffix}`);
      }

      const alsSizeOne = sizeOne;
      if (alsSizeOne) {
        if (alsSizeOne.remotePair) {
          const scaled = depthScaledChainRating(chain, 'Remote Pair', 3);
          const value = scaled.value;
          return define(ratingCategoryForValue(value), value, `Remote Pair${ringSuffix}`);
        }
        if (alsSizeOne.breakdown === 'XY-Wing') {
          const value = chainMathScore(3, chain, 3, 3);
          return define(ratingCategoryForValue(value), value, `XY-Wing${ringSuffix}`);
        }
        // A four-node all-bivalent path is the Challenging XY-Chain / ALS-XY
        // form. Keep its native name instead of using the older generic
        // ALS-XY score, which incorrectly placed it above Challenging.
        if (alsSizeOne.allBivalve && alsSizeOne.nodeCount === 4) {
          const value = chainMathScore(4, chain, 4, 2);
          return define(ratingCategoryForValue(value), value, `XY-Chain${ringSuffix}`);
        }
        const scaled = depthScaledChainRating(chain, 'XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `XY-Chain${ringSuffix}`);
      }

      // Pure type-4 paths can be emitted without the older ALS-size-one
      // metadata. They are still XY-Chains, not multi-digit AICs. Score them
      // by depth: 3=Moderate, 4=Challenging, 5=Irritating, 6=Frustrating,
      // and 7+=Hard.
      const pureXyDepth = pureXyChainDepth(chain);
      if (pureXyDepth) {
        const scaled = depthScaledChainRating(chain, 'XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `XY-Chain${ringSuffix}`);
      }

      // A named wing is more specific than the generic Hidden XY-Chain
      // fallback. Some L(2)/L(3) forms use only bilocal links internally,
      // so hiddenXyChainInfo() can recognize the same path as well.
      if (/^(?:L\([23]\)|L[23]|S|M(?:\(\d+\))?|H(?:\(\d+\))?|W|Strong)-?(?:Wing|Ring)$/i.test(name)
        || /^i[SWMLH]/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, name + ringSuffix);
      }

      const hiddenXy = hiddenXyChainInfo(chain);
      if (hiddenXy?.remotePair) {
        const scaled = depthScaledChainRating(chain, 'Hidden Remote Pair', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `Hidden Remote Pair${ringSuffix}`);
      }
      if (hiddenXy) {
        const scaled = depthScaledChainRating(chain, 'Hidden XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `Hidden XY-Chain${ringSuffix}`);
      }

      if (/^XY-Wing$/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `XY-Wing${ringSuffix}`);
      }
      if (/^W\s*-?\s*Transport$/i.test(name) || /W\s*-?\s*Transport/i.test(fullName)) {
        return define('Frustrating', 6.5 + ringBonus, `T - W Transport${ringSuffix}`);
      }
      if (/^T\s*-\s*Transport(?:\s+Ring)?$/i.test(fullName)) {
        return define('Frustrating', 6.5 + ringBonus, `T-Transport${ringSuffix}`);
      }
      if (/^(?:2-String Kite|Empty Rectangle|Skyscraper|Finned X-Wing|Sashimi X-Wing)$/i.test(name)) {
        const value = chainMathScore(2, chain, 2, 2);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      if (/(?:^|-)\s*(?:Dual Empty Rectangle|Rec'T Kite|Bridged Empty Rectangle|Bridged ERI|\d+x ERI|L\(1\)-Wing|L1-Wing)$/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      const eriChainName = name.match(/^(\d+)x ERI$/i);
      if (eriChainName) {
        const eriDepth = Math.max(3, Number(eriChainName[1]));
        const value = chainMathScore(eriDepth, chain, eriDepth, 1);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      if (/^X-Wing$/i.test(name)) return define('Very Easy', 2, 'AIC X-Wing');

      if (/^(?:L\([23]\)|L[23]|S|M(?:\(\d+\))?|H(?:\(\d+\))?|W|Strong)-?(?:Wing|Ring)$/i.test(name)
        || /^i[SWMLH]/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }

      const length = chainLengthOf(chain);
      if (length >= 2) {
        if (chainUniqueDigitCount(chain) !== 1) {
          const base = Math.min(7, Math.max(3, length));
          const value = chainMathScore(base, chain, base, 2);
          return define(ratingCategoryForValue(value), value,
            `AIC${ringSuffix}`);
        }
        const base = Math.min(7, Math.max(3, length));
        const value = chainMathScore(base, chain, base, 1);
        return define(ratingCategoryForValue(value), value,
          `X-Chain (Depth ${length})${ringSuffix}`);
      }

      return unknownRating(step?.desc || '');
    }

    return { ratingForChain };
  }

  app.chainRating = { create };
})(window);
