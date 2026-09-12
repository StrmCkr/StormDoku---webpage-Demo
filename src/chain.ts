import { ahsConstructor, type Ahs } from './ahs';
import { buildAhsLinks, flattenAhsLinks, type AhsLinkSet } from './ahs-link';
import { alsConstructor, type Als } from './als';
import { buildAlsLinks, flattenAlsLinks, type AlsLinkSet } from './als-link';
import { intersection, sortedUnique, union } from './set-tools';
import { UNITS } from './cardinals';
import { buildStrongLinks, flattenStrongLinks, type StrongLinkSet } from './strong-link';
import { cellGroupName, formatRemovals, peersOf, sectorGroupName, type CandidateGrid, type CandidateRemoval } from './sudoku';

export const LOCAL_WEAK = 0;
export const SECTOR_WEAK = 1;
export const WEAK_TYPE_NAMES = ['LOCAL', 'SECTOR'] as const;

type WeakType = typeof LOCAL_WEAK | typeof SECTOR_WEAK;
type DigitMap = Record<string, number[]>;
type LinkSet = StrongLinkSet | AlsLinkSet | AhsLinkSet | LinkRecord[];

interface LinkRecord {
  id?: number | string;
  linkType?: number;
  linkTypeName?: string;
  originSector?: number[];
  startingDigits?: number[];
  activeCells?: number[];
  linkedCells?: number[];
  linkDigits?: number[];
  startCellsSector?: DigitMap | Map<number, number[]>;
  linkCellsSector?: DigitMap | Map<number, number[]>;
  startDigitSwapAvailable?: number[];
  endDigitSwapAvailable?: number[];
  potentialElimStart?: DigitMap | Map<number, number[]>;
  potentialElimEnd?: DigitMap | Map<number, number[]>;
  LS_L?: SubsetNode;
  LS_R?: SubsetNode;
  HS_L?: SubsetNode;
  HS_R?: SubsetNode;
  C?: BridgeRecord;
  moduleKind?: 'ALS_XZ';
  displayLeftRcc?: number;
  displayRightRcc?: number;
  intrinsicEliminations?: Array<{ cell: number; digit: number }>;
  secondaryTypes?: string[];
}

interface SubsetNode {
  uniqueID?: number | string;
  sector?: number;
  cells?: number[];
  digits?: number[];
}

interface BridgeRecord {
  digit?: number;
  digits?: number[];
  restrictedDigits?: number[];
  leftCells?: number[];
  rightCells?: number[];
  sectors?: number[];
  bridges?: BridgeRecord[];
}

interface ChainSide {
  name: 'left' | 'right';
  cells: number[];
  digits: number[];
  cellKey: string;
  sectorsByDigit: DigitMap;
  potentialElimByDigit: DigitMap;
  swapDigits: number[];
}

interface ChainNode {
  raw: LinkRecord;
  family: 'SL' | 'ALS' | 'AHS';
  graphId: string;
  id: number | string;
  linkType: number;
  linkTypeName: string;
  linkTypeNames: string[];
  moduleLabel: string;
  originSector: number[];
  left: ChainSide;
  right: ChainSide;
  allCells: number[];
}

interface DirectedView {
  key: string;
  node: ChainNode;
  forward: boolean;
  direction: 'F' | 'R';
  entry: ChainSide;
  exit: ChainSide;
}

interface WeakConnection {
  weakType: WeakType;
  weakTypeName: typeof WEAK_TYPE_NAMES[number];
  digit: number | null;
  cells: number[];
  sectors: number[];
}

interface SearchStep {
  view: DirectedView;
  weakIn: WeakType | null;
  weakDigit: number | null;
}

interface QueueNode {
  view: DirectedView;
  steps: SearchStep[];
  visited: Set<string>;
  usedAtoms: Set<string>;
  eliminations: ChainElimination[];
}

export interface ChainBuilderOptions {
  includeStrong?: boolean;
  includeAls?: boolean;
  includeAhs?: boolean;
  strictAlsSingleCommon?: boolean;
  strictAhsSingleCommon?: boolean;
  strongLinkTypes?: number[];
  minAhsDof?: number;
  maxAhsDof?: number;
  maxAlsLinks?: number;
  maxAhsLinks?: number;
  maxDepth?: number;
  maxChains?: number;
  maxResultAttempts?: number;
  maxResultAttemptsPerStart?: number;
  maxStates?: number;
  maxQueue?: number;
  maxBranching?: number;
  maxStartViews?: number;
  strongLinkSet?: StrongLinkSet | LinkRecord[];
  alsLinkSet?: AlsLinkSet | LinkRecord[];
  ahsLinkSet?: AhsLinkSet | LinkRecord[];
  alsList?: Als[];
  ahsList?: Ahs[];
}

interface NormalisedOptions extends Required<Omit<
  ChainBuilderOptions,
  'strongLinkSet' | 'alsLinkSet' | 'ahsLinkSet' | 'alsList' | 'ahsList' | 'strongLinkTypes'
>> {
  strongLinkTypes: number[];
  maxStartViews: number;
  strongLinkSet?: StrongLinkSet | LinkRecord[];
  alsLinkSet?: AlsLinkSet | LinkRecord[];
  ahsLinkSet?: AhsLinkSet | LinkRecord[];
  alsList?: Als[];
  ahsList?: Ahs[];
}

export interface PublicChainSide {
  side: 'left' | 'right';
  cells: number[];
  digits: number[];
  sectorsByDigit: DigitMap;
  potentialElimByDigit: DigitMap;
  swapDigits: number[];
}

export interface PublicSubsetModule {
  id: number | string | null;
  sector: number | null;
  cells: number[];
  digits: number[];
  label: string;
}

export interface PublicBridgeModule {
  digit: number | null;
  digits: number[];
  restrictedDigits: number[];
  leftCells: number[];
  rightCells: number[];
  cells: number[];
  sectors: number[];
  label: string;
}

export interface PublicChainModule {
  family: 'ALS' | 'AHS';
  subsetKind: 'LS' | 'HS';
  entryRcc: 'RCC_L' | 'RCC_R';
  entrySubset: PublicSubsetModule | null;
  exitSubset: PublicSubsetModule | null;
  entrySideSubset: PublicSubsetModule | null;
  exitSideSubset: PublicSubsetModule | null;
  entryLs: PublicSubsetModule | null;
  common: PublicBridgeModule | null;
  exitLs: PublicSubsetModule | null;
  exitRcc: 'RCC_L' | 'RCC_R';
  entrySideLs: PublicSubsetModule | null;
  exitSideLs: PublicSubsetModule | null;
  entryHs: PublicSubsetModule | null;
  exitHs: PublicSubsetModule | null;
  entrySideHs: PublicSubsetModule | null;
  exitSideHs: PublicSubsetModule | null;
  label: string;
  moduleKind?: 'ALS_XZ';
  displayLeftRcc?: number | null;
  displayRightRcc?: number | null;
}

export interface PublicChainStep {
  family: 'SL' | 'ALS' | 'AHS';
  linkId: number | string;
  graphId: string;
  linkType: number;
  linkTypeName: string;
  linkTypeNames: string[];
  originSectors: number[];
  moduleLabel: string;
  module: PublicChainModule | null;
  direction: 'F' | 'R';
  entrySide: 'left' | 'right';
  exitSide: 'left' | 'right';
  entry: PublicChainSide;
  exit: PublicChainSide;
  weakIn: WeakType | null;
  weakInName: typeof WEAK_TYPE_NAMES[number] | null;
  weakDigit: number | null;
}

export interface ChainElimination extends CandidateRemoval {
  reasons: string[];
}

interface ChainEvaluation {
  eliminations: ChainElimination[];
  boundaryEliminations: ChainElimination[];
}

export interface ChainResult {
  length: number;
  structureName: string;
  isRing: boolean;
  ringWeakType: WeakType | null;
  ringWeakTypeName: typeof WEAK_TYPE_NAMES[number] | null;
  ringWeakDigit: number | null;
  ringClosureName: typeof WEAK_TYPE_NAMES[number] | 'OVERLAP' | null;
  ringClosureDigit: number | null;
  eliminations: ChainElimination[];
  steps: PublicChainStep[];
}

export interface ChainStats {
  strongLinks: number;
  alsLinks: number;
  ahsLinks: number;
  graphLinks: number;
  directedViews: number;
  startViews: number;
  statesVisited: number;
  transitionsChecked: number;
  transitionsAccepted: number;
  resultAttempts: number;
  duplicatesSuppressed: number;
  startCapsHit: number;
  chainsFound: number;
  truncated: boolean;
  stopReason: string | null;
}

export interface ChainReport {
  chains: ChainResult[];
  stats: ChainStats;
  linkSets: {
    strongSet: StrongLinkSet | LinkRecord[];
    alsSet: AlsLinkSet | LinkRecord[];
    ahsSet: AhsLinkSet | LinkRecord[];
    alsList: Als[];
    ahsList: Ahs[];
  };
}

interface ChainResultEntry {
  rankKey: string;
  chain: ChainResult;
}

function asNumbers(values: unknown): number[] {
  if (!values) return [];
  const iterable = values as Iterable<unknown>;
  const source = Array.isArray(values)
    ? values
    : values instanceof Set
      ? [...values]
      : typeof iterable[Symbol.iterator] === 'function'
        ? [...iterable]
        : [];
  return sortedUnique(source.map(Number).filter(Number.isFinite));
}

function digitMap(record: unknown): DigitMap {
  const out: DigitMap = {};
  if (!record) return out;

  const entries = record instanceof Map
    ? [...record.entries()]
    : Object.entries(record as Record<string, unknown>);

  for (const [key, values] of entries) {
    const digit = Number(key);
    if (!Number.isInteger(digit) || digit < 1 || digit > 9) continue;
    out[digit] = asNumbers(values);
  }

  return out;
}

