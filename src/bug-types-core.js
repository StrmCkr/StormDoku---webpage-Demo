(function installBugTypes(global) {
  'use strict';
  const core = global.StormDoku;
  const key = item => item.cell + ':' + item.digit;
  function findBugType(candidates, options = {}) {
    const type = String(options.type);
    const report = options.verifiedMugPatterns
      ? { results: options.verifiedMugPatterns }
      : core.findBug(candidates, {
        mode: 'lite', includePatterns: true, onProgress: options.onProgress,
        maxStates: type === '9' ? 16000 : undefined,
      });
    if (report.unsupportedVariants) return report;
    const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
    const peers = candidates.map((_, cell) => new Set(core.peersOf(cell)));
    const conflicts = (a, b) => a.cell === b.cell ? a.digit !== b.digit
      : a.digit === b.digit && peers[a.cell].has(b.cell);
    const atoms = candidates.flatMap((digits, cell) => digits.map(digit => ({ cell, digit })));
    const unsolvedCells = candidates.flatMap((digits, cell) => digits.length > 1 ? [cell] : []);
    let patterns = report.results;
    if (type === '9') {
      const polyCount = unsolvedCells.filter(cell => candidates[cell].length > 2).length;
      const full = core.findBug(candidates, {
        mode: polyCount === 1 ? '1' : 'n', includePatterns: true, maxStates: 16000, onProgress: options.onProgress,
      });
      patterns = [...patterns, ...full.results];
    }
    const results = [];
    const guardianAic = type === '9' ? core.createGuardianAic(candidates, options) : null;
    const externalSearch = type === '8' ? core.createExternalGuardianSearch(candidates, 81, true) : null;
    const alsList = type.startsWith('3') ? (options.alsList || core.alsConstructor(candidates, {
      maxSizeDOF: 8, maxSizeFox: 8, searchLimit: true,
    })).filter(als => als.alsDOF === 1) : [];
    let states = 0;
    function progress() {
      states += 1;
      if ((states & 1023) === 0) options.onProgress?.({
        stage: (options.verifiedMugPatterns ? 'mug-type-' : 'bug-type-') + type, states, results: results.length,
      });
    }
    function propagateInternal(pattern, assumption) {
      const domain = candidates.map(values => [...values]);
      const truth = new Map();
      const queue = [assumption];
      const scope = pattern.cells;
      const inScope = new Set(scope);
      const closed = units.map(unit => Array.from({ length: 9 }, (_, index) => {
        const digit = index + 1;
        const cells = unit.filter(cell => candidates[cell].includes(digit));
        return cells.length > 1 && cells.every(cell => inScope.has(cell)) ? { cells, digit } : null;
      }).filter(Boolean)).flat();
      let rounds = 0;
      while (queue.length && rounds++ < 81) {
        const item = queue.shift();
        if (truth.get(item.cell) === item.digit) continue;
        if (truth.has(item.cell) || !domain[item.cell].includes(item.digit)) return null;
        truth.set(item.cell, item.digit);
        domain[item.cell] = [item.digit];
        for (const cell of scope) {
          if (cell !== item.cell && peers[item.cell].has(cell)) {
            domain[cell] = domain[cell].filter(digit => digit !== item.digit);
            if (candidates[cell].length && !domain[cell].length) return null;
          }
        }
        for (const cell of pattern.cells) {
          if (domain[cell].length === 1 && !truth.has(cell)) queue.push({ cell, digit: domain[cell][0] });
        }
        for (const { cells, digit } of closed) {
          const remaining = cells.filter(cell => domain[cell].includes(digit));
          if (!remaining.length) return null;
          if (remaining.length === 1 && !truth.has(remaining[0])) queue.push({ cell: remaining[0], digit });
        }
      }
      return pattern.guardians.every(item => !domain[item.cell].includes(item.digit));
    }
    for (const pattern of patterns) {
      progress();
      const selected = new Set(pattern.cells);
      const isLite = unsolvedCells.some(cell => !selected.has(cell));
      if (guardianAic) {
        const extraDigits = [...new Set(pattern.guardians.map(item => item.digit))].sort((a, b) => a - b);
        if (extraDigits.length !== 2) continue;
        const guardianGroups = extraDigits.map(digit => ({
          digit, cells: pattern.guardians.filter(item => item.digit === digit).map(item => item.cell),
        }));
        // A full BUG has no unsolved cells outside the pattern. Its AIC
        // can leave the guardian cells through other cells in the BUG.
        const proof = guardianAic.analyze(pattern.cells, guardianGroups, { allowInside: !isLite });
        if (!proof) continue;
        const name = (isLite ? 'B.U.G -Lite +' + pattern.polyCells.length : 'B.U.G')
          + ' Type 9' + (proof.ring ? ' Ring' : proof.twoWay ? ' Two-Way' : '');
        results.push({
          ...pattern, ...proof, isLite, guardianGroups, tech: 'bug-type-9', name, classification: name,
          digits: [...new Set(pattern.basePairs.flatMap(item => item.digits))].sort((a, b) => a - b),
        });
        continue;
      }
      if (!isLite && pattern.polyCells.length === 1 && pattern.eliminations.length) {
        results.push({ ...pattern, tech: 'bug-1', name: 'B.U.G +1', isLite: false });
        continue;
      }
      const guardianCells = [...new Set(pattern.guardians.map(item => item.cell))];
      const guardianDigits = [...new Set(pattern.guardians.map(item => item.digit))];
      function emit(eliminations, extra = {}, identifiedType = type) {
        if (!eliminations.length) return;
        const suffix = type === '3' ? ' - ALS' : type === '3-xz' ? ' - ALS-XZ'
          : type === '3-xy' ? ' - ALS-XY' : type === '3-chain' ? ' - ALS-Chain' : '';
        results.push({ ...pattern, ...extra, tech: 'bug-type-' + identifiedType,
          isLite,
          name: (isLite ? 'B.U.G -Lite +' + pattern.polyCells.length + ' Type ' : 'B.U.G Type ')
            + identifiedType.split('-')[0] + suffix, eliminations });
      }
      if (type === '2' || type === '5' || type === '2,5') {
        if (guardianDigits.length !== 1 || guardianCells.length < 2) continue;
        const oneSector = units.some(unit => guardianCells.every(cell => unit.includes(cell)));
        const identifiedType = guardianCells.length === 2 && oneSector ? '2' : '5';
        if (type !== '2,5' && type !== identifiedType) continue;
        emit(pattern.eliminations, {}, identifiedType);
      } else if (type === '7') {
        emit(atoms.filter(item => selected.has(item.cell) && propagateInternal(pattern, item)));
      } else if (externalSearch) {
        for (const proof of externalSearch(pattern.cells, pattern.guardians)) emit(proof.eliminations, {
          ...proof, digits: [...new Set(pattern.basePairs.flatMap(item => item.digits))].sort((a, b) => a - b),
        });
      } else if (type === '6') {
        for (let digit = 1; digit <= 9; digit += 1) {
          const rowCopies = core.ROWS.map(row => row.filter(cell => candidates[cell].includes(digit)));
          for (let mask = 1; mask < 512; mask += 1) {
            const rows = core.ROWS.flatMap((_, row) => mask & (1 << row) ? [row] : []);
            if (rows.length < 2 || rows.some(row => rowCopies[row].length !== 2)) continue;
            const fishCells = rows.flatMap(row => rowCopies[row]);
            const columns = [...new Set(fishCells.map(cell => cell % 9))];
            if (columns.length !== rows.length || fishCells.some(cell => !selected.has(cell))
              || columns.some(col => core.COLS[col].some(cell => candidates[cell].includes(digit)
                && !rows.includes(Math.floor(cell / 9))))) continue;
            const placements = [];
            function match(index, used, cells) {
              if (placements.length > 2) return;
              if (index === rows.length) { placements.push(cells); return; }
              for (const cell of rowCopies[rows[index]]) {
                if (!used.includes(cell % 9)) match(index + 1, [...used, cell % 9], [...cells, cell]);
              }
            }
            match(0, [], []);
            if (placements.length !== 2 || placements[0].some(cell => placements[1].includes(cell))) continue;
            const side = placements.find(cells => guardianCells.every(cell => cells.includes(cell))
              && pattern.guardians.every(item => item.digit !== digit));
            if (side) emit(guardianCells.map(cell => ({ cell, digit })), { lockedDigit: digit, fishCells });
          }
        }
      } else if (type.startsWith('3')) {
        const touchesGuardian = (group, item) => {
          const sources = group.alsAllCells.filter(cell => candidates[cell].includes(item.digit));
          return sources.length && sources.every(cell => peers[item.cell].has(cell));
        };
        const eligible = alsList.filter(als => als.alsAllCells.every(cell => !selected.has(cell))
          && pattern.guardians.some(item => touchesGuardian(als, item)));
        const required = type === '3' ? 1 : type === '3-xz' ? 2 : type === '3-xy' ? 3 : 4;
        const seenPaths = new Set();
        function walk(groups, rccs) {
          if (groups.length >= required) {
            const ids = groups.map(group => group.uniqueID);
            const pathKey = [ids.join(','), [...ids].reverse().join(',')].sort()[0] + ':' + rccs.join(',');
            if (!seenPaths.has(pathKey)) {
              seenPaths.add(pathKey);
              const all = groups.flatMap(group => group.alsAllCells);
              if (pattern.guardians.every(item => groups.some(group => touchesGuardian(group, item)))) {
                function possible(forced) {
                  return pattern.guardians.some(guardian => {
                    if (conflicts(guardian, forced)) return false;
                    const assigned = [guardian, forced];
                    function fill(remaining) {
                      if (!remaining.length) return true;
                      const domains = remaining.map(cell => ({ cell, digits: candidates[cell].filter(digit =>
                        !assigned.some(item => conflicts({ cell, digit }, item))) }));
                      domains.sort((a, b) => a.digits.length - b.digits.length);
                      const next = domains[0];
                      for (const digit of next.digits) {
                        assigned.push({ cell: next.cell, digit });
                        if (fill(remaining.filter(cell => cell !== next.cell))) return true;
                        assigned.pop();
                      }
                      return false;
                    }
                    return fill(all);
                  });
                }
                if (possible({ cell: -1, digit: 0 })) emit(atoms.filter(item =>
                  (!options.verifiedMugPatterns || (candidates[item.cell].length > 1
                    && pattern.guardians.some(guardian => !conflicts(guardian, item))))
                  && !possible(item)), {
                  alsRecords: groups.map(group => ({ ...group })),
                  rccDigits: rccs,
                });
              }
            }
            if (type !== '3-chain') return;
          }
          if (type !== '3-chain' && groups.length >= required) return;
          for (const next of eligible) {
            if (options.maxAlsStates && states >= options.maxAlsStates) return;
            progress();
            if (groups.some(group => group.uniqueID === next.uniqueID
              || group.alsAllCells.some(cell => next.alsAllCells.includes(cell)))) continue;
            const last = groups[groups.length - 1];
            if (!last) { walk([next], []); continue; }
            for (const digit of last.alsDigits.filter(digit => next.alsDigits.includes(digit))) {
              if (rccs.at(-1) === digit) continue;
              const left = last.alsAllCells.filter(cell => candidates[cell].includes(digit));
              const right = next.alsAllCells.filter(cell => candidates[cell].includes(digit));
              if (left.every(cell => right.every(other => peers[cell].has(other)))) walk([...groups, next], [...rccs, digit]);
            }
          }
        }
        walk([], []);
      }
    }
    const unique = new Map();
    const grouped = externalSearch ? core.groupGuardianAssumptions(results.filter(record => record.tech === 'bug-type-8'))
      .concat(results.filter(record => record.tech !== 'bug-type-8')) : results;
    for (const result of grouped) {
      const signature = result.basePairs.map(item => item.cell + ':' + item.digits.join('')).join(',')
        + ':' + (result.alsRecords || []).map(item => item.uniqueID).sort().join(',')
        + ':' + result.eliminations.map(key).sort().join(',');
      if (!unique.has(signature)) unique.set(signature, result);
    }
    return { results: [...unique.values()], stats: { states } };
  }
  core.findBugType = findBugType;
})(globalThis);
