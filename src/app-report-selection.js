/* StormDoku report-selection helpers. */
(function installReportSelection(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  const findById = (report, id) => !report || id === null ? null : report.find(record => record.uniqueID === id) || null;
  const resultAt = (report, index) => !report || index === null ? null : report.results?.[index] || null;

  function als(report, id) { return findById(report, id); }
  function alsDof(netReport, chainReport, source, index) { return resultAt(source === 'chain' ? chainReport : netReport, index); }
  function hydra(alsReport, ahsReport, alcReport, family, index) {
    const report = family === 'AHS' ? ahsReport : family === 'ALC' ? alcReport : alsReport;
    return resultAt(report, index);
  }
  function ahs(report, id) { return findById(report, id); }
  function ahsDof(report, index) { return resultAt(report, index); }
  function chain(report, index, candidateGrid, buildStep) {
    if (!report || index === null) return null;
    const record = report.chains[index] || null;
    if (!record) return null;
    return buildStep(record, report, index, candidateGrid).chain;
  }

  app.reportSelection = { als, alsDof, hydra, ahs, ahsDof, chain };
})(window);
