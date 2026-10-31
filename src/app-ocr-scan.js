/* StormDoku OCR recognition service. */
(function installOcrScan(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document,
    ImageCtor = global.Image,
    URLRef = global.URL,
    locationRef = global.location,
    statusEl,
    core,
  }) {
        async function recognizeSudokuImage(file) {
          const image = new ImageCtor();
          const url = URLRef.createObjectURL(file);
          try {
            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = () => reject(new Error('The selected image could not be read.'));
              image.src = url;
            });
            const detected = app.ocrGrid.detectBounds(image);
            const Tesseract = await app.ocrGrid.withTimeout(
              app.ocrAssets.loadTesseract(),
              'The local OCR library could not start.',
            );
            const worker = await app.ocrGrid.withTimeout(Tesseract.createWorker('eng', 1, {
              workerPath: './src/ocr/worker.min.js',
              langPath: './src/ocr',
              corePath: './src/ocr/tesseract-core.wasm.js',
              // Blob workers are blocked by some browsers for file:// pages.
              // Use the bundled worker directly in that mode.
              workerBlobURL: locationRef.protocol !== 'file:',
              logger: message => {
                if (message.status) statusEl.textContent = `OCR: ${message.status} ${Math.round((message.progress || 0) * 100)}%`;
              },
              errorHandler: error => {
                statusEl.textContent = `OCR worker error: ${error.message || error}`;
              },
            }), 'The OCR worker could not start. Direct file pages may block browser workers.');
            await worker.setParameters({
              tessedit_char_whitelist: '123456789',
              tessedit_pageseg_mode: '10',
            });
            const result = [];
            for (let row = 0; row < 9; row++) {
              for (let col = 0; col < 9; col++) {
                const left = detected.xs[col];
                const top = detected.ys[row];
                const width = detected.xs[col + 1] - left;
                const height = detected.ys[row + 1] - top;
                const crop = documentRef.createElement('canvas');
                // Sudoku screenshots often contain pencilmarks around the cell
                // edges. Large givens are centered, so isolate the middle glyph
                // before sending each cell to OCR.
                const padX = width * .24;
                const padY = height * .24;
                const scale = 4;
                crop.width = Math.max(32, Math.round((width - padX * 2) * scale));
                crop.height = Math.max(32, Math.round((height - padY * 2) * scale));
                const cropContext = crop.getContext('2d');
                cropContext.fillStyle = '#ffffff';
                cropContext.fillRect(0, 0, crop.width, crop.height);
                cropContext.drawImage(detected.canvas, left + padX, top + padY,
                  width - padX * 2, height - padY * 2, 0, 0, crop.width, crop.height);
                const pixels = cropContext.getImageData(0, 0, crop.width, crop.height).data;
                let ink = 0;
                for (let pixel = 0; pixel < pixels.length; pixel += 4) {
                  const gray = (pixels[pixel] * 299 + pixels[pixel + 1] * 587 + pixels[pixel + 2] * 114) / 1000;
                  if (gray < 170) ink += 1;
                }
                // Pencilmarks are much smaller than the centered given glyph.
                // Skip low-ink cells so a single candidate cannot become a clue.
                if (ink / (crop.width * crop.height) < .025) {
                  result.push('.');
                  continue;
                }
                const recognized = await worker.recognize(crop);
                const digit = (recognized.data.text || '').replace(/[^1-9]/g, '');
                result.push(digit.length === 1 ? digit : '.');
              }
            }
            await worker.terminate();
            return result.join('');
          } finally {
            URLRef.revokeObjectURL(url);
          }
        }
    
        async function recognizeSudokuImageWithOcrad(file) {
          await app.ocrAssets.loadOcrad();
          if (typeof OCRAD !== 'function') throw new Error('The local file OCR engine did not load.');
          const image = new ImageCtor();
          const url = URLRef.createObjectURL(file);
          try {
            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = () => reject(new Error('The selected image could not be read.'));
              image.src = url;
            });
            const detected = app.ocrGrid.detectBounds(image);
            const result = [];
            const readCrop = (left, top, width, height, padFraction) => {
              const padX = width * padFraction;
              const padY = height * padFraction;
              const scale = 4;
              const crop = documentRef.createElement('canvas');
              crop.width = Math.max(32, Math.round((width - padX * 2) * scale));
              crop.height = Math.max(32, Math.round((height - padY * 2) * scale));
              const context = crop.getContext('2d', { willReadFrequently: true });
              context.fillStyle = '#ffffff';
              context.fillRect(0, 0, crop.width, crop.height);
              context.drawImage(detected.canvas, left + padX, top + padY,
                width - padX * 2, height - padY * 2, 0, 0, crop.width, crop.height);
              const pixels = context.getImageData(0, 0, crop.width, crop.height).data;
              let ink = 0;
              const dark = new Uint8Array(crop.width * crop.height);
              for (let pixel = 0; pixel < pixels.length; pixel += 4) {
                const gray = (pixels[pixel] * 299 + pixels[pixel + 1] * 587 + pixels[pixel + 2] * 114) / 1000;
                if (gray < 170) {
                  const index = pixel / 4;
                  dark[index] = 1;
                  ink += 1;
                }
              }
              let largestArea = 0;
              let largestHeight = 0;
              const visited = new Uint8Array(dark.length);
              for (let start = 0; start < dark.length; start++) {
                if (!dark[start] || visited[start]) continue;
                const stack = [start];
                visited[start] = 1;
                let area = 0;
                let minY = crop.height;
                let maxY = -1;
                while (stack.length) {
                  const index = stack.pop();
                  const x = index % crop.width;
                  const y = Math.floor(index / crop.width);
                  area += 1;
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
                  for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                      if (!dx && !dy) continue;
                      const nx = x + dx;
                      const ny = y + dy;
                      if (nx < 0 || nx >= crop.width || ny < 0 || ny >= crop.height) continue;
                      const neighbor = ny * crop.width + nx;
                      if (dark[neighbor] && !visited[neighbor]) {
                        visited[neighbor] = 1;
                        stack.push(neighbor);
                      }
                    }
                  }
                }
                largestArea = Math.max(largestArea, area);
                largestHeight = Math.max(largestHeight, maxY - minY + 1);
              }
              if (ink / (crop.width * crop.height) < .04
                || largestArea / (crop.width * crop.height) < .006
                || largestHeight / crop.height < .30) return '';
              const direct = OCRAD(crop).replace(/[^1-9]/g, '');
              if (direct.length === 1) return direct;
              const binary = documentRef.createElement('canvas');
              binary.width = crop.width;
              binary.height = crop.height;
              const binaryContext = binary.getContext('2d', { willReadFrequently: true });
              binaryContext.drawImage(crop, 0, 0);
              const binaryPixels = binaryContext.getImageData(0, 0, binary.width, binary.height);
              for (let pixel = 0; pixel < binaryPixels.data.length; pixel += 4) {
                const gray = (binaryPixels.data[pixel] * 299 + binaryPixels.data[pixel + 1] * 587 + binaryPixels.data[pixel + 2] * 114) / 1000;
                const value = gray < 205 ? 0 : 255;
                binaryPixels.data[pixel] = value;
                binaryPixels.data[pixel + 1] = value;
                binaryPixels.data[pixel + 2] = value;
                binaryPixels.data[pixel + 3] = 255;
              }
              binaryContext.putImageData(binaryPixels, 0, 0);
              return OCRAD(binary).replace(/[^1-9]/g, '');
            };
            for (let row = 0; row < 9; row++) {
              for (let col = 0; col < 9; col++) {
                const left = detected.xs[col];
                const top = detected.ys[row];
                const width = detected.xs[col + 1] - left;
                const height = detected.ys[row + 1] - top;
                const readings = [.20, .24, .28, .32, .36]
                  .map(pad => readCrop(left, top, width, height, pad));
                const votes = new Map();
                for (const reading of readings) {
                  if (reading.length === 1) votes.set(reading, (votes.get(reading) || 0) + 1);
                }
                let digit = '';
                let voteCount = 0;
                for (const [candidate, count] of votes) {
                  if (count > voteCount) {
                    digit = candidate;
                    voteCount = count;
                  }
                }
                result.push(voteCount >= 1 ? digit : '.');
                statusEl.textContent = `OCR: scanning cell ${row * 9 + col + 1} of 81`;
              }
            }
            return result.join('');
          } finally {
            URLRef.revokeObjectURL(url);
          }
        }
    
        function ocrPuzzleIsLoadable(text) {
          const grid = core.decode(text);
          return Boolean(grid && core.countSolutionsDlx(grid, 1) > 0);
        }
    

    return {
      recognizeSudokuImage,
      recognizeSudokuImageWithOcrad,
      ocrPuzzleIsLoadable,
    };
  }

  app.ocrScan = { create };
})(window);

