/* StormDoku copy and solution-output event wiring. */
(function(global){
  const app=global.StormDokuApp=global.StormDokuApp||{};
  function install({puzzle81,puzzle729,puzzle81Link,puzzle729Link,solutionEureka,solutionList,copyPuzzle,encodePuzzle,current729,linkPuzzle,cleanEureka,highlightedEureka,solutionText}){
    puzzle81.addEventListener('click',()=>copyPuzzle(encodePuzzle(),'81-character puzzle'));
    puzzle729.addEventListener('click',()=>copyPuzzle(current729(),'729 candidate grid'));
    puzzle81Link.addEventListener('click',()=>copyPuzzle(linkPuzzle(encodePuzzle()),'81-character puzzle link'));
    puzzle729Link.addEventListener('click',()=>copyPuzzle(linkPuzzle(current729()),'729 candidate grid link'));
    solutionEureka.addEventListener('click',event=>{event.stopPropagation();const text=cleanEureka(highlightedEureka());if(text)void copyPuzzle(text,'Eureka');});
    solutionList.addEventListener('click',event=>{event.stopPropagation();const text=solutionText();if(text)void copyPuzzle(text,'Solution');});
  }
  app.copyEvents={install};
})(window);
