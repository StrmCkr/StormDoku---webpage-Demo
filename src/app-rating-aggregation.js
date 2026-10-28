/* StormDoku rating aggregation helpers. */
(function installRatingAggregation(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ rateStep, unknownRating, ratingCategoryForValue, ranks }) {
    function ratingFromSteps(steps, source = 'run') {
      let hardest = null; let score = 0; let scoredMoves = 0;
      for (const step of steps || []) {
        const rating = step.rating || rateStep(step);
        if (!hardest || rating.rank > hardest.rank
          || (rating.rank === hardest.rank && Number(rating.value || -Infinity) > Number(hardest.value || -Infinity))) hardest = rating;
        if (Number.isFinite(rating.value)) { score += rating.value; scoredMoves += 1; }
      }
      return { ...(hardest || unknownRating()),
        category: hardest?.category === 'Unknown' ? 'Unknown' : ratingCategoryForValue(hardest?.value, hardest?.category || 'Unknown'),
        cycles: (steps || []).length, score: Number(score.toFixed(3)), scoredMoves, source };
    }

    function ratingWithSolvedState(rating, solved) {
      if (solved !== false) return { ...rating, solved };
      return { ...rating, rank: ranks.Unknown, value: null, tag: 'Unknown', category: 'Unknown',
        stalledAfter: rating.tag, stalledMove: rating.hardestMove, partialScore: rating.score,
        partialMoves: rating.scoredMoves, hardestMove: '', solved: false };
    }

    function ratingFromLog(entries, solved = null) {
      return ratingWithSolvedState(ratingFromSteps(entries || [], 'run'), solved);
    }

    return { ratingFromSteps, ratingWithSolvedState, ratingFromLog };
  }

  app.ratingAggregation = { create };
})(window);
