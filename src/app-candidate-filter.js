/* StormDoku candidate-filter predicates and styling. */
(function installCandidateFilter(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ digitSet, sizeSet, getCandidates, getPuzzle, getPromoted, hasCandidate }) {
    function digits(cell) {
      return getCandidates(cell) || [];
    }

    function style() {
      const selected = [...digitSet].sort((left, right) => left - right);
      if (!selected.length) return {
        fill: '#fff7cc', border: '#b7791f', ink: '#7c5a00', mark: 'rgba(255, 237, 160, .62)',
      };
      const key = selected.join('');
      let hash = 0;
      for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) % 360;
      return {
        fill: `hsl(${hash}, 86%, 91%)`,
        border: `hsl(${hash}, 55%, 42%)`,
        ink: `hsl(${hash}, 58%, 30%)`,
        mark: `hsla(${hash}, 82%, 76%, .62)`,
      };
    }

    function applyStyle(element, value) {
      element.style.setProperty('--candidate-size-filter-fill', value.fill);
      element.style.setProperty('--candidate-size-filter-border', value.border);
      element.style.setProperty('--candidate-size-filter-ink', value.ink);
      element.style.setProperty('--candidate-size-filter-mark', value.mark);
    }

    function matches(cell) {
      if (!sizeSet.size || getPuzzle(cell) || getPromoted(cell)) return false;
      const values = digits(cell);
      if (!values.length || !sizeSet.has(values.length)) return false;
      if (digitSet.size) {
        const selected = [...digitSet].sort((left, right) => left - right);
        const cellDigits = [...values].sort((left, right) => left - right);
        const exact = cellDigits.length === selected.length
          && cellDigits.every((digit, index) => digit === selected[index]);
        const subset = cellDigits.length === selected.length - 1
          && cellDigits.every(digit => digitSet.has(digit));
        if (!exact && !subset) return false;
      }
      return true;
    }

    function digitMatches(cell, digit) {
      return matches(cell) && (!digitSet.size || digitSet.has(digit)) && hasCandidate(cell, digit);
    }

    function digitVisible(cell, digit, limit) {
      return digitSet.has(digit)
        && (!limit || !sizeSet.size || matches(cell));
    }

    return { digits, style, applyStyle, matches, digitMatches, digitVisible };
  }

  app.candidateFilter = { create };
})(window);
