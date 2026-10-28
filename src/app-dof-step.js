/* StormDoku ALS-DOF result-to-step adapter. */
(function installDofStep(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, rateStep }) {
    function fromResult(result, report, index, candidateGrid) {
      const items = core.eliminationItems({ items: result?.eliminations || [] }, candidateGrid);
      if (!items.length) return null;
      const step = {
        tech: 'als-dof', name: result.name, structureName: result.name, mode: result.mode,
        isRing: !!result.isRing, ringForm: result.ringForm, size: result.size,
        alsDofRecord: result, alsDofReport: report, alsDofIndex: index,
        desc: core.formatAlsDof({ ...result, eliminations: items }), elim: { items },
        digits: [...new Set(items.map(item => item.digit))],
        at: [...new Set((result.primaryA?.cells || [])
          .concat((result.auxiliary || []).flatMap(node => node.cells || []))
          .concat(result.primaryC?.cells || [])
          .concat((result.hydraBranches || []).flatMap(branch => branch.chainCells || [])))],
      };
      step.rating = rateStep(step);
      return step;
    }
    return { fromResult };
  }

  app.dofStep = { create };
})(window);
