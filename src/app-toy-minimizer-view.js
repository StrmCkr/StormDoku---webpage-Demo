/* Clue-minimizer presentation helpers. */
(function installToyMinimizerView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function clear(elements) {
    elements.results.textContent = 'No clue minimization has been run.';
    elements.replace.disabled = true;
  }
  function render(elements, report, cellLabel) {
    elements.results.textContent = '';
    const doc = elements.results.ownerDocument;
    const summary = doc.createElement('p');
    summary.textContent = report
      ? `Unique solution preserved. ${report.removed.length} of ${report.sourceGivenCount} clues can be removed in this reduction order; ${report.reducedGivenCount} clues remain.`
      : 'No clue minimization has been run.';
    elements.results.appendChild(summary);
    if (!report) { elements.replace.disabled = true; return; }
    const note = doc.createElement('p');
    note.textContent = report.removed.length
      ? 'Accepted removals are listed below. The displayed reduced grid is the state that can be replaced.'
      : 'No clue was removable while preserving uniqueness.';
    elements.results.appendChild(note);
    if (report.removed.length) {
      const list = doc.createElement('ul');
      for (const item of report.removed) {
        const entry = doc.createElement('li'); entry.textContent = cellLabel(item.cell, item.digit); list.appendChild(entry);
      }
      elements.results.appendChild(list);
    }
    elements.replace.disabled = !report.removed.length;
  }
  app.toyMinimizerView = { clear, render };
})(window);
