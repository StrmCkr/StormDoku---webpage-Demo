/* StormDoku solution-action event wiring. */
(function(global){
  const app=global.StormDokuApp=global.StormDokuApp||{};
  function install({apply,clear,undo,redo,applyAction,clearAction,undoAction,redoAction}){
    apply.addEventListener('click',event=>{event.stopPropagation();applyAction();});
    clear.addEventListener('click',event=>{event.stopPropagation();clearAction();});
    undo.addEventListener('click',undoAction);
    redo.addEventListener('click',redoAction);
  }
  app.solutionEvents={install};
})(window);
