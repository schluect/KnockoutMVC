komvc.Run = (function($){
    var defaultAppSelector = '[data-komvc=true]';
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
    processPreloadedControllers = function(){
      if (typeof preLoadedControllers === "object"){
          for(var key in preLoadedControllers){
              var actions = preLoadedControllers[key];
              controllerFactory.CreateController(key, actions);
          }
      }
    },
    handleAnchorClick = function(){
        $("body").on("a[href^='#']", "click", function(){
           var app = routeChangeHandler.GetSammyApp();
            debugger;
        });
    },
    init = function(config){
        controllerFactory = new komvc.ControllerFactory();
        processPreloadedControllers();
        routeHandler = new komvc.RouteHandler(controllerFactory);
        routeChangeHandler = new komvc.RouteChangeHandler(routeHandler);
        routeChangeHandler.StartRouteChangeHandler(komvc.config.CustomRoutes);
        $(function () {
            handleAnchorClick();
            komvc.config.AppContainer.append("<!-- ko if: View() !== null --><!-- ko template: { name: View, data: Model } --><!-- /ko --><!-- /ko -->");
            ko.applyBindings(komvc.ApplicationViewModelHolder(), komvc.config.AppContainer[0]);
        })
    };
    komvc.config.AppSelector = defaultAppSelector;
    return run;
})(komvc.$);