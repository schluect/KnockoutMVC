komvc.RouteChangeHandler = (function (Sammy) {
    var defaultRoutes = [];
    var RouteChangeHandler = function (routeHandler) {
        var that = this;
        this.RouteHandler = routeHandler;
        defaultRoutes = [
            ['get','#/:controller/:action', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, context.params.action, context.params, context));
            }],
            ['get','#/:controller', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, "index", context.params, context));
            }],
            ['get','#/', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction("home", "index", context.params, context));
            }],
            ['post','#/:controller/:action', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, context.params.action, context.params, context));
            }],
            ['post','#/:controller', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, "index", context.params, context));
            }],
            ['post','#/', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction("home", "index", context.params, context));
            }]
        ];
    };
    RouteChangeHandler.prototype._SammyApp = null;
    RouteChangeHandler.prototype.RouteHandler = null;
    RouteChangeHandler.prototype.HandleActionResult = function(result){
        if (typeof result !== "undefined") {
            if (result.NotFound) {
                this._SammyApp.notFound();//WHAT IS CONTEXT
            }
            if (result.Error) {
                this._SammyApp.error(result.Error);//WHAT IS CONTEXT
            }
        }
    };
    RouteChangeHandler.prototype.StartRouteChangeHandler = function (customRoutes) {
        var routes =  defaultRoutes;
        if (typeof customRoutes !== 'undefined' && Array.isArray(customRoutes)){
           var additionalRoutes = $.map(customRoutes, function(route){
                if(this.ValidateCustomRoute(route)){
                    return route;
                }
            });
            $.merge(routes, additionalRoutes);
        }

        var app = Sammy(komvc.config.AppSelector, function () {
            this.mapRoutes(routes);
            this.bind('run', function(e) {
                var ctx = this;
                $('body').on('click', 'a', function(e) {
                    var href = $(e.target).attr('href');
                    if (href.indexOf("#") === 0) {
                        e.preventDefault();
                        ctx.redirect($(e.target).attr('href'));
                        return false;
                    }
                });
            });
        });
        app.run("#/");
        this._SammyApp = app;
        return this._SammyApp;
    };
    RouteChangeHandler.prototype.GetSammyApp = function () {
        return this._SammyApp;
    };
    RouteChangeHandler.prototype.ValidateCustomRoute = function(routeInfo){
        if (Array.isArray(routeInfo)) {
            var length = routeInfo.length;
            if (length === 2){
                return this.ValidateCustomRouteWithoutVerb(routeInfo);
            } else if (length === 3){
                return this.ValidateCustomRouteWithoutVerb(routeInfo);
            }
        }
        return false;
    };
    RouteChangeHandler.prototype.ValidateCustomRouteWithVerb = function(verb, route, callback){
        if (typeof verb === "string" && komvc.config.SammyVerbs.indexOf(verb) !== -1){
            return this.ValidateCustomRouteWithoutVerb(route, callback);
        }

        return false;
    };
    RouteChangeHandler.prototype.ValidateCustomRouteWithoutVerb = function(route, callback){
        return typeof route === "string" && typeof callback === "function" && komvc.config.DefaultRoutes.indexOf(route) == -1;
    };
    return RouteChangeHandler;
})(komvc.Sammy);