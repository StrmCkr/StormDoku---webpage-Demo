/* Puzzle input parsing, uniqueness checks, and candidate-grid installation. */
(function installPuzzleLoader(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, state, elements, actions }) {
    function load() {
      actions.syncVariantSettingsFromControls();
      core.configureVariants(actions.getVariantSettings());
      actions.cancelActiveSearches('Search cancelled by puzzle reload.');
      actions.leaveHistoryPreview();
      const input = elements.input.value;
      const grid = core.decode(input);
      const parsed729 = grid ? null : core.parse729Data(input);
      if (!grid && !parsed729) {
        actions.setStatus('Enter an 81-character puzzle string, 729 candidate bits, or candidate-grid text.', 'warn');
        return;
      }
      if (parsed729 && !parsed729.valid) {
        actions.setStatus('The 729 data contains conflicting space-proven givens.', 'warn');
        return;
      }

      const loadedGrid = parsed729 ? parsed729.grid : grid;
      state.generationToken += 1;
      // Clear old logic as soon as a valid replacement grid is accepted;
      // uniqueness checking happens asynchronously below.
      actions.resetAnalysisAfterPlayerEdit();
      actions.render();
      const searchToken = actions.setBusy(true);
      actions.setStatus('Checking puzzle uniqueness...');

      actions.scheduleSearch(async () => {
        try {
          const dlxResult = await actions.runCoreSearch('solveDlx', loadedGrid, 2);
          if (dlxResult.count === 0) {
            if (parsed729) {
              installGrid(loadedGrid, null);
              actions.resetCandidates('Loaded 729 candidate data. No DLX solution was found.', parsed729.candidates);
              actions.showLoadWarning('The 729 candidate data has no DLX solution. The candidate grid was loaded for inspection.');
              return;
            }
            actions.setStatus('That puzzle has no solution.', 'warn');
            return;
          }

          if (dlxResult.count > 1) {
            if (parsed729) {
              installGrid(loadedGrid, null);
              actions.resetCandidates('Loaded 729 candidate data. DLX found multiple solutions.', parsed729.candidates);
              actions.showLoadWarning('The 729 candidate data has multiple DLX solutions. The candidate grid was loaded for inspection.');
              return;
            }
            actions.setStatus('That puzzle has more than one solution.', 'warn');
            return;
          }

          installGrid(loadedGrid, dlxResult.solution);
          actions.hideSolution();
          actions.resetCandidates(
            parsed729
              ? `Loaded unique 729 candidate data and preserved ${parsed729.givenCells.length} space-proven givens.`
              : 'Loaded unique puzzle and rebuilt candidates.',
            parsed729?.candidates || null,
          );
        } catch (error) {
          if (actions.isSearchCancelled(error)) return;
          actions.setStatus('Could not check that puzzle.', 'warn');
        } finally {
          actions.setBusy(false, searchToken);
        }
      }, 20);
    }

    function installGrid(grid, solution) {
      state.puzzle = grid;
      state.originalPuzzle = [...grid];
      elements.input.value = core.encode(state.originalPuzzle);
      state.solution = solution;
    }

    return { load };
  }

  app.puzzleLoader = { create };
})(window);
