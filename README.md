# StormDoku

StormDoku is a browser-first Sudoku solver and analysis workbench. It can
load standard puzzles or candidate-space data, generate uniquely solvable
puzzles, apply the retained basic solving cycle, and inspect candidate
structures such as subsets, fish, links, ALS, AHS, and chains.

The application is intentionally a small local web app. It has no server,
package manifest, or runtime dependency installation step.

## Quick Start

1. Open `index.html` in a modern browser.
2. Enter a puzzle or candidate grid in `Puzzle String`, then select `Load`.
3. Use `Generate` to create a new unique puzzle. The `Givens` field controls
   the requested starting clue count.
4. Use `Next Cycle` to apply one retained solving step, or `Run All` to keep
   applying steps until the logic stalls or the cycle limit is reached.

For browsers that restrict local files, serve the repository directory with
any simple static file server and open `index.html` through that server. The
page does not require an internet connection.

## Input Formats

### 81-character puzzle

Use digits `1`-`9` for givens and `.` or `0` for empty cells. Whitespace and
the common grid separators `|`, `,`, `;`, `:`, `_`, and `-` are ignored. A
standard puzzle is checked for a unique solution before it replaces the
current puzzle.

### 729 candidate bits

The parser accepts 729 binary values in cell-major order:

```text
cell 1: candidates 1..9, cell 2: candidates 1..9, ... cell 81: candidates 1..9
```

`1` means that the candidate is present and `0` means that it is absent.
Candidate data may also be supplied as nine rows of nine candidate strings,
for example `2457` for a cell containing candidates 2, 4, 5, and 7.

For 729 data, StormDoku builds row, column, and box candidate spaces. A cell
is inferred as a given only when one candidate is forced in all three spaces.
Conflicting space-proven givens are rejected. Candidate data with no solution
or multiple solutions is still loaded for inspection, with a warning, because
the candidate grid itself may be useful while testing.

## Main Controls

- `Load` parses the input and checks the puzzle when possible.
- `Generate` creates a unique puzzle. The difficulty selector can request
  any rating category from `Lulz` through `Nightmare`, plus `Unknown` or
  `Any`.
- `Reset` rebuilds candidates from the current puzzle or loaded candidate data.
- `Undo` and `Redo` move through candidate-grid cycles.
- `Next Cycle` applies the next retained basic elimination.
- `Run All` repeats the retained cycle, stopping when no elimination remains,
  the puzzle is solved, or 100 cycles have run.
- `P.O.M.` runs a read-only template inspection. It does not alter candidates
  or solving history.

The `Solution` display is collapsed by default. `Solution Steps:` is also a
collapsible report and shows the most recent applied step in its summary.

## Retained Solving Cycle

`Next Cycle` and `Run All` use this order:

1. Hidden Single
2. Naked Single
3. Box - Line Reduction
4. Hidden or Naked subset at size 2, followed by the matching basic or
   omission-triggered fish search
5. Hidden or Naked subset at size 3, followed by the matching fish search
6. Hidden or Naked subset at size 4, followed by the matching fish search

Each step applies only candidates that still exist. The current candidate grid
is carried into the next cycle, and real removals are recorded for undo/redo.
The retained basic cycle is deliberately smaller than the structure browsers
described below; structure searches are available through their own buttons.

## Structure Searches

Each search keeps its results in a separate collapsible report. Results can be
selected to highlight their cells, candidate digits, sectors, strong
connections, weak inferences, arcs, or eliminations on the grid.

### Hidden and Naked Subsets

`Find Hidden Subset` and `Find Naked Subset` use the generic subset reporter
for sizes 1 through 4. Results are grouped by size and can be selected for
grid highlighting. The builders use the current candidate grid and retain the
ALS/AHS set information used by the report.

### N x (N + K) Fish

`Find NxN+K Fish` searches the configured digits and sectors. Its settings
include:

- base size `N` from 1 through 7;
- extra cover size `K` from 0 through 2;
- Basic, Franken, and Mutant fish modes;
- independent base-sector and cover-sector switches;
- an early-return option.

The report groups results by fish category and size. The saved examples in the
`Examples` panel include an XY example, a `3x3+2 fish` example, and a
`4x4+2 fish` example.

### LS / ALS

