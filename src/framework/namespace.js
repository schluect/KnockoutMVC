var komvc =  komvc || {};
komvc.ko = ko;
komvc.Sammy = Sammy;
komvc.$ = jQuery;
komvc.JSON = JSON;
komvc.config = {
    "ViewsLocation": "/app",
    "AppSelector": null,
    "UseRequire": false,
    "CustomRoutes": null,
    "SammyVerbs":["get", "post", "put", "delete"],
    "DefaultRoutes":["#/","#/:controller","#/:controller/:action"]
};
var controllerFactory,
    routeHandler,
    routeChangeHandler,
    preLoadedControllers = {};
Controller = function(controllerName, controllerCallback){
    var action = function(actionName, actionCallback){
        if(typeof preLoadedControllers[controllerName] === "undefined"){
            preLoadedControllers[controllerName] = {};
            preLoadedControllers[controllerName][actionName] = actionCallback;
        } else {
            var currentController = preLoadedControllers[controllerName];
            if(typeof currentController[actionName] === "undefined"){
                currentController[action] = actionCallback;
            }
        }
    };
    controllerCallback(action);
};