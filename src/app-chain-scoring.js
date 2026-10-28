/* StormDoku pure chain scoring helpers. */
(function installChainScoring(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function chainLengthOf(chain) {
    return Number(chain?.length || chain?.steps?.length || 0);
  }

  function chainUniqueDigitCount(chain) {
    const digits = new Set();
    for (const step of chain?.steps || []) {
      for (const digit of step.entry?.digits || []) digits.add(Number(digit));
      for (const digit of step.exit?.digits || []) digits.add(Number(digit));
      if (step.weakDigit != null) digits.add(Number(step.weakDigit));
      if (step.weakFromDigit != null) digits.add(Number(step.weakFromDigit));
      if (step.weakToDigit != null) digits.add(Number(step.weakToDigit));
    }
    return [...digits].filter(Number.isFinite).length;
  }

  function chainMathScore(baseScore, chain, canonicalLength = baseScore, canonicalDigits = baseScore) {
    const length = chainLengthOf(chain);
    const actualDigits = Array.isArray(chain?.uniqueDigits) ? chain.uniqueDigits.length : Number(chain?.uniqueDigitCount);
    const digitExcess = Number.isFinite(actualDigits) ? Math.max(0, actualDigits - canonicalDigits) : 0;
    const lengthExcess = Number.isFinite(length) ? Math.max(0, length - canonicalLength) : 0;
    const closure = chain?.isRing ? 0.5 : 0.25;
    return Number((baseScore + lengthExcess + digitExcess + closure).toFixed(3));
  }

  function pureXyChainDepth(chain) {
    const steps = chain?.steps || [];
    if (steps.length < 2 || !steps.every(step => step.family === 'SL' && Number(step.linkType) === 4
      && (step.entry?.cells || []).length === 1 && (step.exit?.cells || []).length === 1)) return 0;
    return chainLengthOf(chain);
  }

  function depthScaledChainRating(chain, label, minimumDepth = 3) {
    const depth = Math.max(minimumDepth, chainLengthOf(chain));
    const base = Math.min(7, depth);
    return { value: chainMathScore(base, chain, depth, 2), label: `${label} (Depth ${depth})` };
  }

  app.chainScoring = { chainLengthOf, chainUniqueDigitCount, chainMathScore, pureXyChainDepth, depthScaledChainRating };
})(window);