`Build LS / ALS` reports almost-locked-set candidates from the current grid.
Records include their sector, cells, digits, size, DOF, FOX, RCC information,
and potential eliminations. Results are grouped by size and can be selected
for grid highlighting.

DOF means **Degrees of Freedom**. FOX means **Fixed Over X**. The UI displays
the human-facing size; internal power-set indexes remain zero-based.

### ALS Links

`Build ALS Links` creates ALS RCC graph records, including paired ALS modules
and ALS-XZ records where applicable. The report exposes the left and right RCC
endpoints, LS modules, common bridge data, and potential eliminations. These
records are also the optional ALS source used by the chain walker.

### HS / AHS

`Build HS / AHS` reports hidden-set and almost-hidden-set records with their
selected digits, cells, sector, DOF, FOX, RCC data, and candidate-space
metadata. AHS is currently an inspection and reporting feature. AHS strong
links are not enabled in the chain walker.

### Strong Links

`Build Strong Links` groups the current strong links into these five displayed
types:

- Bi-Local
- Cell <=> Group
- Group <=> Group
- ERI
- BIVALVE (Size-1 ALS)

Selecting a link highlights its construction and candidate digits on the grid.
The ERI and mini-sector constructions retain their geometry data for display.

## Chain Walker

`Find Chains` performs a breadth-first chain walk over directed link views.
The `Chain Depth` selector controls the logical search depth. The usable-link
controls independently enable the five strong-link buckets above, and the
separate `ALS` switch enables ALS_RCC records. AHS_RCC is currently disabled
from this walk.

Chain reports include:

- Eureka-style chain text;
- optional verbose/debug text for copying;
- strong-link and ALS_RCC graph counts;
- weak inference type and digit data;
- cumulative and boundary eliminations;
- ring and terminal-closure metadata;
- structural names and cross-category memberships;
- safety flags for solution removal, empty cells, or sectors with no legal
  remaining candidate.

Recognized UI folders include Local/M/Hybrid wing and ring families, Almost
Locked Sets, B.A.R.N.S., Hidden - XY chain, Remote Pair, ERI - Chain,
X - Chains, W - Wing | Ring, Split - Wing, Strong Wing | Ring, and Inversion.
A chain may appear in more than one folder when its structure matches more
than one classification. The report shows up to the first 200 chain records;
the search statistics still report the complete search state and any cap or
truncation reason.

`Copy Eureka` copies the display form. `Copy Debug` copies the verbose form.
Selecting a chain updates the board map and related report highlights.

## Grid Views and Highlights

The board has four selectable views:

- `RC`: the normal row/column Sudoku grid;
- `Rn`: row-sector candidate spaces;
- `Cn`: column-sector candidate spaces;
- `Bn`: box-sector candidate spaces.

The structure reports share the RC board for highlighting. Blue and green
marks show selected structure data, while red is reserved for eliminations or
safety warnings. The candidate grid, solution, and reports remain separate so
selecting a structure does not apply its eliminations.

## Rating and Generation

The rating system adds each applied move's value to the cumulative score. The
displayed category is determined by the hardest move, using the following
ordered ladder:

1. `Lulz` (`0`): Last Man Standing only.
2. `Extremely Easy` (`1`-`1.5`): Hidden Single, Naked Single, and Box-Line
   Reduction.
3. `Very Easy` (`2`): Hidden Pair, Naked Pair, X-Wing, and AIC X-Wing.
4. `Modestly Easy` (`2.5`-`2.75`): 2x2+K Fish, 2-String Kite, Empty
   Rectangle, Skyscraper, and Finned/Sashimi X-Wing.
5. `Easy` (`3`): Hidden Triple, Naked Triple, and Swordfish.
6. `Moderate` (`3.25`-`3.75`): 3x3+K Fish, L(1), 3x ERI, Dual Empty
   Rectangle, Rec't Kite, Bridged Empty Rectangle, B.A.R.N.S. XYZ, and
   XY-Wing.
7. `Tough` (`4`): Hidden Quad, Naked Quad, and Jellyfish.
8. `Challenging` (`4.25`-`4.75`): 4x4+K Fish, 4x ERI, length-4 X-Chains,
   B.A.R.N.S. XYZ Transport, and B.A.R.N.S. WXYZ.
9. `Irritating` (`5`-`5.5`): Remote Pair, Hidden Remote Pair, XY-Chain,
   ERI chains above four nodes, and X-Chains above four nodes. Ring forms
   receive `+0.5` while remaining in this category.
