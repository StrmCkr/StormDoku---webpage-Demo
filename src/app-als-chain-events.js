/* StormDoku ALS Chain tool event wiring. */
(function(global){const app=global.StormDokuApp=global.StormDokuApp||{};app.alsChainEvents={install(button,run){button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();run();});}};})(window);
