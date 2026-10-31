/* StormDoku B.A.R.N.S. classification helpers. */
(function installBarnsInfo(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ alsChainNodes, chainModuleSubsets }) {
    function barnsSizeName(size) {
      if (!Number.isInteger(size) || size < 1 || size > 26) return null;
      return 'abcdefghijklmnopqrstuvwxyz'.slice(-size);
    }

    function barnsChainInfo(chain) {
      const nodes = alsChainNodes(chain);
      if (!nodes || nodes.length !== 2) return null;

      const cells = new Set(nodes.flatMap(node => node.cells));
      const digits = new Set(nodes.flatMap(node => node.digits));
      for (const step of chain.steps || []) {
        const module = step.module;
        for (const digit of [
          module?.common?.digit,
          ...(module?.common?.digits || []),
          module?.displayLeftRcc,
          module?.displayRightRcc,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
      }
      if (cells.size !== digits.size) return null;

      const sizeName = barnsSizeName(cells.size);
      if (!sizeName) return null;

      return {
        form: chain.isRing ? 'Ring' : 'Wing',
        sizeName,
      };
    }

    function barnsTransportChainInfo(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 2) return null;

      const alsSteps = steps.filter(step =>
        step.family === 'ALS'
        && String(step.linkTypeName || '').toUpperCase() === 'ALS_RCC'
      );
      const strongSteps = steps.filter(step =>
        step.family === 'SL'
        && String(step.linkTypeName || '').toUpperCase() !== 'ALS'
      );
      if (alsSteps.length !== 1 || strongSteps.length !== 1) return null;

      const subsets = chainModuleSubsets(alsSteps[0].module);
      if (!subsets.every(subset => subset?.cells?.length && subset?.digits?.length)) {
        return null;
      }

      const cells = new Set(subsets.flatMap(subset => subset.cells));
      const digits = new Set(subsets.flatMap(subset => subset.digits));
      if (cells.size !== digits.size) return null;

      const sizeName = barnsSizeName(cells.size);
      if (!sizeName) return null;

      return {
        form: chain.isRing ? 'Ring' : 'Wing',
        sizeName,
      };
    }

    return { barnsSizeName, barnsChainInfo, barnsTransportChainInfo };
  }

  app.chainBarnsInfo = { create };
})(window);
