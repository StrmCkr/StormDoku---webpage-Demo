/* Type 1 unavoidable-set search for uniqueness-based candidate eliminations. */
(function installUniquenessCore(global) {
  'use strict';

  const core = global.StormDoku;
  const TARGET_SIZES = new Set([4, 6, 8, 10, 12, 14, 16, 18]);
  const TYPE2_TARGET_SIZES = new Set([4, 6, 8, 10, 12, 14, 16, 18]);
  const EXTENDED_TYPE1_TARGET_SIZES = new Set(
    Array.from({ length: 22 }, (_, index) => index + 6),
  );
  const EXTENDED_TYPE1_MAPPED_SIZES = new Set([6, 8, 10, 12, 14, 16, 18]);

  function isType1Exception(values, pair) {
    const coreCount = pair.filter(digit => values.includes(digit)).length;
    const extraCount = values.filter(digit => !pair.includes(digit)).length;
    return coreCount > 0 && extraCount > 0;
  }

  function classicUnits() {
    return [...core.ROWS, ...core.COLS, ...core.BOXES];
  }

  function commonExtraDigitEliminations(candidates, cells, zCells, digit, peerSets) {
    const formation = new Set(cells);
    return [...peerSets[zCells[0]]]
      .filter(cell => !formation.has(cell) && candidates[cell].includes(digit)
        && zCells.every(source => peerSets[source].has(cell)))
      .map(cell => ({ cell, digit }));
  }

  function connectedTradeCells(exception, baseCells, unitByCell, units) {
    const baseSet = new Set(baseCells);
    const connected = new Set([exception]);
    const queue = [exception];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      for (const unitIndex of unitByCell.get(queue[cursor]) || []) {
        for (const cell of units[unitIndex]) {
          if (!baseSet.has(cell) || connected.has(cell)) continue;
          connected.add(cell);
          queue.push(cell);
        }
      }
    }
    return [...connected].filter(cell => cell !== exception).sort((a, b) => a - b);
  }

  function tradeIsBalanced(cells, signs, units) {
    for (const unit of units) {
      let balance = 0;
      for (let i = 0; i < cells.length; i += 1) {
        if (unit.includes(cells[i])) balance += signs[i];
      }
      if (balance !== 0) return false;
    }
    return true;
  }

  function makeSpatialGenerators() {
    const generators = [];
    const add = mapper => generators.push(Array.from({ length: 81 }, (_, cell) => mapper(cell)));
    for (let band = 0; band < 3; band += 1) {
      for (let a = 0; a < 3; a += 1) {
        for (let b = a + 1; b < 3; b += 1) {
          add(cell => {
            const row = (cell / 9) | 0;
            const col = cell % 9;
            const local = row % 3;
            const mapped = row === band * 3 + a ? band * 3 + b
              : row === band * 3 + b ? band * 3 + a : row;
            return mapped * 9 + col;
          });
        }
      }
    }
    for (let a = 0; a < 3; a += 1) {
      for (let b = a + 1; b < 3; b += 1) {
        add(cell => {
          const row = (cell / 9) | 0;
          const col = cell % 9;
          const band = (row / 3) | 0;
          const mappedBand = band === a ? b : band === b ? a : band;
          return (mappedBand * 3 + row % 3) * 9 + col;
        });
        add(cell => {
          const row = (cell / 9) | 0;
          const col = cell % 9;
          const stack = (col / 3) | 0;
          const mappedStack = stack === a ? b : stack === b ? a : stack;
          return row * 9 + mappedStack * 3 + col % 3;
        });
      }
    }
    for (let stack = 0; stack < 3; stack += 1) {
      for (let a = 0; a < 3; a += 1) {
        for (let b = a + 1; b < 3; b += 1) {
          add(cell => {
            const row = (cell / 9) | 0;
            const col = cell % 9;
            const mapped = col === stack * 3 + a ? stack * 3 + b
              : col === stack * 3 + b ? stack * 3 + a : col;
            return row * 9 + mapped;
          });
        }
      }
    }
    add(cell => (cell % 9) * 9 + ((cell / 9) | 0));
    return generators;
  }

  const SPATIAL_GENERATORS = makeSpatialGenerators();

  function isType1Pattern(record, candidateGrid, units) {
    const cells = record.cells;
    const pair = record.digits;
    if (!TARGET_SIZES.has(cells.length) || new Set(cells).size !== cells.length) return false;
    for (const cell of cells) {
      const values = candidateGrid[cell] || [];
      if (cell === record.exception) {
        if (!isType1Exception(values, pair)) return false;
      } else if (values.length !== pair.length || !pair.every(digit => values.includes(digit))) {
        return false;
      }
    }
    return tradeIsBalanced(cells, record.signs, units);
  }

  function verifyIsomorphismInvariance(record, candidateGrid) {
    const units = classicUnits();
    for (const map of SPATIAL_GENERATORS) {
      const mappedCandidates = new Array(81);
      for (let cell = 0; cell < 81; cell += 1) mappedCandidates[map[cell]] = candidateGrid[cell];
      const mappedRecord = {
        ...record,
        cells: record.cells.map(cell => map[cell]),
        exception: map[record.exception],
      };
      if (!isType1Pattern(mappedRecord, mappedCandidates, units)) return false;
    }
    for (let digit = 1; digit < 9; digit += 1) {
      const mapDigit = value => value === digit ? digit + 1 : value === digit + 1 ? digit : value;
      const mappedCandidates = candidateGrid.map(values => values.map(mapDigit).sort((a, b) => a - b));
      const mappedRecord = { ...record, digits: record.digits.map(mapDigit) };
      if (!isType1Pattern(mappedRecord, mappedCandidates, units)) return false;
    }
    return true;
  }

  function variantAssignmentIsLegal(cells, signs, digits) {
    const assigned = new Array(81).fill(0);
    for (const reverse of [false, true]) {
      assigned.fill(0);
      for (let i = 0; i < cells.length; i += 1) {
        const digit = digits[reverse ? signs[i] < 0 ? 0 : 1 : signs[i] > 0 ? 0 : 1];
        if (!core.canPlace(assigned, cells[i], digit)) return false;
        assigned[cells[i]] = digit;
      }
    }
    return true;
  }

  function exposedPairTemplates(cells, pair) {
    const assignments = [];
    const assigned = new Array(81).fill(0);
    const visit = index => {
      if (assignments.length > 2) return;
      if (index >= cells.length) {
        assignments.push(cells.map(cell => assigned[cell]));
        return;
      }
      const cell = cells[index];
      for (const digit of pair) {
        if (!core.canPlace(assigned, cell, digit)) continue;
        assigned[cell] = digit;
        visit(index + 1);
        assigned[cell] = 0;
        if (assignments.length > 2) return;
      }
    };
    visit(0);
    if (assignments.length !== 2) return null;
    const inverse = assignments[0].map(digit => pair[0] + pair[1] - digit);
    const isInverse = assignments[1].every((digit, index) => digit === inverse[index]);
    return isInverse ? assignments : null;
  }

  function findUniquenessType1(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ]
      .filter(name => variantSettings[name]);
    if (unsupportedVariants.length) {
      return {
        results: [],
        unsupportedVariants,
        stats: {
          candidatePairs: 0,
          states: 0,
          balancedTrades: 0,
          isomorphismGenerators: SPATIAL_GENERATORS.length + 8,
          transformChecks: 0,
          sizeCounts: Object.fromEntries([...TARGET_SIZES].map(size => [size, 0])),
          targetSizes: [...TARGET_SIZES].sort((a, b) => a - b),
        },
      };
    }
    const units = core.UNITS;
    const scopes = [Array.from({ length: 81 }, (_, cell) => cell)];
    const results = [];
    const resultKeys = new Set();
    let states = 0;
    let testedPairs = 0;
    let completedTrades = 0;

    for (let first = 1; first <= 9; first += 1) {
      for (let second = first + 1; second <= 9; second += 1) {
        testedPairs += 1;
        const pair = [first, second];
        const exactPair = new Set(candidates.flatMap((values, cell) =>
          values.length === 2 && values[0] === first && values[1] === second ? [cell] : []));
        const exceptions = candidates.flatMap((values, cell) =>
          isType1Exception(values, pair) ? [cell] : []);
        if (!exactPair.size || !exceptions.length) continue;

        for (const scope of scopes) {
          const scopeSet = new Set(scope);
          const unitsInScope = units.filter(unit => unit.some(cell => scopeSet.has(cell)));
          const unitByCell = new Map(scope.map(cell => [cell, []]));
          unitsInScope.forEach((unit, unitIndex) => {
            for (const cell of unit) unitByCell.get(cell)?.push(unitIndex);
          });

          for (const exception of exceptions) {
            if (!scopeSet.has(exception)) continue;
            const baseCells = connectedTradeCells(exception,
              scope.filter(cell => exactPair.has(cell)), unitByCell, unitsInScope);
            if (baseCells.length < 3) continue;
            const seenStates = new Set();
            const selected = new Map([[exception, 1]]);
            const balances = new Int8Array(unitsInScope.length);
            for (const unitIndex of unitByCell.get(exception)) balances[unitIndex] = 1;

            const recordIfType1 = () => {
              const cells = [...selected.keys()].sort((a, b) => a - b);
              if (!TARGET_SIZES.has(cells.length)) return;
              const signs = cells.map(cell => selected.get(cell));
              if (!variantAssignmentIsLegal(cells, signs, pair)) return;
              const key = `${first},${second}:${exception}:${cells.join(',')}`;
              if (resultKeys.has(key)) return;
              const record = {
                tech: 'uniqueness-type-1',
                classification: 'Uniqueness Type 1',
                type: 1,
                size: cells.length,
                digits: pair,
                cells,
                signs,
                exception,
                eliminations: pair.filter(digit => candidates[exception].includes(digit))
                  .map(digit => ({ cell: exception, digit })),
                scope: 'connected trade',
              };
              if (!verifyIsomorphismInvariance(record, candidates)) {
                throw new Error('A Type 1 unavoidable set failed the Sudoku-isomorphism invariant check.');
              }
              resultKeys.add(key);
              results.push(record);
            };

            const visit = () => {
              states += 1;
              if ((states & 8191) === 0) options.onProgress?.({ stage: 'type-1', states, results: results.length });
              const stateKey = [...selected.entries()].sort((a, b) => a[0] - b[0])
                .map(([cell, sign]) => `${cell}:${sign}`).join(',');
              if (seenStates.has(stateKey)) return;
              seenStates.add(stateKey);

              let chosenUnit = -1;
              let choices = null;
              for (let index = 0; index < balances.length; index += 1) {
                const balance = balances[index];
                if (!balance) continue;
                const neededSign = balance > 0 ? -1 : 1;
                const candidatesInUnit = baseCells.filter(cell => !selected.has(cell)
                  && unitByCell.get(cell).includes(index));
                if (!candidatesInUnit.length) return;
                if (!choices || candidatesInUnit.length < choices.length) {
                  chosenUnit = index;
                  choices = candidatesInUnit.map(cell => [cell, neededSign]);
                }
              }

              if (chosenUnit === -1) {
                completedTrades += 1;
                recordIfType1();
                return;
              }

              if (selected.size >= 18) return;
              for (const [cell, sign] of choices) {
                selected.set(cell, sign);
                for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
                visit();
                for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
                selected.delete(cell);
              }
            };

            visit();
          }
        }
      }
    }

    return {
      results,
      stats: {
        candidatePairs: testedPairs,
        states,
        balancedTrades: completedTrades,
        isomorphismGenerators: SPATIAL_GENERATORS.length + 8,
        transformChecks: results.length * (SPATIAL_GENERATORS.length + 8),
        sizeCounts: Object.fromEntries([...TARGET_SIZES].sort((a, b) => a - b)
          .map(size => [size, results.filter(record => record.size === size).length])),
        targetSizes: [...TARGET_SIZES].sort((a, b) => a - b),
      },
    };
  }

  // Extended Type 1 uses a duplicated two-row trade.  For 2m cells, the
  // m columns carry m distinct bivalue edges, each repeated in both rows.
  // Those edges must form one cycle over the m base digits.  Five exact
  // bivalues plus one extra-candidate cell is the m=3 (six-cell) case.
  function countExtendedPairTemplates(cells, pairByCell) {
    const assigned = new Array(81).fill(0);
    let count = 0;
    const visit = index => {
      if (count > 2) return;
      if (index >= cells.length) {
        count += 1;
        return;
      }
      const cell = cells[index];
      for (const digit of pairByCell.get(cell)) {
        if (!core.canPlace(assigned, cell, digit)) continue;
        assigned[cell] = digit;
        visit(index + 1);
        assigned[cell] = 0;
      }
    };
    visit(0);
    return count;
  }

  function isExtendedType1Pattern(record, candidateGrid) {
    const cells = [...new Set(record.cells || [])];
    const baseDigits = [...new Set(record.digits || [])].sort((a, b) => a - b);
    const size = cells.length;
    const edgeCount = size / 2;
    if (!EXTENDED_TYPE1_TARGET_SIZES.has(size) || size % 2 !== 0
      || !EXTENDED_TYPE1_MAPPED_SIZES.has(size)
      || baseDigits.length !== edgeCount
      || !Number.isInteger(record.exception) || !cells.includes(record.exception)) return false;

    const rows = [...new Set(cells.map(cell => Math.floor(cell / 9)))];
    const cols = [...new Set(cells.map(cell => cell % 9))];
    if (!((rows.length === 2 && cols.length === edgeCount)
      || (rows.length === edgeCount && cols.length === 2))) return false;
    if (!cells.every(cell => rows.includes(Math.floor(cell / 9))
      && cols.includes(cell % 9))) return false;

    const pairByCell = new Map();
    for (const cell of cells) {
      const values = [...new Set(candidateGrid[cell] || [])].sort((a, b) => a - b);
      const pair = cell === record.exception && record.exceptionPair?.length === 2
        ? [...record.exceptionPair].sort((a, b) => a - b)
        : values.filter(digit => baseDigits.includes(digit));
      if (pair.length !== 2 || !pair.every(digit => values.includes(digit))) return false;
      if (cell !== record.exception && (values.length !== 2
        || pair.some((digit, index) => digit !== values[index]))) return false;
      if (cell === record.exception && values.length <= 2) return false;
      pairByCell.set(cell, pair);
    }

    const longAxis = rows.length === 2 ? rows : cols;
    const shortAxis = rows.length === 2 ? cols : rows;
    const edgeKeys = new Set();
    for (const line of longAxis) {
      const linePairs = cells.filter(cell => (rows.length === 2
        ? Math.floor(cell / 9) === line : cell % 9 === line))
        .map(cell => pairByCell.get(cell).join(','));
      if (new Set(linePairs).size !== edgeCount) return false;
      linePairs.forEach(key => edgeKeys.add(key));
    }
    if (edgeKeys.size !== edgeCount) return false;
    for (const line of shortAxis) {
      const linePairs = cells.filter(cell => (rows.length === 2
        ? cell % 9 === line : Math.floor(cell / 9) === line))
        .map(cell => pairByCell.get(cell).join(','));
      if (linePairs.length !== 2 || linePairs[0] !== linePairs[1]) return false;
    }

    const degree = new Map(baseDigits.map(digit => [digit, 0]));
    const adjacency = new Map(baseDigits.map(digit => [digit, new Set()]));
    for (const key of edgeKeys) {
      const [left, right] = key.split(',').map(Number);
      if (!degree.has(left) || !degree.has(right) || left === right) return false;
      degree.set(left, degree.get(left) + 1);
      degree.set(right, degree.get(right) + 1);
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    }
    if ([...degree.values()].some(value => value !== 2)) return false;
    const reached = new Set();
    const queue = [baseDigits[0]];
    while (queue.length) {
      const digit = queue.shift();
      if (reached.has(digit)) continue;
      reached.add(digit);
      queue.push(...adjacency.get(digit));
    }
    if (reached.size !== baseDigits.length) return false;
    if (countExtendedPairTemplates(cells, pairByCell) !== 2) return false;

    const exceptionValues = candidateGrid[record.exception] || [];
    const exceptionPair = pairByCell.get(record.exception) || [];
    const extraDigits = exceptionValues.filter(digit => !exceptionPair.includes(digit));
    return extraDigits.length > 0
      && (record.extraDigits || extraDigits).every(digit => extraDigits.includes(digit))
      && (record.eliminations || []).every(item => item.cell === record.exception
        && baseDigits.includes(item.digit));
  }

  function verifyExtendedType1Isomorphism(record, candidateGrid) {
    for (const map of SPATIAL_GENERATORS) {
      const mappedCandidates = new Array(81);
      for (let cell = 0; cell < 81; cell += 1) mappedCandidates[map[cell]] = candidateGrid[cell];
      const mappedRecord = {
        ...record,
        cells: record.cells.map(cell => map[cell]),
        exception: map[record.exception],
        eliminations: (record.eliminations || []).map(item => ({ ...item, cell: map[item.cell] })),
      };
      if (!isExtendedType1Pattern(mappedRecord, mappedCandidates)) {
        return false;
      }
    }
    for (let digit = 1; digit < 9; digit += 1) {
      const mapDigit = value => value === digit ? digit + 1
        : value === digit + 1 ? digit : value;
      const mappedCandidates = candidateGrid.map(values => values.map(mapDigit).sort((a, b) => a - b));
      const mappedRecord = {
        ...record,
        digits: record.digits.map(mapDigit),
        exceptionPair: (record.exceptionPair || []).map(mapDigit),
        extraDigits: (record.extraDigits || []).map(mapDigit),
        eliminations: (record.eliminations || []).map(item => ({ ...item, digit: mapDigit(item.digit) })),
      };
      if (!isExtendedType1Pattern(mappedRecord, mappedCandidates)) {
        return false;
      }
    }
    return true;
  }

  function findExtendedUniquenessType1(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const results = [];
    const resultKeys = new Set();
    let checkedLayouts = 0;
    const units = classicUnits();
    const unitByCell = candidates.map((_, cell) =>
      units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    for (const digits of extendedBaseDigitSets()) {
      const eligible = new Set(candidates.flatMap((values, cell) =>
        values.length >= 2 && values.filter(digit => digits.includes(digit)).length >= 2 ? [cell] : []));
      const exceptions = new Set([...eligible].filter(cell =>
        candidates[cell].some(digit => !digits.includes(digit))));
      for (const exception of exceptions) {
        const allowed = new Set([...eligible].filter(cell => cell === exception || !exceptions.has(cell)));
        visitVerifiedExtendedTrades({
          candidates, pair: digits, eligible: allowed, plusCellsForPair: new Set([exception]),
          units, unitByCell,
          onState() { checkedLayouts += 1; },
          accept(cells) {
            const key = `${digits.join(',')}:${cells.join(',')}:${exception}`;
            if (resultKeys.has(key)) return;
            resultKeys.add(key);
            const exceptionPair = candidates[exception].filter(digit => digits.includes(digit));
            results.push({
              tech: 'uniqueness-extended-type-1', classification: 'Extended Uniqueness Type 1',
              type: 'extended-1', size: cells.length, digits, cells, exception, exceptionPair,
              extraDigits: candidates[exception].filter(digit => !digits.includes(digit)),
              eliminations: exceptionPair.map(digit => ({ cell: exception, digit })),
            });
          },
        });
      }
    }
    for (const size of EXTENDED_TYPE1_MAPPED_SIZES) {
      const edgeCount = size / 2;
      for (let rowA = 0; rowA < 9; rowA += 1) {
        for (let rowB = rowA + 1; rowB < 9; rowB += 1) {
          const chooseColumns = (start, selected) => {
            if (selected.length === edgeCount) {
              const cells = selected.flatMap(col => [rowA * 9 + col, rowB * 9 + col]);
              checkedLayouts += 1;
              const exceptions = cells.filter(cell => candidates[cell].length > 2);
              if (exceptions.length !== 1) return;
              const exception = exceptions[0];
              const digits = new Set();
              let exceptionPair = null;
              for (const col of selected) {
                const top = candidates[rowA * 9 + col];
                const bottom = candidates[rowB * 9 + col];
                const topExact = top.length === 2;
                const bottomExact = bottom.length === 2;
                if (topExact === bottomExact) {
                  if (!topExact || top.join(',') !== bottom.join(',')) return;
                  top.forEach(digit => digits.add(digit));
                } else {
                  const exact = topExact ? top : bottom;
                  const extra = topExact ? bottom : top;
                  if (extra.filter(digit => exact.includes(digit)).length !== 2) return;
                  exact.forEach(digit => digits.add(digit));
                  exceptionPair = [...exact];
                }
              }
              const baseDigits = [...digits].sort((a, b) => a - b);
              if (!exceptionPair) return;
              const record = {
                tech: 'uniqueness-extended-type-1',
                classification: 'Extended Uniqueness Type 1',
                type: 'extended-1',
                size,
                digits: baseDigits,
                cells: [...cells].sort((a, b) => a - b),
                exception,
                exceptionPair,
                extraDigits: candidates[exception].filter(digit => !exceptionPair.includes(digit)),
                eliminations: exceptionPair
                  .map(digit => ({ cell: exception, digit })),
                scope: `two-row ${edgeCount}-column cycle trade`,
              };
              if (!record.extraDigits.length || !isExtendedType1Pattern(record, candidates)) return;
              const key = `${baseDigits.join(',')}:${record.cells.join(',')}:${exception}`;
              if (resultKeys.has(key)) return;
              if (!verifyExtendedType1Isomorphism(record, candidates)) {
                throw new Error('An Extended Type 1 unavoidable set failed the Sudoku-isomorphism invariant check.');
              }
              resultKeys.add(key);
              results.push(record);
              return;
            }
            for (let col = start; col <= 9 - (edgeCount - selected.length); col += 1) {
              chooseColumns(col + 1, [...selected, col]);
            }
          };
          chooseColumns(0, []);
        }
      }
    }
    return {
      results,
      stats: {
        checkedLayouts,
        targetSizes: [...EXTENDED_TYPE1_TARGET_SIZES],
        mappedSizes: [...EXTENDED_TYPE1_MAPPED_SIZES],
        unmappedSizes: [...EXTENDED_TYPE1_TARGET_SIZES]
          .filter(size => !EXTENDED_TYPE1_MAPPED_SIZES.has(size)),
        sizeCounts: Object.fromEntries([...EXTENDED_TYPE1_TARGET_SIZES]
          .map(size => [size, results.filter(record => record.size === size).length])),
        isomorphismGenerators: SPATIAL_GENERATORS.length + 8,
        transformChecks: results.length * (SPATIAL_GENERATORS.length + 8),
      },
    };
  }

  function type2PatternIsValid(record, candidateGrid, units) {
    if (!TYPE2_TARGET_SIZES.has(record.cells.length)
      || new Set(record.cells).size !== record.cells.length
      || record.zCells.length < 2
      || record.zCells.some(cell => !record.cells.includes(cell))) return false;
    const pair = record.digits;
    const pairSet = new Set(pair);
    const zCells = new Set(record.zCells);
    for (const cell of record.cells) {
      const values = candidateGrid[cell] || [];
      if (zCells.has(cell)) {
        if (values.length !== 3 || !pair.every(digit => values.includes(digit))
          || !values.includes(record.extraDigit)) return false;
      } else if (values.length !== 2 || !pair.every(digit => values.includes(digit))) {
        return false;
      }
    }
    if (pairSet.has(record.extraDigit)
      || !tradeIsBalanced(record.cells, record.signs, units)
      || !variantAssignmentIsLegal(record.cells, record.signs, pair)) return false;
    const commonPeers = new Set(core.peersOf(record.zCells[0]));
    for (const cell of record.zCells.slice(1)) {
      const peers = new Set(core.peersOf(cell));
      for (const peer of commonPeers) if (!peers.has(peer)) commonPeers.delete(peer);
    }
    return record.eliminations.length > 0 && record.eliminations.every(item =>
      commonPeers.has(item.cell)
      && item.digit === record.extraDigit
      && candidateGrid[item.cell]?.includes(item.digit));
  }

  function verifyType2IsomorphismInvariance(record, candidateGrid) {
    const units = classicUnits();
    for (const map of SPATIAL_GENERATORS) {
      const mappedCandidates = new Array(81);
      for (let cell = 0; cell < 81; cell += 1) mappedCandidates[map[cell]] = candidateGrid[cell];
      const mappedRecord = {
        ...record,
        cells: record.cells.map(cell => map[cell]),
        zCells: record.zCells.map(cell => map[cell]),
        eliminations: record.eliminations.map(item => ({ ...item, cell: map[item.cell] })),
      };
      if (!type2PatternIsValid(mappedRecord, mappedCandidates, units)) return false;
    }
    for (let digit = 1; digit < 9; digit += 1) {
      const mapDigit = value => value === digit ? digit + 1 : value === digit + 1 ? digit : value;
      const mappedCandidates = candidateGrid.map(values => values.map(mapDigit).sort((a, b) => a - b));
      const mappedRecord = {
        ...record,
        digits: record.digits.map(mapDigit),
        extraDigit: mapDigit(record.extraDigit),
        eliminations: record.eliminations.map(item => ({ ...item, digit: mapDigit(item.digit) })),
      };
      if (!type2PatternIsValid(mappedRecord, mappedCandidates, units)) return false;
    }
    return true;
  }

  function findUniquenessType2And5(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    const peerSets = Array.from({ length: 81 }, (_, cell) => new Set(core.peersOf(cell)));
    const unitByCell = new Map(Array.from({ length: 81 }, (_, cell) => [cell, []]));
    units.forEach((unit, unitIndex) => {
      for (const cell of unit) unitByCell.get(cell).push(unitIndex);
    });
    const results = [];
    const resultKeys = new Set();
    let states = 0;
    let checkedTrades = 0;

    for (let first = 1; first <= 9; first += 1) {
      for (let second = first + 1; second <= 9; second += 1) {
        const pair = [first, second];
        const exactPair = new Set(candidates.flatMap((values, cell) =>
          values.length === 2 && pair.every(digit => values.includes(digit)) ? [cell] : []));
        if (!exactPair.size) continue;

        for (let extraDigit = 1; extraDigit <= 9; extraDigit += 1) {
          if (pair.includes(extraDigit)) continue;
          const plusTwoCells = new Set(candidates.flatMap((values, cell) =>
            values.length === 3 && pair.every(digit => values.includes(digit))
              && values.includes(extraDigit) ? [cell] : []));
          if (plusTwoCells.size < 2) continue;
          const eligible = new Set([...exactPair, ...plusTwoCells]);
          const unitsInScope = units;

          const connectedCells = start => {
            const connected = new Set([start]);
            const queue = [start];
            for (let cursor = 0; cursor < queue.length; cursor += 1) {
              for (const unitIndex of unitByCell.get(queue[cursor])) {
                for (const cell of unitsInScope[unitIndex]) {
                  if (!eligible.has(cell) || connected.has(cell)) continue;
                  connected.add(cell);
                  queue.push(cell);
                }
              }
            }
            return [...connected];
          };

          for (const start of plusTwoCells) {
            const tradeCells = connectedCells(start);
            const selected = new Map([[start, 1]]);
            const balances = new Int8Array(units.length);
            for (const unitIndex of unitByCell.get(start)) balances[unitIndex] = 1;
            const seenStates = new Set();

            const recordTrade = () => {
              const cells = [...selected.keys()].sort((a, b) => a - b);
              if (!TYPE2_TARGET_SIZES.has(cells.length)) return;
              const zCells = cells.filter(cell => plusTwoCells.has(cell));
              if (zCells.length < 2 || zCells.length > 3) return;
              const signs = cells.map(cell => selected.get(cell));
              if (!variantAssignmentIsLegal(cells, signs, pair)) return;
              checkedTrades += 1;
              const selectedCells = new Set(cells);
              const forward = cells.map((cell, index) => `${cell}:${signs[index]}`).join(',');
              const reverse = cells.map((cell, index) => `${cell}:${-signs[index]}`).join(',');
              const canonicalSigns = forward < reverse ? forward : reverse;
              const addRecord = (type, eliminations) => {
                if (!eliminations.length) return;
                const key = `${type}:${first},${second},${extraDigit}:${cells.join(',')}:${canonicalSigns}`;
                if (resultKeys.has(key)) return;
                const record = {
                  tech: `uniqueness-type-${type}`,
                  classification: `Unique Rectangle Type ${type}`,
                  type,
                  size: cells.length,
                  digits: pair,
                  extraDigit,
                  cells,
                  signs,
                  zCells,
                  eliminations,
                };
                resultKeys.add(key);
                results.push(record);
              };

              if (zCells.length === 2
                && units.some(unit => zCells.every(cell => unit.includes(cell)))) {
                const type2Eliminations = commonExtraDigitEliminations(
                  candidates, cells, zCells, extraDigit, peerSets,
                );
                if (type2Eliminations.length) {
                  const record = {
                    tech: 'uniqueness-type-2', classification: 'Unique Rectangle Type 2',
                    type: 2, size: cells.length, digits: pair, extraDigit,
                    cells, signs, zCells, eliminations: type2Eliminations,
                  };
                  if (!verifyType2IsomorphismInvariance(record, candidates)) {
                    throw new Error('A Type 2 unavoidable set failed the Sudoku-isomorphism invariant check.');
                  }
                  addRecord(2, type2Eliminations);
                }
              }

              // Type 5 scales over the same balanced 4–18-cell pair trades.
              // For a four-cell UR, the classic diagonal/two-roof and
              // three-roof cases need one fewer roof peer: the remaining roof
              // is forced when the target takes z. For larger trades, require
              // the target to see every z-roof so its placement removes z
              // from the whole selected trade, leaving an exact pair trade.
              let requiredRoofPeers = null;
              if (cells.length === 4 && zCells.length === 2) {
                const diagonal = (zCells.includes(cells[0]) && zCells.includes(cells[3]))
                  || (zCells.includes(cells[1]) && zCells.includes(cells[2]));
                if (diagonal) requiredRoofPeers = 1;
              } else if (cells.length === 4 && zCells.length === 3) {
                requiredRoofPeers = 2;
              } else if (cells.length >= 6) {
                requiredRoofPeers = zCells.length;
              }
              if (requiredRoofPeers === null) return;

              const type5Eliminations = candidates.flatMap((values, cell) => {
                if (selectedCells.has(cell) || !values.includes(extraDigit)) return [];
                const peerSet = new Set(core.peersOf(cell));
                const seenRoofCells = zCells.reduce((count, roofCell) =>
                  count + Number(peerSet.has(roofCell)), 0);
                return seenRoofCells >= requiredRoofPeers
                  ? [{ cell, digit: extraDigit }]
                  : [];
              });
              addRecord(5, type5Eliminations);
            };

            const visit = () => {
              states += 1;
              if ((states & 8191) === 0) options.onProgress?.({ stage: 'type-2', states, results: results.length });
              const stateKey = [...selected.entries()].sort((a, b) => a[0] - b[0])
                .map(([cell, sign]) => `${cell}:${sign}`).join(',');
              if (seenStates.has(stateKey)) return;
              seenStates.add(stateKey);

              let chosenUnit = -1;
              let choices = null;
              for (let index = 0; index < balances.length; index += 1) {
                const balance = balances[index];
                if (!balance) continue;
                const neededSign = balance > 0 ? -1 : 1;
                const candidatesInUnit = tradeCells.filter(cell => !selected.has(cell)
                  && unitByCell.get(cell).includes(index));
                if (!candidatesInUnit.length) return;
                if (!choices || candidatesInUnit.length < choices.length) {
                  chosenUnit = index;
                  choices = candidatesInUnit.map(cell => [cell, neededSign]);
                }
              }
              if (chosenUnit === -1) {
                recordTrade();
                return;
              }
              if (selected.size >= 18) return;
              for (const [cell, sign] of choices) {
                selected.set(cell, sign);
                for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
                visit();
                for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
                selected.delete(cell);
              }
            };
            visit();
          }
        }
      }
    }
    return { results, stats: { states, checkedTrades, targetSizes: [...TYPE2_TARGET_SIZES].sort((a, b) => a - b) } };
  }

  function filterUniquenessReport(candidateGrid, options, type) {
    const report = findUniquenessType2And5(candidateGrid, options);
    return { ...report, results: (report.results || []).filter(record => record.type === type) };
  }

  function findUniquenessType2(candidateGrid, options = {}) {
    return filterUniquenessReport(candidateGrid, options, 2);
  }

  function findUniquenessType5(candidateGrid, options = {}) {
    return filterUniquenessReport(candidateGrid, options, 5);
  }

  // With z removed, every legal filling must have an alternative that
  // preserves the same digit set in every row, column and box.
  function forcesExtendedTrade(cells, domains, unitByCell, unitCount) {
    const ordered = [...cells].sort((a, b) => domains[a].length - domains[b].length);
    const used = new Uint8Array(unitCount);
    const signatures = new Map();
    function visit(index) {
      const cell = ordered[index];
      if (cell === undefined) {
        const key = used.join('');
        signatures.set(key, Math.min(2, (signatures.get(key) || 0) + 1));
        return;
      }
      const houses = unitByCell[cell];
      for (const digit of domains[cell]) {
        if (houses.some(unit => used[unit] & digit)) continue;
        for (const unit of houses) used[unit] |= digit;
        visit(index + 1);
        for (const unit of houses) used[unit] ^= digit;
      }
    }
    visit(0);
    return signatures.size > 0 && [...signatures.values()].every(count => count === 2);
  }

  function walkExtendedTrades({ domains, units, unitByCell, isRoof, peerSets, start, targets, onState, accept }) {
    const left = new Uint8Array(units.length);
    const right = new Uint8Array(units.length);
    const selected = new Set();
    const eligible = units.map(unit => unit.filter(cell => domains[cell].length
      && (!isRoof[cell] || (cell > start && (!targets || targets.some(target => peerSets[target].has(cell)))))));

    function add(cell, x, y, usedDigits, remainingTargets) {
      if (remainingTargets && isRoof[cell]) {
        remainingTargets = remainingTargets.filter(target => peerSets[target].has(cell));
        if (!remainingTargets.length) return;
      }
      selected.add(cell);
      for (const unit of unitByCell[cell]) {
        left[unit] |= x;
        right[unit] |= y;
      }
      visit(usedDigits | x | y, remainingTargets);
      for (const unit of unitByCell[cell]) {
        left[unit] ^= x;
        right[unit] ^= y;
      }
      selected.delete(cell);
    }

    function visit(usedDigits, remainingTargets) {
      if (onState() === false) return;
      let choices = null;
      for (let unit = 0; unit < units.length; unit += 1) {
        const missing = left[unit] ^ right[unit];
        for (const digit of [1, 2, 4]) {
          if (!(missing & digit)) continue;
          if (selected.size === 27) return;
          const needsLeft = Boolean(right[unit] & digit);
          const moves = [];
          for (const cell of eligible[unit]) {
            if (selected.has(cell) || !domains[cell].includes(digit)) continue;
            for (const other of domains[cell]) {
              if (other === digit) continue;
              const x = needsLeft ? digit : other;
              const y = needsLeft ? other : digit;
              if (unitByCell[cell].some(house => (left[house] & x) || (right[house] & y))) continue;
              moves.push([cell, x, y]);
            }
          }
          if (!moves.length) return;
          if (!choices || moves.length < choices.length) choices = moves;
        }
      }
      if (choices) {
        for (const [cell, x, y] of choices) add(cell, x, y, usedDigits, remainingTargets);
        return;
      }
      if (selected.size < 6 || usedDigits !== 7) return;
      const cells = [...selected].sort((x, y) => x - y);
      accept(cells);
    }

    for (const x of domains[start]) {
      for (const y of domains[start]) {
        if (x < y) add(start, x, y, 0, targets);
      }
    }
  }

  function* extendedBaseDigitSets() {
    for (let a = 1; a <= 7; a += 1) {
      for (let b = a + 1; b <= 8; b += 1) {
        for (let c = b + 1; c <= 9; c += 1) yield [a, b, c];
      }
    }
  }

  function findExtendedUniquenessType2And5(candidateGrid, options = {}) {
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])]);
    const units = classicUnits();
    const unitByCell = candidates.map((_, cell) =>
      units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const peerSets = candidates.map((_, cell) => new Set(core.peersOf(cell)));
    const results = [];
    let states = 0;

    for (let a = 1; a <= 7; a += 1) {
      for (let b = a + 1; b <= 8; b += 1) {
        for (let c = b + 1; c <= 9; c += 1) {
          const digits = [a, b, c];
          for (let extraDigit = 1; extraDigit <= 9; extraDigit += 1) {
            if (digits.includes(extraDigit)) continue;
            const domains = candidates.map(values => {
              const base = values.filter(digit => digit !== extraDigit);
              if (base.length < 2 || !base.every(digit => digits.includes(digit))) return [];
              return base.map(digit => 1 << digits.indexOf(digit));
            });
            const isRoof = candidates.map(values => values.includes(extraDigit));
            const roofs = domains.flatMap((domain, cell) => domain.length && isRoof[cell] ? [cell] : []);
            if (roofs.length < 2 || !domains.some((domain, cell) => domain.length && !isRoof[cell])) continue;

            const checked = new Set();
            for (const start of roofs) {
              const targets = [...peerSets[start]].filter(cell => isRoof[cell]);
              if (!targets.some(target => roofs.some(cell => cell > start && peerSets[target].has(cell)))) continue;
              walkExtendedTrades({
                domains, units, unitByCell, isRoof, peerSets, start, targets,
                onState() {
                  states += 1;
                  if ((states & 8191) === 0) options.onProgress?.({
                    stage: 'extended-type-2-5', states, results: results.length,
                  });
                },
                accept(cells) {
                  const zCells = cells.filter(cell => isRoof[cell]);
                  if (zCells.length < 2 || zCells.length === cells.length) return;
                  const key = cells.join(',');
                  if (checked.has(key)) return;
                  checked.add(key);
                  const eliminations = commonExtraDigitEliminations(candidates, cells, zCells, extraDigit, peerSets);
                  if (!eliminations.length || !forcesExtendedTrade(cells, domains, unitByCell, units.length)) return;
                  const type = zCells.length === 2 && peerSets[zCells[0]].has(zCells[1]) ? 2 : 5;
                  results.push({
                    tech: 'uniqueness-extended-type-2-5',
                    classification: `Extended Unique Rectangle Type ${type}`,
                    type, extended: true, size: cells.length, cells, digits, extraDigit, zCells, eliminations,
                  });
                },
              });
            }
          }
        }
      }
    }
    return { results, stats: { states, targetSizes: [...EXTENDED_TYPE1_TARGET_SIZES] } };
  }

  function hasType3LocalAssignment(tradeCells, candidates, pair, alsCells,
    requiredDigit = null, requiredDigitCells = [], forbiddenAlsDigit = null,
    forcedAssignments = []) {
    const tradeSet = new Set(tradeCells);
    const requiredSet = new Set(requiredDigitCells);
    const forcedByCell = new Map(forcedAssignments.map(item => [item.cell, item.digit]));
    const peers = new Map(tradeCells.map(cell => [cell, new Set(core.peersOf(cell))]));
    const tradeOrder = [...tradeCells].sort((left, right) =>
      candidates[left].length - candidates[right].length
      || peers.get(right).size - peers.get(left).size);
    const assigned = new Map();

    const alsHasAssignment = () => {
      const domains = alsCells.map(cell => {
        const fixed = assigned.get(cell);
        let domain = fixed === undefined
          ? candidates[cell].filter(digit => !(digit === requiredDigit && requiredSet.has(cell)))
          : [fixed];
        if (forbiddenAlsDigit !== null) {
          domain = domain.filter(digit => digit !== forbiddenAlsDigit);
        }
        domain = domain.filter(digit => !tradeCells.some(other => other !== cell
          && peers.get(other).has(cell) && assigned.get(other) === digit));
        return { cell, domain };
      }).sort((left, right) => left.domain.length - right.domain.length);
      if (domains.some(entry => !entry.domain.length)) return false;
      const digitOwner = new Map();
      const augment = (index, visited) => {
        for (const digit of domains[index].domain) {
          if (visited.has(digit)) continue;
          visited.add(digit);
          if (!digitOwner.has(digit) || augment(digitOwner.get(digit), visited)) {
            digitOwner.set(digit, index);
            return true;
          }
        }
        return false;
      };
      for (let index = 0; index < domains.length; index += 1) {
        if (!augment(index, new Set())) return false;
      }
      return true;
    };

    const visit = (index, hasExtra) => {
      if (index === tradeOrder.length) return hasExtra && alsHasAssignment();
      const cell = tradeOrder[index];
      const domain = candidates[cell].filter(digit =>
        !(digit === requiredDigit && requiredSet.has(cell))
        && (!forcedByCell.has(cell) || forcedByCell.get(cell) === digit));
      for (const digit of domain) {
        if ([...peers.get(cell)].some(peer => assigned.get(peer) === digit)) continue;
        const nextHasExtra = hasExtra || (tradeSet.has(cell) && !pair.includes(digit));
        assigned.set(cell, digit);
        const canStillBreakTrade = nextHasExtra || tradeOrder.slice(index + 1).some(other =>
          candidates[other].some(value => !pair.includes(value)
            && !(value === requiredDigit && requiredSet.has(other))
            && ![...peers.get(other)].some(peer => assigned.get(peer) === value)));
        if (canStillBreakTrade && visit(index + 1, nextHasExtra)) {
          assigned.delete(cell);
          return true;
        }
        assigned.delete(cell);
      }
      return false;
    };
    return visit(0, false);
  }

  function visitVerifiedExtendedTrades({
    candidates, pair, eligible, plusCellsForPair, units, unitByCell, onState, accept,
  }) {
    const domains = candidates.map((values, cell) => eligible.has(cell)
      ? values.filter(digit => pair.includes(digit)).map(digit => 1 << pair.indexOf(digit)) : []);
    const isRoof = candidates.map((_, cell) => plusCellsForPair.has(cell));
    const checked = new Set();
    for (const start of plusCellsForPair) {
      walkExtendedTrades({
        domains, units, unitByCell, isRoof, start, onState,
        accept(cells) {
          const key = cells.join(',');
          if (checked.has(key)) return;
          checked.add(key);
          if (forcesExtendedTrade(cells, domains, unitByCell, units.length)) accept(cells);
        },
      });
    }
  }

  function findUniquenessType3(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    const alsList = options.alsList || core.alsConstructor(candidates, {
      maxSizeDOF: 8,
      maxSizeFox: 8,
      searchLimit: true,
    });
    const results = [];
    const seen = new Set();
    let balancedTradesChecked = 0;
    let localStatesChecked = 0;
    let tradeStatesVisited = 0;
    const unitByCell = new Map(Array.from({ length: 81 }, (_, cell) => [cell, []]));
    units.forEach((unit, unitIndex) => {
      for (const cell of unit) unitByCell.get(cell).push(unitIndex);
    });
    const extended = options.extended === true;
    const sizes = extended ? EXTENDED_TYPE1_TARGET_SIZES : TARGET_SIZES;
    const targetSizes = [...sizes];
    const extendedUnitsByCell = [...unitByCell.values()];
    const baseDigitSets = extended ? [...extendedBaseDigitSets()] : Array.from({ length: 8 }, (_, i) =>
      Array.from({ length: 8 - i }, (_, j) => [i + 1, i + j + 2])).flat();

    for (const als of alsList) {
      const sector = units[als.alsSector];
      const alsCells = als.alsAllCells || [];
      const alsDigits = [...new Set(als.alsDigits || [])].sort((a, b) => a - b);
      if (!sector || !alsCells.length || als.alsDOF !== 1 || !alsDigits.length) continue;
      const alsDigitSet = new Set(alsDigits);
      const alsLocationsByDigit = new Map(alsDigits.map(digit => [digit,
        alsCells.filter(cell => candidates[cell].includes(digit))]));

      for (const pair of baseDigitSets) {
        const eligible = new Set();
        const plusCellsForPair = new Set();
        for (let cell = 0; cell < 81; cell += 1) {
          const values = candidates[cell];
          const base = values.filter(digit => pair.includes(digit));
          if (base.length < 2 || (extended && alsCells.includes(cell))) continue;
          const extras = values.filter(digit => !pair.includes(digit));
          if (extras.length > alsDigits.length) continue;
          if (extras.length) {
            if (extras.some(digit => !alsDigitSet.has(digit))) continue;
            const peers = new Set(core.peersOf(cell));
            if (!extras.every(digit => (alsLocationsByDigit.get(digit) || []).length
              && alsLocationsByDigit.get(digit).every(alsCell => peers.has(alsCell)))) continue;
          }
          eligible.add(cell);
          if (extras.length) plusCellsForPair.add(cell);
        }
        if (plusCellsForPair.size < 1) continue;

        const recordTrade = (cells, signs) => {
          if (!sizes.has(cells.length)) return;
          // A Type 3 ALS is an auxiliary structure, separate from the
          // UR trade. Sharing even one cell invalidates that structure.
          if (cells.some(cell => alsCells.includes(cell))) return;
          if (!extended && !variantAssignmentIsLegal(cells, signs, pair)) return;
          const plusCells = cells.filter(cell => plusCellsForPair.has(cell));
          const plusDigits = [...new Set(plusCells.flatMap(cell =>
            candidates[cell].filter(digit => !pair.includes(digit))))].sort((a, b) => a - b);
          if (!plusDigits.length || plusDigits.some(digit => !alsDigitSet.has(digit))) return;

          balancedTradesChecked += 1;
          if (extended && !hasType3LocalAssignment(cells, candidates, pair, alsCells)) return;
          const eliminationsByCandidate = new Map();
          const eliminationSources = {};
          const alsLockedDigitSources = {};
          const triggeringDigits = [];
          const selectedCells = new Set([...cells, ...alsCells]);
          for (const digit of plusDigits) {
            const urLocations = plusCells.filter(cell => candidates[cell].includes(digit));
            const alsLocations = alsCells.filter(cell => candidates[cell].includes(digit));
            if (!urLocations.length || !alsLocations.length) continue;
            if (!urLocations.every(cell => alsLocations.every(alsCell =>
              core.peersOf(cell).includes(alsCell)))) continue;
            const locations = [...new Set([...urLocations, ...alsLocations])];
            localStatesChecked += 1;
            if (!hasType3LocalAssignment(cells, candidates, pair, alsCells)) continue;
            if (hasType3LocalAssignment(cells, candidates, pair, alsCells, digit, locations)) continue;

            // If forbidding this digit at its ALS locations leaves no
            // trade-breaking assignment, the digit is forced into the
            // ALS locations. It is then locked there and can be removed
            // from every cell that sees all of them.
            const forcedIntoAls = !hasType3LocalAssignment(
              cells, candidates, pair, alsCells, digit, alsLocations,
            );
            if (forcedIntoAls) alsLockedDigitSources[digit] = alsLocations;
            const appendPeerEliminations = sourceLocations => {
              if (!sourceLocations.length) return [];
              let peers = new Set(core.peersOf(sourceLocations[0]));
              for (const sourceCell of sourceLocations.slice(1)) {
                const sourcePeers = new Set(core.peersOf(sourceCell));
                for (const peer of peers) if (!sourcePeers.has(peer)) peers.delete(peer);
              }
              const eliminations = [...peers]
                .filter(cell => !selectedCells.has(cell) && candidates[cell].includes(digit))
                .map(cell => ({ cell, digit }));
              for (const elimination of eliminations) {
                eliminationsByCandidate.set(`${elimination.cell}:${elimination.digit}`, elimination);
              }
              return eliminations;
            };
            // Preserve the ordinary locked-source inference and add the
            // ALS-only peer trigger when the local assignment proves it.
            const eliminations = appendPeerEliminations(locations);
            const alsEliminations = forcedIntoAls
              ? appendPeerEliminations(alsLocations) : [];
            if (!eliminations.length && !alsEliminations.length) continue;
            triggeringDigits.push(digit);
            eliminationSources[digit] = locations;
          }

          // The UR extra set has n digits for an n-cell ALS.  A
          // trade-breaking UR assignment uses one of those digits, so
          // the remaining n ALS digits include the sole surplus ALS
          // digit.  It is therefore locked to its ALS locations as well.
          const plusDigitSet = new Set(plusDigits);
          const surplusAlsDigits = alsDigits.filter(digit => !plusDigitSet.has(digit));
          for (const digit of surplusAlsDigits) {
            const alsLocations = alsCells.filter(cell => candidates[cell].includes(digit));
            localStatesChecked += 1;
            const canBreakTradeWithoutSurplusDigit = hasType3LocalAssignment(
              cells, candidates, pair, alsCells, null, [], digit,
            );
            if (alsLocations.length && !canBreakTradeWithoutSurplusDigit) {
              alsLockedDigitSources[digit] = alsLocations;
              let lockedPeers = new Set(core.peersOf(alsLocations[0]));
              for (const alsCell of alsLocations.slice(1)) {
                const peers = new Set(core.peersOf(alsCell));
                for (const peer of lockedPeers) if (!peers.has(peer)) lockedPeers.delete(peer);
              }
              for (const cell of lockedPeers) {
                if (alsCells.includes(cell) || !candidates[cell].includes(digit)) continue;
                eliminationsByCandidate.set(`${cell}:${digit}`, { cell, digit });
              }
              eliminationSources[digit] = alsLocations;
            }
          }

          // If the UR has only one possible extra digit, that digit is
          // required to break the deadly pattern. When every UR source
          // for it sees every ALS copy, it is locked out of the ALS.
          if (plusDigits.length === 1) {
            const digit = plusDigits[0];
            const urLocations = plusCells.filter(cell => candidates[cell].includes(digit));
            const alsLocations = alsCells.filter(cell => candidates[cell].includes(digit));
            const allSourcesSeeAls = urLocations.length && alsLocations.length
              && urLocations.every(cell => {
                const peers = new Set(core.peersOf(cell));
                return alsLocations.every(alsCell => peers.has(alsCell));
              });
            if (allSourcesSeeAls && !hasType3LocalAssignment(
              cells, candidates, pair, alsCells, digit, urLocations,
            )) {
              alsLockedDigitSources[digit] = alsLocations;
              eliminationSources[digit] = [...new Set([...urLocations, ...alsLocations])];
              for (const cell of alsLocations) {
                eliminationsByCandidate.set(`${cell}:${digit}`, { cell, digit });
              }
            }
          }
          if (hasType3LocalAssignment(cells, candidates, pair, alsCells)) {
            for (const cell of cells) {
              for (const digit of candidates[cell]) {
                localStatesChecked += 1;
                if (hasType3LocalAssignment(cells, candidates, pair, alsCells,
                  null, [], null, [{ cell, digit }])) continue;
                eliminationsByCandidate.set(`${cell}:${digit}`, { cell, digit });
              }
            }
          }
          if (!eliminationsByCandidate.size) return;

          const tradeKey = extended ? cells.join(',') : cells.map((cell, index) => `${cell}:${signs[index]}`).join(',');
          const reverseKey = extended ? tradeKey : cells.map((cell, index) => `${cell}:${-signs[index]}`).join(',');
          const key = `${pair.join(',')}:${tradeKey < reverseKey ? tradeKey : reverseKey}:`
            + `${als.alsSector}:${alsCells.slice().sort((a, b) => a - b).join(',')}`;
          if (seen.has(key)) return;
          seen.add(key);
          const locations = [...new Set(Object.values(eliminationSources).flat())]
            .sort((left, right) => left - right);
          results.push({
            tech: extended ? 'uniqueness-extended-type-3' : 'uniqueness-type-3',
            classification: extended ? 'Extended Unique Rectangle Type 3' : 'Unique Rectangle Type 3',
            type: 3,
            size: cells.length,
            digits: pair,
            cells,
            ...(extended ? { extended: true } : { signs }),
            plusCells,
            plusDigits,
            alsCells: [...alsCells],
            alsDigits: [...alsDigits],
            alsExclusionDigits: surplusAlsDigits.filter(digit =>
              [...eliminationsByCandidate.values()].some(item => item.digit === digit)),
            alsRecord: {
              uniqueID: als.uniqueID,
              alsAllCells: [...alsCells],
              alsDigits: [...alsDigits],
            },
            alsSector: als.alsSector,
            extraDigit: triggeringDigits[0],
            extraDigits: triggeringDigits,
            locations,
            eliminationsByDigit: eliminationSources,
            alsLockedDigitSources,
            eliminations: [...eliminationsByCandidate.values()],
          });
        };

        if (extended) {
          visitVerifiedExtendedTrades({
            candidates, pair, eligible, plusCellsForPair, units, unitByCell: extendedUnitsByCell,
            onState() {
              tradeStatesVisited += 1;
              if ((tradeStatesVisited & 8191) === 0) options.onProgress?.({
                stage: 'extended-type-3', states: tradeStatesVisited, results: results.length,
              });
            },
            accept: recordTrade,
          });
          continue;
        }

        const connectedCells = start => {
          const connected = new Set([start]);
          const queue = [start];
          for (let cursor = 0; cursor < queue.length; cursor += 1) {
            for (const unitIndex of unitByCell.get(queue[cursor])) {
              for (const cell of units[unitIndex]) {
                if (!eligible.has(cell) || connected.has(cell)) continue;
                connected.add(cell);
                queue.push(cell);
              }
            }
          }
          return [...connected];
        };

        for (const start of plusCellsForPair) {
          const component = connectedCells(start);
          const selected = new Map([[start, 1]]);
          const balances = new Int8Array(units.length);
          for (const unitIndex of unitByCell.get(start)) balances[unitIndex] = 1;
          const visitedStates = new Set();

          const visit = () => {
            const stateKey = [...selected.entries()].sort((a, b) => a[0] - b[0])
              .map(([cell, sign]) => `${cell}:${sign}`).join(',');
            if (visitedStates.has(stateKey)) return;
            visitedStates.add(stateKey);
            tradeStatesVisited += 1;
            if ((tradeStatesVisited & 8191) === 0) {
              options.onProgress?.({ stage: 'type-3-trades', states: tradeStatesVisited,
                results: results.length, sizes: targetSizes });
            }

            let chosenUnit = -1;
            let choices = null;
            for (let index = 0; index < balances.length; index += 1) {
              const balance = balances[index];
              if (!balance) continue;
              const neededSign = balance > 0 ? -1 : 1;
              const candidatesInUnit = component.filter(cell => !selected.has(cell)
                && unitByCell.get(cell).includes(index));
              if (!candidatesInUnit.length) return;
              if (!choices || candidatesInUnit.length < choices.length) {
                chosenUnit = index;
                choices = candidatesInUnit.map(cell => [cell, neededSign]);
              }
            }
            if (chosenUnit === -1) {
              const cells = [...selected.keys()].sort((a, b) => a - b);
              recordTrade(cells, cells.map(cell => selected.get(cell)));
              return;
            }
            if (selected.size >= 18) return;
            for (const [cell, sign] of choices) {
              selected.set(cell, sign);
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
              visit();
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
              selected.delete(cell);
            }
          };
          visit();
        }
      }
    }
    options.onProgress?.({ stage: 'type-3', states: localStatesChecked, results: results.length });
    return { results, stats: { states: tradeStatesVisited, balancedTradesChecked, localStatesChecked, targetSizes } };
  }

  function* restrictedFishCycles(candidates, onState) {
    // Each participating row and column has exactly two locations for the
    // digit. A connected cycle gives two disjoint alternating placements.
    for (let digit = 1; digit <= 9; digit += 1) {
      const rowCandidates = core.ROWS.map(row => row.filter(cell => candidates[cell].includes(digit)));
      for (let rowMask = 1; rowMask < (1 << 9); rowMask += 1) {
        onState();
        const rows = [];
        for (let row = 0; row < 9; row += 1) if (rowMask & (1 << row)) rows.push(row);
        const order = rows.length;
        if (order < 2 || order * 2 > 18 || !TARGET_SIZES.has(order * 2)) continue;
        if (rows.some(row => rowCandidates[row].length !== 2)) continue;
        const columns = [...new Set(rows.flatMap(row => rowCandidates[row].map(cell => cell % 9)))].sort((a, b) => a - b);
        if (columns.length !== order) continue;
        const columnSet = new Set(columns);
        if (columns.some(col => core.COLS[col].some(cell => candidates[cell].includes(digit)
          && !rows.includes((cell / 9) | 0)))) continue;
        const cells = rows.flatMap(row => rowCandidates[row]).sort((a, b) => a - b);
        if (cells.length !== order * 2) continue;
        const columnDegrees = new Map(columns.map(col => [col, 0]));
        for (const cell of cells) columnDegrees.set(cell % 9, columnDegrees.get(cell % 9) + 1);
        if (columns.some(col => columnDegrees.get(col) !== 2)) continue;

        const reachedRows = new Set([rows[0]]);
        const reachedCols = new Set();
        const queue = [{ axis: 'row', index: rows[0] }];
        for (let cursor = 0; cursor < queue.length; cursor += 1) {
          const item = queue[cursor];
          if (item.axis === 'row') {
            for (const cell of rowCandidates[item.index]) {
              const col = cell % 9;
              if (!reachedCols.has(col)) {
                reachedCols.add(col);
                queue.push({ axis: 'col', index: col });
              }
            }
          } else {
            for (const cell of core.COLS[item.index]) {
              const row = (cell / 9) | 0;
              if (rows.includes(row) && candidates[cell].includes(digit) && !reachedRows.has(row)) {
                reachedRows.add(row);
                queue.push({ axis: 'row', index: row });
              }
            }
          }
        }
        if (reachedRows.size !== order || reachedCols.size !== order) continue;

        const matchings = [];
        const chooseMatching = (index, usedColumns, selected) => {
          if (matchings.length > 2) return;
          if (index === rows.length) {
            if (usedColumns.size === order) matchings.push([...selected]);
            return;
          }
          for (const cell of rowCandidates[rows[index]]) {
            const col = cell % 9;
            if (!columnSet.has(col) || usedColumns.has(col)) continue;
            usedColumns.add(col);
            selected.push(cell);
            chooseMatching(index + 1, usedColumns, selected);
            selected.pop();
            usedColumns.delete(col);
          }
        };
        chooseMatching(0, new Set(), []);
        if (matchings.length !== 2) continue;
        const matchingSets = matchings.map(matching => new Set(matching));
        if (matchings[0].some(cell => matchingSets[1].has(cell))) continue;

        yield { digit, cells, matchingSets };
      }
    }
  }

  function findUniquenessType6(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    const results = [];
    const seen = new Set();
    let states = 0;
    const targetSizes = [...TARGET_SIZES].sort((a, b) => a - b);

    for (const { digit, cells, matchingSets } of restrictedFishCycles(candidates, () => { states += 1; })) {
    for (let otherDigit = 1; otherDigit <= 9; otherDigit += 1) {
      if (otherDigit === digit || !cells.every(cell => candidates[cell].includes(otherDigit))) continue;
      const pair = [Math.min(digit, otherDigit), Math.max(digit, otherDigit)];
      const surplusCells = cells.filter(cell => candidates[cell].some(value => !pair.includes(value)));
      if (!surplusCells.length) continue;
      const surplusSide = matchingSets.findIndex(matching => surplusCells.every(cell => matching.has(cell)));
      if (surplusSide < 0) continue;
      const targetCells = surplusCells;
      const anchorCells = cells.filter(cell => !matchingSets[surplusSide].has(cell));
      const signsByCell = new Map([
        ...[...matchingSets[surplusSide]].map(cell => [cell, 1]),
        ...[...matchingSets[1 - surplusSide]].map(cell => [cell, -1]),
      ]);
      const signs = cells.map(cell => signsByCell.get(cell));
      if (!tradeIsBalanced(cells, signs, units)
        || !variantAssignmentIsLegal(cells, signs, pair)) continue;
      const eliminations = targetCells.map(cell => ({ cell, digit }));
      const key = `${pair.join(',')}:${cells.join(',')}:${targetCells.join(',')}:${digit}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({
        tech: 'uniqueness-type-6',
        classification: 'Unique Rectangle Type 6',
        type: 6,
        size: cells.length,
        digits: pair,
        cells,
        signs,
        anchorCells,
        targetCells,
        lockedDigit: digit,
        excludedDigit: digit,
        variation: 'scaled row-column restricted fish',
        eliminations,
      });
    }
    }
    options.onProgress?.({ stage: 'type-6', states, results: results.length, sizes: targetSizes });
    return { results, stats: { states, targetSizes } };
  }

  function findExtendedUniquenessType6(candidateGrid, options = {}) {
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const candidates = Array.from({ length: 81 }, (_, cell) => [...new Set(candidateGrid?.[cell] || [])]);
    const units = classicUnits();
    const unitByCell = candidates.map((_, cell) =>
      units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const digitSets = [...extendedBaseDigitSets()];
    const targetSizes = [...EXTENDED_TYPE1_TARGET_SIZES];
    const results = [];
    const seen = new Set();
    let states = 0;
    const onState = () => {
      states += 1;
      if ((states & 8191) === 0) options.onProgress?.({
        stage: 'extended-type-6', states, results: results.length, sizes: targetSizes,
      });
    };

    for (const { digit, cells: fishCells, matchingSets } of restrictedFishCycles(candidates, onState)) {
      for (const digits of digitSets) {
        if (!digits.includes(digit)) continue;
        const hasExtra = candidates.map(values => values.some(value => !digits.includes(value)));
        const baseCells = candidates.flatMap((values, cell) =>
          values.length >= 2 && !hasExtra[cell] ? [cell] : []);
        if (baseCells.length < fishCells.length / 2) continue;
        const targetCells = fishCells.filter(cell => hasExtra[cell]);
        if (!targetCells.length || targetCells.some(cell =>
          candidates[cell].filter(value => digits.includes(value)).length < 2)) continue;
        const surplusSide = matchingSets.findIndex(matching => targetCells.every(cell => matching.has(cell)));
        if (surplusSide < 0) continue;

        // A target taking the fish digit forces that whole matching. This
        // occupies every surplus cell and leaves only the trade's base digits.
        const targetSet = new Set(targetCells);
        const eligible = new Set([...baseCells, ...targetCells]);
        visitVerifiedExtendedTrades({
          candidates, pair: digits, eligible, plusCellsForPair: targetSet, units, unitByCell, onState,
          accept(cells) {
            if (!fishCells.every(cell => cells.includes(cell))) return;
            const key = `${digits.join(',')}:${cells.join(',')}:${targetCells.join(',')}:${digit}`;
            if (seen.has(key)) return;
            seen.add(key);
            results.push({
              tech: 'uniqueness-extended-type-6', classification: 'Extended Unique Rectangle Type 6',
              type: 6, extended: true, size: cells.length, digits, cells,
              fishCells, targetCells, anchorCells: [...matchingSets[1 - surplusSide]],
              lockedDigit: digit, excludedDigit: digit,
              variation: 'scaled row-column restricted fish',
              eliminations: targetCells.map(cell => ({ cell, digit })),
            });
          },
        });
      }
    }
    options.onProgress?.({ stage: 'extended-type-6', states, results: results.length, sizes: targetSizes });
    return { results, stats: { states, targetSizes } };
  }

  function findUniquenessType7(candidateGrid, options = {}) {
    const extended = options.extended === true;
    const stage = extended ? 'extended-type-7' : 'type-7';
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    if (typeof core.buildStrongLinks !== 'function') {
      throw new Error('The strong-link builder is unavailable for Hidden Unique Rectangle search.');
    }

    const units = classicUnits();
    const peerSets = Array.from({ length: 81 }, (_, cell) => new Set(core.peersOf(cell)));
    const unitByCell = new Map(Array.from({ length: 81 }, (_, cell) => [cell, []]));
    units.forEach((unit, unitIndex) => {
      for (const cell of unit) unitByCell.get(cell).push(unitIndex);
    });
    const strongLinkSet = core.buildStrongLinks(candidates, { strongLinkTypes: [0, 1, 2, 3, 4] });
    const strongLinks = strongLinkSet.slice(0, 4).flat();
    const bivalveLinks = strongLinkSet[4];
    const linksByDigit = new Map();
    for (const link of strongLinks) {
      const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
      if (!Number.isInteger(digit) || digit < 1 || digit > 9) continue;
      if (!linksByDigit.has(digit)) linksByDigit.set(digit, []);
      linksByDigit.get(digit).push(link);
    }

    const results = [];
    const seenTrades = new Set();
    let states = 0;
    let checkedTrades = 0;
    let propagationStates = 0;
    const targetSizes = [...(extended ? EXTENDED_TYPE1_TARGET_SIZES : TARGET_SIZES)];

    const forceTradePattern = (cells, pair, signs, internalLinks, startCell, startDigit) => {
      const tradeSet = new Set(cells);
      const status = new Map();
      const keyOf = (cell, digit) => `${cell}:${digit}`;
      let contradiction = false;
      let changed = false;
      const setFalse = (cell, digit) => {
        const key = keyOf(cell, digit);
        if (status.get(key) === 1) { contradiction = true; return false; }
        if (status.get(key) === -1) return false;
        status.set(key, -1);
        changed = true;
        return true;
      };
      const setTrue = (cell, digit) => {
        if (!tradeSet.has(cell) || !candidates[cell].includes(digit)) {
          contradiction = true;
          return;
        }
        const key = keyOf(cell, digit);
        if (status.get(key) === -1) { contradiction = true; return; }
        if (status.get(key) === 1) return;
        status.set(key, 1);
        changed = true;
        for (const otherDigit of candidates[cell]) {
          if (otherDigit !== digit) setFalse(cell, otherDigit);
        }
        for (const peer of cells) {
          if (peer !== cell && peerSets[cell].has(peer)
            && candidates[peer].includes(digit)) setFalse(peer, digit);
        }
      };

      const linksUsed = new Set();
      setTrue(startCell, startDigit);
      let keepGoing = !contradiction;
      while (keepGoing && !contradiction) {
        changed = false;
        for (const cell of cells) {
          const remaining = candidates[cell].filter(digit => status.get(keyOf(cell, digit)) !== -1);
          if (!remaining.length) { contradiction = true; break; }
          if (remaining.length === 1) setTrue(cell, remaining[0]);
        }
        if (contradiction) break;

        for (const link of internalLinks) {
          const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
          // A strong-link gate guarantees one placement in the union of its
          // endpoint groups. Groups can overlap (notably ERI at its I cell),
          // so applying XOR to the two groups separately would reject a
          // placement in that shared cell. Cell-level peer constraints
          // already enforce at-most-one; propagate the exhaustive union.
          const linkCells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
            .filter(cell => candidates[cell].includes(digit));
          const trueCells = linkCells.filter(cell => status.get(keyOf(cell, digit)) === 1);
          const unresolved = linkCells.filter(cell => status.get(keyOf(cell, digit)) == null);
          if (trueCells.length > 1 || (!trueCells.length && !unresolved.length)) {
            contradiction = true;
            break;
          }
          if (!trueCells.length && unresolved.length === 1) {
            setTrue(unresolved[0], digit);
            linksUsed.add(link.id);
          }
          if (contradiction) break;
        }
        keepGoing = changed;
      }
      if (contradiction) return null;

      const assignment = cells.map(cell => {
        const selected = pair.filter(digit => status.get(keyOf(cell, digit)) === 1);
        return selected.length === 1 ? selected[0] : null;
      });
      if (assignment.some(digit => digit == null)) return null;
      if (!signs) return [...linksUsed];
      const matchesSign = multiplier => cells.every((_, index) =>
        assignment[index] === pair[signs[index] * multiplier > 0 ? 0 : 1]);
      if (!matchesSign(1) && !matchesSign(-1)) return null;
      return [...linksUsed];
    };

    const recordTrade = (cells, pair, signs, pairLinks) => {
      if (!targetSizes.includes(cells.length)) return;
      if (!cells.some(cell => candidates[cell].some(digit => !pair.includes(digit)))) return;
      if (signs && !variantAssignmentIsLegal(cells, signs, pair)) return;
      const selectedCells = new Set(cells);
      const internalLinks = pairLinks.filter(link => {
        const left = link.activeCells || [];
        const right = link.linkedCells || [];
        return left.length && right.length
          && [...left, ...right].every(cell => selectedCells.has(cell));
      });
      if (!internalLinks.length) return;
      checkedTrades += 1;
      const forward = signs ? cells.map((cell, index) => `${cell}:${signs[index]}`).join(',') : '';
      const reverse = signs ? cells.map((cell, index) => `${cell}:${-signs[index]}`).join(',') : '';
      const canonicalSigns = forward < reverse ? forward : reverse;
      const tradeKey = `${pair.join(',')}:${cells.join(',')}:${canonicalSigns}`;
      if (seenTrades.has(tradeKey)) return;
      const eliminations = new Map();
      const usedLinkIds = new Set();
      for (const cell of cells) {
        for (const digit of pair) {
          if (!candidates[cell].includes(digit)) continue;
          propagationStates += 1;
          const used = forceTradePattern(cells, pair, signs, internalLinks, cell, digit);
          if (!used) continue;
          eliminations.set(`${cell}:${digit}`, { cell, digit });
          for (const id of used) usedLinkIds.add(id);
        }
      }
      if (!eliminations.size) return;
      seenTrades.add(tradeKey);
      const linksUsed = internalLinks.filter(link => usedLinkIds.has(link.id));
      const tradeBivalves = bivalveLinks.filter(link => selectedCells.has(link.activeCells[0]));
      const internalRings = tradeBivalves.length && typeof core.findAicChains === 'function'
        ? core.findAicChains(candidates, {
          strongLinkTypes: [0, 4],
          strongLinkSet: [
            internalLinks.filter(link => Number(link.linkType) === 0), [], [], [], tradeBivalves,
          ],
          includeAls: false,
          minDepth: 2,
          maxDepth: 3,
        }).chains.filter(chain => chain.isRing
          && chain.steps.some(step => Number(step.linkType) === 4)
          && chain.steps.some(step => Number(step.linkType) === 0))
        : [];
      const contributingRings = [];
      for (const ring of internalRings) {
        if (!ring.eliminations.some(({ cell, digit }) => !eliminations.has(`${cell}:${digit}`))) continue;
        contributingRings.push(ring);
        for (const item of ring.eliminations) {
          eliminations.set(`${item.cell}:${item.digit}`, item);
        }
      }
      results.push({
        tech: extended ? 'uniqueness-extended-type-7' : 'uniqueness-type-7',
        classification: extended ? 'Hidden Extended Unique Rectangle' : 'Hidden Unique Rectangle',
        type: 7,
        size: cells.length,
        digits: pair,
        cells,
        bivalueCells: cells.filter(cell => candidates[cell].length === 2),
        ...(extended ? { extended: true } : { signs }),
        internalLinks: linksUsed,
        internalRings: contributingRings,
        eliminations: [...eliminations.values()],
      });
    };

    if (extended) {
      const housesByCell = [...unitByCell.values()];
      const isRoof = candidates.map(() => false);
      const onState = () => {
        states += 1;
        if ((states & 8191) === 0) options.onProgress?.({
          stage, states, results: results.length, checkedTrades, propagationStates, sizes: targetSizes,
        });
      };
      for (const digits of extendedBaseDigitSets()) {
        const domains = candidates.map(values => {
          const base = values.filter(digit => digits.includes(digit));
          return base.length < 2 ? [] : base.map(digit => 1 << digits.indexOf(digit));
        });
        if (!candidates.some((values, cell) => domains[cell].length
          && values.length > domains[cell].length)) continue;
        const links = digits.flatMap(digit => linksByDigit.get(digit) || []);
        const seeds = new Map();
        for (const link of links) {
          const left = link.activeCells || [];
          const right = link.linkedCells || [];
          if (Number(link.linkType) !== 0 || left.length !== 1 || right.length !== 1) continue;
          const [start, partner] = [left[0], right[0]].sort((a, b) => a - b);
          if (start === partner || !domains[start].length || !domains[partner].length) continue;
          if (!seeds.has(start)) seeds.set(start, new Set());
          seeds.get(start).add(partner);
        }

        const checked = new Set();
        for (const [start, partners] of seeds) {
          walkExtendedTrades({
            domains, units, unitByCell: housesByCell, isRoof, start, onState,
            accept(cells) {
              if (!cells.some(cell => partners.has(cell))) return;
              if (!cells.some(cell => candidates[cell].length > domains[cell].length)) return;
              const key = cells.join(',');
              if (checked.has(key)) return;
              checked.add(key);
              if (!forcesExtendedTrade(cells, domains, housesByCell, units.length)) return;
              recordTrade(cells, digits, null, links);
            },
          });
        }
      }
      options.onProgress?.({ stage, states, results: results.length,
        checkedTrades, propagationStates, sizes: targetSizes });
      return { results, stats: { states, checkedTrades, propagationStates, targetSizes } };
    }

    for (let first = 1; first <= 8; first += 1) {
      for (let second = first + 1; second <= 9; second += 1) {
        const pair = [first, second];
        const visitedStates = new Set();
        const eligible = new Set(candidates.flatMap((values, cell) =>
          pair.every(digit => values.includes(digit)) ? [cell] : []));
        const connectedCells = start => {
          const connected = new Set([start]);
          const queue = [start];
          for (let cursor = 0; cursor < queue.length; cursor += 1) {
            for (const unitIndex of unitByCell.get(queue[cursor])) {
              for (const cell of units[unitIndex]) {
                if (!eligible.has(cell) || connected.has(cell)) continue;
                connected.add(cell);
                queue.push(cell);
              }
            }
          }
          return [...connected];
        };

        const pairLinks = [...new Map([...(linksByDigit.get(first) || []), ...(linksByDigit.get(second) || [])]
          .map(link => [link.id, link])).values()];
        const seedLinks = pairLinks.filter(link => Number(link.linkType) === 0
          && (link.activeCells || []).length === 1 && (link.linkedCells || []).length === 1
          && eligible.has(link.activeCells[0]) && eligible.has(link.linkedCells[0]));
        if (!seedLinks.length) continue;
        for (const seedLink of seedLinks) {
          const digit = Number(seedLink.startingDigits?.[0] ?? seedLink.linkDigits?.[0]);
          const activeCell = seedLink.activeCells[0];
          const linkedCell = seedLink.linkedCells[0];
          const activeSign = digit === first ? 1 : -1;
          const selected = new Map([[activeCell, activeSign], [linkedCell, -activeSign]]);
          if (selected.size !== 2) continue;
          const component = connectedCells(activeCell);
          if (!component.includes(linkedCell)) continue;
          const balances = new Int8Array(units.length);
          for (const [cell, sign] of selected) {
            for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
          }
          const visit = () => {
            states += 1;
            if ((states & 8191) === 0) options.onProgress?.({
              stage: 'type-7-trades', states, results: results.length,
              checkedTrades, propagationStates, sizes: targetSizes,
            });
            const entries = [...selected.entries()].sort((a, b) => a[0] - b[0]);
            const forward = entries.map(([cell, sign]) => `${cell}:${sign}`).join(',');
            const reverse = entries.map(([cell, sign]) => `${cell}:${-sign}`).join(',');
            const stateKey = forward < reverse ? forward : reverse;
            if (visitedStates.has(stateKey)) return;
            visitedStates.add(stateKey);
            let chosenUnit = -1;
            let choices = null;
            for (let index = 0; index < balances.length; index += 1) {
              const balance = balances[index];
              if (!balance) continue;
              const neededSign = balance > 0 ? -1 : 1;
              const candidatesInUnit = component.filter(cell => !selected.has(cell)
                && unitByCell.get(cell).includes(index));
              if (!candidatesInUnit.length) return;
              if (!choices || candidatesInUnit.length < choices.length) {
                chosenUnit = index;
                choices = candidatesInUnit.map(cell => [cell, neededSign]);
              }
            }
            if (chosenUnit === -1) {
              const cells = [...selected.keys()].sort((a, b) => a - b);
              recordTrade(cells, pair, cells.map(cell => selected.get(cell)), pairLinks);
              return;
            }
            if (selected.size >= 18) return;
            for (const [cell, sign] of choices) {
              selected.set(cell, sign);
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
              visit();
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
              selected.delete(cell);
            }
          };
          visit();
        }
      }
    }
    options.onProgress?.({ stage: 'type-7', states, results: results.length,
      checkedTrades, propagationStates, sizes: targetSizes });
    return { results, stats: { states, checkedTrades, propagationStates, targetSizes } };
  }

  // External Unique Rectangle (Type 8).
  // An external ON assumption can force a balanced two-digit trade.
  // Each touched unit must contain the same digits after the trade is swapped.
  function assumeGuardianOn(candidates, locations, root, digit, depthLimit, keepPrefix = false) {
    const off = new Int8Array(81);
    const on = new Int8Array(81);
    const offBy = new Int16Array(81).fill(-1);
    const placements = [];
    const queue = [[root, 1]];
    const finish = contradiction => contradiction && !keepPrefix ? null : {
      off, on, offBy, placements, contradiction,
      locations: locations.map(cells => cells.filter(cell => !off[cell])),
    };
    on[root] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const [cell, depth] = queue[cursor];
      const peers = core.peersOf(cell);
      if (peers.some(peer => on[peer])) return finish(true);
      for (const peer of peers) {
        if (candidates[peer].includes(digit) && !off[peer]) {
          off[peer] = 1;
          offBy[peer] = cell;
        }
      }
      for (const [sector, original] of locations.entries()) {
        if (!original.length) continue;
        const remaining = original.filter(cell => !off[cell]);
        if (!remaining.length) return finish(true);
        // Only propagate singles newly forced by the assumption.
        if (depth >= depthLimit || original.length < 2 || remaining.length !== 1) continue;
        const next = remaining[0];
        if (on[next]) continue;
        on[next] = 1;
        queue.push([next, depth + 1]);
        placements.push({
          cell: next, digit, sector,
          blockers: original.filter(cell => cell !== next).map(cell => ({ cell, source: offBy[cell] })),
        });
      }
    }
    return finish(false);
  }

  function guardianForcingRecord(branch, root, digit, guardianAtoms, extraOnCells = []) {
    const needed = new Set();
    const placementByCell = new Map(branch.placements.map(item => [item.cell, item]));
    function addPlacement(cell) {
      const placement = placementByCell.get(cell);
      if (!placement || needed.has(cell)) return;
      needed.add(cell);
      for (const blocker of placement.blockers) addPlacement(blocker.source);
    }
    for (const item of guardianAtoms) addPlacement(item.digit === digit ? branch.offBy[item.cell] : item.cell);
    for (const cell of extraOnCells) addPlacement(cell);
    return {
      externalCell: root, externalDigit: digit, breakerDigit: digit, guardianAtoms,
      breakerCells: guardianAtoms.filter(item => item.digit === digit).map(item => item.cell),
      forcingPlacements: branch.placements.filter(item => needed.has(item.cell)),
    };
  }

  function groupGuardianAssumptions(results) {
    const byProof = new Map();
    for (const record of results) {
      // Group only assumptions that produce the same block and placement
      // sequence. The actual assumed cell is interchangeable in this proof.
      const key = JSON.stringify([
        record.digits, record.cells, record.breakerDigit, record.breakerCells, record.guardianAtoms,
        record.forcingSectors, record.basePairs, record.assignments,
        record.forcingPlacements?.map(item => [item.cell, item.sector, item.blockers.map(blocker =>
          [blocker.cell, blocker.source === record.externalCell ? -1 : blocker.source])]),
      ]);
      if (!byProof.has(key)) byProof.set(key, []);
      byProof.get(key).push(record);
    }
    const merged = new Set();
    for (const records of byProof.values()) {
      const available = new Map(records.map(record => [record.externalCell, record]));
      while (available.size > 1) {
        let group = [];
        for (const root of available.keys()) {
          const box = core.BOXES.find(unit => unit.includes(root));
          for (const line of [core.ROWS[Math.floor(root / 9)], core.COLS[root % 9]]) {
            const cells = line.filter(cell => available.has(cell) && box.includes(cell));
            if (cells.length > group.length) group = cells;
          }
        }
        if (group.length < 2) break;
        const members = group.map(cell => available.get(cell));
        const [record] = members;
        record.externalCells = group;
        record.eliminations = members.flatMap(member => member.eliminations);
        for (const cell of group) available.delete(cell);
        for (const member of members.slice(1)) merged.add(member);
      }
    }
    if (merged.size) results.splice(0, results.length, ...results.filter(record => !merged.has(record)));
    return results;
  }

  function createExternalGuardianSearch(candidates, depth = 4, keepPrefix = false) {
    const units = classicUnits();
    const locations = Array.from({ length: 10 }, (_, digit) =>
      units.map(unit => unit.filter(cell => candidates[cell].includes(digit))));
    const cache = new Map();
    return (cells, guardians) => {
      if (!guardians.length) return [];
      const selected = new Set(cells);
      const results = [];
      for (const [cell, values] of candidates.entries()) {
        if (values.length < 2 || selected.has(cell)) continue;
        for (const digit of values) {
          const key = cell * 10 + digit;
          if (!cache.has(key)) {
            cache.set(key, assumeGuardianOn(candidates, locations[digit], cell, digit, depth, keepPrefix));
          }
          const branch = cache.get(key);
          if (!branch || !guardians.every(item => item.digit === digit ? branch.off[item.cell] : branch.on[item.cell])) continue;
          results.push({ ...guardianForcingRecord(branch, cell, digit, guardians), eliminations: [{ cell, digit }] });
        }
      }
      const pairDigits = [...new Set(cells.flatMap(cell => candidates[cell]))];
      return results.concat(findPairedExternalGuardians(candidates, cells, pairDigits));
    };
  }

  // Direct paired guardians are shared by UR-family searches that reuse the
  // external-guardian engine. Each guardian is the third occurrence of the
  // same digit in a house containing two cells of the trade. The two guardians
  // must use the same house orientation (rows, columns, or boxes), and the
  // common peers inside the trade are the legal eliminations.
  function findPairedExternalGuardians(candidates, cells, digits, targetSizes = TARGET_SIZES) {
    const units = classicUnits();
    const formation = new Set(cells);
    if (cells.length < 4 || !targetSizes.has(cells.length)) return [];
    const pair = [...new Set(digits)].sort((a, b) => a - b);
    if (pair.length !== 2) return [];
    const templates = exposedPairTemplates(cells, pair);
    if (!templates) return [];
    const signs = templates[0].map(value => value === pair[0] ? 1 : -1);
    if (!tradeIsBalanced(cells, signs, units)) return [];
    const results = [];
    const seen = new Set();
    for (const digit of pair) {
      const optionsByHouse = [];
      for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
        const unit = units[unitIndex];
        const inside = unit.filter(cell => formation.has(cell) && candidates[cell].includes(digit));
        if (inside.length !== 2) continue;
        const locations = unit.filter(cell => candidates[cell].includes(digit));
        if (locations.length !== 3) continue;
        const externalCell = locations.find(cell => !formation.has(cell));
        if (!Number.isInteger(externalCell)) continue;
        optionsByHouse.push({ unitIndex, externalCell });
      }
      for (let left = 0; left < optionsByHouse.length; left += 1) {
        for (let right = left + 1; right < optionsByHouse.length; right += 1) {
          const first = optionsByHouse[left];
          const second = optionsByHouse[right];
          if (first.externalCell === second.externalCell
            || Math.floor(first.unitIndex / 9) !== Math.floor(second.unitIndex / 9)) continue;
          const sameBand = Math.floor(first.externalCell / 27) === Math.floor(second.externalCell / 27);
          const sameStack = Math.floor((first.externalCell % 9) / 3)
            === Math.floor((second.externalCell % 9) / 3);
          if (!sameBand && !sameStack) continue;
          const guardianCells = [first.externalCell, second.externalCell].sort((a, b) => a - b);
          const targets = cells.filter(cell => candidates[cell].includes(digit)
            && core.peersOf(guardianCells[0]).includes(cell)
            && core.peersOf(guardianCells[1]).includes(cell));
          if (!targets.length) continue;
          const key = `${cells.join(',')}:${digit}:${guardianCells.join(',')}:${targets.join(',')}`;
          if (seen.has(key)) continue;
          seen.add(key);
          results.push({
            externalCell: guardianCells[0], externalCells: guardianCells,
            externalDigit: digit, breakerDigit: digit, breakerCells: guardianCells,
            guardianCells, guardianPair: true, externalMode: 'guardian-pair',
            eliminations: targets.map(cell => ({ cell, digit })),
          });
        }
      }
    }
    return results;
  }

  function findUniquenessType8(candidateGrid, options = {}) {
    const extended = options.extended === true;
    const stage = extended ? 'extended-type-8' : 'type-8';
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])]);
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => core.getVariantSettings?.()[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    // A balanced 16-cell trade fills eight rows and eight columns with
    // both digits. The remaining row and column would require both digits
    // to occupy their one shared cell.
    const supportedSizes = extended ? EXTENDED_TYPE1_TARGET_SIZES
      : new Set([...TARGET_SIZES].filter(size => size !== 16));
    const targetSizes = [...supportedSizes];
    const results = [];
    const digitLocations = Array.from({ length: 10 }, (_, digit) =>
      units.map(unit => unit.filter(cell => candidates[cell].includes(digit))));
    const maxDepth = Math.max(1, Math.min(8, Number(options.maxDepth) || 4));
    let states = 0;

    const assumeOn = (root, digit, depthLimit) =>
      assumeGuardianOn(candidates, digitLocations[digit], root, digit, depthLimit, true);

    // If either digit is absent from a cell, its sector link forces that
    // digit into the opposite cell. A placed digit excludes the other digit
    // in its cell. Test whether a cell can escape both template digits.
    function canEscapePair(start, links) {
      const truths = new Int8Array(162);
      const queue = [[start * 2, -1], [start * 2 + 1, -1]];
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const [atom, truth] = queue[cursor];
        if (truths[atom] === -truth) return false;
        if (truths[atom]) continue;
        truths[atom] = truth;
        for (const neighbor of links[atom]) queue.push([neighbor, -truth]);
        if (truth === 1) queue.push([atom ^ 1, -1]);
      }
      return true;
    }

    const reported = new Set();
    function report(root, digit, cells, digits, templates, signs, breakerCells, forcingSectors, branch) {
      const key = `${root}:${digit}:${digits.join(',')}:${cells.join(',')}`;
      if (reported.has(key)) return;
      reported.add(key);
      results.push({
        tech: extended ? 'uniqueness-extended-type-8' : 'uniqueness-type-8',
        classification: extended ? 'External Extended Unique Rectangle' : 'External Unique Rectangle',
        type: 8,
        size: cells.length,
        digits,
        cells,
        ...(extended ? { extended: true } : {
          signs,
          templates: templates.map(assignment => ({ cells, digits, assignment })),
        }),
        fullyExposed: true,
        interchangeable: true,
        ...guardianForcingRecord(branch, root, digit, breakerCells.map(cell => ({ cell, digit }))),
        forcingSectors,
        externalMode: 'forcing-chain',
        eliminations: [{ cell: root, digit }],
      });
    }

    // A third digit can guard the trade inside its cells. This also permits
    // an 18-cell trade, whose two template digits already use every row and
    // column and therefore cannot be assumed ON outside it.
    function checkInternalGuardians(root, digit, branch) {
      const { off } = branch;
      const pairsByCell = candidates.map((values, cell) => {
        if (cell === root) return '';
        const remaining = off[cell] ? values.filter(value => value !== digit) : values;
        return remaining.length === 2 && !remaining.includes(digit)
          ? [...remaining].sort((left, right) => left - right).join('') : '';
      });
      const visited = new Set();
      for (let start = 0; start < 81; start += 1) {
        const pair = pairsByCell[start];
        if (!pair || !off[start] || visited.has(start)) continue;
        const cells = [start];
        visited.add(start);
        for (let cursor = 0; cursor < cells.length; cursor += 1) {
          for (const peer of core.peersOf(cells[cursor])) {
            if (visited.has(peer) || pairsByCell[peer] !== pair) continue;
            visited.add(peer);
            cells.push(peer);
          }
        }
        if (!supportedSizes.has(cells.length)) continue;
        cells.sort((left, right) => left - right);
        const digits = [...pair].map(Number);
        const templates = exposedPairTemplates(cells, digits);
        if (!templates) continue;
        const signs = templates[0].map(value => value === digits[0] ? 1 : -1);
        if (!tradeIsBalanced(cells, signs, units)) continue;
        const guardians = cells.filter(cell => off[cell]);
        report(root, digit, cells, digits, templates, signs, guardians, [], branch);
      }
    }

    const extendedSearch = extended ? makeExtendedGuardianSearch({
      candidates, units, digitLocations, report, onState: () => {
        states += 1;
        if ((states & 8191) === 0) options.onProgress?.({ stage, states, results: results.length });
      },
    }) : null;

    for (let depth = 1; depth <= maxDepth; depth += 1) {
      for (let root = 0; root < candidates.length; root += 1) {
        if (candidates[root].length < 2) continue;
        for (const digit of candidates[root]) {
          states += 1;
          if (states % 64 === 0) options.onProgress?.({ stage, states, results: results.length });
          const branch = assumeOn(root, digit, depth);
          if (!branch) continue;
          if (extendedSearch) {
            extendedSearch(root, digit, branch);
            continue;
          }
          checkInternalGuardians(root, digit, branch);
          // A later contradiction does not undo a completed internal-guardian
          // proof. Sector lock searches still require a consistent branch.
          if (branch.contradiction) continue;
          for (let other = 1; other <= 9; other += 1) {
            if (other === digit) continue;
            const pair = [digit, other];
            const eligible = candidates.map((values, cell) =>
              cell !== root && !branch.off[cell] && values.includes(digit) && values.includes(other));
            const links = Array.from({ length: 162 }, () => []);
            const lockedSectors = [];
            const branchLocations = [branch.locations, digitLocations[other]];
            for (const [index, sectors] of branchLocations.entries()) {
              for (const [sector, cells] of sectors.entries()) {
                if (cells.length !== 2 || !cells.every(cell => eligible[cell])) continue;
                const [left, right] = cells.map(cell => cell * 2 + index);
                links[left].push(right);
                links[right].push(left);
                if (index === 0 && digitLocations[digit][sector].length > 2) {
                  lockedSectors.push({ sector, cells });
                }
              }
            }
            const seen = new Set();
            // Each component starts from a lock created by this branch.
            for (const lock of lockedSectors) {
              if (seen.has(lock.cells[0])) continue;
              const cells = [lock.cells[0]];
              const component = new Set(cells);
              for (let cursor = 0; cursor < cells.length; cursor += 1) {
                const cell = cells[cursor];
                for (const atom of [...links[cell * 2], ...links[cell * 2 + 1]]) {
                  const neighbor = atom >> 1;
                  if (component.has(neighbor)) continue;
                  component.add(neighbor);
                  cells.push(neighbor);
                }
              }
              for (const cell of cells) seen.add(cell);
              if (!supportedSizes.has(cells.length)) continue;
              cells.sort((left, right) => left - right);
              const digits = [...pair].sort((left, right) => left - right);
              const templates = exposedPairTemplates(cells, digits);
              if (!templates) continue;
              const signs = templates[0].map(value => value === digits[0] ? 1 : -1);
              if (!tradeIsBalanced(cells, signs, units)
                || cells.some(cell => canEscapePair(cell, links))) continue;
  
              // All outside copies in these sectors were actually removed by
              // the assumption. Only the assumption is a real elimination.
              const requiredLocks = lockedSectors.filter(entry => component.has(entry.cells[0]));
              const removedLinks = [];
              for (let index = requiredLocks.length - 1; index >= 0; index -= 1) {
                const [left, right] = requiredLocks[index].cells.map(cell => cell * 2);
                links[left].splice(links[left].indexOf(right), 1);
                links[right].splice(links[right].indexOf(left), 1);
                if (cells.every(cell => !canEscapePair(cell, links))) {
                  requiredLocks.splice(index, 1);
                  removedLinks.push([left, right]);
                  continue;
                }
                links[left].push(right);
                links[right].push(left);
              }
              for (const [left, right] of removedLinks) {
                links[left].push(right);
                links[right].push(left);
              }
              if (!requiredLocks.length) continue;
              const forcingSectors = requiredLocks.map(entry => entry.sector);
              const breakerCells = [...new Set(forcingSectors.flatMap(sector =>
                digitLocations[digit][sector].filter(cell => branch.off[cell])))].sort((a, b) => a - b);
              report(root, digit, cells, digits, templates, signs, breakerCells, forcingSectors, branch);
            }
          }
        }
      }
    }

    // Paired external guardians: when a candidate from the UR digit pair is
    // the only third occurrence in two different houses, at least one of the
    // two external cells must carry that digit. Any UR cell seeing both
    // guardians therefore cannot carry it. This is the direct guardian form;
    // it does not require a forcing-chain prefix from either guardian.
    if (!extended) for (const base of [...results]) {
      for (const proof of findPairedExternalGuardians(candidates, base.cells, base.digits)) {
        results.push({ ...base, ...proof, forcingPlacements: [], forcingSectors: [] });
      }
    }
    if (extended) for (const base of [...results]) {
      for (const proof of findPairedExternalGuardians(candidates, base.cells, base.digits, supportedSizes)) {
        results.push({ ...base, ...proof, forcingPlacements: [], forcingSectors: [] });
      }
    }

    groupGuardianAssumptions(results);
    options.onProgress?.({ stage, states, results: results.length, targetSizes });
    return { results, stats: { states, targetSizes } };
  }

  function makeExtendedGuardianSearch({ candidates, units, digitLocations, report, onState }) {
    const housesByCell = candidates.map((_, cell) =>
      units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const digitSets = [...extendedBaseDigitSets()];
    const masks = candidates.map(values => values.reduce((mask, digit) => mask | (1 << digit), 0));
    const seenBranches = new Set();

    function sectorProof(cells, digits, digit, branch) {
      const formation = new Set(cells);
      const positions = new Map(cells.map((cell, index) => [cell, index]));
      const peers = cells.map(cell => core.peersOf(cell).filter(peer => formation.has(peer))
        .map(peer => positions.get(peer)));
      const baseMask = digits.reduce((mask, value) => mask | (1 << value), 0);
      const branchBit = 1 << digit;
      const closedSectors = locations => digits.flatMap(value =>
        (value === digit ? locations : digitLocations[value]).flatMap(copies =>
          copies.length && copies.every(cell => formation.has(cell))
            ? [{ bit: 1 << value, cells: copies.map(cell => positions.get(cell)) }] : []));
      const original = cells.map(cell => masks[cell]);
      const reduced = cells.map(cell => branch.on[cell] ? branchBit
        : branch.off[cell] ? masks[cell] & ~branchBit : masks[cell]);

      function propagate(domains, sectors) {
        let changed;
        do {
          changed = false;
          for (let index = 0; index < domains.length; index += 1) {
            const mask = domains[index];
            if (!mask) return false;
            if (mask & (mask - 1)) continue;
            for (const peer of peers[index]) {
              if (!(domains[peer] & mask)) continue;
              domains[peer] &= ~mask;
              changed = true;
              if (!domains[peer]) return false;
            }
          }
          for (const { bit, cells: copies } of sectors) {
            const remaining = copies.filter(index => domains[index] & bit);
            if (!remaining.length) return false;
            if (remaining.length === 1 && domains[remaining[0]] !== bit) {
              domains[remaining[0]] = bit;
              changed = true;
            }
          }
        } while (changed);
        return true;
      }

      const canEscape = (domains, sectors) => domains.some((mask, index) => {
        if (!(mask & ~baseMask)) return false;
        const forced = [...domains];
        forced[index] &= ~baseMask;
        return propagate(forced, sectors);
      });
      const sectors = closedSectors(branch.locations);
      if (canEscape(reduced, sectors) || !canEscape(original, closedSectors(digitLocations[digit]))) return false;

      // Reject a branch that merely contradicts Sudoku instead of exposing
      // a filling of the formation. The trade verifier guarantees a swap.
      function hasFilling(domains) {
        if (!propagate(domains, sectors)) return false;
        let choice = -1;
        for (let index = 0; index < domains.length; index += 1) {
          if (domains[index] & (domains[index] - 1)) { choice = index; break; }
        }
        if (choice === -1) return true;
        for (let mask = domains[choice]; mask; mask &= mask - 1) {
          const next = [...domains];
          next[choice] = mask & -mask;
          if (hasFilling(next)) return true;
        }
        return false;
      }
      return hasFilling(reduced.map(mask => mask & baseMask));
    }

    return (root, digit, branch) => {
      const branchKey = `${root}:${digit}:${branch.off.join('')}:${branch.on.join('')}`;
      if (seenBranches.has(branchKey)) return;
      seenBranches.add(branchKey);
      const changedSectors = branch.locations.flatMap((copies, sector) =>
        copies.length === 2 && digitLocations[digit][sector].length > copies.length
          && !copies.includes(root) ? [sector] : []);
      for (const digits of digitSets) {
        const internalGuardians = !digits.includes(digit);
        if (!internalGuardians && (branch.contradiction || !changedSectors.length)) continue;
        const baseMask = digits.reduce((mask, value) => mask | (1 << value), 0);
        const eligible = new Set();
        const changedCells = new Set();
        const domains = candidates.map((values, cell) => {
          if (cell === root) return [];
          const base = values.filter(value => digits.includes(value));
          if (base.length < 2) return [];
          if (internalGuardians) {
            const extra = masks[cell] & ~baseMask;
            if (extra && !(branch.off[cell] && extra === (1 << digit))) return [];
            if (extra) changedCells.add(cell);
          }
          eligible.add(cell);
          return base.map(value => 1 << digits.indexOf(value));
        });
        if (eligible.size < 6) continue;
        if (internalGuardians) {
          visitVerifiedExtendedTrades({
            candidates, pair: digits, eligible, plusCellsForPair: changedCells, units,
            unitByCell: housesByCell, onState,
            accept(cells) {
              report(root, digit, cells, digits, null, null, cells.filter(cell => changedCells.has(cell)), [], branch);
            },
          });
          continue;
        }
        if (![...eligible].some(cell => masks[cell] & ~baseMask)) continue;
        const locks = changedSectors.filter(sector => branch.locations[sector].every(cell => eligible.has(cell)));
        const checked = new Set();
        const isRoof = candidates.map(() => false);
        for (const start of new Set(locks.map(sector => branch.locations[sector][0]))) {
          walkExtendedTrades({
            domains, units, unitByCell: housesByCell, isRoof, start, onState,
            accept(cells) {
              const key = cells.join(',');
              if (checked.has(key) || !cells.some(cell => masks[cell] & ~baseMask)) return;
              checked.add(key);
              const formation = new Set(cells);
              const forcingSectors = locks.filter(sector => branch.locations[sector].every(cell => formation.has(cell))
                && digitLocations[digit][sector].some(cell => !formation.has(cell) && branch.off[cell]));
              if (!forcingSectors.length || !sectorProof(cells, digits, digit, branch)
                || !forcesExtendedTrade(cells, domains, housesByCell, units.length)) return;
              const guardians = [...new Set(forcingSectors.flatMap(sector =>
                digitLocations[digit][sector].filter(cell => branch.off[cell])))].sort((a, b) => a - b);
              report(root, digit, cells, digits, null, null, guardians, forcingSectors, branch);
            },
          });
        }
      }
    };
  }

  function findUniquenessType4(candidateGrid, options = {}) {
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    const unitByCell = new Map(Array.from({ length: 81 }, (_, cell) => [cell, []]));
    units.forEach((unit, unitIndex) => {
      for (const cell of unit) unitByCell.get(cell).push(unitIndex);
    });
    const targetSizes = [...TARGET_SIZES].sort((a, b) => a - b);
    const results = [];
    const seen = new Set();
    let states = 0;
    let checkedSeeds = 0;

    for (let first = 1; first <= 8; first += 1) {
      for (let second = first + 1; second <= 9; second += 1) {
        const pair = [first, second];
        const exactCells = new Set(candidates.flatMap((values, cell) =>
          values.length === 2 && pair.every(digit => values.includes(digit)) ? [cell] : []));
        const semiLockedCells = new Set(candidates.flatMap((values, cell) =>
          values.length > 2 && pair.every(digit => values.includes(digit)) ? [cell] : []));
        if (exactCells.size < 2 || semiLockedCells.size < 2) continue;

        const eligible = new Set([...exactCells, ...semiLockedCells]);
        const connectedCells = start => {
          const connected = new Set([start]);
          const queue = [start];
          for (let cursor = 0; cursor < queue.length; cursor += 1) {
            for (const unitIndex of unitByCell.get(queue[cursor])) {
              for (const cell of units[unitIndex]) {
                if (!eligible.has(cell) || connected.has(cell)) continue;
                connected.add(cell);
                queue.push(cell);
              }
            }
          }
          return [...connected];
        };

        for (let targetUnitIndex = 0; targetUnitIndex < units.length; targetUnitIndex += 1) {
          const targetUnit = units[targetUnitIndex];
          const targetChoices = targetUnit.filter(cell => semiLockedCells.has(cell));
          for (let targetAIndex = 0; targetAIndex < targetChoices.length; targetAIndex += 1) {
            for (let targetBIndex = targetAIndex + 1; targetBIndex < targetChoices.length; targetBIndex += 1) {
              const targetCells = [targetChoices[targetAIndex], targetChoices[targetBIndex]];
              for (const lockedDigit of pair) {
                const restrictedLocations = targetUnit.filter(cell => candidates[cell].includes(lockedDigit));
                if (restrictedLocations.length !== 2
                  || !targetCells.every(cell => restrictedLocations.includes(cell))) continue;
                const excludedDigit = pair.find(digit => digit !== lockedDigit);

                for (let anchorUnitIndex = 0; anchorUnitIndex < units.length; anchorUnitIndex += 1) {
                  if (anchorUnitIndex === targetUnitIndex) continue;
                  const anchorUnit = units[anchorUnitIndex];
                  const anchorChoices = anchorUnit.filter(cell => exactCells.has(cell)
                    && !targetCells.includes(cell));
                  for (let anchorAIndex = 0; anchorAIndex < anchorChoices.length; anchorAIndex += 1) {
                    for (let anchorBIndex = anchorAIndex + 1; anchorBIndex < anchorChoices.length; anchorBIndex += 1) {
                      const anchorCells = [anchorChoices[anchorAIndex], anchorChoices[anchorBIndex]];
                      const anchorDigitRestricted = pair.some(digit => {
                        const locations = anchorUnit.filter(cell => candidates[cell].includes(digit));
                        return locations.length === 2 && anchorCells.every(cell => locations.includes(cell));
                      });
                      if (!anchorDigitRestricted) continue;
                      const seedCells = [...new Set([...anchorCells, ...targetCells])].sort((a, b) => a - b);
                      if (seedCells.length !== 4) continue;

                      const seedSignsByCell = new Map();
                      for (let patternMask = 0; patternMask < 8; patternMask += 1) {
                        const pattern = [1, ...[0, 1, 2].map(bit =>
                          (patternMask >> bit) & 1 ? 1 : -1)];
                        const signs = new Map(seedCells.map((cell, index) => [cell, pattern[index]]));
                        if (!tradeIsBalanced(seedCells, seedCells.map(cell => signs.get(cell)), units)) continue;
                        if (!variantAssignmentIsLegal(seedCells, seedCells.map(cell => signs.get(cell)), pair)) continue;
                        seedSignsByCell.set(seedCells.map(cell => `${cell}:${signs.get(cell)}`).join(','), signs);
                      }
                      if (!seedSignsByCell.size) continue;
                      checkedSeeds += 1;

                      const seedKey = `${pair.join(',')}:${anchorCells.join(',')}:`
                        + `${targetCells.join(',')}:${lockedDigit}`;
                      for (const seed of seedSignsByCell.values()) {
                        const component = connectedCells(seedCells[0]);
                        const selected = new Map(seed);
                        const balances = new Int8Array(units.length);
                        for (const [cell, sign] of selected) {
                          for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
                        }
                        const visited = new Set();

                        const recordTrade = () => {
                          const cells = [...selected.keys()].sort((a, b) => a - b);
                          if (!TARGET_SIZES.has(cells.length)) return;
                          const signs = cells.map(cell => selected.get(cell));
                          if (!variantAssignmentIsLegal(cells, signs, pair)) return;
                          const eliminations = targetCells
                            .filter(cell => candidates[cell].includes(excludedDigit))
                            .map(cell => ({ cell, digit: excludedDigit }));
                          if (!eliminations.length) return;
                          const forward = cells.map((cell, index) => `${cell}:${signs[index]}`).join(',');
                          const reverse = cells.map((cell, index) => `${cell}:${-signs[index]}`).join(',');
                          const key = `${seedKey}:${cells.join(',')}:${forward < reverse ? forward : reverse}`;
                          if (seen.has(key)) return;
                          seen.add(key);
                          results.push({
                            tech: 'uniqueness-type-4',
                            classification: 'Unique Rectangle Type 4',
                            type: 4,
                            size: cells.length,
                            digits: pair,
                            cells,
                            signs,
                            anchorCells,
                            targetCells,
                            lockedDigit,
                            excludedDigit,
                            anchorUnit: anchorUnitIndex,
                            targetUnit: targetUnitIndex,
                            eliminations,
                          });
                        };

                        const visit = () => {
                          states += 1;
                          if ((states & 8191) === 0) options.onProgress?.({
                            stage: 'type-4-trades', states, results: results.length, sizes: targetSizes,
                          });
                          const stateKey = [...selected.entries()].sort((a, b) => a[0] - b[0])
                            .map(([cell, sign]) => `${cell}:${sign}`).join(',');
                          if (visited.has(stateKey)) return;
                          visited.add(stateKey);
                          let choices = null;
                          for (let unitIndex = 0; unitIndex < balances.length; unitIndex += 1) {
                            if (!balances[unitIndex]) continue;
                            const neededSign = balances[unitIndex] > 0 ? -1 : 1;
                            const available = component.filter(cell => !selected.has(cell)
                              && unitByCell.get(cell).includes(unitIndex));
                            if (!available.length) return;
                            if (!choices || available.length < choices.length) {
                              choices = available.map(cell => [cell, neededSign]);
                            }
                          }
                          if (!choices) {
                            recordTrade();
                            return;
                          }
                          if (selected.size >= 18) return;
                          for (const [cell, sign] of choices) {
                            selected.set(cell, sign);
                            for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
                            visit();
                            for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
                            selected.delete(cell);
                          }
                        };
                        visit();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    options.onProgress?.({ stage: 'type-4', states, results: results.length, sizes: targetSizes });
    return { results, stats: { states, checkedSeeds, targetSizes } };
  }

  function findExtendedUniquenessType4(candidateGrid, options = {}) {
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const candidates = Array.from({ length: 81 }, (_, cell) => [...new Set(candidateGrid?.[cell] || [])]);
    const units = classicUnits();
    const unitByCell = candidates.map((_, cell) =>
      units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const sectorLocks = units.flatMap((unit, targetUnit) =>
      Array.from({ length: 9 }, (_, index) => {
        const lockedDigit = index + 1;
        const targetCells = unit.filter(cell => candidates[cell].includes(lockedDigit));
        return { targetCells, lockedDigit, targetUnit };
      }).filter(({ targetCells }) => targetCells.length === 2
        && targetCells.every(cell => candidates[cell].length >= 3)));
    const results = [];
    const seen = new Set();
    const targetSizes = [...EXTENDED_TYPE1_TARGET_SIZES];
    let states = 0;

    for (const digits of extendedBaseDigitSets()) {
      const exact = new Set(candidates.flatMap((values, cell) =>
        values.length >= 2 && values.every(digit => digits.includes(digit)) ? [cell] : []));
      if (exact.size < 4) continue;
      for (const { targetCells, lockedDigit, targetUnit } of sectorLocks) {
        if (!digits.includes(lockedDigit) || !targetCells.every(cell => !exact.has(cell)
          && candidates[cell].filter(digit => digits.includes(digit)).length >= 2)) continue;
        const eligible = new Set([...exact, ...targetCells]);
        visitVerifiedExtendedTrades({
          candidates, pair: digits, eligible, plusCellsForPair: new Set(targetCells), units, unitByCell,
          onState() {
            states += 1;
            if ((states & 8191) === 0) options.onProgress?.({
              stage: 'extended-type-4', states, results: results.length, sizes: targetSizes,
            });
          },
          accept(cells) {
            if (!targetCells.every(cell => cells.includes(cell))) return;
            const key = `${digits.join(',')}:${cells.join(',')}:${targetCells.join(',')}:${lockedDigit}`;
            if (seen.has(key)) return;
            seen.add(key);
            // The sector needs the locked digit at one target. Any base digit
            // at the other target leaves the entire verified trade in its
            // base domains, so that other target must use an extra digit.
            const eliminations = targetCells.flatMap(cell => candidates[cell]
              .filter(digit => digit !== lockedDigit && digits.includes(digit))
              .map(digit => ({ cell, digit })));
            results.push({
              tech: 'uniqueness-extended-type-4', classification: 'Extended Unique Rectangle Type 4',
              type: 4, extended: true, size: cells.length, digits, cells,
              targetCells, lockedDigit, targetUnit, eliminations,
            });
          },
        });
      }
    }
    options.onProgress?.({ stage: 'extended-type-4', states, results: results.length, sizes: targetSizes });
    return { results, stats: { states, targetSizes } };
  }

  function hasType3MultiAlsAssignment(tradeCells, candidates, pair, alsGroups,
    forbidden = new Set(), forcedAssignments = []) {
    const allAlsCells = alsGroups.flatMap(group => group.cells);
    const forcedByCell = new Map(forcedAssignments.map(item => [item.cell, item.digit]));
    const baseStructureCells = [...tradeCells, ...allAlsCells];
    if (new Set(baseStructureCells).size !== baseStructureCells.length) return false;
    const structureCells = [...new Set([...baseStructureCells, ...forcedByCell.keys()])];
    const tradeSet = new Set(tradeCells);
    const alsCellSet = new Set(allAlsCells);
    const peerSets = new Map(structureCells.map(cell => [cell, new Set(core.peersOf(cell))]));
    const domains = new Map(structureCells.map(cell => [cell,
      candidates[cell].filter(digit => !forbidden.has(`${cell}:${digit}`)
        && (!forcedByCell.has(cell) || forcedByCell.get(cell) === digit))]));
    if (structureCells.some(cell => !domains.get(cell).length)) return false;
    const tradeOrder = [...tradeCells].sort((left, right) =>
      domains.get(left).length - domains.get(right).length);
    const alsOrder = allAlsCells.filter(cell => !tradeSet.has(cell)).sort((left, right) =>
      domains.get(left).length - domains.get(right).length);
    const forcedOrder = [...forcedByCell.keys()].filter(cell =>
      !tradeSet.has(cell) && !alsCellSet.has(cell));
    const order = [...tradeOrder, ...alsOrder, ...forcedOrder];
    const assigned = new Map();
    const canStillBreakTrade = index => tradeOrder.slice(index).some(cell =>
      domains.get(cell).some(digit => !pair.includes(digit)
        && ![...peerSets.get(cell)].some(peer => assigned.get(peer) === digit)));
    const visit = (index, hasExtra) => {
      if (index === order.length) return hasExtra;
      if (!hasExtra && !canStillBreakTrade(index)) return false;
      const cell = order[index];
      for (const digit of domains.get(cell)) {
        if ([...peerSets.get(cell)].some(peer => assigned.get(peer) === digit)) continue;
        assigned.set(cell, digit);
        if (visit(index + 1, hasExtra || (tradeSet.has(cell) && !pair.includes(digit)))) {
          assigned.delete(cell);
          return true;
        }
        assigned.delete(cell);
      }
      return false;
    };
    return visit(0, false);
  }

  function findUniquenessType3AlsPath(candidateGrid, options = {}, pathLength = 2) {
    const isAlsChainSearch = pathLength === 'chain';
    const extended = options.extended === true;
    const extendedSuffix = isAlsChainSearch ? 'chain' : pathLength === 2 ? 'xz' : 'xy';
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const variantSettings = core.getVariantSettings?.() || {};
    const unsupportedVariants = [
      'diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive',
    ].filter(name => variantSettings[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };

    const units = classicUnits();
    const alsList = options.alsList || core.alsConstructor(candidates, {
      maxSizeDOF: 8, maxSizeFox: 8, searchLimit: true,
    });
    const alsPaths = [];
    const pairConnections = new Map();
    const pairableAls = alsList.filter(als => als.alsDOF === 1);
    for (let leftIndex = 0; leftIndex < pairableAls.length; leftIndex += 1) {
      const left = pairableAls[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < pairableAls.length; rightIndex += 1) {
        const right = pairableAls[rightIndex];
        const leftCells = [...left.alsAllCells];
        const rightCells = [...right.alsAllCells];
        if (leftCells.some(cell => rightCells.includes(cell))) continue;
        const bridges = [...new Set(left.alsDigits.filter(digit => right.alsDigits.includes(digit))) ]
          .map(digit => ({
            digit,
            leftCells: leftCells.filter(cell => candidates[cell].includes(digit)),
            rightCells: rightCells.filter(cell => candidates[cell].includes(digit)),
          }))
          .filter(bridge => bridge.leftCells.length && bridge.rightCells.length
            && bridge.leftCells.every(a => bridge.rightCells.every(b => core.peersOf(a).includes(b))));
        if (!bridges.length) continue;
        const toRecord = als => ({
          uniqueID: als.uniqueID,
          alsAllCells: [...als.alsAllCells],
          alsDigits: [...als.alsDigits],
        });
        const connection = {
          left: { ...toRecord(left), cells: leftCells, digits: [...left.alsDigits] },
          right: { ...toRecord(right), cells: rightCells, digits: [...right.alsDigits] },
          bridges,
        };
        for (const als of [connection.left, connection.right]) {
          const bucket = pairConnections.get(als.uniqueID) || [];
          bucket.push(connection);
          pairConnections.set(als.uniqueID, bucket);
        }
      }
    }

    if (pathLength === 2) {
      const seenPairs = new Set();
      for (const connections of pairConnections.values()) {
        for (const connection of connections) {
          const key = [connection.left.uniqueID, connection.right.uniqueID].sort().join('|');
          if (seenPairs.has(key)) continue;
          seenPairs.add(key);
          const restrictedDigits = connection.bridges.map(bridge => bridge.digit);
          alsPaths.push({
            link: { C: { restrictedDigits, digits: restrictedDigits, bridges: connection.bridges } },
            groups: [connection.left, connection.right],
          });
        }
      }
    } else {
      const seenPaths = new Set();
      let pathStatesVisited = 0;
      const walkAlsPath = (groups, links, usedCells) => {
        pathStatesVisited += 1;
        if (isAlsChainSearch && (pathStatesVisited & 8191) === 0) {
          options.onProgress?.({ stage: 'type-3-chain-paths', states: pathStatesVisited,
            results: alsPaths.length, depth: groups.length });
        }
        if ((!isAlsChainSearch && groups.length === pathLength)
          || (isAlsChainSearch && groups.length >= 4)) {
          const forward = groups.map((group, index) =>
            `${group.uniqueID}:${index < links.length ? links[index].digit : ''}`).join('>');
          const reverse = [...groups].reverse().map((group, index) =>
            `${group.uniqueID}:${index < links.length ? links[links.length - 1 - index].digit : ''}`).join('>');
          const key = forward < reverse ? forward : reverse;
          if (!seenPaths.has(key)) {
            seenPaths.add(key);
            const bridges = links.map(link => link.bridge);
            const restrictedDigits = bridges.map(bridge => bridge.digit);
            alsPaths.push({
              link: { C: { restrictedDigits, digits: restrictedDigits, bridges } },
              groups: [...groups],
            });
          }
          if (!isAlsChainSearch) return;
        }
        if (!isAlsChainSearch && groups.length >= pathLength) return;
        if (isAlsChainSearch && groups.length >= pairableAls.length) return;
        const current = groups[groups.length - 1];
        for (const connection of pairConnections.get(current.uniqueID) || []) {
          const next = connection.left.uniqueID === current.uniqueID ? connection.right : connection.left;
          if (groups.some(group => group.uniqueID === next.uniqueID)
            || next.cells.some(cell => usedCells.has(cell))) continue;
          for (const bridge of connection.bridges) {
            if (links.length && links[links.length - 1].digit === bridge.digit) continue;
            const nextCells = new Set(usedCells);
            next.cells.forEach(cell => nextCells.add(cell));
            walkAlsPath([...groups, next], [...links, { digit: bridge.digit, bridge }], nextCells);
          }
        }
      };
      const startedConnections = new Set();
      for (const connections of pairConnections.values()) {
        for (const connection of connections) {
          if (startedConnections.has(connection)) continue;
          startedConnections.add(connection);
          for (const [start, next] of [[connection.left, connection.right],
            [connection.right, connection.left]]) {
            for (const bridge of connection.bridges) {
              walkAlsPath([start, next], [{ digit: bridge.digit, bridge }],
                new Set([...start.cells, ...next.cells]));
            }
          }
        }
      }
    }

    const results = [];
    const seen = new Set();
    const unitByCell = new Map(Array.from({ length: 81 }, (_, cell) => [cell, []]));
    units.forEach((unit, unitIndex) => {
      for (const cell of unit) unitByCell.get(cell).push(unitIndex);
    });
    let tradeStatesVisited = 0;
    let balancedTradesChecked = 0;
    let localStatesChecked = 0;
    const sizes = extended ? EXTENDED_TYPE1_TARGET_SIZES : TARGET_SIZES;
    const targetSizes = [...sizes];
    const extendedUnitsByCell = [...unitByCell.values()];
    const baseDigitSets = extended ? [...extendedBaseDigitSets()] : Array.from({ length: 8 }, (_, i) =>
      Array.from({ length: 8 - i }, (_, j) => [i + 1, i + j + 2])).flat();

    for (const { link, groups } of alsPaths) {
      const currentPathLength = groups.length;
      const groupDigits = [...new Set(groups.flatMap(group => group.digits))].sort((a, b) => a - b);
      const groupLocations = groups.map(group => new Map(group.digits.map(digit => [digit,
        group.cells.filter(cell => candidates[cell].includes(digit))])));
      const linkedSides = (cell, digit) => groups.map((group, index) => {
        const locations = groupLocations[index].get(digit) || [];
        return locations.length && locations.every(alsCell => core.peersOf(cell).includes(alsCell))
          ? index : -1;
      }).filter(index => index >= 0);
      const disjointAlsCells = groups.flatMap(group => group.cells);

      for (const pair of baseDigitSets) {
        const eligible = new Set();
        const plusCellsForPair = new Set();
        const sidesByCellDigit = new Map();
        for (let cell = 0; cell < 81; cell += 1) {
          if (disjointAlsCells.includes(cell)) continue;
          const values = candidates[cell];
          if (values.filter(digit => pair.includes(digit)).length < 2) continue;
          const extras = values.filter(digit => !pair.includes(digit));
          if (extras.length > groupDigits.length) continue;
          if (extras.some(digit => !groupDigits.includes(digit))) continue;
          let compatible = true;
          for (const digit of extras) {
            const sides = linkedSides(cell, digit);
            if (!sides.length) { compatible = false; break; }
            sidesByCellDigit.set(`${cell}:${digit}`, sides);
          }
          if (!compatible) continue;
          eligible.add(cell);
          if (extras.length) plusCellsForPair.add(cell);
        }
        if (plusCellsForPair.size < 2) continue;

        const recordTrade = (cells, signs) => {
          if (!sizes.has(cells.length)) return;
          // Keep every Type 3 path node disjoint from the UR trade. The
          // initial candidate scan already excludes ALS cells, but this
          // guards the complete selected trade at the shared boundary.
          if (cells.some(cell => disjointAlsCells.includes(cell))) return;
          if (!extended && !variantAssignmentIsLegal(cells, signs, pair)) return;
          const plusCells = cells.filter(cell => plusCellsForPair.has(cell));
          const plusDigits = [...new Set(plusCells.flatMap(cell =>
            candidates[cell].filter(digit => !pair.includes(digit))))].sort((a, b) => a - b);
          if (!plusDigits.length || plusDigits.some(digit => !groupDigits.includes(digit))) return;
          const plusDigitSet = new Set(plusDigits);
          if (currentPathLength >= 3
            && (link.C?.restrictedDigits || []).some(digit => plusDigitSet.has(digit))) return;
          const urAlsLinks = [...new Map(plusCells.flatMap(cell =>
            candidates[cell].filter(digit => !pair.includes(digit)).flatMap(digit =>
              (sidesByCellDigit.get(`${cell}:${digit}`) || []).map(alsIndex => ({
                cell, digit, alsIndex,
              }))))
            .map(item => [`${item.cell}:${item.digit}:${item.alsIndex}`, item])).values()];
          const usedSides = new Set();
          for (const cell of plusCells) {
            for (const digit of candidates[cell].filter(value => !pair.includes(value))) {
              for (const side of sidesByCellDigit.get(`${cell}:${digit}`) || []) usedSides.add(side);
            }
          }
          if (usedSides.size < currentPathLength) return;
          balancedTradesChecked += 1;

          const allStructureCells = [...cells, ...disjointAlsCells];
          if (!hasType3MultiAlsAssignment(cells, candidates, pair, groups)) return;
          const eliminations = new Map();
          const lockedSources = {};
          const lockedAlsDigits = new Set();
          const lockedAlsCandidatesByGroup = groups.map(() => new Map());
          const eliminationsByAls = groups.map(() => new Map());
          for (const [alsIndex, group] of groups.entries()) {
            for (const cell of group.cells) {
              for (const digit of candidates[cell]) {
                localStatesChecked += 1;
                if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, new Set(), [
                  { cell, digit },
                ])) continue;
                const elimination = { cell, digit };
                eliminations.set(`${cell}:${digit}`, elimination);
                eliminationsByAls[alsIndex].set(`${cell}:${digit}`, elimination);
              }
            }
          }
          for (const cell of cells) {
            for (const digit of candidates[cell]) {
              localStatesChecked += 1;
              if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, new Set(), [
                { cell, digit },
              ])) continue;
              eliminations.set(`${cell}:${digit}`, { cell, digit });
            }
          }
          const consideredDigits = [...new Set([...plusDigits, ...groupDigits,
            ...(link.C?.restrictedDigits || []), ...(link.C?.digits || [])])];
          for (const digit of consideredDigits) {
            const locations = allStructureCells.filter(cell => candidates[cell].includes(digit));
            if (!locations.length) continue;
            const forbidden = new Set(locations.map(cell => `${cell}:${digit}`));
            localStatesChecked += 1;
            const globallyLocked = !hasType3MultiAlsAssignment(
              cells, candidates, pair, groups, forbidden);
            if (globallyLocked) lockedSources[digit] = locations;
            for (const [alsIndex, group] of groups.entries()) {
              const alsLocations = group.cells.filter(cell => candidates[cell].includes(digit));
              if (!alsLocations.length) continue;
              const forbiddenFromAls = new Set(alsLocations.map(cell => `${cell}:${digit}`));
              localStatesChecked += 1;
              if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, forbiddenFromAls)) continue;
              lockedAlsDigits.add(digit);
              lockedAlsCandidatesByGroup[alsIndex].set(digit, alsLocations);
              let alsPeers = new Set(core.peersOf(alsLocations[0]));
              for (const source of alsLocations.slice(1)) {
                const sourcePeers = new Set(core.peersOf(source));
                for (const peer of alsPeers) if (!sourcePeers.has(peer)) alsPeers.delete(peer);
              }
              for (const target of alsPeers) {
                if (!candidates[target].includes(digit)) continue;
                if (cells.includes(target)) {
                  localStatesChecked += 1;
                  if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, new Set(), [
                    { cell: target, digit },
                  ])) continue;
                }
                const elimination = { cell: target, digit };
                eliminations.set(`${target}:${digit}`, elimination);
                eliminationsByAls[alsIndex].set(`${target}:${digit}`, elimination);
              }
            }
            if (globallyLocked) {
              let commonPeers = new Set(core.peersOf(locations[0]));
              for (const source of locations.slice(1)) {
                const peers = new Set(core.peersOf(source));
                for (const peer of commonPeers) if (!peers.has(peer)) commonPeers.delete(peer);
              }
              for (const target of commonPeers) {
                if (!candidates[target].includes(digit)) continue;
                if (cells.includes(target)) {
                  localStatesChecked += 1;
                  if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, new Set(), [
                    { cell: target, digit },
                  ])) continue;
                }
                eliminations.set(`${target}:${digit}`, { cell: target, digit });
              }
            }
          }
          for (const [bridgeIndex, bridge] of (link.C?.bridges || []).entries()) {
            const rccSources = [...bridge.leftCells, ...bridge.rightCells];
            if (!rccSources.length) continue;
            let commonPeers = new Set(core.peersOf(rccSources[0]));
            for (const source of rccSources.slice(1)) {
              const sourcePeers = new Set(core.peersOf(source));
              for (const peer of commonPeers) if (!sourcePeers.has(peer)) commonPeers.delete(peer);
            }
            for (const target of commonPeers) {
              if (!candidates[target].includes(bridge.digit)) continue;
              localStatesChecked += 1;
              if (hasType3MultiAlsAssignment(cells, candidates, pair, groups, new Set(), [
                { cell: target, digit: bridge.digit },
              ])) continue;
              const elimination = { cell: target, digit: bridge.digit };
              eliminations.set(`${target}:${bridge.digit}`, elimination);
              for (const alsIndex of [bridgeIndex, bridgeIndex + 1]) {
                eliminationsByAls[alsIndex]?.set(`${target}:${bridge.digit}`, elimination);
              }
            }
          }
          if (!eliminations.size) return;

          const alsExclusionDigits = [...lockedAlsDigits]
            .filter(digit => !plusDigitSet.has(digit));
          const tradeKey = extended ? cells.join(',') : cells.map((cell, index) => `${cell}:${signs[index]}`).join(',');
          const reverseKey = extended ? tradeKey : cells.map((cell, index) => `${cell}:${-signs[index]}`).join(',');
          let pathKey = groups.map(group => group.uniqueID).sort().join('|');
          if (currentPathLength > 3) {
            const edges = link.C?.bridges || [];
            const forwardPath = groups.map((group, index) =>
              `${group.uniqueID}:${index < edges.length ? edges[index].digit : ''}`).join('>');
            const reversePath = [...groups].reverse().map((group, index) =>
              `${group.uniqueID}:${index < edges.length ? edges[edges.length - 1 - index].digit : ''}`).join('>');
            pathKey = forwardPath < reversePath ? forwardPath : reversePath;
          }
          const key = `${pair.join(',')}:${tradeKey < reverseKey ? tradeKey : reverseKey}:` + pathKey;
          if (seen.has(key)) return;
          seen.add(key);
          const records = groups.map(group => ({
            uniqueID: group.uniqueID,
            alsAllCells: [...group.alsAllCells],
            alsDigits: [...group.alsDigits],
          }));
          const subtype = currentPathLength === 2 ? 'b' : currentPathLength === 3 ? 'c' : 'd';
          results.push({
            tech: extended ? `uniqueness-extended-type-3-${extendedSuffix}` : currentPathLength === 2 ? 'uniqueness-type-3-xz'
              : currentPathLength === 3 ? 'uniqueness-type-3-xy' : 'uniqueness-type-3-chain',
            classification: extended
              ? `Extended Unique Rectangle Type 3 ALS-${isAlsChainSearch ? 'Chain' : extendedSuffix.toUpperCase()}`
              : `Unique Rectangle Type 3${subtype} ALS-${currentPathLength === 2
              ? 'XZ' : currentPathLength === 3 ? 'XY' : 'Chain'}`,
            type: 3,
            subtype,
            size: cells.length,
            digits: pair,
            cells,
            ...(extended ? { extended: true } : { signs }),
            plusCells,
            plusDigits,
            urAlsLinks,
            alsLockedCandidates: lockedAlsCandidatesByGroup.flatMap((byDigit, alsIndex) =>
              [...byDigit.entries()]
                .filter(([digit]) => [...eliminationsByAls[alsIndex].values()]
                  .some(item => item.digit === digit))
                .flatMap(([digit, lockedCells]) =>
                  lockedCells.map(cell => ({ cell, digit, alsIndex })))),
            alsRecords: records,
            alsCells: [...new Set(disjointAlsCells)],
            alsDigits: groupDigits,
            alsExclusionDigits,
            rccDigits: [...(link.C?.restrictedDigits || [])],
            rccConnections: (link.C?.bridges || []).map(bridge => ({
              digit: bridge.digit,
              leftCells: [...bridge.leftCells],
              rightCells: [...bridge.rightCells],
            })),
            lockedDigitSources: lockedSources,
            eliminationsByAls: eliminationsByAls.map(items => [...items.values()]),
            eliminations: [...eliminations.values()],
          });
        };

        if (extended) {
          visitVerifiedExtendedTrades({
            candidates, pair, eligible, plusCellsForPair, units, unitByCell: extendedUnitsByCell,
            onState() {
              tradeStatesVisited += 1;
              if ((tradeStatesVisited & 8191) === 0) options.onProgress?.({
                stage: `extended-type-3-${extendedSuffix}`, states: tradeStatesVisited, results: results.length,
              });
            },
            accept: recordTrade,
          });
          continue;
        }

        const connectedCells = start => {
          const connected = new Set([start]);
          const queue = [start];
          for (let cursor = 0; cursor < queue.length; cursor += 1) {
            for (const unitIndex of unitByCell.get(queue[cursor])) {
              for (const cell of units[unitIndex]) {
                if (!eligible.has(cell) || connected.has(cell)) continue;
                connected.add(cell);
                queue.push(cell);
              }
            }
          }
          return [...connected];
        };

        const starts = [...plusCellsForPair];
        for (const start of starts) {
          const component = connectedCells(start);
          const selected = new Map([[start, 1]]);
          const balances = new Int8Array(units.length);
          for (const unitIndex of unitByCell.get(start)) balances[unitIndex] = 1;
          const visitedStates = new Set();

          const visit = () => {
            const stateKey = [...selected.entries()].sort((a, b) => a[0] - b[0])
              .map(([cell, sign]) => `${cell}:${sign}`).join(',');
            if (visitedStates.has(stateKey)) return;
            visitedStates.add(stateKey);
            tradeStatesVisited += 1;
            if ((tradeStatesVisited & 8191) === 0) {
              options.onProgress?.({ stage: 'type-3-xz-trades', states: tradeStatesVisited,
                results: results.length, sizes: targetSizes });
            }
            let chosenUnit = -1;
            let choices = null;
            for (let index = 0; index < balances.length; index += 1) {
              const balance = balances[index];
              if (!balance) continue;
              const neededSign = balance > 0 ? -1 : 1;
              const candidatesInUnit = component.filter(cell => !selected.has(cell)
                && unitByCell.get(cell).includes(index));
              if (!candidatesInUnit.length) return;
              if (!choices || candidatesInUnit.length < choices.length) {
                choices = candidatesInUnit.map(cell => [cell, neededSign]);
                chosenUnit = index;
              }
            }
            if (chosenUnit === -1) {
              const cells = [...selected.keys()].sort((a, b) => a - b);
              recordTrade(cells, cells.map(cell => selected.get(cell)));
              return;
            }
            if (selected.size >= 18) return;
            for (const [cell, sign] of choices) {
              selected.set(cell, sign);
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] += sign;
              visit();
              for (const unitIndex of unitByCell.get(cell)) balances[unitIndex] -= sign;
              selected.delete(cell);
            }
          };
          visit();
        }
      }
    }
    options.onProgress?.({ stage: extended ? `extended-type-3-${extendedSuffix}` : pathLength === 2 ? 'type-3-xz'
      : pathLength === 3 ? 'type-3-xy' : 'type-3-chain',
      states: localStatesChecked, results: results.length });
    return { results, stats: { states: tradeStatesVisited, balancedTradesChecked, localStatesChecked,
      alsRccPairs: alsPaths.length, targetSizes } };
  }

  function findUniquenessType3Xz(candidateGrid, options = {}) {
    return findUniquenessType3AlsPath(candidateGrid, options, 2);
  }

  function findUniquenessType3Xy(candidateGrid, options = {}) {
    return findUniquenessType3AlsPath(candidateGrid, options, 3);
  }

  function findUniquenessType3AlsChain(candidateGrid, options = {}) {
    return findUniquenessType3AlsPath(candidateGrid, options, 'chain');
  }

  function createGuardianAic(candidates, options = {}) {
    const units = classicUnits();
    const atom = (cell, digit) => cell * 10 + digit;
    const literal = (id, on) => id * 2 + Number(on);
    const decode = id => ({ cell: Math.floor(id / 20), digit: Math.floor(id / 2) % 10, on: !!(id & 1) });
    const graph = Array.from({ length: 1620 }, () => new Set());
    const atoms = candidates.flatMap((digits, cell) => digits.length > 1 ? digits.map(digit => atom(cell, digit)) : []);
    const weak = (a, b) => {
      graph[literal(a, true)].add(literal(b, false));
      graph[literal(b, true)].add(literal(a, false));
    };
    const strong = (a, b) => {
      graph[literal(a, false)].add(literal(b, true));
      graph[literal(b, false)].add(literal(a, true));
    };
    for (const [cell, values] of candidates.entries()) {
      for (const [index, digit] of values.entries()) {
        for (const other of values.slice(index + 1)) weak(atom(cell, digit), atom(cell, other));
        for (const peer of core.peersOf(cell)) {
          if (peer > cell && candidates[peer].includes(digit)) weak(atom(cell, digit), atom(peer, digit));
        }
      }
      if (values.length === 2) strong(...values.map(digit => atom(cell, digit)));
    }
    for (const unit of units) for (let digit = 1; digit <= 9; digit += 1) {
      const places = unit.filter(cell => candidates[cell].includes(digit));
      if (places.length === 2 && places.every(cell => candidates[cell].length > 1)) {
        strong(...places.map(cell => atom(cell, digit)));
      }
    }
    const depthLimit = Math.min(24, Math.max(3, Number(options.maxDepth) || 12));
    const reach = new Map();
    function traceFrom(source) {
      if (reach.has(source)) return reach.get(source);
      const start = literal(source, true);
      const previous = new Int16Array(graph.length).fill(-1);
      const depth = new Uint8Array(graph.length);
      const queue = [start];
      previous[start] = start;
      for (let index = 0; index < queue.length; index += 1) {
        const node = queue[index];
        if (depth[node] >= depthLimit) continue;
        for (const next of graph[node]) {
          if (previous[next] !== -1) continue;
          previous[next] = node;
          depth[next] = depth[node] + 1;
          queue.push(next);
        }
      }
      const pathTo = end => {
        if (previous[end] === -1) return null;
        const path = [];
        for (let node = end; node !== start; node = previous[node]) path.push(decode(node));
        return [decode(start), ...path.reverse()];
      };
      const trace = { previous, depth, pathTo };
      reach.set(source, trace);
      return trace;
    }

    function analyze(cells, guardians, { allowInside = false } = {}) {
      if (guardians.length !== 2 || guardians.some(group => !group.cells.length)) return null;
      const groups = guardians.map(group => group.cells.map(cell => atom(cell, group.digit)));
      const traces = groups.map(group => group.map(traceFrom));
      if (groups.some((group, side) => group.some((id, index) =>
        traces[side][index].previous[literal(id, false)] !== -1))) return;
      const scope = new Set(allowInside ? guardians.flatMap(group => group.cells) : cells);
      const leavesScope = path => path.some(item => !scope.has(item.cell));
      // Separate Type 9's second open-chain form from the ordinary ring.
      // If X=true forces Y=true and then Y=false in the UR, X is impossible.
      // The reciprocal chain makes Y impossible as well.  This is a
      // two-way guardian contradiction, not a ring that forces both digits
      // true.
      const twoWayPaths = traces.map((entries, side) => entries.map(trace => {
        const opposite = groups[1 - side];
        for (const target of opposite) {
          const path = trace.pathTo(literal(target, false));
          if (!path || path.length <= 2 || !leavesScope(path.slice(0, -1))) continue;
          if (path.some(item => item.on && opposite.includes(atom(item.cell, item.digit)))) {
            return path;
          }
        }
        return null;
      }));
      const twoWay = twoWayPaths.every(paths => paths.every(Boolean));
      if (twoWay) {
        const eliminations = [];
        const witnesses = [];
        for (const [side, group] of groups.entries()) {
          for (const target of group) {
            const targetCell = Math.floor(target / 10);
            const targetDigit = target % 10;
            const paths = twoWayPaths[1 - side].filter(path => {
              const end = path[path.length - 1];
              return end.cell === targetCell && end.digit === targetDigit && !end.on;
            });
            if (!paths.length) continue;
            eliminations.push({ cell: targetCell, digit: targetDigit });
            witnesses.push({ cell: targetCell, digit: targetDigit, paths });
          }
        }
        if (eliminations.length) return {
          ring: false, twoWay: true, twoWayPaths, forcedGuardians: [], ringPaths: [],
          witnesses, eliminations,
        };
      }
      const ringPaths = traces.map((entries, side) => entries.map(trace =>
        groups[1 - side].map(target => trace.pathTo(literal(target, true)))
          .find(path => path && leavesScope(path))));
      const ring = ringPaths.every(paths => paths.every(Boolean));
      const eliminations = [];
      const witnesses = [];
      for (const target of atoms) {
        if (!ring && scope.has(Math.floor(target / 10))) continue;
        const end = literal(target, false);
        const off = traces.map(entries => entries.every(trace => trace.previous[end] !== -1));
        if (ring ? !off.some(Boolean) : !off.every(Boolean)) continue;
        const direct = traces.map(entries => entries.every(trace => trace.depth[end] === 1));
        if (!ring && (!direct.some(Boolean) || direct.every(Boolean))) continue;
        const paths = traces.flatMap((entries, side) => off[side] ? entries.map(trace => trace.pathTo(end)) : []);
        if (!ring && !paths.some(path => path.length > 2 && leavesScope(path.slice(0, -1)))) continue;
        const { cell, digit } = decode(end);
        eliminations.push({ cell, digit });
        witnesses.push({ cell, digit, paths });
      }
      // Reverse presentation is only allowed for candidates already proven
      // by the normal Type 9 elimination pass.  Intermediate AIC nodes are
      // not independent eliminations and must never become new starts.
      const reverseWitnesses = [];
      for (const target of atoms) {
        const targetCell = Math.floor(target / 10);
        const targetDigit = target % 10;
        if (scope.has(targetCell) || !eliminations.some(item =>
          item.cell === targetCell && item.digit === targetDigit)) continue;
        const trace = traceFrom(target);
        const paths = groups.flatMap(group => group.map(guardian =>
          trace.pathTo(literal(guardian, false))))
          .filter(path => path && path.length > 2 && leavesScope(path.slice(0, -1)));
        if (paths.length) reverseWitnesses.push({ cell: targetCell, digit: targetDigit, paths });
      }
      const reverseGroups = [];
      const reverseBySuffix = new Map();
      for (const witness of reverseWitnesses) {
        const path = witness.paths.slice().sort((a, b) => a.length - b.length)[0];
        if (!path) continue;
        const suffix = path.slice(1).map(item => `${item.cell}:${item.digit}:${item.on ? 1 : 0}`).join(',');
        const key = `${witness.digit}|${suffix}`;
        if (!reverseBySuffix.has(key)) reverseBySuffix.set(key, []);
        reverseBySuffix.get(key).push(witness);
      }
      for (const witnessesForSuffix of reverseBySuffix.values()) {
        const remaining = new Set(witnessesForSuffix.map(item => item.cell));
        while (remaining.size) {
          const cell = [...remaining][0];
          const best = units
            .map(unit => ({ cells: [...remaining].filter(other => unit.includes(other)) }))
            .sort((a, b) => b.cells.length - a.cells.length)[0];
          const cellsInGroup = (best.cells.length > 1 ? best.cells : [cell]).sort((a, b) => a - b);
          cellsInGroup.forEach(other => remaining.delete(other));
          const representative = witnessesForSuffix.find(item => item.cell === cellsInGroup[0]);
          reverseGroups.push({ digit: representative.digit, cells: cellsInGroup,
            path: representative.paths.slice().sort((a, b) => a.length - b.length)[0] });
        }
      }
      if (!ring && !eliminations.length) return;
      return {
        ring, forcedGuardians: ring ? guardians : [], ringPaths: ring ? ringPaths : [],
        witnesses, reverseWitnesses, reverseGroups, eliminations,
      };
    }
    return { analyze, depthLimit };
  }

  function findUniquenessType9(candidateGrid, options = {}) {
    const extended = options.extended === true;
    const tech = extended ? 'uniqueness-extended-type-9' : 'uniqueness-type-9';
    const unsupportedVariants = ['diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive']
      .filter(name => core.getVariantSettings?.()[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const units = classicUnits();
    const houses = candidates.map((_, cell) => units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const { analyze, depthLimit } = createGuardianAic(candidates, options);
    const results = [];
    const seen = new Set();
    let states = 0;
    function record(cells, digits, extras) {
      const key = digits.join('') + ':' + cells.join(',');
      if (seen.has(key)) return;
      seen.add(key);
      const guardians = extras.map(digit => ({
        digit, cells: cells.filter(cell => candidates[cell].includes(digit)),
      }));
      const proof = analyze(cells, guardians);
      if (!proof) return;
      results.push({
        tech, classification: (extended ? 'Extended Unique Rectangle' : 'Unique Rectangle') + ' Type 9'
          + (proof.ring ? ' Ring' : proof.twoWay ? ' Two-Way' : ''),
        type: 9, extended, size: cells.length, cells, digits, guardians, ...proof,
      });
    }

    if (extended) {
      for (const digits of extendedBaseDigitSets()) {
        if (states >= 30000) break;
        const eligible = new Set();
        const plusCellsForPair = new Set();
        for (const [cell, values] of candidates.entries()) {
          const extras = values.filter(digit => !digits.includes(digit));
          if (extras.length > 2 || values.length - extras.length < 2) continue;
          eligible.add(cell);
          if (extras.length) plusCellsForPair.add(cell);
        }
        if (eligible.size < 6 || !plusCellsForPair.size) continue;
        visitVerifiedExtendedTrades({
          candidates, pair: digits, eligible, plusCellsForPair, units, unitByCell: houses,
          onState() {
            if (states >= 30000) return false;
            states += 1;
            if ((states & 1023) === 0) options.onProgress?.({ stage: tech, states, results: results.length });
          },
          accept(cells) {
            if (!EXTENDED_TYPE1_TARGET_SIZES.has(cells.length)) return;
            const extras = [...new Set(cells.flatMap(cell => candidates[cell].filter(digit => !digits.includes(digit))))];
            if (extras.length === 2) record(cells, digits, extras.sort((a, b) => a - b));
          },
        });
      }
      return { results, stats: { states, depthLimit } };
    }

    for (let a = 1; a < 9; a += 1) for (let b = a + 1; b <= 9; b += 1) {
      const digits = [a, b];
      const extras = candidates.map(values => values.filter(digit => !digits.includes(digit)));
      const eligible = candidates.map((values, cell) =>
        values.includes(a) && values.includes(b) && extras[cell].length <= 2);
      for (let start = 0; start < 81 && states < 30000; start += 1) {
        if (!eligible[start] || !extras[start].length) continue;
        const selected = new Map();
        const signs = units.map(() => 0);
        const occupied = units.map(() => 0);
        const scanned = new Set();
        function walk(cell, sign, extraDigits) {
          if (states >= 30000) return;
          const nextExtras = [...new Set([...extraDigits, ...extras[cell]])];
          if (nextExtras.length > 2) return;
          selected.set(cell, sign);
          const signature = [...selected].sort((a, b) => a[0] - b[0]).map(item => item.join(':')).join(',');
          if (!scanned.has(signature)) {
            scanned.add(signature);
            states += 1;
            if ((states & 1023) === 0) options.onProgress?.({ stage: 'uniqueness-type-9', states, results: results.length });
            for (const house of houses[cell]) {
              signs[house] += sign;
              occupied[house] += 1;
            }
            let moves = null;
            for (const [house, balance] of signs.entries()) {
              if (!balance) continue;
              const peers = units[house].filter(other => eligible[other] && !selected.has(other)
                && (!extras[other].length || other >= start)
                && houses[other].every(h => occupied[h] < 2 && signs[h] !== -balance));
              if (!moves || peers.length < moves.cells.length) moves = { cells: peers, sign: -balance };
            }
            if (!moves && nextExtras.length === 2 && TARGET_SIZES.has(selected.size)) {
              record([...selected.keys()].sort((a, b) => a - b), digits, nextExtras.sort((a, b) => a - b));
            } else if (moves && selected.size < 18) {
              for (const other of moves.cells) walk(other, moves.sign, nextExtras);
            }
            for (const house of houses[cell]) {
              signs[house] -= sign;
              occupied[house] -= 1;
            }
          }
          selected.delete(cell);
        }
        walk(start, 1, []);
      }
    }
    return { results, stats: { states, depthLimit } };
  }
  core.createGuardianAic = createGuardianAic;
  core.findUniquenessType9 = findUniquenessType9;
  core.findUniquenessType1 = findUniquenessType1;
  core.findExtendedUniquenessType1 = findExtendedUniquenessType1;
  core.findUniquenessType2 = findUniquenessType2;
  core.findUniquenessType2And5 = findUniquenessType2And5;
  core.findUniquenessType5 = findUniquenessType5;
  core.findExtendedUniquenessType2And5 = findExtendedUniquenessType2And5;
  core.findUniquenessType3 = findUniquenessType3;
  core.findExtendedUniquenessType3 = (candidateGrid, options = {}) =>
    findUniquenessType3(candidateGrid, { ...options, extended: true });
  core.findUniquenessType4 = findUniquenessType4;
  core.findExtendedUniquenessType4 = findExtendedUniquenessType4;
  core.restrictedFishCycles = restrictedFishCycles;
  core.findUniquenessType6 = findUniquenessType6;
  core.findExtendedUniquenessType6 = findExtendedUniquenessType6;
  core.findUniquenessType7 = findUniquenessType7;
  core.findExtendedUniquenessType7 = (candidateGrid, options = {}) =>
    findUniquenessType7(candidateGrid, { ...options, extended: true });
  core.assumeGuardianOn = assumeGuardianOn;
  core.guardianForcingRecord = guardianForcingRecord;
  core.groupGuardianAssumptions = groupGuardianAssumptions;
  core.createExternalGuardianSearch = createExternalGuardianSearch;
  core.findPairedExternalGuardians = findPairedExternalGuardians;
  core.findUniquenessType8 = findUniquenessType8;
  core.findExtendedUniquenessType8 = (candidateGrid, options = {}) =>
    findUniquenessType8(candidateGrid, { ...options, extended: true });
  core.findUniquenessType3Xz = findUniquenessType3Xz;
  core.findExtendedUniquenessType3Xz = (candidateGrid, options = {}) =>
    findUniquenessType3AlsPath(candidateGrid, { ...options, extended: true }, 2);
  core.findExtendedUniquenessType3Xy = (candidateGrid, options = {}) =>
    findUniquenessType3AlsPath(candidateGrid, { ...options, extended: true }, 3);
  core.findUniquenessType3Xy = findUniquenessType3Xy;
  core.findUniquenessType3AlsChain = findUniquenessType3AlsChain;
  core.findExtendedUniquenessType3AlsChain = (candidateGrid, options = {}) =>
    findUniquenessType3AlsPath(candidateGrid, { ...options, extended: true }, 'chain');
})(globalThis);
