/* StormDoku digit-highlight and candidate-size controls. */
(function installCandidateControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ digitSet, sizeSet, digitElement, sizeElement, limitToggle, clearButton, hasCandidates, renderBoard, setLimit }) {
    function renderDigits() {
      digitElement.textContent = '';
      for (let digit = 1; digit <= 9; digit++) {
        const button = document.createElement('button');
        const available = hasCandidates(digit);
        button.type = 'button';
        button.className = 'digit-focus-button digit-focus-' + digit;
        button.textContent = String(digit);
        button.classList.toggle('digit-complete', !available);
        button.title = available ? 'Highlight digit ' + digit : 'Digit ' + digit + ' solved in full';
        button.setAttribute('aria-label', button.title);
        button.setAttribute('aria-pressed', String(digitSet.has(digit)));
        button.classList.toggle('selected', digitSet.has(digit));
        button.addEventListener('click', () => {
          if (digitSet.has(digit)) digitSet.delete(digit);
          else digitSet.add(digit);
          renderDigits();
          renderBoard();
        });
        digitElement.appendChild(button);
      }
    }

    function clearDigits() {
      digitSet.clear();
      renderDigits();
      renderBoard();
    }

    function renderSizes() {
      sizeElement.textContent = '';
      const labels = ['X', 'XY', 'XYZ', 'WXYZ'];
      for (let size = 1; size <= 4; size++) {
        const button = document.createElement('button');
        const label = labels[size - 1];
        button.type = 'button';
        button.className = 'candidate-size-button';
        button.textContent = label;
        button.title = `Highlight exact ${label} cells and one-size-lower selected subsets`;
        button.setAttribute('aria-label', button.title);
        button.setAttribute('aria-pressed', String(sizeSet.has(size)));
        button.classList.toggle('selected', sizeSet.has(size));
        button.addEventListener('click', () => {
          if (sizeSet.has(size)) sizeSet.delete(size);
          else sizeSet.add(size);
          renderSizes();
          renderBoard();
        });
        sizeElement.appendChild(button);
      }
    }

    function installFilterEvents() {
      limitToggle.addEventListener('change', () => {
        setLimit(limitToggle.checked);
        renderBoard();
      });
      clearButton.addEventListener('click', clearDigits);
    }

    return { renderDigits, clearDigits, renderSizes, installFilterEvents };
  }

  app.candidateControls = { create };
})(window);
