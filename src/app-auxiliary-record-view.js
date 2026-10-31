/* StormDoku ALS/AHS record-panel rendering. */
(function installAuxiliaryRecordView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, dofGroupView, core }) {
    function rememberOpenSizeGroups(container, openGroups) {
      for (const panel of container.querySelectorAll('details.chain-category[data-size-group]')) {
        if (panel.open) openGroups.add(panel.dataset.sizeGroup);
        else openGroups.delete(panel.dataset.sizeGroup);
      }
    }

    function render({
      report,
      container,
      family,
      label,
      noReportText,
      dofKey,
      sizeKey,
      foxKey,
      allCellsKey,
      sectorKey,
      digitsKey,
      selectedDof,
      selectedId,
      openSizeGroups,
      setSelectedDof,
      onDofSelect,
      onSelectRecord,
    }) {
      rememberOpenSizeGroups(container, openSizeGroups);
      container.textContent = '';
      if (!report) {
        container.textContent = noReportText;
        return;
      }

      const summary = documentRef.createElement('p');
      summary.textContent = `${report.length} ${label} records.`;
      container.appendChild(summary);

      const groups = dofGroupView.groups(report, dofKey);
      const validDof = dofGroupView.validSelected(groups, selectedDof);
      setSelectedDof(validDof);
      dofGroupView.appendButtons(container, groups, validDof, onDofSelect);
      if (validDof === null) return;

      const selectedRecords = groups.find(([dof]) => dof === validDof)?.[1] || [];
      const sizeGroups = new Map();
      for (const record of selectedRecords) {
        const bucket = sizeGroups.get(record[sizeKey]) || [];
        bucket.push(record);
        sizeGroups.set(record[sizeKey], bucket);
      }

      for (const [zeroSize, records] of [...sizeGroups.entries()].sort((a, b) => a[0] - b[0])) {
        const sizePanel = documentRef.createElement('details');
        sizePanel.className = 'chain-category';
        sizePanel.dataset.sizeGroup = `${validDof}:${zeroSize}`;
        sizePanel.open = openSizeGroups.has(sizePanel.dataset.sizeGroup);
        const sizeSummary = documentRef.createElement('summary');
        sizeSummary.textContent = `Size ${zeroSize + 1} (${records.length})`;
        sizePanel.appendChild(sizeSummary);

        const list = documentRef.createElement('ul');
        const visible = records.slice(0, 200);
        for (const record of visible) {
          const item = documentRef.createElement('li');
          const button = documentRef.createElement('button');
          button.type = 'button';
          button.className = 'chain-result';
          if (selectedId === record.uniqueID) button.classList.add('selected');
          button.textContent = `${family}: DOF(${record[dofKey]}) size(${record[sizeKey] + 1}) FOX(${record[foxKey] + 1}) `
            + `cells:${core.cellGroupName(record[allCellsKey])} `
            + `in ${core.sectorGroupName([record[sectorKey]])} `
            + `digits {${record[digitsKey].join('')}}`;
          button.addEventListener('click', () => onSelectRecord(record));
          item.appendChild(button);
          list.appendChild(item);
        }
        if (records.length > visible.length) {
          const more = documentRef.createElement('li');
          more.textContent = `Showing ${visible.length} of ${records.length} Size ${zeroSize + 1} records.`;
          list.appendChild(more);
        }
        sizePanel.appendChild(list);
        container.appendChild(sizePanel);
      }
    }

    return { rememberOpenSizeGroups, render };
  }

  app.auxiliaryRecordView = { create };
})(window);
