/* StormDoku clipboard-to-puzzle input orchestration. */
(function installInputLoader(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ input, readClipboard, load, setStatus }) {
    async function importPuzzle() {
      const { text, error } = await readClipboard();
      if (text) input.value = text;
      load();
      if (error) {
        setStatus('Clipboard access failed. Paste the puzzle into the input field manually, then press Load.', 'warn');
      }
    }
    return { importPuzzle };
  }

  app.inputLoader = { create };
})(window);
