/* StormDoku reusable toggle-grid controls. */
(function installToggleUi(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function setButton(button, selected) {
    button.classList.toggle('selected', selected);
    button.title = selected ? 'On' : 'Off';
    button.setAttribute('aria-pressed', String(selected));
  }

  function buildGrid(container, values, selectedSet, labelFor, onToggle) {
    container.textContent = '';
    for (const value of values) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mini-toggle';
      button.textContent = labelFor(value);
      setButton(button, selectedSet.has(value));
      button.addEventListener('click', () => {
        if (selectedSet.has(value)) selectedSet.delete(value);
        else selectedSet.add(value);
        setButton(button, selectedSet.has(value));
        onToggle();
      });
      container.appendChild(button);
    }
  }

  app.toggleUi = { setButton, buildGrid };
})(window);
