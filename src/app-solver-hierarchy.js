/* StormDoku ordered solver hierarchy definition. */
(function installSolverHierarchy(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

    function build(profile = null) {
      const phases = [];
      const addDirect = (name, methods) => phases.push({
        name,
        kind: 'direct',
        methods,
      });
      const addChain = (name, chainPhase) => phases.push({
        name,
        kind: 'chain',
        chainPhase: { ...chainPhase, hierarchyPhase: name },
        requiredTypes: chainPhase.requiredTypes || ['chains'],
      });
      const addAlsXz = (name, chainPhase) => phases.push({
        name,
        kind: 'als-xz',
        chainPhase: {
          ...chainPhase,
          dedicatedSearch: 'als-xz',
          hierarchyPhase: name,
        },
        requiredTypes: chainPhase.requiredTypes || ['chains', 'als-xz'],
      });
      const addAlsDof = name => phases.push({
        name,
        kind: 'als-dof',
      });
      const addAhsDof = name => phases.push({
        name,
        kind: 'ahs-dof',
      });
      const addAhsDofChain = name => phases.push({
        name,
        kind: 'ahs-dof-chain',
      });
      const addAlsDofChain = name => phases.push({
        name,
        kind: 'als-dof-chain',
      });
      const addMsls = name => phases.push({
        name,
        kind: 'msls',
      });
      const addChromatic = (name, alsBacked) => phases.push({
        name,
        kind: 'chromatic',
        alsBacked,
      });
      const addAlsHydra = name => phases.push({
        name,
        kind: 'als-hydra',
      });
      const addAlc = (name, alcType, options = {}) => phases.push({
        name,
        kind: 'alc',
        alcType,
        chainPhase: {
          name,
          includeAls: true,
          includeAhs: true,
          maxDepth: options.maxDepth || 8,
          minDepth: options.minDepth || 2,
          family: `alc-${alcType}`,
          requiredTypes: ['chains'],
          ...options,
        },
      });

      // The direct phases are deliberately small. This lets the same numeric
      // scorer choose between the methods in one tier without asking the
      // expensive chain engine to compete against every basic move.
      addDirect('lulz', [
        { type: 'last-man-standing' },
      ]);
      addDirect('extremely-easy', [
        { type: 'hidden-single' },
        { type: 'naked-single' },
        { type: 'box-line' },
      ]);
      addDirect('very-easy-subsets', [
        { type: 'hidden-pair' },
        { type: 'naked-pair' },
      ]);
      addDirect('very-easy-fish', [
        { kind: 'fish', size: 2, k: [0], categories: ['Basic'] },
      ]);
      addChain('modestly-easy-chains', {
        name: 'strong-depth-2-0-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3],
        maxDepth: 2,
        minDepth: 2,
        requireAls: false,
        requireMixed: false,
        family: null,
        singleDigitOnly: true,
        // The phase is defined by the walker constraints, not by the display
        // name. This keeps every legal depth-2 type-0-to-3 chain eligible,
        // including a named form added by the classifier later.
        allowedMoveKeys: [
          'x-chain', 'chain-x-wing', 'skyscraper', '2-string-kite',
          'finned-x-wing', 'sashimi-x-wing', 'empty-rectangle',
        ],
        // Modestly Easy must finish its depth-2 strong-link pass before the
        // fish phase is allowed to run. Keep this phase bounded independently
        // of the much larger Transcendent interactive profile budget.
        searchLimits: {
          // This pass only walks two strong-link modules. Collect enough
          // candidates to survive safety/key filtering, then stop before the
          // later fish phase can be reached from an incomplete report.
          maxChains: 100,
          maxResultAttempts: 5000,
          maxResultAttemptsPerStart: 250,
          maxStates: 10000,
          maxQueue: 10000,
          maxBranching: 100,
          maxStartViews: Infinity,
          maxAlsLinks: 0,
        },
      });
      addDirect('modestly-easy-franken-k0', [
        { kind: 'fish', size: 2, k: [0], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k0', [
        { kind: 'fish', size: 2, k: [0], categories: ['Mutant'] },
      ]);
      addDirect('modestly-easy-franken-k1', [
        { kind: 'fish', size: 2, k: [1], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k1', [
        { kind: 'fish', size: 2, k: [1], categories: ['Mutant'] },
      ]);
      addDirect('modestly-easy-franken-k2', [
        { kind: 'fish', size: 2, k: [2], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k2', [
        { kind: 'fish', size: 2, k: [2], categories: ['Mutant'] },
      ]);
      addDirect('easy-subsets', [
        { type: 'hidden-triple' },
        { type: 'naked-triple' },
      ]);
      addDirect('easy-fish', [
        { kind: 'fish', size: 3, k: [0], categories: ['Basic'] },
      ]);
      addChain('moderate-chains', {
        name: 'strong-depth-3-0-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        singleDigitOnly: true,
        allowedMoveKeys: [
          'x-chain', 'chain-x-wing',
          'l1-wing', 'dual-empty-rectangle',
          'rect-kite', 'bridged-eri', 'eri-chain',
        ],
      });
      addChain('moderate-xy-chain', {
        name: 'xy-chain-depth-3',
        includeAls: false,
        strongLinkTypes: [4],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        allowedMoveKeys: ['xy-wing', 'xy-chain'],
      });
      addChain('moderate-barns-3', {
        name: 'barns-size-3',
        includeAls: true,
        strongLinkTypes: [4],
        maxDepth: 2,
        minDepth: 2,
        requireAls: true,
        requireMixed: false,
        alsLinkMode: 'xz-only',
        alsModuleKinds: ['ALS_XZ'],
        barnsSize: 3,
        family: 'barns',
        requiredTypes: ['chains', 'barns'],
      });
      addChain('moderate-named-wings', {
        name: 'named-wings-depth-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3, 4],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        allowedMoveKeys: [
          'l2-wing', 'l3-wing',
          'w-wing', 's-wing', 'm2-wing', 'm3-wing',
          'h1-wing', 'h2-wing', 'h3-wing',
          'strong-wing',
        ],
      });
      addDirect('moderate-franken-k0', [
        { kind: 'fish', size: 3, k: [0], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k0', [
        { kind: 'fish', size: 3, k: [0], categories: ['Mutant'] },
      ]);
      addDirect('moderate-franken-k1', [
        { kind: 'fish', size: 3, k: [1], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k1', [
        { kind: 'fish', size: 3, k: [1], categories: ['Mutant'] },
      ]);
      addDirect('moderate-franken-k2', [
        { kind: 'fish', size: 3, k: [2], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k2', [
        { kind: 'fish', size: 3, k: [2], categories: ['Mutant'] },
      ]);
      addDirect('tough-subsets', [
        { type: 'hidden-quad' },
        { type: 'naked-quad' },
      ]);
      addDirect('tough-fish', [
        { kind: 'fish', size: 4, k: [0], categories: ['Basic'] },
      ]);
      if (profile?.maxRank >= 70) {
        addChain('challenging-xchains', {
          name: 'strong-depth-4-xchains',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['x-chain', 'chain-x-wing'],
          singleDigitOnly: true,
          searchLimits: {
            maxChains: 250,
            maxResultAttempts: 5000,
            maxResultAttemptsPerStart: 250,
            maxStates: 12000,
            maxQueue: 12000,
            maxBranching: 100,
            maxStartViews: 2000,
            maxAlsLinks: 1000,
          },
        });
        addChain('challenging-transport', {
          name: 'barns-transport-xyz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          alsCellCount: 2,
          barnsSize: 3,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('challenging-barns-wxyz', {
          name: 'barns-wxyz',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsCellCount: 2,
          alsMaxDigits: 3,
          alsMaxSizeDOF: 1,
          alsMaxSizeFox: 3,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 4,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
        addChain('challenging-xy-chain', {
          name: 'xy-chain-depth-4',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-chain'],
        });
        addChain('challenging-hidden-xy', {
          name: 'hidden-xy-chain-depth-4',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('challenging-aic', {
          name: 'aic-depth-4',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['aic-generic', 'inversion'],
          searchLimits: {
            maxChains: 250,
            maxResultAttempts: 5000,
            maxResultAttemptsPerStart: 250,
            maxStates: 12000,
            maxQueue: 12000,
            maxBranching: 100,
            maxStartViews: 2000,
            maxAlsLinks: 1000,
          },
        });
        addDirect('challenging-franken-k0', [
          { kind: 'fish', size: 4, k: [0], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k0', [
          { kind: 'fish', size: 4, k: [0], categories: ['Mutant'] },
        ]);
        addDirect('challenging-franken-k1', [
          { kind: 'fish', size: 4, k: [1], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k1', [
          { kind: 'fish', size: 4, k: [1], categories: ['Mutant'] },
        ]);
        addDirect('challenging-franken-k2', [
          { kind: 'fish', size: 4, k: [2], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k2', [
          { kind: 'fish', size: 4, k: [2], categories: ['Mutant'] },
        ]);
      }
      if (profile?.maxRank >= 80) {
        addDirect('irritating-subsets', [
          { type: 'hidden-quintuple' },
          { type: 'naked-quintuple' },
        ]);
        addDirect('irritating-basic-fish', [
          { kind: 'fish', size: 5, k: [0], categories: ['Basic'] },
        ]);
        addChain('irritating-xchains', {
          name: 'strong-depth-5-plus',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 5,
          singleDigitOnly: true,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: [
            'x-chain', 'chain-x-wing', 'empty-rectangle',
            'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain',
          ],
        });
        addChain('irritating-xy', {
          name: 'xy-chain-depth-5',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
        });
        addChain('irritating-hidden-xy', {
          name: 'hidden-xy-chain-depth-5',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('irritating-aic', {
          name: 'aic-depth-5',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['aic-generic', 'inversion'],
        });
        addChain('irritating-transport-wxyz', {
          name: 'barns-transport-wxyz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          barnsSize: 4,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('irritating-barns-5', {
          name: 'barns-size-5',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 5,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
      }
      if (profile?.maxRank >= 90) {
        addDirect('frustrating-subsets', [
          { type: 'hidden-sextuple' },
          { type: 'naked-sextuple' },
        ]);
        addDirect('frustrating-basic-fish', [
          { kind: 'fish', size: 6, k: [0], categories: ['Basic'] },
        ]);
        addChain('frustrating-xchains', {
          name: 'strong-depth-6-plus',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          singleDigitOnly: true,
          allowedMoveKeys: ['x-chain', 'chain-x-wing', 'empty-rectangle', 'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain'],
        });
        addChain('frustrating-xy', {
          name: 'xy-chain-depth-6',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
        });
        addChain('frustrating-hidden-xy', {
          name: 'hidden-xy-chain-depth-6',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('frustrating-aic', {
          name: 'aic-depth-6',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          genericAicOnly: true,
        });
        addChain('frustrating-transport-barns-5', {
          name: 'barns-transport-size-5',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          barnsSize: 5,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('frustrating-barns-6', {
          name: 'barns-size-6',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 6,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
        addDirect('frustrating-franken-k0', [
          { kind: 'fish', size: 6, k: [0], categories: ['Franken'] },
        ]);
        addDirect('frustrating-mutant-k0', [
          { kind: 'fish', size: 6, k: [0], categories: ['Mutant'] },
        ]);
        addChain('frustrating-transport-w-wing', {
          name: 'w-transport-depth-4',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'aic-als',
          requiredTypes: ['chains', 'w-transport'],
        });
      }
      if (profile?.maxRank >= 100) {
        addDirect('hard-subsets', [
          { type: 'hidden-septuple' },
          { type: 'naked-septuple' },
        ]);
        addDirect('hard-basic-fish', [
          { kind: 'fish', size: 7, k: [0], categories: ['Basic'] },
        ]);
        // Keep ALS-XZ distinct through hierarchy dispatch so the worker uses
        // the dedicated ALS-XZ operation and its restricted link inventory.
        // Type 4 is the bivalve ALS edge; ALS_RCC supplies the other edge.
        addAlsXz('hard-als-xz-shortcut', {
          name: 'als-xz-shortcut',
          fullFoxRange: true,
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
          requiredTypes: ['chains', 'als-xz'],
        });
        addAlsXz('hard-als-xz', {
          name: 'als-xz-full-depth-2',
          fullFoxRange: true,
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
          requiredTypes: ['chains', 'als-xz'],
        });
        addChain('hard-ahs-xz-shortcut', {
          name: 'ahs-xz-shortcut',
          fullFoxRange: true,
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1],
          maxDepth: 2,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xz',
          requiredTypes: ['chains', 'ahs-xz'],
        });
        addChain('hard-ahs-xz', {
          name: 'ahs-xz-full-depth-2',
          fullFoxRange: true,
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xz',
          requiredTypes: ['chains', 'ahs-xz'],
        });
        addAlc('hard-alc-xz', 'xz', {
          fullFoxRange: true,
          maxDepth: 2,
          minDepth: 2,
          requiredTypes: ['chains'],
        });

      addChain('hard-xchains-full-depth', {
          name: 'strong-full-depth-xchains',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          singleDigitOnly: true,
          allowedMoveKeys: ['x-chain', 'chain-x-wing', 'empty-rectangle', 'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain'],
          requiredTypes: ['chains'],
        });
        addChain('hard-xy-full-depth', {
          name: 'xy-chain-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
          requiredTypes: ['chains'],
        });
        addChain('hard-hidden-xy-full-depth', {
          name: 'hidden-xy-chain-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
          requiredTypes: ['chains'],
        });
        addChain('hard-aic-full-depth', {
          name: 'aic-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          genericAicOnly: true,
          requiredTypes: ['chains'],
        });
        addDirect('hard-franken-k0', [
          { kind: 'fish', size: 7, k: [0], categories: ['Franken'] },
        ]);
        addDirect('hard-mutant-k0', [
          { kind: 'fish', size: 7, k: [0], categories: ['Mutant'] },
        ]);

      }
      if (profile?.maxRank >= 110) {
        addDirect('demanding-subsets', [
          { type: 'hidden-octuple' },
          { type: 'naked-octuple' },
        ]);
        addChain('demanding-named-als', {
          name: 'named-als-wings-rings-depth-3',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          // Named ALS forms use ordinary strong links 0-4 plus ALS_RCC.
          alsLinkMode: 'all',
          family: 'als-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'als-named'],
        });
        addChain('demanding-ahs-named', {
          name: 'named-ahs-wings-rings-depth-3',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'ahs-named'],
        });
        addChain('demanding-alc-named', {
          name: 'named-alc-wings-rings-depth-3',
          includeAls: true,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'alc-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'alc-named'],
        });
        addChain('demanding-transport-als-xz', {
          name: 'transport-als-xz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          // This is the three-stage transported ALS-XZ form, not a
          // B.A.R.N.S. transport.  Keep it in the demanding phase so the
          // corrected classifier can report the depth-3 move.
          family: 'als-xz',
          allowedMoveKeys: ['t-als-xz'],
          requiredTypes: ['chains', 't-als-xz'],
        });
        addChain('demanding-transport-ahs-xz', {
          name: 'transport-ahs-xz',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: true,
          family: 'ahs-xz',
          requiredTypes: ['chains', 't-ahs-xz'],
        });
        addAlc('demanding-transport-alc-xz', 'xz', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains', 't-alc-xz'],
        });
        addChain('demanding-als-xy-shortcut', {
          name: 'als-xy-shortcut',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-xy',
          requiredTypes: ['chains', 'als-xy'],
        });
        addChain('demanding-als-xy', {
          name: 'als-xy-depth-3',
          includeAls: true,
          // ALS-XY is allowed to use its complete ALS link engine here;
          // ordinary strong-link types are intentionally unrestricted.
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-xy',
          requiredTypes: ['chains', 'als-xy'],
        });
        addChain('demanding-ahs-xy-shortcut', {
          name: 'ahs-xy-shortcut',
          includeAls: false,
          includeAhs: true,
          ahsMode: 'xy',
          ahsMaxCells: 7,
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xy',
          requiredTypes: ['chains', 'ahs-xy'],
        });
        addChain('demanding-ahs-xy', {
          name: 'ahs-xy-depth-3',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xy',
          requiredTypes: ['chains', 'ahs-xy'],
        });
        addAlc('demanding-alc-xy', 'xy', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains'],
        });
      }
      if (profile?.maxRank >= 120) {
        addDirect('expert-subsets', [
          { type: 'hidden-nontuple' },
          { type: 'naked-nontuple' },
        ]);
        addChain('expert-transport-als-xy', {
          name: 'transport-als-xy',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: true,
          requireMixed: true,
          family: 'als-xy',
          requiredTypes: ['chains', 't-als-xy'],
        });
        addChain('expert-transport-ahs-xy', {
          name: 'transport-ahs-xy',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: true,
          family: 'ahs-xy',
          requiredTypes: ['chains', 't-ahs-xy'],
        });
        addAlc('expert-transport-alc-xy', 'xy', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains', 't-alc-xy'],
        });
      }
      if (profile?.maxRank >= 130) {
        addChain('brutal-als-chain', {
          name: 'als-chain-full-depth',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 4,
          requireAls: true,
          requireMixed: false,
          family: 'als-chain',
          requiredTypes: ['chains', 'als-chain'],
        });
        addChain('brutal-als-chain-shortcut', {
          name: 'als-chain-shortcut',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-chain',
          requiredTypes: ['chains', 'als-chain'],
        });
        addChain('brutal-ahs-chain-shortcut', {
          name: 'ahs-chain-shortcut',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-chain',
          requiredTypes: ['chains', 'ahs-chain'],
        });
        addChain('brutal-ahs-chain', {
          name: 'ahs-chain-full-depth',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-chain',
          requiredTypes: ['chains', 'ahs-chain'],
        });
        addAlc('brutal-alc-chain', 'chain', {
          maxDepth: 8,
          minDepth: 4,
          requiredTypes: ['chains'],
        });
      }
      if (profile?.maxRank >= 140) {
        addChain('fiendish-aic-als', {
          name: 'aic-als-depth-3-plus',
          dedicatedSearch: 'aic-als',
          includeAls: true,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          family: 'aic-als',
          requiredTypes: ['chains', 'aic-als'],
        });
      }
      if (profile?.maxRank >= 150) {
        addChain('nightmare-full-aic', {
          name: 'aic-full-depth',
          includeAls: true,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4, 5, 6, 7],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
        });
      }
      if (profile?.maxRank == null || profile.maxRank >= 160) {
        addAlsDof('abyssal-als-dof-family');
        addAhsDof('abyssal-ahs-dof-family');
        addAlc('abyssal-alc-dof-chain', 'dof', {
          maxDepth: 8,
          minDepth: 3,
          requiredTypes: ['chains'],
        });
      }
      if (profile?.maxRank == null || profile.maxRank >= 170) addMsls('ascendant-msls-family');
      if (profile?.maxRank == null || profile.maxRank >= 180) {
        addAlsDofChain('transcendent-als-dof-chain-family');
        addAhsDofChain('transcendent-ahs-dof-chain-family');
      }
      if (profile?.maxRank == null || profile.maxRank >= 190) {
        addChromatic('singularity-chromatic-graphs', false);
        addChromatic('singularity-chromatic-graphs-als', true);
      }
      if (profile?.maxRank == null || profile.maxRank >= 200) {
        addAlsHydra('unfathomable-als-hydra-chains');
      }

      return phases.filter(phase => {
        if (profile?.maxRank == null) return true;
        return !['chain', 'als-xz', 'alc'].includes(phase.kind)
          || profile.maxDepth >= phase.chainPhase.minDepth;
      });
    }

  app.solverHierarchy = { build };
})(window);
