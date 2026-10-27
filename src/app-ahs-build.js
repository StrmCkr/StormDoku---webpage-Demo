/* StormDoku AHS-XZ/XY/Chain build orchestration. */
(function installAhsBuild(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  const core = global.StormDoku;

  function create(context) {
    const { elements, state, actions } = context;

    return function runAhsSearch(family = 'ahs-xz') {
      const isXy = family === 'ahs-xy';
      const isChain = family === 'ahs-chain';
      const label = isXy ? 'AHS-XY' : isChain ? 'AHS-Chain' : 'AHS-XZ';
      const searchToken = actions.setBusy(true);
      actions.setStatus(`Searching ${label}...`);

      actions.scheduleSearch(async () => {
        try {
          let strongLinkSet = null;
          let ahsList = null;
          let ahsLinkSet = null;
          let rawReport;
          if (isXy) {
            const ahsXyOptions = {
              ahsMode: 'xy', ahsMaxDof: 1, ahsMaxSize: 4, ahsMaxFox: 4,
              ahsMaxNodes: 800, ahsSearchLimit: true, maxDepth: 3,
              maxTriples: 300000, strongLinkTypes: [],
              limits: {
                maxChains: 500, maxResultAttempts: 3000,
                maxResultAttemptsPerStart: 150, maxStates: 20000,
                maxQueue: 20000, maxBranching: 100,
                maxStartViews: 1000, maxAhsLinks: 800,
              },
            };
            if (document.baseURI.startsWith('file:')) {
              ahsList = await actions.runCoreSearch('ahsConstructor', state.cand, {
                maxSize: ahsXyOptions.ahsMaxSize,
                maxSizeFox: ahsXyOptions.ahsMaxFox,
                searchLimit: ahsXyOptions.ahsSearchLimit,
                maxResults: ahsXyOptions.ahsMaxNodes,
              });
              const pureReport = await actions.runCoreSearch('findAhsXyChains', state.cand, {
                ahsList,
                maxTriples: ahsXyOptions.maxTriples,
                maxChains: ahsXyOptions.limits.maxChains,
              });
              const mixedReport = await actions.runCoreSearch('findAhsMixedChains', state.cand, {
                mode: 'xy', maxChains: ahsXyOptions.limits.maxChains,
              });
              rawReport = {
                chains: [...pureReport.chains, ...mixedReport.chains],
                stats: { ...pureReport.stats, mixed: mixedReport.stats },
              };
            } else {
              rawReport = await actions.runSearchWorker('chains', {
                candidateGrid: state.cand,
                includeStrong: true,
                includeAls: false,
                includeAhs: true,
                ...ahsXyOptions,
              });
            }
          } else {
            strongLinkSet = await actions.runCoreSearch('buildStrongLinks', state.cand);
            ahsList = await actions.runCoreSearch('ahsConstructor', state.cand, { maxSize: 8, maxSizeFox: 7 });
            const ahsBuilderStrongLinks = isChain
              ? core.flattenStrongLinks(strongLinkSet).filter(link => [0, 1].includes(Number(link.linkType)))
              : strongLinkSet;
            ahsLinkSet = await actions.runCoreSearch('buildAhsLinks', state.cand, {
              ahsList,
              strongLinkSet: ahsBuilderStrongLinks,
              minDof: 1,
              maxDof: 3,
              maxLinks: 5000,
            });
            rawReport = await actions.runCoreSearch('findAicChains', state.cand, {
              strongLinkSet,
              strongLinkTypes: [0, 1],
              includeStrong: true,
              includeAls: false,
              includeAhs: true,
              ahsList,
              ahsLinkSet,
              maxDepth: isChain ? 8 : 2,
              maxChains: 5000,
              maxResultAttempts: 100000,
              maxResultAttemptsPerStart: 5000,
              maxStates: 300000,
              maxQueue: 300000,
              maxBranching: 500,
              maxAhsLinks: 5000,
              ...(isChain ? { ahsChainOnly: true } : {}),
            });
          }

          const chains = rawReport.chains.filter(chain => {
            const steps = chain.steps || [];
            if (isChain) {
              return steps.length > 3
                && steps.some(step => step.family === 'AHS')
                && steps.every(step => step.family === 'AHS'
                  || (step.family === 'SL' && [0, 1].includes(step.linkType)));
            }
            if (!isXy) {
              return steps.some(step => step.family === 'AHS'
                && ['AHS_XZ', 'AHS_XZ_RING'].includes(String(step.module?.moduleKind || '')));
            }
            return steps.length === 3
              && steps.some(step => step.family === 'AHS')
              && steps.every(step => step.family === 'AHS'
                || (step.family === 'SL' && [0, 1].includes(step.linkType)));
          });

          state.chainReport = { ...rawReport, chains };
          state.ahsSearchFamily = family;
          state.alsSearchFamily = null;
          state.selectedChainIndex = chains.length ? 0 : null;
          state.activeStep = null;
          state.lastRemoved = [];
          state.strongLinkReport = strongLinkSet;
          state.ahsReport = ahsList;
          state.selectedAhsId = null;
          actions.renderAlsReport();
          actions.renderChainReport();
          actions.renderAhsSearchResults();
          actions.renderBoard();
          actions.openReportPanel(elements.ahsSearchResults);
          actions.setStatus(
            `${label} search complete ${isXy
              ? 'using AHS cellular links'
              : isChain ? 'using AHS links with strong-link types 0 and 1'
                : 'using AHS_RCC with strong-link types 0 and 1'}. `
              + `${chains.length} result${chains.length === 1 ? '' : 's'} found.`,
            chains.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          state.ahsSearchFamily = null;
          state.chainReport = null;
          state.selectedChainIndex = null;
          actions.renderAhsSearchResults();
          actions.setStatus(`Could not search ${label}: ${error.message || error}`, 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    };
  }

  app.ahsBuild = { create };
})(window);
