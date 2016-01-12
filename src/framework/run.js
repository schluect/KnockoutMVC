komvc.Run = (function($){
    var controllerFactory = null,
    routeHandler = null,
    routeChangeHandler = null,
    defaultAppSelector = '[data-komvc=true]';
    var run = function(config){
        $.extend(komvc.config, config);
        komvc.config.AppContainer =  $(komvc.config.AppSelector);
        if (komvc.config.AppContainer.length == 0) {
            $('body').attr('data-komvc',true);
            komvc.config.AppSelector = defaultAppSelector;
            komvc.config.AppContainer =  $(komvc.config.AppSelector);
        }

        if (komvc.config.AppContainer.length !== 1) {
            throw "Only one App Container allowed";
        }

        if (komvc.config.UseRequire){
            loadControllersThroughRequire(config.Controllers, init);
        } else{
            init(config);
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
        routeChangeHandler.StartRouteChangeHandler(komvc.config.CustomRoutes);
        $(function () {
            komvc.config.AppContainer.attr("data-bind","template: { name: View, data: Model }");
            ko.applyBindings(komvc.ApplicationViewModelHolder(), komvc.config.AppContainer[0]);
        })
    };
    komvc.config.AppSelector = defaultAppSelector;
    return run;
})(komvc.$);