/* StormDoku XY and hidden-XY classification helpers. */
(function installXyInfo(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ chainModuleSubsets, core }) {
    function alsSizeOneChainInfo(chain) {
      const steps = chain.steps || [];
      if (!steps.length) return null;
      if (!steps.every(step =>
        step.family === 'SL' && Number(step.linkType) === 4
      )) return null;

      const nodes = [];
      const seen = new Set();
      for (const step of steps) {
        const isBivalent = step.family === 'SL'
          && Number(step.linkType) === 4
          && step.entry?.cells?.length === 1
          && step.exit?.cells?.length === 1
          && step.entry.cellKey === step.exit.cellKey;
        if (isBivalent) {
          const cell = step.entry.cells[0];
          const digits = [...new Set([
            ...(step.entry.digits || []),
            ...(step.exit.digits || []),
          ])].sort((a, b) => a - b);
          const key = `BIVALENT|${cell}|${digits.join('')}`;
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push({ cells: [cell], digits });
          }
          continue;
        }

        if (step.family !== 'ALS'
          || String(step.linkTypeName || '').toUpperCase() !== 'ALS_RCC') return null;
        for (const subset of chainModuleSubsets(step.module)) {
          if (!subset) return null;
          const key = [
            subset.id ?? '',
            (subset.cells || []).join(','),
            (subset.digits || []).join(''),
          ].join('|');
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push(subset);
          }
        }
      }

      if (!nodes.length || nodes.some(node => node.cells.length !== 1)) return null;

      const nodeDigits = nodes.map(node => [...node.digits].sort((a, b) => a - b));
      const pureType4 = steps.every(step =>
        step.family === 'SL' && Number(step.linkType) === 4
      );
      const remotePair = pureType4 && nodeDigits.every(digits =>
        digits.length === 2
        && digits.join(',') === nodeDigits[0].join(',')
      );
      const breakdown = remotePair
        ? 'Remote Pair'
        : nodes.length === 3
          ? 'XY-Wing'
          : 'XY-Chain';
      const allBivalve = nodeDigits.every(digits => digits.length === 2);

      return {
        breakdown,
        remotePair,
        nodeCount: nodes.length,
        allBivalve,
        subclass: chain.isRing ? 'Ring' : null,
      };
    }

    function hiddenXyChainInfo(chain) {
      const steps = chain.steps || [];
      if (steps.length < 2 || !steps.every(step =>
        step.family === 'SL' && step.linkType === core.BILOCAL
      )) return null;

      const linkDigits = steps.map(step => {
        const digits = new Set([
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
        ]);
        return digits.size === 1 ? [...digits][0] : null;
      });
      if (linkDigits.some(digit => !Number.isInteger(digit))) return null;

      const uniqueDigits = new Set(linkDigits);
      if (uniqueDigits.size < 2) return null;
      const alternates = uniqueDigits.size === 2
        && linkDigits.every((digit, index) => index === 0 || digit !== linkDigits[index - 1])
        && (!chain.isRing || linkDigits[0] !== linkDigits[linkDigits.length - 1]);

      return {
        remotePair: alternates,
        form: chain.isRing ? 'Ring' : 'Wing',
      };
    }

    return { alsSizeOneChainInfo, hiddenXyChainInfo };
  }

  app.chainXyInfo = { create };
})(window);
