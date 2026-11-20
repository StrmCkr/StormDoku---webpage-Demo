/* Add an applied move to the solution log and refresh its cumulative rating. */
(function installSolutionStepLog(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ getContext, setRatingReport }) {
    function appendStep(step) {
      const {
        cycle,
        ratingForStep,
        constructDisplayName,
        logEntries,
        snapshotVisualState,
        ratingFromLog,
        candidateGridIsSolved,
        cand,
        puzzle,
      } = getContext();
      const rating = ratingForStep(step);
      const entry = {
        cycle,
        tech: step.tech,
        desc: step.desc,
        moveName: step.chain
          ? constructDisplayName(step.chain, rating.tag)
          : rating.tag,
        ratingTag: rating.tag,
        rating,
        ...(step.chain ? { chain: step.chain } : {}),
      };
      logEntries.push(entry);
      // Save the board after this move, including the exact drawing inputs,
      // without recursively snapshotting the complete solution log.
      entry.displayState = snapshotVisualState();
      // Keep the visible score synchronized with the complete solution log,
      // rather than allowing a later search pass to replace it with only its
      // newest move.
      setRatingReport(ratingFromLog(logEntries, candidateGridIsSolved(cand, puzzle)));
    }

    return { appendStep };
  }

  app.solutionStepLog = { create };
})(window);
