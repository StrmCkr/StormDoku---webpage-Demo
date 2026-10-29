/* StormDoku chain visual palette. */
(function installChainVisualPalette(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  const alsColors = Object.freeze([
    { bg: 'rgba(0, 158, 115, .34)', stroke: 'rgba(0, 103, 75, .88)', ink: '#065f46' },
    { bg: 'rgba(0, 74, 130, .42)', stroke: 'rgba(0, 49, 95, .92)', ink: '#073b78' },
    { bg: 'rgba(104, 120, 62, .32)', stroke: 'rgba(65, 80, 28, .90)', ink: '#3f6212' },
    { bg: 'rgba(0, 170, 170, .34)', stroke: 'rgba(0, 105, 105, .88)', ink: '#0f4c5c' },
    { bg: 'rgba(112, 82, 190, .32)', stroke: 'rgba(74, 46, 145, .88)', ink: '#4c1d95' },
    { bg: 'rgba(90, 160, 80, .34)', stroke: 'rgba(45, 105, 40, .88)', ink: '#166534' },
    { bg: 'rgba(72, 149, 113, .34)', stroke: 'rgba(35, 103, 76, .90)', ink: '#14532d' },
    { bg: 'rgba(17, 82, 147, .40)', stroke: 'rgba(9, 51, 102, .92)', ink: '#062e68' },
    { bg: 'rgba(145, 75, 175, .32)', stroke: 'rgba(95, 35, 125, .88)', ink: '#6b21a8' },
    { bg: 'rgba(20, 175, 150, .34)', stroke: 'rgba(0, 115, 95, .88)', ink: '#115e59' },
    { bg: 'rgba(29, 78, 160, .40)', stroke: 'rgba(18, 52, 112, .92)', ink: '#172554' },
    { bg: 'rgba(159, 132, 54, .30)', stroke: 'rgba(100, 82, 24, .90)', ink: '#713f12' },
  ]);

  const ahsRecordColor = Object.freeze({
    bg: 'rgba(147, 197, 253, .24)',
    stroke: 'rgba(29, 78, 216, .68)',
    ink: '#1e40af',
  });

  const ahsColors = Object.freeze([
    ahsRecordColor,
    { bg: 'rgba(251, 191, 36, .25)', stroke: 'rgba(180, 83, 9, .78)', ink: '#92400e' },
    { bg: 'rgba(244, 114, 182, .24)', stroke: 'rgba(190, 24, 93, .76)', ink: '#9d174d' },
    { bg: 'rgba(167, 139, 250, .24)', stroke: 'rgba(109, 40, 217, .76)', ink: '#5b21b6' },
    { bg: 'rgba(45, 212, 191, .24)', stroke: 'rgba(13, 116, 144, .76)', ink: '#115e59' },
    { bg: 'rgba(251, 146, 60, .24)', stroke: 'rgba(194, 65, 12, .76)', ink: '#9a3412' },
    { bg: 'rgba(134, 239, 172, .24)', stroke: 'rgba(22, 101, 52, .76)', ink: '#166534' },
    { bg: 'rgba(125, 211, 252, .24)', stroke: 'rgba(3, 105, 161, .76)', ink: '#075985' },
  ]);

  function colorAt(index) {
    if (alsColors[index]) return alsColors[index];
    const hue = 180 + ((index * 47) % 151);
    return {
      bg: `hsla(${hue}, 72%, 46%, .28)`,
      stroke: `hsla(${hue}, 78%, 30%, .88)`,
      ink: `hsl(${hue}, 72%, 24%)`,
    };
  }

  function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
  }

  function applyAlsColorVars(element, color) {
    if (!color) return;
    element.style.setProperty('--chain-als-bg', color.bg);
    element.style.setProperty('--chain-als-stroke', color.stroke);
    element.style.setProperty('--chain-als-ink', color.ink);
  }

  function applyAlsPartitionColors(element, colors) {
    const distinct = [...new Map((colors || []).filter(Boolean).map(color => [
      `${color.bg}|${color.stroke}|${color.ink}`,
      color,
    ])).values()];
    if (distinct.length <= 1) {
      applyAlsColorVars(element, distinct[0]);
      return;
    }
    const width = 100 / distinct.length;
    const stops = distinct.map((color, index) =>
      `${color.bg} ${index * width}% ${(index + 1) * width}%`
    ).join(', ');
    element.style.background = `linear-gradient(90deg, ${stops}), ${element.classList.contains('given') ? '#e9eef5' : 'var(--panel)'}`;
    element.style.setProperty('--chain-als-stroke', distinct[0].stroke);
    element.style.setProperty('--chain-als-ink', distinct[0].ink);
    element.style.boxShadow = `inset 0 0 0 1px ${distinct[0].stroke}`;
  }

  function applyAhsColorVars(element, color) {
    if (!color) return;
    element.style.setProperty('--ahs-record-bg', color.bg);
    element.style.setProperty('--ahs-record-stroke', color.stroke);
    element.style.setProperty('--ahs-record-ink', color.ink);
  }

  app.chainVisualPalette = {
    alsColors,
    ahsColors,
    ahsRecordColor,
    colorAt,
    hashString,
    applyAlsColorVars,
    applyAlsPartitionColors,
    applyAhsColorVars,
  };
})(window);
