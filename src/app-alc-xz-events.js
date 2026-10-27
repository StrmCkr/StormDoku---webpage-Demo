/* StormDoku ALC-XZ tool event wiring. */
(function(global){const app=global.StormDokuApp=global.StormDokuApp||{};app.alcXzEvents={install(button,run){button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();run();});}};})(window);
