import { UNITS } from './cardinals';
import { ahsConstructor, type Ahs } from './ahs';
import { combinations, intersection, sortedUnique } from './set-tools';
import { peersOf, type CandidateGrid } from './sudoku';
import { buildStrongLinks, flattenStrongLinks, type StrongLink, type StrongLinkSet } from './strong-link';

export const AHS_RCC = 6;
export const AHS_LINK_TYPE_NAMES = [
  'BILOCAL',
  'CELL_TO_GROUP',
  'GROUP_TO_GROUP',
  'ERI',
  'ALS',
  'ALS_RCC',
  'AHS_RCC',
] as const;

export interface AhsEndpoint {
  ahsId: string;
  sourceDof: number;
  effectiveDof: number;
  dofKeys: number[];
  triggerKind: 'CELL' | 'MINI_SECTOR';
  triggerLinkId: number | null;
  triggerSectors: number[];
  digits: number[];
  cells: number[];
  sectors: number[];
  potentialElim: number[];
  hiddenDigits: number[];
  hiddenCells: number[];
  digitCells: Record<string, number[]>;
  hiddenDigitCells: Record<string, number[]>;
}

export interface AhsSetNode {
  uniqueID: string;
  sector: number;
  cells: number[];
  digits: number[];
  originalCells: number[];
  size: number;
  fox: number;
  dof: number;
  effectiveDof: number;
  dofKeys: number[];
  triggerKind: 'CELL' | 'MINI_SECTOR';
  powerSet: number;
}

export interface AhsBridge {
  digit: number;
  leftCells: number[];
  rightCells: number[];
  sectors: number[];
}

export interface AhsStrongLink {
  id: number;
  linkType: number;
  linkTypeName: string;
  originSector: number[];
  startingDigits: number[];
  activeCells: number[];
  linkedCells: number[];
  linkDigits: number[];
  startCellsSector: Record<string, number[]>;
  linkCellsSector: Record<string, number[]>;
  startDigitSwapAvailable: number[];
  endDigitSwapAvailable: number[];
  potentialElimStart: Record<string, number[]>;
  potentialElimEnd: Record<string, number[]>;
  rightWeakLinks: unknown[];
  leftWeakLinks: unknown[];
  RCC_Left: AhsEndpoint;
  HS_L: AhsSetNode;
  C: AhsBridge;
  HS_R: AhsSetNode;
  RCC_Right: AhsEndpoint;
}

export type AhsLinkSet = AhsStrongLink[][];

export interface AhsLinkBuilderOptions {
  ahsList?: Ahs[];
  strongLinkSet?: StrongLinkSet;
  minDof?: number;
  maxDof?: number;
  strictSingleCommon?: boolean;
  maxLinks?: number;
}

let nextAhsLinkId = 0;

interface EndpointEntry {
  index: number;
  ahs: Ahs;
  endpoints: AhsEndpoint[];
}

interface BridgeRef {
  entry: EndpointEntry;
  endpoint: AhsEndpoint;
  digit: number;
  cells: number[];
  sector: number;
}

interface BridgePair {
  leftEntry: EndpointEntry;
  rightEntry: EndpointEntry;
  left: AhsEndpoint;
  right: AhsEndpoint;
  bridge: AhsBridge;
}

function commonSectors(cells: readonly number[]): number[] {
  if (!cells.length) return [];
  return UNITS
    .map((unit, sector) => cells.every(cell => unit.includes(cell)) ? sector : -1)
    .filter(sector => sector >= 0);
}

function endpointSectors(ahs: Ahs, cells: readonly number[], triggerSectors: readonly number[] = []): number[] {
  return sortedUnique([ahs.ahsSector, ...triggerSectors, ...commonSectors(cells)]);
}

function cellsSeeEachOther(left: readonly number[], right: readonly number[]): boolean {
  return !!left.length
    && !!right.length
    && left.every(a => right.every(b => a === b || peersOf(a).includes(b)));
}

function outsideDigitsByCell(ahs: Ahs): Map<number, number[]> {
  const out = new Map<number, number[]>();
  for (const rcc of ahs.rccList) {
    const digits = sortedUnique(rcc.rccDigits).filter(digit => !ahs.ahsDigits.includes(digit));
    if (digits.length) out.set(rcc.rccCell, digits);
  }
  return out;
}

