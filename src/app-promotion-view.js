/* StormDoku promotion status formatting. */
(function installPromotionView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create(cellName) {
    function summary(promotions) {
      if (!promotions.length) return '';
      const values = promotions.map(({ cell, digit }) => `${cellName(cell)} = ${digit}`);
      return `${promotions.length} solved value${promotions.length === 1 ? '' : 's'}: ${values.join(', ')}`;
    }
    return { summary };
  }
  app.promotionView = { create };
})(window);
