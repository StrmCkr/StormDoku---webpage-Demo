/* StormDoku chain report rendering helpers. */
(function installChainReportView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    chainText,
    selectChain,
    getSelectedChainIndex,
    core,
    getChainReport,
    getChainSafetyFlags,
    getChainFolderInfos,
    folderChainText,
    chainResultsEl,
    setSelectedChainIndex,
    showDebug = () => false,
    chainOutputEl,
    illegalChainResultsEl,
    illegalChainAreaEl,
    illegalChainHeadingEl,
    copyText,
    setStatus,
  }) {
    function flaggedChainEntries(verbose = false) {
      const report = getChainReport?.();
      if (!report) return [];
      return report.chains
        .map((chain, index) => ({
          chain,
          index,
          reasons: getChainSafetyFlags?.(chain) || [],
        }))
        .filter(entry => entry.reasons.length > 0)
        .map(entry => ({
          ...entry,
          text: chainText(entry.chain, verbose),
        }));
    }

    function chainOutput(verbose = false) {
      const report = getChainReport?.();
      if (!report) return '';
      const allChains = report.chains
        .map((chain, index) => `${index + 1}. ${chainText(chain, verbose)}`)
        .join('\n');
      const flagged = flaggedChainEntries(verbose);
      if (!flagged.length) return allChains;

      const flaggedText = [
        `FLAGGED CHAINS (${flagged.length})`,
        ...flagged.flatMap(entry => [
          `${entry.index + 1}. ${entry.text}`,
          ...entry.reasons.map(reason => `   ! ${reason}`),
        ]),
        '',
        'ALL CHAINS',
      ].join('\n');
      return `${flaggedText}\n${allChains}`;
    }

    function renderChainOutput() {
      if (chainOutputEl) chainOutputEl.value = chainOutput(false);
    }

    function renderIllegalChainReport() {
      if (!illegalChainResultsEl || !illegalChainAreaEl) return;
      illegalChainResultsEl.textContent = '';
      illegalChainAreaEl.hidden = !showDebug();
      if (!showDebug()) return;

      const flagged = flaggedChainEntries();
      illegalChainAreaEl.hidden = flagged.length === 0;
      if (!flagged.length) return;

      if (illegalChainHeadingEl) {
        illegalChainHeadingEl.textContent = `Flagged / Illegal Chains (${flagged.length})`;
      }
      for (const entry of flagged) {
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result chain-result-flagged';
        button.textContent = `${entry.index + 1}. ${entry.text} [${entry.reasons.join('; ')}]`;
        button.title = entry.reasons.join('; ');
        button.addEventListener('click', () => selectChain(entry.index));
        item.appendChild(button);
        illegalChainResultsEl.appendChild(item);
      }
    }

    function renderChainReport() {
      if (!chainResultsEl) return;
      chainResultsEl.textContent = '';
      renderChainOutput();
      renderIllegalChainReport();

      const report = getChainReport?.();
      if (!report) {
        setSelectedChainIndex?.(null);
        chainResultsEl.textContent = 'No chain search has been run.';
        return;
      }

      const { chains } = report;
      const selectedIndex = getSelectedChainIndex();
      if (selectedIndex !== null && selectedIndex >= chains.length) {
        setSelectedChainIndex?.(null);
      }

      const summary = documentRef.createElement('p');
      summary.textContent = `${chains.length} chains with eliminations.`;
      chainResultsEl.appendChild(summary);

      // Keep the panel bounded, but do not let a large mixed ALS search hide
      // an entire technique family behind the global first-200 slice.
      const visibleIndexes = new Set(
        Array.from({ length: Math.min(200, chains.length) }, (_, index) => index),
      );
      const firstFamilyIndexes = new Map();
      for (let index = 0; index < chains.length; index++) {
        for (const folder of getChainFolderInfos(chains[index])) {
          if (!firstFamilyIndexes.has(folder.family)) firstFamilyIndexes.set(folder.family, index);
        }
      }
      for (const index of firstFamilyIndexes.values()) visibleIndexes.add(index);
      const visible = [...visibleIndexes]
        .sort((left, right) => left - right)
        .map(index => ({ chain: chains[index], index }));
      const groups = new Map();
      const folderMemberships = new Map();
      for (const { chain, index } of visible) {
        for (const folder of getChainFolderInfos(chain)) {
          const path = chainFolderPath(folder);
          const folderKey = [folder.family, ...path]
            .map(value => value ?? '')
            .join('|');
          const folderLabel = [folder.family, ...path]
            .filter(Boolean)
            .join(' / ');
          const memberships = folderMemberships.get(index) || [];
          if (!memberships.some(location => location.key === folderKey)) {
            memberships.push({ key: folderKey, label: folderLabel });
            folderMemberships.set(index, memberships);
          }
          const group = groups.get(folder.family) || [];
          group.push({
            chain,
            index,
            folderKey,
            path,
            displayName: folderChainText(chain, folder),
          });
          groups.set(folder.family, group);
        }
      }

      const selectedFolderKeys = new Set(
        (folderMemberships.get(getSelectedChainIndex()) || []).map(location => location.key),
      );
      const selectedLocations = folderMemberships.get(getSelectedChainIndex()) || [];
      if (showDebug() && selectedLocations.length) {
        const locations = documentRef.createElement('p');
        locations.className = 'chain-memberships';
        locations.textContent = `Selected chain folders: ${selectedLocations.map(location => location.label).join(' | ')}`;
        chainResultsEl.appendChild(locations);
      }

      const categories = documentRef.createElement('div');
      categories.className = 'chain-categories';
      for (const [name, entries] of groups) {
        const category = documentRef.createElement('details');
        category.className = 'chain-category';
        category.open = entries.some(({ folderKey }) => selectedFolderKeys.has(folderKey));

        const categorySummary = documentRef.createElement('summary');
        const categoryName = documentRef.createElement('strong');
        categoryName.className = 'chain-category-name';
        categoryName.textContent = name;
        const categoryCount = documentRef.createElement('span');
        categoryCount.className = 'chain-category-count';
        categoryCount.textContent = `${entries.length} ${entries.length === 1 ? 'chain' : 'chains'}`;
        categorySummary.appendChild(categoryName);
        categorySummary.appendChild(categoryCount);
        category.appendChild(categorySummary);

        const folderTree = documentRef.createElement('div');
        folderTree.className = 'chain-subcategories';
        appendChainFolderTree(folderTree, entries, 0, selectedFolderKeys);
        category.appendChild(folderTree);
        categories.appendChild(category);
      }

      chainResultsEl.appendChild(categories);
      if (chains.length > visible.length) {
        const moreText = documentRef.createElement('p');
        moreText.textContent = `Showing ${visible.length} of ${chains.length} records.`;
        chainResultsEl.appendChild(moreText);
      }
    }

    async function copyChainOutput(verbose = false) {
      const text = chainOutput(verbose);
      if (!text) {
        setStatus?.('No chain output to copy.', 'warn');
        return;
      }

      if (chainOutputEl) {
        chainOutputEl.value = text;
        chainOutputEl.focus();
        chainOutputEl.select();
      }

      const copied = await copyText?.(text);
      setStatus?.(copied ? 'Chain output copied.' : 'Chain output selected.', 'ok');
    }

    function appendChainList(container, entries) {
      const list = documentRef.createElement('ul');
      list.className = 'chain-list';
      for (const entry of entries) {
        const { chain, index } = entry;
        const item = documentRef.createElement('li');
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'chain-result';
        if (index === getSelectedChainIndex()) button.classList.add('selected');
        button.textContent = `${index + 1}. ${entry.displayName || chainText(chain)}`;
        if (core?.formatChainVerbose) button.title = chainText(chain, true);
        button.addEventListener('click', () => selectChain(index));
        item.appendChild(button);
        list.appendChild(item);
      }
      container.appendChild(list);
    }

    function appendChainSubclasses(container, entries) {
      const subclassGroups = new Map();
      for (const entry of entries) {
        const subclass = entry.subclass || '';
        const subclassEntries = subclassGroups.get(subclass) || [];
        subclassEntries.push(entry);
        subclassGroups.set(subclass, subclassEntries);
      }

      if (subclassGroups.size === 1 && subclassGroups.has('')) {
        appendChainList(container, entries);
        return;
      }

      const subclasses = documentRef.createElement('div');
      subclasses.className = 'chain-subcategories';
      for (const [subclass, subclassEntries] of subclassGroups) {
        const subcategory = documentRef.createElement('details');
        subcategory.className = 'chain-subcategory';
        subcategory.open = subclassEntries.some(({ index }) => index === getSelectedChainIndex());
        const subSummary = documentRef.createElement('summary');
        const subName = documentRef.createElement('strong');
        subName.textContent = subclass || 'General';
        const subCount = documentRef.createElement('span');
        subCount.className = 'chain-category-count';
        subCount.textContent = `${subclassEntries.length} ${subclassEntries.length === 1 ? 'chain' : 'chains'}`;
        subSummary.appendChild(subName);
        subSummary.appendChild(subCount);
        subcategory.appendChild(subSummary);
        appendChainList(subcategory, subclassEntries);
        subclasses.appendChild(subcategory);
      }
      container.appendChild(subclasses);
    }

    function chainFolderPath(folder) {
      if (Array.isArray(folder.path)) return folder.path.filter(Boolean);
      if (/^Transport$/i.test(String(folder.family || ''))) {
        return [folder.wing, folder.rank === 'Ring' ? 'Ring' : null].filter(Boolean);
      }
      if (/^(?:Hybrid|M) - Wing \| Ring$/i.test(String(folder.family || ''))
        && /^[MH]\(\d+\)$/i.test(String(folder.rank || ''))) {
        return [folder.rank, folder.wing === 'Ring' ? 'Ring' : null].filter(Boolean);
      }
      return [folder.wing, folder.rank, folder.subclass].filter(Boolean);
    }

    function appendChainFolderTree(container, entries, depth, selectedFolderKeys) {
      const pathGroups = new Map();
      for (const entry of entries) {
        const label = entry.path[depth] || '';
        const branch = pathGroups.get(label) || [];
        branch.push(entry);
        pathGroups.set(label, branch);
      }

      for (const [label, branchEntries] of pathGroups) {
        if (!label) {
          appendChainList(container, branchEntries);
          continue;
        }

        const panel = documentRef.createElement('details');
        panel.className = 'chain-subcategory';
        panel.open = branchEntries.some(({ folderKey }) => selectedFolderKeys.has(folderKey));
        const summary = documentRef.createElement('summary');
        const name = documentRef.createElement('strong');
        name.textContent = label;
        const count = documentRef.createElement('span');
        count.className = 'chain-category-count';
        count.textContent = `${branchEntries.length} ${branchEntries.length === 1 ? 'chain' : 'chains'}`;
        summary.appendChild(name);
        summary.appendChild(count);
        panel.appendChild(summary);

        const terminal = branchEntries.filter(entry => entry.path.length <= depth + 1);
        if (terminal.length) appendChainList(panel, terminal);

        const deeper = branchEntries.filter(entry => entry.path.length > depth + 1);
        if (deeper.length) {
          const children = documentRef.createElement('div');
          children.className = 'chain-subcategories';
          appendChainFolderTree(children, deeper, depth + 1, selectedFolderKeys);
          panel.appendChild(children);
        }
        container.appendChild(panel);
      }
    }

    return {
      appendChainList,
      appendChainSubclasses,
      chainFolderPath,
      appendChainFolderTree,
      flaggedChainEntries,
      chainOutput,
      renderChainOutput,
      renderIllegalChainReport,
      renderChainReport,
      copyChainOutput,
    };
  }

  app.chainReportView = { create };
})(window);
