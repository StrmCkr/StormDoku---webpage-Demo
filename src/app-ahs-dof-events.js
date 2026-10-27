/* StormDoku AHS-DOF tool event wiring. */
(function(global){const app=global.StormDokuApp=global.StormDokuApp||{};app.ahsDofEvents={install(button,run){button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();run();});}};})(window);
