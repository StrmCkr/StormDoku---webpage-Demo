/* Multi-digit fish: cell truths covered by sector-digit constraints. */
(function (global) {
  'use strict';
  const core = global.StormDoku;
  const cellName = id => `r${Math.floor(id / 9) + 1}c${id % 9 + 1}`;
  // Reuse the solver's canonical sector table when the browser/worker has
  // loaded it. The fallback keeps this core independently testable.
  const houses = core.UNITS
    ? core.UNITS.map(unit => [...unit])
    : Array.from({length:27}, (_, h) => Array.from({length:9}, (_, p) =>
      h < 9 ? h * 9 + p : h < 18 ? p * 9 + h - 9 :
        Math.floor((h - 18) / 3) * 27 + (h - 18) % 3 * 3 + Math.floor(p / 3) * 9 + p % 3));
  const cellHouses = Array.from({length:81}, (_, id) => houses
    .map((unit, house) => unit.includes(id) ? house : -1)
    .filter(house => house >= 0));
  const normalize = grid => (Array.isArray(grid[0]?.[0]) ? grid.flat() : grid)
    .map(values => values.length > 1 ? [...values] : []);
  const sector = h => ({kind:h < 9 ? 'row' : h < 18 ? 'column' : 'box', index:h % 9});
  const sectorName = h => `${h < 9 ? 'r' : h < 18 ? 'c' : 'b'}${h % 9 + 1}`;
  // Geometry is independent of the candidate grid. Build it once and reuse
  // it across searches; only candidate masks remain search-specific.
  const geometryCombinations=new Map(), geometryCells=new Map();
  function sectorCombinations(families,size,requireEach=false){
    const key=`${families.join(',')}:${size}:${requireEach}`;
    if(geometryCombinations.has(key)) return geometryCombinations.get(key);
    const selectedHouses=families.flatMap(f=>Array.from({length:9},(_,i)=>f*9+i));
    const out=[];
    function walk(start,chosen,mask){
      if(chosen.length===size){
        if(!requireEach || mask===((1<<families.length)-1)) out.push(chosen);
        return;
      }
      for(let i=start;i<=selectedHouses.length-(size-chosen.length);i++){
        const house=selectedHouses[i], bit=families.indexOf(Math.floor(house/9));
        walk(i+1,[...chosen,house],mask|(bit<0?0:1<<bit));
      }
    }
    walk(0,[],0);
    geometryCombinations.set(key,out);
    return out;
  }
  function unionGeometry(sectors){
    const key=sectors.slice().sort((a,b)=>a-b).join(',');
    if(geometryCells.has(key)) return geometryCells.get(key);
    const cells=[...new Set(sectors.flatMap(h=>houses[h]))].sort((a,b)=>a-b);
    geometryCells.set(key,cells);
    return cells;
  }

  function greedyCellName(ids) {
    const unique = [...new Set(ids)].sort((a,b)=>a-b);
    if (typeof core.cellGroupName === 'function') return core.cellGroupName(unique);
    return unique.map(cellName).join(',');
  }

  function compareResults(a, b) {
    return a.ns - b.ns
      || a.dc - b.dc
      || a.rank - b.rank
      || a.eliminations.length - b.eliminations.length
      || a.cellIds.join(',').localeCompare(b.cellIds.join(','))
      || a.links.map(x => x.id).join('|').localeCompare(b.links.map(x => x.id).join('|'));
  }

  // Every base cell requires one truth. Each selected cover admits at most
  // one truth. An assumed candidate consumes its covers and (if internal)
  // its cell; a deficit in the remaining cover capacity proves it false.
  function evaluate(grid, cells, covers, searchData = null) {
    const base = new Set(cells), counts = Array.from({length:81}, () => new Uint8Array(10));
    covers = [...new Map(covers.map(x => [`${x.house}:${x.digit}`, x])).values()];
    for (const {house, digit} of covers) {
      const candidates = searchData?.digitSectorCells?.[digit - 1]?.[house]
        || houses[house].filter(id => grid[id].includes(digit));
      for (const id of candidates) counts[id][digit]++;
    }
    if (cells.some(id => !grid[id].length || grid[id].some(d => !counts[id][d]))) return null;
    const rank = covers.length - cells.length;
    if (rank < 0) return null;
    const eliminations = [];
    for (let id=0; id<81; id++) for (const digit of grid[id]) {
      if (counts[id][digit] > rank + (base.has(id) ? 1 : 0)) {
        eliminations.push({r:Math.floor(id/9), c:id%9, digit});
      }
    }
    if (!eliminations.length) return null;
    const grouped = new Map();
    for (const {house, digit} of covers) {
      if (!grouped.has(house)) grouped.set(house, []);
      grouped.get(house).push(digit);
    }
    const links = [...grouped].sort((a,b)=>a[0]-b[0]).map(([h, digits]) => ({
      id:`${h}:${digits.sort((a,b)=>a-b).join('')}`, house:h, kind:'Cover', sector:sector(h), digits,
      cellIds:houses[h].filter(id => base.has(id) && grid[id].some(d=>digits.includes(d))),
      coverCellIds:houses[h].slice(),
    }));
    const coverCells = [...new Set(links.flatMap(link => link.coverCellIds))].sort((a,b)=>a-b);
    const coverAtoms = [];
    for (const link of links) for (const id of link.coverCellIds) {
      for (const digit of link.digits) if (grid[id].includes(digit)) coverAtoms.push(`${id}:${digit}`);
    }
    const coverKinds=new Set(covers.map(({house})=>house < 9 ? 'row' : house < 18 ? 'column' : 'box'));
    const model=rank===1 ? 'MS-AHS'
      : rank===0 && coverKinds.has('box') ? 'MS-LS'
      : rank===0 ? 'MS-NS' : 'MSLS';
    return {className:rank ? 'Almost Naked Set' : 'Naked Set', form:'Multi-digit Fish', model, rank,
      ns:cells.length, dc:covers.length, hs:counts.filter(x=>x.some(n=>n>0)).length,
      cellIds:[...cells].sort((a,b)=>a-b), baseCellIds:[...cells].sort((a,b)=>a-b),
      coverCellIds:coverCells, coverAtoms, links, eliminations, safetyFlags:[]};
  }

  function findMsls(input, options={}) {
    const grid=normalize(input), results=[], seen=new Set(), tested=new Set(), cache=new Map();
    const digitSectorCells=Array.from({length:9},(_,digit)=>houses.map(unit=>
      unit.filter(id=>grid[id].includes(digit+1))));
    const sectorCombinationCells=new Map();
    const unionCells=sectors=>{
      const key=`u:${sectors.slice().sort((a,b)=>a-b).join(',')}`;
      if(sectorCombinationCells.has(key)) return sectorCombinationCells.get(key);
      const cells=unionGeometry(sectors);
      sectorCombinationCells.set(key,cells);
      return cells;
    };
    const intersectCells=(left,right)=>{
      const key=`i:${left.slice().sort((a,b)=>a-b).join(',')}/${right.slice().sort((a,b)=>a-b).join(',')}`;
      if(sectorCombinationCells.has(key)) return sectorCombinationCells.get(key);
      const rightSet=new Set(right), cells=left.filter(id=>rightSet.has(id));
      sectorCombinationCells.set(key,cells);
      return cells;
    };
    const bitCount=mask=>{
      let count=0;
      while(mask){ mask&=mask-1n; count++; }
      return count;
    };
    const searchData={digitSectorCells};
    const maxStates=options.maxStates ?? 2000000, maxResults=options.maxResults ?? 5000;
    const maxCells=options.maxCells ?? 81, maxLinks=options.maxLinks ?? 81;
    const maxK=options.maxK ?? 1, maxBaseSectors=options.maxBaseSectors ?? 3;
    const maxCoverSectors=options.maxCoverSectors ?? maxBaseSectors;
    const allowMixedCovers=options.mixedCovers !== false;
    const minBaseSectors=Math.max(1,Math.min(maxBaseSectors,options.minBaseSectors ?? 1));
    const minCoverSectors=Math.max(1,Math.min(maxCoverSectors,options.minCoverSectors ?? 1));
    let states=0, truncated=false;
    function budget() {
      if (states >= maxStates || results.length >= maxResults) { truncated=true; return false; }
      states++; return true;
    }
    function minimumCover(ids, digit) {
      const key=ids.join(',');
      if (cache.has(key)) return cache.get(key);
      const masks=new Map();
      ids.forEach((id,i)=>cellHouses[id].forEach(h=>masks.set(h,(masks.get(h)||0n)|(1n<<BigInt(i)))));
      let best=Array.from(new Set(ids.map(id=>Math.floor(id/9))));
      if (options.fastCover && ids.length>=10) {
        best=[];
        let left=(1n<<BigInt(ids.length))-1n;
        while (left) {
          let chosen=null, gainBest=0;
          for (const [house, mask] of masks) {
            const gain=mask & left;
            const gainCount=bitCount(gain);
            if (gainCount>gainBest) { chosen=house; gainBest=gainCount; }
          }
          if (chosen===null) break;
          best.push(chosen);
          left &= ~masks.get(chosen);
        }
      }
      let alternatives=new Map([[best.join(','),best]]);
      function walk(left, chosen) {
        if (!left) {
          if(chosen.length<best.length) { best=chosen; alternatives=new Map(); }
          if(chosen.length===best.length) alternatives.set([...chosen].sort((a,b)=>a-b).join(','),chosen);
          return;
        }
        if(chosen.length>=best.length || !budget()) return;
        let i=0; while (!(left & (1n<<BigInt(i)))) i++;
        for (const h of cellHouses[ids[i]]) walk(left & ~masks.get(h), [...chosen,h]);
      }
      walk((1n<<BigInt(ids.length))-1n, []);
      const choices=[...alternatives.values()];
      if (!truncated) cache.set(key,choices);
      return choices;
    }
    function record(cells, covers) {
      if (covers.length>maxLinks) return;
      const result=evaluate(grid,cells,covers,searchData);
      if (!result || result.rank>maxK) return;
      const key=cells.join(',')+'|'+result.links.map(x=>x.id).join('|');
      if (!seen.has(key)) { seen.add(key); results.push(result); }
    }
    function inspect(cells) {
      cells=[...new Set(cells)].filter(id=>grid[id].length).sort((a,b)=>a-b);
      if(cells.length<2 || cells.length>maxCells) return;
      const key=cells.join(','); if(tested.has(key)) return; tested.add(key);
      if(!budget()) return;
      // Reject intersections whose greedy per-digit cover count already
      // exceeds the allowed rank. This avoids spending the exact-cover
      // search budget on cores that cannot become MSLS proofs.
      let quickLinks=0;
      for(let d=1;d<=9;d++) {
        const ids=cells.filter(id=>grid[id].includes(d));
        if(!ids.length) continue;
        let left=(1n<<BigInt(ids.length))-1n, count=0;
        const masks=new Map();
        ids.forEach((id,i)=>cellHouses[id].forEach(h=>masks.set(h,(masks.get(h)||0n)|(1n<<BigInt(i)))));
        while(left) {
          let best=0n;
          for(const mask of masks.values()) {
            const gain=mask & left;
            if(bitCount(gain) > bitCount(best)) best=gain;
          }
          if(!best) { quickLinks=maxLinks+1; break; }
          left &= ~best; count++;
        }
        quickLinks += count;
        if(quickLinks>cells.length+maxK) return;
      }
      const covers=[], choices=[];
      for(let d=1;d<=9;d++) {
        const ids=cells.filter(id=>grid[id].includes(d));
        if(ids.length) {
          const variants=minimumCover(ids,d).map(hs=>hs.map(h=>({house:h,digit:d})));
          choices.push(variants); covers.push(...variants[0]);
        }
        if(truncated) return;
      }
      if(covers.length>cells.length+maxK || covers.length<cells.length) return;
      function combine(i, selected) {
        if(!budget()) return;
        if(i===choices.length) { record(cells,selected); return; }
        for(const choice of choices[i]) { combine(i+1,[...selected,...choice]); if(truncated) return; }
      }
      combine(0,[]);
      // Equivalent row/column/box covers can yield different eliminations.
      for(let i=0;i<covers.length;i++) {
        const current=covers[i];
        const support=cells.filter(id=>grid[id].includes(current.digit) && houses[current.house].includes(id));
        for(const h of cellHouses[support[0]]) {
          if(h===current.house || !support.every(id=>houses[h].includes(id))) continue;
          record(cells,covers.map((x,j)=>j===i?{house:h,digit:x.digit}:x));
        }
      }
    }
    if (options.baseCellSets) for (const cells of options.baseCellSets) { inspect(cells); if(truncated) break; }
    else {
      // Breadth by base-sector count. Removing a cell permits incomplete and
      // irregular cores; selected cells need not form a filled rectangle.
      // Full base-sector unions remain useful for the smaller classic forms;
      // when the four-sector search is enabled, prioritize the intersection
      // model below so its larger MSLS cores are not starved by this pass.
      const classicMax = maxBaseSectors >= 4 ? 0 : Math.min(3,maxBaseSectors);
      for(let size=minBaseSectors;size<=classicMax && !truncated;size++) {
        for(let family=0;family<3 && !truncated;family++) {
          for(const selected of sectorCombinations([family],size)) {
            if(truncated) break;
            const cells=unionCells(selected).filter(id=>grid[id].length);
            inspect(cells);
            if ((options.maxRemovedCells ?? 1)>0) for(let i=0;i<cells.length && !truncated;i++) inspect(cells.filter((_,j)=>j!==i));
          }
        }
      }
      // Multifish/MSLS cores can be the intersection of base sectors with a
      // second sector family. The cover sectors are still discovered by the
      // normal minimum-cover pass, so this only supplies the candidate core.
      const intersectionMin = maxBaseSectors >= 4 ? minBaseSectors : maxBaseSectors + 1;
      const baseSizes = Array.from({length: Math.max(0, maxBaseSectors - intersectionMin + 1)}, (_, i) => intersectionMin + i)
        .sort((a,b) => b - a);
      for(const baseSize of baseSizes) {
        if (truncated) break;
        for(let baseFamily=0;baseFamily<3 && !truncated;baseFamily++) {
          function chooseBase(start, selectedBase) {
            if(truncated) return;
            if(selectedBase.length===baseSize) {
              const baseCells=new Set(unionGeometry(selectedBase));
              const baseCellList=[...baseCells];
              const baseIntersection=selectedCover =>
                intersectCells(baseCellList,unionCells(selectedCover));
              for(let coverFamily=0;coverFamily<3 && !truncated;coverFamily++) {
                if(coverFamily===baseFamily) continue;
                for(let coverSize=maxCoverSectors;coverSize>=minCoverSectors && !truncated;coverSize--) {
                  const coverCandidates=sectorCombinations([coverFamily],coverSize).map(selectedCover=>({
                    selectedCover,
                    cells:baseIntersection(selectedCover).filter(id=>grid[id].length),
                  })).filter(item=>item.cells.length>=2 && item.cells.length<=maxCells)
                    .sort((a,b)=>a.cells.length-b.cells.length);
                  for(const candidate of coverCandidates) {
                    if(truncated) break;
                    const selectedCover=candidate.selectedCover, cells=candidate.cells;
                    inspect(cells);
                    if ((options.maxRemovedCells ?? 1)>0) {
                      for (let i=0;i<cells.length && !truncated;i++) {
                        inspect(cells.filter((_,j)=>j!==i));
                      }
                    }
                  }
                }
              }
              if (allowMixedCovers && maxCoverSectors >= 2) {
                const mixedFamilies=[0,1,2].filter(f=>f!==baseFamily);
                for(let coverSize=maxCoverSectors;coverSize>=Math.max(2,minCoverSectors) && !truncated;coverSize--) {
                  const coverCandidates=sectorCombinations(mixedFamilies,coverSize,true).map(selectedCover=>({
                    selectedCover,
                    cells:baseIntersection(selectedCover).filter(id=>grid[id].length),
                  })).filter(item=>item.cells.length>=2 && item.cells.length<=maxCells)
                    .sort((a,b)=>a.cells.length-b.cells.length);
                  for(const candidate of coverCandidates) {
                    if(truncated) break;
                    const cells=candidate.cells;
                    inspect(cells);
                  }
                }
              }
              return;
            }
            const end=baseFamily*9+9;
            for(let h=start;h<end && !truncated;h++) chooseBase(h+1,[...selectedBase,h]);
          }
          chooseBase(baseFamily*9,[]);
        }
      }
    }
    results.sort(compareResults);
    return {results, stats:{links:cache.size, results:results.length, states, cores:tested.size, truncated}};
  }
  function formatMsls(result) {
    const links=result.links.map(x=>`${x.digits.join('')}${sectorName(x.house ?? (x.sector.kind === 'row' ? x.sector.index : x.sector.kind === 'column' ? 9 + x.sector.index : 18 + x.sector.index))}`).join(', ');
    const cells = greedyCellName(result.baseCellIds || result.cellIds || []);
    const name=result.model || 'MSLS';
    return `${name} ${result.ns} x ${result.dc} (rank ${result.rank}): ${result.ns} Cells ${cells}; ${result.dc} Links ${links} => ${result.eliminations.map(x=>`${cellName(x.r*9+x.c)}<>${x.digit}`).join(', ')}`;
  }
  function findMsAhs(input, options={}) {
    const report=findMsls(input, options);
    return {...report, results:report.results.map(result=>({...result, model:'MS-AHS'}))};
  }
  core.findMsls=findMsls;
  core.findMsAhs=findMsAhs;
  core.formatMsls=formatMsls;
  core.evaluateMslsCovers=(grid,cells,covers)=>evaluate(normalize(grid),cells,covers);
})(globalThis);