function mapDigits(map: DigitMap): number[] {
  return Object.keys(map).map(Number).sort((a, b) => a - b);
}

function cellsKey(cells: readonly number[]): string {
  return asNumbers(cells).join(',');
}

function mapKey(map: DigitMap): string {
  return mapDigits(map)
    .map(digit => `${digit}:${asNumbers(map[digit]).join(',')}`)
    .join('/');
}

function sideKey(side: ChainSide): string {
  return [
    side.digits.join(''),
    side.cells.join(','),
    mapKey(side.sectorsByDigit),
    mapKey(side.potentialElimByDigit),
    side.swapDigits.join(','),
  ].join('|');
}

function sideAtoms(side: ChainSide): string[] {
  const atoms: string[] = [];
  for (const cell of side.cells) {
    for (const digit of side.digits) atoms.push(`${cell}:${digit}`);
  }
  return atoms;
}

function sidesShareAtom(left: ChainSide, right: ChainSide): boolean {
  return hasIntersection(sideAtoms(left), sideAtoms(right));
}

function viewAtoms(view: DirectedView): string[] {
  const atoms = new Set<string>();
  for (const atom of sideAtoms(view.entry)) atoms.add(atom);
  for (const atom of sideAtoms(view.exit)) atoms.add(atom);
  return [...atoms];
}

function viewUsesKnownAtom(usedAtoms: Set<string>, view: DirectedView): boolean {
  return viewAtoms(view).some(atom => usedAtoms.has(atom));
}

function withViewAtoms(usedAtoms: Set<string>, view: DirectedView): Set<string> {
  const next = new Set(usedAtoms);
  for (const atom of viewAtoms(view)) next.add(atom);
  return next;
}

function hasIntersection<T>(left: readonly T[], right: readonly T[]): boolean {
  const rightSet = new Set(right);
  return left.some(value => rightSet.has(value));
}

function isSubsetOf(left: readonly number[], right: readonly number[]): boolean {
  const rightSet = new Set(right);
  return left.every(value => rightSet.has(value));
}

function symmetricDifference(left: readonly number[], right: readonly number[]): number[] {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return sortedUnique([
    ...left.filter(value => !rightSet.has(value)),
    ...right.filter(value => !leftSet.has(value)),
  ]);
}

function sideFromLink(link: LinkRecord, name: 'left' | 'right'): ChainSide {
  const isLeft = name === 'left';
  const cells = asNumbers(isLeft ? link.activeCells : link.linkedCells);

  return {
    name,
    cells,
    digits: asNumbers(isLeft ? link.startingDigits : link.linkDigits),
    cellKey: cellsKey(cells),
    sectorsByDigit: digitMap(isLeft ? link.startCellsSector : link.linkCellsSector),
    potentialElimByDigit: digitMap(isLeft ? link.potentialElimStart : link.potentialElimEnd),
    swapDigits: asNumbers(isLeft ? link.startDigitSwapAvailable : link.endDigitSwapAvailable),
  };
}

function subsetNodeLabel(prefix: 'LS' | 'HS', node: SubsetNode | undefined): string {
  if (!node) return '';

  const id = node.uniqueID ?? '?';
  const digits = asNumbers(node.digits).join('');
  const cells = asNumbers(node.cells);
  const cellText = cells.length ? cellGroupName(cells) : 'none';
  const sector = Number.isInteger(node.sector)
    ? ` in ${sectorGroupName([node.sector!])}`
    : '';

  return `${prefix}#${id} (${digits || '?'}) ${cellText}${sector}`;
}

function bridgeLabel(bridge: BridgeRecord | undefined): string {
  if (!bridge) return '';

  const digits = asNumbers(bridge.digits || (bridge.digit == null ? [] : [bridge.digit])).join('');
  const cells = union(asNumbers(bridge.leftCells), asNumbers(bridge.rightCells));
  const sectors = asNumbers(bridge.sectors);
  const location = sectors.length
    ? sectorGroupName(sectors)
    : cells.length
      ? cellGroupName(cells)
      : 'none';
  return `C(${digits || '?'}) ${location}`;
}

function publicSubsetNode(prefix: 'LS' | 'HS', node: SubsetNode | undefined): PublicSubsetModule | null {
  if (!node) return null;
  return {
    id: node.uniqueID ?? null,
    sector: Number.isInteger(node.sector) ? node.sector! : null,
    cells: asNumbers(node.cells),
    digits: asNumbers(node.digits),
    label: subsetNodeLabel(prefix, node),
  };
}

function publicBridge(bridge: BridgeRecord | undefined): PublicBridgeModule | null {
  if (!bridge) return null;
  const digits = asNumbers(bridge.digits || (bridge.digit == null ? [] : [bridge.digit]));
  const cells = union(asNumbers(bridge.leftCells), asNumbers(bridge.rightCells));
  return {
    digit: bridge.digit ?? digits[0] ?? null,
    digits,
    restrictedDigits: asNumbers(bridge.restrictedDigits || (bridge.digit == null ? [] : [bridge.digit])),
    leftCells: asNumbers(bridge.leftCells),
    rightCells: asNumbers(bridge.rightCells),
    cells,
    sectors: asNumbers(bridge.sectors),
    label: bridgeLabel(bridge),
  };
}

function orientedModule(view: DirectedView): PublicChainModule | null {
  const link = view.node.raw;
  const isAls = view.node.family === 'ALS' && view.node.linkTypeName === 'ALS_RCC' && !!link.LS_L && !!link.LS_R;
  const isAhs = view.node.family === 'AHS' && view.node.linkTypeName === 'AHS_RCC' && !!link.HS_L && !!link.HS_R;
  if (!isAls && !isAhs) return null;

  const subsetKind = isAhs ? 'HS' : 'LS';
  const leftSubset = isAhs ? link.HS_L! : link.LS_L!;
  const rightSubset = isAhs ? link.HS_R! : link.LS_R!;
  const entrySubset = view.forward ? rightSubset : leftSubset;
  const exitSubset = view.forward ? leftSubset : rightSubset;
  const entrySideSubset = view.forward ? leftSubset : rightSubset;
  const exitSideSubset = view.forward ? rightSubset : leftSubset;
  const module: PublicChainModule = {
    family: isAhs ? 'AHS' : 'ALS',
    subsetKind,
    entryRcc: view.forward ? 'RCC_L' : 'RCC_R',
    entrySubset: publicSubsetNode(subsetKind, entrySubset),
    common: publicBridge(link.C),
    exitSubset: publicSubsetNode(subsetKind, exitSubset),
    exitRcc: view.forward ? 'RCC_R' : 'RCC_L',
    entrySideSubset: publicSubsetNode(subsetKind, entrySideSubset),
    exitSideSubset: publicSubsetNode(subsetKind, exitSideSubset),
    entryLs: isAls ? publicSubsetNode('LS', entrySubset) : null,
    exitLs: isAls ? publicSubsetNode('LS', exitSubset) : null,
    entrySideLs: isAls ? publicSubsetNode('LS', entrySideSubset) : null,
    exitSideLs: isAls ? publicSubsetNode('LS', exitSideSubset) : null,
    entryHs: isAhs ? publicSubsetNode('HS', entrySubset) : null,
    exitHs: isAhs ? publicSubsetNode('HS', exitSubset) : null,
    entrySideHs: isAhs ? publicSubsetNode('HS', entrySideSubset) : null,
    exitSideHs: isAhs ? publicSubsetNode('HS', exitSideSubset) : null,
    label: '',
    moduleKind: link.moduleKind,
    displayLeftRcc: link.displayLeftRcc ?? null,
    displayRightRcc: link.displayRightRcc ?? null,
  };

  module.label = [module.entrySubset?.label, module.common?.label, module.exitSubset?.label]
      .filter(Boolean)
      .join(' / ');
  return module;
}

function moduleLabelForView(view: DirectedView, module = orientedModule(view)): string {
  return module?.label || view.node.moduleLabel;
}

function isExpandedRcc(view: DirectedView): boolean {
  const module = orientedModule(view);
  return !!module?.common && !!module.entrySideSubset && !!module.exitSideSubset;
}

function modularRingBridgeDigits(raw: LinkRecord): number[] {
  return raw.C?.restrictedDigits?.length
    ? asNumbers(raw.C.restrictedDigits)
    : asNumbers(raw.C?.digits || (raw.C?.digit == null ? [] : [raw.C.digit]));
}

function isModularRingClosure(raw: LinkRecord): boolean {
  if (raw.moduleKind !== 'ALS_XZ' || !raw.C || !raw.RCC_Left || !raw.RCC_Right) return false;
  if (raw.RCC_Left.digit !== raw.RCC_Right.digit) return false;

  const bridgeDigits = modularRingBridgeDigits(raw);
  const endpointDigit = raw.RCC_Left.digit;
  if (!bridgeDigits.some(digit => digit !== endpointDigit)) return false;

  // The return RCC must actually expose the shared endpoint elimination.
  return (raw.intrinsicEliminations || []).some(item => item.digit === endpointDigit);
}

function isLockedDigit(cand: CandidateGrid, subset: SubsetNode, digit: number): boolean {
  const cells = subset.cells || [];
  const positions = cells.filter(cell => (cand[cell] || []).includes(digit));
  return positions.length >= 2 && UNITS.some(unit => positions.every(cell => unit.includes(cell)));
}

