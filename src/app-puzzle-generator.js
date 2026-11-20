/* Puzzle generation, target-difficulty retries, and result installation. */
(function installPuzzleGenerator(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state, elements, actions }) {
    function run() {
      actions.cancelActiveSearches('Search cancelled by puzzle generation.');
      actions.leaveHistoryPreview();
      actions.resetAnalysisAfterPlayerEdit();
      actions.renderBoard();
      const givens = Math.min(81, Math.max(1, Number(elements.givens.value) || 21));
      elements.givens.value = String(givens);
      const targetCategory = elements.difficulty.value;
      const isAnyTarget = actions.normalizeRatingCategory(targetCategory) === 'Any';
      const requestToken = ++state.generationToken;
      actions.setBusy(true);
      const article = /^[AEIOU]/i.test(targetCategory) ? 'an' : 'a';
      actions.setStatus(isAnyTarget
        ? 'Generating...'
        : `Generating ${article} ${targetCategory} puzzle...`);

      setTimeout(() => {
        if (requestToken !== state.generationToken) return;
        const quickGeneration = isAnyTarget;
        const maxRatingAttempts = quickGeneration ? 1 : 1000;
        let result = null;
        let rating = null;
        let attempts = 0;

        const tryGeneration = async () => {
          if (requestToken !== state.generationToken) return;

          attempts += 1;
          try {
            result = await actions.runPuzzleGenerator(givens);
          } catch (error) {
            if (requestToken !== state.generationToken || actions.isSearchCancelled(error)) return;
            actions.setBusy(false);
            actions.setStatus(`Could not generate a puzzle: ${error.message || error}`, 'warn');
            return;
          }
          if (requestToken !== state.generationToken) return;
          if (quickGeneration) {
            installResult(result);
            actions.resetCandidates('Generated a unique puzzle.', null,
              actions.unknownRating('Generated puzzle is unrated.'));
            const actualGivens = result.puzzle.filter(Boolean).length;
            actions.setStatus(`Generated a unique puzzle with ${actualGivens} givens.`, 'ok');
            actions.setBusy(false);
            return;
          }

          const limitedRating = await actions.rateGeneratedPuzzleInWorker(
            result.puzzle,
            result.solution,
            targetCategory,
          );
          if (requestToken !== state.generationToken) return;
          const normalizedTarget = actions.normalizeRatingCategory(targetCategory);
          const limitedMatchesTarget = quickGeneration
            || normalizedTarget === 'Unknown'
            || (
              limitedRating.solved === true
              && (normalizedTarget !== 'Lulz' || limitedRating.score === 0)
              && limitedRating.category === normalizedTarget
            );

          // The selected difficulty is the complete search ceiling for this
          // candidate. A candidate that stalls below that tier is rejected.
          if (!limitedMatchesTarget) {
            if (attempts >= maxRatingAttempts) {
              actions.setBusy(false);
              actions.setStatus(
                `Could not generate a ${targetCategory} puzzle after ${attempts} attempts. Current puzzle unchanged.`,
                'warn',
              );
              return;
            }
            actions.setStatus(`Generating ${article} ${targetCategory} puzzle... attempt ${attempts}`);
            setTimeout(() => { void tryGeneration(); }, 0);
            return;
          }

          rating = limitedRating;
          const matches = quickGeneration
            || (
              limitedRating.solved === true
              && rating.solved === true
              && (normalizedTarget !== 'Lulz' || (limitedRating.score === 0 && rating.score === 0))
              && rating.category === normalizedTarget
            );

          if (!matches) {
            if (attempts >= maxRatingAttempts) {
              actions.setBusy(false);
              actions.setStatus(
                `Could not generate a ${targetCategory} puzzle after ${attempts} attempts. Current puzzle unchanged.`,
                'warn',
              );
              return;
            }
            actions.setStatus(`Generating ${article} ${targetCategory} puzzle... attempt ${attempts}`);
            setTimeout(() => { void tryGeneration(); }, 0);
            return;
          }

          installResult(result);
          const actualGivens = result.puzzle.filter(Boolean).length;
          actions.resetCandidates(
            `Generated a unique puzzle with ${actualGivens} givens and rebuilt candidates.`,
            null,
            rating,
          );
          if (!isAnyTarget) {
            actions.setStatus(`Generated a ${targetCategory} puzzle after ${attempts} attempt${attempts === 1 ? '' : 's'}.`, 'ok');
          } else if (!rating.solved) {
            actions.setStatus(
              `Generated a unique puzzle, but the retained logic stalled after ${rating.stalledAfter || 'no basic move'}.`,
              'warn',
            );
          }
          actions.setBusy(false);
        };

        void tryGeneration().catch(error => {
          if (requestToken !== state.generationToken) return;
          actions.setBusy(false);
          actions.setStatus(`Could not generate a puzzle: ${error.message || error}`, 'warn');
        });
      }, 20);
    }

    function installResult(result) {
      state.puzzle = result.puzzle;
      state.originalPuzzle = [...result.puzzle];
      elements.input.value = core.encode(state.originalPuzzle);
      state.solution = result.solution;
      actions.hideSolution();
    }

    return { run };
  }

  app.puzzleGenerator = { create };
})(window);