function hiddenCellsAfterRemoving(
  cand: CandidateGrid,
  ahs: Ahs,
  removedCells: readonly number[],
): number[] | null {
  const removed = new Set(removedCells);
  const remaining = ahs.ahsAllCells.filter(cell => !removed.has(cell));
  if (remaining.length !== ahs.ahsDigits.length) return null;

  for (const digit of ahs.ahsDigits) {
    if (!remaining.some(cell => (cand[cell] ?? []).includes(digit))) return null;
  }

  return remaining;
}

function buildEndpoint(
  cand: CandidateGrid,
  ahs: Ahs,
  triggerCells: readonly number[],
  removedCells: readonly number[],
  digits: readonly number[],
  digitCells: Record<string, number[]>,
  triggerKind: 'CELL' | 'MINI_SECTOR',
  triggerLinkId: number | null,
  triggerSectors: readonly number[],
  effectiveDof: number,
): AhsEndpoint | null {
  const hiddenCells = hiddenCellsAfterRemoving(cand, ahs, removedCells);
  if (!hiddenCells) return null;
  const endpointDigits = sortedUnique(digits);
  if (!endpointDigits.length) return null;

  const hiddenDigitCells: Record<string, number[]> = {};
  for (const digit of ahs.ahsDigits) {
    const cellsWithDigit = removedCells.filter(cell => (cand[cell] ?? []).includes(digit));
    if (cellsWithDigit.length) hiddenDigitCells[digit] = cellsWithDigit;
  }

  return {
    ahsId: ahs.uniqueID,
    sourceDof: ahs.ahsDOF,
    effectiveDof,
    dofKeys: sortedUnique([effectiveDof, ahs.ahsDOF]),
    triggerKind,
    triggerLinkId,
    triggerSectors: sortedUnique(triggerSectors),
    digits: endpointDigits,
    cells: [...triggerCells].sort((a, b) => a - b),
    sectors: endpointSectors(ahs, triggerCells, triggerSectors),
    potentialElim: [...triggerCells].sort((a, b) => a - b),
    hiddenDigits: [...ahs.ahsDigits],
    hiddenCells,
    digitCells,
    hiddenDigitCells,
  };
}

function buildEndpoints(cand: CandidateGrid, ahs: Ahs, strongLinks: readonly StrongLink[]): AhsEndpoint[] {
  if (ahs.ahsDigits.length <= 1) return [];
  if (ahs.ahsDOF < 1 || ahs.ahsDOF > 3) return [];

  const outsideByCell = outsideDigitsByCell(ahs);
  const eligibleCells = ahs.ahsAllCells.filter(cell => (outsideByCell.get(cell) ?? []).length > 0);
  const endpoints: AhsEndpoint[] = [];

  if (eligibleCells.length >= ahs.ahsDOF) {
    for (const cells of combinations(eligibleCells, ahs.ahsDOF)) {
      const digitCells: Record<string, number[]> = {};
      for (const cell of cells) {
        for (const digit of outsideByCell.get(cell) ?? []) {
          if (!digitCells[digit]) digitCells[digit] = [];
          digitCells[digit].push(cell);
        }
      }
      const endpoint = buildEndpoint(
        cand,
        ahs,
        cells,
        cells,
        Object.keys(digitCells).map(Number),
        digitCells,
        'CELL',
        null,
        [],
        ahs.ahsDOF,
      );
      if (endpoint) endpoints.push(endpoint);
    }
  }

  if (ahs.ahsDOF > 1) {
    for (const link of strongLinks) {
      if (link.startingDigits.length !== 1 || link.linkDigits.length !== 1) continue;
      if (link.startingDigits[0] !== link.linkDigits[0]) continue;

      for (const triggerCells of [link.activeCells, link.linkedCells]) {
        if (triggerCells.length <= 1) continue;
        if (triggerCells.length !== ahs.ahsDOF) continue;
          if (!triggerCells.every(cell => ahs.ahsAllCells.includes(cell))) continue;

          const digit = link.startingDigits[0];
          if (ahs.ahsDigits.includes(digit)) continue;
          const digitCells: Record<string, number[]> = { [digit]: [...triggerCells] };
        const endpoint = buildEndpoint(
          cand,
          ahs,
          triggerCells,
          triggerCells,
          [digit],
          digitCells,
          'MINI_SECTOR',
          link.id,
          link.originSector,
          1,
        );
        if (endpoint) endpoints.push(endpoint);
      }
    }
  }

  const seen = new Set<string>();
  return endpoints.filter(endpoint => {
    const key = endpointKey(endpoint);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function hsNode(ahs: Ahs, endpoint: AhsEndpoint): AhsSetNode {
  return {
    uniqueID: ahs.uniqueID,
    sector: ahs.ahsSector,
    cells: [...endpoint.hiddenCells],
    digits: [...ahs.ahsDigits],
    originalCells: [...ahs.ahsAllCells],
    size: ahs.ahsSize,
    fox: ahs.ahsFOX,
    dof: ahs.ahsDOF,
    effectiveDof: endpoint.effectiveDof,
    dofKeys: [...endpoint.dofKeys],
    triggerKind: endpoint.triggerKind,
    powerSet: ahs.PowerSet,
  };
}

function digitSectorMap(endpoint: AhsEndpoint): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const digit of endpoint.digits) out[digit] = [...endpoint.sectors];
  return out;
}

function hiddenEliminationMap(endpoint: AhsEndpoint): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const digit of endpoint.hiddenDigits) out[digit] = [...(endpoint.hiddenDigitCells[digit] ?? [])];
  return out;
}

