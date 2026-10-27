// Search progress and hierarchy diagnostics. This module is loaded before
// app.js and communicates through the shared StormDokuApp namespace.
(function initSearchDiagnostics(app) {
  let active = null;
  let timer = null;

  function number(value) {
    return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : null;
  }

  function limits(payload = {}) {
    const source = { ...(payload || {}), ...((payload || {}).limits || {}) };
    const entries = Object.entries(source)
      .filter(([key, value]) => /^max[A-Z]/.test(key)
        && (typeof value === 'number' || typeof value === 'string'))
      .slice(0, 5)
      .map(([key, value]) => `${key.replace(/^max/, 'max ')}=${value}`);
    return entries.length ? entries.join(', ') : 'default limits';
  }

  function resultCount(result) {
    if (!result || typeof result !== 'object') return null;
    const stats = result.stats || result.placementStats || {};
    for (const key of ['chainsFound', 'results', 'records', 'reports', 'count', 'states']) {
      const value = stats[key] ?? result[key];
      if (Array.isArray(value)) return value.length.toLocaleString();
      if (Number.isFinite(Number(value))) return Number(value).toLocaleString();
    }
    for (const key of ['chains', 'links', 'results', 'reports']) {
      if (Array.isArray(result[key])) return result[key].length.toLocaleString();
    }
    return null;
  }

  function phaseLabel(value) {
    const text = String(value || '').toLowerCase();
    const labels = [
      ['modestly-easy', 'Modestly Easy'], ['very-easy', 'Very Easy'],
      ['extremely-easy', 'Extremely Easy'], ['easy', 'Easy'],
      ['moderate', 'Moderate'], ['tough', 'Tough'],
      ['challenging', 'Challenging'], ['irritating', 'Irritating'],
      ['frustrating', 'Frustrating'], ['hard', 'Hard'],
      ['demanding', 'Demanding'], ['expert', 'Expert'],
      ['brutal', 'Brutal'], ['nightmare', 'Nightmare'],
      ['abyssal', 'Abyssal'], ['ascendant', 'Ascendant'],
      ['transcendent', 'Transcendent'],
    ];
    return labels.find(([prefix]) => text.startsWith(prefix))?.[1]
      || value || 'starting';
  }

  function element() {
    return app.dom?.searchDiagnostics || document.getElementById('searchDiagnostics');
  }

  function render(update = {}) {
    const output = element();
    if (!active || !output) return;
    Object.assign(active, update);
    const elapsed = Math.max(0, (active.finishedAt || performance.now()) - active.startedAt);
    const lines = [
      `Phase: ${phaseLabel(active.phase)}  |  Stage: ${active.stage || 'starting'}  |  Elapsed: ${(elapsed / 1000).toFixed(1)}s`,
      `Results: ${active.resultCount ?? '—'}  |  States: ${active.states ?? '—'}  |  Limits: ${active.limits}`,
    ];
    if (active.reason) lines.push(`Stopped: ${active.reason}`);
    output.textContent = lines.join('\n');
    output.hidden = false;
    output.className = `search-diagnostics ${active.reason ? 'warn' : 'active'}`;
  }

  app.searchDiagnostics = {
    begin(operation, payload = {}) {
      if (timer) clearInterval(timer);
      active = {
        operation,
        phase: payload.diagnosticPhase || payload.hierarchyPhase || 'starting',
        stage: 'starting',
        startedAt: performance.now(),
        limits: limits(payload),
        states: null,
        resultCount: null,
        reason: null,
        finishedAt: null,
      };
      render();
      timer = setInterval(() => render(), 500);
      return active;
    },
    update(progress = {}) {
      if (!active) return;
      const count = progress.resultCount ?? progress.results ?? progress.chainsFound
        ?? progress.checked ?? progress.combinations;
      render({
        stage: progress.stage || progress.phase || active.stage,
        states: progress.statesVisited ?? progress.states ?? progress.directedViews
          ?? progress.seedsChecked ?? active.states,
        resultCount: Number.isFinite(Number(count)) ? number(count) : active.resultCount,
      });
    },
    finish(reason, result = null) {
      if (!active) return;
      const count = resultCount(result);
      if (count !== null) active.resultCount = count;
      active.finishedAt = performance.now();
      active.reason = reason || null;
      if (timer) clearInterval(timer);
      timer = null;
      render();
    },
  };
})(window.StormDokuApp = window.StormDokuApp || {});
