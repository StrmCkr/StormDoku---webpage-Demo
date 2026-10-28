/* StormDoku small, pure rating helpers. */
(function installRatingScoring(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(ratingData) {
    function unknownRating(move = '') {
      return { rank: ratingData.ranks.Unknown, value: null, tag: 'Unknown', category: 'Unknown',
        hardestMove: move, cycles: 0, score: 0, scoredMoves: 0, source: 'run' };
    }

    function fishScoreForSize(size, k = 0, fishCategory = 'Basic') {
      const fishSize = Number(size);
      const fishK = Number(k);
      if (!Number.isInteger(fishSize) || fishSize < 2 || !Number.isInteger(fishK) || fishK < 0) return null;
      if (fishSize > 7 || fishK > 2) return null;
      const modifier = String(fishCategory || 'Basic').toLowerCase();
      const shapeModifier = modifier === 'franken' ? 0.125 : modifier === 'mutant' ? 0.25 : 0;
      return Number((fishSize + (fishK * 0.25) + shapeModifier).toFixed(3));
    }

    return { unknownRating, fishScoreForSize };
  }

  app.ratingScoring = { create };
})(window);