function endpointKey(endpoint: AhsEndpoint): string {
  return [
    endpoint.ahsId,
    endpoint.cells.join(','),
    endpoint.digits.join(','),
    endpoint.triggerKind,
    endpoint.triggerLinkId ?? '',
  ].join('|');
}

function linkKey(link: AhsStrongLink): string {
  return [
    link.linkType,
    link.HS_L.uniqueID,
    link.HS_R.uniqueID,
    link.C.digit,
    link.C.leftCells.join(','),
    link.C.rightCells.join(','),
    link.activeCells.join(','),
    link.startingDigits.join(','),
    link.linkedCells.join(','),
    link.linkDigits.join(','),
  ].join('|');
}

function addUnique(
  bucket: AhsStrongLink[],
  seen: Set<string>,
  link: AhsStrongLink,
  maxLinks?: number,
): boolean {
  if (maxLinks !== undefined && seen.size >= maxLinks) return false;
  const key = linkKey(link);
  if (seen.has(key)) return true;
  seen.add(key);
  bucket.push(link);
  return true;
}

function buildLink(
  left: AhsEndpoint,
  right: AhsEndpoint,
  leftNode: AhsSetNode,
  bridge: AhsBridge,
  rightNode: AhsSetNode,
): AhsStrongLink {
  return {
    id: nextAhsLinkId++,
    linkType: AHS_RCC,
    linkTypeName: 'AHS_RCC',
    originSector: [...bridge.sectors],
    startingDigits: [...left.digits],
    activeCells: [...left.cells],
    linkedCells: [...right.cells],
    linkDigits: [...right.digits],
    startCellsSector: digitSectorMap(left),
    linkCellsSector: digitSectorMap(right),
    startDigitSwapAvailable: [...left.hiddenDigits],
    endDigitSwapAvailable: [...right.hiddenDigits],
    potentialElimStart: hiddenEliminationMap(left),
    potentialElimEnd: hiddenEliminationMap(right),
    rightWeakLinks: [],
    leftWeakLinks: [],
    RCC_Left: left,
    HS_L: leftNode,
    C: bridge,
    HS_R: rightNode,
    RCC_Right: right,
  };
}

function indexedBridgeRefs(entries: readonly EndpointEntry[]): Map<string, BridgeRef[]> {
  const refsByKey = new Map<string, BridgeRef[]>();

  for (const entry of entries) {
    for (const endpoint of entry.endpoints) {
      for (const digit of endpoint.digits) {
        const cells = endpoint.digitCells[digit] ?? [];
        for (const sector of commonSectors(cells)) {
          const key = `${digit}|${sector}`;
          const refs = refsByKey.get(key) ?? [];
          refs.push({ entry, endpoint, digit, cells, sector });
          refsByKey.set(key, refs);
        }
      }
    }
  }

  return refsByKey;
}

function makeBridgePair(leftRef: BridgeRef, rightRef: BridgeRef): BridgePair | null {
  if (leftRef.entry.index === rightRef.entry.index) return null;
  if (!cellsSeeEachOther(leftRef.cells, rightRef.cells)) return null;

  const [left, right] = leftRef.entry.index < rightRef.entry.index
    ? [leftRef, rightRef]
    : [rightRef, leftRef];

  return {
    leftEntry: left.entry,
    rightEntry: right.entry,
    left: left.endpoint,
    right: right.endpoint,
    bridge: {
      digit: left.digit,
      leftCells: [...left.cells],
      rightCells: [...right.cells],
      sectors: sortedUnique([
        left.sector,
        ...intersection(left.endpoint.sectors, right.endpoint.sectors),
        ...commonSectors([...left.cells, ...right.cells]),
      ]),
    },
  };
}

