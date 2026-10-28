/* StormDoku display-name helpers. */
(function installDisplayNames(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  const boxLineTechniques = new Set(['pointing', 'claiming', 'non-consecutive-line', 'non-consecutive-eri', 'non-consecutive-als', 'non-consecutive-als-dof', 'non-consecutive-als-dof-peer']);

  function displayTech(tech) {
    if (boxLineTechniques.has(tech)) return 'Box - Line Reduction';
    return tech.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }

  function constructDisplayName(chain, ratingTag) {
    const ratedName = String(ratingTag || '').trim();
    const structureName = String(chain?.structureName || '').trim();
    if (!structureName) return ratedName;
    const namedStructure = structureName;
    const isGenericName = value => /^(?:AIC|AIC\s*\+\s*ALS(?:\s+Chain)?|ALS\s*-\s*(?:XZ|XY|Chain)(?:\s+Ring)?|AHS\s*-\s*(?:XZ|XY|Chain)(?:\s+Ring)?|X-Chain\s+\(Depth\s+\d+\)(?:\s+Ring)?)$/i.test(value);
    if (namedStructure !== structureName && !isGenericName(ratedName)) return ratedName || namedStructure;
    if (isGenericName(ratedName) && !isGenericName(namedStructure)) return namedStructure;
    return ratedName || namedStructure;
  }

  app.displayNames = { displayTech, constructDisplayName };
})(window);