function isRestrictedCommonDigit(
  cand: CandidateGrid,
  left: SubsetNode,
  right: SubsetNode,
  digit: number,
): boolean {
  const leftCells = (left.cells || []).filter(cell => (cand[cell] || []).includes(digit));
  const rightCells = (right.cells || []).filter(cell => (cand[cell] || []).includes(digit));
  return leftCells.length > 0
    && rightCells.length > 0
    && leftCells.every(leftCell => rightCells.every(rightCell => peersOf(leftCell).includes(rightCell)));
}

function hasDistinctReciprocalAlsXz(
  raw: LinkRecord,
  linkNodes: readonly ChainNode[],
): boolean {
  if (!raw.LS_L || !raw.LS_R) return false;
  const bridgeDigits = modularRingBridgeDigits(raw);
  if (bridgeDigits.length !== 1) return false;

  const bridgeDigit = bridgeDigits[0];
  const endpointDigit = raw.RCC_Left?.digit;
  if (endpointDigit == null) return false;

  return linkNodes.some(node => {
    const candidate = node.raw;
    return node.family === 'ALS'
      && candidate !== raw
      && candidate.moduleKind === 'ALS_XZ'
      && candidate.id !== raw.id
      && candidate.LS_L?.uniqueID === raw.LS_L?.uniqueID
      && candidate.LS_R?.uniqueID === raw.LS_R?.uniqueID
      && candidate.displayLeftRcc === bridgeDigit
      && candidate.displayRightRcc === endpointDigit
      && modularRingBridgeDigits(candidate).includes(endpointDigit)
      && (candidate.intrinsicEliminations || []).some(item => item.digit === bridgeDigit);
  });
}

function modularRingClosureDigit(
  cand: CandidateGrid,
  view: DirectedView,
  linkNodes: readonly ChainNode[],
): number | null {
  const raw = view.node.raw;
  if (!isModularRingClosure(raw) || !raw.LS_L || !raw.LS_R) return null;

  const bridgeDigits = modularRingBridgeDigits(raw);
  const endpointDigit = raw.RCC_Left!.digit;
  const excluded = new Set([endpointDigit, ...bridgeDigits]);
  const candidates = intersection(
    raw.LS_L.digits || [],
    raw.LS_R.digits || [],
  ).filter(digit => !excluded.has(digit));
  const locked = candidates.filter(digit =>
    isLockedDigit(cand, raw.LS_L!, digit) && isLockedDigit(cand, raw.LS_R!, digit));

  if (isRestrictedCommonDigit(cand, raw.LS_L!, raw.LS_R!, endpointDigit)) return endpointDigit;
  if (!hasDistinctReciprocalAlsXz(raw, linkNodes)) return null;
  return locked.length === 1 ? locked[0] : endpointDigit;
}

function logicalDepth(steps: SearchStep[]): number {
  return steps.reduce((depth, step) => depth + (isExpandedRcc(step.view) ? 2 : 1), 0);
}

function modularRingWeak(view: DirectedView): WeakConnection | null {
  if (!isModularRingClosure(view.node.raw)) return null;
  const module = orientedModule(view);
  if (!module?.common) return null;
  const digit = module.common.restrictedDigits[0] ?? module.common.digits[0];
  if (digit == null) return null;
  return {
    weakType: SECTOR_WEAK,
    weakTypeName: WEAK_TYPE_NAMES[SECTOR_WEAK],
    digit,
    cells: union(module.common.leftCells, module.common.rightCells),
    sectors: [...module.common.sectors],
  };
}

function modularRingClosureWeak(view: DirectedView, digit: number): WeakConnection | null {
  const bridgeWeak = modularRingWeak(view);
  if (!bridgeWeak) return null;
  const raw = view.node.raw;
  return {
    ...bridgeWeak,
    digit,
    cells: union(raw.RCC_Left?.cells || [], raw.RCC_Right?.cells || []),
    sectors: union(raw.RCC_Left?.sectors || [], raw.RCC_Right?.sectors || []),
  };
}

function computeModularRingEliminations(
  cand: CandidateGrid,
  view: DirectedView,
  out: Map<string, ChainElimination>,
): void {
  const raw = view.node.raw;
  if (!isModularRingClosure(raw)) return;
  const bridgeDigits = modularRingBridgeDigits(raw);

  const excludedDigits = new Set([
    raw.RCC_Left.digit,
    raw.RCC_Right.digit,
    ...bridgeDigits,
  ]);
  const cCells = union(raw.C?.leftCells || [], raw.C?.rightCells || []);
  const cCommonDigits = cCells.length
    ? cCells.slice(1).reduce(
        (digits, cell) => intersection(digits, cand[cell] || []),
        [...(cand[cCells[0]] || [])],
      )
    : [];
  const pairedCells = union(raw.LS_L?.cells || [], raw.LS_R?.cells || []);
  for (const subset of [raw.LS_L, raw.LS_R]) {
    if (!subset?.cells?.length || !subset.digits?.length) continue;
    for (const digit of subset.digits) {
      if (excludedDigits.has(digit)) continue;
      const positions = subset.cells.filter(cell => (cand[cell] || []).includes(digit));
      if (positions.length < 2) continue;
      for (const unit of UNITS) {
        if (!positions.every(cell => unit.includes(cell))) continue;
        for (const cell of unit) {
          if (!pairedCells.includes(cell)) addElimination(out, cand, digit, [cell], 'ring-modular-locked');
        }

        // A modular ring can cannibalise the C-side cells of the repeated ALS.
        // The valid digits are the C-cell common candidates after both RCCs
        // and the module bridge have been removed; they need not be absent
        // from the other ALS as a whole.
        if (subset === raw.LS_L && cCommonDigits.includes(digit)) {
          for (const cell of raw.C?.leftCells || []) {
            if (unit.includes(cell) && subset.cells.includes(cell)) {
              addElimination(out, cand, digit, [cell], 'ring-modular-cannibalistic');
            }
          }
        }
      }
    }
  }

  const cells = intersection(raw.RCC_Left.potentialElim, raw.RCC_Right.potentialElim);
  for (const cell of cells) {
    addElimination(out, cand, raw.RCC_Left.digit, [cell], 'ring-modular-weak');
  }

  const bridges = raw.C.bridges?.length
    ? raw.C.bridges
    : bridgeDigits.map(digit => ({
        digit,
        leftCells: raw.C!.leftCells || [],
        rightCells: raw.C!.rightCells || [],
      }));
  for (const bridge of bridges) {
    if (bridge.digit == null) continue;
    const bridgeCells = union(bridge.leftCells || [], bridge.rightCells || []);
    if (!bridgeCells.length) continue;
    let commonPeers = new Set(peersOf(bridgeCells[0]));
    for (const cell of bridgeCells.slice(1)) {
      const cellPeers = new Set(peersOf(cell));
      commonPeers = new Set([...commonPeers].filter(peer => cellPeers.has(peer)));
    }
    for (const peer of commonPeers) {
      if (bridgeCells.includes(peer)) continue;
      addElimination(out, cand, bridge.digit, [peer], 'ring-modular-c');
    }
  }
}

function moduleLabel(link: LinkRecord, family: ChainNode['family']): string {
  if (family === 'ALS' && link.LS_L && link.LS_R) {
    if (link.linkTypeName === 'ALS_RCC') {
      return `${subsetNodeLabel('LS', link.LS_R)} / ${bridgeLabel(link.C)} / ${subsetNodeLabel('LS', link.LS_L)}`;
    }
    return `${subsetNodeLabel('LS', link.LS_L)} / ${bridgeLabel(link.C)} / ${subsetNodeLabel('LS', link.LS_R)}`;
  }

  if (family === 'AHS' && link.HS_L && link.HS_R) {
    return `${subsetNodeLabel('HS', link.HS_L)} / ${bridgeLabel(link.C)} / ${subsetNodeLabel('HS', link.HS_R)}`;
  }

  return '';
}

function normaliseLink(link: LinkRecord, family: ChainNode['family'], index: number): ChainNode {
  const id = link.id ?? index;
  const left = sideFromLink(link, 'left');
  const right = sideFromLink(link, 'right');
  const linkTypeNames = [...new Set([
    link.linkTypeName || family,
    ...(link.secondaryTypes ?? []),
  ])];

  return {
    raw: link,
    family,
    graphId: `${family}:${id}`,
    id,
    linkType: Number.isInteger(link.linkType) ? link.linkType! : -1,
    linkTypeName: link.linkTypeName || family,
    linkTypeNames,
    moduleLabel: moduleLabel(link, family),
    originSector: asNumbers(link.originSector),
    left,
    right,
    allCells: union(left.cells, right.cells),
  };
}

function directedView(node: ChainNode, forward: boolean): DirectedView {
  return {
    key: `${node.graphId}:${forward ? 'F' : 'R'}`,
    node,
    forward,
    direction: forward ? 'F' : 'R',
    entry: forward ? node.left : node.right,
    exit: forward ? node.right : node.left,
  };
}

function weakKey(weakType: WeakType | '' | null, digit: number | null): string {
  return `${weakType ?? ''}:${digit ?? ''}`;
}

function stepWeakKey(step: SearchStep): string {
  return weakKey(step.weakIn, step.weakDigit);
}

function connectionWeakKey(weak: WeakConnection | null): string {
  return weakKey(weak?.weakType ?? '', weak?.digit ?? null);
}

function viewSemanticKey(view: DirectedView, reverse = false): string {
  const entry = reverse ? view.exit : view.entry;
  const exit = reverse ? view.entry : view.exit;
  const direction = reverse
    ? (view.forward ? 'R' : 'F')
    : view.direction;

  return [
    view.node.family,
    view.node.linkType,
    view.node.linkTypeName,
    direction,
    sideKey(entry),
    sideKey(exit),
  ].join('>');
}

