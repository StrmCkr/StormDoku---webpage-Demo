/* StormDoku generic chain SVG overlay presentation. */
(function installChainOverlayRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, documentRef = global.document, orientedDisplayChainSteps,
    isModuleVisualStep, isAlmostFishVisualStep, drawAlmostFishOverlay,
    drawSideDigitBoxes, drawGroupedEndpointBox, visibleChainExitSide,
    visibleChainEntrySide, drawChainSectorFrames, drawDirectAlcContacts,
    drawWeakConnection, moduleVisualSides, drawAhsXzBridgeConnections,
    drawWeakConnections, drawStrongConnection,
  }) {
    function render(chain) {
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const steps = orientedDisplayChainSteps(chain.steps);
      const isPureXyChain = steps.length > 0
        && steps.every(step => step.family === 'SL' && Number(step.linkType) === 4);

      if (chain.ahsXy) {
        for (const [index, step] of steps.entries()) {
          const boxClass = index % 2
            ? 'strong-link-side-box strong-link-end-box'
            : 'strong-link-side-box strong-link-start-box';
          drawSideDigitBoxes(svg, step.entry, boxClass);
        }
        for (const bridge of chain.ahsXy.bridges || []) {
          if (bridge?.kind !== 'Position') continue;
          for (const pair of bridge.pairs || []) {
            if (!Array.isArray(pair) || pair.length < 2) continue;
            drawWeakConnection(svg,
              { cells: [pair[0]], digits: [bridge.digit] },
              { cells: [pair[1]], digits: [bridge.digit] });
          }
        }
        boardEl.appendChild(svg);
        return;
      }

      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index];
        drawAlmostFishOverlay(svg, step);
        if (!isModuleVisualStep(step) && !isPureXyChain) {
          if (index > 0) {
            drawSideDigitBoxes(svg, step.entry, 'strong-link-side-box strong-link-start-box');
          }
          if (index < steps.length - 1) {
            drawSideDigitBoxes(svg, step.exit, 'strong-link-side-box strong-link-end-box');
          }
        }
        if (!isModuleVisualStep(step) && !isPureXyChain) {
          if (index === 0) drawGroupedEndpointBox(svg, step.entry, 'strong-link-side-box strong-link-start-box');
          if (index === steps.length - 1) drawGroupedEndpointBox(svg, step.exit, 'strong-link-side-box strong-link-end-box');
        }
        if (index > 0) {
          const fromSide = visibleChainExitSide(steps[index - 1]);
          const toSide = visibleChainEntrySide(step);
          const weakFromDigit = step.weakFromDigit ?? step.weakDigit;
          const weakToDigit = step.weakToDigit ?? step.weakDigit;
          drawChainSectorFrames(svg, step.weakSectors);
          const drewDirectAlc = chain?.alcXz && steps.length === 2
            && drawDirectAlcContacts(svg, chain, fromSide, toSide);
          if (!drewDirectAlc) {
            drawWeakConnection(svg, fromSide, toSide, weakFromDigit, weakToDigit, true);
          }
        }
        if (isModuleVisualStep(step) && step.module?.common) {
          const moduleSides = moduleVisualSides(step);
          const common = step.module.common;
          const drewAhsBridge = step.family === 'AHS'
            && drawAhsXzBridgeConnections(svg, step);
          if (!drewAhsBridge) {
            const weakDigits = common.restrictedDigits?.length
              ? common.restrictedDigits : (common.digits || []);
            drawWeakConnections(svg, moduleSides.entry, moduleSides.exit, weakDigits);
          }
        }
        if (!isModuleVisualStep(step) && !isAlmostFishVisualStep(step)) {
          drawStrongConnection(svg, step.entry, step.exit, true);
        }
      }

      if (chain.isRing && steps.length) {
        const ringFrom = visibleChainExitSide(steps[steps.length - 1]);
        const ringTo = visibleChainEntrySide(steps[0]);
        if (!(chain?.alcXz && steps.length === 2)) {
          drawWeakConnection(svg, ringFrom, ringTo,
            chain.ringWeakFromDigit ?? chain.ringWeakDigit,
            chain.ringWeakToDigit ?? chain.ringWeakDigit);
        }
      }
      boardEl.appendChild(svg);
    }

    return { render };
  }

  app.chainOverlayRenderer = { create };
})(window);
