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
    function fromAlsChainResult(result, report, index, candidateGrid) {
      const items = core.eliminationItems({ items: result?.eliminations || [] }, candidateGrid);
      if (!items.length) return null;
      const step = {
        tech: 'als-dof-chain', name: result.name || 'ALS-DOF Chain', structureName: result.name || 'ALS-DOF Chain',
        mode: result.mode || 'chain', isRing: !!result.isRing, ringForm: result.ringForm, size: result.size,
        alsDofRecord: result, alsDofChainReport: report, alsDofChainIndex: index,
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
    function fromAhsResult(result, report, index, candidateGrid) {
      const items = core.eliminationItems({ items: result?.eliminations || [] }, candidateGrid);
      if (!items.length) return null;
      const step = {
        tech: 'ahs-dof', name: result.name || 'AHS - DOF', structureName: result.name || 'AHS - DOF',
        size: result.dof || result.ahsDOF || result.ahsDof || 1, isRing: !!result.isRing,
        record: result, ahsDofReport: report, ahsDofIndex: index,
        desc: core.formatAhsDof({ ...result, eliminations: items }), elim: { items },
        digits: [...new Set(items.map(item => item.digit))],
        at: [...new Set((result.primaryA?.cells || result.hub?.cells || [])
          .concat((result.auxiliary || []).flatMap(node => node.cells || [])))],
      };
      step.rating = rateStep(step);
      return step;
    }
    function fromAhsChainResult(result, report, index, candidateGrid) {
      const items = core.eliminationItems({ items: result?.eliminations || [] }, candidateGrid);
      if (!items.length) return null;
      const step = {
        tech: 'ahs-dof-chain', name: result.name || 'AHS - DOF Chain', structureName: result.name || 'AHS - DOF Chain',
        isRing: !!result.isRing, record: result, ahsDofChainReport: report, ahsDofChainIndex: index,
        desc: core.formatAhsDofChain({ ...result, eliminations: items }), elim: { items },
        digits: [...new Set(items.map(item => item.digit))],
        at: [...new Set((result.nets || []).flatMap(net => [
          ...(net.primaryA?.cells || net.hub?.cells || []),
          ...(net.auxiliary || []).flatMap(node => node.cells || []),
        ]))],
      };
      step.rating = rateStep(step);
      return step;
    }
    return { fromResult, fromAlsChainResult, fromAhsResult, fromAhsChainResult };
  }

  app.dofStep = { create };
})(window);
