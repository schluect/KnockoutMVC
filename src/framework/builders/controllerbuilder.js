var preLoadedControllers = {};
Controller = function(controllerName, requestedResources, controllerCallback, beforeActionRun, afterActionRun){
    var resources = [],
        self = this,
        createActionCallback = function(action, beforeAction, afterAction){
            if (typeof action === "function"
                && (typeof beforeAction === "undefined" || typeof beforeAction === "function")
                && (typeof afterAction === "undefined" || typeof afterAction === "function")) {
                return function (params, context) {
                    var a = action, ba = beforeAction, aa = afterAction;
                    if (typeof ba === "function") {
                        ba();
                    }

                    a.apply(this, [params, context]);

                    if (typeof aa === "function") {
                        aa();
                    }
                };
            }

            throw "Invalid parameters";
        };
    if (typeof requestedResources  === "function"){
        afterActionRun = beforeActionRun;
        beforeActionRun = controllerCallback;
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
            preLoadedControllers[controllerName][methodType][actionName] = createActionCallback(actionCallback, beforeActionRun, afterActionRun);
        } else {
            var currentController = preLoadedControllers[controllerName];
            if(typeof currentController[methodType] === "undefined") {
                currentController[methodType] = {};
            }
            if(typeof currentController[methodType][actionName] === "undefined"){
                currentController[methodType][actionName] = createActionCallback(actionCallback, beforeActionRun, afterActionRun);
            }
        }
    };


    controllerCallback.apply(self, resources);

};