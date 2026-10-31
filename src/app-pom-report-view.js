/* StormDoku POM report presentation. */
(function installPomReportView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ container, renderList, formatPomOmission, cellGroupName }) {
    function render(report) {
      container.textContent = '';
      if (!report) {
        container.textContent = 'No POM check has been run.';
        return;
      }
      const initialTotal = report.initialTemplateCounts.reduce((total, count) => total + count, 0);
      const finalTotal = report.templateCounts.reduce((total, count) => total + count, 0);
      const totalReports = report.omissions.length + report.hiddenSubsets.length
        + report.nakedSubsets.length + report.tkDeletes.length;
      const deletedTemplates = Math.max(0, initialTotal - finalTotal);
      const digitCountText = counts => counts.map((count, index) => count ? `${index + 1}:${count}` : '')
        .filter(Boolean).join(' ') || 'none';
      const phaseText = summary => summary.phase === 'omissions'
        ? 'Omissions (digits 1-9)'
        : summary.phase === 'hidden-subset'
          ? `Hidden subset size ${summary.size}`
          : summary.phase === 'naked-subset'
            ? `Naked subset size ${summary.size}`
            : `T${summary.size}-delete`;

      renderList('Templates by digit (pre-POM)', report.initialTemplateCounts.map((count, index) => `Digit ${index + 1}: ${count}`));
      renderList('Templates by digit (final)', report.templateCounts.map((count, index) => `Digit ${index + 1}: ${count}`));
      renderList('Progression', report.passSummaries.filter(summary => summary.reports > 0).map(summary =>
        `Cycle ${summary.pass}: ${phaseText(summary)} => ${summary.reports} reports, ${summary.templatesBefore} -> ${summary.templatesAfter} templates (${summary.templateDeletes} deleted); per digit ${digitCountText(summary.digitCounts)}`));
      renderList('Totals', [
        totalReports ? `Reports: ${totalReports}` : '',
        report.omissions.length ? `Omissions: ${report.omissions.length}` : '',
        report.hiddenSubsets.length ? `Hidden subset reports: ${report.hiddenSubsets.length}` : '',
        report.nakedSubsets.length ? `Naked subset reports: ${report.nakedSubsets.length}` : '',
        report.tkDeletes.length ? `TK-delete reports: ${report.tkDeletes.length}` : '',
        `Templates: ${initialTotal} -> ${finalTotal}${deletedTemplates ? ` (${deletedTemplates} deleted)` : ''}`,
      ].filter(Boolean));
      renderList('Omissions', report.omissions.map(formatPomOmission));
      renderList('Hidden subset template eliminations', report.hiddenSubsets.map(item =>
        `Hidden ${item.size}: (${item.digits.join('')}) ${item.sector} ${cellGroupName(item.cells)} => digit ${item.digit}, templates ${item.templateIds.join(',')}`));
      renderList('Naked subset template eliminations', report.nakedSubsets.map(item =>
        `Naked ${item.size}: (${item.digits.join('')}) ${item.sector} ${cellGroupName(item.cells)} => digit ${item.digit}, templates ${item.templateIds.join(',')}`));
      renderList('TK-delete', report.tkDeletes.map(item =>
        `T${item.size + 1}: base digit ${item.digit}, template ${item.templateIds.join(',')}; companions ${item.companionDigits.length ? `{${item.companionDigits.join(',')}}` : 'none'}; chosen digits {${[item.digit, ...item.companionDigits].join(',')}}`));
    }
    return { render };
  }

  app.pomReportView = { create };
})(window);
