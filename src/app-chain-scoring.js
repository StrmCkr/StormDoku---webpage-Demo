/* StormDoku pure chain scoring helpers. */
(function installChainScoring(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  const solverTieOrder = Object.freeze({
    'last-man-standing': 0,
    'hidden-single': 1,
    'naked-single': 2,
    'box-line': 3,
    'hidden-pair': 4,
    'naked-pair': 5,
    'x-wing': 6,
    'aic-x-wing': 7,
    'x-chain-2': 7,
    skyscraper: 8,
    '2-string-kite': 9,
    'finned-x-wing': 10,
    'sashimi-x-wing': 11,
    'empty-rectangle': 12,
    '2x2+k-fish-k1': 13,
    '2x2+k-fish-k2': 14,
    'hidden-triple': 15,
    'naked-triple': 16,
    swordfish: 17,
    'l1-wing': 18,
    '3x-eri': 19,
    'dual-empty-rectangle': 20,
    'rect-kite': 21,
    'bridged-eri': 22,
    'x-chain-3': 22.5,
    '3x3+k-fish-k1': 23,
    '3x3+k-fish-k2': 24,
    barns: 25,
    'xy-wing': 26,
    'hidden-quad': 27,
    'naked-quad': 28,
    jellyfish: 29,
    '4x4+k-fish-k1': 30,
    '4x-eri': 31,
    'x-chain-4': 32,
    '4x4+k-fish-k2': 33,
    'barns-xyz-transport': 34,
    'barns-wxyz': 35,
    'x-chain-long': 36,
    'eri-chain-long': 37,
    'remote-pair': 38,
    'xy-chain': 39,
    'hidden-remote-pair': 40,
    'hidden-xy-chain': 41,
    'hidden-xy-ring': 42,
    'l2-wing': 43,
    'l3-wing': 44,
    'w-wing': 45,
    'w-transport': 46,
    's-wing': 47,
    'm-wing': 48,
    'h-wing': 49,
    'barns-wxyz-transport': 50,
    'als-xz': 51,
    'ahs-xz': 51.5,
    't-als-xz': 52,
    'als-xy': 53,
    'ahs-xy': 53.5,
    't-als-xy': 54,
    'als-named': 55,
    'als-chain': 56,
    'ahs-chain': 56.5,
    'aic-als': 57,
    'aic-generic': 58,
    'als-dof': 58,
    dds: 59,
    adds: 60,
    'ahs-dof': 61,
    'ahs-dof-chain': 62,
    'alc-xz': 63,
    'alc-xy': 64,
    'alc-chain': 65,
    'alc-dof': 66,
  });

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

  function directMoveTieKey(step, alsDofMoveKey = () => '') {
    const tech = String(step?.tech || '');
    if (tech === 'pointing' || tech === 'claiming' || tech === 'non-consecutive-line'
      || tech === 'non-consecutive-eri' || tech === 'non-consecutive-als'
      || tech === 'non-consecutive-als-dof' || tech === 'non-consecutive-als-dof-peer') return 'box-line';
    if (tech === 'als-dof') return alsDofMoveKey(step);
    if (tech === 'fish') {
      const size = Number(step?.size);
      const k = Number(step?.k || 0);
      if (size === 2 && k === 0) return 'x-wing';
      if (size === 2 && k === 1) return '2x2+k-fish-k1';
      if (size === 2 && k === 2) return '2x2+k-fish-k2';
      if (size === 3 && k === 0) return 'swordfish';
      if (size === 3 && k === 1) return '3x3+k-fish-k1';
      if (size === 3 && k === 2) return '3x3+k-fish-k2';
      if (size === 4 && k === 0) return 'jellyfish';
      if (size === 4 && k === 1) return '4x4+k-fish-k1';
      if (size === 4 && k === 2) return '4x4+k-fish-k2';
    }
    return tech;
  }

  function moveTieOrder(chain, step, chainKey, directKey, tieOrder) {
    const key = chain ? chainKey(chain) : directKey(step);
    return tieOrder[key] ?? Number.POSITIVE_INFINITY;
  }

  function directMovePriority(step, ratingForStep, tieOrder) {
    const rating = step?.rating || ratingForStep(step);
    const value = Number.isFinite(Number(rating.value))
      ? Number(rating.value)
      : Number.POSITIVE_INFINITY;
    return [
      rating.category === 'Unknown' ? Number.POSITIVE_INFINITY : value,
      tieOrder(step),
      0,
      0,
      0,
    ];
  }

  function solverMovePriority(chain, step, searchDepth, reportIndex, ratingForStep, tieOrder, complexity) {
    const rating = step.rating || ratingForStep(step);
    const value = rating.category === 'Unknown'
      ? Number.POSITIVE_INFINITY
      : Number.isFinite(Number(rating.value))
        ? Number(rating.value)
        : Number.POSITIVE_INFINITY;
    const length = Number(chain.length || chain.steps?.length || searchDepth || Infinity);
    return [value, tieOrder(chain, step), complexity(chain), length, searchDepth, reportIndex];
  }

  function isHigherPriorityMove(candidate, current) {
    if (!current) return true;
    const nextPriority = candidate.priority;
    const currentPriority = current.priority;
    for (let index = 0; index < nextPriority.length; index++) {
      if (nextPriority[index] !== currentPriority[index]) {
        return nextPriority[index] < currentPriority[index];
      }
    }
    return false;
  }

  function chooseBestSolverMove(choices, buildChainPriority, buildDirectPriority) {
    let best = null;
    for (const choice of choices || []) {
      if (!choice?.step) continue;
      const candidate = {
        ...choice,
        priority: choice.priority || (choice.chain
          ? buildChainPriority(choice)
          : buildDirectPriority(choice.step)),
      };
      if (isHigherPriorityMove(candidate, best)) best = candidate;
    }
    if (!best) return null;
    const { priority, ...result } = best;
    return result;
  }

  app.chainScoring = {
    solverTieOrder,
    chainLengthOf, chainUniqueDigitCount, chainMathScore, pureXyChainDepth,
    depthScaledChainRating, directMoveTieKey, moveTieOrder, directMovePriority,
    solverMovePriority, isHigherPriorityMove, chooseBestSolverMove,
  };
})(window);
