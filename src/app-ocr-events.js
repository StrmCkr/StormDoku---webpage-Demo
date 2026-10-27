/* StormDoku OCR dialog event wiring. */
(function installOcrEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ scan, imageInput, result, load, cancel, dialog, controller, isLoadable, setStatus, loadPuzzle }) {
    scan.addEventListener('click', controller.openDialog);
    imageInput.addEventListener('change', () => {
      void controller.handleImage(imageInput.files?.[0]);
      imageInput.value = '';
    });
    result.addEventListener('input', () => {
      load.disabled = !isLoadable(result.value.trim());
    });
    cancel.addEventListener('click', () => {
      dialog.close?.();
      dialog.removeAttribute('open');
    });
    load.addEventListener('click', () => {
      const text = result.value.trim();
      if (!isLoadable(text)) {
        setStatus('OCR result must be an 81-character grid with at least one valid solution.');
        return;
      }
      dialog.close?.();
      dialog.removeAttribute('open');
      loadPuzzle(text);
    });
  }

  app.ocrEvents = { install };
})(window);
