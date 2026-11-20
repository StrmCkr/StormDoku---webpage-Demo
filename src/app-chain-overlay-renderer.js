/* StormDoku generic chain SVG overlay presentation. */
(function installChainOverlayRenderer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    boardEl, documentRef = global.document, orientedDisplayChainSteps,
    isModuleVisualStep, isAlmostFishVisualStep, drawAlmostFishOverlay,
    drawSideDigitBoxes, drawGroupedEndpointBox, visibleChainExitSide,
    visibleChainEntrySide, drawChainSectorFrames, digitAnchor, drawArc,
    sideAnchors, digitBoundsFromAnchors, resolvedWeakDigits,
    moduleVisualSides, crossDigitAnchorPair, groupedAnchorPair,
    drawStrongConnection,
  }) {
    function drawWeakConnection(
      svg,
      fromSide,
      toSide,
      weakFromDigit = null,
      weakToDigit = weakFromDigit,
      allowMissing = false,
      forcing = false,
    ) {
      ({ fromDigit: weakFromDigit, toDigit: weakToDigit } = resolvedWeakDigits(
        fromSide, toSide, weakFromDigit, weakToDigit,
      ));
      const pair = groupedAnchorPair(
        fromSide,
        toSide,
        weakFromDigit,
        weakToDigit,
        allowMissing,
      );
      if (!pair) return;
      for (const [side, digit, anchor] of [
        [fromSide, weakFromDigit, pair.from],
        [toSide, weakToDigit, pair.to],
      ]) {
        if (digit == null) continue;
        const box = digitBoundsFromAnchors(sideAnchors(side, digit, !allowMissing));
        if (!box) continue;
        const rect = documentRef.createElementNS('http://www.w3.org/2000/svg', 'rect');
        for (const [name, value] of Object.entries({x: box.left, y: box.top,
          width: Math.max(.9, box.right - box.left), height: Math.max(.9, box.bottom - box.top), rx: .2})) rect.setAttribute(name, String(value));
        rect.setAttribute('class', 'strong-link-side-box ' + (forcing
          ? side === fromSide ? 'uniqueness-forcing-on-box' : 'uniqueness-forcing-off-box'
          : 'strong-link-start-box'));
        svg.appendChild(rect);
        anchor.x = (box.left + box.right) / 2;
        anchor.y = (box.top + box.bottom) / 2;
      }
      drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
    }

    function drawWeakConnections(svg, fromSide, toSide, weakDigits = []) {
      const digits = [...new Set((Array.isArray(weakDigits) ? weakDigits : [weakDigits])
        .filter(digit => digit != null))];
      if (!digits.length) {
        drawWeakConnection(svg, fromSide, toSide);
        return;
      }

      const center = (digits.length - 1) / 2;
      for (let index = 0; index < digits.length; index += 1) {
        const pair = groupedAnchorPair(fromSide, toSide, digits[index]);
        if (!pair) continue;
        drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, (index - center) * 1.1);
      }
    }

    function drawAhsXzBridgeConnections(svg, step) {
      const module = step.module;
      const bridgeCells = module?.rccBridgeCells || [];
      if (!bridgeCells.length) return false;
      const entryMap = module.entrySideRccDigitsByCell || {};
      const exitMap = module.exitSideRccDigitsByCell || {};
      const moduleSides = moduleVisualSides(step);
      const digitsIn = value => (Array.isArray(value) ? value : [value])
        .flatMap(item => String(item ?? '').match(/[1-9]/g) || [])
        .map(Number);
      const digitsFor = map => [...new Set(bridgeCells.flatMap(cell =>
        digitsIn(map[cell] || map[String(cell)])))];
      const entryDigits = digitsFor(entryMap);
      const exitDigits = digitsFor(exitMap);
      if (!entryDigits.length && !exitDigits.length) return false;
      const entryBridge = { cells: bridgeCells, digits: entryDigits };
      const exitBridge = { cells: bridgeCells, digits: exitDigits };
      const entryPair = crossDigitAnchorPair(
        moduleSides.entry,
        entryBridge,
        moduleSides.entry?.digits,
        entryDigits,
      );
      const exitPair = crossDigitAnchorPair(
        exitBridge,
        moduleSides.exit,
        exitDigits,
        moduleSides.exit?.digits,
      );
      if (entryPair) drawArc(svg, entryPair.from, entryPair.to, 'chain-weak-line', -4.5, 0);
      if (exitPair) drawArc(svg, exitPair.from, exitPair.to, 'chain-weak-line', -4.5, 0);
      return !!(entryPair || exitPair);
    }

    function drawDirectAlcContacts(svg, chain, fromSide, toSide, reverse = false) {
      const contacts = chain?.alcXz?.contacts || [];
      if (!contacts.length) return false;
      const fromCells = new Set(fromSide?.cells || []);
      const toCells = new Set(toSide?.cells || []);
      let drawn = false;
      contacts.forEach((contact, index) => {
        const candidates = (contact.pairs || [])
          .map(pair => reverse ? [pair[1], pair[0]] : pair)
          .filter(pair => fromCells.has(pair[0]) && toCells.has(pair[1])
            && (fromSide?.digitsByCell?.[String(pair[0])] || fromSide?.digits || [])
              .includes(Number(contact.digit))
            && (toSide?.digitsByCell?.[String(pair[1])] || toSide?.digits || [])
              .includes(Number(contact.digit)));
        if (!candidates.length) return;
        const pair = candidates[0];
        const from = digitAnchor(pair[0], Number(contact.digit));
        const to = digitAnchor(pair[1], Number(contact.digit));
        if (!from || !to) return;
        drawArc(svg, from, to, 'chain-weak-line', -4.5, (index - (contacts.length - 1) / 2) * 1.1);
        drawn = true;
      });
      return drawn;
    }

    function render(chain) {
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const steps = orientedDisplayChainSteps(chain.steps);
      const isPureXyChain = steps.length > 0
        && steps.every(step => step.family === 'SL' && Number(step.linkType) === 4);
      if (steps.length) {
        const digits = [...new Set((chain.eliminations || []).map(item => item.digit))];
        for (const [step, side, className] of [
          [steps[0], visibleChainEntrySide(steps[0]), 'strong-link-side-box strong-link-start-box'],
          [steps[steps.length - 1], visibleChainExitSide(steps[steps.length - 1]), 'strong-link-side-box strong-link-end-box'],
        ]) {
          if (step.family === 'ALS') drawSideDigitBoxes(svg, side, className, null, digits);
        }
      }

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

    function renderWeakLinks(links = []) {
      const usable = links.filter(link => link?.digit != null
        && link.leftCells?.length && link.rightCells?.length);
      if (!usable.length) return;
      const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      for (const link of usable) {
        drawWeakConnection(svg,
          { cells: link.leftCells, digits: [link.digit] },
          { cells: link.rightCells, digits: [link.digit] },
          link.digit, link.digit, false, link.forcing === true);
      }
      boardEl.appendChild(svg);
    }

    return { render, renderWeakLinks };
  }

  app.chainOverlayRenderer = { create };
})(window);
