komvc.Run = (function($){
    var controllerFactory = null,
    routeHandler = null,
    routeChangeHandler = null;
    var run = function(config){
        config.selector = $("[data-komvc=true]");
        if (config.selector.length > 0){
            this.UseRequire = typeof config.UseRequire !== "undefined" && config.UseRequire;
            if (this.UseRequire){
                loadControllersThroughRequire(config.Controllers, init);
            } else{
                init(config);
            }
        }
    },
    loadControllersThroughRequire = function(controllerTypes, config, callback){
        if (typeof controllerTypes !== "undefined" && Array.isArray(controllerTypes)){
            require(controllerTypes, function () {
                config.Controllers = arguments;
                callback(config)
            });
        }
    },
    init = function(config){
        controllerFactory = new komvc.ControllerFactory();
        $.each(config.Controllers, function (i, c) {
            controllerFactory.CreateController(c.name, c.actions);
        });
        routeHandler = new komvc.RouteHandler(controllerFactory);
        routeChangeHandler = new komvc.RouteChangeHandler(routeHandler);
        routeChangeHandler.StartRouteChangeHandler(config.CustomRoutes);
        $(function () {
            $(config.selector[0]).attr('data-bind="template: { name: View, data: Model }"');
            ko.applyBindings(komvc.ApplicationViewModelHolder(), config.selector[0]);
        })
    };
    return run;
})(komvc.$);