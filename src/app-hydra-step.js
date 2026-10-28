/* StormDoku Hydra presentation and step adapter. */
(function installHydraStep(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, rateStep }) {
    function format(result) {
      const hub = result?.primaryA?.alsDigits || result?.primaryA?.digits || [];
      const hubCells = result?.primaryA?.alsAllCells || result?.primaryA?.cells || [];
      const endpoint = result?.primaryC?.alsDigits || result?.primaryC?.digits || [];
      const auxiliaryById = new Map((result?.auxiliary || []).map(node => [node.hydraParticipantId, node]));
      const aicChains = (result?.participants || []).map(participant => participant.chain).filter(Boolean)
        .map(chain => core.formatChainEureka ? core.formatChainEureka(chain) : (chain.structureName || 'AIC'));
      const hydraBranches = (result?.hydraBranches || []).map((branch, index) => {
        const rcc = branch.rcc || {};
        const left = core.cellGroupName(rcc.leftCells || []);
        const right = core.cellGroupName(rcc.rightCells || []);
        const auxiliary = auxiliaryById.get(branch.participantId) || branch.ls || {};
        const lsDigits = auxiliary.alsDigits || auxiliary.digits || [];
        const lsCells = auxiliary.alsAllCells || auxiliary.cells || [];
        const chain = branch.chain ? (core.formatChainEureka ? core.formatChainEureka(branch.chain) : (branch.chain.structureName || 'AIC')) : 'AIC';
        return `${String.fromCharCode(65 + index)}: (${rcc.digit ?? '?'})${left}=${right} -> LS {${lsDigits.join('')}}${core.cellGroupName(lsCells)} -> ${chain}`;
      });
      const chainCount = hydraBranches.length || (result?.participants || []).length;
      const elims = core.formatRemovals?.(result?.eliminations || [])
        || (result?.eliminations || []).map(item => `r${Math.floor(item.cell / 9) + 1}c${item.cell % 9 + 1}<>${item.digit}`).join(', ');
      const branchText = hydraBranches.length ? hydraBranches.join(' ; ') : 'No RCC-to-LS AIC branches';
      const terminal = endpoint.length ? `; terminal {${endpoint.join('')}}` : '';
      const family = result?.family || (result?.type === 'HYDRA_AHS_DOF' ? 'AHS' : 'ALS');
      return `Hydra ${family}-DOF: Hub {${hub.join('')}}${core.cellGroupName(hubCells)}; ${branchText}${terminal}`
        + ` [${chainCount} AIC branch${chainCount === 1 ? '' : 'es'}${aicChains.length && !hydraBranches.length ? `: ${aicChains.join(' || ')}` : ''}] => ${elims || '?'}`;
    }

    function fromResult(result, index, candidateGrid) {
      const items = core.eliminationItems({ items: result?.eliminations || [] }, candidateGrid);
      if (!items.length) return null;
      const at = [...(result.primaryA?.cells || result.primaryA?.alsAllCells || []), ...(result.primaryC?.cells || result.primaryC?.alsAllCells || []),
        ...(result.auxiliary || []).flatMap(node => node.cells || node.alsAllCells || []),
        ...(result.participants || []).flatMap(participant => participant.chainCells || [])];
      const step = { tech: 'als-hydra', name: `Hydra ${result?.family || 'ALS'} - DOF`, structureName: `Hydra ${result?.family || 'ALS'} - DOF`,
        hydraRecord: result, hydraIndex: index, desc: format({ ...result, eliminations: items }), elim: { items },
        digits: [...new Set(items.map(item => item.digit))], at: [...new Set(at)] };
      step.rating = rateStep(step);
      return step;
    }
    return { format, fromResult };
  }

  app.hydraStep = { create };
})(window);