function addLinksForBridgePair(
  bucket: AhsStrongLink[],
  seen: Set<string>,
  bridgePair: BridgePair,
  maxLinks?: number,
): boolean {
  const leftBridgeKey = endpointKey(bridgePair.left);
  const rightBridgeKey = endpointKey(bridgePair.right);
  const leftNode = hsNode(bridgePair.leftEntry.ahs, bridgePair.left);
  const rightNode = hsNode(bridgePair.rightEntry.ahs, bridgePair.right);

  for (const leftEndpoint of bridgePair.leftEntry.endpoints) {
    if (endpointKey(leftEndpoint) === leftBridgeKey) continue;
    for (const rightEndpoint of bridgePair.rightEntry.endpoints) {
      if (endpointKey(rightEndpoint) === rightBridgeKey) continue;
      const link = buildLink(leftEndpoint, rightEndpoint, leftNode, bridgePair.bridge, rightNode);
      if (!addUnique(bucket, seen, link, maxLinks)) return false;
    }
  }

  return true;
}

function indexedBridgePairs(entries: readonly EndpointEntry[]): Map<string, BridgePair[]> {
  const refsByKey = indexedBridgeRefs(entries);
  const pairs = new Map<string, BridgePair[]>();

  for (const refs of refsByKey.values()) {
    for (let leftIndex = 0; leftIndex < refs.length; leftIndex++) {
      const leftRef = refs[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < refs.length; rightIndex++) {
        const rightRef = refs[rightIndex];
        const bridgePair = makeBridgePair(leftRef, rightRef);
        if (!bridgePair) continue;

        const key = `${bridgePair.leftEntry.index}|${bridgePair.rightEntry.index}`;
        const list = pairs.get(key) ?? [];
        list.push(bridgePair);
        pairs.set(key, list);
      }
    }
  }

  return pairs;
}

export function buildAhsLinks(
  cand: CandidateGrid,
  options: AhsLinkBuilderOptions = {},
): AhsLinkSet {
  nextAhsLinkId = 0;
  const opts = {
    minDof: Number.isInteger(options.minDof) ? Math.max(1, options.minDof!) : 1,
    maxDof: Number.isInteger(options.maxDof) ? Math.min(3, Math.max(1, options.maxDof!)) : 3,
    strictSingleCommon: options.strictSingleCommon ?? false,
    maxLinks: Number.isInteger(options.maxLinks) && options.maxLinks! > 0 ? options.maxLinks : undefined,
  };
  const ahsList = options.ahsList ?? ahsConstructor(cand, { maxSize: 8, maxSizeFox: 7 });
  const strongLinks = flattenStrongLinks(options.strongLinkSet ?? buildStrongLinks(cand));
  const buckets: AhsLinkSet = Array.from({ length: AHS_RCC + 1 }, () => []);
  const endpointEntries = ahsList
    .map((ahs, index) => ({
      index,
      ahs,
      endpoints: buildEndpoints(cand, ahs, strongLinks)
        .filter(endpoint => endpoint.dofKeys.some(dof => dof >= opts.minDof && dof <= opts.maxDof)),
    }))
    .filter(entry => entry.endpoints.length > 1);
  const seen = new Set<string>();

  if (!opts.strictSingleCommon) {
    for (const refs of indexedBridgeRefs(endpointEntries).values()) {
      for (let leftIndex = 0; leftIndex < refs.length; leftIndex++) {
        for (let rightIndex = leftIndex + 1; rightIndex < refs.length; rightIndex++) {
          const bridgePair = makeBridgePair(refs[leftIndex], refs[rightIndex]);
          if (!bridgePair) continue;
          if (!addLinksForBridgePair(buckets[AHS_RCC], seen, bridgePair, opts.maxLinks)) return buckets;
        }
      }
    }

    return buckets;
  }

  const bridgePairs = indexedBridgePairs(endpointEntries);

  for (const candidates of bridgePairs.values()) {
    if (opts.strictSingleCommon && candidates.length !== 1) continue;

    for (const bridgePair of candidates) {
      if (!addLinksForBridgePair(buckets[AHS_RCC], seen, bridgePair, opts.maxLinks)) return buckets;
    }
  }

  return buckets;
}

export function flattenAhsLinks(linkset: AhsLinkSet): AhsStrongLink[] {
  return linkset.flat();
}