function flattenLinkSet(linkset: LinkSet | undefined, flattener?: (set: any) => LinkRecord[]): LinkRecord[] {
  if (!linkset || !Array.isArray(linkset) || !linkset.length) return [];
  if (linkset[0] && !Array.isArray(linkset[0])) return linkset as LinkRecord[];
  return flattener ? flattener(linkset) : (linkset as LinkRecord[][]).flat();
}

function buildLinkInventory(cand: CandidateGrid, options: NormalisedOptions) {
  const strongSet = options.includeStrong
    ? (options.strongLinkSet || buildStrongLinks(cand))
    : [];
  const selectedStrongTypes = new Set(options.strongLinkTypes);
  const strongLinks = flattenLinkSet(strongSet as LinkSet, flattenStrongLinks as any)
    .filter(link => selectedStrongTypes.has(Number(link.linkType)));

  let alsSet: AlsLinkSet | LinkRecord[] = [];
  let alsList = options.alsList || [];
  if (options.includeAls) {
    alsList = alsList.length
      ? alsList
      : alsConstructor(cand, { maxSizeDOF: 8, maxSizeFox: 7 });
    alsSet = options.alsLinkSet || buildAlsLinks(cand, {
      alsList,
      strictSingleCommon: options.strictAlsSingleCommon,
      maxLinks: options.maxAlsLinks,
    });
  }
  const alsLinks = flattenLinkSet(alsSet as LinkSet, flattenAlsLinks as any);

  let ahsSet: AhsLinkSet | LinkRecord[] = [];
  let ahsList = options.ahsList || [];
  if (options.includeAhs) {
    ahsList = ahsList.length
      ? ahsList
      : ahsConstructor(cand, { maxSize: 8, maxSizeFox: 7 });
    ahsSet = options.ahsLinkSet || buildAhsLinks(cand, {
      ahsList,
      strongLinkSet: options.includeStrong ? strongSet as StrongLinkSet : undefined,
      minDof: options.minAhsDof,
      maxDof: options.maxAhsDof,
      strictSingleCommon: options.strictAhsSingleCommon,
      maxLinks: options.maxAhsLinks,
    });
  }
  const ahsLinks = flattenLinkSet(ahsSet as LinkSet, flattenAhsLinks as any);

  return {
    links: [
      ...strongLinks.map((link, index) => normaliseLink(link, 'SL', index)),
      ...alsLinks.map((link, index) => normaliseLink(link, 'ALS', index)),
      ...ahsLinks.map((link, index) => normaliseLink(link, 'AHS', index)),
    ],
    counts: {
      strong: strongLinks.length,
      als: alsLinks.length,
      ahs: ahsLinks.length,
    },
    source: { strongSet, alsSet, ahsSet, alsList, ahsList },
  };
}

export function buildChainGraph(linkNodes: ChainNode[]) {
  const views: DirectedView[] = [];
  const viewsByKey = new Map<string, DirectedView>();
  const entryByCells = new Map<string, DirectedView[]>();
  const entryByDigitSector = new Map<string, DirectedView[]>();

  for (const node of linkNodes) {
    for (const view of [directedView(node, true), directedView(node, false)]) {
      views.push(view);
      viewsByKey.set(view.key, view);

      const localBucket = entryByCells.get(view.entry.cellKey) || [];
      localBucket.push(view);
      entryByCells.set(view.entry.cellKey, localBucket);

      for (const digit of mapDigits(view.entry.sectorsByDigit)) {
        for (const sector of view.entry.sectorsByDigit[digit]) {
          const key = `${digit}|${sector}`;
          const sectorBucket = entryByDigitSector.get(key) || [];
          sectorBucket.push(view);
          entryByDigitSector.set(key, sectorBucket);
        }
      }
    }
  }

  return { nodes: linkNodes, views, viewsByKey, entryByCells, entryByDigitSector };
}

function localConnection(fromView: DirectedView, toView: DirectedView): WeakConnection | null {
  const exit = fromView.exit;
  const entry = toView.entry;
  if (exit.cellKey !== entry.cellKey) return null;
  if (!hasIntersection(exit.digits, entry.swapDigits)) return null;
  if (!hasIntersection(entry.digits, exit.swapDigits)) return null;

  // Local weak links are digit-specific too. Use the target node's digit
  // that is allowed by the source side so text and graphics share one anchor.
  const digit = entry.digits.find(value => exit.swapDigits.includes(value)) ?? null;

  return {
    weakType: LOCAL_WEAK,
    weakTypeName: WEAK_TYPE_NAMES[LOCAL_WEAK],
    digit,
    cells: [...exit.cells],
    sectors: [],
  };
}

function sectorConnection(fromView: DirectedView, toView: DirectedView, forcedDigit: number | null = null): WeakConnection | null {
  const aNode = fromView.node;
  const bNode = toView.node;
  const aSide = fromView.exit;
  const bSide = toView.entry;

  if (hasIntersection(aNode.allCells, bNode.allCells)) return null;
  if (hasIntersection(aSide.cells, bSide.cells)) return null;

  const digits = forcedDigit == null
    ? intersection(mapDigits(aSide.sectorsByDigit), mapDigits(bSide.sectorsByDigit))
    : [forcedDigit];

  for (const digit of digits) {
    const aSectors = aSide.sectorsByDigit[digit] || [];
    const bSectors = bSide.sectorsByDigit[digit] || [];
    const aElims = aSide.potentialElimByDigit[digit] || [];
    const bElims = bSide.potentialElimByDigit[digit] || [];
    const sharedSectors = intersection(aSectors, bSectors);

    if (!sharedSectors.length || !aElims.length || !bElims.length) continue;
    if (!isSubsetOf(aSide.cells, bElims)) continue;
    if (!isSubsetOf(bSide.cells, aElims)) continue;

    return {
      weakType: SECTOR_WEAK,
      weakTypeName: WEAK_TYPE_NAMES[SECTOR_WEAK],
      digit,
      cells: union(aSide.cells, bSide.cells),
      sectors: sharedSectors,
    };
  }

  return null;
}

function directConnection(fromView: DirectedView, toView: DirectedView): WeakConnection | null {
  return localConnection(fromView, toView) || sectorConnection(fromView, toView);
}

