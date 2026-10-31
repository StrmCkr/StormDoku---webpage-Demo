/* StormDoku chain highlight-state builder. */
(function installChainHighlightBuilder(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    alsColorMapForChain, ahsColorMapForChain, orientedDisplayChainSteps,
    addChainSideMarks, chainSideAtoms, visibleChainEntrySide, visibleChainExitSide,
    atomKey, resolvedWeakDigits, groupedAnchorPair, isAlsVisualStep,
    moduleVisualSides, alsColorForSide, isAhsVisualStep, ahsColorForSide,
  }) {
        function chainHighlights(chain) {
          const marks = new Set();
          const xorEntryMarks = new Set();
          const xorExitMarks = new Set();
          const weakMarks = new Set();
          const alsMarks = new Set();
          const alsStyleByCell = new Map();
          const alsStyleByAtom = new Map();
          const ahsMarks = new Set();
          const ahsStyleByCell = new Map();
          const ahsStyleByAtom = new Map();
          const startMarks = new Set();
          const endMarks = new Set();
          const cells = new Set();
          const alsCells = new Set();
          const ahsCells = new Set();
          const alsEntryCells = new Set();
          const alsExitCells = new Set();
          const startCells = new Set();
          const endCells = new Set();
          const orderByCell = new Map();
    
          if (!chain) {
            return {
              marks,
              xorEntryMarks,
              xorExitMarks,
              weakMarks,
              alsMarks,
              alsStyleByCell,
              alsStyleByAtom,
              ahsMarks,
              ahsStyleByCell,
              ahsStyleByAtom,
              startMarks,
              endMarks,
              cells,
              alsCells,
              ahsCells,
              alsEntryCells,
              alsExitCells,
              startCells,
              endCells,
              orderByCell,
            };
          }
    
          const alsColors = alsColorMapForChain(chain);
          const ahsColors = ahsColorMapForChain(chain);
          const displaySteps = orientedDisplayChainSteps(chain.steps);
          for (let index = 0; index < displaySteps.length; index++) {
            const step = displaySteps[index];
            // The selected chain is an explanation of the pre-application state.
            // Keep its node atoms visible even if Next already removed them from
            // the live candidate grid; this does not mutate candidates.
            addChainSideMarks(step.entry, marks, cells, orderByCell, index + 1, false);
            addChainSideMarks(step.exit, marks, cells, orderByCell, index + 1, false);
            for (const atom of chainSideAtoms(step.entry, null, false)) xorEntryMarks.add(atom);
            for (const atom of chainSideAtoms(step.exit, null, false)) xorExitMarks.add(atom);
    
            if (index > 0) {
              const fromSide = visibleChainExitSide(displaySteps[index - 1]);
              const toSide = visibleChainEntrySide(step);
              const weakFromDigit = step.weakFromDigit ?? step.weakDigit;
              const weakToDigit = step.weakToDigit ?? step.weakDigit;
              const directAlc = chain?.alcXz && displaySteps.length === 2;
              if (directAlc) {
                for (const contact of chain.alcXz.contacts || []) {
                  for (const pair of contact.pairs || []) {
                    weakMarks.add(atomKey(pair[0], Number(contact.digit)));
                    weakMarks.add(atomKey(pair[1], Number(contact.digit)));
                  }
                }
              } else {
                const resolved = resolvedWeakDigits(fromSide, toSide, weakFromDigit, weakToDigit);
                addWeakDigitMarks(weakMarks, fromSide, resolved.fromDigit, false);
                addWeakDigitMarks(weakMarks, toSide, resolved.toDigit, false);
                const pair = groupedAnchorPair(
                  fromSide,
                  toSide,
                  resolved.fromDigit,
                  resolved.toDigit,
                );
                if (pair && weakFromDigit == null && weakToDigit == null) {
                  weakMarks.add(atomKey(pair.from.cell, pair.from.digit));
                  weakMarks.add(atomKey(pair.to.cell, pair.to.digit));
                }
              }
            }
    
            if (isAlsVisualStep(step)) {
              const moduleSides = moduleVisualSides(step);
              const entryColor = alsColorForSide(step, moduleSides.entry, 'entry', alsColors);
              const exitColor = alsColorForSide(step, moduleSides.exit, 'exit', alsColors);
              for (const cell of moduleSides.entry.cells || []) {
                alsCells.add(cell);
                alsEntryCells.add(cell);
                alsStyleByCell.set(cell, entryColor);
              }
              for (const cell of moduleSides.exit.cells || []) {
                alsCells.add(cell);
                alsExitCells.add(cell);
                alsStyleByCell.set(cell, exitColor);
              }
              for (const atom of chainSideAtoms(moduleSides.entry, null, false)) {
                alsMarks.add(atom);
                alsStyleByAtom.set(atom, entryColor);
              }
              for (const atom of chainSideAtoms(moduleSides.exit, null, false)) {
                alsMarks.add(atom);
                alsStyleByAtom.set(atom, exitColor);
              }
    
              if (step.module?.common) {
                const common = step.module.common;
                const weakDigits = common.restrictedDigits?.length
                  ? common.restrictedDigits
                  : (common.digits || []);
                for (const digit of weakDigits) {
                  for (const atom of chainSideAtoms(moduleSides.entry, digit, false)) weakMarks.add(atom);
                  for (const atom of chainSideAtoms(moduleSides.exit, digit, false)) weakMarks.add(atom);
                }
              }
            }
    
            if (isAhsVisualStep(step)) {
              const moduleSides = moduleVisualSides(step);
              for (const [role, side] of [['entry', moduleSides.entry], ['exit', moduleSides.exit]]) {
                const ahsColor = ahsColorForSide(step, side, role, ahsColors);
                for (const cell of side?.cells || []) {
                  ahsCells.add(cell);
                  ahsStyleByCell.set(cell, ahsColor);
                }
                for (const atom of chainSideAtoms(side, null, false)) {
                  ahsMarks.add(atom);
                  ahsStyleByAtom.set(atom, ahsColor);
                }
              }
              if (step.module?.common) {
                const common = step.module.common;
                const weakDigits = common.restrictedDigits?.length
                  ? common.restrictedDigits
                  : (common.digits || []);
                for (const digit of weakDigits) {
                  for (const atom of chainSideAtoms(moduleSides.entry, digit, false)) weakMarks.add(atom);
                  for (const atom of chainSideAtoms(moduleSides.exit, digit, false)) weakMarks.add(atom);
                }
              }
            }
          }
    
          const firstEntry = visibleChainEntrySide(displaySteps[0]) || {};
          for (const atom of chainSideAtoms(firstEntry, null, false)) startMarks.add(atom);
          for (const cell of firstEntry.cells || []) startCells.add(cell);
    
          const terminal = visibleChainExitSide(displaySteps[displaySteps.length - 1]) || {};
          for (const atom of chainSideAtoms(terminal, null, false)) endMarks.add(atom);
          for (const cell of terminal.cells || []) endCells.add(cell);
    
          if (chain.isRing && displaySteps.length) {
            const ringFrom = visibleChainExitSide(displaySteps[displaySteps.length - 1]);
            const ringTo = visibleChainEntrySide(displaySteps[0]);
            if (chain?.alcXz && displaySteps.length === 2) {
              for (const contact of chain.alcXz.contacts || []) {
                for (const pair of contact.pairs || []) {
                  weakMarks.add(atomKey(pair[0], Number(contact.digit)));
                  weakMarks.add(atomKey(pair[1], Number(contact.digit)));
                }
              }
            } else {
              const ringFromDigit = chain.ringWeakFromDigit ?? chain.ringWeakDigit;
              const ringToDigit = chain.ringWeakToDigit ?? chain.ringWeakDigit;
              addWeakDigitMarks(weakMarks, ringFrom, ringFromDigit);
              addWeakDigitMarks(weakMarks, ringTo, ringToDigit);
              const pair = groupedAnchorPair(
                ringFrom,
                ringTo,
                ringFromDigit,
                ringToDigit,
              );
              if (pair && ringFromDigit == null && ringToDigit == null) {
                weakMarks.add(atomKey(pair.from.cell, pair.from.digit));
                weakMarks.add(atomKey(pair.to.cell, pair.to.digit));
              }
            }
          }
    
          return {
            marks,
            xorEntryMarks,
            xorExitMarks,
            weakMarks,
            alsMarks,
            alsStyleByCell,
            alsStyleByAtom,
            startMarks,
            endMarks,
            cells,
            alsCells,
            ahsCells,
            alsEntryCells,
            alsExitCells,
            ahsMarks,
            ahsStyleByCell,
            ahsStyleByAtom,
            startCells,
            endCells,
            orderByCell,
          };
        }
    
    
    return { chainHighlights };
  }

  app.chainHighlightBuilder = { create };
})(window);

