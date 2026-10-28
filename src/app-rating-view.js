/* StormDoku rating summary view. */
(function installRatingView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ elements, formatRatingValue, ratingCategoryForValue, ratingCategoryColorClass }) {
    function render(ratingReport) {
      const { summary, stepCount, category, detail, hardestMove } = elements;
      if (!ratingReport) { summary.hidden = true; return; }
      summary.hidden = false;
      stepCount.textContent = String(ratingReport.cycles ?? ratingReport.partialMoves ?? 0);
      const ratingCategory = ratingReport.category || ratingCategoryForValue(ratingReport.value);
      category.className = `rating-summary-category ${ratingCategoryColorClass(ratingCategory)}`;
      category.textContent = ratingCategory;
      if (ratingReport.solved === false) {
        detail.textContent = formatRatingValue(ratingReport.partialScore ?? ratingReport.score) || '0';
        hardestMove.textContent = 'Unknown';
        return;
      }
      detail.textContent = formatRatingValue(ratingReport.score) || '0';
      hardestMove.textContent = ratingReport.hardestMove
        ? `${ratingReport.tag} (${formatRatingValue(ratingReport.value)})` : 'Unknown';
    }
    return { render };
  }

  app.ratingView = { create };
})(window);
