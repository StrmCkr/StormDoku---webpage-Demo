/* StormDoku linked-puzzle URL state. */
(function installLinkState(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ variantSettings, variantInputs }) {
    const variantUrlNames = {
      diagonal: 'diagonal',
      antiDiagonal: 'anti-diagonal',
      windoku: 'windoku',
      antiKing: 'anti-king',
      antiKnight: 'anti-knight',
      nonConsecutive: 'non-consecutive',
    };

    function puzzleLink(text) {
      const url = new URL(global.location.href);
      url.search = '';
      url.hash = '';
      url.searchParams.set('grid', text);
      const activeVariants = Object.entries(variantSettings)
        .filter(([, enabled]) => enabled)
        .map(([name]) => variantUrlNames[name] || name);
      if (activeVariants.length) url.searchParams.set('variants', activeVariants.join(','));
      return url.toString();
    }

    function linkedVariantSettings() {
      const params = new URLSearchParams(global.location.search);
      const hash = global.location.hash.replace(/^#/, '');
      const hashParams = hash ? new URLSearchParams(hash) : null;
      const value = params.get('variants') ?? params.get('variant')
        ?? hashParams?.get('variants') ?? hashParams?.get('variant');
      if (value == null) return false;
      const variantAliases = new Map([
        ['diagonal', 'diagonal'],
        ['antidiagonal', 'antiDiagonal'],
        ['windoku', 'windoku'],
        ['antiking', 'antiKing'],
        ['antiknight', 'antiKnight'],
        ['nonconsecutive', 'nonConsecutive'],
      ]);
      const active = new Set(value.split(',')
        .map(name => variantAliases.get(name.trim().toLowerCase().replace(/[-_\s]/g, '')))
        .filter(Boolean));
      for (const name of Object.keys(variantSettings)) variantSettings[name] = active.has(name);
      for (const [key, input] of Object.entries(variantInputs)) input.checked = variantSettings[key];
      return true;
    }

    function linkedPuzzleInput() {
      const params = new URLSearchParams(global.location.search);
      const queryValue = params.get('grid') ?? params.get('puzzle') ?? params.get('729');
      if (queryValue !== null) return queryValue;
      const hash = global.location.hash.replace(/^#/, '');
      if (!hash) return null;
      const hashParams = new URLSearchParams(hash);
      return hashParams.get('grid') ?? hashParams.get('puzzle') ?? null;
    }

    return { puzzleLink, linkedVariantSettings, linkedPuzzleInput };
  }

  app.linkState = { create };
})(window);
