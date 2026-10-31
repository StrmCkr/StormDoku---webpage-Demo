/* StormDoku ALS/AHS classification information helpers. */
(function installAlsInfo(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ alsChainNodes }) {
    function alsOnlyChainInfo(chain) {
      const nodes = alsChainNodes(chain);
      if (!nodes || nodes.length < 2) return null;

      const nodeCount = nodes.length;
      if (nodeCount === 2) {
        return {
          category: 'ALS - XZ rule',
          subcategory: chain.isRing
            ? '(2) RCC Rule - Double Linked Rule'
            : '(1) RCC Rule',
          subclass: null,
        };
      }
      if (nodeCount === 3) {
        return {
          category: 'ALS - XY rule',
          subcategory: chain.isRing
            ? '(3) RCC Rule - Triple Link Rule'
            : '(2) RCC Rule',
          subclass: null,
        };
      }

      return {
        category: 'ALS - Chain',
        subcategory: chain.isRing
          ? 'N ALS / N RCC Rule'
          : 'N ALS / N - 1 RCC Rule',
        subclass: chain.isRing ? 'Ring' : null,
      };
    }

    function alsNamedChainInfo(chain) {
      const match = String(chain.structureName || '').match(/^ALS\s*-\s*(XZ|XY|Chain)$/i);
      if (!match) return null;

      const name = match[1].toUpperCase();
      if (name === 'XZ') {
        return {
          category: 'ALS - XZ rule',
          subcategory: chain.isRing
            ? '(2) RCC Rule - Double Linked Rule'
            : '(1) RCC Rule',
          subclass: null,
        };
      }
      if (name === 'XY') {
        return {
          category: 'ALS - XY rule',
          subcategory: chain.isRing
            ? '(3) RCC Rule - Triple Link Rule'
            : '(2) RCC Rule',
          subclass: null,
        };
      }
      return {
        category: 'ALS - Chain',
        subcategory: chain.isRing
          ? 'N ALS / N RCC Rule'
          : 'N ALS / N - 1 RCC Rule',
        subclass: chain.isRing ? 'Ring' : null,
      };
    }

    function ahsXzChainInfo(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 1) return null;
      const step = steps[0];
      if (step.family !== 'AHS'
        || String(step.linkTypeName || '').toUpperCase() !== 'AHS_RCC') {
        return null;
      }

      const moduleKind = String(step.module?.moduleKind || '').toUpperCase();
      if (!['AHS_XZ', 'AHS_XZ_RING'].includes(moduleKind)) return null;

      const doubleRcc = moduleKind === 'AHS_XZ_RING'
        || (step.module?.ringRccCells || []).length === 2;
      return {
        category: 'AHS - XZ rule',
        subcategory: doubleRcc
          ? '{2} RCC Rule - Double Linked Rule'
          : '(1) RCC Rule',
        subclass: doubleRcc ? '2 RCC' : null,
      };
    }

    return { alsOnlyChainInfo, alsNamedChainInfo, ahsXzChainInfo };
  }

  app.chainAlsInfo = { create };
})(window);
