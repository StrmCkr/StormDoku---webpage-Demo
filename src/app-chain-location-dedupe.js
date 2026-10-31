/* StormDoku chain hierarchy-location de-duplication. */
(function installChainLocationDedupe(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function create() {
    function uniqueLocations(locations) {
      const seen = new Set();
      return locations.filter(location => {
        const key = [location.family, location.wing, location.rank, location.subclass].join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return { uniqueLocations };
  }

  app.chainLocationDedupe = { create };
})(window);
