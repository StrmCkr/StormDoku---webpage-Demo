/* StormDoku shared DOF grouping controls. */
(function installDofGroupView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ documentRef = global.document }) {
    function groups(records, key) {
      const grouped = new Map();
      for (const record of records || []) {
        const dof = Number(record[key]);
        if (!Number.isInteger(dof)) continue;
        const bucket = grouped.get(dof) || [];
        bucket.push(record);
        grouped.set(dof, bucket);
      }
      return [...grouped.entries()].sort((left, right) => left[0] - right[0]);
    }

    function validSelected(groupsForDof, selected) {
      if (!groupsForDof.length || selected === null || selected === undefined) return null;
      return groupsForDof.some(([dof]) => dof === selected) ? selected : null;
    }

    function appendButtons(container, groupsForDof, selected, onSelect) {
      const row = documentRef.createElement('div');
      row.className = 'dof-buttons';
      for (const [dof, records] of groupsForDof) {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'dof-button';
        if (dof === selected) button.classList.add('current');
        button.textContent = `DOF ${dof} (${records.length})`;
        button.addEventListener('click', () => onSelect(dof));
        row.appendChild(button);
      }
      container.appendChild(row);
    }

    return { groups, validSelected, appendButtons };
  }

  app.dofGroupView = { create };
})(window);
