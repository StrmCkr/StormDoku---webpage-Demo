/* StormDoku chain-candidate visibility rules. */
(function installCandidateVisibility(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create({ hasCandidate, getDofRecord, getSelectedChain, getHydraRecord, getLastRemoved }) {
    function isVisible(cell, digit) {
      if (hasCandidate(cell, digit)) return true;
      const dofRecord = getDofRecord();
      const displayed = getSelectedChain() || (dofRecord?.hasHydra ? dofRecord : getHydraRecord());
      if (displayed?.hasHydra || getHydraRecord()) return false;
      const removed = getLastRemoved();
      return removed.some(item => item.cell === cell && item.digit === digit)
        && (displayed?.eliminations || []).some(item => item.cell === cell && item.digit === digit);
    }
    return { isVisible };
  }
  app.candidateVisibility = { create };
})(window);
