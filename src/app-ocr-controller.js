/* StormDoku OCR dialog and scan orchestration. */
(function installOcrController(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ dialog, imageInput, result, load, status, preview, recognize, isLoadable }) {
    let imageUrl = null;

    function openDialog() {
      result.value = '';
      load.disabled = true;
      status.textContent = 'Choose a Sudoku screenshot or image.';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      imageInput.click();
    }

    async function handleImage(file) {
      if (!file) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      imageUrl = URL.createObjectURL(file);
      preview.src = imageUrl;
      status.textContent = location.protocol === 'file:'
        ? 'Loading bundled OCR...'
        : 'Loading OCR engine...';
      load.disabled = true;
      try {
        const text = await recognize(file);
        result.value = text;
        load.disabled = !isLoadable(text);
        status.textContent = load.disabled
          ? 'The scan needs correction before loading. Large givens are kept; pencilmarks may need to be removed.'
          : 'Review the recognized givens. Empty cells are shown as dots.';
      } catch (error) {
        status.textContent = error.message || 'OCR failed.';
      }
    }

    return { openDialog, handleImage };
  }

  app.ocrController = { create };
})(window);
