/* StormDoku multi-colouring palettes and candidate/SVG styling. */
(function installMultiColoringStyle(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  const cellStyles = {
    purple: { ink: '#7e22ce', fill: 'rgba(233, 213, 255, .9)', stroke: '#7e22ce' },
    blue: { ink: '#1d4ed8', fill: 'rgba(191, 219, 254, .9)', stroke: '#2563eb' },
    yellow: { ink: '#a16207', fill: 'rgba(254, 249, 195, .92)', stroke: '#a16207' },
    green: { ink: '#15803d', fill: 'rgba(187, 247, 208, .92)', stroke: '#15803d' },
    cyan: { ink: '#0891b2', fill: 'rgba(207, 250, 254, .92)', stroke: '#0891b2' },
    aqua: { ink: '#0f766e', fill: 'rgba(204, 251, 241, .92)', stroke: '#0f766e' },
    orange: { ink: '#c2410c', fill: 'rgba(255, 237, 213, .92)', stroke: '#c2410c' },
    red: { ink: '#b91c1c', fill: 'rgba(254, 202, 202, .92)', stroke: '#b91c1c' },
    pink: { ink: '#be185d', fill: 'rgba(251, 207, 232, .92)', stroke: '#be185d' },
    magenta: { ink: '#a21caf', fill: 'rgba(245, 208, 254, .92)', stroke: '#a21caf' },
    teal: { ink: '#0f766e', fill: 'rgba(153, 246, 228, .92)', stroke: '#0f766e' },
    lime: { ink: '#4d7c0f', fill: 'rgba(217, 249, 157, .92)', stroke: '#4d7c0f' },
    gold: { ink: '#92400e', fill: 'rgba(254, 243, 199, .92)', stroke: '#92400e' },
    brown: { ink: '#78350f', fill: 'rgba(231, 213, 197, .92)', stroke: '#78350f' },
    indigo: { ink: '#4338ca', fill: 'rgba(224, 231, 255, .92)', stroke: '#4338ca' },
    coral: { ink: '#c2410c', fill: 'rgba(255, 228, 220, .92)', stroke: '#c2410c' },
    slate: { ink: '#475569', fill: 'rgba(226, 232, 240, .92)', stroke: '#475569' },
    rose: { ink: '#be123c', fill: 'rgba(255, 228, 230, .92)', stroke: '#be123c' },
  };

  // Standalone Multi-colouring uses its own node palette; 3D-Medusa bivalves
  // continue to use the cell palette above.
  const graphStyles = {
    lavender: { ink: '#7c3aed', fill: 'rgba(221, 214, 254, .92)', stroke: '#7c3aed' },
    sky: { ink: '#0284c7', fill: 'rgba(186, 230, 253, .92)', stroke: '#0284c7' },
    amber: { ink: '#b45309', fill: 'rgba(253, 230, 138, .92)', stroke: '#b45309' },
    mint: { ink: '#047857', fill: 'rgba(167, 243, 208, .92)', stroke: '#047857' },
    turquoise: { ink: '#0f766e', fill: 'rgba(153, 246, 228, .92)', stroke: '#0f766e' },
    peach: { ink: '#c2410c', fill: 'rgba(254, 215, 170, .92)', stroke: '#c2410c' },
    cobalt: { ink: '#1d4ed8', fill: 'rgba(191, 219, 254, .92)', stroke: '#1d4ed8' },
    olive: { ink: '#4d7c0f', fill: 'rgba(217, 249, 157, .92)', stroke: '#4d7c0f' },
    plum: { ink: '#86198f', fill: 'rgba(250, 232, 255, .92)', stroke: '#86198f' },
    lemon: { ink: '#a16207', fill: 'rgba(254, 249, 195, .92)', stroke: '#a16207' },
    slate: { ink: '#475569', fill: 'rgba(226, 232, 240, .92)', stroke: '#475569' },
    sage: { ink: '#166534', fill: 'rgba(220, 252, 231, .92)', stroke: '#166534' },
    charcoal: { ink: '#374151', fill: 'rgba(229, 231, 235, .92)', stroke: '#374151' },
    apricot: { ink: '#9a3412', fill: 'rgba(255, 237, 213, .92)', stroke: '#9a3412' },
    orchid: { ink: '#a21caf', fill: 'rgba(250, 232, 255, .92)', stroke: '#a21caf' },
    moss: { ink: '#3f6212', fill: 'rgba(236, 252, 203, .92)', stroke: '#3f6212' },
    navy: { ink: '#1e3a8a', fill: 'rgba(219, 234, 254, .92)', stroke: '#1e3a8a' },
    gold: { ink: '#92400e', fill: 'rgba(254, 243, 199, .92)', stroke: '#92400e' },
  };

  // Additional pairs use a fixed high-contrast sequence based on Okabe-Ito.
  const fallbackStyles = [
    { ink: '#0072b2', fill: 'rgba(86, 180, 233, .86)', stroke: '#0072b2' },
    { ink: '#d55e00', fill: 'rgba(230, 159, 0, .88)', stroke: '#d55e00' },
    { ink: '#009e73', fill: 'rgba(0, 158, 115, .32)', stroke: '#009e73' },
    { ink: '#cc79a7', fill: 'rgba(204, 121, 167, .52)', stroke: '#cc79a7' },
    { ink: '#000000', fill: 'rgba(240, 228, 66, .9)', stroke: '#000000' },
    { ink: '#7a3e9d', fill: 'rgba(148, 103, 189, .58)', stroke: '#7a3e9d' },
    { ink: '#4d4d4d', fill: 'rgba(180, 180, 180, .72)', stroke: '#4d4d4d' },
    { ink: '#b22222', fill: 'rgba(213, 94, 0, .54)', stroke: '#b22222' },
  ];

  function tokenClass(token) {
    return String(token || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  function styleForToken(token) {
    if (graphStyles[token]) return graphStyles[token];
    if (cellStyles[token]) return cellStyles[token];
    const match = /^pair-(\d+)-(left|right)$/.exec(String(token || ''));
    if (!match) return null;
    const pairIndex = Number(match[1]) - 1;
    const styleIndex = (pairIndex * 2 + (match[2] === 'right' ? 1 : 0)) % fallbackStyles.length;
    return fallbackStyles[styleIndex];
  }

  function apply(element, tokens) {
    const names = [...new Set((tokens || []).filter(Boolean))];
    if (!names.length) return;
    names.forEach(token => element.classList.add(`multi-colouring-${tokenClass(token)}`));
    const styles = names.map(styleForToken).filter(Boolean);
    if (element.namespaceURI === 'http://www.w3.org/2000/svg') {
      if (styles.length === 1) {
        element.setAttribute('fill', element.tagName === 'path' ? 'none' : styles[0].fill);
        element.setAttribute('stroke', styles[0].stroke);
      }
      return;
    }
    element.classList.add('multi-colouring-digit');
    if (styles.length === 1) {
      element.style.color = styles[0].ink;
      element.style.background = styles[0].fill;
      element.style.boxShadow = `inset 0 0 0 2px ${styles[0].stroke}`;
    } else {
      element.classList.add('multi-colouring-dual-digit');
      element.style.color = '#334155';
      element.style.background = `linear-gradient(135deg, ${styles[0]?.fill || 'transparent'} 0 50%, ${styles[1]?.fill || styles[0]?.fill || 'transparent'} 50% 100%)`;
    }
  }

  app.multiColoringStyle = { apply };
})(window);
