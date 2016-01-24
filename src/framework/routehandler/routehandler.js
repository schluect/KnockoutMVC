komvc.RouteHandler = (function(){
    var RouteHandler = function (controllerFactory) {
        this.ControllerFactory = controllerFactory;
    };
    RouteHandler.prototype.ControllerFactory = null;
    RouteHandler.prototype.ActivateController = function (controllerName) {
        this.ActiveController = this.ControllerFactory.GetController(controllerName + "controller");
        if (typeof this.ActiveController === "undefined") {
        }
    };
    RouteHandler.prototype.RunAction = function(controllerName, actionName, params, sammyContext){
        try{
            var controller = this.ControllerFactory.GetController(controllerName + "controller");
            if (typeof controller === "undefined") {
                return {
                    NotFound: true
                };
            }

            if (typeof controller[actionName] === "undefined") {
                return {
                    NotFound: true
                };
            }

            return controller[actionName](params, sammyContext);
        }catch (e){
            return {
                Error: e
            };
        }
    };
    return RouteHandler;
})();