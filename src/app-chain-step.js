/* StormDoku chain-step construction helpers. */
(function installChainStep(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, displayChainForUi, chainText, defaultCandidateGrid }) {
    function fromResult(chain, report, index, candidateGrid = defaultCandidateGrid) {
      chain = displayChainForUi(chain);
      const explanationGrid = report?.candidateGrid || candidateGrid;
      const items = core.eliminationItems({ items: chain.eliminations || [] }, explanationGrid);
      const displayedChain = { ...chain, eliminations: items };
      return {
        tech: 'chain',
        name: displayedChain.structureName,
        structureName: displayedChain.structureName,
        chainLength: displayedChain.length,
        chain: displayedChain,
        chainReport: report,
        chainIndex: index,
        desc: chainText(displayedChain),
        elim: { items },
        digits: [...new Set(items.map(item => item.digit))],
        at: [...new Set((displayedChain.steps || []).flatMap(step => [
          ...(step.entry?.cells || []),
          ...(step.exit?.cells || []),
        ]))],
        vertices: [...new Set((displayedChain.steps || []).flatMap(step => [
          ...(step.entry?.cells || []),
          ...(step.exit?.cells || []),
        ]))],
      };
    }

    return { fromResult };
  }

  app.chainStep = { create };
})(window);
