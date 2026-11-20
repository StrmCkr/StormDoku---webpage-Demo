(function installReverseBugTypes(global) {
  'use strict';
  const core = global.StormDoku;

  function findReverseBugType(candidateGrid, options = {}) {
    const givens = options.originalGivens;
    if (!Array.isArray(givens) || givens.length !== 81) throw new Error('Reverse-BUG types require original givens.');
    const variant = core.getVariantSettings?.() || {};
    const unsupportedVariants = ['diagonal', 'antiDiagonal', 'windoku', 'antiKing', 'antiKnight', 'nonConsecutive']
      .filter(name => variant[name]);
    if (unsupportedVariants.length) return { results: [], unsupportedVariants };
    const fixed = options.fixedGrid || givens;
    const original = Array.from({ length: 81 }, (_, cell) => fixed[cell]
      ? [fixed[cell]] : [...new Set(candidateGrid[cell] || [])]);
    const units = [...core.ROWS, ...core.COLS, ...core.BOXES];
    const houses = original.map((_, cell) => units.flatMap((unit, index) => unit.includes(cell) ? [index] : []));
    const peers = original.map((_, cell) => core.peersOf(cell));
    const peerSets = peers.map(cells => new Set(cells));
    const type = options.type || '2,5';
    const nodeCount = { '3': 1, '3-xz': 2, '3-xy': 3, '3-chain': 4 }[type];
    const suffix = { '3': 'ALS', '3-xz': 'ALS-XZ', '3-xy': 'ALS-XY', '3-chain': 'ALS-Chain' }[type];
    const results = [];
    const seen = new Set();
    let states = 0;

    function propagate(domain, assigned, queue, scope) {
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const { cell, digit: value } = queue[cursor];
        if (assigned.has(cell)) { if (assigned.get(cell) !== value) return null; continue; }
        if (!domain[cell].includes(value)) return null;
        assigned.set(cell, value);
        domain[cell] = [value];
        for (const peer of peers[cell]) {
          if (!domain[peer].includes(value)) continue;
          if (domain[peer].length === 1) return null;
          if (scope && !scope.has(peer)) continue;
          domain[peer] = domain[peer].filter(item => item !== value);
          if (domain[peer].length === 1 && !assigned.has(peer)) queue.push({ cell: peer, digit: domain[peer][0] });
        }
      }
      return { domain, assigned };
    }

    const alsList = nodeCount ? core.alsConstructor(
      original.map((digits, cell) => fixed[cell] ? [] : digits),
      { maxSizeDOF: 8, maxSizeFox: 8, searchLimit: true },
    ).filter(als => als.alsDOF === 1).map((als, index) => ({
      als, index, cells: als.alsAllCells,
      locations: new Map(als.alsDigits.map(digit => [digit,
        als.alsAllCells.filter(cell => original[cell].includes(digit))])),
    })) : [];
    const links = new Map();
    function adjacent(group) {
      if (!links.has(group.index)) {
        links.set(group.index, alsList.flatMap(other => {
          if (group.cells.some(cell => other.cells.includes(cell))) return [];
          return [...group.locations].flatMap(([digit, left]) => {
            const right = other.locations.get(digit);
            return right?.length && left.length && left.every(cell => right.every(peer => peerSets[cell].has(peer)))
              ? [{ other, digit }] : [];
          });
        }));
      }
      return links.get(group.index);
    }

    // Enumerate only assignments of the selected ALS cells. A digit present
    // in every assignment can rule out that digit at peers of all its copies.
    function applyAls(branch, groups) {
      const cells = groups.flatMap(group => group.cells)
        .sort((a, b) => branch.domain[a].length - branch.domain[b].length);
      const supported = new Map(cells.map(cell => [cell, new Set()]));
      const placements = [];
      let mandatory;
      let visits = 0;
      function fill(index, mask) {
        if (++visits > 20000) return false;
        if (index === cells.length) {
          mandatory = mandatory === undefined ? mask : mandatory & mask;
          placements.forEach((digit, offset) => supported.get(cells[offset]).add(digit));
          return true;
        }
        const cell = cells[index];
        for (const digit of branch.domain[cell]) {
          if (placements.some((value, offset) => value === digit && peerSets[cell].has(cells[offset]))) continue;
          placements.push(digit);
          if (!fill(index + 1, mask | (1 << digit))) return false;
          placements.pop();
        }
        return true;
      }
      if (!fill(0, 0) || mandatory === undefined) return null;
      const domain = branch.domain.map(values => [...values]);
      const singles = [];
      for (let cell = 0; cell < 81; cell += 1) {
        const support = supported.get(cell);
        if (!domain[cell].length) continue;
        const filtered = domain[cell].filter(digit => {
          if (support) return support.has(digit);
          if (!(mandatory & (1 << digit))) return true;
          return cells.some(source => supported.get(source).has(digit) && !peerSets[cell].has(source));
        });
        if (!filtered.length) return null;
        if (filtered.length === 1 && domain[cell].length > 1) singles.push({ cell, digit: filtered[0] });
        domain[cell] = filtered;
      }
      return singles.length ? propagate(domain, new Map(branch.assigned), singles) : null;
    }

    function findAlsProof(branch, root) {
      const visited = new Set();
      function walk(groups, rccDigits) {
        if (visited.size >= 1024) return null;
        const ids = groups.map(group => group.index);
        const forward = ids.join(',') + ':' + rccDigits.join(',');
        const backward = ids.reverse().join(',') + ':' + [...rccDigits].reverse().join(',');
        const key = forward < backward ? forward : backward;
        if (visited.has(key)) return null;
        visited.add(key);
        if (groups.length >= nodeCount) {
          const resolved = applyAls(branch, groups);
          const trade = resolved && closedTrade(resolved.domain, resolved.assigned, root);
          if (trade) return { trade, resolved, alsRecords: groups.map(group => group.als), rccDigits };
          if (type !== '3-chain') return null;
        }
        for (const prepend of groups.length === 1 ? [false] : [false, true]) {
          for (const { other, digit } of adjacent(prepend ? groups[0] : groups.at(-1))) {
            if (digit === (prepend ? rccDigits[0] : rccDigits.at(-1))) continue;
            if (groups.some(group => group.cells.some(cell => other.cells.includes(cell)))) continue;
            const proof = prepend
              ? walk([other, ...groups], [digit, ...rccDigits])
              : walk([...groups, other], [...rccDigits, digit]);
            if (proof) return proof;
            if (visited.size >= 1024) return null;
          }
        }
        return null;
      }
      for (const group of alsList) {
        if (!group.cells.some(cell => branch.domain[cell].length < original[cell].length)) continue;
        const proof = walk([group], []);
        if (proof) return proof;
        if (visited.size >= 1024) break;
      }
      return null;
    }

    function closedTrade(domain, assigned, root, requiredPair = [], requiredCells = []) {
      for (let a = 1; a < 9; a += 1) for (let b = a + 1; b <= 9; b += 1) {
        const digits = [a, b];
        if (!requiredPair.every(digit => digits.includes(digit))) continue;
        const givenCells = givens.flatMap((value, cell) => digits.includes(value) ? [cell] : []);
        if (!givenCells.length || givenCells.length >= 18) continue;
        const selected = new Map();
        const counts = units.map(() => [0, 0]);
        const queue = givenCells.map(cell => ({ cell, digit: givens[cell] }));
        let valid = true;
        for (let cursor = 0; cursor < queue.length && valid; cursor += 1) {
          const { cell, digit } = queue[cursor];
          if (selected.has(cell)) { if (selected.get(cell) !== digit) valid = false; continue; }
          if (domain[cell].length !== 1 || domain[cell][0] !== digit) { valid = false; break; }
          const side = digit === a ? 0 : 1;
          if (houses[cell].some(unit => counts[unit][side])) { valid = false; break; }
          selected.set(cell, digit);
          if (selected.size >= 18) { valid = false; break; }
          for (const unit of houses[cell]) {
            counts[unit][side] = 1;
            if (counts[unit][1 - side]) continue;
            const opposite = digits[1 - side];
            const places = units[unit].filter(other => domain[other].length === 1 && domain[other][0] === opposite);
            if (places.length !== 1) { valid = false; break; }
            queue.push({ cell: places[0], digit: opposite });
          }
        }
        if (!valid || selected.size < 4 || counts.some(([left, right]) => left !== right)) continue;
        if (type === '8' && selected.has(root)) continue;
        if (!requiredCells.every(cell => selected.has(cell))) continue;
        const forced = [...selected.keys()].filter(cell => !givens[cell] && assigned.has(cell));
        if (!forced.length || forced.every(cell => cell === root)) continue;
        const cells = [...selected.keys()].sort((x, y) => x - y);
        return { cells, digits, givenCells, forced,
          assignments: cells.map(cell => ({ cell, digit: selected.get(cell) })) };
      }
      return null;
    }

    if (type === '9') {
      const aic = core.createGuardianAic(original, options);
      for (let first = 1; first <= 8; first += 1) for (let second = first + 1; second <= 9; second += 1) {
        if (states >= 30000) break;
        const digits = [first, second];
        const anchors = givens.flatMap((digit, cell) => digits.includes(digit) ? [cell] : []);
        if (!anchors.length || anchors.length >= 18) continue;
        const selected = new Map();
        const masks = new Uint8Array(units.length);
        const locations = digits.map(digit => units.map(unit => unit.filter(cell => original[cell].includes(digit))));
        const visited = new Set();
        function place(cell, side) {
          const bit = 1 << side;
          selected.set(cell, digits[side]);
          for (const house of houses[cell]) masks[house] |= bit;
        }
        let valid = true;
        for (const cell of anchors) {
          const side = digits.indexOf(givens[cell]);
          if (!original[cell].includes(givens[cell]) || houses[cell].some(house => masks[house] & (1 << side))) {
            valid = false;
            break;
          }
          place(cell, side);
        }
        if (!valid) continue;
        function walk(extraDigits) {
          if (selected.size >= 18 || states >= 30000) return;
          const key = [...selected].sort((a, b) => a[0] - b[0]).map(item => item.join(':')).join(',');
          if (visited.has(key)) return;
          visited.add(key);
          states += 1;
          if ((states & 1023) === 0) options.onProgress?.({
            stage: 'reverse-bug-type-9', states, results: results.length,
          });
          let next;
          for (const [house, mask] of masks.entries()) {
            if (mask !== 1 && mask !== 2) continue;
            const side = mask === 1 ? 1 : 0;
            const bit = 1 << side;
            const choices = locations[side][house].filter(cell =>
              !selected.has(cell) && houses[cell].every(unit => !(masks[unit] & bit)));
            if (!choices.length) return;
            if (!next || choices.length < next.choices.length) next = { side, choices };
          }
          if (next) {
            const { side, choices } = next;
            for (const cell of choices) {
              const extras = [...new Set([...extraDigits, ...original[cell].filter(digit => digit !== digits[side])])];
              if (extras.length > 2) continue;
              place(cell, side);
              walk(extras);
              selected.delete(cell);
              for (const house of houses[cell]) masks[house] ^= 1 << side;
            }
            return;
          }
          if (selected.size < 4 || extraDigits.length !== 2) return;
          const cells = [...selected.keys()].sort((a, b) => a - b);
          const guardianGroups = [...extraDigits].sort((a, b) => a - b).map(digit => ({
            digit, cells: cells.filter(cell => selected.get(cell) !== digit && original[cell].includes(digit)),
          }));
          // If all guardians are off, the trade cells reduce to these placements.
          // Recheck the anchored trade using the original-givens verifier.
          const forced = new Map([...selected].filter(([cell]) => original[cell].length > 1));
          const domain = original.map((values, cell) => forced.has(cell) ? [forced.get(cell)] : values);
          const trade = closedTrade(domain, forced, -1, digits, cells);
          if (!trade) return;
          const proof = aic.analyze(cells, guardianGroups);
          if (!proof) return;
          const name = 'Reverse-BUG Type 9' + (proof.ring ? ' Ring' : proof.twoWay ? ' Two-Way' : '');
          results.push({ ...trade, ...proof, guardianGroups, tech: 'reverse-bug-type-9', name, classification: name });
        }
        walk([]);
      }
      return { results, stats: { states, depthLimit: aic.depthLimit } };
    }

    if (type === '8') {
      const locations = Array.from({ length: 10 }, (_, digit) =>
        units.map(unit => unit.filter(cell => original[cell].includes(digit))));
      const depth = Math.max(1, Math.min(8, Number(options.maxDepth) || 4));
      function applyGuardians(branch, digit, scope) {
        const domain = original.map(values => [...values]);
        const queue = [];
        for (let cell = 0; cell < 81; cell += 1) {
          if ((scope && !scope.has(cell)) || original[cell].length < 2) continue;
          if (branch.on[cell]) queue.push({ cell, digit });
          if (!branch.off[cell]) continue;
          domain[cell] = domain[cell].filter(value => value !== digit);
          if (domain[cell].length === 1) queue.push({ cell, digit: domain[cell][0] });
        }
        return propagate(domain, new Map(), queue, scope);
      }
      for (let cell = 0; cell < 81; cell += 1) {
        if (fixed[cell] || givens[cell] || original[cell].length < 2) continue;
        for (const digit of original[cell]) {
          states += 1;
          if ((states & 15) === 0) options.onProgress?.({
            stage: 'reverse-bug-type-8', states, results: results.length,
          });
          const branch = core.assumeGuardianOn(original, locations[digit], cell, digit, depth, true);
          if (!branch) continue;
          const resolved = applyGuardians(branch, digit);
          const trade = resolved && closedTrade(resolved.domain, resolved.assigned, cell);
          if (!trade) continue;
          const scope = new Set(trade.cells);
          const forcingSectors = locations[digit].flatMap((originalCells, sector) => {
            const remaining = branch.locations[sector];
            return remaining.length === 1 && scope.has(remaining[0]) && branch.on[remaining[0]]
              && originalCells.some(other => !scope.has(other) && branch.off[other]) ? [sector] : [];
          });
          const guardCells = [...new Set([
            ...trade.cells.filter(other => branch.off[other] && !trade.digits.includes(digit)),
            ...forcingSectors.flatMap(sector => locations[digit][sector].filter(other => branch.off[other])),
          ])].sort((a, b) => a - b);
          if (!guardCells.length) continue;
          const proof = applyGuardians(branch, digit, scope);
          if (!proof || !closedTrade(proof.domain, proof.assigned, cell, trade.digits, trade.cells)) continue;
          const proofOff = [...new Set([...guardCells, ...trade.cells.filter(other => branch.off[other])])]
            .sort((a, b) => a - b).map(other => ({ cell: other, digit }));
          results.push({ ...trade, tech: 'reverse-bug-type-8', name: 'Reverse-BUG Type 8',
            guardCells, guardDigit: digit, forcingSectors,
            ...core.guardianForcingRecord(branch, cell, digit, proofOff, trade.cells.filter(other => branch.on[other])),
            forcingAssignments: [{ cell, digit }, ...[...proof.assigned].map(([cell, digit]) => ({ cell, digit }))],
            eliminations: [{ cell, digit }] });
          for (const paired of core.findPairedExternalGuardians(original, trade.cells, trade.digits)) {
            results.push({ ...trade, ...paired, tech: 'reverse-bug-type-8',
              name: 'Reverse-BUG Type 8', classification: 'Reverse-BUG Type 8',
              givenCells: trade.givenCells, guardCells: paired.guardianCells,
              guardDigit: paired.breakerDigit, forcingSectors: [] });
          }
        }
      }
      return { results: core.groupGuardianAssumptions(results), stats: { states } };
    }

    if (type === '7') {
      const strongLinks = core.buildStrongLinks(original, { strongLinkTypes: [0, 1, 2, 3, 4] });
      const gates = strongLinks.slice(0, 4).flat().flatMap(link => {
        const digit = Number(link.startingDigits?.[0] ?? link.linkDigits?.[0]);
        const cells = [...new Set([...(link.activeCells || []), ...(link.linkedCells || [])])]
          .filter(cell => original[cell].includes(digit));
        const exhaustive = units.some(unit => {
          const locations = unit.filter(cell => original[cell].includes(digit));
          return locations.length === cells.length && locations.every(cell => cells.includes(cell));
        });
        return exhaustive && cells.length > 1 ? [{ digit, cells }] : [];
      });
      function followLinks(assumption, scope) {
        const branch = propagate(original.map(values => [...values]), new Map(), [assumption], scope);
        if (!branch) return null;
        const internalLinks = [];
        const available = scope ? gates.filter(gate => gate.cells.every(cell => scope.has(cell))) : gates;
        for (;;) {
          let forced = false;
          for (const gate of available) {
            const remaining = gate.cells.filter(cell => branch.domain[cell].includes(gate.digit));
            if (!remaining.length) return null;
            if (remaining.length !== 1 || branch.domain[remaining[0]].length === 1) continue;
            if (!propagate(branch.domain, branch.assigned, [{ cell: remaining[0], digit: gate.digit }], scope)) return null;
            internalLinks.push({ ...gate, forcedCell: remaining[0] });
            forced = true;
          }
          if (!forced) return { ...branch, internalLinks };
        }
      }
      for (let cell = 0; cell < 81; cell += 1) {
        if (fixed[cell] || givens[cell] || original[cell].length < 2) continue;
        for (const digit of original[cell]) {
          states += 1;
          if ((states & 15) === 0) options.onProgress?.({ stage: 'reverse-bug-type-7', states, results: results.length });
          const assumption = { cell, digit };
          const branch = followLinks(assumption);
          if (!branch?.internalLinks.length) continue;
          const trade = closedTrade(branch.domain, branch.assigned, cell, [digit], [cell]);
          if (!trade) continue;
          const scope = new Set(trade.cells);
          const baseline = propagate(original.map(values => [...values]), new Map(), [assumption], scope);
          if (!baseline || closedTrade(baseline.domain, baseline.assigned, cell, trade.digits, trade.cells)) continue;
          const proof = followLinks(assumption, scope);
          if (!proof?.internalLinks.length
            || !closedTrade(proof.domain, proof.assigned, cell, trade.digits, trade.cells)) continue;
          results.push({ ...trade, tech: 'reverse-bug-type-7', name: 'Reverse-BUG Type 7',
            internalLinks: proof.internalLinks,
            forcingAssignments: [...proof.assigned].map(([cell, digit]) => ({ cell, digit })),
            eliminations: [assumption] });
        }
      }
      return { results, stats: { states } };
    }

    if (type === '6') {
      const onState = () => {
        states += 1;
        if ((states & 255) === 0) options.onProgress?.({
          stage: 'reverse-bug-type-6', states, results: results.length,
        });
      };
      for (const { digit, cells: fishCells, matchingSets } of core.restrictedFishCycles(original, onState)) {
        if (fishCells.some(cell => fixed[cell] || givens[cell] || original[cell].length < 2)) continue;
        for (const matching of matchingSets) {
          if ([...matching].some(cell => [...matching].some(other => peerSets[cell].has(other)))) continue;
          for (const cell of matching) {
            const assumption = { cell, digit };
            const baseline = propagate(original.map(values => [...values]), new Map(), [assumption]);
            if (!baseline || closedTrade(baseline.domain, baseline.assigned, cell, [digit], [cell])) continue;
            const fishAssignments = [...matching].map(cell => ({ cell, digit }));
            const branch = propagate(baseline.domain, baseline.assigned, fishAssignments);
            if (!branch) continue;
            const trade = closedTrade(branch.domain, branch.assigned, cell, [digit], [cell]);
            if (!trade) continue;
            results.push({ ...trade, tech: 'reverse-bug-type-6', name: 'Reverse-BUG Type 6',
              fishCells, fishDigit: digit, fishAssignments,
              forcingAssignments: [...branch.assigned].map(([cell, digit]) => ({ cell, digit })),
              eliminations: [assumption] });
          }
        }
      }
      return { results, stats: { states } };
    }

    if (type === '4') {
      for (const [targetUnit, unit] of units.entries()) {
        for (let lockedDigit = 1; lockedDigit <= 9; lockedDigit += 1) {
          const locations = unit.filter(cell => original[cell].includes(lockedDigit));
          if (locations.length !== 2 || locations.some(cell => fixed[cell] || givens[cell]
            || original[cell].length < 2)) continue;
          for (const cell of locations) {
            const partner = locations.find(other => other !== cell);
            for (const digit of original[cell]) {
              if (digit === lockedDigit) continue;
              states += 1;
              if ((states & 15) === 0) options.onProgress?.({
                stage: 'reverse-bug-type-4', states, results: results.length,
              });
              // The sector still needs the locked digit after the assumption.
              const branch = propagate(original.map(values => [...values]), new Map(),
                [{ cell, digit }, { cell: partner, digit: lockedDigit }]);
              if (!branch) continue;
              const trade = closedTrade(branch.domain, branch.assigned, cell, [digit, lockedDigit], locations);
              if (!trade) continue;
              const trace = [...branch.assigned].map(([cell, digit]) => ({ cell, digit }));
              const lastNeeded = Math.max(...trade.forced.map(forced => trace.findIndex(item => item.cell === forced)));
              results.push({ ...trade, tech: 'reverse-bug-type-4', name: 'Reverse-BUG Type 4',
                targetCells: locations, targetUnit, lockedDigit,
                forcingAssignments: trace.slice(0, lastNeeded + 1), eliminations: [{ cell, digit }] });
            }
          }
        }
      }
      return { results, stats: { states } };
    }

    for (let cell = 0; cell < 81; cell += 1) {
      if (fixed[cell] || givens[cell] || original[cell].length < 2) continue;
      for (const digit of original[cell]) {
        states += 1;
        if ((states & 15) === 0) options.onProgress?.({ stage: 'reverse-bug-type-' + type, states, results: results.length });
        const branch = propagate(original.map(values => [...values]), new Map(), [{ cell, digit }]);
        if (!branch) continue;
        const trade = closedTrade(branch.domain, branch.assigned, cell);
        if (nodeCount) {
          if (trade) continue;
          const proof = findAlsProof(branch, cell);
          if (!proof) continue;
          const trace = [...proof.resolved.assigned].map(([cell, digit]) => ({ cell, digit }));
          const lastNeeded = Math.max(...proof.trade.forced.map(forced => trace.findIndex(item => item.cell === forced)));
          results.push({ ...proof.trade, tech: 'reverse-bug-type-' + type,
            name: 'Reverse-BUG Type 3 - ' + suffix, alsRecords: proof.alsRecords, rccDigits: proof.rccDigits,
            forcingAssignments: trace.slice(0, lastNeeded + 1),
            eliminations: [{ cell, digit }] });
          continue;
        }
        if (!trade) continue;
        const direct = units.some(unit => unit.includes(cell) && trade.forced.every(other => unit.includes(other)));
        const identifiedType = direct ? '2' : '5';
        const signature = cell + ':' + digit + ':' + trade.cells.join(',');
        if (seen.has(signature)) continue;
        seen.add(signature);
        const trace = [...branch.assigned].map(([cell, digit]) => ({ cell, digit }));
        const lastNeeded = Math.max(...trade.forced.map(forced => trace.findIndex(item => item.cell === forced)));
        results.push({ tech: 'reverse-bug-type-' + identifiedType, name: 'Reverse-BUG Type ' + identifiedType,
          ...trade, forcingAssignments: trace.slice(0, lastNeeded + 1),
          eliminations: [{ cell, digit }] });
      }
    }
    return { results, stats: { states } };
  }
  core.findReverseBugType = findReverseBugType;
})(globalThis);
