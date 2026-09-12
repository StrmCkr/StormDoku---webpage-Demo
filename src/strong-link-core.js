(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before strong-link-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before strong-link-core.js');
  if (!core.buildMiniSectors) throw new Error('mini-sectors-core.js must load before strong-link-core.js');
  const { intersection, peerPotentialEliminations, union } = core.setTools;

  const BILOCAL = 0;
  const CELL_TO_GROUP = 1;
  const GROUP_TO_GROUP = 2;
  const ERI = 3;
  const ALS = 4;
  const TYPE_NAMES = ['BILOCAL', 'CELL_TO_GROUP', 'GROUP_TO_GROUP', 'ERI', 'ALS'];
  const OFFSETS = [0, 9, 18, 18];
  let nextStrongLinkId = 0;

  function commonSectors(cells) {
    if (!cells.length) return [];
    return core.UNITS
      .map((unit, sector) => cells.every(cell => unit.includes(cell)) ? sector : -1)
      .filter(sector => sector >= 0);
  }

  function peerCellsForDigit(digitCells, digit, sourceCells) {
    const sourceSet = new Set(sourceCells);
    return digitCells[digit].filter(cell =>
      !sourceSet.has(cell)
      && sourceCells.every(source => core.peersOf(source).includes(cell))
    );
  }

  function swapDigits(cand, digit, cells) {
    if (cells.length !== 1) return [];
    return (cand[cells[0]] || []).filter(value => value !== digit);
  }

  function sectorMap(digit, cells) {
    return { [digit + 1]: commonSectors(cells) };
  }

  function eliminationMap(digit, cells, digitCells) {
    return { [digit + 1]: peerCellsForDigit(digitCells, digit, cells) };
  }

  function determineLinkType(activeCells, linkedCells) {
    const activeCount = activeCells.length;
    const linkedCount = linkedCells.length;
    if (activeCount === 1 && linkedCount === 1) return BILOCAL;
    if ((activeCount > 1 && linkedCount === 1) || (activeCount === 1 && linkedCount > 1)) {
      return CELL_TO_GROUP;
    }
    if (activeCount > 1 && linkedCount > 1) return GROUP_TO_GROUP;
    return -1;
  }

  function buildLink(cand, digitCells, digit, linkType, activeCells, linkedCells, xorConstruction = null) {
    const allCells = union(activeCells, linkedCells);
    return {
      id: nextStrongLinkId++,
      linkType,
      linkTypeName: TYPE_NAMES[linkType],
      originSector: commonSectors(allCells),
      startingDigits: [digit + 1],
      activeCells: [...activeCells],
      linkedCells: [...linkedCells],
      linkDigits: [digit + 1],
      startCellsSector: sectorMap(digit, activeCells),
      linkCellsSector: sectorMap(digit, linkedCells),
      startDigitSwapAvailable: swapDigits(cand, digit + 1, activeCells),
      endDigitSwapAvailable: swapDigits(cand, digit + 1, linkedCells),
      potentialElimStart: eliminationMap(digit, activeCells, digitCells),
      potentialElimEnd: eliminationMap(digit, linkedCells, digitCells),
      rightWeakLinks: [],
      leftWeakLinks: [],
      xorConstruction,
      secondaryTypes: [],
      secondaryXorConstruction: null,
    };
  }

  function buildCellAlsLink(cand, cell) {
    const digits = [...(cand[cell] || [])].sort((a, b) => a - b);
    const [leftDigit, rightDigit] = digits;
    const cells = [cell];
    const sectors = commonSectors(cells);

    return {
      id: nextStrongLinkId++,
      linkType: ALS,
      linkTypeName: TYPE_NAMES[ALS],
      originSector: sectors,
      startingDigits: [leftDigit],
      activeCells: cells,
      linkedCells: cells,
      linkDigits: [rightDigit],
      startCellsSector: { [leftDigit]: sectors },
      linkCellsSector: { [rightDigit]: sectors },
      startDigitSwapAvailable: [rightDigit],
      endDigitSwapAvailable: [leftDigit],
      potentialElimStart: { [leftDigit]: peerPotentialEliminations(cand, leftDigit, cells) },
      potentialElimEnd: { [rightDigit]: peerPotentialEliminations(cand, rightDigit, cells) },
      rightWeakLinks: [],
      leftWeakLinks: [],
    };
  }

  function linkKey(link) {
    const groups = [link.activeCells, link.linkedCells]
      .map(cells => cells.join(','))
      .sort();
    return [
      link.linkType,
      link.startingDigits.join(','),
      link.linkDigits.join(','),
      link.originSector.join(','),
      ...groups,
    ].join('|');
  }

  function addUnique(buckets, seen, link) {
    const key = linkKey(link);
    if (seen.has(key)) return;
    seen.add(key);
    buckets[link.linkType].push(link);
  }

  function miniPartitionSectors(type, line) {
    if (type === 0) {
      const firstBox = Math.floor(line / 3) * 3;
      return [18 + firstBox, 18 + firstBox + 1, 18 + firstBox + 2];
    }
    if (type === 1) {
      const firstBox = Math.floor(line / 3);
      return [18 + firstBox, 18 + firstBox + 3, 18 + firstBox + 6];
    }
    if (type === 2) {
      const firstRow = Math.floor(line / 3) * 3;
      return [firstRow, firstRow + 1, firstRow + 2];
    }
    const firstCol = (line % 3) * 3;
    return [9 + firstCol, 9 + firstCol + 1, 9 + firstCol + 2];
  }

  function miniPartitionName(type) {
    return ['row-by-box', 'col-by-box', 'box-by-row', 'box-by-col'][type] || 'mini-sector';
  }

  function miniXorConstruction(type, line, options, startSector, activeCells, linkedCells) {
    const partitionSectors = miniPartitionSectors(type, line);
    const occupied = options.map(Number);
    const emptyPartition = partitionSectors.findIndex(sector => !occupied.includes(sector));
    const activePartition = partitionSectors.findIndex(sector => occupied[0] === sector);
    const linkedPartition = partitionSectors.findIndex(sector => occupied[1] === sector);
    return {
      kind: 'mini-sector',
      name: miniPartitionName(type),
      baseSector: startSector,
      partitionSectors,
      partitionCells: partitionSectors.map(sector => intersection(core.UNITS[startSector], core.UNITS[sector])),
      activePartition,
      linkedPartition,
      emptyPartition,
      activeCells: [...activeCells],
      linkedCells: [...linkedCells],
    };
  }

  function eriXorConstruction(box, row, col) {
    const boxSector = 18 + box;
    const boxRowStart = Math.floor(box / 3) * 3;
    const boxColStart = (box % 3) * 3;
    const offsetIndex = (col - boxColStart) * 3 + (row - boxRowStart);
    return {
      kind: 'eri',
      name: 'empty-rectangle',
      baseSector: boxSector,
      row,
      col,
      intersectionCell: row * 9 + col,
      emptyCells: eriOffsetCells(box, offsetIndex),
    };
  }

  // The nine offsets are the Java EriOffSets table: box cells outside the
  // selected box-row and box-column crossing, indexed by local column/row.
  const ERI_OFFSETS = Array.from({ length: 9 }, (_, box) =>
    Array.from({ length: 9 }, (_, offsetIndex) => {
      const boxRowStart = Math.floor(box / 3) * 3;
      const boxColStart = (box % 3) * 3;
      const localCol = Math.floor(offsetIndex / 3);
      const localRow = offsetIndex % 3;
      const row = boxRowStart + localCol;
      const col = boxColStart + localRow;
      return core.UNITS[18 + box].filter(cell =>
        core.Rx[cell] !== row && core.Cy[cell] !== col
      );
    }),
  );

  function eriOffsetCells(box, offsetIndex) {
    return ERI_OFFSETS[box]?.[offsetIndex] || [];
  }

  function eriGeometries(box, digitCells, digit, requireCount) {
    const boxSector = 18 + box;
    const boxCells = intersection(core.UNITS[boxSector], digitCells[digit]);
    if (requireCount && (boxCells.length < 4 || boxCells.length >= 6)) return [];

    const geometries = [];
    const boxRowStart = Math.floor(box / 3) * 3;
    const boxColStart = (box % 3) * 3;
    for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
      for (let colOffset = 0; colOffset < 3; colOffset++) {
        const row = boxRowStart + colOffset;
        const col = boxColStart + rowOffset;
        const intersectionCell = row * 9 + col;
        const boxCountWithoutIntersection = boxCells.length
          - (boxCells.includes(intersectionCell) ? 1 : 0);
        if (requireCount && boxCountWithoutIntersection < 4) continue;

        const construction = eriXorConstruction(box, row, col);
        if (intersection(boxCells, construction.emptyCells).length) continue;

        const activeCells = intersection(boxCells, core.UNITS[row]);
        const linkedCells = intersection(boxCells, core.UNITS[9 + col]);
        if (!activeCells.length || !linkedCells.length) continue;

        geometries.push({
          boxCells,
          activeCells,
          linkedCells,
          construction: {
            ...construction,
            activeCells: [...activeCells],
            linkedCells: [...linkedCells],
          },
        });
      }
    }
    return geometries;
  }

  function buildSingleDigitStrongLinks(cand, mini, digit, buckets, seen) {
    for (let line = 0; line < 9; line++) {
      for (let type = 0; type < 4; type++) {
        const options = [...mini.RCBnbp[type][line][digit]];
        if (options.length !== 2) continue;
     
        const startSector = line + OFFSETS[type];
        const startCells = intersection(core.UNITS[startSector], mini.digitCells[digit]);
        const firstCells = intersection(core.UNITS[options[0]], mini.digitCells[digit]);
        const secondCells = intersection(core.UNITS[options[1]], mini.digitCells[digit]);
        const activeCells = intersection(startCells, firstCells);
        const linkedCells = intersection(startCells, secondCells);
        if (!activeCells.length || !linkedCells.length) continue;

        const linkType = determineLinkType(activeCells, linkedCells);
        if (linkType < 0) continue;
        const link = buildLink(
          cand,
          mini.digitCells,
          digit,
          linkType,
          activeCells,
          linkedCells,
          miniXorConstruction(type, line, options, startSector, activeCells, linkedCells),
        );
        if (type >= 2) {
          const profileCells = union(activeCells, linkedCells);
          const dualEri = eriGeometries(line, mini.digitCells, digit, false)
            .find(geometry => {
              const intersectionCell = geometry.construction.intersectionCell;
              const remainingProfileCells = profileCells.filter(cell => cell !== intersectionCell);
              return geometry.boxCells.includes(geometry.construction.intersectionCell)
                && remainingProfileCells.length > 1
                && geometry.boxCells.join(',') === profileCells.join(',');
            });
          if (dualEri) {
            link.secondaryTypes = ['ERI'];
            link.secondaryXorConstruction = dualEri.construction;
          }
        }
        addUnique(buckets, seen, link);
      }
    }
  }

  function buildEriLinks(cand, digitCells, digit, buckets, seen) {
    for (let box = 0; box < 9; box++) {
      for (const geometry of eriGeometries(box, digitCells, digit, true)) {
          addUnique(
            buckets,
            seen,
            buildLink(
              cand,
              digitCells,
              digit,
              ERI,
              geometry.activeCells,
              geometry.linkedCells,
              geometry.construction,
            ),
          );
      }
    }
  }

  function buildStrongLinks(cand) {
    nextStrongLinkId = 0;
    const buckets = [[], [], [], [], []];
    const seen = new Set();
    const mini = core.buildMiniSectors(cand);

    for (let digit = 0; digit < 9; digit++) {
      buildSingleDigitStrongLinks(cand, mini, digit, buckets, seen);
      buildEriLinks(cand, mini.digitCells, digit, buckets, seen);
    }

    for (let cell = 0; cell < 81; cell++) {
      if ((cand[cell] || []).length === 2) addUnique(buckets, seen, buildCellAlsLink(cand, cell));
    }

    return buckets;
  }

  function flattenStrongLinks(linkset) {
    return linkset.flat();
  }

  core.BILOCAL = BILOCAL;
  core.CELL_TO_GROUP = CELL_TO_GROUP;
  core.GROUP_TO_GROUP = GROUP_TO_GROUP;
  core.ERI = ERI;
  core.ALS = ALS;
  core.STRONG_LINK_TYPE_NAMES = TYPE_NAMES;
  core.buildStrongLinks = buildStrongLinks;
  core.strongLinkConstructor = buildStrongLinks;
  core.flattenStrongLinks = flattenStrongLinks;
})(globalThis);
