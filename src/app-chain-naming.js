/* StormDoku chain naming and small structural type helpers. */
(function installChainNaming(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create() {
    function chainNameWithoutAffix(chain) {
      return String(chain.structureName || '')
        .replace(/^\s*(?:(?:AIC\s*\+\s*)?(?:ALS|AHS)|ALC)\s*-\s*/i, '');
    }

    function wChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      if (/^W-Wing$/i.test(name)) return 'Wing';
      if (/^W-Ring$/i.test(name)) return 'Ring';
      if (/^(?:T\s*-\s*)?Transport$/i.test(name)) return 'Transport';
      return null;
    }

    function splitChainType(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 3) return null;
      const isStrong = step => step.family === 'SL'
        && step.linkType !== 4
        && String(step.linkTypeName || '').toUpperCase() !== 'ALS';
      return isStrong(steps[0])
        && ['ALS', 'AHS'].includes(steps[1].family)
        && ['ALS_RCC', 'AHS_RCC'].includes(String(steps[1].linkTypeName || '').toUpperCase())
        && isStrong(steps[2])
        ? 'Wing'
        : null;
    }

    function strongChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      const match = name.match(/^Strong[- ](Wing|Ring)$/i);
      return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null;
    }

    function inversionChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      return /^i[SWMLH](?:\d+)?-(?:Wing|Ring)$/i.test(name) ? name : null;
    }

    return {
      chainNameWithoutAffix,
      wChainType,
      splitChainType,
      strongChainType,
      inversionChainType,
    };
  }

  app.chainNaming = { create };
})(window);
