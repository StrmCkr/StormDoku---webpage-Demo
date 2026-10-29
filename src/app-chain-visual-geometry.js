/* StormDoku chain visual geometry helpers. */
(function installChainVisualGeometry(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function digitAnchor(boardEl, cell, digit) {
    const cellSize = 100 / 9;
    const markSize = cellSize / 3;
    const cellEl = boardEl?.children?.[cell];
    const markEl = cellEl?.querySelector?.('.marks')?.children?.[digit - 1];
    const boardRect = boardEl?.getBoundingClientRect?.();
    const markRect = markEl?.getBoundingClientRect?.();
    if (boardRect?.width && boardRect?.height && markRect?.width && markRect?.height) {
      return {
        cell,
        digit,
        markSize: Math.min(markRect.width / boardRect.width, markRect.height / boardRect.height) * 100,
        x: ((markRect.left + markRect.width / 2) - boardRect.left) / boardRect.width * 100,
        y: ((markRect.top + markRect.height / 2) - boardRect.top) / boardRect.height * 100,
      };
    }
    return {
      cell,
      digit,
      markSize,
      x: (cell % 9) * cellSize + (((digit - 1) % 3) + 0.5) * markSize,
      y: Math.floor(cell / 9) * cellSize + (Math.floor((digit - 1) / 3) + 0.5) * markSize,
    };
  }

  function vantageCellSlot(view, cell) {
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    if (view === 'Rn') return { sector: row, position: col };
    if (view === 'Cn') return { sector: col, position: row };
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    return { sector: box, position: (row % 3) * 3 + (col % 3) };
  }

  function vantageCellFromSlot(view, sector, position) {
    if (view === 'Rn') return sector * 9 + position;
    if (view === 'Cn') return position * 9 + sector;
    const boxRow = Math.floor(sector / 3);
    const boxCol = sector % 3;
    const row = boxRow * 3 + Math.floor(position / 3);
    const col = boxCol * 3 + (position % 3);
    return row * 9 + col;
  }

  function vantageAtomAnchor(view, cell, digit) {
    const { sector, position } = vantageCellSlot(view, cell);
    const tileIndex = sector * 9 + (digit - 1);
    const tileRow = Math.floor(tileIndex / 9);
    const tileCol = tileIndex % 9;
    const positionRow = Math.floor(position / 3);
    const positionCol = position % 3;
    const tileSize = 100 / 9;
    const markSize = tileSize / 3;
    return {
      cell,
      digit,
      markSize,
      x: tileCol * tileSize + (positionCol + 0.5) * markSize,
      y: tileRow * tileSize + (positionRow + 0.5) * markSize,
    };
  }

  function digitBoxBounds(anchor, pad = 0.12) {
    const half = anchor.markSize * 0.42;
    return {
      left: anchor.x - half - pad,
      top: anchor.y - half - pad,
      right: anchor.x + half + pad,
      bottom: anchor.y + half + pad,
    };
  }

  function sideAnchors(side, forcedDigit, existingOnly, { digitAnchor, chainCandidateIsVisible }) {
    const sideDigits = side.digits || [];
    const digits = forcedDigit == null ? sideDigits : [forcedDigit];
    const anchors = [];
    for (const cell of side.cells || []) {
      for (const digit of digits) {
        if (!sideDigits.includes(digit)) continue;
        if (existingOnly && !chainCandidateIsVisible(cell, digit)) continue;
        anchors.push(digitAnchor(cell, digit));
      }
    }
    return anchors;
  }

  function closestAnchorPair(fromSide, toSide, forcedDigit, toDigit, existingOnly, callbacks) {
    const fromAnchors = sideAnchors(fromSide, forcedDigit, existingOnly, callbacks);
    const toAnchors = sideAnchors(toSide, toDigit, existingOnly, callbacks);
    let best = null;
    for (const from of fromAnchors) {
      for (const to of toAnchors) {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        const distance = dx * dx + dy * dy;
        if (!best || distance < best.distance) best = { from, to, distance };
      }
    }
    return best;
  }

  function anchorRow(anchor) {
    return Math.floor(anchor.cell / 9);
  }

  function anchorCol(anchor) {
    return anchor.cell % 9;
  }

  function orderedEdgeArc(from, to) {
    const fromRow = anchorRow(from);
    const toRow = anchorRow(to);
    const fromCol = anchorCol(from);
    const toCol = anchorCol(to);
    if (fromRow === toRow && fromRow === 8) return from.x <= to.x ? { from, to, edge: 'row' } : { from: to, to: from, edge: 'row' };
    if (fromRow === toRow && fromRow === 0) return from.x >= to.x ? { from, to, edge: 'row' } : { from: to, to: from, edge: 'row' };
    if (fromCol === toCol && fromCol === 8) return from.y <= to.y ? { from, to, edge: 'col' } : { from: to, to: from, edge: 'col' };
    if (fromCol === toCol && fromCol === 0) return from.y >= to.y ? { from, to, edge: 'col' } : { from: to, to: from, edge: 'col' };
    return { from, to, edge: null };
  }

  function arcControlPoint(from, to, bendSign = 1, lane = 0) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.01) return { x: from.x, y: from.y };
    const normalX = -dy / length;
    const normalY = dx / length;
    const curve = Math.max(2.2, Math.min(7.5, length * 0.18)) * bendSign;
    return {
      x: (from.x + to.x) / 2 + normalX * (curve + lane),
      y: (from.y + to.y) / 2 + normalY * (curve + lane),
    };
  }

  function boardOverflow(point, margin = 0.75) {
    return Math.max(0, margin - point.x, point.x - (100 - margin), margin - point.y, point.y - (100 - margin));
  }

  function bendSignForArc(from, to, preferredSign = 1, lane = 0, edge = null) {
    if (edge === 'row') return -1;
    if (edge === 'col') return 1;
    const preferredOverflow = boardOverflow(arcControlPoint(from, to, preferredSign, lane));
    const flippedOverflow = boardOverflow(arcControlPoint(from, to, -preferredSign, lane));
    return flippedOverflow < preferredOverflow ? -preferredSign : preferredSign;
  }

  function routeArc(from, to, bend = 4, lane = 0) {
    const ordered = orderedEdgeArc(from, to);
    const magnitude = Math.abs(bend || 4);
    const preferredSign = Math.sign(bend || 1);
    const sign = bendSignForArc(ordered.from, ordered.to, preferredSign, lane, ordered.edge);
    return { from: ordered.from, to: ordered.to, bend: magnitude * sign, lane };
  }

  function arcPath(from, to, bend = 4, lane = 0) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.01) {
      const radius = 1.2 + Math.abs(lane);
      return 'M ' + (from.x + radius) + ' ' + from.y + ' '
        + 'C ' + (from.x + radius) + ' ' + (from.y - radius * 1.5) + ', ' + (from.x - radius) + ' ' + (from.y - radius * 1.5) + ', ' + (from.x - radius) + ' ' + from.y + ' '
        + 'C ' + (from.x - radius) + ' ' + (from.y + radius * 1.5) + ', ' + (from.x + radius) + ' ' + (from.y + radius * 1.5) + ', ' + (from.x + radius) + ' ' + from.y;
    }
    const normalX = -dy / length;
    const normalY = dx / length;
    const curve = Math.max(2.2, Math.min(7.5, length * 0.18)) * Math.sign(bend || 1);
    const startX = from.x + normalX * lane;
    const startY = from.y + normalY * lane;
    const endX = to.x + normalX * lane;
    const endY = to.y + normalY * lane;
    const controlX = (from.x + to.x) / 2 + normalX * (curve + lane);
    const controlY = (from.y + to.y) / 2 + normalY * (curve + lane);
    return 'M ' + startX + ' ' + startY + ' Q ' + controlX + ' ' + controlY + ' ' + endX + ' ' + endY;
  }

  function sideDigitGroups(side, sideAnchorsFn) {
    const groups = new Map();
    for (const anchor of sideAnchorsFn(side, null, true)) {
      const group = groups.get(anchor.digit) || [];
      group.push(anchor);
      groups.set(anchor.digit, group);
    }
    return [...groups.values()];
  }

  function digitBoundsFromAnchors(anchors, includeSingleCell = false) {
    if (!anchors.length || (!includeSingleCell
      && new Set(anchors.map(anchor => anchor.cell)).size <= 1)) return null;
    const bounds = anchors.map(anchor => digitBoxBounds(anchor));
    return {
      left: Math.max(0, Math.min(...bounds.map(box => box.left))),
      top: Math.max(0, Math.min(...bounds.map(box => box.top))),
      right: Math.min(100, Math.max(...bounds.map(box => box.right))),
      bottom: Math.min(100, Math.max(...bounds.map(box => box.bottom))),
    };
  }

  function groupedSideDigits(side, sideDigitGroupsFn) {
    return sideDigitGroupsFn(side)
      .filter(anchors => new Set(anchors.map(anchor => anchor.cell)).size > 1)
      .map(anchors => anchors[0]?.digit)
      .filter(digit => digit != null);
  }

  function boxEdgeAnchor(box, target, fallback) {
    const center = { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
    const dx = target.x - center.x;
    const dy = target.y - center.y;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return fallback;
    const halfWidth = Math.max(0.1, (box.right - box.left) / 2 - 0.15);
    const halfHeight = Math.max(0.1, (box.bottom - box.top) / 2 - 0.15);
    const scale = Math.min(
      Math.abs(dx) < 0.01 ? Infinity : halfWidth / Math.abs(dx),
      Math.abs(dy) < 0.01 ? Infinity : halfHeight / Math.abs(dy),
    );
    return { ...fallback, x: center.x + dx * scale, y: center.y + dy * scale };
  }

  function crossDigitAnchorPair(fromSide, toSide, fromDigits, toDigits, sideAnchorsFn) {
    const fromAnchors = (fromDigits || []).flatMap(digit =>
      sideAnchorsFn(fromSide, digit, true));
    const toAnchors = (toDigits || []).flatMap(digit =>
      sideAnchorsFn(toSide, digit, true));
    let best = null;
    for (const from of fromAnchors) {
      for (const to of toAnchors) {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        const distance = dx * dx + dy * dy;
        if (!best || distance < best.distance) best = { from, to, distance };
      }
    }
    return best;
  }

  function chainSectorFrameData(sectors, variantUnitNameFn, sectorFrameRectsFn) {
    const frames = [];
    for (const sector of sectors || []) {
      const name = variantUnitNameFn?.(sector);
      if (!name) continue;
      const type = name === 'D1'
        ? 'diagonal'
        : name === 'AD1'
          ? 'anti-diagonal'
          : 'variant-sector';
      for (const rect of sectorFrameRectsFn({ type, indices: [sector] })) {
        frames.push({ name, rect });
      }
    }
    return frames;
  }

  function superMultiGroupBounds(anchors, pad = 0.65) {
    if (!anchors?.length) return null;
    const half = Math.max(...anchors.map(anchor => anchor.markSize || 1)) * 0.42 + pad;
    return {
      left: Math.max(0, Math.min(...anchors.map(anchor => anchor.x)) - half),
      top: Math.max(0, Math.min(...anchors.map(anchor => anchor.y)) - half),
      right: Math.min(100, Math.max(...anchors.map(anchor => anchor.x)) + half),
      bottom: Math.min(100, Math.max(...anchors.map(anchor => anchor.y)) + half),
    };
  }

  app.chainVisualGeometry = {
    digitAnchor,
    vantageCellSlot,
    vantageCellFromSlot,
    vantageAtomAnchor,
    digitBoxBounds,
    sideAnchors,
    closestAnchorPair,
    anchorRow,
    anchorCol,
    orderedEdgeArc,
    arcControlPoint,
    boardOverflow,
    bendSignForArc,
    routeArc,
    arcPath,
    sideDigitGroups,
    digitBoundsFromAnchors,
    groupedSideDigits,
    boxEdgeAnchor,
    crossDigitAnchorPair,
    chainSectorFrameData,
    superMultiGroupBounds,
  };
})(window);
