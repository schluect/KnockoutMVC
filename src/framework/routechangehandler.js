komvc.RouteChangeHandler = (function (sammy) {
    var RouteChangeHandler = function (routeHandler) {
        this.RouteHandler = routeHandler;
    };
    RouteChangeHandler.prototype._SammyApp = null;
    RouteChangeHandler.prototype.RouteHandler = null;
    RouteChangeHandler.prototype.StartRouteChangeHandler = function () {
        var that = this;
        var app = sammy("#main", function () {
            this.get("#/:controller/:action", function (context) {
                var action = that.RouteHandler.GetAction(context.params.controller, context.params.action);
                if (typeof action === "undefined") {
                    context.notFound();
                }
                action(context.params);
            });
            this.get("#/:controller", function (context) {
                var action = that.RouteHandler.GetAction(context.params.controller, "index");
                if (typeof action === "undefined") {
                    context.notFound();
                }
                action(context.params);
            });
            this.get("#/", function (context) {
                var action = that.RouteHandler.GetAction("home", "index");
                if (typeof action === "undefined") {
                    context.notFound();
                }
                action(context.params);
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
})(komvc.sammy);