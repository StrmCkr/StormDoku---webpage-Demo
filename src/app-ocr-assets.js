/* StormDoku OCR asset loading and caching. */
(function installOcrAssets(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  const workerRuntime = app.workerRuntime;
  let tesseractPromise = null;
  let ocradPromise = null;

  function loadTesseract() {
    if (global.Tesseract) return Promise.resolve(global.Tesseract);
    if (!tesseractPromise) {
      tesseractPromise = workerRuntime.loadLocalScript(
        './src/ocr/tesseract.min.js?v=5.1.1',
        'Tesseract',
        'The local Tesseract OCR library did not load.',
      );
    }
    return tesseractPromise;
  }

  function loadOcrad() {
    if (!ocradPromise) {
      ocradPromise = workerRuntime.loadLocalScript(
        './src/ocr/ocrad.js?v=0.25',
        'OCRAD',
        'The local Ocrad OCR engine did not load.',
      );
    }
    return ocradPromise;
  }

  app.ocrAssets = { loadTesseract, loadOcrad };
})(window);
