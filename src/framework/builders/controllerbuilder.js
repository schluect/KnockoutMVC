var preLoadedControllers = {};
Controller = function(controllerName, controllerCallback){
    var action = function(actionName, actionCallback){
        if(typeof preLoadedControllers[controllerName] === "undefined"){
            preLoadedControllers[controllerName] = {};
            preLoadedControllers[controllerName][actionName] = actionCallback;
        } else {
            var currentController = preLoadedControllers[controllerName];
            if(typeof currentController[actionName] === "undefined"){
                currentController[actionName] = actionCallback;
            }
        }
    };
    controllerCallback(action);
};