10. `Frustrating` (`5`-`5.5`): L(2), L(3), S, M, H, and W Wings/Rings,
    W Transport, and B.A.R.N.S. WXYZ Transport.
11. `Hard` (`6`): ALS-XZ; a Ring is `6.5`.
12. `Demanding` (`7`): ALS-XY; a Ring is `7.5`.
13. `Expert` (`8`-`8.5`): ALS versions of named Wings and Rings.
14. `Brutal` (`9`-`9.5`): ALS Chains.
15. `Nightmare` (`10`-`10.5`): AIC + ALS Chains.
16. `Unknown`: unsolved or unclassified.

Ring forms receive the stated `+0.5` bonus without creating a separate rating
category. Fish K-values use `2.5`, `2.75`, `3.25`, `3.5`, `4.25`, and `4.5`
for K1 and K2 at sizes 2, 3, and 4 respectively. A selected generation
category is checked against the resulting rating and solved-state result.

When a requested category is selected for generation, StormDoku tests up to
1,000 generated puzzles and keeps the current puzzle unchanged if no match is
found. `Any` uses one generation attempt.

Generation rating uses the retained basic logic and a solved-state check. A
puzzle that stalls before its calculated solution is complete is reported as
Unknown rather than being presented as solved.

## Source Layout

The browser entry point is `index.html`. It loads the no-build browser copies
from `src/*-core.js`; editing a TypeScript source file does not automatically
rebuild its browser copy.

- `src/sudoku.ts` - grids, candidates, peers, DLX solution counting, full
  solving, generation, encoding/decoding, basic subsets, box-line reduction,
  fish dispatch, and candidate application.
- `src/spaces.ts` - row/column/box candidate-space construction and the basic
  size 2-4 fish implementation.
- `src/set-tools.ts` - combinations, set operations, power-set indexes, RCC
  sectors, and peer elimination helpers.
- `src/cardinals.ts` - row, column, box, position, and peer lookup tables.
- `src/pom.ts` - template catalog, omissions, template-space subset checks,
  TK-delete checks, and omission-triggered N x (N + K) fish.
- `src/mini-sectors.ts` - RCB mini-sector candidate tables.
- `src/als.ts` - LS/ALS construction and DOF/FOX records.
- `src/ahs.ts` - HS/AHS construction and DOF/FOX records.
- `src/als-link.ts` - ALS RCC graph construction.
- `src/strong-link.ts` - the five strong-link buckets and XOR geometry.
- `src/chain.ts` - chain graph construction, BFS walking, ring evaluation,
  classifications, and Eureka/verbose formatting.
- `src/*-core.js` - browser-compatible mirrors loaded by `index.html`.

The TypeScript sources can be type-checked directly when `tsc` is available:

```bash
tsc --noEmit --target ES2020 --module ESNext --strict \
  src/sudoku.ts src/spaces.ts src/set-tools.ts src/cardinals.ts src/pom.ts \
  src/mini-sectors.ts src/als.ts src/ahs.ts src/als-link.ts \
  src/strong-link.ts src/chain.ts
```

## Current Boundaries

- This is a local browser harness, not a packaged application.
- Structure searches inspect and highlight the current candidate grid; they do
  not automatically apply their reported eliminations.
- The basic solving cycle does not include ALS_RCC or AHS_RCC chain results.
- AHS records can be built and viewed, but AHS links are intentionally absent
  from the chain walk at present.
- A standard 81-character puzzle must have exactly one solution to load as a
  solved-reference puzzle. Candidate-space data may be loaded even when its
  derived puzzle has zero or multiple solutions, for inspection.
- The chain walker has explicit limits for states, queues, branching, results,
  and per-start work. A truncated search reports its stop reason in the UI.

## License

StormDoku is licensed under the GNU General Public License, version 3 or later
(GPL-3.0-or-later). The complete license text is available from the Free
Software Foundation at <https://www.gnu.org/licenses/gpl-3.0.html>.

## Warranty Disclaimer

This software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose, and noninfringement. In no event shall the
authors or contributors be liable for any claim, damages, or other liability,
whether in an action of contract, tort, or otherwise, arising from, out of, or
in connection with the software or the use or other dealings in the software.
