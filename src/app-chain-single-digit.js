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
        const chainDigits = new Set([
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ].map(Number).filter(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9));
        for (const digit of chainDigits) allDigits.add(digit);
        const typeNames = [
          step.linkTypeName,
          ...(Array.isArray(step.linkTypeNames) ? step.linkTypeNames : []),
        ].map(name => String(name || '').toUpperCase());
        const isEri = step.family === 'SL'
          && (Number(step.linkType) === core.ERI || typeNames.includes('ERI'));
        if (!isEri) {
          allStepsAreEri = false;
          continue;
        }
        if (chainDigits.size !== 1) return 0;
        count += 1;
      }

      return allStepsAreEri && count > 0 && allDigits.size === 1 ? count : 0;
    }

    function isEriOnlyXChain(chain) {
      const steps = chain?.steps || [];
      if (!steps.length) return false;

      const digits = new Set();
      for (const step of steps) {
        const stepDigits = new Set();
        for (const value of [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ]) {
          const digit = Number(value);
          if (Number.isInteger(digit) && digit >= 1 && digit <= 9) {
            stepDigits.add(digit);
            digits.add(digit);
          }
        }
        if (stepDigits.size !== 1) return false;
        const names = [
          step.linkTypeName,
          ...(Array.isArray(step.linkTypeNames) ? step.linkTypeNames : []),
        ].map(name => String(name || '').toUpperCase());
        if (step.family !== 'SL'
          || (Number(step.linkType) !== core.ERI && !names.includes('ERI'))) return false;
      }
      if (digits.size !== 1) return false;
      return true;
    }

    function emptyRectangleChain(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 2 || steps.some(step => step.family !== 'SL')) return false;
      const digits = new Set();
      let eriCount = 0;
      for (const step of steps) {
        const stepDigits = new Set([
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
        ].map(Number).filter(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9));
        for (const digit of stepDigits) digits.add(digit);
        if (stepDigits.size !== 1) return false;
        const names = [
          step.linkTypeName,
          ...(Array.isArray(step.linkTypeNames) ? step.linkTypeNames : []),
        ].map(name => String(name || '').toUpperCase());
        const isEri = Number(step.linkType) === core.ERI || names.includes('ERI');
        const isBilocal = Number(step.linkType) === 0 || names.includes('BILOCAL');
        if (isEri) eriCount += 1;
        else if (!isBilocal) return false;
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
      const genericSingleDigitChain = /^(?:X-Chain|AIC)$/i.test(rawName);
      const explicitEriName = /^\d+x ERI$/i.test(name);
      if ((genericSingleDigitChain || explicitEriName)
        && isEriOnlyXChain(chain)
        && (eriCount > 0 || explicitEriName)) {
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
