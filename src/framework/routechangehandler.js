komvc.RouteChangeHandler = (function (Sammy) {
    var RouteChangeHandler = function (routeHandler) {
        this.RouteHandler = routeHandler;
    };
    RouteChangeHandler.prototype._SammyApp = null;
    RouteChangeHandler.prototype.RouteHandler = null;
    RouteChangeHandler.prototype.HandleActionResult = function(result){
        if (result.NotFound) {
            context.notFound();//WHAT IS CONTEXT
        }
        if (result.Error) {
            context.error(result.Error);//WHAT IS CONTEXT
        }
    };
    RouteChangeHandler.prototype.StartRouteChangeHandler = function () {
        var that = this;
        var app = Sammy("#main", function () {///MOCK SAMMY NEEDED
            this.get("#/:controller/:action", function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, context.params.action));
            });
            this.get("#/:controller", function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, "index"));
            });
            this.get("#/", function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction("home", "index", context.params));
            });
        });
        app.run("#/");
        this._SammyApp = app;
        return this._SammyApp;
    };
    RouteChangeHandler.prototype.GetSammyApp = function () {
        return this._SammyApp;
    };
    return RouteChangeHandler;
})(komvc.Sammy);