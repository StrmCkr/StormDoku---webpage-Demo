/* Ordered chain-search phase plan. */
(function installChainSearchPlan(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ phaseBuilder, chainAlsRccEl, chainStrongTypeEls }) {
    function build(maxDepth, profile = null) {
      const includeAls = phaseBuilder.resolveIncludeAls(profile, chainAlsRccEl);
      const strongLinkTypes = phaseBuilder.resolveStrongLinkTypes(
        profile,
        chainStrongTypeEls,
      );
      const phases = [];
      const addPhase = (name, types, options = {}) => phaseBuilder.addPhase(
        phases,
        name,
        types,
        maxDepth,
        options,
      );
      const addMixedStage = (name, options = {}) => phaseBuilder.addMixedStage(
        phases,
        name,
        strongLinkTypes,
        maxDepth,
        options,
      );

      // Phase 1: B.A.R.N.S. and transport forms. B.A.R.N.S. is checked by
      // increasing size so a smaller equal-cell/equal-digit form wins first.
      if (includeAls) {
        for (let barnsSize = 2; barnsSize <= 9; barnsSize++) {
          addPhase(`barns-${barnsSize}`, [4], {
            includeAls: true,
            maxDepth: 2,
            alsLinkMode: 'xz-only',
            alsModuleKinds: ['ALS_XZ'],
            barnsSize,
            family: 'barns',
          });
        }

        for (let barnsSize = 2; barnsSize <= 9; barnsSize++) {
          addPhase(`barns-transport-${barnsSize}`, strongLinkTypes, {
            includeAls: true,
            maxDepth: 3,
            barnsSize,
            family: 'barns-transport',
          });
        }

      }

      // Phase 2: pure strong-link chains. Type 4 is the BIVALVE (size-1 ALS)
      // strong link, so it is searched in the same individual/combination
      // sequence as types 0 through 3.
      for (const type of strongLinkTypes) addPhase(`strong-${type}`, [type]);
      for (let size = 2; size <= 4; size++) {
        for (const types of phaseBuilder.combinations(strongLinkTypes, size)) {
          addPhase(`strong-${types.join('-')}`, types);
        }
      }

      if (includeAls) {
        // Type 5 plus ordinary strong links is the next search family. It is
        // intentionally depth 3+; depth-2 ALS-XZ/B.A.R.N.S. was handled above.
        addMixedStage('type5-strong', {
          maxDepth,
          minDepth: 3,
        });

        // ALS-XZ and ALS-XY are both searched in their pure ALS form and in
        // their mixed type-5-plus-strong form.  The minimum depth prevents a
        // depth-3 request from re-reporting shorter links in these stages.
        addPhase('als-xz-type5', [4], {
          includeAls: true,
          maxDepth: 2,
          minDepth: 2,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
        });
        addMixedStage('als-xz-mixed', {
          maxDepth: 2,
          minDepth: 2,
          family: 'als-xz',
        });
        addMixedStage('als-xz-transport', {
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xz',
          allowedMoveKeys: ['t-als-xz'],
        });

        // ALS-XY is exactly logical breadth 3. The attached ALSs are not
        // restricted to three cells; their legal size is independent of the
        // chain breadth.
        addPhase('als-xy', [4], {
          includeAls: true,
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xy',
        });
        addMixedStage('als-xy-mixed', {
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xy',
        });
        addMixedStage('als-xy-transport', {
          maxDepth: 4,
          minDepth: 4,
          family: 'als-xy',
          allowedMoveKeys: ['t-als-xy'],
        });

        // Longer ALS chains come after the fixed ALS-XZ/ALS-XY stages.
        addPhase('als-chain-type5', [4], {
          includeAls: true,
          maxDepth,
          minDepth: 3,
          family: 'als-chain',
        });
        addMixedStage('als-chain-mixed', {
          maxDepth,
          minDepth: 3,
          family: 'als-chain',
        });

        // AIC + ALS named constructs are the final mixed-chain stage.
        addMixedStage('aic-als', {
          maxDepth,
          minDepth: 3,
          family: 'aic-als',
        });
      }

      // The phase list is deliberately ordered. The engine's inclusive depth
      // search supplies the 2 -> max depth scaling inside each phase.

      return phases;
    }

    return { build };
  }

  app.chainSearchPlan = { create };
})(window);