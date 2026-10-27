/* StormDoku ALS-XY tool event wiring. */
(function(global){const app=global.StormDokuApp=global.StormDokuApp||{};app.alsXyEvents={install(button,run){button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();run();});}};})(window);
