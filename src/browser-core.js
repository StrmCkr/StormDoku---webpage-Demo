(function (global) {
  'use strict';

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const Rx = [
    0,0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,1, 2,2,2,2,2,2,2,2,2,
    3,3,3,3,3,3,3,3,3, 4,4,4,4,4,4,4,4,4, 5,5,5,5,5,5,5,5,5,
    6,6,6,6,6,6,6,6,6, 7,7,7,7,7,7,7,7,7, 8,8,8,8,8,8,8,8,8
  ];
  const Cy = [
    0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8,
    0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8,
    0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8
  ];
  const Bxy = [
    0,0,0,1,1,1,2,2,2, 0,0,0,1,1,1,2,2,2, 0,0,0,1,1,1,2,2,2,
    3,3,3,4,4,4,5,5,5, 3,3,3,4,4,4,5,5,5, 3,3,3,4,4,4,5,5,5,
    6,6,6,7,7,7,8,8,8, 6,6,6,7,7,7,8,8,8, 6,6,6,7,7,7,8,8,8
  ];
  const BxyN = [
    0,1,2,0,1,2,0,1,2, 3,4,5,3,4,5,3,4,5, 6,7,8,6,7,8,6,7,8,
    0,1,2,0,1,2,0,1,2, 3,4,5,3,4,5,3,4,5, 6,7,8,6,7,8,6,7,8,
    0,1,2,0,1,2,0,1,2, 3,4,5,3,4,5,3,4,5, 6,7,8,6,7,8,6,7,8
  ];
  const Rset = [
    [0,1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16,17],[18,19,20,21,22,23,24,25,26],
    [27,28,29,30,31,32,33,34,35],[36,37,38,39,40,41,42,43,44],[45,46,47,48,49,50,51,52,53],
    [54,55,56,57,58,59,60,61,62],[63,64,65,66,67,68,69,70,71],[72,73,74,75,76,77,78,79,80]
  ];
  const Cset = [
    [0,9,18,27,36,45,54,63,72],[1,10,19,28,37,46,55,64,73],[2,11,20,29,38,47,56,65,74],
    [3,12,21,30,39,48,57,66,75],[4,13,22,31,40,49,58,67,76],[5,14,23,32,41,50,59,68,77],
    [6,15,24,33,42,51,60,69,78],[7,16,25,34,43,52,61,70,79],[8,17,26,35,44,53,62,71,80]
  ];
  const Bset = [
    [0,1,2,9,10,11,18,19,20],[3,4,5,12,13,14,21,22,23],[6,7,8,15,16,17,24,25,26],
    [27,28,29,36,37,38,45,46,47],[30,31,32,39,40,41,48,49,50],[33,34,35,42,43,44,51,52,53],
    [54,55,56,63,64,65,72,73,74],[57,58,59,66,67,68,75,76,77],[60,61,62,69,70,71,78,79,80]
  ];
  const Rsec = [0,1,2,3,4,5,6,7,8];
  const Csec = [9,10,11,12,13,14,15,16,17];
  const Bsec = [18,19,20,21,22,23,24,25,26];

  const ROWS = Rset;
  const COLS = Cset;
  const BOXES = Bset;
  const CLASSIC_UNITS = [...ROWS, ...COLS, ...BOXES];
  const UNITS = [...CLASSIC_UNITS];

  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0;
    const c = i % 9;
    const b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
    const p = (r % 3) * 3 + (c % 3);
    if (Rx[i] !== r || Cy[i] !== c || Bxy[i] !== b || BxyN[i] !== p) throw new Error(`cardinals mismatch at cell ${i}`);
    if (Rset[r][c] !== i || Cset[c][r] !== i || Bset[b][p] !== i) throw new Error(`cardinals set mismatch at cell ${i}`);
  }

  const PEERS = Array.from({ length: 81 }, (_, cell) => {
    const peers = new Set();
    for (const unit of UNITS) {
      if (!unit.includes(cell)) continue;
      for (const other of unit) if (other !== cell) peers.add(other);
    }
    return [...peers];
  });

  const VARIANT_UNITS = {
    diagonal: [[0,10,20,30,40,50,60,70,80]],
    antiDiagonal: [[8,16,24,32,40,48,56,64,72]],
    // Windoku's four highlighted regions and five uncoloured disjoint sectors.
    // All nine are genuine 9-cell units; the first four are only a visual
    // distinction for the board.
    windoku: [
      [10,11,12,19,20,21,28,29,30],
      [14,15,16,23,24,25,32,33,34],
      [46,47,48,55,56,57,64,65,66],
      [50,51,52,59,60,61,68,69,70],
      [0,4,8,36,40,44,72,76,80],
      [1,2,3,37,38,39,73,74,75],
      [5,6,7,41,42,43,77,78,79],
      [9,13,17,18,22,26,27,31,35],
      [45,49,53,54,58,62,63,67,71],
    ],
  };
  const VARIANT_UNIT_NAMES = {
    diagonal: ['D1'],
    antiDiagonal: ['AD1'],
    windoku: ['W1', 'W2', 'W3', 'W4', 'WD1', 'WD2', 'WD3', 'WD4', 'WD5'],
  };
  const uniqueEdges = (deltas, predicate = () => true) => {
    const edges = [];
    const seen = new Set();
    for (let cell = 0; cell < 81; cell += 1) {
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      for (const [dr, dc] of deltas) {
        const nextRow = row + dr;
        const nextCol = col + dc;
        if (nextRow < 0 || nextRow >= 9 || nextCol < 0 || nextCol >= 9) continue;
        const other = nextRow * 9 + nextCol;
        if (!predicate(row, col, nextRow, nextCol)) continue;
        const a = Math.min(cell, other);
        const b = Math.max(cell, other);
        const key = `${a}:${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([a, b]);
      }
    }
    return edges;
  };
  const ANTI_KING_EDGES = uniqueEdges([
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ]);
  const ANTI_KNIGHT_EDGES = uniqueEdges([
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ]);
  const NON_CONSECUTIVE_EDGES = uniqueEdges([
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ]);
  const variantState = {
    diagonal: false,
    antiDiagonal: false,
    windoku: false,
    antiKing: false,
    antiKnight: false,
    nonConsecutive: false,
  };

  function configureVariants(options = {}) {
    variantState.diagonal = options.diagonal === true;
    variantState.antiDiagonal = options.antiDiagonal === true;
    variantState.windoku = options.windoku === true;
    variantState.antiKing = options.antiKing === true;
    variantState.antiKnight = options.antiKnight === true;
    variantState.nonConsecutive = options.nonConsecutive === true;
    const extraUnits = Object.entries(VARIANT_UNITS)
      .filter(([name]) => variantState[name])
      .flatMap(([, units]) => units);
    UNITS.splice(0, UNITS.length, ...CLASSIC_UNITS, ...extraUnits);
    for (let cell = 0; cell < 81; cell += 1) {
      const peers = new Set();
      for (const unit of UNITS) {
        if (!unit.includes(cell)) continue;
        for (const other of unit) if (other !== cell) peers.add(other);
      }
      if (variantState.antiKing) {
        for (const [a, b] of ANTI_KING_EDGES) {
          if (a === cell) peers.add(b);
          if (b === cell) peers.add(a);
        }
      }
      if (variantState.antiKnight) {
        for (const [a, b] of ANTI_KNIGHT_EDGES) {
          if (a === cell) peers.add(b);
          if (b === cell) peers.add(a);
        }
      }
      PEERS[cell] = [...peers];
    }
    return { ...variantState };
  }

  function getVariantSettings() {
    return { ...variantState };
  }

  function variantUnitName(sector) {
    if (sector < CLASSIC_UNITS.length) return null;
    let offset = CLASSIC_UNITS.length;
    for (const [name, units] of Object.entries(VARIANT_UNITS)) {
      if (!variantState[name]) continue;
      if (sector < offset + units.length) return VARIANT_UNIT_NAMES[name][sector - offset];
      offset += units.length;
    }
    return null;
  }

  const POPC = new Uint8Array(512);
  for (let i = 1; i < POPC.length; i++) POPC[i] = POPC[i >> 1] + (i & 1);

  const IDX = new Int8Array(512);
  for (let i = 0; i < 9; i++) IDX[1 << i] = i;

  const SUBSET_NAMES = ['single', 'pair', 'triple', 'quad', 'quintuple', 'sextuple', 'septuple', 'octuple', 'nontuple'];
  const NAKED_TECH = Object.fromEntries(SUBSET_NAMES.map((name, index) => [index + 1, `naked-${name}`]));
  const HIDDEN_TECH = Object.fromEntries(SUBSET_NAMES.map((name, index) => [index + 1, `hidden-${name}`]));
  const FISH_NAME = {
    2: 'X-Wing', 3: 'SwordFish', 4: 'JellyFish', 5: 'StarFish {Squirmbag}',
    6: 'Whale', 7: 'Leviathan', 8: 'Kraken', 9: 'Colossus',
  };
  const COMBOS = Object.fromEntries(Array.from({ length: 9 }, (_, index) => [index + 1, combosIdx(index + 1)]));
  const TECH_NAME = {
    'last-man-standing': 'Last Man Standing',
    'naked-single': 'Naked Single',
    'hidden-single': 'Hidden Single',
    'naked-pair': 'Naked Pair',
    'hidden-pair': 'Hidden Pair',
    'naked-triple': 'Naked Triple',
    'hidden-triple': 'Hidden Triple',
    'naked-quad': 'Naked Quad',
    'hidden-quad': 'Hidden Quad',
    pointing: 'Box - Line Reduction',
    claiming: 'Box - Line Reduction',
    fish: 'Fish',
  };

  function peersOf(cell) {
    return PEERS[cell] || [];
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function candidatesFor(grid, cell) {
    if (grid[cell]) return [];
    const used = new Set(PEERS[cell].map(peer => grid[peer]));
    const adjacent = variantState.nonConsecutive
      ? NON_CONSECUTIVE_EDGES
        .flatMap(([a, b]) => a === cell ? [grid[b]] : b === cell ? [grid[a]] : [])
        .filter(Boolean)
      : [];
    const adjacentSet = new Set(adjacent);
    return DIGITS.filter(digit => !used.has(digit)
      && (!variantState.nonConsecutive
        || !adjacentSet.has(digit - 1) && !adjacentSet.has(digit + 1)));
  }

  function allCandidates(grid) {
    return grid.map((value, cell) => (value ? [] : candidatesFor(grid, cell)));
  }

  function canPlace(grid, cell, digit) {
    if (!PEERS[cell].every(peer => grid[peer] !== digit)) return false;
    if (!variantState.nonConsecutive) return true;
    return NON_CONSECUTIVE_EDGES.every(([a, b]) => {
      if (a !== cell && b !== cell) return true;
      const other = a === cell ? grid[b] : grid[a];
      return !other || Math.abs(other - digit) !== 1;
    });
  }

  function hasConflicts(grid) {
    for (let cell = 0; cell < 81; cell += 1) {
      if (grid[cell] && !canPlace(grid, cell, grid[cell])) return true;
    }
    return false;
  }

  function countSolutions(grid, limit = 2) {
    if (hasConflicts(grid)) return 0;
    let bestCount = Infinity;
    let bestCell = -1;

    for (let cell = 0; cell < 81; cell++) {
      if (grid[cell]) continue;
      const count = candidatesFor(grid, cell).length;
      if (count < bestCount) {
        bestCount = count;
        bestCell = cell;
        if (count <= 1) break;
      }
    }

    if (bestCell === -1) return 1;
    if (bestCount === 0) return 0;

    let found = 0;
    for (const digit of candidatesFor(grid, bestCell)) {
      grid[bestCell] = digit;
      found += countSolutions(grid, limit - found);
      grid[bestCell] = 0;
      if (found >= limit) return found;
    }

    return found;
  }

  function solveVariantBacktracking(grid, limit = 2) {
    if (!Array.isArray(grid) || grid.length !== 81 || hasConflicts(grid)) {
      return { count: 0, solution: null };
    }

    const work = [...grid];
    const maxSolutions = Math.max(1, Math.floor(limit));
    let found = 0;
    let firstSolution = null;

    const search = () => {
      if (found >= maxSolutions) return;
      let bestCell = -1;
      let bestCandidates = null;

      for (let cell = 0; cell < 81; cell += 1) {
        if (work[cell]) continue;
        const candidates = candidatesFor(work, cell);
        if (!bestCandidates || candidates.length < bestCandidates.length) {
          bestCell = cell;
          bestCandidates = candidates;
          if (candidates.length <= 1) break;
        }
      }

      if (bestCell < 0) {
        if (!firstSolution) firstSolution = [...work];
        found += 1;
        return;
      }
      if (!bestCandidates.length) return;

      for (const digit of bestCandidates) {
        work[bestCell] = digit;
        search();
        work[bestCell] = 0;
        if (found >= maxSolutions) return;
      }
    };

    search();
    return { count: found, solution: firstSolution };
  }

  function solveDlx(grid, limit = 2) {
    if (!Array.isArray(grid) || grid.length !== 81) return { count: 0, solution: null };

    // Edge rules are at-most-one/adjacency constraints, not exact-cover
    // columns.  The DLX representation would incorrectly require every
    // Anti-King/Anti-Knight edge to contain each digit, so use the same
    // peer-aware legality checks as the ordinary solver for these variants.
    if (variantState.antiKing || variantState.antiKnight || variantState.nonConsecutive) {
      return solveVariantBacktracking(grid, limit);
    }

    const maxSolutions = Math.max(1, Math.floor(limit));
    const left = [0];
    const right = [0];
    const up = [0];
    const down = [0];
    const column = [0];
    const size = [0];
    const rowCell = [];
    const rowDigit = [];

    const extraUnitCount = UNITS.length - CLASSIC_UNITS.length;
    const antiKingConstraintStart = 324 + extraUnitCount * 9;
    const antiKingConstraintCount = variantState.antiKing ? ANTI_KING_EDGES.length * 9 : 0;
    const antiKnightConstraintStart = antiKingConstraintStart + antiKingConstraintCount;
    const antiKnightConstraintCount = variantState.antiKnight ? ANTI_KNIGHT_EDGES.length * 9 : 0;
    const nonConsecutiveConstraintStart = antiKnightConstraintStart + antiKnightConstraintCount;
    const nonConsecutiveConstraintCount = variantState.nonConsecutive ? NON_CONSECUTIVE_EDGES.length * 8 : 0;
    const constraintCount = nonConsecutiveConstraintStart + nonConsecutiveConstraintCount;
    for (let index = 1; index <= constraintCount; index++) {
      left[index] = index - 1;
      right[index] = index === constraintCount ? 0 : index + 1;
      up[index] = index;
      down[index] = index;
      column[index] = index;
      size[index] = 0;
    }

    left[0] = constraintCount;
    right[0] = 1;

    const addRow = (cell, digit, constraints) => {
      let first = -1;
      let previous = -1;

      for (const constraint of constraints) {
        const header = constraint + 1;
        const node = left.length;
        left[node] = node;
        right[node] = node;
        up[node] = up[header];
        down[node] = header;
        column[node] = header;
        size[header] += 1;
        rowCell[node] = cell;
        rowDigit[node] = digit;
        down[up[header]] = node;
        up[header] = node;

        if (first < 0) {
          first = node;
        } else {
          left[node] = previous;
          right[node] = first;
          right[previous] = node;
          left[first] = node;
        }
        previous = node;
      }
    };

    for (let cell = 0; cell < 81; cell++) {
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      for (let digit = 1; digit <= 9; digit++) {
        if (grid[cell] && grid[cell] !== digit) continue;
        const d0 = digit - 1;
        const constraints = [
          cell,
          81 + row * 9 + d0,
          162 + col * 9 + d0,
          243 + box * 9 + d0,
        ];
        for (let unitIndex = 0; unitIndex < extraUnitCount; unitIndex += 1) {
          const unit = UNITS[CLASSIC_UNITS.length + unitIndex];
          if (unit.includes(cell)) constraints.push(324 + unitIndex * 9 + d0);
        }
        if (variantState.antiKing) {
          for (let edge = 0; edge < ANTI_KING_EDGES.length; edge += 1) {
            const [a, b] = ANTI_KING_EDGES[edge];
            if (a === cell || b === cell) constraints.push(antiKingConstraintStart + edge * 9 + d0);
          }
        }
        if (variantState.antiKnight) {
          for (let edge = 0; edge < ANTI_KNIGHT_EDGES.length; edge += 1) {
            const [a, b] = ANTI_KNIGHT_EDGES[edge];
            if (a === cell || b === cell) constraints.push(antiKnightConstraintStart + edge * 9 + d0);
          }
        }
        if (variantState.nonConsecutive) {
          for (let edge = 0; edge < NON_CONSECUTIVE_EDGES.length; edge += 1) {
            const [a, b] = NON_CONSECUTIVE_EDGES[edge];
            if (a !== cell && b !== cell) continue;
            for (let lower = 1; lower <= 8; lower += 1) {
              if (digit === lower || digit === lower + 1) {
                constraints.push(nonConsecutiveConstraintStart + edge * 8 + lower - 1);
              }
            }
          }
        }
        addRow(cell, digit, constraints);
      }
    }

    const cover = header => {
      right[left[header]] = right[header];
      left[right[header]] = left[header];

      for (let rowNode = down[header]; rowNode !== header; rowNode = down[rowNode]) {
        for (let node = right[rowNode]; node !== rowNode; node = right[node]) {
          down[up[node]] = down[node];
          up[down[node]] = up[node];
          size[column[node]] -= 1;
        }
      }
    };

    const uncover = header => {
      for (let rowNode = up[header]; rowNode !== header; rowNode = up[rowNode]) {
        for (let node = left[rowNode]; node !== rowNode; node = left[node]) {
          size[column[node]] += 1;
          down[up[node]] = node;
          up[down[node]] = node;
        }
      }

      right[left[header]] = header;
      left[right[header]] = header;
    };

    let found = 0;
    let firstSolution = null;
    const selectedRows = [];
    const search = () => {
      if (found >= maxSolutions) return;
      if (right[0] === 0) {
        if (!firstSolution) {
          firstSolution = new Array(81).fill(0);
          for (const rowNode of selectedRows) firstSolution[rowCell[rowNode]] = rowDigit[rowNode];
        }
        found += 1;
        return;
      }

      let chosen = right[0];
      let smallest = size[chosen];
      for (let header = right[chosen]; header !== 0; header = right[header]) {
        if (size[header] < smallest) {
          chosen = header;
          smallest = size[header];
          if (smallest === 0) break;
        }
      }

      if (smallest === 0) return;

      cover(chosen);
      for (let rowNode = down[chosen]; rowNode !== chosen && found < maxSolutions; rowNode = down[rowNode]) {
        selectedRows.push(rowNode);
        for (let node = right[rowNode]; node !== rowNode; node = right[node]) cover(column[node]);
        search();
        for (let node = left[rowNode]; node !== rowNode; node = left[node]) uncover(column[node]);
        selectedRows.pop();
      }
      uncover(chosen);
    };

    search();
    return { count: found, solution: firstSolution };
  }

  function countSolutionsDlx(grid, limit = 2) {
    return solveDlx(grid, limit).count;
  }

  function solveFully(grid) {
    if (hasConflicts(grid)) return null;
    const work = [...grid];

    const fill = () => {
      let bestCount = Infinity;
      let bestCell = -1;
      let bestCandidates = [];

      for (let cell = 0; cell < 81; cell++) {
        if (work[cell]) continue;
        const candidates = candidatesFor(work, cell);
        if (candidates.length < bestCount) {
          bestCount = candidates.length;
          bestCell = cell;
          bestCandidates = candidates;
          if (bestCount <= 1) break;
        }
      }

      if (bestCell === -1) return true;
      if (bestCount === 0) return false;

      for (const digit of bestCandidates) {
        work[bestCell] = digit;
        if (fill()) return true;
        work[bestCell] = 0;
      }

      return false;
    };

    return fill() ? work : null;
  }

  function generate(givens = 30) {
    const targetGivens = Math.max(1, Math.min(81, Math.floor(givens)));
    const grid = new Array(81).fill(0);

    const fill = cell => {
      if (cell === 81) return true;
      for (const digit of shuffle([...DIGITS])) {
        if (!canPlace(grid, cell, digit)) continue;
        grid[cell] = digit;
        if (fill(cell + 1)) return true;
        grid[cell] = 0;
      }
      return false;
    };

    fill(0);

    const solution = [...grid];
    const puzzle = [...solution];
    let removed = 0;

    for (const cell of shuffle(Array.from({ length: 81 }, (_, i) => i))) {
      if (removed >= 81 - targetGivens) break;
      const value = puzzle[cell];
      puzzle[cell] = 0;

      if (countSolutions([...puzzle]) === 1) removed++;
      else puzzle[cell] = value;
    }

    return { puzzle, solution };
  }

  function fixedSectorState(grid = []) {
    const state = {
      cells: [],
      rows: new Array(9).fill(0),
      cols: new Array(9).fill(0),
      boxes: new Array(9).fill(0),
      units: Array.from({ length: UNITS.length }, () => 0),
    };

    const addFixed = (cell, digit) => {
      if (!digit || digit < 1 || digit > 9) return;
      const bit = 1 << (digit - 1);
      state.cells.push(cell);
      state.rows[Rx[cell]] |= bit;
      state.cols[Cy[cell]] |= bit;
      state.boxes[Bxy[cell]] |= bit;
      for (let unitIndex = 0; unitIndex < UNITS.length; unitIndex += 1) {
        if (UNITS[unitIndex].includes(cell)) state.units[unitIndex] |= bit;
      }
    };

    for (let cell = 0; cell < 81; cell++) addFixed(cell, grid[cell]);
    return state;
  }

  function buildSpaces(cand, givenGrid = []) {
    const M = Array.from({ length: UNITS.length }, () => new Array(9).fill(0));
    const given = fixedSectorState(givenGrid);

    for (let cell = 0; cell < 81; cell++) {
      for (const digit of cand[cell] || []) {
        const d0 = digit - 1;
        M[Rx[cell]][d0] |= 1 << Cy[cell];
        M[9 + Cy[cell]][d0] |= 1 << Rx[cell];
        M[18 + Bxy[cell]][d0] |= 1 << BxyN[cell];
      }
    }

    // Variant units use their own positional index. Keep the classic
    // row/column/box slots unchanged so every existing search remains stable.
    for (let unitIndex = 27; unitIndex < UNITS.length; unitIndex++) {
      for (let position = 0; position < UNITS[unitIndex].length; position++) {
        const cell = UNITS[unitIndex][position];
        for (const digit of cand[cell] || []) {
          M[unitIndex][digit - 1] |= 1 << position;
        }
      }
    }

    return { M, given };
  }

  function bits(mask) {
    const out = [];
    for (let x = mask; x; x &= x - 1) out.push(IDX[x & -x]);
    return out;
  }

  function combos(n, k) {
    const out = [];
    const cur = [];

    const rec = start => {
      if (cur.length === k) {
        out.push([...cur]);
        return;
      }

      for (let i = start; i < n; i++) {
        cur.push(i);
        rec(i + 1);
        cur.pop();
      }
    };

    rec(0);
    return out;
  }

  function combosIdx(k) {
    return combos(9, k);
  }

  function digitCombos(k) {
    return COMBOS[k].map(combo => combo.map(i => i + 1));
  }

  function houseRef(unitIndex) {
    if (unitIndex < 9) return { type: 'row', indices: [unitIndex] };
    if (unitIndex < 18) return { type: 'col', indices: [unitIndex - 9] };
    if (unitIndex < 27) return { type: 'box', indices: [unitIndex - 18] };
    const name = variantUnitName(unitIndex);
    return {
      type: name === 'D1' ? 'diagonal' : name === 'AD1' ? 'anti-diagonal' : 'variant-sector',
      indices: [unitIndex],
      name,
    };
  }

  function houseLabel(unitIndex) {
    if (unitIndex < 9) return `row ${unitIndex + 1}`;
    if (unitIndex < 18) return `column ${unitIndex - 8}`;
    if (unitIndex < 27) return `box ${unitIndex - 17}`;
    return variantUnitName(unitIndex) || `sector ${unitIndex + 1}`;
  }

  function houseRefLabel(ref) {
    if (!ref) return 'peers';

    const indexes = ref.indices.map(index => index + 1).join('/');
    if (ref.type === 'row') return ref.indices.length === 1 ? `row ${indexes}` : `rows ${indexes}`;
    if (ref.type === 'col') return ref.indices.length === 1 ? `column ${indexes}` : `columns ${indexes}`;
    if (ref.type === 'box') return ref.indices.length === 1 ? `box ${indexes}` : `boxes ${indexes}`;
    return ref.name || ref.type;
  }

  function rowOf(cell) {
    return (cell / 9) | 0;
  }

  function colOf(cell) {
    return cell % 9;
  }

  function boxOf(cell) {
    return ((rowOf(cell) / 3) | 0) * 3 + ((colOf(cell) / 3) | 0);
  }

  function boxPositionOf(cell) {
    return (rowOf(cell) % 3) * 3 + (colOf(cell) % 3);
  }

  function uniqueSorted(values) {
    return [...new Set(values)].sort((a, b) => a - b);
  }

  function cellGroupSelector(cells) {
    if (cells.length < 2) return null;

    const boxes = uniqueSorted(cells.map(boxOf));
    if (boxes.length !== 1) return null;

    const rows = uniqueSorted(cells.map(rowOf));
    const cols = uniqueSorted(cells.map(colOf));
    if (rows.length <= 1 || cols.length <= 1) return null;

    const positions = uniqueSorted(cells.map(boxPositionOf));
    return {
      label: `b${boxes[0] + 1}p${positions.map(position => position + 1).join('')}`,
      cells,
    };
  }

  function rectSelector(remaining) {
    const rows = uniqueSorted([...remaining].map(rowOf));
    let bestRows = [];
    let bestCols = [];

    for (let mask = 1; mask < (1 << rows.length); mask++) {
      const selectedRows = rows.filter((_, index) => mask & (1 << index));
      const cols = [];

      for (let col = 0; col < 9; col++) {
        if (selectedRows.every(row => remaining.has(row * 9 + col))) cols.push(col);
      }

      if (!cols.length) continue;

      const size = selectedRows.length * cols.length;
      const bestSize = bestRows.length * bestCols.length;
      const label = `r${selectedRows.map(row => row + 1).join('')}c${cols.map(col => col + 1).join('')}`;
      const bestLabel = `r${bestRows.map(row => row + 1).join('')}c${bestCols.map(col => col + 1).join('')}`;

      if (size > bestSize || (size === bestSize && label < bestLabel)) {
        bestRows = selectedRows;
        bestCols = cols;
      }
    }

    return {
      label: `r${bestRows.map(row => row + 1).join('')}c${bestCols.map(col => col + 1).join('')}`,
      cells: bestRows.flatMap(row => bestCols.map(col => row * 9 + col)),
    };
  }

  function stateGroupParts(state) {
    if (!state || !state.prev || !state.rows || !state.cols) return [];
    return [
      ...stateGroupParts(state.prev),
      `r${state.rows.map(row => row + 1).join('')}c${state.cols.map(col => col + 1).join('')}`,
    ];
  }

  function cellGroupParts(cells) {
    const start = new Set(uniqueSorted(cells));
    let toCover = start.size;
    let thisRound = [{ prev: null, rows: null, cols: null, remaining: start }];

    while (toCover > 0) {
      let nextSize = 0;
      const nextRound = [];

      for (const current of thisRound) {
        const currentCells = [...current.remaining];
        const boxGroup = cellGroupSelector(currentCells);
        if (boxGroup && boxGroup.cells.length === toCover) {
          return [...stateGroupParts(current), boxGroup.label];
        }

        const rows = uniqueSorted(currentCells.map(rowOf));
        const cols = uniqueSorted(currentCells.map(colOf));

        for (let mask = (1 << rows.length) - 1; mask > 0; mask--) {
          const selectedRows = rows.filter((_, index) => mask & (1 << index));
          const selectedCols = cols.filter(col =>
            selectedRows.every(row => current.remaining.has(row * 9 + col))
          );
          if (!selectedCols.length) continue;

          const groupSize = selectedRows.length * selectedCols.length;
          if (groupSize > nextSize) {
            nextSize = groupSize;
            nextRound.length = 0;
          }

          if (groupSize === nextSize) {
            const remaining = new Set(current.remaining);
            for (const row of selectedRows) {
              for (const col of selectedCols) remaining.delete(row * 9 + col);
            }
            nextRound.push({ prev: current, rows: selectedRows, cols: selectedCols, remaining });
          }
        }
      }

      if (!nextSize || !nextRound.length) return [rectSelector(start).label];
      thisRound = nextRound;
      toCover -= nextSize;
    }

    return stateGroupParts(thisRound[thisRound.length - 1]);
  }

  function cellGroupName(cells) {
    return cellGroupParts(cells).join(',');
  }

  function formatRemovals(items) {
    const byDigit = new Map();
    const seen = new Set();

    for (const { cell, digit } of items) {
      const key = `${cell}:${digit}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (!byDigit.has(digit)) byDigit.set(digit, new Set());
      byDigit.get(digit).add(cell);
    }

    const byCellGroup = new Map();

    for (const digit of [...byDigit.keys()].sort((a, b) => a - b)) {
      const cells = [...(byDigit.get(digit) || [])];
      for (const part of cellGroupParts(cells)) {
        if (!byCellGroup.has(part)) byCellGroup.set(part, new Set());
        byCellGroup.get(part).add(digit);
      }
    }

    return [...byCellGroup.entries()]
      .map(([cells, digits]) => `${cells}<>${[...digits].sort((a, b) => a - b).join('')}`)
      .join(', ');
  }

  function sectorGroupName(sectors) {
    let out = '';
    let lastType = -1;

    for (const sector of uniqueSorted(sectors)) {
      const variantName = variantUnitName(sector);
      if (variantName) {
        if (out) out += ',';
        out += variantName;
        lastType = -1;
        continue;
      }
      const type = sector < 9 ? 0 : sector < 18 ? 1 : sector < 27 ? 2 : sector === 27 ? 3 : 4;

      if (type !== lastType) {
        lastType = type;
        if (out) out += ',';
        out += type === 0 ? 'r' : type === 1 ? 'c' : type === 2 ? 'b' : type === 3 ? 'd' : 'a';
      }

      out += sector < 27 ? (sector % 9) + 1 : sector - 26;
    }

    return out;
  }

  function formatSubsetReport(tech, digits, cells, sector, removals) {
    return `${TECH_NAME[tech]}: (${digits.join('')}) ${cellGroupName(cells)} in ${sector} => ${formatRemovals(removals)}`;
  }

  function formatSingleReport(tech, digits, cells, removals) {
    return `${TECH_NAME[tech]}: (${digits.join('')}) ${cellGroupName(cells)} => ${formatRemovals(removals)}`;
  }

  function fishReport(name, digit, baseSectors, coverSectors, elimCells) {
    const eliminations = elimCells.map(cell => ({ cell, digit }));
    return `${name}: (${digit}) ${sectorGroupName(baseSectors)} / ${sectorGroupName(coverSectors)} => ${formatRemovals(eliminations)}`;
  }

  function peerSubsetEliminations(cand, cells, digits) {
    const sourceCellSet = new Set(cells);
    const seen = new Set();
    const eliminations = [];

    for (const digit of digits) {
      const sourceCells = cells.filter(cell => cand[cell].includes(digit));
      if (!sourceCells.length) continue;

      for (let cell = 0; cell < 81; cell++) {
        if (sourceCellSet.has(cell) || !cand[cell].includes(digit)) continue;
        if (!sourceCells.every(source => peersOf(source).includes(cell))) continue;

        const key = `${cell}:${digit}`;
        if (seen.has(key)) continue;

        seen.add(key);
        eliminations.push({ cell, digit });
      }

      if (variantState.nonConsecutive) {
        const adjacentDigits = [digit - 1, digit + 1]
          .filter(value => value >= 1 && value <= 9);
        for (const adjacent of adjacentDigits) {
          for (let cell = 0; cell < 81; cell += 1) {
            if (sourceCellSet.has(cell) || !cand[cell].includes(adjacent)) continue;
            if (!sourceCells.every(source => nonConsecutiveAdjacent(source, cell))) continue;

            const key = `${cell}:${adjacent}`;
            if (seen.has(key)) continue;
            seen.add(key);
            eliminations.push({ cell, digit: adjacent });
          }
        }
      }
    }

    return eliminations;
  }

  function nonConsecutiveAdjacent(a, b) {
    return NON_CONSECUTIVE_EDGES.some(([left, right]) =>
      (left === a && right === b) || (left === b && right === a));
  }

  function positionalHouse(h) {
    if (h < 9) return { cells: Rset[h], label: `row ${h + 1}`, ref: { type: 'row', indices: [h] } };
    if (h < 18) return { cells: Cset[h - 9], label: `column ${h - 8}`, ref: { type: 'col', indices: [h - 9] } };
    if (h < 27) return { cells: Bset[h - 18], label: `box ${h - 17}`, ref: { type: 'box', indices: [h - 18] } };
    const name = variantUnitName(h) || `sector ${h + 1}`;
    const refType = name === 'D1'
      ? 'diagonal'
      : name === 'AD1'
        ? 'anti-diagonal'
        : 'variant-sector';
    return { cells: UNITS[h], label: name, ref: { type: refType, indices: [h] } };
  }

  function nakedSingleStep(cand) {
    for (let cell = 0; cell < 81; cell++) {
      if (cand[cell].length !== 1) continue;

      const digit = cand[cell][0];
      const eliminations = peerSubsetEliminations(cand, [cell], [digit]);

      if (!eliminations.length) continue;

      return {
        tech: 'naked-single',
        desc: formatSingleReport('naked-single', [digit], [cell], eliminations),
        elim: { items: eliminations },
        digits: [digit],
        at: [cell],
        vertices: [cell],
      };
    }

    return null;
  }

  function lastManStandingStep(cand) {
    for (let cell = 0; cell < 81; cell++) {
      if (cand[cell].length !== 1) continue;

      const digit = cand[cell][0];
      if (peerSubsetEliminations(cand, [cell], [digit]).length) continue;

      return {
        tech: 'last-man-standing',
        desc: `Last Man Standing: (≧︿≦) ${cellName(cell)} = ${digit}`,
        elim: { items: [] },
        digits: [digit],
        at: [cell],
        vertices: [cell],
        promote: true,
      };
    }

    return null;
  }

  function nakedSubsetStep(cand, k) {
    if (k === 1) return nakedSingleStep(cand);

    for (let unitIndex = 0; unitIndex < UNITS.length; unitIndex++) {
      const unit = UNITS[unitIndex];
      const subsetCells = unit.filter(cell =>
        cand[cell].length >= 2 && cand[cell].length <= k
      );

      for (const selected of combos(subsetCells.length, k)) {
        const cells = selected.map(i => subsetCells[i]);
        const digits = [...new Set(cells.flatMap(cell => cand[cell]))].sort((a, b) => a - b);
        if (digits.length !== k) continue;

        const eliminations = peerSubsetEliminations(cand, cells, digits);

        if (!eliminations.length) continue;

        return {
          tech: NAKED_TECH[k],
          desc: formatSubsetReport(NAKED_TECH[k], digits, cells, houseLabel(unitIndex), eliminations),
          elim: { items: eliminations },
          digits,
          at: cells,
          base: houseRef(unitIndex),
          vertices: cells,
        };
      }
    }

    return null;
  }

  function hiddenStepM(cand, k) {
    const { M } = buildSpaces(cand);

    for (let h = 0; h < UNITS.length; h++) {
      const currentHouse = positionalHouse(h);

      for (const digits of digitCombos(k)) {
        let union = 0;
        let hasMissingDigit = false;

        for (const digit of digits) {
          const mask = M[h][digit - 1];
          if (!mask) {
            hasMissingDigit = true;
            break;
          }
          union |= mask;
        }

        if (hasMissingDigit || POPC[union] !== k) continue;

        const cells = bits(union).map(position => currentHouse.cells[position]);
        const items = [];

        for (const cell of cells) {
          for (const digit of cand[cell]) {
            if (!digits.includes(digit)) items.push({ cell, digit });
          }
        }

        items.push(...peerSubsetEliminations(cand, cells, digits));

        if (!items.length) continue;

        return {
          tech: HIDDEN_TECH[k],
          desc: formatSubsetReport(HIDDEN_TECH[k], digits, cells, currentHouse.label, items),
          elim: { items },
          digits,
          at: cells,
          base: currentHouse.ref,
          vertices: cells,
        };
      }
    }

    return null;
  }

  function hiddenSubsetStep(cand, k) {
    const hint = withActualEliminations(hiddenStepM(cand, k), cand);
    if (!hint || !hint.digits || !hint.at) return hint;

    return {
      ...hint,
      desc: formatSubsetReport(hint.tech, hint.digits, hint.at, houseRefLabel(hint.base), eliminationItems(hint.elim)),
    };
  }

  function boxLineReport(digit, base, cover, removals) {
    return `Box - Line Reduction: (${digit}) ${sectorGroupName(base)} / ${sectorGroupName(cover)} => ${formatRemovals(removals)}`;
  }

  // Variation units are houses too.  A digit confined to the intersection of
  // a diagonal/Windoku unit and a classic row, column, or box has the same
  // BLR consequence as an ordinary box-line interaction: remove it from the
  // other cells in the classic house, or from the other cells in the
  // variation unit.
  function variantBoxLineStepsM(cand) {
    const reports = [];
    for (let sector = 27; sector < UNITS.length; sector += 1) {
      const variantCells = UNITS[sector];
      const name = variantUnitName(sector);
      if (!variantCells || !name) continue;

      for (let digit = 1; digit <= 9; digit += 1) {
        const variantDigitCells = variantCells.filter(cell => cand[cell].includes(digit));
        if (!variantDigitCells.length) continue;

        for (let target = 0; target < 27; target += 1) {
          const targetCells = UNITS[target];
          const targetRef = houseRef(target);
          const variantIntersection = variantDigitCells.filter(cell => targetCells.includes(cell));
          if (variantIntersection.length === variantDigitCells.length) {
            const eliminations = targetCells
              .filter(cell => !variantCells.includes(cell) && cand[cell].includes(digit))
              .map(cell => ({ cell, digit }));
            if (eliminations.length) {
              reports.push({
                tech: 'pointing',
                desc: boxLineReport(digit, [sector], [target], eliminations),
                elim: { items: eliminations },
                digits: [digit],
                at: variantIntersection,
                base: houseRef(sector),
                cover: targetRef,
                vertices: variantIntersection,
              });
            }
          }

          const targetDigitCells = targetCells.filter(cell => cand[cell].includes(digit));
          if (!targetDigitCells.length || !targetDigitCells.every(cell => variantCells.includes(cell))) continue;

          const eliminations = variantCells
            .filter(cell => !targetCells.includes(cell) && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));
          if (eliminations.length) {
            reports.push({
              tech: 'claiming',
              desc: boxLineReport(digit, [target], [sector], eliminations),
              elim: { items: eliminations },
              digits: [digit],
              at: targetDigitCells,
              base: targetRef,
              cover: houseRef(sector),
              vertices: targetDigitCells,
            });
          }
        }
      }
    }

    return reports;
  }

  function variantBoxLineStepM(cand) {
    return variantBoxLineStepsM(cand)[0] || null;
  }

  function intersectPeerEnvelope(cells) {
    if (!cells.length) return new Set();
    const common = new Set(peersOf(cells[0]));
    for (const cell of cells.slice(1)) {
      const peers = new Set(peersOf(cell));
      for (const peer of [...common]) {
        if (!peers.has(peer)) common.delete(peer);
      }
    }
    return common;
  }

  // Anti-King/Anti-Knight do not create houses. Their BLR form is built from
  // the two sides of a sector XOR: intersect every cell's complete peer set
  // within each side, then intersect the two side results. This preserves
  // ordinary row/column/box peers while adding the active anti-chess peers.
  function antiChessBoxLineStepsM(cand) {
    if (!variantState.antiKing && !variantState.antiKnight) return null;
    const reports = [];

    const variantNames = [
      variantState.antiKing ? 'Anti-King' : null,
      variantState.antiKnight ? 'Anti-Knight' : null,
    ].filter(Boolean).join('/');

    for (let unitIndex = 0; unitIndex < UNITS.length; unitIndex += 1) {
      const unit = UNITS[unitIndex];
      for (let digit = 1; digit <= 9; digit += 1) {
        const sourceCells = unit.filter(cell => cand[cell].includes(digit));
        if (!sourceCells.length) continue;

        const leftCells = [sourceCells[0]];
        const rightCells = sourceCells.slice(1);
        if (!rightCells.length) continue;
        const leftElims = intersectPeerEnvelope(leftCells);
        const rightElims = intersectPeerEnvelope(rightCells);
        const gateElims = new Set([...leftElims].filter(cell => rightElims.has(cell)));
        const eliminations = [...gateElims]
          .filter(cell => !unit.includes(cell) && cand[cell].includes(digit))
          .map(cell => ({ cell, digit }));
        if (!eliminations.length) continue;

        const sourceRef = houseRef(unitIndex);
        reports.push({
          tech: 'pointing',
          desc: `Box - Line Reduction (${variantNames}): (${digit}) ${houseRefLabel(sourceRef)} XOR => ${formatRemovals(eliminations)}`,
          elim: { items: eliminations },
          digits: [digit],
          at: [...leftCells, ...rightCells],
          base: sourceRef,
          cover: { type: 'anti-chess', indices: [], name: variantNames },
          vertices: [...leftCells, ...rightCells],
          antiChess: true,
          antiChessGates: [{
            leftCells: [...leftCells],
            rightCells: [...rightCells],
            leftEliminations: [...leftElims],
            rightEliminations: [...rightElims],
            gateEliminations: [...gateElims],
          }],
        });
      }
    }

    return reports;
  }

  function antiChessBoxLineStepM(cand) {
    return antiChessBoxLineStepsM(cand)?.[0] || null;
  }

  // Non-Consecutive BLR for ordinary rows and columns.  The three-cell
  function nonConsecutiveLineSets() {
    return [
      ...Rset.map((cells, index) => ({ type: 'row', index, cells })),
      ...Cset.map((cells, index) => ({ type: 'col', index, cells })),
    ];
  }

  function nonConsecutiveLineReport(line, window, sourceCells, eliminations, digit, label) {
    return {
      tech: 'non-consecutive-line',
      desc: `Box - Line Reduction (Non-Consecutive): (${digit}) `
        + `${cellGroupName(window)} ${label} => ${formatRemovals(eliminations)}`,
      elim: { items: eliminations },
      digits: [digit],
      at: sourceCells,
      base: { type: line.type, indices: [line.index] },
      cover: { type: 'non-consecutive-line', indices: [], cells: window },
      vertices: sourceCells,
      variant: true,
      nonConsecutive: true,
      eri: false,
    };
  }

  // Two-cell adjacent-sector rule: N is confined to an adjacent pair in the
  // row/column, so neither cell may contain N-1 or N+1.
  function nonConsecutiveAdjacentPairStepsM(cand) {
    if (!variantState.nonConsecutive) return [];
    const reports = [];
    const seen = new Set();
    for (const line of nonConsecutiveLineSets()) {
      for (let start = 0; start <= 7; start += 1) {
        const window = line.cells.slice(start, start + 2);
        for (let digit = 1; digit <= 9; digit += 1) {
          const sourceCells = line.cells.filter(cell => cand[cell].includes(digit));
          if (sourceCells.length !== 2 || !sourceCells.every(cell => window.includes(cell))) continue;

          const adjacentDigits = [digit - 1, digit + 1]
            .filter(value => value >= 1 && value <= 9);
          const eliminations = sourceCells.flatMap(cell => adjacentDigits
            .filter(adjacent => cand[cell].includes(adjacent))
            .map(adjacent => ({ cell, digit: adjacent })));
          if (!eliminations.length) continue;

          const key = `${line.type}:${line.index}:${sourceCells.join(',')}`;
          if (seen.has(key)) continue;
          seen.add(key);
          reports.push(nonConsecutiveLineReport(
            line, window, sourceCells, eliminations, digit, 'adjacent N-pair',
          ));
        }
      }
    }
    return reports;
  }

  // Three-cell rule: N is confined to a consecutive three-cell window.  The
  // middle cell may be absent of N, but cannot contain an adjacent value.
  function nonConsecutiveTripleLineStepsM(cand) {
    if (!variantState.nonConsecutive) return [];
    const reports = [];
    const seen = new Set();
    for (const line of nonConsecutiveLineSets()) {
      for (let start = 0; start <= 6; start += 1) {
        const window = line.cells.slice(start, start + 3);
        const middleCell = window[1];
        for (let digit = 1; digit <= 9; digit += 1) {
          const sourceCells = line.cells.filter(cell => cand[cell].includes(digit));
          const windowSources = window.filter(cell => cand[cell].includes(digit));
          if (sourceCells.length !== windowSources.length
            || (sourceCells.length !== 2 && sourceCells.length !== 3)) continue;

          const adjacentPair = sourceCells.length === 2
            && Math.abs(window.indexOf(sourceCells[0]) - window.indexOf(sourceCells[1])) === 1;
          if (adjacentPair) continue;

          const adjacentDigits = [digit - 1, digit + 1]
            .filter(value => value >= 1 && value <= 9);
          const eliminations = adjacentDigits
            .filter(adjacent => cand[middleCell].includes(adjacent))
            .map(adjacent => ({ cell: middleCell, digit: adjacent }));
          if (!eliminations.length) continue;

          const key = `${line.type}:${line.index}:${sourceCells.join(',')}:${middleCell}`;
          if (seen.has(key)) continue;
          seen.add(key);
          reports.push(nonConsecutiveLineReport(
            line,
            window,
            sourceCells,
            eliminations,
            digit,
            `N-${sourceCells.length === 2 ? 'pair' : 'triple'}`,
          ));
        }
      }
    }
    return reports;
  }

  // Diagonal sectors are not physically adjacent in their listed order, so
  // use their actual non-consecutive peer intersections rather than treating
  // diagonal neighbors as a row/column window.
  function nonConsecutiveDiagonalStepsM(cand) {
    if (!variantState.nonConsecutive) return [];
    const reports = [];
    for (const name of ['D1', 'AD1']) {
      const sector = UNITS.findIndex((unit, index) => variantUnitName(index) === name);
      if (sector < 0) continue;
      const cells = UNITS[sector] || [];
      for (const sourceCount of [2, 3]) {
        for (let start = 0; start < cells.length; start += 1) {
          for (let digit = 1; digit <= 9; digit += 1) {
            const sourceCells = cells.filter(cell => cand[cell].includes(digit));
            if (sourceCells.length !== sourceCount || start !== 0) continue;
            const targets = [];
            for (let cell = 0; cell < 81; cell += 1) {
              if (sourceCells.includes(cell) || !cand[cell]?.some(value =>
                value === digit - 1 || value === digit + 1)) continue;
              if (sourceCells.every(source => nonConsecutiveAdjacent(source, cell))) targets.push(cell);
            }
            const adjacentDigits = [digit - 1, digit + 1]
              .filter(value => value >= 1 && value <= 9);
            const eliminations = targets.flatMap(cell => adjacentDigits
              .filter(value => cand[cell].includes(value))
              .map(value => ({ cell, digit: value })));
            if (!eliminations.length) continue;
            reports.push({
              tech: 'non-consecutive-line',
              desc: `Box - Line Reduction (Non-Consecutive): (${digit}) ${name} `
                + `${sourceCount === 2 ? 'N-pair' : 'N-triple'} => ${formatRemovals(eliminations)}`,
              elim: { items: eliminations },
              digits: [digit],
              at: sourceCells,
              base: { type: 'variant-sector', indices: [sector], name },
              cover: { type: 'non-consecutive-line', indices: [], cells: [...sourceCells, ...targets] },
              vertices: sourceCells,
              variant: true,
              nonConsecutive: true,
            });
            break;
          }
        }
      }
    }
    return reports;
  }

  // Non-Consecutive ALS N-sets.  A bivalent consecutive set removes both of
  // its values from visible peers; a trivalent consecutive set removes only
  // its middle value.  This is intentionally separate from the physical
  // adjacent-edge BLR rules above.
  function nonConsecutiveAlsSetStepsM(cand) {
    if (!variantState.nonConsecutive) return [];
    const reports = [];
    for (let cell = 0; cell < 81; cell += 1) {
      const values = [...(cand[cell] || [])].sort((a, b) => a - b);
      const isConsecutivePair = values.length === 2 && values[1] === values[0] + 1;
      const isGappedPair = values.length === 2 && values[1] === values[0] + 2;
      const isTriple = values.length === 3
        && values[1] === values[0] + 1
        && values[2] === values[1] + 1;
      if (!isConsecutivePair && !isGappedPair && !isTriple) continue;

      const blocked = isConsecutivePair
        ? values
        : [values[0] + 1];
      const adjacentPeers = NON_CONSECUTIVE_EDGES.flatMap(([left, right]) =>
        left === cell ? [right] : right === cell ? [left] : []);
      const eliminations = adjacentPeers.flatMap(peer => blocked
        .filter(digit => cand[peer]?.includes(digit))
        .map(digit => ({ cell: peer, digit })));
      if (!eliminations.length) continue;

      const label = isConsecutivePair
        ? 'consecutive N-pair'
        : isGappedPair
          ? 'gapped N-pair'
          : 'consecutive N-triple';
      reports.push({
        tech: 'non-consecutive-als',
        desc: `Box - Line Reduction (Non-Consecutive ALS): (${values.join('')}) `
          + `${cellName(cell)} ${label} => ${formatRemovals(eliminations)}`,
        elim: { items: eliminations },
        digits: values,
        at: [cell],
        base: { type: 'cell', indices: [cell], cells: [cell] },
        cover: { type: 'non-consecutive-als', indices: [], cells: [cell, ...adjacentPeers] },
        vertices: [cell],
        variant: true,
        nonConsecutive: true,
        als: true,
      });
    }
    return reports;
  }

  // A sector candidate outside an ALS-DOF N-set would remove the shared digit
  // from every source cell. If the remaining candidate sets have no legal
  // Sudoku/Non-Consecutive assignment, that outside sector candidate is false.
  function nonConsecutiveAlsDofStepsM(cand) {
    if (!variantState.nonConsecutive) return [];
    const reports = [];
    const seen = new Set();

    const hasLegalAssignment = (cells, remaining) => {
      const ordered = [...cells].sort((left, right) =>
        remaining.get(left).length - remaining.get(right).length);
      const assigned = new Map();
      const visit = index => {
        if (index >= ordered.length) return true;
        const cell = ordered[index];
        for (const digit of remaining.get(cell)) {
          let legal = true;
          for (const [otherCell, otherDigit] of assigned) {
            if (otherDigit === digit && peersOf(cell).includes(otherCell)) {
              legal = false;
              break;
            }
            if (nonConsecutiveAdjacent(cell, otherCell)
              && Math.abs(digit - otherDigit) === 1) {
              legal = false;
              break;
            }
          }
          if (!legal) continue;
          assigned.set(cell, digit);
          if (visit(index + 1)) return true;
          assigned.delete(cell);
        }
        return false;
      };
      return visit(0);
    };

    const combinations = (items, size, start = 0, chosen = [], output = []) => {
      if (chosen.length === size) {
        output.push([...chosen]);
        return output;
      }
      for (let index = start; index <= items.length - (size - chosen.length); index += 1) {
        chosen.push(items[index]);
        combinations(items, size, index + 1, chosen, output);
        chosen.pop();
      }
      return output;
    };

    for (let box = 0; box < 9; box += 1) {
      const sectorCells = Bset[box];
      for (let digit = 1; digit <= 9; digit += 1) {
        const digitCells = sectorCells.filter(cell => cand[cell].includes(digit));
        if (digitCells.length < 3) continue;
        const maxSize = Math.min(8, digitCells.length - 1);
        for (let sourceSize = 2; sourceSize <= maxSize; sourceSize += 1) {
          for (const sourceCells of combinations(digitCells, sourceSize)) {
            const remaining = new Map(sourceCells.map(cell => [
              cell,
              cand[cell].filter(value => value !== digit),
            ]));
            if ([...remaining.values()].some(values => !values.length)) continue;
            if (hasLegalAssignment(sourceCells, remaining)) continue;

            const eliminations = digitCells
              .filter(cell => !sourceCells.includes(cell))
              .map(cell => ({ cell, digit }));
            if (!eliminations.length) continue;

            const key = `${box}:${digit}:${sourceCells.slice().sort((a, b) => a - b).join(',')}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const boxRef = { type: 'box', indices: [box] };
            const label = sourceSize === 2 ? 'pair' : `size-${sourceSize} set`;
            reports.push({
              tech: 'non-consecutive-als-dof',
              desc: `Box - Line Reduction (Non-Consecutive ALS-DOF): N=${digit}, `
                + `${houseRefLabel(boxRef)} outside ALS-DOF ${label} `
                + `${cellGroupName(sourceCells)} => ${formatRemovals(eliminations)}`,
              elim: { items: eliminations },
              digits: [digit],
              clause: { label: 'N', digit, cells: [...sourceCells] },
              clauseLabel: 'N',
              clauseDigit: digit,
              at: sourceCells,
              base: boxRef,
              cover: { type: 'non-consecutive-als-dof', indices: [], cells: [...sourceCells, ...eliminations.map(item => item.cell)] },
              vertices: sourceCells,
              variant: true,
              nonConsecutive: true,
              alsDof: true,
            });
          }
        }
      }
    }
    return reports;
  }

  // Non-forcing ALS-DOF peer contradiction.  Evaluate the candidate clause
  // directly: remove the values that N forbids from a peer ALS.  If the ALS
  // then has fewer available values than cells, or no legal assignment under
  // the active peer/edge rules, N is impossible in the outside cell.
  function nonConsecutiveAlsDofPeerStepsM(cand) {
    if (!variantState.nonConsecutive && !variantState.antiKing && !variantState.antiKnight) {
      return [];
    }
    const reports = [];
    const seen = new Set();
    let searchBudget = 100000;
    let assignmentBudget = 5000;
    const maxPeerReports = 150;
    const adjacentByCell = Array.from({ length: 81 }, () => []);
    if (variantState.nonConsecutive) {
      for (const [left, right] of NON_CONSECUTIVE_EDGES) {
        adjacentByCell[left].push(right);
        adjacentByCell[right].push(left);
      }
    }
    const combinations = (items, size, start = 0, chosen = [], output = []) => {
      if (chosen.length === size) {
        output.push([...chosen]);
        return output;
      }
      for (let index = start; index <= items.length - (size - chosen.length); index += 1) {
        chosen.push(items[index]);
        combinations(items, size, index + 1, chosen, output);
        chosen.pop();
      }
      return output;
    };
    const hasLegalAssignment = (cells, domains) => {
      const ordered = [...cells].sort((left, right) =>
        domains.get(left).length - domains.get(right).length);
      const assigned = new Map();
      const visit = index => {
        if (--assignmentBudget < 0) return true;
        if (index >= ordered.length) return true;
        const cell = ordered[index];
        for (const digit of domains.get(cell)) {
          let legal = true;
          for (const [otherCell, otherDigit] of assigned) {
            if (otherDigit === digit && peersOf(cell).includes(otherCell)) {
              legal = false;
              break;
            }
            if (variantState.nonConsecutive
              && nonConsecutiveAdjacent(cell, otherCell)
              && Math.abs(digit - otherDigit) === 1) {
              legal = false;
              break;
            }
          }
          if (!legal) continue;
          assigned.set(cell, digit);
          if (visit(index + 1)) return true;
          assigned.delete(cell);
        }
        return false;
      };
      return visit(0);
    };

    const unitEntries = [
      ...Rset.map((cells, index) => ({ cells, type: 'row', indices: [index] })),
      ...Cset.map((cells, index) => ({ cells, type: 'column', indices: [index] })),
      ...Bset.map((cells, index) => ({ cells, type: 'box', indices: [index] })),
      ...UNITS.slice(CLASSIC_UNITS.length).map((cells, index) => ({
        cells,
        type: 'variant-sector',
        indices: [index],
        name: variantUnitName(CLASSIC_UNITS.length + index),
      })),
    ];

    for (const unitRef of unitEntries) {
      const unitCells = unitRef.cells.filter(cell => {
        const values = cand[cell] || [];
        // A fully open cell cannot participate in a useful reduced peer ALS;
        // excluding it prevents dense candidate grids from generating the
        // combinatorial full-domain cases that stall the browser.
        return values.length > 0 && values.length < 9;
      });
      // Ordinary N-Peer retains the larger ALS forms.  Only the newer
      // non-middle Gap branch is restricted below, because that is the
      // expensive extension that caused the browser stall.
      for (let sourceSize = 2; sourceSize <= Math.min(8, unitCells.length); sourceSize += 1) {
        for (const sourceCells of combinations(unitCells, sourceSize)) {
          if (--searchBudget < 0) return reports;
          const sourceSet = new Set(sourceCells);
          const sourceDigits = [...new Set(sourceCells.flatMap(cell => cand[cell] || []))];
          const dof = sourceDigits.length - sourceSize;
          if (dof !== 1 && dof !== 2) continue;
          const initialMiddles = sourceDigits.filter(digit =>
            digit > 1 && digit < 9
            && sourceDigits.includes(digit - 1)
            && sourceDigits.includes(digit + 1));

          // Only cells that can actually affect this ALS are candidates for
          // the outside N.  This avoids walking every cell of the grid for
          // every source combination.
          const originPool = new Set();
          for (const cell of sourceCells) {
            for (const peer of peersOf(cell)) originPool.add(peer);
            for (const adjacent of adjacentByCell[cell]) originPool.add(adjacent);
          }

          for (const origin of originPool) {
            if (sourceSet.has(origin)) continue;
            const originPeers = new Set(peersOf(origin));
            for (const n of cand[origin] || []) {
              // A gapped-peer reduction starts from an N that is still
              // represented in the ALS digit union.  This keeps the search
              // focused on the intended reduction (for example 9 removes
              // 9 by a peer relation and 8 by Non-Consecutive) instead of
              // testing every unrelated origin digit against every ALS.
              if (!sourceDigits.includes(n)) continue;
              // A non-middle origin is the gapped two-digit-reduction form;
              // keep that extension bounded to DOF=2.  The ordinary middle
              // form remains available for both supported DOF values.
              const gappedReduction = !initialMiddles.includes(n);
              if (gappedReduction && (dof !== 2 || sourceSize > 6)) continue;
              const reduced = new Map(sourceCells.map(cell => {
                const equalPeer = originPeers.has(cell);
                const adjacent = variantState.nonConsecutive
                  && nonConsecutiveAdjacent(origin, cell);
                const values = (cand[cell] || []).filter(value =>
                  !(equalPeer && value === n)
                  && !(adjacent && Math.abs(value - n) === 1));
                return [cell, values];
              }));
              const hasAdjacentPeer = variantState.nonConsecutive && sourceCells.some(cell =>
                nonConsecutiveAdjacent(origin, cell));
              const peerReduction = sourceCells.some(cell => {
                if (!originPeers.has(cell)) return false;
                const before = cand[cell] || [];
                const after = reduced.get(cell) || [];
                return before.includes(n) && after.length < before.length;
              });
              if (!peerReduction && !hasAdjacentPeer) continue;
              const nonConsecutiveReduction = sourceCells.some(cell => {
                if (!variantState.nonConsecutive) return false;
                if (!nonConsecutiveAdjacent(origin, cell)) return false;
                const before = cand[cell] || [];
                const after = reduced.get(cell) || [];
                return before.some(value => Math.abs(value - n) === 1)
                  && after.length < before.length;
              });
              if (!peerReduction && !nonConsecutiveReduction) continue;

              // The origin value need not itself be the middle of the ALS
              // digit set.  First apply its ordinary peer removals and its
              // non-consecutive removals, then look for the consecutive
              // middle digit in the reduced ALS (for example N=9 can remove
              // 8 and leave a 4/5/6 contradiction).
              const remainingDigits = new Set([...reduced.values()].flat());
              const consecutiveMiddles = [...remainingDigits].filter(digit =>
                digit > 1 && digit < 9
                && remainingDigits.has(digit - 1)
                && remainingDigits.has(digit + 1));
              if (!consecutiveMiddles.length) continue;
              const consecutiveSets = [...new Set(consecutiveMiddles.flatMap(digit =>
                [digit - 1, digit, digit + 1]))].sort((left, right) => left - right);
              if ([...reduced.values()].some(values => !values.length)) {
                // An empty domain is an immediate contradiction.
              } else if (remainingDigits.size >= sourceSize
                && hasLegalAssignment(sourceCells, reduced)) continue;

              const key = `${origin}:${n}:${sourceCells.join(',')}`;
              if (seen.has(key)) continue;
              seen.add(key);
              if (reports.length >= maxPeerReports) return reports;
              const removals = [{ cell: origin, digit: n }];
              reports.push({
                tech: 'non-consecutive-als-dof-peer',
                desc: `Box - Line Reduction (Non-Consecutive ALS-DOF N-Peer): `
                  + `N=(${n})${cellName(origin)} => peer ALS-DOF `
                  + `${cellGroupName(sourceCells)} ${gappedReduction ? 'gapped ' : ''}consecutive `
                  + `DOF=${dof} (${consecutiveSets.join(',')}) leaves ${sourceSize} cells `
                  + `without a legal assignment `
                  + `=> ${formatRemovals(removals)}`,
                elim: { items: removals },
                digits: [n],
                clause: { label: 'N', digit: n, cells: [...sourceCells] },
                at: [origin],
                base: unitRef,
                cover: { type: 'non-consecutive-als-dof-peer', indices: [], cells: [...sourceCells, origin] },
                vertices: sourceCells,
                alsDofPeer: true,
                gapPeer: gappedReduction,
                nonForcing: true,
                forcing: false,
                variant: true,
                nonConsecutive: variantState.nonConsecutive,
                antiKing: variantState.antiKing,
                antiKnight: variantState.antiKnight,
              });
            }
          }
        }
      }
    }
    return reports;
  }

  // Box-based non-consecutive ERI.  The ERI link builder is the authority for
  // the box geometry; this layer applies the non-consecutive consequence to
  // the 2-, 3-, 4-cell ERI forms, plus the one legal 5-cell form.  The
  // 5-cell form is valid only when the occupied I cell is the exact center
  // of a classic box.  For forms larger than the pair,
  // the crossing cell is the occupied I cell and the other N cells must all
  // be orthogonally adjacent to it.
  function nonConsecutiveEriStepsM(cand, sourceCount) {
    if (!variantState.nonConsecutive) return [];
    const core = global.StormDoku;
    if (typeof core?.findEriGeometries !== 'function') return [];
    const reports = [];
    const seen = new Set();

    for (let digit = 1; digit <= 9; digit += 1) {
      for (const geometry of core.findEriGeometries(cand, digit, { includeWindoku: true })) {
        const boxCells = [...new Set(geometry.boxCells || geometry.unitCells || [])];
        if (boxCells.length !== sourceCount) continue;

        const intersectionCell = geometry.construction?.intersectionCell;
        const intersectionOccupied = boxCells.includes(intersectionCell);
        if (intersectionOccupied !== (sourceCount >= 3)) continue;
        if (sourceCount === 5) {
          const box = geometry.box;
          if (box === undefined || intersectionCell !== Bset[box][4]) continue;
        }

        const sourceCells = boxCells.filter(cell => cell !== intersectionCell);
        if (sourceCells.length !== sourceCount - (intersectionOccupied ? 1 : 0)
          || !sourceCells.every(source => nonConsecutiveAdjacent(source, intersectionCell))) continue;

        const adjacentDigits = [digit - 1, digit + 1]
          .filter(value => value >= 1 && value <= 9);
        const eliminations = adjacentDigits
          .filter(value => cand[intersectionCell].includes(value))
          .map(value => ({ cell: intersectionCell, digit: value }));
        if (!eliminations.length) continue;

        const box = geometry.box;
        const sector = geometry.sector;
        const key = `${box ?? `s${sector}`}:${digit}:${sourceCells.slice().sort((a, b) => a - b).join(',')}:${intersectionCell}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const boxRef = box === undefined
          ? {
            type: 'variant-sector',
            indices: [sector],
            name: variantUnitName(sector),
          }
          : { type: 'box', indices: [box] };
        reports.push({
          tech: 'non-consecutive-eri',
          desc: `Box - Line Reduction (Non-Consecutive ERI): (${digit}) `
            + `${houseRefLabel(boxRef)} ${['', 'N-single', 'N-pair', 'N-triple', 'N-quad', 'N-quint'][sourceCount]} `
            + `=> ${formatRemovals(eliminations)}`,
          elim: { items: eliminations },
          digits: [digit],
          at: [...sourceCells, intersectionCell],
          base: boxRef,
          cover: {
            type: 'non-consecutive-eri',
            indices: [],
            cells: [...sourceCells, intersectionCell],
          },
          // The occupied intersection is the third N cell in the triple
          // form and must be drawn with the two ERI arms.
          vertices: [...sourceCells, intersectionCell],
          variant: true,
          nonConsecutive: true,
          eri: true,
        });
      }
    }
    return reports;
  }

  function nonConsecutiveEriPairStepsM(cand) {
    return nonConsecutiveEriStepsM(cand, 2);
  }

  function nonConsecutiveEriTripleStepsM(cand) {
    return nonConsecutiveEriStepsM(cand, 3);
  }

  function nonConsecutiveEriQuadStepsM(cand) {
    return nonConsecutiveEriStepsM(cand, 4);
  }

  function nonConsecutiveEriQuintStepsM(cand) {
    return nonConsecutiveEriStepsM(cand, 5);
  }

  function boxLineStepM(cand) {
    for (let digit = 1; digit <= 9; digit++) {
      for (let box = 0; box < 9; box++) {
        const boxCells = Bset[box].filter(cell => cand[cell].includes(digit));
        if (!boxCells.length) continue;

        const rows = uniqueSorted(boxCells.map(cell => Rx[cell]));
        if (rows.length === 1) {
          const row = rows[0];
          const eliminations = Rset[row]
            .filter(cell => Bxy[cell] !== box && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));

          if (eliminations.length) {
            return {
              tech: 'pointing',
              desc: boxLineReport(digit, [18 + box], [row], eliminations),
              elim: { items: eliminations },
              digits: [digit],
              at: boxCells,
              base: { type: 'box', indices: [box] },
              cover: { type: 'row', indices: [row] },
              vertices: boxCells,
            };
          }
        }

        for (let row = 0; row < 9; row++) {
          const rowCells = Rset[row].filter(cell => cand[cell].includes(digit));
          if (!rowCells.length || !rowCells.every(cell => Bxy[cell] === box)) continue;

          const eliminations = Bset[box]
            .filter(cell => Rx[cell] !== row && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));

          if (eliminations.length) {
            return {
              tech: 'claiming',
              desc: boxLineReport(digit, [row], [18 + box], eliminations),
              elim: { items: eliminations },
              digits: [digit],
              at: rowCells,
              base: { type: 'row', indices: [row] },
              cover: { type: 'box', indices: [box] },
              vertices: rowCells,
            };
          }
        }

        const cols = uniqueSorted(boxCells.map(cell => Cy[cell]));
        if (cols.length === 1) {
          const col = cols[0];
          const eliminations = Cset[col]
            .filter(cell => Bxy[cell] !== box && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));

          if (eliminations.length) {
            return {
              tech: 'pointing',
              desc: boxLineReport(digit, [18 + box], [9 + col], eliminations),
              elim: { items: eliminations },
              digits: [digit],
              at: boxCells,
              base: { type: 'box', indices: [box] },
              cover: { type: 'col', indices: [col] },
              vertices: boxCells,
            };
          }
        }

        for (let col = 0; col < 9; col++) {
          const colCells = Cset[col].filter(cell => cand[cell].includes(digit));
          if (!colCells.length || !colCells.every(cell => Bxy[cell] === box)) continue;

          const eliminations = Bset[box]
            .filter(cell => Cy[cell] !== col && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));

          if (eliminations.length) {
            return {
              tech: 'claiming',
              desc: boxLineReport(digit, [9 + col], [18 + box], eliminations),
              elim: { items: eliminations },
              digits: [digit],
              at: colCells,
              base: { type: 'col', indices: [col] },
              cover: { type: 'box', indices: [box] },
              vertices: colCells,
            };
          }
        }
      }
    }

    const variantStep = variantBoxLineStepM(cand);
    if (variantStep) return variantStep;
    return antiChessBoxLineStepM(cand);
  }

  function moveTypeEnabled(enabledTypes, type) {
    if (!enabledTypes) return true;
    if (typeof enabledTypes.has === 'function') return enabledTypes.has(type);
    return Array.isArray(enabledTypes) && enabledTypes.includes(type);
  }

  function fishMoveType(step) {
    const size = Number(step?.size);
    const k = Number(step?.k || 0);
    if (k > 0) return `${size}x${size}+k-fish`;
    return ({ 2: 'x-wing', 3: 'swordfish', 4: 'jellyfish' })[size] || `${size}x${size}-fish`;
  }

  function fishStepAllowed(step, enabledTypes) {
    return !!step && moveTypeEnabled(enabledTypes, fishMoveType(step));
  }

  function fishStepM(cand, sizes = [2, 3, 4], options = {}) {
    const omissionFishSearch = options.omissionFishSearch || global.StormDoku.omissionFishStep;
    const enabledTypes = options.enabledTechniques;
    const configuredMaxK = Number(options.maxK ?? 2);
    const maxK = Number.isFinite(configuredMaxK) ? Math.max(0, configuredMaxK) : 2;

    for (const size of sizes) {
      const omissionFish = omissionFishSearch?.(cand, [size], {
        ...options,
        minSize: size,
        maxSize: size,
        minK: 0,
        maxK,
        priorityMode: true,
      });
      if (fishStepAllowed(omissionFish, enabledTypes)) return omissionFish;
    }

    return null;
  }

  function fishByRows(M, d0, digit, k) {
    for (const baseRows of COMBOS[k]) {
      let coverMask = 0;
      for (const row of baseRows) coverMask |= M[row][d0];
      if (POPC[coverMask] !== k || baseRows.some(row => M[row][d0] === 0)) continue;

      const coverCols = bits(coverMask);
      const eliminations = [];

      for (const col of coverCols) {
        for (let row = 0; row < 9; row++) {
          if (!baseRows.includes(row) && (M[row][d0] & (1 << col))) {
            eliminations.push(Rset[row][col]);
          }
        }
      }

      if (!eliminations.length) continue;

      const vertices = baseRows.flatMap(row =>
        coverCols
          .filter(col => M[row][d0] & (1 << col))
          .map(col => Rset[row][col])
      );

      return {
        tech: 'fish',
        name: FISH_NAME[k],
        category: 'Basic',
        size: k,
        k: 0,
        desc: fishReport(FISH_NAME[k], digit, baseRows, coverCols.map(col => 9 + col), eliminations),
        elim: { cells: eliminations, digits: [digit] },
        digits: [digit],
        base: { type: 'row', indices: [...baseRows] },
        cover: { type: 'col', indices: coverCols },
        vertices,
      };
    }

    return null;
  }

  function fishByCols(M, d0, digit, k) {
    for (const baseCols of COMBOS[k]) {
      let coverMask = 0;
      for (const col of baseCols) coverMask |= M[9 + col][d0];
      if (POPC[coverMask] !== k || baseCols.some(col => M[9 + col][d0] === 0)) continue;

      const coverRows = bits(coverMask);
      const eliminations = [];

      for (const row of coverRows) {
        for (let col = 0; col < 9; col++) {
          if (!baseCols.includes(col) && (M[9 + col][d0] & (1 << row))) {
            eliminations.push(Cset[col][row]);
          }
        }
      }

      if (!eliminations.length) continue;

      const vertices = baseCols.flatMap(col =>
        coverRows
          .filter(row => M[9 + col][d0] & (1 << row))
          .map(row => Cset[col][row])
      );

      return {
        tech: 'fish',
        name: FISH_NAME[k],
        category: 'Basic',
        size: k,
        k: 0,
        desc: fishReport(FISH_NAME[k], digit, baseCols.map(col => 9 + col), coverRows, eliminations),
        elim: { cells: eliminations, digits: [digit] },
        digits: [digit],
        base: { type: 'col', indices: [...baseCols] },
        cover: { type: 'row', indices: coverRows },
        vertices,
      };
    }

    return null;
  }

  function fishStep(cand, sizes = [2, 3, 4], options = {}) {
    return withActualEliminations(fishStepM(cand, sizes, options), cand);
  }

  function boxLineStep(cand) {
    // The fast solver path must respect the BLR hierarchy instead of building
    // every report (including the expensive Gap/N-Peer pass) before choosing
    // one. The exhaustive list remains available through findBoxLineReports.
    const stages = [
      () => boxLineStepM(cand),
      () => variantBoxLineStepM(cand),
      () => antiChessBoxLineStepM(cand),
      () => nonConsecutiveAdjacentPairStepsM(cand)[0],
      () => nonConsecutiveTripleLineStepsM(cand)[0],
      () => nonConsecutiveDiagonalStepsM(cand)[0],
      () => nonConsecutiveEriPairStepsM(cand)[0],
      () => nonConsecutiveEriTripleStepsM(cand)[0],
      () => nonConsecutiveEriQuadStepsM(cand)[0],
      () => nonConsecutiveEriQuintStepsM(cand)[0],
      () => nonConsecutiveAlsSetStepsM(cand)[0],
      () => nonConsecutiveAlsDofStepsM(cand)[0],
      () => nonConsecutiveAlsDofPeerStepsM(cand)[0],
    ];
    for (const findStage of stages) {
      const step = findStage();
      if (step) return withActualEliminations(step, cand);
    }
    return null;
  }

  // The hierarchy uses boxLineStep() because it must return one deterministic
  // move.  The manual BLR panel needs the complete classic list, though, so
  // keep that reporting search separate from the hierarchy path.
  function findBoxLineReports(cand) {
    const reports = [];
    for (let digit = 1; digit <= 9; digit += 1) {
      for (let box = 0; box < 9; box += 1) {
        const boxCells = Bset[box].filter(cell => cand[cell].includes(digit));
        if (!boxCells.length) continue;

        const rows = uniqueSorted(boxCells.map(cell => Rx[cell]));
        if (rows.length === 1) {
          const row = rows[0];
          const eliminations = Rset[row]
            .filter(cell => Bxy[cell] !== box && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));
          if (eliminations.length) {
            const base = { type: 'box', indices: [box] };
            const cover = { type: 'row', indices: [row] };
            reports.push({
              tech: 'pointing',
              desc: boxLineReport(digit, [18 + box], [row], eliminations),
              elim: { items: eliminations }, digits: [digit], at: boxCells,
              base, cover, vertices: boxCells,
            });
          }
        }

        for (let row = 0; row < 9; row += 1) {
          const rowCells = Rset[row].filter(cell => cand[cell].includes(digit));
          if (!rowCells.length || !rowCells.every(cell => Bxy[cell] === box)) continue;
          const eliminations = Bset[box]
            .filter(cell => Rx[cell] !== row && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));
          if (eliminations.length) {
            const base = { type: 'row', indices: [row] };
            const cover = { type: 'box', indices: [box] };
            reports.push({
              tech: 'claiming',
              desc: boxLineReport(digit, [row], [18 + box], eliminations),
              elim: { items: eliminations }, digits: [digit], at: rowCells,
              base, cover, vertices: rowCells,
            });
          }
        }

        const cols = uniqueSorted(boxCells.map(cell => Cy[cell]));
        if (cols.length === 1) {
          const col = cols[0];
          const eliminations = Cset[col]
            .filter(cell => Bxy[cell] !== box && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));
          if (eliminations.length) {
            const base = { type: 'box', indices: [box] };
            const cover = { type: 'col', indices: [col] };
            reports.push({
              tech: 'pointing',
              desc: boxLineReport(digit, [18 + box], [9 + col], eliminations),
              elim: { items: eliminations }, digits: [digit], at: boxCells,
              base, cover, vertices: boxCells,
            });
          }
        }

        for (let col = 0; col < 9; col += 1) {
          const colCells = Cset[col].filter(cell => cand[cell].includes(digit));
          if (!colCells.length || !colCells.every(cell => Bxy[cell] === box)) continue;
          const eliminations = Bset[box]
            .filter(cell => Cy[cell] !== col && cand[cell].includes(digit))
            .map(cell => ({ cell, digit }));
          if (eliminations.length) {
            const base = { type: 'col', indices: [col] };
            const cover = { type: 'box', indices: [box] };
            reports.push({
              tech: 'claiming',
              desc: boxLineReport(digit, [9 + col], [18 + box], eliminations),
              elim: { items: eliminations }, digits: [digit], at: colCells,
              base, cover, vertices: colCells,
            });
          }
        }
      }
    }

    // Keep BLR families in increasing complexity order.  The report list is
    // also the stable tie-break order used by Next and the manual BLR panel.
    // Classic pointing/claiming was collected above.
    reports.push(...variantBoxLineStepsM(cand).map(step => ({ ...step, variant: true })));
    reports.push(...(antiChessBoxLineStepsM(cand) || []).map(step => ({ ...step, variant: true })));
    reports.push(...nonConsecutiveAdjacentPairStepsM(cand));
    reports.push(...nonConsecutiveTripleLineStepsM(cand));
    reports.push(...nonConsecutiveDiagonalStepsM(cand));
    reports.push(...nonConsecutiveEriPairStepsM(cand));
    reports.push(...nonConsecutiveEriTripleStepsM(cand));
    reports.push(...nonConsecutiveEriQuadStepsM(cand));
    reports.push(...nonConsecutiveEriQuintStepsM(cand));
    reports.push(...nonConsecutiveAlsSetStepsM(cand));
    reports.push(...nonConsecutiveAlsDofStepsM(cand));
    // Split ordinary N-Peer and Gap reports for hierarchy/display purposes,
    // while retaining one shared enumeration so the expensive search is not
    // performed twice.
    const alsDofPeerReports = nonConsecutiveAlsDofPeerStepsM(cand);
    reports.push(...alsDofPeerReports.filter(step => step.gapPeer !== true));
    reports.push(...alsDofPeerReports.filter(step => step.gapPeer === true));
    return reports.map(step => withActualEliminations(step, cand));
  }

  function subsetStepForSizes(cand, sizes, enabledTypes = null) {
    for (const k of sizes) {
      const hiddenType = HIDDEN_TECH[k];
      if (moveTypeEnabled(enabledTypes, hiddenType)) {
        const hidden = hiddenSubsetStep(cand, k);
        if (hidden) return hidden;

        // The generic ALS/AHS report remains available as a fallback, but it
        // must not run before the bounded native subset search. On dense
        // candidate grids its constructor can enumerate a very large number
        // of sets before returning the same ordinary subset result.
        if (k === 1) {
          const genericHidden = global.StormDoku.genericSubsetStep?.(cand, {
            kind: 'hidden',
            size: k,
          });
          if (genericHidden) return genericHidden;
        }
      }

      const nakedType = NAKED_TECH[k];
      if (moveTypeEnabled(enabledTypes, nakedType)) {
        const naked = withActualEliminations(nakedSubsetStep(cand, k), cand);
        if (naked) return naked;

        if (k === 1) {
          const genericNaked = global.StormDoku.genericSubsetStep?.(cand, {
            kind: 'naked',
            size: k,
          });
          if (genericNaked) return genericNaked;
        }
      }
    }

    return null;
  }

  function subsetStep(cand, options = {}) {
    return subsetStepForSizes(cand, [1, 2, 3, 4, 5, 6, 7, 8, 9], options.enabledTechniques);
  }

  function subsetOrFishStep(cand, fishOptions = {}) {
    const enabledTypes = fishOptions.enabledTechniques;
    if (moveTypeEnabled(enabledTypes, 'last-man-standing')) {
      const lastMan = lastManStandingStep(cand);
      if (lastMan) return lastMan;
    }
    const singles = subsetStepForSizes(cand, [1], enabledTypes);
    if (singles) return singles;

    if (moveTypeEnabled(enabledTypes, 'box-line')) {
      const boxLine = boxLineStep(cand);
      if (boxLine) return boxLine;
    }

    const fishSizes = Array.isArray(fishOptions.fishSizes)
      ? fishOptions.fishSizes
      : [2, 3, 4, 5, 6, 7, 8, 9];
    for (const size of fishSizes) {
      const subset = subsetStepForSizes(cand, [size], enabledTypes);
      if (subset) return subset;

      const fish = fishStep(cand, [size], fishOptions);
      if (fish) return fish;
    }

    return null;
  }

  function hintFor(grid, fishOptions = {}) {
    return subsetOrFishStep(allCandidates(grid), { ...fishOptions, grid });
  }

  function eliminationItems(elim, cand) {
    const items = elim.items
      ? elim.items
      : elim.cells.flatMap(cell => elim.digits.map(digit => ({ cell, digit })));

    return items.filter(({ cell, digit }) => !cand || (cand[cell] || []).includes(digit));
  }

  function hasEliminations(hint, cand) {
    return hint !== null && eliminationItems(hint.elim, cand).length > 0;
  }

  function applyEliminations(cand, elim) {
    const removed = [];

    for (const { cell, digit } of eliminationItems(elim, cand)) {
      const next = cand[cell].filter(value => value !== digit);
      if (next.length === cand[cell].length) continue;
      cand[cell] = next;
      removed.push({ cell, digit });
    }

    return removed;
  }

  function cloneCandidates(cand) {
    return cand.map(cell => [...cell]);
  }

  function reduceCandidates(cand, maxCycles = 100, fishOptions = {}) {
    return reduceCandidatesInPlace(cloneCandidates(cand), maxCycles, fishOptions);
  }

  function reduceCandidatesInPlace(cand, maxCycles = 100, fishOptions = {}) {
    const steps = [];
    const removed = [];

    for (let cycle = 0; cycle < maxCycles; cycle++) {
      const step = subsetOrFishStep(cand, fishOptions);
      if (!step) return { cand, steps, removed, cycles: steps.length };

      const cycleRemoved = applyEliminations(cand, step.elim);
      if (!cycleRemoved.length) return { cand, steps, removed, cycles: steps.length };

      steps.push({ ...step, elim: { items: cycleRemoved } });
      removed.push(...cycleRemoved);
    }

    return { cand, steps, removed, cycles: steps.length };
  }

  function withActualEliminations(hint, cand) {
    if (!hint) return null;

    const items = eliminationItems(hint.elim, cand);
    if (!items.length) return null;

    if (hint.elim.items) return { ...hint, elim: { items } };

    const digits = [...new Set(items.map(item => item.digit))].sort((a, b) => a - b);
    const cells = [...new Set(items.map(item => item.cell))].sort((a, b) => a - b);

    return digits.length === 1
      ? { ...hint, elim: { cells, digits } }
      : { ...hint, elim: { items } };
  }

  function encode(grid) {
    return grid.map(value => (value ? String(value) : '.')).join('');
  }

  function decode(text) {
    const clean = String(text ?? '').replace(/[\s|,;:_-]+/g, '');
    if (!/^[0-9.]{81}$/.test(clean)) return null;
    const grid = clean.split('').map(ch => (ch >= '1' && ch <= '9' ? Number(ch) : 0));
    return grid.some(Boolean) ? grid : null;
  }

  function singletonMask(mask, position) {
    return mask === (1 << position);
  }

  function parse729Bits(text) {
    const clean = String(text ?? '').replace(/[\s,;|:_-]+/g, '');
    if (!/^[01]{729}$/.test(clean)) return null;
    return clean.split('').map(Number);
  }

  function parseCandidateGridText(text) {
    const source = String(text ?? '').trim();
    const cells = source.split(/\s+/);
    const cellTokens = cells.length === 81 && cells.every(token => /^[1-9]+$/.test(token))
      ? Array.from({ length: 9 }, (_, row) => cells.slice(row * 9, row * 9 + 9))
      : null;
    const rows = cellTokens || source.split(/\r?\n/)
      .map(line => line.match(/[1-9]+/g) || [])
      .filter(tokens => tokens.length === 9);
    if (rows.length !== 9) return null;

    return rows.flatMap(tokens => tokens.flatMap(token =>
      Array.from({ length: 9 }, (_, digit) => token.includes(String(digit + 1)) ? 1 : 0),
    ));
  }

  // Parse cell-major 729-bit candidate data and infer only space-proven givens.
  function parse729Data(text) {
    const bits = parse729Bits(text) || parseCandidateGridText(text);
    if (!bits) return null;

    const sourceCandidates = Array.from({ length: 81 }, (_, cell) =>
      bits.slice(cell * 9, cell * 9 + 9)
        .map((present, digit) => present ? digit + 1 : 0)
        .filter(Boolean),
    );
    const sourceSpaces = buildSpaces(sourceCandidates).M;
    const candidates = sourceCandidates.map(values => [...values]);
    const grid = new Array(81).fill(0);
    const conflicts = [];

    for (let cell = 0; cell < 81; cell++) {
      const forced = sourceCandidates[cell].filter(digit => {
        const d0 = digit - 1;
        const row = Math.floor(cell / 9);
        const col = cell % 9;
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        const boxPosition = (row % 3) * 3 + (col % 3);
        return singletonMask(sourceSpaces[row][d0], col)
          && singletonMask(sourceSpaces[9 + col][d0], row)
          && singletonMask(sourceSpaces[18 + box][d0], boxPosition);
      });

      if (forced.length > 1) {
        conflicts.push({ cell, digits: forced });
        continue;
      }
      if (forced.length !== 1) continue;

      grid[cell] = forced[0];
      candidates[cell] = [];
    }

    // A 729 import can prove a value as a given from the sector spaces while
    // still carrying that value in its peers. Normalize those pencilmarks
    // before handing the state to the search worker.
    for (let cell = 0; cell < 81; cell += 1) {
      const digit = grid[cell];
      if (!digit) continue;
      for (const peer of PEERS[cell]) {
        if (!grid[peer]) candidates[peer] = candidates[peer]
          .filter(value => value !== digit);
      }
      if (variantState.nonConsecutive) {
        const adjacentDigits = [digit - 1, digit + 1]
          .filter(value => value >= 1 && value <= 9);
        for (const [left, right] of NON_CONSECUTIVE_EDGES) {
          const peer = left === cell ? right : right === cell ? left : -1;
          if (peer < 0 || grid[peer]) continue;
          candidates[peer] = candidates[peer]
            .filter(value => !adjacentDigits.includes(value));
        }
      }
    }

    const spaceState = buildSpaces(candidates, grid);

    return {
      bits,
      sourceCandidates,
      candidates,
      spaces: spaceState.M,
      givenBySector: spaceState.given,
      grid,
      givenCells: grid.reduce((cells, digit, cell) => {
        if (digit) cells.push(cell);
        return cells;
      }, []),
      conflicts,
      valid: conflicts.length === 0,
    };
  }

  function cellName(cell) {
    return `r${Rx[cell] + 1}c${Cy[cell] + 1}`;
  }

  const StormDoku = {
    Rx,
    Cy,
    Bxy,
    BxyN,
    Rset,
    Cset,
    Bset,
    Rsec,
    Csec,
    Bsec,
    configureVariants,
    getVariantSettings,
    VARIANT_UNITS,
    variantUnitName,
    ROWS,
    COLS,
    BOXES,
    UNITS,
    POPC,
    buildSpaces,
    peersOf,
    shuffle,
    candidatesFor,
    canPlace,
    allCandidates,
    countSolutions,
    countSolutionsDlx,
    solveDlx,
    solveFully,
    generate,
    nakedSingleStep,
    nakedSubsetStep,
    hiddenSubsetStep,
    lastManStandingStep,
    boxLineStep,
    findBoxLineReports,
    subsetStep,
    fishStep,
    subsetOrFishStep,
    hintFor,
    eliminationItems,
    hasEliminations,
    applyEliminations,
    cloneCandidates,
    reduceCandidates,
    reduceCandidatesInPlace,
    encode,
    decode,
    parse729Data,
    cellName,
    cellGroupName,
    sectorGroupName,
    formatRemovals,
  };
  global.StormDoku = StormDoku;
  global.MeridianSudokuCore = StormDoku;
})(globalThis);
