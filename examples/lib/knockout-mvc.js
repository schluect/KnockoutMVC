(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['jquery','knockout','sammy'], factory);
  } else {
    // Browser globals.
    root.komvc = factory(root.$,root.ko,root.sammy);
  }
}(this, function($,ko,sammy) {
var komvc =  komvc || {};
komvc.ko = ko;
komvc.Sammy = Sammy;
komvc.$ = jQuery;
komvc.JSON = JSON;
komvc.config = {
    "ViewsLocation": "/app",
    "AppSelector": null,
    "UseRequire": false,
    "CustomRoutes": null,
    "SammyVerbs":["get", "post", "put", "delete"],
    "DefaultRoutes":["#/","#/:controller","#/:controller/:action"]
};
komvc.utils = (function ($) {
    return {
        extend: function (base, sub) {
            var origProto = sub.prototype;
            sub.prototype = Object.create(base.prototype);
            for (var key in origProto) {
                sub.prototype[key] = origProto[key];
            }
            sub.prototype.constructor = sub;
            Object.defineProperty(sub.prototype, 'constructor', {
                enumerable: false,
                value: sub
            });
        },
        createTemplate: function (templateId, html) {
            if ($("#" + templateId).length === 0) {
                var template = $("<script>");
                template.attr("id", templateId);
                template.attr("type", "script/html");
                template.html(html);
                $("body").append(template);
            }
        },
        loadTemplate: function (templateId, path, callback) {
            if ($("#" + templateId).length === 0) {
                $.ajax(path, function(html) {
                    var template = $("<script>");
                    template.attr("id", templateId);
                    template.attr("type", "script/html");
                    template.html(html);
                    $("body").append(template);
                    callback();
                });
            } else {
                callback();
            }
        },
        forEach: function(object, callback){
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var prop = object[key];
                    callback(key, prop);
                }
            }
        }
    };
})(komvc.$);
komvc.ApplicationViewModelHolder = (function (ko) {
    var instance = null;
    var ApplicationViewModelHolder = function () { };
    ApplicationViewModelHolder.prototype.View = ko.observable(null);
    ApplicationViewModelHolder.prototype.Model = ko.observable(null);
    return function getInstance() {
        instance = instance || new ApplicationViewModelHolder();
        return instance;
    };
})(komvc.ko);
komvc.Controller = (function () {
    var Controller = function () {};
    Controller.prototype.Get = function (param1,param2) {
        var view = null,
            model = null;
        if(typeof param1 === "string"){//is view
            view = param1.toString();
            model = param2;
        } else if(typeof param1 === "object"){
           model = param1.model;
            view = param1.view;
        }
        var actionResult = new komvc.ActionResult(this.Name, view, model);
        actionResult.Process();
    };
    Controller.prototype.Post = function () {

    };
    Controller.prototype.Put = function () {

    };
    Controller.prototype.Delete = function () {

    };
    Controller.prototype.Name ="";
    Controller.prototype.addAction = function(name, action){
        this[name] = action;
    };
    return Controller;
})();
komvc.ControllerFactory = (function () {
    var ControllerFactory = function () {
    };
    ControllerFactory.prototype.Controllers = {};
    ControllerFactory.prototype.AddController = function (type, controller) {
        if (typeof controller === "undefined") {
            throw "controller is required";
        }
        type = type.toLowerCase();

        this.Controllers[type] = controller;
    };
    ControllerFactory.prototype.CreateController = function (name, actions) {
        if (typeof name === "undefined") {
            throw "name is required";
        }

        if (typeof actions === "undefined") {
            actions = {
                index: function () {
                    this.Get(controller.name+"_index");
                }
            };
        }
        var controller = new komvc.Controller();
        controller.Name = name;
        komvc.utils.forEach(actions, function(key, prop){
            controller.addAction(key, prop);
        });

        var type = (name+"controller").toLowerCase();
        this.Controllers[type] = controller;
    };
    ControllerFactory.prototype.GetController = function (type) {
        type = type.toLowerCase();
        if (typeof this.Controllers[type] !== "undefined") {
            return this.Controllers[type];
        }

        return null;
    };
    return ControllerFactory;
})();
komvc.RouteChangeHandler = (function (Sammy) {
    var defaultRoutes = [];
    var RouteChangeHandler = function (routeHandler) {
        var that = this;
        this.RouteHandler = routeHandler;
        defaultRoutes = [
            ['get','#/:controller/:action', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, context.params.action, context.params));
            }],
            ['get','#/:controller', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction(context.params.controller, "index", context.params));
            }],
            ['get','#/', function (context) {
                that.HandleActionResult(that.RouteHandler.RunAction("home", "index", context.params));
            }]
        ];
    };
    RouteChangeHandler.prototype._SammyApp = null;
    RouteChangeHandler.prototype.RouteHandler = null;
    RouteChangeHandler.prototype.HandleActionResult = function(result){
        debugger;
        if (typeof result !== "undefined") {
            if (result.NotFound) {
                context.notFound();//WHAT IS CONTEXT
            }
            if (result.Error) {
                context.error(result.Error);//WHAT IS CONTEXT
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

        var app = Sammy("#main", function () {
            this.mapRoutes(routes);
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
        return typeof route === "string" && typeof callback === "function"
            && komvc.config.DefaultRoutes.indexOf(route) == -1;
    };
    return RouteChangeHandler;
})(komvc.Sammy);
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
    RouteHandler.prototype.RunAction = function(controllerName, actionName, params){
        try{
            var controller = this.ControllerFactory.GetController(controllerName + "controller");
            if (typeof controller === "undefined") {
                return {
                    Test: true
                };
            }

            if (typeof controller[actionName] === "undefined") {
                return {
                    test2: true
                };
            }

            controller[actionName](params);
        }catch (e){
            return {
                Error: e
            };
        }
    };
    return RouteHandler;
})();
komvc.ActionResult = (function (ApplicationViewModelHolder) {
    var ActionResult = function (controller, view, model) {
        this.ProcessView(view, controller);
        this.Model = model;
    };
    ActionResult.prototype.ViewKey = null;
    ActionResult.prototype.View = null;
    ActionResult.prototype.Model = null;
    ActionResult.prototype.ViewPath = null;
    ActionResult.prototype.ProcessView = function(view, controller){
        if(view !== null){
            var splitView = view.split("/");
            if(splitView.length > 1){
                this.ViewPath = view;
                this.View = splitView[splitView.length -1];
            } else {
                this.View = view;
                this.ViewPath = "/views/"+controller+"/"+this.View;
            }

            if (this.ViewPath.indexOf(".html")<0){
                this.ViewPath += ".html";
            }

            this.ViewPath = komvc.config.ViewsLocation + this.ViewPath;
            this.View = controller + "_"+this.View;
        }
    };
    ActionResult.prototype.Process = function(){
        var that = this;
        komvc.utils.loadTemplate(this.View, this.ViewPath,function(){
            ApplicationViewModelHolder().View(that.View);
            ApplicationViewModelHolder().Model(that.Model);
        });
    };
    return ActionResult;
})(komvc.ApplicationViewModelHolder);
    return komvc;
}));