(function installMug(global) {
  'use strict';
  const core = global.StormDoku;
  const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
  const houses = Array.from({ length: 81 }, (_, cell) =>
    units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));

  function verifyMugFootprints(basePairs, budget = { remaining: 1000000 }) {
    const masks = new Uint16Array(units.length);
    const footprints = new Map();
    const ordered = [...basePairs].sort((a, b) => a.digits.length - b.digits.length || a.cell - b.cell);
    const touched = [...new Set(ordered.flatMap(({ cell }) => houses[cell]))];
    let fillings = 0;
    function fill(index) {
      if (budget.remaining <= 0) return false;
      budget.remaining -= 1;
      if (index === ordered.length) {
        const key = touched.map(house => masks[house]).join(',');
        footprints.set(key, Math.min(2, (footprints.get(key) || 0) + 1));
        fillings += 1;
        return true;
      }
      const { cell, digits } = ordered[index];
      for (const digit of digits) {
        const bit = 1 << digit;
        if (houses[cell].some(house => masks[house] & bit)) continue;
        for (const house of houses[cell]) masks[house] |= bit;
        if (!fill(index + 1)) return false;
        for (const house of houses[cell]) masks[house] ^= bit;
      }
      return true;
    }
    const complete = fill(0);
    // An unchanged exterior sees only the occupied digits in its houses.
    // Each legal filling must have a distinct partner with those same digits.
    return {
      verified: complete && fillings > 0 && [...footprints.values()].every(count => count === 2),
      complete, fillings, footprints: footprints.size,
    };
  }

  function searchBugLiteComposites(inventory, report, onProgress) {
    const seeds = [...inventory].sort((a, b) => a.cells.length - b.cells.length).slice(0, 512);
    const seedsByCell = Array.from({ length: 81 }, () => []);
    const signature = base => base.map(({ cell, digits }) => cell + ':' + digits.join('')).join(',');
    const queue = seeds.map((seed, index) => {
      for (const cell of seed.cells) seedsByCell[cell].push(index);
      return seed.basePairs;
    });
    const visited = new Set(queue.map(signature));
    const budget = { remaining: 250000 };
    let attempts = 0;
    for (let index = 0; index < queue.length && budget.remaining && attempts < 15000; index += 1) {
      const base = queue[index];
      const neighbors = new Set(base.flatMap(({ cell }) => seedsByCell[cell]));
      for (const neighbor of neighbors) {
        if (!budget.remaining || attempts >= 15000) break;
        attempts += 1;
        if ((attempts & 1023) === 0) onProgress?.({ stage: 'mug-composites', states: attempts });
        const byCell = new Map(base.map(({ cell, digits }) => [cell, digits]));
        for (const { cell, digits } of seeds[neighbor].basePairs) {
          byCell.set(cell, [...new Set([...(byCell.get(cell) || []), ...digits])].sort((a, b) => a - b));
        }
        const composite = [...byCell].map(([cell, digits]) => ({ cell, digits })).sort((a, b) => a.cell - b.cell);
        const key = signature(composite);
        if (visited.has(key)) continue;
        visited.add(key);
        // A later seed can cover another extra candidate, so retain unions
        // even when they do not yet have the right guardians for a deduction.
        queue.push(composite);
        if (composite.some(item => item.digits.length > 2)) report(composite, budget);
      }
    }
    return attempts;
  }

  function findMug(candidateGrid, options = {}) {
    const permeable = options.permeable === true;
    const multiple = options.type === '2,5';
    const sectorMode = options.type === '4';
    const fishMode = options.type === '6';
    const internalMode = options.type === '7';
    const externalMode = options.type === '8';
    const type9Mode = options.type === '9';
    const alsMode = ['3', '3-xz', '3-xy', '3-chain'].includes(options.type);
    const variant = core.getVariantSettings?.() || {};
    const unsupportedVariants = ['diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive']
      .filter(name => variant[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const candidates = Array.from({ length: 81 }, (_, cell) =>
      [...new Set(candidateGrid?.[cell] || [])].sort((a, b) => a - b));
    const locksByCells = new Map();
    if (sectorMode) {
      for (const [sector, unit] of units.entries()) {
        for (let digit = 1; digit <= 9; digit += 1) {
          const cells = unit.filter(cell => candidates[cell].includes(digit));
          if (cells.length !== 2 || cells.some(cell => candidates[cell].length < 2)) continue;
          const key = cells.join(',');
          if (!locksByCells.has(key)) locksByCells.set(key, []);
          locksByCells.get(key).push({ sector, digit });
        }
      }
    }
    const results = [];
    const seen = new Set();
    let states = 0;
    let incompleteChecks = 0;
    const externalSearch = externalMode ? core.createExternalGuardianSearch(candidates,
      Math.max(1, Math.min(8, Number(options.maxDepth) || 4)), true) : null;
    const guardianAic = type9Mode ? core.createGuardianAic(candidates, {
      maxDepth: Math.max(3, Math.min(24, Number(options.maxDepth) || 12)),
    }) : null;
    const fish = fishMode ? [...core.restrictedFishCycles(candidates, () => { states += 1; })] : [];
    if (fishMode && !fish.length) return { results, stats: { states, incompleteChecks } };
    const peers = internalMode ? candidates.map((_, cell) => new Set(core.peersOf(cell))) : [];
    const gates = new Map();
    if (internalMode) {
      const strong = core.buildStrongLinks(candidates, { strongLinkTypes: [0, 1, 2, 3, 4] });
      for (const link of strong.slice(0, 4).flat()) {
        const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
        const cells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
          .filter(cell => candidates[cell].includes(digit)).sort((a, b) => a - b);
        // The endpoint groups can overlap. Use the exhaustive union, as in UR Type 7.
        if (cells.length < 2 || !units.some(unit => {
          const locations = unit.filter(cell => candidates[cell].includes(digit));
          return locations.length === cells.length && locations.every(cell => cells.includes(cell));
        })) continue;
        gates.set(digit + ':' + cells.join(','), { cells, digit });
      }
    }
    function findInternalEliminations(basePairs, guardians) {
      const cells = basePairs.map(item => item.cell);
      const internal = [...gates.values()].filter(link => link.cells.every(cell => cells.includes(cell)));
      const eliminations = [];
      const usedLinks = new Map();
      if (!guardians.length || !internal.length) return { eliminations, internalLinks: [] };
      for (const { cell, digits } of basePairs) for (const digit of digits) {
        const domains = new Map(cells.map(cell => [cell, candidates[cell]]));
        const placed = new Map();
        const used = [];
        domains.set(cell, [digit]);
        let valid = true;
        let progress = true;
        while (valid && progress) {
          progress = false;
          for (const current of cells) {
            const domain = domains.get(current);
            if (!domain.length) { valid = false; break; }
            if (domain.length !== 1 || placed.has(current)) continue;
            const [value] = domain;
            placed.set(current, value);
            progress = true;
            for (const peer of cells) {
              if (!peers[current].has(peer)) continue;
              const remaining = domains.get(peer).filter(candidate => candidate !== value);
              domains.set(peer, remaining);
              if (!remaining.length) { valid = false; break; }
            }
            if (!valid) break;
          }
          if (!valid || progress) continue;
          if (guardians.every(item => !domains.get(item.cell).includes(item.digit))) {
            if (used.length) {
              eliminations.push({ cell, digit });
              for (const link of used) usedLinks.set(link.digit + ':' + link.cells.join(',') + ':' + link.forcedCell, link);
            }
            break;
          }
          for (const link of internal) {
            const remaining = link.cells.filter(cell => domains.get(cell).includes(link.digit));
            if (!remaining.length) { valid = false; break; }
            if (remaining.length !== 1 || placed.has(remaining[0])) continue;
            domains.set(remaining[0], [link.digit]);
            used.push({ ...link, forcedCell: remaining[0] });
            progress = true;
            break;
          }
        }
      }
      return { eliminations, internalLinks: [...usedLinks.values()] };
    }
    function report(basePairs, budget) {
      basePairs.sort((a, b) => a.cell - b.cell);
      const key = JSON.stringify(basePairs);
      if (seen.has(key)) return;
      seen.add(key);
      const cells = basePairs.map(item => item.cell);
      const guardians = basePairs.flatMap(({ cell, digits }) =>
        candidates[cell].filter(digit => !digits.includes(digit)).map(digit => ({ cell, digit })));
      const guardianCells = [...new Set(guardians.map(item => item.cell))];
      let type = 1;
      let eliminations;
      let sectorLocks;
      let matchingFish;
      let internalLinks;
      let externalProofs;
      let guardianProof;
      let guardianGroups;
      if (alsMode) {
        if (!guardians.length) return;
        eliminations = [];
      } else if (multiple) {
        if (guardianCells.length < 2 || guardians.some(item => item.digit !== guardians[0].digit)) return;
        const digit = guardians[0].digit;
        const peers = guardianCells.map(cell => new Set(core.peersOf(cell)));
        eliminations = candidates.flatMap((values, cell) =>
          !cells.includes(cell) && values.length > 1 && values.includes(digit)
            && peers.every(set => set.has(cell)) ? [{ cell, digit }] : []);
        type = guardianCells.length === 2 && units.some(unit => guardianCells.every(cell => unit.includes(cell))) ? 2 : 5;
      } else if (sectorMode) {
        if (guardianCells.length !== 2) return;
        const targets = basePairs.filter(item => guardianCells.includes(item.cell));
        sectorLocks = (locksByCells.get(guardianCells.join(',')) || [])
          .filter(lock => targets.every(item => item.digits.includes(lock.digit)));
        // Either guardian filled with another base digit forces the locked
        // digit into the other, leaving no cell that can escape the MUG.
        eliminations = targets.flatMap(({ cell, digits }) => digits
          .filter(digit => sectorLocks.some(lock => lock.digit !== digit))
          .map(digit => ({ cell, digit })));
        type = 4;
      } else if (fishMode) {
        if (!guardianCells.length) return;
        matchingFish = fish.filter(({ digit, cells: fishCells, matchingSets }) =>
          fishCells.every(cell => basePairs.some(item => item.cell === cell && item.digits.includes(digit)))
          && matchingSets.some(matching => guardianCells.every(cell => matching.has(cell))));
        if (!matchingFish.length) return;
        eliminations = guardianCells.flatMap(cell => matchingFish.map(({ digit }) => ({ cell, digit })));
        type = 6;
      } else if (internalMode) {
        ({ eliminations, internalLinks } = findInternalEliminations(basePairs, guardians));
        type = 7;
      } else if (externalMode) {
        externalProofs = externalSearch(cells, guardians);
        eliminations = externalProofs.flatMap(proof => proof.eliminations);
        type = 8;
      } else if (type9Mode) {
        const guardianDigits = [...new Set(guardians.map(item => item.digit))].sort((a, b) => a - b);
        if (guardianDigits.length !== 2) return;
        guardianGroups = guardianDigits.map(digit => ({
          digit, cells: guardians.filter(item => item.digit === digit).map(item => item.cell),
        }));
        guardianProof = guardianAic.analyze(cells, guardianGroups);
        if (!guardianProof) return;
        eliminations = guardianProof.eliminations;
        type = 9;
      } else {
        if (guardianCells.length !== 1) return;
        const cell = guardianCells[0];
        eliminations = basePairs.find(item => item.cell === cell).digits.map(digit => ({ cell, digit }));
      }
      if (!alsMode && !eliminations.length) return;
      const proof = verifyMugFootprints(basePairs, budget);
      if (!proof.complete) incompleteChecks += 1;
      if (!proof.verified || (permeable && proof.footprints < 2)) return;
      const result = {
        tech: (permeable ? 'pug-type-' : 'mug-type-') + type,
        name: (permeable ? 'PUG Type ' : 'MUG Type ') + type, cells,
        digits: [...new Set(basePairs.flatMap(item => item.digits))].sort((a, b) => a - b),
        basePairs, guardians, polyCells: cells.filter(cell => candidates[cell].length > 2), proof, eliminations,
        ...(guardianProof ? { ...guardianProof, guardianGroups } : {}),
        ...(sectorLocks ? { sectorLocks } : {}),
        ...(internalLinks ? { internalLinks } : {}),
      };
      if (externalProofs) {
        for (const externalProof of externalProofs) results.push({ ...result, ...externalProof });
      } else if (matchingFish) {
        for (const { digit, cells: fishCells } of matchingFish) results.push({
          ...result, fishDigit: digit, fishCells,
          eliminations: eliminations.filter(item => item.digit === digit),
        });
      } else results.push(result);
    }
    for (const lines of [core.ROWS, core.COLS]) {
      for (let first = 0; first < 8; first += 1) for (let second = first + 1; second < 9; second += 1) {
        for (let extra = multiple ? 1 : 0; extra <= (multiple ? 9 : 0); extra += 1) {
          const slots = lines[first].map((left, index) => {
            const right = lines[second][index];
            const common = candidates[left].filter(digit => candidates[right].includes(digit));
            const choices = [];
            const add = (digits, guardianCount) => {
              if (digits.length >= 2 && digits.length <= 6) choices.push({ cells: [left, right], digits, guardianCount });
            };
            const delta = candidates[left].length + candidates[right].length - 2 * common.length;
            if (!delta) add(common, 0);
            if (!multiple && delta && (alsMode || sectorMode || fishMode || internalMode || externalMode
              || common.length === Math.min(candidates[left].length, candidates[right].length))) {
              add(common, alsMode || sectorMode || fishMode || internalMode || externalMode ? Number(common.length < candidates[left].length)
                + Number(common.length < candidates[right].length) : 1);
            }
            if (sectorMode) {
              const locks = locksByCells.get([left, right].join(','));
              // The two corresponding cells can both carry extras, including
              // the same extra digit. Try the base domains that retain a lock.
              if (locks && common.length > 2) {
                for (let bits = 1; bits < (1 << common.length) - 1; bits += 1) {
                  const digits = common.filter((_, index) => bits & (1 << index));
                  if (locks.some(lock => digits.includes(lock.digit))) add(digits, 2);
                }
              }
            }
            if (multiple) {
              const base = common.filter(digit => digit !== extra);
              const leftBase = candidates[left].filter(digit => digit !== extra);
              const rightBase = candidates[right].filter(digit => digit !== extra);
              if (base.length === leftBase.length && base.length === rightBase.length) {
                const guardianCount = Number(candidates[left].includes(extra)) + Number(candidates[right].includes(extra));
                if (guardianCount) add(base, guardianCount);
              }
            }
            return choices;
          }).filter(choices => choices.length);
          if (slots.length < 3 || slots.reduce((sum, choices) =>
            sum + Math.max(...choices.map(choice => choice.guardianCount)), 0) < (multiple || sectorMode ? 2 : 1)) continue;
          const selected = [];
          function walk(index, guardianCount) {
            states += 1;
            if ((states & 2047) === 0) options.onProgress?.({
              stage: (permeable ? 'pug-type-' : 'mug-type-') + (options.type || '1'), states, results: results.length,
            });
            if (index < slots.length && selected.length < 6) {
              walk(index + 1, guardianCount);
              for (const pair of slots[index]) {
                const count = guardianCount + pair.guardianCount;
                if (sectorMode ? count > 2 : !multiple && !alsMode && !fishMode && !internalMode && !externalMode && count > 1) continue;
                selected.push(pair);
                walk(index + 1, count);
                selected.pop();
              }
              return;
            }
            if (selected.length < 3 || guardianCount < (multiple || sectorMode ? 2 : 1)
              || selected.every(pair => pair.digits.length === 2)) return;
            const digits = [...new Set(selected.flatMap(pair => pair.digits))].sort((a, b) => a - b);
            if (digits.length !== selected.length) return;
            const basePairs = selected.flatMap(pair => pair.cells.map(cell => ({ cell, digits: pair.digits })));
            report(basePairs);
          }
          walk(0, 0);
        }
      }
    }
    if (permeable) {
      // The forum's four-digit example spans three mini-columns in one
      // band. Transposing gives the equivalent three mini-rows in a stack.
      const forumBudget = { remaining: 250000 };
      for (const lines of [core.ROWS, core.COLS]) for (let band = 0; band < 3; band += 1) {
        for (let a = 0; a < 3; a += 1) for (let b = 3; b < 6; b += 1) for (let c = 6; c < 9; c += 1) {
          const cells = lines.slice(band * 3, band * 3 + 3).flatMap(line => [line[a], line[b], line[c]]);
          if (cells.some(cell => candidates[cell].length < 2)) continue;
          if (alsMode || sectorMode || fishMode || internalMode || externalMode) {
            if (!forumBudget.remaining) continue;
            const digits = [...new Set(cells.flatMap(cell => candidates[cell]))];
            for (let mask = 1; mask < (1 << digits.length) && forumBudget.remaining; mask += 1) {
              const pool = digits.filter((_, index) => mask & (1 << index));
              if (pool.length !== 4) continue;
              states += 1;
              const basePairs = cells.map(cell => ({
                cell, digits: candidates[cell].filter(digit => pool.includes(digit)),
              }));
              if (basePairs.some(item => item.digits.length < 2)
                || !basePairs.some(item => item.digits.length > 2)) continue;
              report(basePairs, forumBudget);
            }
            continue;
          }
          if (multiple) {
            const digits = [...new Set(cells.flatMap(cell => candidates[cell]))];
            if (digits.length !== 5) continue;
            for (const extra of digits) {
              states += 1;
              const basePairs = cells.map(cell => ({
                cell, digits: candidates[cell].filter(digit => digit !== extra),
              }));
              if (basePairs.some(item => item.digits.length < 2)
                || !basePairs.some(item => item.digits.length > 2)) continue;
              report(basePairs);
            }
            continue;
          }
          for (const cell of cells) {
            states += 1;
            const pool = new Set(cells.filter(other => other !== cell).flatMap(other => candidates[other]));
            if (pool.size !== 4) continue;
            const base = candidates[cell].filter(digit => pool.has(digit));
            if (base.length < 2 || base.length === candidates[cell].length) continue;
            report(cells.map(other => ({ cell: other, digits: other === cell ? base : candidates[other] })));
          }
        }
      }
    }
    const live = candidates.flatMap((digits, cell) => digits.length > 1 ? [cell] : []);
    const polyCount = live.filter(cell => candidates[cell].length > 2).length;
    const inventory = polyCount ? core.findBug(candidates, {
      mode: 'lite', includePatterns: true, includeBareSeeds: true,
      maxStates: live.length <= 16 ? 6000 : 16000, onProgress: options.onProgress,
    }) : null;
    if (inventory?.results.length) {
      states += inventory.stats.states + searchBugLiteComposites(inventory.results, report, options.onProgress);
    }
    // A BUG-Lite can seed an irregular MUG. Restore the other cells' full
    // domains and try adjoining unsolved cells before verifying the footprint.
    // Limit this combinatorial fallback to small remaining grids.
    if (live.length <= 16 && polyCount >= 2) {
      let attempts = 0;
      const budget = { remaining: 250000 };
      for (const seed of inventory.results) {
        const outside = live.filter(cell => !seed.cells.includes(cell));
        const reductions = [];
        if (multiple) {
          for (let digit = 1; digit <= 9; digit += 1) {
            const possible = seed.basePairs.filter(item =>
              candidates[item.cell].includes(digit) && !item.digits.includes(digit));
            for (let mask = 1; mask < (1 << possible.length); mask += 1) {
              if ((mask & (mask - 1)) === 0) continue;
              reductions.push(new Map(possible.filter((_, index) => mask & (1 << index))
                .map(({ cell }) => [cell, candidates[cell].filter(value => value !== digit)])));
              if (reductions.length >= 4096) break;
            }
            if (reductions.length >= 4096) break;
          }
        } else if (sectorMode) {
          for (const [index, left] of seed.basePairs.entries()) {
            if (left.digits.length === candidates[left.cell].length) continue;
            for (const right of seed.basePairs.slice(index + 1)) {
              if (right.digits.length === candidates[right.cell].length) continue;
              const locks = locksByCells.get([left.cell, right.cell].join(','));
              if (locks?.some(lock => left.digits.includes(lock.digit) && right.digits.includes(lock.digit))) {
                reductions.push(new Map([[left.cell, left.digits], [right.cell, right.digits]]));
              }
            }
          }
        } else {
          const allGuardians = new Map();
          for (const { cell, digits } of seed.basePairs) {
            if (digits.length >= candidates[cell].length) continue;
            reductions.push(new Map([[cell, digits]]));
            if (alsMode || fishMode || internalMode || externalMode) allGuardians.set(cell, digits);
          }
          if (allGuardians.size > 1) reductions.push(allGuardians);
        }
        for (const reduction of reductions) {
          const base = seed.cells.map(other => ({
            cell: other, digits: reduction.get(other) || candidates[other],
          }));
          for (let mask = 0; mask < (1 << outside.length) && attempts < 4096 && budget.remaining; mask += 1) {
            attempts += 1;
            const expanded = base.concat(outside.flatMap((other, index) =>
              mask & (1 << index) ? [{ cell: other, digits: candidates[other] }] : []));
            if (expanded.length >= 6 && expanded.some(item => item.digits.length > 2)) report(expanded, budget);
          }
          if (attempts >= 4096 || !budget.remaining) break;
        }
        if (attempts >= 4096 || !budget.remaining) break;
      }
      states += attempts;
    }
    if (alsMode && results.length) {
      const suffix = { '3': 'ALS', '3-xz': 'ALS-XZ', '3-xy': 'ALS-XY', '3-chain': 'ALS-Chain' }[options.type];
      const alsReport = core.findBugType(candidates, {
        type: options.type, verifiedMugPatterns: results, maxAlsStates: 60000, onProgress: options.onProgress,
      });
      return { results: alsReport.results.map(result => ({
        ...result, tech: (permeable ? 'pug-type-' : 'mug-type-') + options.type,
        name: (permeable ? 'PUG' : 'MUG') + ' Type 3 - ' + suffix,
      })), stats: { states: states + alsReport.stats.states, incompleteChecks } };
    }
    if (externalMode) core.groupGuardianAssumptions(results);
    return { results, stats: { states, incompleteChecks } };
  }
  core.verifyMugFootprints = verifyMugFootprints;
  core.findMug = findMug;
  core.findMugType1 = (candidateGrid, options) => findMug(candidateGrid, { ...options, type: '1' });
  core.findPugType1 = (candidateGrid, options) => findMug(candidateGrid, { ...options, type: '1', permeable: true });
})(globalThis);
