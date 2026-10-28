/* Asynchronous clue-minimization algorithm. */
(function installToyMinimizer(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  async function minimize(source, isUnique, shouldContinue, yieldControl) {
    const working = [...source]; const removed = [];
    let changed = true;
    while (changed) {
      changed = false;
      for (let cell = 0; cell < 81; cell += 1) {
        if (!shouldContinue()) return null;
        const digit = working[cell]; if (!digit) continue;
        working[cell] = 0; await yieldControl();
        if (isUnique(working)) { removed.push({ cell, digit }); changed = true; }
        else working[cell] = digit;
      }
    }
    return { reduced: working, removed };
  }
  app.toyMinimizer = { minimize };
})(window);
