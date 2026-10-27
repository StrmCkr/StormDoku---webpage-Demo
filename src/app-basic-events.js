/* StormDoku core puzzle-control event wiring. */
(function installBasicEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};

  function install({ generate, manual, reset, next, run, basics, load, importPuzzle, generateAction, nextAction, runAction, basicsAction, loadAction, importAction, setManualMode, isManual, render, cancel, resetCandidates }) {
    generate.addEventListener('click', generateAction);
    manual.addEventListener('click', () => {
      setManualMode(!isManual());
      render();
    });
    reset.addEventListener('click', () => {
      cancel('Search cancelled by puzzle reload.');
      resetCandidates();
    });
    next.addEventListener('click', nextAction);
    run.addEventListener('click', runAction);
    basics.addEventListener('click', basicsAction);
    load.addEventListener('click', loadAction);
    importPuzzle.addEventListener('click', importAction);
  }

  app.basicEvents = { install };
})(window);
