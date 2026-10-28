/* Automorphic result-panel helpers. */
(function installToyAutomorphView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function clear(results) { results.textContent = 'No automorphic identity search has been run.'; }
  function append(list, description) {
    const item = list.ownerDocument.createElement('li');
    item.appendChild(list.ownerDocument.createTextNode(description)); list.appendChild(item);
  }
  function renderSearch(elements, data) {
    const results = elements.results; const doc = results.ownerDocument; results.textContent = '';
    const intro = doc.createElement('p');
    intro.textContent = data.fullFamilySearch
      ? `Compared the ${data.mode}; tested ${data.tested.toLocaleString()} legal transformations against its Mini-lex grid; found ${data.total} complete automorphisms.`
      : `Compared the ${data.mode}; tested ${data.tested} named family transformations against its Mini-lex grid; found ${data.total} ${data.total === 1 ? 'identity' : 'identities'}.`;
    results.appendChild(intro);
    if (data.fullFamilySearch) {
      const shortcut = doc.createElement('p');
      shortcut.textContent = `Named shortcut checks found ${data.namedTotal} matching identity ${data.namedTotal === 1 ? 'class' : 'classes'} across ${Object.keys(data.labels).length} symmetry families.`;
      results.appendChild(shortcut);
    }
    if (!data.total) {
      const none = doc.createElement('p'); none.textContent = 'No digit-renamed automorphic identity was found in the selected families.';
      results.appendChild(none);
    }
    const limit = 200;
    if (data.fullFamilySearch && data.total) {
      const panel = doc.createElement('details'); const summary = doc.createElement('summary');
      summary.textContent = data.total === 1 ? 'Asymmetric (identity only)' : `Automorphisms (${data.total})`;
      panel.appendChild(summary); const list = doc.createElement('ol');
      for (const entry of data.completeMatches.slice(0, limit)) append(list, `${data.completeLabel(entry)}; digit map ${data.formatMap(entry.mapping)}`);
      if (data.completeMatches.length > limit) append(list, `Showing ${limit} of ${data.completeMatches.length} complete matches.`);
      panel.appendChild(list); results.appendChild(panel);
    }
    for (const family of data.familyNames) {
      const entries = data.matches.get(family); if (!entries?.length) continue;
      const panel = doc.createElement('details'); const summary = doc.createElement('summary');
      summary.textContent = `${data.labels[family]} (${entries.length})`; panel.appendChild(summary);
      const list = doc.createElement('ol');
      for (const entry of entries.slice(0, limit)) append(list, `${entry.label}; digit map ${data.formatMap(entry.mapping)}`);
      if (entries.length > limit) append(list, `Showing ${limit} of ${entries.length} matches.`);
      panel.appendChild(list); results.appendChild(panel);
    }
  }
  app.toyAutomorphView = { clear, renderSearch };
})(window);
