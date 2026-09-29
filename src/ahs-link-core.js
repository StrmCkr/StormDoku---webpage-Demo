(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before ahs-link-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before ahs-link-core.js');
  if (!core.ahsConstructor) throw new Error('ahs-core.js must load before ahs-link-core.js');

  const { combinations, intersection, sortedUnique } = core.setTools;
  const AHS_RCC = 6;
  const AHS_LINK_TYPE_NAMES = [
    'BILOCAL',
    'CELL_TO_GROUP',
    'GROUP_TO_GROUP',
    'ERI',
    'ALS',
    'ALS_RCC',
    'AHS_RCC',
  ];
  let nextAhsLinkId = 0;

  function commonSectors(cells) {
    if (!cells.length) return [];
    return core.UNITS
      .map((unit, sector) => cells.every(cell => unit.includes(cell)) ? sector : -1)
      .filter(sector => sector >= 0);
  }

  function endpointSectors(ahs, cells, triggerSectors = []) {
    return sortedUnique([ahs.ahsSector, ...triggerSectors, ...commonSectors(cells)]);
  }

  function cellsSeeEachOther(left, right) {
    return !!left.length
      && !!right.length
      && left.every(a => right.every(b => a === b || core.peersOf(a).includes(b)));
  }

  function disjoint(left, right) {
    const seen = new Set(left);
    return right.every(cell => !seen.has(cell));
  }

  function outsideDigitsByCell(ahs) {
    const out = new Map();
    for (const rcc of ahs.rccList) {
      const digits = sortedUnique(rcc.rccDigits).filter(digit => !ahs.ahsDigits.includes(digit));
      if (digits.length) out.set(rcc.rccCell, digits);
    }
    return out;
  }

  // RCC cells are the neutral bridge between the two AHS sides.  They may
  // participate in the bridge, but they cannot be used as a witness or be
  // reported as an elimination for the RCC digit itself.
  function isAhsRccCandidate(ahs, cell, digit) {
    return (ahs.rccList || []).some(rcc =>
      rcc.rccCell === cell && (rcc.rccDigits || []).includes(digit));
  }

  function hiddenCellsAfterRemoving(cand, ahs, removedCells) {
    const removed = new Set(removedCells);
    const remaining = ahs.ahsAllCells.filter(cell => !removed.has(cell));
    if (remaining.length !== ahs.ahsDigits.length) return null;

    for (const digit of ahs.ahsDigits) {
      if (!remaining.some(cell => (cand[cell] || []).includes(digit))) return null;
    }

    return remaining;
  }

  function buildEndpoint(
    cand,
    ahs,
    triggerCells,
    removedCells,
    digits,
    digitCells,
    triggerKind,
    triggerLinkId,
    triggerSectors,
    effectiveDof,
    hiddenDigit,
    hiddenCell,
  ) {
    const remaining = ahs.ahsAllCells.filter(cell => !removedCells.includes(cell));
    if (!hiddenDigit || hiddenCell == null || !remaining.includes(hiddenCell)) return null;
    const endpointDigits = sortedUnique(digits);
    if (!endpointDigits.length) return null;

    const hiddenDigitCells = {};
    const rccDigitsByCell = {};
    hiddenDigitCells[hiddenDigit] = [hiddenCell];
    for (const cell of triggerCells) {
      const outsideDigits = sortedUnique((cand[cell] || []).filter(digit => !ahs.ahsDigits.includes(digit)));
      if (outsideDigits.length) rccDigitsByCell[cell] = outsideDigits;
    }

    return {
      ahsId: ahs.uniqueID,
      sourceDof: ahs.ahsDOF,
      effectiveDof,
      dofKeys: sortedUnique([effectiveDof, ahs.ahsDOF]),
      triggerKind,
      triggerLinkId,
      triggerSectors: sortedUnique(triggerSectors),
      digits: endpointDigits,
      rccDigits: endpointDigits,
      // AHS conveyance is cellular: Cells XOR RCC_Cells. The outside
      // candidates on the RCC cells are metadata for eliminations only.
      rccCells: [...triggerCells].sort((a, b) => a - b),
      conveyanceCells: [hiddenCell],
      cells: [hiddenCell],
      sectors: endpointSectors(ahs, [hiddenCell], triggerSectors),
      potentialElim: [...triggerCells].sort((a, b) => a - b),
      hiddenDigits: [hiddenDigit],
      hiddenCell,
      sourceAhsDigits: [...ahs.ahsDigits],
      sourceAhsCells: [...ahs.ahsAllCells],
      hiddenCells: [hiddenCell],
      digitCells,
      hiddenDigitCells,
      rccDigitsByCell,
    };
  }

  function buildEndpoints(cand, ahs, strongLinks) {
    if (ahs.ahsDigits.length <= 1) return [];
    if (ahs.ahsDOF < 1) return [];

    const outsideByCell = outsideDigitsByCell(ahs);
    const eligibleCells = ahs.ahsAllCells.filter(cell => (outsideByCell.get(cell) || []).length > 0);
    const endpoints = [];

    if (eligibleCells.length >= ahs.ahsDOF) {
      for (const cells of combinations(eligibleCells, ahs.ahsDOF)) {
        const digitCells = {};
        for (const cell of cells) {
          for (const digit of outsideByCell.get(cell) || []) {
            if (!digitCells[digit]) digitCells[digit] = [];
            digitCells[digit].push(cell);
          }
        }

        const remaining = ahs.ahsAllCells.filter(cell => !cells.includes(cell));
        for (const hiddenDigit of ahs.ahsDigits) {
          const hiddenCells = remaining.filter(cell => (cand[cell] || []).includes(hiddenDigit));
          if (hiddenCells.length !== 1) continue;
          const endpoint = buildEndpoint(
            cand,
            ahs,
            cells,
            cells,
            Object.keys(digitCells).map(Number),
            digitCells,
            'CELL',
            null,
            [],
            ahs.ahsDOF,
            hiddenDigit,
            hiddenCells[0],
          );
          if (endpoint) endpoints.push(endpoint);
        }
      }
    }

    // A digit outside the AHS set can remove every AHS cell that carries
    // that digit. If that reduction leaves a genuine hidden-single endpoint,
    // it is the second legal AHS conveyance form: external digit -> HS cell.
    const outsideDigits = sortedUnique(
      ahs.rccList.flatMap(rcc => rcc.rccDigits || []),
    );
    for (const removedDigit of outsideDigits) {
      const removedCells = ahs.rccList
        .filter(rcc => (rcc.rccDigits || []).includes(removedDigit))
        .map(rcc => rcc.rccCell);
      if (!removedCells.length || removedCells.length > ahs.ahsDOF) continue;

      const remaining = ahs.ahsAllCells.filter(cell => !removedCells.includes(cell));
      for (const hiddenDigit of ahs.ahsDigits) {
        const hiddenCells = remaining.filter(cell => (cand[cell] || []).includes(hiddenDigit));
        if (hiddenCells.length !== 1) continue;
        const digitCells = { [removedDigit]: [...removedCells] };
        const endpoint = buildEndpoint(
          cand,
          ahs,
          removedCells,
          removedCells,
          [removedDigit],
          digitCells,
          'DIGIT',
          null,
          [],
          removedCells.length,
          hiddenDigit,
          hiddenCells[0],
        );
        if (endpoint) endpoints.push(endpoint);
      }
    }

    const seen = new Set();
    return endpoints.filter(endpoint => {
      const key = endpointKey(endpoint);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function hsNode(ahs, endpoint) {
    return {
      uniqueID: ahs.uniqueID,
      sector: ahs.ahsSector,
      cells: [...ahs.ahsAllCells],
      digits: [...ahs.ahsDigits],
      originalCells: [...ahs.ahsAllCells],
      size: ahs.ahsSize,
      fox: ahs.ahsFOX,
      dof: ahs.ahsDOF,
      effectiveDof: endpoint.effectiveDof,
      dofKeys: [...endpoint.dofKeys],
      triggerKind: endpoint.triggerKind,
      reducedHs: {
        digit: endpoint.hiddenDigits[0] ?? null,
        cell: endpoint.hiddenCell ?? null,
        removedCells: [...endpoint.rccCells],
        removedDigits: [...endpoint.digits],
      },
      rccList: (ahs.rccList || []).map(rcc => ({
        cells: [rcc.rccCell],
        digits: [...(rcc.rccDigits || [])],
        sectors: [...(rcc.rccSectors || [])],
        potentialElim: [...(rcc.rccPotentialElim || [])],
      })),
      powerSet: ahs.PowerSet,
    };
  }

  function hiddenEliminationMap(cand, endpoint) {
    const out = {};
    for (const digit of endpoint.hiddenDigits) {
      const cells = endpoint.hiddenCells || [];
      out[digit] = core.setTools.peerPotentialEliminations
        ? core.setTools.peerPotentialEliminations(cand, digit, cells)
        : [...(endpoint.hiddenDigitCells[digit] || [])];
    }
    return out;
  }

  function endpointKey(endpoint) {
    return [
      endpoint.ahsId,
      endpoint.rccCells.join(','),
      endpoint.cells.join(','),
      endpoint.digits.join(','),
      endpoint.triggerKind,
      endpoint.triggerLinkId ?? '',
    ].join('|');
  }

  function linkKey(link) {
    return [
      link.linkType,
      link.HS_L.uniqueID,
      link.HS_R.uniqueID,
      link.C.digit ?? '',
      link.C.leftCells.join(','),
      link.C.rightCells.join(','),
      link.activeCells.join(','),
      link.startingDigits.join(','),
      link.linkedCells.join(','),
      link.linkDigits.join(','),
      endpointKey(link.RCC_Left),
      endpointKey(link.RCC_Right),
    ].join('|');
  }

  function addUnique(bucket, seen, link, maxLinks) {
    if (maxLinks !== undefined && seen.size >= maxLinks) return false;
    const key = linkKey(link);
    if (seen.has(key)) return true;
    seen.add(key);
    bucket.push(link);
    return true;
  }

  function hiddenDigitSectorMap(endpoint) {
    const out = {};
    for (const digit of endpoint.hiddenDigits) out[digit] = [...endpoint.sectors];
    return out;
  }

  function buildLink(cand, left, right, leftNode, bridge, rightNode) {
    return {
      id: nextAhsLinkId++,
      linkType: AHS_RCC,
      linkTypeName: 'AHS_RCC',
      originSector: [...bridge.sectors],
      conveyance: 'CELLS',
      startingDigits: [...left.hiddenDigits],
      activeCells: [...left.conveyanceCells],
      linkedCells: [...right.conveyanceCells],
      linkDigits: [...right.hiddenDigits],
      startCellsSector: hiddenDigitSectorMap(left),
      linkCellsSector: hiddenDigitSectorMap(right),
      startDigitSwapAvailable: [],
      endDigitSwapAvailable: [],
      potentialElimStart: hiddenEliminationMap(cand, left),
      potentialElimEnd: hiddenEliminationMap(cand, right),
      rccStartCells: [...left.rccCells],
      rccLinkedCells: [...right.rccCells],
      rccStartDigitsByCell: { ...left.rccDigitsByCell },
      rccLinkedDigitsByCell: { ...right.rccDigitsByCell },
      rightWeakLinks: [],
      leftWeakLinks: [],
      RCC_Left: left,
      HS_L: leftNode,
      C: bridge,
      HS_R: rightNode,
      RCC_Right: right,
      AHS_L: leftNode,
      AHS_R: rightNode,
    };
  }

  function directAhsNode(ahs) {
    return {
      uniqueID: ahs.uniqueID,
      sector: ahs.ahsSector,
      cells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      digits: [...ahs.ahsDigits],
      originalCells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      size: ahs.ahsSize,
      fox: ahs.ahsFOX,
      dof: ahs.ahsDOF,
      effectiveDof: ahs.ahsDOF,
      dofKeys: [ahs.ahsDOF],
      triggerKind: 'AHS_XZ',
      rccList: (ahs.rccList || []).map(rcc => ({
        cells: [rcc.rccCell],
        digits: [...(rcc.rccDigits || [])],
        sectors: [...(rcc.rccSectors || [])],
        potentialElim: [...(rcc.rccPotentialElim || [])],
      })),
      powerSet: ahs.PowerSet,
    };
  }

  function directAhsEndpoint(ahs) {
    return {
      ahsId: ahs.uniqueID,
      sourceDof: ahs.ahsDOF,
      effectiveDof: ahs.ahsDOF,
      dofKeys: [ahs.ahsDOF],
      digits: [...ahs.ahsDigits],
      rccDigits: [...ahs.ahsDigits],
      rccCells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      conveyanceCells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      cells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      sectors: [ahs.ahsSector],
      potentialElim: [],
      hiddenDigits: [...ahs.ahsDigits],
      hiddenCells: [...ahs.ahsAllCells].sort((a, b) => a - b),
      hiddenDigitCells: {},
      rccDigitsByCell: {},
    };
  }

  function buildAhsXzLinks(cand, ahsList, bucket, seen, maxLinks) {
    // Overlap AHS-XZ: two DOF-1 hidden sets share cells and one common
    // hidden digit. Candidates outside their digit union are intrinsic elims.
    const byCell = new Map();
    for (const ahs of ahsList) {
      if (ahs.ahsDOF !== 1 || ahs.ahsDigits.length < 2) continue;
      for (const cell of ahs.ahsAllCells) {
        const list = byCell.get(cell) || [];
        list.push(ahs);
        byCell.set(cell, list);
      }
    }

    const pairs = new Map();
    for (const list of byCell.values()) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const left = list[i];
          const right = list[j];
          if (left.uniqueID === right.uniqueID) continue;
          // Two AHSs from the same source sector do not form an independent
          // cross-sector XZ bridge; they only restate that sector's own
          // hidden-set coverage and flood the bounded link catalogue.
          if (left.ahsSector === right.ahsSector) continue;
          const key = [left.uniqueID, right.uniqueID].sort().join('|');
          if (!pairs.has(key)) pairs.set(key, [left, right]);
        }
      }
    }

    const pairList = [...pairs.values()].map(([left, right]) => {
      const overlap = intersection(left.ahsAllCells, right.ahsAllCells);
      const commonDigits = intersection(left.ahsDigits, right.ahsDigits);
      const commonCells = overlap.filter(cell =>
        commonDigits.length === 1 && (cand[cell] || []).includes(commonDigits[0]));
      const unionDigits = new Set([...left.ahsDigits, ...right.ahsDigits]);
      let intrinsicCount = 0;
      for (const cell of overlap) {
        for (const digit of cand[cell] || []) {
          if (!unionDigits.has(digit)) intrinsicCount += 1;
        }
      }
      return { left, right, overlap, commonDigits, commonCells, intrinsicCount };
    }).filter(pair => pair.overlap.length >= 2
      && pair.commonDigits.length === 1
      // The common hidden digit must have one, and only one, shared cell.
      // That cell is the HS endpoint; if it is present in both shared cells,
      // the pair has no single-cell HS reduction and is not an AHS-XZ link.
      && pair.commonCells.length === 1
      && pair.intrinsicCount > 0)
      .sort((a, b) => b.overlap.length - a.overlap.length
        || a.intrinsicCount - b.intrinsicCount
        || a.left.uniqueID.localeCompare(b.left.uniqueID)
        || a.right.uniqueID.localeCompare(b.right.uniqueID));

    for (const pair of pairList) {
      const { left, right, overlap, commonDigits, commonCells } = pair;

      const unionDigits = new Set([...left.ahsDigits, ...right.ahsDigits]);
      const intrinsicEliminations = [];
      for (const cell of overlap) {
        if (commonCells.includes(cell)) continue;
        for (const digit of cand[cell] || []) {
          if (!unionDigits.has(digit)) {
            intrinsicEliminations.push({ cell, digit });
          }
        }
      }
      if (!intrinsicEliminations.length) continue;

      const leftEndpoint = directAhsEndpoint(left);
      const rightEndpoint = directAhsEndpoint(right);
      const commonDigit = commonDigits[0];
      const bridge = {
        conveyance: 'CELLS',
        digit: commonDigit,
        digits: [commonDigit],
        restrictedDigits: [commonDigit],
        leftCells: [...commonCells],
        rightCells: [...commonCells],
        sectors: commonSectors(commonCells),
      };
      const link = {
        id: nextAhsLinkId++,
        linkType: AHS_RCC,
        linkTypeName: 'AHS_RCC',
        moduleKind: 'AHS_XZ',
        originSector: [...bridge.sectors],
        conveyance: 'CELLS',
        startingDigits: [...left.ahsDigits],
        activeCells: [...left.ahsAllCells],
        linkedCells: [...right.ahsAllCells],
        linkDigits: [...right.ahsDigits],
        startCellsSector: hiddenDigitSectorMap(leftEndpoint),
        linkCellsSector: hiddenDigitSectorMap(rightEndpoint),
        startDigitSwapAvailable: [],
        endDigitSwapAvailable: [],
        potentialElimStart: hiddenEliminationMap(cand, leftEndpoint),
        potentialElimEnd: hiddenEliminationMap(cand, rightEndpoint),
        rccStartCells: [...overlap],
        rccLinkedCells: [...overlap],
        rccStartDigitsByCell: {},
        rccLinkedDigitsByCell: {},
        rightWeakLinks: [],
        leftWeakLinks: [],
        RCC_Left: leftEndpoint,
        HS_L: directAhsNode(left),
        C: bridge,
        HS_R: directAhsNode(right),
        RCC_Right: rightEndpoint,
        intrinsicEliminations,
        displayLeftRcc: commonDigit,
        displayRightRcc: intrinsicEliminations[0].digit,
      };
      if (!addUnique(bucket, seen, link, maxLinks)) return false;
    }

    return true;
  }

  function buildAhsSingleRccXzLinks(cand, ahsList, bucket, seen, maxLinks) {
    // AHS-XZ through one shared RCC cell: two DOF-1 hidden sets share one
    // cell, and the shared cell carries one digit from each set. A reported
    // elimination is legal only when the two selected digits are mutual
    // witnesses: one occurrence sees every occurrence of the other digit in
    // each parent. This prevents the weaker, invalid "set equality" shortcut.
    const byCell = new Map();
    for (const ahs of ahsList) {
      if (ahs.ahsDOF !== 1 || ahs.ahsDigits.length !== 2) continue;
      for (const cell of ahs.ahsAllCells) {
        const list = byCell.get(cell) || [];
        list.push(ahs);
        byCell.set(cell, list);
      }
    }

    for (const list of byCell.values()) {
      for (let leftIndex = 0; leftIndex < list.length; leftIndex++) {
        const left = list[leftIndex];
        for (let rightIndex = leftIndex + 1; rightIndex < list.length; rightIndex++) {
          const right = list[rightIndex];
          if (left.ahsSector === right.ahsSector) continue;
          if (intersection(left.ahsDigits, right.ahsDigits).length) continue;

          const overlap = intersection(left.ahsAllCells, right.ahsAllCells);
          if (overlap.length !== 1) continue;
          const bridgeCell = overlap[0];
          const rccCells = new Set([bridgeCell]);
          const leftBridge = left.ahsDigits.filter(digit => (cand[bridgeCell] || []).includes(digit));
          const rightBridge = right.ahsDigits.filter(digit => (cand[bridgeCell] || []).includes(digit));
          if (leftBridge.length !== 1 || rightBridge.length !== 1) continue;

          // A one-cell RCC is a walkable AHS edge only when the shared cell
          // is a genuine bivalue.  A larger candidate set is not an RCC
          // bridge: allowing it here consumes the link budget with invalid
          // continuations and can hide the legal bivalue case.
          if ((cand[bridgeCell] || []).length === 2) {
            const bridge = {
              conveyance: 'CELLS',
              digit: null,
              digits: [],
              restrictedDigits: [],
              leftCells: [bridgeCell],
              rightCells: [bridgeCell],
              sectors: commonSectors([bridgeCell]),
            };
            const directLink = buildLink(
              cand,
              directAhsEndpoint(left),
              directAhsEndpoint(right),
              directAhsNode(left),
              bridge,
              directAhsNode(right),
            );
            directLink.moduleKind = 'AHS_XZ';
            directLink.xzBridgeCell = bridgeCell;
            directLink.rccStartDigitsByCell = { [bridgeCell]: [leftBridge[0]] };
            directLink.rccLinkedDigitsByCell = { [bridgeCell]: [rightBridge[0]] };
            directLink.displayLeftRcc = leftBridge[0];
            directLink.displayRightRcc = rightBridge[0];
            if (!addUnique(bucket, seen, directLink, maxLinks)) return false;
          }

          const emit = (source, target, sourceBridge, targetBridge) => {
            const forcedAssignments = (ahs, bridgeDigit) => {
            const remainingCells = ahs.ahsAllCells.filter(cell => cell !== bridgeCell);
            const remainingDigits = ahs.ahsDigits.filter(digit => digit !== bridgeDigit);
            const assignments = [];
            const cells = new Set(remainingCells);
            const digits = new Set(remainingDigits);

            // The RCC is neutral.  Once its value is selected, remove that
            // cell (and, when applicable, its AHS digit), then complete only
            // the hidden singles forced by the sector-digit side.
            let changed = true;
            while (changed) {
              changed = false;
              for (const digit of [...digits]) {
                const positions = [...cells].filter(cell =>
                  (cand[cell] || []).includes(digit));
                if (!positions.length) return null;
                if (positions.length !== 1) continue;
                const cell = positions[0];
                assignments.push({ cell, digit });
                cells.delete(cell);
                digits.delete(digit);
                changed = true;
              }
            }
            return assignments;
          };

          const branchEliminations = bridgeDigit => {
            const leftAssignments = forcedAssignments(left, bridgeDigit);
            const rightAssignments = forcedAssignments(right, bridgeDigit);
            // This RCC branch is impossible for at least one parent AHS. It
            // is not a worker error and must not be spread as an array.
            if (!leftAssignments || !rightAssignments) return null;
            const assignments = [
              ...leftAssignments,
              ...rightAssignments,
            ];
            if (!assignments.length) return new Set();
            const result = new Set();
            for (const assignment of assignments) {
              // A forced hidden single also excludes every other candidate
              // from its own cell.  Those cell-level eliminations are needed
              // when the opposite RCC branch forces the same target cell to
              // a different digit.
              for (const digit of cand[assignment.cell] || []) {
                if (digit !== assignment.digit && assignment.cell !== bridgeCell) {
                  result.add(`${assignment.cell}:${digit}`);
                }
              }
              const peers = core.peersOf(assignment.cell);
              for (const cell of [assignment.cell, ...peers]) {
                // Only the shared RCC cell is neutral.  Other AHS cells may
                // also carry outside candidates in their catalogue, but they
                // remain valid targets for the branch's peer eliminations.
                if (cell === bridgeCell) continue;
                if ((cand[cell] || []).includes(assignment.digit)) {
                  result.add(`${cell}:${assignment.digit}`);
                }
              }
            }
            return result;
          };

          const branchValues = sortedUnique([leftBridge[0], rightBridge[0]]);
          const branchSets = branchValues
            .map(branchEliminations)
            .filter(Boolean);
          if (!branchSets.length) return true;
          const commonKeys = branchSets.length
            ? [...branchSets[0]].filter(key => branchSets.every(set => set.has(key)))
            : [];
          const uniqueEliminations = commonKeys.map(key => {
            const [cell, digit] = key.split(':').map(Number);
            return { cell, digit };
          });
          if (!uniqueEliminations.length) return true;

                const leftEndpoint = directAhsEndpoint(source);
                const rightEndpoint = directAhsEndpoint(target);
                const bridge = {
                  conveyance: 'CELLS',
                  digit: null,
                  digits: [],
                  restrictedDigits: [],
                  leftCells: [bridgeCell],
                  rightCells: [bridgeCell],
                  sectors: commonSectors([bridgeCell]),
                };
                const link = {
              id: nextAhsLinkId++,
              linkType: AHS_RCC,
              linkTypeName: 'AHS_RCC',
              moduleKind: 'AHS_XZ',
              originSector: [...bridge.sectors],
              conveyance: 'CELLS',
              startingDigits: [...source.ahsDigits],
              activeCells: [...source.ahsAllCells],
              linkedCells: [...target.ahsAllCells],
              linkDigits: [...target.ahsDigits],
              startCellsSector: hiddenDigitSectorMap(leftEndpoint),
              linkCellsSector: hiddenDigitSectorMap(rightEndpoint),
              startDigitSwapAvailable: [],
              endDigitSwapAvailable: [],
              potentialElimStart: hiddenEliminationMap(cand, leftEndpoint),
              potentialElimEnd: hiddenEliminationMap(cand, rightEndpoint),
              rccStartCells: [bridgeCell],
              rccLinkedCells: [bridgeCell],
              rccStartDigitsByCell: { [bridgeCell]: [sourceBridge] },
              rccLinkedDigitsByCell: { [bridgeCell]: [targetBridge] },
              rightWeakLinks: [],
              leftWeakLinks: [],
              RCC_Left: leftEndpoint,
              HS_L: directAhsNode(source),
              C: bridge,
              HS_R: directAhsNode(target),
              RCC_Right: rightEndpoint,
              intrinsicEliminations: uniqueEliminations,
              displayLeftRcc: sourceBridge,
              displayRightRcc: targetBridge,
              xzBridgeCell: bridgeCell,
                };
                if (!addUnique(bucket, seen, link, maxLinks)) return false;
            return true;
          };

          if (!emit(left, right, leftBridge[0], rightBridge[0])) return false;
          if (!emit(right, left, rightBridge[0], leftBridge[0])) return false;
        }
      }
    }
    return true;
  }

  function buildAhsTwoRccXzLinks(cand, ahsList, bucket, seen, maxLinks) {
    // Two-cell RCC AHS-XZ ring. Both AHSs must expose the same two overlap
    // cells, and every reported target must see both RCC cells.
    for (let leftIndex = 0; leftIndex < ahsList.length; leftIndex++) {
      const left = ahsList[leftIndex];
      if (left.ahsDOF !== 1) continue;
      for (let rightIndex = leftIndex + 1; rightIndex < ahsList.length; rightIndex++) {
        const right = ahsList[rightIndex];
        if (right.ahsDOF !== 1) continue;
        if (left.ahsSector === right.ahsSector) continue;
        if (intersection(left.ahsDigits, right.ahsDigits).length) continue;
        const rccCells = intersection(left.ahsAllCells, right.ahsAllCells);
        if (rccCells.length !== 2) continue;
        if (!rccCells.every(cell => {
          const values = cand[cell] || [];
          return left.ahsDigits.some(digit => values.includes(digit))
            && right.ahsDigits.some(digit => values.includes(digit));
        })) continue;
        const seesBoth = cell => rccCells.every(rcc =>
          cell === rcc || core.peersOf(cell).includes(rcc));
        const eliminations = [];

        for (const cell of left.ahsAllCells.filter(value => !rccCells.includes(value))) {
          if (!seesBoth(cell)) continue;
          for (const digit of cand[cell] || []) {
            if (!left.ahsDigits.includes(digit)) {
              eliminations.push({ cell, digit });
            }
          }
        }
        for (const cell of right.ahsAllCells.filter(value => !rccCells.includes(value))) {
          if (!seesBoth(cell)) continue;
          for (const digit of cand[cell] || []) {
            if (left.ahsDigits.includes(digit)) {
              eliminations.push({ cell, digit });
            }
          }
        }

        const uniqueEliminations = eliminations.filter((item, index, all) =>
          all.findIndex(other => other.cell === item.cell && other.digit === item.digit) === index);
        if (!uniqueEliminations.length) continue;

        // An AHS-XZ elimination can reduce one of the participating cells to
        // a solved candidate.  That truth is part of the same deduction, so
        // propagate it to peers before publishing the result.
        const removedByCell = new Map();
        for (const item of uniqueEliminations) {
          const removed = removedByCell.get(item.cell) || new Set();
          removed.add(item.digit);
          removedByCell.set(item.cell, removed);
        }
        const propagated = [...uniqueEliminations];
        for (const [cell, removed] of removedByCell) {
          const remaining = (cand[cell] || []).filter(digit => !removed.has(digit));
          if (remaining.length !== 1) continue;
          const solvedDigit = remaining[0];
          for (const peer of core.peersOf(cell)) {
            if ((cand[peer] || []).includes(solvedDigit)
              && !rccCells.includes(peer)) {
              propagated.push({ cell: peer, digit: solvedDigit });
            }
          }
        }
        const allEliminations = propagated.filter((item, index, all) =>
          all.findIndex(other => other.cell === item.cell && other.digit === item.digit) === index);

        const leftEndpoint = directAhsEndpoint(left);
        const rightEndpoint = directAhsEndpoint(right);
        const bridge = {
          conveyance: 'CELLS',
          digit: null,
          digits: [],
          restrictedDigits: [],
          leftCells: [...rccCells],
          rightCells: [...rccCells],
          sectors: commonSectors(rccCells),
        };
        const link = buildLink(
          cand,
          leftEndpoint,
          rightEndpoint,
          directAhsNode(left),
          bridge,
          directAhsNode(right),
        );
        link.moduleKind = 'AHS_XZ_RING';
        link.ringRccCells = [...rccCells];
        link.rccStartDigitsByCell = Object.fromEntries([...rccCells].map(cell => [
          cell,
          left.ahsDigits.filter(digit => (cand[cell] || []).includes(digit)),
        ]));
        link.rccLinkedDigitsByCell = Object.fromEntries([...rccCells].map(cell => [
          cell,
          right.ahsDigits.filter(digit => (cand[cell] || []).includes(digit)),
        ]));
        link.intrinsicEliminations = allEliminations;
        link.displayLeftRcc = left.ahsDigits.join('');
        link.displayRightRcc = right.ahsDigits.join('');
        if (!addUnique(bucket, seen, link, maxLinks)) return false;
      }
    }
    return true;
  }

  function buildAhsTwoRccBranchXzLinks(cand, ahsList, bucket, seen, maxLinks) {
    // When two AHS parents share two cells, the sector-digit connector is a
    // branch constraint: each RCC assignment must leave both parents with a
    // valid hidden-set completion.  A candidate which belongs to no valid
    // branch is the AHS-XZ elimination.  The RCC cells themselves remain
    // neutral witnesses; only candidates disproved by all valid branches
    // are reported.
    for (let leftIndex = 0; leftIndex < ahsList.length; leftIndex++) {
      const left = ahsList[leftIndex];
      if (left.ahsDOF !== 1) continue;
      for (let rightIndex = leftIndex + 1; rightIndex < ahsList.length; rightIndex++) {
        const right = ahsList[rightIndex];
        if (right.ahsDOF !== 1 || left.ahsSector === right.ahsSector) continue;
        if (intersection(left.ahsDigits, right.ahsDigits).length !== 1) continue;
        if (left.ahsDigits.length > 3 || right.ahsDigits.length > 3) continue;
        if (left.ahsAllCells.length > 4 || right.ahsAllCells.length > 4) continue;

        const rccCells = intersection(left.ahsAllCells, right.ahsAllCells);
        if (rccCells.length !== 2) continue;
        if (rccCells.some(cell => (cand[cell] || []).length !== 2)) continue;
        if (!rccCells.every(cell => {
          const values = cand[cell] || [];
          return left.ahsDigits.some(digit => values.includes(digit))
            && right.ahsDigits.some(digit => values.includes(digit));
        })) continue;
        // The RCC candidates are neutral.  Values outside either AHS digit
        // set still have to be tested: they can make one parent impossible,
        // which is precisely how a candidate such as r9c7<>4 is disproved.
        const values = rccCells.map(cell => [...(cand[cell] || [])]);
        if (values.some(list => !list.length)) continue;

        const validBranches = [];
        for (const first of values[0]) {
          for (const second of values[1]) {
            const assignment = [
              { cell: rccCells[0], digit: first },
              { cell: rccCells[1], digit: second },
            ];
            const completes = ahs => {
              const used = assignment
                .filter(item => ahs.ahsDigits.includes(item.digit))
                .map(item => item.digit);
              if (new Set(used).size !== used.length) return null;
              const remainingCells = ahs.ahsAllCells
                .filter(cell => !rccCells.includes(cell));
              const remainingDigits = ahs.ahsDigits
                .filter(digit => !used.includes(digit));
              // AHS completion may leave extra cells after all hidden digits
              // have been assigned.  It is invalid only when fewer cells
              // remain than required digits.
              if (remainingCells.length < remainingDigits.length) return null;

              const cells = new Set(remainingCells);
              const digits = new Set(remainingDigits);
              const forced = [];
              let changed = true;
              while (changed) {
                changed = false;
                for (const digit of [...digits]) {
                  const positions = [...cells].filter(cell =>
                    (cand[cell] || []).includes(digit));
                  if (!positions.length) return null;
                  if (positions.length !== 1) continue;
                  const cell = positions[0];
                  forced.push({ cell, digit });
                  cells.delete(cell);
                  digits.delete(digit);
                  changed = true;
                }
              }
              return { forced, cells, digits };
            };

            const leftCompletion = completes(left);
            const rightCompletion = completes(right);
            if (leftCompletion && rightCompletion) {
              validBranches.push({ assignment, forced: [
                ...leftCompletion.forced,
                ...rightCompletion.forced,
              ] });
            }
          }
        }
        if (!validBranches.length) continue;

        const usedByValidBranch = new Set(validBranches.flatMap(branch =>
          branch.assignment.map(item => `${item.cell}:${item.digit}`)));
        const eliminations = [];
        for (const cell of rccCells) {
          for (const digit of cand[cell] || []) {
            if (!usedByValidBranch.has(`${cell}:${digit}`)) {
              eliminations.push({ cell, digit });
            }
          }
        }

        // Forced sector-digit completions also produce ordinary peer
        // eliminations, but only when the same elimination survives every
        // valid RCC branch.
        const branchEliminations = validBranches.map(branch => {
          const result = new Set();
          for (const forced of branch.forced) {
            for (const digit of cand[forced.cell] || []) {
              if (digit !== forced.digit && !rccCells.includes(forced.cell)) {
                result.add(`${forced.cell}:${digit}`);
              }
            }
            for (const peer of core.peersOf(forced.cell)) {
              if (rccCells.includes(peer)) continue;
              if ((cand[peer] || []).includes(forced.digit)) {
                result.add(`${peer}:${forced.digit}`);
              }
            }
          }
          return result;
        });
        if (branchEliminations.length) {
          const common = [...branchEliminations[0]]
            .filter(key => branchEliminations.every(set => set.has(key)));
          for (const key of common) {
            const [cell, digit] = key.split(':').map(Number);
            eliminations.push({ cell, digit });
          }
        }

        const intrinsicEliminations = eliminations.filter((item, index, all) =>
          all.findIndex(other => other.cell === item.cell && other.digit === item.digit) === index);
        if (!intrinsicEliminations.length) continue;

        const bridge = {
          conveyance: 'CELLS',
          digit: null,
          digits: [],
          restrictedDigits: [],
          leftCells: [...rccCells],
          rightCells: [...rccCells],
          sectors: commonSectors(rccCells),
        };
        const link = buildLink(
          cand,
          directAhsEndpoint(left),
          directAhsEndpoint(right),
          directAhsNode(left),
          bridge,
          directAhsNode(right),
        );
        link.moduleKind = 'AHS_XZ_RING';
        link.ringRccCells = [...rccCells];
        link.rccStartDigitsByCell = Object.fromEntries([...rccCells].map(cell => [
          cell,
          left.ahsDigits.filter(digit => (cand[cell] || []).includes(digit)),
        ]));
        link.rccLinkedDigitsByCell = Object.fromEntries([...rccCells].map(cell => [
          cell,
          right.ahsDigits.filter(digit => (cand[cell] || []).includes(digit)),
        ]));
        link.intrinsicEliminations = intrinsicEliminations;
        link.displayLeftRcc = left.ahsDigits.join('');
        link.displayRightRcc = right.ahsDigits.join('');
        if (!addUnique(bucket, seen, link, maxLinks)) return false;
      }
    }
    return true;
  }

  function indexedBridgeRefs(entries) {
    const refsByKey = new Map();

    for (const entry of entries) {
      for (const endpoint of entry.endpoints) {
        for (const sector of commonSectors(endpoint.rccCells)) {
          const key = `${sector}`;
          const refs = refsByKey.get(key) || [];
          refs.push({ entry, endpoint, cells: [...endpoint.rccCells], sector });
          refsByKey.set(key, refs);
        }
      }
    }

    return refsByKey;
  }

  function makeBridgePair(leftRef, rightRef) {
    if (leftRef.entry.index === rightRef.entry.index) return null;
    if (intersection(leftRef.entry.ahs.ahsAllCells, rightRef.entry.ahs.ahsAllCells).length > 1) return null;
    if (!cellsSeeEachOther(leftRef.cells, rightRef.cells)) return null;

    const [left, right] = leftRef.entry.index < rightRef.entry.index
      ? [leftRef, rightRef]
      : [rightRef, leftRef];

    return {
      leftEntry: left.entry,
      rightEntry: right.entry,
      left: left.endpoint,
      right: right.endpoint,
      bridge: {
        conveyance: 'CELLS',
        digit: null,
        digits: [],
        restrictedDigits: [],
        leftCells: [...left.cells],
        rightCells: [...right.cells],
        sectors: sortedUnique([
          left.sector,
          ...intersection(left.endpoint.sectors, right.endpoint.sectors),
          ...commonSectors([...left.cells, ...right.cells]),
        ]),
      },
    };
  }

  function addLinksForBridgePair(bucket, seen, bridgePair, maxLinks, cand) {
    const link = buildLink(
      cand,
      bridgePair.left,
      bridgePair.right,
      hsNode(bridgePair.leftEntry.ahs, bridgePair.left),
      bridgePair.bridge,
      hsNode(bridgePair.rightEntry.ahs, bridgePair.right),
    );
    link.moduleKind = 'AHS_XY';
    return addUnique(bucket, seen, link, maxLinks);
  }

  function indexedBridgePairs(entries) {
    const refsByKey = indexedBridgeRefs(entries);
    const pairs = new Map();

    for (const refs of refsByKey.values()) {
      for (let leftIndex = 0; leftIndex < refs.length; leftIndex++) {
        const leftRef = refs[leftIndex];
        for (let rightIndex = leftIndex + 1; rightIndex < refs.length; rightIndex++) {
          const rightRef = refs[rightIndex];
          const bridgePair = makeBridgePair(leftRef, rightRef);
          if (!bridgePair) continue;

          const key = `${bridgePair.leftEntry.index}|${bridgePair.rightEntry.index}`;
          const list = pairs.get(key) || [];
          list.push(bridgePair);
          pairs.set(key, list);
        }
      }
    }

    return pairs;
  }

  function buildAhsLinks(cand, options = {}) {
    nextAhsLinkId = 0;
    const opts = {
      minDof: Number.isInteger(options.minDof) ? Math.max(1, options.minDof) : 1,
      maxDof: Number.isInteger(options.maxDof) ? Math.max(1, Math.min(3, options.maxDof)) : 3,
      strictSingleCommon: options.strictSingleCommon ?? false,
      mode: options.mode === 'xy' ? 'xy' : 'all',
      maxLinks: Number.isInteger(options.maxLinks) && options.maxLinks > 0 ? options.maxLinks : undefined,
    };
    const ahsList = options.ahsList || core.ahsConstructor(cand, { maxSize: 8, maxSizeFox: 7 });
    const strongSet = options.strongLinkSet
      || (core.buildStrongLinks ? core.buildStrongLinks(cand) : []);
    const strongLinks = core.flattenStrongLinks
      ? core.flattenStrongLinks(strongSet)
      : (Array.isArray(strongSet) && strongSet.length && Array.isArray(strongSet[0])
        ? strongSet.flat()
        : strongSet);
    const buckets = Array.from({ length: AHS_RCC + 1 }, () => []);
    const endpointEntries = ahsList
      .map((ahs, index) => ({
        index,
        ahs,
        endpoints: buildEndpoints(cand, ahs, strongLinks)
          .filter(endpoint => endpoint.dofKeys.some(dof => dof >= opts.minDof && dof <= opts.maxDof)),
      }))
      .filter(entry => entry.endpoints.length > 1);
    const seen = new Set();

    if (opts.mode !== 'xy') {
      if (!buildAhsTwoRccBranchXzLinks(cand, ahsList, buckets[AHS_RCC], seen, opts.maxLinks)) return buckets;
      if (!buildAhsTwoRccXzLinks(cand, ahsList, buckets[AHS_RCC], seen, opts.maxLinks)) return buckets;
      if (!buildAhsXzLinks(cand, ahsList, buckets[AHS_RCC], seen, opts.maxLinks)) return buckets;
      if (!buildAhsSingleRccXzLinks(cand, ahsList, buckets[AHS_RCC], seen, opts.maxLinks)) return buckets;
    }

    if (opts.mode === 'xy') {
      // AHS-XY uses the two modular endpoint bridges: a shared-cell bridge
      // and a locked-position/sector bridge. The indexed path constructs
      // those bridges first, then combines the remaining valid reductions
      // on each parent. Keep it isolated from the AHS-XZ catalogue.
      const bridgePairs = indexedBridgePairs(endpointEntries);
      for (const pairs of bridgePairs.values()) {
        for (const bridgePair of pairs) {
          if (!addLinksForBridgePair(
            buckets[AHS_RCC],
            seen,
            bridgePair,
            opts.maxLinks,
            cand,
          )) return buckets;
        }
      }
      return buckets;
    }
    // The exact RCC passes above are the AHS-XZ catalogue.  The older broad
    // overlap generator is deliberately not mixed into this search: it can
    // exhaust the bounded link budget with non-RCC overlaps and mask the
    // sector-digit cases this engine is meant to report.

    // AHS modular links are built from the two reductions themselves:
    // {RCC_L, HS_L | C | HS_R, RCC_R}.  The old bridge-first code selected
    // one pair of reduction cells and then combined it with every other
    // endpoint on both parents.  That produced unrelated RCC/HS pairs and
    // an effectively unbounded Cartesian product.  Pair only the exact
    // left/right reductions being tested.
    for (let leftIndex = 0; leftIndex < endpointEntries.length; leftIndex++) {
      if (opts.maxLinks && seen.size >= opts.maxLinks) return buckets;
      const leftEntry = endpointEntries[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < endpointEntries.length; rightIndex++) {
        if (opts.maxLinks && seen.size >= opts.maxLinks) return buckets;
        const rightEntry = endpointEntries[rightIndex];
        const parentOverlap = intersection(leftEntry.ahs.ahsAllCells, rightEntry.ahs.ahsAllCells);
        if (parentOverlap.length !== 1) continue;

        const pairCandidates = opts.strictSingleCommon ? [] : null;
        let validPairCount = 0;
        for (const leftEndpoint of leftEntry.endpoints) {
          for (const rightEndpoint of rightEntry.endpoints) {
            if (opts.maxLinks && seen.size >= opts.maxLinks) return buckets;
            if (!leftEndpoint.rccCells.length || !rightEndpoint.rccCells.length) continue;
            const sharedRcc = intersection(leftEndpoint.rccCells, rightEndpoint.rccCells);
            if (sharedRcc.length !== 1 || sharedRcc[0] !== parentOverlap[0]) continue;
            // The modular AHS edge is carried by the two surviving hidden
            // singles.  Their cells are the AHS equivalent of ALS's
            // restricted common; removed trigger cells alone do not connect
            // two parent modules.
            if (leftEndpoint.hiddenCell == null || rightEndpoint.hiddenCell == null) continue;
            if (!cellsSeeEachOther([leftEndpoint.hiddenCell], [rightEndpoint.hiddenCell])) continue;
            if (!cellsSeeEachOther(leftEndpoint.rccCells, rightEndpoint.rccCells)) continue;

            const bridge = {
              conveyance: 'CELLS',
              digit: null,
              digits: [],
              restrictedDigits: [],
              leftCells: [leftEndpoint.hiddenCell],
              rightCells: [rightEndpoint.hiddenCell],
              sectors: sortedUnique([
                ...leftEndpoint.sectors,
                ...rightEndpoint.sectors,
                ...commonSectors([
                  leftEndpoint.hiddenCell,
                  rightEndpoint.hiddenCell,
                ]),
              ]),
            };
            validPairCount += 1;
            if (opts.strictSingleCommon) {
              pairCandidates.push({ leftEndpoint, rightEndpoint, bridge });
              continue;
            }

            // AHS-XY does not require a unique common bridge. Emit each
            // validated pair immediately so rejected/duplicate combinations
            // are never retained in a temporary Cartesian-product array.
            const link = buildLink(
              cand,
              leftEndpoint,
              rightEndpoint,
              hsNode(leftEntry.ahs, leftEndpoint),
              bridge,
              hsNode(rightEntry.ahs, rightEndpoint),
            );
            link.moduleKind = 'AHS_XY';
            if (!addUnique(buckets[AHS_RCC], seen, link, opts.maxLinks)) return buckets;
          }
        }

        if (!opts.strictSingleCommon || validPairCount !== 1) continue;

        for (const candidate of pairCandidates) {
          const link = buildLink(
            cand,
            candidate.leftEndpoint,
            candidate.rightEndpoint,
            hsNode(leftEntry.ahs, candidate.leftEndpoint),
            candidate.bridge,
            hsNode(rightEntry.ahs, candidate.rightEndpoint),
          );
          link.moduleKind = 'AHS_XZ';
          if (!addUnique(buckets[AHS_RCC], seen, link, opts.maxLinks)) return buckets;
        }
      }
    }

    return buckets;
  }

  function flattenAhsLinks(linkset) {
    return linkset.flat();
  }

  core.AHS_RCC = AHS_RCC;
  core.AHS_LINK_TYPE_NAMES = AHS_LINK_TYPE_NAMES;
  core.buildAhsLinks = buildAhsLinks;
  core.ahsLinkConstructor = buildAhsLinks;
  core.flattenAhsLinks = flattenAhsLinks;
})(globalThis);

