/* StormDoku toy transformation primitives. */
(function installToyMath(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function cellPermutation(mapper) {
    const permutation = new Array(81);
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
      const [newRow, newCol] = mapper(row, col); const target = newRow * 9 + newCol;
      if (!Number.isInteger(target) || target < 0 || target >= 81) throw new Error('Invalid toy transformation map.');
      permutation[row * 9 + col] = target;
    }
    if (new Set(permutation).size !== 81) throw new Error('Toy transformation map is not bijective.');
    return permutation;
  }
  function permutations(values) {
    const output = []; const current = [];
    const visit = remaining => {
      if (!remaining.length) { output.push([...current]); return; }
      for (let index = 0; index < remaining.length; index++) {
        current.push(remaining[index]);
        visit(remaining.slice(0, index).concat(remaining.slice(index + 1)));
        current.pop();
      }
    };
    visit([...values]); return output;
  }
  function identityOrder() { return [0, 1, 2]; }
  function orderLabel(order) { return order.map(value => value + 1).join(''); }
  function composePermutations(first, second) {
    const composed = new Array(81);
    for (let cell = 0; cell < 81; cell++) composed[cell] = second[first[cell]];
    return composed;
  }
  function permutationKey(permutation) { return permutation.join(','); }
  function transformationMapper(kind) {
    switch (kind) {
      case 'transpose':
      case 'diagonal-reflection': return (row, col) => [col, row];
      case 'horizontal-mirror': return (row, col) => [8 - row, col];
      case 'vertical-mirror': return (row, col) => [row, 8 - col];
      case 'anti-diagonal-reflection': return (row, col) => [8 - col, 8 - row];
      case 'pivot-left': return (row, col) => [8 - col, row];
      case 'pivot-right': return (row, col) => [col, 8 - row];
      case 'half-turn': return (row, col) => [8 - row, 8 - col];
      default: return null;
    }
  }
  function layoutPermutation(bandOrder, rowOrders, stackOrder, columnOrders) {
    return cellPermutation((row, col) => {
      const band = Math.floor(row / 3); const stack = Math.floor(col / 3);
      const localRow = row % 3; const localCol = col % 3;
      return [bandOrder[band] * 3 + rowOrders[band][localRow], stackOrder[stack] * 3 + columnOrders[stack][localCol]];
    });
  }
  function automorphOperationMaps() {
    const id = identityOrder(); const cycle = [2, 0, 1]; const reverse = [2, 1, 0];
    const local = () => [id, id, id]; const cycleLocal = () => [cycle, cycle, cycle];
    const reverseLocal = () => [reverse, reverse, reverse];
    return new Map([
      ['B', layoutPermutation([2, 0, 1], local(), id, local())], ['S', layoutPermutation(id, local(), [2, 0, 1], local())],
      ['Bx', layoutPermutation(reverse, local(), id, local())], ['Sx', layoutPermutation(id, local(), reverse, local())],
      ['R', layoutPermutation(id, cycleLocal(), id, local())], ['C', layoutPermutation(id, local(), id, cycleLocal())],
      ['Rx', layoutPermutation(id, reverseLocal(), id, local())], ['Cx', layoutPermutation(id, local(), id, reverseLocal())],
      ['R1', layoutPermutation(id, [cycle, id, id], id, local())], ['R2', layoutPermutation(id, [id, cycle, id], id, local())],
      ['R3', layoutPermutation(id, [id, id, cycle], id, local())], ['C1', layoutPermutation(id, local(), id, [cycle, id, id])],
      ['C2', layoutPermutation(id, local(), id, [id, cycle, id])], ['C3', layoutPermutation(id, local(), id, [id, id, cycle])],
      ['D', cellPermutation((row, col) => [col, row])], ['D2', cellPermutation((row, col) => [8 - col, 8 - row])],
    ]);
  }
  function operationLabels(sequence) { return sequence.match(/[A-Z](?:x|\d)?(?:\^\d+)?/g) || []; }
  function operationTokens(sequence, operationMaps) {
    const tokens = [];
    for (let index = 0; index < sequence.length;) {
      const two = sequence.slice(index, index + 2);
      if (operationMaps.has(two)) { tokens.push(two); index += 2; }
      else { tokens.push(sequence[index]); index += 1; }
    }
    return tokens;
  }
  function sequenceVariants(sequence, operationMaps, identity, compose, power, orderOf) {
    const tokens = operationTokens(sequence, operationMaps); const variants = [];
    const visit = (index, current, labels) => {
      if (index === tokens.length) { variants.push({ sequence: labels.join(''), permutation: current }); return; }
      const token = tokens[index]; const operation = operationMaps.get(token); const order = orderOf(operation);
      for (let exponent = 1; exponent < order; exponent++) {
        visit(index + 1, compose(current, power(operation, exponent)), [...labels, exponent === 1 ? token : `${token}^${exponent}`]);
      }
    };
    visit(0, identity, []); return variants;
  }
  function expandAutomorphismCatalog(catalog, operationMaps, identity, helpers) {
    const records = Object.fromEntries(Object.keys(catalog).map(family => [family, []]));
    for (const [family, entries] of Object.entries(catalog)) {
      const unique = new Map();
      for (const entry of entries) {
        const variants = helpers.sequenceVariants(entry.sequence, operationMaps, identity,
          helpers.compose, helpers.power, helpers.order).map(variant => ({
          ...entry, label: `${entry.name} (${variant.sequence})`, testedSequence: variant.sequence,
          permutation: variant.permutation, transposed: false,
        }));
        const transposedVariants = variants.map(record => {
          const labels = helpers.labels(record.testedSequence).map(helpers.transposeLabel);
          return { ...record, label: `${entry.name} (${labels.join('')})`, testedSequence: labels.join(''),
            permutation: helpers.transpose(record.permutation), transposed: true };
        });
        for (const record of [...variants, ...transposedVariants]) {
          const key = helpers.key(record.permutation);
          if (!unique.has(key)) unique.set(key, record);
        }
      }
      records[family] = [...unique.values()];
    }
    return records;
  }
  function transposeOperationLabel(label) {
    const swaps = { B: 'S', S: 'B', Bx: 'Sx', Sx: 'Bx', R: 'C', C: 'R', Rx: 'Cx', Cx: 'Rx', R1: 'C1', C1: 'R1', R2: 'C2', C2: 'R2', R3: 'C3', C3: 'R3' };
    const marker = label.indexOf('^'); const token = marker < 0 ? label : label.slice(0, marker);
    return `${swaps[token] || token}${marker < 0 ? '' : label.slice(marker)}`;
  }
  function transposePermutation(permutation) {
    const transpose = cellPermutation((row, column) => [column, row]);
    return composePermutations(composePermutations(transpose, permutation), transpose);
  }
  function permutationPower(permutation, exponent) {
    let result = new Array(81); for (let cell = 0; cell < 81; cell++) result[cell] = cell;
    for (let power = 0; power < exponent; power++) result = composePermutations(result, permutation);
    return result;
  }
  function permutationOrder(permutation) {
    let current = new Array(81); for (let cell = 0; cell < 81; cell++) current[cell] = cell;
    for (let order = 1; order <= 12; order++) {
      current = composePermutations(current, permutation);
      if (isIdentityPermutation(current)) return order;
    }
    return 1;
  }
  function mapValues(values, permutation) {
    if (!Array.isArray(values)) return values;
    const mapped = new Array(81).fill(0);
    for (let cell = 0; cell < 81; cell++) mapped[permutation[cell]] = values[cell] || 0;
    return mapped;
  }
  function mapCandidates(values, permutation) {
    if (!Array.isArray(values)) return values;
    const mapped = Array.from({ length: 81 }, () => []);
    for (let cell = 0; cell < 81; cell++) mapped[permutation[cell]] = [...(values[cell] || [])];
    return mapped;
  }
  function mapAutomorphScalarValues(values, permutation, mapping) {
    return mapValues(values, permutation).map(value => mapping[value] || value);
  }
  function mapAutomorphCandidates(values, permutation, mapping) {
    return mapCandidates(values, permutation).map(cellValues => [...new Set(
      cellValues.map(value => mapping[value] || value),
    )].sort((left, right) => left - right));
  }
  function completeDigitMapping(mapping) {
    const completed = new Array(10).fill(0); const used = new Set();
    for (let digit = 1; digit <= 9; digit++) {
      const target = Number(mapping?.[digit]);
      if (target >= 1 && target <= 9 && !used.has(target)) { completed[digit] = target; used.add(target); }
    }
    const remaining = Array.from({ length: 9 }, (_, index) => index + 1).filter(digit => !used.has(digit));
    for (let digit = 1; digit <= 9; digit++) if (!completed[digit]) completed[digit] = remaining.shift();
    return completed;
  }
  function remapDigit(value, first, second) { return value === first ? second : value === second ? first : value; }
  function remapDigitSet(set, first, second) { return new Set([...set].map(digit => remapDigit(digit, first, second))); }
  function bandStackSwapMapper(axis, first, second) {
    return (row, col) => {
      if (axis === 'band') { const band = Math.floor(row / 3); const next = band === first ? second : band === second ? first : band; return [next * 3 + row % 3, col]; }
      if (axis === 'stack') { const stack = Math.floor(col / 3); const next = stack === first ? second : stack === second ? first : stack; return [row, next * 3 + col % 3]; }
      return [row, col];
    };
  }
  function localSwapMapper(axis, unit, first, second) {
    return (row, col) => {
      if (axis === 'row' && Math.floor(row / 3) === unit) { const local = row % 3; return [unit * 3 + (local === first ? second : local === second ? first : local), col]; }
      if (axis === 'column' && Math.floor(col / 3) === unit) { const local = col % 3; return [row, unit * 3 + (local === first ? second : local === second ? first : local)]; }
      return [row, col];
    };
  }
  function digitNormalizeDetails(values) {
    const mapping = new Array(10).fill(0); const normalized = new Array(81).fill(0); let nextDigit = 1;
    for (let cell = 0; cell < 81; cell++) { const digit = values[cell] || 0; if (!digit) continue; if (!mapping[digit]) mapping[digit] = nextDigit++; normalized[cell] = mapping[digit]; }
    return { normalized, mapping };
  }
  function digitNormalize(values) { return digitNormalizeDetails(values).normalized; }
  function normalizedValueKey(values) { return digitNormalize(values).join(''); }
  function miniLexPatternKey(pattern) { return pattern.toString(2).padStart(81, '0'); }
  function compareNumberArrays(left, right) {
    for (let index = 0; index < left.length; index++) if (left[index] !== right[index]) return left[index] - right[index];
    return 0;
  }
  function cellDigits(value) { if (Array.isArray(value)) return value.filter(digit => digit >= 1 && digit <= 9); return value >= 1 && value <= 9 ? [value] : []; }
  function gridDigitMasks(grid) {
    const masks = Array.from({ length: 10 }, () => 0n);
    for (let cell = 0; cell < 81; cell++) { const bit = 1n << BigInt(cell); for (const digit of cellDigits(grid[cell])) masks[digit] |= bit; }
    return masks;
  }
  function transformDigitMasks(sourceMasks, permutation) {
    const transformed = Array.from({ length: 10 }, () => 0n);
    for (let digit = 1; digit <= 9; digit++) for (let cell = 0; cell < 81; cell++) if (sourceMasks[digit] & (1n << BigInt(cell))) transformed[digit] |= 1n << BigInt(permutation[cell]);
    return transformed;
  }
  function digitPatternMapFromMasks(sourceMasks, targetMasks) {
    const targetByPattern = new Map();
    for (let digit = 1; digit <= 9; digit++) { const pattern = targetMasks[digit].toString(); if (!targetByPattern.has(pattern)) targetByPattern.set(pattern, []); targetByPattern.get(pattern).push(digit); }
    const mapping = new Array(10).fill(0);
    for (let digit = 1; digit <= 9; digit++) {
      const matches = targetByPattern.get(sourceMasks[digit].toString()); if (!matches) return null;
      const sourceDigits = []; for (let other = 1; other <= 9; other++) if (sourceMasks[other] === sourceMasks[digit]) sourceDigits.push(other);
      mapping[digit] = matches[sourceDigits.indexOf(digit)];
    }
    return new Set(mapping.slice(1)).size === 9 ? mapping : null;
  }
  function verifyDigitMap(source, target, mapping) {
    for (let cell = 0; cell < 81; cell++) { const mapped = new Set(cellDigits(source[cell]).map(digit => mapping[digit])); const expected = new Set(cellDigits(target[cell])); if (mapped.size !== expected.size || [...mapped].some(digit => !expected.has(digit))) return false; }
    return true;
  }
  function digitPatternMap(source, target) { const mapping = digitPatternMapFromMasks(gridDigitMasks(source), gridDigitMasks(target)); return mapping && verifyDigitMap(source, target, mapping) ? mapping : null; }
  function isIdentityPermutation(permutation) { return permutation.every((target, cell) => target === cell); }
  function structuralOrderLabel(map) { return map.map(value => value + 1).join(''); }
  function miniLexOrientedRows(values, transposed) {
    const rows = Array.from({ length: 9 }, () => new Array(9).fill(0));
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
      const source = transposed ? col * 9 + row : row * 9 + col;
      rows[row][col] = values[source] || 0;
    }
    return rows;
  }
  function miniLexRowMasks(rows, columnMap) {
    return rows.map(row => {
      let mask = 0;
      for (let sourceColumn = 0; sourceColumn < 9; sourceColumn++) {
        if (row[sourceColumn]) mask |= 1 << (8 - columnMap[sourceColumn]);
      }
      return mask;
    });
  }
  function miniLexBestRowMaps(rowMasks, orders, compare) {
    const bandChoices = [];
    for (let band = 0; band < 3; band++) {
      let bestRows = null;
      const choices = [];
      for (const order of orders) {
        const rows = order.map(localRow => rowMasks[band * 3 + localRow]);
        if (bestRows === null || compare(rows, bestRows) < 0) {
          bestRows = rows; choices.length = 0; choices.push(order);
        } else if (compare(rows, bestRows) === 0) choices.push(order);
      }
      bandChoices.push({ bestRows, choices });
    }
    let bestPatternRows = null;
    const bandOrders = [];
    for (const order of orders) {
      const rows = [];
      for (const sourceBand of order) rows.push(...bandChoices[sourceBand].bestRows);
      if (bestPatternRows === null || compare(rows, bestPatternRows) < 0) {
        bestPatternRows = rows; bandOrders.length = 0; bandOrders.push(order);
      } else if (compare(rows, bestPatternRows) === 0) bandOrders.push(order);
    }
    const rowMaps = [];
    const addLocalChoices = (bandOrder, targetBand, current) => {
      if (targetBand === 3) {
        const rowMap = new Array(9);
        for (let outputBand = 0; outputBand < 3; outputBand++) {
          const sourceBand = bandOrder[outputBand]; const localOrder = current[sourceBand];
          for (let targetLocal = 0; targetLocal < 3; targetLocal++) {
            rowMap[sourceBand * 3 + localOrder[targetLocal]] = outputBand * 3 + targetLocal;
          }
        }
        rowMaps.push(rowMap); return;
      }
      const sourceBand = bandOrder[targetBand];
      for (const localOrder of bandChoices[sourceBand].choices) {
        current[sourceBand] = localOrder; addLocalChoices(bandOrder, targetBand + 1, current);
      }
    };
    for (const bandOrder of bandOrders) addLocalChoices(bandOrder, 0, []);
    let pattern = 0n;
    for (let row = 0; row < bestPatternRows.length; row++) pattern |= BigInt(bestPatternRows[row]) << BigInt((8 - row) * 9);
    return { pattern, rowMaps };
  }
  function miniLexLayoutMaps(orders) {
    const rowMaps = []; const columnMaps = [];
    for (const bandOrder of orders) for (const firstRows of orders) for (const secondRows of orders) for (const thirdRows of orders) {
      const local = [firstRows, secondRows, thirdRows]; const rowMap = new Array(9);
      for (let index = 0; index < 9; index++) {
        const group = Math.floor(index / 3); rowMap[index] = bandOrder[group] * 3 + local[group][index % 3];
      }
      rowMaps.push(rowMap);
    }
    for (const stackOrder of orders) for (const firstColumns of orders) for (const secondColumns of orders) for (const thirdColumns of orders) {
      const local = [firstColumns, secondColumns, thirdColumns]; const columnMap = new Array(9);
      for (let index = 0; index < 9; index++) {
        const group = Math.floor(index / 3); columnMap[index] = stackOrder[group] * 3 + local[group][index % 3];
      }
      columnMaps.push(columnMap);
    }
    return { rowMaps, columnMaps };
  }
  let miniLexLayoutCache = null;
  function cachedMiniLexLayoutMaps() {
    if (!miniLexLayoutCache) miniLexLayoutCache = miniLexLayoutMaps(permutations([0, 1, 2]));
    return miniLexLayoutCache;
  }
  function formatDigitMap(mapping) {
    const changes = [];
    for (let digit = 1; digit <= 9; digit++) {
      if (!mapping[digit]) continue;
      if (mapping[digit] !== digit) changes.push(`${digit}\u2192${mapping[digit]}`);
    }
    return changes.length ? changes.join(' ') : 'identity';
  }
  function minimizerCellLabel(cell, digit) {
    return `r${Math.floor(cell / 9) + 1}c${(cell % 9) + 1}=${digit}`;
  }
  function automorphismLabel(record) {
    const orientation = record.transposed ? 'transpose' : 'direct';
    return `${orientation}; rows ${structuralOrderLabel(record.rowMap)}; columns ${structuralOrderLabel(record.columnMap)}`;
  }
  function completeAutomorphismSearch(values, rowMaps, columnMaps, preservesVariants, buildPermutation, buildDigitMap) {
    const records = []; let tested = 0;
    for (const transposed of [false, true]) for (const rowMap of rowMaps) for (const columnMap of columnMaps) {
      tested++;
      const permutation = buildPermutation(rowMap, columnMap, transposed);
      if (!preservesVariants(permutation)) continue;
      const mapping = buildDigitMap(values, rowMap, columnMap, transposed);
      if (!mapping) continue;
      records.push({ permutation, mapping, transposed, rowMap: [...rowMap], columnMap: [...columnMap] });
    }
    return { records, tested };
  }
  function automorphSource(originalPuzzle, solution, useSolution) {
    const hasSolution = isCompleteSolution(solution);
    const values = useSolution && hasSolution ? solution : originalPuzzle;
    return { source: [...values], target: [...values], mode: useSolution && hasSolution ? 'solution' : 'grid string', hasSolution };
  }
  function isCompleteSolution(values) {
    return Array.isArray(values) && values.length === 81
      && values.every(digit => Number.isInteger(digit) && digit >= 1 && digit <= 9);
  }
  function countToySolutions(grid, solver, limit = 2) {
    if (typeof solver?.countSolutionsDlx === 'function') return solver.countSolutionsDlx([...grid], limit);
    return solver.solveDlx([...grid], limit).count;
  }
  function miniLexCanonicalize(values, columnMaps, orders, helpers) {
    const orientedRows = [helpers.orientedRows(values, false), helpers.orientedRows(values, true)];
    let bestPattern = null; let bestKey = null; let bestValues = null; let bestOrientation = 0;
    let bestRowMap = null; let bestColumnMap = null; let bestDigitMap = null;
    for (let orientation = 0; orientation < orientedRows.length; orientation++) {
      const rows = orientedRows[orientation];
      for (const columnMap of columnMaps) {
        const rowMasks = helpers.rowMasks(rows, columnMap);
        const bestRows = helpers.bestRowMaps(rowMasks, orders, helpers.compare);
        if (bestPattern !== null && bestRows.pattern > bestPattern) continue;
        for (const rowMap of bestRows.rowMaps) {
          const transformed = new Array(81).fill(0);
          for (let sourceRow = 0; sourceRow < 9; sourceRow++) for (let sourceColumn = 0; sourceColumn < 9; sourceColumn++) {
            transformed[rowMap[sourceRow] * 9 + columnMap[sourceColumn]] = rows[sourceRow][sourceColumn];
          }
          const normalizedDetails = helpers.normalize(transformed); const normalized = normalizedDetails.normalized;
          const key = normalized.join(''); const pattern = bestRows.pattern;
          if (bestPattern === null || pattern < bestPattern || (pattern === bestPattern && (bestKey === null || key < bestKey))) {
            bestPattern = pattern; bestKey = key; bestValues = normalized; bestOrientation = orientation;
            bestRowMap = [...rowMap]; bestColumnMap = [...columnMap];
            bestDigitMap = [...normalizedDetails.mapping];
          }
        }
      }
    }
    return bestValues ? {
      key: bestKey,
      values: bestValues,
      orientation: bestOrientation,
      transformation: {
        transposed: bestOrientation === 1,
        rowMap: bestRowMap,
        columnMap: bestColumnMap,
        digitMap: bestDigitMap,
      },
    } : null;
  }
  function findNamedAutomorphMatches(records, families, source, target, searchTarget, helpers) {
    const normalizedTargetKey = helpers.normalizedKey(target); const matches = new Map(); let tested = 0;
    for (const family of families) {
      const familyMatches = [];
      for (const record of records[family]) {
        if (helpers.isIdentity(record.permutation) || !helpers.preserves(record.permutation)) continue;
        tested++;
        const transformed = helpers.mapValues(source, record.permutation);
        let mapping = null;
        if (helpers.normalizedKey(transformed) === normalizedTargetKey) mapping = helpers.digitPatternMap(transformed, target);
        if (mapping && helpers.verifyDigitMap(transformed, searchTarget, mapping)) familyMatches.push({ ...record, mapping });
      }
      matches.set(family, familyMatches);
    }
    return { matches, tested };
  }
  function searchAutomorphisms(families, records, source, target, searchTarget, fullFamilySearch, helpers) {
    const named = findNamedAutomorphMatches(records, families, source, target, searchTarget, helpers);
    let completeMatches = []; let tested = named.tested;
    if (fullFamilySearch) {
      const complete = helpers.complete(searchTarget);
      tested = complete.tested; completeMatches = complete.records;
    }
    const namedTotal = [...named.matches.values()].reduce((sum, entries) => sum + entries.length, 0);
    return { matches: named.matches, namedTested: named.tested, namedTotal, completeMatches, tested,
      total: fullFamilySearch ? completeMatches.length : namedTotal };
  }
  function structuralTargetCell(sourceRow, sourceColumn, rowMap, columnMap, transposed) {
    const targetRow = transposed ? columnMap[sourceColumn] : rowMap[sourceRow];
    const targetColumn = transposed ? rowMap[sourceRow] : columnMap[sourceColumn];
    return targetRow * 9 + targetColumn;
  }
  function structuralPermutation(rowMap, columnMap, transposed) {
    const permutation = new Array(81);
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) permutation[row * 9 + col] = structuralTargetCell(row, col, rowMap, columnMap, transposed);
    return permutation;
  }
  function structuralDigitMap(values, rowMap, columnMap, transposed) {
    const mapping = new Int8Array(10); const reverse = new Int8Array(10);
    for (let row = 0; row < 9; row++) for (let col = 0; col < 9; col++) {
      const source = row * 9 + col; const target = structuralTargetCell(row, col, rowMap, columnMap, transposed);
      const sourceDigits = cellDigits(values[source]); const targetDigits = cellDigits(values[target]);
      if (sourceDigits.length !== targetDigits.length) return null;
      for (let index = 0; index < sourceDigits.length; index++) {
        const sourceDigit = sourceDigits[index]; const targetDigit = targetDigits[index];
        if ((mapping[sourceDigit] && mapping[sourceDigit] !== targetDigit) || (reverse[targetDigit] && reverse[targetDigit] !== sourceDigit)) return null;
        mapping[sourceDigit] = targetDigit; reverse[targetDigit] = sourceDigit;
      }
    }
    return Array.from(mapping);
  }
  app.toyMath = { cellPermutation, permutations, identityOrder, orderLabel, composePermutations, permutationKey,
    transformationMapper, layoutPermutation, automorphOperationMaps, operationLabels, operationTokens, sequenceVariants,
    expandAutomorphismCatalog, transposeOperationLabel,
    transposePermutation, permutationPower, permutationOrder,
    mapValues, mapCandidates, mapAutomorphScalarValues, mapAutomorphCandidates,
    completeDigitMapping, remapDigit, remapDigitSet, bandStackSwapMapper, localSwapMapper,
    digitNormalizeDetails, digitNormalize, normalizedValueKey, miniLexPatternKey, compareNumberArrays,
    cellDigits, gridDigitMasks, transformDigitMasks, digitPatternMapFromMasks, verifyDigitMap, digitPatternMap, isIdentityPermutation,
    cachedMiniLexLayoutMaps,
    structuralOrderLabel, miniLexOrientedRows, miniLexRowMasks, miniLexBestRowMaps, miniLexLayoutMaps,
    formatDigitMap, minimizerCellLabel, automorphismLabel, completeAutomorphismSearch, automorphSource,
    isCompleteSolution, countToySolutions, miniLexCanonicalize, findNamedAutomorphMatches, searchAutomorphisms,
    structuralTargetCell, structuralPermutation, structuralDigitMap };
})(window);
