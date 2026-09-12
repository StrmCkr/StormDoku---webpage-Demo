(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core || !core.alsConstructor || !core.ahsConstructor) {
    throw new Error('ALS and AHS builders must load before subset-report-core.js');
  }

  const ROW_COL_PAIRS = new Set([9, 10, 17, 30, 31, 35, 42, 43, 44]);
  const ROW_COL_TRIPS = new Set([45, 109, 128]);
  const BOX_PAIRS = new Set([9, 10, 11, 14, 17, 19, 22, 26, 29, 30, 31, 32, 35, 37, 41, 42, 43, 44]);
  const BOX_TRIPS = new Set([45, 60, 86, 105, 109, 128]);

  function addElimination(out, seen, cell, digit) {
    if (!Number.isInteger(cell) || !Number.isInteger(digit)) return;
    const key = `${cell}:${digit}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ cell, digit });
  }

  function peerEliminations(cand, cells, digits) {
    const sourceSet = new Set(cells);
    const out = [];
    const seen = new Set();

    for (const digit of digits) {
      const sourceCells = cells.filter(cell => (cand[cell] || []).includes(digit));
      if (!sourceCells.length) continue;

      for (let cell = 0; cell < 81; cell++) {
        if (sourceSet.has(cell) || !(cand[cell] || []).includes(digit)) continue;
        if (!sourceCells.every(source => core.peersOf(source).includes(cell))) continue;
        addElimination(out, seen, cell, digit);
      }
    }

    return out;
  }

  function appendRccEliminations(cand, record, out, seen, hidden) {
    for (const rcc of record.rccList || []) {
      if (hidden) {
        for (const digit of rcc.rccDigits || []) {
          for (const cell of rcc.rccPotentialElim || []) {
            if ((cand[cell] || []).includes(digit)) addElimination(out, seen, cell, digit);
          }
        }
        continue;
      }

      const digit = Number(rcc.rccDigit ?? rcc.digit);
      if (!Number.isInteger(digit)) continue;
      for (const cell of rcc.rccPotentialElim || []) {
        if ((cand[cell] || []).includes(digit)) addElimination(out, seen, cell, digit);
      }
    }
  }

  function isLocked(record, cells) {
    const powerSet = Number(record.PowerSet);
    const sector = Number(record.alsSector ?? record.ahsSector);
    const size = cells.length;
    if (!Number.isInteger(powerSet)) return false;
    if (size === 2) {
      return sector < 18 ? ROW_COL_PAIRS.has(powerSet) : BOX_PAIRS.has(powerSet);
    }
    if (size === 3) {
      return sector < 18 ? ROW_COL_TRIPS.has(powerSet) : BOX_TRIPS.has(powerSet);
    }
    return false;
  }

  function buildNakedReport(cand, als) {
    const cells = [...(als.alsAllCells || [])];
    const digits = [...(als.alsDigits || [])].sort((a, b) => a - b);
    const out = [];
    const seen = new Set();

    for (const item of peerEliminations(cand, cells, digits)) {
      addElimination(out, seen, item.cell, item.digit);
    }
    appendRccEliminations(cand, als, out, seen, false);

    return {
      kind: 'naked',
      size: cells.length,
      digits,
      cells,
      sector: als.alsSector,
      locked: isLocked(als, cells),
      removals: out,
      source: als,
    };
  }

  function buildHiddenReport(cand, ahs) {
    const cells = [...(ahs.ahsAllCells || [])];
    const digits = [...(ahs.ahsDigits || [])].sort((a, b) => a - b);
    const selected = new Set(digits);
    const out = [];
    const seen = new Set();

    for (const cell of cells) {
      for (const digit of cand[cell] || []) {
        if (!selected.has(digit)) addElimination(out, seen, cell, digit);
      }
    }
    for (const item of peerEliminations(cand, cells, digits)) {
      addElimination(out, seen, item.cell, item.digit);
    }
    appendRccEliminations(cand, ahs, out, seen, true);

    return {
      kind: 'hidden',
      size: digits.length,
      digits,
      cells,
      sector: ahs.ahsSector,
      locked: isLocked(ahs, cells),
      removals: out,
      source: ahs,
    };
  }

  function findGenericSubsetReports(cand, options = {}) {
    const kind = options.kind === 'hidden' ? 'hidden' : 'naked';
    const minSize = Number.isInteger(options.minSize) ? Math.max(1, options.minSize) : 1;
    const maxSize = Number.isInteger(options.maxSize) ? Math.min(9, options.maxSize) : 9;
    const maxSizeDOF = Number.isInteger(options.maxSizeDOF) ? Math.max(0, Math.min(8, options.maxSizeDOF)) : 8;
    const maxSizeFox = Number.isInteger(options.maxSizeFox) ? Math.max(0, Math.min(8, options.maxSizeFox)) : 7;
    const maxAhsSize = Number.isInteger(options.maxAhsSize) ? Math.max(0, Math.min(8, options.maxAhsSize)) : 8;
    const records = kind === 'naked'
      ? (options.alsList || core.alsConstructor(cand, { maxSizeDOF, maxSizeFox }))
      : (options.ahsList || core.ahsConstructor(cand, { maxSize: maxAhsSize, maxSizeFox }));

    return records
      .filter(record => Number(record[kind === 'naked' ? 'alsDOF' : 'ahsDOF']) === 0)
      .map(record => kind === 'naked'
        ? buildNakedReport(cand, record)
        : buildHiddenReport(cand, record))
      .filter(report => report.size >= minSize && report.size <= maxSize)
      .filter(report => report.removals.length > 0);
  }

  function subsetName(kind, size, locked) {
    const names = ['Single', 'Pair', 'Triple', 'Quad', 'Quintuple', 'Sextuple', 'Septuple', 'Octuple', 'Nontuple'];
    const label = names[size - 1] || `${size}-set`;
    return `${locked ? 'Locked ' : ''}${kind === 'hidden' ? 'Hidden' : 'Naked'} ${label}`;
  }

  function subsetStep(cand, options = {}) {
    const kind = options.kind === 'hidden' ? 'hidden' : 'naked';
    const reports = findGenericSubsetReports(cand, {
      ...options,
      kind,
      minSize: options.size || 1,
      maxSize: options.size || 8,
      maxSizeDOF: options.size ? options.size - 1 : options.maxSizeDOF,
      maxAhsSize: options.size ? options.size - 1 : options.maxAhsSize,
      maxSizeFox: options.size ? options.size - 1 : options.maxSizeFox,
    });
    const report = reports[0];
    if (!report) return null;

    const sectorType = report.sector < 9 ? 'row'
      : report.sector < 18 ? 'col'
        : 'box';
    const sectorIndex = report.sector < 9 ? report.sector
      : report.sector < 18 ? report.sector - 9
        : report.sector - 18;
    const title = subsetName(kind, report.size, report.locked);
    return {
      tech: `${kind}-${['single', 'pair', 'triple', 'quad', 'quintuple', 'sextuple', 'septuple', 'octuple', 'nontuple'][report.size - 1] || `${report.size}-set`}`,
      desc: `${title}: (${report.digits.join('')}) ${core.cellGroupName(report.cells)} `
        + `in ${core.sectorGroupName([report.sector])} => ${core.formatRemovals(report.removals)}`,
      elim: { items: report.removals },
      digits: report.digits,
      at: report.cells,
      base: { type: sectorType, indices: [sectorIndex] },
      vertices: report.cells,
      genericSubset: report,
    };
  }

  core.findGenericSubsetReports = findGenericSubsetReports;
  core.genericSubsetStep = subsetStep;
})(globalThis);
