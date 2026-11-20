/* StormDoku pure chain classification helpers. */
(function installChainClassification(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function isTransportAlsXyRingShape(chain) {
    if (!chain?.isRing) return false;
    const nodes = new Set();
    const addNode = subset => {
      const cells = [...new Set(subset?.cells || [])].sort((a, b) => a - b);
      const digits = [...new Set(subset?.digits || [])].sort((a, b) => a - b);
      if (cells.length && digits.length) nodes.add(`${cells.join(',')}|${digits.join('')}`);
    };
    for (const step of chain.steps || []) {
      const bivalve = step?.family === 'SL' && Number(step.linkType) === 4
        && step.entry?.cells?.length === 1 && step.exit?.cells?.length === 1
        && step.entry.cells[0] === step.exit.cells[0];
      if (bivalve) addNode({
        cells: [...step.entry.cells, ...step.exit.cells],
        digits: [...(step.entry.digits || []), ...(step.exit.digits || [])],
      });
      if (step?.family === 'ALS' || step?.linkTypeName === 'ALS_RCC') {
        addNode(step.module?.entrySideSubset || step.module?.entrySubset);
        addNode(step.module?.exitSideSubset || step.module?.exitSubset);
      }
    }
    const isOrdinaryStrong = step => step?.family === 'SL'
      && Number(step.linkType) >= 0 && Number(step.linkType) <= 3
      && step.linkTypeName !== 'ALS';
    return nodes.size === 3 && chain.steps.filter(isOrdinaryStrong).length === 1;
  }

  function normalizedChainStructureName(chain) {
    if (isTransportAlsXyRingShape(chain)) return 'T-ALS-XY Ring';

    const existing = String(chain?.structureName || 'AIC').trim();
    // Worker records can retain the broad ALS prefix even though the folder
    // analyzer has already proved the logical ALS node count.  Resolve that
    // fallback from the actual module interfaces so the visible name and the
    // folder classification cannot disagree.
    if (/^ALS$/i.test(existing)) {
      const taggedNodes = new Set((chain?.steps || [])
        .flatMap(step => step?.alsNodeIds || [])
        .filter(id => id != null)
        .map(String));
      if (taggedNodes.size === 2) return 'ALS - XZ';
      if (taggedNodes.size === 3) return 'ALS - XY';
      if (taggedNodes.size > 3) return 'ALS - Chain';

      const nodes = new Set();
      for (const step of chain?.steps || []) {
        if (step?.family !== 'ALS') return existing;
        const subsets = [
          step.module?.entrySideSubset,
          step.module?.exitSideSubset,
          step.module?.entrySubset,
          step.module?.exitSubset,
        ].filter(Boolean);
        if (subsets.length !== 2) return existing;
        for (const subset of subsets) {
          const cells = [...new Set(subset.cells || [])].sort((a, b) => a - b);
          const digits = [...new Set(subset.digits || [])].sort((a, b) => a - b);
          if (cells.length && digits.length) nodes.add(`${cells.join(',')}|${digits.join('')}`);
        }
      }
      if (nodes.size === 2) return 'ALS - XZ';
      if (nodes.size === 3) return 'ALS - XY';
      if (nodes.size > 3) return 'ALS - Chain';
    }
    return existing;
  }

  function openXWingSubclass(chain) {
    if (chain?.isRing) return null;
    const steps = chain?.steps || [];
    if (steps.length !== 2 || steps.some(step => step.family !== 'SL')) return null;
    if (steps.some(step => step.linkType !== 0 && step.linkType !== 1)) return null;
    if (!steps.some(step => step.linkType === 0)
      || !steps.some(step => step.linkType === 1)) return null;

    const digits = new Set(steps.flatMap(step => [
      ...(step.entry?.digits || []),
      ...(step.exit?.digits || []),
      ...(step.weakDigit == null ? [] : [step.weakDigit]),
    ]));
    if (digits.size !== 1) return null;

    const kinds = steps.map(step => {
      const sectors = step.originSectors || [];
      return new Set(sectors.map(sector => sector < 9 ? 'R' : sector < 18 ? 'C' : 'B'));
    });
    const kind = ['R', 'C'].find(value => kinds.every(set => set.has(value)));
    if (!kind) return null;
    const linePosition = cell => kind === 'R' ? cell % 9 : Math.floor(cell / 9);
    const bilocal = steps.find(step => step.linkType === 0);
    const grouped = steps.find(step => step.linkType === 1);
    const basePositions = [...new Set([
      ...(bilocal.entry?.cells || []),
      ...(bilocal.exit?.cells || []),
    ].map(linePosition))].sort((a, b) => a - b);
    const groupedPositions = [...new Set([
      ...(grouped.entry?.cells || []),
      ...(grouped.exit?.cells || []),
    ].map(linePosition))].sort((a, b) => a - b);
    if (basePositions.length !== 2) return null;
    const aligned = basePositions.filter(position => groupedPositions.includes(position));
    if (aligned.length === 1) return 'Sashimi X-Wing';
    if (aligned.length === 2 && groupedPositions.length > 2) return 'Finned X-Wing';
    return null;
  }

  function moveKeys(chain, {
    chainUniqueDigitCount,
    isEriOnlyXChain,
    barnsChainInfo,
    barnsTransportChainInfo,
    alsSizeOneChainInfo,
    hiddenXyChainInfo,
  }) {
    const fullName = String(chain?.structureName || '');
    const name = fullName
      .replace(/^\s*(?:AIC\s*\+\s*ALS|ALS|AHS)\s*-\s*/i, '')
      .trim();
    const keys = new Set();

    if (/^(?:X-Chain|AIC)$/i.test(name)) {
      if (chainUniqueDigitCount(chain) === 1) keys.add('x-chain');
      else keys.add('aic-generic');
    }
    if (/^Empty Rectangle$/i.test(name)) keys.add('empty-rectangle');
    if (/^Dual Empty Rectangle$/i.test(name)) keys.add('dual-empty-rectangle');
    if (/^Rec'T Kite$/i.test(name)) keys.add('rect-kite');
    if (/^(?:Bridged ERI|Bridged Empty Rectangle)$/i.test(name)) keys.add('bridged-eri');
    if (/^3x ERI$/i.test(name)) keys.add('eri-chain');
    if (/^2-String Kite$/i.test(name)) keys.add('2-string-kite');
    if (/^Skyscraper$/i.test(name)) keys.add('skyscraper');
    if (/^X-Wing$/i.test(name)) keys.add('chain-x-wing');
    if (/^Finned X-Wing$/i.test(name)) keys.add('finned-x-wing');
    if (/^Sashimi X-Wing$/i.test(name)) keys.add('sashimi-x-wing');

    if (/^XY-Chain$/i.test(name)) keys.add('xy-chain');
    if (/^XY-Wing$/i.test(name)) keys.add('xy-wing');
    if (/^Remote Pair$/i.test(name)) keys.add('remote-pair');
    if (/^YZ Ring$/i.test(name)) keys.add('remote-pair');
    if (/^Hidden XY-Chain$/i.test(name)) keys.add('hidden-xy-chain');
    if (/^Hidden Remote Pair$/i.test(name)) keys.add('hidden-remote-pair');

    if (/^W-(?:Wing|Ring)$/i.test(name)) keys.add('w-wing');
    if (/^S-(?:Wing|Ring)$/i.test(name)) keys.add('s-wing');
    if (/^M(?:\(2\)|2)-(?:Wing|Ring)$/i.test(name)) keys.add('m2-wing');
    if (/^M(?:\(3\)|3)-(?:Wing|Ring)$/i.test(name)) keys.add('m3-wing');
    if (/^L(?:\(1\)|1)-(?:Wing|Ring)$/i.test(name)) keys.add('l1-wing');
    if (/^L(?:\(2\)|2)-(?:Wing|Ring)$/i.test(name)) keys.add('l2-wing');
    if (/^L(?:\(3\)|3)-(?:Wing|Ring)$/i.test(name)) keys.add('l3-wing');
    if (/^H(?:\(1\)|1)-(?:Wing|Ring)$/i.test(name)) keys.add('h1-wing');
    if (/^H(?:\(2\)|2)-(?:Wing|Ring)$/i.test(name)) keys.add('h2-wing');
    if (/^H(?:\(3\)|3)-(?:Wing|Ring)$/i.test(name)) keys.add('h3-wing');
    if (/^L-(?:Wing|Ring)$/i.test(name)) keys.add('l-named');
    if (/^M-(?:Wing|Ring)$/i.test(name)) keys.add('m-named');
    if (/^H-(?:Wing|Ring)$/i.test(name)) keys.add('h-named');
    if (/^Strong[- ](?:Wing|Ring)/i.test(name)) keys.add('strong-wing');
    if (/^i[SWMLH]/i.test(name)) keys.add('inversion');

    if (/^AIC\s*\+\s*ALS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName)
      || /^ALS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName)) keys.add('als-named');
    if (/^AHS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName)) keys.add('ahs-named');
    if (/^ALC\s*-\s*.+(?:Wing|Ring)$/i.test(fullName)) keys.add('alc-named');

    if (/^ALS\s*-\s*XZ$/i.test(fullName)) keys.add('als-xz');
    if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) keys.add('t-als-xz');
    if (/^ALS\s*-\s*XY$/i.test(fullName)) keys.add('als-xy');
    if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) keys.add('alc-xz');
    if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) keys.add('alc-xy');
    if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) keys.add('alc-chain');
    if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) keys.add('alc-dof');
    if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) keys.add('ahs-xz');
    if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) keys.add('ahs-xy');
    if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) keys.add('ahs-chain');
    if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) keys.add('t-als-xy');
    if (/^ALS\s*-\s*Chain$/i.test(fullName)) keys.add('als-chain');
    if (/AIC\s*\+\s*ALS/i.test(fullName)) keys.add('aic-als');

    if (isEriOnlyXChain(chain) && !keys.has('bridged-eri')) keys.add('eri-chain');

    const barns = barnsChainInfo(chain);
    const barnsTransport = barnsTransportChainInfo(chain);
    if (barns) keys.add('barns');
    if (barnsTransport && !keys.has('t-als-xz')) keys.add('barns-transport');

    const alsOne = alsSizeOneChainInfo(chain);
    if (alsOne) {
      if (alsOne.remotePair) keys.add('remote-pair');
      else if (alsOne.breakdown === 'XY-Wing') keys.add('xy-wing');
      else keys.add('xy-chain');
    }

    const hidden = hiddenXyChainInfo(chain);
    if (hidden) {
      keys.add('hidden-xy-chain');
      if (hidden.remotePair) keys.add('hidden-remote-pair');
    }

    return keys;
  }

  function complexityRank(chain, moduleSubsets = () => []) {
    let rank = 0;
    for (const step of chain?.steps || []) {
      if (step.family === 'ALS') {
        rank += moduleSubsets(step.module)
          .reduce((total, subset) => total + (subset.digits || []).length, 0);
      } else if (step.family === 'AHS') {
        rank += moduleSubsets(step.module)
          .reduce((total, subset) => total + (subset.cells || []).length, 0);
      }
    }
    if (chain?.alcXz) {
      rank += (chain.alcXz.als?.digits || []).length;
      rank += (chain.alcXz.ahs?.cells || []).length;
    }
    return rank || Number.POSITIVE_INFINITY;
  }

  function legacyTieKey(chain, {
    chainEriCount,
    isEriOnlyXChain,
    barnsChainInfo,
    barnsTransportChainInfo,
    alsSizeOneChainInfo,
    hiddenXyChainInfo,
  }) {
    const fullName = String(chain?.structureName || '');
    const name = fullName
      .replace(/^\s*(?:(?:AIC\s*\+\s*)?ALS|AHS)\s*-\s*/i, '')
      .trim();
    const barnsTransport = barnsTransportChainInfo(chain);
    const barns = barnsChainInfo(chain);
    if (barnsTransport) {
      return barnsTransport.sizeName.length <= 3
        ? 'barns-xyz-transport'
        : 'barns-wxyz-transport';
    }
    if (barns) return barns.sizeName.length === 3 ? 'barns' : 'barns-wxyz';

    if (isEriOnlyXChain(chain)) {
      const eriCount = chainEriCount(chain);
      if (eriCount === 3) return '3x-eri';
      if (eriCount === 4) return '4x-eri';
      if (eriCount > 4) return 'eri-chain-long';
    }

    const aicAlsNamed = /^AIC\s*\+\s*ALS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName);
    if (aicAlsNamed) return 'als-named';
    if (/^AIC\s*\+\s*ALS(?:\s*-\s*Chain)?$/i.test(fullName)) return 'aic-als';
    if (/^ALS\s*-\s*XZ$/i.test(fullName)) return 'als-xz';
    if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 't-als-xz';
    if (/^ALS\s*-\s*XY$/i.test(fullName)) return 'als-xy';
    if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'alc-xz';
    if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'alc-xy';
    if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-chain';
    if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-dof';
    if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xz';
    if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xy';
    if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'ahs-chain';
    if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 't-als-xy';
    if (/^ALS\s*-\s*Chain$/i.test(fullName)) return 'als-chain';
    if (/^ALS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'als-named';
    if (/^AHS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'ahs-named';
    if (/^ALC\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'alc-named';

    const alsSizeOne = alsSizeOneChainInfo(chain);
    if (alsSizeOne?.remotePair) return 'remote-pair';
    if (alsSizeOne?.breakdown === 'XY-Wing') return 'xy-wing';
    if (alsSizeOne) return 'xy-chain';

    const hiddenXy = hiddenXyChainInfo(chain);
    if (hiddenXy?.remotePair) return 'hidden-remote-pair';
    if (hiddenXy && chain.isRing) return 'hidden-xy-ring';
    if (hiddenXy) return 'hidden-xy-chain';

    if (/^X-Wing$/i.test(name)) return 'aic-x-wing';
    if (/^Skyscraper$/i.test(name)) return 'skyscraper';
    if (/^2-String Kite$/i.test(name)) return '2-string-kite';
    if (/^Finned X-Wing$/i.test(name)) return 'finned-x-wing';
    if (/^Sashimi X-Wing$/i.test(name)) return 'sashimi-x-wing';
    if (/(?:^|-\s*)Empty Rectangle$/i.test(name)) return 'empty-rectangle';
    if (/(?:^|-\s*)Dual Empty Rectangle$/i.test(name)) return 'dual-empty-rectangle';
    if (/(?:^|-\s*)Rec'T Kite$/i.test(name)) return 'rect-kite';
    if (/(?:^|-\s*)Bridged (?:ERI|Empty Rectangle)$/i.test(name)) return 'bridged-eri';
    if (/^XY-Wing$/i.test(name)) return 'xy-wing';
    if (/^L\(1\)-Wing$|^L1-Wing$/i.test(name)) return 'l1-wing';
    if (/^L\(2\)-Wing$|^L2-Wing$/i.test(name)) return 'l2-wing';
    if (/^L\(3\)-Wing$|^L3-Wing$/i.test(name)) return 'l3-wing';
    if (/^W-Wing|^W-Ring/i.test(name)) return 'w-wing';
    if (/Transport/i.test(name)) return 'w-transport';
    if (/^S-Wing|^S-Ring/i.test(name)) return 's-wing';
    if (/^M(?:\(\d+\))?-Wing|^M(?:\(\d+\))?-Ring/i.test(name)) return 'm-wing';
    if (/^H(?:\(\d+\))?-Wing|^H(?:\(\d+\))?-Ring/i.test(name)) return 'h-wing';

    const length = Number(chain?.length || chain?.steps?.length || 0);
    if (/^(?:X-Chain|AIC)(?:\s+\(Depth\s+\d+\))?$/i.test(name)) {
      if (length <= 2) return 'x-chain-2';
      if (length === 3) return 'x-chain-3';
      if (length === 4) return 'x-chain-4';
      return 'x-chain-long';
    }
    if (length === 4) return 'x-chain-4';
    if (length > 4) return 'x-chain-long';
    return 'x-chain-long';
  }

  function tieKey(chain, {
    chainEriCount,
    isEriOnlyXChain,
    barnsChainInfo,
    barnsTransportChainInfo,
    alsSizeOneChainInfo,
    hiddenXyChainInfo,
  }) {
    const fullName = String(chain?.structureName || '');
    const name = fullName.replace(/^\s*(?:(?:AIC\s*\+\s*)?ALS|AHS)\s*-\s*/i, '').trim();
    const barnsTransport = barnsTransportChainInfo(chain);
    const barns = barnsChainInfo(chain);
    if (barnsTransport) return barnsTransport.sizeName.length <= 3 ? 'barns-xyz-transport' : 'barns-wxyz-transport';
    if (barns) return barns.sizeName.length === 3 ? 'barns' : 'barns-wxyz';
    if (isEriOnlyXChain(chain)) {
      const eriCount = chainEriCount(chain);
      if (eriCount === 3) return '3x-eri';
      if (eriCount === 4) return '4x-eri';
      if (eriCount > 4) return 'eri-chain-long';
    }
    if (/^AIC\s*\+\s*ALS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName)) return 'als-named';
    if (/^AIC\s*\+\s*ALS(?:\s*-\s*Chain)?$/i.test(fullName)) return 'aic-als';
    if (/^ALS\s*-\s*XZ$/i.test(fullName)) return 'als-xz';
    if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 't-als-xz';
    if (/^ALS\s*-\s*XY$/i.test(fullName)) return 'als-xy';
    if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'alc-xz';
    if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'alc-xy';
    if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-chain';
    if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-dof';
    if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xz';
    if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xy';
    if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'ahs-chain';
    if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 't-als-xy';
    if (/^ALS\s*-\s*Chain$/i.test(fullName)) return 'als-chain';
    if (/^ALS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'als-named';
    if (/^AHS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'ahs-named';
    if (/^ALC\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'alc-named';

    const alsSizeOne = alsSizeOneChainInfo(chain);
    if (alsSizeOne?.remotePair) return 'remote-pair';
    if (/^YZ Ring$/i.test(name)) return 'remote-pair';
    if (alsSizeOne?.breakdown === 'XY-Wing') return 'xy-wing';
    if (alsSizeOne) return 'xy-chain';
    const hiddenXy = hiddenXyChainInfo(chain);
    if (hiddenXy?.remotePair) return 'hidden-remote-pair';
    if (hiddenXy && chain.isRing) return 'hidden-xy-ring';
    if (hiddenXy) return 'hidden-xy-chain';

    if (/^X-Wing$/i.test(name)) return 'aic-x-wing';
    if (/^Skyscraper$/i.test(name)) return 'skyscraper';
    if (/^2-String Kite$/i.test(name)) return '2-string-kite';
    if (/^Finned X-Wing$/i.test(name)) return 'finned-x-wing';
    if (/^Sashimi X-Wing$/i.test(name)) return 'sashimi-x-wing';
    if (/(?:^|-\s*)Empty Rectangle$/i.test(name)) return 'empty-rectangle';
    if (/(?:^|-\s*)Dual Empty Rectangle$/i.test(name)) return 'dual-empty-rectangle';
    if (/(?:^|-\s*)Rec'T Kite$/i.test(name)) return 'rect-kite';
    if (/(?:^|-\s*)Bridged (?:ERI|Empty Rectangle)$/i.test(name)) return 'bridged-eri';
    if (/^XY-Wing$/i.test(name)) return 'xy-wing';
    if (/^L\(1\)-Wing$|^L1-Wing$/i.test(name)) return 'l1-wing';
    if (/^L\(2\)-Wing$|^L2-Wing$/i.test(name)) return 'l2-wing';
    if (/^L\(3\)-Wing$|^L3-Wing$/i.test(name)) return 'l3-wing';
    if (/^W-Wing|^W-Ring/i.test(name)) return 'w-wing';
    if (/Transport/i.test(name)) return 'w-transport';
    if (/^S-Wing|^S-Ring/i.test(name)) return 's-wing';
    if (/^M(?:\(\d+\))?-Wing|^M(?:\(\d+\))?-Ring/i.test(name)) return 'm-wing';
    if (/^H(?:\(\d+\))?-Wing|^H(?:\(\d+\))?-Ring/i.test(name)) return 'h-wing';

    const length = Number(chain?.length || chain?.steps?.length || 0);
    if (/^(?:X-Chain|AIC)(?:\s+\(Depth\s+\d+\))?$/i.test(name)) {
      if (length <= 2) return 'x-chain-2';
      if (length === 3) return 'x-chain-3';
      if (length === 4) return 'x-chain-4';
    }
    if (length === 4) return 'x-chain-4';
    if (length > 4) return 'x-chain-long';
    return 'x-chain-long';
  }

  app.chainClassification = {
    isTransportAlsXyRingShape,
    normalizedChainStructureName,
    openXWingSubclass,
    moveKeys,
    complexityRank,
    tieKey,
    legacyTieKey,
  };
})(window);
