/* Experimental ALS-backed Non-Colourable Chromatic Graphs.
 * Separate from chromatic-core.js until the ALS DOF 0/1 form is validated.
 */
(function attachChromaticAlsCore(global) {
  'use strict';

  const core = global.StormDoku;
  if (!core) throw new Error('StormDoku core must load before chromatic-als-core.js');
  const units = core.UNITS || [];
  const unitNames = units.map((_, index) => index < 9 ? `r${index + 1}`
    : index < 18 ? `c${index - 8}` : `b${index - 17}`);
  const peers = Array.from({ length: 81 }, () => new Set());
  for (const unit of units) for (const cell of unit) for (const peer of unit) {
    if (peer !== cell) peers[cell].add(peer);
  }

  function combinations(values, size, start = 0, prefix = [], output = []) {
    if (prefix.length === size) { output.push([...prefix]); return output; }
    for (let index = start; index <= values.length - (size - prefix.length); index++) {
      prefix.push(values[index]);
      combinations(values, size, index + 1, prefix, output);
      prefix.pop();
    }
    return output;
  }

  function product(groups, index = 0, prefix = [], output = []) {
    if (index === groups.length) { output.push([...prefix]); return output; }
    for (const value of groups[index]) {
      prefix.push(value);
      product(groups, index + 1, prefix, output);
      prefix.pop();
    }
    return output;
  }

  function sameDigits(left, right) {
    return left.length === right.length && left.every(value => right.includes(value));
  }

  function normaliseAls(als) {
    return {
      id: als.uniqueID,
      sector: als.alsSector,
      cells: [...als.alsAllCells],
      digits: [...als.alsDigits],
      dof: als.alsDOF,
      size: als.alsSize,
      fox: als.alsFOX,
    };
  }

  function graphIsKColorable(cells, digits, cand) {
    const domains = new Map(cells.map(cell => [cell,
      (cand[cell] || []).filter(digit => digits.includes(digit))]));
    if ([...domains.values()].some(domain => !domain.length)) return false;
    const assigned = new Map();
    function visit(remaining) {
      if (!remaining.length) return true;
      let selected = remaining[0];
      let values = domains.get(selected).filter(value =>
        ![...peers[selected]].some(peer => assigned.get(peer) === value));
      for (const cell of remaining.slice(1)) {
        const next = domains.get(cell).filter(value =>
          ![...peers[cell]].some(peer => assigned.get(peer) === value));
        if (next.length < values.length) { selected = cell; values = next; }
      }
      for (const value of values) {
        assigned.set(selected, value);
        if (visit(remaining.filter(cell => cell !== selected))) return true;
        assigned.delete(selected);
      }
      return false;
    }
    return visit([...cells]);
  }

  function graphEdges(cells) {
    const selected = new Set(cells);
    const edges = [];
    for (const left of cells) for (const right of peers[left]) {
      if (selected.has(right) && left < right) edges.push([left, right]);
    }
    return edges;
  }

  function graphDigitEliminations(cells, digits, cand) {
    const selected = new Set(cells);
    const eliminations = [];
    for (const digit of digits) {
      const digitCells = cells.filter(cell => (cand[cell] || []).includes(digit));
      if (!digitCells.length) continue;
      for (let cell = 0; cell < cand.length; cell++) {
        if (selected.has(cell) || !(cand[cell] || []).includes(digit)) continue;
        if (digitCells.every(source => peers[cell].has(source))) {
          eliminations.push({ cell, digit });
        }
      }
    }
    return eliminations;
  }

  function cellsFitGraphDigits(cells, digits, cand) {
    const allowed = new Set(digits);
    return cells.every(cell => (cand[cell] || []).every(digit => allowed.has(digit)));
  }

  function cellsSeeingBoth(left, right, cand, excluded) {
    return Array.from({ length: cand.length }, (_, cell) => cell)
      .filter(cell => !excluded.has(cell) && peers[cell].has(left) && peers[cell].has(right));
  }

  function cellsSeeingAll(guardians, cand, excluded) {
    return Array.from({ length: cand.length }, (_, cell) => cell)
      .filter(cell => !excluded.has(cell)
        && guardians.every(guardian => peers[cell].has(guardian)));
  }

  function addOverlapCounts(record, nodes) {
    const counts = new Map();
    for (const node of nodes || []) {
      for (const cell of node.cells || []) counts.set(cell, (counts.get(cell) || 0) + 1);
    }
    record.cellInstances = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([cell, count]) => ({ cell, count }));
    record.overlapCells = record.cellInstances.map(({ cell }) => cell);
    record.overlapCount = record.cellInstances
      .reduce((total, { count }) => total + count - 1, 0);
    return record;
  }

  function sectorIndexes(unitType, alsRecords) {
    const origins = [...new Set((alsRecords || []).map(node => node.sector))]
      .sort((left, right) => left - right);
    if (unitType === 'row') return origins.filter(index => index < 9);
    if (unitType === 'column') return origins.filter(index => index >= 9 && index < 18);
    if (unitType === 'all') return origins;
    return origins.filter(index => index >= 18);
  }

  function addResult(results, seen, record, maxResults) {
    addOverlapCounts(record, record.alsNodes);
    const key = [record.type, record.sectors, record.digits, record.coreCells,
      record.guardians, record.guardianDigit || ''].join('|');
    if (seen.has(key)) return results.length >= maxResults;
    seen.add(key);
    results.push(record);
    return results.length >= maxResults;
  }

  function distributedAlsSupport(record, alsRecords) {
    const sectors = new Set(record.sectors || []);
    const graphCells = new Set(record.cells || []);
    const nodes = alsRecords.filter(node => sectors.has(node.sector)
      && (node.dof === 0 || node.dof === 1)
      && (units[node.sector] || []).length
      && node.cells.every(cell => units[node.sector].includes(cell))
      && node.cells.every(cell => graphCells.has(cell))
      && node.digits.filter(digit => !record.digits.includes(digit)).length <= node.dof);
    const supportedSectors = new Set(nodes.map(node => node.sector));
    const graphDigits = new Set(record.digits || []);
    // A DOF-1 ALS legitimately carries one extra guardian digit. That
    // digit is not part of the graph's K-colour set, so compare only the
    // base graph digits when checking distributed ALS coverage.
    const coveredDigits = new Set(nodes.flatMap(node =>
      node.digits.filter(digit => graphDigits.has(digit))));
    const digitsMatch = coveredDigits.size === graphDigits.size
      && [...graphDigits].every(digit => coveredDigits.has(digit));
    // A distributed LS/ALS result must be backed in every graph sector.
    // Partial support must not relabel a plain chromatic graph as ALS-backed.
    return digitsMatch
      && supportedSectors.size === sectors.size
      && nodes.some(node => node.dof === 0)
      && nodes.some(node => node.dof === 1)
      ? nodes
      : [];
  }

  function find(cand, options = {}) {
    const minSectors = Math.max(2, Number(options.minSectors) || 4);
    const maxSectors = Math.min(units.length, Math.max(minSectors, Number(options.maxSectors) || 5));
    const minDigits = Math.max(2, Number(options.minDigits) || 2);
    const maxDigits = Math.min(9, Math.max(minDigits, Number(options.maxDigits) || 5));
    const maxCells = Math.max(2, Number(options.maxCells) || 32);
    const maxResults = Math.max(1, Number(options.maxResults) || 100);
    const maxTests = Math.max(1000, Number(options.maxTests) || 200000);
    // Graph K controls the colourability test. It must not also cap the size
    // of the ALS records that can support a larger multi-sector graph.
    const maxAlsSizeDOF = Math.min(8, Math.max(1, Number(options.maxAlsSizeDOF) || 4));
    const maxAlsSizeFox = Math.min(
      9,
      Math.max(maxAlsSizeDOF + 1, Number(options.maxAlsSizeFox) || 5),
    );
    if (typeof core.alsConstructor !== 'function') {
      return { tech: 'non-colourable-chromatic-graph-als', results: [], stats: { error: 'ALS constructor unavailable' } };
    }
    const alsRecords = core.alsConstructor(cand, {
      maxSizeDOF: maxAlsSizeDOF,
      maxSizeFox: maxAlsSizeFox,
    }).map(normaliseAls);
    const dofZero = alsRecords.filter(node => node.dof === 0);
    const results = [];
    const seen = new Set();
    let tested = 0;
    let budgetReached = false;

    outer:
    for (let sectorCount = minSectors; sectorCount <= maxSectors; sectorCount++) {
      for (const sectors of combinations(sectorIndexes(options.unitType, alsRecords), sectorCount)) {
        for (let digitCount = minDigits; digitCount <= maxDigits; digitCount++) {
          for (const digits of combinations([1, 2, 3, 4, 5, 6, 7, 8, 9], digitCount)) {
            const groups = sectors.map(sector => dofZero.filter(node =>
              node.sector === sector && sameDigits(node.digits, digits)));
            if (groups.some(group => !group.length)) continue;
            for (const selectedNodes of product(groups)) {
              const coreCells = [...new Set(selectedNodes.flatMap(node => node.cells))];
              if (coreCells.length > maxCells) continue;
              if (!cellsFitGraphDigits(coreCells, digits, cand)) continue;
              const sectorCells = [...new Set(sectors.flatMap(sector => units[sector] || []))];
              const guardians = sectorCells.filter(cell => !coreCells.includes(cell)
                && (cand[cell] || []).some(digit => digits.includes(digit))
                && (cand[cell] || []).some(digit => !digits.includes(digit)));
              if (!guardians.length) continue;

              for (const guardian of guardians) {
                const graphCells = [...coreCells, guardian];
                if (graphCells.length > maxCells) continue;
                tested += 1;
                if (tested >= maxTests) { budgetReached = true; break outer; }
                if (graphIsKColorable(graphCells, digits, cand)) continue;
                const eliminations = (cand[guardian] || [])
                  .filter(digit => digits.includes(digit))
                  .map(digit => ({ cell: guardian, digit }));
                if (!eliminations.length) continue;
                if (addResult(results, seen, {
                  tech: 'non-colourable-chromatic-graph-als',
                  name: 'Non-Colourable Chromatic Graph',
                  classification: 'Non-Colourable Chromatic Graph',
                  source: 'ALS-DOF-0/1', type: 1, k: digits.length, digits,
                  sectors: [...sectors], sectorNames: sectors.map(sector => unitNames[sector]),
                  cells: graphCells, coreCells, guardians: [guardian], alsNodes: selectedNodes,
                  edges: graphEdges(graphCells), eliminations,
                }, maxResults)) break outer;
              }

              const sharedExtras = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit =>
                !digits.includes(digit)
                && guardians.filter(cell => (cand[cell] || []).includes(digit)).length >= 2);
              for (const guardianDigit of sharedExtras) {
                const matchingGuardians = guardians.filter(cell =>
                  (cand[cell] || []).includes(guardianDigit));
                for (let guardianCount = 2; guardianCount <= matchingGuardians.length; guardianCount++) {
                  for (const guardianSet of combinations(matchingGuardians, guardianCount)) {
                    const graphCells = [...coreCells, ...guardianSet];
                    if (graphCells.length > maxCells) continue;
                    tested += 1;
                    if (tested >= maxTests) { budgetReached = true; break outer; }
                    if (graphIsKColorable(graphCells, digits, cand)) continue;
                    const excluded = new Set(graphCells);
                    const eliminations = cellsSeeingAll(guardianSet, cand, excluded)
                      .filter(cell => (cand[cell] || []).includes(guardianDigit))
                      .map(cell => ({ cell, digit: guardianDigit }));
                    if (!eliminations.length) continue;
                    if (addResult(results, seen, {
                      tech: 'non-colourable-chromatic-graph-als',
                      name: 'Non-Colourable Chromatic Graph',
                      classification: 'Non-Colourable Chromatic Graph (Type 2 +x Guardians, one ALS DOF)',
                      source: 'ALS-DOF-0/1', type: '2a', k: digits.length, digits,
                      sectors: [...sectors], sectorNames: sectors.map(sector => unitNames[sector]),
                      cells: graphCells, coreCells, guardians: guardianSet, guardianDigit,
                      alsNodes: selectedNodes, edges: graphEdges(graphCells), eliminations,
                    }, maxResults)) break outer;
                  }
                }
              }
            }
          }
        }
      }
    }

    // A four-ALS chromatic graph: three DOF-0 ALSs plus one DOF-1 ALS.
    // This is intentionally a separate form from the guardian variants above.
    if (!budgetReached && minSectors <= 4 && maxSectors >= 4) {
      mixedDof:
      for (const sectors of combinations(sectorIndexes(options.unitType, alsRecords), 4)) {
        const allowedSectors = new Set(sectors);
        for (const zeroSectors of combinations(sectors, 3)) {
          const zeroGroups = zeroSectors.map(sector =>
            dofZero.filter(node => node.sector === sector));
          if (zeroGroups.some(group => !group.length)) continue;
          for (const zeroTriple of product(zeroGroups)) {
            const baseDigits = [...new Set(zeroTriple.flatMap(node => node.digits))]
              .sort((a, b) => a - b);
            if (baseDigits.length < minDigits || baseDigits.length + 1 > maxDigits) continue;
            const dofOneNodes = alsRecords.filter(node => node.dof === 1
              && allowedSectors.has(node.sector)
              && !zeroSectors.includes(node.sector)
              && node.digits.length === baseDigits.length + 1
              && baseDigits.every(digit => node.digits.includes(digit)));
            for (const dofOne of dofOneNodes) {
              const selectedNodes = [...zeroTriple, dofOne];
              const usedSectors = selectedNodes.map(node => node.sector);
              const digits = [...baseDigits].sort((a, b) => a - b);
              const extraDigit = dofOne.digits.find(digit => !baseDigits.includes(digit));
              if (extraDigit == null) continue;
              const guardians = [...new Set(dofOne.cells.filter(cell =>
                (cand[cell] || []).includes(extraDigit)))];
              const coreCells = [...new Set([
                ...zeroTriple.flatMap(node => node.cells),
                ...dofOne.cells.filter(cell => !guardians.includes(cell)),
              ])];
              if (!cellsFitGraphDigits(coreCells, digits, cand)) continue;
              if (guardians.length === 1) {
                const graphCells = [...new Set([...coreCells, ...guardians])];
                if (graphCells.length > maxCells) continue;
                tested += 1;
                if (tested >= maxTests) { budgetReached = true; break mixedDof; }
                if (graphIsKColorable(graphCells, digits, cand)) continue;
                const eliminations = guardians.flatMap(cell =>
                  (cand[cell] || []).filter(digit => digits.includes(digit))
                    .map(digit => ({ cell, digit })));
                if (addResult(results, seen, {
                  tech: 'non-colourable-chromatic-graph-als',
                  name: 'Non-Colourable Chromatic Graph',
                  classification: 'Non-Colourable Chromatic Graph (ALS 0x3 + ALS 1)',
                  source: 'ALS-DOF-0/1', type: 1, k: digits.length, digits,
                  sectors: usedSectors, sectorNames: usedSectors.map(sector => unitNames[sector]),
                  cells: graphCells, coreCells, guardians, extraDigit,
                  alsNodes: selectedNodes, edges: graphEdges(graphCells), eliminations,
                }, maxResults)) {
                  budgetReached = results.length >= maxResults;
                  break mixedDof;
                }
              } else if (guardians.length >= 2) {
                for (let guardianCount = 2; guardianCount <= guardians.length; guardianCount++) {
                  for (const guardianSet of combinations(guardians, guardianCount)) {
                    const graphCells = [...new Set([...coreCells, ...guardianSet])];
                    if (graphCells.length > maxCells) continue;
                    tested += 1;
                    if (tested >= maxTests) { budgetReached = true; break mixedDof; }
                    if (graphIsKColorable(graphCells, digits, cand)) continue;
                    const excluded = new Set(graphCells);
                    const eliminations = cellsSeeingAll(guardianSet, cand, excluded)
                      .filter(cell => (cand[cell] || []).includes(extraDigit))
                      .map(cell => ({ cell, digit: extraDigit }));
                    if (!eliminations.length) continue;
                    if (addResult(results, seen, {
                      tech: 'non-colourable-chromatic-graph-als',
                      name: 'Non-Colourable Chromatic Graph',
                      classification: 'Non-Colourable Chromatic Graph (Type 2 +x Guardians, one ALS DOF)',
                      source: 'ALS-DOF-0/1', type: '2a', k: digits.length, digits,
                      sectors: usedSectors, sectorNames: usedSectors.map(sector => unitNames[sector]),
                      cells: graphCells, coreCells, guardians: guardianSet, guardianDigit: extraDigit,
                      alsNodes: selectedNodes, edges: graphEdges(graphCells), eliminations,
                    }, maxResults)) {
                      budgetReached = results.length >= maxResults;
                      break mixedDof;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Type 2 can also be formed by two DOF-0 ALSs and two DOF-1 ALSs.
    // The two DOF-1 nodes must expose the same extra digit; those cells are
    // the guardians used for the peer-based elimination.
    if (!budgetReached && minSectors <= 4 && maxSectors >= 4) {
      mixedTwoDof:
      for (const sectors of combinations(sectorIndexes(options.unitType, alsRecords), 4)) {
        for (const zeroSectors of combinations(sectors, 2)) {
          const oneSectors = sectors.filter(sector => !zeroSectors.includes(sector));
          const zeroGroups = zeroSectors.map(sector => dofZero.filter(node => node.sector === sector));
          const oneGroups = oneSectors.map(sector => alsRecords.filter(node =>
            node.dof === 1 && node.sector === sector));
          if (zeroGroups.some(group => !group.length) || oneGroups.some(group => !group.length)) continue;
          for (const zeroNodes of product(zeroGroups)) {
            const baseDigits = [...new Set(zeroNodes.flatMap(node => node.digits))]
              .sort((a, b) => a - b);
            if (baseDigits.length < minDigits || baseDigits.length > maxDigits - 1) continue;
            for (const oneNodes of product(oneGroups)) {
              const sharedExtras = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(extra =>
                !baseDigits.includes(extra)
                &&
                oneNodes.every(node => node.digits.includes(extra))
                && oneNodes.every(node => baseDigits.every(digit => node.digits.includes(digit)))
                && oneNodes.every(node => node.digits.length === baseDigits.length + 1));
              for (const extraDigit of sharedExtras) {
                const guardiansByNode = oneNodes.map(node => node.cells.filter(cell =>
                  (cand[cell] || []).includes(extraDigit)));
                if (guardiansByNode.some(guardians => !guardians.length)) continue;
                const guardians = [...new Set(guardiansByNode.flat())];
                const coreCells = [...new Set([
                  ...zeroNodes.flatMap(node => node.cells),
                  ...oneNodes.flatMap(node => node.cells.filter(cell => !guardians.includes(cell))),
                ])];
                if (!cellsFitGraphDigits(coreCells, baseDigits, cand)) continue;
                const graphCells = [...new Set([...coreCells, ...guardians])];
                if (graphCells.length > maxCells) continue;
                tested += 1;
                if (tested >= maxTests) { budgetReached = true; break mixedTwoDof; }
                if (graphIsKColorable(graphCells, baseDigits, cand)) continue;
                const excluded = new Set(graphCells);
                const eliminations = cellsSeeingAll(guardians, cand, excluded)
                  .filter(cell => (cand[cell] || []).includes(extraDigit))
                  .map(cell => ({ cell, digit: extraDigit }));
                if (!eliminations.length) continue;
                const selectedNodes = [...zeroNodes, ...oneNodes];
                const usedSectors = selectedNodes.map(node => node.sector);
                if (addResult(results, seen, {
                  tech: 'non-colourable-chromatic-graph-als',
                  name: 'Non-Colourable Chromatic Graph',
                  classification: 'Non-Colourable Chromatic Graph (Type 2 +x Guardians, two ALS DOF)',
                  source: 'ALS-DOF-0/1', type: '2b', k: baseDigits.length, digits: baseDigits,
                  sectors: usedSectors, sectorNames: usedSectors.map(sector => unitNames[sector]),
                  cells: graphCells, coreCells, guardians, guardianGroups: guardiansByNode,
                  guardianDigit: extraDigit,
                  alsNodes: selectedNodes, edges: graphEdges(graphCells), eliminations,
                }, maxResults)) {
                  budgetReached = results.length >= maxResults;
                  break mixedTwoDof;
                }
              }
            }
          }
        }
      }
    }

    // Type 2C: one DOF-0 ALS plus three DOF-1 ALSs. Each DOF-1 node
    // contributes guardians for the same extra digit, and the elimination
    // requires a cell to see the complete three-node guardian set.
    if (!budgetReached && minSectors <= 4 && maxSectors >= 4) {
      mixedThreeDof:
      for (const sectors of combinations(sectorIndexes(options.unitType, alsRecords), 4)) {
        for (const zeroSectors of combinations(sectors, 1)) {
          const oneSectors = sectors.filter(sector => !zeroSectors.includes(sector));
          const zeroGroups = zeroSectors.map(sector => dofZero.filter(node => node.sector === sector));
          const oneGroups = oneSectors.map(sector => alsRecords.filter(node =>
            node.dof === 1 && node.sector === sector));
          if (zeroGroups.some(group => !group.length) || oneGroups.some(group => !group.length)) continue;
          for (const zeroNodes of product(zeroGroups)) {
            const baseDigits = [...new Set(zeroNodes.flatMap(node => node.digits))]
              .sort((a, b) => a - b);
            if (baseDigits.length < minDigits || baseDigits.length > maxDigits - 1) continue;
            for (const oneNodes of product(oneGroups)) {
              const sharedExtras = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(extra =>
                !baseDigits.includes(extra)
                && oneNodes.every(node => node.digits.includes(extra))
                && oneNodes.every(node => baseDigits.every(digit => node.digits.includes(digit)))
                && oneNodes.every(node => node.digits.length === baseDigits.length + 1));
              for (const extraDigit of sharedExtras) {
                const guardiansByNode = oneNodes.map(node => node.cells.filter(cell =>
                  (cand[cell] || []).includes(extraDigit)));
                if (guardiansByNode.some(guardians => !guardians.length)) continue;
                const guardians = [...new Set(guardiansByNode.flat())];
                const coreCells = [...new Set([
                  ...zeroNodes.flatMap(node => node.cells),
                  ...oneNodes.flatMap(node => node.cells.filter(cell => !guardians.includes(cell))),
                ])];
                if (!cellsFitGraphDigits(coreCells, baseDigits, cand)) continue;
                const graphCells = [...new Set([...coreCells, ...guardians])];
                if (graphCells.length > maxCells) continue;
                tested += 1;
                if (tested >= maxTests) { budgetReached = true; break mixedThreeDof; }
                if (graphIsKColorable(graphCells, baseDigits, cand)) continue;
                const excluded = new Set(graphCells);
                const eliminations = cellsSeeingAll(guardians, cand, excluded)
                  .filter(cell => (cand[cell] || []).includes(extraDigit))
                  .map(cell => ({ cell, digit: extraDigit }));
                if (!eliminations.length) continue;
                const selectedNodes = [...zeroNodes, ...oneNodes];
                const usedSectors = selectedNodes.map(node => node.sector);
                if (addResult(results, seen, {
                  tech: 'non-colourable-chromatic-graph-als',
                  name: 'Non-Colourable Chromatic Graph',
                  classification: 'Non-Colourable Chromatic Graph (Type 2C +x Guardians)',
                  source: 'ALS-DOF-0/1', type: '2c', k: baseDigits.length, digits: baseDigits,
                  sectors: usedSectors, sectorNames: usedSectors.map(sector => unitNames[sector]),
                  cells: graphCells, coreCells, guardians, guardianGroups: guardiansByNode,
                  guardianDigit: extraDigit,
                  alsNodes: selectedNodes, edges: graphEdges(graphCells), eliminations,
                }, maxResults)) {
                  budgetReached = results.length >= maxResults;
                  break mixedThreeDof;
                }
              }
            }
          }
        }
      }
    }

    // Distributed LS/ALS graphs use the existing generic peer-coloring walk,
    // then retain only graphs backed by the ALS/locked-set records from the
    // same sectors. This preserves overlapping guardian roles and supports
    // extensions from four through six sectors.
    if (!budgetReached && global.StormChromaticCore?.find) {
      const distributedReport = global.StormChromaticCore.find(cand, {
        unitType: options.unitType,
        minSectors: Math.max(4, minSectors),
        maxSectors: Math.min(6, maxSectors),
        minDigits,
        maxDigits,
        maxCells,
        maxResults,
      });
      for (const record of distributedReport.results || []) {
        const alsNodes = distributedAlsSupport(record, alsRecords);
        if (!alsNodes.length) continue;
        if (addResult(results, seen, {
          ...record,
          tech: 'non-colourable-chromatic-graph-als',
          name: 'Non-Colourable Chromatic Graph',
          classification: 'Non-Colourable Chromatic Graph (distributed LS/ALS)',
          source: 'LS/ALS-DISTRIBUTED',
          type: 'distributed',
          alsNodes,
        }, maxResults)) {
          budgetReached = true;
          break;
        }
      }
    }
    return {
      tech: 'non-colourable-chromatic-graph-als', results,
      stats: { alsRecords: alsRecords.length, alsDofZero: dofZero.length, tested,
        distributed: true, budgetReached, truncated: budgetReached || results.length >= maxResults },
    };
  }

  global.StormChromaticAlsCore = { find, graphIsKColorable };
}(typeof window !== 'undefined' ? window : globalThis));
