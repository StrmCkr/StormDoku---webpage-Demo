/* Automatic promotion discovery and application for solver steps. */
(function installPromotionController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state }) {
    function promotionsForStep(step, removed) {
      const promotions = new Map();
      const addPromotion = (cell, digit, mode = 'singleton', sector = null) => {
        if (state.puzzle[cell] || !(state.cand[cell] || []).includes(digit)) return;
        const key = `${cell}:${digit}`;
        if (!promotions.has(key)) promotions.set(key, { cell, digit, mode, sector, tech: step?.tech });
      };

      for (const item of removed || []) {
        const cell = item.cell;
        if (!state.puzzle[cell] && (state.cand[cell] || []).length === 1) {
          addPromotion(cell, state.cand[cell][0]);
        }
      }

      if (['naked-single', 'hidden-single'].includes(step?.tech)
        || step?.tech === 'last-man-standing') {
        for (const cell of step.at || step.vertices || []) {
          if (!state.puzzle[cell] && (state.cand[cell] || []).length === 1) {
            addPromotion(cell, state.cand[cell][0]);
          }
        }
      }

      if (step?.tech?.startsWith('hidden-')) {
        const unitIndex = Number.isInteger(Number(step.genericSubset?.sector))
          ? Number(step.genericSubset.sector)
          : step.base?.type === 'row'
            ? Number(step.base.indices?.[0])
            : step.base?.type === 'col'
              ? 9 + Number(step.base.indices?.[0])
              : step.base?.type === 'box'
                ? 18 + Number(step.base.indices?.[0])
                : ['variant-sector', 'diagonal', 'anti-diagonal'].includes(step.base?.type)
                  ? Number(step.base.indices?.[0])
                  : -1;
        const unit = unitIndex >= 0 && unitIndex < core.UNITS.length
          ? core.UNITS[unitIndex]
          : [];
        const subsetCells = new Set(step.at || step.vertices || []);
        const hiddenPlacements = [];

        for (const digit of step.digits || []) {
          const locations = unit.filter(cell =>
            !state.puzzle[cell] && (state.cand[cell] || []).includes(digit),
          );
          if (locations.length === 1 && subsetCells.has(locations[0])) {
            hiddenPlacements.push({ cell: locations[0], digit });
          }
        }

        // Two selected digits sharing one cell are a bivalue choice, not two placements.
        const placementsByCell = new Map();
        for (const placement of hiddenPlacements) {
          const digits = placementsByCell.get(placement.cell) || [];
          digits.push(placement.digit);
          placementsByCell.set(placement.cell, digits);
        }
        for (const placement of hiddenPlacements) {
          if ((placementsByCell.get(placement.cell) || []).length === 1) {
            addPromotion(placement.cell, placement.digit, 'hidden-subset', unitIndex);
          }
        }
      }

      return [...promotions.values()]
        .sort((a, b) => a.cell - b.cell || a.digit - b.digit);
    }

    function queuePromotions(step, removed) {
      state.promotionQueue = promotionsForStep(step, removed);
      return state.promotionQueue;
    }

    function applyQueuedPromotions() {
      const pending = state.promotionQueue.splice(0);
      const promoted = [];

      for (const promotion of pending) {
        const { cell, digit } = promotion;
        if (state.puzzle[cell] || !(state.cand[cell] || []).includes(digit)) continue;

        if (promotion.mode === 'hidden-subset') {
          const unitIndex = Number(promotion.sector);
          const locations = unitIndex >= 0 && unitIndex < core.UNITS.length
            ? core.UNITS[unitIndex].filter(other =>
              !state.puzzle[other] && (state.cand[other] || []).includes(digit),
            )
            : [];
          if (locations.length !== 1 || locations[0] !== cell) continue;
        } else if ((state.cand[cell] || []).length !== 1 || state.cand[cell][0] !== digit) {
          continue;
        }
        if (typeof core.canPlace === 'function' && !core.canPlace(state.puzzle, cell, digit)) {
          continue;
        }

        state.puzzle[cell] = digit;
        state.promotedValues[cell] = digit;
        state.cand[cell] = [];
        promoted.push(promotion);

        // Recompute candidates after each promotion, including active variants.
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || state.puzzle[other] || state.promotedValues[other]) continue;
          const legal = new Set(core.candidatesFor(state.puzzle, other));
          state.cand[other] = (state.cand[other] || []).filter(value => legal.has(value));
        }
      }

      return promoted;
    }

    return { promotionsForStep, queuePromotions, applyQueuedPromotions };
  }

  app.promotionController = { create };
})(window);
