/* StormDoku ALS-DOF overlay presentation. */
(function installAlsDofOverlayRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, documentRef = global.document, drawArc,
    vantageClosestAnchorPair, groupedAnchorPair,
  }) {
    function render(record, vantage = false) {
      if (!record || !record.primaryA) return;
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay als-dof-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const hubSide = { cells: record.primaryA.cells || [], digits: record.primaryA.digits || [] };
      const anchorPair = vantage ? vantageClosestAnchorPair : groupedAnchorPair;
      const auxiliary = record.auxiliary || [];
      const center = (auxiliary.length - 1) / 2;
      const endpointSide = record.primaryC
        ? { cells: record.primaryC.cells || [], digits: record.primaryC.digits || [] }
        : null;
      if (record.chainForm === 'auxiliary-hub-path' && endpointSide) {
        const pathSides = [hubSide, ...auxiliary.map(node => ({
          cells: node.cells || [], digits: node.digits || [],
        })), endpointSide];
        for (let index = 0; index < pathSides.length - 1; index += 1) {
          const left = pathSides[index];
          const right = pathSides[index + 1];
          const bridgeList = index === 0
            ? auxiliary[0]?.pathPrevBridges || []
            : auxiliary[index - 1]?.pathNextBridges || [];
          const digits = bridgeList.map(bridge => bridge.digit).filter(digit => digit != null);
          const digitCenter = (digits.length - 1) / 2;
          for (const [digitIndex, digit] of digits.entries()) {
            const pair = anchorPair(left, right, digit, digit);
            if (!pair) continue;
            drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5,
              (index - (pathSides.length - 2) / 2) * 1.2 + (digitIndex - digitCenter) * .7);
          }
        }
        boardEl.appendChild(svg);
        return;
      }
      for (const [index, node] of auxiliary.entries()) {
        const side = { cells: node.cells || [], digits: node.digits || [] };
        const aBridgeDigits = (node.aBridges || []).map(bridge => bridge.digit).filter(digit => digit != null);
        const weakDigits = aBridgeDigits.length
          ? [...new Set(aBridgeDigits)]
          : node.rccDigits?.length ? node.rccDigits : [node.rccDigit ?? null].filter(digit => digit != null);
        const digitCenter = (weakDigits.length - 1) / 2;
        for (const [digitIndex, weakDigit] of weakDigits.entries()) {
          const pair = anchorPair(hubSide, side, weakDigit, weakDigit);
          if (!pair) continue;
          drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5,
            (index - center) * 1.2 + (digitIndex - digitCenter) * .7);
        }
        if (endpointSide) {
          const terminalDigits = (node.cBridges || []).map(bridge => bridge.digit).filter(digit => digit != null);
          const terminalCenter = (terminalDigits.length - 1) / 2;
          for (const [digitIndex, terminalDigit] of terminalDigits.entries()) {
            const pair = anchorPair(side, endpointSide, terminalDigit, terminalDigit);
            if (!pair) continue;
            drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5,
              (index - center) * 1.2 + (digitIndex - terminalCenter) * .7);
          }
        }
      }
      boardEl.appendChild(svg);
    }

    function renderHydra(record, vantage = false) {
      if (!record || !record.primaryA) return;
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay als-dof-overlay hydra-als-dof-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const hubSide = {
        cells: record.primaryA.cells || record.primaryA.alsAllCells || [],
        digits: record.primaryA.digits || record.primaryA.alsDigits || [],
      };
      const branchesById = new Map((record.auxiliary || []).map(node => [
        node.hydraParticipantId,
        { cells: node.cells || node.alsAllCells || [], digits: node.digits || node.alsDigits || [] },
      ]));
      for (const branch of record.hydraBranches || []) {
        const side = branchesById.get(branch.participantId);
        const digit = branch.rcc?.digit;
        if (!side || digit == null) continue;
        const pair = (vantage ? vantageClosestAnchorPair : groupedAnchorPair)(hubSide, side, digit, digit);
        if (pair) drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
      }
      boardEl.appendChild(svg);
    }

    return { render, renderHydra };
  }

  app.alsDofOverlayRenderer = { create };
})(window);