function expandFrom(
  view: DirectedView,
  graph: ReturnType<typeof buildChainGraph>,
  stats: ChainStats,
  options: NormalisedOptions,
): Array<WeakConnection & { target: DirectedView }> {
  const out: Array<WeakConnection & { target: DirectedView }> = [];
  const seen = new Set<string>();
  const add = (target: DirectedView, weak: WeakConnection | null): void => {
    if (!weak || target.key === view.key) return;
    if (sidesShareAtom(view.exit, target.exit)) return;
    const key = `${target.key}|${weak.weakType}|${weak.digit ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ target, ...weak });
  };

  for (const target of graph.entryByCells.get(view.exit.cellKey) || []) {
    if (target.node.graphId === view.node.graphId) continue;
    stats.transitionsChecked += 1;
    add(target, localConnection(view, target));
    if (out.length >= options.maxBranching) return out;
  }

  for (const digit of mapDigits(view.exit.sectorsByDigit)) {
    for (const sector of view.exit.sectorsByDigit[digit]) {
      for (const target of graph.entryByDigitSector.get(`${digit}|${sector}`) || []) {
        if (target.node.graphId === view.node.graphId) continue;
        stats.transitionsChecked += 1;
        add(target, sectorConnection(view, target, digit));
        if (out.length >= options.maxBranching) return out;
      }
    }
  }

  return out;
}

function addElimination(
  out: Map<string, ChainElimination>,
  cand: CandidateGrid,
  digit: number,
  cells: readonly number[],
  reason: string,
): void {
  for (const cell of cells) {
    if (!(cand[cell] || []).includes(digit)) continue;
    const key = `${cell}:${digit}`;
    const existing = out.get(key);
    if (existing) {
      if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
    } else {
      out.set(key, { cell, digit, reasons: [reason] });
    }
  }
}

function computeType1(
  cand: CandidateGrid,
  leftView: DirectedView,
  rightView: DirectedView,
  out: Map<string, ChainElimination>,
): void {
  const left = leftView.entry;
  const right = rightView.exit;

  for (const digit of intersection(left.digits, right.digits)) {
    const cells = intersection(
      left.potentialElimByDigit[digit] || [],
      right.potentialElimByDigit[digit] || [],
    );
    addElimination(out, cand, digit, cells, 'type1');
  }
}

function computeType2(
  cand: CandidateGrid,
  leftView: DirectedView,
  rightView: DirectedView,
  out: Map<string, ChainElimination>,
): void {
  const left = leftView.entry;
  const right = rightView.exit;

  for (const digit of symmetricDifference(left.digits, right.digits)) {
    const leftSeenByRight = intersection(left.cells, right.potentialElimByDigit[digit] || []);
    const rightSeenByLeft = intersection(right.cells, left.potentialElimByDigit[digit] || []);

    if (left.cells.length === 1 && leftSeenByRight.length === left.cells.length) {
      addElimination(out, cand, digit, left.cells, 'type2');
    }
    if (right.cells.length === 1 && rightSeenByLeft.length === right.cells.length) {
      addElimination(out, cand, digit, right.cells, 'type2');
    }
  }
}

function computeSameCellRing(
  cand: CandidateGrid,
  leftSide: ChainSide,
  rightSide: ChainSide,
  out: Map<string, ChainElimination>,
): void {
  if (leftSide.cellKey !== rightSide.cellKey || !leftSide.cells.length) return;
  const keepDigits = new Set(intersection(leftSide.digits, rightSide.digits));
  if (keepDigits.size !== leftSide.cells.length) return;
  if (![...keepDigits].every(digit => leftSide.cells.some(cell => (cand[cell] || []).includes(digit)))) return;

  for (const cell of leftSide.cells) {
    for (const digit of cand[cell] || []) {
      if (!keepDigits.has(digit)) addElimination(out, cand, digit, [cell], 'ring-cell');
    }
  }
}

function computeLockedWeak(
  cand: CandidateGrid,
  fromView: DirectedView,
  toView: DirectedView,
  weak: WeakConnection | null,
  out: Map<string, ChainElimination>,
): void {
  if (!weak || weak.weakType !== SECTOR_WEAK || weak.digit == null) return;
  const leftElims = fromView.exit.potentialElimByDigit[weak.digit] || [];
  const rightElims = toView.entry.potentialElimByDigit[weak.digit] || [];
  addElimination(
    out,
    cand,
    weak.digit,
    intersection(leftElims, rightElims),
    'ring-weak-lock',
  );
}

function computeEvenRingCellularWeak(
  cand: CandidateGrid,
  fromView: DirectedView,
  toView: DirectedView,
  weak: WeakConnection | null,
  out: Map<string, ChainElimination>,
): void {
  if (!weak || weak.weakType !== LOCAL_WEAK || weak.digit == null) return;
  if (fromView.exit.cells.length !== 1 || toView.entry.cells.length !== 1) return;
  if (fromView.exit.digits.length !== 1 || toView.entry.digits.length !== 1) return;
  if (fromView.exit.cellKey !== toView.entry.cellKey) return;

  const cell = fromView.exit.cells[0];
  const keepDigits = union(fromView.exit.digits, toView.entry.digits);
  if (!keepDigits.includes(weak.digit)) return;
  if (!keepDigits.every(digit => (cand[cell] || []).includes(digit))) return;

  for (const digit of cand[cell] || []) {
    if (!keepDigits.includes(digit)) addElimination(out, cand, digit, [cell], 'ring-local-cell');
  }
}

function computeOverlapRingEliminations(
  cand: CandidateGrid,
  fromView: DirectedView,
  toView: DirectedView,
): ChainElimination[] | null {
  const cells = intersection(fromView.exit.cells, toView.entry.cells);
  const digits = intersection(fromView.exit.digits, toView.entry.digits);
  if (fromView.exit.cells.length !== 1 || toView.entry.cells.length !== 1) return null;
  if (fromView.exit.digits.length !== 1 || toView.entry.digits.length !== 1) return null;
  if (cells.length !== 1 || digits.length !== 1) return null;

  const out = new Map<string, ChainElimination>();
  const keepDigits = new Set(digits);
  if (!digits.every(digit => cells.some(cell => (cand[cell] || []).includes(digit)))) return null;

  for (const cell of cells) {
    for (const digit of cand[cell] || []) {
      if (!keepDigits.has(digit)) addElimination(out, cand, digit, [cell], 'ring-overlap');
    }
  }

  let commonPeers = new Set(peersOf(cells[0]));
  for (const cell of cells.slice(1)) {
    const cellPeers = new Set(peersOf(cell));
    commonPeers = new Set([...commonPeers].filter(peer => cellPeers.has(peer)));
  }

  for (const peer of commonPeers) {
    if (cells.includes(peer)) continue;
    for (const digit of digits) addElimination(out, cand, digit, [peer], 'ring-overlap');
  }

  return [...out.values()].sort((a, b) => a.cell - b.cell || a.digit - b.digit);
}

function evaluateChain(
  cand: CandidateGrid,
  steps: SearchStep[],
  isRing: boolean,
  ringWeak: WeakConnection | null = null,
): ChainEvaluation {
  const out = new Map<string, ChainElimination>();
  const boundary = new Map<string, ChainElimination>();
  const first = steps[0].view;
  const terminal = steps[steps.length - 1].view;

  if (steps.length === 1) {
    if (isRing && steps[0].view.node.raw.moduleKind === 'ALS_XZ') {
      computeModularRingEliminations(cand, steps[0].view, out);
    } else {
      for (const item of steps[0].view.node.raw.intrinsicEliminations || []) {
        addElimination(out, cand, item.digit, [item.cell], 'als-xz');
      }
    }
  }

  // Every weak junction exposes a smaller chain between the two
  // non-connected edges. Keep those eliminations as the path grows instead
  // of waiting until only the outermost pair is evaluated.
  const junctionCount = isRing ? steps.length : steps.length - 1;
  for (let index = 0; index < junctionCount; index++) {
    const left = steps[index].view;
    const right = steps[(index + 1) % steps.length].view;
    computeType1(cand, left, right, out);
    computeType2(cand, left, right, out);
  }

  if (!isRing) {
    computeType1(cand, first, terminal, boundary);
    computeType2(cand, first, terminal, boundary);
    for (const item of boundary.values()) {
      for (const reason of item.reasons) {
        addElimination(out, cand, item.digit, [item.cell], reason);
      }
    }
  }

  if (isRing && !(steps.length === 1 && steps[0].view.node.raw.moduleKind === 'ALS_XZ')) {
    const evenRing = ringWeak !== null && steps.length % 2 === 0;
    for (let index = 0; index < steps.length; index++) {
      const left = steps[index].view;
      const nextIndex = (index + 1) % steps.length;
      const right = steps[nextIndex].view;
      const weak = index + 1 < steps.length
        ? directConnection(left, right)
        : ringWeak;
      computeLockedWeak(cand, left, right, weak, out);
      if (evenRing) computeEvenRingCellularWeak(cand, left, right, weak, out);
    }

    for (let leftIndex = 0; leftIndex < steps.length; leftIndex++) {
        const left = steps[leftIndex].view;
        for (let rightIndex = leftIndex + 1; rightIndex < steps.length; rightIndex++) {
          const right = steps[rightIndex].view;
          computeSameCellRing(cand, left.entry, right.entry, out);
          computeSameCellRing(cand, left.exit, right.exit, out);
          computeSameCellRing(cand, left.entry, right.exit, out);
          computeSameCellRing(cand, left.exit, right.entry, out);
        }
    }
  }

  return {
    eliminations: [...out.values()].sort((a, b) => a.cell - b.cell || a.digit - b.digit),
    boundaryEliminations: [...boundary.values()].sort((a, b) => a.cell - b.cell || a.digit - b.digit),
  };
}

function mergeEliminations(previous: ChainElimination[], additions: ChainElimination[]): ChainElimination[] {
  const merged = new Map<string, ChainElimination>();
  for (const item of [...previous, ...additions]) {
    const key = `${item.cell}:${item.digit}`;
    const existing = merged.get(key);
    if (existing) {
      existing.reasons = [...new Set([...existing.reasons, ...(item.reasons || [])])];
    } else {
      merged.set(key, { ...item, reasons: [...(item.reasons || [])] });
    }
  }
  return [...merged.values()]
    .sort((a, b) => a.cell - b.cell || a.digit - b.digit);
}

function onlyNewEliminations(
  additions: ChainElimination[],
  previous: ChainElimination[],
): ChainElimination[] {
  const previousKeys = new Set(previous.map(item => `${item.cell}:${item.digit}`));
  return additions.filter(item => !previousKeys.has(`${item.cell}:${item.digit}`));
}

function publicSide(side: ChainSide): PublicChainSide {
  return {
    side: side.name,
    cells: [...side.cells],
    digits: [...side.digits],
    sectorsByDigit: Object.fromEntries(
      Object.entries(side.sectorsByDigit).map(([digit, sectors]) => [digit, [...sectors]]),
    ),
    potentialElimByDigit: Object.fromEntries(
      Object.entries(side.potentialElimByDigit).map(([digit, cells]) => [digit, [...cells]]),
    ),
    swapDigits: [...side.swapDigits],
  };
}

function publicStep(step: SearchStep): PublicChainStep {
  const module = orientedModule(step.view);
  return {
    family: step.view.node.family,
    linkId: step.view.node.id,
    graphId: step.view.node.graphId,
    linkType: step.view.node.linkType,
    linkTypeName: step.view.node.linkTypeName,
    linkTypeNames: [...step.view.node.linkTypeNames],
    originSectors: [...step.view.node.originSector],
    moduleLabel: moduleLabelForView(step.view, module),
    module,
    direction: step.view.direction,
    entrySide: step.view.entry.name,
    exitSide: step.view.exit.name,
    entry: publicSide(step.view.entry),
    exit: publicSide(step.view.exit),
    weakIn: step.weakIn,
    weakInName: step.weakIn == null ? null : WEAK_TYPE_NAMES[step.weakIn],
    weakDigit: step.weakDigit,
  };
}

function chainValueToken(step: PublicChainStep): 'V' | 'L' {
  return step.family !== 'SL' || step.linkType === 4 || step.linkTypeName === 'ALS'
    ? 'V'
    : 'L';
}

function chainValuePattern(steps: readonly PublicChainStep[]): string {
  return steps.map(chainValueToken).join('');
}

function chainDigits(steps: readonly PublicChainStep[]): number[] {
  const digits: number[] = [];
  for (const step of steps) {
    digits.push(...step.entry.digits, ...step.exit.digits);
    if (step.weakDigit != null) digits.push(step.weakDigit);
  }
  return sortedUnique(digits);
}

function orientedOpenSteps(steps: readonly PublicChainStep[]): PublicChainStep[] {
  const pattern = chainValuePattern(steps);
  if (!pattern || pattern[0] === 'V' || pattern[pattern.length - 1] !== 'V') return [...steps];

  return [...steps].reverse().map(step => ({
    ...step,
    entrySide: step.exitSide,
    exitSide: step.entrySide,
    entry: { ...step.exit, side: 'left' },
    exit: { ...step.entry, side: 'right' },
  }));
}

function normalisedOpenPattern(steps: readonly PublicChainStep[]): string {
  return chainValuePattern(orientedOpenSteps(steps));
}

function originKinds(step: PublicChainStep): Set<'R' | 'C' | 'B'> {
  const kinds = new Set<'R' | 'C' | 'B'>();
  for (const sector of step.originSectors) {
    kinds.add(sector < 9 ? 'R' : sector < 18 ? 'C' : 'B');
  }
  return kinds;
}

function classifyTwoLinkXChain(steps: readonly PublicChainStep[]): string | null {
  if (steps.length !== 2 || steps.some(step => chainValueToken(step) !== 'L')) return null;
  if (chainDigits(steps).length !== 1) return null;

  const names = steps.flatMap(step => step.linkTypeNames ?? [step.linkTypeName]);
  const kinds = steps.map(originKinds);
  const lineKinds = kinds.map(value => value.has('R') ? 'R' : value.has('C') ? 'C' : 'B');
  const hasRow = lineKinds.includes('R');
  const hasCol = lineKinds.includes('C');

  if (names.every(name => name === 'BILOCAL')) {
    if (hasRow && hasCol) return '2-String Kite';
    if (lineKinds.every(kind => kind === 'R' || kind === 'C')
      && new Set(lineKinds).size === 1) return 'X-Wing';
  }
  if (names.some(name => name === 'ERI')) return 'Empty Rectangle';
  if (hasRow && hasCol) return 'Grouped 2-String Kite';
  return 'X-Chain';
}

function ringPatternMatches(pattern: string, target: string): boolean {
  if (pattern.length !== target.length) return false;
  const variants = [pattern, [...pattern].reverse().join('')];
  return variants.some(variant => [...variant].some((_, index) =>
    `${variant.slice(index)}${variant.slice(0, index)}` === target,
  ));
}

function structurePrefix(steps: readonly PublicChainStep[]): string {
  const hasAls = steps.some(step => step.family === 'ALS' && step.linkTypeName === 'ALS_RCC');
  const hasAhs = steps.some(step => step.family === 'AHS' && step.linkTypeName === 'AHS_RCC');
  if (hasAls && hasAhs) return 'ALC';
  if (hasAls) return 'ALS';
  if (hasAhs) return 'AHS';
  return '';
}

function prefixedStructureName(name: string, steps: readonly PublicChainStep[]): string {
  const prefix = structurePrefix(steps);
  return prefix ? `${prefix} - ${name}` : name;
}

function classifyChain(steps: readonly PublicChainStep[], isRing: boolean): string {
  const digits = chainDigits(steps);
  const groupedPrefix = structurePrefix(steps);

  if (isRing) {
    const pattern = chainValuePattern(steps);
    if (ringPatternMatches(pattern, 'VVVVL')) return prefixedStructureName('Y-Ring', steps);
    if (ringPatternMatches(pattern, 'VLVLL')) return prefixedStructureName('W-Ring', steps);
    if (ringPatternMatches(pattern, 'VVLL')) return prefixedStructureName('H2-Ring', steps);
    if (ringPatternMatches(pattern, 'VLLL')) return prefixedStructureName('M2-Ring', steps);
    if (ringPatternMatches(pattern, 'LLLLV')) return prefixedStructureName('Strong-Ring', steps);
    if (pattern && pattern.split('').every(token => token === 'L')) {
      return prefixedStructureName(`L${Math.max(1, digits.length)}-Ring`, steps);
    }
    return groupedPrefix ? `${groupedPrefix} - Ring` : 'AIC Ring';
  }

  const pattern = normalisedOpenPattern(steps);
  const simpleName = classifyTwoLinkXChain(steps);
  if (simpleName) return prefixedStructureName(simpleName, steps);
  if (pattern === 'VVV' && digits.length === 3) return prefixedStructureName('XY-Wing', steps);
  if (pattern === 'VLV' && digits.length === 2) return prefixedStructureName('W-Wing', steps);
  if (pattern === 'LVL' && digits.length === 2) return prefixedStructureName('S-Wing', steps);
  if (pattern === 'VVL' && digits.length >= 2) {
    return prefixedStructureName(`H${Math.min(3, digits.length)}-Wing`, steps);
  }
  if (pattern === 'VLL') {
    const oriented = orientedOpenSteps(steps);
    const shared = intersection(oriented[0].exit.digits, oriented[1].entry.digits)[0];
    const last = oriented[oriented.length - 1];
    const lastDigits = intersection(last.entry.digits, last.exit.digits);
    if (digits.length <= 2 && shared != null && lastDigits.includes(shared)) {
      return prefixedStructureName('H1-Wing', steps);
    }
    return prefixedStructureName(`M${Math.min(3, Math.max(2, digits.length))}-Wing`, steps);
  }
  if (pattern === 'LLL') {
    return prefixedStructureName(`L${Math.min(3, Math.max(1, digits.length))}-Wing`, steps);
  }
  if (pattern.split('').every(token => token === 'V') && steps.length >= 3) {
    return prefixedStructureName('XY-Chain', steps);
  }
  return groupedPrefix ? `${groupedPrefix} - Chain` : 'AIC';
}

function openPathKey(steps: SearchStep[], reverse: boolean): string {
  const parts: string[] = [];

  if (!reverse) {
    parts.push(viewSemanticKey(steps[0].view));
    for (let index = 1; index < steps.length; index++) {
      parts.push(stepWeakKey(steps[index]));
      parts.push(viewSemanticKey(steps[index].view));
    }
  } else {
    parts.push(viewSemanticKey(steps[steps.length - 1].view, true));
    for (let index = steps.length - 1; index > 0; index--) {
      parts.push(stepWeakKey(steps[index]));
      parts.push(viewSemanticKey(steps[index - 1].view, true));
    }
  }

  return parts.join('-');
}

function openEndpointKey(steps: SearchStep[]): string {
  const first = sideKey(steps[0].view.entry);
  const last = sideKey(steps[steps.length - 1].view.exit);
  const forward = `${first}>${last}`;
  const reversed = `${last}>${first}`;
  return forward <= reversed ? forward : reversed;
}

function ringEdgeKeys(steps: SearchStep[], ringWeak: WeakConnection | null): string[] {
  const edges: string[] = [];
  for (let index = 1; index < steps.length; index++) {
    edges[index - 1] = stepWeakKey(steps[index]);
  }
  edges[steps.length - 1] = connectionWeakKey(ringWeak);
  return edges;
}

function ringRotationKey(
  steps: SearchStep[],
  edgeKeys: string[],
  startIndex: number,
  reverse: boolean,
): string {
  const parts: string[] = [];
  const count = steps.length;
  let index = startIndex;

  for (let offset = 0; offset < count; offset++) {
    parts.push(viewSemanticKey(steps[index].view, reverse));

    if (reverse) {
      const previous = (index - 1 + count) % count;
      parts.push(edgeKeys[previous]);
      index = previous;
    } else {
      parts.push(edgeKeys[index]);
      index = (index + 1) % count;
    }
  }

  return parts.join('-');
}

function ringPathKey(steps: SearchStep[], ringWeak: WeakConnection | null): string {
  const edgeKeys = ringEdgeKeys(steps, ringWeak);
  let best: string | null = null;

  for (let index = 0; index < steps.length; index++) {
    const forward = ringRotationKey(steps, edgeKeys, index, false);
    const reversed = ringRotationKey(steps, edgeKeys, index, true);

    if (best === null || forward < best) best = forward;
    if (reversed < best) best = reversed;
  }

  return best || '';
}

function canonicalPathKey(steps: SearchStep[], isRing: boolean, ringWeak: WeakConnection | null = null): string {
  if (isRing) return `ring:${ringPathKey(steps, ringWeak)}`;

  const open = openPathKey(steps, false);
  const reversed = openPathKey(steps, true);
  return `open:${open <= reversed ? open : reversed}`;
}

function canonicalReportKey(steps: SearchStep[], isRing: boolean, ringWeak: WeakConnection | null = null): string {
  return canonicalPathKey(steps, isRing, ringWeak);
}

function eliminationsKey(eliminations: ChainElimination[]): string {
  return eliminations.map(item => `${item.digit}:${item.cell}`).join(';');
}

function addChainResult(
  chainsByKey: Map<string, ChainResultEntry>,
  steps: SearchStep[],
  eliminations: ChainElimination[],
  isRing: boolean,
  ringWeak: WeakConnection | null,
  ringClosureName: ChainResult['ringClosureName'] = null,
  ringClosureDigit: number | null = null,
): 'added' | 'duplicate' | 'empty' | 'replaced' {
  if (!eliminations.length) return 'empty';
  const key = `${canonicalReportKey(steps, isRing, ringWeak)}|${eliminationsKey(eliminations)}`;
  const rankKey = `${String(logicalDepth(steps)).padStart(3, '0')}|${canonicalPathKey(steps, isRing, ringWeak)}`;
  const publicSteps = steps.map(publicStep);
  const chain: ChainResult = {
    length: logicalDepth(steps),
    structureName: classifyChain(publicSteps, isRing),
    isRing,
    ringWeakType: ringWeak?.weakType ?? null,
    ringWeakTypeName: ringWeak ? WEAK_TYPE_NAMES[ringWeak.weakType] : null,
    ringWeakDigit: ringWeak?.digit ?? null,
    ringClosureName: ringClosureName || (ringWeak ? WEAK_TYPE_NAMES[ringWeak.weakType] : null),
    ringClosureDigit,
    eliminations,
    steps: publicSteps,
  };

  const existing = chainsByKey.get(key);
  if (existing) {
    if (rankKey < existing.rankKey) {
      chainsByKey.set(key, { rankKey, chain });
      return 'replaced';
    }

    return 'duplicate';
  }

  chainsByKey.set(key, { rankKey, chain });
  return 'added';
}

function normaliseOptions(options: ChainBuilderOptions): NormalisedOptions {
  return {
    includeStrong: options.includeStrong ?? true,
    includeAls: options.includeAls ?? true,
    includeAhs: options.includeAhs ?? false,
    strictAlsSingleCommon: options.strictAlsSingleCommon ?? true,
    strictAhsSingleCommon: options.strictAhsSingleCommon ?? false,
    strongLinkTypes: sortedUnique(
      (options.strongLinkTypes ?? [0, 1, 2, 3, 4])
        .filter(type => Number.isInteger(type) && type >= 0 && type <= 4),
    ),
    minAhsDof: Number.isInteger(options.minAhsDof) ? options.minAhsDof! : 1,
    maxAhsDof: Number.isInteger(options.maxAhsDof) ? options.maxAhsDof! : 3,
    maxAlsLinks: Number.isInteger(options.maxAlsLinks) ? options.maxAlsLinks! : 5000,
    maxAhsLinks: Number.isInteger(options.maxAhsLinks) ? options.maxAhsLinks! : 5000,
    maxDepth: Number.isInteger(options.maxDepth) ? Math.max(1, options.maxDepth!) : 6,
    maxChains: Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains!) : 200,
    maxResultAttempts: Number.isInteger(options.maxResultAttempts)
      ? Math.max(1, options.maxResultAttempts!)
      : Math.max(1000, (Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains!) : 200) * 50),
    maxResultAttemptsPerStart: Number.isInteger(options.maxResultAttemptsPerStart)
      ? Math.max(1, options.maxResultAttemptsPerStart!)
      : Math.max(100, Math.floor((Number.isInteger(options.maxResultAttempts)
        ? Math.max(1, options.maxResultAttempts!)
        : Math.max(1000, (Number.isInteger(options.maxChains) ? Math.max(1, options.maxChains!) : 200) * 50)) / 20)),
    maxStates: Number.isInteger(options.maxStates) ? Math.max(100, options.maxStates!) : 30000,
    maxQueue: Number.isInteger(options.maxQueue) ? Math.max(100, options.maxQueue!) : 30000,
    maxBranching: Number.isInteger(options.maxBranching) ? Math.max(1, options.maxBranching!) : 200,
    maxStartViews: Number.isInteger(options.maxStartViews) ? Math.max(1, options.maxStartViews!) : Infinity,
    strongLinkSet: options.strongLinkSet,
    alsLinkSet: options.alsLinkSet,
    ahsLinkSet: options.ahsLinkSet,
    alsList: options.alsList,
    ahsList: options.ahsList,
  };
}

export function findAicChains(cand: CandidateGrid, options: ChainBuilderOptions = {}): ChainReport {
  const opts = normaliseOptions(options);
  const inventory = buildLinkInventory(cand, opts);
  const graph = buildChainGraph(inventory.links);
  const chainsByKey = new Map<string, ChainResultEntry>();
  const stats: ChainStats = {
    strongLinks: inventory.counts.strong,
    alsLinks: inventory.counts.als,
    ahsLinks: inventory.counts.ahs,
    graphLinks: inventory.links.length,
    directedViews: graph.views.length,
    startViews: 0,
    statesVisited: 0,
    transitionsChecked: 0,
    transitionsAccepted: 0,
    resultAttempts: 0,
    duplicatesSuppressed: 0,
    startCapsHit: 0,
    chainsFound: 0,
    truncated: false,
    stopReason: null,
  };

  let stop = false;
  const noteResult = (outcome: 'added' | 'duplicate' | 'empty' | 'replaced'): boolean => {
    if (outcome === 'duplicate') stats.duplicatesSuppressed += 1;
    stats.chainsFound = chainsByKey.size;

    if (chainsByKey.size >= opts.maxChains) {
      stats.truncated = true;
      stats.stopReason = 'maxChains';
      stop = true;
      return true;
    }

    if (stats.resultAttempts >= opts.maxResultAttempts) {
      stats.truncated = true;
      stats.stopReason = 'maxResultAttempts';
      stop = true;
      return true;
    }

    return false;
  };

  for (const start of graph.views) {
    if (stop) break;
    if (stats.startViews >= opts.maxStartViews) {
      stats.truncated = true;
      stats.stopReason = 'maxStartViews';
      break;
    }
    stats.startViews += 1;

    let startResultAttempts = 0;
    let skipStart = false;
    const noteStartResult = (outcome: 'added' | 'duplicate' | 'empty' | 'replaced'): boolean => {
      if (noteResult(outcome)) return true;

      if (startResultAttempts >= opts.maxResultAttemptsPerStart) {
        stats.startCapsHit += 1;
        skipStart = true;
        return true;
      }

      return false;
    };

    const root: QueueNode = {
      view: start,
      steps: [{ view: start, weakIn: null, weakDigit: null }],
      visited: new Set([start.node.graphId]),
      usedAtoms: withViewAtoms(new Set(), start),
      eliminations: [],
    };

    const queue: QueueNode[] = [root];

    const rootBridgeWeak = modularRingWeak(root.view);
    const rootClosureDigit = rootBridgeWeak ? modularRingClosureDigit(cand, root.view, inventory.links) : null;
    const rootRingWeak = rootClosureDigit == null
      ? rootBridgeWeak
      : modularRingClosureWeak(root.view, rootClosureDigit);
    if (logicalDepth(root.steps) === opts.maxDepth
      && root.view.node.raw.intrinsicEliminations?.length) {
      const rootIsRing = rootBridgeWeak !== null && rootClosureDigit !== null;
      const rootEvaluation = evaluateChain(cand, root.steps, rootIsRing, rootRingWeak);
      if (rootEvaluation.eliminations.length) {
        stats.resultAttempts += 1;
        startResultAttempts += 1;
        if (noteStartResult(addChainResult(
          chainsByKey,
          root.steps,
          rootEvaluation.eliminations,
          rootIsRing,
          rootRingWeak,
          null,
          rootIsRing ? rootClosureDigit : null,
        ))) break;
      }
    }

    while (queue.length && !stop && !skipStart) {
      if (stats.statesVisited >= opts.maxStates) {
        stats.truncated = true;
        stats.stopReason = 'maxStates';
        stop = true;
        break;
      }

      const current = queue.shift()!;
      stats.statesVisited += 1;
      const currentDepth = logicalDepth(current.steps);
      if (currentDepth >= opts.maxDepth) continue;

      for (const edge of expandFrom(current.view, graph, stats, opts)) {
        if (current.visited.has(edge.target.node.graphId)) continue;
        if (viewUsesKnownAtom(current.usedAtoms, edge.target)) continue;

        stats.transitionsAccepted += 1;
        const nextSteps = [
          ...current.steps,
          { view: edge.target, weakIn: edge.weakType, weakDigit: edge.digit },
        ];
        const nextDepth = logicalDepth(nextSteps);
        if (nextDepth > opts.maxDepth) continue;
        const openEvaluation = evaluateChain(cand, nextSteps, false);
        const openElims = mergeEliminations(current.eliminations, openEvaluation.eliminations);
        if (openEvaluation.boundaryEliminations.length) {
          stats.resultAttempts += 1;
          startResultAttempts += 1;
          if (noteStartResult(addChainResult(chainsByKey, nextSteps, openElims, false, null))) break;
        }

        // Two link modules are enough for a closed ring: the final module
        // connects back to the starting module's entry side.
        const ringWeak = nextSteps.length >= 2 ? directConnection(edge.target, start) : null;
        const ringOverlapElims = !ringWeak && nextSteps.length > 2
          ? computeOverlapRingEliminations(cand, edge.target, start)
          : null;
        if (ringWeak || ringOverlapElims !== null) {
          const ringElims = mergeEliminations(
            evaluateChain(cand, nextSteps, true, ringWeak).eliminations,
            ringOverlapElims || [],
          );
          const newRingElims = onlyNewEliminations(ringElims, current.eliminations);
          if (newRingElims.length) {
            stats.resultAttempts += 1;
            startResultAttempts += 1;
            const closureName = ringWeak ? null : 'OVERLAP';
            if (noteStartResult(addChainResult(
              chainsByKey,
              nextSteps,
              ringElims,
              true,
              ringWeak,
              closureName,
            ))) break;
          }
        }

        if (nextDepth < opts.maxDepth) {
          if (queue.length >= opts.maxQueue) {
            stats.truncated = true;
            stats.stopReason = 'maxQueue';
            stop = true;
            break;
          }

          const visited = new Set(current.visited);
          visited.add(edge.target.node.graphId);
          queue.push({
            view: edge.target,
            steps: nextSteps,
            visited,
            usedAtoms: withViewAtoms(current.usedAtoms, edge.target),
            eliminations: openElims,
          });
        }
      }
    }
  }

  const chains = [...chainsByKey.values()]
    .sort((a, b) =>
      a.chain.length - b.chain.length
      || a.chain.eliminations.length - b.chain.eliminations.length
      || a.rankKey.localeCompare(b.rankKey)
    )
    .map(entry => entry.chain);
  stats.chainsFound = chains.length;

  return {
    chains,
    stats,
    linkSets: inventory.source,
  };
}

function sideLabel(side: PublicChainSide): string {
  const digits = side.digits.length ? side.digits.join('') : '?';
  const cells = side.cells.length ? cellGroupName(side.cells) : 'none';
  return `(${digits}) ${cells}`;
}

function endpointSideName(step: PublicChainStep, side: PublicChainSide): string {
  if ((step.family === 'ALS' || step.family === 'AHS') && step.linkTypeName.endsWith('_RCC')) {
    return side.side === 'left' ? 'RCC_L' : 'RCC_R';
  }
  return side.side;
}

function endpointLabel(step: PublicChainStep, side: PublicChainSide): string {
  return `${endpointSideName(step, side)} ${sideLabel(side)}`;
}

function stepLabel(step: PublicChainStep): string {
  const module = step.moduleLabel ? ` [${step.moduleLabel}]` : '';
  return `${step.family}#${step.linkId} ${step.direction} ${step.linkTypeName}${module} `
    + `${endpointLabel(step, step.entry)} -> ${endpointLabel(step, step.exit)}`;
}

export function formatChainVerbose(chain: ChainResult): string {
  const parts: string[] = [];
  for (let index = 0; index < chain.steps.length; index++) {
    const step = chain.steps[index];
    if (index > 0) {
      const weak = step.weakDigit
        ? `${step.weakInName} d${step.weakDigit}`
        : step.weakInName;
      parts.push(`--${weak}--`);
    }
    parts.push(stepLabel(step));
  }

  if (chain.isRing) {
    const weak = chain.ringWeakDigit
      ? `${chain.ringWeakTypeName} d${chain.ringWeakDigit}`
      : chain.ringClosureName;
    if (weak) parts.push(`--${weak} ring--`);
  }

  return `${chain.structureName} ${chain.length}: `
    + `${parts.join(' ')} => ${formatRemovals(chain.eliminations)}`;
}

function eurekaSideText(side: PublicChainSide): string {
  const digits = eurekaDigitsText(side.digits);
  const cells = side.cells.length ? cellGroupName(side.cells) : 'none';
  return `(${digits})${cells}`;
}

function eurekaDigitsText(digits: number[] | null | undefined): string {
  return digits && digits.length ? digits.join('') : '?';
}

type EurekaUnit = { side: PublicChainSide; text?: never } | { text: string; side?: never };

function eurekaUnitText(unit: EurekaUnit): string {
  if ('text' in unit) return unit.text;
  return eurekaSideText(unit.side);
}

function sameEurekaLocation(left: PublicChainSide, right: PublicChainSide): boolean {
  return left.cells.length > 0
    && left.cells.length === right.cells.length
    && cellsKey(left.cells) === cellsKey(right.cells);
}

function rccSubsetEurekaUnits(step: PublicChainStep): EurekaUnit[] | null {
  const module = step.module;
  if ((step.family !== 'ALS' && step.family !== 'AHS') || !step.linkTypeName.endsWith('_RCC') || !module?.common) return null;

  const entrySubset = module.entrySideSubset
    || module.entrySideLs
    || module.entrySideHs
    || module.entrySubset
    || module.entryLs
    || module.entryHs;
  const exitSubset = module.exitSideSubset
    || module.exitSideLs
    || module.exitSideHs
    || module.exitSubset
    || module.exitLs
    || module.exitHs;
  if (!entrySubset || !exitSubset) return null;

  if (module.moduleKind === 'ALS_XZ') {
    const bridgeRcc = module.displayRightRcc;
    if (bridgeRcc == null) return null;
    return [
      {
        text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== bridgeRcc))}=${eurekaDigitsText([bridgeRcc])})${cellGroupName(entrySubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText([bridgeRcc])}=${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== bridgeRcc))})${cellGroupName(exitSubset.cells)}`,
      },
    ];
  }

  const commonDigits = sortedUnique(module.common.digits);
  const restrictedDigits = module.common.restrictedDigits.length
    ? sortedUnique(module.common.restrictedDigits)
    : commonDigits;
  const restrictedSet = new Set(restrictedDigits);
  const exitDigits = sortedUnique(exitSubset.digits);
  const exitRemainder = sortedUnique(exitDigits.filter(digit => !restrictedSet.has(digit)));

  return [
    {
      text: `(${eurekaDigitsText(commonDigits)}=${eurekaDigitsText(step.entry.digits)})${cellGroupName(entrySubset.cells)}`,
    },
    {
      text: `(${eurekaDigitsText(restrictedDigits)}=${eurekaDigitsText(exitRemainder)})${cellGroupName(exitSubset.cells)}`,
    },
  ];
}

function compactEurekaUnits(
  nodes: EurekaUnit[],
  connectors: string[],
): Array<{ text: string; endIndex: number }> {
  const units: Array<{ text: string; endIndex: number }> = [];

  for (let index = 0; index < nodes.length; index++) {
    const unit = nodes[index];
    const next = nodes[index + 1];

    if (next && unit.side && next.side && sameEurekaLocation(unit.side, next.side)) {
      const side = unit.side;
      const leftDigits = eurekaDigitsText(side.digits);
      const rightDigits = eurekaDigitsText(next.side.digits);
      units.push({
        text: `(${leftDigits}${connectors[index]}${rightDigits})${cellGroupName(side.cells)}`,
        endIndex: index + 1,
      });
      index += 1;
    } else {
      units.push({ text: eurekaUnitText(unit), endIndex: index });
    }
  }

  return units;
}

function pushEurekaUnit(
  nodes: EurekaUnit[],
  connectors: string[],
  unit: EurekaUnit,
  connectorBefore: string | null = null,
): void {
  if (nodes.length && connectorBefore) connectors.push(connectorBefore);
  nodes.push(unit);
}

function appendStepEureka(
  nodes: EurekaUnit[],
  connectors: string[],
  step: PublicChainStep,
  index: number,
): void {
  const expandedSubset = rccSubsetEurekaUnits(step);
  const weakConnector = index === 0 ? null : '-';

  if (expandedSubset) {
    pushEurekaUnit(nodes, connectors, expandedSubset[0], weakConnector);
    pushEurekaUnit(nodes, connectors, expandedSubset[1], '-');
    return;
  }

  pushEurekaUnit(nodes, connectors, { side: step.entry }, weakConnector);
  pushEurekaUnit(nodes, connectors, { side: step.exit }, '=');
}

function modularRingEurekaUnits(
  step: PublicChainStep,
  closureDigit: number | null,
): EurekaUnit[] | null {
  const module = step.module;
  if (step.family !== 'ALS' || !module || module.moduleKind !== 'ALS_XZ') return null;

  const entrySubset = module.entrySideSubset;
  const exitSubset = module.exitSideSubset;
  const endpointRcc = module.displayLeftRcc;
  const bridgeDigit = module.displayRightRcc;
  if (!entrySubset || !exitSubset || endpointRcc == null || bridgeDigit == null) return null;

  const closureDigits = intersection(entrySubset.digits, exitSubset.digits)
    .filter(digit => digit !== endpointRcc && digit !== bridgeDigit);

  if (closureDigit === endpointRcc) {
    return [
      {
        text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== bridgeDigit))}=${eurekaDigitsText([bridgeDigit])})${cellGroupName(entrySubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText([bridgeDigit])}=${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== bridgeDigit))})${cellGroupName(exitSubset.cells)}`,
      },
      {
        text: `(${eurekaDigitsText([closureDigit])}=${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== closureDigit))})${cellGroupName(entrySubset.cells)}`,
      },
    ];
  }

  if (closureDigit == null || closureDigits.length !== 1 || closureDigits[0] !== closureDigit) return null;

  return [
    {
      text: `(${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== endpointRcc))}=${eurekaDigitsText([endpointRcc])})${cellGroupName(entrySubset.cells)}`,
    },
    {
      text: `(${eurekaDigitsText([endpointRcc])})(${eurekaDigitsText(exitSubset.digits.filter(digit => digit !== endpointRcc))})${cellGroupName(exitSubset.cells)}`,
    },
    {
      text: `(${eurekaDigitsText([closureDigit])}=${eurekaDigitsText(entrySubset.digits.filter(digit => digit !== closureDigit))})${cellGroupName(entrySubset.cells)}`,
    },
  ];
}

