/* Dedicated chain, ALS/AHS, ALC, and Hydra result-list controllers. */
(function installSearchResultsController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    chainReportView,
    chainSearchView,
    alsDofView,
    ahsDofView,
    hydraView,
    getChainReport,
    getAlsSearchFamily,
    getAhsSearchFamily,
    getAlcXzReport,
    getAlcXyReport,
    getAlcChainReport,
    getAlcDofReport,
    getAlsDofReport,
    getAlsDofChainReport,
    getAlsHydraReport,
    getAhsHydraReport,
    getAlcHydraReport,
    containers,
    selectChain,
    setSelectedChainIndex,
    clearActiveStep,
    clearLastRemoved,
    renderBoard,
    openReportPanel,
    focusMap,
  }) {
    function renderChainReport() {
      chainReportView.renderChainReport();
    }

    function renderAlsSearchResults() {
      const family = getAlsSearchFamily();
      const report = getChainReport();
      chainSearchView.renderReport({
        container: containers.als,
        report: family && report ? report : null,
        emptyText: 'No dedicated ALS search has been run.',
        label: family?.toUpperCase() || 'ALS result',
        listTag: 'div',
        summaryText: chains => `${chains.length} ${family.toUpperCase()} result${chains.length === 1 ? '' : 's'}.`,
        onSelect: index => {
          selectChain(index);
          openReportPanel(containers.chain);
        },
      });
    }

    function renderAhsSearchResults() {
      const family = getAhsSearchFamily();
      const report = getChainReport();
      const label = family === 'ahs-xy'
        ? 'AHS-XY'
        : family === 'ahs-chain' ? 'AHS-Chain' : 'AHS-XZ';
      chainSearchView.renderReport({
        container: containers.ahs,
        report: family && report ? report : null,
        emptyText: 'No AHS search has been run.',
        label,
        listTag: 'ul',
        summaryText: chains => {
          let text = `${chains.length} ${label} result${chains.length === 1 ? '' : 's'} found.`;
          if (family === 'ahs-xy' && report.stats?.truncated) {
            text += ` Checked ${report.stats.triplesChecked.toLocaleString()} three-set paths; search limit reached.`;
          }
          return text;
        },
        onSelect: index => {
          selectChain(index);
          openReportPanel(containers.chain);
        },
      });
    }

    function renderAlcReport(report, emptyText, label, titleForChain, renderAgain) {
      chainSearchView.renderReport({
        container: containers.alc,
        report,
        emptyText,
        label,
        summaryText: (chains, currentReport) => `${chains.length} ${label}${chains.length === 1 ? '' : 's'} found.`
          + (currentReport.stats?.truncated ? ' Search limit reached.' : ''),
        titleForChain,
        onSelect: index => {
          setSelectedChainIndex(index);
          clearActiveStep();
          clearLastRemoved();
          renderChainReport();
          renderAgain();
          renderBoard();
          openReportPanel(containers.alc);
          focusMap();
        },
      });
    }

    function renderAlcXzResults() {
      renderAlcReport(
        getAlcXzReport(),
        'No ALC-XZ search has been run.',
        'ALC-XZ result',
        chain => {
          const contacts = chain.alcXz?.contacts || [];
          return chain.alcXz
            ? `ALS + AHS; ${contacts.length} weak digit contact${contacts.length === 1 ? '' : 's'}`
            : 'ALC-XZ chain-engine result';
        },
        renderAlcXzResults,
      );
    }

    function renderAlcXyResults() {
      renderAlcReport(
        getAlcXyReport(),
        'No ALC-XY search has been run.',
        'ALC-XY result',
        () => 'Mixed ALC-XY: at least one ALS, one AHS, and one additional node',
        renderAlcXyResults,
      );
    }

    function renderAlcChainResults() {
      renderAlcReport(
        getAlcChainReport(),
        'No ALC-Chain search has been run.',
        'ALC-Chain result',
        () => 'Mixed ALC-Chain: at least one ALS, one AHS, and one additional node',
        renderAlcChainResults,
      );
    }

    function renderAlcDofResults() {
      renderAlcReport(
        getAlcDofReport(),
        'No ALC-DOF Chain search has been run.',
        'ALC-DOF Chain result',
        chain => `ALC-DOF Chain rooted in ${chain.alcDof?.rootType || 'DOF'} and extended with ALS/AHS modules`,
        renderAlcDofResults,
      );
    }

    function renderAlsDofReport() {
      alsDofView.renderSection(containers.alsDof, getAlsDofReport(), 'net', 'ALS-DOF nets');
      alsDofView.renderSection(containers.alsDofChain, getAlsDofChainReport(), 'chain', 'ALS-DOF chains');
    }

    function renderAhsDofResults(report) {
      ahsDofView.renderNet(report, containers.ahsDof);
    }

    function renderAhsDofChainResults(report) {
      ahsDofView.renderChain(report, containers.ahsDofChain);
    }

    function renderAlsHydraReport() {
      hydraView.renderReport(getAlsHydraReport(), containers.alsHydra, 'ALS');
    }

    function renderAhsHydraReport() {
      hydraView.renderReport(getAhsHydraReport(), containers.ahsHydra, 'AHS');
    }

    function renderAlcHydraReport() {
      hydraView.renderReport(getAlcHydraReport(), containers.alcHydra, 'ALC');
    }

    return {
      renderChainReport,
      renderAlsSearchResults,
      renderAhsSearchResults,
      renderAlcXzResults,
      renderAlcXyResults,
      renderAlcChainResults,
      renderAlcDofResults,
      renderAlsDofReport,
      renderAhsDofResults,
      renderAhsDofChainResults,
      renderAlsHydraReport,
      renderAhsHydraReport,
      renderAlcHydraReport,
    };
  }

  app.searchResultsController = { create };
})(window);
