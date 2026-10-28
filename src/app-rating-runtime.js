/* StormDoku pure rating helpers. */
(function installRatingRuntime(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(ratingData) {
    const ranks = ratingData.ranks;
    const scoreBands = ratingData.scoreBands;
    const colors = ratingData.colors;

    function normalizeRatingCategory(category) {
      const value = String(category ?? '').trim();
      if (!value || /^any$/i.test(value)) return 'Any';
      if (/^unknown$/i.test(value)) return 'Unknown';
      return value;
    }

    function ratingCategoryColorClass(category) {
      return `rating-category-${colors[normalizeRatingCategory(category)] || 'unknown'}`;
    }

    function ratingCategoryForValue(value, fallback = 'Unknown') {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return fallback;
      const band = scoreBands.find(({ min, max }) => numeric >= min && numeric <= max);
      return band?.category || fallback;
    }

    function generationTechniqueProfile(category) {
      const normalizedCategory = normalizeRatingCategory(category);
      if (normalizedCategory === 'Any' || normalizedCategory === 'Unknown') return null;
      const maxRank = ranks[normalizedCategory];
      if (!Number.isFinite(maxRank)) return null;

      const moveTypes = new Set();
      const addAt = (rank, ...types) => {
        if (maxRank < rank) return;
        for (const type of types) moveTypes.add(type);
      };
      addAt(0, 'last-man-standing');
      addAt(10, 'hidden-single', 'naked-single', 'box-line');
      addAt(20, 'hidden-pair', 'naked-pair', 'x-wing', 'aic-x-wing', 'chains', 'x-chain', 'chain-x-wing');
      addAt(30, '2x2+k-fish', 'empty-rectangle', '2-string-kite', 'skyscraper', 'finned-x-wing', 'sashimi-x-wing');
      addAt(40, 'hidden-triple', 'naked-triple', 'swordfish');
      addAt(50, '3x3+k-fish', 'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain', 'l1-wing', 'xy-wing', 'barns', 'als-xz', 's-wing', 'm2-wing', 'm3-wing', 'l2-wing', 'l3-wing', 'h1-wing', 'h2-wing', 'h3-wing', 'w-wing', 'strong-wing');
      addAt(60, 'hidden-quad', 'naked-quad', 'jellyfish');
      addAt(70, '4x4+k-fish');
      addAt(50, 'xy-chain');
      addAt(70, 'barns-transport');
      addAt(90, 'inversion', 'barns-transport');
      addAt(100, 'als-xz', 'ahs-xz', 'alc-xz');
      addAt(100, 'remote-pair', 'hidden-xy-chain', 'hidden-remote-pair');
      addAt(110, 'als-named', 'ahs-named', 'alc-named', 't-als-xz', 't-ahs-xz', 't-alc-xz', 'als-xy', 'ahs-xy', 'alc-xy');
      addAt(120, 't-als-xy', 't-ahs-xy', 't-alc-xy', 'aic-als');
      addAt(130, 'als-chain', 'ahs-chain', 'alc-chain');
      addAt(150, 'als-dof', 'ahs-dof', 'alc-dof', 'dds', 'adds');
      addAt(160, 'msls');
      addAt(170, 'ahs-dof-chain');
      addAt(170, 'als-dof-chain');

      const strongLinkTypes = maxRank >= 50 ? [0, 1, 2, 3, 4]
        : maxRank >= 30 ? [0, 1, 2, 3]
          : maxRank >= 20 ? [0] : [];
      const maxDepth = maxRank <= 30 ? 2 : maxRank <= 50 ? 3 : maxRank <= 70 ? 4 : 8;
      const maxFishSize = maxRank < 80 ? 4 : maxRank < 90 ? 5 : maxRank < 100 ? 6 : maxRank < 110 ? 7 : maxRank < 120 ? 8 : 9;
      const subsetSizes = maxRank >= 120 ? [5, 6, 7, 8, 9] : maxRank >= 110 ? [5, 6, 7, 8] : maxRank >= 100 ? [5, 6, 7] : maxRank >= 90 ? [5, 6] : maxRank >= 80 ? [5] : [];
      const basicFishSizes = maxRank >= 120 ? [5, 6, 7, 8, 9] : maxRank >= 110 ? [5, 6, 7, 8] : maxRank >= 100 ? [5, 6, 7] : maxRank >= 90 ? [5, 6] : maxRank >= 80 ? [5] : [];

      return { moveTypes, maxRank, maxDepth, maxFishSize, subsetSizes, basicFishSizes, strongLinkTypes,
        includeAlsRcc: maxRank >= 50,
        alsMaxDigits: maxRank >= 170 ? 9 : maxRank >= 150 ? 5 : null,
        alsMaxSizeDOF: maxRank >= 150 ? Math.min(8, Math.max(1, Math.floor((maxRank - 140) / 2))) : null,
        alsMaxSizeFox: maxRank >= 150 ? Math.min(8, Math.max(2, Math.floor((maxRank - 140) / 2) + 1)) : null,
        alsMaxAuxiliary: maxRank >= 170 ? 8 : maxRank >= 150 ? 2 : null,
        alsSearchLimit: maxRank >= 150,
        scalingTier: Math.max(0, Math.floor(maxRank / 10)) };
    }

    function ratingDefinition(category, value, tag, tech = null, rank = null) {
      return { category, rank: rank ?? ranks[normalizeRatingCategory(category)] ?? ranks.Unknown, value, tag, ...(tech ? { tech } : {}) };
    }

    function formatRatingValue(value) {
      if (!Number.isFinite(value)) return '';
      return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    }

    const ratingTags = Object.freeze(ratingData.tags.map(({ category, value, tag, tech }) =>
      ratingDefinition(category, value, tag, tech)));

    return { normalizeRatingCategory, ratingCategoryColorClass, ratingCategoryForValue,
      generationTechniqueProfile, ratingDefinition, formatRatingValue, ratingTags };
  }

  app.ratingRuntime = { create };
})(window);
