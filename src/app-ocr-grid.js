/* StormDoku OCR grid detection and bounded async helpers. */
(function installOcrGrid(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function withTimeout(promise, message, timeout = 15000) {
    let timer;
    const timeoutPromise = new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeout);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
  }

  function projectionLines(values, threshold, minimumGap = 3) {
    const groups = [];
    let start = -1;
    for (let index = 0; index <= values.length; index++) {
      const active = index < values.length && values[index] >= threshold;
      if (active && start < 0) start = index;
      if ((!active || index === values.length) && start >= 0) {
        if (index - start >= 1) groups.push(Math.round((start + index - 1) / 2));
        start = -1;
      }
    }
    const merged = [];
    for (const point of groups) {
      if (!merged.length || point - merged[merged.length - 1] >= minimumGap) merged.push(point);
      else merged[merged.length - 1] = Math.round((merged[merged.length - 1] + point) / 2);
    }
    return merged;
  }

  function detectBounds(image) {
    const maxSide = 1400;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const gray = (x, y) => {
      const offset = (y * canvas.width + x) * 4;
      return (data[offset] * 299 + data[offset + 1] * 587 + data[offset + 2] * 114) / 1000;
    };
    const vertical = Array.from({ length: canvas.width }, (_, x) => {
      let count = 0;
      for (let y = 0; y < canvas.height; y += 2) if (gray(x, y) < 230) count += 1;
      return count;
    });
    const horizontal = Array.from({ length: canvas.height }, (_, y) => {
      let count = 0;
      for (let x = 0; x < canvas.width; x += 2) if (gray(x, y) < 230) count += 1;
      return count;
    });
    const verticalLines = projectionLines(vertical, canvas.height * .24);
    const horizontalLines = projectionLines(horizontal, canvas.width * .24);
    const chooseTen = (lines, size) => {
      if (lines.length < 10) return null;
      let best = null;
      for (let start = 0; start + 9 < lines.length; start++) {
        const sample = lines.slice(start, start + 10);
        const gaps = sample.slice(1).map((value, index) => value - sample[index]);
        const average = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        const variance = gaps.reduce((sum, gap) => sum + (gap - average) ** 2, 0) / gaps.length;
        const score = variance / Math.max(1, average * average)
          + Math.abs((sample[9] - sample[0]) / size - .75);
        if (!best || score < best.score) best = { sample, score };
      }
      return best?.sample || null;
    };
    const xs = chooseTen(verticalLines, canvas.width);
    const ys = chooseTen(horizontalLines, canvas.height);
    const fallbackSize = Math.min(canvas.width, canvas.height) * .82;
    const fallbackLeft = (canvas.width - fallbackSize) / 2;
    const fallbackTop = (canvas.height - fallbackSize) / 2;
    return {
      canvas,
      scale,
      xs: xs || Array.from({ length: 10 }, (_, index) => fallbackLeft + fallbackSize * index / 9),
      ys: ys || Array.from({ length: 10 }, (_, index) => fallbackTop + fallbackSize * index / 9),
    };
  }

  app.ocrGrid = { withTimeout, detectBounds };
})(window);
