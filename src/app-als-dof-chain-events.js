/* StormDoku ALS-DOF Chain tool event wiring. */
(function(global){const app=global.StormDokuApp=global.StormDokuApp||{};app.alsDofChainEvents={install(button,run){button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();run();});}};})(window);
