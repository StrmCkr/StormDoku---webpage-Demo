/* StormDoku chain report selection helpers. */
(function installChainSelection(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    core,
    displayChainForUi,
    chainMatchesSearchPhase,
    chainMoveEnabled,
    chainStepFromResult,
    chainSafetyFlags,
    chainText,
    ratingForStep,
    phaseTechniqueOrder,
    chainMoveKeys,
    moveTieOrder,
    solverMovePriority,
    isHigherPriorityMove,
    onDiagnostics,
  }) {
    function bestFromReport(
      report,
      phase,
      enabledTypes,
      candidateGrid,
      fixedGrid,
      expectedSolution,
      maxDepth,
      profile,
    ) {
      const diagnostics = {
        phase: phase?.name || 'unknown',
        received: Array.isArray(report?.chains) ? report.chains.length : 0,
        phaseRejected: 0,
        toggleRejected: 0,
        noElimination: 0,
        safetyRejected: 0,
        ratingRejected: 0,
        accepted: 0,
      };
      let best = null;
      const acceptedChains = [];
      for (let index = 0; index < report.chains.length; index++) {
        const chain = displayChainForUi(report.chains[index]);
        if (!chainMatchesSearchPhase(chain, phase)) {
          diagnostics.phaseRejected += 1;
          continue;
        }
        if (!chainMoveEnabled(chain, enabledTypes)) {
          diagnostics.toggleRejected += 1;
          continue;
        }
        const items = core.eliminationItems({ items: chain.eliminations || [] }, candidateGrid);
        if (!items.length) {
          diagnostics.noElimination += 1;
          continue;
        }
        if (chainSafetyFlags(chain, candidateGrid, expectedSolution, fixedGrid).length > 0) {
          diagnostics.safetyRejected += 1;
          continue;
        }
        const step = {
          ...chainStepFromResult(chain, report, index, candidateGrid),
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) {
          diagnostics.ratingRejected += 1;
          continue;
        }
        diagnostics.accepted += 1;
        acceptedChains.push({ chain, items, rating: step.rating });
      }

      const displayReport = { ...report, chains: acceptedChains.map(entry => entry.chain) };
      for (const [displayIndex, entry] of acceptedChains.entries()) {
        const { chain, items, rating } = entry;
        const step = {
          ...chainStepFromResult(chain, displayReport, displayIndex, candidateGrid),
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = rating;
        const candidate = {
          report: displayReport,
          index: displayIndex,
          chain,
          step,
          priority: [
            phaseTechniqueOrder(chain, phase, chainMoveKeys, moveTieOrder),
            Number(chain.length) || Number(chain.steps?.length) || Number.POSITIVE_INFINITY,
            -items.length,
            ...solverMovePriority(chain, step, maxDepth, displayIndex),
          ],
        };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      onDiagnostics?.(diagnostics);
      return best;
    }

    function legacyBestFromReport(
      report,
      phase,
      enabledTypes,
      candidateGrid,
      fixedGrid,
      expectedSolution,
      maxDepth,
      profile,
    ) {
      const diagnostics = {
        phase: phase?.name || 'unknown',
        received: Array.isArray(report?.chains) ? report.chains.length : 0,
        phaseRejected: 0,
        toggleRejected: 0,
        noElimination: 0,
        safetyRejected: 0,
        ratingRejected: 0,
        accepted: 0,
      };
      let best = null;
      const acceptedChains = [];
      for (let index = 0; index < report.chains.length; index++) {
        const chain = displayChainForUi(report.chains[index]);
        if (!chainMatchesSearchPhase(chain, phase)) {
          diagnostics.phaseRejected += 1;
          continue;
        }
        if (!chainMoveEnabled(chain, enabledTypes)) {
          diagnostics.toggleRejected += 1;
          continue;
        }

        const items = core.eliminationItems(
          { items: chain.eliminations || [] },
          candidateGrid,
        );
        if (!items.length) {
          diagnostics.noElimination += 1;
          continue;
        }
        if (chainSafetyFlags(chain, candidateGrid, expectedSolution, fixedGrid).length > 0) {
          diagnostics.safetyRejected += 1;
          continue;
        }

        const step = {
          ...chainStepFromResult(chain, report, index, candidateGrid),
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) {
          diagnostics.ratingRejected += 1;
          continue;
        }
        diagnostics.accepted += 1;
        acceptedChains.push({ chain, items, rating: step.rating });
      }

      // The worker report can contain every chain reachable by the current
      // graph walk, including depths and named families that belong to later
      // hierarchy phases. Keep the report attached to Next/Run All scoped to
      // the same accepted phase that selected the move.
      const displayReport = {
        ...report,
        chains: acceptedChains.map(entry => entry.chain),
      };
      for (const [displayIndex, entry] of acceptedChains.entries()) {
        const { chain, items, rating } = entry;
        const step = {
          ...chainStepFromResult(chain, displayReport, displayIndex, candidateGrid),
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = rating;
        const candidate = {
          report: displayReport,
          index: displayIndex,
          chain,
          step,
            // A phase is a conceptual hierarchy. Select its named move order
            // before comparing link-modified scores, so a later named form
            // cannot outrank an earlier X-chain/Skyscraper/Kite form.
            priority: [
              phaseTechniqueOrder(
                chain,
                phase,
                chainMoveKeys,
                moveTieOrder,
              ),
              // Prefer the smallest valid proof within a hierarchy phase.
              // A longer walk may contain this chain, but it must not hide it
              // or win merely because it exposes more cumulative exclusions.
              Number(chain.length) || Number(chain.steps?.length) || Number.POSITIVE_INFINITY,
              // Within the same named/classified move, prefer the proof that
              // removes more candidates after proof length has been compared.
              -items.length,
              ...solverMovePriority(chain, step, maxDepth, displayIndex),
            ],
        };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      onDiagnostics?.(diagnostics);
      return best;
    }

    return { bestFromReport, legacyBestFromReport };
  }

  app.chainSelection = { create };
})(window);
