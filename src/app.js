
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
    const copy81EmptyAsZeroEl = document.getElementById('copy81EmptyAsZero');
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
    const uniquenessBuildEl = document.getElementById('uniquenessBuild');
    const uniquenessExtendedType1BuildEl = document.getElementById('uniquenessExtendedType1Build');
    const uniquenessExtendedType2BuildEl = document.getElementById('uniquenessExtendedType2Build');
    const uniquenessExtendedType3BuildEl = document.getElementById('uniquenessExtendedType3Build');
    const uniquenessExtendedType3XzBuildEl = document.getElementById('uniquenessExtendedType3XzBuild');
    const uniquenessExtendedType3XyBuildEl = document.getElementById('uniquenessExtendedType3XyBuild');
    const uniquenessExtendedType3ChainBuildEl = document.getElementById('uniquenessExtendedType3ChainBuild');
    const uniquenessType2BuildEl = document.getElementById('uniquenessType2Build');
    const uniquenessType3BuildEl = document.getElementById('uniquenessType3Build');
    const uniquenessType4BuildEl = document.getElementById('uniquenessType4Build');
    const uniquenessExtendedType4BuildEl = document.getElementById('uniquenessExtendedType4Build');
    const uniquenessExtendedType6BuildEl = document.getElementById('uniquenessExtendedType6Build');
    const uniquenessExtendedType7BuildEl = document.getElementById('uniquenessExtendedType7Build');
    const uniquenessExtendedType8BuildEl = document.getElementById('uniquenessExtendedType8Build');
    const uniquenessExtendedType9BuildEl = document.getElementById('uniquenessExtendedType9Build');
    const uniquenessType6BuildEl = document.getElementById('uniquenessType6Build');
    const uniquenessType7BuildEl = document.getElementById('uniquenessType7Build');
    const uniquenessType8BuildEl = document.getElementById('uniquenessType8Build');
    const uniquenessType9BuildEl = document.getElementById('uniquenessType9Build');
    const uniquenessType3XzBuildEl = document.getElementById('uniquenessType3XzBuild');
    const uniquenessType3XyBuildEl = document.getElementById('uniquenessType3XyBuild');
    const uniquenessType3ChainBuildEl = document.getElementById('uniquenessType3ChainBuild');
    const uniquenessType3MenuToggleEl = document.getElementById('uniquenessType3MenuToggle');
    const uniquenessType3MenuEl = document.getElementById('uniquenessType3Menu');
    const uniquenessResultsEl = document.getElementById('uniquenessResults');
    const bugResultsEl = document.getElementById('bugResults');
    let bugReports = null;
    let reverseBugReports = null;
    let mugReports = null;
    const mugResultsEl = document.getElementById('mugResults');
    let pugReports = null;
    const pugResultsEl = document.getElementById('pugResults');
    const reverseBugResultsEl = document.getElementById('reverseBugResults');
    const uniquenessExtendedResultsEl = document.getElementById('uniquenessExtendedResults');
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
    let uniquenessReport = null;
    let uniquenessExtendedType1Report = null;
    let uniquenessExtendedType2Report = null;
    let uniquenessExtendedType3Report = null;
    let uniquenessExtendedType3XzReport = null;
    let uniquenessExtendedType3XyReport = null;
    let uniquenessExtendedType3ChainReport = null;
    let selectedUniquenessIndex = null;
    let selectedUniquenessExtendedType1Index = null;
    let selectedUniquenessExtendedType2Index = null;
    let uniquenessType2Report = null;
    let selectedUniquenessType2Index = null;
    let selectedUniquenessType5Index = null;
    let uniquenessType3Report = null;
    let uniquenessType3XzReport = null;
    let uniquenessType3XyReport = null;
    let uniquenessType3ChainReport = null;
    let uniquenessType4Report = null;
    let uniquenessExtendedType4Report = null;
    let uniquenessExtendedType6Report = null;
    let uniquenessExtendedType7Report = null;
    let uniquenessExtendedType8Report = null;
    let uniquenessExtendedType9Report = null;
    let uniquenessType6Report = null;
    let uniquenessType7Report = null;
    let uniquenessType8Report = null;
    let uniquenessType9Report = null;
    let selectedUniquenessType3Index = null;
    let selectedUniquenessType4Index = null;
    let selectedUniquenessExtendedType4Index = null;
    let selectedUniquenessExtendedType6Index = null;
    let selectedUniquenessExtendedType7Index = null;
    let selectedUniquenessExtendedType8Index = null;
    let selectedUniquenessExtendedType9Index = null;
    let selectedUniquenessType6Index = null;
    let selectedUniquenessType7Index = null;
    let selectedUniquenessType8Index = null;
    let selectedUniquenessType9Index = null;
    let selectedUniquenessType3Family = null;
    let selectedUniquenessType = null;
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
    let playerAnalysisReset;
    function resetAnalysisAfterPlayerEdit() {
      return playerAnalysisReset?.reset();
    }
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
        configureVariants: settings => core.configureVariants(settings),
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
      state: {
        get epoch() { return searchEpoch; },
        set epoch(value) { searchEpoch = value; },
        advanceGenerationToken: () => { generationToken += 1; },
        get worker() { return searchWorker; },
        set worker(value) { searchWorker = value; },
        jobs: searchWorkerJobs,
        get busy() { return busy; },
      },
      actions: {
        finishDiagnostics: reason => finishSearchDiagnostics(reason),
        cancelGenerator: error => appNamespace.generatorRuntime.cancel(error),
        releaseWorkerBlobUrl: () => searchWorkerLifecycle.releaseBlobUrl(),
        setBusy: value => setBusy(value),
        render,
        setStatus,
      },
    });
    let renderSolutionActionsImpl;
    function renderSolutionActions() { return renderSolutionActionsImpl(); }
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
      getEntry: index => logEntries[index],
      isBusy: () => busy,
      cancel: cancelActiveSearches,
      setStatus,
      render,
      focus: focusMap,
    });
    const inspectLogStep = historyState.inspectIndex;
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

    function finishSearchDiagnostics(reason, result = null) {
      appNamespace.searchDiagnostics.finish(reason, result);
    }

    const searchWorkerLifecycle = workerRuntime.createSearchWorkerLifecycle({
      state: appNamespace.workerState,
      diagnostics: appNamespace.searchDiagnostics,
      workerPath: './src/search-worker.js?v=20261119-02',
      onProgressActivity: () => interactiveSearchProgress?.(),
    });

    async function runSearchWorker(type, payload, options = {}) {
      syncVariantSettingsFromControls();
      core.configureVariants(variantSettings);
      const epoch = searchEpoch;
      const result = await searchWorkerLifecycle.run(type, payload, options, {
        getVariantSettings: () => variantSettings,
        getActiveHierarchyPhase: () => activeHierarchyPhase,
      });
      if (epoch !== searchEpoch) throw searchCancellationError();
      return result;
    }

    function runCoreSearch(method, ...args) {
      return runSearchWorker('core-search', { method, args });
    }

    const searchCancellationError = (reason = 'Search cancelled.') => searchControl.cancellationError(reason);
    const isSearchCancelled = error => searchControl.isCancelled(error);
    const scheduleSearch = (callback, delay = 20) => searchControl.schedule(callback, delay);

    function runPuzzleGenerator(givens) {
      return appNamespace.generatorRuntime.run(givens, variantSettings, runCoreSearch);
    }

    function cancelActiveSearches(reason = 'Search cancelled.') {
      return searchControl.cancelActiveSearches(reason);
    }

    function stopActiveSearch() { return searchControl.stopActiveSearch(); }

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
    const selectedAlsRecord = () => activeStep?.alsRecord
      || reportSelection.als(alsReport, selectedAlsId);
    const selectedAlsRecords = () => activeStep?.alsRecords?.length
      ? activeStep.alsRecords
      : [selectedAlsRecord()].filter(Boolean);
    const selectedAlsDofRecord = () => reportSelection.alsDof(
      alsDofReport, alsDofChainReport, selectedAlsDofSource, selectedAlsDofIndex);
    const selectedHydraRecord = () => reportSelection.hydra(
      alsHydraReport, ahsHydraReport, alcHydraReport, selectedHydraFamily, selectedAlsHydraIndex);
    let ratingForStepImpl;
    function ratingForStep(step) { return ratingForStepImpl(step); }
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
      getSelectedChainCandidateGrid: () => selectedChain() ? chainReport?.candidateGrid : null,
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

    playerAnalysisReset = appNamespace.playerAnalysisReset.create({
      state: {
        get cycle() { return cycle; }, set cycle(value) { cycle = value; },
        get activeStep() { return activeStep; }, set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; }, set lastRemoved(value) { lastRemoved = value; },
        get promotionQueue() { return promotionQueue; }, set promotionQueue(value) { promotionQueue = value; },
        get logEntries() { return logEntries; }, set logEntries(value) { logEntries = value; },
        get ratingReport() { return ratingReport; }, set ratingReport(value) { ratingReport = value; },
        get pomReport() { return pomReport; }, set pomReport(value) { pomReport = value; },
        get alsReport() { return alsReport; }, set alsReport(value) { alsReport = value; },
        get alsLinkReport() { return alsLinkReport; }, set alsLinkReport(value) { alsLinkReport = value; },
        get alsDofReport() { return alsDofReport; }, set alsDofReport(value) { alsDofReport = value; },
        get alsDofChainReport() { return alsDofChainReport; }, set alsDofChainReport(value) { alsDofChainReport = value; },
        get ahsReport() { return ahsReport; }, set ahsReport(value) { ahsReport = value; },
        get alcXzReport() { return alcXzReport; }, set alcXzReport(value) { alcXzReport = value; },
        get alcXyReport() { return alcXyReport; }, set alcXyReport(value) { alcXyReport = value; },
        get alcChainReport() { return alcChainReport; }, set alcChainReport(value) { alcChainReport = value; },
        get alcDofReport() { return alcDofReport; }, set alcDofReport(value) { alcDofReport = value; },
        get ahsDofReport() { return ahsDofReport; }, set ahsDofReport(value) { ahsDofReport = value; },
        get ahsDofChainReport() { return ahsDofChainReport; }, set ahsDofChainReport(value) { ahsDofChainReport = value; },
        get ahsLinkReport() { return ahsLinkReport; }, set ahsLinkReport(value) { ahsLinkReport = value; },
        get mslsReport() { return mslsReport; }, set mslsReport(value) { mslsReport = value; },
        get strongLinkReport() { return strongLinkReport; }, set strongLinkReport(value) { strongLinkReport = value; },
        get simpleColoringReport() { return simpleColoringReport; }, set simpleColoringReport(value) { simpleColoringReport = value; },
        get threeDMedusaReport() { return threeDMedusaReport; }, set threeDMedusaReport(value) { threeDMedusaReport = value; },
        get threeDMedusaMultiReport() { return threeDMedusaMultiReport; }, set threeDMedusaMultiReport(value) { threeDMedusaMultiReport = value; },
        get multiColoringReport() { return multiColoringReport; }, set multiColoringReport(value) { multiColoringReport = value; },
        get chromaticGraphReport() { return chromaticGraphReport; }, set chromaticGraphReport(value) { chromaticGraphReport = value; },
        get chromaticAlsGraphReport() { return chromaticAlsGraphReport; }, set chromaticAlsGraphReport(value) { chromaticAlsGraphReport = value; },
        get uniquenessReport() { return uniquenessReport; }, set uniquenessReport(value) { uniquenessReport = value; },
        get bugReports() { return bugReports; }, set bugReports(value) { bugReports = value; },
        get reverseBugReports() { return reverseBugReports; }, set reverseBugReports(value) { reverseBugReports = value; },
        get mugReports() { return mugReports; }, set mugReports(value) { mugReports = value; },
        get pugReports() { return pugReports; }, set pugReports(value) { pugReports = value; },
        get uniquenessExtendedType1Report() { return uniquenessExtendedType1Report; }, set uniquenessExtendedType1Report(value) { uniquenessExtendedType1Report = value; },
        get uniquenessExtendedType2Report() { return uniquenessExtendedType2Report; }, set uniquenessExtendedType2Report(value) { uniquenessExtendedType2Report = value; },
        get uniquenessExtendedType3Report() { return uniquenessExtendedType3Report; }, set uniquenessExtendedType3Report(value) { uniquenessExtendedType3Report = value; },
        get uniquenessExtendedType3XzReport() { return uniquenessExtendedType3XzReport; }, set uniquenessExtendedType3XzReport(value) { uniquenessExtendedType3XzReport = value; },
        get uniquenessExtendedType3XyReport() { return uniquenessExtendedType3XyReport; }, set uniquenessExtendedType3XyReport(value) { uniquenessExtendedType3XyReport = value; },
        get uniquenessExtendedType3ChainReport() { return uniquenessExtendedType3ChainReport; }, set uniquenessExtendedType3ChainReport(value) { uniquenessExtendedType3ChainReport = value; },
        get selectedUniquenessExtendedType1Index() { return selectedUniquenessExtendedType1Index; },
        set selectedUniquenessExtendedType1Index(value) { selectedUniquenessExtendedType1Index = value; },
        get selectedUniquenessExtendedType2Index() { return selectedUniquenessExtendedType2Index; },
        set selectedUniquenessExtendedType2Index(value) { selectedUniquenessExtendedType2Index = value; },
        get uniquenessType2Report() { return uniquenessType2Report; }, set uniquenessType2Report(value) { uniquenessType2Report = value; },
        get uniquenessType3Report() { return uniquenessType3Report; }, set uniquenessType3Report(value) { uniquenessType3Report = value; },
        get uniquenessType3XzReport() { return uniquenessType3XzReport; }, set uniquenessType3XzReport(value) { uniquenessType3XzReport = value; },
        get uniquenessType3XyReport() { return uniquenessType3XyReport; }, set uniquenessType3XyReport(value) { uniquenessType3XyReport = value; },
        get uniquenessType3ChainReport() { return uniquenessType3ChainReport; }, set uniquenessType3ChainReport(value) { uniquenessType3ChainReport = value; },
        get uniquenessType4Report() { return uniquenessType4Report; }, set uniquenessType4Report(value) { uniquenessType4Report = value; },
        get uniquenessExtendedType4Report() { return uniquenessExtendedType4Report; }, set uniquenessExtendedType4Report(value) { uniquenessExtendedType4Report = value; },
        get uniquenessExtendedType6Report() { return uniquenessExtendedType6Report; }, set uniquenessExtendedType6Report(value) { uniquenessExtendedType6Report = value; },
        get uniquenessExtendedType7Report() { return uniquenessExtendedType7Report; }, set uniquenessExtendedType7Report(value) { uniquenessExtendedType7Report = value; },
        get uniquenessExtendedType8Report() { return uniquenessExtendedType8Report; }, set uniquenessExtendedType8Report(value) { uniquenessExtendedType8Report = value; },
        get uniquenessExtendedType9Report() { return uniquenessExtendedType9Report; }, set uniquenessExtendedType9Report(value) { uniquenessExtendedType9Report = value; },
        get uniquenessType6Report() { return uniquenessType6Report; }, set uniquenessType6Report(value) { uniquenessType6Report = value; },
        get uniquenessType7Report() { return uniquenessType7Report; }, set uniquenessType7Report(value) { uniquenessType7Report = value; },
        get uniquenessType8Report() { return uniquenessType8Report; }, set uniquenessType8Report(value) { uniquenessType8Report = value; },
        get uniquenessType9Report() { return uniquenessType9Report; }, set uniquenessType9Report(value) { uniquenessType9Report = value; },
        get fishReport() { return fishReport; }, set fishReport(value) { fishReport = value; },
        get nakedSubsetReport() { return nakedSubsetReport; }, set nakedSubsetReport(value) { nakedSubsetReport = value; },
        get hiddenSubsetReport() { return hiddenSubsetReport; }, set hiddenSubsetReport(value) { hiddenSubsetReport = value; },
        get boxLineReport() { return boxLineReport; }, set boxLineReport(value) { boxLineReport = value; },
        get chainReport() { return chainReport; }, set chainReport(value) { chainReport = value; },
        get alsSearchFamily() { return alsSearchFamily; }, set alsSearchFamily(value) { alsSearchFamily = value; },
        get ahsSearchFamily() { return ahsSearchFamily; }, set ahsSearchFamily(value) { ahsSearchFamily = value; },
        get alsHydraReport() { return alsHydraReport; }, set alsHydraReport(value) { alsHydraReport = value; },
        get ahsHydraReport() { return ahsHydraReport; }, set ahsHydraReport(value) { ahsHydraReport = value; },
        get alcHydraReport() { return alcHydraReport; }, set alcHydraReport(value) { alcHydraReport = value; },
        get selectedAlsHydraIndex() { return selectedAlsHydraIndex; }, set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        get selectedHydraFamily() { return selectedHydraFamily; }, set selectedHydraFamily(value) { selectedHydraFamily = value; },
      },
      resetSelections: () => resetAnalysisSelections({
        set: (key, value) => ({
          selectedMslsIndex: value => { selectedMslsIndex = value; },
          selectedSimpleColoringIndex: value => { selectedSimpleColoringIndex = value; },
          selectedThreeDMedusaIndex: value => { selectedThreeDMedusaIndex = value; },
          selectedThreeDMedusaMultiIndex: value => { selectedThreeDMedusaMultiIndex = value; },
          selectedMultiColoringIndex: value => { selectedMultiColoringIndex = value; },
          selectedChromaticGraphIndex: value => { selectedChromaticGraphIndex = value; },
          selectedChromaticAlsGraphIndex: value => { selectedChromaticAlsGraphIndex = value; },
          selectedBoxLineIndex: value => { selectedBoxLineIndex = value; },
          selectedUniquenessIndex: value => { selectedUniquenessIndex = value; },
          selectedUniquenessExtendedType1Index: value => { selectedUniquenessExtendedType1Index = value; },
          selectedUniquenessExtendedType2Index: value => { selectedUniquenessExtendedType2Index = value; },
          selectedUniquenessType2Index: value => { selectedUniquenessType2Index = value; },
          selectedUniquenessType5Index: value => { selectedUniquenessType5Index = value; },
          selectedUniquenessType3Index: value => { selectedUniquenessType3Index = value; },
          selectedUniquenessType4Index: value => { selectedUniquenessType4Index = value; },
          selectedUniquenessExtendedType4Index: value => { selectedUniquenessExtendedType4Index = value; },
          selectedUniquenessExtendedType6Index: value => { selectedUniquenessExtendedType6Index = value; },
          selectedUniquenessExtendedType7Index: value => { selectedUniquenessExtendedType7Index = value; },
          selectedUniquenessExtendedType8Index: value => { selectedUniquenessExtendedType8Index = value; },
          selectedUniquenessExtendedType9Index: value => { selectedUniquenessExtendedType9Index = value; },
          selectedUniquenessType6Index: value => { selectedUniquenessType6Index = value; },
          selectedUniquenessType7Index: value => { selectedUniquenessType7Index = value; },
          selectedUniquenessType3Family: value => { selectedUniquenessType3Family = value; },
          selectedUniquenessType: value => { selectedUniquenessType = value; },
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
      }),
      clearResultPanes: () => {
        for (const [element, message] of [
          [pomResultsEl, 'No POM check has been run.'],
          [alsResultsEl, 'No LS / ALS build has been run.'],
          [alsLinkResultsEl, 'No ALS link build has been run.'],
          [ahsResultsEl, 'No HS / AHS build has been run.'],
          [ahsLinkResultsEl, 'No AHS link build has been run.'],
          [strongLinkResultsEl, ''],
          [hiddenSubsetResultsEl, ''], [nakedSubsetResultsEl, ''],
          [boxLineResultsEl, ''], [fishResultsEl, ''],
          [alsSearchResultsEl, 'No ALS search has been run.'],
          [alsDofResultsEl, 'No ALS-DOF net search has been run.'],
          [alsDofChainResultsEl, 'No ALS-DOF chain search has been run.'],
          [alsHydraResultsEl, 'No ALS-Hydra search has been run.'],
          [ahsSearchResultsEl, 'No AHS search has been run.'],
          [ahsDofResultsEl, 'No AHS-DOF search has been run.'],
          [ahsDofChainResultsEl, 'No AHS-DOF chain search has been run.'],
          [ahsHydraResultsEl, 'No AHS-Hydra search has been run.'],
          [alcSearchResultsEl, 'No ALC search has been run.'],
          [alcHydraResultsEl, 'No ALC-Hydra search has been run.'],
          [mslsResultsEl, 'No MSLS search has been run.'],
          [chainResultsEl, 'No chain search has been run.'],
          [chromaticGraphResultsEl, 'No chromatic graph search has been run.'],
          [chromaticAlsGraphResultsEl, 'No ALS chromatic graph search has been run.'],
          [uniquenessResultsEl, 'No Unique Rectangle search has been run.'],
          [bugResultsEl, 'No Bivalve Universal Grave search has been run.'],
          [mugResultsEl, 'No Multivalve Universal Grave search has been run.'],
          [pugResultsEl, 'No Permeable Universal Grave search has been run.'],
          [reverseBugResultsEl, 'No Reverse-BUG search has been run.'],
          [uniquenessExtendedResultsEl, 'No Extended Unique Rectangle search has been run.'],
          [simpleColoringResultsEl, 'No Simple Colouring search has been run.'],
          [multiColoringResultsEl, 'No Multi-colouring search has been run.'],
          [threeDMedusaResultsEl, 'No 3D-Medusa search has been run.'],
          [threeDMedusaMultiResultsEl, 'No 3D-Medusa {Multi-colouring} search has been run.'],
        ]) {
          if (element) element.textContent = message;
        }
        if (chainOutputEl) chainOutputEl.textContent = '';
        if (illegalChainResultsEl) illegalChainResultsEl.replaceChildren();
        if (illegalChainAreaEl) illegalChainAreaEl.hidden = true;
      },
      closeSolutionPanel: () => {
        if (solutionStepsPanelEl) solutionStepsPanelEl.open = false;
      },
      clearResultPanes: () => {
        for (const [element, message] of [
          [pomResultsEl, 'No POM check has been run.'],
          [alsResultsEl, 'No LS / ALS build has been run.'],
          [alsLinkResultsEl, 'No ALS link build has been run.'],
          [ahsResultsEl, 'No HS / AHS build has been run.'],
          [ahsLinkResultsEl, 'No AHS link build has been run.'],
          [strongLinkResultsEl, ''],
          [hiddenSubsetResultsEl, ''], [nakedSubsetResultsEl, ''],
          [boxLineResultsEl, ''], [fishResultsEl, ''],
          [alsSearchResultsEl, 'No ALS search has been run.'],
          [alsDofResultsEl, 'No ALS-DOF net search has been run.'],
          [alsDofChainResultsEl, 'No ALS-DOF chain search has been run.'],
          [alsHydraResultsEl, 'No ALS-Hydra search has been run.'],
          [ahsSearchResultsEl, 'No AHS search has been run.'],
          [ahsDofResultsEl, 'No AHS-DOF search has been run.'],
          [ahsDofChainResultsEl, 'No AHS-DOF chain search has been run.'],
          [ahsHydraResultsEl, 'No AHS-Hydra search has been run.'],
          [alcSearchResultsEl, 'No ALC search has been run.'],
          [alcHydraResultsEl, 'No ALC-Hydra search has been run.'],
          [mslsResultsEl, 'No MSLS search has been run.'],
          [chainResultsEl, 'No chain search has been run.'],
          [chromaticGraphResultsEl, 'No chromatic graph search has been run.'],
          [chromaticAlsGraphResultsEl, 'No ALS chromatic graph search has been run.'],
          [uniquenessResultsEl, 'No Unique Rectangle search has been run.'],
          [bugResultsEl, 'No Bivalve Universal Grave search has been run.'],
          [mugResultsEl, 'No Multivalve Universal Grave search has been run.'],
          [pugResultsEl, 'No Permeable Universal Grave search has been run.'],
          [reverseBugResultsEl, 'No Reverse-BUG search has been run.'],
          [uniquenessExtendedResultsEl, 'No Extended Unique Rectangle search has been run.'],
          [simpleColoringResultsEl, 'No Simple Colouring search has been run.'],
          [multiColoringResultsEl, 'No Multi-colouring search has been run.'],
          [threeDMedusaResultsEl, 'No 3D-Medusa search has been run.'],
          [threeDMedusaMultiResultsEl, 'No 3D-Medusa {Multi-colouring} search has been run.'],
        ]) {
          if (element) element.textContent = message;
        }
        if (chainOutputEl) chainOutputEl.textContent = '';
        if (illegalChainResultsEl) illegalChainResultsEl.replaceChildren();
        if (illegalChainAreaEl) illegalChainAreaEl.hidden = true;
      },
    });
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
    let toyMiniLexController;
    function clearToyMiniLex() { return toyMiniLexController.clear(); }
    function buildToyMiniLex() { return toyMiniLexController.build(); }
    toyMiniLexController = appNamespace.toyMiniLexController.create({
      elements: toyMiniLexViewElements,
      getSource: toyAutomorphSource,
      getColumnMaps: toyMiniLexLayoutMaps,
      canonicalize: toyMiniLexCanonicalize,
      permutations: toyPermutations,
      orientedRows: toyMiniLexOrientedRows,
      rowMasks: toyMiniLexRowMasks,
      bestRowMaps: toyMiniLexBestRowMaps,
      compare: toyCompareNumberArrays,
      normalize: toyDigitNormalizeDetails,
      clearView: clearToyMiniLexView,
      renderView: renderToyMiniLexView,
    });

    function clearToyAutomorphResults() {
      appNamespace.toyAutomorphView.clear(toyAutomorphResultsEl);
    }

    let toyMinimizerController;
    function clearToyMinimizerResults() { return toyMinimizerController.clearResults(); }

    const { countToySolutions } = appNamespace.toyMath;
    const { clear: clearToyMinimizerView, render: renderToyMinimizerView } = appNamespace.toyMinimizerView;
    const toyMinimizerViewElements = { results: toyMinimizerResultsEl, replace: toyMinimizerReplaceEl };
    const renderToyMinimizerReport = report =>
      renderToyMinimizerView(toyMinimizerViewElements, report, toyMinimizerCellLabel);
    function toyMinimizerSolutionCount(grid) { return countToySolutions(grid, core, 2); }

    function runToyMinimizer() { return toyMinimizerController.run(); }
    function replaceWithToyMinimizedGrid() { return toyMinimizerController.replace(); }
    toyMinimizerController = appNamespace.toyMinimizerController.create({
      isBusy: () => busy,
      getSource: () => originalPuzzle,
      countSolutions: toyMinimizerSolutionCount,
      resultsEl: toyMinimizerResultsEl,
      clearView: () => clearToyMinimizerView(toyMinimizerViewElements),
      renderView: renderToyMinimizerReport,
      getReport: () => toyMinimizerReport,
      setReport: report => { toyMinimizerReport = report; },
      setStatus,
      setBusy,
      isEpochActive: epoch => busy && epoch === searchEpoch,
      minimize: (...args) => appNamespace.toyMinimizer.minimize(...args),
      scheduleYield: () => new Promise(resolve => setTimeout(resolve, 0)),
      applyReducedGrid: report => applyToyStateChange('Reduced clue grid', () => {
        originalPuzzle = [...report.reduced];
        puzzle = [...report.reduced];
        promotedValues = new Array(81).fill(0);
        cand = core.allCandidates(puzzle);
      }),
    });

    let toyAutomorphController;
    function runToyAutomorphSearch() { return toyAutomorphController.run(); }
    toyAutomorphController = appNamespace.toyAutomorphController.create({
      isBusy: () => busy,
      getSelectedFamilies: () => [...document.querySelectorAll('[data-toy-automorph-family]:checked')]
        .map(input => input.value),
      familyLabels: toySearchFamilyLabels,
      getSource: toyAutomorphSource,
      usesSolution: () => Boolean(toyAutomorphUseSolutionEl?.checked),
      hasGridInformation: values => values.some(value => toyCellDigits(value).length),
      buildMiniLex: buildToyMiniLex,
      getFamilyRecords: getToyFamilyRecords,
      searchAutomorphisms: toySearchAutomorphisms,
      getSearchOptions: () => ({
        normalizedKey: toyNormalizedValueKey,
        mapValues: toyMapValues,
        digitPatternMap: toyDigitPatternMap,
        verifyDigitMap: toyVerifyDigitMap,
        isIdentity: toyIsIdentityPermutation,
        preserves: toyPermutationPreservesActiveVariants,
        complete: toyCompleteAutomorphismSearch,
      }),
      renderSearch: result => appNamespace.toyAutomorphView.renderSearch(
        { results: toyAutomorphResultsEl },
        { ...result, completeLabel: toyCompleteAutomorphismLabel, formatMap: toyFormatDigitMap },
      ),
      resultsEl: toyAutomorphResultsEl,
      setStatus,
    });

    let playerEditing;
    function addPlayerCandidate(cell, digit) { return playerEditing.addPlayerCandidate(cell, digit); }
    function solvePlayerCell(cell, digit) { return playerEditing.solvePlayerCell(cell, digit); }
    function clearPlayerSolvedCell(cell) { return playerEditing.clearPlayerSolvedCell(cell); }
    function removePlayerDigit(cell, digit) { return playerEditing.removePlayerDigit(cell, digit); }
    let playerKeyboard;
    let playerInteraction;
    function handlePlayerKeydown(event) {
      return playerKeyboard.handleKeydown(event);
    }

    function bindPlayerCellElement(element, cell) {
      return playerInteraction.bindPlayerCellElement(element, cell);
    }

    function bindPlayerDigitElement(element, cell, digit) {
      return playerInteraction.bindPlayerDigitElement(element, cell, digit);
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
    const isBivalveVisualStep = appNamespace.chainVisualModel.isBivalveVisualStep;
    const isAhsVisualStep = appNamespace.chainVisualModel.isAhsVisualStep;
    const isModuleVisualStep = step => appNamespace.chainVisualModel.isModuleVisualStep(step, core.ALS);
    const isAlmostFishVisualStep = appNamespace.chainVisualModel.isAlmostFishVisualStep;
    const { resolvedWeakDigits, resolvedStrongDigit } = appNamespace.chainVisualModel;

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
    let drawArcImpl;
    function drawArc(...args) {
      return drawArcImpl(...args);
    }

    const {
      vantageSideAnchors,
      vantageClosestAnchorPair,
      drawVantageSideBoxes,
      drawVantageStrongConnection,
      drawVantageWeakConnection,
      drawVantageWeakConnections,
    } = appNamespace.vantageOverlayDrawing.create({
      documentRef: document,
      vantageAtomAnchor,
      chainCandidateIsVisible,
      applyAlsColorVars,
      resolvedWeakDigits,
      resolvedStrongDigit,
      drawGroupedEndpointBox,
      drawArc,
    });    let vantageOverlayRenderer;
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

    const { anchorRow, anchorCol } = appNamespace.chainVisualGeometry;

    const {
      orderedEdgeArc,
      arcControlPoint,
      boardOverflow,
      bendSignForArc,
      routeArc,
      arcPath,
    } = appNamespace.chainVisualGeometry;

    drawArcImpl = appNamespace.chainArcDrawing.create({
      documentRef: document,
      routeArc,
      arcPath,
    });

    let chainSideBoxDrawing;
    function drawSideDigitBoxes(...args) {
      return chainSideBoxDrawing.drawSideDigitBoxes(...args);
    }
    function drawGroupedEndpointBox(...args) {
      return chainSideBoxDrawing.drawGroupedEndpointBox(...args);
    }
    chainSideBoxDrawing = appNamespace.chainSideBoxDrawing.create({
      documentRef: document,
      sideDigitGroups,
      digitBoundsFromAnchors,
      groupedSideDigits,
      applyAlsColorVars,
    });

    let chainStrongLinkDrawing;
    function drawStrongConnection(...args) {
      return chainStrongLinkDrawing.drawStrongConnection(...args);
    }

    const drawAlmostFishOverlay = appNamespace.almostFishOverlayDrawing.create({
      core,
      documentRef: document,
      sideAnchors,
      digitBoxBounds,
      digitAnchor,
      drawSideDigitBoxes,
      drawStrongConnection,
    });

    const groupedAnchorPair = (
      fromSide,
      toSide,
      forcedDigit = null,
      toDigit = forcedDigit,
      allowMissing = false,
    ) => appNamespace.chainVisualGeometry.groupedAnchorPair(
      fromSide,
      toSide,
      forcedDigit,
      toDigit,
      allowMissing,
      { closestAnchorPair, sideAnchors },
    );

    chainStrongLinkDrawing = appNamespace.chainStrongLinkDrawing.create({
      resolvedStrongDigit,
      groupedAnchorPair,
      drawArc,
    });

    let drawChainSectorFrames;

    let chainOverlayRenderer;
    function renderChainOverlay(chain) {
      return chainOverlayRenderer.render(chain);
    }
    function renderUniquenessRccLinks(links) {
      return chainOverlayRenderer?.renderWeakLinks(links);
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
      isBivalveVisualStep,
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

    const colouringSequenceColourAssignments = appNamespace.colouringSequenceAssignments.create({
      model: appNamespace.colouringModel,
      colouringNodeKey,
    }).colouringSequenceColourAssignments;

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
    const currentHighlights = appNamespace.currentHighlights.create({
      getContext: () => ({
        selectedAlsDofRecord,
        selectedHydraRecord,
        selectedChain,
        chainHighlights,
        mergeChainHighlightView,
        selectedAlsRecord,
        selectedAlsRecords,
        selectedAhsRecord,
        selectedAhsDofChainRecord,
        selectedAhsDofNetRecord,
        buildAlsAhsHighlightContext,
        strongLinkDisplayGroups,
        selectedStrongLinkType,
        selectedStrongLinkIndex,
        buildStrongLinkHighlightContext,
        selectColouringHighlightRecords,
        activeStep,
        threeDMedusaMultiReport,
        multiColoringReport,
        threeDMedusaReport,
        simpleColoringReport,
        selectedThreeDMedusaMultiIndex,
        selectedMultiColoringIndex,
        selectedThreeDMedusaIndex,
        selectedSimpleColoringIndex,
        buildColouringHighlightMarks,
        lastRemoved,
        activeCandidateSizeFilters,
        candidateSizeFilterMatches,
        buildActiveStepHighlightContext,
        activeDigitHighlights,
        candidateSizeFilterStyle,
        AHS_RECORD_COLOR,
      }),
    }).currentHighlights;
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

    const selectedResultSteps = appNamespace.selectedResultSteps.create({
      getFishReport: () => fishReport,
      getSelectedFishKey: () => selectedFishKey,
      fishStepFromReport,
      getSubsetReport: kind => kind === 'hidden' ? hiddenSubsetReport : nakedSubsetReport,
      getSubsetKey: kind => kind === 'hidden' ? selectedHiddenSubsetKey : selectedNakedSubsetKey,
      subsetStepFromReport,
      getBoxLineReport: () => boxLineReport,
      getSelectedBoxLineIndex: () => selectedBoxLineIndex,
      getChainReport: () => chainReport,
      getSelectedChainIndex: () => selectedChainIndex,
      getChainStepFromResult: () => chainStepFromResult,
      getCandidates: () => cand,
    });
    const { selectedFishStep, selectedSubsetStep, selectedBoxLineStep, selectedChainStep } = selectedResultSteps;

    const highlightedEurekaText = appNamespace.highlightedEureka.create({
      core,
      getActiveStep: () => activeStep,
      getChainText: () => chainText,
      getChromaticGraph: () => selectedChromaticGraphIndex !== null
        ? chromaticGraphReport?.results?.[selectedChromaticGraphIndex] || null
        : null,
      getChromaticGraphEureka: () => chromaticGraphEureka,
      getSelectedAhsDofChainRecord: () => selectedAhsDofChainRecord(),
      getSelectedAhsDofNetRecord: () => selectedAhsDofNetRecord(),
      getSelectedAlsDofRecord: () => selectedAlsDofRecord(),
      getSelectedHydraRecord: () => selectedHydraRecord(),
      getHydraResultText: () => formatHydraResult,
      getSelectedFishStep: () => selectedFishStep(),
      getSelectedBoxLineStep: () => selectedBoxLineStep(),
      getSelectedSubsetStep: kind => selectedSubsetStep(kind),
      getSelectedChainStep: () => selectedChainStep(),
    }).highlightedEurekaText;

    const highlightedMoveStep = appNamespace.highlightedMove.create({
      getContext: () => ({
        activeStep,
        selectedAhsDofChainRecord,
        modularAhsDofChainStepFromResult,
        ahsDofChainReport,
        selectedAhsDofChainIndex,
        cand,
        selectedAhsDofNetRecord,
        modularAhsDofStepFromResult,
        ahsDofReport,
        selectedAhsDofNetIndex,
        selectedAlsDofRecord,
        selectedAlsDofSource,
        alsDofStepFromResult,
        alsDofChainReport,
        selectedAlsDofIndex,
        selectedHydraRecord,
        alsHydraStepFromResult,
        selectedAlsHydraIndex,
        selectedFishStep,
        selectedBoxLineStep,
        selectedChromaticGraphIndex,
        chromaticGraphReport,
        chromaticStepFromResult,
        selectedChromaticAlsGraphIndex,
        chromaticAlsGraphReport,
        selectedSubsetStep,
        selectedChainStep,
        selectedChainIndex,
        alcXzReport,
        alcXyReport,
        alcChainReport,
        alcDofReport,
        chainStepFromResult,
        selectedMslsIndex,
        mslsReport,
        mslsStepFromResult,
        selectedSimpleColoringIndex,
        simpleColoringReport,
        colouringStepFromResult,
        selectedThreeDMedusaIndex,
        threeDMedusaReport,
        selectedMultiColoringIndex,
        multiColoringReport,
        selectedThreeDMedusaMultiIndex,
        threeDMedusaMultiReport
      }),
    }).highlightedMoveStep;

    const cleanCopiedEureka = appNamespace.solutionLogView.cleanCopiedEureka;
    const highlightedMoveActions = appNamespace.highlightedMoveActions.create({
      getHighlightedMoveStep: () => highlightedMoveStep(),
      getBoardComplete: () => boardIsComplete(),
      getPromotionQueue: () => promotionQueue,
      getCandidates: () => cand,
      setStatus: (message, kind) => setStatus(message, kind),
      snapshotState: () => snapshotState(),
      applyCycleChoice: (...args) => applyCycleChoice(...args),
      clearSearchResultsAfterApply: method => clearSearchResultsAfterApply(method),
      render: () => render(),
      getHighlightedEurekaText: () => highlightedEurekaText(),
      getLogEntries: () => logEntries,
      renderActionButtons: state => solutionActionsView.render(state),
    });
    const highlightedMoveCanApply = highlightedMoveActions.canApply;
    const applyHighlightedMove = highlightedMoveActions.applyHighlightedMove;
    renderSolutionActionsImpl = highlightedMoveActions.renderSolutionActions;

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
    const chromaticReportController = appNamespace.chromaticReportController.create({
      view: {
        renderGraphReport: renderChromaticGraphView,
        renderAlsGraphReport: renderChromaticAlsGraphView,
        stepFromResult: chromaticStepFromResult,
      },
      elements: { graph: chromaticGraphResultsEl, alsGraph: chromaticAlsGraphResultsEl },
      state: {
        get graphReport() { return chromaticGraphReport; },
        get alsGraphReport() { return chromaticAlsGraphReport; },
        get selectedGraphIndex() { return selectedChromaticGraphIndex; },
        set selectedGraphIndex(value) { selectedChromaticGraphIndex = value; },
        get selectedAlsGraphIndex() { return selectedChromaticAlsGraphIndex; },
        set selectedAlsGraphIndex(value) { selectedChromaticAlsGraphIndex = value; },
        set activeStep(value) { activeStep = value; },
      },
      actions: { render, openReportPanel, focusMap, setStatus },
    });
    function renderChromaticGraphReport() { return chromaticReportController.renderGraph(); }
    function renderChromaticAlsGraphReport() { return chromaticReportController.renderAlsGraph(); }

    const uniquenessSearch = appNamespace.uniquenessSearch.create({
      elements: {
        button: uniquenessBuildEl,
        extendedType1Button: uniquenessExtendedType1BuildEl,
        extendedType2Button: uniquenessExtendedType2BuildEl,
        extendedType3Button: uniquenessExtendedType3BuildEl,
        extendedType3XzButton: uniquenessExtendedType3XzBuildEl,
        extendedType3XyButton: uniquenessExtendedType3XyBuildEl,
        extendedType3ChainButton: uniquenessExtendedType3ChainBuildEl,
        type2Button: uniquenessType2BuildEl,
        type3Button: uniquenessType3BuildEl,
        type3XzButton: uniquenessType3XzBuildEl,
        type3XyButton: uniquenessType3XyBuildEl,
        type3ChainButton: uniquenessType3ChainBuildEl,
        type4Button: uniquenessType4BuildEl,
        extendedType4Button: uniquenessExtendedType4BuildEl,
        extendedType6Button: uniquenessExtendedType6BuildEl,
        extendedType7Button: uniquenessExtendedType7BuildEl,
        extendedType8Button: uniquenessExtendedType8BuildEl,
        extendedType9Button: uniquenessExtendedType9BuildEl,
        type6Button: uniquenessType6BuildEl,
        type7Button: uniquenessType7BuildEl,
        type8Button: uniquenessType8BuildEl,
        type9Button: uniquenessType9BuildEl,
        type3MenuToggle: uniquenessType3MenuToggleEl,
        type3Menu: uniquenessType3MenuEl,
        extendedType3MenuToggle: document.getElementById('uniquenessExtendedType3MenuToggle'),
        extendedType3Menu: document.getElementById('uniquenessExtendedType3Menu'),
        results: uniquenessResultsEl,
        extendedResults: uniquenessExtendedResultsEl,
      },
      state: {
        get candidates() { return cand; },
        get bugReports() { return bugReports; },
        get originalGivens() { return originalPuzzle; },
        get fixedGrid() { return puzzle; },
        get reverseBugReports() { return reverseBugReports; },
        set reverseBugReports(value) { reverseBugReports = value; },
        get mugReports() { return mugReports; }, set mugReports(value) { mugReports = value; },
        get pugReports() { return pugReports; }, set pugReports(value) { pugReports = value; },
        set bugReports(value) { bugReports = value; },
        get report() { return uniquenessReport; },
        set report(value) { uniquenessReport = value; },
        get extendedType1Report() { return uniquenessExtendedType1Report; },
        set extendedType1Report(value) { uniquenessExtendedType1Report = value; },
        get extendedType2Report() { return uniquenessExtendedType2Report; },
        set extendedType2Report(value) { uniquenessExtendedType2Report = value; },
        get extendedType3Report() { return uniquenessExtendedType3Report; },
        set extendedType3Report(value) { uniquenessExtendedType3Report = value; },
        get extendedType3XzReport() { return uniquenessExtendedType3XzReport; },
        set extendedType3XzReport(value) { uniquenessExtendedType3XzReport = value; },
        get extendedType3XyReport() { return uniquenessExtendedType3XyReport; },
        get extendedType3ChainReport() { return uniquenessExtendedType3ChainReport; },
        set extendedType3XyReport(value) { uniquenessExtendedType3XyReport = value; },
        set extendedType3ChainReport(value) { uniquenessExtendedType3ChainReport = value; },
        get type2Report() { return uniquenessType2Report; },
        set type2Report(value) { uniquenessType2Report = value; },
        get type3Report() { return uniquenessType3Report; },
        set type3Report(value) { uniquenessType3Report = value; },
        get type3XzReport() { return uniquenessType3XzReport; },
        set type3XzReport(value) { uniquenessType3XzReport = value; },
        get type3XyReport() { return uniquenessType3XyReport; },
        set type3XyReport(value) { uniquenessType3XyReport = value; },
        get type3ChainReport() { return uniquenessType3ChainReport; },
        set type3ChainReport(value) { uniquenessType3ChainReport = value; },
        get type4Report() { return uniquenessType4Report; },
        get extendedType4Report() { return uniquenessExtendedType4Report; },
        get extendedType6Report() { return uniquenessExtendedType6Report; },
        get extendedType7Report() { return uniquenessExtendedType7Report; },
        get extendedType8Report() { return uniquenessExtendedType8Report; },
        get extendedType9Report() { return uniquenessExtendedType9Report; },
        set type4Report(value) { uniquenessType4Report = value; },
        set extendedType4Report(value) { uniquenessExtendedType4Report = value; },
        set extendedType6Report(value) { uniquenessExtendedType6Report = value; },
        set extendedType7Report(value) { uniquenessExtendedType7Report = value; },
        set extendedType8Report(value) { uniquenessExtendedType8Report = value; },
        set extendedType9Report(value) { uniquenessExtendedType9Report = value; },
        get type6Report() { return uniquenessType6Report; },
        set type6Report(value) { uniquenessType6Report = value; },
        get type7Report() { return uniquenessType7Report; },
        set type7Report(value) { uniquenessType7Report = value; },
        get type8Report() { return uniquenessType8Report; },
        get type9Report() { return uniquenessType9Report; },
        set type8Report(value) { uniquenessType8Report = value; },
        set type9Report(value) { uniquenessType9Report = value; },
        get selectedIndex() { return selectedUniquenessIndex; },
        set selectedIndex(value) { selectedUniquenessIndex = value; },
        get selectedExtendedType1Index() { return selectedUniquenessExtendedType1Index; },
        set selectedExtendedType1Index(value) { selectedUniquenessExtendedType1Index = value; },
        get selectedExtendedType2Index() { return selectedUniquenessExtendedType2Index; },
        set selectedExtendedType2Index(value) { selectedUniquenessExtendedType2Index = value; },
        get selectedType2Index() { return selectedUniquenessType2Index; },
        set selectedType2Index(value) { selectedUniquenessType2Index = value; },
        get selectedType5Index() { return selectedUniquenessType5Index; },
        set selectedType5Index(value) { selectedUniquenessType5Index = value; },
        get selectedType3Index() { return selectedUniquenessType3Index; },
        set selectedType3Index(value) { selectedUniquenessType3Index = value; },
        get selectedType4Index() { return selectedUniquenessType4Index; },
        get selectedExtendedType4Index() { return selectedUniquenessExtendedType4Index; },
        get selectedExtendedType6Index() { return selectedUniquenessExtendedType6Index; },
        get selectedExtendedType7Index() { return selectedUniquenessExtendedType7Index; },
        get selectedExtendedType8Index() { return selectedUniquenessExtendedType8Index; },
        get selectedExtendedType9Index() { return selectedUniquenessExtendedType9Index; },
        set selectedType4Index(value) { selectedUniquenessType4Index = value; },
        set selectedExtendedType4Index(value) { selectedUniquenessExtendedType4Index = value; },
        set selectedExtendedType6Index(value) { selectedUniquenessExtendedType6Index = value; },
        set selectedExtendedType7Index(value) { selectedUniquenessExtendedType7Index = value; },
        set selectedExtendedType8Index(value) { selectedUniquenessExtendedType8Index = value; },
        set selectedExtendedType9Index(value) { selectedUniquenessExtendedType9Index = value; },
        get selectedType6Index() { return selectedUniquenessType6Index; },
        set selectedType6Index(value) { selectedUniquenessType6Index = value; },
        get selectedType7Index() { return selectedUniquenessType7Index; },
        set selectedType7Index(value) { selectedUniquenessType7Index = value; },
        get selectedType8Index() { return selectedUniquenessType8Index; },
        get selectedType9Index() { return selectedUniquenessType9Index; },
        set selectedType8Index(value) { selectedUniquenessType8Index = value; },
        set selectedType9Index(value) { selectedUniquenessType9Index = value; },
        get selectedType3Family() { return selectedUniquenessType3Family; },
        set selectedType3Family(value) { selectedUniquenessType3Family = value; },
        get activeType() { return selectedUniquenessType; },
        set activeType(value) { selectedUniquenessType = value; },
        set activeStep(value) { activeStep = value; },
      },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runSearchWorker,
        renderBoard,
        openReportPanel,
        focusMap,
        isSearchCancelled,
      },
      core,
    });

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
    const { isTransportAlsXyRingShape, normalizedChainStructureName, openXWingSubclass } = appNamespace.chainClassification;
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
    let strongLinkReportController;
    const strongLinkView = appNamespace.strongLinkView.create({
      documentRef: document,
      core,
      getGroups: () => strongLinkDisplayGroups(),
      getSelectedType: () => selectedStrongLinkType,
      getSelectedIndex: () => selectedStrongLinkIndex,
      onTypeSelect: index => strongLinkReportController.selectType(index),
      onLinkSelect: index => strongLinkReportController.selectLink(index),
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
    const {
      boardContainerView,
      boardCellView,
      boardCandidateView,
      boardOverlayView,
    } = appNamespace.boardViewRuntime.create({
      appNamespace,
      boardEl,
      documentRef: document,
      updateColouringSequenceControls,
      variantCellClasses,
      applyCandidateSizeFilterStyle,
      digitHighlightIsVisible,
      applyAlsColorVars,
      applyAhsColorVars,
      applyAlsPartitionColors,
      bindPlayerCellElement,
      renderSectorFrames,
      renderChainOverlay,
      renderHydraAlsDofOverlay,
      renderAlsDofOverlay,
      renderStrongLinkOverlay,
      renderUniquenessRccLinks,
    });
    ({
      drawChainSectorFrames,
      chainOverlayRenderer,
      vantageOverlayRenderer,
      strongLinkOverlayRenderer,
      alsDofOverlayRenderer,
    } = appNamespace.boardOverlayRuntime.create({
      appNamespace,
      boardEl,
      documentRef: document,
      chainSectorFrameData,
      orientedDisplayChainSteps,
      isModuleVisualStep,
      isAlmostFishVisualStep,
      drawAlmostFishOverlay,
      drawSideDigitBoxes,
      drawGroupedEndpointBox,
      visibleChainExitSide,
      visibleChainEntrySide,
      digitAnchor,
      drawArc,
      sideAnchors,
      digitBoundsFromAnchors,
      resolvedWeakDigits,
      moduleVisualSides,
      crossDigitAnchorPair,
      groupedAnchorPair,
      drawStrongConnection,
      isAlsVisualStep,
      drawVantageWeakConnection,
      drawVantageWeakConnections,
      drawVantageStrongConnection,
      drawVantageSideBoxes,
      vantageClosestAnchorPair,
      closestAnchorPair,
    }));
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
    const {
      chainNaming,
      chainSingleDigit,
      chainNodeAnalysis,
      chainAlsInfo,
      chainBarnsInfo,
      chainXyInfo,
      chainFolderInfoView,
      chainFolderX,
      chainFolderWings,
      chainFolderAls,
      chainFolderOrchestrator,
    } = appNamespace.chainRuntime.create({
      core,
      chainClassification: appNamespace.chainClassification,
      chainModuleSubsets,
      chainUniqueDigitCount,
    });
    const { alsDofScore, alsDofMoveKey, alsDofMoveEnabled } = appNamespace.dofRating;

    const RATING_TAGS = ratingTags;

    const DIFFICULTY_TABLE_GROUPS = appNamespace.difficultyInfoData.groups;

    const chainRating = appNamespace.chainRating.create({
      unknownRating,
      normalizedChainStructureName,
      chainLinkScoreModifier,
      ratingCategoryForValue,
      ratingDefinition,
      chainLengthOf,
      chainUniqueDigitCount,
      chainMathScore,
      pureXyChainDepth,
      depthScaledChainRating,
      alsSizeOneChainInfo,
      barnsChainInfo,
      barnsTransportChainInfo,
      chainEriCount,
      hiddenXyChainInfo,
    });
    const { ratingForChain } = chainRating;
    ratingForStepImpl = appNamespace.stepRating.create({
      alsDofScore,
      ratingCategoryForValue,
      ratingDefinition,
      ratingForChain,
      unknownRating,
      ratingTags,
      fishScoreForSize,
    }).ratingForStep;
    const {
      fromResult: alsDofStepFromResult,
      fromAlsChainResult: modularAlsDofChainStepFromResult,
      fromAhsResult: modularAhsDofStepFromResult,
      fromAhsChainResult: modularAhsDofChainStepFromResult,
    } = appNamespace.dofStep.create({
      core,
      rateStep: ratingForStep,
    });

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

    const solverSimulation = appNamespace.solverSimulation.create({
      core,
      getSearchWorkerDisabled: () => searchWorkerDisabled,
      chooseSolverStepInWorker: (...args) => chooseSolverStepInWorker(...args),
      chooseSolverStep: (...args) => chooseSolverStep(...args),
      isSearchCancelled: error => isSearchCancelled(error),
    });

    const rateGeneratedPuzzleInWorker = appNamespace.generatedPuzzleRating.create({
      getContext: () => ({
        generationTechniqueProfile,
        solverSimulation,
        get searchWorker() { return searchWorker; },
        set searchWorker(value) { searchWorker = value; },
        releaseSearchWorkerBlobUrl: () => searchWorkerLifecycle.releaseBlobUrl(),
        get searchWorkerJobs() { return searchWorkerJobs; },
        ratingFromSteps,
        ratingWithSolvedState,
        candidateGridIsSolved,
        isSearchCancelled,
        unknownRating,
      }),
    }).rate;

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

    const appendStep = appNamespace.solutionStepLog.create({
      getContext: () => ({
        cycle,
        ratingForStep,
        constructDisplayName,
        logEntries,
        snapshotVisualState,
        ratingFromLog,
        candidateGridIsSolved,
        cand,
        puzzle,
      }),
      setRatingReport: value => { ratingReport = value; },
    }).appendStep;

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

    let auxiliaryRecordController;
    function renderAlsReport() { return auxiliaryRecordController.renderAls(); }
    function renderAhsReport() { return auxiliaryRecordController.renderAhs(); }

    function renderAlsLinkReport() { return auxiliaryRecordController.renderAlsLinks(); }
    function renderAhsLinkReport() { return auxiliaryRecordController.renderAhsLinks(); }

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

    function renderAhsDofResults(...args) {
      return searchResultsController.renderAhsDofResults(...args);
    }

    function renderAhsDofChainResults(...args) {
      return searchResultsController.renderAhsDofChainResults(...args);
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

    function strongLinkDisplayGroups() { return strongLinkReportController.getGroups(); }
    function renderStrongLinkReport() { return strongLinkReportController.render(); }

    let colouringReportController;
    const simpleColoringEureka = record =>
      appNamespace.colouringModel.simpleColoringEureka(core, record);
    const threeDMedusaEureka = record =>
      appNamespace.colouringModel.threeDMedusaEureka(core, record);
    function renderSimpleColoringReport() { return colouringReportController.renderSimple(); }
    function renderThreeDMedusaReport() { return colouringReportController.renderMedusa(); }

    function applyMultiColoringStyle(element, tokens) {
      return appNamespace.multiColoringStyle.apply(element, tokens);
    }

    let multiColoringReportController;
    function renderMultiColoringReport() { return multiColoringReportController.renderMulti(); }
    const multiColoringText = appNamespace.multiColoringText.create({ core, threeDMedusaEureka });
    const { multiColoringEureka, threeDMedusaMultiEureka } = multiColoringText;

    function renderThreeDMedusaMultiReport() { return multiColoringReportController.renderMedusaMulti(); }
    let fishReportController;
    function renderFishReport() { return fishReportController.renderFishReport(); }
    function fishStepFromReport(fish) { return fishReportController.fishStepFromReport(fish); }
    function selectFishReport(category, index) {
      return fishReportController.selectFishReport(category, index);
    }

    let boxLineReportController;
    function renderBoxLineReport() { return boxLineReportController.renderBoxLineReport(); }
    function selectBoxLineReport(index) { return boxLineReportController.selectBoxLineReport(index); }

    let subsetReportController;
    function subsetStepFromReport(...args) { return subsetReportController.subsetStepFromReport(...args); }
    function renderNakedSubsetReport() { return subsetReportController.renderNakedSubsetReport(); }
    function renderHiddenSubsetReport() { return subsetReportController.renderHiddenSubsetReport(); }

    function chainText(chain, verbose = false) {
      return chainTextView.format(chain, verbose);
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

    const chainSearchOptionsBuilder = appNamespace.chainSearchOptions.create({
      core,
      getVariantSettings: () => variantSettings,
      getPuzzle: () => puzzle,
      chainNodeLimitOptions,
      chainAlsRccEl,
      chainAhsEl,
      chainStrongTypeEls,
      currentAlmostFishOptions,
    });
    function chainSearchOptions(...args) {
      return chainSearchOptionsBuilder.build(...args);
    }
    const chainSearchPlan = appNamespace.chainSearchPlan.create({
      phaseBuilder: appNamespace.phaseBuilder,
      chainAlsRccEl,
      chainStrongTypeEls,
    });
    function chainSearchPhasePlan(...args) {
      return chainSearchPlan.build(...args);
    }
    const solverPhaseRuntime = appNamespace.solverPhaseRuntime.create({
      solverPhase: appNamespace.solverPhase,
      chainNodeLimitOptions,
      chainSearchPhasePlan,
    });
    const {
      solverChainPhasePlan,
      phaseProfile,
      solverAhsMaxCells,
      solverAhsCellPasses,
      solverAlsCellPasses,
      solverSearchPasses,
      solverAlsMaxCells,
      solverAlsPassCanStop,
      solverAhsPassCanStop,
    } = solverPhaseRuntime;


    const chainMatchesSearchPhase = (chain, phase) => appNamespace.solverPhase.matchesSearchPhase(chain, phase, {
      chainUniqueDigitCount,
      chainModuleSubsets,
      barnsTransportChainInfo,
      barnsChainInfo,
      chainMoveKeys,
      alsSizeOneChainInfo,
    });

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

    const chainMoveTieKey = chain => {
      const helpers = {
        chainEriCount,
        isEriOnlyXChain,
        barnsChainInfo,
        barnsTransportChainInfo,
        alsSizeOneChainInfo,
        hiddenXyChainInfo,
      };
      return appNamespace.chainClassification.tieKey(chain, helpers)
        || appNamespace.chainClassification.legacyTieKey(chain, helpers);
    };
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

    const chainSelection = appNamespace.chainSelection.create({
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
    });
    const bestChainFromReport = (...args) =>
      chainSelection.bestFromReport(...args) || chainSelection.legacyBestFromReport(...args);

    let solverDofSearchController;
    const solverDofRanking = appNamespace.solverDofRanking.create({
      selection: appNamespace.alsDofSelection,
      alsDofMoveEnabled: (...args) => alsDofMoveEnabled(...args),
      alsDofStepFromResult: (...args) => alsDofStepFromResult(...args),
      modularAhsDofStepFromResult: (...args) => modularAhsDofStepFromResult(...args),
      modularAlsDofChainStepFromResult: (...args) => modularAlsDofChainStepFromResult(...args),
      modularAhsDofChainStepFromResult: (...args) => modularAhsDofChainStepFromResult(...args),
      directMovePriority,
      isHigherPriorityMove,
    });
    const bestAlsDofMoveFromReport = (...args) => solverDofRanking.bestAlsDofMoveFromReport(...args);

    function findSolverAlsDofMove(
      candidateGrid = cand,
      budget = 'interactive',
      profile = null,
    ) {
      return solverDofSearchController.findSolverAlsDofMove(candidateGrid, budget, profile);
    }

    const bestAhsDofMoveFromReport = (...args) => solverDofRanking.bestAhsDofMoveFromReport(...args);

    function findSolverAhsDofMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAhsDofMove(candidateGrid, budget, profile);
    }

    async function findSolverAhsDofMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAhsDofMoveInWorker(candidateGrid, budget, profile);
    }

    const bestAlsDofChainMoveFromReport = (...args) => solverDofRanking.bestAlsDofChainMoveFromReport(...args);

    function findSolverAlsDofChainMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAlsDofChainMove(candidateGrid, budget, profile);
    }

    async function findSolverAlsDofChainMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAlsDofChainMoveInWorker(candidateGrid, budget, profile);
    }

    const bestAhsDofChainMoveFromReport = (...args) => solverDofRanking.bestAhsDofChainMoveFromReport(...args);

    solverDofSearchController = appNamespace.solverDofSearch.create({
      core,
      getCandidates: () => cand,
      getAlsDofMaxDigits: () => alsDofMaxDigitsEl.value,
      getAlsDofMaxAuxiliary: () => alsDofMaxAuxiliaryEl.value,
      currentSolverMoveTypes,
      bestAlsDofMoveFromReport,
      bestAhsDofMoveFromReport,
      bestAlsDofChainMoveFromReport,
      bestAhsDofChainMoveFromReport,
      runSearchWorker,
    });

    function findSolverAhsDofChainMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAhsDofChainMove(candidateGrid, budget, profile);
    }

    async function findSolverAhsDofChainMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverDofSearchController.findSolverAhsDofChainMoveInWorker(candidateGrid, budget, profile);
    }

    const solverAlcSearchController = appNamespace.solverAlcSearch.create({
      core,
      alcSearch: appNamespace.alcSearch,
      getAlcNodeLimitOptions: () => chainNodeLimitOptions('alc'),
      bestChainFromReport,
      runSearchWorker,
      getCandidates: () => cand,
      getPuzzle: () => puzzle,
      getSolution: () => solution,
    });
    function findSolverAlcMove(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
      phase,
    ) {
      return solverAlcSearchController.findSolverAlcMove(
        candidateGrid, fixedGrid, budget, expectedSolution, profile, phase,
      );
    }

    async function findSolverAlcMoveInWorker(
      candidateGrid = cand,
      fixedGrid = puzzle,
      budget = 'interactive',
      expectedSolution = solution,
      profile = null,
      phase,
    ) {
      return solverAlcSearchController.findSolverAlcMoveInWorker(
        candidateGrid, fixedGrid, budget, expectedSolution, profile, phase,
      );
    }

    const solverMslsSearchController = appNamespace.solverMslsSearch.create({
      core,
      mslsSearch: appNamespace.mslsSearch,
      runSearchWorker,
      getCandidates: () => cand,
      mslsStepFromResult: (...args) => mslsStepFromResult(...args),
      ratingForStep,
      directMovePriority,
      isHigherPriorityMove,
    });
    function findSolverMslsMove(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverMslsSearchController.findSolverMslsMove(candidateGrid, budget, profile);
    }

    async function findSolverMslsMoveInWorker(candidateGrid = cand, budget = 'interactive', profile = null) {
      return solverMslsSearchController.findSolverMslsMoveInWorker(candidateGrid, budget, profile);
    }

    const solverSearchConfig = appNamespace.solverSearchConfig.create({
      core,
      solverPhase: appNamespace.solverPhase,
      currentSolverMoveTypes,
      getPomFishOptions: () => currentPomFishOptions(),
      getChainSearchOptions: (...args) => chainSearchOptions(...args),
      getRequestedDepth: () => chainDepthEl.value,
      getChromaticOptions: () => ({
        enabled: chainChromaticType3El.checked,
        options: {
          unitType: chromaticUnitTypeEl.value,
          minSectors: chromaticMinSectorsEl.value,
          maxSectors: chromaticMaxSectorsEl.value,
          minDigits: chromaticMinDigitsEl.value,
          maxDigits: chromaticMaxDigitsEl.value,
          maxCells: chromaticMaxCellsEl.value,
          maxResults: 120,
        },
      }),
    });
    const solverFishSizes = (...args) => solverSearchConfig.solverFishSizes(...args);
    const solverFishMoveType = (...args) => solverSearchConfig.solverFishMoveType(...args);
    const solverFishOptions = (...args) => solverSearchConfig.solverFishOptions(...args);
    const generatorWorkerConfig = (...args) => solverSearchConfig.generatorWorkerConfig(...args);

    const solverChainExecution = appNamespace.solverChainExecution.create({
      core,
      getCandidates: () => cand,
      getPuzzle: () => puzzle,
      getSolution: () => solution,
      getRequestedDepth: () => chainDepthEl.value,
      currentSolverMoveTypes,
      solverChainPhasePlan: (...args) => solverChainPhasePlan(...args),
      solverSearchPasses: (...args) => solverSearchPasses(...args),
      phaseProfile: (...args) => phaseProfile(...args),
      chainSearchOptions: (...args) => chainSearchOptions(...args),
      generatorWorkerConfig: (...args) => generatorWorkerConfig(...args),
      bestChainFromReport: (...args) => bestChainFromReport(...args),
      isHigherPriorityMove,
      solverAhsPassCanStop,
      solverAhsMaxCells: (...args) => solverAhsMaxCells(...args),
      solverAlsPassCanStop,
      solverAlsMaxCells: (...args) => solverAlsMaxCells(...args),
      runSearchWorker,
    });
    const findSolverChainMove = (...args) => solverChainExecution.findSolverChainMove(...args);
    const findSolverChainMoveInWorker = (...args) => solverChainExecution.findSolverChainMoveInWorker(...args);

    const solverPhasePlan = profile => appNamespace.solverHierarchy.build(profile);

    const solverPhaseAllowsType = (phase, enabledTypes, spec = null) =>
      appNamespace.solverPhase.allowsType(phase, enabledTypes, spec, solverFishMoveType);

    const solverSpecialSearch = appNamespace.solverSpecialSearch.create({
      core,
      getChromaticOptions: () => ({
        unitType: chromaticUnitTypeEl.value,
        minSectors: chromaticMinSectorsEl.value,
        maxSectors: chromaticMaxSectorsEl.value,
        minDigits: chromaticMinDigitsEl.value,
        maxDigits: chromaticMaxDigitsEl.value,
        maxCells: chromaticMaxCellsEl.value,
        maxResults: 120,
      }),
      syncVariantSettings: syncVariantSettingsFromControls,
      getVariantSettings: () => variantSettings,
      chromaticStepFromResult: (...args) => chromaticStepFromResult(...args),
      alsHydraStepFromResult: (...args) => alsHydraStepFromResult(...args),
      ratingForStep,
      directMovePriority,
      isHigherPriorityMove,
      runSearchWorker,
      isHydraEnabled: () => alsDofHydraEnabledEl.checked,
      getHydraMaxDigits: () => alsDofChainMaxDigitsEl.value,
      getHydraMaxAuxiliary: () => alsDofChainMaxAuxiliaryEl.value,
      getHydraMaxResults: () => alsDofChainMaxResultsEl.value,
      setChromaticReport: (alsBacked, report, index) => {
        if (alsBacked) {
          chromaticAlsGraphReport = report;
          selectedChromaticAlsGraphIndex = index;
          renderChromaticAlsGraphReport();
        } else {
          chromaticGraphReport = report;
          selectedChromaticGraphIndex = index;
          renderChromaticGraphReport();
        }
      },
      setAlsHydraReport: (report, index) => {
        alsHydraReport = report;
        selectedAlsHydraIndex = index;
        renderAlsHydraReport();
      },
    });
    const findSolverChromaticMove = (...args) => solverSpecialSearch.findSolverChromaticMove(...args);
    const findSolverChromaticMoveInWorker = (...args) => solverSpecialSearch.findSolverChromaticMoveInWorker(...args);
    const findSolverAlsHydraMove = (...args) => solverSpecialSearch.findSolverAlsHydraMove(...args);
    const findSolverAlsHydraMoveInWorker = (...args) => solverSpecialSearch.findSolverAlsHydraMoveInWorker(...args);

    let directSolverPhaseController;
    function directSolverPhaseStep(...args) {
      return directSolverPhaseController.directSolverPhaseStep(...args);
    }
    function directSolverPhaseStepInWorker(...args) {
      return directSolverPhaseController.directSolverPhaseStepInWorker(...args);
    }
    directSolverPhaseController = appNamespace.directSolverPhase.create({
      core,
      syncVariantSettings: syncVariantSettingsFromControls,
      getVariantSettings: () => variantSettings,
      currentSolverMoveTypes,
      solverPhaseAllowsType,
      solverFishMoveType,
      solverFishOptions,
      ratingForStep,
      directMovePriority,
      isHigherPriorityMove,
      runSearchWorker,
    });

    const solverRunner = appNamespace.solverRunner.create({
      getCandidates: () => cand,
      getPuzzle: () => puzzle,
      getSolution: () => solution,
      solverPhasePlan,
      currentSolverMoveTypes,
      setActiveHierarchyPhase: value => { activeHierarchyPhase = value; },
      solverPhaseAllowsType,
      findSolverChromaticMove,
      findSolverChromaticMoveInWorker,
      findSolverAlsHydraMove,
      findSolverAlsHydraMoveInWorker,
      findSolverAlcMove,
      findSolverAlcMoveInWorker,
      findSolverChainMove,
      findSolverChainMoveInWorker,
      findSolverAlsDofMove,
      bestAlsDofMoveFromReport,
      findSolverAhsDofMove,
      findSolverAhsDofMoveInWorker,
      findSolverAlsDofChainMove,
      findSolverAlsDofChainMoveInWorker,
      findSolverAhsDofChainMove,
      findSolverAhsDofChainMoveInWorker,
      findSolverMslsMove,
      findSolverMslsMoveInWorker,
      directSolverPhaseStep,
      directSolverPhaseStepInWorker,
      runSearchWorker,
      getAlsDofMaxDigits: () => alsDofMaxDigitsEl.value,
      getAlsDofMaxAuxiliary: () => alsDofMaxAuxiliaryEl.value,
    });
    function chooseSolverStep(...args) {
      return solverRunner.chooseSolverStep(...args);
    }
    function chooseSolverStepInWorker(...args) {
      return solverRunner.chooseSolverStepInWorker(...args);
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

    const highlightedMoveSelection = appNamespace.highlightedMoveSelection.create({
      state: {
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
        set selectedAhsDofChainIndex(value) { selectedAhsDofChainIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
      },
      leaveHistoryPreview,
      render,
      setStatus,
    });
    function clearHighlightedMove() { return highlightedMoveSelection.clear(); }

    const selectedChainController = appNamespace.selectedChainController.create({
      state: {
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
      },
      reports: {
        alsSearchFamily: () => alsSearchFamily,
        ahsSearchFamily: () => ahsSearchFamily,
      },
      actions: {
        renderBoard,
        renderFishReport,
        renderNakedSubsetReport,
        renderBoxLineReport,
        renderHiddenSubsetReport,
        renderChainReport,
        renderAlsSearchResults,
        renderAhsSearchResults,
        setStatus,
        focusMap,
      },
    });
    function selectChain(index) { return selectedChainController.select(index); }

    const searchResultsController = appNamespace.searchResultsController.create({
      chainReportView,
      chainSearchView,
      alsDofView,
      ahsDofView,
      hydraView,
      getChainReport: () => chainReport,
      getAlsSearchFamily: () => alsSearchFamily,
      getAhsSearchFamily: () => ahsSearchFamily,
      getAlcXzReport: () => alcXzReport,
      getAlcXyReport: () => alcXyReport,
      getAlcChainReport: () => alcChainReport,
      getAlcDofReport: () => alcDofReport,
      getAlsDofReport: () => alsDofReport,
      getAlsDofChainReport: () => alsDofChainReport,
      getAlsHydraReport: () => alsHydraReport,
      getAhsHydraReport: () => ahsHydraReport,
      getAlcHydraReport: () => alcHydraReport,
      containers: {
        chain: chainResultsEl,
        als: alsSearchResultsEl,
        ahs: ahsSearchResultsEl,
        alc: alcSearchResultsEl,
        alsDof: alsDofResultsEl,
        alsDofChain: alsDofChainResultsEl,
        ahsDof: ahsDofResultsEl,
        ahsDofChain: ahsDofChainResultsEl,
        alsHydra: alsHydraResultsEl,
        ahsHydra: ahsHydraResultsEl,
        alcHydra: alcHydraResultsEl,
      },
      selectChain: index => selectChain(index),
      setSelectedChainIndex: index => { selectedChainIndex = index; },
      clearActiveStep: () => { activeStep = null; },
      clearLastRemoved: () => { lastRemoved = []; },
      renderBoard,
      openReportPanel,
      focusMap,
    });
    function renderChainReport(...args) { return searchResultsController.renderChainReport(...args); }
    function renderAlsSearchResults(...args) { return searchResultsController.renderAlsSearchResults(...args); }
    function renderAhsSearchResults(...args) { return searchResultsController.renderAhsSearchResults(...args); }
    function renderAlcXzResults(...args) { return searchResultsController.renderAlcXzResults(...args); }
    function renderAlcXyResults(...args) { return searchResultsController.renderAlcXyResults(...args); }
    function renderAlcChainResults(...args) { return searchResultsController.renderAlcChainResults(...args); }
    function renderAlcDofResults(...args) { return searchResultsController.renderAlcDofResults(...args); }
    function renderAlsDofReport(...args) { return searchResultsController.renderAlsDofReport(...args); }
    function renderAlsHydraReport(...args) { return searchResultsController.renderAlsHydraReport(...args); }
    function renderAhsHydraReport(...args) { return searchResultsController.renderAhsHydraReport(...args); }
    function renderAlcHydraReport(...args) { return searchResultsController.renderAlcHydraReport(...args); }

    let historySnapshot;
    function snapshotVisualState() { return historySnapshot.snapshotVisualState(); }
    function snapshotState() { return historySnapshot.snapshotState(); }
    historySnapshot = appNamespace.historySnapshot.create({
      core,
      getContext: () => ({
        originalPuzzle,
        puzzle,
        promotedValues,
        cand,
        solution,
        activeStep,
        lastRemoved,
        promotionQueue,
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
        openAlsSizeGroups,
        selectedAhsDof,
        selectedAhsDofNetIndex,
        selectedAhsDofChainIndex,
        selectedAhsId,
        openAhsSizeGroups,
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
        clonePlayerSolveBackups,
        solutionStepsPanelOpen: solutionStepsPanelEl?.open ?? false,
        cycle,
        logEntries,
        ratingReport,
      }),
    });

    const historyRestoreState = {
      get originalPuzzle() { return originalPuzzle; },
      set originalPuzzle(value) { originalPuzzle = value; },
      get puzzle() { return puzzle; },
      set puzzle(value) { puzzle = value; },
      get promotedValues() { return promotedValues; },
      set promotedValues(value) { promotedValues = value; },
      get cand() { return cand; },
      set cand(value) { cand = value; },
      get solution() { return solution; },
      set solution(value) { solution = value; },
      get activeStep() { return activeStep; },
      set activeStep(value) { activeStep = value; },
      get lastRemoved() { return lastRemoved; },
      set lastRemoved(value) { lastRemoved = value; },
      get promotionQueue() { return promotionQueue; },
      set promotionQueue(value) { promotionQueue = value; },
      get pomReport() { return pomReport; },
      set pomReport(value) { pomReport = value; },
      get alsReport() { return alsReport; },
      set alsReport(value) { alsReport = value; },
      get alsLinkReport() { return alsLinkReport; },
      set alsLinkReport(value) { alsLinkReport = value; },
      get alsDofReport() { return alsDofReport; },
      set alsDofReport(value) { alsDofReport = value; },
      get alsDofChainReport() { return alsDofChainReport; },
      set alsDofChainReport(value) { alsDofChainReport = value; },
      get alsHydraReport() { return alsHydraReport; },
      set alsHydraReport(value) { alsHydraReport = value; },
      get ahsHydraReport() { return ahsHydraReport; },
      set ahsHydraReport(value) { ahsHydraReport = value; },
      get alcHydraReport() { return alcHydraReport; },
      set alcHydraReport(value) { alcHydraReport = value; },
      get selectedAlsHydraIndex() { return selectedAlsHydraIndex; },
      set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
      get selectedHydraFamily() { return selectedHydraFamily; },
      set selectedHydraFamily(value) { selectedHydraFamily = value; },
      get ahsReport() { return ahsReport; },
      set ahsReport(value) { ahsReport = value; },
      get ahsDofReport() { return ahsDofReport; },
      set ahsDofReport(value) { ahsDofReport = value; },
      get ahsDofChainReport() { return ahsDofChainReport; },
      set ahsDofChainReport(value) { ahsDofChainReport = value; },
      get strongLinkReport() { return strongLinkReport; },
      set strongLinkReport(value) { strongLinkReport = value; },
      get fishReport() { return fishReport; },
      set fishReport(value) { fishReport = value; },
      get boxLineReport() { return boxLineReport; },
      set boxLineReport(value) { boxLineReport = value; },
      get selectedBoxLineIndex() { return selectedBoxLineIndex; },
      set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
      get nakedSubsetReport() { return nakedSubsetReport; },
      set nakedSubsetReport(value) { nakedSubsetReport = value; },
      get hiddenSubsetReport() { return hiddenSubsetReport; },
      set hiddenSubsetReport(value) { hiddenSubsetReport = value; },
      get chainReport() { return chainReport; },
      set chainReport(value) { chainReport = value; },
      get alsSearchFamily() { return alsSearchFamily; },
      set alsSearchFamily(value) { alsSearchFamily = value; },
      get selectedAlsDof() { return selectedAlsDof; },
      set selectedAlsDof(value) { selectedAlsDof = value; },
      get selectedAlsDofIndex() { return selectedAlsDofIndex; },
      set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
      get selectedAlsDofSource() { return selectedAlsDofSource; },
      set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
      get selectedAlsId() { return selectedAlsId; },
      set selectedAlsId(value) { selectedAlsId = value; },
      get openAlsSizeGroups() { return openAlsSizeGroups; },
      set openAlsSizeGroups(value) { openAlsSizeGroups = value; },
      get selectedAhsDof() { return selectedAhsDof; },
      set selectedAhsDof(value) { selectedAhsDof = value; },
      get selectedAhsDofNetIndex() { return selectedAhsDofNetIndex; },
      set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
      get selectedAhsDofChainIndex() { return selectedAhsDofChainIndex; },
      set selectedAhsDofChainIndex(value) { selectedAhsDofChainIndex = value; },
      get selectedAhsId() { return selectedAhsId; },
      set selectedAhsId(value) { selectedAhsId = value; },
      get openAhsSizeGroups() { return openAhsSizeGroups; },
      set openAhsSizeGroups(value) { openAhsSizeGroups = value; },
      get selectedStrongLinkType() { return selectedStrongLinkType; },
      set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
      get selectedStrongLinkIndex() { return selectedStrongLinkIndex; },
      set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
      get selectedFishCategory() { return selectedFishCategory; },
      set selectedFishCategory(value) { selectedFishCategory = value; },
      get selectedFishSize() { return selectedFishSize; },
      set selectedFishSize(value) { selectedFishSize = value; },
      get selectedFishKey() { return selectedFishKey; },
      set selectedFishKey(value) { selectedFishKey = value; },
      get selectedNakedSubsetSize() { return selectedNakedSubsetSize; },
      set selectedNakedSubsetSize(value) { selectedNakedSubsetSize = value; },
      get selectedNakedSubsetKey() { return selectedNakedSubsetKey; },
      set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
      get selectedHiddenSubsetSize() { return selectedHiddenSubsetSize; },
      set selectedHiddenSubsetSize(value) { selectedHiddenSubsetSize = value; },
      get selectedHiddenSubsetKey() { return selectedHiddenSubsetKey; },
      set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
      get selectedChainIndex() { return selectedChainIndex; },
      set selectedChainIndex(value) { selectedChainIndex = value; },
      get gridView() { return gridView; },
      set gridView(value) { gridView = value; },
      get showFixedInVantage() { return showFixedInVantage; },
      set showFixedInVantage(value) { showFixedInVantage = value; },
      get selectedPlayerCell() { return selectedPlayerCell; },
      set selectedPlayerCell(value) { selectedPlayerCell = value; },
      get selectedPlayerDigit() { return selectedPlayerDigit; },
      set selectedPlayerDigit(value) { selectedPlayerDigit = value; },
      get cycle() { return cycle; },
      set cycle(value) { cycle = value; },
      get logEntries() { return logEntries; },
      set logEntries(value) { logEntries = value; },
      get ratingReport() { return ratingReport; },
      set ratingReport(value) { ratingReport = value; },
    };
    let historyRestore;
    function restoreVisualState(snapshot) { return historyRestore.restoreVisualState(snapshot); }
    function restoreState(snapshot) { return historyRestore.restoreState(snapshot); }
    historyRestore = appNamespace.historyRestore.create({
      core,
      state: historyRestoreState,
      restorePlayerSolveBackups,
      showFixedInVantageEl,
      solutionStepsPanelEl,
    });

    function leaveHistoryPreview() {
      return historyState.leave();
    }

    let puzzleResetController;
    function resetCandidates(...args) { return puzzleResetController.reset(...args); }
    puzzleResetController = appNamespace.puzzleReset.create({
      core,
      state: {
        get originalPuzzle() { return originalPuzzle; },
        get puzzle() { return puzzle; }, set puzzle(value) { puzzle = value; },
        set promotedValues(value) { promotedValues = value; },
        set cand(value) { cand = value; },
        set cycle(value) { cycle = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
        set promotionQueue(value) { promotionQueue = value; },
        set logEntries(value) { logEntries = value; },
        set ratingReport(value) { ratingReport = value; },
        set pomReport(value) { pomReport = value; },
        set alsReport(value) { alsReport = value; },
        set alsLinkReport(value) { alsLinkReport = value; },
        set alsDofReport(value) { alsDofReport = value; },
        set alsDofChainReport(value) { alsDofChainReport = value; },
        set alsHydraReport(value) { alsHydraReport = value; },
        set ahsHydraReport(value) { ahsHydraReport = value; },
        set alcHydraReport(value) { alcHydraReport = value; },
        set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
        set selectedHydraFamily(value) { selectedHydraFamily = value; },
        set ahsReport(value) { ahsReport = value; },
        set alcXzReport(value) { alcXzReport = value; },
        set ahsLinkReport(value) { ahsLinkReport = value; },
        set mslsReport(value) { mslsReport = value; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        get openAlsSizeGroups() { return openAlsSizeGroups; },
        set selectedAhsDof(value) { selectedAhsDof = value; },
        set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
        set selectedAhsDofChainIndex(value) { selectedAhsDofChainIndex = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        get openAhsSizeGroups() { return openAhsSizeGroups; },
        set strongLinkReport(value) { strongLinkReport = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set simpleColoringReport(value) { simpleColoringReport = value; },
        set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
        set threeDMedusaReport(value) { threeDMedusaReport = value; },
        set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set threeDMedusaMultiReport(value) { threeDMedusaMultiReport = value; },
        set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set multiColoringReport(value) { multiColoringReport = value; },
        set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
        set fishReport(value) { fishReport = value; },
        set selectedFishCategory(value) { selectedFishCategory = value; },
        set selectedFishSize(value) { selectedFishSize = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set nakedSubsetReport(value) { nakedSubsetReport = value; },
        set selectedNakedSubsetSize(value) { selectedNakedSubsetSize = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set hiddenSubsetReport(value) { hiddenSubsetReport = value; },
        set selectedHiddenSubsetSize(value) { selectedHiddenSubsetSize = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set chainReport(value) { chainReport = value; },
        set selectedPlayerCell(value) { selectedPlayerCell = value; },
        set selectedPlayerDigit(value) { selectedPlayerDigit = value; },
        set playerPromotionMode(value) { playerPromotionMode = value; },
        set playerSolveBackups(value) { playerSolveBackups = value; },
        set undoStack(value) { undoStack = value; },
        set redoStack(value) { redoStack = value; },
      },
      actions: {
        leaveHistoryPreview,
        clearToyAutomorphResults,
        clearToyMiniLex,
        clearToyMinimizerResults,
        setManualMode,
        resetAnalysisAfterPlayerEdit,
        closeSolutionPanel: () => {
          if (solutionStepsPanelEl) solutionStepsPanelEl.open = false;
        },
        setStatus,
        render,
      },
    });

    let promotionController;
    function promotionsForStep(step, removed) {
      return promotionController.promotionsForStep(step, removed);
    }
    function queuePromotions(step, removed) {
      return promotionController.queuePromotions(step, removed);
    }
    function applyQueuedPromotions() {
      return promotionController.applyQueuedPromotions();
    }
    promotionController = appNamespace.promotionController.create({
      core,
      state: {
        get puzzle() { return puzzle; },
        get cand() { return cand; },
        get promotedValues() { return promotedValues; },
        get promotionQueue() { return promotionQueue; },
        set promotionQueue(value) { promotionQueue = value; },
      },
    });

    const { summary: promotionSummary } = appNamespace.promotionView.create(core.cellName);
    const eliminationVerifier = appNamespace.eliminationVerifier.create({
      core,
      state: {
        get solution() { return solution; },
        get puzzle() { return puzzle; },
        get cand() { return cand; },
      },
    });

    // Final move gate shared by Next, Run All, and selected structure results.
    // Technique engines propose candidates; the shared verifier checks each
    // proposed elimination before the board state changes.
    const cycleApplication = appNamespace.cycleApplication.create({
      getContext: () => ({
        core,
        cand,
        boardIsComplete,
        promotionSummary,
        lastChainSelectionDiagnostics,
        setStatus,
        verifyEliminationsByCompletion: items => eliminationVerifier.verify(items),
        queuePromotions,
        appendStep,
        displayTech,
        get activeStep() { return activeStep; },
        set activeStep(value) { activeStep = value; },
        get lastRemoved() { return lastRemoved; },
        set lastRemoved(value) { lastRemoved = value; },
        get cycle() { return cycle; },
        set cycle(value) { cycle = value; },
        get undoStack() { return undoStack; },
        set undoStack(value) { undoStack = value; },
        get redoStack() { return redoStack; },
        set redoStack(value) { redoStack = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        get selectedChainIndex() { return selectedChainIndex; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        get alsDofReport() { return alsDofReport; },
        set alsDofReport(value) { alsDofReport = value; },
        get selectedAlsDofSource() { return selectedAlsDofSource; },
        set selectedAlsDofSource(value) { selectedAlsDofSource = value; },
        get selectedAlsDofIndex() { return selectedAlsDofIndex; },
        set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
        get selectedAlsDof() { return selectedAlsDof; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
      }),
    });
    const applyCycleChoice = (...args) => cycleApplication.apply(...args);

    const searchResultReset = appNamespace.searchResultReset.create({
      state: {
      get uniquenessReport() { return uniquenessReport; },
      get bugReports() { return bugReports; }, set bugReports(value) { bugReports = value; },
      get reverseBugReports() { return reverseBugReports; }, set reverseBugReports(value) { reverseBugReports = value; },
      get mugReports() { return mugReports; }, set mugReports(value) { mugReports = value; },
      get pugReports() { return pugReports; }, set pugReports(value) { pugReports = value; },
      set uniquenessReport(value) { uniquenessReport = value; },
      get uniquenessExtendedType1Report() { return uniquenessExtendedType1Report; },
      set uniquenessExtendedType1Report(value) { uniquenessExtendedType1Report = value; },
      get uniquenessExtendedType2Report() { return uniquenessExtendedType2Report; },
      set uniquenessExtendedType2Report(value) { uniquenessExtendedType2Report = value; },
      get uniquenessExtendedType3Report() { return uniquenessExtendedType3Report; },
      set uniquenessExtendedType3Report(value) { uniquenessExtendedType3Report = value; },
      get uniquenessExtendedType3XzReport() { return uniquenessExtendedType3XzReport; },
      set uniquenessExtendedType3XzReport(value) { uniquenessExtendedType3XzReport = value; },
      get uniquenessExtendedType3XyReport() { return uniquenessExtendedType3XyReport; },
      get uniquenessExtendedType3ChainReport() { return uniquenessExtendedType3ChainReport; },
      set uniquenessExtendedType3XyReport(value) { uniquenessExtendedType3XyReport = value; },
      set uniquenessExtendedType3ChainReport(value) { uniquenessExtendedType3ChainReport = value; },
      get selectedUniquenessIndex() { return selectedUniquenessIndex; },
      set selectedUniquenessIndex(value) { selectedUniquenessIndex = value; },
      get selectedUniquenessExtendedType1Index() { return selectedUniquenessExtendedType1Index; },
      set selectedUniquenessExtendedType1Index(value) { selectedUniquenessExtendedType1Index = value; },
      get selectedUniquenessExtendedType2Index() { return selectedUniquenessExtendedType2Index; },
      set selectedUniquenessExtendedType2Index(value) { selectedUniquenessExtendedType2Index = value; },
      get uniquenessType2Report() { return uniquenessType2Report; },
      set uniquenessType2Report(value) { uniquenessType2Report = value; },
      get selectedUniquenessType2Index() { return selectedUniquenessType2Index; },
      set selectedUniquenessType2Index(value) { selectedUniquenessType2Index = value; },
      get selectedUniquenessType5Index() { return selectedUniquenessType5Index; },
      set selectedUniquenessType5Index(value) { selectedUniquenessType5Index = value; },
      get uniquenessType3Report() { return uniquenessType3Report; },
      set uniquenessType3Report(value) { uniquenessType3Report = value; },
      get uniquenessType3XzReport() { return uniquenessType3XzReport; },
      set uniquenessType3XzReport(value) { uniquenessType3XzReport = value; },
      get uniquenessType3XyReport() { return uniquenessType3XyReport; },
      set uniquenessType3XyReport(value) { uniquenessType3XyReport = value; },
      get uniquenessType3ChainReport() { return uniquenessType3ChainReport; },
      set uniquenessType3ChainReport(value) { uniquenessType3ChainReport = value; },
      get uniquenessType4Report() { return uniquenessType4Report; },
      get uniquenessExtendedType4Report() { return uniquenessExtendedType4Report; },
      get uniquenessExtendedType6Report() { return uniquenessExtendedType6Report; },
      get uniquenessExtendedType7Report() { return uniquenessExtendedType7Report; },
      get uniquenessExtendedType8Report() { return uniquenessExtendedType8Report; },
      get uniquenessExtendedType9Report() { return uniquenessExtendedType9Report; },
      set uniquenessType4Report(value) { uniquenessType4Report = value; },
      set uniquenessExtendedType4Report(value) { uniquenessExtendedType4Report = value; },
      set uniquenessExtendedType6Report(value) { uniquenessExtendedType6Report = value; },
      set uniquenessExtendedType7Report(value) { uniquenessExtendedType7Report = value; },
      set uniquenessExtendedType8Report(value) { uniquenessExtendedType8Report = value; },
      set uniquenessExtendedType9Report(value) { uniquenessExtendedType9Report = value; },
      get uniquenessType6Report() { return uniquenessType6Report; },
      set uniquenessType6Report(value) { uniquenessType6Report = value; },
      get uniquenessType7Report() { return uniquenessType7Report; },
      set uniquenessType7Report(value) { uniquenessType7Report = value; },
      get uniquenessType8Report() { return uniquenessType8Report; },
      get uniquenessType9Report() { return uniquenessType9Report; },
      set uniquenessType8Report(value) { uniquenessType8Report = value; },
      set uniquenessType9Report(value) { uniquenessType9Report = value; },
      get selectedUniquenessType3Index() { return selectedUniquenessType3Index; },
      set selectedUniquenessType3Index(value) { selectedUniquenessType3Index = value; },
      get selectedUniquenessType4Index() { return selectedUniquenessType4Index; },
      get selectedUniquenessExtendedType4Index() { return selectedUniquenessExtendedType4Index; },
      get selectedUniquenessExtendedType6Index() { return selectedUniquenessExtendedType6Index; },
      get selectedUniquenessExtendedType7Index() { return selectedUniquenessExtendedType7Index; },
      get selectedUniquenessExtendedType8Index() { return selectedUniquenessExtendedType8Index; },
      get selectedUniquenessExtendedType9Index() { return selectedUniquenessExtendedType9Index; },
      set selectedUniquenessType4Index(value) { selectedUniquenessType4Index = value; },
      set selectedUniquenessExtendedType4Index(value) { selectedUniquenessExtendedType4Index = value; },
      set selectedUniquenessExtendedType6Index(value) { selectedUniquenessExtendedType6Index = value; },
      set selectedUniquenessExtendedType7Index(value) { selectedUniquenessExtendedType7Index = value; },
      set selectedUniquenessExtendedType8Index(value) { selectedUniquenessExtendedType8Index = value; },
      set selectedUniquenessExtendedType9Index(value) { selectedUniquenessExtendedType9Index = value; },
      get selectedUniquenessType6Index() { return selectedUniquenessType6Index; },
      set selectedUniquenessType6Index(value) { selectedUniquenessType6Index = value; },
      get selectedUniquenessType7Index() { return selectedUniquenessType7Index; },
      set selectedUniquenessType7Index(value) { selectedUniquenessType7Index = value; },
      get selectedUniquenessType8Index() { return selectedUniquenessType8Index; },
      get selectedUniquenessType9Index() { return selectedUniquenessType9Index; },
      set selectedUniquenessType8Index(value) { selectedUniquenessType8Index = value; },
      set selectedUniquenessType9Index(value) { selectedUniquenessType9Index = value; },
      get selectedUniquenessType3Family() { return selectedUniquenessType3Family; },
      set selectedUniquenessType3Family(value) { selectedUniquenessType3Family = value; },
      get selectedUniquenessType() { return selectedUniquenessType; },
      set selectedUniquenessType(value) { selectedUniquenessType = value; },
      get pomReport() { return pomReport; },
      set pomReport(value) { pomReport = value; },
      get alsReport() { return alsReport; },
      set alsReport(value) { alsReport = value; },
      get alsLinkReport() { return alsLinkReport; },
      set alsLinkReport(value) { alsLinkReport = value; },
      get alsDofReport() { return alsDofReport; },
      set alsDofReport(value) { alsDofReport = value; },
      get alsDofChainReport() { return alsDofChainReport; },
      set alsDofChainReport(value) { alsDofChainReport = value; },
      get alsHydraReport() { return alsHydraReport; },
      set alsHydraReport(value) { alsHydraReport = value; },
      get ahsHydraReport() { return ahsHydraReport; },
      set ahsHydraReport(value) { ahsHydraReport = value; },
      get alcHydraReport() { return alcHydraReport; },
      set alcHydraReport(value) { alcHydraReport = value; },
      get selectedAlsHydraIndex() { return selectedAlsHydraIndex; },
      set selectedAlsHydraIndex(value) { selectedAlsHydraIndex = value; },
      get selectedHydraFamily() { return selectedHydraFamily; },
      set selectedHydraFamily(value) { selectedHydraFamily = value; },
      get ahsReport() { return ahsReport; },
      set ahsReport(value) { ahsReport = value; },
      get ahsLinkReport() { return ahsLinkReport; },
      set ahsLinkReport(value) { ahsLinkReport = value; },
      get ahsDofReport() { return ahsDofReport; },
      set ahsDofReport(value) { ahsDofReport = value; },
      get ahsDofChainReport() { return ahsDofChainReport; },
      set ahsDofChainReport(value) { ahsDofChainReport = value; },
      get alcXzReport() { return alcXzReport; },
      set alcXzReport(value) { alcXzReport = value; },
      get alcXyReport() { return alcXyReport; },
      set alcXyReport(value) { alcXyReport = value; },
      get alcChainReport() { return alcChainReport; },
      set alcChainReport(value) { alcChainReport = value; },
      get alcDofReport() { return alcDofReport; },
      set alcDofReport(value) { alcDofReport = value; },
      get mslsReport() { return mslsReport; },
      set mslsReport(value) { mslsReport = value; },
      get strongLinkReport() { return strongLinkReport; },
      set strongLinkReport(value) { strongLinkReport = value; },
      get fishReport() { return fishReport; },
      set fishReport(value) { fishReport = value; },
      get boxLineReport() { return boxLineReport; },
      set boxLineReport(value) { boxLineReport = value; },
      get nakedSubsetReport() { return nakedSubsetReport; },
      set nakedSubsetReport(value) { nakedSubsetReport = value; },
      get hiddenSubsetReport() { return hiddenSubsetReport; },
      set hiddenSubsetReport(value) { hiddenSubsetReport = value; },
      get chainReport() { return chainReport; },
      set chainReport(value) { chainReport = value; },
      get alsSearchFamily() { return alsSearchFamily; },
      set alsSearchFamily(value) { alsSearchFamily = value; },
      get ahsSearchFamily() { return ahsSearchFamily; },
      set ahsSearchFamily(value) { ahsSearchFamily = value; },
      get selectedAlsId() { return selectedAlsId; },
      set selectedAlsId(value) { selectedAlsId = value; },
      get selectedAhsId() { return selectedAhsId; },
      set selectedAhsId(value) { selectedAhsId = value; },
      get selectedAlsDof() { return selectedAlsDof; },
      set selectedAlsDof(value) { selectedAlsDof = value; },
      get selectedAlsDofIndex() { return selectedAlsDofIndex; },
      set selectedAlsDofIndex(value) { selectedAlsDofIndex = value; },
      get selectedAhsDof() { return selectedAhsDof; },
      set selectedAhsDof(value) { selectedAhsDof = value; },
      get selectedAhsDofNetIndex() { return selectedAhsDofNetIndex; },
      set selectedAhsDofNetIndex(value) { selectedAhsDofNetIndex = value; },
      get selectedAhsDofChainIndex() { return selectedAhsDofChainIndex; },
      set selectedAhsDofChainIndex(value) { selectedAhsDofChainIndex = value; },
      get selectedStrongLinkType() { return selectedStrongLinkType; },
      set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
      get selectedStrongLinkIndex() { return selectedStrongLinkIndex; },
      set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
      get selectedFishKey() { return selectedFishKey; },
      set selectedFishKey(value) { selectedFishKey = value; },
      get selectedNakedSubsetKey() { return selectedNakedSubsetKey; },
      set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
      get selectedHiddenSubsetKey() { return selectedHiddenSubsetKey; },
      set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
      get selectedChainIndex() { return selectedChainIndex; },
      set selectedChainIndex(value) { selectedChainIndex = value; },
      get selectedMslsIndex() { return selectedMslsIndex; },
      set selectedMslsIndex(value) { selectedMslsIndex = value; },
      get simpleColoringReport() { return simpleColoringReport; },
      set simpleColoringReport(value) { simpleColoringReport = value; },
      get selectedSimpleColoringIndex() { return selectedSimpleColoringIndex; },
      set selectedSimpleColoringIndex(value) { selectedSimpleColoringIndex = value; },
      get threeDMedusaReport() { return threeDMedusaReport; },
      set threeDMedusaReport(value) { threeDMedusaReport = value; },
      get selectedThreeDMedusaIndex() { return selectedThreeDMedusaIndex; },
      set selectedThreeDMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
      get threeDMedusaMultiReport() { return threeDMedusaMultiReport; },
      set threeDMedusaMultiReport(value) { threeDMedusaMultiReport = value; },
      get selectedThreeDMedusaMultiIndex() { return selectedThreeDMedusaMultiIndex; },
      set selectedThreeDMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
      get multiColoringReport() { return multiColoringReport; },
      set multiColoringReport(value) { multiColoringReport = value; },
      get selectedMultiColoringIndex() { return selectedMultiColoringIndex; },
      set selectedMultiColoringIndex(value) { selectedMultiColoringIndex = value; },
      },
      elements: {
        als: alsSearchResultsEl,
        ahs: ahsSearchResultsEl,
        alc: alcSearchResultsEl,
        uniqueness: uniquenessResultsEl,
        bug: bugResultsEl,
        reverseBug: reverseBugResultsEl,
        mug: mugResultsEl,
        pug: pugResultsEl,
        uniquenessExtended: uniquenessExtendedResultsEl,
      },
    });
    const clearSearchResultsAfterApply = searchResultReset.clearAfterApply;

    const interactiveProfile = appNamespace.interactiveProfile.create({
      generationTechniqueProfile,
      currentSolverMoveTypes,
      getContext: () => ({
        get alsDofMaxDigits() { return alsDofMaxDigitsEl.value; },
        get alsDofMaxAuxiliary() { return alsDofMaxAuxiliaryEl.value; },
        get chainDepth() { return chainDepthEl.value; },
        chainStrongTypes: chainStrongTypeEls,
        get chainAlsRccEnabled() { return chainAlsRccEl.checked; },
        get chainAhsEnabled() { return chainAhsEl.checked; },
      }),
    });
    const interactiveTechniqueProfile = () => interactiveProfile.build();

    const interactiveSearch = appNamespace.interactiveSearch.create({
      getContext: () => ({
        syncVariantSettingsFromControls,
        configureVariants: core.configureVariants,
        get variantSettings() { return variantSettings; },
        set lastInteractiveSearchError(value) { lastInteractiveSearchError = value; },
        set lastChainSelectionDiagnostics(value) { lastChainSelectionDiagnostics = value; },
        interactiveTechniqueProfile,
        chooseSolverStep,
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        get solution() { return solution; },
        solverPhasePlan,
        directSolverPhaseStep,
        get interactiveSearchProgress() { return interactiveSearchProgress; },
        set interactiveSearchProgress(value) { interactiveSearchProgress = value; },
        chooseSolverStepInWorker,
        isSearchCancelled,
        finishSearchDiagnostics,
        get searchWorker() { return searchWorker; },
        set searchWorker(value) { searchWorker = value; },
        releaseSearchWorkerBlobUrl: () => searchWorkerLifecycle.releaseBlobUrl(),
        get searchWorkerJobs() { return searchWorkerJobs; },
      }),
    });
    const chooseInteractiveStep = (...args) => interactiveSearch.chooseInteractiveStep(...args);

    const { nextCycle, applyBasics } = appNamespace.cycleControls.create({
      getContext: () => ({
        get busy() { return busy; },
        leaveHistoryPreview,
        boardIsComplete,
        get ratingReport() { return ratingReport; },
        set ratingReport(value) { ratingReport = value; },
        ratingFromLog,
        get logEntries() { return logEntries; },
        setStatus,
        render,
        setBusy,
        snapshotState,
        applyQueuedPromotions,
        applyCycleChoice,
        chooseInteractiveStep,
        isSearchCancelled,
        get lastInteractiveSearchError() { return lastInteractiveSearchError; },
        get activeHierarchyPhase() { return activeHierarchyPhase; },
        get searchEpoch() { return searchEpoch; },
        candidateGridIsSolved,
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        runSearchWorker,
        currentPomFishOptions,
        renderLog,
      }),
    });

    const historyCycle = appNamespace.historyCycle.create({
      state: {
        get undoStack() { return undoStack; },
        get redoStack() { return redoStack; },
      },
      leavePreview: leaveHistoryPreview,
      snapshot: snapshotState,
      restore: restoreState,
      setStatus,
      render,
    });
    function undoCycle() { return historyCycle.undo(); }
    function redoCycle() { return historyCycle.redo(); }

    const { runAll } = appNamespace.runAll.create({
      getContext: () => ({
        get busy() { return busy; },
        leaveHistoryPreview,
        boardIsComplete,
        get ratingReport() { return ratingReport; },
        set ratingReport(value) { ratingReport = value; },
        ratingFromLog,
        get logEntries() { return logEntries; },
        setStatus,
        render,
        setBusy,
        snapshotState,
        applyQueuedPromotions,
        applyCycleChoice,
        get searchEpoch() { return searchEpoch; },
        chooseInteractiveStep,
        get lastInteractiveSearchError() { return lastInteractiveSearchError; },
        get activeHierarchyPhase() { return activeHierarchyPhase; },
        renderLog,
        isSearchCancelled,
        get solution() { return solution; },
        candidateGridIsSolved,
        get cand() { return cand; },
        get puzzle() { return puzzle; },
      }),
    });

    const pomSearch = appNamespace.pomSearch.create({
      state: {
        get candidates() { return cand; },
        get puzzle() { return puzzle; },
        get report() { return pomReport; },
        set report(value) { pomReport = value; },
      },
      elements: { results: pomResultsEl },
      actions: {
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        renderReport: renderPomReport,
        openReportPanel,
        isSearchCancelled,
      },
    });
    function runPomCheck() { return pomSearch.run(); }

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

    const runAlsChainSearch = appNamespace.alsChainSearch.create({
      getContext: () => ({
        get chainDepth() { return chainDepthEl.value; },
        setBusy,
        setStatus,
        scheduleSearch,
        chainSearchOptions,
        get cand() { return cand; },
        get puzzle() { return puzzle; },
        runCoreSearch,
        chainMatchesSearchPhase,
        get alsSearchFamily() { return alsSearchFamily; },
        set alsSearchFamily(value) { alsSearchFamily = value; },
        get chainReport() { return chainReport; },
        set chainReport(value) { chainReport = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
        set strongLinkReport(value) { strongLinkReport = value; },
        set alsReport(value) { alsReport = value; },
        set alsLinkReport(value) { alsLinkReport = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        renderAlsReport,
        renderAlsLinkReport,
        renderBoard,
        renderChainReport,
        renderAlsSearchResults,
        openReportPanel: () => openReportPanel(alsSearchResultsEl),
        isSearchCancelled,
      }),
    }).run;

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

    const puzzleGenerator = appNamespace.puzzleGenerator.create({
      core,
      state: {
        get generationToken() { return generationToken; },
        set generationToken(value) { generationToken = value; },
        get puzzle() { return puzzle; },
        set puzzle(value) { puzzle = value; },
        get originalPuzzle() { return originalPuzzle; },
        set originalPuzzle(value) { originalPuzzle = value; },
        get solution() { return solution; },
        set solution(value) { solution = value; },
      },
      elements: {
        givens: givensEl,
        difficulty: generationDifficultyEl,
        input: inputEl,
      },
      actions: {
        cancelActiveSearches,
        leaveHistoryPreview,
        resetAnalysisAfterPlayerEdit,
        renderBoard,
        normalizeRatingCategory,
        setBusy,
        setStatus,
        runPuzzleGenerator,
        isSearchCancelled,
        rateGeneratedPuzzleInWorker,
        resetCandidates,
        unknownRating,
        hideSolution,
      },
    });
    function generatePuzzle() { return puzzleGenerator.run(); }

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

    const puzzleLoader = appNamespace.puzzleLoader.create({
      core,
      state: {
        get generationToken() { return generationToken; },
        set generationToken(value) { generationToken = value; },
        get puzzle() { return puzzle; },
        set puzzle(value) { puzzle = value; },
        get originalPuzzle() { return originalPuzzle; },
        set originalPuzzle(value) { originalPuzzle = value; },
        get solution() { return solution; },
        set solution(value) { solution = value; },
      },
      elements: { input: inputEl },
      actions: {
        syncVariantSettingsFromControls,
        getVariantSettings: () => variantSettings,
        cancelActiveSearches,
        leaveHistoryPreview,
        resetAnalysisAfterPlayerEdit,
        render,
        setBusy,
        setStatus,
        scheduleSearch,
        runCoreSearch,
        resetCandidates,
        showLoadWarning,
        hideSolution,
        isSearchCancelled,
      },
    });
    function loadPuzzle() { return puzzleLoader.load(); }

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
    const { runGraph: runChromaticGraphSearch, runAlsGraph: runChromaticAlsGraphSearch } =
      appNamespace.chromaticSearch.create({
        getContext: () => ({
          get options() {
            return {
              unitType: chromaticUnitTypeEl.value,
              minSectors: chromaticMinSectorsEl.value,
              maxSectors: chromaticMaxSectorsEl.value,
              minDigits: chromaticMinDigitsEl.value,
              maxDigits: chromaticMaxDigitsEl.value,
              maxCells: chromaticMaxCellsEl.value,
            };
          },
          get candidates() { return cand; },
          set activeStep(value) { activeStep = value; },
          get selectedGraphIndex() { return selectedChromaticGraphIndex; },
          set selectedGraphIndex(value) { selectedChromaticGraphIndex = value; },
          get graphReport() { return chromaticGraphReport; },
          set graphReport(value) { chromaticGraphReport = value; },
          get selectedAlsGraphIndex() { return selectedChromaticAlsGraphIndex; },
          set selectedAlsGraphIndex(value) { selectedChromaticAlsGraphIndex = value; },
          get alsGraphReport() { return chromaticAlsGraphReport; },
          set alsGraphReport(value) { chromaticAlsGraphReport = value; },
          setBusy,
          setStatus,
          scheduleSearch,
          runSearchWorker,
          stepFromResult: chromaticStepFromResult,
          render,
          openGraphPanel: () => openReportPanel(chromaticGraphResultsEl),
          openAlsGraphPanel: () => openReportPanel(chromaticAlsGraphResultsEl),
          isSearchCancelled,
        }),
      });
    appNamespace.chromaticEvents.install({
      graph: chromaticGraphBuildEl,
      alsGraph: chromaticAlsGraphBuildEl,
      runGraph: runChromaticGraphSearch,
      runAlsGraph: runChromaticAlsGraphSearch,
    });
    appNamespace.multiColoringEvents.install(multiColoringBuildEl, runMultiColoringBuild);
    appNamespace.chainEvents.install(chainBuildEl, runChainBuild);
    appNamespace.fishEvents.install(fishBuildEl, runFishBuild);
    appNamespace.alsXzEvents.install(alsXzBuildEl, () => runAlsChainSearch('als-xz'));
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
    appNamespace.alsXyEvents.install(alsXyBuildEl, () => runAlsChainSearch('als-xy'));
    appNamespace.alsChainEvents.install(alsChainBuildEl, () => runAlsChainSearch('als-chain'));
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
      encodePuzzle: () => {
        const text = core.encode(originalPuzzle);
        return copy81EmptyAsZeroEl.checked ? text.replace(/\./g, '0') : text;
      },
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
    multiColoringReportController = appNamespace.multiColoringReportController.create({
      view: colouringReportView,
      elements: { multi: multiColoringResultsEl, medusaMulti: threeDMedusaMultiResultsEl },
      eureka: { multi: multiColoringEureka, medusaMulti: threeDMedusaMultiEureka },
      state: {
        get multiReport() { return multiColoringReport; },
        get medusaMultiReport() { return threeDMedusaMultiReport; },
        get selectedMultiIndex() { return selectedMultiColoringIndex; },
        set selectedMultiIndex(value) { selectedMultiColoringIndex = value; },
        get selectedMedusaMultiIndex() { return selectedThreeDMedusaMultiIndex; },
        set selectedMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set multiBreadth(value) { colouringSequenceState.multi.breadth = value; },
        set medusaMultiBreadth(value) { colouringSequenceState.medusaMulti.breadth = value; },
        set selectedSimpleIndex(value) { selectedSimpleColoringIndex = value; },
        set selectedMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: {
        renderBoard,
        renderOtherColouringReports: () => {
          renderSimpleColoringReport();
          renderThreeDMedusaReport();
        },
        setStatus,
        focusMap,
      },
    });
    colouringReportController = appNamespace.colouringReportController.create({
      core,
      model: appNamespace.colouringModel,
      view: colouringReportView,
      elements: { simple: simpleColoringResultsEl, medusa: threeDMedusaResultsEl },
      state: {
        get simpleReport() { return simpleColoringReport; },
        get medusaReport() { return threeDMedusaReport; },
        get selectedSimpleIndex() { return selectedSimpleColoringIndex; },
        set selectedSimpleIndex(value) { selectedSimpleColoringIndex = value; },
        get selectedMedusaIndex() { return selectedThreeDMedusaIndex; },
        set selectedMedusaIndex(value) { selectedThreeDMedusaIndex = value; },
        set simpleBreadth(value) { colouringSequenceState.simple.breadth = value; },
        set medusaBreadth(value) { colouringSequenceState.medusa.breadth = value; },
        set selectedMultiIndex(value) { selectedMultiColoringIndex = value; },
        set selectedMedusaMultiIndex(value) { selectedThreeDMedusaMultiIndex = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    auxiliaryRecordController = appNamespace.auxiliaryRecordController.create({
      view: auxiliaryRecordView,
      linkView: auxiliaryLinkView,
      state: {
        get alsReport() { return alsReport; },
        get ahsReport() { return ahsReport; },
        get alsResults() { return alsResultsEl; },
        get ahsResults() { return ahsResultsEl; },
        get alsLinkReport() { return alsLinkReport; },
        get ahsLinkReport() { return ahsLinkReport; },
        get alsLinkResults() { return alsLinkResultsEl; },
        get ahsLinkResults() { return ahsLinkResultsEl; },
        get selectedAlsDof() { return selectedAlsDof; },
        set selectedAlsDof(value) { selectedAlsDof = value; },
        get selectedAhsDof() { return selectedAhsDof; },
        set selectedAhsDof(value) { selectedAhsDof = value; },
        get selectedAlsId() { return selectedAlsId; },
        set selectedAlsId(value) { selectedAlsId = value; },
        get selectedAhsId() { return selectedAhsId; },
        set selectedAhsId(value) { selectedAhsId = value; },
        get openAlsSizeGroups() { return openAlsSizeGroups; },
        get openAhsSizeGroups() { return openAhsSizeGroups; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    strongLinkReportController = appNamespace.strongLinkReportController.create({
      core,
      view: strongLinkView,
      container: strongLinkResultsEl,
      state: {
        get report() { return strongLinkReport; },
        get selectedType() { return selectedStrongLinkType; },
        set selectedType(value) { selectedStrongLinkType = value; },
        set selectedIndex(value) { selectedStrongLinkIndex = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    boxLineReportController = appNamespace.boxLineReportController.create({
      stepListView,
      container: boxLineResultsEl,
      state: {
        get report() { return boxLineReport; },
        get selectedIndex() { return selectedBoxLineIndex; },
        set selectedIndex(value) { selectedBoxLineIndex = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedFishKey(value) { selectedFishKey = value; },
        set selectedNakedSubsetKey(value) { selectedNakedSubsetKey = value; },
        set selectedHiddenSubsetKey(value) { selectedHiddenSubsetKey = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    fishReportController = appNamespace.fishReportController.create({
      core,
      fishView,
      container: fishResultsEl,
      state: {
        get report() { return fishReport; },
        set selectedCategory(value) { selectedFishCategory = value; },
        set selectedSize(value) { selectedFishSize = value; },
        set selectedKey(value) { selectedFishKey = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    subsetReportController = appNamespace.subsetReportController.create({
      core,
      subsetView,
      state: {
        get nakedReport() { return nakedSubsetReport; },
        get hiddenReport() { return hiddenSubsetReport; },
        get nakedResults() { return nakedSubsetResultsEl; },
        get hiddenResults() { return hiddenSubsetResultsEl; },
        get selectedNakedSize() { return selectedNakedSubsetSize; },
        set selectedNakedSize(value) { selectedNakedSubsetSize = value; },
        get selectedHiddenSize() { return selectedHiddenSubsetSize; },
        set selectedHiddenSize(value) { selectedHiddenSubsetSize = value; },
        get selectedNakedKey() { return selectedNakedSubsetKey; },
        set selectedNakedKey(value) { selectedNakedSubsetKey = value; },
        get selectedHiddenKey() { return selectedHiddenSubsetKey; },
        set selectedHiddenKey(value) { selectedHiddenSubsetKey = value; },
        set selectedAlsId(value) { selectedAlsId = value; },
        set selectedAhsId(value) { selectedAhsId = value; },
        set selectedChainIndex(value) { selectedChainIndex = value; },
        set selectedStrongLinkType(value) { selectedStrongLinkType = value; },
        set selectedStrongLinkIndex(value) { selectedStrongLinkIndex = value; },
        set selectedBoxLineIndex(value) { selectedBoxLineIndex = value; },
        set activeStep(value) { activeStep = value; },
        set lastRemoved(value) { lastRemoved = value; },
      },
      actions: { renderBoard, setStatus, focusMap },
    });
    playerEditing = appNamespace.playerEditing.create({
      core,
      state: {
        get busy() { return busy; },
        get puzzle() { return puzzle; },
        get promotedValues() { return promotedValues; },
        get candidates() { return cand; },
        get originalPuzzle() { return originalPuzzle; },
        get solution() { return solution; },
        set solution(value) { solution = value; },
        get promotionSecurityDisabled() { return promotionSecurityDisabled; },
        get selectedCell() { return selectedPlayerCell; },
        set selectedCell(value) { selectedPlayerCell = value; },
        get selectedDigit() { return selectedPlayerDigit; },
        set selectedDigit(value) { selectedPlayerDigit = value; },
        get solveBackups() { return playerSolveBackups; },
      },
      actions: {
        leaveHistoryPreview,
        snapshotState,
        setStatus,
        renderBoard,
        resetAnalysisAfterEdit: resetAnalysisAfterPlayerEdit,
        pushUndo: before => undoStack.push(before),
        clearRedo: () => { redoStack = []; },
        render,
        alert: message => window.alert(message),
        isPlayerEditableCell,
      },
      validators: {
        promotion: appNamespace.playerState.validatePlayerPromotion,
        clear: appNamespace.playerState.validatePlayerClear,
        candidate: appNamespace.playerState.validatePlayerCandidate,
        candidateRemoval: appNamespace.playerState.validatePlayerCandidateRemoval,
      },
      arraysEqual: playerArraysEqual,
    });
    playerInteraction = appNamespace.playerInteraction.create({
      boardEl,
      state: {
        get selectedCell() { return selectedPlayerCell; },
        set selectedCell(value) { selectedPlayerCell = value; },
        get selectedDigit() { return selectedPlayerDigit; },
        set selectedDigit(value) { selectedPlayerDigit = value; },
        get promotionMode() { return playerPromotionMode; },
        set promotionMode(value) { playerPromotionMode = value; },
        get puzzle() { return puzzle; },
        get promoted() { return promotedValues; },
        get candidates() { return cand; },
        get originalPuzzle() { return originalPuzzle; },
      },
      actions: {
        renderBoard,
        cellHasCandidate,
        solvePlayerCell,
        removePlayerDigit,
        addPlayerCandidate,
        isPlayerEditableCell,
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
  
