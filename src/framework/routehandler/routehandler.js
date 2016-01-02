komvc.RouteHandler = (function(){
    var RouteHandler = function (controllerFactory) {
        this.ControllerFactory = controllerFactory;
    };
    RouteHandler.prototype.ControllerFactory = null;
    RouteHandler.prototype.GetAction = function (controllerName, actionName) {
        var controller = this.ControllerFactory.GetController(controllerName + "controller");
        if (typeof controller === "undefined") {
            return null;
        }
        return controller[actionName];
    };
    return RouteHandler;
})();