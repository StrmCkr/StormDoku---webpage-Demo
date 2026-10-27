/* StormDoku clipboard input helper. */
(function installClipboardHelper(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  async function readText() {
    try {
      const text = await global.navigator.clipboard?.readText?.();
      return { text: text?.trim() || '', error: null };
    } catch (error) {
      return { text: '', error };
    }
  }

  async function writeText(value) {
    return global.navigator.clipboard.writeText(value);
  }

  async function copyText(value) {
    try {
      await writeText(value);
      return true;
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = value;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.appendChild(fallback);
      fallback.select();
      const copied = document.execCommand('copy');
      fallback.remove();
      return copied;
    }
  }

  app.clipboard = { readText, writeText, copyText };
})(window);
