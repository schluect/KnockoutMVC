var preLoadedControllers = {};
Controller = function(controllerName, requestedResources, controllerCallback){
    var resources = [],
        self = this;
    if (typeof requestedResources  === "function"){
        controllerCallback = requestedResources;
        requestedResources = null;
    } else {
        resources = komvc.InitializeResources(requestedResources);
    }
    self.Action = function(actionName, methodType, actionCallback){
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
    controllerCallback.apply(self, resources);
};