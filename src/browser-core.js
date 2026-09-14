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
  const UNITS = [...ROWS, ...COLS, ...BOXES];

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

  const POPC = new Uint8Array(512);
  for (let i = 1; i < POPC.length; i++) POPC[i] = POPC[i >> 1] + (i & 1);

  const IDX = new Int8Array(512);
  for (let i = 0; i < 9; i++) IDX[1 << i] = i;

  const NAKED_TECH = { 1: 'naked-single', 2: 'naked-pair', 3: 'naked-triple', 4: 'naked-quad' };
  const HIDDEN_TECH = { 1: 'hidden-single', 2: 'hidden-pair', 3: 'hidden-triple', 4: 'hidden-quad' };
  const FISH_NAME = { 2: 'X-Wing', 3: 'SwordFish', 4: 'JellyFish' };
  const COMBOS = { 1: combosIdx(1), 2: combosIdx(2), 3: combosIdx(3), 4: combosIdx(4) };
  const TECH_NAME = {
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
    return DIGITS.filter(digit => !used.has(digit));
  }

  function allCandidates(grid) {
    return grid.map((value, cell) => (value ? [] : candidatesFor(grid, cell)));
  }

  function canPlace(grid, cell, digit) {
    return PEERS[cell].every(peer => grid[peer] !== digit);
  }

  function countSolutions(grid, limit = 2) {
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

  function solveDlx(grid, limit = 2) {
    if (!Array.isArray(grid) || grid.length !== 81) return { count: 0, solution: null };

    const maxSolutions = Math.max(1, Math.floor(limit));
    const left = [0];
    const right = [0];
    const up = [0];
    const down = [0];
    const column = [0];
    const size = [0];
    const rowCell = [];
    const rowDigit = [];

    for (let index = 1; index <= 324; index++) {
      left[index] = index - 1;
      right[index] = index === 324 ? 0 : index + 1;
      up[index] = index;
      down[index] = index;
      column[index] = index;
      size[index] = 0;
    }

    left[0] = 324;
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
        addRow(cell, digit, [
          cell,
          81 + row * 9 + d0,
          162 + col * 9 + d0,
          243 + box * 9 + d0,
        ]);
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
    const targetGivens = Math.max(0, Math.min(81, Math.floor(givens)));
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

  function buildSpaces(cand) {
    const M = Array.from({ length: 27 }, () => new Array(9).fill(0));

    for (let cell = 0; cell < 81; cell++) {
      for (const digit of cand[cell]) {
        const d0 = digit - 1;
        M[Rx[cell]][d0] |= 1 << Cy[cell];
        M[9 + Cy[cell]][d0] |= 1 << Rx[cell];
        M[18 + Bxy[cell]][d0] |= 1 << BxyN[cell];
      }
    }

    return { M };
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
    return { type: 'box', indices: [unitIndex - 18] };
  }

  function houseLabel(unitIndex) {
    if (unitIndex < 9) return `row ${unitIndex + 1}`;
    if (unitIndex < 18) return `column ${unitIndex - 8}`;
    return `box ${unitIndex - 17}`;
  }

  function houseRefLabel(ref) {
    if (!ref) return 'peers';

    const indexes = ref.indices.map(index => index + 1).join('/');
    if (ref.type === 'row') return ref.indices.length === 1 ? `row ${indexes}` : `rows ${indexes}`;
    if (ref.type === 'col') return ref.indices.length === 1 ? `column ${indexes}` : `columns ${indexes}`;
    return ref.indices.length === 1 ? `box ${indexes}` : `boxes ${indexes}`;
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
      const type = Math.floor(sector / 9);

      if (type !== lastType) {
        lastType = type;
        if (out) out += ',';
        out += type === 0 ? 'r' : type === 1 ? 'c' : 'b';
      }

      out += (sector % 9) + 1;
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
    }

    return eliminations;
  }

  function positionalHouse(h) {
    if (h < 9) return { cells: Rset[h], label: `row ${h + 1}`, ref: { type: 'row', indices: [h] } };
    if (h < 18) return { cells: Cset[h - 9], label: `column ${h - 8}`, ref: { type: 'col', indices: [h - 9] } };
    return { cells: Bset[h - 18], label: `box ${h - 17}`, ref: { type: 'box', indices: [h - 18] } };
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

    for (let h = 0; h < 27; h++) {
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

    return null;
  }

  function fishStepM(cand, sizes = [2, 3, 4], options = {}) {
    const { M } = buildSpaces(cand);
    const omissionFishSearch = options.omissionFishSearch || global.StormDoku.omissionFishStep;

    for (const k of sizes) {
      for (let digit = 1; digit <= 9; digit++) {
        const d0 = digit - 1;
        const rowFish = fishByRows(M, d0, digit, k);
        if (rowFish) return rowFish;

        const colFish = fishByCols(M, d0, digit, k);
        if (colFish) return colFish;
      }

      const omissionFish = omissionFishSearch?.(cand, [k], {
        ...options,
        minSize: k,
        maxSize: k,
      });
      if (omissionFish) return omissionFish;
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
    return withActualEliminations(boxLineStepM(cand), cand);
  }

  function subsetStepForSizes(cand, sizes) {
    for (const k of sizes) {
      const genericHidden = global.StormDoku.genericSubsetStep?.(cand, {
        kind: 'hidden',
        size: k,
      });
      if (genericHidden) return genericHidden;

      const hidden = hiddenSubsetStep(cand, k);
      if (hidden) return hidden;

      const genericNaked = global.StormDoku.genericSubsetStep?.(cand, {
        kind: 'naked',
        size: k,
      });
      if (genericNaked) return genericNaked;

      const naked = withActualEliminations(nakedSubsetStep(cand, k), cand);
      if (naked) return naked;
    }

    return null;
  }

  function subsetStep(cand) {
    return subsetStepForSizes(cand, [1, 2, 3, 4]);
  }

  function subsetOrFishStep(cand, fishOptions = {}) {
    const singles = subsetStepForSizes(cand, [1]);
    if (singles) return singles;

    const boxLine = boxLineStep(cand);
    if (boxLine) return boxLine;

    for (const size of [2, 3, 4]) {
      const subset = subsetStepForSizes(cand, [size]);
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
    const rows = String(text ?? '').split(/\r?\n/)
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
    const spaces = buildSpaces(sourceCandidates).M;
    const candidates = sourceCandidates.map(values => [...values]);
    const grid = new Array(81).fill(0);
    const conflicts = [];

    for (let cell = 0; cell < 81; cell++) {
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const boxPosition = (row % 3) * 3 + (col % 3);
      const forced = sourceCandidates[cell].filter(digit => {
        const d0 = digit - 1;
        return singletonMask(spaces[row][d0], col)
          && singletonMask(spaces[9 + col][d0], row)
          && singletonMask(spaces[18 + box][d0], boxPosition);
      });

      if (forced.length > 1) {
        conflicts.push({ cell, digits: forced });
        continue;
      }
      if (forced.length !== 1) continue;

      grid[cell] = forced[0];
      candidates[cell] = [];
    }

    return {
      bits,
      sourceCandidates,
      candidates,
      spaces,
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
    ROWS,
    COLS,
    BOXES,
    UNITS,
    POPC,
    buildSpaces,
    peersOf,
    shuffle,
    candidatesFor,
    allCandidates,
    countSolutions,
    countSolutionsDlx,
    solveDlx,
    solveFully,
    generate,
    nakedSingleStep,
    nakedSubsetStep,
    hiddenSubsetStep,
    boxLineStep,
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
