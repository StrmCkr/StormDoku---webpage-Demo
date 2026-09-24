(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before als-link-core.js');
  if (!core.setTools) throw new Error('set-tools-core.js must load before als-link-core.js');
  if (!core.alsConstructor) throw new Error('als-core.js must load before als-link-core.js');

  const {
    intersection,
    sortedUnique,
  } = core.setTools;

  const ALS_RCC = 5;
  const ALS_LINK_TYPE_NAMES = ['BILOCAL', 'CELL_TO_GROUP', 'GROUP_TO_GROUP', 'ERI', 'ALS', 'ALS_RCC'];
  let nextAlsLinkId = 0;

  function commonSectors(cells) {
    if (!cells.length) return [];
    return core.UNITS
      .map((unit, sector) => cells.every(cell => unit.includes(cell)) ? sector : -1)
      .filter(sector => sector >= 0);
  }

  function pairwiseSharedSectors(left, right) {
    const sectors = new Set();
    for (const a of left) {
      for (const b of right) {
        for (const sector of commonSectors([a, b])) sectors.add(sector);
      }
    }
    return [...sectors].sort((a, b) => a - b);
  }

  function cellsSeeEachOther(left, right) {
    return !!left.length
      && !!right.length
      && left.every(a => right.every(b => core.peersOf(a).includes(b)));
  }

  function disjoint(left, right) {
    const seen = new Set(left);
    return right.every(cell => !seen.has(cell));
  }

  function alsNode(als) {
    return {
      uniqueID: als.uniqueID,
      sector: als.alsSector,
      cells: [...als.alsAllCells],
      digits: [...als.alsDigits],
      size: als.alsSize,
      fox: als.alsFOX,
      dof: als.alsDOF,
      powerSet: als.PowerSet,
      rccList: (als.rccList || []).map(rcc => ({
        digit: rcc.rccDigit,
        cells: [...rcc.rccCells],
        sectors: [...rcc.rccSectors],
        potentialElim: [...rcc.rccPotentialElim],
      })),
    };
  }

  function rccByDigit(als, digit) {
    return als.rccList.find(rcc => rcc.rccDigit === digit);
  }

  function endpointFromRcc(cand, als, rcc) {
    return {
      alsId: als.uniqueID,
      digit: rcc.rccDigit,
      cells: [...rcc.rccCells],
      sectors: [...rcc.rccSectors],
      potentialElim: [...rcc.rccPotentialElim],
      digitSwapAvailable: rcc.rccCells.length === 1
        ? (cand[rcc.rccCells[0]] || []).filter(digit => digit !== rcc.rccDigit)
        : [],
    };
  }

  function digitMap(endpoint) {
    return { [endpoint.digit]: [...endpoint.sectors] };
  }

  function eliminationMap(endpoint) {
    return { [endpoint.digit]: [...endpoint.potentialElim] };
  }

  function buildLink(linkType, left, right, LS_L, C, LS_R, extras = {}) {
    return {
      id: nextAlsLinkId++,
      linkType,
      linkTypeName: 'ALS_RCC',
      originSector: C ? [...C.sectors] : commonSectors([...left.cells, ...right.cells]),
      startingDigits: [left.digit],
      activeCells: [...left.cells],
      linkedCells: [...right.cells],
      linkDigits: [right.digit],
      startCellsSector: digitMap(left),
      linkCellsSector: digitMap(right),
      startDigitSwapAvailable: [...left.digitSwapAvailable],
      endDigitSwapAvailable: [...right.digitSwapAvailable],
      potentialElimStart: eliminationMap(left),
      potentialElimEnd: eliminationMap(right),
      rightWeakLinks: [],
      leftWeakLinks: [],
      RCC_Left: left,
      LS_L,
      C,
      LS_R,
      RCC_Right: right,
      ...extras,
    };
  }

  function restrictedCommons(left, right) {
    const bridges = [];
    for (const digit of intersection(left.alsDigits, right.alsDigits)) {
      const leftRcc = rccByDigit(left, digit);
      const rightRcc = rccByDigit(right, digit);
      if (!leftRcc || !rightRcc) continue;
      if (!cellsSeeEachOther(leftRcc.rccCells, rightRcc.rccCells)) continue;

      const allCells = [...leftRcc.rccCells, ...rightRcc.rccCells];
      const allCommon = commonSectors(allCells);
      bridges.push({
        digit,
        leftCells: [...leftRcc.rccCells],
        rightCells: [...rightRcc.rccCells],
        sectors: allCommon.length ? allCommon : pairwiseSharedSectors(leftRcc.rccCells, rightRcc.rccCells),
      });
    }
    return bridges;
  }

  function bridgeGroup(left, right, bridges, digits) {
    const bridgeDigits = sortedUnique(digits);
    const leftCells = sortedUnique(bridgeDigits.flatMap(digit => rccByDigit(left, digit)?.rccCells || []));
    const rightCells = sortedUnique(bridgeDigits.flatMap(digit => rccByDigit(right, digit)?.rccCells || []));
    const sectors = sortedUnique(bridges.flatMap(bridge => bridge.sectors));

    return {
      digit: bridgeDigits[0],
      digits: bridgeDigits,
      restrictedDigits: sortedUnique(bridges.map(bridge => bridge.digit)),
      leftCells,
      rightCells,
      sectors,
      bridges: bridges.map(bridge => ({
        digit: bridge.digit,
        leftCells: [...bridge.leftCells],
        rightCells: [...bridge.rightCells],
        sectors: [...bridge.sectors],
      })),
    };
  }

  function remainderDigits(digits, endpointDigit) {
    return sortedUnique(digits.filter(digit => digit !== endpointDigit));
  }

  function sameDigits(left, right) {
    return left.length === right.length && left.every((digit, index) => digit === right[index]);
  }

  function linkKey(link) {
    return [
      link.linkType,
      link.moduleKind || '',
      link.displayLeftRcc ?? '',
      link.displayRightRcc ?? '',
      link.LS_L?.uniqueID ?? 'cell',
      link.LS_R?.uniqueID ?? 'cell',
      link.C?.digits?.join('') ?? link.C?.digit ?? 'none',
      link.startingDigits.join(''),
      link.activeCells.join(','),
      link.linkDigits.join(''),
      link.linkedCells.join(','),
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

  function buildAlsTraversalLinks(cand, alsList, out, seen, maxLinks) {
    // A size-one ALS is the bivalent/type-4 node used by XY structures.  It
    // must be allowed to participate at an endpoint of a traversal link: a
    // higher ALS can hand its RCC to a bivalent cell and then continue through
    // that cell's ordinary type-4 strong link.  Keep the all-bivalent case out
    // of this builder because the ordinary strong-link inventory already owns
    // those edges.
    const pairable = alsList.filter(als => als.alsDOF === 1);

    for (let leftIndex = 0; leftIndex < pairable.length; leftIndex++) {
      const leftAls = pairable[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < pairable.length; rightIndex++) {
        const rightAls = pairable[rightIndex];
        if (leftAls.alsAllCells.length === 1 && rightAls.alsAllCells.length === 1) continue;
        if (!disjoint(leftAls.alsAllCells, rightAls.alsAllCells)) continue;

        // A restricted common is enough to join two ALS modules for a chain
        // walk. The next edge chooses the exposed non-RCC digit; no matching
        // remainder set or pre-existing XZ elimination is required here.
        const bridges = restrictedCommons(leftAls, rightAls);
        if (!bridges.length) continue;

        const leftNode = alsNode(leftAls);
        const rightNode = alsNode(rightAls);
        for (const bridge of bridges) {
          const leftEndpoints = leftAls.rccList.filter(rcc => rcc.rccDigit !== bridge.digit);
          const rightEndpoints = rightAls.rccList.filter(rcc => rcc.rccDigit !== bridge.digit);
          for (const leftRcc of leftEndpoints) {
            const left = endpointFromRcc(cand, leftAls, leftRcc);
            for (const rightRcc of rightEndpoints) {
              const right = endpointFromRcc(cand, rightAls, rightRcc);
              const link = buildLink(
                ALS_RCC,
                left,
                right,
                leftNode,
                bridgeGroup(leftAls, rightAls, [bridge], [bridge.digit]),
                rightNode,
                { moduleKind: 'ALS_TRAVERSAL' },
              );
              if (!addUnique(out, seen, link, maxLinks)) return;
            }
          }
        }
      }
    }
  }

  function buildPairedAlsLinks(cand, alsList, out, seen, maxLinks) {
    const pairable = alsList.filter(als => als.alsDOF === 1 && als.alsAllCells.length > 1);

    for (let leftIndex = 0; leftIndex < pairable.length; leftIndex++) {
      const leftAls = pairable[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < pairable.length; rightIndex++) {
        const rightAls = pairable[rightIndex];
        if (!disjoint(leftAls.alsAllCells, rightAls.alsAllCells)) continue;

        const bridges = restrictedCommons(leftAls, rightAls);
        if (!bridges.length) continue;
        const sharedDigits = intersection(leftAls.alsDigits, rightAls.alsDigits);

        const leftNode = alsNode(leftAls);
        const rightNode = alsNode(rightAls);
        const leftEndpoints = leftAls.rccList.filter(rcc => !sharedDigits.includes(rcc.rccDigit));
        const rightEndpoints = rightAls.rccList.filter(rcc => !sharedDigits.includes(rcc.rccDigit));

        for (const leftRcc of leftEndpoints) {
          if (sharedDigits.includes(leftRcc.rccDigit)) continue;
          const left = endpointFromRcc(cand, leftAls, leftRcc);
          for (const rightRcc of rightEndpoints) {
            if (leftRcc.rccDigit === rightRcc.rccDigit) continue;
            if (sharedDigits.includes(rightRcc.rccDigit)) continue;

            const leftRemainder = remainderDigits(leftAls.alsDigits, leftRcc.rccDigit);
            const rightRemainder = remainderDigits(rightAls.alsDigits, rightRcc.rccDigit);
            if (!sameDigits(leftRemainder, rightRemainder)) continue;

            const cDigits = leftRemainder;
            if (!cDigits.length) continue;

            const cBridges = bridges.filter(bridge => cDigits.includes(bridge.digit));
            const right = endpointFromRcc(cand, rightAls, rightRcc);
            const link = buildLink(ALS_RCC, left, right, leftNode, bridgeGroup(leftAls, rightAls, cBridges, cDigits), rightNode);
            if (!addUnique(out, seen, link, maxLinks)) return;
          }
        }
      }
    }
  }

  function buildAlsXzLinks(cand, alsList, out, seen, maxLinks) {
    const pairable = alsList.filter(als => als.alsDOF === 1);

    for (let leftIndex = 0; leftIndex < pairable.length; leftIndex++) {
      const leftAls = pairable[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < pairable.length; rightIndex++) {
        const rightAls = pairable[rightIndex];
        if (!disjoint(leftAls.alsAllCells, rightAls.alsAllCells)) continue;

        const bridges = restrictedCommons(leftAls, rightAls);
        if (!bridges.length) continue;

        for (const bridge of bridges) {
          const x = bridge.digit;
          for (const y of intersection(leftAls.alsDigits, rightAls.alsDigits)) {
            if (y === x) continue;
            const leftRcc = rccByDigit(leftAls, y);
            const rightRcc = rccByDigit(rightAls, y);
            if (!leftRcc || !rightRcc) continue;

            const intrinsicEliminations = intersection(
              leftRcc.rccPotentialElim,
              rightRcc.rccPotentialElim,
            ).map(cell => ({ cell, digit: y }));
            if (!intrinsicEliminations.length) continue;

            const link = buildLink(
              ALS_RCC,
              endpointFromRcc(cand, leftAls, leftRcc),
              endpointFromRcc(cand, rightAls, rightRcc),
              alsNode(leftAls),
              bridgeGroup(leftAls, rightAls, [bridge], [x]),
              alsNode(rightAls),
              {
                moduleKind: 'ALS_XZ',
                displayLeftRcc: y,
                displayRightRcc: x,
                intrinsicEliminations,
              },
            );
            if (!addUnique(out, seen, link, maxLinks)) return;
          }
        }
      }
    }
  }

  function buildAlsLinks(cand, options = {}) {
    nextAlsLinkId = 0;
    const opts = {
      includePairedAls: options.includePairedAls ?? true,
      xzOnly: options.xzOnly === true,
      strictSingleCommon: options.strictSingleCommon ?? true,
      maxLinks: Number.isInteger(options.maxLinks) && options.maxLinks > 0 ? options.maxLinks : undefined,
      maxTraversalLinks: Number.isInteger(options.maxTraversalLinks) && options.maxTraversalLinks > 0
        ? options.maxTraversalLinks
        : undefined,
    };
    const alsList = options.alsList || core.alsConstructor(cand);
    const buckets = Array.from({ length: ALS_RCC + 1 }, () => []);

    if (opts.includePairedAls) {
      if (opts.xzOnly) {
        const xzSeen = new Set();
        buildAlsXzLinks(cand, alsList, buckets[ALS_RCC], xzSeen, opts.maxLinks);
        return buckets;
      }

      const traversalSeen = new Set();
      const traversalLinks = [];
      buildAlsTraversalLinks(
        cand,
        alsList,
        traversalLinks,
        traversalSeen,
        opts.maxTraversalLinks ?? opts.maxLinks,
      );

      const regularSeen = new Set();
      const regularLinks = [];
      buildPairedAlsLinks(cand, alsList, regularLinks, regularSeen, opts.maxLinks);
      buildAlsXzLinks(cand, alsList, regularLinks, regularSeen, opts.maxLinks);

      buckets[ALS_RCC].push(...regularLinks, ...traversalLinks);
    }

    return buckets;
  }

  function flattenAlsLinks(linkset) {
    return linkset.flat();
  }

  core.ALS_RCC = ALS_RCC;
  core.ALS_LINK_TYPE_NAMES = ALS_LINK_TYPE_NAMES;
  core.buildAlsLinks = buildAlsLinks;
  core.alsLinkConstructor = buildAlsLinks;
  core.flattenAlsLinks = flattenAlsLinks;
})(globalThis);
