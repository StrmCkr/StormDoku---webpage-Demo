/* StormDoku strong-link report rendering. */
(function installStrongLinkView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document, core, getGroups, getSelectedType, getSelectedIndex, onTypeSelect, onLinkSelect }) {
    function render(report, container) {
      container.textContent = '';
      if (!report) return;

      const groups = getGroups();
      const links = [...new Set(groups.flat())];
      const counts = groups.map(group => group.length);
      const typeNames = [
        'Bi-Local',
        'Cell <=> Group',
        'Group <=> Group',
        'ERI',
        'BIVALVE (Size-1 ALS)',
      ];
      const summary = documentRef.createElement('p');
      summary.textContent = `${links.length} unique strong links.`;
      container.appendChild(summary);

      const buttonRow = documentRef.createElement('div');
      buttonRow.className = 'dof-buttons';
      typeNames.forEach((name, index) => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'dof-button';
        if (getSelectedType() === index) button.classList.add('current');
        button.textContent = `${name} (${counts[index]})`;
        button.addEventListener('click', () => onTypeSelect(index));
        buttonRow.appendChild(button);
      });
      container.appendChild(buttonRow);
      if (getSelectedType() === null) return;

      const selectedGroup = groups[getSelectedType()] || [];
      const list = documentRef.createElement('ul');
      list.className = 'log';
      const visible = selectedGroup.slice(0, 200);
      for (let index = 0; index < visible.length; index++) {
        const link = visible[index];
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (getSelectedIndex() === index) button.classList.add('selected');
        const typeNamesByKey = {
          BILOCAL: 0,
          CELL_TO_GROUP: 1,
          GROUP_TO_GROUP: 2,
          ERI: 3,
          ALS: 4,
        };
        const secondaryTypes = [...new Set(link.secondaryTypes || [])];
        const secondary = secondaryTypes.length ? ` [${secondaryTypes.join(' / ')}]` : '';
        const originalTypeName = typeNames[link.linkType] || link.linkTypeName;
        button.textContent = `${originalTypeName}${secondary}: (${link.startingDigits.join('')}) `
          + `${core.cellGroupName(link.activeCells)} = (${link.linkDigits.join('')}) `
          + `${core.cellGroupName(link.linkedCells)} `
          + `in ${core.sectorGroupName(link.originSector)}`;
        button.addEventListener('click', () => onLinkSelect(index));
        item.appendChild(button);
        list.appendChild(item);
      }
      if (visible.length < selectedGroup.length) {
        const more = documentRef.createElement('li');
        more.textContent = `Showing ${visible.length} of ${selectedGroup.length} records.`;
        list.appendChild(more);
      }
      container.appendChild(list);
    }

    return { render };
  }

  app.strongLinkView = { create };
})(window);
