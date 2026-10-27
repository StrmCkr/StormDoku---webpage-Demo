/* StormDoku Toy, Automorph, and Mini-Lex event wiring. */
(function(global){
  const app=global.StormDokuApp=global.StormDokuApp||{};
  function install({transformButtons,transformMapper,applyCellTransform,stackSwapButton,stackSwap,bandSwapButton,bandSwap,rowSwapButton,rowSwap,columnSwapButton,columnSwap,digitSwapButton,digitSwap,automorphSearchButton,automorphSearchAction,automorphClear,minimizerSearchButton,minimizerSearchAction,minimizerReplaceButton,minimizerReplaceAction,useSolution,clearAutomorph,clearMiniLex,automorphSource,setStatus,legend,legendPanel,legendSymbol,legendClose,miniLexBuild,buildMiniLex}){
    for(const button of transformButtons)button.addEventListener('click',()=>{const mapper=transformMapper(button.dataset.toyTransform);if(mapper)applyCellTransform(button.textContent.trim(),mapper);});
    stackSwapButton.addEventListener('click',()=>stackSwap());
    bandSwapButton.addEventListener('click',()=>bandSwap());
    rowSwapButton.addEventListener('click',()=>rowSwap());
    columnSwapButton.addEventListener('click',()=>columnSwap());
    digitSwapButton.addEventListener('click',()=>digitSwap());
    for(const [button,run] of [[automorphSearchButton,automorphSearchAction],[automorphClear,clearAutomorph],[minimizerSearchButton,minimizerSearchAction],[minimizerReplaceButton,minimizerReplaceAction]])button.addEventListener('click',event=>{event.stopPropagation();run();});
    useSolution.addEventListener('change',()=>{clearAutomorph();clearMiniLex();const comparison=automorphSource();if(useSolution.checked&&!comparison.hasSolution)setStatus('Use solution is selected, but this grid has no complete solution yet.','warn');});
    legend.addEventListener('click',event=>{event.stopPropagation();const open=legendPanel.hidden;legendPanel.hidden=!open;legend.setAttribute('aria-expanded',String(open));legendSymbol.textContent=open?'−':'+';});
    legendClose.addEventListener('click',event=>{event.stopPropagation();legendPanel.hidden=true;legend.setAttribute('aria-expanded','false');legendSymbol.textContent='+';});
    miniLexBuild.addEventListener('click',event=>{event.stopPropagation();buildMiniLex();setStatus('Mini-lex representation built.','ok');});
  }
  app.toyEvents={install};
})(window);
