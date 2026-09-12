(function (global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before mini-sectors-core.js');

  const { Rsec, Csec, Bsec } = core;
  if (!Rsec || !Csec || !Bsec) throw new Error('StormDoku sector tables are required for mini-sectors-core.js');

  function emptyTable() {
    return Array.from({ length: 4 }, () =>
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set())
      )
    );
  }

  function buildMiniSectors(cand) {
    const RCBnbp = emptyTable();
    const digitCells = Array.from({ length: 9 }, () => []);

    for (let cell = 0; cell < 81; cell++) {
      const row = core.Rx[cell];
      const col = core.Cy[cell];
      const box = core.Bxy[cell];
      for (const digit of cand[cell] || []) {
        if (digit < 1 || digit > 9) continue;
        const d = digit - 1;
        digitCells[d].push(cell);
        RCBnbp[0][row][d].add(Bsec[box]);
        RCBnbp[1][col][d].add(Bsec[box]);
        RCBnbp[2][box][d].add(Rsec[row]);
        RCBnbp[3][box][d].add(Csec[col]);
      }
    }

    return { RCBnbp, digitCells };
  }

  core.Rsec = Rsec;
  core.Csec = Csec;
  core.Bsec = Bsec;
  core.buildMiniSectors = buildMiniSectors;
  core.buildMiniSectorTables = buildMiniSectors;
})(globalThis);
