/* StormDoku ALS/AHS graph-link report rendering. */
(function installAuxiliaryLinkView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, core }) {
    function endpointText(endpoint) {
      return `(${endpoint.digit}) ${core.cellGroupName(endpoint.cells)}`
        + ` in ${core.sectorGroupName(endpoint.sectors)}`;
    }

    function alsNodeText(node) {
      if (!node) return 'none';
      return `LS#${node.uniqueID} ${core.cellGroupName(node.cells)} `
        + `in ${core.sectorGroupName([node.sector])} digits {${node.digits.join('')}}`;
    }

    function endpointElims(endpoint) {
      const removals = endpoint.potentialElim.map(cell => ({ cell, digit: endpoint.digit }));
      return core.formatRemovals(removals) || 'none';
    }

    function bridgeText(bridge) {
      if (!bridge) return 'C none';
      const digits = (bridge.digits && bridge.digits.length ? bridge.digits : [bridge.digit])
        .filter(Boolean)
        .join('');
      const cells = [...new Set([...(bridge.leftCells || []), ...(bridge.rightCells || [])])]
        .sort((a, b) => a - b);
      return `C(${digits || '?'}) ${core.cellGroupName(cells)} in ${core.sectorGroupName(bridge.sectors || [])}`;
    }

    function renderAls(report, container) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No ALS link build has been run.';
        return;
      }
      const links = core.flattenAlsLinks(report);
      const alsRccCount = report[core.ALS_RCC]?.length || 0;
      const summary = documentRef.createElement('p');
      summary.textContent = `${links.length} ALS graph links: ALS_RCC ${alsRccCount}. `
        + 'Size-1 Bivalve ALS nodes are listed under Strong Links as ALS.';
      container.appendChild(summary);

      const list = documentRef.createElement('ul');
      const visible = links.slice(0, 200);
      for (const link of visible) {
        const item = documentRef.createElement('li');
        item.textContent = `${link.linkTypeName}: RCC_L ${endpointText(link.RCC_Left)} / `
          + `${alsNodeText(link.LS_R)} / ${bridgeText(link.C)} / ${alsNodeText(link.LS_L)} / `
          + `RCC_R ${endpointText(link.RCC_Right)}; `
          + `L-elims ${endpointElims(link.RCC_Left)}; R-elims ${endpointElims(link.RCC_Right)}`;
        list.appendChild(item);
      }
      if (links.length > visible.length) {
        const more = documentRef.createElement('li');
        more.textContent = `Showing ${visible.length} of ${links.length} records.`;
        list.appendChild(more);
      }
      container.appendChild(list);
    }

    function renderAhs(report, container) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No AHS link build has been run.';
        return;
      }
      const links = core.flattenAhsLinks(report);
      const summary = documentRef.createElement('p');
      summary.textContent = `${links.length} AHS graph link${links.length === 1 ? '' : 's'} built.`;
      container.appendChild(summary);
      const list = documentRef.createElement('ul');
      for (const link of links.slice(0, 200)) {
        const item = documentRef.createElement('li');
        const cells = value => core.cellGroupName(value || []);
        const branches = Array.isArray(link.overlapBranches)
          ? `; branches ${link.overlapBranches.map(branch => `${branch.value}: `
            + `${cells(branch.left?.cells)}[${(branch.left?.digits || []).join('')}] / `
            + `${cells(branch.right?.cells)}[${(branch.right?.digits || []).join('')}]`
            + `${branch.hsRestrictions?.length
              ? ` => ${branch.hsRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${branch.dofRestrictions?.length
              ? `; ${branch.dofRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${branch.sectorRestrictions?.length
              ? `; ${branch.sectorRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${branch.left?.eliminations?.length || branch.right?.eliminations?.length
              ? `; ${core.formatRemovals([...(branch.left?.eliminations || []), ...(branch.right?.eliminations || [])])}`
              : ''}`).join(' | ')}`
          : '';
        const intrinsic = Array.isArray(link.intrinsicEliminations) && link.intrinsicEliminations.length
          ? `; elims ${core.formatRemovals(link.intrinsicEliminations)}`
          : '';
        const bridgeExclusions = Array.isArray(link.bridgeCellExclusions) && link.bridgeCellExclusions.length
          ? `; bridge ${cells([link.xzBridgeCell])}<>${link.bridgeCellExclusions.join('')}`
          : '';
        item.textContent = `${link.moduleKind || link.linkTypeName}: RCC_L ${cells(link.RCC_Left?.rccCells || link.RCC_Left?.cells)} / `
          + `HS_L ${cells(link.HS_L?.cells)} / C ${cells(link.C?.leftCells || link.C?.cells)} / `
          + `HS_R ${cells(link.HS_R?.cells)} / RCC_R ${cells(link.RCC_Right?.rccCells || link.RCC_Right?.cells)}`
          + branches + intrinsic + bridgeExclusions;
        list.appendChild(item);
      }
      if (links.length > 200) {
        const more = documentRef.createElement('li');
        more.textContent = `Showing 200 of ${links.length} records.`;
        list.appendChild(more);
      }
      container.appendChild(list);
    }

    return { renderAls, renderAhs };
  }

  app.auxiliaryLinkView = { create };
})(window);
