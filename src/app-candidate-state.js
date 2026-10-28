/* StormDoku candidate-state helpers. */
(function installCandidateState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function atomKey(cell, digit) { return String(cell) + ':' + String(digit); }
  function cellHasCandidate(candidates, cell, digit) { return (candidates[cell] || []).includes(digit); }
  function markFor(candidates, cell, digit) { return cellHasCandidate(candidates, cell, digit) ? digit : ''; }
  function digitHasRemainingCandidates(candidates, puzzle, promotedValues, digit) {
    return candidates.some((values, cell) => !puzzle[cell] && !promotedValues[cell] && (values || []).includes(digit));
  }
  app.candidateState = { atomKey, cellHasCandidate, markFor, digitHasRemainingCandidates };
})(window);
