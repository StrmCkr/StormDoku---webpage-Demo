/* StormDoku POM list rendering helper. */
(function installPomView(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function create(resultsElement) {
    function renderList(title, items) {
      if (!items.length) return;
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = title;
      section.appendChild(heading);
      const list = document.createElement('ul');
      for (const value of items) {
        const item = document.createElement('li');
        item.textContent = value;
        list.appendChild(item);
      }
      section.appendChild(list);
      resultsElement.appendChild(section);
    }
    return { renderList };
  }
  app.pomView = { create };
})(window);
