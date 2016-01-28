var preLoadedControllers = {};
Controller = function(controllerName, controllerCallback){
    var action = function(actionName, methodType, actionCallback){
        if (typeof methodType === "function"){
            actionCallback = methodType;
            methodType = "get";
        }
        if(typeof preLoadedControllers[controllerName] === "undefined"){
            preLoadedControllers[controllerName] = {};
            preLoadedControllers[controllerName][methodType] = {};
            preLoadedControllers[controllerName][methodType][actionName] = actionCallback;
        } else {
            var currentController = preLoadedControllers[controllerName];
            if(typeof currentController[methodType] === "undefined") {
                currentController[methodType] = {};
            }
            if(typeof currentController[methodType][actionName] === "undefined"){
                currentController[methodType][actionName] = actionCallback;
            }
        }
    };
    controllerCallback(action);
};