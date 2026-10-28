/* Static presentation data for the Toys automorphism catalog. */
(function installToyCatalog(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function renderAutomorphCatalog(documentRef, records) {
    for (const family of Object.keys(app.toyCatalog.familyLabels)) {
      const panel = documentRef.getElementById(`toyAutomorphFamilyCatalog-${family}`);
      if (!panel) continue;
      panel.textContent = '';
      const body = documentRef.createElement('div'); body.className = 'toy-automorph-catalog-body';
      const description = documentRef.createElement('p'); description.className = 'toy-automorph-catalog-description';
      description.textContent = app.toyCatalog.familyDescriptions[family]; body.appendChild(description);
      const list = documentRef.createElement('ol');
      for (const record of records[family]) {
        if (record.testedSequence !== record.sequence) continue;
        const item = documentRef.createElement('li'); const name = documentRef.createElement('strong');
        name.textContent = record.name; item.appendChild(name); item.appendChild(documentRef.createTextNode(' — '));
        const code = documentRef.createElement('code'); code.textContent = record.sequence;
        item.appendChild(code); list.appendChild(item);
      }
      body.appendChild(list); panel.appendChild(body);
    }
    for (const toggle of documentRef.querySelectorAll('[data-toy-automorph-family-toggle]')) {
      if (toggle.dataset.bound === 'true') continue;
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', event => {
        event.stopPropagation(); const panel = documentRef.getElementById(toggle.getAttribute('aria-controls'));
        if (!panel) return; const open = panel.hidden; panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? '−' : '+';
      });
    }
  }
  let recordsCache = null;
  function getRecords() {
    if (recordsCache) return recordsCache;
    const math = app.toyMath;
    const identity = math.cellPermutation((row, col) => [row, col]);
    const operationMaps = math.automorphOperationMaps();
    recordsCache = math.expandAutomorphismCatalog(app.toyCatalog.records, operationMaps, identity, {
      sequenceVariants: math.sequenceVariants, compose: math.composePermutations, power: math.permutationPower,
      order: math.permutationOrder, labels: math.operationLabels, transposeLabel: math.transposeOperationLabel,
      transpose: math.transposePermutation, key: math.permutationKey,
    });
    return recordsCache;
  }
  function completeSearch(values, preservesVariants) {
    const math = app.toyMath; const { rowMaps, columnMaps } = math.cachedMiniLexLayoutMaps();
    return math.completeAutomorphismSearch(values, rowMaps, columnMaps, preservesVariants,
      math.structuralPermutation, math.structuralDigitMap);
  }
  app.toyCatalog = {
    getRecords,
    completeSearch,
    records: {
      fixedBoxes: [
        { name: 'Mini-Rows (MR)', sequence: 'C', M: 8, N: 107495424, L: 3, F: 0, methods: 'N', alias: 'Mini-Columns (MC)' },
        { name: '2 MR, 1 MD', sequence: 'CR1', M: 7, N: 21233664, L: 3, F: 0, methods: 'Y' },
        { name: '1 MR, 2 MD', sequence: 'CR1R2', M: 9, N: 4204224, L: 3, F: 0, methods: 'Y' },
        { name: 'Mini-Diagonals (MD)', sequence: 'CR', M: 10, N: 2508084, L: 3, F: 0, methods: 'Y' },
      ],
      bands: [
        { name: 'Jumping-Rows (JR)', sequence: 'S', M: 25, N: 14837760, L: 3, F: 0, methods: 'N' },
        { name: '2 JR, 1 GR', sequence: 'SR1', M: 28, N: 2085120, L: 3, F: 0, methods: 'Y' },
        { name: '1 JR, 2 GR', sequence: 'SR1R2', M: 30, N: 294912, L: 3, F: 0, methods: 'Y' },
        { name: 'Gliding-Rows (GR)', sequence: 'SR', M: 32, N: 6342480, L: 3, F: 0, methods: 'Y' },
        { name: 'Full-Rows (FR)', sequence: 'SC1', M: 27, N: 5184, L: 9, F: 0, methods: 'U' },
        { name: '2 FR, 1 WR', sequence: 'SR1C1', M: 26, N: 2592, L: 9, F: 0, methods: 'U' },
        { name: '1 FR, 2 WR', sequence: 'SR1R2C1', M: 29, N: 1296, L: 9, F: 0, methods: 'U' },
        { name: 'Waving-Rows (WR)', sequence: 'SRC1', M: 31, N: 648, L: 9, F: 0, methods: 'U' },
      ],
      triangular: [
        { name: 'Jumping-Diagonals (JD)', sequence: 'BS', M: 22, N: 323928, L: 3, F: 0, methods: 'Y', alias: 'Block symmetry' },
        { name: 'Broken-Columns (BC)', sequence: 'BSR1', M: 24, N: 288, L: 9, F: 0, methods: 'U' },
        { name: 'Full-Diagonals (FD)', sequence: 'BSR1C1', M: 23, N: 162, L: 9, F: 0, methods: 'U' },
      ],
      rotational: [
        { name: 'Half-Turn (HT)', sequence: 'DD2', M: 79, N: 155492352, L: 2, F: 1, methods: 'Y', alias: '180-degree rotational symmetry' },
        { name: 'Quarter-Turn (QT)', sequence: 'DBxRx', M: 86, N: 13056, L: 4, F: 1, methods: 'Y', alias: '90-degree rotational symmetry; includes HT' },
      ],
      diagonal: [
        { name: 'Diagonal-Mirror (DM)', sequence: 'D', M: 37, N: 30258432, L: 2, F: 9, methods: 'Y', alias: 'Diagonal symmetry' },
        { name: 'DM + JD', sequence: 'DBS', M: 43, N: 288, L: 6, F: 0, methods: 'Y' },
        { name: 'DM + MD', sequence: 'DRC', M: 40, N: 1854, L: 6, F: 0, methods: 'Y' },
      ],
      sticks: [
        { name: 'Column-Sticks (CS)', sequence: 'BxCx', M: 134, N: 449445888, L: 2, F: 9, methods: 'Y', alias: 'Sticks symmetry' },
        { name: 'CS + MC', sequence: 'BxCxR', M: 135, N: 27648, L: 6, F: 0, methods: 'U' },
        { name: 'CS + JR', sequence: 'BxCxS', M: 145, N: 13824, L: 6, F: 0, methods: 'U' },
        { name: 'CS + GR/Band2, JR/Band3', sequence: 'BxCxSR2', M: 144, N: 3456, L: 6, F: 0, methods: 'U' },
        { name: 'CS + GR', sequence: 'BxCxSR', M: 142, N: 6480, L: 6, F: 0, methods: 'U' },
        { name: 'CS + JR/Band2, GR/Band3', sequence: 'BxCxSR1R3', M: 143, N: 1728, L: 6, F: 0, methods: 'U' },
      ],
    },
    familyLabels: {
      fixedBoxes: 'Fixed Boxes', bands: 'Boxes Move in Bands', triangular: 'Boxes Move Triangular',
      rotational: 'Rotational', diagonal: 'Diagonal', sticks: 'Sticks',
    },
    familyDescriptions: {
      fixedBoxes: 'Mini-row, mini-column, and mini-diagonal patterns while the box bands remain fixed.',
      bands: 'Stack, row, glide, full-row, and waving-row movements across the bands.',
      triangular: 'Triangular band/stack movements that produce diagonal and broken-column forms.',
      rotational: 'Composite transformations that produce half-turn and quarter-turn symmetry.',
      diagonal: 'Main-diagonal reflection and its diagonal composite forms.',
      sticks: 'Reversal and stack/column composites that produce stick symmetry.',
    },
    searchFamilyLabels: {
      fixedBoxes: 'Fixed Boxes', bands: 'Boxes move in bands', triangular: 'Boxes move triangular',
      rotational: 'Rotational symmetries', diagonal: 'Diagonal symmetries', sticks: 'Sticks symmetries',
    },
    renderAutomorphCatalog,
  };
})(window);
