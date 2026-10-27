/* StormDoku fish-sector and digit control UI. */
(function installFishControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ core, variantSettings, settings, elements, ranges, toggleUi, fillNumberSelect, selectedNumbers, onChanged }) {
    function syncRanges(changed, controls = null) {
      const range = controls || ranges;
      const minSize = Number(range.minSize.value);
      const maxSize = Number(range.maxSize.value);
      const minK = Number(range.minK.value);
      const maxK = Number(range.maxK.value);
      if (minSize > maxSize) {
        if (changed === range.minSize) range.maxSize.value = String(minSize);
        else range.minSize.value = String(maxSize);
      }
      if (minK > maxK) {
        if (changed === range.minK) range.maxK.value = String(minK);
        else range.minK.value = String(maxK);
      }
      onChanged();
    }

    function sectorLabel(index) {
      if (index < 9) return `r${index + 1}`;
      if (index < 18) return `c${index - 8}`;
      if (index < 27) return `b${index - 17}`;
      return core.variantUnitName(index) || `s${index + 1}`;
    }

    function syncVariantSectors(addActive = false) {
      const active = new Set(Array.from(
        { length: Math.max(0, core.UNITS.length - 27) },
        (_, index) => index + 27,
      ));
      for (const sectors of [settings.baseSectors, settings.coverSectors]) {
        for (let sector = 27; sector < 64; sector++) {
          if (active.has(sector)) {
            if (addActive) sectors.add(sector);
          } else sectors.delete(sector);
        }
      }
    }

    function renderSectorGrid(kind) {
      syncVariantSectors();
      const container = kind === 'baseSectors' ? elements.base : elements.cover;
      const variantSectors = Array.from(
        { length: Math.max(0, core.UNITS.length - 27) },
        (_, index) => index + 27,
      );
      toggleUi.buildGrid(
        container,
        [...Array.from({ length: 27 }, (_, index) => index), ...variantSectors],
        settings[kind],
        sectorLabel,
        onChanged,
      );
      for (const button of document.querySelectorAll('[data-sector-variants]')) {
        const variants = button.dataset.sectorVariants.split(',');
        button.hidden = !variants.some(name => variantSettings[name]);
      }
    }

    function setVariantRange(kind, names, on) {
      const wanted = new Set(names);
      let sector = 27;
      for (const [variantName, units] of Object.entries(core.VARIANT_UNITS || {})) {
        if (!variantSettings[variantName]) continue;
        for (let offset = 0; offset < units.length; offset += 1, sector += 1) {
          if (!wanted.has(variantName)) continue;
          if (on) settings[kind].add(sector);
          else settings[kind].delete(sector);
        }
      }
      renderSectorGrid(kind);
      onChanged();
    }

    function setRange(kind, start, end, on) {
      for (let sector = start; sector < end; sector++) {
        if (on) settings[kind].add(sector);
        else settings[kind].delete(sector);
      }
      renderSectorGrid(kind);
      onChanged();
    }

    function setAllDigits(on) {
      settings.digits.clear();
      if (on) for (let digit = 1; digit <= 9; digit++) settings.digits.add(digit);
      toggleUi.buildGrid(elements.digits, [1, 2, 3, 4, 5, 6, 7, 8, 9], settings.digits,
        digit => String(digit), onChanged);
      onChanged();
    }

    function initialize() {
      fillNumberSelect(elements.fishMinSize, 1, 7, 2);
      fillNumberSelect(elements.fishMaxSize, 1, 7, 4);
      fillNumberSelect(elements.fishMinK, 0, 2, 1);
      fillNumberSelect(elements.fishMaxK, 0, 2, 2);
      fillNumberSelect(elements.afMinSize, 2, 7, 2);
      fillNumberSelect(elements.afMaxSize, 2, 7, 4);
      fillNumberSelect(elements.afMinK, 0, 2, 0);
      fillNumberSelect(elements.afMaxK, 1, 2, 2);
      for (const select of [elements.fishMinSize, elements.fishMaxSize, elements.fishMinK, elements.fishMaxK]) {
        select.addEventListener('change', () => syncRanges(select));
      }
      for (const checkbox of [elements.fishFast, elements.fishBasic, elements.fishFranken, elements.fishMutant]) {
        checkbox.addEventListener('change', onChanged);
      }
      const ahsRanges = {
        minSize: elements.afMinSize,
        maxSize: elements.afMaxSize,
        minK: elements.afMinK,
        maxK: elements.afMaxK,
      };
      for (const select of Object.values(ahsRanges)) {
        select.addEventListener('change', () => syncRanges(select, ahsRanges));
      }
      for (const checkbox of [elements.afBasic, elements.afFranken, elements.afMutant]) {
        checkbox.addEventListener('change', onChanged);
      }
      setAllDigits(true);
      renderSectorGrid('baseSectors');
      renderSectorGrid('coverSectors');
    }

    function almostOptions() {
      return {
        minSize: Number(elements.afMinSize.value),
        maxSize: Number(elements.afMaxSize.value),
        minK: Number(elements.afMinK.value),
        maxK: Number(elements.afMaxK.value),
        basicsEnabled: elements.afBasic.checked,
        frankenEnabled: elements.afFranken.checked,
        mutantEnabled: elements.afMutant.checked,
      };
    }

    function pomOptions() {
      return {
        minSize: Number(elements.fishMinSize.value),
        maxSize: Number(elements.fishMaxSize.value),
        minK: Number(elements.fishMinK.value),
        maxK: Number(elements.fishMaxK.value),
        digits: selectedNumbers(settings.digits),
        baseSectors: selectedNumbers(settings.baseSectors),
        coverSectors: selectedNumbers(settings.coverSectors),
        basicsEnabled: elements.fishBasic.checked,
        frankenEnabled: elements.fishFranken.checked,
        mutantEnabled: elements.fishMutant.checked,
        earlyTermination: elements.fishFast.checked,
      };
    }

    function solverOptions({ grid, omissionFishSearch, enabledTechniques }) {
      return {
        ...pomOptions(),
        grid,
        omissionFishSearch,
        enabledTechniques,
      };
    }

    return { initialize, almostOptions, pomOptions, solverOptions, syncRanges, sectorLabel, syncVariantSectors, renderSectorGrid, setVariantRange, setRange, setAllDigits };
  }

  app.fishControls = { create };
})(window);
