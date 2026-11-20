/* StormDoku ALS and AHS report display and record selection. */
(function installAuxiliaryRecordController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ view, linkView, state, actions }) {
    function renderFamily(family) {
      const als = family === 'ALS';
      view.render({
        report: als ? state.alsReport : state.ahsReport,
        container: als ? state.alsResults : state.ahsResults,
        family,
        label: als ? 'LS / ALS' : 'HS / AHS',
        noReportText: als ? 'No LS / ALS build has been run.' : 'No HS / AHS build has been run.',
        dofKey: als ? 'alsDOF' : 'ahsDOF',
        sizeKey: als ? 'alsSize' : 'ahsSize',
        foxKey: als ? 'alsFOX' : 'ahsFOX',
        allCellsKey: als ? 'alsAllCells' : 'ahsAllCells',
        sectorKey: als ? 'alsSector' : 'ahsSector',
        digitsKey: als ? 'alsDigits' : 'ahsDigits',
        selectedDof: als ? state.selectedAlsDof : state.selectedAhsDof,
        selectedId: als ? state.selectedAlsId : state.selectedAhsId,
        openSizeGroups: als ? state.openAlsSizeGroups : state.openAhsSizeGroups,
        setSelectedDof: value => {
          if (als) state.selectedAlsDof = value;
          else state.selectedAhsDof = value;
        },
        onDofSelect: dof => {
          if (als) {
            state.selectedAlsDof = dof;
            state.selectedAlsId = null;
          } else {
            state.selectedAhsDof = dof;
            state.selectedAhsId = null;
          }
          actions.renderBoard();
          renderFamily(family);
        },
        onSelectRecord: record => (als ? selectAlsRecord(record) : selectAhsRecord(record)),
      });
    }

    function clearOtherSelections() {
      state.selectedChainIndex = null;
      state.selectedStrongLinkType = null;
      state.selectedStrongLinkIndex = null;
      state.selectedFishKey = null;
      state.selectedBoxLineIndex = null;
      state.selectedNakedSubsetKey = null;
      state.selectedHiddenSubsetKey = null;
      state.activeStep = null;
      state.lastRemoved = [];
    }

    function selectAlsRecord(als) {
      state.selectedAlsId = als.uniqueID;
      state.selectedAlsDof = als.alsDOF;
      state.selectedAhsId = null;
      clearOtherSelections();
      actions.renderBoard();
      renderFamily('ALS');
      actions.setStatus(`ALS ${als.uniqueID} selected.`, 'ok');
      actions.focusMap();
    }

    function selectAhsRecord(ahs) {
      state.selectedAhsId = ahs.uniqueID;
      state.selectedAhsDof = ahs.ahsDOF;
      state.selectedAlsId = null;
      clearOtherSelections();
      actions.renderBoard();
      renderFamily('AHS');
      actions.setStatus(`AHS ${ahs.uniqueID} selected.`, 'ok');
      actions.focusMap();
    }

    function renderAlsLinks() {
      linkView.renderAls(state.alsLinkReport, state.alsLinkResults);
    }

    function renderAhsLinks() {
      linkView.renderAhs(state.ahsLinkReport, state.ahsLinkResults);
    }

    return {
      renderAls: () => renderFamily('ALS'),
      renderAhs: () => renderFamily('AHS'),
      renderAlsLinks,
      renderAhsLinks,
    };
  }

  app.auxiliaryRecordController = { create };
})(window);
