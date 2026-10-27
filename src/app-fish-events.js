/* StormDoku Fish tool event wiring. */
(function installFishEvents(global) {
  const app = global.StormDokuApp = global.StormDokuApp || {};
  function install(button, run) {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      run();
    });
  }
  function installSettings({digitsOn,digitsOff,allSectorButtons,setAllDigits,setVariantRange,setRange}) {
    digitsOn.addEventListener('click',()=>setAllDigits(true));
    digitsOff.addEventListener('click',()=>setAllDigits(false));
    for (const button of allSectorButtons) button.addEventListener('click',()=>{
      if (button.dataset.sectorVariants) {
        setVariantRange(button.dataset.sectorKind,button.dataset.sectorVariants.split(','),button.dataset.sectorOn==='true');
        return;
      }
      setRange(button.dataset.sectorKind,Number(button.dataset.sectorStart),Number(button.dataset.sectorEnd),button.dataset.sectorOn==='true');
    });
  }
  app.fishEvents = { install, installSettings };
})(window);
