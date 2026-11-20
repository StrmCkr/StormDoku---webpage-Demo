/* StormDoku Multi-colouring and 3D-Medusa multi Eureka formatting. */
(function installMultiColoringText(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, threeDMedusaEureka }) {
    function outerText(colors) {
      if (colors?.length > 1) return 'A/B';
      return colors?.[0] === 0 ? 'A' : colors?.[0] === 1 ? 'B' : 'false';
    }

    function innerText(innerColor, colourTokens = null) {
      if (Array.isArray(colourTokens) && colourTokens.length) return colourTokens.join(' + ');
      const colors = Array.isArray(innerColor) ? innerColor : [innerColor];
      if (colors.length > 1) return 'blue + purple';
      return colors[0] === 0 ? 'blue' : 'purple';
    }

    function linkText(record) {
      return (record.linkColours || []).map(link => {
        const endpoints = (link.endpoints || []).map(endpoint =>
          `${core.cellGroupName([endpoint.cell])} ${innerText(endpoint.colors || endpoint.innerColor, endpoint.colourTokens)}`,
        ).join(', ');
        const pair = (link.pairColours || []).join(' | ');
        return `${link.label}[${core.cellGroupName(link.cells)}] ${pair || outerText(link.colors)} {${endpoints}}`;
      }).join(' ; ') || 'none';
    }

    function multiColoringEureka(record) {
      const eliminations = core.formatRemovals(record.eliminations || []) || 'none';
      const closure = record.terminalClosure?.cells?.length
        ? ` -> terminal ${core.cellGroupName(record.terminalClosure.cells)}`
        : record.ring ? ' -> ring' : '';
      const digitLabel = Number.isInteger(record.digit)
        ? String(record.digit)
        : (record.digits || []).join('');
      const witnesses = [];
      for (const conflict of record.parityConflicts || []) {
        if (conflict.kind === 'sector-peer-union' || conflict.kind === 'weak-parity') continue;
        const colour = conflict.parity === 0 ? 'A' : 'B';
        witnesses.push(
          `parity ${colour} repeats in ${core.sectorGroupName([conflict.sector])}`
          + ` (${core.cellGroupName(conflict.cells || [])})`,
        );
      }
      if ((record.rules || []).includes('grouped-opposite-parity-visibility')) {
        witnesses.push('grouped side sees opposite parity');
      } else if ((record.rules || []).includes('weak-nand-contradiction')) {
        // Keep older saved records readable while using the precise label for current grouped links.
        witnesses.push('weak NAND assumption contradiction');
      }
      for (const conflict of record.alsDofConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `ALS-DOF ${colour} false ${core.cellGroupName(conflict.cells || [])}`
          + ` -${(conflict.colouredDigits || []).join('') || 'none'}`
          + ` leaves ${(conflict.remainingDigits || []).join('') || 'none'}`,
        );
      }
      for (const conflict of record.ahsDofConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `AHS-DOF ${colour} false ${core.cellGroupName(conflict.ahsCells || [])}`
          + ` -cells ${core.cellGroupName(conflict.removedCells || []) || 'none'}`,
        );
      }
      for (const conflict of record.sectorClearedConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `sector cleared ${core.sectorGroupName([conflict.sector])}`
          + ` digit ${conflict.digit} ${colour} false`,
        );
      }
      for (const conflict of record.cellParityConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `cell ${core.cellGroupName([conflict.cell])} has multiple digits`
          + ` in ${colour} parity (${(conflict.digits || []).join('')})`,
        );
      }
      const witness = witnesses.length ? ` [${witnesses.join(' ; ')}]` : '';
      return `Multi-colouring: (${digitLabel || 'graph'}) ${linkText(record)}${closure}${witness} => ${eliminations}.`;
    }

    function threeDMedusaMultiEureka(record) {
      if (record.source === 'multi') {
        const bivalveTruth = (record.bivalveTruth || [])
          .filter(item => Number.isInteger(item.digit))
          .map(item => `${core.cellGroupName([item.cell])}=${item.digit}`)
          .join(', ');
        const eureka = multiColoringEureka(record)
          .replace(/^Multi-colouring:/, '3D - Medusa {Multi-colouring}:');
        return bivalveTruth
          ? eureka.replace(' => ', ` [bivalve singleton: ${bivalveTruth}] => `)
          : eureka;
      }
      return threeDMedusaEureka(record).replace(/^3D - Medusa \{Simple\}/, '3D - Medusa {Multi-colouring}');
    }

    return { multiColoringEureka, threeDMedusaMultiEureka };
  }

  app.multiColoringText = { create };
})(window);
