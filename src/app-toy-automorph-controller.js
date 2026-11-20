/* Automorphic identity search UI workflow. */
(function installToyAutomorphController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    isBusy,
    getSelectedFamilies,
    familyLabels,
    getSource,
    usesSolution,
    hasGridInformation,
    buildMiniLex,
    getFamilyRecords,
    searchAutomorphisms,
    getSearchOptions,
    renderSearch,
    resultsEl,
    setStatus,
  }) {
    function run() {
      if (isBusy()) return;
      const familyNames = getSelectedFamilies();
      if (!familyNames.length) {
        resultsEl.textContent = 'Select at least one symmetry family.';
        return;
      }
      const comparison = getSource();
      if (usesSolution() && !comparison.hasSolution) {
        resultsEl.textContent = 'No complete solution is available for this grid. Use the grid string or solve the puzzle first.';
        setStatus('Automorphic search needs a complete solution.', 'warn');
        return;
      }
      if (!hasGridInformation(comparison.source)) {
        resultsEl.textContent = 'There is no given, solved, or candidate information to compare.';
        setStatus('Automorphic search needs grid information.', 'warn');
        return;
      }
      const miniLex = buildMiniLex();
      if (!miniLex) {
        resultsEl.textContent = 'Mini-lex canonicalization could not be built for this source.';
        setStatus('Automorphic search could not build the Mini-lex grid.', 'warn');
        return;
      }
      const fullFamilySearch = familyNames.length === Object.keys(familyLabels).length;
      const search = searchAutomorphisms(
        familyNames,
        getFamilyRecords(),
        comparison.source,
        comparison.target,
        miniLex.values,
        fullFamilySearch,
        getSearchOptions(),
      );
      const { matches, completeMatches, tested, total, namedTotal } = search;
      renderSearch({
        mode: comparison.mode,
        tested,
        total,
        namedTotal,
        fullFamilySearch,
        matches,
        completeMatches,
        familyNames,
        labels: familyLabels,
      });
      setStatus(
        total
          ? `Automorphic search found ${total} digit-renamed ${total === 1 ? 'identity' : 'identities'}.`
          : 'Automorphic search found no identities.',
        total ? 'ok' : 'warn',
      );
    }

    return { run };
  }

  app.toyAutomorphController = { create };
})(window);