function eurekaConnectorText(connector: string): string {
  return connector === '-' ? ' - ' : connector;
}

export function formatChainEureka(chain: ChainResult): string {
  const nodes: EurekaUnit[] = [];
  const connectors: string[] = [];
  const modularRing = chain.isRing && chain.steps.length === 1
    ? modularRingEurekaUnits(chain.steps[0], chain.ringClosureDigit)
    : null;

  if (modularRing) {
    pushEurekaUnit(nodes, connectors, modularRing[0]);
    pushEurekaUnit(nodes, connectors, modularRing[1], '-');
    pushEurekaUnit(nodes, connectors, modularRing[2], '-');
  } else {
    for (let index = 0; index < chain.steps.length; index++) {
      appendStepEureka(nodes, connectors, chain.steps[index], index);
    }
  }

  if (chain.isRing && chain.steps.length && !modularRing) {
    if (chain.steps[0].module?.moduleKind !== 'ALS_XZ') {
      connectors.push('-');
      const firstModule = rccSubsetEurekaUnits(chain.steps[0]);
      nodes.push(firstModule?.[0] || { side: chain.steps[0].entry });
    }
  }

  const units = compactEurekaUnits(nodes, connectors);
  const body = units.map((unit, index) => {
    const connector = index < units.length - 1 ? connectors[unit.endIndex] : '';
    return unit.text + eurekaConnectorText(connector);
  }).join('');

  return `${chain.structureName}: ${body} => ${formatRemovals(chain.eliminations)}`;
}

export const formatChain = formatChainEureka;

export const findChains = findAicChains;
