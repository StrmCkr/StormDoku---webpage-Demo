/* StormDoku colouring-sequence controls and navigation. */
(function installColouringSequenceControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({
    documentRef = global.document, state, selectedRecord, sequenceInfo,
    displayRecord, setSequenceEnabled, stepSequence, renderBoard,
  }) {
    function render() {
      for (const method of Object.keys(state)) {
        const methodState = state[method];
        const info = sequenceInfo(selectedRecord(method), method);
        const prefix = method === 'medusaMulti' ? 'threeDMedusaMulti'
          : method === 'medusa' ? 'threeDMedusa' : method;
        const record = selectedRecord(method);
        const label = documentRef.getElementById(`${prefix}BreadthLabel`);
        const eliminationLabel = documentRef.getElementById(`${prefix}EliminationLabel`);
        const previous = documentRef.querySelector(`[data-colouring-step="${method}"][data-step="-1"]`);
        const next = documentRef.querySelector(`[data-colouring-step="${method}"][data-step="1"]`);
        if (label) label.textContent = methodState.enabled ? `Step ${info.breadth} of ${info.max}` : 'Full';
        if (eliminationLabel) {
          const display = displayRecord(record, method);
          eliminationLabel.textContent = `Eliminations visible: ${display?.eliminations?.length || 0}`;
        }
        if (previous) previous.disabled = !methodState.enabled || info.breadth <= 1;
        if (next) next.disabled = !methodState.enabled || info.breadth >= info.max;
      }
    }

    function enable(method, enabled) {
      setSequenceEnabled(method, enabled);
      render();
      renderBoard();
    }

    function step(method, delta) {
      stepSequence(method, delta, selectedMethod => sequenceInfo(selectedRecord(selectedMethod), selectedMethod));
      render();
      renderBoard();
    }

    for (const input of documentRef.querySelectorAll('[data-colouring-sequential]')) {
      input.addEventListener('change', () => enable(input.dataset.colouringSequential, input.checked));
    }
    for (const button of documentRef.querySelectorAll('[data-colouring-step]')) {
      button.addEventListener('click', () => step(button.dataset.colouringStep, Number(button.dataset.step)));
    }

    return { render, enable, step };
  }

  app.colouringSequenceControls = { create };
})(window);
