(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core.setTools) throw new Error('set-tools-core.js must load before pom-core.js');
  const { combinations } = core.setTools;
  let catalog = null;

  function generateTemplates() {
    const templates = [];
    const columns = new Array(9).fill(-1);
    const usedColumns = new Set();
    const usedBoxes = new Set();

    function visit(row) {
      if (row === 9) {
        templates.push({
          id: templates.length,
          cells: columns.map((column, currentRow) => currentRow * 9 + column),
        });
        return;
      }

      const band = Math.floor(row / 3);
      for (let column = 0; column < 9; column++) {
        const box = band * 3 + Math.floor(column / 3);
        if (usedColumns.has(column) || usedBoxes.has(box)) continue;

        columns[row] = column;
        usedColumns.add(column);
        usedBoxes.add(box);
        visit(row + 1);
        usedColumns.delete(column);
        usedBoxes.delete(box);
      }
    }

    visit(0);
    return templates;
  }

  function allTemplates() {
    if (!catalog) catalog = generateTemplates();
    return catalog;
  }

  function candidateCells(cand, grid, digit) {
    const cells = new Set();

    for (let cell = 0; cell < 81; cell++) {
      if (grid[cell] === digit || (cand[cell] || []).includes(digit)) cells.add(cell);
    }

    return cells;
  }

  function candidateOnlyCells(cand, digit) {
    const cells = new Set();

    for (let cell = 0; cell < 81; cell++) {
      if ((cand[cell] || []).includes(digit)) cells.add(cell);
    }

    return cells;
  }

  function buildDigitIndex(templates) {
    const index = Array.from({ length: 81 }, () => []);

    for (const template of templates) {
      for (const cell of template.cells) index[cell].push(template.id);
    }

    return index;
  }

  function intersects(template, occupied) {
    return template.cells.some(cell => occupied.has(cell));
  }

  function hasCompatibleTemplates(lists, occupied) {
    const ordered = [...lists].sort((a, b) => a.length - b.length);

    function visit(index, used) {
      if (index === ordered.length) return true;

      for (const template of ordered[index]) {
        if (intersects(template, used)) continue;

        const next = new Set(used);
        for (const cell of template.cells) next.add(cell);
        if (visit(index + 1, next)) return true;
      }

      return false;
    }

    return visit(0, new Set(occupied));
  }

  function universallyExtendable(templatesByDigit, occupied, chosenDigits) {
    const remaining = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .filter(digit => !chosenDigits.has(digit));

    for (const size of [1, 2, 3, 4]) {
      for (const digits of combinations(remaining, size)) {
        const lists = digits.map(digit => templatesByDigit[digit - 1]);
        if (!lists.every(list => list.length) || !hasCompatibleTemplates(lists, occupied)) {
          return false;
        }
      }
    }

    return true;
  }

  function existsCompatibleSet(templatesByDigit, lists, occupied, chosenDigits) {
    const ordered = [...lists].sort((a, b) => a.length - b.length);

    function visit(index, used) {
      if (index === ordered.length) {
        return universallyExtendable(templatesByDigit, used, chosenDigits);
      }

      for (const template of ordered[index]) {
        if (intersects(template, used)) continue;

        const next = new Set(used);
        for (const cell of template.cells) next.add(cell);
        if (visit(index + 1, next)) return true;
      }

      return false;
    }

    return visit(0, new Set(occupied));
  }

  const ALL_SECTORS = Array.from({ length: 27 }, (_, index) => index);
  const POM_FISH_NAMES = {
    1: 'Cyclops',
    2: 'X-Wing',
    3: 'SwordFish',
    4: 'JellyFish',
    5: 'StarFish {Squirmbag}',
    6: 'Whale',
    7: 'Leviathan',
  };

  function uniqueSorted(values) {
    return [...new Set(values)].sort((a, b) => a - b);
  }

  function setFrom(values) {
    return new Set(values);
  }

  function setUnion(...sets) {
    const out = new Set();
    for (const set of sets) {
      for (const value of set) out.add(value);
    }
    return out;
  }

  function setIntersection(a, b) {
    const out = new Set();
    for (const value of a) if (b.has(value)) out.add(value);
    return out;
  }

  function setDifference(a, b) {
    const out = new Set();
    for (const value of a) if (!b.has(value)) out.add(value);
    return out;
  }

  function setEquals(a, b) {
    if (a.size !== b.size) return false;
    for (const value of a) if (!b.has(value)) return false;
    return true;
  }

  function isSetSubset(subset, set) {
    for (const value of subset) if (!set.has(value)) return false;
    return true;
  }

  function normaliseOmissionFishOptions(options = {}) {
    const minSize = options.minSize || 2;
    const maxSize = options.maxSize || 4;
    const minK = options.minK ?? 0;
    const maxK = options.maxK ?? 0;
    const cleanDigits = (options.digits || [1, 2, 3, 4, 5, 6, 7, 8, 9])
      .filter(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9);
    const cleanBaseSectors = (options.baseSectors || ALL_SECTORS)
      .filter(sector => Number.isInteger(sector) && sector >= 0 && sector < 27);
    const cleanCoverSectors = (options.coverSectors || ALL_SECTORS)
      .filter(sector => Number.isInteger(sector) && sector >= 0 && sector < 27);

    return {
      minSize: Math.min(minSize, maxSize),
      maxSize: Math.max(minSize, maxSize),
      minK: Math.min(minK, maxK),
      maxK: Math.max(minK, maxK),
      digits: new Set(cleanDigits),
      baseSectors: new Set(cleanBaseSectors),
      coverSectors: new Set(cleanCoverSectors),
      basicsEnabled: options.basicsEnabled ?? true,
      frankenEnabled: options.frankenEnabled ?? false,
      mutantEnabled: options.mutantEnabled ?? false,
      earlyTermination: options.earlyTermination ?? true,
      priorityMode: options.priorityMode ?? false,
      enabledTechniques: options.enabledTechniques
        ? new Set(options.enabledTechniques)
        : null,
    };
  }

  function buildDigitSectorState(cand) {
    const cellsByDigit = Array.from({ length: 9 }, () =>
      Array.from({ length: 27 }, () => new Set())
    );
    const activeSectorsByDigit = Array.from({ length: 9 }, () => new Set());

    for (let digit = 1; digit <= 9; digit++) {
      for (let sector = 0; sector < core.UNITS.length; sector++) {
        for (const cell of core.UNITS[sector]) {
          if (!(cand[cell] || []).includes(digit)) continue;
          cellsByDigit[digit - 1][sector].add(cell);
          activeSectorsByDigit[digit - 1].add(sector);
        }
      }
    }

    return { cellsByDigit, activeSectorsByDigit };
  }

  function isBasicRow(sectors) {
    return sectors.every(sector => sector < 9);
  }

  function isBasicCol(sectors) {
    return sectors.every(sector => sector >= 9 && sector < 18);
  }

  function isBasicBox(sectors) {
    return sectors.length > 0 && sectors.every(sector => sector >= 18);
  }

  function isImpossibleBoxFish(baseSectors, coverSectors) {
    return isBasicBox(baseSectors) && isBasicBox(coverSectors);
  }

  function isFrankenRow(sectors) {
    return sectors.some(sector => sector >= 18) && sectors.every(sector => sector < 9 || sector >= 18);
  }

  function isFrankenCol(sectors) {
    return sectors.some(sector => sector >= 18) && sectors.every(sector => sector >= 9);
  }

  function fishType(baseSectors, coverSectors) {
    const baseBasicRow = isBasicRow(baseSectors);
    const baseBasicCol = isBasicCol(baseSectors);
    const baseBasicBox = isBasicBox(baseSectors);
    const coverBasicRow = isBasicRow(coverSectors);
    const coverBasicCol = isBasicCol(coverSectors);
    const coverBasicBox = isBasicBox(coverSectors);
    const baseFrankenRow = isFrankenRow(baseSectors);
    const baseFrankenCol = isFrankenCol(baseSectors);
    const coverFrankenRow = isFrankenRow(coverSectors);
    const coverFrankenCol = isFrankenCol(coverSectors);

    if (
      (baseBasicRow && coverBasicCol)
      || (baseBasicCol && coverBasicRow)
      || (baseBasicBox && coverBasicRow)
      || (baseBasicBox && coverBasicCol)
      || (baseBasicRow && coverBasicBox)
      || (baseBasicCol && coverBasicBox)
    ) return 0;

    if (
      (baseFrankenRow && coverFrankenCol)
      || (baseFrankenCol && coverFrankenRow)
      || (baseBasicRow && coverFrankenCol)
      || (baseBasicCol && coverFrankenRow)
      || (coverBasicRow && baseFrankenCol)
      || (coverBasicCol && baseFrankenRow)
    ) {
      return 1;
    }

    return 2;
  }

  function baseCombinationAllowed(sectors, options) {
    if (options.mutantEnabled) return true;
    if (options.frankenEnabled) {
      return isBasicRow(sectors)
        || isBasicCol(sectors)
        || isBasicBox(sectors)
        || isFrankenRow(sectors)
        || isFrankenCol(sectors);
    }
    return options.basicsEnabled
      && (isBasicRow(sectors) || isBasicCol(sectors) || isBasicBox(sectors));
  }

  function baseSearchSectors(usableSectors, options) {
    if (options.basicsEnabled && !options.frankenEnabled && !options.mutantEnabled) {
      return [...usableSectors];
    }

    return [...usableSectors];
  }

  function coverSearchSectors(usableSectors, baseSectors, options) {
    if (options.basicsEnabled && !options.frankenEnabled && !options.mutantEnabled) {
      if (isBasicRow(baseSectors)) return usableSectors.filter(sector => sector >= 9);
      if (isBasicCol(baseSectors)) return usableSectors.filter(sector => sector < 9 || sector >= 18);
      if (isBasicBox(baseSectors)) return usableSectors.filter(sector => sector < 18);
    }

    return [...usableSectors];
  }

  function fishTypeAllowed(type, options) {
    if (type === 0) return options.basicsEnabled;
    if (type === 1) return options.frankenEnabled;
    return options.mutantEnabled;
  }

  function fishName(size, k, type) {
    const typeName = type === 1 ? 'Franken ' : type === 2 ? 'Mutant ' : '';
    const finned = k > 0 && size > 1 ? 'Finned ' : '';
    return `${finned}${typeName}${POM_FISH_NAMES[size] || `Fish ${size}`}`;
  }

  function fishMoveTypeForReport(fish) {
    const size = Number(fish?.size);
    const k = Number(fish?.k || 0);
    if (k > 0) return `${size}x${size}+k-fish`;
    return ({ 2: 'x-wing', 3: 'swordfish', 4: 'jellyfish' })[size] || null;
  }

  function fishReportEnabled(fish, options) {
    const enabled = options.enabledTechniques;
    return !enabled || enabled.has(fishMoveTypeForReport(fish));
  }

  function saveSectorCells(state, digit, sectors) {
    const rowCells = new Set();
    const colCells = new Set();
    const boxCells = new Set();
    const allUsedCells = new Set();

    for (const sector of sectors) {
      const activeCells = state.cellsByDigit[digit - 1][sector];
      for (const cell of activeCells) {
        allUsedCells.add(cell);
        if (sector < 9) rowCells.add(cell);
        else if (sector < 18) colCells.add(cell);
        else boxCells.add(cell);
      }
    }

    const rowColOverlap = setIntersection(rowCells, colCells);
    const colBoxOverlap = setIntersection(colCells, boxCells);
    const rowBoxOverlap = setIntersection(rowCells, boxCells);
    const rcbOverlap = setIntersection(rowColOverlap, boxCells);

    return {
      allUsedCells,
      rcbOverlap,
      baseIntersections: setUnion(rcbOverlap, rowBoxOverlap, rowColOverlap, colBoxOverlap),
      twoCoverIntersections: setUnion(rowBoxOverlap, rowColOverlap, colBoxOverlap),
    };
  }

  function sectorCellCountsInRange(state, digit, sectors, size) {
    return sectors.every(sector => state.cellsByDigit[digit - 1][sector].size <= size + 4);
  }

  function noDuplicateCellSectors(state, digit, sectors) {
    for (let i = 0; i < sectors.length; i++) {
      const cellsA = state.cellsByDigit[digit - 1][sectors[i]];
      for (let j = i + 1; j < sectors.length; j++) {
        const cellsB = state.cellsByDigit[digit - 1][sectors[j]];
        if (setEquals(cellsA, cellsB)) return false;
      }
    }

    return true;
  }

  function noCellsForCover(state, digit, allBaseCells, sectors) {
    return sectors.every(sector =>
      setIntersection(state.cellsByDigit[digit - 1][sector], allBaseCells).size > 0
    );
  }

  function noDuplicateCellCovers(state, digit, allBaseCells, sectors) {
    for (let i = 0; i < sectors.length; i++) {
      const cellsA = state.cellsByDigit[digit - 1][sectors[i]];
      const checkA = setIntersection(cellsA, allBaseCells);

      for (let j = i + 1; j < sectors.length; j++) {
        const cellsB = state.cellsByDigit[digit - 1][sectors[j]];
        const checkB = setIntersection(cellsB, allBaseCells);
        if (isSetSubset(checkB, checkA) || isSetSubset(checkA, checkB) || setEquals(cellsA, cellsB)) {
          return false;
        }
      }
    }

    return true;
  }

  function peerCandidateCellsForAll(cand, digit, sourceCells) {
    const sources = [...sourceCells];
    const out = new Set();
    if (!sources.length) return out;

    for (let cell = 0; cell < 81; cell++) {
      if (!(cand[cell] || []).includes(digit)) continue;
      if (sources.every(source => core.peersOf(source).includes(cell))) out.add(cell);
    }

    return out;
  }

  function activeCandidateEliminations(cand, digit, cells) {
    return uniqueSorted([...cells].filter(cell => (cand[cell] || []).includes(digit)));
  }

  function omissionFishEliminations(cand, digit, size, coverSize, baseSaved, coverSaved) {
    const extraCoverCount = coverSize - size;
    const coverMinusBase = setDifference(coverSaved.allUsedCells, baseSaved.allUsedCells);
    const twoCovers = coverSaved.twoCoverIntersections;
    const threeCovers = coverSaved.rcbOverlap;
    const parts = [];
    let endoFins = new Set();
    let overcovered = twoCovers;

    if (baseSaved.baseIntersections.size) {
      const coverBaseOverlap = setIntersection(twoCovers, baseSaved.baseIntersections);
      const baseOverlapFullyCovered = setEquals(coverBaseOverlap, baseSaved.baseIntersections);
      const baseOverlapNotCovered = setDifference(baseSaved.baseIntersections, coverBaseOverlap);
      const endoFinPeers = peerCandidateCellsForAll(cand, digit, baseOverlapNotCovered);
      const twoCoversOutsideBaseIntersections = setDifference(twoCovers, baseSaved.baseIntersections);

      endoFins = baseOverlapNotCovered;
      overcovered = twoCoversOutsideBaseIntersections;

      const restricted = cells =>
        baseOverlapFullyCovered ? cells : setIntersection(endoFinPeers, cells);

      if (size === coverSize) {
        parts.push(restricted(coverMinusBase));
        parts.push(restricted(setDifference(twoCoversOutsideBaseIntersections, coverMinusBase)));
        parts.push(restricted(setDifference(threeCovers, coverMinusBase)));
      }

      if (extraCoverCount === 1) {
        parts.push(restricted(setDifference(twoCoversOutsideBaseIntersections, baseSaved.allUsedCells)));
        parts.push(restricted(setDifference(threeCovers, coverMinusBase)));
      }

      if (extraCoverCount === 2) {
        parts.push(restricted(setDifference(threeCovers, baseSaved.allUsedCells)));
      }
    } else {
      const twoCoverElims = setDifference(twoCovers, coverMinusBase);
      const triCoverElims = setDifference(threeCovers, coverMinusBase);

      if (size === coverSize) {
        parts.push(coverMinusBase);
        parts.push(twoCoverElims);
        parts.push(triCoverElims);
      }

      if (extraCoverCount === 1) {
        parts.push(setDifference(twoCovers, baseSaved.allUsedCells));
        parts.push(triCoverElims);
      }

      if (extraCoverCount === 2) {
        parts.push(setDifference(threeCovers, baseSaved.allUsedCells));
      }
    }

    return {
      cells: activeCandidateEliminations(cand, digit, setUnion(...parts)),
      overcovered: uniqueSorted(overcovered),
      triCovered: uniqueSorted(threeCovers),
      endoFins: uniqueSorted(endoFins),
    };
  }

  function processOmissionFishCover(cand, state, digit, size, baseSectors, baseSaved, coverSectors, triggerCells, options) {
    if (isImpossibleBoxFish(baseSectors, coverSectors)) return null;

    const coverSaved = saveSectorCells(state, digit, coverSectors);
    if (!isSetSubset(baseSaved.allUsedCells, coverSaved.allUsedCells)) return null;

    const type = fishType(baseSectors, coverSectors);
    if (!fishTypeAllowed(type, options)) return null;

    const coverSize = coverSectors.length;
    const details = omissionFishEliminations(cand, digit, size, coverSize, baseSaved, coverSaved);
    if (!details.cells.length) return null;

    const baseCells = setUnion(...baseSectors.map(sector => setFrom(core.UNITS[sector])));
    const coverCells = setUnion(...coverSectors.map(sector => setFrom(core.UNITS[sector])));

    return {
      name: fishName(size, coverSize - size, type),
      category: type === 0 ? 'Basic' : type === 1 ? 'Franken' : 'Mutant',
      digit,
      size,
      coverSize,
      k: coverSize - size,
      baseSectors: uniqueSorted(baseSectors),
      coverSectors: uniqueSorted(coverSectors),
      cells: details.cells,
      triggerCells: uniqueSorted(setIntersection(triggerCells, coverSaved.allUsedCells)),
      overcovered: details.overcovered,
      triCovered: details.triCovered,
      endoFins: details.endoFins,
      vertices: uniqueSorted([...setIntersection(baseCells, coverCells)]),
    };
  }

  function filterOmissionFishBaseCombinations(state, digit, usableSectors, size, triggerCells, options) {
    const out = [];

    for (const sectors of combinations(usableSectors, size)) {
      if (!baseCombinationAllowed(sectors, options)) continue;

      const baseSaved = saveSectorCells(state, digit, sectors);
      if (isSetSubset(triggerCells, baseSaved.allUsedCells)) continue;
      if (!sectorCellCountsInRange(state, digit, sectors, size)) continue;
      if (!noDuplicateCellSectors(state, digit, sectors)) continue;

      out.push(sectors);
    }

    return out;
  }

  function filterOmissionFishCoverCombinations(state, digit, usableSectors, baseSectors, baseSaved, coverSize, triggerCells, options) {
    const baseSet = setFrom(baseSectors);
    const candidates = usableSectors.filter(sector => {
      if (baseSet.has(sector)) return false;
      const cells = state.cellsByDigit[digit - 1][sector];
      return setIntersection(cells, baseSaved.allUsedCells).size > 0;
    });
    const out = [];

    // Build covers around the still-uncovered base cells instead of testing every
    // sector combination. This is the omission index's main performance path.
    const canCoverRemaining = (start, covered) => {
      for (const cell of baseSaved.allUsedCells) {
        if (covered.has(cell)) continue;
        let possible = false;
        for (let index = start; index < candidates.length; index++) {
          if (state.cellsByDigit[digit - 1][candidates[index]].has(cell)) {
            possible = true;
            break;
          }
        }
        if (!possible) return false;
      }
      return true;
    };

    const duplicateWithChosen = (sector, chosen) => {
      const cells = state.cellsByDigit[digit - 1][sector];
      const check = setIntersection(cells, baseSaved.allUsedCells);
      for (const chosenSector of chosen) {
        const chosenCells = state.cellsByDigit[digit - 1][chosenSector];
        const chosenCheck = setIntersection(chosenCells, baseSaved.allUsedCells);
        if (
          isSetSubset(check, chosenCheck)
          || isSetSubset(chosenCheck, check)
          || setEquals(cells, chosenCells)
        ) return true;
      }
      return false;
    };

    const visit = (start, chosen, covered, hasTrigger) => {
      const remaining = coverSize - chosen.length;
      if (remaining === 0) {
        if (!isSetSubset(baseSaved.allUsedCells, covered) || !hasTrigger) return;
        if (!fishTypeAllowed(fishType(baseSectors, chosen), options)) return;
        out.push([...chosen]);
        return;
      }

      if (candidates.length - start < remaining || !canCoverRemaining(start, covered)) return;

      const lastStart = candidates.length - remaining;
      for (let index = start; index <= lastStart; index++) {
        const sector = candidates[index];
        if (duplicateWithChosen(sector, chosen)) continue;

        const cells = state.cellsByDigit[digit - 1][sector];
        const nextCovered = setUnion(covered, cells);
        chosen.push(sector);
        visit(
          index + 1,
          chosen,
          nextCovered,
          hasTrigger || setIntersection(cells, triggerCells).size > 0,
        );
        chosen.pop();
      }
    };

    visit(0, [], new Set(), false);

    return out;
  }

  function findOmissionFishPass(cand, templatesByDigit, digitTemplates, omissionsByDigit, reports, options = {}) {
    const opts = normaliseOmissionFishOptions(options);
    if (!(opts.basicsEnabled || opts.frankenEnabled || opts.mutantEnabled)) return false;

    const state = buildDigitSectorState(cand);
    const seenReports = new Set(reports.map(report =>
      `${report.digit}:${report.baseSectors.join(',')}/${report.coverSectors.join(',')}:${report.cells.join(',')}`
    ));

    for (let digit = 1; digit <= 9; digit++) {
      if (!opts.digits.has(digit)) continue;

      const triggerCells = omissionsByDigit[digit - 1];
      if (!triggerCells || !triggerCells.size) continue;

      const activeSectors = state.activeSectorsByDigit[digit - 1];
      const usableBaseSectors = baseSearchSectors(
        ALL_SECTORS.filter(sector => activeSectors.has(sector) && opts.baseSectors.has(sector)),
        opts,
      );
      const usableCoverSectors = ALL_SECTORS.filter(sector =>
        activeSectors.has(sector) && opts.coverSectors.has(sector)
      );

      for (let size = opts.minSize; size <= opts.maxSize; size++) {
        const baseCombinations = filterOmissionFishBaseCombinations(
          state,
          digit,
          usableBaseSectors,
          size,
          triggerCells,
          opts,
        );

        for (const baseSectors of baseCombinations) {
          const baseSaved = saveSectorCells(state, digit, baseSectors);
          if (baseSaved.rcbOverlap.size) continue;
          const coverSectorsForBase = coverSearchSectors(usableCoverSectors, baseSectors, opts);

          let stopCoverExpansion = false;
          for (
            let coverSize = size + opts.minK;
            coverSize <= size + opts.maxK && coverSize <= 9 && !stopCoverExpansion;
            coverSize++
          ) {
            const coverCombinations = filterOmissionFishCoverCombinations(
              state,
              digit,
              coverSectorsForBase,
              baseSectors,
              baseSaved,
              coverSize,
              triggerCells,
              opts,
            );

            for (const coverSectors of coverCombinations) {
              const match = processOmissionFishCover(
                cand,
                state,
                digit,
                size,
                baseSectors,
                baseSaved,
                coverSectors,
                triggerCells,
                opts,
              );
              if (!match) continue;

              const cells = match.cells.filter(cell => (cand[cell] || []).includes(digit));
              if (!cells.length) continue;

              const key = `${digit}:${match.baseSectors.join(',')}/${match.coverSectors.join(',')}:${cells.join(',')}`;
              if (seenReports.has(key)) continue;
              seenReports.add(key);

              reports.push({
                ...match,
                cells: uniqueSorted(cells),
                reason: 'template-omission-fish',
              });

              if (opts.earlyTermination && fishReportEnabled(match, opts)) {
                stopCoverExpansion = true;
                break;
              }
            }
          }
        }
      }
    }

    void templatesByDigit;
    void digitTemplates;
    return false;
  }

  function applyTemplateDeletes(templatesByDigit, digitTemplates, deletions) {
    let changed = false;

    for (const [digit, ids] of deletions) {
      const before = templatesByDigit[digit];
      const after = before.filter(template => !ids.has(template.id));
      if (after.length === before.length) continue;

      templatesByDigit[digit] = after;
      digitTemplates[digit] = buildDigitIndex(after);
      changed = true;
    }

    return changed;
  }

  function sectorLabel(index) {
    if (index < 9) return `r${index + 1}`;
    if (index < 18) return `c${index - 8}`;
    return `b${index - 17}`;
  }

  function unionTemplateIds(index, digit, cells) {
    const ids = new Set();
    for (const cell of cells) {
      for (const id of index[digit - 1][cell]) ids.add(id);
    }
    return ids;
  }

  function findHiddenSubsetPass(size, templatesByDigit, digitTemplates, reports) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pending = new Map();

    for (const digitCombo of combinations(digits, size)) {
      if (digitCombo.some(digit => !templatesByDigit[digit - 1].length)) continue;

      for (let sector = 0; sector < core.UNITS.length; sector++) {
        for (const cells of combinations(core.UNITS[sector], size)) {
          const coversAll = digitCombo.every(digit =>
            unionTemplateIds(digitTemplates, digit, cells).size === templatesByDigit[digit - 1].length
          );
          if (!coversAll) continue;

          const eliminations = new Map();
          for (const digit of digits) {
            if (digitCombo.includes(digit)) continue;
            const ids = unionTemplateIds(digitTemplates, digit, cells);
            if (ids.size) eliminations.set(digit, ids);
          }

          if (!eliminations.size) continue;

          for (const [digit, ids] of eliminations) {
            if (!pending.has(digit - 1)) pending.set(digit - 1, new Set());
            ids.forEach(id => pending.get(digit - 1).add(id));
            reports.push({
              digit,
              templateIds: [...ids].sort((a, b) => a - b),
              reason: 'hidden-subset',
              size,
              digits: digitCombo,
              cells,
              sector: sectorLabel(sector),
            });
          }
        }
      }
    }

    return applyTemplateDeletes(templatesByDigit, digitTemplates, pending);
  }

  function findNakedSubsetPass(size, templatesByDigit, digitTemplates, reports) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const pending = new Map();

    for (const digitCombo of combinations(digits, size)) {
      const selectedDigits = new Set(digitCombo);

      for (let sector = 0; sector < core.UNITS.length; sector++) {
        for (const cells of combinations(core.UNITS[sector], size)) {
          const validCells = cells.every(cell => {
            const activeDigits = digits.filter(digit => digitTemplates[digit - 1][cell].length);
            return activeDigits.length > 0 && activeDigits.every(digit => selectedDigits.has(digit));
          });
          if (!validCells) continue;

          const eliminations = new Map();
          for (const digit of digitCombo) {
            const used = unionTemplateIds(digitTemplates, digit, cells);
            const outside = new Set(templatesByDigit[digit - 1].map(template => template.id));
            for (const id of used) outside.delete(id);
            if (outside.size) eliminations.set(digit, outside);
          }

          if (!eliminations.size) continue;

          for (const [digit, ids] of eliminations) {
            if (!pending.has(digit - 1)) pending.set(digit - 1, new Set());
            ids.forEach(id => pending.get(digit - 1).add(id));
            reports.push({
              digit,
              templateIds: [...ids].sort((a, b) => a - b),
              reason: 'naked-subset',
              size,
              digits: digitCombo,
              cells,
              sector: sectorLabel(sector),
            });
          }
        }
      }
    }

    return applyTemplateDeletes(templatesByDigit, digitTemplates, pending);
  }

  function findTkDeletes(size, templatesByDigit, digitTemplates, reports) {
    const pending = new Map();

    for (let baseDigit = 1; baseDigit <= 9; baseDigit++) {
      for (const baseTemplate of templatesByDigit[baseDigit - 1]) {
        for (const companionDigits of combinations(
          [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit => digit !== baseDigit),
          size - 1,
        )) {
          const lists = companionDigits.map(digit => templatesByDigit[digit - 1]);
          if (!lists.every(list => list.length)) continue;

          const occupied = new Set(baseTemplate.cells);
          const chosenDigits = new Set([baseDigit, ...companionDigits]);
          const extendable = existsCompatibleSet(
            templatesByDigit,
            lists,
            occupied,
            chosenDigits,
          );
          if (extendable) continue;

          if (!pending.has(baseDigit - 1)) pending.set(baseDigit - 1, new Set());
          pending.get(baseDigit - 1).add(baseTemplate.id);
          reports.push({
            digit: baseDigit,
            templateIds: [baseTemplate.id],
            reason: `T${size + 1}-delete`,
            size,
            companionDigits,
          });
          break;
        }
      }
    }

    return applyTemplateDeletes(templatesByDigit, digitTemplates, pending);
  }

  function collectOmissions(templatesByDigit, candidateCellsByDigit, omissions, seen) {
    const omissionsByDigit = Array.from({ length: 9 }, () => new Set());

    for (let digit = 1; digit <= 9; digit++) {
      const active = templatesByDigit[digit - 1];
      const usedCells = new Set();
      for (const template of active) {
        for (const cell of template.cells) usedCells.add(cell);
      }

      const omittedCells = [...candidateCellsByDigit[digit - 1]]
        .filter(cell => !usedCells.has(cell))
        .sort((a, b) => a - b);
      if (!omittedCells.length) continue;

      omissionsByDigit[digit - 1] = new Set(omittedCells);

      const key = `${digit}:${omittedCells.join(',')}`;
      if (!seen.has(key)) {
        seen.add(key);
        omissions.push({ digit, cells: omittedCells });
      }
    }

    return omissionsByDigit;
  }

  function templateTotal(templatesByDigit) {
    return templatesByDigit.reduce((total, templates) => total + templates.length, 0);
  }

  function templatesResolved(templatesByDigit) {
    return templatesByDigit.every(templates => templates.length === 1);
  }

  function passSummary(phase, pass, size, before, after, reports) {
    const digitCounts = new Array(9).fill(0);
    for (const report of reports) digitCounts[report.digit - 1] += 1;

    return {
      phase,
      pass,
      ...(size === undefined ? {} : { size }),
      reports: reports.length,
      templateDeletes: Math.max(0, before - after),
      templatesBefore: before,
      templatesAfter: after,
      digitCounts,
    };
  }

  function recordPassSummary(passSummaries, phase, pass, size, before, after, reports) {
    const summary = passSummary(phase, pass, size, before, after, reports);
    if (summary.reports > 0) passSummaries.push(summary);
  }

  function formatPomOmission(omission) {
    const eliminations = omission.cells.map(cell => ({ cell, digit: omission.digit }));
    return `Omission: (${omission.digit}) ${core.formatRemovals(eliminations)}`;
  }

  function formatPomOmissionFish(fish) {
    const eliminations = fish.cells.map(cell => ({ cell, digit: fish.digit }));
    return `${fish.name}: (${fish.digit}) ${core.sectorGroupName(fish.baseSectors)} / ${core.sectorGroupName(fish.coverSectors)} => ${core.formatRemovals(eliminations)}`;
  }

  function findOmissionFishReports(cand, options = {}) {
    const grid = options.grid;
    if (!Array.isArray(grid) || grid.length !== 81) return [];

    const templates = allTemplates();
    const templatesByDigit = [];
    const digitTemplates = [];
    const candidateCellsByDigit = [];

    for (let digit = 1; digit <= 9; digit++) {
      const allowed = candidateCells(cand, grid, digit);
      const active = templates.filter(template => template.cells.every(cell => allowed.has(cell)));
      templatesByDigit.push(active);
      digitTemplates.push(buildDigitIndex(active));
      candidateCellsByDigit.push(candidateOnlyCells(cand, digit));
    }

    const omissionsByDigit = collectOmissions(
      templatesByDigit,
      candidateCellsByDigit,
      [],
      new Set(),
    );
    const reports = [];
    findOmissionFishPass(
      cand,
      templatesByDigit,
      digitTemplates,
      omissionsByDigit,
      reports,
      options,
    );
    return reports;
  }

  function omissionFishStep(cand, sizes, options = {}) {
    const enabledTypes = options.enabledTechniques;
    const fishTypeForReport = report => {
      const size = Number(report?.size);
      const k = Number(report?.k || 0);
      if (k > 0) return `${size}x${size}+k-fish`;
      return ({ 2: 'x-wing', 3: 'swordfish', 4: 'jellyfish' })[size] || null;
    };
    const isEnabled = type => !enabledTypes
      || (typeof enabledTypes.has === 'function' ? enabledTypes.has(type) : enabledTypes.includes(type));
    const categories = [
      ['basicsEnabled', options.basicsEnabled ?? true],
      ['frankenEnabled', options.frankenEnabled ?? false],
      ['mutantEnabled', options.mutantEnabled ?? false],
    ];
    const priority = { Basic: 0, Franken: 1, Mutant: 2 };

    for (const [categoryFlag, enabled] of categories) {
      if (!enabled) continue;

      // Keep each hierarchy pass isolated so a broader category cannot
      // consume a Basic or Franken candidate during the same search.
      const reports = findOmissionFishReports(cand, {
        ...options,
        minSize: sizes[0],
        maxSize: sizes[sizes.length - 1],
        basicsEnabled: false,
        frankenEnabled: false,
        mutantEnabled: false,
        [categoryFlag]: true,
      });
      const orderedReports = options.priorityMode
        ? [...reports].sort((a, b) => {
            const categoryDelta = (priority[a.category] ?? 99) - (priority[b.category] ?? 99);
            if (categoryDelta) return categoryDelta;
            return Number(a.k || 0) - Number(b.k || 0);
          })
        : reports;
      const report = orderedReports.find(item => isEnabled(fishTypeForReport(item)));
      if (!report) continue;

      const items = report.cells.map(cell => ({ cell, digit: report.digit }));
      return {
        tech: 'fish',
        name: report.name,
        category: report.category,
        size: report.size,
        k: report.k,
        desc: formatPomOmissionFish(report),
        elim: { items },
        digits: [report.digit],
        baseSectors: report.baseSectors,
        coverSectors: report.coverSectors,
        vertices: report.vertices || [],
        fins: report.triggerCells || [],
        endofins: report.endoFins || [],
        overcovered: report.overcovered || [],
        triCovered: report.triCovered || [],
      };
    }

    return null;
  }

  function pomCheck(cand, grid) {
    const templatesByDigit = [];
    const digitTemplates = [];
    const omissions = [];
    const templateEliminations = [];
    const hiddenSubsets = [];
    const nakedSubsets = [];
    const tkDeletes = [];
    const passSummaries = [];
    const templates = allTemplates();
    const allowedByDigit = [];
    const candidateCellsByDigit = [];
    const seenOmissions = new Set();

    for (let digit = 1; digit <= 9; digit++) {
      const allowed = candidateCells(cand, grid, digit);
      allowedByDigit.push(allowed);
      candidateCellsByDigit.push(candidateOnlyCells(cand, digit));
      const active = templates.filter(template => template.cells.every(cell => allowed.has(cell)));
      const index = buildDigitIndex(active);

      templatesByDigit.push(active);
      digitTemplates.push(index);
    }

    const initialTemplateCounts = templatesByDigit.map(list => list.length);

    for (let pass = 1; ; pass++) {
      if (templatesResolved(templatesByDigit)) break;

      collectOmissions(
        templatesByDigit,
        candidateCellsByDigit,
        omissions,
        seenOmissions,
      );

      let hiddenChanged = false;
      for (const size of [1, 2, 3, 4]) {
        const before = templateTotal(templatesByDigit);
        const reportStart = hiddenSubsets.length;
        const changed = findHiddenSubsetPass(size, templatesByDigit, digitTemplates, hiddenSubsets);
        const after = templateTotal(templatesByDigit);
        recordPassSummary(
          passSummaries,
          'hidden-subset',
          pass,
          size,
          before,
          after,
          hiddenSubsets.slice(reportStart),
        );
        if (changed) {
          hiddenChanged = true;
          break;
        }
      }
      if (hiddenChanged) continue;

      let nakedChanged = false;
      for (const size of [1, 2, 3, 4]) {
        const before = templateTotal(templatesByDigit);
        const reportStart = nakedSubsets.length;
        const changed = findNakedSubsetPass(size, templatesByDigit, digitTemplates, nakedSubsets);
        const after = templateTotal(templatesByDigit);
        recordPassSummary(
          passSummaries,
          'naked-subset',
          pass,
          size,
          before,
          after,
          nakedSubsets.slice(reportStart),
        );
        if (changed) {
          nakedChanged = true;
          break;
        }
      }
      if (nakedChanged) continue;

      let tkChanged = false;
      for (const size of [1, 2, 3, 4]) {
        const before = templateTotal(templatesByDigit);
        const reportStart = tkDeletes.length;
        const changed = findTkDeletes(size, templatesByDigit, digitTemplates, tkDeletes);
        const after = templateTotal(templatesByDigit);
        recordPassSummary(
          passSummaries,
          'tk-delete',
          pass,
          size + 1,
          before,
          after,
          tkDeletes.slice(reportStart),
        );
        if (changed) {
          tkChanged = true;
          break;
        }
      }
      if (!tkChanged) break;
    }

    return {
      initialTemplateCounts,
      templateCounts: templatesByDigit.map(list => list.length),
      omissions,
      templateEliminations,
      hiddenSubsets,
      nakedSubsets,
      tkDeletes,
      passSummaries,
      templatesByDigit,
      digitTemplates,
    };
  }

  core.pomCheck = pomCheck;
  core.omissionFishStep = omissionFishStep;
  core.findOmissionFishReports = findOmissionFishReports;
  core.formatPomOmission = formatPomOmission;
  core.formatPomOmissionFish = formatPomOmissionFish;
})(globalThis);
