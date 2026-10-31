
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
    let chromaticGraphReport = null;
    let selectedChromaticGraphIndex = null;
    let chromaticAlsGraphReport = null;
    let selectedChromaticAlsGraphIndex = null;
    const colouringSequenceState = {
      simple: { enabled: false, breadth: 1 },
      multi: { enabled: false, breadth: 1 },
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
        const workerPath = './src/search-worker.js?v=20261031-01';
        releaseSearchWorkerBlobUrl();
        let workerUrl = new URL(workerPath, document.baseURI);
        if (document.baseURI.startsWith('file:')) {
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
          searchWorker = null;
          currentWorker.terminate();
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

    const historyControlsView = appNamespace.historyControlsView.create({
      undo: undoEl,
      redo: redoEl,
    });
    function updateHistoryButtons() {
      historyControlsView.render({
        busy,
        undoCount: undoStack.length,
        redoCount: redoStack.length,
      });
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
        transformation: best.transformation,
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

    let playerKeyboard;
    function handlePlayerKeydown(event) {
      return playerKeyboard.handleKeydown(event);
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
      for (let index = 0; index < digits.length; index += 1) {
        drawVantageWeakConnection(
          svg,
          fromSide,
          toSide,
          digits[index],
          digits[index],
        );
      }
    }

    let vantageOverlayRenderer;
    function renderVantageChainOverlay(chain) {
      return vantageOverlayRenderer.renderChainOverlay(chain);
    }

    function renderVantageStrongLinkOverlay(strongLink) {
      return vantageOverlayRenderer.renderStrongLinkOverlay(strongLink);
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

    let chainSectorFrameRenderer;
    function drawChainSectorFrames(svg, sectors) {
      return chainSectorFrameRenderer.render(svg, sectors);
    }

    let chainOverlayRenderer;
    function renderChainOverlay(chain) {
      return chainOverlayRenderer.render(chain);
    }

    let strongLinkOverlayRenderer;
    function renderStrongLinkOverlay(strongLink) {
      return strongLinkOverlayRenderer.render(strongLink);
    }
    let alsDofOverlayRenderer;
    function renderAlsDofOverlay(record, vantage = false) {
      return alsDofOverlayRenderer.render(record, vantage);
    }

    function renderHydraAlsDofOverlay(record, vantage = false) {
      return alsDofOverlayRenderer.renderHydra(record, vantage);
    }
    const chainHighlightBuilder = appNamespace.chainHighlightBuilder.create({
      alsColorMapForChain,
      ahsColorMapForChain,
      orientedDisplayChainSteps,
      addChainSideMarks,
      chainSideAtoms,
      visibleChainEntrySide,
      visibleChainExitSide,
      atomKey,
      resolvedWeakDigits,
      groupedAnchorPair,
      isAlsVisualStep,
      moduleVisualSides,
      alsColorForSide,
      isAhsVisualStep,
      ahsColorForSide,
    });
    const chainHighlights = chainHighlightBuilder.chainHighlights;
    const colouringNodeKey = appNamespace.colouringModel.colouringNodeKey;
    const selectedColouringRecord = method => appNamespace.colouringModel.selectedColouringRecord({
      simpleColoringReport,
      selectedSimpleColoringIndex,
      multiColoringReport,
      selectedMultiColoringIndex,
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

    const colouringSequenceControls = appNamespace.colouringSequenceControls.create({
      documentRef: document,
      state: colouringSequenceState,
      selectedRecord: selectedColouringRecord,
      sequenceInfo: colouringSequenceInfo,
      displayRecord: displayColouringRecord,
      setSequenceEnabled: (method, enabled) => appNamespace.colouringModel.setColouringSequenceEnabled(colouringSequenceState, method, enabled),
      stepSequence: (method, delta, infoFn) => appNamespace.colouringModel.stepColouringSequence(colouringSequenceState, method, delta, infoFn),
      renderBoard,
    });
    const updateColouringSequenceControls = colouringSequenceControls.render;
    const setColouringSequenceEnabled = colouringSequenceControls.enable;
    const stepColouringSequence = colouringSequenceControls.step;
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
          medusaMulti: threeDMedusaMultiReport,
          multi: multiColoringReport,
          medusa: threeDMedusaReport,
          simple: simpleColoringReport,
        },
        indices: {
          medusaMulti: selectedThreeDMedusaMultiIndex,
          multi: selectedMultiColoringIndex,
          medusa: selectedThreeDMedusaIndex,
          simple: selectedSimpleColoringIndex,
        },
      });
      const {
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
      gridViewController.renderHeaders();
    };

    function setGridView(view) {
      gridViewController.switchView(view);
    }

    function extractGridViewSlice(view) {
      return gridViewController.extractSlice(view);
    }

    let boardRenderer;
    let renderCycle;
    function renderBoard() {
      return boardRenderer.render();
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
      solutionActionsView.render({
        hasHighlightedMove,
        hasLogEntries: logEntries.length > 0,
        canApply: highlightedMoveCanApply(highlightedMoveStep()),
      });
    }

    function openReportPanel(resultEl) {
      panelNavigationView.openReportPanel(resultEl);
    }

    function focusMap() {
      panelNavigationView.focusMap();
    }

    function hideSolution() {
      panelNavigationView.hideSolution();
    }

    function showLoadWarning(message) {
      panelNavigationView.showLoadWarning(message);
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
      return renderCycle.render();
    }

    const { displayTech, constructDisplayName } = appNamespace.displayNames;

    const ratingData = appNamespace.ratingData;
    const RATING_CATEGORY_RANKS = ratingData.ranks;

    const ratingRuntime = appNamespace.ratingRuntime.create(ratingData);
    const { ratingCategoryColorClass, normalizeRatingCategory, ratingCategoryForValue,
      generationTechniqueProfile, ratingDefinition, formatRatingValue, ratingTags } = ratingRuntime;
    const { unknownRating, fishScoreForSize } = appNamespace.ratingScoring.create(ratingData);
    const { chainLengthOf, chainUniqueDigitCount, chainMathScore, pureXyChainDepth,
      depthScaledChainRating } = appNamespace.chainScoring;
    const { isTransportAlsXyRingShape, normalizedChainStructureName } = appNamespace.chainClassification;
    const { chainLinkScoreModifier } = appNamespace.chainModifiers.create(
      module => chainModuleSubsets(module));
    const chainDisplay = appNamespace.chainDisplay.create({
      normalizedChainStructureName,
      openXWingSubclass,
      chainText,
    });
    const chainTextView = appNamespace.chainText.create({
      core,
      displayChainForUi: chain => chainDisplay.displayChainForUi(chain),
      alsSizeOneChainInfo,
      barnsChainInfo,
      barnsTransportChainInfo,
    });
    const { fromResult: chainStepFromResult } = appNamespace.chainStep.create({
      core,
      displayChainForUi: chain => chainDisplay.displayChainForUi(chain),
      chainText,
      defaultCandidateGrid: cand,
    });
    const chainReportView = appNamespace.chainReportView.create({
      documentRef: document,
      chainText,
      selectChain: index => selectChain(index),
      getSelectedChainIndex: () => selectedChainIndex,
      setSelectedChainIndex: value => { selectedChainIndex = value; },
      getChainFolderInfos: chain => chainFolderInfos(chain),
      folderChainText: (chain, folder) => folderChainText(chain, folder),
      chainResultsEl,
      copyText: text => appNamespace.clipboard.copyText(text),
      setStatus,
      core,
      getChainReport: () => chainReport,
      getChainSafetyFlags: chain => chainSafetyFlags(chain),
      showDebug: () => SHOW_AIC_DEBUG,
      chainOutputEl,
      illegalChainResultsEl,
      illegalChainAreaEl,
      illegalChainHeadingEl,
    });
    const chainSearchView = appNamespace.chainSearchView.create({
      documentRef: document,
      chainText,
      getSelectedChainIndex: () => selectedChainIndex,
    });
    const alsDofView = appNamespace.alsDofView.create({
      documentRef: document,
      core,
      getSelectedSource: () => selectedAlsDofSource,
      getSelectedIndex: () => selectedAlsDofIndex,
      setSelectedIndex: value => { selectedAlsDofIndex = value; },
      onSelect: (index, source) => {
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
      },
    });
    const hydraView = appNamespace.hydraView.create({
      documentRef: document,
      formatHydraResult,
      getSelectedFamily: () => selectedHydraFamily,
      getSelectedIndex: () => selectedAlsHydraIndex,
      onSelect: (report, container, family, index) => {
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
        hydraView.renderReport(report, container, family);
        focusMap();
        setStatus(`${family}-Hydra result ${index + 1} displayed.`, 'ok');
      },
    });
    const ahsDofView = appNamespace.ahsDofView.create({
      documentRef: document,
      core,
      getNetIndex: () => selectedAhsDofNetIndex,
      getChainIndex: () => selectedAhsDofChainIndex,
      onNetSelect: (index, report, container) => {
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
        ahsDofView.renderNet(report, container);
        openReportPanel(ahsDofResultsEl);
        focusMap();
        setStatus(`AHS-DOF result ${index + 1} displayed.`, 'ok');
      },
      onChainSelect: (index, report, container) => {
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
        ahsDofView.renderChain(report, container);
        openReportPanel(ahsDofChainResultsEl);
        focusMap();
        setStatus(`AHS-DOF chain ${index + 1} displayed.`, 'ok');
      },
    });
    const dofGroupView = appNamespace.dofGroupView.create({ documentRef: document });
    const auxiliaryLinkView = appNamespace.auxiliaryLinkView.create({
      documentRef: document,
      core,
    });
    const auxiliaryRecordView = appNamespace.auxiliaryRecordView.create({
      documentRef: document,
      dofGroupView,
      core,
    });
    const strongLinkView = appNamespace.strongLinkView.create({
      documentRef: document,
      core,
      getGroups: () => strongLinkDisplayGroups(),
      getSelectedType: () => selectedStrongLinkType,
      getSelectedIndex: () => selectedStrongLinkIndex,
      onTypeSelect: index => {
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
      },
      onLinkSelect: index => selectStrongLink(index),
    });
    const colouringReportView = appNamespace.colouringReportView.create({ documentRef: document });
    const fishView = appNamespace.fishView.create({
      documentRef: document,
      core,
      getSelectedCategory: () => selectedFishCategory,
      getSelectedSize: () => selectedFishSize,
      getSelectedKey: () => selectedFishKey,
      onSelect: (category, index) => selectFishReport(category, index),
    });
    const stepListView = appNamespace.stepListView.create({ documentRef: document });
    const subsetView = appNamespace.subsetView.create({ documentRef: document });
    const solutionActionsView = appNamespace.solutionActionsView.create({
      eurekaButton: solutionCopyEurekaEl,
      listButton: solutionCopyListEl,
      applyButton: applyHighlightedMoveEl,
    });
    const panelNavigationView = appNamespace.panelNavigationView.create({
      boardEl,
      solutionPanel: solutionPanelEl,
    });
    const gridViewController = appNamespace.gridViewController.create({
      vantageView,
      getView: () => gridView,
      setView: view => {
        gridView = view;
        gridViewSelector.value = view;
      },
      selector: gridViewSelector,
      title: gridColumnTitleEl,
      numbers: gridColumnNumbersEl,
      rows: gridRowHeaderEl,
      renderBoard,
      getCandidates: () => cand,
      getPuzzle: () => puzzle,
      core,
      getShowFixed: () => showFixedInVantage,
      vantageCellFromSlot,
    });
    const boardContainerView = appNamespace.boardContainerView.create({
      boardEl,
      updateColouringSequenceControls,
    });
    const boardCellView = appNamespace.boardCellView.create({
      variantCellClasses,
      applyCandidateSizeFilterStyle,
      digitHighlightIsVisible,
      applyAlsColorVars,
      applyAhsColorVars,
      applyAlsPartitionColors,
      bindPlayerCellElement,
    });
    const boardCandidateView = appNamespace.boardCandidateView.create({ documentRef: document });
    const boardOverlayView = appNamespace.boardOverlayView.create({
      renderSectorFrames,
      renderChainOverlay,
      renderHydraAlsDofOverlay,
      renderAlsDofOverlay,
      renderStrongLinkOverlay,
    });
    chainSectorFrameRenderer = appNamespace.chainSectorFrameRenderer.create({
      documentRef: document,
      chainSectorFrameData,
    });
    chainOverlayRenderer = appNamespace.chainOverlayRenderer.create({
      boardEl,
      documentRef: document,
      orientedDisplayChainSteps,
      isModuleVisualStep,
      isAlmostFishVisualStep,
      drawAlmostFishOverlay,
      drawSideDigitBoxes,
      drawGroupedEndpointBox,
      visibleChainExitSide,
      visibleChainEntrySide,
      drawChainSectorFrames,
      drawDirectAlcContacts,
      drawWeakConnection,
      moduleVisualSides,
      drawAhsXzBridgeConnections,
      drawWeakConnections,
      drawStrongConnection,
    });
    vantageOverlayRenderer = appNamespace.vantageOverlayRenderer.create({
      boardEl,
      documentRef: document,
      orientedDisplayChainSteps,
      visibleChainExitSide,
      visibleChainEntrySide,
      isAlsVisualStep,
      moduleVisualSides,
      isAlmostFishVisualStep,
      drawVantageWeakConnection,
      drawVantageWeakConnections,
      drawVantageStrongConnection,
      drawVantageSideBoxes,
      vantageClosestAnchorPair,
      drawArc,
    });
    strongLinkOverlayRenderer = appNamespace.strongLinkOverlayRenderer.create({
      boardEl,
      documentRef: document,
      drawSideDigitBoxes,
      closestAnchorPair,
      drawArc,
    });
    alsDofOverlayRenderer = appNamespace.alsDofOverlayRenderer.create({
      boardEl,
      documentRef: document,
      drawArc,
      vantageClosestAnchorPair,
      groupedAnchorPair,
    });
    boardRenderer = appNamespace.boardRenderer.create({
      boardEl,
      boardContainerView,
      boardCellView,
      boardCandidateView,
      boardOverlayView,
      vantageView,
      extractGridViewSlice,
      documentRef: document,
      getCurrentHighlights: () => currentHighlights(),
      getGridView: () => gridView,
      getActiveStep: () => activeStep,
      getPuzzle: () => puzzle,
      getOriginalPuzzle: () => originalPuzzle,
      getPromotedValues: () => promotedValues,
      getCandidates: () => cand,
      getVariantSettings: () => variantSettings,
      getShowFixedInVantage: () => showFixedInVantage,
      vantageCellFromSlot,
      atomKey,
      digitHighlightIsVisible,
      candidateSizeFilterDigitMatches,
      cellHasCandidate,
      applyCandidateSizeFilterStyle,
      applyMultiColoringStyle,
      applyAlsColorVars,
      applyAhsColorVars,
      getSelectedPlayerCell: () => selectedPlayerCell,
      bindPlayerDigitElement,
      markFor,
      chainCandidateIsVisible,
      renderVantageChainOverlay,
      renderHydraAlsDofOverlay,
      renderAlsDofOverlay,
      renderVantageStrongLinkOverlay,
    });
    const chainSafety = appNamespace.chainSafety.create({
      core,
      getCandidates: () => cand,
      getSolution: () => solution,
      getPuzzle: () => puzzle,
    });
    const chainNaming = appNamespace.chainNaming.create();
    const chainSingleDigit = appNamespace.chainSingleDigit.create({
      core,
      openXWingSubclass,
    });
    const chainNodeAnalysis = appNamespace.chainNodeAnalysis.create({
      chainModuleSubsets,
    });
    const chainAlsInfo = appNamespace.chainAlsInfo.create({
      alsChainNodes,
    });
    const chainBarnsInfo = appNamespace.chainBarnsInfo.create({
      alsChainNodes,
      chainModuleSubsets,
    });
    const chainXyInfo = appNamespace.chainXyInfo.create({
      chainModuleSubsets,
      core,
    });
    const chainFolderInfoView = appNamespace.chainFolderInfo.create();
    const chainLocationDedupe = appNamespace.chainLocationDedupe.create();
    const chainFolderX = appNamespace.chainFolderX.create({
      xChainType,
      chainUniqueDigitCount,
    });
    const chainFolderWings = appNamespace.chainFolderWings.create({
      wChainType,
      splitChainType,
      strongChainType,
      inversionChainType,
    });
    const chainFolderAls = appNamespace.chainFolderAls.create({
      barnsChainInfo,
      barnsTransportChainInfo,
      hiddenXyChainInfo,
      alsOnlyChainInfo,
      alsNamedChainInfo,
      ahsXzChainInfo,
      alsSizeOneChainInfo,
    });
    const chainFolderOrchestrator = appNamespace.chainFolderOrchestrator.create({
      chainEriCount,
      chainFolderInfo,
      chainFolderAls,
      chainFolderX,
      chainFolderWings,
      chainLocationDedupe,
    });
    const { alsDofScore, alsDofMoveKey, alsDofMoveEnabled } = appNamespace.dofRating;

    const RATING_TAGS = ratingTags;

    const DIFFICULTY_TABLE_GROUPS = appNamespace.difficultyInfoData.groups;

    function ratingForChain(chain, step = chain) {
      if (!chain) return unknownRating(step?.desc || '');

      const fullName = normalizedChainStructureName(chain);
      const hierarchyPhase = String(
        step?.hierarchyPhase || chain?.hierarchyPhase || '',
      ).toLowerCase();
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

      // Ordinary multi-digit AICs belong to the dedicated Hard full-depth
      // phase. Do not let the generic digit-count scorer promote them into
      // Demanding merely because the chain visits several digits. Named ALS,
      // AHS, and ALC phases are classified above and are intentionally left
      // on their own difficulty bands.
      if (hierarchyPhase === 'hard-aic-full-depth'
        && /^AIC$/i.test(fullName)) {
        return define('Hard', 7, `AIC${ringSuffix}`);
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
    const pomReportView = appNamespace.pomReportView.create({
      container: pomResultsEl,
      renderList: (title, items) => renderPomList(title, items),
      formatPomOmission: core.formatPomOmission,
      cellGroupName: cells => core.cellGroupName(cells),
    });

    function renderPomReport() {
      pomReportView.render(pomReport);
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
      auxiliaryRecordView.render({
        report: alsReport,
        container: alsResultsEl,
        family: 'ALS',
        label: 'LS / ALS',
        noReportText: 'No LS / ALS build has been run.',
        dofKey: 'alsDOF', sizeKey: 'alsSize', foxKey: 'alsFOX',
        allCellsKey: 'alsAllCells', sectorKey: 'alsSector', digitsKey: 'alsDigits',
        selectedDof: selectedAlsDof,
        selectedId: selectedAlsId,
        openSizeGroups: openAlsSizeGroups,
        setSelectedDof: value => { selectedAlsDof = value; },
        onDofSelect: dof => {
          selectedAlsDof = dof;
          selectedAlsId = null;
          selectedAhsId = null;
          renderBoard();
          renderAlsReport();
        },
        onSelectRecord: selectAlsRecord,
      });
    }

    function renderAlsLinkReport() {
      auxiliaryLinkView.renderAls(alsLinkReport, alsLinkResultsEl);
    }

    function renderAhsReport() {
      auxiliaryRecordView.render({
        report: ahsReport,
        container: ahsResultsEl,
        family: 'AHS',
        label: 'HS / AHS',
        noReportText: 'No HS / AHS build has been run.',
        dofKey: 'ahsDOF', sizeKey: 'ahsSize', foxKey: 'ahsFOX',
        allCellsKey: 'ahsAllCells', sectorKey: 'ahsSector', digitsKey: 'ahsDigits',
        selectedDof: selectedAhsDof,
        selectedId: selectedAhsId,
        openSizeGroups: openAhsSizeGroups,
        setSelectedDof: value => { selectedAhsDof = value; },
        onDofSelect: dof => {
          selectedAhsDof = dof;
          selectedAhsId = null;
          renderBoard();
          renderAhsReport();
        },
        onSelectRecord: selectAhsRecord,
      });
    }

    function renderAhsLinkReport() {
      auxiliaryLinkView.renderAhs(ahsLinkReport, ahsLinkResultsEl);
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
      ahsDofView.renderNet(report, ahsDofResultsEl);
    }

    function renderAhsDofChainResults(report) {
      ahsDofView.renderChain(report, ahsDofChainResultsEl);
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
      strongLinkView.render(strongLinkReport, strongLinkResultsEl);
    }

    const simpleColoringEureka = record =>
      appNamespace.colouringModel.simpleColoringEureka(core, record);

    function renderSimpleColoringReport() {
      colouringReportView.render({
        report: simpleColoringReport,
        container: simpleColoringResultsEl,
        label: 'Simple Colouring',
        emptyText: 'No Simple Colouring search has been run.',
        noResultText: 'No legal eliminations were found using strong-link type 0.',
        eureka: simpleColoringEureka,
        selectedIndex: selectedSimpleColoringIndex,
        onSelect: index => {
          selectedSimpleColoringIndex = index;
          colouringSequenceState.simple.breadth = 1;
          selectedThreeDMedusaIndex = null;
          selectedMultiColoringIndex = null;
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
        },
      });
    }

    const threeDMedusaEureka = record =>
      appNamespace.colouringModel.threeDMedusaEureka(core, record);

    function renderThreeDMedusaReport() {
      colouringReportView.render({
        report: threeDMedusaReport,
        container: threeDMedusaResultsEl,
        label: '3D-Medusa {Simple}',
        emptyText: 'No 3D-Medusa search has been run.',
        noResultText: 'No legal eliminations were found using strong-link types 0 and 4.',
        eureka: threeDMedusaEureka,
        selectedIndex: selectedThreeDMedusaIndex,
        onSelect: index => {
          selectedThreeDMedusaIndex = index;
          colouringSequenceState.medusa.breadth = 1;
          selectedSimpleColoringIndex = null;
          selectedMultiColoringIndex = null;
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
        },
      });
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
        return `${link.label}[${core.cellGroupName(link.cells)}] ${pair || multiColoringOuterText(link.colors)} {${endpoints}}`;
      }).join(' ; ') || 'none';
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
      const linkText = multiColoringLinkText(record);
      return `Multi-colouring: (${digitLabel || 'graph'}) ${linkText}${closure}${witness} => ${eliminations}.`;
    }

    function renderMultiColoringReport() {
      colouringReportView.render({
        report: multiColoringReport,
        container: multiColoringResultsEl,
        label: 'Multi-colouring',
        emptyText: 'No Multi-colouring search has been run.',
        noResultText: 'No Multi-colouring results were found using type-0 strong-link nodes.',
        eureka: multiColoringEureka,
        selectedIndex: selectedMultiColoringIndex,
        onSelect: index => {
          selectedMultiColoringIndex = index;
          colouringSequenceState.multi.breadth = 1;
          selectedSimpleColoringIndex = null;
          selectedThreeDMedusaIndex = null;
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
          renderThreeDMedusaMultiReport();
          setStatus(`Multi-colouring result ${index + 1} selected.`, 'ok');
          focusMap();
        },
      });
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
      colouringReportView.render({
        report: threeDMedusaMultiReport,
        container: threeDMedusaMultiResultsEl,
        label: '3D-Medusa {Multi-colouring}',
        emptyText: 'No 3D-Medusa {Multi-colouring} search has been run.',
        noResultText: 'No legal 3D-Medusa Multi-colouring constructions were found.',
        eureka: threeDMedusaMultiEureka,
        selectedIndex: selectedThreeDMedusaMultiIndex,
        onSelect: index => {
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
          renderThreeDMedusaMultiReport();
          setStatus('3D-Medusa Multi-colouring result ' + (index + 1) + ' selected.', 'ok');
          focusMap();
        },
      });
    }
    function renderFishReport() {
      fishView.render(fishReport, fishResultsEl);
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
      stepListView.render({
        report: boxLineReport,
        container: boxLineResultsEl,
        label: 'Box Line Reduction reports',
        selectedIndex: selectedBoxLineIndex,
        descriptionFor: step => step.desc,
        onSelect: index => selectBoxLineReport(index),
      });
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
      const selected = hidden ? selectedHiddenSubsetSize : selectedNakedSubsetSize;
      const selectedKey = hidden ? selectedHiddenSubsetKey : selectedNakedSubsetKey;
      subsetView.render({
        report,
        container: resultsEl,
        kind,
        selectedKey,
        subsetSizeName,
        cellGroupName: cells => core.cellGroupName(cells),
        sectorGroupName: sectors => core.sectorGroupName(sectors),
        formatRemovals: removals => core.formatRemovals(removals),
        onSelect: (index, size) => selectSubsetReport(kind, index, size),
      });
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
      return chainTextView.format(chain, verbose);
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
      return chainDisplay.displayChainForUi(chain);
    }

    function folderChainText(chain, folder) {
      return chainDisplay.folderChainText(chain, folder);
    }
    function chainFolderInfo(chain) {
      return chainFolderInfoView.chainFolderInfo(chain);
    }

    function chainEriCount(chain) {
      return chainSingleDigit.chainEriCount(chain);
    }

    function isEriOnlyXChain(chain) {
      return chainSingleDigit.isEriOnlyXChain(chain);
    }

    function xChainType(chain, eriCount) {
      return chainSingleDigit.xChainType(chain, eriCount);
    }

    function emptyRectangleChain(chain) {
      return chainSingleDigit.emptyRectangleChain(chain);
    }

    function chainNameWithoutAffix(chain) {
      return chainNaming.chainNameWithoutAffix(chain);
    }

    function wChainType(chain) {
      return chainNaming.wChainType(chain);
    }

    function splitChainType(chain) {
      return chainNaming.splitChainType(chain);
    }

    function strongChainType(chain) {
      return chainNaming.strongChainType(chain);
    }

    function inversionChainType(chain) {
      return chainNaming.inversionChainType(chain);
    }

    function alsChainNodes(chain) {
      return chainNodeAnalysis.alsChainNodes(chain);
    }

    function alsOnlyChainInfo(chain) {
      return chainAlsInfo.alsOnlyChainInfo(chain);
    }

    function alsNamedChainInfo(chain) {
      return chainAlsInfo.alsNamedChainInfo(chain);
    }

    function ahsXzChainInfo(chain) {
      return chainAlsInfo.ahsXzChainInfo(chain);
    }

    function barnsSizeName(size) {
      return chainBarnsInfo.barnsSizeName(size);
    }

    function barnsChainInfo(chain) {
      return chainBarnsInfo.barnsChainInfo(chain);
    }

    function barnsTransportChainInfo(chain) {
      return chainBarnsInfo.barnsTransportChainInfo(chain);
    }

    function alsSizeOneChainInfo(chain) {
      return chainXyInfo.alsSizeOneChainInfo(chain);
    }

    function hiddenXyChainInfo(chain) {
      return chainXyInfo.hiddenXyChainInfo(chain);
    }

    function chainFolderInfos(chain) {
      return chainFolderOrchestrator.chainFolderInfos(chain);
    }

    function appendChainList(container, entries) {
      chainReportView.appendChainList(container, entries);
    }

    function appendChainSubclasses(container, entries) {
      chainReportView.appendChainSubclasses(container, entries);
    }

    function chainFolderPath(folder) {
      return chainReportView.chainFolderPath(folder);
    }

    function appendChainFolderTree(container, entries, depth, selectedFolderKeys) {
      chainReportView.appendChainFolderTree(container, entries, depth, selectedFolderKeys);
    }

    function chainSafetyFlags(chain, candidateGrid = cand, expectedSolution = solution, fixedGrid = puzzle) {
      return chainSafety.flags(chain, candidateGrid, expectedSolution, fixedGrid);
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
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
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
          hierarchyPhase: phase?.hierarchyPhase || phase?.name || '',
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
    const solverAlsMaxCells = (phase, profile = null) =>
      appNamespace.solverPhase.alsMaxCells(phase, profile, chainNodeLimitOptions);

    const solverAlsPassCanStop = appNamespace.solverPhase.alsPassCanStop;
    const solverAhsPassCanStop = appNamespace.solverPhase.ahsPassCanStop;

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
          const step = core.genericSubsetOrFishStep(candidateGrid, fishOptions);
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
            : core.genericSubsetOrFishStep(candidateGrid, {
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

    function flaggedChainEntries(verbose = false) {
      return chainReportView.flaggedChainEntries(verbose);
    }

    function chainOutput(verbose = false) {
      return chainReportView.chainOutput(verbose);
    }

    function renderChainOutput() {
      chainReportView.renderChainOutput();
    }

    function renderIllegalChainReport() {
      chainReportView.renderIllegalChainReport();
    }

    async function copyChainOutput(verbose = false) {
      return chainReportView.copyChainOutput(verbose);
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
          selectedThreeDMedusaMultiIndex = null;
      render();
      setStatus('Highlighted move cleared.', 'ok');
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
      chainReportView.renderChainReport();
    }

    function renderAlsSearchResults() {
      chainSearchView.renderReport({
        container: alsSearchResultsEl,
        report: alsSearchFamily && chainReport ? chainReport : null,
        emptyText: 'No dedicated ALS search has been run.',
        label: alsSearchFamily?.toUpperCase() || 'ALS result',
        listTag: 'div',
        summaryText: chains => `${chains.length} ${alsSearchFamily.toUpperCase()} result${chains.length === 1 ? '' : 's'}.`,
        onSelect: index => {
          selectChain(index);
          openReportPanel(chainResultsEl);
        },
      });
    }

    function renderAhsSearchResults() {
      const label = ahsSearchFamily === 'ahs-xy'
        ? 'AHS-XY'
        : ahsSearchFamily === 'ahs-chain' ? 'AHS-Chain' : 'AHS-XZ';
      chainSearchView.renderReport({
        container: ahsSearchResultsEl,
        report: ahsSearchFamily && chainReport ? chainReport : null,
        emptyText: 'No AHS search has been run.',
        label,
        listTag: 'ul',
        summaryText: chains => {
          let text = `${chains.length} ${label} result${chains.length === 1 ? '' : 's'} found.`;
          if (ahsSearchFamily === 'ahs-xy' && chainReport.stats?.truncated) {
            text += ` Checked ${chainReport.stats.triplesChecked.toLocaleString()} three-set paths; search limit reached.`;
          }
          return text;
        },
        onSelect: index => {
          selectChain(index);
          openReportPanel(chainResultsEl);
        },
      });
    }

    function renderAlcXzResults() {
      chainSearchView.renderReport({
        container: alcSearchResultsEl,
        report: alcXzReport,
        emptyText: 'No ALC-XZ search has been run.',
        label: 'ALC-XZ result',
        summaryText: (chains, report) => `${chains.length} ALC-XZ result${chains.length === 1 ? '' : 's'} found.`
          + (report.stats?.truncated ? ' Search limit reached.' : ''),
        titleForChain: chain => {
          const contacts = chain.alcXz?.contacts || [];
          return chain.alcXz
            ? `ALS + AHS; ${contacts.length} weak digit contact${contacts.length === 1 ? '' : 's'}`
            : 'ALC-XZ chain-engine result';
        },
        onSelect: index => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcXzResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        },
      });
    }

    function renderAlcXyResults() {
      chainSearchView.renderReport({
        container: alcSearchResultsEl,
        report: alcXyReport,
        emptyText: 'No ALC-XY search has been run.',
        label: 'ALC-XY result',
        summaryText: (chains, report) => `${chains.length} ALC-XY result${chains.length === 1 ? '' : 's'} found.`
          + (report.stats?.truncated ? ' Search limit reached.' : ''),
        titleForChain: () => 'Mixed ALC-XY: at least one ALS, one AHS, and one additional node',
        onSelect: index => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcXyResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        },
      });
    }

    function renderAlcChainResults() {
      chainSearchView.renderReport({
        container: alcSearchResultsEl,
        report: alcChainReport,
        emptyText: 'No ALC-Chain search has been run.',
        label: 'ALC-Chain result',
        summaryText: (chains, report) => `${chains.length} ALC-Chain result${chains.length === 1 ? '' : 's'} found.`
          + (report.stats?.truncated ? ' Search limit reached.' : ''),
        titleForChain: () => 'Mixed ALC-Chain: at least one ALS, one AHS, and one additional node',
        onSelect: index => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcChainResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        },
      });
    }

    function renderAlcDofResults() {
      chainSearchView.renderReport({
        container: alcSearchResultsEl,
        report: alcDofReport,
        emptyText: 'No ALC-DOF Chain search has been run.',
        label: 'ALC-DOF Chain result',
        summaryText: (chains, report) => `${chains.length} ALC-DOF Chain result${chains.length === 1 ? '' : 's'} found.`
          + (report.stats?.truncated ? ' Search limit reached.' : ''),
        titleForChain: chain => `ALC-DOF Chain rooted in ${chain.alcDof?.rootType || 'DOF'} and extended with ALS/AHS modules`,
        onSelect: index => {
          selectedChainIndex = index;
          activeStep = null;
          lastRemoved = [];
          renderChainReport();
          renderAlcDofResults();
          renderBoard();
          openReportPanel(alcSearchResultsEl);
          focusMap();
        },
      });
    }

    function renderAlsDofSection(container, report, source, label) {
      alsDofView.renderSection(container, report, source, label);
    }

    function renderAlsDofReport() {
      renderAlsDofSection(alsDofResultsEl, alsDofReport, 'net', 'ALS-DOF nets');
      renderAlsDofSection(alsDofChainResultsEl, alsDofChainReport, 'chain', 'ALS-DOF chains');
    }

    function renderHydraReport(report, container, family) {
      hydraView.renderReport(report, container, family);
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
      if (preserveColouringMethod !== 'simple') selectedSimpleColoringIndex = null;
      if (preserveColouringMethod !== 'medusa') selectedThreeDMedusaIndex = null;
      if (preserveColouringMethod !== 'medusaMulti') selectedThreeDMedusaMultiIndex = null;
      if (preserveColouringMethod !== 'multi') selectedMultiColoringIndex = null;
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

    const ocrScan = appNamespace.ocrScan.create({
      documentRef: document,
      ImageCtor: Image,
      URLRef: URL,
      locationRef: location,
      statusEl: ocrStatusEl,
      core,
    });
    const ocrController = appNamespace.ocrController.create({
      dialog: ocrDialogEl,
      imageInput: ocrImageInputEl,
      result: ocrResultEl,
      load: ocrLoadEl,
      status: ocrStatusEl,
      preview: ocrPreviewEl,
      recognize: file => location.protocol === 'file:'
        ? ocrScan.recognizeSudokuImageWithOcrad(file)
        : ocrScan.recognizeSudokuImage(file),
      isLoadable: ocrScan.ocrPuzzleIsLoadable,
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
      isLoadable: ocrScan.ocrPuzzleIsLoadable,
      setStatus: text => { ocrStatusEl.textContent = text; },
      loadPuzzle: text => {
        inputEl.value = text;
        loadPuzzle();
      },
    });
    playerKeyboard = appNamespace.playerKeyboard.create({
      boardEl,
      documentRef: document,
      state: {
        get selectedCell() { return selectedPlayerCell; },
        set selectedCell(value) { selectedPlayerCell = value; },
        get selectedDigit() { return selectedPlayerDigit; },
        set selectedDigit(value) { selectedPlayerDigit = value; },
        get promotionMode() { return playerPromotionMode; },
        set promotionMode(value) { playerPromotionMode = value; },
        get ctrlDigitRemovesCandidate() { return ctrlDigitRemovesCandidate; },
        get puzzle() { return puzzle; },
        get promoted() { return promotedValues; },
      },
      actions: {
        isBusy: () => busy,
        renderBoard,
        setStatus,
        removePlayerDigit,
        undoCycle,
        redoCycle,
        solvePlayerCell,
        addPlayerCandidate,
        clearPlayerSolvedCell,
        nextCycle,
        runAll,
        basics: applyBasics,
        apply: applyHighlightedMove,
        stop: stopActiveSearch,
        setGridView,
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
        buttons: document.querySelectorAll('[data-example-puzzle], [data-example-key]'),
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
    renderCycle = appNamespace.renderCycle.create({
      renderDigitFocusButtons,
      renderBoard,
      renderStrings,
      renderRatingReport,
      renderLog,
      renderSolutionActions,
      renderPomReport,
      renderAlsReport,
      renderAlsLinkReport,
      renderAhsReport,
      renderAhsLinkReport,
      renderStrongLinkReport,
      renderSimpleColoringReport,
      renderThreeDMedusaReport,
      renderMultiColoringReport,
      renderThreeDMedusaMultiReport,
      renderChromaticGraphReport,
      renderChromaticAlsGraphReport,
      renderFishReport,
      renderMslsReport,
      renderAlsDofReport,
      renderAlsHydraReport,
      renderNakedSubsetReport,
      renderBoxLineReport,
      renderHiddenSubsetReport,
      renderChainReport,
      updateHistoryButtons,
    });
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
  
