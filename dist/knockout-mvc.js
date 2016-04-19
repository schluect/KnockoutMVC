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
    "DefaultRoutes":["#/","#/:controller","#/:controller/:action"],
    "Resources": {}
};
var controllerFactory,
    routeHandler,
    routeChangeHandler;

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
                $.ajax(path).then(function(html) {
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
komvc.InitializeResources = function(requestedResources){
    var resources = [];
    $.each(requestedResources, function(index, resourceKey){
        if (typeof komvc.config.Resources[resourceKey] === "undefined"){
            throw "Resource: " + resourceKey + " is missing.";
        }
        var resource = komvc.config.Resources[resourceKey];
        if (typeof resource === "function") {
            resources.push(new komvc.config.Resources[resourceKey]());
        } else {
            resources.push(resource);
        }
    });

    return resources;
};
komvc.RegisterService = function(serviceKey, service) {
    komvc.config.Resources[serviceKey] = service;
};

komvc.ApplicationViewModelHolder = (function (ko) {
    var instance = null;
    var ApplicationViewModelHolder = function () { };
    ApplicationViewModelHolder.prototype.ApplicationState = ko.observable({
        View: null,
        Model: null
    });
    ApplicationViewModelHolder.prototype.AddGlobalProperty = function(key, value){
        if (typeof key === "undefined" && typeof value === "undefined"){
            throw "value must be defined and not null";
        }else{
            if(typeof this[key] === "undefined") {
                this[key] = ko.observable(value);
            }else{
                this[key](value);
            }
        }
    };
    ApplicationViewModelHolder.prototype.AddGlobalFunction = function(key, func){
        if (typeof key === "undefined" && typeof func !== "function"){
            throw "func must be a function";
        }else{
            this[key] = func;
        }
    };
    ApplicationViewModelHolder.prototype.UpdateApplicationState = function(view, model){
        if (typeof model.afterRender !== "function"){
            model.afterRender = function(){};
        }

        if (typeof model.afterAdd !== "function"){
            model.afterAdd = function(){};
        }

        if (typeof model.beforeRemove !== "function"){
            model.beforeRemove = function(){};
        }

        this.ApplicationState({
            View: view,
            Model: model
        });
    };
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
        this[name.toLowerCase()] = action;
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
    ControllerFactory.prototype.CreateController = function (name, actions, methodType) {
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
        controller.Name = name.toLowerCase();
        komvc.utils.forEach(actions, function(key, prop){
            controller.addAction(key, prop);
        });

        var type = this.CreateControllerTypeKey(name, methodType);
        this.Controllers[type] = controller;
    };
    ControllerFactory.prototype.GetController = function (name, methodType) {
        var type = this.CreateControllerTypeKey(name, methodType);
        if (typeof this.Controllers[type] !== "undefined") {
            return this.Controllers[type];
        }

        return null;
    };
    ControllerFactory.prototype.CreateControllerTypeKey = function (controllerName, methodType) {
        return (controllerName+"controller_"+methodType).toLowerCase();
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
                    if (href&&href.indexOf("#") === 0) {
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
komvc.Run = (function($){
    var defaultAppSelector = '#komvccontainer';
    var run = function(config){
        $.extend(komvc.config, config);
        komvc.config.AppContainer =  $(komvc.config.AppSelector);
        if (komvc.config.AppContainer.length === 0) {
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
                callback(config);
            });
        }
    },
    processPreloadedControllers = function(){
      if (typeof preLoadedControllers === "object"){
          for(var key in preLoadedControllers){
              var methodTypes = preLoadedControllers[key];
              for(var methodType in methodTypes) {
                  var actions = methodTypes[methodType];
                  controllerFactory.CreateController(key, actions, methodType);
              }
          }
      }
    },
    init = function(config){
        controllerFactory = new komvc.ControllerFactory();
        processPreloadedControllers();
        routeHandler = new komvc.RouteHandler(controllerFactory);
        routeChangeHandler = new komvc.RouteChangeHandler(routeHandler);
        routeChangeHandler.StartRouteChangeHandler(komvc.config.CustomRoutes);
        $(function () {
            komvc.config.AppContainer.append("<!-- ko with: ApplicationState --><!-- ko if: View !== null --><!-- ko template: { name: View, data: Model, afterRender: Model.afterRender, afterAdd: Model.afterAdd, beforeRemove: Model.beforeRemove } --><!-- /ko --><!-- /ko --><!-- /ko -->");
            ko.applyBindings(komvc.ApplicationViewModelHolder(), komvc.config.AppContainer[0]);
        });
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
        this.ActiveController = this.ControllerFactory.GetController(controllerName);
        if (typeof this.ActiveController === "undefined") {
        }
    };
    RouteHandler.prototype.RunAction = function(controllerName, actionName, params, sammyContext){
        try{
            var controller = this.ControllerFactory.GetController(controllerName, sammyContext.verb);
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
komvc.ActionResult = (function (ApplicationViewModelHolder, $) {
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
            ApplicationViewModelHolder().UpdateApplicationState(that.View, that.Model);
        });
    };
    return ActionResult;
})(komvc.ApplicationViewModelHolder, komvc.$);
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
    return komvc;
}));