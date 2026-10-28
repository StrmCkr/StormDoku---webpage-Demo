/* StormDoku solution history view. */
(function installSolutionLogView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create({ elements, formatRatingValue, inspectLogStep }) {
    function displayedStepDescription(entry) {
      const description = String(entry?.desc || '');
      const moveName = String(entry?.moveName || entry?.ratingTag || '').trim();
      if (!entry?.chain || !moveName || moveName === 'Unknown') return description;
      const separator = description.indexOf(':');
      if (separator < 0) return description;
      return `${moveName}: ${description.slice(separator + 1).trim()}`;
    }

    function render(entries, historyState) {
      const { log, preview } = elements;
      log.textContent = '';
      const latest = historyState.active ? entries[historyState.index] : entries[entries.length - 1];
      preview.textContent = latest ? `${latest.cycle}. ${displayedStepDescription(latest)}` : 'No applied steps yet.';
      for (let index = entries.length - 1; index >= 0; index--) {
        const entry = entries[index];
        const li = document.createElement('li');
        const tag = document.createElement('span');
        const title = document.createElement('strong');
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.classList.toggle('selected', historyState.index === index);
        li.addEventListener('click', () => inspectLogStep(index));
        li.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          inspectLogStep(index);
        });
        tag.className = 'rating-tag';
        const value = formatRatingValue(entry.rating?.value);
        tag.textContent = value ? `Rating: (${value})` : 'Rating: (Unknown)';
        title.textContent = `${entry.cycle}. ${displayedStepDescription(entry)}`;
        li.append(tag, title);
        log.appendChild(li);
      }
    }

    return { render, displayedStepDescription };
  }

  app.solutionLogView = { create };
})(window);
