/* StormDoku single-digit chain classification helpers. */
(function installSingleDigitChainHelpers(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, openXWingSubclass }) {
    function chainEriCount(chain) {
      const steps = chain.steps || [];
      if (!steps.length) return 0;

      const allDigits = new Set();
      let count = 0;
      let allStepsAreEri = true;

      for (const step of steps) {
        const names = Array.isArray(step.linkTypeNames)
          ? step.linkTypeNames
          : [step.linkTypeName];
        const chainDigits = [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ].filter(Number.isInteger);
        for (const digit of chainDigits) allDigits.add(digit);
        const isEri = step.linkType === core.ERI
          || names.some(name => String(name || '').toUpperCase() === 'ERI');
        if (!isEri) {
          allStepsAreEri = false;
          continue;
        }
        if (!chainDigits.length) return 0;
        count += 1;
      }

      return allStepsAreEri && count > 0 && allDigits.size === 1 ? count : 0;
    }

    function isEriOnlyXChain(chain) {
      const steps = chain?.steps || [];
      if (!steps.length) return false;

      const digits = new Set();
      for (const step of steps) {
        for (const digit of [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
      }
      if (digits.size !== 1) return false;

      return steps.every(step => {
        const names = [
          step.linkTypeName,
          ...(Array.isArray(step.linkTypeNames) ? step.linkTypeNames : []),
        ].map(name => String(name || '').toUpperCase());
        return step.family === 'SL'
          && (step.linkType === core.ERI || names.includes('ERI'));
      });
    }

    function emptyRectangleChain(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 2) return false;
      const digits = new Set();
      let eriCount = 0;
      for (const step of steps) {
        for (const digit of [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
        const names = [step.linkTypeName, ...(step.linkTypeNames || [])]
          .map(name => String(name || '').toUpperCase());
        if (step.linkType === core.ERI || names.includes('ERI')) eriCount += 1;
      }
      return digits.size === 1 && eriCount === 1;
    }

    function xChainType(chain, eriCount) {
      const rawName = String(chain.structureName || '');
      const subclass = /^(?:X-Chain|AIC)$/i.test(rawName)
        ? openXWingSubclass(chain)
        : null;
      const name = String(subclass || rawName)
        .replace(/^\s*(?:(?:AIC\s*\+\s*)?ALS|AHS)\s*-\s*/i, '');
      if (/^X-Wing$/i.test(name)) return 'X-Wing';
      if (/^(?:L\(1\)-(?:Wing|Ring)|L1-(?:Wing|Ring)|Dual Empty Rectangle|Rec'T Kite|Bridged ERI|Bridged Empty Rectangle)$/i.test(name)) {
        return 'L(1)';
      }
      if (/^\d+x ERI$/i.test(name) || (eriCount > 0 && isEriOnlyXChain(chain))) {
        return 'ERI Chain';
      }
      if (emptyRectangleChain(chain)) return 'Empty Rectangle';
      if (/^(?:Finned|Sashimi) X-Wing$/i.test(name)) return name;
      if (/^(?:2-String Kite|Skyscraper|X-Wing)$/i.test(name)) return name;
      return null;
    }

    return { chainEriCount, isEriOnlyXChain, emptyRectangleChain, xChainType };
  }

  app.chainSingleDigit = { create };
})(window);
