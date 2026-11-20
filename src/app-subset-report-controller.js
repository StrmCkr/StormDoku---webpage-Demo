/* StormDoku generic naked and hidden subset report selection. */
(function installSubsetReportController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, subsetView, state, actions }) {
    function subsetSizeName(size) {
      return ['Single', 'Pair', 'Triple', 'Quad', 'Quintuple', 'Sextuple', 'Septuple', 'Octuple', 'Nontuple'][size - 1]
        || `${size}-set`;
    }

    function renderGenericSubsetReport(kind) {
      const hidden = kind === 'hidden';
      const report = hidden ? state.hiddenReport : state.nakedReport;
      subsetView.render({
        report,
        container: hidden ? state.hiddenResults : state.nakedResults,
        kind,
        selectedKey: hidden ? state.selectedHiddenKey : state.selectedNakedKey,
        subsetSizeName,
        cellGroupName: cells => core.cellGroupName(cells),
        sectorGroupName: sectors => core.sectorGroupName(sectors),
        formatRemovals: removals => core.formatRemovals(removals),
        onSelect: (index, size) => selectSubsetReport(kind, index, size),
      });
    }

    function subsetStepFromReport(kind, item) {
      const names = ['single', 'pair', 'triple', 'quad', 'quintuple', 'sextuple', 'septuple', 'octuple', 'nontuple'];
      const sectorType = item.sector < 9
        ? 'row'
        : item.sector < 18
          ? 'col'
          : item.sector < 27
            ? 'box'
            : (() => {
              const name = core.variantUnitName(item.sector);
              return name === 'D1'
                ? 'diagonal'
                : name === 'AD1'
                  ? 'anti-diagonal'
                  : 'variant-sector';
            })();
      const sectorIndex = item.sector < 9
        ? item.sector
        : item.sector < 18
          ? item.sector - 9
          : item.sector < 27
            ? item.sector - 18
            : item.sector;
      const removals = item.removals.map(removal => ({ ...removal }));
      const label = `${item.locked ? 'Locked ' : ''}${kind === 'hidden' ? 'Hidden' : 'Naked'} ${subsetSizeName(item.size)}`;
      return {
        tech: `${kind}-${names[item.size - 1] || `${item.size}-set`}`,
        desc: `${label}: (${item.digits.join('')}) ${core.cellGroupName(item.cells)} `
          + `in ${core.sectorGroupName([item.sector])} => ${core.formatRemovals(removals)}`,
        elim: { items: removals },
        digits: item.digits,
        at: item.cells,
        base: { type: sectorType, indices: [sectorIndex] },
        vertices: item.cells,
        genericSubset: item,
      };
    }

    function selectSubsetReport(kind, index, sizeOverride = null) {
      const hidden = kind === 'hidden';
      const report = hidden ? state.hiddenReport : state.nakedReport;
      const size = sizeOverride ?? (hidden ? state.selectedHiddenSize : state.selectedNakedSize);
      const item = report?.filter(record => record.size === size)?.[index];
      if (!item) return;
      if (hidden) state.selectedHiddenSize = size;
      else state.selectedNakedSize = size;
      const key = `${size}:${index}`;
      if (hidden) state.selectedHiddenKey = key;
      else state.selectedNakedKey = key;
      state.selectedAlsId = null;
      state.selectedAhsId = null;
      state.selectedChainIndex = null;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.selectedBoxLineIndex = null;
      const step = subsetStepFromReport(kind, item);
      state.activeStep = step;
      state.lastRemoved = step.elim.items;
      actions.renderBoard();
      renderGenericSubsetReport(kind);
      actions.setStatus(`${hidden ? 'Hidden' : 'Naked'} subset ${index + 1} selected.`, 'ok');
      actions.focusMap();
    }

    return {
      subsetSizeName,
      renderGenericSubsetReport,
      subsetStepFromReport,
      renderNakedSubsetReport: () => renderGenericSubsetReport('naked'),
      renderHiddenSubsetReport: () => renderGenericSubsetReport('hidden'),
    };
  }

  app.subsetReportController = { create };
})(window);
