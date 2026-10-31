/* StormDoku ALS-DOF result grouping and list rendering. */
(function installAlsDofView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    core,
    getSelectedSource,
    getSelectedIndex,
    setSelectedIndex,
    onSelect,
  }) {
    function techniqueInfo(result) {
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

    function renderResultList(container, results, source = 'net') {
      const selectedSource = getSelectedSource();
      const selectedIndex = getSelectedIndex();
      const familyGroups = new Map();
      results.filter(result => result && typeof result === 'object').forEach((result, index) => {
        const info = techniqueInfo(result);
        const family = familyGroups.get(info.family) || new Map();
        const form = family.get(info.form) || new Map();
        const dof = form.get(info.dof) || [];
        dof.push({ result, index, info });
        form.set(info.dof, dof);
        family.set(info.form, form);
        familyGroups.set(info.family, family);
      });

      const categories = documentRef.createElement('div');
      categories.className = 'chain-categories';

      for (const [familyName, formGroups] of familyGroups) {
        const familyEntries = [...formGroups.values()].flatMap(dofGroups =>
          [...dofGroups.values()].flat(),
        );
        const familyPanel = documentRef.createElement('details');
        familyPanel.className = 'chain-category';
        familyPanel.open = selectedSource === source
          && familyEntries.some(({ index }) => index === selectedIndex);

        const familySummary = documentRef.createElement('summary');
        const familyLabel = documentRef.createElement('strong');
        familyLabel.className = 'chain-category-name';
        familyLabel.textContent = familyName;
        const familyCount = documentRef.createElement('span');
        familyCount.className = 'chain-category-count';
        familyCount.textContent = `${familyEntries.length} ${familyEntries.length === 1 ? 'result' : 'results'}`;
        familySummary.appendChild(familyLabel);
        familySummary.appendChild(familyCount);
        familyPanel.appendChild(familySummary);

        const forms = documentRef.createElement('div');
        forms.className = 'chain-subcategories';
        for (const [formName, dofGroups] of formGroups) {
          const formEntries = [...dofGroups.values()].flat();
          const formPanel = documentRef.createElement('details');
          formPanel.className = 'chain-subcategory';
          formPanel.open = selectedSource === source
            && formEntries.some(({ index }) => index === selectedIndex);

          const formSummary = documentRef.createElement('summary');
          const formLabel = documentRef.createElement('strong');
          formLabel.textContent = formName;
          const formCount = documentRef.createElement('span');
          formCount.className = 'chain-category-count';
          formCount.textContent = `${formEntries.length} ${formEntries.length === 1 ? 'result' : 'results'}`;
          formSummary.appendChild(formLabel);
          formSummary.appendChild(formCount);
          formPanel.appendChild(formSummary);

          const dofPanels = documentRef.createElement('div');
          dofPanels.className = 'chain-subcategories';
          for (const [dof, entries] of dofGroups) {
            const dofPanel = documentRef.createElement('details');
            dofPanel.className = 'chain-subcategory';
            dofPanel.open = selectedSource === source
              && entries.some(({ index }) => index === selectedIndex);

            const dofSummary = documentRef.createElement('summary');
            const dofLabel = documentRef.createElement('strong');
            dofLabel.textContent = `DOF ${dof}`;
            const dofCount = documentRef.createElement('span');
            dofCount.className = 'chain-category-count';
            dofCount.textContent = `${entries.length} ${entries.length === 1 ? 'result' : 'results'}`;
            dofSummary.appendChild(dofLabel);
            dofSummary.appendChild(dofCount);
            dofPanel.appendChild(dofSummary);

            const list = documentRef.createElement('ul');
            list.className = 'chain-list';
            for (const { result, index, info } of entries.slice(0, 200)) {
              const item = documentRef.createElement('li');
              const button = documentRef.createElement('button');
              button.type = 'button';
              button.className = 'chain-result';
              if (selectedSource === source && selectedIndex === index) button.classList.add('selected');
              button.textContent = `${index + 1}. ${info.label}: ${core.formatAlsDof(result)}`;
              button.title = 'Display this ALS-DOF result on the grid';
              button.addEventListener('click', () => onSelect(index, source));
              item.appendChild(button);
              list.appendChild(item);
            }
            if (entries.length > 200) {
              const more = documentRef.createElement('li');
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

    function renderSection(container, report, source, label) {
      container.textContent = '';
      if (!report) {
        container.textContent = `No ${label} search has been run.`;
        return;
      }
      const selectedSource = getSelectedSource();
      const selectedIndex = getSelectedIndex();
      if (selectedSource === source && selectedIndex !== null
        && selectedIndex >= report.results.length) {
        setSelectedIndex?.(null);
      }

      const summary = documentRef.createElement('p');
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
        const flaggedArea = documentRef.createElement('section');
        flaggedArea.className = 'chain-safety-warning';
        const flaggedHeading = documentRef.createElement('h3');
        flaggedHeading.textContent = `Flagged / Rejected ${label} (${rejected.length})`;
        flaggedArea.appendChild(flaggedHeading);
        const flaggedList = documentRef.createElement('ul');
        for (const entry of rejected) {
          const item = documentRef.createElement('li');
          const detail = documentRef.createElement('div');
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

      renderResultList(container, report.results, source);
      if (report.results.length > 500) {
        const more = documentRef.createElement('p');
        more.textContent = 'Showing the first 500 records in the technique lists.';
        container.appendChild(more);
      }
    }

    return { techniqueInfo, renderResultList, renderSection };
  }

  app.alsDofView = { create };
})(window);
