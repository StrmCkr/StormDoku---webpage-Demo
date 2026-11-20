/* Independent completion check for proposed candidate eliminations. */
(function installEliminationVerifier(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state }) {
    function verify(items) {
      const proposed = (items || []).filter(item =>
        Number.isInteger(item?.cell) && Number.isInteger(item?.digit));
      if (!proposed.length) return { ok: true, checked: 0 };
      if (!state.solution || !state.puzzle?.some(Boolean)) {
        return { ok: true, checked: 0, skipped: true };
      }

      const seen = new Set();
      for (const item of proposed) {
        const key = `${item.cell}:${item.digit}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!(state.cand[item.cell] || []).includes(item.digit)) {
          return { ok: false, errors: [`${core.cellName(item.cell)}<>${item.digit} is no longer a candidate.`] };
        }

        const forced = [...state.puzzle];
        if (forced[item.cell] && forced[item.cell] !== item.digit) {
          return { ok: false, errors: [`${core.cellName(item.cell)} is already fixed.`] };
        }
        forced[item.cell] = item.digit;
        const completions = typeof core.countSolutionsDlx === 'function'
          ? core.countSolutionsDlx(forced, 1)
          : core.solveDlx(forced, 1).count;
        if (completions > 0) {
          return {
            ok: false,
            errors: [`${core.cellName(item.cell)}=${item.digit} still permits a completion.`],
            rejected: item,
          };
        }
      }
      return { ok: true, checked: seen.size };
    }

    return { verify };
  }

  app.eliminationVerifier = { create };
})(window);
