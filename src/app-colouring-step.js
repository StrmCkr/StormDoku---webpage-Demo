/* StormDoku colouring result adapters. */
(function installColouringStep(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create(context) {
    const { core, getCandidates, getSolution, getPuzzle, displayRecord, eureka } = context;

    function safetyFlags(record) {
      return [...new Set([
        ...(record?.safetyFlags || []),
        ...context.chainSafetyFlags(
          { eliminations: record?.eliminations || [] },
          getCandidates(), getSolution(), getPuzzle(),
        ),
      ])];
    }

    function annotate(records) {
      return (records || []).map(record => ({ ...record, safetyFlags: safetyFlags(record) }));
    }

    function stepFromResult(record, method) {
      const displayed = displayRecord(record, method);
      const items = core.eliminationItems({ items: displayed?.eliminations || [] }, getCandidates());
      if (!items.length) return null;
      const names = {
        simple: 'Simple Colouring',
        medusa: '3D-Medusa',
        multi: 'Multi-colouring',
        superMulti: 'Super Multi-colouring',
        medusaMulti: '3D-Medusa {Multi-colouring}',
      };
      const name = names[method] || 'Colouring';
      return {
        tech: 'colouring', name, structureName: name,
        desc: eureka[method](displayed),
        elim: { items },
        digits: [...new Set(items.map(item => item.digit))],
        at: [...new Set((displayed.nodes || []).map(node => node.cell).filter(Number.isInteger))],
        colouringRecord: displayed,
        colouringMethod: method,
      };
    }

    return { annotate, stepFromResult };
  }

  app.colouringStep = { create };
})(window);
