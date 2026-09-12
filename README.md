# StormDoku

StormDoku is trimmed to the Sudoku core only: puzzle generation, candidate helpers, naked/hidden subsets, box-line reduction, and basic fish .

## Files That Remain

- `src/sudoku.ts` - grid types, row/column/box units, peers, candidates, uniqueness checking, full backtracking solve, puzzle generation, encoding/decoding, naked subsets, and the public subset/fish entry points.
- `src/spaces.ts` - positional candidate spaces, hidden subsets, and X-wing/Swordfish/Jellyfish detection.
- `src/pom.ts` - POM template catalog, digit/cell template indexes, omissions, template-space Hidden/Naked subset checks, and temporary-state TK-delete checks. Its omission-keyed fish adapter is used by the solver, not by POM Check reporting.
- `src/cardinals.ts` - compact coordinate lookup tables used by the positional-space code.
- `src/browser-core.js` - no-build browser copy of the retained core for `index.html`.
- `src/pom-core.js` - browser copy of the user-triggered POM check.
- `index.html` - small local test harness for generator, subsets, fish, highlighting, and candidate-grid reduction cycles.
- `.gitignore` - keeps Visual Studio workspace cache files out of the repo.

## Public Entry Points

- `generate(givens)` returns a uniquely solvable puzzle plus its solution.
- `solveFully(grid)` solves a puzzle by backtracking.
- `countSolutions(grid, limit)` checks solution count up to a limit.
- `allCandidates(grid)` and `candidatesFor(grid, cell)` build candidate lists.
- `nakedSingleStep(cand)` removes the solved digit from every peer of a naked-single cell.
- `nakedSubsetStep(cand, k)`, `hiddenSubsetStep(cand, k)`, and `subsetStep(cand)` detect size 1-4 subset eliminations.
- `boxLineStep(cand)` detects pointing and claiming candidates.
- `fishStep(cand)` detects X-wing, Swordfish, and Jellyfish.
- `pomCheck(cand, grid)` builds the per-digit template lists, then follows the POM priority cycle: cell/digit omissions over digits 1-9, Hidden subsets by size, Naked subsets by size, and T2-T5 deletes. Any template-state change restarts the next cycle at omissions. It stops when every digit has exactly one remaining template, omits zero-report progression rows, returns per-cycle counts plus pre-POM/final template counts, and leaves candidates unchanged. Fish is not part of this report.
- `subsetOrFishStep(cand)` and `hintFor(grid)` return the first retained technique found.
- `applyEliminations(cand, elim)` removes reported candidates from a candidate grid in place.
- `reduceCandidates(cand, maxCycles)` repeatedly finds a subset/fish step, applies its real eliminations to a copy, and uses the updated candidate grid on the next cycle.
- `reduceCandidatesInPlace(cand, maxCycles)` does the same cycle directly on the candidate grid passed in.
- `cellGroupName(cells)`, `sectorGroupName(sectors)`, and `formatRemovals(items)` compress output selectors.

Subset and fish steps return `null` when there is no actual candidate removal. Naked and hidden subsets use peer-based eliminations per digit wherever the subset cells lock that digit out of a row, column, or box. Hidden subsets also remove non-subset digits from their chosen cells. All subset reports store exact `{ cell, digit }` removals, while displayed subset output is `Subset Name: (digits) cells in sector => eliminations`, except naked singles omit the sector: `Naked Single: (digit) cell => eliminations`. Box-line output is `Box - Line Reduction: (digit) baseSectors / coverSectors => eliminations`. Eliminations are compressed as `cellGroup<>digit`. Fish output is `Fish Name: (digit) baseSectors / coverSectors => eliminations`. The next cycle never sees candidates that were already eliminated. When Next finds no further hint, the tester clears the stale overlay and displays the already-updated candidate grid. The browser tester keeps subset frames transparent behind the cells, fills fish and box-line base/cover sectors, marks fish and box-line vertices and digits green, highlights subset digits, and shows red slashed eliminations from the current applied cycle.

The sequential search order is Hidden Single, Naked Single, Box - Line Reduction, then Hidden and Naked subsets followed by the matching fish size at each size 2-4 stage.

POM is intentionally outside that order. The `POM Check` button runs the template catalog, cell/digit omissions, template-space subset checks, and TK-delete checks on demand; it does not report fish, add a solving step, alter the candidate grid, or enter undo/redo history. The solver fish pass ports the Nishio-triggered generic fish idea using POM omissions as the trigger cells: no omissions means no fish search for that digit, bases that contain all omission cells are skipped, covers must touch an omission cell, and output is a Sudoku elimination list. The local tester exposes the matching fish search limits: selected digits, Basic/Franken/Mutant, N size 1-7, K size 0-2, fast return, and independent base/cover sector masks. POM results report both pre-POM and final template counts and keep `templatesByDigit` and `digitTemplates` available for later inspection.

## Removed

The React/Next UI, old static app export, broad solver ladder, grading logic, stale scripts, unlocked Visual Studio metadata, and unrelated Copilot/Azure instruction file were removed. Visual Studio may keep a few `.vs` index files locked while it is open; `.gitignore` keeps that cache out of the project.

Open `index.html` directly in a browser to test the simplified core without installing a build tool.

This checkout does not contain a package manifest or TypeScript project file. If `tsc` is available, the retained source can be checked directly with:

```bash
tsc --noEmit --target ES2020 --module ESNext --strict src/sudoku.ts src/spaces.ts src/cardinals.ts src/pom.ts
```
