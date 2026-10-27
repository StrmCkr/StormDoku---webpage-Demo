/* StormDoku shared numeric form helpers. */
(function installFormControls(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function fillNumberSelect(select, min, max, selected) {
    select.textContent = '';
    for (let value = min; value <= max; value++) {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = String(value);
      if (value === selected) option.selected = true;
      select.appendChild(option);
    }
  }

  function selectedNumbers(values) {
    return [...values].sort((left, right) => left - right);
  }

  app.formControls = { fillNumberSelect, selectedNumbers };
})(window);
