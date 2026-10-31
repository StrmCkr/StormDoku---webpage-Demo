/* StormDoku vantage SVG overlay presentation. */
(function installVantageOverlayRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, documentRef = global.document, orientedDisplayChainSteps,
    visibleChainExitSide, visibleChainEntrySide, isAlsVisualStep,
    moduleVisualSides, isAlmostFishVisualStep, drawVantageWeakConnection,
    drawVantageWeakConnections, drawVantageStrongConnection, drawVantageSideBoxes,
    vantageClosestAnchorPair, drawArc,
  }) {
    function renderChainOverlay(chain) {
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const steps = orientedDisplayChainSteps(chain.steps);

      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index];
        if (index > 0) {
          const fromSide = visibleChainExitSide(steps[index - 1]);
          const toSide = visibleChainEntrySide(step);
          drawVantageWeakConnection(
            svg,
            fromSide,
            toSide,
            step.weakFromDigit ?? step.weakDigit,
            step.weakToDigit ?? step.weakDigit,
          );
        }
        if (isAlsVisualStep(step) && step.module?.common) {
          const moduleSides = moduleVisualSides(step);
          const common = step.module.common;
          const weakDigits = common.restrictedDigits?.length
            ? common.restrictedDigits
            : (common.digits || []);
          drawVantageWeakConnections(svg, moduleSides.entry, moduleSides.exit, weakDigits);
        }
        if (!isAlsVisualStep(step) && !isAlmostFishVisualStep(step)) {
          drawVantageStrongConnection(svg, step.entry, step.exit);
        }
      }
      if (chain.isRing && steps.length) {
        drawVantageWeakConnection(
          svg,
          visibleChainExitSide(steps[steps.length - 1]),
          visibleChainEntrySide(steps[0]),
          chain.ringWeakFromDigit ?? chain.ringWeakDigit,
          chain.ringWeakToDigit ?? chain.ringWeakDigit,
        );
      }
      boardEl.appendChild(svg);
    }

    function renderStrongLinkOverlay(strongLink) {
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay strong-link-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const startSide = { cells: strongLink.activeCells || [], digits: strongLink.startingDigits || [] };
      const endSide = { cells: strongLink.linkedCells || [], digits: strongLink.linkDigits || [] };
      drawVantageSideBoxes(svg, startSide, 'strong-link-side-box strong-link-start-box');
      drawVantageSideBoxes(svg, endSide, 'strong-link-side-box strong-link-end-box');
      const pair = vantageClosestAnchorPair(startSide, endSide);
      if (pair) {
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, -.22);
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, .22);
      }
      boardEl.appendChild(svg);
    }

    return { renderChainOverlay, renderStrongLinkOverlay };
  }

  app.vantageOverlayRenderer = { create };
})(window);
