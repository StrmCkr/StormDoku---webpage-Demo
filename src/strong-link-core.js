(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before strong-link-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before strong-link-core.js');
  if (!core.buildMiniSectors) throw new Error('mini-sectors-core.js must load before strong-link-core.js');
  const { combinations, intersection, peerPotentialEliminations, union } = core.setTools;

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
      // The Java table is indexed by local column first, then local row:
      // index = columnOffset * 3 + rowOffset.
      const columnOffset = Math.floor(offsetIndex / 3);
      const rowOffset = offsetIndex % 3;
      const row = boxRowStart + rowOffset;
      const col = boxColStart + columnOffset;
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

  function buildSimpleColoring(cand, strongLinkSet = null) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    const digitEdges = Array.from({ length: 9 }, () => []);

    for (const link of linkset[BILOCAL] || []) {
      const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
      const cells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
        .filter(cell => (cand[cell] || []).includes(digit));
      if (digit < 1 || digit > 9 || cells.length !== 2) continue;
      digitEdges[digit - 1].push({ link, cells });
    }

    const reports = [];
    for (let digitIndex = 0; digitIndex < digitEdges.length; digitIndex++) {
      const edges = digitEdges[digitIndex];
      if (!edges.length) continue;
      const digit = digitIndex + 1;
      const adjacency = new Map();

      for (const edge of edges) {
        const [left, right] = edge.cells;
        if (!adjacency.has(left)) adjacency.set(left, new Set());
        if (!adjacency.has(right)) adjacency.set(right, new Set());
        adjacency.get(left).add(right);
        adjacency.get(right).add(left);
      }

        const seenCells = new Set();
        for (const start of adjacency.keys()) {
          if (seenCells.has(start)) continue;
          const colors = new Map();
          const breadthByCell = new Map();
          const breadthByCellColor = new Map();
          const queue = [[start, 0, 0]];
          const componentCells = new Set();

          while (queue.length) {
            const [cell, color, breadth] = queue.shift();
            const assigned = colors.get(cell) || new Set();
            if (assigned.has(color)) continue;
            assigned.add(color);
            colors.set(cell, assigned);
            if (!breadthByCell.has(cell)) breadthByCell.set(cell, breadth);
            const colorBreadths = breadthByCellColor.get(cell) || new Map();
            if (!colorBreadths.has(color)) colorBreadths.set(color, breadth);
            breadthByCellColor.set(cell, colorBreadths);
            componentCells.add(cell);
            seenCells.add(cell);

            for (const neighbor of adjacency.get(cell) || []) {
              queue.push([neighbor, 1 - color, breadth + 1]);
            }
        }

        const componentEdges = edges.filter(edge =>
          edge.cells.every(cell => componentCells.has(cell)));
        if (!componentEdges.length) continue;

        // Simple Colouring displays strong-link nodes, not individual cells.
        // Rebuild the display breadth from the link graph so both endpoints
        // of the first link arrive together, while a later opposite colour
        // on an overlap still gets its own later breadth.
        const edgeBreadths = new Map([[0, 0]]);
        const edgeQueue = [0];
        while (edgeQueue.length) {
          const edgeIndex = edgeQueue.shift();
          const edge = componentEdges[edgeIndex];
          const level = edgeBreadths.get(edgeIndex) || 0;
          for (let otherIndex = 0; otherIndex < componentEdges.length; otherIndex++) {
            if (edgeBreadths.has(otherIndex)) continue;
            if (!componentEdges[otherIndex].cells.some(cell => edge.cells.includes(cell))) continue;
            edgeBreadths.set(otherIndex, level + 1);
            edgeQueue.push(otherIndex);
          }
        }
        breadthByCell.clear();
        breadthByCellColor.clear();
        for (let edgeIndex = 0; edgeIndex < componentEdges.length; edgeIndex++) {
          const level = edgeBreadths.get(edgeIndex) || 0;
          for (const cell of componentEdges[edgeIndex].cells) {
            if (!breadthByCell.has(cell) || level < breadthByCell.get(cell)) {
              breadthByCell.set(cell, level);
            }
            const colorBreadths = breadthByCellColor.get(cell) || new Map();
            for (const color of colors.get(cell) || []) {
              if (!colorBreadths.has(color) || level < colorBreadths.get(color)) {
                colorBreadths.set(color, level);
              }
            }
            breadthByCellColor.set(cell, colorBreadths);
          }
        }

        const invalidColors = new Set();
        const mixedSectors = [];
        const sectorParityConflicts = [];
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const sectorCells = core.UNITS[sector].filter(cell => componentCells.has(cell));
          if (!sectorCells.length) continue;
          const blueCells = sectorCells.filter(cell => colors.get(cell)?.has(0));
          const purpleCells = sectorCells.filter(cell => colors.get(cell)?.has(1));
          if (blueCells.length >= 2) {
            invalidColors.add(0);
            sectorParityConflicts.push({ sector, color: 0, cells: [...blueCells] });
          }
          if (purpleCells.length >= 2) {
            invalidColors.add(1);
            sectorParityConflicts.push({ sector, color: 1, cells: [...purpleCells] });
          }
          if (blueCells.length && purpleCells.length) {
            mixedSectors.push({ sector, cells: sectorCells, blueCells, purpleCells });
          }
        }

        const trueCells = new Set();
        const eliminations = new Set();
        const bothParityPeerEliminations = [];
        const eliminationKey = (cell, value) => `${cell}:${value}`;
        const terminalTruthCells = new Set(
          [...colors.entries()]
            .filter(([, cellColors]) => cellColors.size > 1)
            .map(([cell]) => cell),
        );
        const hasTerminalClosure = terminalTruthCells.size > 0;
        // If both colour parities repeat in a sector, neither parity can be
        // asserted. Without a terminal same-cell truth, this component is a
        // contradiction rather than a legal colouring deduction.
        if (!hasTerminalClosure && invalidColors.size > 1) continue;
        const terminalTruth = [...terminalTruthCells]
          .sort((a, b) => a - b)
          .map(cell => ({
            cell,
            digit,
            observedParities: [...(colors.get(cell) || [])].sort((a, b) => a - b),
            asserted: true,
          }));
        for (const [cell, cellColors] of colors.entries()) {
          if (cellColors.size > 1) trueCells.add(cell);
        }

        if (!hasTerminalClosure && invalidColors.size === 1) {
          const invalid = [...invalidColors][0];
          const valid = 1 - invalid;
          for (const [cell, cellColors] of colors.entries()) {
            if (cellColors.size === 1 && cellColors.has(invalid)) {
              eliminations.add(eliminationKey(cell, digit));
            }
            if (cellColors.size === 1 && cellColors.has(valid)) trueCells.add(cell);
          }
        }

        for (const trueCell of trueCells) {
          if (terminalTruthCells.has(trueCell)) {
            for (const value of cand[trueCell] || []) {
              if (value !== digit) eliminations.add(eliminationKey(trueCell, value));
            }
          }
          for (const peer of core.peersOf(trueCell)) {
            if ((cand[peer] || []).includes(digit)) {
              eliminations.add(eliminationKey(peer, digit));
            }
          }
        }

        for (const mixed of mixedSectors) {
          for (const cell of core.UNITS[mixed.sector]) {
            if (!componentCells.has(cell) && (cand[cell] || []).includes(digit)) {
              eliminations.add(eliminationKey(cell, digit));
            }
          }
        }

        for (let cell = 0; cell < 81; cell++) {
          if (componentCells.has(cell) || !(cand[cell] || []).includes(digit)) continue;
          const seesBlue = [...colors.entries()].some(([coloredCell, cellColors]) =>
            cellColors.has(0) && core.peersOf(coloredCell).includes(cell));
          const seesPurple = [...colors.entries()].some(([coloredCell, cellColors]) =>
            cellColors.has(1) && core.peersOf(coloredCell).includes(cell));
          if (seesBlue && seesPurple) {
            eliminations.add(eliminationKey(cell, digit));
            bothParityPeerEliminations.push(cell);
          }
        }

        if (!eliminations.size) continue;
        reports.push({
          family: 'Simple Colouring',
          tech: 'simple-colouring',
          digit,
          cellColors: [...colors.entries()].map(([cell, cellColors]) => ({
            cell,
            colors: [...cellColors].sort((a, b) => a - b),
            breadth: breadthByCell.get(cell) ?? 0,
            breadthColors: Object.fromEntries(
              [...(breadthByCellColor.get(cell) || new Map()).entries()]
                .map(([color, value]) => [color, value + 1]),
            ),
          })),
          blueCells: [...colors.entries()]
            .filter(([, cellColors]) => cellColors.has(0))
            .map(([cell]) => cell),
          purpleCells: [...colors.entries()]
            .filter(([, cellColors]) => cellColors.has(1))
            .map(([cell]) => cell),
          trueCells: [...trueCells],
          terminalClosure: hasTerminalClosure
            ? { kind: 'same-cell', cells: [...terminalTruthCells].sort((a, b) => a - b) }
            : null,
          terminalTruth,
          rules: [
            ...(hasTerminalClosure ? ['terminal-closure-truth'] : []),
            ...(invalidColors.size ? ['sector-same-parity'] : []),
            ...(mixedSectors.length ? ['both-parities-sector'] : []),
            ...(bothParityPeerEliminations.length ? ['both-parities-peer'] : []),
          ],
          invalidColors: [...invalidColors],
          mixedSectors: mixedSectors.map(item => item.sector),
          sectorParityConflicts,
          bothParityPeerEliminations: [...new Set(bothParityPeerEliminations)],
          links: componentEdges.map(edge => edge.link.id),
          eliminations: [...eliminations]
            .map(key => key.split(':').map(Number))
            .sort((left, right) => left[0] - right[0] || left[1] - right[1])
            .map(([cell, value]) => ({ cell, digit: value })),
        });
      }
    }


    return reports;
  }


  // Retained for comparison while the full-breadth graph walker is audited.
  // It is not exported or called by the Multi-colouring search.
  function buildMultiColoringPathLegacy(cand, strongLinkSet = null) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    const digitLinks = Array.from({ length: 9 }, () => []);
    // Each type-0 strong-link node gets its own visible colour pair. The
    // numeric parity remains the logical layer; these names keep different
    // breadths distinct. This engine never creates bivalves.
    const namedNodeColourPairs = [
      ['lavender', 'sky'],
      ['amber', 'mint'],
      ['turquoise', 'peach'],
      ['cobalt', 'olive'],
      ['plum', 'lemon'],
      ['slate', 'sage'],
      ['charcoal', 'apricot'],
      ['orchid', 'moss'],
      ['navy', 'gold'],
    ];
    const nodeColourPair = index => namedNodeColourPairs[index]
      || [`pair-${index + 1}-left`, `pair-${index + 1}-right`];

    for (const link of linkset[BILOCAL] || []) {
      const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
      const cells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
        .filter(cell => (cand[cell] || []).includes(digit));
      if (digit < 1 || digit > 9 || cells.length !== 2) continue;
      digitLinks[digit - 1].push({ link, cells });
    }

    // The weak edge is NAND, not XOR. Reuse the AIC graph walker only for
    // this proof step, restricted to type-0 links and no ALS links; the
    // result remains a distinct Multi-colouring report and renderer.
    if (typeof core.findAicChains === 'function') {
      const aicChains = [];
      for (let digitIndex = 0; digitIndex < digitLinks.length; digitIndex++) {
        if (!digitLinks[digitIndex].length) continue;
        const digitLinkCount = digitLinks[digitIndex].length;
        const breadthBudget = Math.max(10000, digitLinkCount ** 3 * 32);
        const digitOnlyLinkset = linkset.map((bucket, index) => index === BILOCAL
          ? bucket.filter(link => Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]) === digitIndex + 1)
          : []);
        const digitAic = core.findAicChains(cand, {
          strongLinkSet: digitOnlyLinkset,
          strongLinkTypes: [BILOCAL],
          includeAls: false,
          // Walk every reachable type-0 node for this digit. The old fixed
          // caps silently stopped large Multi-colouring components halfway
          // through their breadth expansion.
          maxDepth: Math.max(1, digitLinkCount),
          maxChains: breadthBudget,
          maxResultAttempts: breadthBudget * 8,
          maxResultAttemptsPerStart: breadthBudget,
          maxStates: breadthBudget * 4,
          maxQueue: breadthBudget * 4,
          maxBranching: Math.max(1, digitLinkCount * 2),
        });
        aicChains.push(...(digitAic.chains || []));
      }
      const aic = { chains: aicChains };
      const seenAicReports = new Set();
      const aicReports = [];
      for (const chain of aic.chains || []) {
        if (!chain.steps?.length || chain.steps.some(step => step.linkType !== BILOCAL)) continue;
        const digits = [...new Set(chain.steps.flatMap(step => [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
        ]))];
        if (digits.length !== 1) continue;
        const digit = digits[0];
        const cellColors = new Map();
        const cellColourTokens = new Map();
        const assignCellColour = (cell, color, pairColours) => {
          const colors = cellColors.get(cell) || new Set();
          colors.add(color);
          cellColors.set(cell, colors);
          const tokens = cellColourTokens.get(cell) || new Set();
          tokens.add(pairColours[color]);
          cellColourTokens.set(cell, tokens);
        };
        let previousExitColor = 1;
        const linkColours = chain.steps.map((step, index) => {
          const pairColours = nodeColourPair(index);
          const entryColor = index === 0 ? 0 : 1 - previousExitColor;
          const exitColor = 1 - entryColor;
          for (const cell of step.entry?.cells || []) assignCellColour(cell, entryColor, pairColours);
          for (const cell of step.exit?.cells || []) assignCellColour(cell, exitColor, pairColours);
          previousExitColor = exitColor;
          return {
            id: step.linkId,
            label: String.fromCharCode(65 + index),
            cells: [...new Set([...(step.entry?.cells || []), ...(step.exit?.cells || [])])],
            colors: [0, 1],
            pairIndex: index,
            pairColours: [...pairColours],
            endpoints: [
              ...(step.entry?.cells || []).map(cell => ({
                cell,
                innerColor: entryColor,
                colors: [entryColor],
                colourTokens: [pairColours[entryColor]],
              })),
              ...(step.exit?.cells || []).map(cell => ({
                cell,
                innerColor: exitColor,
                colors: [exitColor],
                colourTokens: [pairColours[exitColor]],
              })),
            ],
          };
        });
        const eliminations = (chain.eliminations || [])
          .map(item => ({ cell: Number(item.cell), digit: Number(item.digit) }))
          .filter(item => Number.isInteger(item.cell) && Number.isInteger(item.digit));
        if (!eliminations.length) continue;
        const pathKey = chain.steps.map(step => [
          step.linkId,
          ...(step.entry?.cells || []),
          ...(step.exit?.cells || []),
        ].join(':')).join('|');
        const reportKey = `${digit}|${pathKey}|${eliminations.map(item => `${item.cell}:${item.digit}`).join(',')}`;
        if (seenAicReports.has(reportKey)) continue;
        seenAicReports.add(reportKey);
        const edges = linkColours.map(link => ({
          kind: 'strong-link',
          linkId: link.id,
          left: { linkId: link.id, cell: link.cells[0] },
          right: { linkId: link.id, cell: link.cells[1] },
        }));
        for (let index = 1; index < chain.steps.length; index++) {
          const previous = chain.steps[index - 1];
          const current = chain.steps[index];
          edges.push({
            kind: 'weak-inference',
            flip: true,
            left: {
              linkId: previous.linkId,
              label: String.fromCharCode(65 + index - 1),
            },
            right: {
              linkId: current.linkId,
              label: String.fromCharCode(65 + index),
            },
            pairs: [{
              leftCell: previous.exit?.cells?.[0],
              rightCell: current.entry?.cells?.[0],
            }],
          });
        }
        aicReports.push({
          family: 'Multi-colouring',
          tech: 'multi-colouring',
          digit,
          rules: ['weak-inference-colour-walk'],
          topColourCells: [
            [...cellColors].filter(([, colors]) => colors.has(0)).map(([cell]) => cell),
            [...cellColors].filter(([, colors]) => colors.has(1)).map(([cell]) => cell),
          ],
          linkColours,
          cellColours: [...cellColors].map(([cell, colors]) => ({
            cell,
            digit,
            colors: [...colors],
            colourTokens: [...(cellColourTokens.get(cell) || [])],
          })),
          weakLinks: edges.filter(edge => edge.kind === 'weak-inference'),
          nodes: [...cellColors].map(([cell, colors]) => ({
            cell,
            digit,
            colors: [...colors],
          })),
          edges,
          ring: Boolean(chain.isRing),
          terminalClosure: null,
          colourChecks: [],
          trueCells: [],
          cycleTruthCells: [],
          trueAtoms: [],
          invalidColors: [],
          invalidColourAtoms: [],
          parityConflicts: [],
          conflicts: [],
          mixedSectors: [],
          links: chain.steps.length,
          linkIds: chain.steps.map(step => step.linkId),
          terminalTruth: [],
          falseLinks: [],
          eliminations,
        });
      }
      return aicReports;
    }
    return [];
  }

  function buildMultiColoringFullBreadth(cand, strongLinkSet = null) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    const digitLinks = Array.from({ length: 9 }, () => []);
    const namedNodeColourPairs = [
      ['lavender', 'sky'],
      ['amber', 'mint'],
      ['turquoise', 'peach'],
      ['cobalt', 'olive'],
      ['plum', 'lemon'],
      ['slate', 'sage'],
      ['charcoal', 'apricot'],
      ['orchid', 'moss'],
      ['navy', 'gold'],
    ];
    const nodeColourPair = index => namedNodeColourPairs[index]
      || ['pair-' + (index + 1) + '-left', 'pair-' + (index + 1) + '-right'];
    const atomKey = (cell, digit) => String(cell) + ':' + String(digit);
    const eliminationKey = (cell, digit) => String(cell) + ':' + String(digit);

    for (const link of linkset[BILOCAL] || []) {
      const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
      const cells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
        .filter(cell => (cand[cell] || []).includes(digit));
      if (digit < 1 || digit > 9 || cells.length !== 2) continue;
      digitLinks[digit - 1].push({ link, cells });
    }

    const reports = [];
    for (let digitIndex = 0; digitIndex < digitLinks.length; digitIndex++) {
      const links = digitLinks[digitIndex];
      if (links.length < 2) continue;
      const digit = digitIndex + 1;
      const adjacency = new Map();
      const weakEdges = [];
      const overlapEdges = [];
      const connectionKeys = new Set();
      links.forEach((entry, index) => adjacency.set(index, []));

      const addConnection = (leftNode, rightNode, leftEnd, rightEnd, kind, parityFlip) => {
        const key = [kind, leftNode, rightNode, leftEnd, rightEnd].join('|');
        if (connectionKeys.has(key)) return;
        connectionKeys.add(key);
        const edge = {
          leftNode,
          rightNode,
          leftEnd,
          rightEnd,
          leftCell: links[leftNode].cells[leftEnd],
          rightCell: links[rightNode].cells[rightEnd],
          kind,
          parityFlip,
        };
        if (kind === 'weak-inference') weakEdges.push(edge);
        if (kind === 'overlap-extension') overlapEdges.push(edge);
        adjacency.get(leftNode).push({
          other: rightNode,
          fromEnd: leftEnd,
          toEnd: rightEnd,
          kind,
          parityFlip,
          edge,
        });
        adjacency.get(rightNode).push({
          other: leftNode,
          fromEnd: rightEnd,
          toEnd: leftEnd,
          kind,
          parityFlip,
          edge,
        });
      };

      for (let leftNode = 0; leftNode < links.length; leftNode++) {
        for (let rightNode = leftNode + 1; rightNode < links.length; rightNode++) {
          for (let leftEnd = 0; leftEnd < 2; leftEnd++) {
            for (let rightEnd = 0; rightEnd < 2; rightEnd++) {
              const leftCell = links[leftNode].cells[leftEnd];
              const rightCell = links[rightNode].cells[rightEnd];
              if (leftCell === rightCell) continue;
              if (!core.peersOf(leftCell).includes(rightCell)) continue;
              addConnection(
                leftNode,
                rightNode,
                leftEnd,
                rightEnd,
                'weak-inference',
                1,
              );
            }
          }
        }
      }

      for (let leftNode = 0; leftNode < links.length; leftNode++) {
        for (let rightNode = leftNode + 1; rightNode < links.length; rightNode++) {
          for (let leftEnd = 0; leftEnd < 2; leftEnd++) {
            for (let rightEnd = 0; rightEnd < 2; rightEnd++) {
              if (links[leftNode].cells[leftEnd] !== links[rightNode].cells[rightEnd]) continue;
              addConnection(
                leftNode,
                rightNode,
                leftEnd,
                rightEnd,
                'overlap-extension',
                0,
              );
            }
          }
        }
      }

      const visited = new Set();
      for (let startNode = 0; startNode < links.length; startNode++) {
        if (visited.has(startNode) || !adjacency.get(startNode).length) continue;
        const nodeParities = new Map();
        const componentNodes = new Set();
        const parityConflicts = [];
        const queue = [{ node: startNode, parity: 0 }];

        while (queue.length) {
          const current = queue.shift();
          const existing = nodeParities.get(current.node) || new Set();
          if (existing.has(current.parity)) continue;
          if (existing.size) {
            for (const observed of existing) {
              parityConflicts.push({
                kind: 'weak-parity',
                node: current.node,
                expected: current.parity,
                observed,
              });
            }
          }
          existing.add(current.parity);
          nodeParities.set(current.node, existing);
          componentNodes.add(current.node);
          visited.add(current.node);

          for (const connection of adjacency.get(current.node) || []) {
            const expected = current.parity
              ^ connection.fromEnd
              ^ connection.toEnd
              ^ connection.parityFlip;
            queue.push({ node: connection.other, parity: expected });
          }
        }

        if (componentNodes.size < 2) continue;
        const componentLinks = [...componentNodes]
          .sort((left, right) => left - right)
          .map(index => links[index]);
        const componentLinkIndex = new Map(
          [...componentNodes].sort((left, right) => left - right)
            .map((node, index) => [node, index]),
        );
        const overlapNeighbors = new Map(
          [...componentNodes].map(node => [node, new Set()]),
        );
        for (const edge of overlapEdges) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          overlapNeighbors.get(edge.leftNode).add(edge.rightNode);
          overlapNeighbors.get(edge.rightNode).add(edge.leftNode);
        }
        const nodePairIndex = new Map();
        let nextPairIndex = 0;
        for (const root of [...componentNodes].sort((left, right) => left - right)) {
          if (nodePairIndex.has(root)) continue;
          const pairQueue = [root];
          nodePairIndex.set(root, nextPairIndex);
          while (pairQueue.length) {
            const node = pairQueue.shift();
            for (const neighbor of overlapNeighbors.get(node) || []) {
              if (nodePairIndex.has(neighbor)) continue;
              nodePairIndex.set(neighbor, nextPairIndex);
              pairQueue.push(neighbor);
            }
          }
          nextPairIndex++;
        }
        const atomRecords = new Map();
        const addAtom = (cell, parity, linkId, pairColours, nodeIndex) => {
          const key = atomKey(cell, digit);
          let record = atomRecords.get(key);
          if (!record) {
            record = {
              cell,
              digit,
              colors: new Set(),
              colourTokens: new Set(),
              linkIds: new Set(),
              nodeIndexes: new Set(),
            };
            atomRecords.set(key, record);
          }
          record.colors.add(parity);
          record.colourTokens.add(pairColours[parity]);
          record.linkIds.add(linkId);
          record.nodeIndexes.add(nodeIndex);
        };

        for (const node of [...componentNodes].sort((left, right) => left - right)) {
          const nodeIndex = componentLinkIndex.get(node);
          const pairColours = nodeColourPair(nodePairIndex.get(node) || 0);
          const parities = [...(nodeParities.get(node) || new Set([0]))];
          for (const parity of parities) {
            addAtom(links[node].cells[0], parity, links[node].link.id, pairColours, nodeIndex);
            addAtom(links[node].cells[1], 1 - parity, links[node].link.id, pairColours, nodeIndex);
          }
        }

        const invalidColors = new Set();
        const parityConflictsBySector = [];
        const sectorConflictKeys = new Set();
        const mixedSectors = [];
        const eliminations = new Set();
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const sectorAtoms = [...atomRecords.values()]
            .filter(record => core.UNITS[sector].includes(record.cell));
          if (!sectorAtoms.length) continue;
          const parityAtoms = [new Set(), new Set()];
          for (const record of sectorAtoms) {
            for (const parity of record.colors) parityAtoms[parity].add(atomKey(record.cell, digit));
          }
          for (let parity = 0; parity < 2; parity++) {
            if (parityAtoms[parity].size >= 2) {
              invalidColors.add(parity);
              parityConflictsBySector.push({
                sector,
                parity,
                cells: sectorAtoms
                  .filter(record => record.colors.has(parity))
                  .map(record => record.cell),
              });
            }
          }
          if (parityAtoms[0].size && parityAtoms[1].size) {
            mixedSectors.push(sector);
          }
        }

        // A parity is false when the union of its same-digit peers covers
        // every viable placement in a sector. The coloured witness cells
        // must be outside that sector, or one could itself be the survivor.
        const atomRecordsList = [...atomRecords.values()];
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const unit = core.UNITS[sector];
          const viableCells = unit.filter(cell => (cand[cell] || []).includes(digit));
          if (!viableCells.length) continue;
          for (const parity of [0, 1]) {
            const colouredNodes = atomRecordsList.filter(record => record.colors.has(parity));
            if (!colouredNodes.length || colouredNodes.some(record => unit.includes(record.cell))) continue;
            const uncoveredCells = viableCells.filter(cell =>
              !colouredNodes.some(record => core.peersOf(record.cell).includes(cell)),
            );
            if (uncoveredCells.length) continue;
            const conflictKey = `${sector}|${digit}|${parity}`;
            if (sectorConflictKeys.has(conflictKey)) continue;
            sectorConflictKeys.add(conflictKey);
            invalidColors.add(parity);
            parityConflictsBySector.push({
              kind: 'sector-peer-union',
              sector,
              parity,
              cells: [...viableCells],
              witnesses: colouredNodes.map(record => record.cell),
            });
          }
        }

        // The display parity is useful for showing the breadth walk, but it
        // is not itself a proof. In particular, a weak peer relation is NAND:
        // true -> false, while false -> true is not allowed. The previous
        // code treated every weak edge as an XOR during this step and could
        // therefore manufacture a false terminal overlap.
        const terminalCandidates = new Set(
          [...atomRecords.values()]
            .filter(record => record.colors.size > 1)
            .map(record => atomKey(record.cell, digit)),
        );
        const terminalAtoms = new Set();
        const trueAtoms = new Set();
        const trueCells = new Set();

        const addPeerEliminations = cell => {
          for (const peer of core.peersOf(cell)) {
            if ((cand[peer] || []).includes(digit)) {
              eliminations.add(eliminationKey(peer, digit));
            }
          }
        };

        const logicalEdges = [];
        const logicalEdgeKeys = new Set();
        const addLogicalEdge = (left, right, kind) => {
          if (left === right) return;
          const key = [kind, left, right].sort().join('|');
          if (logicalEdgeKeys.has(key)) return;
          logicalEdgeKeys.add(key);
          logicalEdges.push({ left, right, kind });
        };

        for (const node of componentNodes) {
          const cells = links[node].cells;
          addLogicalEdge(
            atomKey(cells[0], digit),
            atomKey(cells[1], digit),
            'strong-xor',
          );
        }
        for (const edge of weakEdges) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          addLogicalEdge(
            atomKey(edge.leftCell, digit),
            atomKey(edge.rightCell, digit),
            'weak-nand',
          );
        }

        const propagateAssumptions = seeds => {
          const states = new Map();
          const queue = [];
          let contradiction = false;
          const assign = (key, truth) => {
            if (!atomRecords.has(key)) return;
            const assigned = states.get(key) || new Set();
            if (assigned.has(!truth)) {
              contradiction = true;
              return;
            }
            if (assigned.has(truth)) return;
            assigned.add(truth);
            states.set(key, assigned);
            queue.push([key, truth]);
          };

          for (const [seedKey, seedTruth] of seeds) assign(seedKey, seedTruth);
          while (queue.length && !contradiction) {
            const [key, truth] = queue.shift();
            for (const edge of logicalEdges) {
              let other = null;
              if (edge.left === key) other = edge.right;
              else if (edge.right === key) other = edge.left;
              if (!other) continue;
              if (edge.kind === 'strong-xor') {
                assign(other, !truth);
              } else if (truth) {
                // Weak inference is NAND, not XOR. A false endpoint does
                // not force the other endpoint to become true.
                assign(other, false);
              }
            }
          }
          return { contradiction, states };
        };

        const propagateAssumption = (rootKey, rootTruth) =>
          propagateAssumptions([[rootKey, rootTruth]]);

        const forcedFalseAtoms = new Set();
        const forcedTrueAtoms = new Set();
        for (const key of atomRecords.keys()) {
          const trueBranch = propagateAssumption(key, true);
          const falseBranch = propagateAssumption(key, false);
          if (trueBranch.contradiction && !falseBranch.contradiction) {
            forcedFalseAtoms.add(key);
            eliminations.add(key);
          }
          if (falseBranch.contradiction && !trueBranch.contradiction) {
            forcedTrueAtoms.add(key);
            trueAtoms.add(key);
            const record = atomRecords.get(key);
            trueCells.add(record.cell);
            if (terminalCandidates.has(key)) terminalAtoms.add(key);
            for (const value of cand[record.cell] || []) {
              if (value !== digit) eliminations.add(eliminationKey(record.cell, value));
            }
            addPeerEliminations(record.cell);
          }
        }

        // A parity contradiction can assert the surviving parity without
        // going through a single-atom assumption. Apply the same cell and
        // peer consequences as the forced-truth path above.
        for (const key of trueAtoms) {
          const record = atomRecords.get(key);
          if (!record) continue;
          for (const value of cand[record.cell] || []) {
            if (value !== digit) eliminations.add(eliminationKey(record.cell, value));
          }
          addPeerEliminations(record.cell);
        }

        // An outside candidate is another NAND endpoint. If it were true,
        // every coloured peer would have to be false. Keep the elimination
        // only when those assignments contradict the strong-link graph.
        let nandContradictionFound = false;
        for (let cell = 0; cell < cand.length; cell++) {
          if (!(cand[cell] || []).includes(digit)) continue;
          const peerKeys = [...atomRecords.values()]
            .filter(record => record.cell !== cell
              && core.peersOf(cell).includes(record.cell))
            .map(record => atomKey(record.cell, digit));
          if (!peerKeys.length) continue;
          const seeds = peerKeys.map(key => [key, false]);
          const ownKey = atomKey(cell, digit);
          if (atomRecords.has(ownKey)) seeds.push([ownKey, true]);
          if (!propagateAssumptions(seeds).contradiction) continue;
          eliminations.add(eliminationKey(cell, digit));
          nandContradictionFound = true;
        }

        // A candidate that sees both logical parities for this digit is
        // impossible. This is a direct colouring rule; it does not require
        // the outside candidate to be part of the NAND assumption graph.
        let oppositeParityPeerTrigger = false;
        for (let cell = 0; cell < cand.length; cell++) {
          if (!(cand[cell] || []).includes(digit)) continue;
          let seesParityZero = false;
          let seesParityOne = false;
          for (const record of atomRecords.values()) {
            if (record.cell === cell || !core.peersOf(cell).includes(record.cell)) continue;
            if (record.colors.has(0)) seesParityZero = true;
            if (record.colors.has(1)) seesParityOne = true;
            if (seesParityZero && seesParityOne) break;
          }
          if (!seesParityZero || !seesParityOne) continue;
          eliminations.add(eliminationKey(cell, digit));
          oppositeParityPeerTrigger = true;
        }

        if (!eliminations.size) continue;
        const sortedNodes = [...componentNodes].sort((left, right) => left - right);
        const linkColours = sortedNodes.map((node, index) => {
          const entry = links[node];
          const pairIndex = nodePairIndex.get(node) ?? 0;
          const pairColours = nodeColourPair(pairIndex);
          const parities = [...(nodeParities.get(node) || new Set([0]))];
          return {
            id: entry.link.id,
            label: String.fromCharCode(65 + (index % 26)),
            cells: [...entry.cells],
            colors: [0, 1],
            pairIndex,
            pairColours: [...pairColours],
            endpoints: entry.cells.map((cell, endpointIndex) => {
              const endpointColors = [...new Set(
                parities.map(nodeParityValue => nodeParityValue ^ endpointIndex),
              )].sort((left, right) => left - right);
              return {
                cell,
                digit,
                innerColor: endpointColors.length === 1 ? endpointColors[0] : endpointColors,
                colors: endpointColors,
                colourTokens: endpointColors.map(endpointColor => pairColours[endpointColor]),
              };
            }),
          };
        });
        const linkByNode = new Map(sortedNodes.map((node, index) => [node, linkColours[index]]));
        const edges = linkColours.map(link => ({
          kind: 'strong-link',
          linkId: link.id,
          left: { linkId: link.id, cell: link.cells[0], digit },
          right: { linkId: link.id, cell: link.cells[1], digit },
        }));
        for (const edge of weakEdges) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          const leftLink = linkByNode.get(edge.leftNode);
          const rightLink = linkByNode.get(edge.rightNode);
          edges.push({
            kind: 'weak-inference',
            flip: true,
            left: {
              linkId: leftLink.id,
              label: leftLink.label,
              cell: edge.leftCell,
              digit,
            },
            right: {
              linkId: rightLink.id,
              label: rightLink.label,
              cell: edge.rightCell,
              digit,
            },
            pairs: [{
              leftCell: edge.leftCell,
              rightCell: edge.rightCell,
              leftDigit: digit,
              rightDigit: digit,
            }],
          });
        }
        for (const edge of overlapEdges) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          const leftLink = linkByNode.get(edge.leftNode);
          const rightLink = linkByNode.get(edge.rightNode);
          edges.push({
            kind: 'overlap-extension',
            flip: false,
            left: {
              linkId: leftLink.id,
              label: leftLink.label,
              cell: edge.leftCell,
              digit,
            },
            right: {
              linkId: rightLink.id,
              label: rightLink.label,
              cell: edge.rightCell,
              digit,
            },
            pairs: [{
              leftCell: edge.leftCell,
              rightCell: edge.rightCell,
              leftDigit: digit,
              rightDigit: digit,
            }],
          });
        }
        const colourChecks = [];
        const atomList = [...atomRecords.values()];
        for (let left = 0; left < atomList.length; left++) {
          for (let right = left + 1; right < atomList.length; right++) {
            const leftRecord = atomList[left];
            const rightRecord = atomList[right];
            if (leftRecord.cell === rightRecord.cell) continue;
            if (!core.peersOf(leftRecord.cell).includes(rightRecord.cell)) continue;
            for (const leftToken of leftRecord.colourTokens) {
              for (const rightToken of rightRecord.colourTokens) {
                colourChecks.push({
                  colours: [leftToken, rightToken],
                  left: { cell: leftRecord.cell },
                  right: { cell: rightRecord.cell },
                });
              }
            }
          }
        }
        const eliminationItems = [...eliminations]
          .map(key => key.split(':').map(Number))
          .sort((left, right) => left[0] - right[0] || left[1] - right[1])
          .map(([cell, value]) => ({ cell, digit: value }));
        const rules = [];
        if (terminalAtoms.size) rules.push('cycle-return-truth');
        if (invalidColors.size) rules.push('sector-same-parity');
        if (parityConflictsBySector.some(conflict => conflict.kind === 'sector-peer-union')) {
          rules.push('sector-peer-union-contradiction');
        }
        if (nandContradictionFound) rules.push('grouped-opposite-parity-visibility');
        if (oppositeParityPeerTrigger) rules.push('opposite-parity-peer');
        reports.push({
          family: 'Multi-colouring',
          tech: 'multi-colouring',
          digit,
          rules,
          topColourCells: [
            [...atomRecords.values()]
              .filter(record => [...record.colors].includes(0))
              .map(record => record.cell),
            [...atomRecords.values()]
              .filter(record => [...record.colors].includes(1))
              .map(record => record.cell),
          ],
          linkColours,
          cellColours: atomList.map(record => ({
            cell: record.cell,
            digit,
            linkId: [...record.linkIds][0],
            colors: [...record.colors].sort((left, right) => left - right),
            colourTokens: [...record.colourTokens],
          })),
          weakLinks: edges.filter(edge => edge.kind === 'weak-inference'),
          nodes: atomList.map(record => ({
            cell: record.cell,
            digit,
            colors: [...record.colors].sort((left, right) => left - right),
            colourTokens: [...record.colourTokens],
          })),
          edges,
          ring: false,
          terminalClosure: terminalAtoms.size
            ? { kind: 'same-cell', cells: [...trueCells].sort((left, right) => left - right) }
            : null,
          colourChecks,
          trueCells: [...trueCells].sort((left, right) => left - right),
          cycleTruthCells: [...terminalAtoms]
            .map(key => Number(key.split(':')[0]))
            .sort((left, right) => left - right),
          trueAtoms: [...trueAtoms],
          invalidColors: [...invalidColors].sort((left, right) => left - right),
          invalidColourAtoms: atomList
            .filter(record => [...record.colors].some(color => invalidColors.has(color)))
            .map(record => atomKey(record.cell, digit)),
          parityConflicts: parityConflictsBySector,
          sectorClearedConflicts: parityConflictsBySector
            .filter(conflict => conflict.kind === 'sector-peer-union'),
          conflicts: parityConflicts,
          mixedSectors,
          links: componentNodes.size,
          linkIds: sortedNodes.map(node => links[node].link.id),
          terminalTruth: [...terminalAtoms]
            .map(key => {
              const record = atomRecords.get(key);
              return {
                cell: record.cell,
                digit,
                observedParities: [...record.colors].sort((left, right) => left - right),
                asserted: true,
              };
            }),
          falseLinks: [],
          eliminations: eliminationItems,
        });
      }
    }
    return reports;
  }

  // Super Multi-colouring keeps each strong link as a two-sided grouped node.
  // Unlike standalone Multi-colouring, a side may contain the multiple cells
  // supplied by types 1, 2, and 3.  The graph therefore colours side
  // propositions, not arbitrary cell-to-cell pairs.
  function buildSuperMultiColoring(cand, strongLinkSet = null) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    const namedNodeColourPairs = [
      ['lavender', 'sky'], ['amber', 'mint'], ['turquoise', 'peach'],
      ['cobalt', 'olive'], ['plum', 'lemon'], ['slate', 'sage'],
      ['charcoal', 'apricot'], ['orchid', 'moss'], ['navy', 'gold'],
    ];
    const nodeColourPair = index => namedNodeColourPairs[index]
      || ['pair-' + (index + 1) + '-left', 'pair-' + (index + 1) + '-right'];
    const atomKey = (cell, digit) => String(cell) + ':' + String(digit);
    const sideKey = (node, side) => String(node) + ':' + String(side);
    const eliminationKey = (cell, digit) => String(cell) + ':' + String(digit);
    const reports = [];
    const digitEntries = Array.from({ length: 9 }, () => []);

    for (let linkType = BILOCAL; linkType <= ERI; linkType++) {
      for (const link of linkset[linkType] || []) {
        const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
        if (digit < 1 || digit > 9) continue;
        const sourceActiveCells = [...new Set(link.activeCells || [])]
          .filter(cell => (cand[cell] || []).includes(digit));
        const sourceLinkedCells = [...new Set(link.linkedCells || [])]
          .filter(cell => (cand[cell] || []).includes(digit));
        const sharedCells = linkType === ERI
          ? sourceActiveCells.filter(cell => sourceLinkedCells.includes(cell))
          : [];
        const activeCells = sourceActiveCells.filter(cell => !sharedCells.includes(cell));
        const linkedCells = sourceLinkedCells.filter(cell => !sharedCells.includes(cell));
        if (!activeCells.length || !linkedCells.length) continue;
        // An ERI deliberately shares its row/column intersection cell between
        // both source sides. That I-cell is geometry metadata, not a colour
        // graph atom: only the non-intersection cells become graph endpoints.
        if (linkType !== ERI && sourceActiveCells.some(cell => sourceLinkedCells.includes(cell))) continue;
        digitEntries[digit - 1].push({
          link,
          linkType,
          digit,
          sides: [activeCells, linkedCells],
          sharedCells,
        });
      }
    }

    const allPeers = (leftCells, rightCells) => leftCells.every(left =>
      rightCells.every(right => left !== right && core.peersOf(left).includes(right)));

    for (const entries of digitEntries) {
      if (entries.length < 2) continue;
      const digit = entries[0].digit;
      const adjacency = new Map(entries.map((_, index) => [index, []]));
      const connections = [];
      const overlapEdges = [];
      const weakEdges = [];
      const connectionKeys = new Set();
      const addConnection = (leftNode, rightNode, leftSide, rightSide, kind, parityFlip) => {
        const key = [kind, leftNode, rightNode, leftSide, rightSide].join('|');
        if (connectionKeys.has(key)) return;
        connectionKeys.add(key);
        const leftCells = entries[leftNode].sides[leftSide];
        const rightCells = entries[rightNode].sides[rightSide];
        const edge = {
          leftNode,
          rightNode,
          leftSide,
          rightSide,
          leftCells: [...leftCells],
          rightCells: [...rightCells],
          leftCell: leftCells[0],
          rightCell: rightCells[0],
          kind,
          parityFlip,
        };
        connections.push(edge);
        if (kind === 'weak-inference') weakEdges.push(edge);
        if (kind === 'overlap-extension') overlapEdges.push(edge);
        adjacency.get(leftNode).push({
          other: rightNode,
          fromSide: leftSide,
          toSide: rightSide,
          parityFlip,
          kind,
          edge,
        });
        adjacency.get(rightNode).push({
          other: leftNode,
          fromSide: rightSide,
          toSide: leftSide,
          parityFlip,
          kind,
          edge,
        });
      };

      for (let leftNode = 0; leftNode < entries.length; leftNode++) {
        for (let rightNode = leftNode + 1; rightNode < entries.length; rightNode++) {
          for (let leftSide = 0; leftSide < 2; leftSide++) {
            for (let rightSide = 0; rightSide < 2; rightSide++) {
              const leftCells = entries[leftNode].sides[leftSide];
              const rightCells = entries[rightNode].sides[rightSide];
              if (leftCells.some(cell => rightCells.includes(cell))) {
                addConnection(leftNode, rightNode, leftSide, rightSide,
                  'overlap-extension', 0);
              }
              if (allPeers(leftCells, rightCells)) {
                addConnection(leftNode, rightNode, leftSide, rightSide,
                  'weak-inference', 1);
              }
            }
          }
        }
      }

      const visited = new Set();
      for (let startNode = 0; startNode < entries.length; startNode++) {
        if (visited.has(startNode) || !adjacency.get(startNode).length) continue;
        const nodeParities = new Map();
        const componentNodes = new Set();
        const parityConflicts = [];
        const queue = [{ node: startNode, parity: 0 }];
        while (queue.length) {
          const current = queue.shift();
          const existing = nodeParities.get(current.node) || new Set();
          if (existing.has(current.parity)) continue;
          if (existing.size) {
            for (const observed of existing) {
              parityConflicts.push({
                kind: 'weak-parity',
                node: current.node,
                expected: current.parity,
                observed,
              });
            }
          }
          existing.add(current.parity);
          nodeParities.set(current.node, existing);
          componentNodes.add(current.node);
          visited.add(current.node);
          for (const edge of adjacency.get(current.node) || []) {
            const nextParity = current.parity
              ^ edge.fromSide ^ edge.toSide ^ edge.parityFlip;
            queue.push({ node: edge.other, parity: nextParity });
          }
        }
        if (componentNodes.size < 2) continue;

        const sortedComponent = [...componentNodes].sort((a, b) => a - b);
        // Record parity conflicts for auditing, but do not render every
        // endpoint in a conflicted component as dual-coloured. Shared ERI
        // intersection cells are promoted to both colours separately below.
        const displayNodeParity = new Map(sortedComponent.map(node => [
          node,
          [...(nodeParities.get(node) || new Set([0]))][0] ?? 0,
        ]));
        // Every grouped node owns its own colour pair. Overlap edges extend
        // the logical walk, but must not merge the visual identity or parity
        // scope of two different grouped links.
        const nodePairIndex = new Map(
          sortedComponent.map((node, index) => [node, index]),
        );

        const atomRecords = new Map();
        const addAtom = (cell, parity, entry, nodeIndex) => {
          const key = atomKey(cell, digit);
          let record = atomRecords.get(key);
          if (!record) {
            record = {
              cell,
              digit,
              colors: new Set(),
              colourTokens: new Set(),
              linkIds: new Set(),
              nodeIndexes: new Set(),
            };
            atomRecords.set(key, record);
          }
          const pairColours = nodeColourPair(nodePairIndex.get(nodeIndex) || 0);
          record.colors.add(parity);
          record.colourTokens.add(pairColours[parity]);
          record.linkIds.add(entry.link.id);
          record.nodeIndexes.add(nodeIndex);
        };
        for (const node of sortedComponent) {
          const entry = entries[node];
          const parities = [...(nodeParities.get(node) || new Set([0]))];
          for (const nodeParity of parities) {
            for (let side = 0; side < 2; side++) {
              const sideParity = nodeParity ^ side;
              for (const cell of entry.sides[side]) {
                addAtom(cell, sideParity, entry, node);
              }
            }
          }
        }

        const displayAtomRecords = new Map();
        const addDisplayAtom = (cell, parity, entry, nodeIndex) => {
          const key = atomKey(cell, digit);
          let record = displayAtomRecords.get(key);
          if (!record) {
            record = {
              cell,
              digit,
              colors: new Set(),
              colourTokens: new Set(),
              linkIds: new Set(),
              nodeIndexes: new Set(),
            };
            displayAtomRecords.set(key, record);
          }
          const pairColours = nodeColourPair(nodePairIndex.get(nodeIndex) || 0);
          record.colors.add(parity);
          record.colourTokens.add(pairColours[parity]);
          record.linkIds.add(entry.link.id);
          record.nodeIndexes.add(nodeIndex);
        };
        for (const node of sortedComponent) {
          const entry = entries[node];
          const nodeParity = displayNodeParity.get(node) || 0;
          for (let side = 0; side < 2; side++) {
            const sideParity = nodeParity ^ side;
            for (const cell of entry.sides[side]) {
              addDisplayAtom(cell, sideParity, entry, node);
            }
          }
        }

        const logicalEdges = [];
        const logicalEdgeKeys = new Set();
        const addLogicalEdge = (left, right, kind) => {
          if (left === right) return;
          const key = [kind, left, right].sort().join('|');
          if (logicalEdgeKeys.has(key)) return;
          logicalEdgeKeys.add(key);
          logicalEdges.push({ left, right, kind });
        };
        for (const node of componentNodes) {
          addLogicalEdge(sideKey(node, 0), sideKey(node, 1), 'strong-xor');
        }
        for (const edge of connections) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          addLogicalEdge(
            sideKey(edge.leftNode, edge.leftSide),
            sideKey(edge.rightNode, edge.rightSide),
            edge.kind === 'weak-inference' ? 'weak-nand' : 'same-parity',
          );
        }

        const propagateAssumptions = seeds => {
          const states = new Map();
          const queue = [];
          let contradiction = false;
          const assign = (key, truth) => {
            if (!logicalEdges.some(edge => edge.left === key || edge.right === key)) return;
            const assigned = states.get(key) || new Set();
            if (assigned.has(!truth)) {
              contradiction = true;
              return;
            }
            if (assigned.has(truth)) return;
            assigned.add(truth);
            states.set(key, assigned);
            queue.push([key, truth]);
          };
          for (const [key, truth] of seeds) assign(key, truth);
          while (queue.length && !contradiction) {
            const [key, truth] = queue.shift();
            for (const edge of logicalEdges) {
              const other = edge.left === key ? edge.right : edge.right === key ? edge.left : null;
              if (!other) continue;
              if (edge.kind === 'strong-xor') assign(other, !truth);
              else if (edge.kind === 'same-parity') assign(other, truth);
              else if (truth) assign(other, false);
            }
          }
          return { contradiction, states };
        };

        const eliminations = new Set();
        const forcedFalseSides = new Set();
        const forcedTrueSides = new Set();
        const visibleSideParities = (cell, excludedSideKey = null) => {
          const visible = new Map();
          for (const node of componentNodes) {
            const nodeParity = displayNodeParity.get(node) || 0;
            const pairIndex = nodePairIndex.get(node) || 0;
            for (let side = 0; side < 2; side++) {
              if (sideKey(node, side) === excludedSideKey) continue;
              const cells = entries[node].sides[side];
              if (!cells.length || !cells.every(source =>
                source !== cell && core.peersOf(source).includes(cell))) continue;
              const parities = visible.get(pairIndex) || new Set();
              parities.add(nodeParity ^ side);
              visible.set(pairIndex, parities);
            }
          }
          return visible;
        };
        for (const [key] of logicalEdges.flatMap(edge => [[edge.left], [edge.right]])) {
          const trueBranch = propagateAssumptions([[key, true]]);
          const falseBranch = propagateAssumptions([[key, false]]);
          if (trueBranch.contradiction && !falseBranch.contradiction) {
            forcedFalseSides.add(key);
          }
          if (falseBranch.contradiction && !trueBranch.contradiction) {
            forcedTrueSides.add(key);
            const [nodeText, sideText] = key.split(':');
            const entry = entries[Number(nodeText)];
            const cells = entry.sides[Number(sideText)];
            const targetParity = (displayNodeParity.get(Number(nodeText)) || 0) ^ Number(sideText);
            for (let cell = 0; cell < cand.length; cell++) {
              if (!(cand[cell] || []).includes(digit)) continue;
              if (!cells.every(source => source !== cell && core.peersOf(source).includes(cell))) continue;
              const pairIndex = nodePairIndex.get(Number(nodeText)) || 0;
              const opposite = visibleSideParities(cell, key).get(pairIndex)?.has(1 - targetParity);
              if (!opposite) continue;
              eliminations.add(eliminationKey(cell, digit));
            }
          }
        }

        // A grouped side is not a standalone peer eliminator. An outside
        // candidate must see every cell of one side and a separately visible
        // side of the opposite parity before the weak-NAND rule can fire.
        let nandContradictionFound = false;
        for (let cell = 0; cell < cand.length; cell++) {
          if (!(cand[cell] || []).includes(digit)) continue;
          const visible = visibleSideParities(cell);
          if (![...visible.values()].some(parities => parities.has(0) && parities.has(1))) continue;
          eliminations.add(eliminationKey(cell, digit));
          nandContradictionFound = true;
        }

        if (!eliminations.size) continue;
        const sortedNodes = sortedComponent;
        const linkColours = sortedNodes.map((node, index) => {
          const entry = entries[node];
          const pairColours = nodeColourPair(nodePairIndex.get(node) || 0);
          const nodeParityForDisplay = displayNodeParity.get(node) || 0;
          const endpoints = [];
          for (let side = 0; side < 2; side++) {
            const endpointColors = [nodeParityForDisplay ^ side];
            for (const cell of entry.sides[side]) {
              endpoints.push({
                cell,
                digit,
                side,
                colors: endpointColors,
                innerColor: endpointColors.length === 1 ? endpointColors[0] : endpointColors,
                colourTokens: endpointColors.map(color => pairColours[color]),
              });
            }
          }
          return {
            id: entry.link.id,
            label: String.fromCharCode(65 + (index % 26)),
            linkType: entry.linkType,
            linkTypeName: entry.link.linkTypeName || TYPE_NAMES[entry.linkType],
            cells: [...new Set(entry.sides.flat())],
            sides: entry.sides.map(side => [...side]),
            sharedCells: [...(entry.sharedCells || [])],
            colors: [0, 1],
            pairIndex: nodePairIndex.get(node) || 0,
            pairColours: [...pairColours],
            endpoints,
          };
        });
        const linkByNode = new Map(sortedNodes.map((node, index) => [node, linkColours[index]]));
        const edges = linkColours.map(link => ({
          kind: 'strong-link',
          linkId: link.id,
          linkType: link.linkType,
          left: { linkId: link.id, cell: link.sides[0][0], digit },
          right: { linkId: link.id, cell: link.sides[1][0], digit },
          sides: link.sides,
        }));
        for (const edge of connections) {
          if (!componentNodes.has(edge.leftNode) || !componentNodes.has(edge.rightNode)) continue;
          const leftLink = linkByNode.get(edge.leftNode);
          const rightLink = linkByNode.get(edge.rightNode);
          edges.push({
            kind: edge.kind,
            flip: edge.parityFlip === 1,
            left: { linkId: leftLink.id, label: leftLink.label, cell: edge.leftCell, digit },
            right: { linkId: rightLink.id, label: rightLink.label, cell: edge.rightCell, digit },
            leftCells: edge.leftCells,
            rightCells: edge.rightCells,
            pairs: [{
              leftCell: edge.leftCell,
              rightCell: edge.rightCell,
              leftDigit: digit,
              rightDigit: digit,
            }],
          });
        }
        const groupColours = linkColours.map(link => ({
          id: link.id,
          label: link.label,
          digit,
          linkType: link.linkType,
          linkTypeName: link.linkTypeName,
          pairIndex: link.pairIndex,
          pairColours: [...link.pairColours],
          sharedCells: [...(link.sharedCells || [])],
          sides: link.sides.map((cells, side) => {
            const endpoint = link.endpoints.find(item => item.side === side);
            return {
              side,
              cells: [...cells],
              colors: [...(endpoint?.colors || [])],
              colourTokens: [...(endpoint?.colourTokens || [])],
            };
          }),
        }));
        const groupEdges = edges.map(edge => ({
          kind: edge.kind,
          linkId: edge.linkId,
          linkType: edge.linkType,
          leftGroupId: edge.left?.linkId,
          rightGroupId: edge.right?.linkId,
          leftSide: edge.leftCells ? edge.leftCells : edge.sides?.[0] || [],
          rightSide: edge.rightCells ? edge.rightCells : edge.sides?.[1] || [],
          flip: !!edge.flip,
        }));
        const atomList = [...atomRecords.values()];
        const colourChecks = [];
        for (let left = 0; left < atomList.length; left++) {
          for (let right = left + 1; right < atomList.length; right++) {
            if (atomList[left].cell === atomList[right].cell
              || !core.peersOf(atomList[left].cell).includes(atomList[right].cell)) continue;
            for (const leftToken of atomList[left].colourTokens) {
              for (const rightToken of atomList[right].colourTokens) {
                colourChecks.push({
                  colours: [leftToken, rightToken],
                  left: { cell: atomList[left].cell },
                  right: { cell: atomList[right].cell },
                });
              }
            }
          }
        }
        const eliminationItems = [...eliminations]
          .map(key => key.split(':').map(Number))
          .sort((left, right) => left[0] - right[0] || left[1] - right[1])
          .map(([cell, value]) => ({ cell, digit: value }));
        const rules = ['full-breadth', 'strong-link-types-0-1-2-3'];
        if (groupColours.some(group => (group.sharedCells || []).length)) {
          rules.push('eri-i-cell-excluded');
        }
        if (forcedFalseSides.size) rules.push('forced-side-false');
        if (forcedTrueSides.size) rules.push('forced-side-true');
        if (nandContradictionFound) rules.push('grouped-opposite-parity-visibility');
        reports.push({
          family: 'Super Multi-colouring',
          tech: 'super-multi-colouring',
          digit,
          rules,
          topColourCells: [
            [...displayAtomRecords.values()]
              .filter(record => record.colors.has(0)).map(record => record.cell),
            [...displayAtomRecords.values()]
              .filter(record => record.colors.has(1)).map(record => record.cell),
          ],
          linkColours,
          groupColours,
          groupEdges,
          cellColours: [...displayAtomRecords.values()].map(record => ({
            cell: record.cell,
            digit,
            linkId: [...record.linkIds][0],
            colors: [...record.colors].sort((a, b) => a - b),
            colourTokens: [...record.colourTokens],
          })),
          nodes: [...displayAtomRecords.values()].map(record => ({
            cell: record.cell,
            digit,
            colors: [...record.colors].sort((a, b) => a - b),
            colourTokens: [...record.colourTokens],
          })),
          edges,
          weakLinks: edges.filter(edge => edge.kind === 'weak-inference'),
          ring: false,
          terminalClosure: null,
          colourChecks,
          trueCells: [],
          cycleTruthCells: [],
          trueAtoms: [],
          invalidColors: [],
          invalidColourAtoms: [],
          parityConflicts,
          terminalTruthConflicts: [],
          sectorClearedConflicts: [],
          conflicts: parityConflicts,
          mixedSectors: [],
          links: sortedNodes.length,
          linkIds: sortedNodes.map(node => entries[node].link.id),
          terminalTruth: [],
          safetyFlags: [],
          falseLinks: [...forcedFalseSides],
          eliminations: eliminationItems,
        });
      }
    }
    return reports;
  }


  function buildThreeDMedusa(cand, strongLinkSet = null, options = {}) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    const type0Links = linkset[BILOCAL] || [];
    const type4Links = options.includeBivalveLinks === false
      ? []
      : linkset[ALS] || [];
    const adjacency = new Map();
    const nodeInfo = new Map();
    const edgeRecords = [];
    const seenEdges = new Set();
    const overlapAtoms = new Set();
    const atomOwners = new Map();

    function atomKey(cell, digit) {
      return `${cell}:${digit}`;
    }

    function addNode(cell, digit) {
      if (!Number.isInteger(cell) || digit < 1 || digit > 9) return null;
      if (!(cand[cell] || []).includes(digit)) return null;
      const key = atomKey(cell, digit);
      if (!adjacency.has(key)) adjacency.set(key, new Set());
      if (!nodeInfo.has(key)) nodeInfo.set(key, { cell, digit });
      return key;
    }

    function addEdge(left, right, edge) {
      if (!left || !right || left === right) return;
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
      const edgeKey = [left, right].sort().join('|');
      if (seenEdges.has(edgeKey)) return;
      seenEdges.add(edgeKey);
      edgeRecords.push({ left, right, ...edge });
    }

    for (const link of type0Links) {
      const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
      if (digit < 1 || digit > 9) continue;
      const left = addNode(link.activeCells?.[0], digit);
      const right = addNode(link.linkedCells?.[0], digit);
      for (const atom of [left, right]) {
        if (!atom) continue;
        const owners = atomOwners.get(atom) || new Set();
        if (owners.size) overlapAtoms.add(atom);
        owners.add(link.id);
        atomOwners.set(atom, owners);
      }
      addEdge(left, right, { kind: 'same-digit', linkId: link.id });
    }

    for (const link of type4Links) {
      const cell = link.activeCells?.[0] ?? link.linkedCells?.[0];
      const leftDigit = Number(link.startingDigits?.[0]);
      const rightDigit = Number(link.linkDigits?.[0]);
      if (leftDigit < 1 || leftDigit > 9 || rightDigit < 1 || rightDigit > 9) continue;
      if (leftDigit === rightDigit || (cand[cell] || []).length !== 2) continue;
      const left = addNode(cell, leftDigit);
      const right = addNode(cell, rightDigit);
      addEdge(right, left, {
        kind: 'bivalve-transition',
        cell,
        fromDigit: rightDigit,
        toDigit: leftDigit,
        linkId: link.id,
      });
    }

    // Multi-colouring adds the NAND/weak-inference layer to the canonical
    // atom graph. Shared cell+digit atoms are deliberately one node, so an
    // overlap keeps its incoming parity and the branch continues outward
    // through the other edge instead of terminating or flipping colour.
    if (options.includeWeakPeers) {
      const atoms = [...nodeInfo.entries()];
      for (let leftIndex = 0; leftIndex < atoms.length; leftIndex++) {
        const [leftKey, leftNode] = atoms[leftIndex];
        for (let rightIndex = leftIndex + 1; rightIndex < atoms.length; rightIndex++) {
          const [rightKey, rightNode] = atoms[rightIndex];
          if (leftNode.digit !== rightNode.digit || leftNode.cell === rightNode.cell) continue;
          if (!core.peersOf(leftNode.cell).includes(rightNode.cell)) continue;
          addEdge(leftKey, rightKey, {
            kind: 'weak-inference',
            digit: leftNode.digit,
          });
        }
      }
    }

    const reports = [];
    const visited = new Set();
    let ahsDofCatalogue = null;

    function getAhsDofCatalogue() {
      if (ahsDofCatalogue) return ahsDofCatalogue;
      if (typeof core.ahsConstructor !== 'function') {
        ahsDofCatalogue = [];
        return ahsDofCatalogue;
      }
      // AHS construction is shared by all scopes in this colouring graph.
      // Build it once, then inspect only the sectors touched by each scope.
      ahsDofCatalogue = core.ahsConstructor(cand)
        .filter(ahs => ahs.ahsDOF > 0);
      return ahsDofCatalogue;
    }

    // A global component is useful for finding possible walks, but it is too
    // broad for terminal truth. A terminal closes the active walk at the
    // first opposite-parity return; branches discovered after that return
    // belong to other walks and must not inherit the terminal truth.
    const buildTerminalScopes = globalComponent => {
      const edgeByKey = new Map();
      for (const edge of edgeRecords) {
        if (!globalComponent.has(edge.left) || !globalComponent.has(edge.right)) continue;
        edgeByKey.set([edge.left, edge.right].sort().join('|'), edge);
      }

      const pathStates = state => {
        const states = [];
        let current = state;
        while (current) {
          states.push(current);
          current = current.parent;
        }
        return states.reverse();
      };

      const scopes = new Map();
      for (const root of globalComponent) {
        const queue = [{ node: root, color: 0, parent: null }];
        const seenStates = new Map([[`${root}:0`, queue[0]]]);
        let scope = null;

        while (queue.length && !scope) {
          const current = queue.shift();
          for (const neighbor of adjacency.get(current.node) || []) {
            if (!globalComponent.has(neighbor)) continue;
            const next = {
              node: neighbor,
              color: 1 - current.color,
              parent: current,
            };
            const nextKey = `${next.node}:${next.color}`;
            const oppositeKey = `${next.node}:${1 - next.color}`;
            const opposite = seenStates.get(oppositeKey);
            if (opposite) {
              const firstPath = pathStates(current);
              const secondPath = pathStates(opposite);
              const terminalPath = [...firstPath, next];
              const returnPath = [...secondPath, next];
              const pathStatesCombined = [...terminalPath, ...returnPath];
              const nodes = new Set(pathStatesCombined.map(item => item.node));
              if (nodes.size < 2) continue;
              const colors = new Map();
              for (const item of pathStatesCombined) {
                const assigned = colors.get(item.node) || new Set();
                assigned.add(item.color);
                colors.set(item.node, assigned);
              }
              const pathEdges = [];
              for (const path of [terminalPath, returnPath]) {
                for (let index = 0; index + 1 < path.length; index++) {
                  const edge = edgeByKey.get(
                    [path[index].node, path[index + 1].node].sort().join('|'),
                  );
                  if (edge) pathEdges.push(edge);
                }
              }
              const uniqueEdges = [...new Map(
                pathEdges.map(edge => [
                  [edge.left, edge.right].sort().join('|'),
                  edge,
                ]),
              ).values()];
              const terminalAtoms = new Set([next.node]);
              const scopeKey = `${next.node}|${[...nodes].sort().join(',')}`;
              scope = {
                nodes,
                colors,
                edges: uniqueEdges,
                terminalAtoms,
              };
              if (!scopes.has(scopeKey)) scopes.set(scopeKey, scope);
              break;
            }
            if (seenStates.has(nextKey)) continue;
            seenStates.set(nextKey, next);
            queue.push(next);
          }
        }
      }
      return scopes.size ? [...scopes.values()] : null;
    };

    for (const start of adjacency.keys()) {
      if (visited.has(start)) continue;
      const globalColors = new Map();
      const queue = [[start, 0]];
      const globalComponent = new Set();

      while (queue.length) {
        const [node, color] = queue.shift();
        const assigned = globalColors.get(node) || new Set();
        if (assigned.has(color)) continue;
        assigned.add(color);
        globalColors.set(node, assigned);
        globalComponent.add(node);
        visited.add(node);
        for (const neighbor of adjacency.get(node) || []) {
          queue.push([neighbor, 1 - color]);
        }
      }

      if (globalComponent.size < 2) continue;
      // Every colouring mode analyzes the complete connected component from
      // the initial node. A terminal return records a truth event, but it
      // never truncates the remaining breadth or discards later branches.
      const analysisScopes = [{
        nodes: globalComponent,
        colors: globalColors,
        edges: edgeRecords.filter(edge =>
          globalComponent.has(edge.left) && globalComponent.has(edge.right)),
        terminalAtoms: new Set(
          [...globalColors]
            .filter(([, colors]) => colors.size > 1)
            .map(([node]) => node),
        ),
      }];

      for (const analysisScope of analysisScopes) {
      const component = analysisScope.nodes;
      const colors = analysisScope.colors;
      const componentNodes = [...component].map(node => ({
        ...nodeInfo.get(node),
        colors: [...(colors.get(node) || [])].sort((a, b) => a - b),
      }));
      const terminalTruthAtoms = options.multiColouring
        ? new Set()
        : new Set(
          componentNodes
            .filter(node => node.colors.length > 1)
            .map(node => atomKey(node.cell, node.digit)),
        );
      // A bivalve cannot have both of its candidate atoms asserted by the
      // same terminal return. That is a contradiction, not two truths. The
      // Multi-colouring walk must reject that component before peer removal.
      const terminalBivalveConflicts = new Set();
      for (const cell of new Set(componentNodes.map(node => node.cell))) {
        if ((cand[cell] || []).length !== 2) continue;
        const cellNodes = componentNodes.filter(node => node.cell === cell);
        const terminalNodes = cellNodes.filter(node =>
          terminalTruthAtoms.has(atomKey(node.cell, node.digit)),
        );
        if (terminalNodes.length > 1) terminalBivalveConflicts.add(cell);
      }
      // Do not discard the whole walk when one bivalve is reached from both
      // parities. That bivalve is ambiguous and cannot assert either digit,
      // but unrelated terminal returns in the same component remain useful.
      const usableTerminalTruthAtoms = new Set(
        [...terminalTruthAtoms].filter(key =>
          !terminalBivalveConflicts.has(Number(key.split(':')[0])),
        ),
      );
      const terminalTruthCells = new Set(
        componentNodes
          .filter(node => usableTerminalTruthAtoms.has(atomKey(node.cell, node.digit)))
          .map(node => node.cell),
      );
      const hasTerminalClosure = usableTerminalTruthAtoms.size > 0;
      const terminalTruth = componentNodes
        .filter(node => usableTerminalTruthAtoms.has(atomKey(node.cell, node.digit)))
        .map(node => ({
          cell: node.cell,
          digit: node.digit,
          observedParities: [...node.colors],
          asserted: true,
        }));
      const componentEdges = analysisScope.edges
        .map(edge => ({
          ...edge,
          left: {
            ...nodeInfo.get(edge.left),
            colors: [...(colors.get(edge.left) || [])].sort((a, b) => a - b),
          },
          right: {
            ...nodeInfo.get(edge.right),
            colors: [...(colors.get(edge.right) || [])].sort((a, b) => a - b),
          },
        }));

      const hasBivalve = componentEdges.some(edge => edge.kind === 'bivalve-transition');
      if (options.requireBivalve && !hasBivalve) continue;

      const invalidColors = new Set();
      const conflicts = [];

      function findAlsDofColourConflicts() {
        const componentCells = new Set(componentNodes.map(node => node.cell));
        const seenAlsDofConflicts = new Set();

        // A colour can also contradict an ALS-DOF set without making two
        // candidates in one cell or sector share a colour. Keep this local
        // to the component's sectors so the colouring search does not build
        // the entire grid-wide ALS catalogue again.
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const unit = core.UNITS[sector];
          if (!unit.some(cell => componentCells.has(cell))) continue;
          const activeCells = unit.filter(cell => (cand[cell] || []).length >= 2);

          for (let size = 1; size <= Math.min(9, activeCells.length); size++) {
            for (const cells of combinations(activeCells, size)) {
              if (cells.some(cell => componentCells.has(cell))) continue;

              // The ALS-DOF reduction must be external to the coloured
              // component. Sharing even one cell lets the colour assignment
              // reduce its own chain and creates a false contradiction.

              const digits = [...new Set(cells.flatMap(cell => cand[cell] || []))]
                .sort((left, right) => left - right);
              if (digits.length <= size) continue;

              // Match the ALS builder's legality guard: a proper locked
              // subset means this is not one ALS-DOF set for this check.
              let hasLockedSubset = false;
              for (let subsetSize = 1; subsetSize < cells.length && !hasLockedSubset; subsetSize++) {
                for (const subset of combinations(cells, subsetSize)) {
                  const subsetDigits = new Set(subset.flatMap(cell => cand[cell] || []));
                  if (subsetDigits.size === subsetSize) {
                    hasLockedSubset = true;
                    break;
                  }
                }
              }
              if (hasLockedSubset) continue;

              for (const color of [0, 1]) {
                const colouredDigits = new Set(
                  digits.filter(digit => {
                    const alsDigitCells = cells.filter(cell =>
                      (cand[cell] || []).includes(digit),
                    );
                    return alsDigitCells.length > 0 && alsDigitCells.every(cell =>
                      componentNodes.some(node =>
                        node.digit === digit
                        && node.colors.includes(color)
                        && core.peersOf(cell).includes(node.cell)
                      ),
                    );
                  }),
                );
                if (!colouredDigits.size) continue;

                const remainingDigits = digits.filter(digit => !colouredDigits.has(digit));
                if (remainingDigits.length >= size) continue;

                const conflictKey = `${sector}|${cells.join(',')}|${color}`;
                if (seenAlsDofConflicts.has(conflictKey)) continue;
                seenAlsDofConflicts.add(conflictKey);
                invalidColors.add(color);
                conflicts.push({
                  kind: 'als-dof-colour',
                  sector,
                  cells: [...cells],
                  cellCount: size,
                  digits,
                  dof: digits.length - size,
                  color,
                  colouredDigits: [...colouredDigits].sort((left, right) => left - right),
                  remainingDigits,
                  reason: 'colour-reduces-als-to-fewer-than-cell-count-digits',
                });
              }
            }
          }
        }
      }

      function findAhsDofColourConflicts() {
        const componentCells = new Set(componentNodes.map(node => node.cell));
        const seenAhsDofConflicts = new Set();

        // An AHS contains N selected digits in N + DOF cells. A same-parity
        // candidate in one of those cells is an asserted occupant only when
        // its digit is outside the AHS digit set. Each such occupied cell
        // removes one place from the AHS; removing DOF + 1 distinct cells
        // leaves fewer than N cells for N digits and disproves that parity.
        for (const ahs of getAhsDofCatalogue()) {
          if (!ahs.ahsAllCells.some(cell => componentCells.has(cell))) continue;

          const ahsCellSet = new Set(ahs.ahsAllCells);
          const ahsDigitSet = new Set(ahs.ahsDigits);
          for (const color of [0, 1]) {
            if (invalidColors.has(color)) continue;

            const removedByColour = new Map();
            for (const node of componentNodes) {
              if (!node.colors.includes(color)) continue;
              if (!ahsCellSet.has(node.cell) || ahsDigitSet.has(node.digit)) continue;
              removedByColour.set(node.cell, new Set([
                ...(removedByColour.get(node.cell) || []),
                node.digit,
              ]));
            }
            if (removedByColour.size <= ahs.ahsDOF) continue;

            const conflictKey = `${ahs.uniqueID}|${color}`;
            if (seenAhsDofConflicts.has(conflictKey)) continue;
            seenAhsDofConflicts.add(conflictKey);
            invalidColors.add(color);
            conflicts.push({
              kind: 'ahs-dof-colour',
              ahsSector: ahs.ahsSector,
              ahsCells: [...ahs.ahsAllCells],
              ahsDigits: [...ahs.ahsDigits],
              ahsDOF: ahs.ahsDOF,
              color,
              removedCells: [...removedByColour.keys()].sort((left, right) => left - right),
              removedDigits: [...new Set(
                [...removedByColour.values()].flatMap(digits => [...digits]),
              )].sort((left, right) => left - right),
              remainingCells: ahs.ahsAllCells.length - removedByColour.size,
              reason: 'colour-reduces-ahs-to-fewer-than-digit-count-cells',
            });
          }
        }
      }

      // Terminal truth and colour contradictions are independent events. A
      // terminal return owns its direct truth, but it must not suppress a
      // valid parity contradiction elsewhere in the same walk. That second
      // event is what can reduce a bivalve to one digit and trigger its peer
      // eliminations.
      if (!options.multiColouring) {
      for (let sector = 0; sector < core.UNITS.length; sector++) {
          const sectorNodes = componentNodes.filter(node => core.UNITS[sector].includes(node.cell));
          for (let digit = 1; digit <= 9; digit++) {
            for (const color of [0, 1]) {
              const sameColor = sectorNodes.filter(node =>
                node.digit === digit && node.colors.includes(color));
              if (sameColor.length < 2) continue;
              invalidColors.add(color);
              conflicts.push({ kind: 'sector', sector, digit, color });
            }
          }
        }

        for (const cell of new Set(componentNodes.map(node => node.cell))) {
          for (const color of [0, 1]) {
            const sameColorDigits = new Set(componentNodes
              .filter(node => node.cell === cell && node.colors.includes(color))
              .map(node => node.digit));
            if (sameColorDigits.size < 2) continue;
            invalidColors.add(color);
            conflicts.push({ kind: 'cell', cell, color, digits: [...sameColorDigits].sort((a, b) => a - b) });
          }
        }

        // If the union of peers of one parity covers every viable placement
        // of a digit in a sector, that parity would empty the sector for the
        // digit and is therefore impossible. The coverage is collective:
        // each candidate cell may be covered by a different coloured node.
        const seenSectorPeerUnions = new Set();
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const unit = core.UNITS[sector];
          for (let digit = 1; digit <= 9; digit++) {
            const viableCells = unit.filter(cell => (cand[cell] || []).includes(digit));
            if (!viableCells.length) continue;
            for (const color of [0, 1]) {
              const colouredNodes = componentNodes.filter(node =>
                node.digit === digit && node.colors.includes(color),
              );
              if (!colouredNodes.length) continue;
              if (colouredNodes.some(node => unit.includes(node.cell))) continue;
              const uncoveredCells = viableCells.filter(cell =>
                !colouredNodes.some(node => core.peersOf(node.cell).includes(cell)),
              );
              if (uncoveredCells.length) continue;

              const conflictKey = `${sector}|${digit}|${color}`;
              if (seenSectorPeerUnions.has(conflictKey)) continue;
              seenSectorPeerUnions.add(conflictKey);
              invalidColors.add(color);
              conflicts.push({
                kind: 'sector-peer-union',
                sector,
                digit,
                color,
                viableCells: [...viableCells],
                colouredNodes: colouredNodes.map(node => ({ ...node })),
              });
            }
          }
        }

        // Same-coloured atoms that see each other make that colour
        // impossible. Opposite colours are compatible.
        for (const left of componentNodes) {
          for (const right of componentNodes) {
            if (left.cell > right.cell || (left.cell === right.cell && left.digit >= right.digit)) continue;
            if (left.digit !== right.digit) continue;
            if (!core.peersOf(left.cell).includes(right.cell)) continue;
            for (const color of left.colors.filter(item => right.colors.includes(item))) {
              invalidColors.add(color);
              conflicts.push({ kind: 'peer', color, left, right });
            }
          }
        }

        if (!options.multiColouring) {
          findAlsDofColourConflicts();
          findAhsDofColourConflicts();
        }

        // A coloured candidate that sees both valid parities of its digit
        // contradicts its own assigned parity. Mark that colour false for
        // the whole component to a fixed point.
        let parityChanged = true;
        while (parityChanged) {
          parityChanged = false;
          for (const node of componentNodes) {
            const activeColors = new Set(node.colors.filter(color => !invalidColors.has(color)));
            if (!activeColors.size) continue;
            const digitNodes = componentNodes.filter(item => item.digit === node.digit);
            const blueNodes = digitNodes.filter(item => item.colors.includes(0) && !invalidColors.has(0));
            const purpleNodes = digitNodes.filter(item => item.colors.includes(1) && !invalidColors.has(1));
            const seesBlue = blueNodes.some(item => core.peersOf(item.cell).includes(node.cell));
            const seesPurple = purpleNodes.some(item => core.peersOf(item.cell).includes(node.cell));
            if (!seesBlue || !seesPurple) continue;
            for (const color of activeColors) {
              if (invalidColors.has(color)) continue;
              invalidColors.add(color);
              conflicts.push({ kind: 'coloured-cell-sees-both', cell: node.cell, digit: node.digit, color });
              parityChanged = true;
            }
          }
      }
      }

      // A colour conflict removes that parity from the whole component. A
      // surviving colour is asserted true across the component; an atom with
      // both valid colours is true independently of a colour conflict.
      const effectiveColors = new Map(componentNodes.map(node => [
        atomKey(node.cell, node.digit),
        new Set(node.colors.filter(color => !invalidColors.has(color))),
      ]));
      if (invalidColors.size === 2 && !hasTerminalClosure) continue;

      // A bivalve whose colour graph removes one side is now a solved
      // candidate, not merely a coloured node. Preserve that truth event so
      // its digit is removed from every peer as ordinary Sudoku logic.
      const bivalveTruthAtoms = new Set();
      const bivalveTruthCells = new Set();
      for (const cell of new Set(componentNodes.map(node => node.cell))) {
        if ((cand[cell] || []).length !== 2) continue;
        const cellNodes = componentNodes.filter(node => node.cell === cell);
        if (cellNodes.length !== 2) continue;
        const terminal = cellNodes.filter(node =>
          usableTerminalTruthAtoms.has(atomKey(node.cell, node.digit)),
        );
        if (terminal.length === 1) {
          bivalveTruthAtoms.add(atomKey(terminal[0].cell, terminal[0].digit));
          bivalveTruthCells.add(cell);
          continue;
        }
        const active = cellNodes.filter(node =>
          (effectiveColors.get(atomKey(node.cell, node.digit)) || new Set()).size,
        );
        const removed = cellNodes.filter(node =>
          !(effectiveColors.get(atomKey(node.cell, node.digit)) || new Set()).size,
        );
        if (active.length !== 1 || removed.length !== 1) continue;
        bivalveTruthAtoms.add(atomKey(active[0].cell, active[0].digit));
        bivalveTruthCells.add(cell);
      }

      const trueAtoms = new Set([...usableTerminalTruthAtoms, ...bivalveTruthAtoms]);
      const eliminations = new Set();
      const forcedTruthEliminations = new Set();
      // If one colour has been disproved, every atom carrying the surviving
      // colour is true, not merely atoms that visibly carry both colours.
      const assertedColors = invalidColors.size === 1
        ? new Set([invalidColors.has(0) ? 1 : 0])
        : new Set();
      for (const node of componentNodes) {
        const nodeColors = effectiveColors.get(atomKey(node.cell, node.digit)) || new Set();
        if (nodeColors.size > 1 || [...nodeColors].some(color => assertedColors.has(color))) {
          trueAtoms.add(atomKey(node.cell, node.digit));
        }
        if (!nodeColors.size && invalidColors.size < 2) {
          eliminations.add(atomKey(node.cell, node.digit));
        }
      }

      // A candidate present in both colours is true; its peers cannot hold it.
      for (const key of trueAtoms) {
        const node = nodeInfo.get(key);
        // The dual-coloured candidate is also a solved value for its cell:
        // remove every other candidate from that cell.
        for (const digit of cand[node.cell] || []) {
          if (digit !== node.digit) {
            const removal = atomKey(node.cell, digit);
            eliminations.add(removal);
            if (usableTerminalTruthAtoms.has(key) || bivalveTruthAtoms.has(key)) {
              forcedTruthEliminations.add(removal);
            }
          }
        }
        for (const peer of core.peersOf(node.cell)) {
          if ((cand[peer] || []).includes(node.digit)) {
            const removal = atomKey(peer, node.digit);
            eliminations.add(removal);
            if (usableTerminalTruthAtoms.has(key) || bivalveTruthAtoms.has(key)) {
              forcedTruthEliminations.add(removal);
            }
          }
        }
      }

      // A terminal truth can remove one side of a directly attached bivalve
      // through its peer relationship. Keep this propagation local: a
      // terminal is not a ring, so do not scan every bivalve in the connected
      // graph and turn unrelated forward branches on.
      const bivalveCells = new Set(
        componentEdges
          .filter(edge => edge.kind === 'bivalve-transition')
          .flatMap(edge => [edge.left.cell, edge.right.cell]),
      );
      const pendingBivalveCells = new Set();
      for (const key of forcedTruthEliminations) {
        const cell = Number(key.split(':')[0]);
        if (bivalveCells.has(cell)) pendingBivalveCells.add(cell);
      }
      while (pendingBivalveCells.size) {
        const cell = pendingBivalveCells.values().next().value;
        pendingBivalveCells.delete(cell);
        const digits = cand[cell] || [];
        if (digits.length !== 2) continue;
        const remaining = digits.filter(digit =>
          !eliminations.has(atomKey(cell, digit)),
        );
        if (remaining.length !== 1) continue;
        const key = atomKey(cell, remaining[0]);
        if (bivalveTruthAtoms.has(key)) continue;

        bivalveTruthAtoms.add(key);
        bivalveTruthCells.add(cell);
        trueAtoms.add(key);
        for (const digit of digits) {
          if (digit !== remaining[0]) {
            const removal = atomKey(cell, digit);
            eliminations.add(removal);
            forcedTruthEliminations.add(removal);
          }
        }
        for (const peer of core.peersOf(cell)) {
          if (!(cand[peer] || []).includes(remaining[0])) continue;
          const removal = atomKey(peer, remaining[0]);
          const wasNew = !eliminations.has(removal);
          eliminations.add(removal);
          forcedTruthEliminations.add(removal);
          if (wasNew && bivalveCells.has(peer)) pendingBivalveCells.add(peer);
        }
      }

      let multiOppositeParityPeerTrigger = false;

      // An uncoloured candidate that sees both parities of the same digit
      // cannot be true, because either parity would conflict with it. This
      // trigger is additive: a terminal, bivalve, or other colouring trigger
      // must not suppress it.
      for (let digit = 1; digit <= 9; digit++) {
        const digitNodes = componentNodes
          .filter(node => node.digit === digit)
          .map(node => ({ ...node, colors: [...(effectiveColors.get(atomKey(node.cell, node.digit)) || [])] }))
          .filter(node => node.colors.length);
        const blueNodes = digitNodes.filter(node => node.colors.includes(0));
        const purpleNodes = digitNodes.filter(node => node.colors.includes(1));
        if (!blueNodes.length || !purpleNodes.length) continue;
        for (let cell = 0; cell < 81; cell++) {
          if (component.has(atomKey(cell, digit)) || !(cand[cell] || []).includes(digit)) continue;
          const seesBlue = blueNodes.some(node => core.peersOf(node.cell).includes(cell));
          const seesPurple = purpleNodes.some(node => core.peersOf(node.cell).includes(cell));
          if (seesBlue && seesPurple) {
            eliminations.add(atomKey(cell, digit));
            multiOppositeParityPeerTrigger = true;
          }
        }
      }

      let oppositeParityPeerTrigger = false;
      if (!options.multiColouring) {
        // In a coloured cell, an uncoloured candidate is false when a peer
        // carries the same digit in the parity opposite the coloured clue.
        // This is the 3D-Medusa cell-to-peer trigger, and is independent of
        // the other colouring eliminations already collected above.
        for (const cell of new Set(componentNodes.map(node => node.cell))) {
          const cellNodes = componentNodes.filter(node => node.cell === cell);
          const colouredNodes = cellNodes.filter(node =>
            (effectiveColors.get(atomKey(node.cell, node.digit)) || new Set()).size === 1,
          );
          if (!colouredNodes.length) continue;
          for (const value of cand[cell] || []) {
            const valueKey = atomKey(cell, value);
            if (component.has(valueKey)
              && (effectiveColors.get(valueKey) || new Set()).size) continue;
            const valuePeers = componentNodes.filter(node =>
              node.digit === value
              && core.peersOf(cell).includes(node.cell),
            );
            if (!valuePeers.length) continue;
            const eliminated = colouredNodes.some(colouredNode => {
              const colouredParity = [...(
                effectiveColors.get(atomKey(colouredNode.cell, colouredNode.digit))
                || new Set()
              )][0];
              return valuePeers.some(peer => {
                const peerColors = effectiveColors.get(atomKey(peer.cell, peer.digit)) || new Set();
                return peerColors.has(1 - colouredParity);
              });
            });
            if (eliminated) {
              eliminations.add(valueKey);
              oppositeParityPeerTrigger = true;
            }
          }
        }
      }

      if (!options.multiColouring && !hasTerminalClosure) {
        // Different coloured digits in one cell form a two-choice cell.
        for (const cell of new Set(componentNodes.map(node => node.cell))) {
          const cellDigits = componentNodes
            .filter(node => (effectiveColors.get(atomKey(node.cell, node.digit)) || new Set()).size)
            .map(node => node.digit);
          const keep = new Set(cellDigits);
          const hasBlue = componentNodes.some(node => node.cell === cell
            && effectiveColors.get(atomKey(node.cell, node.digit))?.has(0));
          const hasPurple = componentNodes.some(node => node.cell === cell
            && effectiveColors.get(atomKey(node.cell, node.digit))?.has(1));
          if (hasBlue && hasPurple && new Set(cellDigits).size > 1) {
            for (const digit of cand[cell] || []) {
              if (!keep.has(digit)) eliminations.add(atomKey(cell, digit));
            }
          }
        }
      }

      if (options.multiColouring) {
        // The parity map is an inspection view. The authoritative Multi-
        // colouring test is a graph walk over the actual inference rules:
        // same-digit and bivalve edges are XOR, while a weak peer edge is
        // NAND and therefore propagates only from a true candidate. A weak
        // edge must never manufacture a terminal truth merely because an
        // undirected parity walk found an odd return.
        const localEdges = analysisScope.edges || [];
        const localNodes = componentNodes.map(node => ({
          ...node,
          key: atomKey(node.cell, node.digit),
        }));
        const localNodeByKey = new Map(localNodes.map(node => [node.key, node]));
        const localNodeKeys = new Set(localNodeByKey.keys());
        const sameCandidate = (left, right) => {
          if (left.cell === right.cell) return left.digit !== right.digit;
          return left.digit === right.digit && core.peersOf(left.cell).includes(right.cell);
        };
        const propagateAssumption = (rootKey, rootTruth) => {
          const states = new Map();
          const queue = [];
          let contradiction = false;
          const assign = (key, truth) => {
            if (!localNodeKeys.has(key)) return;
            const assigned = states.get(key) || new Set();
            if (assigned.has(!truth)) {
              contradiction = true;
              return;
            }
            if (assigned.has(truth)) return;
            assigned.add(truth);
            states.set(key, assigned);
            queue.push([key, truth]);
          };
          assign(rootKey, rootTruth);

          while (queue.length && !contradiction) {
            const [key, truth] = queue.shift();
            const node = localNodeByKey.get(key);
            if (!node) continue;

            if (truth) {
              for (const other of localNodes) {
                if (other.key !== key && sameCandidate(node, other)) {
                  assign(other.key, false);
                }
              }
            }

            for (const edge of localEdges) {
              let next = null;
              if (edge.left === key) next = edge.right;
              else if (edge.right === key) next = edge.left;
              if (!next) continue;
              if (edge.kind === 'weak-inference') {
                if (truth) assign(next, false);
              } else {
                assign(next, !truth);
              }
            }

            // A bivalve is the only cell-level closure used here: once one
            // of its two candidates is false, the other is true. Do this
            // only when both candidate atoms are in this scoped walk.
            if (!truth && (cand[node.cell] || []).length === 2) {
              const cellNodes = localNodes.filter(item => item.cell === node.cell);
              const remaining = cellNodes.filter(item => {
                const itemStates = states.get(item.key) || new Set();
                return !itemStates.has(false);
              });
              if (remaining.length === 1) assign(remaining[0].key, true);
            }
          }
          return { contradiction, states };
        };

        for (const node of localNodes) {
          const trueBranch = propagateAssumption(node.key, true);
          const falseBranch = propagateAssumption(node.key, false);
          if (trueBranch.contradiction && !falseBranch.contradiction) {
            eliminations.add(node.key);
            forcedTruthEliminations.add(node.key);
          }
          if (falseBranch.contradiction && !trueBranch.contradiction) {
            trueAtoms.add(node.key);
            if ((cand[node.cell] || []).length === 2) {
              bivalveTruthAtoms.add(node.key);
              bivalveTruthCells.add(node.cell);
            }
            for (const value of cand[node.cell] || []) {
              if (value === node.digit) continue;
              const removal = atomKey(node.cell, value);
              eliminations.add(removal);
              forcedTruthEliminations.add(removal);
            }
            for (const peer of core.peersOf(node.cell)) {
              if (!(cand[peer] || []).includes(node.digit)) continue;
              const removal = atomKey(peer, node.digit);
              eliminations.add(removal);
              forcedTruthEliminations.add(removal);
            }
          }
        }
      }

      if (options.multiColouring && eliminations.size) {
        // The display graph may colour a weak breadth for inspection, but a
        // weak inference is NAND, not an unconditional XOR. Re-check every
        // proposed removal by propagating both possible root parities through
        // the native graph. Strong/bivalve edges always flip; weak edges only
        // propagate when their source is true.
        const originalEdges = edgeRecords.filter(edge =>
          component.has(edge.left) && component.has(edge.right));
        const componentNodesByKey = new Map(componentNodes.map(node => [
          atomKey(node.cell, node.digit), node,
        ]));
        const componentKeys = [...component];
        const candidateSees = (left, right) => {
          if (left.cell === right.cell) return left.digit !== right.digit;
          return left.digit === right.digit && core.peersOf(left.cell).includes(right.cell);
        };
        const implicationBranchIsConsistent = (targetCell, targetDigit, rootTruth) => {
          const states = new Map();
          const queue = [];
          let contradiction = false;
          const assign = (key, truth) => {
            const assigned = states.get(key) || new Set();
            if (assigned.has(!truth)) {
              contradiction = true;
              return;
            }
            if (assigned.has(truth)) return;
            assigned.add(truth);
            states.set(key, assigned);
            queue.push([key, truth]);
          };
          const targetKey = atomKey(targetCell, targetDigit);
          assign(componentKeys[0], rootTruth);
          assign(targetKey, true);
          while (queue.length && !contradiction) {
            const [key, truth] = queue.shift();
            const node = nodeInfo.get(key) || componentNodesByKey.get(key);
            if (!node) continue;
            if (truth) {
              for (const other of componentNodes) {
                const otherKey = atomKey(other.cell, other.digit);
                if (otherKey !== key && candidateSees(node, other)) {
                  assign(otherKey, false);
                }
              }
            }
            for (const edge of originalEdges) {
              let next = null;
              if (edge.left === key) next = edge.right;
              else if (edge.right === key) next = edge.left;
              if (!next) continue;
              if (edge.kind === 'weak-inference' && !truth) continue;
              assign(next, edge.kind === 'weak-inference' ? false : !truth);
            }
          }
          return !contradiction;
        };
        for (const key of [...eliminations]) {
          const [cell, digit] = key.split(':').map(Number);
          const possible = [false, true].some(rootTruth =>
            implicationBranchIsConsistent(cell, digit, rootTruth));
          if (possible) eliminations.delete(key);
        }
      }

      if (!eliminations.size) continue;

      // Painting uses the full breadth of the selected walk. A type-0 link
      // that enters the same physical cell on another digit is an overlap
      // continuation: carry the colour into that shared endpoint, then flip
      // across the new type-0 link. Keep these display extensions separate
      // from the logical elimination component so a weak multi-candidate
      // overlap cannot manufacture extra eliminations.
      const renderInfo = new Map(componentNodes.map(node => [
        atomKey(node.cell, node.digit), { cell: node.cell, digit: node.digit },
      ]));
      const renderColors = new Map(componentNodes.map(node => [
        atomKey(node.cell, node.digit), new Set(node.colors),
      ]));
      const renderEdges = componentEdges.map(edge => ({
        ...edge,
        left: { ...edge.left, colors: [...(edge.left.colors || [])] },
        right: { ...edge.right, colors: [...(edge.right.colors || [])] },
      }));
      const renderEdgeKeys = new Set(renderEdges.map(edge =>
        [atomKey(edge.left.cell, edge.left.digit), atomKey(edge.right.cell, edge.right.digit)]
          .sort().join('|'),
      ));
      const renderQueue = [...renderInfo.keys()];
      const queuedLinks = new Set();
      const addRenderNode = (cell, digit, colors) => {
        const key = atomKey(cell, digit);
        if (!(cand[cell] || []).includes(digit)) return null;
        if (!renderInfo.has(key)) {
          renderInfo.set(key, { cell, digit });
          renderQueue.push(key);
        }
        const existing = renderColors.get(key) || new Set();
        for (const color of colors || []) existing.add(color);
        renderColors.set(key, existing);
        return key;
      };
      const addRenderEdge = (leftKey, rightKey, kind, extra = {}) => {
        if (!leftKey || !rightKey || leftKey === rightKey) return;
        const edgeKey = [leftKey, rightKey].sort().join('|');
        if (renderEdgeKeys.has(edgeKey)) return;
        renderEdgeKeys.add(edgeKey);
        renderEdges.push({
          kind,
          ...extra,
          left: { ...renderInfo.get(leftKey), colors: [...(renderColors.get(leftKey) || [])] },
          right: { ...renderInfo.get(rightKey), colors: [...(renderColors.get(rightKey) || [])] },
        });
      };

      while (renderQueue.length) {
        const currentKey = renderQueue.shift();
        const current = renderInfo.get(currentKey);
        if (!current) continue;
        const currentColors = renderColors.get(currentKey) || new Set();

        for (const link of type0Links) {
          const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
          if (digit === current.digit) continue;
          const cells = [link.activeCells?.[0], link.linkedCells?.[0]];
          if (!cells.includes(current.cell)) continue;
          const overlapKey = addRenderNode(current.cell, digit, currentColors);
          if (!overlapKey) continue;
          addRenderEdge(currentKey, overlapKey, 'overlap-extension', {
            cell: current.cell,
            fromDigit: current.digit,
            toDigit: digit,
          });

          const linkKey = `${link.id}|${overlapKey}`;
          if (queuedLinks.has(linkKey)) continue;
          queuedLinks.add(linkKey);
          const otherCell = cells.find(cell => cell !== current.cell);
          const otherKey = addRenderNode(otherCell, digit,
            [...currentColors].map(color => 1 - color));
          addRenderEdge(overlapKey, otherKey, 'same-digit', { linkId: link.id });
        }

        for (const link of type4Links) {
          const cell = link.activeCells?.[0] ?? link.linkedCells?.[0];
          const leftDigit = Number(link.startingDigits?.[0]);
          const rightDigit = Number(link.linkDigits?.[0]);
          if (cell !== current.cell || ![leftDigit, rightDigit].includes(current.digit)) continue;
          if ((cand[cell] || []).length !== 2) continue;
          const otherDigit = current.digit === leftDigit ? rightDigit : leftDigit;
          const otherKey = addRenderNode(cell, otherDigit,
            [...currentColors].map(color => 1 - color));
          addRenderEdge(currentKey, otherKey, 'bivalve-transition', {
            cell,
            fromDigit: current.digit,
            toDigit: otherDigit,
            linkId: link.id,
          });
        }
      }

      const renderNodes = [...renderInfo].map(([key, node]) => ({
        ...node,
        colors: [...(renderColors.get(key) || [])].sort((a, b) => a - b),
      }));
      const digitColours = [];
      for (let digit = 1; digit <= 9; digit++) {
        const digitNodes = renderNodes.filter(node => node.digit === digit);
        if (!digitNodes.length) continue;
        digitColours.push({
          digit,
          blue: digitNodes.filter(node => node.colors.includes(0)).map(node => node.cell),
          purple: digitNodes.filter(node => node.colors.includes(1)).map(node => node.cell),
        });
      }
      const multiColouring = Boolean(options.multiColouring);
      const visualPalette = [
        ['purple', 'blue'],
        ['yellow', 'green'],
        ['cyan', 'aqua'],
        ['orange', 'red'],
        ['pink', 'magenta'],
        ['teal', 'lime'],
        ['gold', 'brown'],
        ['indigo', 'coral'],
        ['slate', 'rose'],
      ];
      const visualLinkRecords = renderEdges
        .filter(edge => edge.kind === 'same-digit'
          || edge.kind === 'bivalve-transition'
          || edge.kind === 'overlap-extension')
        .map((edge, index) => {
          const pairColours = visualPalette[index % visualPalette.length];
          const cells = [edge.left.cell, edge.right.cell];
          const digits = [...new Set([edge.left.digit, edge.right.digit])];
          return {
            id: edge.linkId || `medusa-edge-${index}`,
            label: String.fromCharCode(65 + (index % 26)),
            cells,
            digits,
            colors: [0, 1],
            pairColours,
            endpoints: [edge.left, edge.right].map(node => ({
              cell: node.cell,
              digit: node.digit,
              colors: [...(node.colors || [])].sort((a, b) => a - b),
              colourTokens: (node.colors || []).map(color => pairColours[color]),
            })),
          };
        });
      const visualLinkByAtom = new Map();
      for (const link of visualLinkRecords) {
        for (const endpoint of link.endpoints) {
          const key = atomKey(endpoint.cell, endpoint.digit);
          if (!visualLinkByAtom.has(key)) visualLinkByAtom.set(key, link);
        }
      }
      const visualCellColours = renderNodes.map((node, index) => {
        const atom = atomKey(node.cell, node.digit);
        const links = visualLinkRecords.filter(link =>
          link.endpoints.some(endpoint => atomKey(endpoint.cell, endpoint.digit) === atom),
        );
        const link = links[0] || visualLinkByAtom.get(atom);
        const tokens = new Set();
        for (const visualLink of links) {
          for (const endpoint of visualLink.endpoints) {
            if (atomKey(endpoint.cell, endpoint.digit) !== atom) continue;
            for (const token of endpoint.colourTokens || []) tokens.add(token);
          }
        }
        const pairColours = link?.pairColours || visualPalette[index % visualPalette.length];
        if (!tokens.size) {
          for (const color of node.colors) tokens.add(pairColours[color]);
        }
        return {
          cell: node.cell,
          digit: node.digit,
          linkId: link?.id || `medusa-node-${node.cell}-${node.digit}`,
          colors: [...node.colors],
          innerColor: node.colors[0] ?? 0,
          colourTokens: [...tokens],
        };
      });
      reports.push({
        family: multiColouring ? '3D-Medusa {Multi-colouring}' : '3D-Medusa - Simple',
        tech: multiColouring ? '3d-medusa-multi-colouring' : '3d-medusa-simple',
        source: multiColouring ? 'multi' : 'bivalve',
        digit: multiColouring ? null : undefined,
        digits: multiColouring
          ? [...new Set(renderNodes.map(node => node.digit))].sort((a, b) => a - b)
          : undefined,
        linkColours: multiColouring ? visualLinkRecords : undefined,
        cellColours: multiColouring ? visualCellColours : undefined,
        overlapCells: multiColouring ? [...overlapAtoms]
          .map(key => Number(key.split(':')[0]))
          .sort((a, b) => a - b) : undefined,
        nodes: renderNodes,
        trueAtoms: [...trueAtoms],
        invalidColors: [...invalidColors].sort((a, b) => a - b),
        invalidColourAtoms: componentNodes
          .filter(node => node.colors.some(color => invalidColors.has(color)))
          .map(node => atomKey(node.cell, node.digit)),
        conflicts,
        cellParityConflicts: conflicts.filter(conflict => conflict.kind === 'cell'),
        alsDofConflicts: conflicts.filter(conflict => conflict.kind === 'als-dof-colour'),
        ahsDofConflicts: conflicts.filter(conflict => conflict.kind === 'ahs-dof-colour'),
        edges: renderEdges,
        digitColours,
        links: renderEdges.length,
        terminalClosure: hasTerminalClosure
          ? { kind: 'same-cell', cells: [...terminalTruthCells].sort((a, b) => a - b) }
          : null,
        terminalTruth,
        bivalveTruth: [...bivalveTruthCells]
          .sort((left, right) => left - right)
          .map(cell => {
            const key = [...bivalveTruthAtoms]
              .find(item => Number(item.split(':')[0]) === cell);
            return {
              cell,
              digit: key ? Number(key.split(':')[1]) : null,
              asserted: true,
            };
          }),
        rules: [
          ...(hasTerminalClosure ? ['terminal-closure-truth'] : []),
          ...(bivalveTruthAtoms.size ? ['bivalve-singleton-truth'] : []),
          ...(renderEdges.some(edge => edge.kind === 'overlap-extension')
            ? ['overlap-parity-propagation'] : []),
          ...(multiColouring && renderEdges.some(edge => edge.kind === 'weak-inference')
            ? ['weak-inference-colour-walk'] : []),
          ...(oppositeParityPeerTrigger || multiOppositeParityPeerTrigger
            ? ['opposite-parity-peer']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'sector')
            ? ['sector-same-parity']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'peer')
            ? ['same-parity-peer-contradiction']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'coloured-cell-sees-both')
            ? ['both-parities-peer']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'sector-peer-union')
            ? ['sector-peer-union-contradiction']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'cell')
            ? ['cell-same-parity-contradiction']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'als-dof-colour')
            ? ['als-dof-colour-contradiction']
            : []),
          ...(conflicts.some(conflict => conflict.kind === 'ahs-dof-colour')
            ? ['ahs-dof-colour-contradiction']
            : []),
        ],
        eliminations: [...eliminations]
          .map(key => nodeInfo.get(key) || {
            cell: Number(key.split(':')[0]),
            digit: Number(key.split(':')[1]),
          })
          .sort((left, right) => left.cell - right.cell || left.digit - right.digit),
      });
      }
    }

    return reports;
  }


  // This is a separate colouring graph. It is intentionally independent of
  // the AIC chain search: type-0 links supply the same-digit weak-inference
  // layer, type-4 bivalves supply digit transitions, and shared atoms are
  // canonical junctions that preserve parity while a branch continues.
  function buildThreeDMedusaMultiColoring(cand, strongLinkSet = null) {
    const linkset = strongLinkSet || buildStrongLinks(cand);
    return buildThreeDMedusa(cand, linkset, {
      includeWeakPeers: true,
      requireBivalve: true,
      multiColouring: true,
    });
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
  core.buildSimpleColoring = buildSimpleColoring;
  core.buildMultiColoring = buildMultiColoringFullBreadth;
  core.buildThreeDMedusa = buildThreeDMedusa;
  core.buildThreeDMedusaMultiColoring = buildThreeDMedusaMultiColoring;
})(globalThis);
