
    const core = window.StormDoku;
    const boardEl = document.getElementById('board');
    const digitFocusButtonsEl = document.getElementById('digitFocusButtons');
    const candidateSizeFilterButtonsEl = document.getElementById('candidateSizeFilterButtons');
    const clearDigitFilterEl = document.getElementById('clearDigitFilter');
    const limitDigitHighlightsToSizeEl = document.getElementById('limitDigitHighlightsToSize');
    const gridColumnTitleEl = document.getElementById('gridColumnTitle');
    const gridColumnNumbersEl = document.getElementById('gridColumnNumbers');
    const gridRowHeaderEl = document.getElementById('gridRowHeader');
    const gridViewSelector = document.getElementById('gridViewSelector');
    const showFixedInVantageEl = document.getElementById('showFixedInVantage');
    const givensEl = document.getElementById('givens');
    const generationDifficultyEl = document.getElementById('generationDifficulty');
    const inputEl = document.getElementById('input');
    const examplesPanelEl = document.getElementById('examplesPanel');
    const manualModeEl = document.getElementById('manualMode');
    const loadEl = document.getElementById('load');
    const resetEl = document.getElementById('reset');
    const importEl = document.getElementById('import');
    const scanImageEl = document.getElementById('scanImage');
    const ocrImageInputEl = document.getElementById('ocrImageInput');
    const ocrDialogEl = document.getElementById('ocrDialog');
    const ocrPreviewEl = document.getElementById('ocrPreview');
    const ocrStatusEl = document.getElementById('ocrStatus');
    const ocrResultEl = document.getElementById('ocrResult');
    const ocrCancelEl = document.getElementById('ocrCancel');
    const ocrLoadEl = document.getElementById('ocrLoad');
    const statusEl = document.getElementById('status');
    const searchDiagnosticsEl = document.getElementById('searchDiagnostics');
    const puzzleStringEl = document.getElementById('puzzleString');
    const puzzleStateMetaEl = document.getElementById('puzzleStateMeta');
    const copyPuzzle81El = document.getElementById('copyPuzzle81');
    const copyPuzzle729El = document.getElementById('copyPuzzle729');
    const copyPuzzle81LinkEl = document.getElementById('copyPuzzle81Link');
    const copyPuzzle729LinkEl = document.getElementById('copyPuzzle729Link');
    const solutionStringEl = document.getElementById('solutionString');
    const solutionPanelEl = document.getElementById('solutionPanel');
    const ratingSummaryEl = document.getElementById('ratingSummary');
    const ratingCategoryEl = document.getElementById('ratingCategory');
    const ratingDetailEl = document.getElementById('ratingDetail');
    const ratingStepCountEl = document.getElementById('ratingStepCount');
    const ratingHardestMoveEl = document.getElementById('ratingHardestMove');
    const difficultyTableEl = document.getElementById('difficultyTable');
    const difficultyFlowListEl = document.getElementById('difficultyFlowList');
    const solutionStepsPanelEl = document.getElementById('solutionStepsPanel');
    const solutionStepsPreviewEl = document.getElementById('solutionStepsPreview');
    const solutionCopyEurekaEl = document.getElementById('solutionCopyEureka');
    const solutionCopyListEl = document.getElementById('solutionCopyList');
    const applyHighlightedMoveEl = document.getElementById('applyHighlightedMove');
    const clearHighlightEl = document.getElementById('clearHighlight');
    const variantDiagonalEl = document.getElementById('variantDiagonal');
    const variantAntiDiagonalEl = document.getElementById('variantAntiDiagonal');
    const variantWindokuEl = document.getElementById('variantWindoku');
    const variantAntiKingEl = document.getElementById('variantAntiKing');
    const variantAntiKnightEl = document.getElementById('variantAntiKnight');
    const variantNonConsecutiveEl = document.getElementById('variantNonConsecutive');
    const toyStackSwapEl = document.getElementById('toyStackSwap');
    const toyBandSwapEl = document.getElementById('toyBandSwap');
    const toyRowSwapEl = document.getElementById('toyRowSwap');
    const toyColumnSwapEl = document.getElementById('toyColumnSwap');
    const toyDigitAEl = document.getElementById('toyDigitA');
    const toyDigitBEl = document.getElementById('toyDigitB');
    const toyStackSwapButtonEl = document.getElementById('toyStackSwapButton');
    const toyBandSwapButtonEl = document.getElementById('toyBandSwapButton');
    const toyRowSwapButtonEl = document.getElementById('toyRowSwapButton');
    const toyColumnSwapButtonEl = document.getElementById('toyColumnSwapButton');
    const toyDigitSwapButtonEl = document.getElementById('toyDigitSwapButton');
    const toyAutomorphSearchEl = document.getElementById('toyAutomorphSearch');
    const toyAutomorphClearEl = document.getElementById('toyAutomorphClear');
    const toyAutomorphUseSolutionEl = document.getElementById('toyAutomorphUseSolution');
    const toyMinimizerSearchEl = document.getElementById('toyMinimizerSearch');
    const toyMinimizerReplaceEl = document.getElementById('toyMinimizerReplace');
    const toyMinimizerResultsEl = document.getElementById('toyMinimizerResults');
    const toyAutomorphLegendEl = document.getElementById('toyAutomorphLegend');
    const toyAutomorphLegendPanelEl = document.getElementById('toyAutomorphLegendPanel');
    const toyAutomorphLegendCloseEl = document.getElementById('toyAutomorphLegendClose');
    const toyAutomorphLegendSymbolEl = toyAutomorphLegendEl.querySelector('.toy-automorph-legend-symbol');
    const toyAutomorphResultsEl = document.getElementById('toyAutomorphResults');
    const toyMiniLexBuildEl = document.getElementById('toyMiniLexBuild');
    const toyMiniLexSummaryEl = document.getElementById('toyMiniLexSummary');
    const toyMiniLexStringEl = document.getElementById('toyMiniLexString');
    const toyMiniLexGridEl = document.getElementById('toyMiniLexGrid');
    let toyMinimizerReport = null;
    const logEl = document.getElementById('log');
    const pomResultsEl = document.getElementById('pomResults');
    const alsResultsEl = document.getElementById('alsResults');
    const alsLinkResultsEl = document.getElementById('alsLinkResults');
    const ahsResultsEl = document.getElementById('ahsResults');
    const strongLinkResultsEl = document.getElementById('strongLinkResults');
    const simpleColoringResultsEl = document.getElementById('simpleColoringResults');
    const threeDMedusaResultsEl = document.getElementById('threeDMedusaResults');
    const threeDMedusaMultiResultsEl = document.getElementById('threeDMedusaMultiResults');
    const multiColoringResultsEl = document.getElementById('multiColoringResults');
    const superMultiColoringResultsEl = document.getElementById('superMultiColoringResults');
    const chromaticGraphResultsEl = document.getElementById('chromaticGraphResults');
    const chromaticAlsGraphResultsEl = document.getElementById('chromaticAlsGraphResults');
    const fishResultsEl = document.getElementById('fishResults');
    const nakedSubsetResultsEl = document.getElementById('nakedSubsetResults');
    const hiddenSubsetResultsEl = document.getElementById('hiddenSubsetResults');
    const alsSearchResultsEl = document.getElementById('alsSearchResults');
    const ahsSearchResultsEl = document.getElementById('ahsSearchResults');
    const alcSearchResultsEl = document.getElementById('alcSearchResults');
    const ahsLinkResultsEl = document.getElementById('ahsLinkResults');
    const ahsDofResultsEl = document.getElementById('ahsDofResults');
    const ahsDofChainResultsEl = document.getElementById('ahsDofChainResults');
    const ahsHydraResultsEl = document.getElementById('ahsHydraResults');
    const mslsResultsEl = document.getElementById('mslsResults');
    const mslsMinSizeEl = document.getElementById('mslsMinSize');
    const mslsMaxSizeEl = document.getElementById('mslsMaxSize');
    const mslsStateBudgetEl = document.getElementById('mslsStateBudget');
    const mslsResultLimitEl = document.getElementById('mslsResultLimit');
    const chainResultsEl = document.getElementById('chainResults');
    const alsDofResultsEl = document.getElementById('alsDofResults');
    const alsDofChainResultsEl = document.getElementById('alsDofChainResults');
    const alsHydraResultsEl = document.getElementById('alsHydraResults');
    const alcHydraResultsEl = document.getElementById('alcHydraResults');
    const chainOutputEl = document.getElementById('chainOutput');
    const illegalChainAreaEl = document.getElementById('illegalChainArea');
    const illegalChainHeadingEl = document.getElementById('illegalChainHeading');
    const illegalChainResultsEl = document.getElementById('illegalChainResults');
    const undoEl = document.getElementById('undo');
    const redoEl = document.getElementById('redo');
    const applyBasicsEl = document.getElementById('applyBasics');
    const alsBuildEl = document.getElementById('alsBuild');
    const alsLinkBuildEl = document.getElementById('alsLinkBuild');
    const ahsBuildEl = document.getElementById('ahsBuild');
    const strongLinkBuildEl = document.getElementById('strongLinkBuild');
    const simpleColoringBuildEl = document.getElementById('simpleColoringBuild');
    const threeDMedusaBuildEl = document.getElementById('threeDMedusaBuild');
    const threeDMedusaMultiBuildEl = document.getElementById('threeDMedusaMultiBuild');
    const chromaticGraphBuildEl = document.getElementById('chromaticGraphBuild');
    const chromaticAlsGraphBuildEl = document.getElementById('chromaticAlsGraphBuild');
    const chromaticUnitTypeEl = document.getElementById('chromaticUnitType');
    const chromaticMinSectorsEl = document.getElementById('chromaticMinSectors');
    const chromaticMaxSectorsEl = document.getElementById('chromaticMaxSectors');
    const chromaticMinDigitsEl = document.getElementById('chromaticMinDigits');
    const chromaticMaxDigitsEl = document.getElementById('chromaticMaxDigits');
    const chromaticMaxCellsEl = document.getElementById('chromaticMaxCells');
    const multiColoringBuildEl = document.getElementById('multiColoringBuild');
    const chainBuildEl = document.getElementById('chainBuild');
    const fishBuildEl = document.getElementById('fishBuild');
    const nakedSubsetBuildEl = document.getElementById('nakedSubsetBuild');
    const hiddenSubsetBuildEl = document.getElementById('hiddenSubsetBuild');
    const boxLineBuildEl = document.getElementById('boxLineBuild');
    const boxLineResultsEl = document.getElementById('boxLineResults');
    const alsXzBuildEl = document.getElementById('alsXzBuild');
    const ahsXzBuildEl = document.getElementById('ahsXzBuild');
    const alcXzBuildEl = document.getElementById('alcXzBuild');
    const alcXyBuildEl = document.getElementById('alcXyBuild');
    const alcChainBuildEl = document.getElementById('alcChainBuild');
    const alcDofBuildEl = document.getElementById('alcDofBuild');
    const alcHydraBuildEl = document.getElementById('alcHydraBuild');
    const alsAhsAlcSettingsButtonEl = document.getElementById('alsAhsAlcSettingsButton');
    const ahsXyBuildEl = document.getElementById('ahsXyBuild');
    const ahsChainBuildEl = document.getElementById('ahsChainBuild');
    const mslsBuildEl = document.getElementById('mslsBuild');
    const ahsLinkBuildEl = document.getElementById('ahsLinkBuild');
    const ahsDofBuildEl = document.getElementById('ahsDofBuild');
    const ahsDofChainBuildEl = document.getElementById('ahsDofChainBuild');
    const ahsHydraBuildEl = document.getElementById('ahsHydraBuild');
    const alsXyBuildEl = document.getElementById('alsXyBuild');
    const alsChainBuildEl = document.getElementById('alsChainBuild');
    const alsDofBuildEl = document.getElementById('alsDofBuild');
    const alsDofChainBuildEl = document.getElementById('alsDofChainBuild');
    const alsHydraBuildEl = document.getElementById('alsHydraBuild');
    const alsDofMaxDigitsEl = document.getElementById('alsDofMaxDigits');
    const alsDofMaxAuxiliaryEl = document.getElementById('alsDofMaxAuxiliary');
    const alsDofHydraEnabledEl = document.getElementById('alsDofHydraEnabled');
    const alsDofChainMaxDigitsEl = document.getElementById('alsDofChainMaxDigits');
    const alsDofChainMaxAuxiliaryEl = document.getElementById('alsDofChainMaxAuxiliary');
    const alsDofChainMaxResultsEl = document.getElementById('alsDofChainMaxResults');
    const ahsDofMaxDofEl = document.getElementById('ahsDofMaxDof');
    const ahsDofMaxCellsEl = document.getElementById('ahsDofMaxCells');
    const ahsDofMaxAuxiliaryEl = document.getElementById('ahsDofMaxAuxiliary');
    const ahsDofMaxResultsEl = document.getElementById('ahsDofMaxResults');
    const ahsDofChainMaxDofEl = document.getElementById('ahsDofChainMaxDof');
    const ahsDofChainMaxCellsEl = document.getElementById('ahsDofChainMaxCells');
    const ahsDofChainMaxAuxiliaryEl = document.getElementById('ahsDofChainMaxAuxiliary');
    const ahsDofChainMaxDepthEl = document.getElementById('ahsDofChainMaxDepth');
    const ahsDofChainMaxResultsEl = document.getElementById('ahsDofChainMaxResults');
    const ahsDofHydraEnabledEl = document.getElementById('ahsDofHydraEnabled');
    const alcDofMaxDigitsEl = document.getElementById('alcDofMaxDigits');
    const alcDofMaxAuxiliaryEl = document.getElementById('alcDofMaxAuxiliary');
    const alcDofMaxResultsEl = document.getElementById('alcDofMaxResults');
    const alcDofHydraEnabledEl = document.getElementById('alcDofHydraEnabled');
    const chainDepthEl = document.getElementById('chainDepth');
    const chainAlsRccEl = document.getElementById('chainAlsRcc');
    const chainAhsEl = document.getElementById('chainAhs');
    const chainChromaticType3El = document.getElementById('chainChromaticType3');
    const chainUseAlsNodeLimitsEl = document.getElementById('chainUseAlsNodeLimits');
    const chainUseAhsNodeLimitsEl = document.getElementById('chainUseAhsNodeLimits');
    const chainUseAlcNodeLimitsEl = document.getElementById('chainUseAlcNodeLimits');
    const chainAlsMaxSizeEl = document.getElementById('chainAlsMaxSize');
    const chainAhsMaxSizeEl = document.getElementById('chainAhsMaxSize');
    const chainAlcMaxSizeEl = document.getElementById('chainAlcMaxSize');
    const chainStrongTypeEls = Array.from({ length: 8 }, (_, index) =>
      document.getElementById(`chainStrongType${index}`) || { checked: false });
    // Keep unfinished graph extensions out of normal operations while their
    // source remains available locally for continued development.
    chainStrongTypeEls[7].checked = false;
    chainChromaticType3El.checked = false;
    alsDofHydraEnabledEl.checked = true;
    ahsDofHydraEnabledEl.checked = false;
    alcDofHydraEnabledEl.checked = false;
    const solverMoveTypeEls = new Map([
      ['last-man-standing', document.getElementById('moveLastManStanding')],
      ['hidden-single', document.getElementById('moveHiddenSingle')],
      ['naked-single', document.getElementById('moveNakedSingle')],
      ['box-line', document.getElementById('moveBoxLine')],
      ['1x1-fish', document.getElementById('moveCyclops')],
      ['hidden-pair', document.getElementById('moveHiddenPair')],
      ['naked-pair', document.getElementById('moveNakedPair')],
      ['x-wing', document.getElementById('moveXWing')],
      ['2x2+k-fish', document.getElementById('moveExtendedFish2')],
      ['hidden-triple', document.getElementById('moveHiddenTriple')],
      ['naked-triple', document.getElementById('moveNakedTriple')],
      ['swordfish', document.getElementById('moveSwordfish')],
      ['3x3+k-fish', document.getElementById('moveExtendedFish3')],
      ['hidden-quad', document.getElementById('moveHiddenQuad')],
      ['naked-quad', document.getElementById('moveNakedQuad')],
      ['hidden-quintuple', document.getElementById('moveHiddenQuintuple')],
      ['naked-quintuple', document.getElementById('moveNakedQuintuple')],
      ['hidden-sextuple', document.getElementById('moveHiddenSextuple')],
      ['naked-sextuple', document.getElementById('moveNakedSextuple')],
      ['hidden-septuple', document.getElementById('moveHiddenSeptuple')],
      ['naked-septuple', document.getElementById('moveNakedSeptuple')],
      ['hidden-octuple', document.getElementById('moveHiddenOctuple')],
      ['naked-octuple', document.getElementById('moveNakedOctuple')],
      ['hidden-nontuple', document.getElementById('moveHiddenNontuple')],
      ['naked-nontuple', document.getElementById('moveNakedNontuple')],
      ['jellyfish', document.getElementById('moveJellyfish')],
      ['4x4+k-fish', document.getElementById('moveExtendedFish4')],
      ['5x5-fish', document.getElementById('moveSquirmbag')],
      ['5x5+k-fish', document.getElementById('moveExtendedFish5')],
      ['6x6-fish', document.getElementById('moveWhale')],
      ['6x6+k-fish', document.getElementById('moveExtendedFish6')],
      ['7x7-fish', document.getElementById('moveLeviathan')],
      ['7x7+k-fish', document.getElementById('moveExtendedFish7')],
      ['chains', document.getElementById('moveChains')],
      ['x-chain', document.getElementById('moveXChain')],
      ['empty-rectangle', document.getElementById('moveEmptyRectangle')],
      ['dual-empty-rectangle', document.getElementById('moveDualEmptyRectangle')],
      ['rect-kite', document.getElementById('moveRectKite')],
      ['eri-chain', document.getElementById('moveEriChain')],
      ['bridged-eri', document.getElementById('moveBridgedEri')],
      ['2-string-kite', document.getElementById('move2StringKite')],
      ['skyscraper', document.getElementById('moveSkyscraper')],
      ['chain-x-wing', document.getElementById('moveChainXWing')],
      ['finned-x-wing', document.getElementById('moveFinnedXWing')],
      ['sashimi-x-wing', document.getElementById('moveSashimiXWing')],
      ['xy-chain', document.getElementById('moveXyChain')],
      ['xy-wing', document.getElementById('moveXyWing')],
      ['remote-pair', document.getElementById('moveRemotePair')],
      ['hidden-xy-chain', document.getElementById('moveHiddenXyChain')],
      ['hidden-remote-pair', document.getElementById('moveHiddenRemotePair')],
      ['w-wing', document.getElementById('moveWWing')],
      ['s-wing', document.getElementById('moveSWing')],
      ['m2-wing', document.getElementById('moveM2Wing')],
      ['m3-wing', document.getElementById('moveM3Wing')],
      ['l1-wing', document.getElementById('moveL1Wing')],
      ['l2-wing', document.getElementById('moveL2Wing')],
      ['l3-wing', document.getElementById('moveL3Wing')],
      ['h1-wing', document.getElementById('moveH1Wing')],
      ['h2-wing', document.getElementById('moveH2Wing')],
      ['h3-wing', document.getElementById('moveH3Wing')],
      ['strong-wing', document.getElementById('moveStrongWing')],
      ['inversion', document.getElementById('moveInversion')],
      ['als-named', document.getElementById('moveAlsNamed')],
      ['ahs-named', document.getElementById('moveAhsNamed')],
      ['alc-named', document.getElementById('moveAlcNamed')],
      ['barns', document.getElementById('moveBarns')],
      ['barns-transport', document.getElementById('moveBarnsTransport')],
      ['als-xz', document.getElementById('moveAlsXz')],
      ['t-als-xz', document.getElementById('moveTAlsXz')],
      ['als-xy', document.getElementById('moveAlsXy')],
      ['t-als-xy', document.getElementById('moveTAlsXy')],
      ['als-chain', document.getElementById('moveAlsChain')],
      ['aic-als', document.getElementById('moveAicAls')],
      ['als-dof', document.getElementById('moveAlsDof')],
      ['als-dof-chain', document.getElementById('moveAlsDof')],
      ['dds', document.getElementById('moveDds')],
      ['adds', document.getElementById('moveAdds')],
      ['ahs-xz', document.getElementById('moveAhsXz')],
      ['t-ahs-xz', document.getElementById('moveTAhsXz')],
      ['ahs-xy', document.getElementById('moveAhsXy')],
      ['t-ahs-xy', document.getElementById('moveTAhsXy')],
      ['ahs-chain', document.getElementById('moveAhsChain')],
      ['ahs-dof', document.getElementById('moveAhsDof')],
      ['ahs-dof-chain', document.getElementById('moveAhsDofChain')],
      ['alc-xz', document.getElementById('moveAlcXz')],
      ['t-alc-xz', document.getElementById('moveTAlcXz')],
      ['alc-xy', document.getElementById('moveAlcXy')],
      ['t-alc-xy', document.getElementById('moveTAlcXy')],
      ['alc-chain', document.getElementById('moveAlcChain')],
      ['alc-dof', document.getElementById('moveAlcDof')],
      ['msls', document.getElementById('moveMsls')],
    ]);
    const fishMinSizeEl = document.getElementById('fishMinSize');
    const fishMaxSizeEl = document.getElementById('fishMaxSize');
    const fishMinKEl = document.getElementById('fishMinK');
    const fishMaxKEl = document.getElementById('fishMaxK');
    const fishFastEl = document.getElementById('fishFast');
    const fishBasicEl = document.getElementById('fishBasic');
    const fishFrankenEl = document.getElementById('fishFranken');
    const fishMutantEl = document.getElementById('fishMutant');
    const afMinSizeEl = document.getElementById('afMinSize');
    const afMaxSizeEl = document.getElementById('afMaxSize');
    const afMinKEl = document.getElementById('afMinK');
    const afMaxKEl = document.getElementById('afMaxK');
    const afBasicEl = document.getElementById('afBasic');
    const afFrankenEl = document.getElementById('afFranken');
    const afMutantEl = document.getElementById('afMutant');
    const fishDigitsEl = document.getElementById('fishDigits');
    const fishBaseSectorsEl = document.getElementById('fishBaseSectors');
    const fishCoverSectorsEl = document.getElementById('fishCoverSectors');

    let puzzle = new Array(81).fill(0);
    let originalPuzzle = new Array(81).fill(0);
    let promotedValues = new Array(81).fill(0);
    let solution = null;
    let promotionSecurityDisabled = false;
    const variantSettings = {
      diagonal: false,
      antiDiagonal: false,
      windoku: false,
      antiKing: false,
      antiKnight: false,
      nonConsecutive: false,
    };
    let cand = core.allCandidates(puzzle);
    let cycle = 0;
    let lastInteractiveSearchError = null;
    let activeStep = null;
    let lastRemoved = [];
    let promotionQueue = [];
    let logEntries = [];
    let undoStack = [];
    let redoStack = [];
    let pomReport = null;
    let alsReport = null;
    let alsLinkReport = null;
    let alsDofReport = null;
    let alsDofChainReport = null;
    let alsHydraReport = null;
    let selectedAlsHydraIndex = null;
    let ahsHydraReport = null;
    let alcHydraReport = null;
    let selectedHydraFamily = null;
    let ahsReport = null;
    let alcXzReport = null;
    let alcXyReport = null;
    let alcChainReport = null;
    let alcDofReport = null;
    let ahsLinkReport = null;
    let ahsDofReport = null;
    let ahsDofChainReport = null;
    let selectedAhsDofChainIndex = null;
    let mslsReport = null;
    let selectedMslsIndex = null;
    let selectedAlsDof = null;
    let selectedAlsDofIndex = null;
    let selectedAlsDofSource = 'net';
    let selectedAlsId = null;
    const openAlsSizeGroups = new Set();
    let selectedAhsDof = null;
    let selectedAhsDofNetIndex = null;
    let selectedAhsId = null;
    const openAhsSizeGroups = new Set();
    let strongLinkReport = null;
    let selectedStrongLinkType = null;
    let selectedStrongLinkIndex = null;
    let simpleColoringReport = null;
    let selectedSimpleColoringIndex = null;
    let threeDMedusaReport = null;
    let selectedThreeDMedusaIndex = null;
    let threeDMedusaMultiReport = null;
    let selectedThreeDMedusaMultiIndex = null;
    let multiColoringReport = null;
    let selectedMultiColoringIndex = null;
    let superMultiColoringReport = null;
    let selectedSuperMultiColoringIndex = null;
    let chromaticGraphReport = null;
    let selectedChromaticGraphIndex = null;
    let chromaticAlsGraphReport = null;
    let selectedChromaticAlsGraphIndex = null;
    const colouringSequenceState = {
      simple: { enabled: false, breadth: 1 },
      multi: { enabled: false, breadth: 1 },
      superMulti: { enabled: false, breadth: 1 },
      medusa: { enabled: false, breadth: 1 },
      medusaMulti: { enabled: false, breadth: 1 },
    };
    let fishReport = null;
    let selectedFishCategory = null;
    let selectedFishSize = null;
    let selectedFishKey = null;
    let nakedSubsetReport = null;
    let selectedNakedSubsetSize = null;
    let selectedNakedSubsetKey = null;
    let boxLineReport = null;
    let selectedBoxLineIndex = null;
    let hiddenSubsetReport = null;
    let selectedHiddenSubsetSize = null;
    let selectedHiddenSubsetKey = null;
    let chainReport = null;
    let lastChainSelectionDiagnostics = null;
    let alsSearchFamily = null;
    let ahsSearchFamily = null;
    let selectedChainIndex = null;
    let ratingReport = null;
    let gridView = 'RC';
    let showFixedInVantage = false;
    let ctrlDigitRemovesCandidate = true;
    let selectedPlayerCell = null;
    let selectedPlayerDigit = null;
    let playerPromotionMode = false;
    let playerSolveBackups = new Map();
    const SHOW_AIC_DEBUG = false;
    const activeDigitHighlights = new Set();
    const activeCandidateSizeFilters = new Set();
    let limitDigitHighlightsToSize = false;
    let busy = false;
    let searchEpoch = 0;
    let generationToken = 0;
    const pomFishSettings = {
      digits: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      baseSectors: new Set(Array.from({ length: 27 }, (_, index) => index)),
      coverSectors: new Set(Array.from({ length: 27 }, (_, index) => index)),
    };
    let searchWorker = null;
    let searchWorkerBlobUrl = null;
    let interactiveSearchProgress = null;
    let searchWorkerJobId = 0;
    let searchWorkerJobs = new Map();
    let searchWorkerDisabled = false;
    let activeHierarchyPhase = null;

    // Stable handoff point for the next UI-module splits. The existing code
    // continues to use its local bindings; future modules can use this shared
    // surface without changing solver or hierarchy behavior.
    const appNamespace = window.StormDokuApp = window.StormDokuApp || {};
    const workerRuntime = appNamespace.workerRuntime;
    const linkState = appNamespace.linkState.create({
      variantSettings,
      variantInputs: {
        diagonal: variantDiagonalEl,
        antiDiagonal: variantAntiDiagonalEl,
        windoku: variantWindokuEl,
        antiKing: variantAntiKingEl,
        antiKnight: variantAntiKnightEl,
        nonConsecutive: variantNonConsecutiveEl,
      },
    });
    const variantControls = appNamespace.variantControls.create({
      settings: variantSettings,
      inputs: {
        diagonal: variantDiagonalEl,
        antiDiagonal: variantAntiDiagonalEl,
        windoku: variantWindokuEl,
        antiKing: variantAntiKingEl,
        antiKnight: variantAntiKnightEl,
        nonConsecutive: variantNonConsecutiveEl,
      },
    });
    const variantCellClasses = appNamespace.variantControls.cellClasses;
    const variantSettingsController = appNamespace.variantSettings.create({
      state: {
        variantSettings,
        get puzzle() { return puzzle; },
        set cand(value) { cand = value; },
        set solution(value) { solution = value; },
        set undoStack(value) { undoStack = value; },
        set redoStack(value) { redoStack = value; },
        get solution() { return solution; },
      },
      actions: {
        get variantControls() { return variantControls; },
        get fishControls() { return fishControls; },
        configureVariants: core.configureVariants,
        allCandidates: core.allCandidates,
        solveFully: core.solveFully,
        resetAnalysisAfterPlayerEdit,
        render,
        setStatus,
      },
    });
    const syncVariantSettingsFromControls = variantSettingsController.sync;
    const applyVariantSettings = variantSettingsController.apply;
    const searchControl = appNamespace.searchControl.create({
      getEpoch: () => searchEpoch,
    });
    const uiState = appNamespace.uiState.create({
      status: statusEl,
      renderActions: renderSolutionActions,
      updateHistory: updateHistoryButtons,
      getBusy: () => busy,
      setBusy: value => { busy = value; },
      getEpoch: () => searchEpoch,
      advanceEpoch: () => { searchEpoch += 1; },
      buttons: () => document.querySelectorAll('button'),
      exempt: new Set([loadEl, resetEl, importEl]),
    });
    const toggleUi = appNamespace.toggleUi;
    const candidateControls = appNamespace.candidateControls.create({
      digitSet: activeDigitHighlights,
      sizeSet: activeCandidateSizeFilters,
      digitElement: digitFocusButtonsEl,
      sizeElement: candidateSizeFilterButtonsEl,
      limitToggle: limitDigitHighlightsToSizeEl,
      clearButton: clearDigitFilterEl,
      hasCandidates: digit => digitHasRemainingCandidates(digit),
      renderBoard,
      setLimit: value => { limitDigitHighlightsToSize = value; },
    });
    const formControls = appNamespace.formControls;
    const techniqueControls = appNamespace.techniqueControls.create(solverMoveTypeEls);
    const inputLoader = appNamespace.inputLoader.create({
      input: inputEl,
      readClipboard: appNamespace.clipboard.readText,
      load: () => loadPuzzle(),
      setStatus,
    });
    const candidateFilter = appNamespace.candidateFilter.create({
      digitSet: activeDigitHighlights,
      sizeSet: activeCandidateSizeFilters,
      getCandidates: cell => cand[cell],
      getPuzzle: cell => puzzle[cell],
      getPromoted: cell => promotedValues[cell],
      hasCandidate: (cell, digit) => appNamespace.candidateState.cellHasCandidate(cand, cell, digit),
    });
    const settingsRuntime = appNamespace.settingsRuntime.create({
      state: {
        get puzzle() { return puzzle; },
        get pomReport() { return pomReport; },
        set pomReport(value) { pomReport = value; },
      },
      actions: {
        get fishControls() { return fishControls; },
        get techniqueControls() { return techniqueControls; },
        omissionFishSearch: core.omissionFishStep,
        renderPomReport,
      },
    });
    const fishSettingsChanged = settingsRuntime.fishSettingsChanged;
    const fishControls = appNamespace.fishControls.create({
      core,
      variantSettings,
      settings: pomFishSettings,
      elements: {
        base: fishBaseSectorsEl,
        cover: fishCoverSectorsEl,
        digits: fishDigitsEl,
        fishMinSize: fishMinSizeEl,
        fishMaxSize: fishMaxSizeEl,
        fishMinK: fishMinKEl,
        fishMaxK: fishMaxKEl,
        afMinSize: afMinSizeEl,
        afMaxSize: afMaxSizeEl,
        afMinK: afMinKEl,
        afMaxK: afMaxKEl,
        fishFast: fishFastEl,
        fishBasic: fishBasicEl,
        fishFranken: fishFrankenEl,
        fishMutant: fishMutantEl,
        afBasic: afBasicEl,
        afFranken: afFrankenEl,
        afMutant: afMutantEl,
      },
      ranges: {
        minSize: fishMinSizeEl,
        maxSize: fishMaxSizeEl,
        minK: fishMinKEl,
        maxK: fishMaxKEl,
      },
      toggleUi,
      fillNumberSelect: formControls.fillNumberSelect,
      selectedNumbers: formControls.selectedNumbers,
      onChanged: fishSettingsChanged,
    });
    const historyState = appNamespace.historyState.create({
      snapshot: snapshotState,
      restore: restoreState,
      restoreVisual: restoreVisualState,
      isBusy: () => busy,
      cancel: cancelActiveSearches,
      setStatus,
      render,
      focus: focusMap,
    });
    appNamespace.core = core;
    appNamespace.dom = {
      board: boardEl,
      status: statusEl,
      input: inputEl,
      solution: solutionPanelEl,
      chainResults: chainResultsEl,
      searchDiagnostics: searchDiagnosticsEl,
    };
    appNamespace.state = {
      get puzzle() { return puzzle; },
      get candidates() { return cand; },
      get solution() { return solution; },
      get activeStep() { return activeStep; },
      get busy() { return busy; },
      get variantSettings() { return variantSettings; },
    };
    appNamespace.workerState = {
      get worker() { return searchWorker; },
      set worker(value) { searchWorker = value; },
      get blobUrl() { return searchWorkerBlobUrl; },
      set blobUrl(value) { searchWorkerBlobUrl = value; },
      get progress() { return interactiveSearchProgress; },
      set progress(value) { interactiveSearchProgress = value; },
      get jobId() { return searchWorkerJobId; },
      set jobId(value) { searchWorkerJobId = value; },
      jobs: searchWorkerJobs,
      get disabled() { return searchWorkerDisabled; },
      set disabled(value) { searchWorkerDisabled = value; },
      get hierarchyPhase() { return activeHierarchyPhase; },
      set hierarchyPhase(value) { activeHierarchyPhase = value; },
    };

    const beginSearchDiagnostics = (operation, payload) =>
      appNamespace.searchDiagnostics.begin(operation, payload);

    function updateSearchDiagnostics(progress = {}) {
      appNamespace.searchDiagnostics.update(progress);
    }

    function finishSearchDiagnostics(reason, result = null) {
      appNamespace.searchDiagnostics.finish(reason, result);
    }

    function releaseSearchWorkerBlobUrl() {
      if (searchWorkerBlobUrl === null) return;
      URL.revokeObjectURL(searchWorkerBlobUrl);
      searchWorkerBlobUrl = null;
    }

    function disableSearchWorker(error = null) {
      searchWorkerDisabled = true;
      finishSearchDiagnostics(error?.message || 'Search worker unavailable.');
      if (searchWorker) searchWorker.terminate();
      searchWorker = null;
      releaseSearchWorkerBlobUrl();
      for (const job of searchWorkerJobs.values()) {
        job.reject(error || new Error('Search worker unavailable.'));
      }
      searchWorkerJobs.clear();
    }

    async function ensureSearchWorker() {
      if (searchWorkerDisabled) return null;
      if (searchWorker) return searchWorker;
      if (typeof Worker === 'undefined') {
        disableSearchWorker(new Error('Web Workers are not supported.'));
        return null;
      }

      try {
      const workerPath = './src/search-worker.js?v=20261029-01';
        releaseSearchWorkerBlobUrl();
        let workerUrl = new URL(workerPath, document.baseURI);
        if (document.baseURI.startsWith('file:')) {
          // A file-origin worker cannot import local scripts. Embed its cores
          // in the Blob so offline Next and Run All share the same worker.
          searchWorkerBlobUrl = await workerRuntime.createOfflineWorkerBlobUrl();
          workerUrl = searchWorkerBlobUrl;
        }
        searchWorker = workerRuntime.createWorker(workerUrl, { type: 'classic' });
        const currentWorker = searchWorker;
        searchWorker.onmessage = event => {
          if (searchWorker !== currentWorker) return;
          const { id, result, error, type } = event.data || {};
          const job = searchWorkerJobs.get(id);
          if (!job) return;
          if (type === 'progress') {
            interactiveSearchProgress?.();
            job.onProgress?.(event.data);
            return;
          }
          releaseSearchWorkerBlobUrl();
          searchWorkerJobs.delete(id);
          if (error) {
            finishSearchDiagnostics(error);
            job.reject(new Error(error));
          } else {
            finishSearchDiagnostics(null, result);
            job.resolve(result);
          }
        };
        searchWorker.onerror = event => {
          if (searchWorker !== currentWorker) return;
          const details = workerRuntime.describeWorkerErrorEvent(event);
          const error = new Error(details || 'Search worker failed.');
          finishSearchDiagnostics(error.message);
          const failedWorker = searchWorker;
          searchWorker = null;
          if (failedWorker) failedWorker.terminate();
          releaseSearchWorkerBlobUrl();
          for (const job of searchWorkerJobs.values()) job.reject(error);
          searchWorkerJobs.clear();
        };
        return searchWorker;
      } catch (error) {
        disableSearchWorker(error);
        return null;
      }
    }

    async function runSearchWorker(type, payload, options = {}) {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      const epoch = searchEpoch;
      const worker = await ensureSearchWorker();
      if (!worker) return Promise.reject(new Error('Search worker unavailable.'));

      const id = ++searchWorkerJobId;
      const workerPayload = workerRuntime.withVariantSettings(payload, variantSettings);
      beginSearchDiagnostics(
        type,
        workerRuntime.diagnosticsPayload(workerPayload, options, activeHierarchyPhase),
      );
      return new Promise((resolve, reject) => {
        searchWorkerJobs.set(id, {
          resolve,
          reject,
          onProgress: progress => {
            updateSearchDiagnostics(progress);
            options.onProgress?.(progress);
          },
        });
        try {
          interactiveSearchProgress?.();
          worker.postMessage({ id, type, payload: workerPayload });
        } catch (error) {
          searchWorkerJobs.delete(id);
          finishSearchDiagnostics(error);
          reject(error);
        }
      }).then(result => {
        if (epoch !== searchEpoch) throw searchCancellationError();
        return result;
      });
    }

    function runCoreSearch(method, ...args) {
      return runSearchWorker('core-search', { method, args });
    }

    const searchCancellationError = (reason = 'Search cancelled.') => searchControl.cancellationError(reason);
    const isSearchCancelled = error => searchControl.isCancelled(error);
    const scheduleSearch = (callback, delay = 20) => searchControl.schedule(callback, delay);

    function runPuzzleGenerator(givens) {
      if (location.protocol === 'file:') return runCoreSearch('generate', givens);
      return appNamespace.generatorRuntime.run(givens, variantSettings);
    }

    function cancelActiveSearches(reason = 'Search cancelled.') {
      searchEpoch += 1;
      generationToken += 1;
      const error = searchCancellationError(reason);
      finishSearchDiagnostics(reason);
      appNamespace.generatorRuntime.cancel(error);
      const worker = searchWorker;
      searchWorker = null;
      if (worker) worker.terminate();
      releaseSearchWorkerBlobUrl();
      for (const job of searchWorkerJobs.values()) job.reject(error);
      searchWorkerJobs.clear();
      busy = false;
      setBusy(false);
    }

    function stopActiveSearch() {
      if (!busy) return;
      cancelActiveSearches('Search stopped.');
      render();
      setStatus('Stopped. Current grid and completed steps kept.', 'warn');
    }

    function initSearchStopButtons() {
      appNamespace.searchEvents.installStopButtons({
        buttons: document.querySelectorAll('.search-stop'),
        stop: stopActiveSearch,
      });
    }

    function setBusy(nextBusy, epoch = null) {
      return uiState.setBusy(nextBusy, epoch);
    }

    function updateHistoryButtons() {
      undoEl.disabled = busy || undoStack.length === 0;
      redoEl.disabled = busy || redoStack.length === 0;
    }

    function setStatus(text, kind = '') {
      uiState.setStatus(text, kind);
    }

    function fillNumberSelect(select, min, max, selected) {
      formControls.fillNumberSelect(select, min, max, selected);
    }

    function selectedNumbers(values) {
      return formControls.selectedNumbers(values);
    }

    const digitHasRemainingCandidates = digit =>
      appNamespace.candidateState.digitHasRemainingCandidates(cand, puzzle, promotedValues, digit);

    function renderDigitFocusButtons() {
      candidateControls.renderDigits();
    }

    function clearDigitFilter() {
      candidateControls.clearDigits();
    }

    function candidateSizeDigits(cell) {
      return candidateFilter.digits(cell);
    }

    function candidateSizeFilterStyle() {
      return candidateFilter.style();
    }

    function applyCandidateSizeFilterStyle(element, style) {
      candidateFilter.applyStyle(element, style);
    }

    function candidateSizeFilterMatches(cell) {
      return candidateFilter.matches(cell);
    }

    function candidateSizeFilterDigitMatches(cell, digit) {
      return candidateFilter.digitMatches(cell, digit);
    }

    function digitHighlightIsVisible(cell, digit) {
      return candidateFilter.digitVisible(cell, digit, limitDigitHighlightsToSize);
    }

    function renderCandidateSizeFilterButtons() {
      candidateControls.renderSizes();
    }

    candidateControls.installFilterEvents();

    const initFishSettings = settingsRuntime.initFishSettings;
    const syncFishRanges = settingsRuntime.syncFishRanges;
    const sectorToggleLabel = settingsRuntime.sectorToggleLabel;
    const syncFishVariantSectors = settingsRuntime.syncFishVariantSectors;
    const renderFishSectorGrid = settingsRuntime.renderFishSectorGrid;
    const setVariantSectorRange = settingsRuntime.setVariantSectorRange;
    const setSectorRange = settingsRuntime.setSectorRange;
    const setAllDigits = settingsRuntime.setAllDigits;
    const currentAlmostFishOptions = settingsRuntime.currentAlmostFishOptions;
    const currentPomFishOptions = settingsRuntime.currentPomFishOptions;
    const currentSolverMoveTypes = settingsRuntime.currentSolverMoveTypes;
    const currentSolverFishOptions = settingsRuntime.currentSolverFishOptions;

    const markFor = (cell, digit) => appNamespace.candidateState.markFor(cand, cell, digit);

    const sectorView = appNamespace.sectorView.create({ core, boardEl });
    const vantageView = appNamespace.vantageView;
    const { cellsForHouse, cellsForSectors, sectorFrameRects, renderSectorFrames } = sectorView;

    const selectedChain = () => reportSelection.chain(
      chainReport, selectedChainIndex, cand, chainStepFromResult);

    const reportSelection = appNamespace.reportSelection;
    const selectedAlsRecord = () => reportSelection.als(alsReport, selectedAlsId);
    const selectedAlsDofRecord = () => reportSelection.alsDof(
      alsDofReport, alsDofChainReport, selectedAlsDofSource, selectedAlsDofIndex);
    const selectedHydraRecord = () => reportSelection.hydra(
      alsHydraReport, ahsHydraReport, alcHydraReport, selectedHydraFamily, selectedAlsHydraIndex);
    const selectedAlsHydraRecord = () => (selectedHydraFamily === 'ALS' || selectedHydraFamily === null)
      ? selectedHydraRecord() : null;

    const hydraStep = appNamespace.hydraStep.create({ core, rateStep: ratingForStep });
    const formatHydraResult = hydraStep.format;
    const alsHydraStepFromResult = hydraStep.fromResult;

    const selectedAhsRecord = () => reportSelection.ahs(ahsReport, selectedAhsId);
    const selectedAhsDofNetRecord = () => reportSelection.ahsDof(ahsDofReport, selectedAhsDofNetIndex);
    const selectedAhsDofChainRecord = () => reportSelection.ahsDof(ahsDofChainReport, selectedAhsDofChainIndex);

    const { atomKey } = appNamespace.candidateState;
    const cellHasCandidate = (cell, digit) => appNamespace.candidateState.cellHasCandidate(cand, cell, digit);

    const candidateVisibility = appNamespace.candidateVisibility.create({
      hasCandidate: cellHasCandidate,
      getDofRecord: selectedAlsDofRecord,
      getSelectedChain: selectedChain,
      getHydraRecord: selectedHydraRecord,
      getLastRemoved: () => lastRemoved,
    });
    const chainCandidateIsVisible = candidateVisibility.isVisible;

    const { cloneSolveBackups, restoreSolveBackups, arraysEqual: playerArraysEqual, isEditableCell } = appNamespace.playerState;
    const clonePlayerSolveBackups = () => cloneSolveBackups(playerSolveBackups);

    const restorePlayerSolveBackups = saved => { playerSolveBackups = restoreSolveBackups(saved); };

    const isPlayerEditableCell = cell => isEditableCell(cell, originalPuzzle);

    const setManualMode = appNamespace.playerMode.create({
      element: manualModeEl,
      setDisabled: value => { promotionSecurityDisabled = value; },
      setStatus,
    }).setManualMode;
    const validatePlayerPromotion = appNamespace.playerState.validatePlayerPromotion;
    const validatePlayerClear = appNamespace.playerState.validatePlayerClear;
    const validatePlayerCandidate = appNamespace.playerState.validatePlayerCandidate;
    const validatePlayerCandidateRemoval = appNamespace.playerState.validatePlayerCandidateRemoval;

    function resetAnalysisAfterPlayerEdit() {
      cycle = 0;
      activeStep = null;
      lastRemoved = [];
      promotionQueue = [];
      logEntries = [];
      ratingReport = null;
      pomReport = null;
      alsReport = null;
      alsLinkReport = null;
      alsDofReport = null;
      alsDofChainReport = null;
      ahsReport = null;
      alcXzReport = null;
      alcXyReport = null;
      alcChainReport = null;
      alcDofReport = null;
      ahsDofReport = null;
      ahsDofChainReport = null;
      ahsLinkReport = null;
      mslsReport = null;
      selectedMslsIndex = null;
      strongLinkReport = null;
      simpleColoringReport = null;
      selectedSimpleColoringIndex = null;
      threeDMedusaReport = null;
      selectedThreeDMedusaIndex = null;
      threeDMedusaMultiReport = null;
      selectedThreeDMedusaMultiIndex = null;
      multiColoringReport = null;
      selectedMultiColoringIndex = null;
      superMultiColoringReport = null;
      selectedSuperMultiColoringIndex = null;
      chromaticGraphReport = null;
      chromaticAlsGraphReport = null;
      fishReport = null;
      nakedSubsetReport = null;
      hiddenSubsetReport = null;
      chainReport = null;
      alsSearchFamily = null;
      ahsSearchFamily = null;
      resetAnalysisSelections({
        set: (key, value) => ({
          selectedMslsIndex: value => { selectedMslsIndex = value; },
          selectedSimpleColoringIndex: value => { selectedSimpleColoringIndex = value; },
          selectedThreeDMedusaIndex: value => { selectedThreeDMedusaIndex = value; },
          selectedThreeDMedusaMultiIndex: value => { selectedThreeDMedusaMultiIndex = value; },
          selectedMultiColoringIndex: value => { selectedMultiColoringIndex = value; },
          selectedSuperMultiColoringIndex: value => { selectedSuperMultiColoringIndex = value; },
          selectedChromaticGraphIndex: value => { selectedChromaticGraphIndex = value; },
          selectedChromaticAlsGraphIndex: value => { selectedChromaticAlsGraphIndex = value; },
          selectedAlsDof: value => { selectedAlsDof = value; },
          selectedAlsDofIndex: value => { selectedAlsDofIndex = value; },
          selectedAlsDofSource: value => { selectedAlsDofSource = value; },
          selectedAhsDof: value => { selectedAhsDof = value; },
          selectedAhsDofNetIndex: value => { selectedAhsDofNetIndex = value; },
          selectedAhsDofChainIndex: value => { selectedAhsDofChainIndex = value; },
          selectedAlsId: value => { selectedAlsId = value; },
          selectedAhsId: value => { selectedAhsId = value; },
          selectedStrongLinkType: value => { selectedStrongLinkType = value; },
          selectedStrongLinkIndex: value => { selectedStrongLinkIndex = value; },
          selectedFishCategory: value => { selectedFishCategory = value; },
          selectedFishSize: value => { selectedFishSize = value; },
          selectedFishKey: value => { selectedFishKey = value; },
          selectedNakedSubsetSize: value => { selectedNakedSubsetSize = value; },
          selectedNakedSubsetKey: value => { selectedNakedSubsetKey = value; },
          selectedHiddenSubsetSize: value => { selectedHiddenSubsetSize = value; },
          selectedHiddenSubsetKey: value => { selectedHiddenSubsetKey = value; },
          selectedChainIndex: value => { selectedChainIndex = value; },
        }[key])(value),
        clearAlsSizeGroups: () => openAlsSizeGroups.clear(),
        clearAhsSizeGroups: () => openAhsSizeGroups.clear(),
      });
      if (solutionStepsPanelEl) solutionStepsPanelEl.open = false;
    }

    const { cellPermutation: toyCellPermutation, mapValues: toyMapValues, mapCandidates: toyMapCandidates } = appNamespace.toyMath;
    const { searchFamilyLabels: toySearchFamilyLabels } = appNamespace.toyCatalog;

    const toyPermutationPreservesActiveVariants = permutation =>
      appNamespace.toyCompatibility.preservesActiveVariants(permutation, core, variantSettings);

    const toyVariantTransformMessage = () => appNamespace.toyCompatibility.variantTransformMessage(variantSettings);

    const { remapDigit: remapToyDigit,
      remapDigitSet: remapToyDigitSet } = appNamespace.toyMath;

    const { mapCellState: mapToyCellState,
      exchangeDigitState: exchangeToyDigitState } = appNamespace.toyState;

    const { bandStackSwapMapper: toyBandStackSwapMapper, localSwapMapper: toyLocalSwapMapper } = appNamespace.toyMath;

    const toyActions = appNamespace.toyActions.create({
      isBusy: () => busy,
      leaveHistoryPreview,
      snapshotState,
      resetAnalysis: resetAnalysisAfterPlayerEdit,
      clearAutomorphResults: clearToyAutomorphResults,
      clearMiniLex: () => clearToyMiniLex(),
      clearMinimizerResults: clearToyMinimizerResults,
      resetPlayerState: () => {
        playerSolveBackups = new Map();
        selectedPlayerCell = null;
        selectedPlayerDigit = null;
        playerPromotionMode = false;
      },
      updateInput: () => { inputEl.value = core.encode(originalPuzzle); },
      pushUndo: before => undoStack.push(before),
      clearRedo: () => { redoStack = []; },
      setStatus,
      render,
      cellPermutation: toyCellPermutation,
      preservesVariants: toyPermutationPreservesActiveVariants,
      variantMessage: toyVariantTransformMessage,
      mapCellState: mapToyCellState,
      mapValues: toyMapValues,
      mapCandidates: toyMapCandidates,
      exchangeDigitState: exchangeToyDigitState,
      remapDigit: remapToyDigit,
      remapDigitSet: remapToyDigitSet,
      getCellState: () => ({ originalPuzzle, puzzle, promotedValues, cand, solution,
        activeDigitHighlights, pomFishSettings }),
      setCellState: state => {
        ({ originalPuzzle, puzzle, promotedValues, cand, solution } = state);
        activeDigitHighlights.clear();
        for (const digit of state.activeDigitHighlights || activeDigitHighlights) activeDigitHighlights.add(digit);
        if (state.pomFishSettings) pomFishSettings.digits = state.pomFishSettings.digits;
      }
    });
    const applyToyStateChange = toyActions.applyStateChange;

    const applyToyCellTransform = toyActions.applyCellTransform;
    const applyToyDigitExchange = toyActions.applyDigitExchange;

    const { pairValue: toyPairValue, initialize: initToyControls } = appNamespace.toyControls;

    const { transformationMapper: toyTransformationMapper } = appNamespace.toyMath;
    const { permutations: toyPermutations } = appNamespace.toyMath;

    const { getRecords: getToyFamilyRecords } = appNamespace.toyCatalog;

    const renderToyAutomorphCatalog = () =>
      appNamespace.toyCatalog.renderAutomorphCatalog(document, getToyFamilyRecords());

    const { isIdentityPermutation: toyIsIdentityPermutation } = appNamespace.toyMath;

    const { cellDigits: toyCellDigits,
      verifyDigitMap: toyVerifyDigitMap, digitPatternMap: toyDigitPatternMap } = appNamespace.toyMath;

    const { automorphSource: toyAutomorphSourcePure } = appNamespace.toyMath;
    function toyAutomorphSource() {
      return toyAutomorphSourcePure(originalPuzzle, solution, Boolean(toyAutomorphUseSolutionEl?.checked));
    }

    const { digitNormalizeDetails: toyDigitNormalizeDetails,
      normalizedValueKey: toyNormalizedValueKey,
      compareNumberArrays: toyCompareNumberArrays, cachedMiniLexLayoutMaps: toyMiniLexLayoutMaps,
      miniLexCanonicalize: toyMiniLexCanonicalize } = appNamespace.toyMath;

    const { completeSearch: toyCompleteAutomorphismSearchPure } = appNamespace.toyCatalog;
    function toyCompleteAutomorphismSearch(values) {
      return toyCompleteAutomorphismSearchPure(values, toyPermutationPreservesActiveVariants);
    }

    const { miniLexOrientedRows: toyMiniLexOrientedRows,
      miniLexRowMasks: toyMiniLexRowMasks, miniLexBestRowMaps: toyMiniLexBestRowMaps,
      formatDigitMap: toyFormatDigitMap, minimizerCellLabel: toyMinimizerCellLabel,
      automorphismLabel: toyCompleteAutomorphismLabel } = appNamespace.toyMath;
    const { searchAutomorphisms: toySearchAutomorphisms } = appNamespace.toyMath;
    const { clear: clearToyMiniLexView, render: renderToyMiniLexView } = appNamespace.toyMiniLexView;
    const toyMiniLexViewElements = { summary: toyMiniLexSummaryEl, string: toyMiniLexStringEl, grid: toyMiniLexGridEl };
    function clearToyMiniLex() { clearToyMiniLexView(toyMiniLexViewElements); }

    function buildToyMiniLex() {
      const comparison = toyAutomorphSource();
      const values = comparison.source;
      const { columnMaps } = toyMiniLexLayoutMaps();
      const best = toyMiniLexCanonicalize(values, columnMaps, toyPermutations([0, 1, 2]), {
        orientedRows: toyMiniLexOrientedRows, rowMasks: toyMiniLexRowMasks,
        bestRowMaps: toyMiniLexBestRowMaps, compare: toyCompareNumberArrays,
        normalize: toyDigitNormalizeDetails,
      });
      if (!best) {
        clearToyMiniLex();
        return null;
      }
      const result = {
        key: best.key,
        values: best.values,
        label: best.orientation ? 'Transpose + full structural search' : 'Full structural search',
        sourceMode: comparison.mode,
      };
      renderToyMiniLexView(toyMiniLexViewElements, result);
      return result;
    }

    function clearToyAutomorphResults() {
      appNamespace.toyAutomorphView.clear(toyAutomorphResultsEl);
    }

    function clearToyMinimizerResults() {
      toyMinimizerReport = null;
      clearToyMinimizerView(toyMinimizerViewElements);
    }

    const { countToySolutions } = appNamespace.toyMath;
    const { clear: clearToyMinimizerView, render: renderToyMinimizerView } = appNamespace.toyMinimizerView;
    const toyMinimizerViewElements = { results: toyMinimizerResultsEl, replace: toyMinimizerReplaceEl };
    const renderToyMinimizerReport = report =>
      renderToyMinimizerView(toyMinimizerViewElements, report, toyMinimizerCellLabel);
    function toyMinimizerSolutionCount(grid) { return countToySolutions(grid, core, 2); }

    async function runToyMinimizer() {
      if (busy) return;
      const source = [...originalPuzzle];
      const sourceGivenCount = source.filter(Boolean).length;
      const sourceCount = toyMinimizerSolutionCount(source);
      if (sourceCount !== 1) {
        clearToyMinimizerResults();
        toyMinimizerResultsEl.textContent = sourceCount === 0
          ? 'This grid has no solution, so no clue can be minimized.'
          : 'This grid has more than one solution, so clue minimization is unavailable.';
        setStatus('Clue minimizer requires a uniquely solvable grid.', 'warn');
        return;
      }

      const epoch = setBusy(true);
      try {
        const reduction = await appNamespace.toyMinimizer.minimize(
          source,
          grid => toyMinimizerSolutionCount(grid) === 1,
          () => busy && epoch === searchEpoch,
          () => new Promise(resolve => setTimeout(resolve, 0)),
        );
        if (!reduction) return;
        toyMinimizerReport = {
          sourceKey: source.join(''),
          sourceGivenCount,
          reducedGivenCount: reduction.reduced.filter(Boolean).length,
          reduced: reduction.reduced,
          removed: reduction.removed,
        };
        renderToyMinimizerReport(toyMinimizerReport);
        setStatus(`Clue minimizer found ${reduction.removed.length} removable clue${reduction.removed.length === 1 ? '' : 's'}.`, 'ok');
      } catch (error) {
        clearToyMinimizerResults();
        setStatus(`Clue minimizer failed: ${error.message || error}`, 'warn');
      } finally {
        setBusy(false, epoch);
      }
    }

    function replaceWithToyMinimizedGrid() {
      const report = toyMinimizerReport;
      if (!report || !report.removed.length) return;
      if (report.sourceKey !== originalPuzzle.join('')) {
        clearToyMinimizerResults();
        setStatus('The grid changed; run the clue minimizer again.', 'warn');
        return;
      }
      applyToyStateChange('Reduced clue grid', () => {
        originalPuzzle = [...report.reduced];
        puzzle = [...report.reduced];
        promotedValues = new Array(81).fill(0);
        cand = core.allCandidates(puzzle);
      });
    }

    function runToyAutomorphSearch() {
      if (busy) return;
      const familyNames = [...document.querySelectorAll('[data-toy-automorph-family]:checked')]
        .map(input => input.value);
      if (!familyNames.length) {
        toyAutomorphResultsEl.textContent = 'Select at least one symmetry family.';
        return;
      }
      const comparison = toyAutomorphSource();
      if (toyAutomorphUseSolutionEl?.checked && !comparison.hasSolution) {
        toyAutomorphResultsEl.textContent = 'No complete solution is available for this grid. Use the grid string or solve the puzzle first.';
        setStatus('Automorphic search needs a complete solution.', 'warn');
        return;
      }
      if (!comparison.source.some(value => toyCellDigits(value).length)) {
        toyAutomorphResultsEl.textContent = 'There is no given, solved, or candidate information to compare.';
        setStatus('Automorphic search needs grid information.', 'warn');
        return;
      }
      const miniLex = buildToyMiniLex();
      if (!miniLex) {
        toyAutomorphResultsEl.textContent = 'Mini-lex canonicalization could not be built for this source.';
        setStatus('Automorphic search could not build the Mini-lex grid.', 'warn');
        return;
      }
      const fullFamilySearch = familyNames.length === Object.keys(toySearchFamilyLabels).length;
      const search = toySearchAutomorphisms(
        familyNames, getToyFamilyRecords(), comparison.source, comparison.target,
        miniLex.values, fullFamilySearch,
        {
          normalizedKey: toyNormalizedValueKey, mapValues: toyMapValues,
          digitPatternMap: toyDigitPatternMap, verifyDigitMap: toyVerifyDigitMap,
          isIdentity: toyIsIdentityPermutation,
          preserves: toyPermutationPreservesActiveVariants,
          complete: toyCompleteAutomorphismSearch,
        },
      );
      const { matches, completeMatches, tested, total, namedTotal } = search;
      appNamespace.toyAutomorphView.renderSearch({ results: toyAutomorphResultsEl }, {
        mode: comparison.mode, tested, total, namedTotal, fullFamilySearch,
        matches, completeMatches, familyNames, labels: toySearchFamilyLabels,
        completeLabel: toyCompleteAutomorphismLabel, formatMap: toyFormatDigitMap,
      });
      setStatus(
        total
          ? `Automorphic search found ${total} digit-renamed ${total === 1 ? 'identity' : 'identities'}.`
          : 'Automorphic search found no identities.',
        total ? 'ok' : 'warn',
      );
    }

      function commitPlayerEdit(
        mutator,
        successMessage,
        failureMessage = 'That player edit could not be applied.',
        options = {},
      ) {
      if (busy) return false;
      leaveHistoryPreview();
      const before = snapshotState();
      if (!mutator()) {
        setStatus(failureMessage, 'warn');
        renderBoard();
        return false;
      }

        // Candidate edits can invalidate the stored solution. A verified
        // solution promotion is different: preserve it so subsequent correct
        // promotions remain eligible in the same manual solve session.
        if (options.preserveSolution !== true) solution = null;
      resetAnalysisAfterPlayerEdit();
      undoStack.push(before);
      redoStack = [];
      setStatus(successMessage, 'ok');
      render();
      return true;
    }

    function showLogicSafeguardNote(message, note) {
      const popup = `${message}\n\n${note}`;
      setStatus(message, 'warn');
      window.alert(popup);
    }

    function selectPlayerTarget(cell, digit = null) {
      if (!Number.isInteger(cell) || cell < 0 || cell >= 81) return;
      selectedPlayerCell = cell;
      selectedPlayerDigit = Number.isInteger(digit) ? digit : selectedPlayerDigit;
      renderBoard();
      requestAnimationFrame(() => {
        boardEl.querySelector(`[data-player-cell="${cell}"]`)?.focus?.({ preventScroll: true });
      });
    }

    function addPlayerCandidate(cell, digit) {
      const validation = validatePlayerCandidate({
        cell,
        digit,
        puzzle,
        promotedValues,
        candidates: cand,
        originalPuzzle,
        core,
      });
      if (validation?.duplicate) return false;
      if (validation) return commitPlayerEdit(() => false, '', validation.message);
      const values = cand[cell] || [];

      selectedPlayerCell = cell;
      selectedPlayerDigit = digit;
      return commitPlayerEdit(() => {
        cand[cell] = [...values, digit].sort((left, right) => left - right);
        return true;
      }, `Candidate ${digit} added to ${core.cellName(cell)}.`, undefined, { preserveSolution: true });
    }

    function solvePlayerCell(cell, digit) {
      const validation = validatePlayerPromotion({
        cell,
        digit,
        puzzle,
        promotedValues,
        candidates: cand,
        originalPuzzle,
        solution,
        promotionSecurityDisabled,
        core,
      });
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      if (validation) {
        return commitPlayerEdit(() => false, '', validation.message);
      }

      selectedPlayerCell = cell;
      selectedPlayerDigit = digit;
      return commitPlayerEdit(() => {
        const beforeCandidates = cand.map(values => [...(values || [])]);

        puzzle[cell] = digit;
        promotedValues[cell] = digit;
        cand[cell] = [];
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || puzzle[other] || promotedValues[other]) continue;
          const legal = new Set(core.candidatesFor(puzzle, other));
          cand[other] = (cand[other] || []).filter(value => legal.has(value));
        }

        const affected = [cell];
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || originalPuzzle[other] || puzzle[other] || promotedValues[other]) continue;
          const before = beforeCandidates[other];
          const after = cand[other] || [];
          if (!playerArraysEqual(before, after)) affected.push(other);
        }
        const entries = affected.map(other => ({
          cell: other,
          puzzle: puzzle[other],
          promoted: promotedValues[other],
          cand: beforeCandidates[other],
          afterPuzzle: puzzle[other],
          afterPromoted: promotedValues[other],
          afterCand: [...(cand[other] || [])],
        }));

        for (const entry of entries) {
          entry.afterPuzzle = puzzle[entry.cell];
          entry.afterPromoted = promotedValues[entry.cell];
          entry.afterCand = [...(cand[entry.cell] || [])];
        }
        playerSolveBackups.set(cell, { digit, entries });
        return true;
        }, `${core.cellName(cell)} set to ${digit}.`, undefined, { preserveSolution: true });
    }

    function clearPlayerSolvedCell(cell) {
      if (!puzzle[cell]) return false;
      const validation = validatePlayerClear({
        cell,
        puzzle,
        solution,
        originalPuzzle,
        core,
      });
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      const solvedDigit = puzzle[cell];
      return commitPlayerEdit(() => {
        const backup = playerSolveBackups.get(cell);
        puzzle[cell] = 0;
        promotedValues[cell] = 0;

        if (backup?.digit === solvedDigit) {
          for (const entry of backup.entries) {
            if (entry.cell === cell) {
              cand[entry.cell] = [...entry.cand];
              continue;
            }
            const unchangedSinceSolve = puzzle[entry.cell] === entry.afterPuzzle
              && promotedValues[entry.cell] === entry.afterPromoted
              && playerArraysEqual(cand[entry.cell] || [], entry.afterCand);
            if (unchangedSinceSolve) cand[entry.cell] = [...entry.cand];
          }
        } else {
          const rebuilt = core.allCandidates(puzzle);
          cand[cell] = rebuilt[cell] || [];
        }

        playerSolveBackups.delete(cell);
        selectedPlayerDigit = null;
        return true;
      }, `${core.cellName(cell)} cleared.`);
    }

    function removePlayerDigit(cell, digit) {
      if (!isPlayerEditableCell(cell)) {
        showLogicSafeguardNote(
          `${core.cellName(cell)} is a fixed Sudoku value and cannot be deleted.`,
          'Your logic is flawed. Double-check it.',
        );
        return false;
      }
      if (puzzle[cell]) return clearPlayerSolvedCell(cell);
      if (promotedValues[cell]) return clearPlayerSolvedCell(cell);
      const values = cand[cell] || [];
      const validation = validatePlayerCandidateRemoval({
        cell,
        digit,
        candidates: cand,
        solution,
        core,
      });
      if (validation?.unchanged) return false;
      if (validation?.safeguard) {
        showLogicSafeguardNote(validation.message, validation.note);
        return false;
      }
      if (validation) {
        return commitPlayerEdit(() => false, '', validation.message);
      }

      selectedPlayerCell = cell;
      selectedPlayerDigit = digit;
      return commitPlayerEdit(() => {
        cand[cell] = values.filter(value => value !== digit);
        return true;
        }, `Candidate ${digit} removed from ${core.cellName(cell)}.`, undefined, { preserveSolution: true });
    }

    function handlePlayerDigitClick(event, cell, digit, remove = false) {
      event.preventDefault();
      event.stopPropagation();
      selectedPlayerCell = cell;
      selectedPlayerDigit = digit;
      if (!remove && event.detail === 2) {
        playerPromotionMode = false;
        solvePlayerCell(cell, digit);
        return;
      }
      if (remove) {
        removePlayerDigit(cell, digit);
        playerPromotionMode = false;
      } else if (playerPromotionMode) {
        solvePlayerCell(cell, digit);
        playerPromotionMode = false;
      } else if (!cellHasCandidate(cell, digit)) {
        addPlayerCandidate(cell, digit);
      } else {
        renderBoard();
      }
    }

    function handlePlayerCellClick(event, cell) {
      if (event.target.closest('.mark')) return;
      selectPlayerTarget(cell);
    }

    function handlePlayerCellContextMenu(event, cell) {
      event.preventDefault();
      if (event.target.closest('.mark')) return;
      selectPlayerTarget(cell);
    }

    function movePlayerSelection(rowDelta, colDelta) {
      const current = selectedPlayerCell ?? 0;
      const row = Math.floor(current / 9);
      const col = current % 9;
      const wrap = value => (value + 9) % 9;
      const nextRow = wrap(row + rowDelta);
      const nextCol = wrap(col + colDelta);
      selectPlayerTarget(nextRow * 9 + nextCol);
    }

    function isPlayerTextEntryTarget(target) {
      return target instanceof Element
        && Boolean(target.closest('input, select, textarea, button, [contenteditable="true"]'));
    }

    function handlePlayerKeydown(event) {
      if (busy || selectedPlayerCell === null || isPlayerTextEntryTarget(event.target)) return;

      if (event.ctrlKey || event.metaKey) {
        const ctrlDigitMatch = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
        if (ctrlDigitRemovesCandidate && ctrlDigitMatch) {
          event.preventDefault();
          const digit = Number(ctrlDigitMatch[1]);
          if (puzzle[selectedPlayerCell] || promotedValues[selectedPlayerCell]) {
            setStatus('Solved cells cannot have candidates removed.', 'warn');
          } else {
            removePlayerDigit(selectedPlayerCell, digit);
          }
          playerPromotionMode = false;
          return;
        }
        if (event.key.toLowerCase() === 'z') {
          event.preventDefault();
          undoCycle();
        } else if (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z')) {
          event.preventDefault();
          redoCycle();
        }
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        playerPromotionMode = true;
        return;
      }

      const digitMatch = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
      const digit = /^[1-9]$/.test(event.key)
        ? Number(event.key)
        : digitMatch ? Number(digitMatch[1]) : null;
      if (digit !== null && !event.altKey) {
        event.preventDefault();
        if (playerPromotionMode) solvePlayerCell(selectedPlayerCell, digit);
        else addPlayerCandidate(selectedPlayerCell, digit);
        playerPromotionMode = false;
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (puzzle[selectedPlayerCell] || promotedValues[selectedPlayerCell]) {
          clearPlayerSolvedCell(selectedPlayerCell);
        } else if (selectedPlayerDigit !== null) {
          removePlayerDigit(selectedPlayerCell, selectedPlayerDigit);
        } else {
          setStatus('Select a candidate before deleting it.', 'warn');
        }
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        selectPlayerTarget(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        selectPlayerTarget(80);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        movePlayerSelection(-1, 0);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        movePlayerSelection(1, 0);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePlayerSelection(0, -1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        movePlayerSelection(0, 1);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        selectedPlayerCell = null;
        selectedPlayerDigit = null;
        playerPromotionMode = false;
        renderBoard();
      }
    }

    function bindPlayerDigitElement(element, cell, digit) {
      element.dataset.playerCell = String(cell);
      element.dataset.playerDigit = String(digit);
      element.classList.add('player-mark');
      if (selectedPlayerCell === cell && selectedPlayerDigit === digit) {
        element.classList.add('player-digit-selected');
      }
      element.addEventListener('click', event => handlePlayerDigitClick(event, cell, digit));
      element.addEventListener('contextmenu', event => handlePlayerDigitClick(event, cell, digit, true));
    }

    function accessibleCellLabel(cell) {
      const row = Math.floor(cell / 9) + 1;
      const column = (cell % 9) + 1;
      const value = puzzle[cell] || promotedValues[cell] || 0;
      if (value) {
        return `Row ${row}, Column ${column}, ${originalPuzzle[cell] ? 'given ' : 'value '}${value}`;
      }
      const candidates = (cand[cell] || []).join(', ') || 'no candidates';
      return `Row ${row}, Column ${column}, empty, candidates ${candidates}`;
    }

    function bindPlayerCellElement(element, cell) {
      element.dataset.playerCell = String(cell);
      const rovingCell = selectedPlayerCell ?? 0;
      element.tabIndex = rovingCell === cell ? 0 : -1;
      element.setAttribute('role', 'gridcell');
      element.setAttribute('aria-rowindex', String(Math.floor(cell / 9) + 1));
      element.setAttribute('aria-colindex', String((cell % 9) + 1));
      element.setAttribute('aria-label', accessibleCellLabel(cell));
      if (isPlayerEditableCell(cell)) element.classList.add('player-editable');
      if (selectedPlayerCell === cell) element.classList.add('player-selected');
      element.addEventListener('focus', () => {
        selectedPlayerCell = cell;
        selectedPlayerDigit = null;
        playerPromotionMode = false;
        for (const other of boardEl.querySelectorAll('[role="gridcell"].player-selected')) {
          if (other !== element) other.classList.remove('player-selected');
        }
        element.classList.add('player-selected');
      });
      element.addEventListener('click', event => handlePlayerCellClick(event, cell));
      element.addEventListener('contextmenu', event => handlePlayerCellContextMenu(event, cell));
    }

    const visualAtomCallbacks = { chainCandidateIsVisible, atomKey };
    const chainSideAtoms = (side, forcedDigit = null, existingOnly = false) =>
      appNamespace.chainVisualModel.chainSideAtoms(
        side,
        forcedDigit,
        existingOnly,
        visualAtomCallbacks,
      );
    const addWeakDigitMarks = (weakMarks, side, digit, existingOnly = true) =>
      appNamespace.chainVisualModel.addWeakDigitMarks(
        weakMarks,
        side,
        digit,
        existingOnly,
        visualAtomCallbacks,
      );
    const addChainSideMarks = (side, marks, cells, orderByCell, order, existingOnly = true) =>
      appNamespace.chainVisualModel.addChainSideMarks(
        side,
        marks,
        cells,
        orderByCell,
        order,
        existingOnly,
        visualAtomCallbacks,
      );

    const isAlsVisualStep = step => appNamespace.chainVisualModel.isAlsVisualStep(step, core.ALS);
    const isAhsVisualStep = appNamespace.chainVisualModel.isAhsVisualStep;
    const isModuleVisualStep = step => appNamespace.chainVisualModel.isModuleVisualStep(step, core.ALS);
    const isAlmostFishVisualStep = appNamespace.chainVisualModel.isAlmostFishVisualStep;

    const { chainModuleSubsets, moduleVisualSides } = appNamespace.chainVisualModel;

    const visibleChainEntrySide = step => appNamespace.chainVisualModel.visibleChainEntrySide(
      step,
      isAlsVisualStep,
    );
    const visibleChainExitSide = step => appNamespace.chainVisualModel.visibleChainExitSide(
      step,
      isAlsVisualStep,
    );
    const orientedDisplayChainSteps = steps => appNamespace.chainVisualModel.orientedDisplayChainSteps(
      steps,
      core.peersOf,
    );

    const {
      alsVisualKey,
      alsVisualSideKey,
      ahsVisualKey,
      ahsVisualSideKey,
    } = appNamespace.chainVisualModel;

    const alsColorMapForChain = chain => appNamespace.chainVisualModel.alsColorMapForChain(
      chain,
      { isAlsVisualStep, moduleVisualSides, alsVisualSideKey, colorAt: alsColorAt },
    );

    const ALS_CHAIN_COLORS = appNamespace.chainVisualPalette.alsColors;

    const alsColorAt = appNamespace.chainVisualPalette.colorAt;

    const AHS_RECORD_COLOR = appNamespace.chainVisualPalette.ahsRecordColor;

    // AHS structures are independent chain nodes. Keep the original blue for
    // standalone records, but distinguish multiple AHS nodes in one chain.
    const AHS_CHAIN_COLORS = appNamespace.chainVisualPalette.ahsColors;

    const ahsColorMapForChain = chain => appNamespace.chainVisualModel.ahsColorMapForChain(
      chain,
      { isAhsVisualStep, moduleVisualSides, ahsVisualSideKey, ahsColors: AHS_CHAIN_COLORS },
    );

    const hashString = appNamespace.chainVisualPalette.hashString;
    const ahsColorForSide = (step, side, role, colorMap = null) =>
      appNamespace.chainVisualModel.ahsColorForSide(
        step,
        side,
        role,
        colorMap,
        { ahsVisualSideKey, ahsRecordColor: AHS_RECORD_COLOR },
      );
    const alsColorForSide = (step, side, role, colorMap = null) =>
      appNamespace.chainVisualModel.alsColorForSide(
        step,
        side,
        role,
        colorMap,
        { alsVisualSideKey, alsColors: ALS_CHAIN_COLORS, hashString },
      );

    const {
      applyAlsColorVars,
      applyAlsPartitionColors,
      applyAhsColorVars,
    } = appNamespace.chainVisualPalette;

    const digitAnchor = (cell, digit) => appNamespace.chainVisualGeometry.digitAnchor(boardEl, cell, digit);
    const vantageCellSlot = appNamespace.chainVisualGeometry.vantageCellSlot;
    const vantageCellFromSlot = appNamespace.chainVisualGeometry.vantageCellFromSlot;
    const vantageAtomAnchor = (cell, digit) =>
      appNamespace.chainVisualGeometry.vantageAtomAnchor(gridView, cell, digit);

    function vantageSideAnchors(side, forcedDigit = null, existingOnly = true) {
      const sideDigits = side?.digits || [];
      const digits = forcedDigit == null ? sideDigits : [forcedDigit];
      const anchors = [];

      for (const cell of side?.cells || []) {
        for (const digit of digits) {
          if (!sideDigits.includes(digit)) continue;
          if (existingOnly && !chainCandidateIsVisible(cell, digit)) continue;
          anchors.push(vantageAtomAnchor(cell, digit));
        }
      }

      return anchors;
    }

    function vantageClosestAnchorPair(fromSide, toSide, forcedDigit = null, toDigit = forcedDigit) {
      const fromAnchors = vantageSideAnchors(fromSide, forcedDigit);
      const toAnchors = vantageSideAnchors(toSide, toDigit);
      let best = null;

      for (const from of fromAnchors) {
        for (const to of toAnchors) {
          const dx = from.x - to.x;
          const dy = from.y - to.y;
          const distance = dx * dx + dy * dy;
          if (!best || distance < best.distance) best = { from, to, distance };
        }
      }

      return best;
    }

    function drawVantageSideBoxes(svg, side, className, color = null, onlyDigits = null) {
      for (const anchor of vantageSideAnchors(side, null, true)) {
        if (onlyDigits && !onlyDigits.includes(anchor.digit)) continue;
        const half = anchor.markSize * 0.4;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(anchor.x - half));
        rect.setAttribute('y', String(anchor.y - half));
        rect.setAttribute('width', String(anchor.markSize * .8));
        rect.setAttribute('height', String(anchor.markSize * .8));
        rect.setAttribute('rx', '.35');
        rect.setAttribute('ry', '.35');
        rect.setAttribute('class', className);
        applyAlsColorVars(rect, color);
        svg.appendChild(rect);
      }
    }

    function drawVantageStrongConnection(svg, fromSide, toSide) {
      const digit = resolvedStrongDigit(fromSide, toSide);
      const pair = vantageClosestAnchorPair(fromSide, toSide, digit);
      if (!pair) return;
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, -0.22);
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, 0.22);
    }

    function drawVantageWeakConnection(svg, fromSide, toSide, weakFromDigit = null, weakToDigit = weakFromDigit) {
      ({ fromDigit: weakFromDigit, toDigit: weakToDigit } = resolvedWeakDigits(
        fromSide, toSide, weakFromDigit, weakToDigit,
      ));
      const pair = vantageClosestAnchorPair(fromSide, toSide, weakFromDigit, weakToDigit);
      if (!pair) return;
      drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
    }

    function drawVantageWeakConnections(svg, fromSide, toSide, weakDigits = []) {
      const digits = [...new Set((Array.isArray(weakDigits) ? weakDigits : [weakDigits])
        .filter(digit => digit != null))];
      if (!digits.length) {
        drawVantageWeakConnection(svg, fromSide, toSide);
        return;
      }

      const center = (digits.length - 1) / 2;
      for (let index = 0; index < digits.length; index++) {
        const pair = vantageClosestAnchorPair(fromSide, toSide, digits[index]);
        if (!pair) continue;
        drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, (index - center) * .7);
      }
    }

    function renderVantageChainOverlay(chain) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');

      const steps = orientedDisplayChainSteps(chain.steps);

      for (let index = 0; index < steps.length; index++) {
        const step = steps[index];
        if (index > 0) {
          const fromSide = visibleChainExitSide(steps[index - 1]);
          const toSide = visibleChainEntrySide(step);
          const weakFromDigit = step.weakFromDigit ?? step.weakDigit;
          const weakToDigit = step.weakToDigit ?? step.weakDigit;
          drawVantageWeakConnection(svg, fromSide, toSide, weakFromDigit, weakToDigit);
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

    function renderVantageStrongLinkOverlay(strongLink) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay strong-link-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');

      const startSide = {
        cells: strongLink.activeCells || [],
        digits: strongLink.startingDigits || [],
      };
      const endSide = {
        cells: strongLink.linkedCells || [],
        digits: strongLink.linkDigits || [],
      };
      drawVantageSideBoxes(svg, startSide, 'strong-link-side-box strong-link-start-box');
      drawVantageSideBoxes(svg, endSide, 'strong-link-side-box strong-link-end-box');

      const pair = vantageClosestAnchorPair(startSide, endSide);
      if (pair) {
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, -.22);
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, .22);
      }

      boardEl.appendChild(svg);
    }

    const digitBoxBounds = appNamespace.chainVisualGeometry.digitBoxBounds;
    const visualGeometryCallbacks = { digitAnchor, chainCandidateIsVisible };
    const sideAnchors = (side, forcedDigit = null, existingOnly = true) =>
      appNamespace.chainVisualGeometry.sideAnchors(
        side,
        forcedDigit,
        existingOnly,
        visualGeometryCallbacks,
      );
    const sideDigitGroups = side => appNamespace.chainVisualGeometry.sideDigitGroups(side, sideAnchors);
    const digitBoundsFromAnchors = appNamespace.chainVisualGeometry.digitBoundsFromAnchors;
    const groupedSideDigits = side => appNamespace.chainVisualGeometry.groupedSideDigits(side, sideDigitGroups);
    const boxEdgeAnchor = appNamespace.chainVisualGeometry.boxEdgeAnchor;
    const crossDigitAnchorPair = (
      fromSide, toSide, fromDigits, toDigits,
    ) => appNamespace.chainVisualGeometry.crossDigitAnchorPair(
      fromSide,
      toSide,
      fromDigits,
      toDigits,
      sideAnchors,
    );
    const chainSectorFrameData = sectors => appNamespace.chainVisualGeometry.chainSectorFrameData(
      sectors,
      core.variantUnitName,
      sectorFrameRects,
    );
    const superMultiGroupBounds = appNamespace.chainVisualGeometry.superMultiGroupBounds;
    const closestAnchorPair = (
      fromSide,
      toSide,
      forcedDigit = null,
      toDigit = forcedDigit,
      existingOnly = true,
    ) => appNamespace.chainVisualGeometry.closestAnchorPair(
      fromSide,
      toSide,
      forcedDigit,
      toDigit,
      existingOnly,
      visualGeometryCallbacks,
    );

    function resolvedWeakDigits(fromSide, toSide, fromDigit, toDigit) {
      if (fromDigit == null && toDigit == null
        && (fromSide?.digits || []).length === 1
        && (toSide?.digits || []).length === 1
        && fromSide.digits[0] !== toSide.digits[0]) {
        // Preserve the displayed weak inference between distinct singleton
        // endpoints, e.g. the 4-3 handoff between adjacent AIC links.
        return { fromDigit: fromSide.digits[0], toDigit: toSide.digits[0] };
      }
      if (fromDigit == null || toDigit == null || fromDigit === toDigit) {
        return { fromDigit, toDigit };
      }
      const fromDigits = new Set(fromSide?.digits || []);
      const shared = [...new Set(toSide?.digits || [])]
        .filter(digit => fromDigits.has(digit));
      // A grouped endpoint may carry a stale source digit from another
      // branch. Use the single shared candidate when the handoff is clear.
      if (shared.length === 1) return { fromDigit: shared[0], toDigit: shared[0] };
      return { fromDigit, toDigit };
    }

    function resolvedStrongDigit(fromSide, toSide) {
      const fromDigits = new Set(fromSide?.digits || []);
      const shared = [...new Set(toSide?.digits || [])]
        .filter(digit => fromDigits.has(digit));
      // A bivalent endpoint represents separate digit anchors. When only one
      // digit is common, select that mark instead of whichever mark happens
      // to be geometrically closest.
      return shared.length === 1 ? shared[0] : null;
    }

    const { anchorRow, anchorCol } = appNamespace.chainVisualGeometry;

    const {
      orderedEdgeArc,
      arcControlPoint,
      boardOverflow,
      bendSignForArc,
      routeArc,
      arcPath,
    } = appNamespace.chainVisualGeometry;

    function drawArc(svg, from, to, className, bend = 4, lane = 0) {
      const route = routeArc(from, to, bend, lane);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', arcPath(route.from, route.to, route.bend, route.lane));
      path.setAttribute('class', className);
      svg.appendChild(path);
      return path;
    }

    function drawSideDigitBoxes(svg, side, className, color = null, onlyDigits = null) {
      for (const anchors of sideDigitGroups(side)) {
        if (onlyDigits && !onlyDigits.includes(anchors[0]?.digit)) continue;
        const box = digitBoundsFromAnchors(anchors, true);
        if (!box) continue;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(box.left));
        rect.setAttribute('y', String(box.top));
        rect.setAttribute('width', String(Math.max(0.9, box.right - box.left)));
        rect.setAttribute('height', String(Math.max(0.9, box.bottom - box.top)));
        rect.setAttribute('rx', '0.45');
        rect.setAttribute('ry', '0.45');
        rect.setAttribute('class', className);
        applyAlsColorVars(rect, color);
        svg.appendChild(rect);
      }
    }

    function drawGroupedEndpointBox(svg, side, className) {
      const digits = groupedSideDigits(side);
      if (digits.length) drawSideDigitBoxes(svg, side, className, null, digits);
    }

    function drawAlmostFishOverlay(svg, step) {
      const construction = step.view?.node?.raw?.xorConstruction;
      if (construction?.kind !== 'almost-fish') return;
      const digit = Number(construction.digit);
      const fishCells = [...new Set(construction.fishCells || [])];
      const extraCells = [...new Set(construction.extraCells || [])];
      const fish = construction.fish || {};
      if (!Number.isInteger(digit) || !fishCells.length) return;

      const fishSide = { cells: fishCells, digits: [digit] };
      for (const anchor of sideAnchors(fishSide, digit, true)) {
        const box = digitBoxBounds(anchor, .16);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(box.left));
        rect.setAttribute('y', String(box.top));
        rect.setAttribute('width', String(Math.max(.8, box.right - box.left)));
        rect.setAttribute('height', String(Math.max(.8, box.bottom - box.top)));
        rect.setAttribute('rx', '.32');
        rect.setAttribute('ry', '.32');
        rect.setAttribute('class', 'almost-fish-digit-box');
        svg.appendChild(rect);
      }

      // Each cover is shown as a straight double-dashed connection between
      // the fish digits it covers. This keeps the fish proposition visually
      // separate from the ordinary cell XOR endpoint.
      for (const sector of fish.coverSectors || []) {
        const covered = fishCells
          .filter(cell => core.UNITS?.[sector]?.includes(cell))
          .map(cell => digitAnchor(cell, digit))
          .filter(Boolean);
        if (covered.length < 2) continue;
        covered.sort((left, right) => left.x - right.x || left.y - right.y);
        for (let index = 1; index < covered.length; index++) {
          const from = covered[index - 1];
          const to = covered[index];
          for (const lane of [-.72, .72]) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.hypot(dx, dy) || 1;
            const nx = -dy / length * lane;
            const ny = dx / length * lane;
            line.setAttribute('x1', String(from.x + nx));
            line.setAttribute('y1', String(from.y + ny));
            line.setAttribute('x2', String(to.x + nx));
            line.setAttribute('y2', String(to.y + ny));
            line.setAttribute('class', 'almost-fish-cover-line');
            svg.appendChild(line);
          }
        }
      }

      drawSideDigitBoxes(
        svg,
        { cells: extraCells, digits: [digit] },
        'strong-link-side-box strong-link-start-box',
      );
      drawStrongConnection(
        svg,
        { cells: extraCells, digits: [digit] },
        fishSide,
      );
    }

    function groupedAnchorPair(
      fromSide,
      toSide,
      forcedDigit = null,
      toDigit = forcedDigit,
      allowMissing = false,
    ) {
      let existingOnly = true;
      let pair = closestAnchorPair(fromSide, toSide, forcedDigit, toDigit, true);
      if (!pair && allowMissing) {
        existingOnly = false;
        pair = closestAnchorPair(fromSide, toSide, forcedDigit, toDigit, false);
      }
      if (!pair) return pair;

      // A grouped strong link must terminate at the group boundary rather
      // than at whichever member happens to be closest. Weak links already
      // arrive here with an explicit digit; strong links need the same
      // treatment when either side contains multiple cells for that digit.
      const hasGroupedDigit = side => sideDigitGroups(side)
        .some(anchors => new Set(anchors.map(anchor => anchor.cell)).size > 1);
      if (forcedDigit == null && toDigit == null
        && !hasGroupedDigit(fromSide) && !hasGroupedDigit(toSide)) return pair;

      const fromDigit = forcedDigit == null ? pair.from.digit : forcedDigit;
      const toDigitValue = toDigit == null ? pair.to.digit : toDigit;
      const fromBox = digitBoundsFromAnchors(sideAnchors(fromSide, fromDigit, existingOnly));
      const toBox = digitBoundsFromAnchors(sideAnchors(toSide, toDigitValue, existingOnly));
      let from = pair.from;
      let to = pair.to;
      if (fromBox) from = boxEdgeAnchor(fromBox, to, from);
      if (toBox) to = boxEdgeAnchor(toBox, from, to);
      return { from, to };
    }

    function drawStrongConnection(svg, fromSide, toSide, allowMissing = false) {
      const digit = resolvedStrongDigit(fromSide, toSide);
      const pair = groupedAnchorPair(fromSide, toSide, digit, digit, allowMissing);
      if (!pair) return;
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, -0.38);
      drawArc(svg, pair.from, pair.to, 'chain-strong-line', 5, 0.38);
    }

    function drawWeakConnection(
      svg,
      fromSide,
      toSide,
      weakFromDigit = null,
      weakToDigit = weakFromDigit,
      allowMissing = false,
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
      drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
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

    function drawWeakConnections(svg, fromSide, toSide, weakDigits = []) {
      const digits = [...new Set((Array.isArray(weakDigits) ? weakDigits : [weakDigits])
        .filter(digit => digit != null))];
      if (!digits.length) {
        drawWeakConnection(svg, fromSide, toSide);
        return;
      }

      const center = (digits.length - 1) / 2;
      for (let index = 0; index < digits.length; index++) {
        const pair = groupedAnchorPair(fromSide, toSide, digits[index]);
        if (!pair) continue;
        drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, (index - center) * 1.1);
      }
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

    function drawChainSectorFrames(svg, sectors) {
      for (const { name, rect } of chainSectorFrameData(sectors)) {
        const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frame.setAttribute('x', String(rect.left));
        frame.setAttribute('y', String(rect.top));
        frame.setAttribute('width', String(rect.width));
        frame.setAttribute('height', String(rect.height));
        frame.setAttribute('class', 'chain-sector-frame');
        frame.dataset.sector = name;
        svg.appendChild(frame);
      }
    }

    function renderChainOverlay(chain) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const steps = orientedDisplayChainSteps(chain.steps);
      const isPureXyChain = steps.length > 0
        && steps.every(step =>
          step.family === 'SL' && Number(step.linkType) === 4);

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
            drawWeakConnection(
              svg,
              { cells: [pair[0]], digits: [bridge.digit] },
              { cells: [pair[1]], digits: [bridge.digit] },
            );
          }
        }
        boardEl.appendChild(svg);
        return;
      }

      for (let index = 0; index < steps.length; index++) {
        const step = steps[index];
        drawAlmostFishOverlay(svg, step);
        if (!isModuleVisualStep(step) && !isPureXyChain) {
          // The chain endpoints already have their green/blue node graphics.
          // Add digit boxes only for intermediate sides.
          if (index > 0) {
            drawSideDigitBoxes(
              svg,
              step.entry,
              'strong-link-side-box strong-link-start-box',
            );
          }
          if (index < steps.length - 1) {
            drawSideDigitBoxes(
              svg,
              step.exit,
              'strong-link-side-box strong-link-end-box',
            );
          }
        }
        // A grouped endpoint needs one enclosing box for the whole link.
        // Single-cell endpoints keep their existing green/blue node graphics;
        // boxing those again would double-stamp the chain start/end.
        if (!isModuleVisualStep(step) && !isPureXyChain) {
          if (index === 0) {
            drawGroupedEndpointBox(
              svg,
              step.entry,
              'strong-link-side-box strong-link-start-box',
            );
          }
          if (index === steps.length - 1) {
            drawGroupedEndpointBox(
              svg,
              step.exit,
              'strong-link-side-box strong-link-end-box',
            );
          }
        }
        if (index > 0) {
          const fromSide = visibleChainExitSide(steps[index - 1]);
          const toSide = visibleChainEntrySide(step);
          const weakFromDigit = step.weakFromDigit ?? step.weakDigit;
          const weakToDigit = step.weakToDigit ?? step.weakDigit;
          drawChainSectorFrames(svg, step.weakSectors);
          const drewDirectAlc = chain?.alcXz
            && steps.length === 2
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
              ? common.restrictedDigits
              : (common.digits || []);
            drawWeakConnections(svg, moduleSides.entry, moduleSides.exit, weakDigits);
          }
        }
        if (!isModuleVisualStep(step) && !isAlmostFishVisualStep(step)) {
          // Keep the proof visible even when an earlier move removed a
          // candidate that the selected chain still uses as an anchor. The
          // fallback is only a geometric slot; it does not recreate the mark.
          drawStrongConnection(svg, step.entry, step.exit, true);
        }
      }

      if (chain.isRing && steps.length) {
        const ringFrom = visibleChainExitSide(steps[steps.length - 1]);
        const ringTo = visibleChainEntrySide(steps[0]);
        // The direct ALC handoff already draws both RCC contacts. Repeating
        // them here would turn the two weak inferences into four lines.
        const directAlcRing = chain?.alcXz && steps.length === 2;
        if (!directAlcRing) {
          drawWeakConnection(
            svg,
            ringFrom,
            ringTo,
            chain.ringWeakFromDigit ?? chain.ringWeakDigit,
            chain.ringWeakToDigit ?? chain.ringWeakDigit,
          );
        }
      }

      boardEl.appendChild(svg);
    }

    function renderStrongLinkOverlay(strongLink) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay strong-link-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');

      const startSide = {
        cells: strongLink.activeCells || [],
        digits: strongLink.startingDigits || [],
      };
      const endSide = {
        cells: strongLink.linkedCells || [],
        digits: strongLink.linkDigits || [],
      };
      drawSideDigitBoxes(svg, startSide, 'strong-link-side-box strong-link-start-box');
      drawSideDigitBoxes(svg, endSide, 'strong-link-side-box strong-link-end-box');

      const pair = closestAnchorPair(startSide, endSide);
      if (pair) {
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, -0.38);
        drawArc(svg, pair.from, pair.to, 'strong-link-arc', 5, 0.38);
      }

      boardEl.appendChild(svg);
    }

    function renderSuperMultiGroupOverlay(record, vantage = false) {
      if (!record?.groupColours?.length) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay super-multi-group-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);

      for (const [groupIndex, group] of record.groupColours.entries()) {
        for (const side of group.sides || []) {
          const visualSide = { cells: side.cells || [], digits: [record.digit] };
          const anchors = vantage
            ? vantageSideAnchors(visualSide, record.digit, true)
            : sideAnchors(visualSide, record.digit, true);
          const bounds = superMultiGroupBounds(anchors);
          if (!bounds) continue;

          const token = side.colourTokens?.[0] || group.pairColours?.[side.side];
          const style = multiColoringStyleForToken(token);
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', String(bounds.left));
          rect.setAttribute('y', String(bounds.top));
          rect.setAttribute('width', String(Math.max(1.1, bounds.right - bounds.left)));
          rect.setAttribute('height', String(Math.max(1.1, bounds.bottom - bounds.top)));
          rect.setAttribute('rx', '0.8');
          rect.setAttribute('ry', '0.8');
          rect.setAttribute('class', 'super-multi-group-box');
          rect.dataset.groupId = String(group.id ?? '');
          rect.dataset.groupLabel = `${group.label || ''}${side.side === 0 ? 'A' : 'B'}`;
          if (style) {
            rect.setAttribute('fill', style.fill || 'transparent');
            rect.setAttribute('fill-opacity', '.22');
            rect.setAttribute('stroke', style.stroke || style.ink || '#475569');
          }
          svg.appendChild(rect);
        }

        // ERI keeps its row/column intersection cell in both XOR sides. Mark
        // that shared atom as a two-dimensional colour instead of allowing
        // the second side box to visually erase the first one.
        if ((group.sharedCells || []).length >= 1) {
          const sharedSide = { cells: group.sharedCells, digits: [record.digit] };
          const anchors = vantage
            ? vantageSideAnchors(sharedSide, record.digit, true)
            : sideAnchors(sharedSide, record.digit, true);
          const bounds = superMultiGroupBounds(anchors, 0.8);
          const leftStyle = multiColoringStyleForToken(group.sides?.[0]?.colourTokens?.[0]);
          const rightStyle = multiColoringStyleForToken(group.sides?.[1]?.colourTokens?.[0]);
          if (bounds && leftStyle && rightStyle) {
            const gradientId = `super-multi-shared-${groupIndex}-${String(group.id).replace(/[^a-z0-9_-]/gi, '-')}`;
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('x1', '0');
            gradient.setAttribute('y1', '0');
            gradient.setAttribute('x2', '1');
            gradient.setAttribute('y2', '1');
            for (const [offset, style] of [['0%', leftStyle], ['50%', leftStyle], ['50%', rightStyle], ['100%', rightStyle]]) {
              const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
              stop.setAttribute('offset', offset);
              stop.setAttribute('stop-color', style.fill || style.stroke);
              stop.setAttribute('stop-opacity', '.78');
              gradient.appendChild(stop);
            }
            defs.appendChild(gradient);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', String(bounds.left));
            rect.setAttribute('y', String(bounds.top));
            rect.setAttribute('width', String(Math.max(1.1, bounds.right - bounds.left)));
            rect.setAttribute('height', String(Math.max(1.1, bounds.bottom - bounds.top)));
            rect.setAttribute('rx', '0.8');
            rect.setAttribute('ry', '0.8');
            rect.setAttribute('class', 'super-multi-group-shared-box');
            rect.setAttribute('fill', `url(#${gradientId})`);
            rect.dataset.groupId = String(group.id ?? '');
            rect.dataset.sharedCell = 'true';
            svg.appendChild(rect);
          }
        }
      }

      boardEl.appendChild(svg);
    }

    function renderAlsDofOverlay(record, vantage = false) {
      if (!record || !record.primaryA) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay als-dof-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');

      const hubSide = {
        cells: record.primaryA.cells || [],
        digits: record.primaryA.digits || [],
      };
      const anchorPair = vantage ? vantageClosestAnchorPair : groupedAnchorPair;

      const auxiliary = record.auxiliary || [];
      const center = (auxiliary.length - 1) / 2;
      const endpointSide = record.primaryC
        ? {
            cells: record.primaryC.cells || [],
            digits: record.primaryC.digits || [],
          }
        : null;
      if (endpointSide) {
      }
      if (record.chainForm === 'auxiliary-hub-path' && endpointSide) {
        const pathSides = [
          hubSide,
          ...auxiliary.map(node => ({
            cells: node.cells || [],
            digits: node.digits || [],
          })),
          endpointSide,
        ];
        for (let index = 0; index < pathSides.length - 1; index += 1) {
          const left = pathSides[index];
          const right = pathSides[index + 1];
          const bridgeList = index === 0
            ? auxiliary[0]?.pathPrevBridges || []
            : auxiliary[index - 1]?.pathNextBridges || [];
          const digits = bridgeList
            .map(bridge => bridge.digit)
            .filter(digit => digit != null);
          const center = (digits.length - 1) / 2;
          for (const [digitIndex, digit] of digits.entries()) {
            const pair = anchorPair(left, right, digit, digit);
            if (!pair) continue;
            drawArc(
              svg,
              pair.from,
              pair.to,
              'chain-weak-line',
              -4.5,
              (index - (pathSides.length - 2) / 2) * 1.2
                + (digitIndex - center) * .7,
            );
          }
        }
        boardEl.appendChild(svg);
        return;
      }
      for (const [index, node] of auxiliary.entries()) {
        const side = { cells: node.cells || [], digits: node.digits || [] };

        const aBridgeDigits = (node.aBridges || [])
          .map(bridge => bridge.digit)
          .filter(digit => digit != null);
        const weakDigits = aBridgeDigits.length
          ? [...new Set(aBridgeDigits)]
          : node.rccDigits?.length
            ? node.rccDigits
            : [node.rccDigit ?? null].filter(digit => digit != null);
        const digitCenter = (weakDigits.length - 1) / 2;
        for (const [digitIndex, weakDigit] of weakDigits.entries()) {
          const pair = anchorPair(hubSide, side, weakDigit, weakDigit);
          if (!pair) continue;
          drawArc(
            svg,
            pair.from,
            pair.to,
            'chain-weak-line',
            -4.5,
            (index - center) * 1.2 + (digitIndex - digitCenter) * .7,
          );
        }

        // Endpoint C is the second half of an ALS-DOF chain. Its RCCs are
        // stored separately from the A-side bridges, so paint those links
        // from each auxiliary to C instead of stopping at the midpoint.
        if (endpointSide) {
          const terminalDigits = (node.cBridges || [])
            .map(bridge => bridge.digit)
            .filter(digit => digit != null);
          const terminalCenter = (terminalDigits.length - 1) / 2;
          for (const [digitIndex, terminalDigit] of terminalDigits.entries()) {
            const pair = anchorPair(side, endpointSide, terminalDigit, terminalDigit);
            if (!pair) continue;
            drawArc(
              svg,
              pair.from,
              pair.to,
              'chain-weak-line',
              -4.5,
              (index - center) * 1.2 + (digitIndex - terminalCenter) * .7,
            );
          }
        }
      }

      boardEl.appendChild(svg);
    }

    function renderHydraAlsDofOverlay(record, vantage = false) {
      if (!record || !record.primaryA) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'chain-overlay als-dof-overlay hydra-als-dof-overlay');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('aria-hidden', 'true');

      // Hydra's auxiliary is represented by its attached AIC branch.  The
      // ordinary ALS-DOF RCC arcs are deliberately not drawn here: they are
      // internal verification links, not the explanation of the Hydra move.
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
        const pair = (vantage ? vantageClosestAnchorPair : groupedAnchorPair)(
          hubSide,
          side,
          digit,
          digit,
        );
        if (!pair) continue;
        drawArc(svg, pair.from, pair.to, 'chain-weak-line', -4.5, 0);
      }
      boardEl.appendChild(svg);
    }

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

    const colouringNodeKey = appNamespace.colouringModel.colouringNodeKey;
    const selectedColouringRecord = method => appNamespace.colouringModel.selectedColouringRecord({
      simpleColoringReport,
      selectedSimpleColoringIndex,
      multiColoringReport,
      selectedMultiColoringIndex,
      superMultiColoringReport,
      selectedSuperMultiColoringIndex,
      threeDMedusaReport,
      selectedThreeDMedusaIndex,
      threeDMedusaMultiReport,
      selectedThreeDMedusaMultiIndex,
    }, method);
    const colouringSequenceNodes = appNamespace.colouringModel.colouringSequenceNodes;
    const colouringSequenceLinkLevels = appNamespace.colouringModel.colouringSequenceLinkLevels;
    const colouringSequenceEdgeLevels = appNamespace.colouringModel.colouringSequenceEdgeLevels;
    const colouringSequenceMedusaLevels = appNamespace.colouringModel.colouringSequenceMedusaLevels;
    const colouringSequenceLevels = appNamespace.colouringModel.colouringSequenceLevels;

    function colouringSequenceColourAssignments(record, method, levels, maxBreadth, breadth) {
      const colourLevels = new Map();
      const tokenLevels = new Map();
      const add = (map, key, value, level) => {
        if (value == null) return;
        const values = map.get(key) || new Map();
        if (!values.has(value) || level < values.get(value)) values.set(value, level);
        map.set(key, values);
      };
      const nodes = colouringSequenceNodes(record, method);

      if (method === 'simple') {
        for (const node of nodes) {
          const key = colouringNodeKey(node);
          const breadthColors = node.breadthColors || {};
          for (const color of node.colors || []) {
            const explicitLevel = breadthColors[color];
            add(
              colourLevels,
              key,
              color,
              Number.isFinite(Number(explicitLevel))
                ? Number(explicitLevel)
                : (levels.get(key) || 1),
            );
          }
        }
        return { colourLevels, tokenLevels };
      }

      if (method === 'medusaMulti') {
        // The completed report stores every parity/token reached by the full
        // walk. Reconstruct the actual breadth walk rather than using the
        // order in which visual links were serialized.
        const walk = colouringSequenceMedusaLevels(record, nodes);
        const stateLevels = walk.stateLevels;
        const linkLevels = walk.linkLevels;
        for (const [index, link] of (record.linkColours || []).entries()) {
          const linkLevel = linkLevels.get(index) || 1;
          for (const endpoint of link.endpoints || []) {
            const key = colouringNodeKey(endpoint);
            const reached = stateLevels.get(key) || new Map();
            for (let side = 0; side < (endpoint.colors || []).length; side++) {
              const color = endpoint.colors[side];
              const stateLevel = reached.get(color);
              if (!Number.isFinite(stateLevel)) continue;
              const level = Math.max(linkLevel, stateLevel);
              add(colourLevels, key, color, level);
              const token = endpoint.colourTokens?.[side];
              if (token != null) add(tokenLevels, key, token, level);
            }
          }
        }

        for (const node of nodes) {
          const key = colouringNodeKey(node);
          const reached = stateLevels.get(key) || new Map();
          for (const color of node.colors || []) {
            if (reached.has(color)) continue;
            // Preserve disconnected completed nodes only at the final step.
            if (breadth >= maxBreadth) {
              add(colourLevels, key, color, levels.get(key) || 1);
            }
          }
          if (breadth >= maxBreadth) {
            for (const token of node.colourTokens || []) {
              add(tokenLevels, key, token, levels.get(key) || 1);
            }
          }
        }
        return { colourLevels, tokenLevels };
      }

      if (method === 'multi' && !record.source) {
        const linkLevels = colouringSequenceLinkLevels(record);
        for (const [index, link] of (record.linkColours || []).entries()) {
          const level = linkLevels.get(index) || 1;
          for (const endpoint of link.endpoints || []) {
            const key = colouringNodeKey(endpoint);
            for (const color of endpoint.colors || []) add(colourLevels, key, color, level);
            for (const token of endpoint.colourTokens || []) add(tokenLevels, key, token, level);
          }
        }
        return { colourLevels, tokenLevels };
      }

      if (method === 'medusa') {
        // 3D-Medusa Simple is one two-colour parity walk. A node may carry
        // both colours in the completed graph, but its second colour must be
        // delayed until an opposite-parity path actually reaches it.
        const adjacency = new Map();
        for (const edge of record.edges || []) {
          if (edge.kind === 'weak-inference') continue;
          const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
          const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
          if (!left || !right || left === right) continue;
          if (!adjacency.has(left)) adjacency.set(left, []);
          if (!adjacency.has(right)) adjacency.set(right, []);
          adjacency.get(left).push({ key: right, flip: true });
          adjacency.get(right).push({ key: left, flip: true });
        }
        const first = nodes[0];
        if (first) {
          const firstKey = colouringNodeKey(first);
          const queue = [[firstKey, first.colors?.[0] ?? 0, 1]];
          const seen = new Set();
          while (queue.length) {
            const [key, color, level] = queue.shift();
            const stateKey = `${key}:${color}`;
            if (seen.has(stateKey)) continue;
            seen.add(stateKey);
            add(colourLevels, key, color, level);
            for (const edge of adjacency.get(key) || []) {
              queue.push([edge.key, edge.flip ? 1 - color : color, level + 1]);
            }
          }
        }
        for (const node of nodes) {
          const key = colouringNodeKey(node);
          for (const color of node.colors || []) {
            if (!colourLevels.get(key)?.has(color)) {
              // Preserve the full completed state only when the sequence has
              // reached the end. During stepping, an unreached parity stays
              // hidden instead of making the node look dual-coloured early.
              if (breadth >= maxBreadth) {
                add(colourLevels, key, color, levels.get(key) || 1);
              }
            }
          }
        }
        return { colourLevels, tokenLevels };
      }

      const adjacency = new Map();
      for (const edge of record.edges || []) {
        const left = edge.left?.cell == null ? null : colouringNodeKey(edge.left);
        const right = edge.right?.cell == null ? null : colouringNodeKey(edge.right);
        if (!left || !right || left === right) continue;
        if (!adjacency.has(left)) adjacency.set(left, []);
        if (!adjacency.has(right)) adjacency.set(right, []);
        adjacency.get(left).push({ key: right, flip: edge.kind !== 'overlap-extension' });
        adjacency.get(right).push({ key: left, flip: edge.kind !== 'overlap-extension' });
      }
      const first = nodes[0];
      if (first) {
        const firstKey = colouringNodeKey(first);
        const queue = [[firstKey, first.colors?.[0] ?? 0, 1]];
        const seen = new Set();
        while (queue.length) {
          const [key, color, level] = queue.shift();
          const stateKey = `${key}:${color}`;
          if (seen.has(stateKey)) continue;
          seen.add(stateKey);
          add(colourLevels, key, color, level);
          for (const edge of adjacency.get(key) || []) {
            queue.push([edge.key, edge.flip ? 1 - color : color, level + 1]);
          }
        }
      }
      for (const node of nodes) {
        const key = colouringNodeKey(node);
        if (!colourLevels.has(key)) {
          add(colourLevels, key, node.colors?.[0] ?? 0, levels.get(key) || 1);
        }
        if (breadth >= maxBreadth) {
          for (const color of node.colors || []) {
            add(colourLevels, key, color, levels.get(key) || 1);
          }
        }
      }
      return { colourLevels, tokenLevels };
    }

    const colouringSequenceInfo = (record, method) =>
      appNamespace.colouringModel.colouringSequenceInfo(record, method, colouringSequenceState);

    const visibleColouringNodes = (record, method, info) =>
      appNamespace.colouringModel.visibleColouringNodes(
        record,
        method,
        info,
        colouringSequenceColourAssignments,
      );

    const plausibleColouringEliminations = (record, method, info) =>
      appNamespace.colouringModel.plausibleColouringEliminations(
        record,
        method,
        info,
        visibleColouringNodes,
        core,
      );

    const displayColouringRecord = (record, method) =>
      appNamespace.colouringModel.displayColouringRecord(
        record,
        method,
        colouringSequenceState,
        visibleColouringNodes,
        plausibleColouringEliminations,
      );

    const selectColouringHighlightRecords = options =>
      appNamespace.colouringModel.selectColouringHighlightRecords({
        ...options,
        state: colouringSequenceState,
        visibleNodesFn: visibleColouringNodes,
        plausibleEliminationsFn: plausibleColouringEliminations,
      });

    const buildColouringHighlightMarks = options =>
      appNamespace.colouringModel.buildColouringHighlightMarks({
        ...options,
        atomKeyFn: atomKey,
        cellHasCandidateFn: cellHasCandidate,
      });

    const buildActiveStepHighlightContext = options =>
      appNamespace.highlightContext.buildActiveStepHighlightContext({
        ...options,
        cellsForSectorsFn: cellsForSectors,
        cellsForHouseFn: cellsForHouse,
      });

    const buildStrongLinkHighlightContext = options =>
      appNamespace.highlightContext.buildStrongLinkHighlightContext({
        ...options,
        cellHasCandidateFn: cellHasCandidate,
      });

    const buildAlsAhsHighlightContext = options =>
      appNamespace.highlightContext.buildAlsAhsHighlightContext({
        ...options,
        alsColorAtFn: alsColorAt,
        alsChainColors: ALS_CHAIN_COLORS,
        hashStringFn: hashString,
        cellHasCandidateFn: cellHasCandidate,
        atomKeyFn: atomKey,
        ahsRecordColor: AHS_RECORD_COLOR,
      });

    const resetAnalysisSelections = appNamespace.analysisState.resetAnalysisSelections;

    const mergeChainHighlightView = (target, source) =>
      appNamespace.highlightContext.mergeChainHighlightView(target, source);

    function updateColouringSequenceControls() {
      for (const method of Object.keys(colouringSequenceState)) {
        const state = colouringSequenceState[method];
        const info = colouringSequenceInfo(selectedColouringRecord(method), method);
        const prefix = method === 'medusaMulti' ? 'threeDMedusaMulti' : method === 'medusa' ? 'threeDMedusa' : method;
        const record = selectedColouringRecord(method);
        const label = document.getElementById(`${prefix}BreadthLabel`);
        const eliminationLabel = document.getElementById(`${prefix}EliminationLabel`);
        const previous = document.querySelector(`[data-colouring-step="${method}"][data-step="-1"]`);
        const next = document.querySelector(`[data-colouring-step="${method}"][data-step="1"]`);
        if (label) label.textContent = state.enabled ? `Step ${info.breadth} of ${info.max}` : 'Full';
        if (eliminationLabel) {
          const display = displayColouringRecord(record, method);
          eliminationLabel.textContent = `Eliminations visible: ${display?.eliminations?.length || 0}`;
        }
        if (previous) previous.disabled = !state.enabled || info.breadth <= 1;
        if (next) next.disabled = !state.enabled || info.breadth >= info.max;
      }
    }

    function setColouringSequenceEnabled(method, enabled) {
      appNamespace.colouringModel.setColouringSequenceEnabled(
        colouringSequenceState,
        method,
        enabled,
      );
      updateColouringSequenceControls();
      renderBoard();
    }

    function stepColouringSequence(method, delta) {
      appNamespace.colouringModel.stepColouringSequence(
        colouringSequenceState,
        method,
        delta,
        selectedMethod => colouringSequenceInfo(selectedColouringRecord(selectedMethod), selectedMethod),
      );
      updateColouringSequenceControls();
      renderBoard();
    }

    for (const input of document.querySelectorAll('[data-colouring-sequential]')) {
      input.addEventListener('change', () =>
        setColouringSequenceEnabled(input.dataset.colouringSequential, input.checked));
    }
    for (const button of document.querySelectorAll('[data-colouring-step]')) {
      button.addEventListener('click', () =>
        stepColouringSequence(button.dataset.colouringStep, Number(button.dataset.step)));
    }

    function currentHighlights() {
      const selectedDofRecord = selectedAlsDofRecord();
      const hydraRecord = selectedDofRecord?.hasHydra ? selectedDofRecord : selectedHydraRecord();
      const hydraChains = [...new Set((hydraRecord?.hydraBranches || [])
        .map(branch => branch.chain).filter(Boolean))];
      if (!hydraChains.length) hydraChains.push(...(hydraRecord?.participants || [])
        .map(participant => participant.chain).filter(Boolean));
      const chain = selectedChain() || hydraChains[0] || null;
      const chainView = chainHighlights(chain);
      for (const extraChain of hydraChains) {
        if (extraChain === chain) continue;
        const extraView = chainHighlights(extraChain);
        mergeChainHighlightView(chainView, extraView);
      }
      const alsRecord = selectedAlsRecord();
      const alsDofRecord = selectedDofRecord || hydraRecord;
      const ahsRecord = selectedAhsRecord();
      const ahsDofChainRecord = selectedAhsDofChainRecord();
      const ahsDofRecord = ahsDofChainRecord ? null : selectedAhsDofNetRecord();
      const alsAhsHighlights = buildAlsAhsHighlightContext({
        alsRecord,
        alsDofRecord,
        ahsRecord,
        ahsDofChainRecord,
        ahsDofRecord,
      });
      const {
        alsRecordCells,
        alsRecordMarks,
        alsRecordColor,
        alsDofMarks,
        alsDofCells,
        alsDofStyleByCell,
        alsDofStylesByCell,
        alsDofStyleByAtom,
        alsDofElimMarks,
        ahsRecordCells,
        ahsRecordMarks,
        ahsDofRecordCells,
        ahsDofRecordMarks,
        ahsDofRecordElimMarks,
        ahsDofRecordColor,
      } = alsAhsHighlights;
      const selectedStrongLinkGroup = strongLinkDisplayGroups()[selectedStrongLinkType] || [];
      const strongLink = selectedStrongLinkType === null || selectedStrongLinkIndex === null
        ? null
        : selectedStrongLinkGroup[selectedStrongLinkIndex] || null;
      const strongLinkMarks = buildStrongLinkHighlightContext({
        strongLink,
        selectedStrongLinkType,
      });
      const {
        startMarks: strongLinkStartMarks,
        endMarks: strongLinkEndMarks,
        partitionByCell: strongLinkPartitionByCell,
      } = strongLinkMarks;
      const colouringRecords = selectColouringHighlightRecords({
        blocked: Boolean((activeStep && activeStep.tech !== 'colouring') || chain || alsRecord || alsDofRecord
          || ahsRecord || ahsDofRecord || strongLink),
        reports: {
          superMulti: superMultiColoringReport,
          medusaMulti: threeDMedusaMultiReport,
          multi: multiColoringReport,
          medusa: threeDMedusaReport,
          simple: simpleColoringReport,
        },
        indices: {
          superMulti: selectedSuperMultiColoringIndex,
          medusaMulti: selectedThreeDMedusaMultiIndex,
          multi: selectedMultiColoringIndex,
          medusa: selectedThreeDMedusaIndex,
          simple: selectedSimpleColoringIndex,
        },
      });
      const {
        raw: {
          superMulti: superMultiColoringRawRecord,
          medusaMulti: threeDMedusaMultiRawRecord,
          multi: multiColoringRawRecord,
          medusa: threeDMedusaRawRecord,
        },
        superMulti: superMultiColoringRecord,
        medusaMulti: threeDMedusaMultiRecord,
        multi: multiColoringRecord,
        medusa: threeDMedusaRecord,
        colouring: colouringRecord,
        activeMulti: activeMultiColoringRecord,
        simple: simpleColoringRecord,
      } = colouringRecords;
      const colouringMarks = buildColouringHighlightMarks({
        simpleRecord: simpleColoringRecord,
        colouringRecord,
        activeMultiRecord: activeMultiColoringRecord,
      });
      const {
        simple: simpleColoringMarks,
        simpleEliminations: simpleColoringElimMarks,
        medusa: threeDMedusaMarks,
        medusaEliminations: threeDMedusaElimMarks,
        medusaInvalid: threeDMedusaInvalidMarks,
        multi: multiColoringMarks,
        multiEliminations: multiColoringElimMarks,
      } = colouringMarks;
      const removed = lastRemoved;
      const chainRemoved = chain?.eliminations || [];
      const activeStepRemoved = activeStep?.elim?.items || [];
      const highlightContext = buildActiveStepHighlightContext({
        activeStep,
        removed,
        chainRemoved,
        activeStepRemoved,
        activeCandidateSizeFilters,
        candidateSizeFilterMatches,
      });
      const {
        removedMarks,
        vertices,
        alsDofClause,
        alsDofClauseCells,
        alsDofClauseDigit,
        isNonConsecutiveAlsDof,
        isMsls,
        mslsBaseCells,
        mslsCoverCells,
        mslsCoverAtoms,
        fins,
        endofins,
        patternDigits,
        isChromatic,
        chromaticRecord,
        chromaticCells,
        chromaticCoreCells,
        chromaticGuardians,
        chromaticDigits,
        candidateSizeFilterCells,
        baseCells,
        coverCells,
        fishCells,
        fishBaseIntersections,
        fishPeersOfBaseIntersection,
        fishDoubleCover,
        fishTripleCover,
        isFish,
        isSubset,
        isHiddenSubset,
      } = highlightContext;

      return {
        activeDigits: activeDigitHighlights,
        isHydra: !!hydraRecord,
        hydraChains,
        candidateSizeFilterCells,
        candidateSizeFilterStyle: candidateSizeFilterStyle(),
        removedMarks,
        vertices,
        alsDofClause,
        alsDofClauseCells,
        alsDofClauseDigit,
        isNonConsecutiveAlsDof,
        isMsls,
        mslsBaseCells,
        mslsCoverCells,
        mslsCoverAtoms,
        fins,
        endofins,
        patternDigits,
        isChromatic: !!chromaticRecord,
        chromaticRecord,
        chromaticCells,
        chromaticCoreCells,
        chromaticGuardians,
        chromaticDigits,
        baseCells,
        coverCells,
        fishCells,
        fishBaseIntersections,
        fishPeersOfBaseIntersection,
        fishDoubleCover,
        fishTripleCover,
        isFish,
        isSubset,
        isHiddenSubset,
        isChain: !!chain,
        isAlsRecord: !!alsRecord,
        alsRecordCells,
        alsRecordMarks,
        alsRecordColor,
        isAlsDof: !!alsDofRecord,
        alsDofRecord,
        alsDofCells,
        alsDofStyleByCell,
        alsDofStylesByCell,
        alsDofMarks,
        alsDofStyleByAtom,
        alsDofElimMarks,
        isAhsRecord: !!ahsRecord,
        ahsRecordCells,
        ahsRecordMarks,
        ahsRecordColor: ahsRecord ? AHS_RECORD_COLOR : null,
        isAhsDof: !!(ahsDofRecord || ahsDofChainRecord),
        ahsDofRecord,
        ahsDofRecordCells,
        ahsDofRecordMarks,
        ahsDofRecordElimMarks,
        ahsDofRecordColor: (ahsDofRecord || ahsDofChainRecord) ? AHS_RECORD_COLOR : null,
        ahsDofChainRecord,
        isStrongLink: !!strongLink,
        strongLink: strongLink && selectedStrongLinkType === 3
          && strongLink.secondaryXorConstruction?.kind === 'eri'
          ? {
              ...strongLink,
              activeCells: [...(strongLink.secondaryXorConstruction.activeCells || strongLink.activeCells || [])],
              linkedCells: [...(strongLink.secondaryXorConstruction.linkedCells || strongLink.linkedCells || [])],
            }
          : strongLink,
        strongLinkStartMarks,
        strongLinkEndMarks,
        strongLinkPartitionByCell,
        isSimpleColoring: !!simpleColoringRecord,
        simpleColoringRecord,
        simpleColoringMarks,
        simpleColoringElimMarks,
        isMultiColoring: !!activeMultiColoringRecord,
        multiColoringRecord: activeMultiColoringRecord,
        isSuperMultiColoring: !!superMultiColoringRecord,
        superMultiColoringRecord,
        multiColoringMarks,
        multiColoringElimMarks,
        isThreeDMedusa: !!colouringRecord,
        threeDMedusaRecord: colouringRecord,
        threeDMedusaMarks,
        threeDMedusaElimMarks,
        threeDMedusaInvalidMarks,
        chain,
        chainMarks: chainView.marks,
        chainXorEntryMarks: chainView.xorEntryMarks,
        chainXorExitMarks: chainView.xorExitMarks,
        chainWeakMarks: chainView.weakMarks,
        chainAlsMarks: chainView.alsMarks,
        chainAlsStyleByCell: chainView.alsStyleByCell,
        chainAlsStyleByAtom: chainView.alsStyleByAtom,
        chainAhsMarks: chainView.ahsMarks,
        chainAhsStyleByCell: chainView.ahsStyleByCell,
        chainAhsStyleByAtom: chainView.ahsStyleByAtom,
        chainStartMarks: chainView.startMarks,
        chainEndMarks: chainView.endMarks,
        chainCells: chainView.cells,
        chainAlsCells: chainView.alsCells,
        chainAhsCells: chainView.ahsCells,
        chainAlsEntryCells: chainView.alsEntryCells,
        chainAlsExitCells: chainView.alsExitCells,
        chainStartCells: chainView.startCells,
        chainEndCells: chainView.endCells,
        chainOrderByCell: chainView.orderByCell,
      };
    }

    const renderGridViewHeaders = () => {
      vantageView.renderHeaders({
        view: gridView,
        selector: gridViewSelector,
        title: gridColumnTitleEl,
        numbers: gridColumnNumbersEl,
        rows: gridRowHeaderEl,
      });
    };

    function setGridView(view) {
      vantageView.switchView(view, {
        setView: nextView => {
          gridView = nextView;
          gridViewSelector.value = gridView;
        },
        renderHeaders: renderGridViewHeaders,
        renderBoard,
      });
    }

    function extractGridViewSlice(view) {
      return vantageView.extractSlice({
        view,
        cand,
        puzzle,
        core,
        showFixed: showFixedInVantage,
        vantageCellFromSlot,
      });
    }

    function renderVantageBoard(view, highlights = currentHighlights()) {
      const slice = extractGridViewSlice(view);
      const axis = view === 'Rn' ? 'R' : view === 'Cn' ? 'C' : 'B';
      const positionPrefix = view === 'Rn' ? 'c' : view === 'Cn' ? 'r' : 'p';

      for (let sector = 0; sector < 9; sector++) {
        for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
          const positions = slice[sector][digitIndex];
          const digit = digitIndex + 1;
          const tile = document.createElement('div');
          tile.className = `cell vantage-cell vantage-${view.toLowerCase()}`;
          tile.setAttribute('role', 'gridcell');
          tile.setAttribute('aria-rowindex', String(sector + 1));
          tile.setAttribute('aria-colindex', String(digit));
          if (!positions.size) tile.classList.add('vantage-empty');
          const activePositions = [...positions].map(position => position + 1).join('');
          tile.title = `${axis}${sector + 1}, digit ${digit}: `
            + `${activePositions ? `${positionPrefix}${activePositions}` : 'none'}`;
          tile.setAttribute('aria-label', `${axis}${sector + 1}, digit ${digit}, `
            + `${activePositions ? `${positionPrefix}${activePositions}` : 'no positions'}`);

          const miniGrid = document.createElement('span');
          miniGrid.className = 'vantage-slice-grid';
          for (let position = 0; position < 9; position++) {
            const mark = document.createElement('span');
            mark.className = 'vantage-position';
            mark.textContent = String(position + 1);
            const cell = vantageCellFromSlot(view, sector, position);
            if (highlights.isMsls && highlights.mslsBaseCells.has(cell)) tile.classList.add('msls-base');
            if (highlights.isMsls && highlights.mslsCoverCells.has(cell)) tile.classList.add('msls-cover');
            const atom = atomKey(cell, digit);
            const positionActive = positions.has(position);
            const isFixed = showFixedInVantage && puzzle[cell] === digit;
            const isDigitFocus = positionActive && digitHighlightIsVisible(cell, digit);
            const isCandidateSizeFilter = candidateSizeFilterDigitMatches(cell, digit);
            const isAlsDofElim = highlights.alsDofElimMarks.has(atom);
            const isAhsDofElim = highlights.ahsDofRecordElimMarks.has(atom);
            const isSimpleColoringElim = highlights.simpleColoringElimMarks.has(atom);
            const isMultiColoringElim = highlights.multiColoringElimMarks.has(atom);
            const isThreeDMedusaElim = highlights.threeDMedusaElimMarks.has(atom);
            const isThreeDMedusaInvalid = highlights.threeDMedusaInvalidMarks.has(atom);
            const multiColoringTokens = highlights.multiColoringMarks.get(atom);
            const isMultiColoringDigit = !!multiColoringTokens;
            const isElim = highlights.removedMarks.has(atom) || isAlsDofElim || isAhsDofElim || isSimpleColoringElim
              || isMultiColoringElim || isThreeDMedusaElim;
            const simpleColoringRole = highlights.simpleColoringMarks.get(atom);
            const isSimpleColoringDigit = !!simpleColoringRole;
            const threeDMedusaRole = highlights.threeDMedusaMarks.get(atom);
            const isThreeDMedusaDigit = !!threeDMedusaRole;
            const isFishVertex = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.vertices.has(cell);
            const isMslsDigit = highlights.isMsls && highlights.mslsCoverAtoms.has(atom);
            const isFishFin = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.fins.has(cell)
              && !highlights.vertices.has(cell);
            const isFishEndofin = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.endofins.has(cell);
            const isSubsetDigit = highlights.isSubset
              && highlights.patternDigits.has(digit)
              && highlights.vertices.has(cell);
            const isAlsDofClauseDigit = highlights.alsDofClauseDigit === digit
              && highlights.alsDofClauseCells.has(cell)
              && cellHasCandidate(cell, digit);
            const isChain = highlights.isChain && highlights.chainMarks.has(atom);
            const isChainXorEntry = highlights.isChain && highlights.chainXorEntryMarks.has(atom);
            const isChainXorExit = highlights.isChain && highlights.chainXorExitMarks.has(atom);
            const isChainWeak = highlights.isChain && highlights.chainWeakMarks.has(atom);
            const isChainAls = highlights.isChain && highlights.chainAlsMarks.has(atom);
            const isChainAhs = highlights.isChain && highlights.chainAhsMarks.has(atom);
            const isAlsRecord = highlights.isAlsRecord && highlights.alsRecordMarks.has(atom);
            const isAlsDof = highlights.isAlsDof && highlights.alsDofMarks.has(atom);
            const isAhsDof = highlights.isAhsDof && highlights.ahsDofRecordMarks.has(atom);
            const isAhsRecord = highlights.isAhsRecord && highlights.ahsRecordMarks.has(atom);
            const isChainStart = highlights.isChain && highlights.chainStartMarks.has(atom);
            const isChainEnd = highlights.isChain && highlights.chainEndMarks.has(atom);
            const strongLinkPartition = highlights.strongLinkPartitionByCell.get(cell);
            const strongLinkStart = highlights.isStrongLink
              && (highlights.strongLinkStartMarks.has(atom)
                || (strongLinkPartition === 'active'
                  && (highlights.strongLink.startingDigits || []).includes(digit)
                  && cellHasCandidate(cell, digit)));
            const strongLinkEnd = highlights.isStrongLink
              && (highlights.strongLinkEndMarks.has(atom)
                || (strongLinkPartition === 'linked'
                  && (highlights.strongLink.linkDigits || []).includes(digit)
                  && cellHasCandidate(cell, digit)));
            const isHiddenGhost = highlights.isHiddenSubset
              && highlights.baseCells.has(cell)
              && highlights.patternDigits.has(digit)
              && !(cand[cell] || []).includes(digit)
              && !isElim;

            if (positionActive) mark.classList.add('active');
            if (isFixed) mark.classList.add('fixed');
            if (isDigitFocus) mark.classList.add('digit-focus', 'digit-focus-' + digit);
            if (isCandidateSizeFilter) {
              mark.classList.add('candidate-size-filter');
              applyCandidateSizeFilterStyle(mark, highlights.candidateSizeFilterStyle);
            }
            if (isElim && !isThreeDMedusaElim && !isMultiColoringElim) {
              mark.classList.add('elim-digit', 'elim');
            }
            if (isFishVertex || isFishFin) mark.classList.add('fish');
            if (isMslsDigit) mark.classList.add('fish');
            if (isFishEndofin) mark.classList.add('fish-endofin');
            if (isSubsetDigit) mark.classList.add('subset');
            if (isAlsDofClauseDigit) mark.classList.add('als-dof-clause');
            if (isChain) mark.classList.add('chain');
            if (isChainXorEntry || isChainStart || strongLinkStart) {
              mark.classList.add(isChainXorEntry || isChainStart ? 'chain-xor-entry' : 'strong-start');
            }
            if (isChainXorExit || isChainEnd || strongLinkEnd) {
              mark.classList.add(isChainXorExit || isChainEnd ? 'chain-xor-exit' : 'strong-end');
            }
            if (isChainWeak) mark.classList.add('chain-weak');
            if (isChainAls || isAlsRecord || isAlsDof) mark.classList.add('chain-als');
            if (isChainAhs) mark.classList.add('ahs-record');
            if (isAhsRecord) mark.classList.add('ahs-record');
            if (isAhsDof) mark.classList.add('ahs-record');
            if (isSimpleColoringDigit) {
              mark.classList.add('simple-colouring-digit', 'simple-colouring-' + simpleColoringRole + '-digit');
            }
            if (isSimpleColoringElim) mark.classList.add('simple-colouring-elim-digit');
            if (isMultiColoringDigit) applyMultiColoringStyle(mark, multiColoringTokens);
            if (isMultiColoringElim) {
              mark.classList.add('multi-colouring-elim-digit', 'simple-colouring-three-d-elim-digit');
            }
            if (isThreeDMedusaDigit) {
              mark.classList.add('simple-colouring-digit', 'simple-colouring-' + threeDMedusaRole + '-digit');
            }
            if (isThreeDMedusaInvalid) mark.classList.add('simple-colouring-invalid-digit');
            if (isThreeDMedusaElim) mark.classList.add('simple-colouring-three-d-elim-digit');
            if (isHiddenGhost && !positionActive) mark.classList.add('active');

            // Hydra owns the auxiliary ALS colours. Do not overwrite them
            // with the independent chain palette a second time.
            if (isChainAls && !highlights.isHydra) {
              applyAlsColorVars(mark, highlights.chainAlsStyleByAtom.get(atom));
            }
            if (isAlsRecord) applyAlsColorVars(mark, highlights.alsRecordColor);
            if (isAlsDof) applyAlsColorVars(mark, highlights.alsDofStyleByAtom.get(atom));
            if (isAhsRecord) applyAhsColorVars(mark, highlights.ahsRecordColor);
            if (isAhsDof) applyAhsColorVars(mark, highlights.ahsDofRecordColor);

            if (selectedPlayerCell === cell) mark.classList.add('player-cell-selected');
            bindPlayerDigitElement(mark, cell, digit);

            const hasOverlay = isElim || isFishVertex || isFishFin || isFishEndofin
              || isSubsetDigit || isChain || isChainXorEntry || isChainXorExit
              || isChainWeak || isChainAls || isAlsRecord || isAlsDof || isAhsRecord || isAhsDof
              || isChainStart || isChainEnd || strongLinkStart || strongLinkEnd || isHiddenGhost
              || isDigitFocus || isCandidateSizeFilter || isSimpleColoringDigit || isSimpleColoringElim
              || isMultiColoringDigit || isThreeDMedusaDigit || isThreeDMedusaElim || isMultiColoringElim
              || isMslsDigit;
            if (!positionActive && !hasOverlay) mark.textContent = '';
            miniGrid.appendChild(mark);
          }

          tile.appendChild(miniGrid);
          boardEl.appendChild(tile);
        }
      }

      if (highlights.isChain) renderVantageChainOverlay(highlights.chain);
      for (const hydraChain of highlights.hydraChains || []) {
        if (hydraChain !== highlights.chain) renderVantageChainOverlay(hydraChain);
      }
      if (highlights.isAlsDof) {
        if (highlights.alsDofRecord?.mode === 'hydra') {
          renderHydraAlsDofOverlay(highlights.alsDofRecord, true);
        } else {
          renderAlsDofOverlay(highlights.alsDofRecord, true);
        }
      }
      if (highlights.isStrongLink) renderVantageStrongLinkOverlay(highlights.strongLink);
      if (highlights.isSuperMultiColoring) {
        renderSuperMultiGroupOverlay(highlights.superMultiColoringRecord, true);
      }
    }

    function renderBoard() {
      boardEl.textContent = '';
      updateColouringSequenceControls();
      boardEl.classList.toggle('vantage-board', gridView !== 'RC');
      boardEl.classList.toggle('vantage-rn', gridView === 'Rn');
      boardEl.classList.toggle('vantage-cn', gridView === 'Cn');
      boardEl.classList.toggle('vantage-bn', gridView === 'Bn');
      boardEl.setAttribute('role', 'grid');
      boardEl.setAttribute('aria-rowcount', '9');
      boardEl.setAttribute('aria-colcount', '9');
      boardEl.tabIndex = gridView === 'RC' ? -1 : 0;
      boardEl.setAttribute('aria-label', gridView === 'RC'
        ? 'Sudoku candidate grid'
        : `Sudoku ${gridView} candidate view`);
      const highlights = currentHighlights();
      if (gridView !== 'RC') {
        renderVantageBoard(gridView, highlights);
        return;
      }

      for (let cell = 0; cell < 81; cell++) {
       const el = document.createElement('div');
       el.className = 'cell';
       if (originalPuzzle[cell]) el.classList.add('given');
       if (promotedValues[cell]) el.classList.add('solved');
       el.classList.add(...variantCellClasses(cell, variantSettings));
       if (highlights.candidateSizeFilterCells.has(cell)) {
         el.classList.add('candidate-size-filter-cell');
         applyCandidateSizeFilterStyle(el, highlights.candidateSizeFilterStyle);
       }
       const fixedDigit = puzzle[cell] || promotedValues[cell] || 0;
       if (fixedDigit && digitHighlightIsVisible(cell, fixedDigit)) {
         el.classList.add('digit-focus-cell', 'digit-focus-' + fixedDigit);
       }
        if (highlights.isChromatic && highlights.chromaticCells.has(cell)) {
          el.classList.add('chromatic-cell');
          if (highlights.chromaticCoreCells.has(cell)) el.classList.add('chromatic-core-cell');
          if (highlights.chromaticGuardians.has(cell)) el.classList.add('chromatic-guardian-cell');
        }
        if (highlights.isFish && highlights.fishCells.has(cell)) el.classList.add('fish-intersection');
        if (highlights.isMsls && highlights.mslsBaseCells.has(cell)) el.classList.add('msls-base');
        if (highlights.isMsls && highlights.mslsCoverCells.has(cell)) el.classList.add('msls-cover');
        if (highlights.isFish && highlights.fins.has(cell) && !highlights.vertices.has(cell)) {
          el.classList.add('fish-fin');
        }
        if (highlights.isSubset && !highlights.isHiddenSubset && highlights.vertices.has(cell)) {
          el.classList.add('subset-vertex');
        }
        if (highlights.isFish && highlights.vertices.has(cell)) el.classList.add('fish-vertex');
        if (highlights.isChain && highlights.chainAlsCells.has(cell)) {
          el.classList.add('chain-als-cell');
          applyAlsColorVars(el, highlights.chainAlsStyleByCell.get(cell));
        }
        if (highlights.isChain && highlights.chainAhsCells.has(cell)) {
          el.classList.add('ahs-record-cell');
          applyAhsColorVars(el, highlights.chainAhsStyleByCell.get(cell));
        }
        if (highlights.isAlsRecord && highlights.alsRecordCells.has(cell)) {
          el.classList.add('chain-als-cell');
          applyAlsColorVars(el, highlights.alsRecordColor);
        }
        if (highlights.isAlsDof && highlights.alsDofCells.has(cell)) {
          el.classList.add('chain-als-cell');
          applyAlsPartitionColors(el, highlights.alsDofStylesByCell.get(cell));
        }
        if (highlights.isNonConsecutiveAlsDof && highlights.alsDofClauseCells.has(cell)) {
          el.classList.add('chain-als-cell');
        }
        if (highlights.isAhsRecord && highlights.ahsRecordCells.has(cell)) {
          el.classList.add('ahs-record-cell');
          applyAhsColorVars(el, highlights.ahsRecordColor);
        }
        if (highlights.isAhsDof && highlights.ahsDofRecordCells.has(cell)) {
          el.classList.add('ahs-record-cell');
          applyAhsColorVars(el, highlights.ahsDofRecordColor);
        }
        if (highlights.isChain && highlights.chainAlsEntryCells.has(cell)) el.classList.add('chain-als-entry');
        if (highlights.isChain && highlights.chainAlsExitCells.has(cell)) el.classList.add('chain-als-exit');
        if (highlights.isStrongLink && highlights.strongLink.activeCells?.includes(cell)) {
          el.classList.add('strong-link-active-cell');
        }
        if (highlights.isStrongLink && highlights.strongLink.linkedCells?.includes(cell)) {
          el.classList.add('strong-link-linked-cell');
        }
        const strongLinkPartition = highlights.strongLinkPartitionByCell.get(cell);
        if (strongLinkPartition === 'active') el.classList.add('strong-link-partition-active');
        if (strongLinkPartition === 'linked') el.classList.add('strong-link-partition-linked');
        if (strongLinkPartition === 'empty') el.classList.add('strong-link-partition-empty');

        bindPlayerCellElement(el, cell);

       if (puzzle[cell]) {
         el.textContent = String(puzzle[cell]);
       } else {
          const marks = document.createElement('div');
          marks.className = 'marks';

          for (let digit = 1; digit <= 9; digit++) {
            const mark = document.createElement('span');
            mark.className = 'mark';
            const atomKey = `${cell}:${digit}`;
            const isAlsDofElim = highlights.alsDofElimMarks.has(atomKey);
            const isAhsDofElim = highlights.ahsDofRecordElimMarks.has(atomKey);
            const isSimpleColoringElim = highlights.simpleColoringElimMarks.has(atomKey);
            const isMultiColoringElim = highlights.multiColoringElimMarks.has(atomKey);
            const isThreeDMedusaElim = highlights.threeDMedusaElimMarks.has(atomKey);
            const isThreeDMedusaInvalid = highlights.threeDMedusaInvalidMarks.has(atomKey);
            const isElim = highlights.removedMarks.has(atomKey) || isAlsDofElim || isAhsDofElim || isSimpleColoringElim
              || isMultiColoringElim || isThreeDMedusaElim;
            const isSetDigit = highlights.isSubset && highlights.patternDigits.has(digit) && highlights.vertices.has(cell);
            const isAlsDofClauseDigit = highlights.alsDofClauseDigit === digit
              && highlights.alsDofClauseCells.has(cell)
              && cellHasCandidate(cell, digit);
            const isFishVertexDigit = highlights.isFish && highlights.patternDigits.has(digit) && highlights.vertices.has(cell);
            const isFishFinDigit = highlights.isFish && highlights.patternDigits.has(digit)
              && highlights.fins.has(cell) && !highlights.vertices.has(cell);
            const isFishIntersection = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.fishCells.has(cell);
            const isFishBaseIntersection = isFishIntersection
              && (highlights.fishBaseIntersections.has(cell)
                || highlights.fishPeersOfBaseIntersection.has(cell));
            const isFishBase = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.baseCells.has(cell)
              && !highlights.fishCells.has(cell);
            const isFishCover = highlights.isFish
              && highlights.patternDigits.has(digit)
              && highlights.coverCells.has(cell)
              && !highlights.fishCells.has(cell);
            const isFishDoubleCover = isFishCover && highlights.fishDoubleCover.has(cell);
            const isFishTripleCover = isFishCover && highlights.fishTripleCover.has(cell);
            const isFishEndofinDigit = highlights.isFish && highlights.patternDigits.has(digit)
              && highlights.endofins.has(cell);
            const isFishDigit = isFishVertexDigit || isFishFinDigit
              || isFishBase || isFishBaseIntersection || isFishCover;
            const hasCandidate = cellHasCandidate(cell, digit);
            const isChainExplanation = highlights.isChain
              && highlights.chainMarks.has(atomKey);
            const hasChainCandidate = highlights.isChain
              && (chainCandidateIsVisible(cell, digit) || isChainExplanation);
            const isChromaticDigit = highlights.isChromatic
              && highlights.chromaticCells.has(cell)
              && highlights.chromaticDigits.has(digit)
              && hasCandidate;
            const isMslsDigit = highlights.isMsls && highlights.mslsCoverAtoms.has(atomKey);
            const isChainDigit = highlights.isChain && highlights.chainMarks.has(atomKey);
            const isChainXorEntryDigit = highlights.isChain && highlights.chainXorEntryMarks.has(atomKey);
            const isChainXorExitDigit = highlights.isChain && highlights.chainXorExitMarks.has(atomKey);
            const isChainWeakDigit = highlights.isChain && highlights.chainWeakMarks.has(atomKey);
            const isChainAlsDigit = highlights.isChain && highlights.chainAlsMarks.has(atomKey);
            const isChainAhsDigit = highlights.isChain && highlights.chainAhsMarks.has(atomKey);
            const isAlsRecordDigit = highlights.isAlsRecord && highlights.alsRecordMarks.has(atomKey);
            const isAlsDofDigit = highlights.isAlsDof && highlights.alsDofMarks.has(atomKey);
            const isAhsRecordDigit = highlights.isAhsRecord && highlights.ahsRecordMarks.has(atomKey);
            const isAhsDofRecordDigit = highlights.isAhsDof && highlights.ahsDofRecordMarks.has(atomKey);
            const isChainStartDigit = highlights.isChain && highlights.chainStartMarks.has(atomKey);
            const isChainEndDigit = highlights.isChain && highlights.chainEndMarks.has(atomKey);
            const strongLinkPartitionStartDigit = highlights.isStrongLink
              && strongLinkPartition === 'active'
              && (highlights.strongLink.startingDigits || []).includes(digit)
              && cellHasCandidate(cell, digit);
            const strongLinkPartitionEndDigit = highlights.isStrongLink
              && strongLinkPartition === 'linked'
              && (highlights.strongLink.linkDigits || []).includes(digit)
              && cellHasCandidate(cell, digit);
            const isStrongLinkStartDigit = highlights.isStrongLink
              && (highlights.strongLinkStartMarks.has(atomKey) || strongLinkPartitionStartDigit);
            const isStrongLinkEndDigit = highlights.isStrongLink
              && (highlights.strongLinkEndMarks.has(atomKey) || strongLinkPartitionEndDigit);
           const isStrongLinkDigit = isStrongLinkStartDigit || isStrongLinkEndDigit;
           const simpleColoringRole = highlights.simpleColoringMarks.get(atomKey);
           const isSimpleColoringDigit = !!simpleColoringRole;
           const multiColoringTokens = highlights.multiColoringMarks.get(atomKey);
           const isMultiColoringDigit = !!multiColoringTokens;
           const threeDMedusaRole = highlights.threeDMedusaMarks.get(atomKey);
           const isThreeDMedusaDigit = !!threeDMedusaRole;
           const isDigitFocus = hasCandidate && digitHighlightIsVisible(cell, digit);
           const isCandidateSizeFilter = candidateSizeFilterDigitMatches(cell, digit);
           const isHiddenGhostDigit =
              highlights.isHiddenSubset &&
              highlights.baseCells.has(cell) &&
              highlights.patternDigits.has(digit) &&
              !highlights.vertices.has(cell) &&
              !(cand[cell] || []).includes(digit) &&
              !isElim;

            const chainDisplayDigit = isElim
              || ((hasCandidate || isChainExplanation)
                && (isFishDigit || isFishEndofinDigit || isChainDigit || isChainWeakDigit || isStrongLinkDigit
                  || isAlsRecordDigit || isAlsDofDigit || isAhsRecordDigit || isAhsDofRecordDigit || isChainAhsDigit || isDigitFocus
                  || isCandidateSizeFilter || isSimpleColoringDigit || isMultiColoringDigit || isThreeDMedusaDigit
                  || isMslsDigit || isChromaticDigit));
            mark.textContent = markFor(cell, digit)
              || (chainDisplayDigit ? digit : '');
           if (isDigitFocus) mark.classList.add('digit-focus', 'digit-focus-' + digit);
           if (isCandidateSizeFilter) {
             mark.classList.add('candidate-size-filter-digit');
             applyCandidateSizeFilterStyle(mark, highlights.candidateSizeFilterStyle);
           }
           if (isSetDigit) mark.classList.add('set-digit');
           if (isAlsDofClauseDigit) {
             mark.classList.add('als-dof-clause-digit');
             mark.title = 'N clause';
           }
           if (isHiddenGhostDigit) mark.classList.add('hidden-ghost-digit');
            if (isFishDigit) mark.classList.add('fish-digit');
            if (isFishFinDigit) mark.classList.add('fish-fin-digit');
            if (isFishBase) mark.classList.add('fish-base-digit');
            if (isFishBaseIntersection) mark.classList.add('fish-base-intersection-digit');
            if (isFishCover) mark.classList.add('fish-cover-digit');
            if (isFishDoubleCover) mark.classList.add('fish-cover-double-digit');
            if (isFishTripleCover) mark.classList.add('fish-cover-triple-digit');
            if (isMslsDigit) mark.classList.add('fish-digit');
            if (isFishEndofinDigit) mark.classList.add('fish-endofin-digit');
            if (isChromaticDigit) mark.classList.add('chromatic-digit', `chromatic-digit-${digit}`);
            if (isChainDigit && hasChainCandidate) mark.classList.add('chain-digit');
            if (isChainXorEntryDigit && hasChainCandidate) mark.classList.add('chain-xor-entry-digit');
            if (isChainXorExitDigit && hasChainCandidate) mark.classList.add('chain-xor-exit-digit');
            // Weak links are represented by the dashed connector. Do not add
            // a second blue badge to the candidate mini-grid.
            if (isChainAlsDigit && hasChainCandidate) {
              mark.classList.add('chain-als-digit');
              applyAlsColorVars(mark, highlights.chainAlsStyleByAtom.get(atomKey));
            }
            if (isChainAhsDigit && hasChainCandidate) {
              mark.classList.add('ahs-record-digit');
              applyAhsColorVars(mark, highlights.chainAhsStyleByAtom.get(atomKey));
            }
            if (isAlsRecordDigit) {
              mark.classList.add('chain-als-digit');
              applyAlsColorVars(mark, highlights.alsRecordColor);
            }
            if (isAlsDofDigit) {
              mark.classList.add('chain-als-digit');
              applyAlsColorVars(mark, highlights.alsDofStyleByAtom.get(atomKey));
            }
            if (isAhsRecordDigit) {
              mark.classList.add('ahs-record-digit');
              applyAhsColorVars(mark, highlights.ahsRecordColor);
            }
            if (isAhsDofRecordDigit) {
              mark.classList.add('ahs-record-digit');
              applyAhsColorVars(mark, highlights.ahsDofRecordColor);
            }
            if (isChainStartDigit && hasChainCandidate) mark.classList.add('chain-start-digit');
            if (isChainEndDigit && hasChainCandidate) mark.classList.add('chain-end-digit');
            if (isStrongLinkDigit && hasCandidate) mark.classList.add('strong-link-digit');
            if (isStrongLinkStartDigit && hasCandidate) mark.classList.add('strong-link-start-digit');
            if (isStrongLinkEndDigit && hasCandidate) mark.classList.add('strong-link-end-digit');
            if (isSimpleColoringDigit) {
              mark.classList.add('simple-colouring-digit', 'simple-colouring-' + simpleColoringRole + '-digit');
            }
            if (isSimpleColoringElim) mark.classList.add('simple-colouring-elim-digit');
            if (isMultiColoringDigit) applyMultiColoringStyle(mark, multiColoringTokens);
            if (isMultiColoringElim) {
              mark.classList.add('multi-colouring-elim-digit', 'simple-colouring-three-d-elim-digit');
            }
            if (isThreeDMedusaDigit) {
              mark.classList.add('simple-colouring-digit', 'simple-colouring-' + threeDMedusaRole + '-digit');
            }
            if (isThreeDMedusaInvalid) mark.classList.add('simple-colouring-invalid-digit');
            if (isThreeDMedusaElim) mark.classList.add('simple-colouring-three-d-elim-digit');
            if (isElim && !isThreeDMedusaElim && !isMultiColoringElim) {
              mark.classList.add('elim-digit');
            }
            bindPlayerDigitElement(mark, cell, digit);
            marks.appendChild(mark);
          }

          el.appendChild(marks);
        }

        boardEl.appendChild(el);
      }

      if (highlights.isSubset) renderSectorFrames(activeStep?.base);
      if (highlights.isChain) renderChainOverlay(highlights.chain);
      for (const hydraChain of highlights.hydraChains || []) {
        if (hydraChain !== highlights.chain) renderChainOverlay(hydraChain);
      }
      if (highlights.isAlsDof) {
        if (highlights.alsDofRecord?.mode === 'hydra') {
          renderHydraAlsDofOverlay(highlights.alsDofRecord);
        } else {
          renderAlsDofOverlay(highlights.alsDofRecord);
        }
      }
      if (highlights.isStrongLink) renderStrongLinkOverlay(highlights.strongLink);
      if (highlights.isSuperMultiColoring) {
        renderSuperMultiGroupOverlay(highlights.superMultiColoringRecord);
      }
    }

    const gridTextView = appNamespace.gridTextView.create({
      elements: { puzzle: puzzleStringEl, meta: puzzleStateMetaEl, solution: solutionStringEl },
      encode: core.encode,
    });
    const renderStrings = () => gridTextView.render({ originalPuzzle, puzzle, promotedValues, cand, solution });
    const current729String = () => gridTextView.current729({ originalPuzzle, puzzle, promotedValues, cand });

    const copyPuzzleString = (text, label) =>
      appNamespace.clipboard.copyLabeled(text, label, setStatus);

    function selectedFishStep() {
      if (!fishReport || !selectedFishKey) return '';
      const separator = selectedFishKey.lastIndexOf(':');
      const category = selectedFishKey.slice(0, separator);
      const index = Number(selectedFishKey.slice(separator + 1));
      const fish = fishReport.filter(item => item.category === category)[index];
      return fish ? fishStepFromReport(fish) : null;
    }

    function selectedFishEureka() {
      return selectedFishStep()?.desc || '';
    }

    function selectedSubsetStep(kind) {
      const report = kind === 'hidden' ? hiddenSubsetReport : nakedSubsetReport;
      const key = kind === 'hidden' ? selectedHiddenSubsetKey : selectedNakedSubsetKey;
      if (!report || !key) return null;
      const [sizeText, indexText] = key.split(':');
      const size = Number(sizeText);
      const index = Number(indexText);
      const item = report.filter(record => record.size === size)[index];
      return item ? subsetStepFromReport(kind, item) : null;
    }

    function selectedSubsetEureka(kind) {
      return selectedSubsetStep(kind)?.desc || '';
    }

    function selectedBoxLineStep() {
      return boxLineReport?.[selectedBoxLineIndex] || null;
    }

    function selectedChainStep() {
      const chain = chainReport?.chains?.[selectedChainIndex];
      return chain ? chainStepFromResult(chain, chainReport, selectedChainIndex, cand) : null;
    }

    function selectedChainEureka() {
      return selectedChainStep()?.desc || '';
    }

    function highlightedEurekaText() {
      if (activeStep?.chain) return chainText(activeStep.chain);
      if (activeStep?.desc) return activeStep.desc;
      if (selectedChromaticGraphIndex !== null && chromaticGraphReport?.results?.[selectedChromaticGraphIndex]) {
        return chromaticGraphEureka(chromaticGraphReport.results[selectedChromaticGraphIndex]);
      }
      const ahsDofChain = selectedAhsDofChainRecord();
      if (ahsDofChain) return `AHS-DOF Chain: ${core.formatAhsDofChain(ahsDofChain)}`;
      const ahsDof = selectedAhsDofNetRecord();
      if (ahsDof) return `AHS-DOF: ${core.formatAhsDofNet(ahsDof)}`;
      const alsDof = selectedAlsDofRecord();
      if (alsDof) return core.formatAlsDof(alsDof);
      const hydra = selectedHydraRecord();
      if (hydra) return formatHydraResult(hydra);
      return selectedFishEureka()
        || selectedBoxLineStep()?.desc
        || selectedSubsetEureka('hidden')
        || selectedSubsetEureka('naked')
        || selectedChainEureka();
    }

    function highlightedMoveStep() {
      if (activeStep?.elim?.items?.length || activeStep?.tech === 'last-man-standing') {
        return activeStep;
      }

      const ahsDofChain = selectedAhsDofChainRecord();
      if (ahsDofChain) {
        return modularAhsDofChainStepFromResult(
          ahsDofChain,
          ahsDofChainReport,
          selectedAhsDofChainIndex,
          cand,
        );
      }
      const ahsDof = selectedAhsDofNetRecord();
      if (ahsDof) {
        return modularAhsDofStepFromResult(ahsDof, ahsDofReport, selectedAhsDofNetIndex, cand);
      }
      const alsDof = selectedAlsDofRecord();
      if (alsDof) {
        return selectedAlsDofSource === 'chain'
          ? alsDofStepFromResult(alsDof, alsDofChainReport, selectedAlsDofIndex, cand)
          : alsDofStepFromResult(alsDof, alsDofReport, selectedAlsDofIndex, cand);
      }
      const hydra = selectedHydraRecord();
      if (hydra) return alsHydraStepFromResult(hydra, selectedAlsHydraIndex, cand);

      const fish = selectedFishStep();
      if (fish) return fish;
      const boxLine = selectedBoxLineStep();
      if (boxLine) return boxLine;
      if (selectedChromaticGraphIndex !== null && chromaticGraphReport?.results?.[selectedChromaticGraphIndex]) {
        return chromaticStepFromResult(chromaticGraphReport.results[selectedChromaticGraphIndex]);
      }
      if (selectedChromaticAlsGraphIndex !== null
        && chromaticAlsGraphReport?.results?.[selectedChromaticAlsGraphIndex]) {
        return chromaticStepFromResult(
          chromaticAlsGraphReport.results[selectedChromaticAlsGraphIndex],
        );
      }
      const hiddenSubset = selectedSubsetStep('hidden');
      if (hiddenSubset) return hiddenSubset;
      const nakedSubset = selectedSubsetStep('naked');
      if (nakedSubset) return nakedSubset;
      const chain = selectedChainStep();
      if (chain) return chain;

      if (selectedChainIndex !== null) {
        const dedicated = [
          alcXzReport,
          alcXyReport,
          alcChainReport,
          alcDofReport,
        ].find(report => report?.chains?.[selectedChainIndex]);
        if (dedicated) {
          return chainStepFromResult(
            dedicated.chains[selectedChainIndex],
            dedicated,
            selectedChainIndex,
            cand,
          );
        }
      }

      if (selectedMslsIndex !== null && mslsReport?.results?.[selectedMslsIndex]) {
        return mslsStepFromResult(mslsReport.results[selectedMslsIndex]);
      }
      if (selectedSimpleColoringIndex !== null && simpleColoringReport?.[selectedSimpleColoringIndex]) {
        return colouringStepFromResult(simpleColoringReport[selectedSimpleColoringIndex], 'simple');
      }
      if (selectedThreeDMedusaIndex !== null && threeDMedusaReport?.[selectedThreeDMedusaIndex]) {
        return colouringStepFromResult(threeDMedusaReport[selectedThreeDMedusaIndex], 'medusa');
      }
      if (selectedMultiColoringIndex !== null && multiColoringReport?.[selectedMultiColoringIndex]) {
        return colouringStepFromResult(multiColoringReport[selectedMultiColoringIndex], 'multi');
      }
      if (selectedThreeDMedusaMultiIndex !== null && threeDMedusaMultiReport?.[selectedThreeDMedusaMultiIndex]) {
        return colouringStepFromResult(
          threeDMedusaMultiReport[selectedThreeDMedusaMultiIndex],
          'medusaMulti',
        );
      }
      return null;
    }

    function highlightedMoveCanApply(step) {
      if (!step || boardIsComplete()) return false;
      if (step.tech === 'last-man-standing') return !promotionQueue.length;
      return (step.elim?.items || []).some(item =>
        (cand[item.cell] || []).includes(item.digit));
    }

    const cleanCopiedEureka = appNamespace.solutionLogView.cleanCopiedEureka;

    function applyHighlightedMove() {
      const step = highlightedMoveStep();
      if (!highlightedMoveCanApply(step)) {
        setStatus('No applicable highlighted move.', 'warn');
        return false;
      }

      const before = snapshotState();
      if (!applyCycleChoice(before, [], { step })) return false;
      clearSearchResultsAfterApply(step?.tech === 'colouring' ? step.colouringMethod : null);
      render();
      return true;
    }

    function renderSolutionActions() {
      const hasHighlightedMove = !!highlightedEurekaText();
      if (solutionCopyEurekaEl) solutionCopyEurekaEl.disabled = !hasHighlightedMove;
      if (solutionCopyListEl) solutionCopyListEl.disabled = logEntries.length === 0;
      if (applyHighlightedMoveEl) {
        applyHighlightedMoveEl.disabled = !highlightedMoveCanApply(highlightedMoveStep());
      }
    }

    function openReportPanel(resultEl) {
      let panel = resultEl?.closest?.('.pom-panel');
      while (panel) {
        panel.open = true;
        panel = panel.parentElement?.closest?.('.pom-panel') || null;
      }
    }

    function focusMap() {
      const map = boardEl?.closest?.('.grid-frame') || boardEl;
      requestAnimationFrame(() => {
        map?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      });
    }

    function hideSolution() {
      if (solutionPanelEl) solutionPanelEl.open = false;
    }

    function showLoadWarning(message) {
      window.alert(message);
    }

    const { eureka: chromaticGraphEureka, stepFromResult: chromaticStepFromResult,
      renderGraphReport: renderChromaticGraphView,
      renderAlsGraphReport: renderChromaticAlsGraphView } =
      appNamespace.chromaticView.create({ core, getCandidates: () => cand });

    function renderChromaticGraphReport() {
      renderChromaticGraphView({
        element: chromaticGraphResultsEl,
        report: chromaticGraphReport,
        selectedIndex: selectedChromaticGraphIndex,
        onSelect: (record, index) => {
          selectedChromaticGraphIndex = index;
          activeStep = chromaticStepFromResult(record);
          render();
          openReportPanel(chromaticGraphResultsEl);
          focusMap();
          setStatus(`Chromatic graph ${index + 1} selected.`, 'ok');
        },
      });
    }

    function renderChromaticAlsGraphReport() {
      renderChromaticAlsGraphView({
        element: chromaticAlsGraphResultsEl,
        report: chromaticAlsGraphReport,
        selectedIndex: selectedChromaticAlsGraphIndex,
        onSelect: (record, index) => {
          selectedChromaticAlsGraphIndex = index;
          activeStep = chromaticStepFromResult(record);
          render();
          openReportPanel(chromaticAlsGraphResultsEl);
          focusMap();
          setStatus(`ALS chromatic graph ${index + 1} selected.`, 'ok');
        },
      });
    }

    function render() {
      renderDigitFocusButtons();
      renderBoard();
      renderStrings();
      renderRatingReport();
      renderLog();
      renderSolutionActions();
      renderPomReport();
      renderAlsReport();
      renderAlsLinkReport();
      renderAhsReport();
      renderAhsLinkReport();
      renderStrongLinkReport();
      renderSimpleColoringReport();
      renderThreeDMedusaReport();
      renderMultiColoringReport();
      renderSuperMultiColoringReport();
      renderThreeDMedusaMultiReport();
      renderChromaticGraphReport();
      renderChromaticAlsGraphReport();
      renderFishReport();
      renderMslsReport();
      renderAlsDofReport();
      renderAlsHydraReport();
      renderNakedSubsetReport();
      renderBoxLineReport();
      renderHiddenSubsetReport();
       renderChainReport();
      updateHistoryButtons();
    }

    const { displayTech, constructDisplayName } = appNamespace.displayNames;

    const ratingData = appNamespace.ratingData;
    const RATING_CATEGORY_RANKS = ratingData.ranks;
    const RATING_CATEGORY_SCORE_BANDS = ratingData.scoreBands;
    const RATING_CATEGORY_COLORS = ratingData.colors;

    const ratingRuntime = appNamespace.ratingRuntime.create(ratingData);
    const { ratingCategoryColorClass, normalizeRatingCategory, ratingCategoryForValue,
      generationTechniqueProfile, ratingDefinition, formatRatingValue, ratingTags } = ratingRuntime;
    const { unknownRating, fishScoreForSize } = appNamespace.ratingScoring.create(ratingData);
    const { chainLengthOf, chainUniqueDigitCount, chainMathScore, pureXyChainDepth,
      depthScaledChainRating } = appNamespace.chainScoring;
    const { chainLinkScoreModifier } = appNamespace.chainModifiers.create(
      module => chainModuleSubsets(module));
    const { fromResult: chainStepFromResult } = appNamespace.chainStep.create({
      core,
      displayChainForUi,
      chainText,
      defaultCandidateGrid: cand,
    });
    const { isTransportAlsXyRingShape, normalizedChainStructureName } = appNamespace.chainClassification;
    const { alsDofScore, alsDofMoveKey, alsDofMoveEnabled } = appNamespace.dofRating;

    const RATING_TAGS = ratingTags;

    const DIFFICULTY_TABLE_GROUPS = appNamespace.difficultyInfoData.groups;

    function ratingForChain(chain, step = chain) {
      if (!chain) return unknownRating(step?.desc || '');

      const fullName = normalizedChainStructureName(chain);
      const isAicAls = /^AIC\s*\+\s*ALS(?:\s*-|$)/i.test(fullName);
      const name = fullName
        .replace(/^\s*(?:AIC\s*\+\s*ALS|ALS|AHS|ALC)\s*-\s*/i, '')
        .trim();
      const ringBonus = chain.isRing ? 0.5 : 0;
      // Some chain constructors encode the ring in structureName (for
      // example W-Ring), while others rely on isRing. Never append it twice.
      const ringSuffix = chain.isRing && !/Ring$/i.test(fullName) ? ' Ring' : '';
      const define = (category, value, tag = name) => {
        const finalValue = Number((value + chainLinkScoreModifier(chain)).toFixed(3));
        return {
        ...ratingDefinition(ratingCategoryForValue(finalValue, category), finalValue, tag),
        hardestMove: step?.desc || '',
        };
      };

      // Some worker records preserve the generic AIC structure name even
      // though one of their links is an ALS_RCC expansion. Resolve that
      // identity before the narrower wing/transport fallbacks can relabel it.
      if (/^AIC$/i.test(fullName)
        && (chain.steps || []).some(step => step?.family === 'ALS'
          || String(step?.linkTypeName || '').toUpperCase() === 'ALS_RCC')) {
        return define('Nightmare', 11 + ringBonus, `AIC + ALS Chain${ringSuffix}`);
      }

      const sizeOne = alsSizeOneChainInfo(chain);
      if (sizeOne?.allBivalve && sizeOne.nodeCount === 3 && !sizeOne.remotePair) {
        const value = chainMathScore(3, chain, 3, 2);
        return define(ratingCategoryForValue(value), value,
          `XY-${chain.isRing ? 'Ring' : 'Wing'}`);
      }
      const barns = barnsChainInfo(chain);
      const barnsTransport = barnsTransportChainInfo(chain);
      if (barnsTransport) {
        const size = barnsTransport.sizeName.length;
        const value = size <= 3 ? 4.75 : size === 4 ? 5 : 6;
        return define(ratingCategoryForValue(value + ringBonus), value + ringBonus,
          `T - ${barnsTransport.sizeName.toUpperCase()} ${barnsTransport.form}${ringSuffix}`);
      }
      if (barns) {
        const size = barns.sizeName.length;
        const form = barns.form;
        if (size === 3) {
          const value = chainMathScore(3, chain, 2, 3);
          return define(ratingCategoryForValue(value), value,
            `XYZ ${form}`);
        }
        if (size === 4) {
          const value = chainMathScore(4, chain, 4, 4);
          return define(ratingCategoryForValue(value), value,
            `WXYZ ${form}`);
        }
        if (size === 5) {
          return define('Irritating', 5 + ringBonus,
            `VWXYZ ${form}`);
        }
        if (size === 6) {
          return define('Frustrating', 6 + ringBonus,
            `UVWXYZ ${form}`);
        }
      }

      // T-ALS-XY is the ALS-XY base (8) plus the transport modifier (+1).
      // Keep it separate from generic AIC + ALS and from B.A.R.N.S. transport.
      if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Expert', 9 + ringBonus, `T-ALS-XY${ringSuffix}`);
      }
      // T-ALS-XZ is the ALS-XZ base (7) plus the transport modifier (+1).
      if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `T-ALS-XZ${ringSuffix}`);
      }

      if (/^AIC\s*\+\s*ALS(?:\s*-\s*Chain)?$/i.test(fullName)) {
        return define('Nightmare', 11 + ringBonus, `AIC + ALS Chain${ringSuffix}`);
      }

      if (/^ALS\s*-\s*Chain$/i.test(fullName)) {
        return define('Brutal', 10 + ringBonus, `ALS Chain${ringSuffix}`);
      }
      if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Brutal', 10 + ringBonus, `AHS Chain${ringSuffix}`);
      }
      if (/^ALS\s*-\s*XY$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `ALS - XY${ringSuffix}`);
      }
      if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8 + ringBonus, `AHS - XY${ringSuffix}`);
      }
      if (/^ALS\s*-\s*XZ$/i.test(fullName)) {
        return define('Hard', 7 + ringBonus, `ALS - XZ${ringSuffix}`);
      }
      if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Hard', 7 + ringBonus, `AHS - XZ${ringSuffix}`);
      }
      if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) {
        return define('Hard', 7.5 + ringBonus, `ALC - XZ${ringSuffix}`);
      }
      if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) {
        return define('Demanding', 8.5 + ringBonus, `ALC - XY${ringSuffix}`);
      }
      if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Brutal', 10.5 + ringBonus, `ALC Chain${ringSuffix}`);
      }
      if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) {
        return define('Abyssal', 12.5 + ringBonus, `ALC - DOF Chain${ringSuffix}`);
      }

      const alcNamed = /^ALC\s*-\s*/i.test(fullName)
        && /(?:Wing|Ring)$/i.test(name);
      if (alcNamed) {
        return define('Demanding', 8 + ringBonus, `ALC - ${name}${ringSuffix}`);
      }

      const alsNamed = (isAicAls || /^ALS\s*-/i.test(fullName))
        && /(?:Wing|Ring)$/i.test(name);
      if (alsNamed && !/^ALS\s*-\s*(?:XZ|XY|Chain)$/i.test(fullName)) {
        const label = isAicAls ? `AIC + ALS - ${name}` : `ALS - ${name}`;
        return define('Demanding', 8 + ringBonus, `${label}${ringSuffix}`);
      }

      const ahsNamed = /^AHS\s*-\s*/i.test(fullName)
        && /(?:Wing|Ring)$/i.test(name);
      if (ahsNamed) {
        return define('Demanding', 8 + ringBonus, `AHS - ${name}${ringSuffix}`);
      }

      const eriCount = chainEriCount(chain);
      // Named ERI structures must be classified by their structural name
      // before the generic ERI-node count fallback below.
      const namedEriStructure = /(?:^|-)\s*(?:Empty Rectangle|Dual Empty Rectangle|Rec'T Kite|Bridged Empty Rectangle|Bridged ERI|\d+x ERI|L\(1\)-Wing|L1-Wing)$/i.test(name);
      if (eriCount > 0 && !namedEriStructure) {
        if (eriCount === 3) {
          const value = chainMathScore(3, chain, 3, 1);
          return define(ratingCategoryForValue(value), value, `3x ERI${ringSuffix}`);
        }
        if (eriCount === 4) {
          const value = chainMathScore(4, chain, 4, 1);
          return define(ratingCategoryForValue(value), value, `4x ERI${ringSuffix}`);
        }
        return define('Irritating', 5 + ringBonus, `ERI Chain${ringSuffix}`);
      }

      const alsSizeOne = sizeOne;
      if (alsSizeOne) {
        if (alsSizeOne.remotePair) {
          const scaled = depthScaledChainRating(chain, 'Remote Pair', 3);
          const value = scaled.value;
          return define(ratingCategoryForValue(value), value, `Remote Pair${ringSuffix}`);
        }
        if (alsSizeOne.breakdown === 'XY-Wing') {
          const value = chainMathScore(3, chain, 3, 3);
          return define(ratingCategoryForValue(value), value, `XY-Wing${ringSuffix}`);
        }
        // A four-node all-bivalent path is the Challenging XY-Chain / ALS-XY
        // form. Keep its native name instead of using the older generic
        // ALS-XY score, which incorrectly placed it above Challenging.
        if (alsSizeOne.allBivalve && alsSizeOne.nodeCount === 4) {
          const value = chainMathScore(4, chain, 4, 2);
          return define(ratingCategoryForValue(value), value, `XY-Chain${ringSuffix}`);
        }
        const scaled = depthScaledChainRating(chain, 'XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `XY-Chain${ringSuffix}`);
      }

      // Pure type-4 paths can be emitted without the older ALS-size-one
      // metadata. They are still XY-Chains, not multi-digit AICs. Score them
      // by depth: 3=Moderate, 4=Challenging, 5=Irritating, 6=Frustrating,
      // and 7+=Hard.
      const pureXyDepth = pureXyChainDepth(chain);
      if (pureXyDepth) {
        const scaled = depthScaledChainRating(chain, 'XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `XY-Chain${ringSuffix}`);
      }

      // A named wing is more specific than the generic Hidden XY-Chain
      // fallback. Some L(2)/L(3) forms use only bilocal links internally,
      // so hiddenXyChainInfo() can recognize the same path as well.
      if (/^(?:L\([23]\)|L[23]|S|M(?:\(\d+\))?|H(?:\(\d+\))?|W|Strong)-?(?:Wing|Ring)$/i.test(name)
        || /^i[SWMLH]/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, name + ringSuffix);
      }

      const hiddenXy = hiddenXyChainInfo(chain);
      if (hiddenXy?.remotePair) {
        const scaled = depthScaledChainRating(chain, 'Hidden Remote Pair', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `Hidden Remote Pair${ringSuffix}`);
      }
      if (hiddenXy) {
        const scaled = depthScaledChainRating(chain, 'Hidden XY-Chain', 3);
        return define(ratingCategoryForValue(scaled.value), scaled.value,
          `Hidden XY-Chain${ringSuffix}`);
      }

      if (/^XY-Wing$/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `XY-Wing${ringSuffix}`);
      }
      if (/^W\s*-?\s*Transport$/i.test(name) || /W\s*-?\s*Transport/i.test(fullName)) {
        return define('Frustrating', 6.5 + ringBonus, `T - W Transport${ringSuffix}`);
      }
      if (/^T\s*-\s*Transport(?:\s+Ring)?$/i.test(fullName)) {
        return define('Frustrating', 6.5 + ringBonus, `T-Transport${ringSuffix}`);
      }
      if (/^(?:2-String Kite|Empty Rectangle|Skyscraper|Finned X-Wing|Sashimi X-Wing)$/i.test(name)) {
        const value = chainMathScore(2, chain, 2, 2);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      if (/(?:^|-)\s*(?:Dual Empty Rectangle|Rec'T Kite|Bridged Empty Rectangle|Bridged ERI|\d+x ERI|L\(1\)-Wing|L1-Wing)$/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      const eriChainName = name.match(/^(\d+)x ERI$/i);
      if (eriChainName) {
        const eriDepth = Math.max(3, Number(eriChainName[1]));
        const value = chainMathScore(eriDepth, chain, eriDepth, 1);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }
      if (/^X-Wing$/i.test(name)) return define('Very Easy', 2, 'AIC X-Wing');

      if (/^(?:L\([23]\)|L[23]|S|M(?:\(\d+\))?|H(?:\(\d+\))?|W|Strong)-?(?:Wing|Ring)$/i.test(name)
        || /^i[SWMLH]/i.test(name)) {
        const value = chainMathScore(3, chain, 3, 3);
        return define(ratingCategoryForValue(value), value, `${name}${ringSuffix}`);
      }

      const length = chainLengthOf(chain);
      if (length >= 2) {
        if (chainUniqueDigitCount(chain) !== 1) {
          const base = Math.min(7, Math.max(3, length));
          const value = chainMathScore(base, chain, base, 2);
          return define(ratingCategoryForValue(value), value,
            `AIC${ringSuffix}`);
        }
        const base = Math.min(7, Math.max(3, length));
        const value = chainMathScore(base, chain, base, 1);
        return define(ratingCategoryForValue(value), value,
          `X-Chain (Depth ${length})${ringSuffix}`);
      }

      return unknownRating(step?.desc || '');
    }

    const {
      fromResult: alsDofStepFromResult,
      fromAlsChainResult: modularAlsDofChainStepFromResult,
      fromAhsResult: modularAhsDofStepFromResult,
      fromAhsChainResult: modularAhsDofChainStepFromResult,
    } = appNamespace.dofStep.create({
      core,
      rateStep: ratingForStep,
    });

    function ratingForStep(step) {
      const tech = String(step?.tech || '');
      if (tech === 'chain') return ratingForChain(step.chain || step, step);
      if (tech === 'als-dof') {
        const score = alsDofScore(step);
        const category = ratingCategoryForValue(score);
        const label = step.mode === 'almost-dds'
          ? 'Almost DDS'
          : step.mode === 'dds'
            ? 'DDS'
            : 'ALS - DOF';
        return {
          ...ratingDefinition(category, score, `${label}${step.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'als-hydra') {
        const score = 13 + Math.max(0, (step?.hydraRecord?.participants || []).length - 1) * 0.25;
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score, 'ALS - Hydra'),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'ahs-dof') {
        const dof = Math.max(1, Number(step?.size ?? step?.record?.dof ?? 1));
        const score = 12.25 + (0.25 * Math.max(0, dof - 1)) + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `AHS - DOF${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'ahs-dof-chain') {
        const score = 14 + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `AHS - DOF Chain${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'als-dof-chain') {
        const score = 14 + (step?.isRing ? 0.5 : 0);
        return {
          ...ratingDefinition(ratingCategoryForValue(score), score,
            `ALS - DOF Chain${step?.isRing ? ' Ring' : ''}`),
          hardestMove: step.desc || '',
        };
      }
      if (tech === 'msls') {
        return {
          ...ratingDefinition('Ascendant', 13, 'MSLS'),
          hardestMove: step.desc || '',
        };
      }
      const direct = RATING_TAGS.find(definition => definition.tech === tech);
      if (direct) {
        return {
          rank: direct.rank,
          value: direct.value,
          tag: direct.tag,
          category: direct.category,
          hardestMove: step.desc || '',
        };
      }

      if (tech === 'pointing' || tech === 'claiming' || tech === 'non-consecutive-line' || tech === 'non-consecutive-eri' || tech === 'non-consecutive-als' || tech === 'non-consecutive-als-dof' || tech === 'non-consecutive-als-dof-peer') {
        return {
          ...ratingDefinition('Extremely Easy', 1, 'Box - Line Reduction'),
          hardestMove: step.desc || '',
        };
      }

      const subsetMatch = /^(hidden|naked)-(single|pair|triple|quad|quintuple|sextuple|septuple|octuple|nontuple)$/i.exec(tech);
      if (subsetMatch) {
        const kind = subsetMatch[1].toLowerCase();
        const names = {
          single: ['Hidden Single', 'Naked Single'],
          pair: ['Hidden Pair', 'Naked Pair'],
          triple: ['Hidden Triple', 'Naked Triple'],
          quad: ['Hidden Quad', 'Naked Quad'],
          quintuple: ['Hidden Quintuple', 'Naked Quintuple'],
          sextuple: ['Hidden Sextuple', 'Naked Sextuple'],
          septuple: ['Hidden Septuple', 'Naked Septuple'],
          octuple: ['Hidden Octuple', 'Naked Octuple'],
          nontuple: ['Hidden Nontuple', 'Naked Nontuple'],
        }[subsetMatch[2].toLowerCase()];
        const size = {
          single: 1,
          pair: 2,
          triple: 3,
          quad: 4,
          quintuple: 5,
          sextuple: 6,
          septuple: 7,
          octuple: 8,
          nontuple: 9,
        }[subsetMatch[2].toLowerCase()] || 0;
        if (size > 0) {
          const value = size === 1 ? 1 : size;
          return {
            ...ratingDefinition(ratingCategoryForValue(value), value,
              names[kind === 'hidden' ? 0 : 1]),
            hardestMove: step.desc || '',
          };
        }
      }

      if (tech === 'fish') {
        const size = Number(step?.size);
        const k = Number(step?.k || 0);
        const fishCategory = step?.category || 'Basic';
        const value = fishScoreForSize(size, k, fishCategory);
        if (value !== null && Number.isFinite(value)) {
          const category = ratingCategoryForValue(value);
          const shape = fishCategory === 'Basic' && k === 0
            ? ({ 2: 'X-Wing', 3: 'SwordFish', 4: 'JellyFish' }[size] || `${size}x${size} Fish`)
            : `${fishCategory} ${size}x${size}+K${k} Fish`;
          return {
            ...ratingDefinition(category, value, shape),
            hardestMove: step.desc || '',
          };
        }
      }

      return unknownRating(step?.desc || '');
    }

    const { ratingFromSteps, ratingWithSolvedState, ratingFromLog } = appNamespace.ratingAggregation.create({
      rateStep: ratingForStep,
      unknownRating,
      ratingCategoryForValue,
      ranks: RATING_CATEGORY_RANKS,
    });

    const solvedState = appNamespace.solvedState;
    const candidateGridIsSolved = (candidateGrid, grid, expectedSolution = solution) =>
      solvedState.candidateGridIsSolved(candidateGrid, grid, expectedSolution);
    const { boardIsComplete: isBoardComplete } = solvedState;
    const boardIsComplete = () => isBoardComplete(puzzle, promotedValues);

    function applySimulationPromotion(candidateGrid, grid, step) {
      const cell = (step?.at || step?.vertices || [])[0];
      const digit = step?.digits?.[0];
      if (!Number.isInteger(cell) || !digit || grid[cell] || candidateGrid[cell]?.length !== 1) {
        return false;
      }

      if (candidateGrid[cell][0] !== digit) return false;
      grid[cell] = digit;
      candidateGrid[cell] = [];
      for (const peer of core.peersOf(cell)) {
        candidateGrid[peer] = (candidateGrid[peer] || []).filter(value => value !== digit);
      }
      return true;
    }

    function simulateSolver(grid, expectedSolution, profile = null) {
      const simulationCand = core.allCandidates(grid);
      const simulationGrid = [...grid];
      const steps = [];
      const maxCycles = 100;

      for (let count = 0; count < maxCycles; count++) {
        const choice = chooseSolverStep(
          simulationCand,
          simulationGrid,
          'generator',
          expectedSolution,
          profile,
        );
        if (!choice?.step) break;

        const items = core.eliminationItems(choice.step.elim, simulationCand);
        if (!items.length) {
          if (choice.step.tech !== 'last-man-standing'
            || !applySimulationPromotion(simulationCand, simulationGrid, choice.step)) break;
          steps.push({ ...choice.step, elim: { items: [] } });
          continue;
        }
        const removed = core.applyEliminations(simulationCand, { items });
        if (!removed.length) break;

        steps.push({
          ...choice.step,
          elim: { items: removed },
        });
      }

      return {
        cand: simulationCand,
        grid: simulationGrid,
        steps,
        cycles: steps.length,
      };
    }

    async function simulateSolverInWorker(
      grid,
      expectedSolution,
      profile = null,
      budget = 'generator',
    ) {
      const simulationCand = core.allCandidates(grid);
      const simulationGrid = [...grid];
      const steps = [];
      const maxCycles = 100;
      let useWorker = !searchWorkerDisabled;

      for (let count = 0; count < maxCycles; count++) {
        let choice;
        if (useWorker) {
          try {
            choice = await chooseSolverStepInWorker(
              simulationCand,
              simulationGrid,
              expectedSolution,
              profile,
              'generator',
            );
          } catch (error) {
            if (isSearchCancelled(error)) throw error;
            if (budget === 'generator') throw error;
            // A file:// page or an older browser may reject workers. Keep the
            // existing synchronous solver as a transparent fallback.
            useWorker = false;
            choice = chooseSolverStep(
              simulationCand,
              simulationGrid,
              'generator',
              expectedSolution,
              profile,
            );
          }
        } else {
          choice = chooseSolverStep(
            simulationCand,
            simulationGrid,
            'generator',
            expectedSolution,
            profile,
          );
        }
        if (!choice?.step) break;

        const items = core.eliminationItems(choice.step.elim, simulationCand);
        if (!items.length) {
          if (choice.step.tech !== 'last-man-standing'
            || !applySimulationPromotion(simulationCand, simulationGrid, choice.step)) break;
          steps.push({ ...choice.step, elim: { items: [] } });
          continue;
        }
        const removed = core.applyEliminations(simulationCand, { items });
        if (!removed.length) break;

        steps.push({
          ...choice.step,
          elim: { items: removed },
        });
      }

      return {
        cand: simulationCand,
        grid: simulationGrid,
        steps,
        cycles: steps.length,
      };
    }

    function rateGeneratedPuzzle(grid, expectedSolution, targetCategory = 'any') {
      try {
        const profile = generationTechniqueProfile(targetCategory);
        const simulation = simulateSolver(grid, expectedSolution, profile);
        const rating = ratingFromSteps(simulation.steps, 'generated');
        return ratingWithSolvedState(
          rating,
          candidateGridIsSolved(simulation.cand, simulation.grid, expectedSolution),
        );
      } catch (error) {
        return {
          ...unknownRating('Rating check failed.'),
          source: 'generated',
          solved: false,
        };
      }
    }

    async function rateGeneratedPuzzleInWorker(
      grid,
      expectedSolution,
      targetCategory = 'any',
      profileOverride = undefined,
    ) {
      const ratingTimeoutMs = 15000;
      let timeoutId = null;
      try {
        const profile = profileOverride === undefined
          ? generationTechniqueProfile(targetCategory)
          : profileOverride;
        const simulation = await Promise.race([
          simulateSolverInWorker(grid, expectedSolution, profile, 'generator'),
          new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => {
              const worker = searchWorker;
              searchWorker = null;
              if (worker) worker.terminate();
              releaseSearchWorkerBlobUrl();
              for (const job of searchWorkerJobs.values()) {
                job.reject(new Error('Generated-grid rating timed out.'));
              }
              searchWorkerJobs.clear();
              reject(new Error('Generated-grid rating timed out.'));
            }, ratingTimeoutMs);
          }),
        ]);
        const rating = ratingFromSteps(simulation.steps, 'generated');
        return ratingWithSolvedState(
          rating,
          candidateGridIsSolved(simulation.cand, simulation.grid, expectedSolution),
        );
      } catch (error) {
        if (isSearchCancelled(error)) throw error;
        return {
          ...unknownRating(error?.message || 'Rating check failed.'),
          source: 'generated',
          solved: false,
        };
      } finally {
        if (timeoutId !== null) clearTimeout(timeoutId);
      }
    }

    const ratingView = appNamespace.ratingView.create({
      elements: {
        summary: ratingSummaryEl,
        stepCount: ratingStepCountEl,
        category: ratingCategoryEl,
        detail: ratingDetailEl,
        hardestMove: ratingHardestMoveEl,
      },
      formatRatingValue,
      ratingCategoryForValue,
      ratingCategoryColorClass,
    });
    const renderRatingReport = () => ratingView.render(ratingReport);

    function appendStep(step) {
      const rating = ratingForStep(step);
      const entry = {
        cycle,
        tech: step.tech,
        desc: step.desc,
        moveName: step.chain
          ? constructDisplayName(step.chain, rating.tag)
          : rating.tag,
        ratingTag: rating.tag,
        rating,
        ...(step.chain ? { chain: step.chain } : {}),
      };
      logEntries.push(entry);
      // Save the board after this move, including the exact drawing inputs,
      // without recursively snapshotting the complete solution log.
      entry.displayState = snapshotVisualState();
      // Keep the visible score synchronized with the complete solution log,
      // rather than allowing a later search pass to replace it with only its
      // newest move.
      ratingReport = ratingFromLog(logEntries, candidateGridIsSolved(cand, puzzle));
    }

    const solutionLogView = appNamespace.solutionLogView.create({
      elements: { log: logEl, preview: solutionStepsPreviewEl },
      formatRatingValue,
      inspectLogStep,
    });
    const displayedStepDescription = solutionLogView.displayedStepDescription;
    const renderLog = () => solutionLogView.render(logEntries, historyState);
    const solutionListText = () => solutionLogView.solutionListText(logEntries);
    const solutionEurekaText = () => solutionLogView.solutionEurekaText(logEntries);

    const { renderList: renderPomList } = appNamespace.pomView.create(pomResultsEl);

    function renderPomReport() {
      pomResultsEl.textContent = '';
      if (!pomReport) {
        pomResultsEl.textContent = 'No POM check has been run.';
        return;
      }

      const initialTotal = pomReport.initialTemplateCounts.reduce((total, count) => total + count, 0);
      const finalTotal = pomReport.templateCounts.reduce((total, count) => total + count, 0);
      const totalReports = pomReport.omissions.length
        + pomReport.hiddenSubsets.length
          pomReport.nakedSubsets.length ? 'Naked subset reports' : '',
        + pomReport.tkDeletes.length;
      const deletedTemplates = Math.max(0, initialTotal - finalTotal);
      const digitCountText = counts => {
        const nonZero = counts
          .map((count, index) => count ? `${index + 1}:${count}` : '')
          .filter(Boolean);
        return nonZero.length ? nonZero.join(' ') : 'none';
      };
      const phaseText = summary => {
        if (summary.phase === 'omissions') return 'Omissions (digits 1-9)';
        if (summary.phase === 'hidden-subset') return `Hidden subset size ${summary.size}`;
        if (summary.phase === 'naked-subset') return `Naked subset size ${summary.size}`;
        return `T${summary.size}-delete`;
      };

      renderPomList(
        'Templates by digit (pre-POM)',
        pomReport.initialTemplateCounts.map((count, index) => `Digit ${index + 1}: ${count}`),
      );
      renderPomList(
        'Templates by digit (final)',
        pomReport.templateCounts.map((count, index) => `Digit ${index + 1}: ${count}`),
      );
      renderPomList(
        'Progression',
        pomReport.passSummaries.filter(summary => summary.reports > 0).map(summary =>
          `Cycle ${summary.pass}: ${phaseText(summary)} => ${summary.reports} reports, `
          + `${summary.templatesBefore} -> ${summary.templatesAfter} templates `
          + `(${summary.templateDeletes} deleted); per digit ${digitCountText(summary.digitCounts)}`
        ),
      );
      renderPomList(
        'Totals',
        [
          totalReports ? `Reports: ${totalReports}` : '',
          pomReport.omissions.length ? `Omissions: ${pomReport.omissions.length}` : '',
          pomReport.hiddenSubsets.length ? `Hidden subset reports: ${pomReport.hiddenSubsets.length}` : '',
          pomReport.nakedSubsets.length ? 'Naked subset reports' : '',
          pomReport.tkDeletes.length ? `TK-delete reports: ${pomReport.tkDeletes.length}` : '',
          `Templates: ${initialTotal} -> ${finalTotal}${deletedTemplates ? ` (${deletedTemplates} deleted)` : ''}`,
        ].filter(Boolean),
      );
      renderPomList(
        'Omissions',
        pomReport.omissions.map(core.formatPomOmission),
      );
      renderPomList(
        'Hidden subset template eliminations',
        pomReport.hiddenSubsets.map(item =>
          `Hidden ${item.size}: (${item.digits.join('')}) ${item.sector} ${core.cellGroupName(item.cells)} => digit ${item.digit}, templates ${item.templateIds.join(',')}`
        ),
      );
      renderPomList(
        'Naked subset template eliminations',
        pomReport.nakedSubsets.map(item =>
          
          'Naked subset template elimination',
        ),
      );
      renderPomList(
        'TK-delete',
        pomReport.tkDeletes.map(item =>
          `T${item.size + 1}: base digit ${item.digit}, template ${item.templateIds.join(',')}; `
          + `companions ${item.companionDigits.length ? `{${item.companionDigits.join(',')}}` : 'none'}; `
          + `chosen digits {${[item.digit, ...item.companionDigits].join(',')}}`
        ),
      );
    }

    function dofGroups(records, key) {
      const groups = new Map();
      for (const record of records || []) {
        const dof = Number(record[key]);
        if (!Number.isInteger(dof)) continue;
        const bucket = groups.get(dof) || [];
        bucket.push(record);
        groups.set(dof, bucket);
      }
      return [...groups.entries()].sort((left, right) => left[0] - right[0]);
    }

    function validSelectedDof(groups, selected) {
      if (!groups.length || selected === null || selected === undefined) return null;
      return groups.some(([dof]) => dof === selected) ? selected : null;
    }

    function appendDofButtons(container, groups, selected, onSelect) {
      const row = document.createElement('div');
      row.className = 'dof-buttons';

      for (const [dof, records] of groups) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dof-button';
        if (dof === selected) button.classList.add('current');
        button.textContent = `DOF ${dof} (${records.length})`;
        button.addEventListener('click', () => onSelect(dof));
        row.appendChild(button);
      }

      container.appendChild(row);
    }

    function rememberOpenSizeGroups(container, openGroups) {
      for (const panel of container.querySelectorAll('details.chain-category[data-size-group]')) {
        if (panel.open) openGroups.add(panel.dataset.sizeGroup);
        else openGroups.delete(panel.dataset.sizeGroup);
      }
    }

    function selectAlsRecord(als) {
      selectedAlsId = als.uniqueID;
      selectedAlsDof = als.alsDOF;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedFishKey = null;
      selectedBoxLineIndex = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      activeStep = null;
      lastRemoved = [];
      renderBoard();
      renderAlsReport();
      setStatus(`ALS ${als.uniqueID} selected.`, 'ok');
      focusMap();
    }

    function renderAlsReport() {
      rememberOpenSizeGroups(alsResultsEl, openAlsSizeGroups);
      alsResultsEl.textContent = '';
      if (!alsReport) {
        alsResultsEl.textContent = 'No LS / ALS build has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${alsReport.length} LS / ALS records.`;
      alsResultsEl.appendChild(summary);

      const groups = dofGroups(alsReport, 'alsDOF');
      selectedAlsDof = validSelectedDof(groups, selectedAlsDof);
      appendDofButtons(alsResultsEl, groups, selectedAlsDof, dof => {
        selectedAlsDof = dof;
        selectedAlsId = null;
        selectedAhsId = null;
        renderBoard();
        renderAlsReport();
      });

      if (selectedAlsDof === null) return;

      const selectedRecords = groups.find(([dof]) => dof === selectedAlsDof)?.[1] || [];
      const sizeGroups = new Map();
      for (const als of selectedRecords) {
        const bucket = sizeGroups.get(als.alsSize) || [];
        bucket.push(als);
        sizeGroups.set(als.alsSize, bucket);
      }
      for (const [zeroSize, records] of [...sizeGroups.entries()].sort((a, b) => a[0] - b[0])) {
        const sizePanel = document.createElement('details');
        sizePanel.className = 'chain-category';
        sizePanel.dataset.sizeGroup = `${selectedAlsDof}:${zeroSize}`;
        sizePanel.open = openAlsSizeGroups.has(sizePanel.dataset.sizeGroup);
        const sizeSummary = document.createElement('summary');
        sizeSummary.textContent = `Size ${zeroSize + 1} (${records.length})`;
        sizePanel.appendChild(sizeSummary);

        const list = document.createElement('ul');
        const visible = records.slice(0, 200);
        for (const als of visible) {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          if (selectedAlsId === als.uniqueID) button.classList.add('selected');
          button.textContent = `ALS: DOF(${als.alsDOF}) size(${als.alsSize + 1}) FOX(${als.alsFOX + 1}) `
            + `cells:${core.cellGroupName(als.alsAllCells)} `
            + `in ${core.sectorGroupName([als.alsSector])} `
            + `digits {${als.alsDigits.join('')}}`;
          button.addEventListener('click', () => selectAlsRecord(als));
          item.appendChild(button);
          list.appendChild(item);
        }
        if (records.length > visible.length) {
          const more = document.createElement('li');
          more.textContent = `Showing ${visible.length} of ${records.length} Size ${zeroSize + 1} records.`;
          list.appendChild(more);
        }
        sizePanel.appendChild(list);
        alsResultsEl.appendChild(sizePanel);
      }
    }

    function endpointText(endpoint) {
      return `(${endpoint.digit}) ${core.cellGroupName(endpoint.cells)}`
        + ` in ${core.sectorGroupName(endpoint.sectors)}`;
    }

    function alsNodeText(node) {
      if (!node) return 'none';
      return `LS#${node.uniqueID} ${core.cellGroupName(node.cells)} `
        + `in ${core.sectorGroupName([node.sector])} digits {${node.digits.join('')}}`;
    }

    function endpointElims(endpoint) {
      const removals = endpoint.potentialElim.map(cell => ({ cell, digit: endpoint.digit }));
      return core.formatRemovals(removals) || 'none';
    }

    function bridgeText(bridge) {
      if (!bridge) return 'C none';
      const digits = (bridge.digits && bridge.digits.length ? bridge.digits : [bridge.digit])
        .filter(Boolean)
        .join('');
      const cells = [...new Set([...(bridge.leftCells || []), ...(bridge.rightCells || [])])]
        .sort((a, b) => a - b);
      return `C(${digits || '?'}) ${core.cellGroupName(cells)} in ${core.sectorGroupName(bridge.sectors || [])}`;
    }

    function renderAlsLinkReport() {
      alsLinkResultsEl.textContent = '';
      if (!alsLinkReport) {
        alsLinkResultsEl.textContent = 'No ALS link build has been run.';
        return;
      }

      const links = core.flattenAlsLinks(alsLinkReport);
      const alsRccCount = alsLinkReport[core.ALS_RCC]?.length || 0;
      const summary = document.createElement('p');
      summary.textContent = `${links.length} ALS graph links: ALS_RCC ${alsRccCount}. `
        + `Size-1 Bivalve ALS nodes are listed under Strong Links as ALS.`;
      alsLinkResultsEl.appendChild(summary);

      const list = document.createElement('ul');
      const visible = links.slice(0, 200);
      for (const link of visible) {
        const item = document.createElement('li');
        const bridge = bridgeText(link.C);
        item.textContent = `${link.linkTypeName}: RCC_L ${endpointText(link.RCC_Left)} / `
          + `${alsNodeText(link.LS_R)} / ${bridge} / ${alsNodeText(link.LS_L)} / `
          + `RCC_R ${endpointText(link.RCC_Right)}; `
          + `L-elims ${endpointElims(link.RCC_Left)}; R-elims ${endpointElims(link.RCC_Right)}`;
        list.appendChild(item);
      }

      if (links.length > visible.length) {
        const more = document.createElement('li');
        more.textContent = `Showing ${visible.length} of ${links.length} records.`;
        list.appendChild(more);
      }

      alsLinkResultsEl.appendChild(list);
    }

    function renderAhsReport() {
      rememberOpenSizeGroups(ahsResultsEl, openAhsSizeGroups);
      ahsResultsEl.textContent = '';
      if (!ahsReport) {
        ahsResultsEl.textContent = 'No HS / AHS build has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${ahsReport.length} HS / AHS records.`;
      ahsResultsEl.appendChild(summary);

      const groups = dofGroups(ahsReport, 'ahsDOF');
      selectedAhsDof = validSelectedDof(groups, selectedAhsDof);
      appendDofButtons(ahsResultsEl, groups, selectedAhsDof, dof => {
        selectedAhsDof = dof;
        selectedAhsId = null;
        renderBoard();
        renderAhsReport();
      });

      if (selectedAhsDof === null) return;

      const selectedRecords = groups.find(([dof]) => dof === selectedAhsDof)?.[1] || [];
      const sizeGroups = new Map();
      for (const ahs of selectedRecords) {
        const bucket = sizeGroups.get(ahs.ahsSize) || [];
        bucket.push(ahs);
        sizeGroups.set(ahs.ahsSize, bucket);
      }
      for (const [zeroSize, records] of [...sizeGroups.entries()].sort((a, b) => a[0] - b[0])) {
        const sizePanel = document.createElement('details');
        sizePanel.className = 'chain-category';
        sizePanel.dataset.sizeGroup = `${selectedAhsDof}:${zeroSize}`;
        sizePanel.open = openAhsSizeGroups.has(sizePanel.dataset.sizeGroup);
        const sizeSummary = document.createElement('summary');
        sizeSummary.textContent = `Size ${zeroSize + 1} (${records.length})`;
        sizePanel.appendChild(sizeSummary);

        const list = document.createElement('ul');
        const visible = records.slice(0, 200);
        for (const ahs of visible) {
          const item = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          if (selectedAhsId === ahs.uniqueID) button.classList.add('selected');
          button.textContent = `AHS: DOF(${ahs.ahsDOF}) size(${ahs.ahsSize + 1}) FOX(${ahs.ahsFOX + 1}) `
            + `cells:${core.cellGroupName(ahs.ahsAllCells)} `
            + `in ${core.sectorGroupName([ahs.ahsSector])} `
            + `digits {${ahs.ahsDigits.join('')}}`;
          button.addEventListener('click', () => selectAhsRecord(ahs));
          item.appendChild(button);
          list.appendChild(item);
        }
        if (records.length > visible.length) {
          const more = document.createElement('li');
          more.textContent = `Showing ${visible.length} of ${records.length} Size ${zeroSize + 1} records.`;
          list.appendChild(more);
        }
        sizePanel.appendChild(list);
        ahsResultsEl.appendChild(sizePanel);
      }
    }

    function renderAhsLinkReport() {
      ahsLinkResultsEl.textContent = '';
      if (!ahsLinkReport) {
        ahsLinkResultsEl.textContent = 'No AHS link build has been run.';
        return;
      }
      const links = core.flattenAhsLinks(ahsLinkReport);
      const summary = document.createElement('p');
      summary.textContent = `${links.length} AHS graph link${links.length === 1 ? '' : 's'} built.`;
      ahsLinkResultsEl.appendChild(summary);
      const list = document.createElement('ul');
      for (const link of links.slice(0, 200)) {
        const item = document.createElement('li');
        const cells = value => core.cellGroupName(value || []);
        const branches = Array.isArray(link.overlapBranches)
          ? `; branches ${link.overlapBranches.map(branch => `${branch.value}: `
            + `${cells(branch.left?.cells)}[${(branch.left?.digits || []).join('')}] / `
            + `${cells(branch.right?.cells)}[${(branch.right?.digits || []).join('')}]`
            + `${(branch.hsRestrictions?.length)
              ? ` => ${branch.hsRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${(branch.dofRestrictions?.length)
              ? `; ${branch.dofRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${(branch.sectorRestrictions?.length)
              ? `; ${branch.sectorRestrictions.map(restriction => `${cells(restriction.cells)}<>${restriction.digits.join('')}`).join(', ')}`
              : ''}`
            + `${(branch.left?.eliminations?.length || branch.right?.eliminations?.length)
              ? `; ${core.formatRemovals([...(branch.left?.eliminations || []), ...(branch.right?.eliminations || [])])}`
              : ''}`).join(' | ')}`
          : '';
        const intrinsic = Array.isArray(link.intrinsicEliminations) && link.intrinsicEliminations.length
          ? `; elims ${core.formatRemovals(link.intrinsicEliminations)}`
          : '';
        const bridgeExclusions = Array.isArray(link.bridgeCellExclusions) && link.bridgeCellExclusions.length
          ? `; bridge ${cells([link.xzBridgeCell])}<>${link.bridgeCellExclusions.join('')}`
          : '';
        item.textContent = `${link.moduleKind || link.linkTypeName}: RCC_L ${cells(link.RCC_Left?.rccCells || link.RCC_Left?.cells)} / `
          + `HS_L ${cells(link.HS_L?.cells)} / C ${cells(link.C?.leftCells || link.C?.cells)} / `
          + `HS_R ${cells(link.HS_R?.cells)} / RCC_R ${cells(link.RCC_Right?.rccCells || link.RCC_Right?.cells)}`
          + branches + intrinsic + bridgeExclusions;
        list.appendChild(item);
      }
      if (links.length > 200) {
        const more = document.createElement('li');
        more.textContent = `Showing 200 of ${links.length} records.`;
        list.appendChild(more);
      }
      ahsLinkResultsEl.appendChild(list);
    }

    const runAhsLinkBuild = appNamespace.ahsLinkBuild.create({
      elements: {
        results: ahsLinkResultsEl,
      },
      state: {
        get cand() { return cand; },
        get ahsReport() { return ahsReport; },
        set ahsLinkReport(value) { ahsLinkReport = value; },
        get ahsLinkReport() { return ahsLinkReport; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderAhsLinkReport,
        openReportPanel,
        flattenAhsLinks: core.flattenAhsLinks,
        isSearchCancelled,
      },
    });

    function renderAhsDofResults(report) {
      ahsDofResultsEl.textContent = '';
      if (!report) {
        ahsDofResultsEl.textContent = 'No AHS-DOF search has been run.';
        return;
      }
      const results = report.results || report.links || [];
      const summary = document.createElement('p');
      const rejected = report.rejectedResults?.length || 0;
      summary.textContent = `${results.length} verified AHS-DOF net${results.length === 1 ? '' : 's'} found.`
        + (rejected ? ` ${rejected} rejected by verification.` : '');
      ahsDofResultsEl.appendChild(summary);
      if (!results.length) return;
      const list = document.createElement('ol');
      list.className = 'chain-list';
      results.slice(0, 200).forEach((link, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedAhsDofNetIndex === index) button.classList.add('selected');
        button.textContent = `${index + 1}. AHS-DOF: ${core.formatAhsDofNet(link)}`;
        button.title = 'Display this AHS-DOF net on the grid';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          selectedAhsDofNetIndex = index;
          selectedAhsDof = null;
          selectedAhsId = null;
          selectedAlsId = null;
          selectedAlsDofIndex = null;
          selectedChainIndex = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderAhsDofResults(ahsDofReport);
          openReportPanel(ahsDofResultsEl);
          focusMap();
          setStatus(`AHS-DOF result ${index + 1} displayed.`, 'ok');
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      ahsDofResultsEl.appendChild(list);
    }

    function renderAhsDofChainResults(report) {
      ahsDofChainResultsEl.textContent = '';
      if (!report) {
        ahsDofChainResultsEl.textContent = 'No AHS-DOF chain search has been run.';
        return;
      }
      const results = report.results || report.links || [];
      const summary = document.createElement('p');
      summary.textContent = `${results.length} verified AHS-DOF chain${results.length === 1 ? '' : 's'} found.`
        + ` ${report.stats?.nets || 0} nets, ${report.stats?.bridges || 0} bridges checked`
        + `${report.stats?.truncated ? '; result limit reached.' : '.'}`;
      ahsDofChainResultsEl.appendChild(summary);
      if (!results.length) return;
      const list = document.createElement('ol');
      list.className = 'chain-list';
      results.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedAhsDofChainIndex === index) button.classList.add('selected');
        button.textContent = `${index + 1}. AHS-DOF Chain: ${core.formatAhsDofChain(chain)}`;
        button.title = 'Display this AHS-DOF chain on the grid';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          selectedAhsDofChainIndex = index;
          selectedAhsDofNetIndex = null;
          selectedAhsDof = null;
          selectedAhsId = null;
          selectedAlsId = null;
          selectedAlsDofIndex = null;
          selectedChainIndex = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderAhsDofChainResults(ahsDofChainReport);
          openReportPanel(ahsDofChainResultsEl);
          focusMap();
          setStatus(`AHS-DOF chain ${index + 1} displayed.`, 'ok');
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      ahsDofChainResultsEl.appendChild(list);
    }

    const runAhsDofBuild = appNamespace.ahsDofBuild.create({
      elements: {
        maxDof: ahsDofMaxDofEl,
        maxCells: ahsDofMaxCellsEl,
        maxAuxiliary: ahsDofMaxAuxiliaryEl,
        maxResults: ahsDofMaxResultsEl,
        results: ahsDofResultsEl,
      },
      state: {
        get cand() { return cand; },
        set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
        set ahsDofReport(value) { ahsDofReport = value; },
      },
      actions: {
        setBusy,
        setStatus,
        runSearchWorker,
        renderAhsDofResults,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAhsDofChainBuild = appNamespace.ahsDofChainBuild.create({
      elements: {
        maxDof: ahsDofChainMaxDofEl,
        maxCells: ahsDofChainMaxCellsEl,
        maxAuxiliary: ahsDofChainMaxAuxiliaryEl,
        maxDepth: ahsDofChainMaxDepthEl,
        maxResults: ahsDofChainMaxResultsEl,
        hydraEnabled: ahsDofHydraEnabledEl,
        results: ahsDofChainResultsEl,
      },
      state: {
        get cand() { return cand; },
        set selectedAhsDofChainIndex(value) { selectedAhsDofChainIndex = value; },
        set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
        set ahsDofChainReport(value) { ahsDofChainReport = value; },
        get ahsDofChainReport() { return ahsDofChainReport; },
        set ahsHydraReport(value) { ahsHydraReport = value; },
        get ahsHydraReport() { return ahsHydraReport; },
      },
      actions: {
        setBusy,
        setStatus,
        runSearchWorker,
        renderAhsDofChainResults,
        renderAhsHydraReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAhsHydraBuild = appNamespace.ahsHydraBuild.create({
      elements: {
        maxDof: ahsDofMaxDofEl,
        maxAuxiliary: ahsDofChainMaxAuxiliaryEl,
        maxResults: ahsDofMaxResultsEl,
        maxDepth: ahsDofChainMaxDepthEl,
        hydraEnabled: ahsDofHydraEnabledEl,
        results: ahsHydraResultsEl,
      },
      state: {
        get cand() { return cand; },
        set ahsHydraReport(value) { ahsHydraReport = value; },
        get ahsHydraReport() { return ahsHydraReport; },
        set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        set selectedHydraFamily(value) { selectedHydraFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        runSearchWorker,
        renderAhsHydraReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    function selectAhsRecord(ahs) {
      selectedAhsId = ahs.uniqueID;
      selectedAhsDof = ahs.ahsDOF;
      selectedAlsId = null;
      selectedChainIndex = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedFishKey = null;
      selectedNakedSubsetKey = null;
      selectedBoxLineIndex = null;
      selectedHiddenSubsetKey = null;
      activeStep = null;
      lastRemoved = [];
      renderBoard();
      renderAhsReport();
      setStatus(`AHS ${ahs.uniqueID} selected.`, 'ok');
      focusMap();
    }

    function selectStrongLink(index) {
      const selectedGroup = strongLinkDisplayGroups()[selectedStrongLinkType] || [];
      if (!selectedGroup[index]) return;
      selectedStrongLinkIndex = index;
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedFishKey = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      activeStep = null;
      lastRemoved = [];
      renderBoard();
      renderStrongLinkReport();
      setStatus(`Strong Link ${index + 1} selected.`, 'ok');
      focusMap();
    }

    function strongLinkDisplayGroups() {
      if (!strongLinkReport) return [];
      const groups = strongLinkReport.map(group => [...group]);
      const typeIndexes = {
        BILOCAL: 0,
        CELL_TO_GROUP: 1,
        GROUP_TO_GROUP: 2,
        ERI: 3,
        ALS: 4,
      };
      for (const link of core.flattenStrongLinks(strongLinkReport)) {
        for (const secondaryType of link.secondaryTypes || []) {
          const index = typeIndexes[secondaryType];
          if (index === undefined || groups[index].includes(link)) continue;
          groups[index].push(link);
        }
      }
      return groups;
    }

    function renderStrongLinkReport() {
      strongLinkResultsEl.textContent = '';
      if (!strongLinkReport) {
        return;
      }

      const groups = strongLinkDisplayGroups();
      const links = [...new Set(groups.flat())];
      const counts = groups.map(group => group.length);
      const typeNames = [
        'Bi-Local',
        'Cell <=> Group',
        'Group <=> Group',
        'ERI',
        'BIVALVE (Size-1 ALS)',
      ];
      const summary = document.createElement('p');
      summary.textContent = `${links.length} unique strong links.`;
      strongLinkResultsEl.appendChild(summary);

      const buttonRow = document.createElement('div');
      buttonRow.className = 'dof-buttons';
      typeNames.forEach((name, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dof-button';
        if (selectedStrongLinkType === index) button.classList.add('current');
        button.textContent = `${name} (${counts[index]})`;
        button.addEventListener('click', () => {
          selectedStrongLinkType = index;
          selectedAlsId = null;
          selectedAhsId = null;
          selectedStrongLinkIndex = null;
          selectedChainIndex = null;
          selectedFishKey = null;
          selectedNakedSubsetKey = null;
          selectedHiddenSubsetKey = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderStrongLinkReport();
        });
        buttonRow.appendChild(button);
      });
      strongLinkResultsEl.appendChild(buttonRow);

      if (selectedStrongLinkType === null) return;

      const selectedGroup = groups[selectedStrongLinkType] || [];
      const maxVisible = 200;
      const list = document.createElement('ul');
      list.className = 'log';
      const visible = selectedGroup.slice(0, maxVisible);
      for (let index = 0; index < visible.length; index++) {
        const link = visible[index];
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedStrongLinkIndex === index) button.classList.add('selected');
        const secondaryTypeIndexes = {
          BILOCAL: 0,
          CELL_TO_GROUP: 1,
          GROUP_TO_GROUP: 2,
          ERI: 3,
          ALS: 4,
        };
        const secondaryTypes = [...new Set(link.secondaryTypes || [])];
        const secondary = secondaryTypes.length
          ? ` [${secondaryTypes.join(' / ')}]`
          : '';
        const originalTypeName = typeNames[link.linkType] || link.linkTypeName;
        button.textContent = `${originalTypeName}${secondary}: (${link.startingDigits.join('')}) `
          + `${core.cellGroupName(link.activeCells)} = (${link.linkDigits.join('')}) `
          + `${core.cellGroupName(link.linkedCells)} `
          + `in ${core.sectorGroupName(link.originSector)}`;
        button.addEventListener('click', () => selectStrongLink(index));
        item.appendChild(button);
        list.appendChild(item);
      }

      if (visible.length < selectedGroup.length) {
        const more = document.createElement('li');
        more.textContent = `Showing ${visible.length} of ${selectedGroup.length} records.`;
        list.appendChild(more);
      }
      strongLinkResultsEl.appendChild(list);
    }

    function simpleColoringCellsText(cells) {
      return core.cellGroupName([...(cells || [])].sort((a, b) => a - b)) || 'none';
    }

    function simpleColoringEureka(record) {
      const blue = simpleColoringCellsText(record.blueCells);
      const purple = simpleColoringCellsText(record.purpleCells);
      const eliminations = core.formatRemovals(record.eliminations || []) || 'none';
      const closure = record.tech !== 'super-multi-colouring'
        && record.terminalClosure?.cells?.length
        ? ` -> terminal ${core.cellGroupName(record.terminalClosure.cells)}`
        : '';
      const witnesses = [];
      for (const conflict of record.sectorParityConflicts || []) {
        const colour = conflict.color === 0 ? 'Blue' : 'Purple';
        witnesses.push(
          `${colour} repeats in ${core.sectorGroupName([conflict.sector])}`
          + ` (${core.cellGroupName(conflict.cells || [])})`,
        );
      }
      for (const sector of record.mixedSectors || []) {
        witnesses.push(`both parities in ${core.sectorGroupName([sector])}`);
      }
      if ((record.bothParityPeerEliminations || []).length) {
        witnesses.push(
          `candidate sees both parities at ${core.cellGroupName(record.bothParityPeerEliminations)}`,
        );
      }
      for (const conflict of record.terminalTruthConflicts || []) {
        witnesses.push(
          `terminal truths conflict at ${core.cellGroupName(conflict.cells || [])}`,
        );
      }
      const witness = witnesses.length ? ` [${witnesses.join(' ; ')}]` : '';
      return `Simple Colouring: (${record.digit}) Blue ${blue} - Purple ${purple}${closure}${witness} => ${eliminations}`;
    }

    function renderSimpleColoringReport() {
      simpleColoringResultsEl.textContent = '';
      if (!simpleColoringReport) {
        simpleColoringResultsEl.textContent = 'No Simple Colouring search has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${simpleColoringReport.length} Simple Colouring result${simpleColoringReport.length === 1 ? '' : 's'}.`;
      simpleColoringResultsEl.appendChild(summary);
      if (!simpleColoringReport.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No legal eliminations were found using strong-link type 0.';
        simpleColoringResultsEl.appendChild(empty);
        return;
      }

      const list = document.createElement('ul');
      list.className = 'log';
      for (let index = 0; index < simpleColoringReport.length; index++) {
        const record = simpleColoringReport[index];
        const safetyFlags = record.safetyFlags || [];
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (safetyFlags.length) button.classList.add('chain-result-flagged');
        if (selectedSimpleColoringIndex === index) button.classList.add('selected');
        button.textContent = `${safetyFlags.length ? '[FLAGGED] ' : ''}${simpleColoringEureka(record)}`;
        button.title = safetyFlags.length
          ? `Flagged for inspection: ${safetyFlags.join('; ')}`
          : 'Highlight this Simple Colouring result on the grid';
        button.addEventListener('click', () => {
          selectedSimpleColoringIndex = index;
          colouringSequenceState.simple.breadth = 1;
          selectedThreeDMedusaIndex = null;
          selectedMultiColoringIndex = null;
          selectedSuperMultiColoringIndex = null;
          selectedThreeDMedusaMultiIndex = null;
          selectedAlsId = null;
          selectedAhsId = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          selectedChainIndex = null;
          selectedFishKey = null;
          selectedNakedSubsetKey = null;
          selectedHiddenSubsetKey = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderSimpleColoringReport();
          renderThreeDMedusaReport();
          setStatus(`Simple Colouring result ${index + 1} selected.`, 'ok');
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      }
      simpleColoringResultsEl.appendChild(list);
    }

    function threeDMedusaNodeText(nodes) {
      const labels = (nodes || []).map(node => {
        const colors = node.colors?.length > 1
          ? 'both'
          : node.colors?.[0] === 0
            ? 'blue'
            : node.colors?.[0] === 1
              ? 'purple'
              : 'uncoloured';
        return `(${node.digit})${core.cellGroupName([node.cell])} ${colors}`;
      });
      return labels.join(', ') || 'none';
    }

    function threeDMedusaEdgeText(edge) {
      const colour = node => node.colors?.length > 1
        ? 'both'
        : node.colors?.[0] === 0
          ? 'blue'
          : node.colors?.[0] === 1
            ? 'purple'
            : 'uncoloured';
        const operator = edge.kind === 'bivalve-transition'
          ? ' = '
          : edge.kind === 'weak-peer'
            ? ' - '
            : ' = ';
      return `(${edge.left.digit})${core.cellGroupName([edge.left.cell])} ${colour(edge.left)}`
        + `${operator}(${edge.right.digit})${core.cellGroupName([edge.right.cell])} ${colour(edge.right)}`;
    }

    function threeDMedusaEdgesText(record) {
      return (record.edges || []).map(threeDMedusaEdgeText).join(' ; ') || 'none';
    }

    function threeDMedusaDigitColoursText(record) {
      return (record.digitColours || []).map(item => {
        const blue = core.cellGroupName(item.blue || []) || 'none';
        const purple = core.cellGroupName(item.purple || []) || 'none';
        return `${item.digit}[B:${blue}; P:${purple}]`;
      }).join(' | ') || 'none';
    }

    function threeDMedusaEureka(record) {
      const eliminations = core.formatRemovals(record.eliminations || []) || 'none';
      const closure = record.terminalClosure?.cells?.length
        ? ` -> terminal ${core.cellGroupName(record.terminalClosure.cells)}`
        : record.ring ? ' -> ring' : '';
      const alsDofRule = [...new Set((record.alsDofConflicts || []).map(conflict => {
        const colour = conflict.color === 0 ? 'blue' : 'purple';
        const cells = core.cellGroupName(conflict.cells || []) || 'unknown cells';
        const removed = (conflict.colouredDigits || []).join('') || 'none';
        const remaining = (conflict.remainingDigits || []).join('') || 'none';
        return `ALS-DOF ${colour} false ${cells} -${removed} leaves ${remaining}`;
      }))].join(' ; ');
      const ahsDofRule = (record.ahsDofConflicts || []).map(conflict => {
        const colour = conflict.color === 0 ? 'blue' : 'purple';
        const cells = core.cellGroupName(conflict.ahsCells || []) || 'unknown cells';
        const removed = core.cellGroupName(conflict.removedCells || []) || 'none';
        const digits = (conflict.ahsDigits || []).join('') || 'none';
        return `AHS-DOF ${colour} false ${cells} digits ${digits} -cells ${removed}`;
      }).join(' ; ');
      const cellParityRule = (record.cellParityConflicts || [])
        .map(conflict => {
          const colour = conflict.color === 0 ? 'blue' : 'purple';
          return `cell ${core.cellGroupName([conflict.cell])} has multiple digits in ${colour} parity`
            + ` (${(conflict.digits || []).join('')})`;
        }).join(' ; ');
      const sectorParityRule = (record.conflicts || [])
        .filter(conflict => conflict.kind === 'sector')
        .map(conflict => {
          const colour = conflict.color === 0 ? 'blue' : 'purple';
          return `${colour} parity repeats digit ${conflict.digit}`
            + ` in ${core.sectorGroupName([conflict.sector])}`;
        }).join(' ; ');
      const sameParityPeerRule = (record.conflicts || [])
        .filter(conflict => conflict.kind === 'peer')
        .map(conflict => {
          const colour = conflict.color === 0 ? 'blue' : 'purple';
          return `${colour} same-digit peers conflict at `
            + `${core.cellGroupName([conflict.left.cell, conflict.right.cell])}`;
        }).join(' ; ');
      const bothParityPeerRule = (record.conflicts || [])
        .filter(conflict => conflict.kind === 'coloured-cell-sees-both')
        .map(conflict =>
          `${core.cellGroupName([conflict.cell])} sees both parities for ${conflict.digit}`,
        ).join(' ; ');
      const sectorPeerRule = (record.conflicts || [])
        .filter(conflict => conflict.kind === 'sector-peer-union')
        .map(conflict => {
          const colour = conflict.color === 0 ? 'blue' : 'purple';
          const sector = core.sectorGroupName([conflict.sector]);
          const cells = core.cellGroupName(conflict.viableCells || []) || 'none';
          return `sector union ${sector} digit ${conflict.digit} ${colour} false: peers cover ${cells}`;
        }).join(' ; ');
      const form = record.kind === 'bivalve-ring'
        ? ' Bivalve Ring'
        : record.kind === 'bivalve-chain'
          ? ' Bivalve Chain'
          : '';
      const oppositeParityRule = (record.rules || []).includes('opposite-parity-peer')
        ? 'uncoloured candidate sees the opposite parity of a coloured clue'
        : '';
      const witnessText = [
        alsDofRule,
        ahsDofRule,
        cellParityRule,
        sectorParityRule,
        sameParityPeerRule,
        bothParityPeerRule,
        sectorPeerRule,
        oppositeParityRule,
      ]
        .filter(Boolean)
        .join(' ; ');
      const witness = witnessText ? ` [${witnessText}]` : '';
      return `3D - Medusa {Simple}${form}: ${threeDMedusaNodeText(record.nodes)}${closure}${witness} => ${eliminations}`;
    }

    function renderThreeDMedusaReport() {
      threeDMedusaResultsEl.textContent = '';
      if (!threeDMedusaReport) {
        threeDMedusaResultsEl.textContent = 'No 3D-Medusa search has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${threeDMedusaReport.length} 3D-Medusa {Simple} result${threeDMedusaReport.length === 1 ? '' : 's'}.`;
      threeDMedusaResultsEl.appendChild(summary);
      if (!threeDMedusaReport.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No legal eliminations were found using strong-link types 0 and 4.';
        threeDMedusaResultsEl.appendChild(empty);
        return;
      }

      const list = document.createElement('ul');
      list.className = 'log';
      for (let index = 0; index < threeDMedusaReport.length; index++) {
        const record = threeDMedusaReport[index];
        const safetyFlags = record.safetyFlags || [];
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (safetyFlags.length) button.classList.add('chain-result-flagged');
        if (selectedThreeDMedusaIndex === index) button.classList.add('selected');
        button.textContent = `${safetyFlags.length ? '[FLAGGED] ' : ''}${threeDMedusaEureka(record)}`;
        button.title = safetyFlags.length
          ? `Flagged for inspection: ${safetyFlags.join('; ')}`
          : 'Highlight this 3D-Medusa result on the grid';
        button.addEventListener('click', () => {
          selectedThreeDMedusaIndex = index;
          colouringSequenceState.medusa.breadth = 1;
          selectedSimpleColoringIndex = null;
          selectedMultiColoringIndex = null;
          selectedSuperMultiColoringIndex = null;
          selectedThreeDMedusaMultiIndex = null;
          selectedAlsId = null;
          selectedAhsId = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          selectedChainIndex = null;
          selectedFishKey = null;
          selectedNakedSubsetKey = null;
          selectedHiddenSubsetKey = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderSimpleColoringReport();
          renderThreeDMedusaReport();
          setStatus(`3D-Medusa result ${index + 1} selected.`, 'ok');
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      }
      threeDMedusaResultsEl.appendChild(list);
    }

    const MULTI_COLOUR_STYLES = {
      purple: { ink: '#7e22ce', fill: 'rgba(233, 213, 255, .9)', stroke: '#7e22ce' },
      blue: { ink: '#1d4ed8', fill: 'rgba(191, 219, 254, .9)', stroke: '#2563eb' },
      yellow: { ink: '#a16207', fill: 'rgba(254, 249, 195, .92)', stroke: '#a16207' },
      green: { ink: '#15803d', fill: 'rgba(187, 247, 208, .92)', stroke: '#15803d' },
      cyan: { ink: '#0891b2', fill: 'rgba(207, 250, 254, .92)', stroke: '#0891b2' },
      aqua: { ink: '#0f766e', fill: 'rgba(204, 251, 241, .92)', stroke: '#0f766e' },
      orange: { ink: '#c2410c', fill: 'rgba(255, 237, 213, .92)', stroke: '#c2410c' },
      red: { ink: '#b91c1c', fill: 'rgba(254, 202, 202, .92)', stroke: '#b91c1c' },
      pink: { ink: '#be185d', fill: 'rgba(251, 207, 232, .92)', stroke: '#be185d' },
      magenta: { ink: '#a21caf', fill: 'rgba(245, 208, 254, .92)', stroke: '#a21caf' },
      teal: { ink: '#0f766e', fill: 'rgba(153, 246, 228, .92)', stroke: '#0f766e' },
      lime: { ink: '#4d7c0f', fill: 'rgba(217, 249, 157, .92)', stroke: '#4d7c0f' },
      gold: { ink: '#92400e', fill: 'rgba(254, 243, 199, .92)', stroke: '#92400e' },
      brown: { ink: '#78350f', fill: 'rgba(231, 213, 197, .92)', stroke: '#78350f' },
      indigo: { ink: '#4338ca', fill: 'rgba(224, 231, 255, .92)', stroke: '#4338ca' },
      coral: { ink: '#c2410c', fill: 'rgba(255, 228, 220, .92)', stroke: '#c2410c' },
      slate: { ink: '#475569', fill: 'rgba(226, 232, 240, .92)', stroke: '#475569' },
      rose: { ink: '#be123c', fill: 'rgba(255, 228, 230, .92)', stroke: '#be123c' },
    };

    // Standalone Multi-colouring has its own node palette. The 3D-Medusa
    // bivalve renderer continues to use MULTI_COLOUR_STYLES above.
    const MULTI_GRAPH_COLOUR_STYLES = {
      lavender: { ink: '#7c3aed', fill: 'rgba(221, 214, 254, .92)', stroke: '#7c3aed' },
      sky: { ink: '#0284c7', fill: 'rgba(186, 230, 253, .92)', stroke: '#0284c7' },
      amber: { ink: '#b45309', fill: 'rgba(253, 230, 138, .92)', stroke: '#b45309' },
      mint: { ink: '#047857', fill: 'rgba(167, 243, 208, .92)', stroke: '#047857' },
      turquoise: { ink: '#0f766e', fill: 'rgba(153, 246, 228, .92)', stroke: '#0f766e' },
      peach: { ink: '#c2410c', fill: 'rgba(254, 215, 170, .92)', stroke: '#c2410c' },
      cobalt: { ink: '#1d4ed8', fill: 'rgba(191, 219, 254, .92)', stroke: '#1d4ed8' },
      olive: { ink: '#4d7c0f', fill: 'rgba(217, 249, 157, .92)', stroke: '#4d7c0f' },
      plum: { ink: '#86198f', fill: 'rgba(250, 232, 255, .92)', stroke: '#86198f' },
      lemon: { ink: '#a16207', fill: 'rgba(254, 249, 195, .92)', stroke: '#a16207' },
      slate: { ink: '#475569', fill: 'rgba(226, 232, 240, .92)', stroke: '#475569' },
      sage: { ink: '#166534', fill: 'rgba(220, 252, 231, .92)', stroke: '#166534' },
      charcoal: { ink: '#374151', fill: 'rgba(229, 231, 235, .92)', stroke: '#374151' },
      apricot: { ink: '#9a3412', fill: 'rgba(255, 237, 213, .92)', stroke: '#9a3412' },
      orchid: { ink: '#a21caf', fill: 'rgba(250, 232, 255, .92)', stroke: '#a21caf' },
      moss: { ink: '#3f6212', fill: 'rgba(236, 252, 203, .92)', stroke: '#3f6212' },
      navy: { ink: '#1e3a8a', fill: 'rgba(219, 234, 254, .92)', stroke: '#1e3a8a' },
      gold: { ink: '#92400e', fill: 'rgba(254, 243, 199, .92)', stroke: '#92400e' },
    };

    // Additional pairs use a fixed, high-contrast sequence derived from the
    // Okabe-Ito colour-blind-friendly palette rather than arbitrary hues.
    const MULTI_COLOUR_FALLBACK_STYLES = [
      { ink: '#0072b2', fill: 'rgba(86, 180, 233, .86)', stroke: '#0072b2' },
      { ink: '#d55e00', fill: 'rgba(230, 159, 0, .88)', stroke: '#d55e00' },
      { ink: '#009e73', fill: 'rgba(0, 158, 115, .32)', stroke: '#009e73' },
      { ink: '#cc79a7', fill: 'rgba(204, 121, 167, .52)', stroke: '#cc79a7' },
      { ink: '#000000', fill: 'rgba(240, 228, 66, .9)', stroke: '#000000' },
      { ink: '#7a3e9d', fill: 'rgba(148, 103, 189, .58)', stroke: '#7a3e9d' },
      { ink: '#4d4d4d', fill: 'rgba(180, 180, 180, .72)', stroke: '#4d4d4d' },
      { ink: '#b22222', fill: 'rgba(213, 94, 0, .54)', stroke: '#b22222' },
    ];

    function multiColoringTokenClass(token) {
      return String(token || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }

    function multiColoringStyleForToken(token) {
      if (MULTI_GRAPH_COLOUR_STYLES[token]) return MULTI_GRAPH_COLOUR_STYLES[token];
      if (MULTI_COLOUR_STYLES[token]) return MULTI_COLOUR_STYLES[token];
      const match = /^pair-(\d+)-(left|right)$/.exec(String(token || ''));
      if (!match) return null;
      const pairIndex = Number(match[1]) - 1;
      const styleIndex = (pairIndex * 2 + (match[2] === 'right' ? 1 : 0))
        % MULTI_COLOUR_FALLBACK_STYLES.length;
      return MULTI_COLOUR_FALLBACK_STYLES[styleIndex];
    }

    function applyMultiColoringStyle(element, tokens) {
      const names = [...new Set((tokens || []).filter(Boolean))];
      if (!names.length) return;
      names.forEach(token => element.classList.add(`multi-colouring-${multiColoringTokenClass(token)}`));
      const styles = names.map(multiColoringStyleForToken).filter(Boolean);
      if (element.namespaceURI === 'http://www.w3.org/2000/svg') {
        if (styles.length === 1) {
          element.setAttribute('fill', element.tagName === 'path' ? 'none' : styles[0].fill);
          element.setAttribute('stroke', styles[0].stroke);
        }
        return;
      }
      element.classList.add('multi-colouring-digit');
      if (styles.length === 1) {
        element.style.color = styles[0].ink;
        element.style.background = styles[0].fill;
        element.style.boxShadow = `inset 0 0 0 2px ${styles[0].stroke}`;
      } else {
        element.classList.add('multi-colouring-dual-digit');
        element.style.color = '#334155';
        element.style.background = `linear-gradient(135deg, ${styles[0]?.fill || 'transparent'} 0 50%, ${styles[1]?.fill || styles[0]?.fill || 'transparent'} 50% 100%)`;
      }
    }

    function multiColoringOuterText(colors) {
      if (colors?.length > 1) return 'A/B';
      return colors?.[0] === 0 ? 'A' : colors?.[0] === 1 ? 'B' : 'false';
    }

    function multiColoringInnerText(innerColor, colourTokens = null) {
      if (Array.isArray(colourTokens) && colourTokens.length) return colourTokens.join(' + ');
      const colors = Array.isArray(innerColor) ? innerColor : [innerColor];
      if (colors.length > 1) return 'blue + purple';
      return colors[0] === 0 ? 'blue' : 'purple';
    }

    function multiColoringLinkText(record) {
      return (record.linkColours || []).map(link => {
        const endpoints = (link.endpoints || []).map(endpoint =>
          `${core.cellGroupName([endpoint.cell])} ${multiColoringInnerText(endpoint.colors || endpoint.innerColor, endpoint.colourTokens)}`,
        ).join(', ');
        const pair = (link.pairColours || []).join(' | ');
        const typeLabel = record.tech === 'super-multi-colouring'
          ? `T${link.linkType ?? 0} `
          : '';
        return `${link.label}${typeLabel}[${core.cellGroupName(link.cells)}] ${pair || multiColoringOuterText(link.colors)} {${endpoints}}`;
      }).join(' ; ') || 'none';
    }

    function superMultiColoringGroupText(record) {
      return (record.groupColours || []).map(group => {
        const sides = (group.sides || []).map(side => {
          const colours = side.colourTokens?.length
            ? side.colourTokens.join(' + ')
            : multiColoringInnerText(side.colors);
          return `{${core.cellGroupName(side.cells || [])}} ${colours}`;
        }).join(' = ');
        const shared = group.sharedCells?.length
          ? ` (I-cell ${core.cellGroupName(group.sharedCells)} excluded from colour graph)`
          : '';
        return `${group.label}[T${group.linkType ?? 0}] ${sides}${shared}`;
      }).join(' ; ') || 'none';
    }

    function multiColoringEdgesText(record) {
      return (record.edges || [])
        .filter(edge => edge.kind === 'weak-inference')
        .map(edge => {
          const pair = edge.pairs?.[0];
          if (!pair) return `${edge.left.label} - ${edge.right.label}`;
          return `${edge.left.label}:${core.cellGroupName([pair.leftCell])}`
            + ` - ${edge.right.label}:${core.cellGroupName([pair.rightCell])}`;
        })
        .join(' ; ') || 'none';
    }

    function multiColoringBoundNodesText(record) {
      return (record.linkColours || []).map(link => {
        const endpoints = (link.endpoints || []).map(endpoint =>
          `${core.cellGroupName([endpoint.cell])} ${multiColoringInnerText(endpoint.colors || endpoint.innerColor, endpoint.colourTokens)}`,
        ).join(' / ');
        return `${link.label}[${core.cellGroupName(link.cells)} ${(
          link.pairColours || []
        ).join(' | ')}] ${endpoints}`;
      }).join(' ; ') || 'none';
    }

    function multiColoringChecksText(record) {
      return (record.colourChecks || []).map(check =>
        `${check.colours.join(' & ')} @ ${core.cellGroupName([check.left.cell, check.right.cell])}`,
      ).join(' ; ') || 'none';
    }

    function multiColoringTopText(record) {
      return (record.topColourCells || []).map((cells, color) =>
        `${color === 0 ? 'A' : 'B'}[${core.cellGroupName(cells)}]`,
      ).join(' ; ') || 'none';
    }

    function multiColoringRuleText(record) {
      const rules = new Set(record.rules || []);
      if (rules.has('cycle-return-truth')) {
        return 'a shared candidate returned with opposite parity and is true; its cell and peers are reduced';
      }
      if (rules.has('sector-cleared-contradiction')) {
        return 'one parity directly clears every viable same-digit placement in a sector; that parity is false';
      }
      if (rules.has('als-dof-colour-contradiction')) {
        return 'one colour removes too many digits from an ALS-DOF set; that parity is false';
      }
      if (rules.has('ahs-dof-colour-contradiction')) {
        return 'one colour removes too many cells from an AHS-DOF set; that parity is false';
      }
      if (rules.has('cell-same-parity-contradiction')) {
        return 'one cell carries different digits in the same colour parity; that parity is false';
      }
      if (rules.has('sector-peer-union-contradiction')) {
        return 'one parity same-digit peer union covers every viable cell in a sector; that parity is false';
      }
      if (rules.has('sector-same-parity')) {
        if ((record.invalidColors || []).length > 1) {
          return 'both parities repeat in a sector; the component is contradictory and no parity is asserted';
        }
        return 'a sector contains the same digit parity twice; the opposite parity is true';
      }
      if (rules.has('both-parities-peer')) {
        const closure = record.terminalClosure?.cells?.length
          ? `; terminal closure at ${core.cellGroupName(record.terminalClosure.cells)}`
          : '';
        return `the candidate sees both logical parities and the strong/weak network proves it false${closure}`;
      }
      if (rules.has('ring-inner-colour-bound')) {
        return 'a cell seeing a ring-bound colour pair for the digit loses the digit';
      }
      if (rules.has('colour-bound-walk')) {
        return 'a cell seeing a colour-bound pair for the digit loses the digit';
      }
      return 'no elimination triggered';
    }

    function multiColoringParityConflictText(record) {
      return (record.parityConflicts || []).map(conflict =>
        `${core.sectorGroupName([conflict.sector])} parity ${conflict.parity === 0 ? 'A' : 'B'} `
        + `(${core.cellGroupName(conflict.cells)})`,
      ).join(' ; ') || 'none';
    }

    function multiColoringParityStateText(record) {
      const invalid = record.invalidColors || [];
      if (invalid.length > 1) return 'both parities invalid; no true branch';
      if (invalid.length === 1) return `parity ${invalid[0] === 0 ? 'A' : 'B'} invalid; parity ${invalid[0] === 0 ? 'B' : 'A'} true`;
      return 'no sector parity conflict';
    }

    function multiColoringCellText(record) {
      return (record.cellColours || []).map(item => {
        const link = (record.linkColours || []).find(entry => entry.id === item.linkId);
        return `${link?.label || '?'}:${core.cellGroupName([item.cell])} `
          + `${multiColoringInnerText(item.colors || item.innerColor, item.colourTokens)}`;
      }).join(', ') || 'none';
    }

    function multiColoringTerminalText(record) {
      return (record.terminalTruth || []).map(item =>
        `${core.cellGroupName([item.cell])} = ${record.digit}`,
      ).join(', ') || 'none';
    }

    function multiColoringFalseLinksText(record) {
      return (record.falseLinks || []).map(item =>
        `link ${item.id} (${core.cellGroupName(item.cells)})`,
      ).join(', ') || 'none';
    }

    function multiColoringEureka(record) {
      const eliminations = core.formatRemovals(record.eliminations || []) || 'none';
      const closure = record.terminalClosure?.cells?.length
        ? ` -> terminal ${core.cellGroupName(record.terminalClosure.cells)}`
        : record.ring ? ' -> ring' : '';
      const digitLabel = Number.isInteger(record.digit)
        ? String(record.digit)
        : (record.digits || []).join('');
      const witnesses = [];
      for (const conflict of record.parityConflicts || []) {
        if (conflict.kind === 'sector-peer-union' || conflict.kind === 'weak-parity') continue;
        const colour = conflict.parity === 0 ? 'A' : 'B';
        witnesses.push(
          `parity ${colour} repeats in ${core.sectorGroupName([conflict.sector])}`
          + ` (${core.cellGroupName(conflict.cells || [])})`,
        );
      }
      if ((record.rules || []).includes('grouped-opposite-parity-visibility')) {
        witnesses.push('grouped side sees opposite parity');
      } else if ((record.rules || []).includes('weak-nand-contradiction')) {
        // Keep older saved records readable while using the precise label for
        // current grouped-link eliminations.
        witnesses.push('weak NAND assumption contradiction');
      }
      for (const conflict of record.alsDofConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `ALS-DOF ${colour} false ${core.cellGroupName(conflict.cells || [])}`
          + ` -${(conflict.colouredDigits || []).join('') || 'none'}`
          + ` leaves ${(conflict.remainingDigits || []).join('') || 'none'}`,
        );
      }
      for (const conflict of record.ahsDofConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `AHS-DOF ${colour} false ${core.cellGroupName(conflict.ahsCells || [])}`
          + ` -cells ${core.cellGroupName(conflict.removedCells || []) || 'none'}`,
        );
      }
      for (const conflict of record.sectorClearedConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `sector cleared ${core.sectorGroupName([conflict.sector])}`
          + ` digit ${conflict.digit} ${colour} false`,
        );
      }
      for (const conflict of record.cellParityConflicts || []) {
        const colour = conflict.color === 0 ? 'A' : 'B';
        witnesses.push(
          `cell ${core.cellGroupName([conflict.cell])} has multiple digits`
          + ` in ${colour} parity (${(conflict.digits || []).join('')})`,
        );
      }
      const witness = witnesses.length ? ` [${witnesses.join(' ; ')}]` : '';
      const linkText = record.tech === 'super-multi-colouring'
        ? superMultiColoringGroupText(record)
        : multiColoringLinkText(record);
      return `Multi-colouring: (${digitLabel || 'graph'}) ${linkText}${closure}${witness} => ${eliminations}.`;
    }

    function renderMultiColoringReport() {
      multiColoringResultsEl.textContent = '';
      if (!multiColoringReport) {
        multiColoringResultsEl.textContent = 'No Multi-colouring search has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${multiColoringReport.length} Multi-colouring result${multiColoringReport.length === 1 ? '' : 's'}.`;
      multiColoringResultsEl.appendChild(summary);
      if (!multiColoringReport.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No Multi-colouring results were found using type-0 strong-link nodes.';
        multiColoringResultsEl.appendChild(empty);
        return;
      }

      const list = document.createElement('ul');
      list.className = 'log';
      for (let index = 0; index < multiColoringReport.length; index++) {
        const record = multiColoringReport[index];
        const safetyFlags = record.safetyFlags || [];
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (safetyFlags.length) button.classList.add('chain-result-flagged');
        if (selectedMultiColoringIndex === index) button.classList.add('selected');
        button.textContent = `${safetyFlags.length ? '[FLAGGED] ' : ''}${multiColoringEureka(record)}`;
        button.title = safetyFlags.length
          ? `Flagged for inspection: ${safetyFlags.join('; ')}`
          : 'Highlight this Multi-colouring result on the grid';
        button.addEventListener('click', () => {
          selectedMultiColoringIndex = index;
          colouringSequenceState.multi.breadth = 1;
          selectedSimpleColoringIndex = null;
          selectedThreeDMedusaIndex = null;
          selectedSuperMultiColoringIndex = null;
          selectedThreeDMedusaMultiIndex = null;
          selectedAlsId = null;
          selectedAhsId = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          selectedChainIndex = null;
          selectedFishKey = null;
          selectedNakedSubsetKey = null;
          selectedHiddenSubsetKey = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderSimpleColoringReport();
          renderThreeDMedusaReport();
          renderMultiColoringReport();
          renderSuperMultiColoringReport();
          renderThreeDMedusaMultiReport();
          setStatus(`Multi-colouring result ${index + 1} selected.`, 'ok');
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      }
      multiColoringResultsEl.appendChild(list);
    }

    function superMultiColoringEureka(record) {
      return multiColoringEureka(record)
        .replace(/^Multi-colouring:/, 'Super Multi-colouring:');
    }

    function renderSuperMultiColoringReport() {
      return;
    }

    function threeDMedusaMultiEureka(record) {
      if (record.source === 'multi') {
        const bivalveTruth = (record.bivalveTruth || [])
          .filter(item => Number.isInteger(item.digit))
          .map(item => `${core.cellGroupName([item.cell])}=${item.digit}`)
          .join(', ');
        const eureka = multiColoringEureka(record)
          .replace(/^Multi-colouring:/, '3D - Medusa {Multi-colouring}:');
        return bivalveTruth
          ? eureka.replace(' => ', ` [bivalve singleton: ${bivalveTruth}] => `)
          : eureka;
      }
      return threeDMedusaEureka(record).replace(/^3D - Medusa \{Simple\}/, '3D - Medusa {Multi-colouring}');
    }

    function renderThreeDMedusaMultiReport() {
      threeDMedusaMultiResultsEl.textContent = '';
      if (!threeDMedusaMultiReport) {
        threeDMedusaMultiResultsEl.textContent = 'No 3D-Medusa {Multi-colouring} search has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = String(threeDMedusaMultiReport.length)
        + ' 3D-Medusa {Multi-colouring} result'
        + (threeDMedusaMultiReport.length === 1 ? '' : 's') + '.';
      threeDMedusaMultiResultsEl.appendChild(summary);
      if (!threeDMedusaMultiReport.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No legal 3D-Medusa Multi-colouring constructions were found.';
        threeDMedusaMultiResultsEl.appendChild(empty);
        return;
      }

      const list = document.createElement('ul');
      list.className = 'log';
      for (let index = 0; index < threeDMedusaMultiReport.length; index++) {
        const record = threeDMedusaMultiReport[index];
        const safetyFlags = record.safetyFlags || [];
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (safetyFlags.length) button.classList.add('chain-result-flagged');
        if (selectedThreeDMedusaMultiIndex === index) button.classList.add('selected');
        button.textContent = (safetyFlags.length ? '[FLAGGED] ' : '')
          + threeDMedusaMultiEureka(record);
        button.title = safetyFlags.length
          ? 'Flagged for inspection: ' + safetyFlags.join('; ')
          : 'Highlight this 3D-Medusa Multi-colouring result on the grid';
        button.addEventListener('click', () => {
          selectedThreeDMedusaMultiIndex = index;
          colouringSequenceState.medusaMulti.breadth = 1;
          selectedSimpleColoringIndex = null;
          selectedThreeDMedusaIndex = null;
          selectedMultiColoringIndex = null;
          selectedAlsId = null;
          selectedAhsId = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          selectedChainIndex = null;
          selectedFishKey = null;
          selectedNakedSubsetKey = null;
          selectedHiddenSubsetKey = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderSimpleColoringReport();
          renderThreeDMedusaReport();
          renderMultiColoringReport();
          renderSuperMultiColoringReport();
          renderThreeDMedusaMultiReport();
          setStatus('3D-Medusa Multi-colouring result ' + (index + 1) + ' selected.', 'ok');
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      }
      threeDMedusaMultiResultsEl.appendChild(list);
    }

    function renderFishReport() {
      fishResultsEl.textContent = '';
      if (!fishReport) return;

      const categories = ['Basic', 'Franken', 'Mutant'];
      const groups = categories.map(category => fishReport.filter(fish => fish.category === category));
      const summary = document.createElement('p');
      summary.textContent = `${fishReport.length} N x (N + K) fish reports.`
        + ` ${categories.map((category, index) => `${category} ${groups[index].length}`).join(', ')}.`;
      fishResultsEl.appendChild(summary);
      const categoriesEl = document.createElement('div');
      categoriesEl.className = 'chain-categories';
      categories.forEach((category, categoryIndex) => {
        const records = groups[categoryIndex];
        const categoryPanel = document.createElement('details');
        categoryPanel.className = 'chain-category';
        categoryPanel.open = selectedFishCategory === category;

        const categorySummary = document.createElement('summary');
        const categoryName = document.createElement('strong');
        categoryName.className = 'chain-category-name';
        categoryName.textContent = category;
        const categoryCount = document.createElement('span');
        categoryCount.className = 'chain-category-count';
        categoryCount.textContent = `${records.length} ${records.length === 1 ? 'fish' : 'fish'}`;
        categorySummary.appendChild(categoryName);
        categorySummary.appendChild(categoryCount);
        categoryPanel.appendChild(categorySummary);

        if (!records.length) {
          categoriesEl.appendChild(categoryPanel);
          return;
        }

        const sizes = [...new Set(records.map(fish => fish.size))].sort((a, b) => a - b);
        const sizePanels = document.createElement('div');
        sizePanels.className = 'chain-subcategories';
        for (const size of sizes) {
          const sizeRecords = records.filter(fish => fish.size === size);
          const sizePanel = document.createElement('details');
          sizePanel.className = 'chain-subcategory';
          sizePanel.open = selectedFishCategory === category && selectedFishSize === size;

          const sizeSummary = document.createElement('summary');
          const sizeName = document.createElement('strong');
          sizeName.textContent = `Size ${size}`;
          const sizeCount = document.createElement('span');
          sizeCount.className = 'chain-category-count';
          sizeCount.textContent = `${sizeRecords.length} ${sizeRecords.length === 1 ? 'fish' : 'fish'}`;
          sizeSummary.appendChild(sizeName);
          sizeSummary.appendChild(sizeCount);
          sizePanel.appendChild(sizeSummary);

          const list = document.createElement('ul');
          list.className = 'chain-list';
          const visible = sizeRecords.slice(0, 200);
          for (const fish of visible) {
            const index = records.indexOf(fish);
            const item = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'chain-result';
            const key = `${category}:${index}`;
            if (selectedFishKey === key) button.classList.add('selected');
            const removals = fish.cells.map(cell => ({ cell, digit: fish.digit }));
            button.textContent = `${fish.name}: (${fish.digit}) `
              + `${core.sectorGroupName(fish.baseSectors)} / `
              + `${core.sectorGroupName(fish.coverSectors)} => `
              + `${core.formatRemovals(removals)}`;
        const select = () => selectFishReport(category, index);
        button.addEventListener('click', select);
        item.appendChild(button);
        list.appendChild(item);
          }
          if (sizeRecords.length > visible.length) {
            const more = document.createElement('li');
            more.textContent = `Showing ${visible.length} of ${sizeRecords.length} ${category} records.`;
            list.appendChild(more);
          }
          sizePanel.appendChild(list);
          sizePanels.appendChild(sizePanel);
        }
        categoryPanel.appendChild(sizePanels);
        categoriesEl.appendChild(categoryPanel);
      });
      fishResultsEl.appendChild(categoriesEl);
    }

    function fishStepFromReport(fish) {
      const removals = fish.cells.map(cell => ({ cell, digit: fish.digit }));
      return {
        tech: 'fish',
        name: fish.name,
        category: fish.category,
        size: fish.size,
        k: fish.k,
        desc: `${fish.name}: (${fish.digit}) ${core.sectorGroupName(fish.baseSectors)} / `
          + `${core.sectorGroupName(fish.coverSectors)} => ${core.formatRemovals(removals)}`,
        elim: { items: removals },
        digits: [fish.digit],
        baseSectors: fish.baseSectors,
        coverSectors: fish.coverSectors,
        fishCells: fish.fishCells || [],
        baseIntersections: fish.baseIntersections || [],
        peersOfBaseIntersection: fish.peersOfBaseIntersection || [],
        vertices: fish.vertices || [],
        fins: fish.triggerCells || [],
        endofins: fish.endoFins || [],
        overcovered: fish.overcovered || [],
        triCovered: fish.triCovered || [],
      };
    }

    function selectFishReport(category, index) {
      const selected = fishReport?.filter(fish => fish.category === category) || [];
      const fish = selected[index];
      if (!fish) return;
      selectedFishCategory = category;
      selectedFishSize = fish.size;
      selectedFishKey = `${category}:${index}`;
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedBoxLineIndex = null;
      activeStep = fishStepFromReport(fish);
      lastRemoved = activeStep.elim.items;
      renderBoard();
      renderFishReport();
      setStatus(`Fish ${index + 1} selected.`, 'ok');
      focusMap();
    }

    function renderBoxLineReport() {
      boxLineResultsEl.textContent = '';
      if (!boxLineReport) return;
      const summary = document.createElement('p');
      summary.textContent = `${boxLineReport.length} Box Line Reduction reports.`;
      boxLineResultsEl.appendChild(summary);
      const list = document.createElement('ul');
      list.className = 'chain-list';
      boxLineReport.forEach((step, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedBoxLineIndex === index) button.classList.add('selected');
        button.textContent = `${index + 1}. ${step.desc}`;
        button.addEventListener('click', () => selectBoxLineReport(index));
        item.appendChild(button);
        list.appendChild(item);
      });
      boxLineResultsEl.appendChild(list);
    }

    function selectBoxLineReport(index) {
      if (!boxLineReport?.[index]) return;
      selectedBoxLineIndex = index;
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedFishKey = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      activeStep = boxLineReport[index];
      lastRemoved = activeStep.elim?.items || [];
      renderBoard();
      renderBoxLineReport();
      setStatus(`Box Line Reduction ${index + 1} selected.`, 'ok');
      focusMap();
    }

    function subsetSizeName(size) {
      return ['Single', 'Pair', 'Triple', 'Quad', 'Quintuple', 'Sextuple', 'Septuple', 'Octuple', 'Nontuple'][size - 1]
        || `${size}-set`;
    }

    function renderGenericSubsetReport(kind) {
      const hidden = kind === 'hidden';
      const resultsEl = hidden ? hiddenSubsetResultsEl : nakedSubsetResultsEl;
      const report = hidden ? hiddenSubsetReport : nakedSubsetReport;
      resultsEl.textContent = '';
      if (!report) return;

      const summary = document.createElement('p');
      summary.textContent = `${report.length} ${hidden ? 'hidden' : 'naked'} subset reports.`;
      resultsEl.appendChild(summary);
      const groups = new Map();
      for (const item of report) {
        const bucket = groups.get(item.size) || [];
        bucket.push(item);
        groups.set(item.size, bucket);
      }
      const selected = hidden ? selectedHiddenSubsetSize : selectedNakedSubsetSize;

      const sizeGroups = document.createElement('div');
      sizeGroups.className = 'chain-categories';
      for (const [size, records] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
        const sizePanel = document.createElement('details');
        sizePanel.className = 'chain-category';
        sizePanel.open = selected === size;

        const sizeSummary = document.createElement('summary');
        const sizeName = document.createElement('strong');
        sizeName.className = 'chain-category-name';
        sizeName.textContent = `Size ${size} - ${subsetSizeName(size)}`;
        const sizeCount = document.createElement('span');
        sizeCount.className = 'chain-category-count';
        sizeCount.textContent = `${records.length} ${records.length === 1 ? 'subset' : 'subsets'}`;
        sizeSummary.appendChild(sizeName);
        sizeSummary.appendChild(sizeCount);
        sizePanel.appendChild(sizeSummary);

        const list = document.createElement('ul');
        list.className = 'chain-list';
        const visible = records.slice(0, 200);
        for (const item of visible) {
          const label = `${item.locked ? 'Locked ' : ''}${hidden ? 'Hidden' : 'Naked'} ${subsetSizeName(item.size)}`;
          const entry = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          const index = records.indexOf(item);
          const key = `${size}:${index}`;
          const selectedKey = hidden ? selectedHiddenSubsetKey : selectedNakedSubsetKey;
          if (selectedKey === key) button.classList.add('selected');
          button.textContent = `${label}: (${item.digits.join('')}) `
            + `${core.cellGroupName(item.cells)} in ${core.sectorGroupName([item.sector])} => `
            + `${core.formatRemovals(item.removals)}`;
          const select = () => selectSubsetReport(kind, index, size);
          button.addEventListener('click', select);
          entry.appendChild(button);
          list.appendChild(entry);
        }
        if (records.length > visible.length) {
          const more = document.createElement('li');
          more.textContent = `Showing ${visible.length} of ${records.length} ${subsetSizeName(size)} records.`;
          list.appendChild(more);
        }
        sizePanel.appendChild(list);
        sizeGroups.appendChild(sizePanel);
      }
      resultsEl.appendChild(sizeGroups);
    }

    function subsetStepFromReport(kind, item) {
      const names = ['single', 'pair', 'triple', 'quad', 'quintuple', 'sextuple', 'septuple', 'octuple', 'nontuple'];
      const sectorType = item.sector < 9
        ? 'row'
        : item.sector < 18
          ? 'col'
          : item.sector < 27
            ? 'box'
            : (() => {
              const name = core.variantUnitName(item.sector);
              return name === 'D1'
                ? 'diagonal'
                : name === 'AD1'
                  ? 'anti-diagonal'
                  : 'variant-sector';
            })();
      const sectorIndex = item.sector < 9
        ? item.sector
        : item.sector < 18
          ? item.sector - 9
          : item.sector < 27
            ? item.sector - 18
            : item.sector;
      const removals = item.removals.map(removal => ({ ...removal }));
      const label = `${item.locked ? 'Locked ' : ''}${kind === 'hidden' ? 'Hidden' : 'Naked'} ${subsetSizeName(item.size)}`;
      return {
        tech: `${kind}-${names[item.size - 1] || `${item.size}-set`}`,
        desc: `${label}: (${item.digits.join('')}) ${core.cellGroupName(item.cells)} `
          + `in ${core.sectorGroupName([item.sector])} => ${core.formatRemovals(removals)}`,
        elim: { items: removals },
        digits: item.digits,
        at: item.cells,
        base: { type: sectorType, indices: [sectorIndex] },
        vertices: item.cells,
        genericSubset: item,
      };
    }

    function selectSubsetReport(kind, index, sizeOverride = null) {
      const hidden = kind === 'hidden';
      const report = hidden ? hiddenSubsetReport : nakedSubsetReport;
      const size = sizeOverride ?? (hidden ? selectedHiddenSubsetSize : selectedNakedSubsetSize);
      const item = report?.filter(record => record.size === size)?.[index];
      if (!item) return;
      if (hidden) selectedHiddenSubsetSize = size;
      else selectedNakedSubsetSize = size;
      const key = `${size}:${index}`;
      if (hidden) selectedHiddenSubsetKey = key;
      else selectedNakedSubsetKey = key;
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedBoxLineIndex = null;
      activeStep = subsetStepFromReport(kind, item);
      lastRemoved = activeStep.elim.items;
      renderBoard();
      renderGenericSubsetReport(kind);
      setStatus(`${kind === 'hidden' ? 'Hidden' : 'Naked'} subset ${index + 1} selected.`, 'ok');
      focusMap();
    }

    function renderNakedSubsetReport() {
      renderGenericSubsetReport('naked');
    }

    function renderHiddenSubsetReport() {
      renderGenericSubsetReport('hidden');
    }

    function chainText(chain, verbose = false) {
      if (chain?.alcXz && core.formatAlcXz) {
        return core.formatAlcXz(chain);
      }
      if (chain.ahsXy) {
        return core.formatChainEureka(chain);
      }
      let displayChain = displayChainForUi(chain);
      const bivalentInfo = alsSizeOneChainInfo(displayChain);
      const barnsInfo = barnsChainInfo(displayChain);
      const barnsTransportInfo = barnsTransportChainInfo(displayChain);
      if (barnsInfo) {
        displayChain = {
          ...displayChain,
          structureName: `${barnsInfo.sizeName} ${barnsInfo.form}`,
        };
      } else if (barnsTransportInfo) {
        displayChain = {
          ...displayChain,
          structureName: `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
        };
      }
      const text = verbose && core.formatChainVerbose
        ? core.formatChainVerbose(displayChain)
        : core.formatChainEureka
          ? core.formatChainEureka(displayChain)
          : core.formatChain(displayChain);
      // Preserve the structural AIC + ALS identity in the proof text. The
      // folder renderer supplies the more specific ALS alias only where that
      // proof is being grouped in the hierarchy.
      return text;
    }

    function openXWingSubclass(chain) {
      if (chain?.isRing) return null;
      const steps = chain?.steps || [];
      if (steps.length !== 2 || steps.some(step => step.family !== 'SL')) return null;
      if (steps.some(step => step.linkType !== 0 && step.linkType !== 1)) return null;
      if (!steps.some(step => step.linkType === 0)
        || !steps.some(step => step.linkType === 1)) return null;

      const digits = new Set(steps.flatMap(step => [
        ...(step.entry?.digits || []),
        ...(step.exit?.digits || []),
        ...(step.weakDigit == null ? [] : [step.weakDigit]),
      ]));
      if (digits.size !== 1) return null;

      const kinds = steps.map(step => {
        const sectors = step.originSectors || [];
        return new Set(sectors.map(sector => sector < 9 ? 'R' : sector < 18 ? 'C' : 'B'));
      });
      const kind = ['R', 'C'].find(value => kinds.every(set => set.has(value)));
      if (!kind) return null;
      const linePosition = cell => kind === 'R' ? cell % 9 : Math.floor(cell / 9);
      const bilocal = steps.find(step => step.linkType === 0);
      const grouped = steps.find(step => step.linkType === 1);
      const basePositions = [...new Set([
        ...(bilocal.entry?.cells || []),
        ...(bilocal.exit?.cells || []),
      ].map(linePosition))].sort((a, b) => a - b);
      const groupedPositions = [...new Set([
        ...(grouped.entry?.cells || []),
        ...(grouped.exit?.cells || []),
      ].map(linePosition))].sort((a, b) => a - b);
      if (basePositions.length !== 2) return null;
      const aligned = basePositions.filter(position => groupedPositions.includes(position));
      if (aligned.length === 1) return 'Sashimi X-Wing';
      if (aligned.length === 2 && groupedPositions.length > 2) return 'Finned X-Wing';
      return null;
    }

    function displayChainForUi(chain) {
      const structureName = normalizedChainStructureName(chain);
      let displayChain = structureName === chain?.structureName
        ? chain
        : { ...chain, structureName };
      if (/^(?:X-Chain|AIC)$/i.test(structureName)) {
        const subclass = openXWingSubclass(chain);
        if (subclass) displayChain = { ...displayChain, structureName: subclass };
      }

      return displayChain;
    }

    function folderChainText(chain, folder) {
      // A proof can legitimately belong to more than one structural class.
      // Keep the proof itself shared, but use the name of the folder in which
      // it is being rendered instead of letting chainText() globally choose
      // the B.A.R.N.S. alias for every location.
      if (folder?.displayName) return folder.displayName;
      return chainText(chain);
    }
    function chainFolderInfo(chain) {
      if (chain.structureFamily && chain.structureWing && chain.structureRank) {
        return {
          family: chain.structureFamily,
          wing: chain.structureWing,
          rank: chain.structureRank,
          subclass: chain.structureSubclass || chain.structureName || null,
        };
      }

      const name = String(chain.structureName || (chain.isRing ? 'Ring' : 'AIC'));
      if (/^T\s*-\s*ALS\s*-\s*(?:XZ|XY)(?:\s+Ring)?$/i.test(name)) {
        const suffix = /XY$/i.test(name) ? 'XY' : 'XZ';
        return {
          family: 'Transport',
          wing: `ALS-${suffix}`,
          rank: chain.isRing ? 'Ring' : 'Wing',
          subclass: `T-ALS-${suffix}`,
        };
      }
      const aicAlsMatch = name.match(/^AIC\s*\+\s*ALS\s*-\s*(.+)$/i);
      if (aicAlsMatch) {
        return {
          family: 'AIC + ALS',
          wing: aicAlsMatch[1].trim(),
          rank: null,
          subclass: null,
        };
      }
      // Ordinary AIC names carry L(n)/M(n)/H(n); named ALS/AHS/ALC
      // variants intentionally omit the numeric designator.
      const match = name.match(/^(.*?)(L|M|H)(?:\((\d+)\))?\s*-\s*(.+)$/i);
      if (!match) return { family: name, wing: null, rank: null, subclass: null };

      const prefix = match[1].trim().replace(/\s*-\s*$/, '');
      const rankType = match[2].toUpperCase();
      const rank = match[3] ? `(${match[3]})` : '';
      const label = match[4].trim();
      const kind = /ring/i.test(label) || chain.isRing ? 'Ring' : 'Wing';
      const designator = prefix ? `${prefix} ${rankType}` : null;
      const structuralSubclass = label.toLowerCase() === kind.toLowerCase() ? null : label;
      const subclass = designator
        ? structuralSubclass ? `${designator} - ${structuralSubclass}` : designator
        : structuralSubclass;
      return {
        family: rankType === 'M'
          ? 'M - Wing | Ring'
          : rankType === 'H'
            ? 'Hybrid - Wing | Ring'
            : 'Local - Wing | Ring',
        wing: kind,
        rank: `${rankType}${rank}`,
        subclass,
      };
    }

    function chainEriCount(chain) {
      const steps = chain.steps || [];
      if (!steps.length) return 0;

      const allDigits = new Set();
      let count = 0;
      let allStepsAreEri = true;

      for (const step of steps) {
        const names = Array.isArray(step.linkTypeNames)
          ? step.linkTypeNames
          : [step.linkTypeName];
        const chainDigits = [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ].filter(Number.isInteger);
        for (const digit of chainDigits) {
          if (Number.isInteger(digit)) allDigits.add(digit);
        }
        const isEri = step.linkType === core.ERI
          || names.some(name => String(name || '').toUpperCase() === 'ERI');
        if (!isEri) {
          allStepsAreEri = false;
          continue;
        }
        if (!chainDigits.length) return 0;
        count += 1;
      }

      return allStepsAreEri && count > 0 && allDigits.size === 1 ? count : 0;
    }

    function isEriOnlyXChain(chain) {
      const steps = chain?.steps || [];
      if (!steps.length) return false;

      const digits = new Set();
      for (const step of steps) {
        for (const digit of [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
          step.weakFromDigit,
          step.weakToDigit,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
      }
      if (digits.size !== 1) return false;

      return steps.every(step => {
        const names = [
          step.linkTypeName,
          ...(Array.isArray(step.linkTypeNames) ? step.linkTypeNames : []),
        ].map(name => String(name || '').toUpperCase());
        return step.family === 'SL'
          && (step.linkType === core.ERI || names.includes('ERI'));
      });
    }

    function xChainType(chain, eriCount) {
      const rawName = String(chain.structureName || '');
      // The core walker keeps generic X-chain names on the record. Resolve
      // the short named subclass here as well as in the display formatter so
      // folder membership does not depend on which rendering path ran first.
      const subclass = /^(?:X-Chain|AIC)$/i.test(rawName)
        ? openXWingSubclass(chain)
        : null;
      const name = String(subclass || rawName)
        .replace(/^\s*(?:(?:AIC\s*\+\s*)?ALS|AHS)\s*-\s*/i, '');
      // X-Wing is filed under the structural Ring folder, but it is not an X-Ring.
      if (/^X-Wing$/i.test(name)) return 'X-Wing';
      if (/^(?:L\(1\)-(?:Wing|Ring)|L1-(?:Wing|Ring)|Dual Empty Rectangle|Rec'T Kite|Bridged ERI|Bridged Empty Rectangle)$/i.test(name)) {
        return 'L(1)';
      }
      if (/^\d+x ERI$/i.test(name) || (eriCount > 0 && isEriOnlyXChain(chain))) {
        return 'ERI Chain';
      }
      if (emptyRectangleChain(chain)) {
        return 'Empty Rectangle';
      }
      if (/^(?:Finned|Sashimi) X-Wing$/i.test(name)) return name;
      if (/^(?:2-String Kite|Skyscraper|X-Wing)$/i.test(name)) return name;
      return null;
    }

    function emptyRectangleChain(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 2) return false;
      const digits = new Set();
      let eriCount = 0;
      for (const step of steps) {
        for (const digit of [
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
          step.weakDigit,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
        const names = [step.linkTypeName, ...(step.linkTypeNames || [])]
          .map(name => String(name || '').toUpperCase());
        if (step.linkType === core.ERI || names.includes('ERI')) eriCount += 1;
      }
      return digits.size === 1 && eriCount === 1;
    }

    function chainNameWithoutAffix(chain) {
      return String(chain.structureName || '')
        .replace(/^\s*(?:(?:AIC\s*\+\s*)?(?:ALS|AHS)|ALC)\s*-\s*/i, '');
    }

    function wChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      if (/^W-Wing$/i.test(name)) return 'Wing';
      if (/^W-Ring$/i.test(name)) return 'Ring';
      if (/^(?:T\s*-\s*)?Transport$/i.test(name)) return 'Transport';

      return null;
    }

    function splitChainType(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 3) return null;
      const isStrong = step => step.family === 'SL'
        && step.linkType !== 4
        && String(step.linkTypeName || '').toUpperCase() !== 'ALS';
      return isStrong(steps[0])
        && ['ALS', 'AHS'].includes(steps[1].family)
        && ['ALS_RCC', 'AHS_RCC'].includes(String(steps[1].linkTypeName || '').toUpperCase())
        && isStrong(steps[2])
        ? 'Wing'
        : null;
    }

    function strongChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      const match = name.match(/^Strong[- ](Wing|Ring)$/i);
      return match ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null;
    }

    function inversionChainType(chain) {
      const name = chainNameWithoutAffix(chain);
      return /^i[SWMLH](?:\d+)?-(?:Wing|Ring)$/i.test(name) ? name : null;
    }

    function alsChainNodes(chain) {
      const steps = chain.steps || [];
      const isAlsRcc = step => step.family === 'ALS'
        && (
          String(step.linkTypeName || '').toUpperCase() === 'ALS_RCC'
          || chainModuleSubsets(step.module).length === 2
        );
      const isBivalentAls = step => step.family === 'SL'
        && Number(step.linkType) === 4
        && step.entry?.cells?.length === 1
        && step.exit?.cells?.length === 1
        && step.entry.cellKey === step.exit.cellKey;
      const isGroupedAls = step => {
        if (!['SL', 'ALS'].includes(step.family)) return false;
        if (step.family === 'SL' && Number(step.linkType) !== 4) return false;
        const cells = new Set([
          ...(step.entry?.cells || []),
          ...(step.exit?.cells || []),
        ]);
        const digits = new Set([
          ...(step.entry?.digits || []),
          ...(step.exit?.digits || []),
        ]);
        return cells.size > 1 && digits.size === cells.size + 1;
      };
      if (!steps.length || !steps.every(step =>
        isAlsRcc(step) || isBivalentAls(step) || isGroupedAls(step)
      )) return null;

      // One ALS_RCC record joins two ALS modules. Count the unique modules,
      // rather than the graph records, so XZ/XY classifications use the
      // actual ALS node count.
      const nodes = [];
      const seen = new Set();
      for (const step of steps) {
        if (isBivalentAls(step) || isGroupedAls(step)) {
          const cells = [...new Set([
            ...(step.entry.cells || []),
            ...(step.exit.cells || []),
          ])].sort((a, b) => a - b);
          const digits = [...new Set([
            ...(step.entry.digits || []),
            ...(step.exit.digits || []),
          ])].sort((a, b) => a - b);
          const key = `BIVALVE|${cells.join(',')}|${digits.join('')}`;
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push({ id: key, cells, digits });
          }
          continue;
        }
        const module = step.module;
        for (const subset of chainModuleSubsets(module)) {
          if (!subset) return null;
          const key = [
            subset.id ?? '',
            subset.cells.join(','),
            subset.digits.join(''),
          ].join('|');
          if (!seen.has(key)) {
            seen.add(key);
            nodes.push(subset);
          }
        }
      }
      return nodes.length ? nodes : null;
    }

    function alsOnlyChainInfo(chain) {
      const nodes = alsChainNodes(chain);
      if (!nodes || nodes.length < 2) return null;

      const nodeCount = nodes.length;
      if (nodeCount === 2) {
        return {
          category: 'ALS - XZ rule',
          subcategory: chain.isRing
            ? '(2) RCC Rule - Double Linked Rule'
            : '(1) RCC Rule',
          subclass: null,
        };
      }
      if (nodeCount === 3) {
        return {
          category: 'ALS - XY rule',
          subcategory: chain.isRing
            ? '(3) RCC Rule - Triple Link Rule'
            : '(2) RCC Rule',
          subclass: null,
        };
      }

      return {
        category: 'ALS - Chain',
        subcategory: chain.isRing
          ? 'N ALS / N RCC Rule'
          : 'N ALS / N - 1 RCC Rule',
        subclass: chain.isRing ? 'Ring' : null,
      };
    }

    function alsNamedChainInfo(chain) {
      const match = String(chain.structureName || '').match(/^ALS\s*-\s*(XZ|XY|Chain)$/i);
      if (!match) return null;

      const name = match[1].toUpperCase();
      if (name === 'XZ') {
        return {
          category: 'ALS - XZ rule',
          subcategory: chain.isRing
            ? '(2) RCC Rule - Double Linked Rule'
            : '(1) RCC Rule',
          subclass: null,
        };
      }
      if (name === 'XY') {
        return {
          category: 'ALS - XY rule',
          subcategory: chain.isRing
            ? '(3) RCC Rule - Triple Link Rule'
            : '(2) RCC Rule',
          subclass: null,
        };
      }
      return {
        category: 'ALS - Chain',
        subcategory: chain.isRing
          ? 'N ALS / N RCC Rule'
          : 'N ALS / N - 1 RCC Rule',
        subclass: chain.isRing ? 'Ring' : null,
      };
    }

    function ahsXzChainInfo(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 1) return null;
      const step = steps[0];
      if (step.family !== 'AHS'
        || String(step.linkTypeName || '').toUpperCase() !== 'AHS_RCC') {
        return null;
      }

      const moduleKind = String(step.module?.moduleKind || '').toUpperCase();
      if (!['AHS_XZ', 'AHS_XZ_RING'].includes(moduleKind)) return null;

      const doubleRcc = moduleKind === 'AHS_XZ_RING'
        || (step.module?.ringRccCells || []).length === 2;
      return {
        category: 'AHS - XZ rule',
        subcategory: doubleRcc
          ? '{2} RCC Rule - Double Linked Rule'
          : '(1) RCC Rule',
        subclass: doubleRcc ? '2 RCC' : null,
      };
    }

    function barnsSizeName(size) {
      if (!Number.isInteger(size) || size < 1 || size > 26) return null;
      return 'abcdefghijklmnopqrstuvwxyz'.slice(-size);
    }

    function barnsChainInfo(chain) {
      // B.A.R.N.S. size is defined from two actual ALS nodes and their RCC.
      // A four-node type-4 XY chain is not a WXYZ B.A.R.N.S. construction.
      const nodes = alsChainNodes(chain);
      if (!nodes || nodes.length !== 2) return null;

      const cells = new Set(nodes.flatMap(node => node.cells));
      const digits = new Set(nodes.flatMap(node => node.digits));
      // The RCC is part of the B.A.R.N.S. digit inventory even though the
      // compact node sides print it on the other side of the equals sign.
      for (const step of chain.steps || []) {
        const module = step.module;
        for (const digit of [
          module?.common?.digit,
          ...(module?.common?.digits || []),
          module?.displayLeftRcc,
          module?.displayRightRcc,
        ]) {
          if (Number.isInteger(digit)) digits.add(digit);
        }
      }
      if (cells.size !== digits.size) return null;

      const sizeName = barnsSizeName(cells.size);
      if (!sizeName) return null;

      return {
        form: chain.isRing ? 'Ring' : 'Wing',
        sizeName,
      };
    }

    function barnsTransportChainInfo(chain) {
      const steps = chain.steps || [];
      if (steps.length !== 2) return null;

      const alsSteps = steps.filter(step =>
        step.family === 'ALS'
        && String(step.linkTypeName || '').toUpperCase() === 'ALS_RCC'
      );
      const strongSteps = steps.filter(step =>
        step.family === 'SL'
        && String(step.linkTypeName || '').toUpperCase() !== 'ALS'
      );
      if (alsSteps.length !== 1 || strongSteps.length !== 1) return null;

      const module = alsSteps[0].module;
      const subsets = chainModuleSubsets(module);
      if (!subsets.every(subset => subset?.cells?.length && subset?.digits?.length)) {
        return null;
      }

      const cells = new Set(subsets.flatMap(subset => subset.cells));
      const digits = new Set(subsets.flatMap(subset => subset.digits));
      if (cells.size !== digits.size) return null;

      const sizeName = barnsSizeName(cells.size);
      if (!sizeName) return null;

      return {
        form: chain.isRing ? 'Ring' : 'Wing',
        sizeName,
      };
    }

    function alsSizeOneChainInfo(chain) {
      const steps = chain.steps || [];
      if (!steps.length) return null;

      // XY-Chains and Remote Pairs are built only from type-4 bivalent
      // strong links. ALS_RCC or any other node family belongs to AIC/ALS
      // classification and must never be folded into this helper.
      if (!steps.every(step =>
        step.family === 'SL' && Number(step.linkType) === 4
      )) return null;

      // A bivalent XY structure uses type-4 cell ALS links instead of
      // ALS_RCC modules. Build the same one-cell node view for both forms so
      // XY-Wing/XY-Chain classification does not discard pure bivalent paths.
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
        const module = step.module;
        for (const subset of chainModuleSubsets(module)) {
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
      // Remote Pair is exclusively a type-4 bivalent strong-link chain.
      // ALS_RCC sides can be single cells too, but they are not Remote Pair
      // nodes and must never inherit this classification.
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
      // A Hidden XY-Chain must contain more than one digit. A repeated
      // single-digit bilocal chain remains an ordinary X-Chain.
      if (uniqueDigits.size < 2) return null;
      const alternates = uniqueDigits.size === 2
        && linkDigits.every((digit, index) => index === 0 || digit !== linkDigits[index - 1])
        && (!chain.isRing || linkDigits[0] !== linkDigits[linkDigits.length - 1]);

      return {
        remotePair: alternates,
        form: chain.isRing ? 'Ring' : 'Wing',
      };
    }

    function chainFolderInfos(chain) {
      const eriCount = chainEriCount(chain);
      const primary = chainFolderInfo(chain);
      const locations = [];
      const barnsInfo = barnsChainInfo(chain);
      const barnsTransportInfo = barnsTransportChainInfo(chain);
      const hiddenXyInfo = hiddenXyChainInfo(chain);
      const alsInfo = alsOnlyChainInfo(chain) || alsNamedChainInfo(chain);
      const namedAlsWing = String(chain.structureName || '').match(
        /^(?:AIC\s*\+\s*)?ALS\s*-\s*([LMH])(?:\(\d+\))?\s*-\s*(Wing|Ring)$/i,
      );

      // Keep the existing structural folder. ERI chains can also belong to
      // Local/M/Hybrid folders, so the same chain may have more than one UI location.
      const genericXFamily = /^X\s*-\s*Chains?$/i.test(String(primary.family || ''))
        || /^X\s*Chains?$/i.test(String(primary.family || ''));
      if (!genericXFamily
        && !/^ALS$/i.test(String(primary.family || ''))
        && !namedAlsWing
        && !/^Local(?: -)? Wing \| Ring$/i.test(String(primary.family || ''))
        && primary.family !== 'ERI - Chain'
        && ((primary.family === 'AIC + ALS' && primary.wing) || (primary.wing && primary.rank))) {
        locations.push(primary);
      }

      const localRank = String(primary.rank || '').match(/^L(?:\((\d+)\)|(\d+))$/i);
      if (/^Local(?: -)? Wing \| Ring$/i.test(String(primary.family || ''))
        && localRank
        && Number(localRank[1] || localRank[2]) >= 2) {
        locations.push({
          family: 'Hidden XY-Chain',
          wing: 'Local Wing | Ring',
          rank: primary.rank,
          subclass: null,
        });
      }

      // Named ALS wings/rings are A.I.C. subclasses. Keep the structural
      // proof shared, but place the named view in the A.I.C. hierarchy.
      if (namedAlsWing) {
        const rankType = namedAlsWing[1].toUpperCase();
        const form = namedAlsWing[2][0].toUpperCase() + namedAlsWing[2].slice(1).toLowerCase();
        const namedForm = `${rankType}-Wing/Ring`;
        locations.push({
          family: 'A.I.C',
          wing: namedForm,
          rank: null,
          subclass: `ALS - ${namedForm}`,
          displayName: `ALS - ${namedForm}`,
        });
      }

      // A B.A.R.N.S. chain owns its own folder. Do not also duplicate it
      // under the generic Almost Locked Sets / ALS-XZ branch.
      if (alsInfo && !barnsInfo) {
        locations.push({
          family: 'Almost Locked Sets',
          wing: alsInfo.category,
          rank: alsInfo.subcategory,
          subclass: alsInfo.subclass,
        });
      }

      const ahsInfo = ahsXzChainInfo(chain);
      if (ahsInfo) {
        locations.push({
          family: 'Almost Hidden Sets',
          wing: ahsInfo.category,
          rank: ahsInfo.subcategory,
          subclass: ahsInfo.subclass,
        });
      }

      if (barnsInfo) {
        locations.push({
          family: 'Almost Locked Sets',
          wing: 'ALS - XZ rule',
          rank: null,
          subclass: null,
          path: ['ALS - XZ rule', 'B.A.R.N.S.', barnsInfo.sizeName],
        });
      }
      if (barnsTransportInfo) {
        locations.push({
          family: 'Almost Locked Sets',
          wing: 'ALS - XZ rule',
          rank: null,
          subclass: null,
          displayName: `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
          path: [
            'ALS - XZ rule',
            'B.A.R.N.S.',
            'Transport',
            `T - ${barnsTransportInfo.sizeName} ${barnsTransportInfo.form}`,
          ],
        });
      }

      if (hiddenXyInfo?.remotePair) {
        locations.push({
          family: 'Hidden XY-Chain',
          wing: 'Hidden Remote Pair',
          rank: hiddenXyInfo.form === 'Ring' ? 'Ring' : null,
          subclass: null,
        });
      }

      const xyChainInfo = alsSizeOneChainInfo(chain);
      if (xyChainInfo) {
        const type4Only = (chain.steps || []).length > 0
          && (chain.steps || []).every(step =>
            step.family === 'SL' && Number(step.linkType) === 4
          );
        if (type4Only) {
          const xyBranch = xyChainInfo.remotePair
            ? 'Remote Pair'
            : xyChainInfo.breakdown === 'XY-Wing'
              ? 'XY - Wing'
              : 'Generic';
          locations.push({
            family: 'XY - Chain',
            wing: xyBranch,
            rank: null,
            subclass: null,
            path: [xyBranch, chain.isRing ? 'Ring' : null].filter(Boolean),
          });
        } else if (!xyChainInfo.remotePair) {
          locations.push({
            family: 'Almost Locked Sets',
            wing: 'XY - Chain',
            rank: xyChainInfo.breakdown,
            subclass: xyChainInfo.subclass,
          });
        } else {
          locations.push({
            family: 'Remote Pair',
            wing: chain.isRing ? 'Ring' : 'Wing',
            rank: null,
            subclass: null,
          });
        }
      }

      const xType = xChainType(chain, eriCount);
      if (xType) {
        const isEriFamily = xType === 'Empty Rectangle';
        const name = String(chain.structureName || '')
          .replace(/^\s*(?:ALS|AHS)\s*-\s*/i, '');
        const finnedSashimi = name.match(/^(Finned|Sashimi) X-Wing$/i);
        const eriSubclass = /^(?:Dual Empty Rectangle|Rec'T Kite|Bridged ERI|Bridged Empty Rectangle|3x ERI)$/i.test(name)
          ? name.replace(/^Bridged Empty Rectangle$/i, 'Bridged ERI')
          : null;
        const l1Subclass = /^Dual Empty Rectangle$/i.test(name)
          ? 'Dual Empty Rectangle'
          : /^Rec'T Kite$/i.test(name)
            ? "Rec'T Kite"
            : /^(?:Bridged ERI|Bridged Empty Rectangle)$/i.test(name)
              ? 'Bridged Rectangles'
              : null;
        const shortXChain = /^(?:2-String Kite|Empty Rectangle|Finned X-Wing|Sashimi X-Wing|Skyscraper|X-Wing|ERI Chain|L\(1\))$/i.test(xType);
        const namedPath = xType === 'L(1)'
          ? ['Local Wing | Ring', 'L(1)', chain.isRing ? 'Ring' : null, l1Subclass].filter(Boolean)
          : shortXChain
            ? [xType]
          : [
              shortXChain ? null : 'Single Digit Named Chains',
              xType,
              finnedSashimi
                ? `${finnedSashimi[1][0].toUpperCase()}${finnedSashimi[1].slice(1).toLowerCase()} X-Wing`
                : xType === 'X-Wing' ? null
                  : isEriFamily && eriSubclass
                    ? eriSubclass
                    : null,
            ].filter(Boolean);
        locations.push({
          family: 'X-Chains',
          wing: xType,
          rank: xType === 'L(1)' && l1Subclass
            ? l1Subclass
            : xType === 'ERI Chain'
              ? `ERI(${eriCount})`
              : finnedSashimi
            ? `${finnedSashimi[1][0].toUpperCase()}${finnedSashimi[1].slice(1).toLowerCase()} X-Wing`
            : xType === 'X-Wing' ? null
            : isEriFamily && eriSubclass
              ? eriSubclass
              : null,
          subclass: null,
          path: namedPath,
        });
      } else if (/^(?:X-Chain|AIC)$/i.test(String(chain.structureName || '').trim())) {
        const genericSteps = chain.steps || [];
        const usesOnlyAicTypes = genericSteps.length > 0
          && genericSteps.every(step => Number(step.linkType) >= 1 && Number(step.linkType) <= 4);
        if (chainUniqueDigitCount(chain) > 1 && usesOnlyAicTypes) {
          locations.push({
            family: 'A.I.C',
            wing: null,
            rank: null,
            subclass: null,
            path: [],
          });
        } else if (chainUniqueDigitCount(chain) === 1) {
          locations.push({
            family: 'X-Chains',
            wing: 'Generic',
            rank: null,
            subclass: null,
            path: ['Generic'],
          });
        }
      }

      const wType = wChainType(chain);
      if (wType) {
        locations.push({
          family: 'W - Wing | Ring',
          wing: wType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
      }


      const splitType = splitChainType(chain);
      if (splitType) {
        locations.push({
          family: 'Split - Wing',
          wing: splitType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
      }

      const strongType = strongChainType(chain);
      if (strongType) {
        locations.push({
          family: 'Strong Wing | Ring',
          wing: strongType,
          rank: null,
          subclass: null,
          path: chain.isRing ? ['Ring'] : [],
        });
        locations.push({
          family: 'Hidden XY-Chain',
          wing: 'Strong Wing | Ring',
          rank: strongType,
          subclass: null,
          path: [strongType],
        });
      }

      const inversionType = inversionChainType(chain);
      if (inversionType) {
        locations.push({
          family: 'Inversion',
          wing: inversionType,
          rank: null,
          subclass: null,
        });
      }

      if (!locations.length) locations.push(primary);

      const seen = new Set();
      return locations.filter(location => {
        const key = [location.family, location.wing, location.rank, location.subclass].join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function appendChainList(container, entries) {
      const list = document.createElement('ul');
      list.className = 'chain-list';
      for (const entry of entries) {
        const { chain, index } = entry;
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (index === selectedChainIndex) button.classList.add('selected');
        button.textContent = `${index + 1}. ${entry.displayName || chainText(chain)}`;
        if (core.formatChainVerbose) button.title = chainText(chain, true);
        const select = () => selectChain(index);
        button.addEventListener('click', select);
        item.appendChild(button);
        list.appendChild(item);
      }
      container.appendChild(list);
    }

    function appendChainSubclasses(container, entries) {
      const subclassGroups = new Map();
      for (const entry of entries) {
        const subclass = entry.subclass || '';
        const subclassEntries = subclassGroups.get(subclass) || [];
        subclassEntries.push(entry);
        subclassGroups.set(subclass, subclassEntries);
      }

      if (subclassGroups.size === 1 && subclassGroups.has('')) {
        appendChainList(container, entries);
        return;
      }

      const subclasses = document.createElement('div');
      subclasses.className = 'chain-subcategories';
      for (const [subclass, subclassEntries] of subclassGroups) {
        const subcategory = document.createElement('details');
        subcategory.className = 'chain-subcategory';
        subcategory.open = subclassEntries.some(({ index }) => index === selectedChainIndex);
        const subSummary = document.createElement('summary');
        const subName = document.createElement('strong');
        subName.textContent = subclass || 'General';
        const subCount = document.createElement('span');
        subCount.className = 'chain-category-count';
        subCount.textContent = `${subclassEntries.length} ${subclassEntries.length === 1 ? 'chain' : 'chains'}`;
        subSummary.appendChild(subName);
        subSummary.appendChild(subCount);
        subcategory.appendChild(subSummary);
        appendChainList(subcategory, subclassEntries);
        subclasses.appendChild(subcategory);
      }
      container.appendChild(subclasses);
    }

    function chainFolderPath(folder) {
      if (Array.isArray(folder.path)) return folder.path.filter(Boolean);
      if (/^Transport$/i.test(String(folder.family || ''))) {
        return [folder.wing, folder.rank === 'Ring' ? 'Ring' : null].filter(Boolean);
      }
      if (/^(?:Hybrid|M) - Wing \| Ring$/i.test(String(folder.family || ''))
        && /^[MH]\(\d+\)$/i.test(String(folder.rank || ''))) {
        return [folder.rank, folder.wing === 'Ring' ? 'Ring' : null].filter(Boolean);
      }
      return [folder.wing, folder.rank, folder.subclass].filter(Boolean);
    }

    function appendChainFolderTree(container, entries, depth, selectedFolderKeys) {
      const pathGroups = new Map();
      for (const entry of entries) {
        const label = entry.path[depth] || '';
        const branch = pathGroups.get(label) || [];
        branch.push(entry);
        pathGroups.set(label, branch);
      }

      for (const [label, branchEntries] of pathGroups) {
        if (!label) {
          appendChainList(container, branchEntries);
          continue;
        }

        const panel = document.createElement('details');
        panel.className = 'chain-subcategory';
        panel.open = branchEntries.some(({ folderKey }) => selectedFolderKeys.has(folderKey));
        const summary = document.createElement('summary');
        const name = document.createElement('strong');
        name.textContent = label;
        const count = document.createElement('span');
        count.className = 'chain-category-count';
        count.textContent = `${branchEntries.length} ${branchEntries.length === 1 ? 'chain' : 'chains'}`;
        summary.appendChild(name);
        summary.appendChild(count);
        panel.appendChild(summary);

        const terminal = branchEntries.filter(entry => entry.path.length <= depth + 1);
        if (terminal.length) appendChainList(panel, terminal);

        const deeper = branchEntries.filter(entry => entry.path.length > depth + 1);
        if (deeper.length) {
          const children = document.createElement('div');
          children.className = 'chain-subcategories';
          appendChainFolderTree(children, deeper, depth + 1, selectedFolderKeys);
          panel.appendChild(children);
        }
        container.appendChild(panel);
      }
    }

    function chainSafetyFlags(chain, candidateGrid = cand, expectedSolution = solution, fixedGrid = puzzle) {
      if (!Array.isArray(expectedSolution) || expectedSolution.length !== 81) return [];

      const remaining = candidateGrid.map(values => new Set(values || []));
      // Candidate grids can be imported or edited independently of the puzzle
      // solution.  In that case an old solution must not veto otherwise-valid
      // chain eliminations merely because it contains a digit that the current
      // candidate grid has already discarded.  Keep the independent empty-cell
      // and unit checks below, but use solution-specific checks only when the
      // solution is actually compatible with the current candidate state.
      const solutionFitsCandidates = expectedSolution.every((digit, cell) => {
        const values = candidateGrid[cell] || [];
        return !values.length || values.includes(digit);
      });
      const fixedGridFitsCandidates = fixedGrid.every((digit, cell) => {
        if (!digit) return true;
        const values = candidateGrid[cell] || [];
        return !values.length || values.includes(digit);
      });
      const reasons = [];
      const seen = new Set();
      const addReason = (key, text) => {
        if (seen.has(key)) return;
        seen.add(key);
        reasons.push(text);
      };

      for (const item of chain.eliminations || []) {
        const cell = Number(item.cell);
        const digit = Number(item.digit);
        if (!Number.isInteger(cell) || cell < 0 || cell >= 81) continue;
        if (!Number.isInteger(digit) || digit < 1 || digit > 9) continue;

        if (solutionFitsCandidates && expectedSolution[cell] === digit) {
          addReason(
            `solution:${cell}:${digit}`,
            `removes solution ${digit} from ${core.cellName(cell)}`,
          );
        }
        remaining[cell]?.delete(digit);
      }

      for (let cell = 0; cell < 81; cell++) {
        if ((candidateGrid[cell] || []).length > 0 && remaining[cell].size === 0) {
          addReason(`empty-cell:${cell}`, `empties ${core.cellName(cell)}`);
        }
      }

      // Imported candidate grids may be edited independently of the original
      // givens.  A stale fixed grid must not make a valid chain look unsafe by
      // hiding a placement that the current candidate state still represents.
      if (fixedGridFitsCandidates) {
        for (let sector = 0; sector < core.UNITS.length; sector++) {
          const unit = core.UNITS[sector];
          for (let digit = 1; digit <= 9; digit++) {
            if (unit.some(cell => fixedGrid[cell] === digit)) continue;
            if (unit.some(cell => remaining[cell].has(digit))) continue;
            const name = core.sectorGroupName([sector]);
            addReason(`sector:${sector}:${digit}`, `leaves ${name} with no place for ${digit}`);
          }
        }
      }

      return reasons;
    }

    const colouringStep = appNamespace.colouringStep.create({
      core,
      getCandidates: () => cand,
      getSolution: () => solution,
      getPuzzle: () => puzzle,
      displayRecord: displayColouringRecord,
      chainSafetyFlags,
      eureka: {
        simple: simpleColoringEureka,
        medusa: threeDMedusaEureka,
        multi: multiColoringEureka,
        superMulti: superMultiColoringEureka,
        medusaMulti: threeDMedusaMultiEureka,
      },
    });
    const annotateColouringReports = colouringStep.annotate;
    const colouringStepFromResult = colouringStep.stepFromResult;

    const chainNodeLimits = appNamespace.chainNodeLimits.create({
      useAls: chainUseAlsNodeLimitsEl,
      useAhs: chainUseAhsNodeLimitsEl,
      useAlc: chainUseAlcNodeLimitsEl,
      alsSize: chainAlsMaxSizeEl,
      ahsSize: chainAhsMaxSizeEl,
      alcSize: chainAlcMaxSizeEl,
    });
    const chainNodeLimitOptions = chainNodeLimits.get;

    function chainSearchOptions(
      candidateGrid,
      maxDepth,
      budget = 'interactive',
      profile = null,
      buildSets = true,
      phase = null,
    ) {
      // Re-synchronise the core unit table before constructing any links.
      // Variation toggles can change between searches while the same page and
      // worker remain alive; without this, a previously enabled Windoku unit
      // can leak into the next chain pass.
      core.configureVariants(variantSettings);
      const nodeLimits = chainNodeLimitOptions('chain');
      const includeAlsRcc = profile?.includeAlsRcc ?? chainAlsRccEl.checked;
      const includeAhs = profile?.includeAhs ?? chainAhsEl.checked;
      const generator = budget === 'generator';
      const strongLinkTypes = profile?.strongLinkTypes
        || chainStrongTypeEls
          .map((element, index) => element.checked ? index : null)
          .filter(index => index !== null);
      const rank = Number(profile?.maxRank);
      const generatorScale = !Number.isFinite(rank) || rank <= 30
        ? { maxChains: 40, maxResultAttempts: 300, maxResultAttemptsPerStart: 25, maxStates: 2500, maxQueue: 2500, maxBranching: 50, maxStartViews: 100, maxAlsLinks: 250 }
        : rank <= 50
          ? { maxChains: 75, maxResultAttempts: 750, maxResultAttemptsPerStart: 50, maxStates: 8000, maxQueue: 8000, maxBranching: 100, maxStartViews: 250, maxAlsLinks: 750 }
          : rank <= 70
            ? { maxChains: 150, maxResultAttempts: 1500, maxResultAttemptsPerStart: 75, maxStates: 16000, maxQueue: 16000, maxBranching: 150, maxStartViews: 400, maxAlsLinks: 1500 }
            : rank <= 90
              ? { maxChains: 250, maxResultAttempts: 3500, maxResultAttemptsPerStart: 100, maxStates: 30000, maxQueue: 30000, maxBranching: 250, maxStartViews: 600, maxAlsLinks: 3000 }
              : rank <= 110
                ? { maxChains: 350, maxResultAttempts: 6000, maxResultAttemptsPerStart: 125, maxStates: 45000, maxQueue: 45000, maxBranching: 300, maxStartViews: 750, maxAlsLinks: 4500 }
                : rank <= 130
                  ? { maxChains: 500, maxResultAttempts: 10000, maxResultAttemptsPerStart: 150, maxStates: 65000, maxQueue: 65000, maxBranching: 350, maxStartViews: 900, maxAlsLinks: 6000 }
                  : rank <= 150
                    ? { maxChains: 700, maxResultAttempts: 16000, maxResultAttemptsPerStart: 200, maxStates: 90000, maxQueue: 90000, maxBranching: 400, maxStartViews: 1100, maxAlsLinks: 8000 }
                    : { maxChains: 1000, maxResultAttempts: 24000, maxResultAttemptsPerStart: 250, maxStates: 120000, maxQueue: 120000, maxBranching: 450, maxStartViews: 1400, maxAlsLinks: 10000 };
      const limits = budget === 'generator'
        ? generatorScale
        : {
            maxChains: 5000,
            // Keep interactive Next/Run All searches responsive. Dedicated
            // phases may raise these through searchLimits, but an unbounded
            // fallback phase must not monopolise the worker.
            maxResultAttempts: 10000,
            maxResultAttemptsPerStart: 250,
            maxStates: 30000,
            maxQueue: 30000,
            maxBranching: 250,
            maxStartViews: 900,
            maxAlsLinks: 3000,
          };

      // Depth-4 X-chain discovery is bounded per phase so Next/Run-All
      // cannot exhaust the browser before later ALS phases run.
      const phaseLimits = phase?.searchLimits && typeof phase.searchLimits === 'object'
        ? phase.searchLimits
        : {};
      const boundedAlsPhaseLimits = phase && (maxDepth <= 3 || phase?.alsLinkMode === 'rcc-only')
        ? {
          maxChains: 500,
          maxResultAttempts: 10000,
          maxResultAttemptsPerStart: 250,
          maxStates: 30000,
          maxQueue: 30000,
          maxBranching: 250,
          maxStartViews: 900,
          maxAlsLinks: 3000,
        }
        : {};
      const profileAlsMaxDigits = Number(profile?.alsMaxDigits);
      const phaseAlsMaxDigits = Number(phase?.alsMaxDigits);
      const alsMaxDigits = Number.isInteger(phaseAlsMaxDigits) && phaseAlsMaxDigits > 0
        ? phaseAlsMaxDigits
        : Number.isInteger(profileAlsMaxDigits) && profileAlsMaxDigits > 0
          ? profileAlsMaxDigits
          : null;
      const profileAlsMaxSizeDOF = Number(profile?.alsMaxSizeDOF);
      const phaseAlsMaxSizeDOF = Number(phase?.alsMaxSizeDOF);
      const configuredAlsMaxSizeDOF = Number(nodeLimits.alsMaxSizeDOF);
      const alsMaxSizeDOFCandidates = [
        phaseAlsMaxSizeDOF,
        profileAlsMaxSizeDOF,
        configuredAlsMaxSizeDOF,
      ].filter(value => Number.isInteger(value) && value >= 0);
      const baseAlsMaxSizeDOF = alsMaxSizeDOFCandidates.length
        ? Math.min(...alsMaxSizeDOFCandidates)
        : null;
      const profileAlsMaxSizeFox = Number(profile?.alsMaxSizeFox);
      const phaseAlsMaxSizeFox = Number(phase?.alsMaxSizeFox);
      const configuredAlsMaxSizeFox = phase?.fullFoxRange
        ? null
        : Number(nodeLimits.alsMaxSizeFox);
      const alsMaxSizeFoxCandidates = [
        phaseAlsMaxSizeFox,
        profileAlsMaxSizeFox,
        configuredAlsMaxSizeFox,
      ].filter(value => Number.isInteger(value) && value >= 0);
      const baseAlsMaxSizeFox = alsMaxSizeFoxCandidates.length
        ? Math.min(...alsMaxSizeFoxCandidates)
        : null;
      const alsSearchLimit = phase?.alsSearchLimit ?? profile?.alsSearchLimit ?? false;
      const strongSet = buildSets ? core.buildStrongLinks(candidateGrid, {
        includeAlmostFish: strongLinkTypes.includes(7),
        strongLinkTypes,
        almostFish: { grid: [...(puzzle || [])], ...currentAlmostFishOptions(), fishXorOnly: true },
      }) : null;
      const allowedAlsCellCounts = Array.isArray(phase?.alsCellCounts)
        ? new Set(phase.alsCellCounts.map(Number))
        : null;
      const passAlsCellLimit = phase?.alsCellCount != null
        ? Number(phase.alsCellCount)
        : Array.isArray(phase?.alsCellCounts) && phase.alsCellCounts.length
          ? Math.max(...phase.alsCellCounts.map(Number))
          : null;
      const digitLimitedAlsMaxSizeDOF = baseAlsMaxSizeDOF == null
        ? (Number.isInteger(passAlsCellLimit) ? Math.max(0, passAlsCellLimit - 1) : null)
        : alsMaxDigits == null
          ? baseAlsMaxSizeDOF
          : Math.min(baseAlsMaxSizeDOF, Math.max(0, alsMaxDigits - 1));
      const passAlsMaxSizeDOF = digitLimitedAlsMaxSizeDOF == null
        ? null
        : Number.isInteger(passAlsCellLimit)
          ? Math.min(digitLimitedAlsMaxSizeDOF, Math.max(0, passAlsCellLimit - 1))
          : digitLimitedAlsMaxSizeDOF;
      const passAlsMaxSizeFox = baseAlsMaxSizeFox == null || alsMaxDigits == null
        ? baseAlsMaxSizeFox
        : Math.min(baseAlsMaxSizeFox, Math.max(0, alsMaxDigits - 1));
      const effectiveAlsMaxCells = phase?.fullFoxRange
        ? Math.min(8, nodeLimits.alsMaxCells ?? 8)
        : nodeLimits.alsMaxCells;
      const alsList = buildSets && includeAlsRcc ? core.alsConstructor(candidateGrid, {
        ...(passAlsMaxSizeDOF == null ? {} : { maxSizeDOF: passAlsMaxSizeDOF }),
        ...(passAlsMaxSizeFox == null ? {} : { maxSizeFox: passAlsMaxSizeFox }),
        searchLimit: alsSearchLimit,
      }).filter(als => effectiveAlsMaxCells == null
        || (als.alsAllCells || []).length <= effectiveAlsMaxCells)
        .filter(als => phase?.alsCellCount == null
        || (allowedAlsCellCounts
          ? allowedAlsCellCounts.has((als.alsAllCells || []).length)
          : (als.alsAllCells || []).length === phase.alsCellCount))
        .filter(als => alsMaxDigits == null || (als.alsDigits || []).length <= alsMaxDigits) : null;
      const alsLinkSet = buildSets && includeAlsRcc ? core.buildAlsLinks(candidateGrid, {
        alsList,
        strictSingleCommon: true,
        xzOnly: phase?.alsLinkMode === 'xz-only',
        maxLinks: limits.maxAlsLinks,
      }) : null;
      const filteredAlsLinkSet = phase?.alsModuleKinds && alsLinkSet
        ? alsLinkSet.map(bucket => bucket.filter(link => phase.alsModuleKinds.includes(link.moduleKind)))
        : alsLinkSet;
      const scopedAlsLinkSet = phase?.alsLinkMode === 'rcc-only' && filteredAlsLinkSet
        ? filteredAlsLinkSet.map((bucket, index) => index === core.ALS_RCC ? bucket : [])
        : filteredAlsLinkSet;
      const ahsDigitLimits = [
        phase?.ahsMaxDigits,
        phase?.fullFoxRange ? Math.min(8, nodeLimits.ahsMaxDigits ?? 8) : nodeLimits.ahsMaxDigits,
      ]
        .map(Number)
        .filter(value => Number.isInteger(value) && value >= 2);
      const effectiveAhsMaxDigits = ahsDigitLimits.length
        ? Math.min(...ahsDigitLimits)
        : null;
      const ahsCellLimits = [
        phase?.ahsMaxCells,
        phase?.fullFoxRange ? Math.min(9, nodeLimits.ahsMaxCells ?? 9) : nodeLimits.ahsMaxCells,
      ]
        .map(Number)
        .filter(value => Number.isInteger(value) && value > 0);
      const effectiveAhsMaxCells = ahsCellLimits.length
        ? Math.min(...ahsCellLimits)
        : null;
      const ahsList = buildSets && includeAhs ? core.ahsConstructor(candidateGrid, {
        maxSize: Math.min(
          effectiveAhsMaxDigits == null ? (nodeLimits.ahsMaxSize ?? 8) : effectiveAhsMaxDigits - 1,
          effectiveAhsMaxCells == null ? (nodeLimits.ahsMaxSize ?? 8) : Math.max(1, effectiveAhsMaxCells - 1),
        ),
        maxSizeFox: effectiveAhsMaxCells == null
          ? (nodeLimits.ahsMaxFox ?? 7)
          : Math.min(nodeLimits.ahsMaxFox ?? 7, Math.max(1, effectiveAhsMaxCells - 1)),
        searchLimit: alsSearchLimit,
      }).filter(ahs => effectiveAhsMaxCells == null
        || (ahs.ahsAllCells || []).length <= effectiveAhsMaxCells)
        .filter(ahs => effectiveAhsMaxDigits == null
          || (ahs.ahsDigits || []).length <= effectiveAhsMaxDigits) : null;
      const ahsLinkSet = buildSets && includeAhs ? core.buildAhsLinks(candidateGrid, {
        ahsList,
        strongLinkSet: strongSet,
        minDof: 1,
        maxDof: 3,
        strictSingleCommon: false,
        maxLinks: limits.maxAlsLinks,
      }) : null;
      return {
        strongSet,
        alsList,
        alsLinkSet: scopedAlsLinkSet,
        ahsList,
        ahsLinkSet,
        includeAlsRcc,
        includeAhs,
        ahsMaxDigits: effectiveAhsMaxDigits,
        ahsMaxCells: effectiveAhsMaxCells,
        alsMaxCells: effectiveAlsMaxCells,
        ahsMaxSize: effectiveAhsMaxDigits == null
          ? nodeLimits.ahsMaxSize
          : Math.min(nodeLimits.ahsMaxSize ?? effectiveAhsMaxDigits - 1, effectiveAhsMaxDigits - 1),
        ahsMaxFox: effectiveAhsMaxCells == null
          ? nodeLimits.ahsMaxFox
          : Math.min(nodeLimits.ahsMaxFox ?? effectiveAhsMaxCells - 1, effectiveAhsMaxCells - 1),
        strongLinkTypes,
        almostFish: { ...currentAlmostFishOptions(), fishXorOnly: true },
        maxDepth: profile?.maxDepth == null ? maxDepth : Math.min(maxDepth, profile.maxDepth),
        alsMaxDigits,
        alsCellCounts: Array.isArray(phase?.alsCellCounts) ? [...phase.alsCellCounts] : null,
        alsMaxSizeDOF: passAlsMaxSizeDOF,
        alsMaxSizeFox: passAlsMaxSizeFox,
        alsSearchLimit,
        ...limits,
        ...boundedAlsPhaseLimits,
        ...phaseLimits,
      };
    }

    function chainSearchPhasePlan(maxDepth, profile = null) {
      const includeAls = appNamespace.phaseBuilder.resolveIncludeAls(profile, chainAlsRccEl);
      const strongLinkTypes = appNamespace.phaseBuilder.resolveStrongLinkTypes(
        profile,
        chainStrongTypeEls,
      );
      const phases = [];
      const addPhase = (name, types, options = {}) => appNamespace.phaseBuilder.addPhase(
        phases,
        name,
        types,
        maxDepth,
        options,
      );
      const addMixedStage = (name, options = {}) => appNamespace.phaseBuilder.addMixedStage(
        phases,
        name,
        strongLinkTypes,
        maxDepth,
        options,
      );

      // Phase 1: B.A.R.N.S. and transport forms. B.A.R.N.S. is checked by
      // increasing size so a smaller equal-cell/equal-digit form wins first.
      if (includeAls) {
        for (let barnsSize = 2; barnsSize <= 9; barnsSize++) {
          addPhase(`barns-${barnsSize}`, [4], {
            includeAls: true,
            maxDepth: 2,
            alsLinkMode: 'xz-only',
            alsModuleKinds: ['ALS_XZ'],
            barnsSize,
            family: 'barns',
          });
        }

        for (let barnsSize = 2; barnsSize <= 9; barnsSize++) {
          addPhase(`barns-transport-${barnsSize}`, strongLinkTypes, {
            includeAls: true,
            maxDepth: 3,
            barnsSize,
            family: 'barns-transport',
          });
        }

      }

      // Phase 2: pure strong-link chains. Type 4 is the BIVALVE (size-1 ALS)
      // strong link, so it is searched in the same individual/combination
      // sequence as types 0 through 3.
      for (const type of strongLinkTypes) addPhase(`strong-${type}`, [type]);
      for (let size = 2; size <= 4; size++) {
        for (const types of appNamespace.phaseBuilder.combinations(strongLinkTypes, size)) {
          addPhase(`strong-${types.join('-')}`, types);
        }
      }

      if (includeAls) {
        // Type 5 plus ordinary strong links is the next search family. It is
        // intentionally depth 3+; depth-2 ALS-XZ/B.A.R.N.S. was handled above.
        addMixedStage('type5-strong', {
          maxDepth,
          minDepth: 3,
        });

        // ALS-XZ and ALS-XY are both searched in their pure ALS form and in
        // their mixed type-5-plus-strong form.  The minimum depth prevents a
        // depth-3 request from re-reporting shorter links in these stages.
        addPhase('als-xz-type5', [4], {
          includeAls: true,
          maxDepth: 2,
          minDepth: 2,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
        });
        addMixedStage('als-xz-mixed', {
          maxDepth: 2,
          minDepth: 2,
          family: 'als-xz',
        });
        addMixedStage('als-xz-transport', {
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xz',
          allowedMoveKeys: ['t-als-xz'],
        });

        // ALS-XY is exactly logical breadth 3. The attached ALSs are not
        // restricted to three cells; their legal size is independent of the
        // chain breadth.
        addPhase('als-xy', [4], {
          includeAls: true,
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xy',
        });
        addMixedStage('als-xy-mixed', {
          maxDepth: 3,
          minDepth: 3,
          family: 'als-xy',
        });
        addMixedStage('als-xy-transport', {
          maxDepth: 4,
          minDepth: 4,
          family: 'als-xy',
          allowedMoveKeys: ['t-als-xy'],
        });

        // Longer ALS chains come after the fixed ALS-XZ/ALS-XY stages.
        addPhase('als-chain-type5', [4], {
          includeAls: true,
          maxDepth,
          minDepth: 3,
          family: 'als-chain',
        });
        addMixedStage('als-chain-mixed', {
          maxDepth,
          minDepth: 3,
          family: 'als-chain',
        });

        // AIC + ALS named constructs are the final mixed-chain stage.
        addMixedStage('aic-als', {
          maxDepth,
          minDepth: 3,
          family: 'aic-als',
        });
      }

      // The phase list is deliberately ordered. The engine's inclusive depth
      // search supplies the 2 -> max depth scaling inside each phase.

      return phases;
    }

    const solverChainPhasePlan = (maxDepth, profile = null) => appNamespace.solverPhase.chainPhasePlan(
      maxDepth,
      profile,
      chainSearchPhasePlan,
    );

    const chainAlsNodeCount = chain => appNamespace.solverPhase.alsNodeCount(chain, chainModuleSubsets);

    const chainMatchesSearchPhase = (chain, phase) => appNamespace.solverPhase.matchesSearchPhase(chain, phase, {
      chainUniqueDigitCount,
      chainModuleSubsets,
      barnsTransportChainInfo,
      barnsChainInfo,
      chainMoveKeys,
      alsSizeOneChainInfo,
    });

    const phaseProfile = (profile, phase) => appNamespace.solverPhase.phaseProfile(profile, phase);

    function legacyBestChainFromReport(
      report,
      phase,
      enabledTypes,
      candidateGrid,
      fixedGrid,
      expectedSolution,
      maxDepth,
      profile,
    ) {
      const diagnostics = {
        phase: phase?.name || 'unknown',
        received: Array.isArray(report?.chains) ? report.chains.length : 0,
        phaseRejected: 0,
        toggleRejected: 0,
        noElimination: 0,
        safetyRejected: 0,
        ratingRejected: 0,
        accepted: 0,
      };
      let best = null;
      const acceptedChains = [];
      for (let index = 0; index < report.chains.length; index++) {
        const chain = displayChainForUi(report.chains[index]);
        if (!chainMatchesSearchPhase(chain, phase)) {
          diagnostics.phaseRejected += 1;
          continue;
        }
        if (!chainMoveEnabled(chain, enabledTypes)) {
          diagnostics.toggleRejected += 1;
          continue;
        }

        const items = core.eliminationItems(
          { items: chain.eliminations || [] },
          candidateGrid,
        );
        if (!items.length) {
          diagnostics.noElimination += 1;
          continue;
        }
        if (chainSafetyFlags(chain, candidateGrid, expectedSolution, fixedGrid).length > 0) {
          diagnostics.safetyRejected += 1;
          continue;
        }

        const step = {
          ...chainStepFromResult(chain, report, index, candidateGrid),
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) {
          diagnostics.ratingRejected += 1;
          continue;
        }
        diagnostics.accepted += 1;
        acceptedChains.push({ chain, items, rating: step.rating });
      }

      // The worker report can contain every chain reachable by the current
      // graph walk, including depths and named families that belong to later
      // hierarchy phases. Keep the report attached to Next/Run All scoped to
      // the same accepted phase that selected the move.
      const displayReport = {
        ...report,
        chains: acceptedChains.map(entry => entry.chain),
      };
      for (const [displayIndex, entry] of acceptedChains.entries()) {
        const { chain, items, rating } = entry;
        const step = {
          ...chainStepFromResult(chain, displayReport, displayIndex, candidateGrid),
          elim: { items },
          desc: chainText({ ...chain, eliminations: items }),
        };
        step.rating = rating;
        const candidate = {
          report: displayReport,
          index: displayIndex,
          chain,
          step,
            // A phase is a conceptual hierarchy. Select its named move order
            // before comparing link-modified scores, so a later named form
            // cannot outrank an earlier X-chain/Skyscraper/Kite form.
            priority: [
              appNamespace.solverPhase.phaseTechniqueOrder(
                chain,
                phase,
                chainMoveKeys,
                moveTieOrder,
              ),
              // Prefer the smallest valid proof within a hierarchy phase.
              // A longer walk may contain this chain, but it must not hide it
              // or win merely because it exposes more cumulative exclusions.
              Number(chain.length) || Number(chain.steps?.length) || Number.POSITIVE_INFINITY,
              // Within the same named/classified move, prefer the proof that
              // removes more candidates after proof length has been compared.
              -items.length,
              ...solverMovePriority(chain, step, maxDepth, displayIndex),
            ],
        };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      lastChainSelectionDiagnostics = diagnostics;
      return best;
    }

    const chainMoveKeys = chain => appNamespace.chainClassification.moveKeys(chain, {
      chainUniqueDigitCount,
      isEriOnlyXChain,
      barnsChainInfo,
      barnsTransportChainInfo,
      alsSizeOneChainInfo,
      hiddenXyChainInfo,
    });

    const chainMoveEnabled = (chain, enabledTypes) => appNamespace.solverPhase.chainMoveEnabled(
      chain,
      enabledTypes,
      chainMoveKeys,
      solverMoveTypeEls,
    );

    const SOLVER_TIE_ORDER = appNamespace.chainScoring.solverTieOrder;

    const chainComplexityRank = chain => appNamespace.chainClassification.complexityRank(
      chain,
      chainModuleSubsets,
    );

    function legacyChainMoveTieKey(chain) {
      const fullName = String(chain?.structureName || '');
      const name = fullName
        .replace(/^\s*(?:(?:AIC\s*\+\s*)?ALS|AHS)\s*-\s*/i, '')
        .trim();
      const barnsTransport = barnsTransportChainInfo(chain);
      const barns = barnsChainInfo(chain);
      if (barnsTransport) {
        return barnsTransport.sizeName.length <= 3
          ? 'barns-xyz-transport'
          : 'barns-wxyz-transport';
      }
      if (barns) return barns.sizeName.length === 3 ? 'barns' : 'barns-wxyz';

      if (isEriOnlyXChain(chain)) {
        const eriCount = chainEriCount(chain);
        if (eriCount === 3) return '3x-eri';
        if (eriCount === 4) return '4x-eri';
        if (eriCount > 4) return 'eri-chain-long';
      }

      const aicAlsNamed = /^AIC\s*\+\s*ALS\s*-\s*.+(?:Wing|Ring)$/i.test(fullName);
      if (aicAlsNamed) return 'als-named';
      if (/^AIC\s*\+\s*ALS(?:\s*-\s*Chain)?$/i.test(fullName)) return 'aic-als';
      if (/^ALS\s*-\s*XZ$/i.test(fullName)) return 'als-xz';
      if (/^T\s*-\s*ALS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 't-als-xz';
      if (/^ALS\s*-\s*XY$/i.test(fullName)) return 'als-xy';
      if (/^ALC\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'alc-xz';
      if (/^ALC\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'alc-xy';
      if (/^ALC\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-chain';
      if (/^ALC\s*-\s*DOF\s+Chain(?:\s+Ring)?$/i.test(fullName)) return 'alc-dof';
      if (/^AHS\s*-\s*XZ(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xz';
      if (/^AHS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 'ahs-xy';
      if (/^AHS\s*-\s*Chain(?:\s+Ring)?$/i.test(fullName)) return 'ahs-chain';
      if (/^T\s*-\s*ALS\s*-\s*XY(?:\s+Ring)?$/i.test(fullName)) return 't-als-xy';
      if (/^ALS\s*-\s*Chain$/i.test(fullName)) return 'als-chain';
      if (/^ALS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'als-named';
      if (/^AHS\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'ahs-named';
      if (/^ALC\s*-/i.test(fullName) && /(?:Wing|Ring)$/i.test(name)) return 'alc-named';

      const alsSizeOne = alsSizeOneChainInfo(chain);
      if (alsSizeOne?.remotePair) return 'remote-pair';
      if (alsSizeOne?.breakdown === 'XY-Wing') return 'xy-wing';
      if (alsSizeOne) return 'xy-chain';

      const hiddenXy = hiddenXyChainInfo(chain);
      if (hiddenXy?.remotePair) return 'hidden-remote-pair';
      if (hiddenXy && chain.isRing) return 'hidden-xy-ring';
      if (hiddenXy) return 'hidden-xy-chain';

      if (/^X-Wing$/i.test(name)) return 'aic-x-wing';
      if (/^Skyscraper$/i.test(name)) return 'skyscraper';
      if (/^2-String Kite$/i.test(name)) return '2-string-kite';
      if (/^Finned X-Wing$/i.test(name)) return 'finned-x-wing';
      if (/^Sashimi X-Wing$/i.test(name)) return 'sashimi-x-wing';
      if (/(?:^|-\s*)Empty Rectangle$/i.test(name)) return 'empty-rectangle';
      if (/(?:^|-\s*)Dual Empty Rectangle$/i.test(name)) return 'dual-empty-rectangle';
      if (/(?:^|-\s*)Rec'T Kite$/i.test(name)) return 'rect-kite';
      if (/(?:^|-\s*)Bridged (?:ERI|Empty Rectangle)$/i.test(name)) return 'bridged-eri';
      if (/^XY-Wing$/i.test(name)) return 'xy-wing';
      if (/^L\(1\)-Wing$|^L1-Wing$/i.test(name)) return 'l1-wing';
      if (/^L\(2\)-Wing$|^L2-Wing$/i.test(name)) return 'l2-wing';
      if (/^L\(3\)-Wing$|^L3-Wing$/i.test(name)) return 'l3-wing';
      if (/^W-Wing|^W-Ring/i.test(name)) return 'w-wing';
      if (/Transport/i.test(name)) return 'w-transport';
      if (/^S-Wing|^S-Ring/i.test(name)) return 's-wing';
      if (/^M(?:\(\d+\))?-Wing|^M(?:\(\d+\))?-Ring/i.test(name)) return 'm-wing';
      if (/^H(?:\(\d+\))?-Wing|^H(?:\(\d+\))?-Ring/i.test(name)) return 'h-wing';

      const length = Number(chain?.length || chain?.steps?.length || 0);
      if (/^(?:X-Chain|AIC)(?:\s+\(Depth\s+\d+\))?$/i.test(name)) {
        if (length <= 2) return 'x-chain-2';
        if (length === 3) return 'x-chain-3';
        if (length === 4) return 'x-chain-4';
        return 'x-chain-long';
      }
      if (length === 4) return 'x-chain-4';
      if (length > 4) return 'x-chain-long';
      return 'x-chain-long';
    }

    const chainMoveTieKey = chain => appNamespace.chainClassification.tieKey(chain, {
      chainEriCount,
      isEriOnlyXChain,
      barnsChainInfo,
      barnsTransportChainInfo,
      alsSizeOneChainInfo,
      hiddenXyChainInfo,
    }) || legacyChainMoveTieKey(chain);

    const solverRanking = appNamespace.solverRanking.create({
      chainScoring: appNamespace.chainScoring,
      solverTieOrder: SOLVER_TIE_ORDER,
      alsDofMoveKey,
      chainMoveTieKey,
      chainComplexityRank,
      ratingForStep,
    });
    const {
      directMoveTieKey,
      moveTieOrder,
      solverMovePriority,
      directMovePriority,
      chooseBestSolverMove,
      isHigherPriorityMove,
    } = solverRanking;

    const modularBestChainFromReport = appNamespace.chainSelection.create({
      core,
      displayChainForUi,
      chainMatchesSearchPhase,
      chainMoveEnabled,
      chainStepFromResult,
      chainSafetyFlags,
      chainText,
      ratingForStep,
      phaseTechniqueOrder: appNamespace.solverPhase.phaseTechniqueOrder,
      chainMoveKeys,
      moveTieOrder,
      solverMovePriority,
      isHigherPriorityMove,
      onDiagnostics: diagnostics => {
        lastChainSelectionDiagnostics = diagnostics;
      },
    }).bestFromReport;
    const bestChainFromReport = (...args) =>
      modularBestChainFromReport(...args) || legacyBestChainFromReport(...args);

    function chooseLowerScoringMove(simple, chainResult) {
      return chooseBestSolverMove([
        simple ? { step: simple, chain: null } : null,
        chainResult,
      ]);
    }

    const bestAlsDofMoveFromReport = (candidateGrid, report, enabledTypes, profile = null) => {
      return appNamespace.alsDofSelection.bestMove(
        candidateGrid,
        report,
        enabledTypes,
        profile,
        {
          moveEnabled: alsDofMoveEnabled,
          stepFromResult: alsDofStepFromResult,
          directPriority: directMovePriority,
          isHigherPriority: isHigherPriorityMove,
        },
      );
    };

    function findSolverAlsDofMove(
      candidateGrid = cand,
      budget = 'interactive',
      profile = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!['als-dof', 'dds', 'adds'].some(type => enabledTypes.has(type))) return null;

      const configuredDigits = Number(profile?.alsMaxDigits);
      const configuredAuxiliary = Number(profile?.alsMaxAuxiliary);
      const maxDigits = Math.min(9, Math.max(2,
        Number.isInteger(configuredDigits) && configuredDigits > 0
          ? configuredDigits
          : (Number(alsDofMaxDigitsEl.value) || 9)));
      const maxAuxiliary = Math.min(9, Math.max(1,
        Number.isInteger(configuredAuxiliary) && configuredAuxiliary > 0
          ? configuredAuxiliary
          : (Number(alsDofMaxAuxiliaryEl.value) || 9)));
      const sourceAls = core.alsConstructor(candidateGrid, {
        maxSizeDOF: maxDigits - 1,
        maxSizeFox: maxDigits - 1,
      });
      const raw = core.findAlsDofNets(candidateGrid, {
        alsList: sourceAls,
        maxAuxiliary,
        maxDigits,
        maxResults: budget === 'generator' ? 2500 : 5000,
        includeChain: true,
      });
      const accepted = [];
      const rejected = [];
      for (const result of raw.results || []) {
        const verification = core.verifyAlsDofNet(candidateGrid, result, { alsList: sourceAls });
        if (verification.ok) accepted.push({ ...result, verification });
        else rejected.push({ result, verification });
      }
      const report = {
        ...raw,
        results: accepted,
        rejectedResults: rejected,
        stats: {
          ...(raw.stats || {}),
          verifierChecked: (raw.results || []).length,
          verifierRejected: rejected.length,
        },
      };

      return bestAlsDofMoveFromReport(candidateGrid, report, enabledTypes, profile);
    }

    const bestAhsDofMoveFromReport = (candidateGrid, report, profile = null) => {
      return appNamespace.alsDofSelection.bestAhsMove(
        candidateGrid,
        report,
        profile,
        {
          stepFromResult: modularAhsDofStepFromResult,
          directPriority: directMovePriority,
          isHigherPriority: isHigherPriorityMove,
        },
      );
    };

    function findSolverAhsDofMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      const maxCells = Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6));
      const maxAuxiliary = Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2));
      const raw = core.findAhsDofNets(candidateGrid, {
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells,
        maxAuxiliary,
        maxResults: budget === 'generator' ? 1000 : 2500,
      });
      const accepted = [];
      for (const result of raw.results || []) {
        if (core.verifyAhsDofNet(candidateGrid, result).ok) accepted.push(result);
      }
      return bestAhsDofMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAhsDofMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      const report = await runSearchWorker('ahs-dof', {
        candidateGrid,
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxResults: budget === 'generator' ? 1000 : 2500,
      });
      return bestAhsDofMoveFromReport(candidateGrid, report, profile);
    }

    const bestAlsDofChainMoveFromReport = (candidateGrid, report, profile = null) => {
      return appNamespace.alsDofSelection.bestChainMove(
        candidateGrid,
        report,
        profile,
        {
          stepFromResult: modularAlsDofChainStepFromResult,
          directPriority: directMovePriority,
          isHigherPriority: isHigherPriorityMove,
          reportKey: 'alsDofChainReport',
          indexKey: 'alsDofChainIndex',
        },
      );
    };

    function findSolverAlsDofChainMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      const payload = {
        maxDigits: Math.min(9, Math.max(2, Number(profile?.alsMaxDigits) || 5)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.alsMaxAuxiliary) || 5)),
        maxResults: budget === 'generator' ? 500 : 1000,
        includeHydra: true,
      };
      const raw = core.findAlsDofChains(candidateGrid, payload);
      const accepted = (raw.results || []).filter(result =>
        core.verifyAlsDofNet(candidateGrid, result, {
          alsList: core.alsConstructor(candidateGrid, {
            maxSizeDOF: payload.maxDigits - 1,
            maxSizeFox: payload.maxDigits - 1,
          }),
        }).ok);
      return bestAlsDofChainMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAlsDofChainMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      const payload = {
        candidateGrid,
        maxDigits: Math.min(9, Math.max(2, Number(profile?.alsMaxDigits) || 5)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.alsMaxAuxiliary) || 5)),
        maxResults: budget === 'generator' ? 500 : 1000,
        includeHydra: true,
      };
      const report = await runSearchWorker('als-dof-chain', payload);
      return bestAlsDofChainMoveFromReport(candidateGrid, report, profile);
    }

    const bestAhsDofChainMoveFromReport = (candidateGrid, report, profile = null) => {
      return appNamespace.alsDofSelection.bestChainMove(
        candidateGrid,
        report,
        profile,
        {
          stepFromResult: modularAhsDofChainStepFromResult,
          directPriority: directMovePriority,
          isHigherPriority: isHigherPriorityMove,
          reportKey: 'ahsDofChainReport',
          indexKey: 'ahsDofChainIndex',
        },
      );
    };

    function findSolverAhsDofChainMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      const payload = {
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxDepth: 5,
        maxResults: budget === 'generator' ? 500 : 1000,
      };
      const ahsList = core.ahsConstructor(candidateGrid, {
        maxSize: payload.maxAhsSize,
        maxSizeFox: payload.maxAhsFox,
      });
      const netReport = core.findAhsDofNets(candidateGrid, { ...payload, ahsList });
      const raw = core.findAhsDofChains(candidateGrid, { ...payload, netReport });
      const accepted = (raw.results || []).filter(result =>
        core.verifyAhsDofChain(candidateGrid, result).ok);
      return bestAhsDofChainMoveFromReport(candidateGrid, { ...raw, results: accepted }, profile);
    }

    async function findSolverAhsDofChainMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      const payload = {
        candidateGrid,
        minDof: 2,
        maxDof: 3,
        maxAhsSize: 8,
        maxAhsFox: 7,
        maxCells: Math.min(9, Math.max(2, Number(profile?.ahsMaxCells) || 6)),
        maxAuxiliary: Math.min(9, Math.max(1, Number(profile?.ahsMaxAuxiliary) || 2)),
        maxDepth: 5,
        maxResults: budget === 'generator' ? 500 : 1000,
      };
      const report = await runSearchWorker('ahs-dof-chain', payload);
      return bestAhsDofChainMoveFromReport(candidateGrid, report, profile);
    }

    const alcSearchOptions = (phase, candidateGrid, budget = 'interactive') =>
      appNamespace.alcSearch.options(phase, budget, chainNodeLimitOptions('alc'));

    const bestAlcMoveFromReport = (candidateGrid, report, phase, fixedGrid, expectedSolution, profile) => {
      return appNamespace.alcSearch.bestMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
        bestChainFromReport,
      );
    };

    function findSolverAlcMove(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
      phase,
    ) {
      if (!phase?.alcType) return null;
      const options = alcSearchOptions(phase, candidateGrid, budget);
      const report = appNamespace.alcSearch.run(core, candidateGrid, phase, options);
      const best = bestAlcMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
      );
      if (best) best.alcReport = report;
      return best;
    }

    async function findSolverAlcMoveInWorker(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
      phase,
    ) {
      if (!phase?.alcType) return null;
      const options = alcSearchOptions(phase, candidateGrid, budget);
      const report = await runSearchWorker(
        `alc-${phase.alcType}`,
        appNamespace.alcSearch.workerPayload(candidateGrid, options),
      );
      const best = bestAlcMoveFromReport(
        candidateGrid,
        report,
        phase,
        fixedGrid,
        expectedSolution,
        profile,
      );
      if (best) best.alcReport = report;
      return best;
    }

    const solverMslsOptions = (budget = 'interactive') => appNamespace.mslsSearch.solverOptions(budget);

    const bestMslsMoveFromReport = (candidateGrid, report, profile = null) => {
      return appNamespace.mslsSearch.bestSolverMove(report, profile, {
        stepFromResult: mslsStepFromResult,
        ratingForStep,
        directPriority: directMovePriority,
        isHigherPriority: isHigherPriorityMove,
      });
    };

    function findSolverMslsMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      const options = solverMslsOptions(budget);
      const report = core.findMsls(candidateGrid, options);
      return bestMslsMoveFromReport(candidateGrid, report, profile);
    }

    async function findSolverMslsMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      const report = await runSearchWorker('msls', {
        candidateGrid,
        options: solverMslsOptions(budget),
      });
      return bestMslsMoveFromReport(candidateGrid, report, profile);
    }

    const chainPhaseMinimumRating = appNamespace.solverPhase.minimumRating;

    const solverAlsMaxDigits = appNamespace.solverPhase.alsMaxDigits;
    const solverAlsDigitPasses = appNamespace.solverPhase.alsDigitPasses;

    const solverAhsMaxDigits = (phase, profile = null) =>
      appNamespace.solverPhase.ahsMaxDigits(phase, profile, chainNodeLimitOptions);
    const solverAhsMaxCells = (phase, profile = null) =>
      appNamespace.solverPhase.ahsMaxCells(phase, profile, chainNodeLimitOptions);
    const solverAhsCellPasses = (phase, profile = null) =>
      appNamespace.solverPhase.ahsCellPasses(phase, profile, chainNodeLimitOptions);

    // Combined ALS/AHS phases use cumulative node breadth. ALS size means
    // cell count here; it must not be treated as a digit-count ceiling because
    // a two-cell ALS normally carries three digits.
    const solverAlsCellPasses = (phase, profile = null) =>
      appNamespace.solverPhase.alsCellPasses(phase, profile, chainNodeLimitOptions);

    // A phase is advanced cumulatively: 2, then 2-3, then 2-4, and so on.
    // This keeps the small-node search fast without excluding smaller nodes.
    const solverSearchPasses = (phase, profile = null, budget = 'interactive') =>
      appNamespace.solverPhase.searchPasses(phase, profile, budget, {
        alsCellPasses: solverAlsCellPasses,
        ahsCellPasses: solverAhsCellPasses,
        ahsMaxCells: solverAhsMaxCells,
      });
    const solverAlsMinimumNodeCount = appNamespace.solverPhase.alsMinimumNodeCount;
    const solverAlsMaxCells = (phase, profile = null) =>
      appNamespace.solverPhase.alsMaxCells(phase, profile, chainNodeLimitOptions);

    const solverAlsPassCanStop = appNamespace.solverPhase.alsPassCanStop;
    const solverAhsPassCanStop = appNamespace.solverPhase.ahsPassCanStop;

    const chainPhaseDepthForCeiling = appNamespace.solverPhase.depthForCeiling;

    function findSolverChainMove(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
      scoreCeiling = null,
      phaseOverride = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!enabledTypes.has('chains')) return null;

      const requestedDepth = Math.min(8, Math.max(2, Number(chainDepthEl.value) || 8));
      const phases = phaseOverride
        ? [phaseOverride]
        : solverChainPhasePlan(requestedDepth, profile);
      let bestOverall = null;
      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const phase = phases[phaseIndex];
        let stopAllPhases = false;
        const searchPasses = solverSearchPasses(phase, profile, budget);
        for (const { alsMaxDigits, alsCellCounts, ahsMaxDigits, ahsMaxCells } of searchPasses) {
          const searchPhase = {
            ...phase,
            ...(alsMaxDigits == null ? {} : { alsMaxDigits }),
            ...(Array.isArray(alsCellCounts) ? { alsCellCounts } : {}),
            ...(ahsMaxDigits == null ? {} : { ahsMaxDigits }),
            ...(ahsMaxCells == null ? {} : { ahsMaxCells }),
            // Ratings rank results after the phase search; they never reduce
            // the configured graph depth or hide a valid candidate.
            maxDepth: phase.maxDepth,
          };
          const phaseSearchProfile = phaseProfile(profile, searchPhase);
          const search = chainSearchOptions(
            candidateGrid,
            searchPhase.maxDepth,
            budget,
            phaseSearchProfile,
            true,
            searchPhase,
          );
          if (search.maxDepth < 2) break;

          const report = core.findAicChains(candidateGrid, {
            strongLinkSet: search.strongSet,
            alsList: search.alsList,
            alsLinkSet: search.alsLinkSet,
            ahsList: search.ahsList,
            ahsLinkSet: search.ahsLinkSet,
            includeAls: search.includeAlsRcc,
            includeAhs: search.includeAhs,
            excludePureAhs: search.includeAhs && !searchPhase.family,
            strongLinkTypes: search.strongLinkTypes,
            maxDepth: search.maxDepth,
            minDepth: searchPhase.minDepth ?? 1,
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          });
          const best = bestChainFromReport(
            report,
            searchPhase,
            enabledTypes,
            candidateGrid,
            fixedGrid,
            expectedSolution,
            search.maxDepth,
            profile,
          );
          if (best && isHigherPriorityMove(best, bestOverall)) bestOverall = best;

          // The hierarchy is phase-first: once this phase produces a legal
          // move, do not spend time scanning larger breadths or later phases.
          if (best?.step) {
            const { priority, ...resultMove } = best;
            return resultMove;
          }

          if (solverAhsPassCanStop(
            phase,
            bestOverall,
            ahsMaxCells,
            solverAhsMaxCells(phase, profile),
          )) break;

          const currentAlsBreadth = Array.isArray(alsCellCounts) && alsCellCounts.length
            ? Math.max(...alsCellCounts)
            : alsMaxDigits;
          if (solverAlsPassCanStop(
            phase,
            bestOverall,
            currentAlsBreadth,
            solverAlsMaxCells(phase, profile),
          )) break;

        }
        if (stopAllPhases) break;
      }
      if (!bestOverall) return null;
      const { priority, ...result } = bestOverall;
      return result;
    }

    const solverFishSizes = (moveTypes = null, maxFishSize = 4) => {
      const enabledTypes = currentSolverMoveTypes(moveTypes);
      return appNamespace.solverPhase.fishSizes(enabledTypes, maxFishSize, basicFishMoveType);
    };

    const basicFishMoveType = appNamespace.solverPhase.basicMoveType;

    const solverFishMoveType = (spec, k, category = 'Basic') =>
      appNamespace.solverPhase.moveType(spec, k, category, basicFishMoveType);

    const solverFishOptions = (candidateGrid, fixedGrid, moveTypes = null, profile = null) => {
      const enabledTechniques = currentSolverMoveTypes(moveTypes);
      return appNamespace.solverPhase.fishOptions(
        candidateGrid,
        fixedGrid,
        enabledTechniques,
        currentPomFishOptions(),
        core.omissionFishStep,
        solverFishSizes(enabledTechniques, profile?.maxFishSize ?? 4),
      );
    };

    function generatorWorkerConfig(candidateGrid, fixedGrid, profile, budget = 'generator', phase = null) {
      const requestedDepth = Math.min(8, Math.max(2, Number(chainDepthEl.value) || 8));
      const search = chainSearchOptions(candidateGrid, requestedDepth, budget, profile, false, phase);
      return {
        candidateGrid,
        fixedGrid: [...fixedGrid],
          budget,
        moveTypes: [...currentSolverMoveTypes(profile?.moveTypes)],
        fishOptions: {
          ...currentPomFishOptions(),
          fishSizes: solverFishSizes(profile?.moveTypes, profile?.maxFishSize ?? 4),
        },
        chain: {
          maxDepth: search.maxDepth,
          minDepth: phase?.minDepth ?? 1,
          fixedGrid: [...fixedGrid],
          includeAls: search.includeAlsRcc,
          includeAhs: search.includeAhs,
          includeChromatic: chainChromaticType3El.checked,
          chromaticOptions: {
            unitType: chromaticUnitTypeEl.value,
            minSectors: chromaticMinSectorsEl.value,
            maxSectors: chromaticMaxSectorsEl.value,
            minDigits: chromaticMinDigitsEl.value,
            maxDigits: chromaticMaxDigitsEl.value,
            maxCells: chromaticMaxCellsEl.value,
            maxResults: 120,
          },
          excludePureAhs: search.includeAhs && !phase?.family,
          strongLinkTypes: search.strongLinkTypes,
          almostFish: search.almostFish,
          alsCellCount: phase?.alsCellCount ?? null,
          alsCellCounts: phase?.alsCellCounts ?? null,
          alsModuleKinds: phase?.alsModuleKinds ?? null,
          alsLinkMode: phase?.alsLinkMode ?? null,
          ahsMode: phase?.ahsMode ?? null,
          alsMaxDigits: search.alsMaxDigits,
          alsMaxSizeDOF: search.alsMaxSizeDOF,
          alsMaxSizeFox: search.alsMaxSizeFox,
          alsSearchLimit: search.alsSearchLimit,
          ahsMaxDof: 3,
          ahsMaxDigits: search.ahsMaxDigits,
          ahsMaxSize: search.ahsMaxSize,
          ahsMaxFox: search.ahsMaxFox,
          ahsMaxCells: search.ahsMaxCells,
          ahsMaxLinks: search.maxAlsLinks,
          limits: {
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          },
        },
      };
    }

    async function findSolverChainMoveInWorker(
      candidateGrid = cand,
      fixedGrid = puzzle,
      expectedSolution = solution,
      profile = null,
      budget = 'interactive',
      scoreCeiling = null,
      phaseOverride = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      if (!enabledTypes.has('chains')) return null;

      const requestedDepth = Math.min(8, Math.max(2, Number(chainDepthEl.value) || 8));
      const phases = phaseOverride
        ? [phaseOverride]
        : solverChainPhasePlan(requestedDepth, profile);
      let bestOverall = null;
      for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
        const phase = phases[phaseIndex];
        let stopAllPhases = false;
        const searchPasses = solverSearchPasses(phase, profile, budget);
        for (const { alsMaxDigits, alsCellCounts, ahsMaxDigits, ahsMaxCells } of searchPasses) {
          const searchPhase = {
            ...phase,
            ...(alsMaxDigits == null ? {} : { alsMaxDigits }),
            ...(Array.isArray(alsCellCounts) ? { alsCellCounts } : {}),
            ...(ahsMaxDigits == null ? {} : { ahsMaxDigits }),
            ...(ahsMaxCells == null ? {} : { ahsMaxCells }),
            // Keep the full configured depth. A score found in an earlier
            // pass is not a search heuristic.
            maxDepth: phase.maxDepth,
          };
          const searchProfile = phaseProfile(profile, searchPhase);
          const config = generatorWorkerConfig(
            candidateGrid,
            fixedGrid,
            searchProfile,
            budget,
            searchPhase,
          );
          const result = await runSearchWorker('chains', {
            candidateGrid: config.candidateGrid,
            ...config.chain,
          }, {
            diagnosticPhase: searchPhase.hierarchyPhase || searchPhase.name,
          });
          const report = {
            chains: result?.chains || [],
            stats: result?.stats || {},
          };
          const best = bestChainFromReport(
            report,
            searchPhase,
            enabledTypes,
            candidateGrid,
            fixedGrid,
            expectedSolution,
            config.chain.maxDepth,
            profile,
          );
          if (best && isHigherPriorityMove(best, bestOverall)) bestOverall = best;

          // The hierarchy is phase-first: once this phase produces a legal
          // move, do not spend time scanning larger breadths or later phases.
          if (best?.step) {
            const { priority, ...resultMove } = best;
            return resultMove;
          }

          if (solverAhsPassCanStop(
            phase,
            bestOverall,
            ahsMaxCells,
            solverAhsMaxCells(phase, profile),
          )) break;

          const currentAlsBreadth = Array.isArray(alsCellCounts) && alsCellCounts.length
            ? Math.max(...alsCellCounts)
            : alsMaxDigits;
          if (solverAlsPassCanStop(
            phase,
            bestOverall,
            currentAlsBreadth,
            solverAlsMaxCells(phase, profile),
          )) break;

        }
        if (stopAllPhases) break;
      }
      if (!bestOverall) return null;
      const { priority, ...resultMove } = bestOverall;
      return resultMove;
    }

    function solverPhasePlan(profile = null) {
      const phases = [];
      const addDirect = (name, methods) => phases.push({
        name,
        kind: 'direct',
        methods,
      });
      const addChain = (name, chainPhase) => phases.push({
        name,
        kind: 'chain',
        chainPhase: { ...chainPhase, hierarchyPhase: name },
        requiredTypes: chainPhase.requiredTypes || ['chains'],
      });
      const addAlsDof = name => phases.push({
        name,
        kind: 'als-dof',
      });
      const addAhsDof = name => phases.push({
        name,
        kind: 'ahs-dof',
      });
      const addAhsDofChain = name => phases.push({
        name,
        kind: 'ahs-dof-chain',
      });
      const addAlsDofChain = name => phases.push({
        name,
        kind: 'als-dof-chain',
      });
      const addMsls = name => phases.push({
        name,
        kind: 'msls',
      });
      const addAlc = (name, alcType, options = {}) => phases.push({
        name,
        kind: 'alc',
        alcType,
        chainPhase: {
          name,
          includeAls: true,
          includeAhs: true,
          maxDepth: options.maxDepth || 8,
          minDepth: options.minDepth || 2,
          family: `alc-${alcType}`,
          requiredTypes: ['chains'],
          ...options,
        },
      });

      // The direct phases are deliberately small. This lets the same numeric
      // scorer choose between the methods in one tier without asking the
      // expensive chain engine to compete against every basic move.
      addDirect('lulz', [
        { type: 'last-man-standing' },
      ]);
      addDirect('extremely-easy', [
        { type: 'hidden-single' },
        { type: 'naked-single' },
        { type: 'box-line' },
      ]);
      addDirect('very-easy-subsets', [
        { type: 'hidden-pair' },
        { type: 'naked-pair' },
      ]);
      addDirect('very-easy-fish', [
        { kind: 'fish', size: 2, k: [0], categories: ['Basic'] },
      ]);
      addChain('modestly-easy-chains', {
        name: 'strong-depth-2-0-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3],
        maxDepth: 2,
        minDepth: 2,
        requireAls: false,
        requireMixed: false,
        family: null,
        singleDigitOnly: true,
        // The phase is defined by the walker constraints, not by the display
        // name. This keeps every legal depth-2 type-0-to-3 chain eligible,
        // including a named form added by the classifier later.
        allowedMoveKeys: [
          'x-chain', 'chain-x-wing', 'skyscraper', '2-string-kite',
          'finned-x-wing', 'sashimi-x-wing', 'empty-rectangle',
        ],
        // Modestly Easy must finish its depth-2 strong-link pass before the
        // fish phase is allowed to run. Keep this phase bounded independently
        // of the much larger Transcendent interactive profile budget.
        searchLimits: {
          // This pass only walks two strong-link modules. Collect enough
          // candidates to survive safety/key filtering, then stop before the
          // later fish phase can be reached from an incomplete report.
          maxChains: 100,
          maxResultAttempts: 5000,
          maxResultAttemptsPerStart: 250,
          maxStates: 10000,
          maxQueue: 10000,
          maxBranching: 100,
          maxStartViews: Infinity,
          maxAlsLinks: 0,
        },
      });
      addDirect('modestly-easy-franken-k0', [
        { kind: 'fish', size: 2, k: [0], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k0', [
        { kind: 'fish', size: 2, k: [0], categories: ['Mutant'] },
      ]);
      addDirect('modestly-easy-franken-k1', [
        { kind: 'fish', size: 2, k: [1], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k1', [
        { kind: 'fish', size: 2, k: [1], categories: ['Mutant'] },
      ]);
      addDirect('modestly-easy-franken-k2', [
        { kind: 'fish', size: 2, k: [2], categories: ['Franken'] },
      ]);
      addDirect('modestly-easy-mutant-k2', [
        { kind: 'fish', size: 2, k: [2], categories: ['Mutant'] },
      ]);
      addDirect('easy-subsets', [
        { type: 'hidden-triple' },
        { type: 'naked-triple' },
      ]);
      addDirect('easy-fish', [
        { kind: 'fish', size: 3, k: [0], categories: ['Basic'] },
      ]);
      addChain('moderate-chains', {
        name: 'strong-depth-3-0-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        singleDigitOnly: true,
        allowedMoveKeys: [
          'x-chain', 'chain-x-wing',
          'l1-wing', 'dual-empty-rectangle',
          'rect-kite', 'bridged-eri', 'eri-chain',
        ],
      });
      addChain('moderate-xy-chain', {
        name: 'xy-chain-depth-3',
        includeAls: false,
        strongLinkTypes: [4],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        allowedMoveKeys: ['xy-wing', 'xy-chain'],
      });
      addChain('moderate-barns-3', {
        name: 'barns-size-3',
        includeAls: true,
        strongLinkTypes: [4],
        maxDepth: 2,
        minDepth: 2,
        requireAls: true,
        requireMixed: false,
        alsLinkMode: 'xz-only',
        alsModuleKinds: ['ALS_XZ'],
        barnsSize: 3,
        family: 'barns',
        requiredTypes: ['chains', 'barns'],
      });
      addChain('moderate-named-wings', {
        name: 'named-wings-depth-3',
        includeAls: false,
        strongLinkTypes: [0, 1, 2, 3, 4],
        maxDepth: 3,
        minDepth: 3,
        requireAls: false,
        requireMixed: false,
        family: null,
        allowedMoveKeys: [
          'l2-wing', 'l3-wing',
          'w-wing', 's-wing', 'm2-wing', 'm3-wing',
          'h1-wing', 'h2-wing', 'h3-wing',
          'strong-wing',
        ],
      });
      addDirect('moderate-franken-k0', [
        { kind: 'fish', size: 3, k: [0], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k0', [
        { kind: 'fish', size: 3, k: [0], categories: ['Mutant'] },
      ]);
      addDirect('moderate-franken-k1', [
        { kind: 'fish', size: 3, k: [1], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k1', [
        { kind: 'fish', size: 3, k: [1], categories: ['Mutant'] },
      ]);
      addDirect('moderate-franken-k2', [
        { kind: 'fish', size: 3, k: [2], categories: ['Franken'] },
      ]);
      addDirect('moderate-mutant-k2', [
        { kind: 'fish', size: 3, k: [2], categories: ['Mutant'] },
      ]);
      addDirect('tough-subsets', [
        { type: 'hidden-quad' },
        { type: 'naked-quad' },
      ]);
      addDirect('tough-fish', [
        { kind: 'fish', size: 4, k: [0], categories: ['Basic'] },
      ]);
      if (profile?.maxRank >= 70) {
        addChain('challenging-xchains', {
          name: 'strong-depth-4-xchains',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['x-chain', 'chain-x-wing'],
          singleDigitOnly: true,
          searchLimits: {
            maxChains: 250,
            maxResultAttempts: 5000,
            maxResultAttemptsPerStart: 250,
            maxStates: 12000,
            maxQueue: 12000,
            maxBranching: 100,
            maxStartViews: 2000,
            maxAlsLinks: 1000,
          },
        });
        addChain('challenging-transport', {
          name: 'barns-transport-xyz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          alsCellCount: 2,
          barnsSize: 3,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('challenging-barns-wxyz', {
          name: 'barns-wxyz',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsCellCount: 2,
          alsMaxDigits: 3,
          alsMaxSizeDOF: 1,
          alsMaxSizeFox: 3,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 4,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
        addChain('challenging-xy-chain', {
          name: 'xy-chain-depth-4',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-chain'],
        });
        addChain('challenging-hidden-xy', {
          name: 'hidden-xy-chain-depth-4',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('challenging-aic', {
          name: 'aic-depth-4',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['aic-generic', 'inversion'],
          searchLimits: {
            maxChains: 250,
            maxResultAttempts: 5000,
            maxResultAttemptsPerStart: 250,
            maxStates: 12000,
            maxQueue: 12000,
            maxBranching: 100,
            maxStartViews: 2000,
            maxAlsLinks: 1000,
          },
        });
        addDirect('challenging-franken-k0', [
          { kind: 'fish', size: 4, k: [0], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k0', [
          { kind: 'fish', size: 4, k: [0], categories: ['Mutant'] },
        ]);
        addDirect('challenging-franken-k1', [
          { kind: 'fish', size: 4, k: [1], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k1', [
          { kind: 'fish', size: 4, k: [1], categories: ['Mutant'] },
        ]);
        addDirect('challenging-franken-k2', [
          { kind: 'fish', size: 4, k: [2], categories: ['Franken'] },
        ]);
        addDirect('challenging-mutant-k2', [
          { kind: 'fish', size: 4, k: [2], categories: ['Mutant'] },
        ]);
      }
      if (profile?.maxRank >= 80) {
        addDirect('irritating-subsets', [
          { type: 'hidden-quintuple' },
          { type: 'naked-quintuple' },
        ]);
        addDirect('irritating-basic-fish', [
          { kind: 'fish', size: 5, k: [0], categories: ['Basic'] },
        ]);
        addChain('irritating-xchains', {
          name: 'strong-depth-5-plus',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 5,
          singleDigitOnly: true,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: [
            'x-chain', 'chain-x-wing', 'empty-rectangle',
            'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain',
          ],
        });
        addChain('irritating-xy', {
          name: 'xy-chain-depth-5',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
        });
        addChain('irritating-hidden-xy', {
          name: 'hidden-xy-chain-depth-5',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('irritating-aic', {
          name: 'aic-depth-5',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 5,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['aic-generic', 'inversion'],
        });
        addChain('irritating-transport-wxyz', {
          name: 'barns-transport-wxyz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          barnsSize: 4,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('irritating-barns-5', {
          name: 'barns-size-5',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 5,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
      }
      if (profile?.maxRank >= 90) {
        addDirect('frustrating-subsets', [
          { type: 'hidden-sextuple' },
          { type: 'naked-sextuple' },
        ]);
        addDirect('frustrating-basic-fish', [
          { kind: 'fish', size: 6, k: [0], categories: ['Basic'] },
        ]);
        addChain('frustrating-xchains', {
          name: 'strong-depth-6-plus',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          singleDigitOnly: true,
          allowedMoveKeys: ['x-chain', 'chain-x-wing', 'empty-rectangle', 'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain'],
        });
        addChain('frustrating-xy', {
          name: 'xy-chain-depth-6',
          includeAls: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
        });
        addChain('frustrating-hidden-xy', {
          name: 'hidden-xy-chain-depth-6',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
        });
        addChain('frustrating-aic', {
          name: 'aic-depth-6',
          includeAls: true,
          includeAhs: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 6,
          requireAls: false,
          requireMixed: false,
          family: null,
          genericAicOnly: true,
        });
        addChain('frustrating-transport-barns-5', {
          name: 'barns-transport-size-5',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          barnsSize: 5,
          family: 'barns-transport',
          requiredTypes: ['chains', 'barns-transport'],
        });
        addChain('frustrating-barns-6', {
          name: 'barns-size-6',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          barnsSize: 6,
          family: 'barns',
          requiredTypes: ['chains', 'barns'],
        });
        addDirect('frustrating-franken-k0', [
          { kind: 'fish', size: 6, k: [0], categories: ['Franken'] },
        ]);
        addDirect('frustrating-mutant-k0', [
          { kind: 'fish', size: 6, k: [0], categories: ['Mutant'] },
        ]);
        addChain('frustrating-transport-w-wing', {
          name: 'w-transport-depth-4',
          includeAls: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'aic-als',
          requiredTypes: ['chains', 'w-transport'],
        });
      }
      if (profile?.maxRank >= 100) {
        addDirect('hard-subsets', [
          { type: 'hidden-septuple' },
          { type: 'naked-septuple' },
        ]);
        addDirect('hard-basic-fish', [
          { kind: 'fish', size: 7, k: [0], categories: ['Basic'] },
        ]);
        // Next/Run All should use the same narrow ALS-XZ route as the
        // dedicated ALS-XZ button before opening the full mixed-link phase.
        // Type 4 is the bivalve ALS edge; ALS_RCC supplies the other edge.
        addChain('hard-als-xz-shortcut', {
          name: 'als-xz-shortcut',
          fullFoxRange: true,
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
          requiredTypes: ['chains', 'als-xz'],
        });
        addChain('hard-als-xz', {
          name: 'als-xz-full-depth-2',
          fullFoxRange: true,
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: true,
          requireMixed: false,
          alsLinkMode: 'xz-only',
          alsModuleKinds: ['ALS_XZ'],
          family: 'als-xz',
          requiredTypes: ['chains', 'als-xz'],
        });
        addChain('hard-ahs-xz-shortcut', {
          name: 'ahs-xz-shortcut',
          fullFoxRange: true,
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1],
          maxDepth: 2,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xz',
          requiredTypes: ['chains', 'ahs-xz'],
        });
        addChain('hard-ahs-xz', {
          name: 'ahs-xz-full-depth-2',
          fullFoxRange: true,
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 2,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xz',
          requiredTypes: ['chains', 'ahs-xz'],
        });
        addAlc('hard-alc-xz', 'xz', {
          fullFoxRange: true,
          maxDepth: 2,
          minDepth: 2,
          requiredTypes: ['chains'],
        });

      addChain('hard-xchains-full-depth', {
          name: 'strong-full-depth-xchains',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          singleDigitOnly: true,
          allowedMoveKeys: ['x-chain', 'chain-x-wing', 'empty-rectangle', 'dual-empty-rectangle', 'rect-kite', 'bridged-eri', 'eri-chain'],
          requiredTypes: ['chains'],
        });
        addChain('hard-xy-full-depth', {
          name: 'xy-chain-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['xy-wing', 'xy-chain', 'remote-pair'],
          requiredTypes: ['chains'],
        });
        addChain('hard-hidden-xy-full-depth', {
          name: 'hidden-xy-chain-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          allowedMoveKeys: ['hidden-xy-chain', 'hidden-remote-pair', 'remote-pair'],
          requiredTypes: ['chains'],
        });
        addChain('hard-aic-full-depth', {
          name: 'aic-full-depth',
          includeAls: false,
          includeAhs: false,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 2,
          requireAls: false,
          requireMixed: false,
          family: null,
          genericAicOnly: true,
          requiredTypes: ['chains'],
        });
        addDirect('hard-franken-k0', [
          { kind: 'fish', size: 7, k: [0], categories: ['Franken'] },
        ]);
        addDirect('hard-mutant-k0', [
          { kind: 'fish', size: 7, k: [0], categories: ['Mutant'] },
        ]);

      }
      if (profile?.maxRank >= 110) {
        addDirect('demanding-subsets', [
          { type: 'hidden-octuple' },
          { type: 'naked-octuple' },
        ]);
        addChain('demanding-named-als', {
          name: 'named-als-wings-rings-depth-3',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          // Named ALS forms use ordinary strong links 0-4 plus ALS_RCC.
          alsLinkMode: 'all',
          family: 'als-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'als-named'],
        });
        addChain('demanding-ahs-named', {
          name: 'named-ahs-wings-rings-depth-3',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'ahs-named'],
        });
        addChain('demanding-alc-named', {
          name: 'named-alc-wings-rings-depth-3',
          includeAls: true,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'alc-named',
          allowedMoveGroups: [
            ['l-named', 'l2-wing', 'l3-wing'],
            ['w-wing'],
            ['s-wing'],
            ['m-named', 'm2-wing', 'm3-wing'],
            ['h-named', 'h1-wing', 'h2-wing', 'h3-wing'],
            ['strong-wing'],
          ],
          requiredTypes: ['chains', 'alc-named'],
        });
        addChain('demanding-transport-als-xz', {
          name: 'transport-als-xz',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: true,
          // This is the three-stage transported ALS-XZ form, not a
          // B.A.R.N.S. transport.  Keep it in the demanding phase so the
          // corrected classifier can report the depth-3 move.
          family: 'als-xz',
          allowedMoveKeys: ['t-als-xz'],
          requiredTypes: ['chains', 't-als-xz'],
        });
        addChain('demanding-transport-ahs-xz', {
          name: 'transport-ahs-xz',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: true,
          family: 'ahs-xz',
          requiredTypes: ['chains', 't-ahs-xz'],
        });
        addAlc('demanding-transport-alc-xz', 'xz', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains', 't-alc-xz'],
        });
        addChain('demanding-als-xy-shortcut', {
          name: 'als-xy-shortcut',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-xy',
          requiredTypes: ['chains', 'als-xy'],
        });
        addChain('demanding-als-xy', {
          name: 'als-xy-depth-3',
          includeAls: true,
          // ALS-XY is allowed to use its complete ALS link engine here;
          // ordinary strong-link types are intentionally unrestricted.
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-xy',
          requiredTypes: ['chains', 'als-xy'],
        });
        addChain('demanding-ahs-xy-shortcut', {
          name: 'ahs-xy-shortcut',
          includeAls: false,
          includeAhs: true,
          ahsMode: 'xy',
          ahsMaxCells: 7,
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xy',
          requiredTypes: ['chains', 'ahs-xy'],
        });
        addChain('demanding-ahs-xy', {
          name: 'ahs-xy-depth-3',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-xy',
          requiredTypes: ['chains', 'ahs-xy'],
        });
        addAlc('demanding-alc-xy', 'xy', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains'],
        });
      }
      if (profile?.maxRank >= 120) {
        addDirect('expert-subsets', [
          { type: 'hidden-nontuple' },
          { type: 'naked-nontuple' },
        ]);
        addChain('expert-transport-als-xy', {
          name: 'transport-als-xy',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 4,
          minDepth: 4,
          requireAls: true,
          requireMixed: true,
          family: 'als-xy',
          requiredTypes: ['chains', 't-als-xy'],
        });
        addChain('expert-transport-ahs-xy', {
          name: 'transport-ahs-xy',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 3,
          minDepth: 3,
          requireAls: false,
          requireMixed: true,
          family: 'ahs-xy',
          requiredTypes: ['chains', 't-ahs-xy'],
        });
        addAlc('expert-transport-alc-xy', 'xy', {
          maxDepth: 3,
          minDepth: 3,
          requiredTypes: ['chains', 't-alc-xy'],
        });
      }
      if (profile?.maxRank >= 130) {
        addChain('brutal-als-chain', {
          name: 'als-chain-full-depth',
          includeAls: true,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 4,
          requireAls: true,
          requireMixed: false,
          family: 'als-chain',
          requiredTypes: ['chains', 'als-chain'],
        });
        addChain('brutal-als-chain-shortcut', {
          name: 'als-chain-shortcut',
          includeAls: true,
          strongLinkTypes: [4],
          maxDepth: 8,
          minDepth: 3,
          requireAls: true,
          requireMixed: false,
          family: 'als-chain',
          requiredTypes: ['chains', 'als-chain'],
        });
        addChain('brutal-ahs-chain-shortcut', {
          name: 'ahs-chain-shortcut',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-chain',
          requiredTypes: ['chains', 'ahs-chain'],
        });
        addChain('brutal-ahs-chain', {
          name: 'ahs-chain-full-depth',
          includeAls: false,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: 'ahs-chain',
          requiredTypes: ['chains', 'ahs-chain'],
        });
        addAlc('brutal-alc-chain', 'chain', {
          maxDepth: 8,
          minDepth: 4,
          requiredTypes: ['chains'],
        });
      }
      if (profile?.maxRank >= 140) {
        addChain('nightmare-full-aic', {
          name: 'aic-full-depth',
          includeAls: true,
          includeAhs: true,
          ahsMaxCells: 9,
          strongLinkTypes: [0, 1, 2, 3, 4, 5, 6, 7],
          maxDepth: 8,
          minDepth: 4,
          requireAls: false,
          requireMixed: false,
          family: null,
        });
      }
      addAlsDof('abyssal-als-dof-family');
      addAhsDof('abyssal-ahs-dof-family');
      addAlc('abyssal-alc-dof-chain', 'dof', {
        maxDepth: 8,
        minDepth: 3,
        requiredTypes: ['chains'],
      });
      if (profile?.maxRank == null || profile.maxRank >= 160) addMsls('ascendant-msls-family');
      addAlsDofChain('transcendent-als-dof-chain-family');
      addAhsDofChain('transcendent-ahs-dof-chain-family');

      return phases.filter(phase => {
        if (profile?.maxRank == null) return true;
        return !['chain', 'alc'].includes(phase.kind)
          || profile.maxDepth >= phase.chainPhase.minDepth;
      });
    }

    const solverPhaseAllowsType = (phase, enabledTypes, spec = null) =>
      appNamespace.solverPhase.allowsType(phase, enabledTypes, spec, solverFishMoveType);

    function fishPhaseStep(candidateGrid, fixedGrid, spec, enabledTypes, profile) {
      let best = null;
      const categories = spec.categories || ['Basic'];
      for (const k of spec.k || [0]) {
        for (const category of categories) {
          const fishType = solverFishMoveType(spec, k, category);
          if (!enabledTypes.has(fishType)) continue;
          const fishOptions = {
            ...solverFishOptions(candidateGrid, fixedGrid, enabledTypes, profile),
            enabledTechniques: new Set([fishType]),
            fishSizes: [spec.size],
            minSize: spec.size,
            maxSize: spec.size,
            minK: k,
            maxK: k,
            basicsEnabled: category === 'Basic',
            frankenEnabled: category === 'Franken',
            mutantEnabled: category === 'Mutant',
            priorityMode: true,
          };
          const step = core.subsetOrFishStep(candidateGrid, fishOptions);
          if (!step) continue;
          step.rating = ratingForStep(step);
          if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
          const candidate = { step, chain: null, priority: directMovePriority(step) };
          if (isHigherPriorityMove(candidate, best)) best = candidate;
        }
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    function directSolverPhaseStep(candidateGrid, fixedGrid, phase, profile = null) {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      let best = null;
      for (const spec of phase.methods || []) {
        if (!solverPhaseAllowsType(phase, enabledTypes, spec)) continue;
        const step = spec.kind === 'fish'
          ? fishPhaseStep(candidateGrid, fixedGrid, spec, enabledTypes, profile)?.step
          : spec.type === 'box-line'
            // Box-line reduction is a hierarchy phase in its own right. Keep
            // it out of the generic subset dispatcher so a subset-size-1
            // result cannot consume or hide the BLR pass.
            ? core.boxLineStep(candidateGrid)
            : core.subsetOrFishStep(candidateGrid, {
                  enabledTechniques: new Set([spec.type]),
                });
        if (!step) continue;
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
        const candidate = { step, chain: null, priority: directMovePriority(step) };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    async function directSolverPhaseStepInWorker(
      candidateGrid,
      fixedGrid,
      phase,
      profile = null,
    ) {
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      let best = null;
      for (const spec of phase.methods || []) {
        if (!solverPhaseAllowsType(phase, enabledTypes, spec)) continue;
        let step;
        if (spec.kind === 'fish') {
          for (const k of spec.k || [0]) {
            for (const category of spec.categories || ['Basic']) {
              const fishType = solverFishMoveType(spec, k, category);
              if (!enabledTypes.has(fishType)) continue;
              const fishOptions = {
                ...solverFishOptions(candidateGrid, fixedGrid, enabledTypes, profile),
                enabledTechniques: new Set([fishType]),
                fishSizes: [spec.size],
                minSize: spec.size,
                maxSize: spec.size,
                minK: k,
                maxK: k,
                basicsEnabled: category === 'Basic',
                frankenEnabled: category === 'Franken',
                mutantEnabled: category === 'Mutant',
                priorityMode: true,
              };
              // The worker supplies this callback from its own core. Only
              // structured-cloneable fish settings cross the message boundary.
              const { omissionFishSearch, ...workerFishOptions } = fishOptions;
              const result = await runSearchWorker('simple', {
                candidateGrid,
                fixedGrid: [...fixedGrid],
                moveTypes: [fishType],
                fishOptions: workerFishOptions,
              });
              if (!result) continue;
              result.rating = ratingForStep(result);
              if (profile?.maxRank !== undefined && result.rating.rank > profile.maxRank) continue;
              const candidate = { step: result, chain: null, priority: directMovePriority(result) };
              if (isHigherPriorityMove(candidate, best)) best = candidate;
            }
          }
          continue;
        }
        const result = await runSearchWorker('simple', {
          candidateGrid,
          fixedGrid: [...fixedGrid],
          moveTypes: [spec.type],
          subsetOnly: true,
          directType: spec.type === 'box-line' ? 'box-line' : null,
        });
        step = result;
        if (!step) continue;
        step.rating = ratingForStep(step);
        if (profile?.maxRank !== undefined && step.rating.rank > profile.maxRank) continue;
        const candidate = { step, chain: null, priority: directMovePriority(step) };
        if (isHigherPriorityMove(candidate, best)) best = candidate;
      }
      if (!best) return null;
      const { priority, ...result } = best;
      return result;
    }

    function solverPhaseMinimumRating(phase) {
      if (phase?.kind === 'chain' || phase?.kind === 'alc') {
        return chainPhaseMinimumRating(phase.chainPhase);
      }
      if (phase?.kind === 'als-dof') return 12;
      if (phase?.kind === 'ahs-dof') return 12.25;
      if (phase?.kind === 'als-dof-chain') return 14;
      if (phase?.kind === 'ahs-dof-chain') return 14;
      if (phase?.kind === 'msls') return 13;
      const name = String(phase?.name || '').toLowerCase();
      if (name === 'lulz') return 0;
      if (name.includes('extremely-easy')) return 1;
      if (name.includes('very-easy')) return 2;
      if (name.includes('modestly-easy')) return 2.25;
      if (name.includes('easy-')) return 3;
      if (name.includes('moderate-')) return 3.25;
      if (name.includes('tough-')) return 4;
      if (name.includes('advanced-')) return 5;
      if (name.includes('irritating-')) return 5;
      if (name.includes('frustrating-')) return 6;
      if (name.includes('hard-')) return 7;
      if (name.includes('demanding-')) return 8;
      if (name.includes('expert-')) return 9;
      if (name.includes('brutal-')) return 10;
      if (name.includes('nightmare-')) return 11;
      if (name.includes('abyssal-')) return 12.5;
      return 0;
    }

    function solverHasCheaperCandidate(best, phase) {
      if (!best?.step) return false;
      const score = Number(best.step.rating?.value);
      const floor = Number(solverPhaseMinimumRating(phase));
      return Number.isFinite(score) && Number.isFinite(floor) && score < floor - 1e-9;
    }

    function solverPhaseBand(name) {
      const value = String(name || '').toLowerCase();
      const bands = [
        ['lulz', 0],
        ['extremely-easy', 10],
        ['very-easy', 20],
        ['modestly-easy', 30],
        ['easy-', 40],
        ['moderate-', 50],
        ['tough-', 60],
        ['challenging-', 70],
        ['irritating-', 80],
        ['frustrating-', 90],
        ['hard-', 100],
        ['demanding-', 110],
        ['expert-', 120],
        ['brutal-', 130],
        ['nightmare-', 140],
        ['abyssal-', 150],
        ['msls-', 160],
        ['ahs-dof-chain-', 170],
        ['als-dof-chain-', 170],
      ];
      return bands.find(([prefix]) => value.startsWith(prefix))?.[1] ?? 0;
    }
    function chooseSolverStep(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
    ) {
      const phases = solverPhasePlan(profile);
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      for (const phase of phases) {
        activeHierarchyPhase = phase.name;
        if (phase.kind === 'alc') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alc = findSolverAlcMove(
            candidateGrid,
            fixedGrid,
            budget,
            expectedSolution,
            profile,
            phase,
          );
          if (alc?.incomplete) return alc;
          if (alc?.step) return alc;
          continue;
        }
        if (phase.kind === 'als-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDof = findSolverAlsDofMove(candidateGrid, budget, profile);
          if (alsDof?.step) return alsDof;
          continue;
        }
        if (phase.kind === 'ahs-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDof = findSolverAhsDofMove(candidateGrid, budget, profile);
          if (ahsDof?.step) return ahsDof;
          continue;
        }
        if (phase.kind === 'als-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDofChain = findSolverAlsDofChainMove(candidateGrid, budget, profile);
          if (alsDofChain?.step) return alsDofChain;
          continue;
        }
        if (phase.kind === 'ahs-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDofChain = findSolverAhsDofChainMove(candidateGrid, budget, profile);
          if (ahsDofChain?.step) return ahsDofChain;
          continue;
        }
        if (phase.kind === 'msls') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const msls = findSolverMslsMove(candidateGrid, budget, profile);
          if (msls?.step) return msls;
          continue;
        }
        if (phase.kind === 'direct') {
          const direct = directSolverPhaseStep(candidateGrid, fixedGrid, phase, profile);
          if (direct?.step) return direct;
          continue;
        }
        if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
        const chain = findSolverChainMove(
          candidateGrid,
          fixedGrid,
          budget,
          expectedSolution,
          profile,
          null,
          phase.chainPhase,
        );
        if (chain?.incomplete) return chain;
        if (chain?.step) return chain;
      }
      return null;
    }

    async function chooseSolverStepInWorker(
      candidateGrid = cand,
      fixedGrid = puzzle,
      expectedSolution = solution,
      profile = null,
      budget = 'interactive',
    ) {
      const phases = solverPhasePlan(profile);
      const enabledTypes = currentSolverMoveTypes(profile?.moveTypes);
      for (const phase of phases) {
        activeHierarchyPhase = phase.name;
        if (phase.kind === 'alc') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alc = await findSolverAlcMoveInWorker(
            candidateGrid,
            fixedGrid,
            budget,
            expectedSolution,
            profile,
            phase,
          );
          if (alc?.incomplete) return alc;
          if (alc?.step) return alc;
          continue;
        }
        if (phase.kind === 'als-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const configuredDigits = Number(profile?.alsMaxDigits);
          const configuredAuxiliary = Number(profile?.alsMaxAuxiliary);
          const alsDofReport = await runSearchWorker('als-dof', {
            candidateGrid,
            maxDigits: Math.min(9, Math.max(2,
              Number.isInteger(configuredDigits) && configuredDigits > 0
                ? configuredDigits : (Number(alsDofMaxDigitsEl.value) || 9))),
            maxAuxiliary: Math.min(9, Math.max(1,
              Number.isInteger(configuredAuxiliary) && configuredAuxiliary > 0
                ? configuredAuxiliary : (Number(alsDofMaxAuxiliaryEl.value) || 9))),
            maxResults: budget === 'generator' ? 2500 : 5000,
          });
          const alsDof = bestAlsDofMoveFromReport(
            candidateGrid,
            alsDofReport,
            enabledTypes,
            profile,
          );
          if (alsDof?.step) return alsDof;
          continue;
        }
        if (phase.kind === 'ahs-dof') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDof = await findSolverAhsDofMoveInWorker(candidateGrid, budget, profile);
          if (ahsDof?.step) return ahsDof;
          continue;
        }
        if (phase.kind === 'als-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const alsDofChain = await findSolverAlsDofChainMoveInWorker(candidateGrid, budget, profile);
          if (alsDofChain?.step) return alsDofChain;
          continue;
        }
        if (phase.kind === 'ahs-dof-chain') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const ahsDofChain = await findSolverAhsDofChainMoveInWorker(candidateGrid, budget, profile);
          if (ahsDofChain?.step) return ahsDofChain;
          continue;
        }
        if (phase.kind === 'msls') {
          if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
          const msls = await findSolverMslsMoveInWorker(candidateGrid, budget, profile);
          if (msls?.step) return msls;
          continue;
        }
        if (phase.kind === 'direct') {
          const direct = await directSolverPhaseStepInWorker(
            candidateGrid,
            fixedGrid,
            phase,
            profile,
          );
          if (direct?.step) return direct;
          continue;
        }
        if (!solverPhaseAllowsType(phase, enabledTypes)) continue;
        const chain = await findSolverChainMoveInWorker(
          candidateGrid,
          fixedGrid,
          expectedSolution,
          profile,
          budget,
          null,
          phase.chainPhase,
        );
        if (chain?.incomplete) return chain;
        if (chain?.step) return chain;
      }
      return null;
    }

    function chooseBasicStep(candidateGrid = cand, fixedGrid = puzzle) {
      const basicMoveTypes = new Set([
        'last-man-standing',
        'hidden-single', 'naked-single',
        'box-line',
        'hidden-pair', 'naked-pair',
        'hidden-triple', 'naked-triple',
        'hidden-quad', 'naked-quad',
        'x-wing', 'swordfish', 'jellyfish',
      ]);
      return core.subsetOrFishStep(candidateGrid, {
        ...currentPomFishOptions(),
        grid: [...fixedGrid],
        omissionFishSearch: core.omissionFishStep,
        enabledTechniques: basicMoveTypes,
        fishSizes: [2, 3, 4],
        minSize: 2,
        maxSize: 4,
        minK: 0,
        maxK: 0,
        basicsEnabled: true,
        frankenEnabled: false,
        mutantEnabled: false,
      });
    }

    function flaggedChainEntries(verbose = false) {
      if (!chainReport) return [];
      return chainReport.chains
        .map((chain, index) => ({
          chain,
          index,
          reasons: chainSafetyFlags(chain),
        }))
        .filter(entry => entry.reasons.length > 0)
        .map(entry => ({
          ...entry,
          text: chainText(entry.chain, verbose),
        }));
    }

    function chainOutput(verbose = false) {
      if (!chainReport) return '';
      const allChains = chainReport.chains
        .map((chain, index) => `${index + 1}. ${chainText(chain, verbose)}`)
        .join('\n');
      const flagged = flaggedChainEntries(verbose);
      if (!flagged.length) return allChains;

      const flaggedText = [
        `FLAGGED CHAINS (${flagged.length})`,
        ...flagged.flatMap(entry => [
          `${entry.index + 1}. ${entry.text}`,
          ...entry.reasons.map(reason => `   ! ${reason}`),
        ]),
        '',
        'ALL CHAINS',
      ].join('\n');
      return `${flaggedText}\n${allChains}`;
    }

    function renderChainOutput() {
      chainOutputEl.value = chainOutput(false);
    }

    function renderIllegalChainReport() {
      illegalChainResultsEl.textContent = '';
      illegalChainAreaEl.hidden = !SHOW_AIC_DEBUG;
      if (!SHOW_AIC_DEBUG) return;

      const flagged = flaggedChainEntries();
      illegalChainAreaEl.hidden = flagged.length === 0;
      if (!flagged.length) return;

      illegalChainHeadingEl.textContent = `Flagged / Illegal Chains (${flagged.length})`;
      for (const entry of flagged) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result chain-result-flagged';
        button.textContent = `${entry.index + 1}. ${entry.text} [${entry.reasons.join('; ')}]`;
        button.title = entry.reasons.join('; ');
        button.addEventListener('click', () => selectChain(entry.index));
        item.appendChild(button);
        illegalChainResultsEl.appendChild(item);
      }
    }

    async function copyChainOutput(verbose = false) {
      const text = chainOutput(verbose);
      if (!text) {
        setStatus('No chain output to copy.', 'warn');
        return;
      }

      chainOutputEl.value = text;
      chainOutputEl.focus();
      chainOutputEl.select();

      const copied = await appNamespace.clipboard.copyText(text);
      setStatus(copied ? 'Chain output copied.' : 'Chain output selected.', 'ok');
    }

    function clearHighlightedMove() {
      leaveHistoryPreview();
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = null;
      selectedAlsDof = null;
      selectedAlsDofIndex = null;
      selectedAlsDofSource = 'net';
      selectedAhsDofNetIndex = null;
      selectedAhsDofChainIndex = null;
      activeStep = null;
      lastRemoved = [];
      selectedFishKey = null;
      selectedBoxLineIndex = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedSimpleColoringIndex = null;
      selectedThreeDMedusaIndex = null;
      selectedMultiColoringIndex = null;
      selectedSuperMultiColoringIndex = null;
          selectedThreeDMedusaMultiIndex = null;
      render();
      setStatus('Highlighted move cleared.', 'ok');
    }

    function clearChainSelection() {
      clearHighlightedMove();
    }

    function selectChain(index) {
      selectedAlsId = null;
      selectedAhsId = null;
      selectedChainIndex = index;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      activeStep = null;
      lastRemoved = [];
      selectedFishKey = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      renderBoard();
      renderFishReport();
      renderNakedSubsetReport();
      renderBoxLineReport();
      renderHiddenSubsetReport();
      renderChainReport();
      if (alsSearchFamily) renderAlsSearchResults();
      if (ahsSearchFamily) renderAhsSearchResults();
      setStatus(`Chain ${index + 1} selected.`, 'ok');
      focusMap();
    }

    function renderChainReport() {
      chainResultsEl.textContent = '';
      renderChainOutput();
      renderIllegalChainReport();
      if (!chainReport) {
        selectedChainIndex = null;
        chainResultsEl.textContent = 'No chain search has been run.';
        return;
      }

      const { chains } = chainReport;
      if (selectedChainIndex !== null && selectedChainIndex >= chains.length) selectedChainIndex = null;
      const summary = document.createElement('p');
      summary.textContent = `${chains.length} chains with eliminations.`;
      chainResultsEl.appendChild(summary);

      // Keep the panel bounded, but do not let a large mixed ALS search hide
      // an entire technique family behind the global first-200 slice.
      const visibleIndexes = new Set(
        Array.from({ length: Math.min(200, chains.length) }, (_, index) => index),
      );
      const firstFamilyIndexes = new Map();
      for (let index = 0; index < chains.length; index++) {
        for (const folder of chainFolderInfos(chains[index])) {
          if (!firstFamilyIndexes.has(folder.family)) firstFamilyIndexes.set(folder.family, index);
        }
      }
      for (const index of firstFamilyIndexes.values()) visibleIndexes.add(index);
      const visible = [...visibleIndexes]
        .sort((left, right) => left - right)
        .map(index => ({ chain: chains[index], index }));
      const groups = new Map();
      const folderMemberships = new Map();
      for (const { chain, index } of visible) {
        for (const folder of chainFolderInfos(chain)) {
          const path = chainFolderPath(folder);
          const folderKey = [folder.family, ...path]
            .map(value => value ?? '')
            .join('|');
          const folderLabel = [folder.family, ...path]
            .filter(Boolean)
            .join(' / ');
          const memberships = folderMemberships.get(index) || [];
          if (!memberships.some(location => location.key === folderKey)) {
            memberships.push({ key: folderKey, label: folderLabel });
            folderMemberships.set(index, memberships);
          }
          const group = groups.get(folder.family) || [];
          group.push({
            chain,
            index,
            folderKey,
            path,
            displayName: folderChainText(chain, folder),
          });
          groups.set(folder.family, group);
        }
      }

      const selectedFolderKeys = new Set(
        (folderMemberships.get(selectedChainIndex) || []).map(location => location.key),
      );
      const selectedLocations = folderMemberships.get(selectedChainIndex) || [];
      if (SHOW_AIC_DEBUG && selectedLocations.length) {
        const locations = document.createElement('p');
        locations.className = 'chain-memberships';
        locations.textContent = `Selected chain folders: ${selectedLocations.map(location => location.label).join(' | ')}`;
        chainResultsEl.appendChild(locations);
      }

      const categories = document.createElement('div');
      categories.className = 'chain-categories';
      for (const [name, entries] of groups) {
        const category = document.createElement('details');
        category.className = 'chain-category';
        // A chain can have several folder locations; open every selected path.
        category.open = entries.some(({ folderKey }) => selectedFolderKeys.has(folderKey));

        const categorySummary = document.createElement('summary');
        const categoryName = document.createElement('strong');
        categoryName.className = 'chain-category-name';
        categoryName.textContent = name;
        const categoryCount = document.createElement('span');
        categoryCount.className = 'chain-category-count';
        categoryCount.textContent = `${entries.length} ${entries.length === 1 ? 'chain' : 'chains'}`;
        categorySummary.appendChild(categoryName);
        categorySummary.appendChild(categoryCount);
        category.appendChild(categorySummary);

        const folderTree = document.createElement('div');
        folderTree.className = 'chain-subcategories';
        appendChainFolderTree(folderTree, entries, 0, selectedFolderKeys);
        category.appendChild(folderTree);
        categories.appendChild(category);
      }

      chainResultsEl.appendChild(categories);
      if (chains.length > visible.length) {
        const moreText = document.createElement('p');
        moreText.textContent = `Showing ${visible.length} of ${chains.length} records.`;
        chainResultsEl.appendChild(moreText);
      }
    }

    function renderAlsSearchResults() {
      alsSearchResultsEl.textContent = '';
      if (!alsSearchFamily || !chainReport) {
        alsSearchResultsEl.textContent = 'No dedicated ALS search has been run.';
        return;
      }

      const summary = document.createElement('p');
      summary.textContent = `${chainReport.chains.length} ${alsSearchFamily.toUpperCase()} result${chainReport.chains.length === 1 ? '' : 's'}.`;
      alsSearchResultsEl.appendChild(summary);
      if (!chainReport.chains.length) return;

      const list = document.createElement('div');
      list.className = 'chain-list';
      chainReport.chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        const select = () => {
          selectChain(index);
          openReportPanel(chainResultsEl);
        };
        button.addEventListener('click', select);
        item.appendChild(button);
        list.appendChild(item);
      });
      alsSearchResultsEl.appendChild(list);
      if (chainReport.chains.length > 200) {
        const moreText = document.createElement('p');
        moreText.textContent = `Showing 200 of ${chainReport.chains.length} records.`;
        alsSearchResultsEl.appendChild(moreText);
      }
    }

    function renderAhsSearchResults() {
      ahsSearchResultsEl.textContent = '';
      if (!ahsSearchFamily || !chainReport) {
        ahsSearchResultsEl.textContent = 'No AHS search has been run.';
        return;
      }

      const summary = document.createElement('p');
      const label = ahsSearchFamily === 'ahs-xy'
        ? 'AHS-XY'
        : ahsSearchFamily === 'ahs-chain' ? 'AHS-Chain' : 'AHS-XZ';
      summary.textContent = `${chainReport.chains.length} ${label} result${chainReport.chains.length === 1 ? '' : 's'} found.`;
      if (ahsSearchFamily === 'ahs-xy' && chainReport.stats?.truncated) {
        summary.textContent += ` Checked ${chainReport.stats.triplesChecked.toLocaleString()} three-set paths; search limit reached.`;
      }
      ahsSearchResultsEl.appendChild(summary);
      if (!chainReport.chains.length) return;

      const list = document.createElement('ul');
      list.className = 'chain-list';
      chainReport.chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        button.addEventListener('click', () => {
          selectChain(index);
          openReportPanel(chainResultsEl);
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      ahsSearchResultsEl.appendChild(list);
    }

    function renderAlcXzResults() {
      alcSearchResultsEl.textContent = '';
      if (!alcXzReport) {
        alcSearchResultsEl.textContent = 'No ALC-XZ search has been run.';
        return;
      }
      const chains = alcXzReport.chains || [];
      const summary = document.createElement('p');
      summary.textContent = `${chains.length} ALC-XZ result${chains.length === 1 ? '' : 's'} found.`
        + (alcXzReport.stats?.truncated ? ' Search limit reached.' : '');
      alcSearchResultsEl.appendChild(summary);
      if (!chains.length) return;

      const list = document.createElement('ol');
      list.className = 'chain-list';
      chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        const contacts = chain.alcXz?.contacts || [];
        button.title = chain.alcXz
          ? `ALS + AHS; ${contacts.length} weak digit contact${contacts.length === 1 ? '' : 's'}`
          : 'ALC-XZ chain-engine result';
        button.addEventListener('click', () => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcXzResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      alcSearchResultsEl.appendChild(list);
    }

    function renderAlcXyResults() {
      alcSearchResultsEl.textContent = '';
      if (!alcXyReport) {
        alcSearchResultsEl.textContent = 'No ALC-XY search has been run.';
        return;
      }
      const chains = alcXyReport.chains || [];
      const summary = document.createElement('p');
      summary.textContent = `${chains.length} ALC-XY result${chains.length === 1 ? '' : 's'} found.`
        + (alcXyReport.stats?.truncated ? ' Search limit reached.' : '');
      alcSearchResultsEl.appendChild(summary);
      if (!chains.length) return;

      const list = document.createElement('ol');
      list.className = 'chain-list';
      chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        button.title = 'Mixed ALC-XY: at least one ALS, one AHS, and one additional node';
        button.addEventListener('click', () => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcXyResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      alcSearchResultsEl.appendChild(list);
    }

    function renderAlcChainResults() {
      alcSearchResultsEl.textContent = '';
      if (!alcChainReport) {
        alcSearchResultsEl.textContent = 'No ALC-Chain search has been run.';
        return;
      }
      const chains = alcChainReport.chains || [];
      const summary = document.createElement('p');
      summary.textContent = `${chains.length} ALC-Chain result${chains.length === 1 ? '' : 's'} found.`
        + (alcChainReport.stats?.truncated ? ' Search limit reached.' : '');
      alcSearchResultsEl.appendChild(summary);
      if (!chains.length) return;

      const list = document.createElement('ol');
      list.className = 'chain-list';
      chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        button.title = 'Mixed ALC-Chain: at least one ALS, one AHS, and one additional node';
        button.addEventListener('click', () => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcChainResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      alcSearchResultsEl.appendChild(list);
    }

    function renderAlcDofResults() {
      alcSearchResultsEl.textContent = '';
      if (!alcDofReport) {
        alcSearchResultsEl.textContent = 'No ALC-DOF Chain search has been run.';
        return;
      }
      const chains = alcDofReport.chains || [];
      const summary = document.createElement('p');
      summary.textContent = `${chains.length} ALC-DOF Chain result${chains.length === 1 ? '' : 's'} found.`
        + (alcDofReport.stats?.truncated ? ' Search limit reached.' : '');
      alcSearchResultsEl.appendChild(summary);
      if (!chains.length) return;
      const list = document.createElement('ol');
      list.className = 'chain-list';
      chains.slice(0, 200).forEach((chain, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chain-result${index === selectedChainIndex ? ' selected' : ''}`;
        button.textContent = `${index + 1}. ${chainText(chain)}`;
        button.title = `ALC-DOF Chain rooted in ${chain.alcDof?.rootType || 'DOF'} and extended with ALS/AHS modules`;
        button.addEventListener('click', () => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcDofResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      alcSearchResultsEl.appendChild(list);
    }

    function alsDofTechniqueInfo(result) {
      const mode = result?.mode === 'dds'
        ? 'Disjointed Distributed Subset'
        : result?.mode === 'almost-dds'
          ? 'Almost Disjointed Distributed Subset'
          : result?.mode === 'chain'
            ? (result.hasHydra ? 'Hydra ALS DOF Chain' : 'ALS DOF Chain')
          : 'ALS DOF';
      const form = result?.isRing
        ? (result.ringForm === 'single-auxiliary'
          ? 'Ring / Single Auxiliary'
          : result.ringForm === 'fluid-auxiliary'
            ? 'Ring / Fluid Auxiliary'
            : result.ringForm === 'collection'
              ? 'Ring / Collection'
              : result.ringForm === 'almost-dds'
                ? 'Ring'
                : 'Ring')
        : 'Open';
      return {
        family: mode,
        form,
        dof: Number.isInteger(result?.size) ? result.size : 0,
        label: `${mode} - ${form}`,
      };
    }

    function renderAlsDofResultList(container, results, source = 'net') {
      const familyGroups = new Map();
      results.filter(result => result && typeof result === 'object').forEach((result, index) => {
        const info = alsDofTechniqueInfo(result);
        const family = familyGroups.get(info.family) || new Map();
        const form = family.get(info.form) || new Map();
        const dof = form.get(info.dof) || [];
        dof.push({ result, index, info });
        form.set(info.dof, dof);
        family.set(info.form, form);
        familyGroups.set(info.family, family);
      });

      const categories = document.createElement('div');
      categories.className = 'chain-categories';

      for (const [familyName, formGroups] of familyGroups) {
        const familyEntries = [...formGroups.values()].flatMap(dofGroups =>
          [...dofGroups.values()].flat(),
        );
        const familyPanel = document.createElement('details');
        familyPanel.className = 'chain-category';
        familyPanel.open = selectedAlsDofSource === source
          && familyEntries.some(({ index }) => index === selectedAlsDofIndex);

        const familySummary = document.createElement('summary');
        const familyLabel = document.createElement('strong');
        familyLabel.className = 'chain-category-name';
        familyLabel.textContent = familyName;
        const familyCount = document.createElement('span');
        familyCount.className = 'chain-category-count';
        familyCount.textContent = `${familyEntries.length} ${familyEntries.length === 1 ? 'result' : 'results'}`;
        familySummary.appendChild(familyLabel);
        familySummary.appendChild(familyCount);
        familyPanel.appendChild(familySummary);

        const forms = document.createElement('div');
        forms.className = 'chain-subcategories';
        for (const [formName, dofGroups] of formGroups) {
          const formEntries = [...dofGroups.values()].flat();
          const formPanel = document.createElement('details');
          formPanel.className = 'chain-subcategory';
          formPanel.open = selectedAlsDofSource === source
            && formEntries.some(({ index }) => index === selectedAlsDofIndex);

          const formSummary = document.createElement('summary');
          const formLabel = document.createElement('strong');
          formLabel.textContent = formName;
          const formCount = document.createElement('span');
          formCount.className = 'chain-category-count';
          formCount.textContent = `${formEntries.length} ${formEntries.length === 1 ? 'result' : 'results'}`;
          formSummary.appendChild(formLabel);
          formSummary.appendChild(formCount);
          formPanel.appendChild(formSummary);

          const dofPanels = document.createElement('div');
          dofPanels.className = 'chain-subcategories';
          for (const [dof, entries] of dofGroups) {
            const dofPanel = document.createElement('details');
            dofPanel.className = 'chain-subcategory';
            dofPanel.open = selectedAlsDofSource === source
              && entries.some(({ index }) => index === selectedAlsDofIndex);

            const dofSummary = document.createElement('summary');
            const dofLabel = document.createElement('strong');
            dofLabel.textContent = `DOF ${dof}`;
            const dofCount = document.createElement('span');
            dofCount.className = 'chain-category-count';
            dofCount.textContent = `${entries.length} ${entries.length === 1 ? 'result' : 'results'}`;
            dofSummary.appendChild(dofLabel);
            dofSummary.appendChild(dofCount);
            dofPanel.appendChild(dofSummary);

            const list = document.createElement('ul');
            list.className = 'chain-list';
            for (const { result, index, info } of entries.slice(0, 200)) {
              const item = document.createElement('li');
              const button = document.createElement('button');
              button.type = 'button';
              button.className = 'chain-result';
              if (selectedAlsDofSource === source && selectedAlsDofIndex === index) {
                button.classList.add('selected');
              }
              button.textContent = `${index + 1}. ${info.label}: ${core.formatAlsDof(result)}`;
              button.title = 'Display this ALS-DOF result on the grid';
              const select = () => {
                selectedAlsDofIndex = index;
                selectedAlsDofSource = source;
                selectedAlsDof = null;
                selectedAlsHydraIndex = null;
                selectedAlsId = null;
                selectedChainIndex = null;
                selectedStrongLinkType = null;
                selectedStrongLinkIndex = null;
                activeStep = null;
                lastRemoved = [];
                renderBoard();
                renderAlsDofReport();
                focusMap();
                setStatus(`ALS-DOF result ${index + 1} displayed.`, 'ok');
              };
              button.addEventListener('click', select);
              item.appendChild(button);
              list.appendChild(item);
            }
            if (entries.length > 200) {
              const more = document.createElement('li');
              more.textContent = `Showing 200 of ${entries.length} DOF ${dof} records.`;
              list.appendChild(more);
            }
            dofPanel.appendChild(list);
            dofPanels.appendChild(dofPanel);
          }
          formPanel.appendChild(dofPanels);
          forms.appendChild(formPanel);
        }
        familyPanel.appendChild(forms);
        categories.appendChild(familyPanel);
      }

      container.appendChild(categories);
    }

    function renderAlsDofSection(container, report, source, label) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No ' + label + ' search has been run.';
        return;
      }
      if (selectedAlsDofSource === source
        && selectedAlsDofIndex !== null
        && selectedAlsDofIndex >= report.results.length) {
        selectedAlsDofIndex = null;
      }

      const summary = document.createElement('p');
      if (source === 'chain') {
        summary.textContent = `${report.results.length} ALS-DOF chain result${report.results.length === 1 ? '' : 's'}. `
          + `${report.stats.alsRecords} ALS records checked`
          + `; ${report.stats.hydraChainResults || 0} Hydra chains`
          + `; digit/DOF limit ${report.options.maxDigits}`
          + `; ${report.stats.constructionCandidates || 0} complete two-endpoint constructions checked`
          + `, ${report.stats.zeroEliminationCandidates || 0} had no eliminations`
          + `, ${report.stats.verifierRejected || 0} rejected by verifier`
          + `; ${report.stats.aicChainsChecked || 0} AIC branches checked`
          + `${report.stats.truncated ? '; result limit reached.' : '.'}`;
      } else {
        summary.textContent = `${report.results.length} ALS-DOF net result${report.results.length === 1 ? '' : 's'}. `
          + `${report.stats.alsRecords} ALS records checked`
          + `; ALS DOF ${report.stats.hubNets || 0}`
          + `, Disjointed Distributed Subset ${report.stats.ddsNets || 0}`
          + `, Almost Disjointed Distributed Subset ${report.stats.almostDdsNets || 0}`
          + `${report.stats.truncated ? '; result limit reached.' : '.'}`;
      }
      container.appendChild(summary);

      const rejected = report.rejectedResults || [];
      if (rejected.length) {
        const flaggedArea = document.createElement('section');
        flaggedArea.className = 'chain-safety-warning';
        const flaggedHeading = document.createElement('h3');
        flaggedHeading.textContent = `Flagged / Rejected ${label} (${rejected.length})`;
        flaggedArea.appendChild(flaggedHeading);
        const flaggedList = document.createElement('ul');
        for (const entry of rejected) {
          const item = document.createElement('li');
          const detail = document.createElement('div');
          detail.className = 'chain-result chain-result-flagged';
          const notation = core.formatAlsDof(entry.result);
          const reasons = entry.verification?.errors?.join('; ') || 'Verifier rejected the record.';
          detail.textContent = `${notation} [${reasons}]`;
          detail.title = reasons;
          item.appendChild(detail);
          flaggedList.appendChild(item);
        }
        flaggedArea.appendChild(flaggedList);
        container.appendChild(flaggedArea);
      }
      if (!report.results.length) return;

      renderAlsDofResultList(container, report.results, source);
      if (report.results.length > 500) {
        const more = document.createElement('p');
        more.textContent = `Showing the first 500 records in the technique lists.`;
        container.appendChild(more);
      }
    }

    function renderAlsDofReport() {
      renderAlsDofSection(alsDofResultsEl, alsDofReport, 'net', 'ALS-DOF nets');
      renderAlsDofSection(alsDofChainResultsEl, alsDofChainReport, 'chain', 'ALS-DOF chains');
    }

    function renderHydraReport(report, container, family) {
      container.textContent = '';
      if (!report) {
        container.textContent = `No ${family}-Hydra search has been run.`;
        return;
      }
      const results = report.results || [];
      const summary = document.createElement('p');
      summary.textContent = `${results.length} ${family}-Hydra result${results.length === 1 ? '' : 's'}. `
        + `${report.stats?.aicChainsChecked || 0} verified AIC chain${(report.stats?.aicChainsChecked || 0) === 1 ? '' : 's'} checked; `
        + `${report.stats?.hydraParticipants || 0} ${family}-chain participant${(report.stats?.hydraParticipants || 0) === 1 ? '' : 's'} tested.`;
      container.appendChild(summary);
      if (!results.length) {
        const empty = document.createElement('p');
        empty.textContent = 'No verified Hydra continuation was found.';
        container.appendChild(empty);
        return;
      }
      const list = document.createElement('ul');
      list.className = 'chain-list';
      results.slice(0, 500).forEach((result, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (selectedHydraFamily === family && selectedAlsHydraIndex === index) {
          button.classList.add('selected');
        }
        button.textContent = `${index + 1}. ${formatHydraResult(result)}`;
        button.title = `Display this Hydra ${family}-DOF continuation on the grid`;
        button.addEventListener('click', () => {
          if (family === 'AHS') ahsHydraReport = report;
          else if (family === 'ALC') alcHydraReport = report;
          else alsHydraReport = report;
          selectedHydraFamily = family;
          selectedAlsHydraIndex = index;
          selectedAlsDof = null;
          selectedAlsDofIndex = null;
          selectedAlsDofSource = 'net';
          selectedAlsId = null;
          selectedChainIndex = null;
          selectedStrongLinkType = null;
          selectedStrongLinkIndex = null;
          activeStep = null;
          lastRemoved = [];
          renderBoard();
          renderHydraReport(report, container, family);
          focusMap();
          setStatus(`${family}-Hydra result ${index + 1} displayed.`, 'ok');
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      container.appendChild(list);
    }

    function renderAlsHydraReport() {
      renderHydraReport(alsHydraReport, alsHydraResultsEl, 'ALS');
    }

    function renderAhsHydraReport() {
      renderHydraReport(ahsHydraReport, ahsHydraResultsEl, 'AHS');
    }

    function renderAlcHydraReport() {
      renderHydraReport(alcHydraReport, alcHydraResultsEl, 'ALC');
    }

    function snapshotVisualState() {
      return {
        originalPuzzle: [...originalPuzzle],
        puzzle: [...puzzle],
        promotedValues: [...promotedValues],
        cand: core.cloneCandidates(cand),
        solution: solution ? [...solution] : null,
        activeStep,
        lastRemoved: lastRemoved.map(item => ({ ...item })),
        promotionQueue: promotionQueue.map(item => ({ ...item })),
        visual: {
          pomReport,
          alsReport,
          alsLinkReport,
          alsDofReport,
          alsDofChainReport,
          alsHydraReport,
          ahsHydraReport,
          alcHydraReport,
          selectedAlsHydraIndex,
          selectedHydraFamily,
          ahsReport,
          ahsDofReport,
          ahsDofChainReport,
          strongLinkReport,
          fishReport,
          boxLineReport,
          selectedBoxLineIndex,
          nakedSubsetReport,
          hiddenSubsetReport,
          chainReport,
          alsSearchFamily,
          selectedAlsDof,
          selectedAlsDofIndex,
          selectedAlsDofSource,
          selectedAlsId,
          openAlsSizeGroups: [...openAlsSizeGroups],
          selectedAhsDof,
          selectedAhsDofNetIndex,
          selectedAhsDofChainIndex,
          selectedAhsId,
          openAhsSizeGroups: [...openAhsSizeGroups],
          selectedStrongLinkType,
          selectedStrongLinkIndex,
          selectedFishCategory,
          selectedFishSize,
          selectedFishKey,
          selectedNakedSubsetSize,
          selectedNakedSubsetKey,
          selectedHiddenSubsetSize,
          selectedHiddenSubsetKey,
          selectedChainIndex,
          gridView,
          showFixedInVantage,
          selectedPlayerCell,
          selectedPlayerDigit,
          playerSolveBackups: clonePlayerSolveBackups(),
          solutionStepsPanelOpen: solutionStepsPanelEl?.open ?? false,
        },
      };
    }

    function snapshotState() {
      return {
        ...snapshotVisualState(),
        cycle,
        logEntries: logEntries.map(entry => ({ ...entry })),
        ratingReport: ratingReport ? { ...ratingReport } : null,
      };
    }

    function restoreVisualState(state) {
      originalPuzzle = [...(state.originalPuzzle || originalPuzzle)];
      puzzle = [...state.puzzle];
      promotedValues = [...state.promotedValues];
      cand = core.cloneCandidates(state.cand);
      solution = Array.isArray(state.solution) ? [...state.solution] : null;
      activeStep = state.activeStep;
      lastRemoved = (state.lastRemoved || []).map(item => ({ ...item }));
      promotionQueue = (state.promotionQueue || []).map(item => ({ ...item }));

      const visual = state.visual || {};
      pomReport = visual.pomReport || null;
      alsReport = visual.alsReport || null;
      alsLinkReport = visual.alsLinkReport || null;
      alsDofReport = visual.alsDofReport || null;
      alsDofChainReport = visual.alsDofChainReport || null;
      alsHydraReport = visual.alsHydraReport || null;
      ahsHydraReport = visual.ahsHydraReport || null;
      alcHydraReport = visual.alcHydraReport || null;
      selectedAlsHydraIndex = visual.selectedAlsHydraIndex ?? null;
      selectedHydraFamily = visual.selectedHydraFamily ?? null;
      ahsReport = visual.ahsReport || null;
      ahsDofReport = visual.ahsDofReport || null;
      ahsDofChainReport = visual.ahsDofChainReport || null;
      strongLinkReport = visual.strongLinkReport || null;
      fishReport = visual.fishReport || null;
      boxLineReport = visual.boxLineReport || null;
      selectedBoxLineIndex = visual.selectedBoxLineIndex ?? null;
      nakedSubsetReport = visual.nakedSubsetReport || null;
      hiddenSubsetReport = visual.hiddenSubsetReport || null;
      chainReport = visual.chainReport || null;
      alsSearchFamily = visual.alsSearchFamily || null;
      selectedAlsDof = visual.selectedAlsDof ?? null;
      selectedAlsDofIndex = visual.selectedAlsDofIndex ?? null;
      selectedAlsDofSource = visual.selectedAlsDofSource || 'net';
      selectedAlsId = visual.selectedAlsId ?? null;
      openAlsSizeGroups.clear();
      for (const value of visual.openAlsSizeGroups || []) openAlsSizeGroups.add(value);
      selectedAhsDof = visual.selectedAhsDof ?? null;
      selectedAhsDofNetIndex = visual.selectedAhsDofNetIndex ?? null;
      selectedAhsDofChainIndex = visual.selectedAhsDofChainIndex ?? null;
      selectedAhsId = visual.selectedAhsId ?? null;
      openAhsSizeGroups.clear();
      for (const value of visual.openAhsSizeGroups || []) openAhsSizeGroups.add(value);
      selectedStrongLinkType = visual.selectedStrongLinkType ?? null;
      selectedStrongLinkIndex = visual.selectedStrongLinkIndex ?? null;
      selectedFishCategory = visual.selectedFishCategory ?? null;
      selectedFishSize = visual.selectedFishSize ?? null;
      selectedFishKey = visual.selectedFishKey ?? null;
      selectedNakedSubsetSize = visual.selectedNakedSubsetSize ?? null;
      selectedNakedSubsetKey = visual.selectedNakedSubsetKey ?? null;
      selectedHiddenSubsetSize = visual.selectedHiddenSubsetSize ?? null;
      selectedHiddenSubsetKey = visual.selectedHiddenSubsetKey ?? null;
      selectedChainIndex = visual.selectedChainIndex ?? null;
      gridView = visual.gridView || 'RC';
      showFixedInVantage = Boolean(visual.showFixedInVantage);
      showFixedInVantageEl.checked = showFixedInVantage;
      selectedPlayerCell = visual.selectedPlayerCell ?? null;
      selectedPlayerDigit = visual.selectedPlayerDigit ?? null;
      restorePlayerSolveBackups(visual.playerSolveBackups);
      if (solutionStepsPanelEl) {
        solutionStepsPanelEl.open = Boolean(visual.solutionStepsPanelOpen);
      }
    }

    function restoreState(state) {
      restoreVisualState(state);
      cycle = state.cycle;
      logEntries = state.logEntries.map(entry => ({ ...entry }));
      ratingReport = state.ratingReport ? { ...state.ratingReport } : null;
    }

    function leaveHistoryPreview() {
      return historyState.leave();
    }

    function inspectLogStep(index) {
      const entry = logEntries[index];
      if (!entry?.displayState) {
        setStatus('This older step has no saved board snapshot.', 'warn');
        return;
      }

      historyState.inspect(index, entry);
    }

    function resetCandidates(message = 'Candidates reset from the current puzzle.', startingCandidates = null, nextRating = null) {
      leaveHistoryPreview();
      clearToyAutomorphResults();
      clearToyMiniLex();
      clearToyMinimizerResults();
      setManualMode(false, false);
      puzzle = [...originalPuzzle];
      promotedValues = new Array(81).fill(0);
      cand = startingCandidates ? core.cloneCandidates(startingCandidates) : core.allCandidates(puzzle);
      // Keep every technique panel and selection on the same reset path.
      resetAnalysisAfterPlayerEdit();
      cycle = 0;
      activeStep = null;
      lastRemoved = [];
      promotionQueue = [];
      logEntries = [];
      ratingReport = nextRating;
      pomReport = null;
      alsReport = null;
      alsLinkReport = null;
      alsDofReport = null;
      alsDofChainReport = null;
      alsHydraReport = null;
      ahsHydraReport = null;
      alcHydraReport = null;
      selectedAlsHydraIndex = null;
      selectedHydraFamily = null;
      ahsReport = null;
      alcXzReport = null;
      ahsLinkReport = null;
      mslsReport = null;
      selectedAlsDof = null;
      selectedAlsDofIndex = null;
      selectedAlsDofSource = 'net';
      selectedAlsId = null;
      openAlsSizeGroups.clear();
      selectedAhsDof = null;
      selectedAhsDofNetIndex = null;
      selectedAhsDofChainIndex = null;
      selectedAhsId = null;
      openAhsSizeGroups.clear();
      strongLinkReport = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      simpleColoringReport = null;
      selectedSimpleColoringIndex = null;
      threeDMedusaReport = null;
      selectedThreeDMedusaIndex = null;
      threeDMedusaMultiReport = null;
          selectedThreeDMedusaMultiIndex = null;
      multiColoringReport = null;
      selectedMultiColoringIndex = null;
          selectedThreeDMedusaMultiIndex = null;
      fishReport = null;
      selectedFishCategory = null;
      selectedFishSize = null;
      selectedFishKey = null;
      nakedSubsetReport = null;
      selectedNakedSubsetSize = null;
      selectedNakedSubsetKey = null;
      hiddenSubsetReport = null;
      selectedHiddenSubsetSize = null;
      selectedHiddenSubsetKey = null;
      chainReport = null;
      if (solutionStepsPanelEl) solutionStepsPanelEl.open = false;
      selectedPlayerCell = null;
      selectedPlayerDigit = null;
      playerPromotionMode = false;
      playerSolveBackups = new Map();
      undoStack = [];
      redoStack = [];
      setStatus(message, 'ok');
      render();
    }

    function promotionsForStep(step, removed) {
      const promotions = new Map();
      const addPromotion = (cell, digit, mode = 'singleton', sector = null) => {
        if (puzzle[cell] || !(cand[cell] || []).includes(digit)) return;
        const key = `${cell}:${digit}`;
        if (!promotions.has(key)) promotions.set(key, { cell, digit, mode, sector, tech: step?.tech });
      };

      for (const item of removed || []) {
        const cell = item.cell;
        if (!puzzle[cell] && (cand[cell] || []).length === 1) {
          addPromotion(cell, cand[cell][0]);
        }
      }

      if (['naked-single', 'hidden-single'].includes(step?.tech)) {
        for (const cell of step.at || step.vertices || []) {
          if (!puzzle[cell] && (cand[cell] || []).length === 1) addPromotion(cell, cand[cell][0]);
        }
      }
      if (step?.tech === 'last-man-standing') {
        for (const cell of step.at || step.vertices || []) {
          if (!puzzle[cell] && (cand[cell] || []).length === 1) addPromotion(cell, cand[cell][0]);
        }
      }

      if (step?.tech?.startsWith('hidden-')) {
        const unitIndex = Number.isInteger(Number(step.genericSubset?.sector))
          ? Number(step.genericSubset.sector)
          : step.base?.type === 'row'
            ? Number(step.base.indices?.[0])
            : step.base?.type === 'col'
              ? 9 + Number(step.base.indices?.[0])
              : step.base?.type === 'box'
                ? 18 + Number(step.base.indices?.[0])
                : ['variant-sector', 'diagonal', 'anti-diagonal'].includes(step.base?.type)
                  ? Number(step.base.indices?.[0])
                : -1;
        const unit = unitIndex >= 0 && unitIndex < core.UNITS.length
          ? core.UNITS[unitIndex]
          : [];
        const subsetCells = new Set(step.at || step.vertices || []);
        const hiddenPlacements = [];

        for (const digit of step.digits || []) {
          const locations = unit.filter(cell =>
            !puzzle[cell] && (cand[cell] || []).includes(digit),
          );
          if (locations.length === 1 && subsetCells.has(locations[0])) {
            hiddenPlacements.push({ cell: locations[0], digit });
          }
        }

        // Two selected digits sharing one cell are still a bivalue choice,
        // not two solved placements.
        const placementsByCell = new Map();
        for (const placement of hiddenPlacements) {
          const digits = placementsByCell.get(placement.cell) || [];
          digits.push(placement.digit);
          placementsByCell.set(placement.cell, digits);
        }
        for (const placement of hiddenPlacements) {
          if ((placementsByCell.get(placement.cell) || []).length === 1) {
            addPromotion(placement.cell, placement.digit, 'hidden-subset', unitIndex);
          }
        }
      }

      return [...promotions.values()]
        .sort((a, b) => a.cell - b.cell || a.digit - b.digit);
    }

    function queuePromotions(step, removed) {
      promotionQueue = promotionsForStep(step, removed);
      return promotionQueue;
    }

    function applyQueuedPromotions() {
      const pending = promotionQueue.splice(0);
      const promoted = [];

      for (const promotion of pending) {
        const { cell, digit } = promotion;
        if (puzzle[cell] || !(cand[cell] || []).includes(digit)) continue;

        if (promotion.mode === 'hidden-subset') {
          const unitIndex = Number(promotion.sector);
          const locations = unitIndex >= 0 && unitIndex < core.UNITS.length
            ? core.UNITS[unitIndex].filter(other =>
              !puzzle[other] && (cand[other] || []).includes(digit),
            )
            : [];
          if (locations.length !== 1 || locations[0] !== cell) continue;
        } else if ((cand[cell] || []).length !== 1 || cand[cell][0] !== digit) {
          continue;
        }
        if (typeof core.canPlace === 'function' && !core.canPlace(puzzle, cell, digit)) {
          continue;
        }

        puzzle[cell] = digit;
        promotedValues[cell] = digit;
        cand[cell] = [];
        promoted.push(promotion);

        // Recompute the legal candidate envelope after every queued
        // promotion. This keeps automatic promotions consistent with manual
        // placement for Anti-King, Anti-Knight, and Non-Consecutive rules.
        for (let other = 0; other < 81; other += 1) {
          if (other === cell || puzzle[other] || promotedValues[other]) continue;
          const legal = new Set(core.candidatesFor(puzzle, other));
          cand[other] = (cand[other] || []).filter(value => legal.has(value));
        }
      }

      return promoted;
    }

    const { summary: promotionSummary } = appNamespace.promotionView.create(core.cellName);

    // Final move gate shared by Next, Run All, and selected structure results.
    // The technique engines propose candidates; the solver independently tests
    // each proposed value against the current puzzle before accepting its
    // removal. Candidate-space inspection grids without a solvable puzzle are
    // intentionally left available for diagnosis and skip this proof.
    function verifyEliminationsByCompletion(items) {
      const proposed = (items || []).filter(item =>
        Number.isInteger(item?.cell) && Number.isInteger(item?.digit));
      if (!proposed.length) return { ok: true, checked: 0 };
      if (!solution || !puzzle?.some(Boolean)) return { ok: true, checked: 0, skipped: true };

      const seen = new Set();
      for (const item of proposed) {
        const key = `${item.cell}:${item.digit}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!(cand[item.cell] || []).includes(item.digit)) {
          return { ok: false, errors: [`${core.cellName(item.cell)}<>${item.digit} is no longer a candidate.`] };
        }

        const forced = [...puzzle];
        if (forced[item.cell] && forced[item.cell] !== item.digit) {
          return { ok: false, errors: [`${core.cellName(item.cell)} is already fixed.`] };
        }
        forced[item.cell] = item.digit;
        const completions = typeof core.countSolutionsDlx === 'function'
          ? core.countSolutionsDlx(forced, 1)
          : core.solveDlx(forced, 1).count;
        if (completions > 0) {
          return {
            ok: false,
            errors: [`${core.cellName(item.cell)}=${item.digit} still permits a completion.`],
            rejected: item,
          };
        }
      }
      return { ok: true, checked: seen.size };
    }

    function applyCycleChoice(before, promoted, choice) {
      if (!choice?.step) {
        activeStep = null;
        lastRemoved = [];
        if (promoted.length) {
          cycle += 1;
          undoStack.push(before);
          redoStack = [];
          setStatus(
            boardIsComplete()
              ? `${promotionSummary(promoted)} promoted. Completed.`
              : `${promotionSummary(promoted)} promoted. No enabled move found.`,
            'ok',
          );
          return true;
        }
        const diagnostics = lastChainSelectionDiagnostics;
        const diagnosticText = diagnostics?.received
          ? ` Chain filters: ${diagnostics.received} received, ${diagnostics.phaseRejected} phase, ${diagnostics.toggleRejected} toggle, ${diagnostics.noElimination} empty, ${diagnostics.safetyRejected} safety, ${diagnostics.ratingRejected} rating, ${diagnostics.accepted} accepted.`
          : '';
        setStatus(`No enabled move found. Candidate grid is current.${diagnosticText}`, 'warn');
        return false;
      }

      const step = choice.step;
      // Preserve the candidate state that produced the selected report. The
      // live grid is about to advance, but the explanation panel must keep
      // showing the complete proof that was returned for this move.
      const reportCandidateGrid = choice.report
        ? core.cloneCandidates(cand)
        : null;

      const verification = verifyEliminationsByCompletion(
        core.eliminationItems(step.elim, cand),
      );
      if (!verification.ok) {
        activeStep = null;
        lastRemoved = [];
        setStatus(
          `Move rejected by independent verification: ${verification.errors.join('; ')}`,
          'warn',
        );
        return false;
      }

      const removed = core.applyEliminations(cand, step.elim);
      if (!removed.length) {
        if (step.tech === 'last-man-standing') {
          const queued = queuePromotions(step, removed);
          if (!queued.length) {
            activeStep = null;
            lastRemoved = [];
            setStatus('Last Man Standing found no promotable cell.', 'warn');
            return false;
          }

          cycle += 1;
          activeStep = step;
          lastRemoved = [];
          chainReport = null;
          selectedChainIndex = null;
          undoStack.push(before);
          redoStack = [];
          appendStep(step);
          setStatus(`${displayTech(step.tech)} found. ${promotionSummary(queued)} queued for the next cycle. Candidate grid unchanged.`, 'ok');
          return true;
        }

        activeStep = null;
        lastRemoved = [];
        if (promoted.length) {
          cycle += 1;
          undoStack.push(before);
          redoStack = [];
          setStatus(`${promotionSummary(promoted)} promoted. No real elimination remained.`, 'ok');
          return true;
        }
        setStatus('No real elimination remained. Candidate grid is current.', 'warn');
        return false;
      }

      cycle += 1;
      activeStep = step;
      lastRemoved = removed;
      if (step.tech === 'als-dof' && choice.alsDofReport) {
        alsDofReport = choice.alsDofReport;
        selectedAlsDofSource = choice.alsDofSource || 'net';
        selectedAlsDofIndex = choice.alsDofIndex ?? null;
        selectedAlsDof = null;
        chainReport = null;
        selectedChainIndex = null;
      } else {
        selectedAlsDofIndex = null;
        chainReport = choice.report
          ? { ...choice.report, candidateGrid: reportCandidateGrid }
          : null;
        selectedChainIndex = choice.report ? choice.index : null;
      }
      undoStack.push(before);
      redoStack = [];

      const queued = queuePromotions(step, removed);
      appendStep(step);
      const promotionText = queued.length
        ? ` ${promotionSummary(queued)} queued for the next cycle.`
        : '';
      const promotedText = promoted.length
        ? ` ${promotionSummary(promoted)} promoted.`
        : '';
      setStatus(`${displayTech(step.tech)} applied.${promotedText}${promotionText} Candidate grid updated for the next cycle.`, 'ok');
      return true;
    }

    function clearSearchResultsAfterApply(preserveColouringMethod = null) {
      pomReport = null;
      alsReport = null;
      alsLinkReport = null;
      alsDofReport = null;
      alsDofChainReport = null;
      alsHydraReport = null;
      ahsHydraReport = null;
      alcHydraReport = null;
      selectedAlsHydraIndex = null;
      selectedHydraFamily = null;
      ahsReport = null;
      ahsLinkReport = null;
      ahsDofReport = null;
      ahsDofChainReport = null;
      alcXzReport = null;
      alcXyReport = null;
      alcChainReport = null;
      alcDofReport = null;
      mslsReport = null;
      strongLinkReport = null;
      fishReport = null;
      boxLineReport = null;
      nakedSubsetReport = null;
      hiddenSubsetReport = null;
      chainReport = null;
      alsSearchFamily = null;
      ahsSearchFamily = null;
      selectedAlsId = null;
      selectedAhsId = null;
      selectedAlsDof = null;
      selectedAlsDofIndex = null;
      selectedAhsDof = null;
      selectedAhsDofNetIndex = null;
      selectedAhsDofChainIndex = null;
      selectedStrongLinkType = null;
      selectedStrongLinkIndex = null;
      selectedFishKey = null;
      selectedNakedSubsetKey = null;
      selectedHiddenSubsetKey = null;
      selectedChainIndex = null;
      selectedMslsIndex = null;
      if (preserveColouringMethod !== 'simple') simpleColoringReport = null;
      if (preserveColouringMethod !== 'medusa') threeDMedusaReport = null;
      if (preserveColouringMethod !== 'medusaMulti') threeDMedusaMultiReport = null;
      if (preserveColouringMethod !== 'multi') multiColoringReport = null;
      if (preserveColouringMethod !== 'superMulti') superMultiColoringReport = null;
      if (preserveColouringMethod !== 'simple') selectedSimpleColoringIndex = null;
      if (preserveColouringMethod !== 'medusa') selectedThreeDMedusaIndex = null;
      if (preserveColouringMethod !== 'medusaMulti') selectedThreeDMedusaMultiIndex = null;
      if (preserveColouringMethod !== 'multi') selectedMultiColoringIndex = null;
      if (preserveColouringMethod !== 'superMulti') selectedSuperMultiColoringIndex = null;
      // Dedicated ALS/AHS/ALC result panes are rendered only by their own
      // search handlers, so clear their visible lists explicitly as well.
      for (const [element, message] of [
        [alsSearchResultsEl, 'No dedicated ALS search has been run.'],
        [ahsSearchResultsEl, 'No AHS search has been run.'],
        [alcSearchResultsEl, 'No ALC search has been run.'],
      ]) {
        if (!element) continue;
        element.textContent = message;
      }
    }

    function interactiveTechniqueProfile() {
      const profile = generationTechniqueProfile('Transcendent') || {};
      const configuredDigits = Number(alsDofMaxDigitsEl.value);
      const configuredAuxiliary = Number(alsDofMaxAuxiliaryEl.value);
      const configuredDepth = Math.min(8, Math.max(2, Number(chainDepthEl.value) || 8));
      const configuredStrongTypes = chainStrongTypeEls
        .map((element, index) => element.checked ? index : null)
        .filter(index => index !== null);
      return {
        ...profile,
        // Run All/Next use the same hierarchy as rating, while the checkboxes
        // still control which techniques are actually enabled interactively.
        moveTypes: [...currentSolverMoveTypes()],
        interactiveMaxDepth: configuredDepth,
        interactiveStrongLinkTypes: configuredStrongTypes,
        interactiveIncludeAls: chainAlsRccEl.checked,
        interactiveIncludeAhs: chainAhsEl.checked,
        alsMaxDigits: Number.isInteger(configuredDigits)
          ? Math.min(9, Math.max(2, configuredDigits))
          : 5,
        alsMaxAuxiliary: Number.isInteger(configuredAuxiliary)
          ? Math.min(9, Math.max(1, configuredAuxiliary))
          : 5,
      };
    }

    function applyNextCycle() {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      const before = snapshotState();
      const promoted = applyQueuedPromotions();
      if (boardIsComplete()) return applyCycleChoice(before, promoted, null);
      const choice = chooseSolverStep(
        cand,
        puzzle,
        'interactive',
        solution,
        interactiveTechniqueProfile(),
      );
      return applyCycleChoice(before, promoted, choice);
    }

    async function chooseInteractiveStep({
      allowSynchronousFallback = false,
    } = {}) {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      lastInteractiveSearchError = null;
      lastChainSelectionDiagnostics = null;
      const profile = interactiveTechniqueProfile();
      const fallback = () => chooseSolverStep(
        cand,
        puzzle,
        'interactive',
        solution,
        profile,
      );
      // Keep the cheap hierarchy phases synchronous and authoritative. A
      // worker that starts with a stale/empty subset result must not expose a
      // size-2 fish before singles, BLR, or size-2 subsets have been checked.
      for (const phase of solverPhasePlan(profile)) {
        if (phase.kind !== 'direct') break;
        if (phase.name === 'very-easy-fish') break;
        const direct = directSolverPhaseStep(cand, puzzle, phase, profile);
        if (direct?.step) return direct;
      }
      try {
        // Bound each worker operation, rather than the sum of all successful
        // hierarchy phases. Progress resets the inactivity timeout.
        let timeoutId;
        let refreshTimeout;
        const timeout = new Promise((_, reject) => {
          refreshTimeout = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => reject(new Error('Interactive search worker timed out.')), 15000);
          };
          refreshTimeout();
        });
        interactiveSearchProgress = refreshTimeout;
        try {
          const workerChoice = await Promise.race([
            chooseSolverStepInWorker(cand, puzzle, solution, profile, 'interactive'),
            timeout,
          ]);
          // An empty worker result is not proof that the local chain walker
          // found nothing. This can happen after a worker reload or when its
          // cached graph inventory is stale. Reuse the synchronous path before
          // reporting that no enabled move exists.
          if (workerChoice?.step || workerChoice?.incomplete) return workerChoice;
          return fallback();
        } finally {
          if (interactiveSearchProgress === refreshTimeout) interactiveSearchProgress = null;
          clearTimeout(timeoutId);
        }
      } catch (error) {
        if (isSearchCancelled(error)) throw error;
        finishSearchDiagnostics(error.message || 'Search failed.');
        lastInteractiveSearchError = error;
        // Keep file:// pages and browsers without worker support usable, and
        // recover from a worker that is stuck in an older/high-cost phase.
        const worker = searchWorker;
        searchWorker = null;
        if (worker) worker.terminate();
        releaseSearchWorkerBlobUrl();
        for (const job of searchWorkerJobs.values()) {
          job.reject(error);
        }
        searchWorkerJobs.clear();
        if (!allowSynchronousFallback) return null;
        return fallback();
      }
    }

    async function applyNextCycleInWorker() {
      const before = snapshotState();
      const promoted = applyQueuedPromotions();
      if (boardIsComplete()) return applyCycleChoice(before, promoted, null);
      let choice;

      const searchToken = setBusy(true);
      setStatus('Searching enabled moves...');
      try {
        choice = await chooseInteractiveStep({ allowSynchronousFallback: true });
      } catch (error) {
        if (isSearchCancelled(error)) return false;
        throw error;
      } finally {
        setBusy(false, searchToken);
      }

      return applyCycleChoice(before, promoted, choice);
    }

    function advanceCycle() {
      return applyNextCycle();
    }

    async function nextCycle() {
      if (busy) return false;
      leaveHistoryPreview();
      if (boardIsComplete()) {
        ratingReport = ratingFromLog(logEntries, true);
        setStatus('Completed. The board is already solved.', 'ok');
        render();
        return false;
      }
      const changed = await applyNextCycleInWorker();
      if (changed) {
        ratingReport = ratingFromLog(logEntries, candidateGridIsSolved(cand, puzzle));
      }
      render();
      return changed;
    }

    function undoCycle() {
      leaveHistoryPreview();
      if (!undoStack.length) {
        setStatus('Nothing to undo.', 'warn');
        render();
        return false;
      }

      redoStack.push(snapshotState());
      restoreState(undoStack.pop());
      setStatus('Last cycle undone. Candidate grid restored.', 'ok');
      render();
      return true;
    }

    function redoCycle() {
      leaveHistoryPreview();
      if (!redoStack.length) {
        setStatus('Nothing to redo.', 'warn');
        render();
        return false;
      }

      undoStack.push(snapshotState());
      restoreState(redoStack.pop());
      setStatus('Last cycle redone. Candidate grid restored.', 'ok');
      render();
      return true;
    }

    async function applyBasics() {
      if (busy) return;
      leaveHistoryPreview();
      if (boardIsComplete()) {
        ratingReport = ratingFromLog(logEntries, true);
        setStatus('Completed. The board is already solved.', 'ok');
        render();
        return;
      }
      const maxSteps = 1000;
      let applied = 0;
      const searchToken = setBusy(true);
      setStatus('Basics started. Applying Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 until exhausted.');

      try {
        while (applied < maxSteps) {
          if (searchToken !== searchEpoch) return;
          const before = snapshotState();
          const promoted = applyQueuedPromotions();
          if (boardIsComplete()) {
            if (applyCycleChoice(before, promoted, null)) applied += 1;
            break;
          }
          const step = await runSearchWorker('simple', {
            candidateGrid: cand,
            fixedGrid: puzzle,
            moveTypes: [
              'last-man-standing', 'hidden-single', 'naked-single', 'box-line',
              'hidden-pair', 'naked-pair', 'hidden-triple', 'naked-triple',
              'hidden-quad', 'naked-quad', 'x-wing', 'swordfish', 'jellyfish',
            ],
            fishOptions: {
              ...currentPomFishOptions(),
              fishSizes: [2, 3, 4], minSize: 2, maxSize: 4, minK: 0, maxK: 0,
              basicsEnabled: true, frankenEnabled: false, mutantEnabled: false,
            },
          });
          if (!applyCycleChoice(before, promoted, step ? { step, chain: null } : null)) break;

          applied += 1;
          renderLog();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } catch (error) {
        if (isSearchCancelled(error)) return;
        setStatus(`Basics stopped: ${error.message || error}`, 'warn');
        return;
      } finally {
        setBusy(false, searchToken);
      }

      if (logEntries.length) {
        ratingReport = ratingFromLog(logEntries, candidateGridIsSolved(cand, puzzle));
      }
      if (applied === maxSteps) {
        setStatus(`Basics stopped after ${maxSteps} cycles. Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 were being applied.`, 'warn');
      } else if (applied > 0) {
        setStatus(`Basics complete. ${applied} cycle${applied === 1 ? '' : 's'} applied; Last Man Standing, singles, Box - Line Reduction, subsets, and basic fish sizes 1 through 4 are exhausted.`, 'ok');
      } else {
        setStatus('Basics found no enabled Last Man Standing, single, Box - Line Reduction, subset, or basic fish move.', 'warn');
      }
      render();
    }

    async function runAll() {
      if (busy) return;
      leaveHistoryPreview();
      if (boardIsComplete()) {
        ratingReport = ratingFromLog(logEntries, true);
        setStatus('Completed. The board is already solved.', 'ok');
        render();
        return;
      }
      let ran = 0;
      let stopReason = null;
      const searchToken = setBusy(true);
      setStatus('Run All started. Applying the enabled hierarchy from the first phase on each cycle.');
      try {
        while (ran < 100) {
          if (searchToken !== searchEpoch) return;
          const before = snapshotState();
          const promoted = applyQueuedPromotions();
          if (boardIsComplete()) {
            if (applyCycleChoice(before, promoted, null)) ran += 1;
            break;
          }
          setStatus(`Run All: searching cycle ${ran + 1}...`);
          let choice = await chooseInteractiveStep({
            allowSynchronousFallback: false,
          });
          if (!choice && lastInteractiveSearchError) {
            setStatus('Run All search worker restarted; retrying the current cycle...', 'warn');
            await new Promise(resolve => setTimeout(resolve, 0));
            choice = await chooseInteractiveStep({
              allowSynchronousFallback: true,
            });
          }
          if (!choice) {
            stopReason = lastInteractiveSearchError
              ? `Run All stopped: search worker failed after retry (${lastInteractiveSearchError.message}).`
              : 'Run All stopped: no enabled move was returned by the configured hierarchy.';
            break;
          }
          if (!applyCycleChoice(before, promoted, choice)) {
            stopReason = 'Run All stopped: the returned move could not be applied.';
            break;
          }
          ran += 1;
          renderLog();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } catch (error) {
        if (isSearchCancelled(error)) return;
        stopReason = `Run All stopped: ${error.message || error}`;
      } finally {
        setBusy(false, searchToken);
      }
      if (logEntries.length) {
        ratingReport = ratingFromLog(logEntries, candidateGridIsSolved(cand, puzzle));
      }
      if (stopReason) {
        setStatus(stopReason, 'warn');
      } else if (solution && !candidateGridIsSolved(cand, puzzle)) {
        setStatus('Run All stopped: enabled moves stalled before the puzzle was solved.', 'warn');
      }
      if (ran === 100) setStatus('Run All stopped at 100 cycles.', 'warn');
      if (ran > 0 && ran < 100 && (!solution || candidateGridIsSolved(cand, puzzle))) {
        setStatus(`Run All complete. ${ran} enabled move${ran === 1 ? '' : 's'} applied in hierarchy order.`, 'ok');
      }
      render();
    }

    function runPomCheck() {
      const searchToken = setBusy(true);
      setStatus('Running POM check...');

      scheduleSearch(async () => {
        try {
          pomReport = await runCoreSearch('pomCheck', cand, puzzle);
          renderPomReport();
          openReportPanel(pomResultsEl);
          const omissionCount = pomReport.omissions.reduce((total, item) => total + item.cells.length, 0);
          const totalReports = pomReport.omissions.length
            + pomReport.hiddenSubsets.length
            + pomReport.nakedSubsets.length
            + pomReport.tkDeletes.length;
          const details = [];
          if (totalReports) details.push(`${totalReports} reports`);
          if (omissionCount) details.push(`${omissionCount} omitted candidate cells`);
          if (pomReport.tkDeletes.length) details.push(`${pomReport.tkDeletes.length} TK-deletes`);
          setStatus(
            `POM check complete.${details.length ? ` ${details.join(', ')}.` : ' No reports.'} Grid and solving history unchanged.`,
            'ok',
          );
        } catch (error) {
          if (isSearchCancelled(error)) return;
          setStatus(`Could not run POM: ${error.message || error}`, 'warn');
        } finally {
          setBusy(false, searchToken);
        }
      }, 20);
    }

    const runAlsBuild = appNamespace.alsBuild.create({
      elements: {
        results: alsResultsEl,
      },
      state: {
        get cand() { return cand; },
        set alsReport(value) { alsReport = value; },
        get alsReport() { return alsReport; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        get openAlsSizeGroups() { return openAlsSizeGroups; },
        set alsLinkReport(value) { alsLinkReport = value; },
        set chainReport(value) { chainReport = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderAlsReport,
        openReportPanel,
        renderAlsLinkReport,
        renderChainReport,
        isSearchCancelled,
      },
    });

    const runAlsLinkBuild = appNamespace.alsLinkBuild.create({
      elements: {
        results: alsLinkResultsEl,
      },
      state: {
        get cand() { return cand; },
        get alsReport() { return alsReport; },
        set alsReport(value) { alsReport = value; },
        set alsLinkReport(value) { alsLinkReport = value; },
        set chainReport(value) { chainReport = value; },
        get alsLinkReport() { return alsLinkReport; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderAlsReport,
        renderAlsLinkReport,
        openReportPanel,
        renderChainReport,
        flattenAlsLinks: core.flattenAlsLinks,
        isSearchCancelled,
      },
    });

    const runAhsBuild = appNamespace.ahsRecordBuild.create({
      elements: {
        results: ahsResultsEl,
      },
      state: {
        get cand() { return cand; },
        set ahsReport(value) { ahsReport = value; },
        get ahsReport() { return ahsReport; },
        set selectedAhsDof(value) { selectedAhsDof = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        get openAhsSizeGroups() { return openAhsSizeGroups; },
        set chainReport(value) { chainReport = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderAhsReport,
        openReportPanel,
        renderChainReport,
        isSearchCancelled,
      },
    });

    const runStrongLinkBuild = appNamespace.strongLinkBuild.create({
      elements: {
        strongTypes: chainStrongTypeEls,
        results: strongLinkResultsEl,
      },
      state: {
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        set strongLinkReport(value) { strongLinkReport = value; },
        get strongLinkReport() { return strongLinkReport; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set chainReport(value) { chainReport = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        chainNodeLimitOptions,
        currentAlmostFishOptions,
        renderStrongLinkReport,
        openReportPanel,
        renderChainReport,
        flattenStrongLinks: core.flattenStrongLinks,
        isSearchCancelled,
      },
    });

    const runSimpleColoringBuild = appNamespace.simpleColoringBuild.create({
      elements: {
        results: simpleColoringResultsEl,
      },
      state: {
        get cand() { return cand; },
        set simpleColoringReport(value) { simpleColoringReport = value; },
        get simpleColoringReport() { return simpleColoringReport; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set selectedSuperMultiColoringIndex(value) { selectedSuperMultiColoringIndex = value; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        annotateColouringReports,
        renderSimpleColoringReport,
        renderThreeDMedusaReport,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runThreeDMedusaBuild = appNamespace.threeDMedusaBuild.create({
      elements: {
        results: threeDMedusaResultsEl,
      },
      state: {
        get cand() { return cand; },
        set threeDMedusaReport(value) { threeDMedusaReport = value; },
        get threeDMedusaReport() { return threeDMedusaReport; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set selectedSuperMultiColoringIndex(value) { selectedSuperMultiColoringIndex = value; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        annotateColouringReports,
        renderSimpleColoringReport,
        renderThreeDMedusaReport,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runMultiColoringBuild = appNamespace.multiColoringBuild.create({
      elements: {
        results: multiColoringResultsEl,
      },
      state: {
        get cand() { return cand; },
        set multiColoringReport(value) { multiColoringReport = value; },
        get multiColoringReport() { return multiColoringReport; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedSuperMultiColoringIndex(value) { selectedSuperMultiColoringIndex = value; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        annotateColouringReports,
        renderSimpleColoringReport,
        renderThreeDMedusaReport,
        renderMultiColoringReport,
        renderSuperMultiColoringReport,
        renderThreeDMedusaMultiReport,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runThreeDMedusaMultiBuild = appNamespace.threeDMedusaMultiBuild.create({
      elements: {
        results: threeDMedusaMultiResultsEl,
      },
      state: {
        get cand() { return cand; },
        set threeDMedusaMultiReport(value) { threeDMedusaMultiReport = value; },
        get threeDMedusaMultiReport() { return threeDMedusaMultiReport; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set selectedSuperMultiColoringIndex(value) { selectedSuperMultiColoringIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        annotateColouringReports,
        renderSimpleColoringReport,
        renderThreeDMedusaReport,
        renderMultiColoringReport,
        renderSuperMultiColoringReport,
        renderThreeDMedusaMultiReport,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runFishBuild = appNamespace.fishBuild.create({
      elements: {
        results: fishResultsEl,
      },
      state: {
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        set fishReport(value) { fishReport = value; },
        get fishReport() { return fishReport; },
        set selectedFishCategory(value) { selectedFishCategory = value; },
        set selectedFishSize(value) { selectedFishSize = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        currentPomFishOptions,
        renderFishReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runGenericSubsetBuild = appNamespace.genericSubsetBuild.create({
      elements: {
        hiddenResults: hiddenSubsetResultsEl,
        nakedResults: nakedSubsetResultsEl,
      },
      state: {
        get cand() { return cand; },
        get ahsReport() { return ahsReport; },
        get alsReport() { return alsReport; },
        set hiddenSubsetReport(value) { hiddenSubsetReport = value; },
        set selectedHiddenSubsetSize(value) { selectedHiddenSubsetSize = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set nakedSubsetReport(value) { nakedSubsetReport = value; },
        set selectedNakedSubsetSize(value) { selectedNakedSubsetSize = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderHiddenSubsetReport,
        renderNakedSubsetReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runBoxLineBuild = appNamespace.boxLineBuild.create({
      elements: {
        results: boxLineResultsEl,
      },
      state: {
        get cand() { return cand; },
        set boxLineReport(value) { boxLineReport = value; },
        get boxLineReport() { return boxLineReport; },
        set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderBoxLineReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlsDofBuild = appNamespace.alsDofBuild.create({
      elements: {
        maxDigits: alsDofMaxDigitsEl,
        maxAuxiliary: alsDofMaxAuxiliaryEl,
        hydraEnabled: alsDofHydraEnabledEl,
        chainDepth: chainDepthEl,
        results: alsDofResultsEl,
      },
      state: {
        get cand() { return cand; },
        set alsReport(value) { alsReport = value; },
        set alsDofReport(value) { alsDofReport = value; },
        get alsDofReport() { return alsDofReport; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
      },
      actions: {
        setBusy,
        setStatus,
        runSearchWorker,
        renderAlsReport,
        renderAlsDofReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlsDofChainBuild = appNamespace.alsDofChainBuild.create({
      elements: {
        maxDigits: alsDofChainMaxDigitsEl,
        maxAuxiliary: alsDofChainMaxAuxiliaryEl,
        maxResults: alsDofChainMaxResultsEl,
        hydraEnabled: alsDofHydraEnabledEl,
        chainDepth: chainDepthEl,
        results: alsDofChainResultsEl,
      },
      state: {
        get cand() { return cand; },
        set alsDofChainReport(value) { alsDofChainReport = value; },
        get alsDofChainReport() { return alsDofChainReport; },
        set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        set selectedHydraFamily(value) { selectedHydraFamily = value; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderAlsReport,
        renderAlsDofReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlsHydraBuild = appNamespace.alsHydraBuild.create({
      elements: {
        maxDigits: alsDofChainMaxDigitsEl,
        maxAuxiliary: alsDofChainMaxAuxiliaryEl,
        maxResults: alsDofChainMaxResultsEl,
        hydraEnabled: alsDofHydraEnabledEl,
        results: alsHydraResultsEl,
      },
      state: {
        get cand() { return cand; },
        set alsHydraReport(value) { alsHydraReport = value; },
        get alsHydraReport() { return alsHydraReport; },
        set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        set selectedHydraFamily(value) { selectedHydraFamily = value; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderAlsHydraReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const mslsStepFromResult = result => appNamespace.mslsView.stepFromResult(result, core);

    const mslsView = appNamespace.mslsView.create({
      documentRef: document,
      resultsEl: mslsResultsEl,
      core,
      getReport: () => mslsReport,
      getSelectedIndex: () => selectedMslsIndex,
      onSelect: (result, index, safetyFlags) => {
        selectedMslsIndex = index;
        selectedAlsId = null;
        selectedAhsId = null;
        selectedAhsDofNetIndex = null;
        selectedAhsDofChainIndex = null;
        selectedChainIndex = null;
        selectedStrongLinkType = null;
        selectedStrongLinkIndex = null;
        activeStep = mslsStepFromResult(result);
        lastRemoved = activeStep.elim.items;
        renderBoard();
        mslsView.render();
        setStatus(`MSLS result ${index + 1} selected.`, safetyFlags.length ? 'warn' : 'ok');
        focusMap();
      },
    });
    const renderMslsReport = mslsView.render;

    const mslsSearch = appNamespace.mslsSearch.create({
      elements: { results: mslsResultsEl, minSize: mslsMinSizeEl, maxSize: mslsMaxSizeEl,
        stateBudget: mslsStateBudgetEl, resultLimit: mslsResultLimitEl },
      getCandidateGrid: () => cand,
      runSearchWorker,
      setReport: report => { mslsReport = report; },
      setSelectedIndex: value => { selectedMslsIndex = value; },
      render: renderMslsReport,
      openReportPanel,
      setBusy,
      setStatus,
      isSearchCancelled,
    });
    const runMslsSearch = mslsSearch.run;

    function runAlsSearch(family) {
      const phase = family === 'als-xz'
        ? {
            includeAls: true,
            maxDepth: 2,
            minDepth: 2,
            alsLinkMode: 'xz-only',
            alsModuleKinds: ['ALS_XZ'],
            family: 'als-xz',
          }
        : family === 'als-xy'
          ? {
              includeAls: true,
              maxDepth: 3,
              minDepth: 3,
              family: 'als-xy',
            }
          : {
              includeAls: true,
              maxDepth: Math.max(2, Number(chainDepthEl.value) || 6),
              minDepth: 3,
              family: 'als-chain',
            };
      const maxDepth = phase.maxDepth;
      const label = family === 'als-xz' ? 'ALS-XZ'
        : family === 'als-xy' ? 'ALS-XY' : 'ALS-Chain';
      // Type 4 is the Bivalve ALS node. Type 5 is supplied separately by
      // includeAlsRcc/alsLinkSet as ALS_RCC; it is not part of this array.
      const searchStrongLinkTypes = [4];

      const searchToken = setBusy(true);
      setStatus(family === 'als-xy'
        ? `Searching ${label}...`
        : `Searching ${label}...`);

      scheduleSearch(async () => {
        try {
          const search = chainSearchOptions(
            cand,
            maxDepth,
            'interactive',
            {
              includeAlsRcc: true,
              strongLinkTypes: searchStrongLinkTypes,
            },
            false,
            phase,
          );
          search.strongSet = await runCoreSearch('buildStrongLinks', cand, {
            includeAlmostFish: search.strongLinkTypes.includes(7),
            almostFish: { grid: [...puzzle], ...search.almostFish },
          });
          search.alsList = (await runCoreSearch('alsConstructor', cand, {
            ...(search.alsMaxSizeDOF == null ? {} : { maxSizeDOF: search.alsMaxSizeDOF }),
            ...(search.alsMaxSizeFox == null ? {} : { maxSizeFox: search.alsMaxSizeFox }),
            searchLimit: search.alsSearchLimit,
          })).filter(als => search.alsMaxCells == null
            || (als.alsAllCells || []).length <= search.alsMaxCells)
            .filter(als => search.alsMaxDigits == null
              || (als.alsDigits || []).length <= search.alsMaxDigits);
          search.alsLinkSet = await runCoreSearch('buildAlsLinks', cand, {
            alsList: search.alsList,
            strictSingleCommon: true,
            xzOnly: phase.alsLinkMode === 'xz-only',
            maxLinks: search.maxAlsLinks,
          });
          if (phase.alsModuleKinds) {
            search.alsLinkSet = search.alsLinkSet.map(bucket => bucket.filter(link =>
              phase.alsModuleKinds.includes(link.moduleKind)));
          }
          const rawReport = await runCoreSearch('findAicChains', cand, {
            strongLinkSet: search.strongSet,
            alsList: search.alsList,
            alsLinkSet: search.alsLinkSet,
            includeAls: search.includeAlsRcc,
            includeAhs: search.includeAhs,
            strongLinkTypes: search.strongLinkTypes,
            maxDepth: search.maxDepth,
            maxChains: search.maxChains,
            maxResultAttempts: search.maxResultAttempts,
            maxResultAttemptsPerStart: search.maxResultAttemptsPerStart,
            maxStates: search.maxStates,
            maxQueue: search.maxQueue,
            maxBranching: search.maxBranching,
            maxStartViews: search.maxStartViews,
            maxAlsLinks: search.maxAlsLinks,
          });
          const chains = rawReport.chains.filter(chain => chainMatchesSearchPhase(chain, phase));

          alsSearchFamily = family;
          chainReport = { ...rawReport, chains };
          selectedChainIndex = chains.length ? 0 : null;
          activeStep = null;
          lastRemoved = [];
          strongLinkReport = chainReport.linkSets?.strongSet || search.strongSet;
          alsReport = search.alsList;
          alsLinkReport = search.alsLinkSet;
          selectedAlsId = null;
          selectedAhsId = null;
          renderAlsReport();
          renderAlsLinkReport();
          renderBoard();
          renderChainReport();
          renderAlsSearchResults();
          openReportPanel(alsSearchResultsEl);

          setStatus(
            `${label} search complete. ${chains.length} result${chains.length === 1 ? '' : 's'}.`
              + `${rawReport.stats?.truncated ? ` Stopped at ${rawReport.stats.stopReason}.` : ''}`,
            chains.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (isSearchCancelled(error)) return;
          console.error(`Could not search ${label}.`, error);
          alsSearchFamily = null;
          chainReport = null;
          selectedChainIndex = null;
          renderChainReport();
          renderAlsSearchResults();
          setStatus(`Could not search ${label}: ${error?.message || error}`, 'warn');
        } finally {
          setBusy(false, searchToken);
        }
      }, 20);
    }

    const runAhsSearch = appNamespace.ahsBuild.create({
      elements: { ahsSearchResults: ahsSearchResultsEl },
      state: {
        get cand() { return cand; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get ahsSearchFamily() { return ahsSearchFamily; },
        set ahsSearchFamily(value) { ahsSearchFamily = value; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
        set strongLinkReport(value) { strongLinkReport = value; },
        set ahsReport(value) { ahsReport = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        runSearchWorker,
        renderAlsReport,
        renderChainReport,
        renderAhsSearchResults,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlcXzBuild = appNamespace.alcBuild.createXz({
      elements: { alcSearchResults: alcSearchResultsEl },
      state: {
        get cand() { return cand; },
        get alcXzReport() { return alcXzReport; },
        set alcXzReport(value) { alcXzReport = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get ahsSearchFamily() { return ahsSearchFamily; },
        set ahsSearchFamily(value) { ahsSearchFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderChainReport,
        renderAlcXzResults,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlcXyBuild = appNamespace.alcBuild.createXy({
      elements: { alcSearchResults: alcSearchResultsEl },
      state: {
        get cand() { return cand; },
        get alcXyReport() { return alcXyReport; },
        set alcXyReport(value) { alcXyReport = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get ahsSearchFamily() { return ahsSearchFamily; },
        set ahsSearchFamily(value) { ahsSearchFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderChainReport,
        renderAlcXyResults,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlcChainBuild = appNamespace.alcBuild.createChain({
      elements: { alcSearchResults: alcSearchResultsEl },
      state: {
        get cand() { return cand; },
        get alcChainReport() { return alcChainReport; },
        set alcChainReport(value) { alcChainReport = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get ahsSearchFamily() { return ahsSearchFamily; },
        set ahsSearchFamily(value) { ahsSearchFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderChainReport,
        renderAlcChainResults,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlcDofBuild = appNamespace.alcBuild.createDof({
      elements: {
        alcSearchResults: alcSearchResultsEl,
        alcDofHydraEnabled: alcDofHydraEnabledEl,
      },
      state: {
        get cand() { return cand; },
        get alcDofReport() { return alcDofReport; },
        set alcDofReport(value) { alcDofReport = value; },
        get alcHydraReport() { return alcHydraReport; },
        set alcHydraReport(value) { alcHydraReport = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get ahsSearchFamily() { return ahsSearchFamily; },
        set ahsSearchFamily(value) { ahsSearchFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderChainReport,
        renderAlcDofResults,
        renderAlcHydraReport,
        renderBoard,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runAlcHydraBuild = appNamespace.alcHydraBuild.create({
      elements: {
        alcDofMaxDigits: alcDofMaxDigitsEl,
        alcDofMaxAuxiliary: alcDofMaxAuxiliaryEl,
        alcDofMaxResults: alcDofMaxResultsEl,
        alcDofHydraEnabled: alcDofHydraEnabledEl,
        alcHydraResults: alcHydraResultsEl,
      },
      state: {
        get cand() { return cand; },
        get alcHydraReport() { return alcHydraReport; },
        set alcHydraReport(value) { alcHydraReport = value; },
        set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        set selectedHydraFamily(value) { selectedHydraFamily = value; },
      },
      actions: {
        setBusy,
        setStatus,
        runSearchWorker,
        renderAlcHydraReport,
        openReportPanel,
        isSearchCancelled,
      },
    });

    const runChainBuild = appNamespace.chainBuild.create({
      elements: {
        chainAlsRcc: chainAlsRccEl,
        chainAhs: chainAhsEl,
        chainStrongTypeEls,
        chainChromaticType3: chainChromaticType3El,
        chromaticUnitType: chromaticUnitTypeEl,
        chromaticMinSectors: chromaticMinSectorsEl,
        chromaticMaxSectors: chromaticMaxSectorsEl,
        chromaticMinDigits: chromaticMinDigitsEl,
        chromaticMaxDigits: chromaticMaxDigitsEl,
        chromaticMaxCells: chromaticMaxCellsEl,
        chainDepth: chainDepthEl,
        chainResults: chainResultsEl,
      },
      state: {
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        get strongLinkReport() { return strongLinkReport; },
        set strongLinkReport(value) { strongLinkReport = value; },
        get alsReport() { return alsReport; },
        set alsReport(value) { alsReport = value; },
        get alsLinkReport() { return alsLinkReport; },
        set alsLinkReport(value) { alsLinkReport = value; },
        get ahsReport() { return ahsReport; },
        set ahsReport(value) { ahsReport = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedAhsId() { return selectedAhsId; },
        set selectedAhsId(value) { selectedAhsId = value; },
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        chainNodeLimitOptions,
        currentAlmostFishOptions,
        runCoreSearch,
        runSearchWorker,
        renderAlsReport,
        renderAlsLinkReport,
        renderBoard,
        renderChainReport,
        renderAlsSearchResults,
        openReportPanel,
        isSearchCancelled,
      },
    });

    function generatePuzzle() {
      leaveHistoryPreview();
      const givens = Math.min(81, Math.max(1, Number(givensEl.value) || 21));
      givensEl.value = String(givens);
      const targetCategory = generationDifficultyEl.value;
      const isAnyTarget = normalizeRatingCategory(targetCategory) === 'Any';
      const requestToken = ++generationToken;
      setBusy(true);
      const article = /^[AEIOU]/i.test(targetCategory) ? 'an' : 'a';
      setStatus(isAnyTarget
        ? 'Generating...'
        : `Generating ${article} ${targetCategory} puzzle...`);

      setTimeout(() => {
        if (requestToken !== generationToken) return;
        const quickGeneration = isAnyTarget;
        const maxRatingAttempts = quickGeneration ? 1 : 1000;
        let result = null;
        let rating = null;
        let attempts = 0;

        const tryGeneration = async () => {
          if (requestToken !== generationToken) return;

          attempts += 1;
          try {
            result = await runPuzzleGenerator(givens);
          } catch (error) {
            if (requestToken !== generationToken || isSearchCancelled(error)) return;
            setBusy(false);
            setStatus(`Could not generate a puzzle: ${error.message || error}`, 'warn');
            return;
          }
          if (requestToken !== generationToken) return;
          if (quickGeneration) {
            puzzle = result.puzzle;
            originalPuzzle = [...result.puzzle];
            inputEl.value = core.encode(originalPuzzle);
            solution = result.solution;
            hideSolution();
            resetCandidates("Generated a unique puzzle.", null, unknownRating('Generated puzzle is unrated.'));
            const actualGivens = result.puzzle.filter(Boolean).length;
            setStatus(`Generated a unique puzzle with ${actualGivens} givens.`, 'ok');
            setBusy(false);
            return;
          }

          const limitedRating = await rateGeneratedPuzzleInWorker(
            result.puzzle,
            result.solution,
            targetCategory,
          );
          if (requestToken !== generationToken) return;
          const normalizedTarget = normalizeRatingCategory(targetCategory);
          const limitedMatchesTarget = quickGeneration
            || normalizedTarget === 'Unknown'
            || (
              limitedRating.solved === true
              && (normalizedTarget !== 'Lulz' || limitedRating.score === 0)
              && limitedRating.category === normalizedTarget
            );

          // The selected difficulty is the complete search ceiling for this
          // candidate. Do not re-rate it with a broader profile: a candidate
          // that solves within the selected tier is accepted, while one that
          // falls below or stalls at that tier is rejected.
          if (!limitedMatchesTarget) {
            if (attempts >= maxRatingAttempts) {
              setBusy(false);
              setStatus(
                `Could not generate a ${targetCategory} puzzle after ${attempts} attempts. Current puzzle unchanged.`,
                'warn',
              );
              return;
            }
            setStatus(`Generating ${article} ${targetCategory} puzzle... attempt ${attempts}`);
            setTimeout(() => { void tryGeneration(); }, 0);
            return;
          }

          rating = limitedRating;
          const matches = quickGeneration
            || (
              limitedRating.solved === true
              && rating.solved === true
              && (normalizedTarget !== 'Lulz' || (limitedRating.score === 0 && rating.score === 0))
              && rating.category === normalizedTarget
            );

          if (!matches) {
            if (attempts >= maxRatingAttempts) {
              setBusy(false);
              setStatus(
                `Could not generate a ${targetCategory} puzzle after ${attempts} attempts. Current puzzle unchanged.`,
                'warn',
              );
              return;
            }
            setStatus(`Generating ${article} ${targetCategory} puzzle... attempt ${attempts}`);
            setTimeout(() => { void tryGeneration(); }, 0);
            return;
          }

          puzzle = result.puzzle;
          originalPuzzle = [...result.puzzle];
          inputEl.value = core.encode(originalPuzzle);
          solution = result.solution;
          hideSolution();
          const actualGivens = result.puzzle.filter(Boolean).length;
          resetCandidates(`Generated a unique puzzle with ${actualGivens} givens and rebuilt candidates.`, null, rating);
          if (!isAnyTarget) {
            setStatus(`Generated a ${targetCategory} puzzle after ${attempts} attempt${attempts === 1 ? '' : 's'}.`, 'ok');
          } else if (!rating.solved) {
            setStatus(
              `Generated a unique puzzle, but the retained logic stalled after ${rating.stalledAfter || 'no basic move'}.`,
              'warn',
            );
          }
          setBusy(false);
        };

        void tryGeneration().catch(error => {
          if (requestToken !== generationToken) return;
          setBusy(false);
          setStatus(`Could not generate a puzzle: ${error.message || error}`, 'warn');
        });
      }, 20);
    }

    async function recognizeSudokuImage(file) {
      const image = new Image();
      const url = URL.createObjectURL(file);
      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error('The selected image could not be read.'));
          image.src = url;
        });
        const detected = appNamespace.ocrGrid.detectBounds(image);
        const Tesseract = await appNamespace.ocrGrid.withTimeout(
          appNamespace.ocrAssets.loadTesseract(),
          'The local OCR library could not start.',
        );
        const worker = await appNamespace.ocrGrid.withTimeout(Tesseract.createWorker('eng', 1, {
          workerPath: './src/ocr/worker.min.js',
          langPath: './src/ocr',
          corePath: './src/ocr/tesseract-core.wasm.js',
          // Blob workers are blocked by some browsers for file:// pages.
          // Use the bundled worker directly in that mode.
          workerBlobURL: location.protocol !== 'file:',
          logger: message => {
            if (message.status) ocrStatusEl.textContent = `OCR: ${message.status} ${Math.round((message.progress || 0) * 100)}%`;
          },
          errorHandler: error => {
            ocrStatusEl.textContent = `OCR worker error: ${error.message || error}`;
          },
        }), 'The OCR worker could not start. Direct file pages may block browser workers.');
        await worker.setParameters({
          tessedit_char_whitelist: '123456789',
          tessedit_pageseg_mode: '10',
        });
        const result = [];
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const left = detected.xs[col];
            const top = detected.ys[row];
            const width = detected.xs[col + 1] - left;
            const height = detected.ys[row + 1] - top;
            const crop = document.createElement('canvas');
            // Sudoku screenshots often contain pencilmarks around the cell
            // edges. Large givens are centered, so isolate the middle glyph
            // before sending each cell to OCR.
            const padX = width * .24;
            const padY = height * .24;
            const scale = 4;
            crop.width = Math.max(32, Math.round((width - padX * 2) * scale));
            crop.height = Math.max(32, Math.round((height - padY * 2) * scale));
            const cropContext = crop.getContext('2d');
            cropContext.fillStyle = '#ffffff';
            cropContext.fillRect(0, 0, crop.width, crop.height);
            cropContext.drawImage(detected.canvas, left + padX, top + padY,
              width - padX * 2, height - padY * 2, 0, 0, crop.width, crop.height);
            const pixels = cropContext.getImageData(0, 0, crop.width, crop.height).data;
            let ink = 0;
            for (let pixel = 0; pixel < pixels.length; pixel += 4) {
              const gray = (pixels[pixel] * 299 + pixels[pixel + 1] * 587 + pixels[pixel + 2] * 114) / 1000;
              if (gray < 170) ink += 1;
            }
            // Pencilmarks are much smaller than the centered given glyph.
            // Skip low-ink cells so a single candidate cannot become a clue.
            if (ink / (crop.width * crop.height) < .025) {
              result.push('.');
              continue;
            }
            const recognized = await worker.recognize(crop);
            const digit = (recognized.data.text || '').replace(/[^1-9]/g, '');
            result.push(digit.length === 1 ? digit : '.');
          }
        }
        await worker.terminate();
        return result.join('');
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    async function recognizeSudokuImageWithOcrad(file) {
      await appNamespace.ocrAssets.loadOcrad();
      if (typeof OCRAD !== 'function') throw new Error('The local file OCR engine did not load.');
      const image = new Image();
      const url = URL.createObjectURL(file);
      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error('The selected image could not be read.'));
          image.src = url;
        });
        const detected = appNamespace.ocrGrid.detectBounds(image);
        const result = [];
        const readCrop = (left, top, width, height, padFraction) => {
          const padX = width * padFraction;
          const padY = height * padFraction;
          const scale = 4;
          const crop = document.createElement('canvas');
          crop.width = Math.max(32, Math.round((width - padX * 2) * scale));
          crop.height = Math.max(32, Math.round((height - padY * 2) * scale));
          const context = crop.getContext('2d', { willReadFrequently: true });
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, crop.width, crop.height);
          context.drawImage(detected.canvas, left + padX, top + padY,
            width - padX * 2, height - padY * 2, 0, 0, crop.width, crop.height);
          const pixels = context.getImageData(0, 0, crop.width, crop.height).data;
          let ink = 0;
          const dark = new Uint8Array(crop.width * crop.height);
          for (let pixel = 0; pixel < pixels.length; pixel += 4) {
            const gray = (pixels[pixel] * 299 + pixels[pixel + 1] * 587 + pixels[pixel + 2] * 114) / 1000;
            if (gray < 170) {
              const index = pixel / 4;
              dark[index] = 1;
              ink += 1;
            }
          }
          let largestArea = 0;
          let largestHeight = 0;
          const visited = new Uint8Array(dark.length);
          for (let start = 0; start < dark.length; start++) {
            if (!dark[start] || visited[start]) continue;
            const stack = [start];
            visited[start] = 1;
            let area = 0;
            let minY = crop.height;
            let maxY = -1;
            while (stack.length) {
              const index = stack.pop();
              const x = index % crop.width;
              const y = Math.floor(index / crop.width);
              area += 1;
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (!dx && !dy) continue;
                  const nx = x + dx;
                  const ny = y + dy;
                  if (nx < 0 || nx >= crop.width || ny < 0 || ny >= crop.height) continue;
                  const neighbor = ny * crop.width + nx;
                  if (dark[neighbor] && !visited[neighbor]) {
                    visited[neighbor] = 1;
                    stack.push(neighbor);
                  }
                }
              }
            }
            largestArea = Math.max(largestArea, area);
            largestHeight = Math.max(largestHeight, maxY - minY + 1);
          }
          if (ink / (crop.width * crop.height) < .04
            || largestArea / (crop.width * crop.height) < .006
            || largestHeight / crop.height < .30) return '';
          const direct = OCRAD(crop).replace(/[^1-9]/g, '');
          if (direct.length === 1) return direct;
          const binary = document.createElement('canvas');
          binary.width = crop.width;
          binary.height = crop.height;
          const binaryContext = binary.getContext('2d', { willReadFrequently: true });
          binaryContext.drawImage(crop, 0, 0);
          const binaryPixels = binaryContext.getImageData(0, 0, binary.width, binary.height);
          for (let pixel = 0; pixel < binaryPixels.data.length; pixel += 4) {
            const gray = (binaryPixels.data[pixel] * 299 + binaryPixels.data[pixel + 1] * 587 + binaryPixels.data[pixel + 2] * 114) / 1000;
            const value = gray < 205 ? 0 : 255;
            binaryPixels.data[pixel] = value;
            binaryPixels.data[pixel + 1] = value;
            binaryPixels.data[pixel + 2] = value;
            binaryPixels.data[pixel + 3] = 255;
          }
          binaryContext.putImageData(binaryPixels, 0, 0);
          return OCRAD(binary).replace(/[^1-9]/g, '');
        };
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const left = detected.xs[col];
            const top = detected.ys[row];
            const width = detected.xs[col + 1] - left;
            const height = detected.ys[row + 1] - top;
            const readings = [.20, .24, .28, .32, .36]
              .map(pad => readCrop(left, top, width, height, pad));
            const votes = new Map();
            for (const reading of readings) {
              if (reading.length === 1) votes.set(reading, (votes.get(reading) || 0) + 1);
            }
            let digit = '';
            let voteCount = 0;
            for (const [candidate, count] of votes) {
              if (count > voteCount) {
                digit = candidate;
                voteCount = count;
              }
            }
            result.push(voteCount >= 1 ? digit : '.');
            ocrStatusEl.textContent = `OCR: scanning cell ${row * 9 + col + 1} of 81`;
          }
        }
        return result.join('');
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    function ocrPuzzleIsLoadable(text) {
      const grid = core.decode(text);
      return Boolean(grid && core.countSolutionsDlx(grid, 1) > 0);
    }

    const ocrController = appNamespace.ocrController.create({
      dialog: ocrDialogEl,
      imageInput: ocrImageInputEl,
      result: ocrResultEl,
      load: ocrLoadEl,
      status: ocrStatusEl,
      preview: ocrPreviewEl,
      recognize: file => location.protocol === 'file:'
        ? recognizeSudokuImageWithOcrad(file)
        : recognizeSudokuImage(file),
      isLoadable: ocrPuzzleIsLoadable,
    });

    async function importPuzzle() {
      return inputLoader.importPuzzle();
    }

    function loadPuzzle() {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      cancelActiveSearches('Search cancelled by puzzle reload.');
      leaveHistoryPreview();
      const input = inputEl.value;
      const grid = core.decode(input);
      const parsed729 = grid ? null : core.parse729Data(input);
      if (!grid && !parsed729) {
        setStatus('Enter an 81-character puzzle string, 729 candidate bits, or candidate-grid text.', 'warn');
        return;
      }
      if (parsed729 && !parsed729.valid) {
        setStatus('The 729 data contains conflicting space-proven givens.', 'warn');
        return;
      }

      const loadedGrid = parsed729 ? parsed729.grid : grid;

      generationToken += 1;
      // Clear old logic as soon as a valid replacement grid is accepted;
      // uniqueness checking happens asynchronously below.
      resetAnalysisAfterPlayerEdit();
      render();
      const searchToken = setBusy(true);
      setStatus('Checking puzzle uniqueness...');

      scheduleSearch(async () => {
        try {
          const dlxResult = await runCoreSearch('solveDlx', loadedGrid, 2);
          if (dlxResult.count === 0) {
            if (parsed729) {
              puzzle = loadedGrid;
              originalPuzzle = [...loadedGrid];
              inputEl.value = core.encode(originalPuzzle);
              solution = null;
              resetCandidates('Loaded 729 candidate data. No DLX solution was found.', parsed729.candidates);
              showLoadWarning('The 729 candidate data has no DLX solution. The candidate grid was loaded for inspection.');
              return;
            }
            setStatus('That puzzle has no solution.', 'warn');
            return;
          }

          if (dlxResult.count > 1) {
            if (parsed729) {
              puzzle = loadedGrid;
              originalPuzzle = [...loadedGrid];
              inputEl.value = core.encode(originalPuzzle);
              solution = null;
              resetCandidates('Loaded 729 candidate data. DLX found multiple solutions.', parsed729.candidates);
              showLoadWarning('The 729 candidate data has multiple DLX solutions. The candidate grid was loaded for inspection.');
              return;
            }
            setStatus('That puzzle has more than one solution.', 'warn');
            return;
          }

          puzzle = loadedGrid;
          originalPuzzle = [...loadedGrid];
          inputEl.value = core.encode(originalPuzzle);
          solution = dlxResult.solution;
          hideSolution();
          resetCandidates(
            parsed729
              ? `Loaded unique 729 candidate data and preserved ${parsed729.givenCells.length} space-proven givens.`
              : 'Loaded unique puzzle and rebuilt candidates.',
            parsed729?.candidates || null,
          );
        } catch (error) {
          if (isSearchCancelled(error)) return;
          setStatus('Could not check that puzzle.', 'warn');
        } finally {
          setBusy(false, searchToken);
        }
      }, 20);
    }

    appNamespace.basicEvents.install({
      generate: document.getElementById('generate'),
      manual: manualModeEl,
      reset: document.getElementById('reset'),
      next: document.getElementById('next'),
      run: document.getElementById('run'),
      basics: applyBasicsEl,
      load: loadEl,
      importPuzzle: importEl,
      generateAction: generatePuzzle,
      nextAction: nextCycle,
      runAction: runAll,
      basicsAction: applyBasics,
      loadAction: loadPuzzle,
      importAction: importPuzzle,
      setManualMode,
      isManual: () => promotionSecurityDisabled,
      render,
      cancel: cancelActiveSearches,
      resetCandidates,
    });
    appNamespace.pomEvents.install(document.getElementById('pomCheck'), runPomCheck);
    appNamespace.alsEvents.install(alsBuildEl, runAlsBuild);
    appNamespace.alsLinkEvents.install(alsLinkBuildEl, runAlsLinkBuild);
    appNamespace.ahsEvents.install(ahsBuildEl, runAhsBuild);
    appNamespace.mslsEvents.install(mslsBuildEl, runMslsSearch);
    appNamespace.strongLinkEvents.install(strongLinkBuildEl, runStrongLinkBuild);
    appNamespace.simpleColoringEvents.install(simpleColoringBuildEl, runSimpleColoringBuild);
    appNamespace.medusaSimpleColoringEvents.install(threeDMedusaBuildEl, runThreeDMedusaBuild);
    appNamespace.medusaMultiColoringEvents.install(threeDMedusaMultiBuildEl, runThreeDMedusaMultiBuild);
    const runChromaticGraphSearch = (event) => {
      event.preventDefault();
      event.stopPropagation();
      activeStep = null;
      selectedChromaticGraphIndex = null;
      const searchToken = setBusy(true);
      setStatus('Searching non-colourable chromatic graphs...');
      scheduleSearch(async () => {
        try {
          chromaticGraphReport = await runSearchWorker('chromatic', { candidateGrid: cand, options: {
            unitType: chromaticUnitTypeEl.value,
            minSectors: chromaticMinSectorsEl.value,
            maxSectors: chromaticMaxSectorsEl.value,
            minDigits: chromaticMinDigitsEl.value,
            maxDigits: chromaticMaxDigitsEl.value,
            maxCells: chromaticMaxCellsEl.value,
          } });
          selectedChromaticGraphIndex = chromaticGraphReport.results.length ? 0 : null;
          if (selectedChromaticGraphIndex !== null) {
            activeStep = chromaticStepFromResult(chromaticGraphReport.results[0]);
          }
          render();
          openReportPanel(chromaticGraphResultsEl);
          setStatus(
            chromaticGraphReport.results.length
              ? `Chromatic graph search found ${chromaticGraphReport.results.length} result${chromaticGraphReport.results.length === 1 ? '' : 's'}.`
              : 'Chromatic graph search found no non-colourable graphs.',
            chromaticGraphReport.results.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (isSearchCancelled(error)) return;
          console.error('Chromatic graph search failed:', error);
          chromaticGraphReport = null;
          render();
          setStatus('Could not search non-colourable chromatic graphs.', 'warn');
        } finally {
          setBusy(false, searchToken);
        }
      }, 0);
    };
    const runChromaticAlsGraphSearch = (event) => {
      event.preventDefault();
      event.stopPropagation();
      activeStep = null;
      selectedChromaticAlsGraphIndex = null;
      const searchToken = setBusy(true);
      setStatus('Searching ALS-backed non-colourable chromatic graphs...');
      scheduleSearch(async () => {
        try {
          chromaticAlsGraphReport = await runSearchWorker('chromatic-als', { candidateGrid: cand, options: {
            unitType: chromaticUnitTypeEl.value,
            minSectors: chromaticMinSectorsEl.value,
            maxSectors: chromaticMaxSectorsEl.value,
            minDigits: chromaticMinDigitsEl.value,
            maxDigits: chromaticMaxDigitsEl.value,
            maxCells: chromaticMaxCellsEl.value,
          } });
          selectedChromaticAlsGraphIndex = chromaticAlsGraphReport.results.length
            ? 0
            : null;
          if (selectedChromaticAlsGraphIndex !== null) {
            activeStep = chromaticStepFromResult(
              chromaticAlsGraphReport.results[0],
            );
          }
          render();
          openReportPanel(chromaticAlsGraphResultsEl);
          setStatus(
            chromaticAlsGraphReport.results.length
              ? `ALS chromatic graph search found ${chromaticAlsGraphReport.results.length} result${chromaticAlsGraphReport.results.length === 1 ? '' : 's'}.`
              : 'ALS chromatic graph search found no formations.',
            chromaticAlsGraphReport.results.length ? 'ok' : 'warn',
          );
        } catch (error) {
          if (isSearchCancelled(error)) return;
          console.error('ALS chromatic graph search failed:', error);
          chromaticAlsGraphReport = null;
          render();
          setStatus('Could not search ALS-backed chromatic graphs.', 'warn');
        } finally {
          setBusy(false, searchToken);
        }
      }, 0);
    };
    appNamespace.chromaticEvents.install({
      graph: chromaticGraphBuildEl,
      alsGraph: chromaticAlsGraphBuildEl,
      runGraph: runChromaticGraphSearch,
      runAlsGraph: runChromaticAlsGraphSearch,
    });
    appNamespace.multiColoringEvents.install(multiColoringBuildEl, runMultiColoringBuild);
    appNamespace.chainEvents.install(chainBuildEl, runChainBuild);
    appNamespace.fishEvents.install(fishBuildEl, runFishBuild);
    appNamespace.alsXzEvents.install(alsXzBuildEl, () => runAlsSearch('als-xz'));
    appNamespace.ahsXzEvents.install(ahsXzBuildEl, () => runAhsSearch('ahs-xz'));
    appNamespace.alcXzEvents.install(alcXzBuildEl, runAlcXzBuild);
    appNamespace.alcXyEvents.install(alcXyBuildEl, runAlcXyBuild);
    appNamespace.alcChainEvents.install(alcChainBuildEl, runAlcChainBuild);
    appNamespace.alcDofEvents.install(alcDofBuildEl, runAlcDofBuild);
    appNamespace.alcHydraEvents.install(alcHydraBuildEl, runAlcHydraBuild);
    appNamespace.ahsXyEvents.install(ahsXyBuildEl, () => runAhsSearch('ahs-xy'));
    appNamespace.ahsChainEvents.install(ahsChainBuildEl, () => runAhsSearch('ahs-chain'));
    appNamespace.ahsDofEvents.install(ahsDofBuildEl, runAhsDofBuild);
    appNamespace.ahsDofChainEvents.install(ahsDofChainBuildEl, runAhsDofChainBuild);
    appNamespace.ahsHydraEvents.install(ahsHydraBuildEl, runAhsHydraBuild);
    appNamespace.ahsLinkEvents.install(ahsLinkBuildEl, runAhsLinkBuild);
    appNamespace.alsXyEvents.install(alsXyBuildEl, () => runAlsSearch('als-xy'));
    appNamespace.alsChainEvents.install(alsChainBuildEl, () => runAlsSearch('als-chain'));
    appNamespace.alsDofEvents.install(alsDofBuildEl, runAlsDofBuild);
    appNamespace.alsDofChainEvents.install(alsDofChainBuildEl, runAlsDofChainBuild);
    appNamespace.alsHydraEvents.install(alsHydraBuildEl, runAlsHydraBuild);
    appNamespace.toyEvents.install({
      transformButtons: document.querySelectorAll('[data-toy-transform]'),
      transformMapper: toyTransformationMapper,
      applyCellTransform: applyToyCellTransform,
      stackSwapButton: toyStackSwapButtonEl,
      stackSwap: () => { const [first, second] = toyPairValue(toyStackSwapEl); applyToyCellTransform(`Stacks ${first + 1} and ${second + 1} swapped`, toyBandStackSwapMapper('stack', first, second)); },
      bandSwapButton: toyBandSwapButtonEl,
      bandSwap: () => { const [first, second] = toyPairValue(toyBandSwapEl); applyToyCellTransform(`Bands ${first + 1} and ${second + 1} swapped`, toyBandStackSwapMapper('band', first, second)); },
      rowSwapButton: toyRowSwapButtonEl,
      rowSwap: () => { const [unit, first, second] = String(toyRowSwapEl.value).split(':').map(Number); applyToyCellTransform(`Rows ${unit * 3 + first + 1} and ${unit * 3 + second + 1} swapped`, toyLocalSwapMapper('row', unit, first, second)); },
      columnSwapButton: toyColumnSwapButtonEl,
      columnSwap: () => { const [unit, first, second] = String(toyColumnSwapEl.value).split(':').map(Number); applyToyCellTransform(`Columns ${unit * 3 + first + 1} and ${unit * 3 + second + 1} swapped`, toyLocalSwapMapper('column', unit, first, second)); },
      digitSwapButton: toyDigitSwapButtonEl,
      digitSwap: () => applyToyDigitExchange(Number(toyDigitAEl.value), Number(toyDigitBEl.value)),
      automorphSearchButton: toyAutomorphSearchEl,
      automorphSearchAction: runToyAutomorphSearch,
      automorphClear: toyAutomorphClearEl,
      minimizerSearchButton: toyMinimizerSearchEl,
      minimizerSearchAction: runToyMinimizer,
      minimizerReplaceButton: toyMinimizerReplaceEl,
      minimizerReplaceAction: replaceWithToyMinimizedGrid,
      useSolution: toyAutomorphUseSolutionEl,
      clearAutomorph: clearToyAutomorphResults,
      clearMiniLex: clearToyMiniLex,
      automorphSource: toyAutomorphSource,
      setStatus,
      legend: toyAutomorphLegendEl,
      legendPanel: toyAutomorphLegendPanelEl,
      legendSymbol: toyAutomorphLegendSymbolEl,
      legendClose: toyAutomorphLegendCloseEl,
      miniLexBuild: toyMiniLexBuildEl,
      buildMiniLex: buildToyMiniLex,
    });
    appNamespace.subsetEvents.install({
      naked: nakedSubsetBuildEl,
      hidden: hiddenSubsetBuildEl,
      boxLine: boxLineBuildEl,
      runNaked: () => runGenericSubsetBuild('naked'),
      runHidden: () => runGenericSubsetBuild('hidden'),
      runBoxLine: runBoxLineBuild,
    });
    appNamespace.copyEvents.install({
      puzzle81: copyPuzzle81El,
      puzzle729: copyPuzzle729El,
      puzzle81Link: copyPuzzle81LinkEl,
      puzzle729Link: copyPuzzle729LinkEl,
      solutionEureka: solutionCopyEurekaEl,
      solutionList: solutionCopyListEl,
      copyPuzzle: copyPuzzleString,
      encodePuzzle: () => core.encode(originalPuzzle),
      current729: current729String,
      linkPuzzle: linkState.puzzleLink,
      cleanEureka: cleanCopiedEureka,
      highlightedEureka: highlightedEurekaText,
      solutionText: solutionListText,
    });
    appNamespace.solutionEvents.install({
      apply: applyHighlightedMoveEl,
      clear: clearHighlightEl,
      undo: undoEl,
      redo: redoEl,
      applyAction: applyHighlightedMove,
      clearAction: clearHighlightedMove,
      undoAction: undoCycle,
      redoAction: redoCycle,
    });
    appNamespace.fishEvents.installSettings({
      digitsOn: document.getElementById('fishDigitsOn'),
      digitsOff: document.getElementById('fishDigitsOff'),
      allSectorButtons: document.querySelectorAll('[data-sector-kind]'),
      setAllDigits,
      setVariantRange: setVariantSectorRange,
      setRange: setSectorRange,
    });
    appNamespace.ocrEvents.install({
      scan: scanImageEl,
      imageInput: ocrImageInputEl,
      result: ocrResultEl,
      load: ocrLoadEl,
      cancel: ocrCancelEl,
      dialog: ocrDialogEl,
      controller: ocrController,
      isLoadable: ocrPuzzleIsLoadable,
      setStatus: text => { ocrStatusEl.textContent = text; },
      loadPuzzle: text => {
        inputEl.value = text;
        loadPuzzle();
      },
    });
    appNamespace.boardEvents.install({
      fixedToggle: showFixedInVantageEl,
      getFixed: () => showFixedInVantage,
      setFixed: value => { showFixedInVantage = value; },
      renderBoard,
      handleKeydown: handlePlayerKeydown,
      gridView: gridViewSelector,
      setGridView,
    });
    appNamespace.variantEvents.install({
      inputs: {
        diagonal: variantDiagonalEl,
        antiDiagonal: variantAntiDiagonalEl,
        windoku: variantWindokuEl,
        antiKing: variantAntiKingEl,
        antiKnight: variantAntiKnightEl,
        nonConsecutive: variantNonConsecutiveEl,
      },
      settings: variantSettings,
      apply: applyVariantSettings,
    });
    appNamespace.exampleEvents.install({
      buttons: document.querySelectorAll('[data-example-puzzle]'),
      input: inputEl,
      load: loadPuzzle,
      closePanel: () => { examplesPanelEl.open = false; },
      scrollBoard: () => boardEl.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    });

    initSearchStopButtons();
    initFishSettings();
    initToyControls({ stack: toyStackSwapEl, band: toyBandSwapEl, row: toyRowSwapEl, column: toyColumnSwapEl,
      digitA: toyDigitAEl, digitB: toyDigitBEl });
    if (linkState.linkedVariantSettings()) {
      core.configureVariants(variantSettings);
      syncFishVariantSectors(true);
    }
    renderToyAutomorphCatalog();
    renderDigitFocusButtons();
    renderCandidateSizeFilterButtons();
    const difficultyInfo = appNamespace.difficultyInfo.create({
      elements: { flow: difficultyFlowListEl, table: difficultyTableEl },
    });
    difficultyInfo.renderFlow(DIFFICULTY_TABLE_GROUPS);
    difficultyInfo.renderTable(DIFFICULTY_TABLE_GROUPS);
    renderGridViewHeaders();
    render();
    const linkedInput = linkState.linkedPuzzleInput();
    if (linkedInput !== null) {
      inputEl.value = linkedInput;
      // A linked grid follows the same validation, uniqueness, and 729-state
      // loading path as the Load button.
      setTimeout(() => loadPuzzle(), 20);
    } else {
      // Paint the empty board first, then generate the default Any puzzle in the worker.
      setTimeout(() => generatePuzzle(), 20);
    }
  
