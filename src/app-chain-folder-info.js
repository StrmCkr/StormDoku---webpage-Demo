/* StormDoku primary chain-folder resolver. */
(function installChainFolderInfo(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create() {
    function chainFolderInfo(chain) {
      if (chain.structureFamily && chain.structureWing && chain.structureRank) {
        return {
          family: chain.structureFamily,
          wing: chain.structureWing,
          rank: chain.structureRank,
          subclass: chain.structureSubclass || chain.structureName || null,
        };
      }

      const name = String(chain.structureName || (chain.isRing ? 'Ring' : 'AIC'));
      if (/^T\s*-\s*ALS\s*-\s*(?:XZ|XY)(?:\s+Ring)?$/i.test(name)) {
        const suffix = /XY$/i.test(name) ? 'XY' : 'XZ';
        return {
          family: 'Transport',
          wing: `ALS-${suffix}`,
          rank: chain.isRing ? 'Ring' : 'Wing',
          subclass: `T-ALS-${suffix}`,
        };
      }
      const aicAlsMatch = name.match(/^AIC\s*\+\s*ALS\s*-\s*(.+)$/i);
      if (aicAlsMatch) {
        return {
          family: 'AIC + ALS',
          wing: aicAlsMatch[1].trim(),
          rank: null,
          subclass: null,
        };
      }

      const match = name.match(/^(.*?)(L|M|H)(?:\((\d+)\))?\s*-\s*(.+)$/i);
      if (!match) return { family: name, wing: null, rank: null, subclass: null };

      const prefix = match[1].trim().replace(/\s*-\s*$/, '');
      const rankType = match[2].toUpperCase();
      const rank = match[3] ? `(${match[3]})` : '';
      const label = match[4].trim();
      const kind = /ring/i.test(label) || chain.isRing ? 'Ring' : 'Wing';
      const designator = prefix ? `${prefix} ${rankType}` : null;
      const structuralSubclass = label.toLowerCase() === kind.toLowerCase() ? null : label;
      const subclass = designator
        ? structuralSubclass ? `${designator} - ${structuralSubclass}` : designator
        : structuralSubclass;
      return {
        family: rankType === 'M'
          ? 'M - Wing | Ring'
          : rankType === 'H'
            ? 'Hybrid - Wing | Ring'
            : 'Local - Wing | Ring',
        wing: kind,
        rank: `${rankType}${rank}`,
        subclass,
      };
    }

    return { chainFolderInfo };
  }

  app.chainFolderInfo = { create };
})(window);
