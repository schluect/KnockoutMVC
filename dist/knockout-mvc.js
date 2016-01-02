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
komvc.sammy = sammy;
komvc.$ = jQuery;
komvc.JSON = JSON;
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
    };;
})(komvc.ko);
komvc.BaseController = (function (ApplicationViewModelHolder) {
    var BaseController = function (processor) {
        this.base = this;
    };
    BaseController.prototype.base = null;
    BaseController.prototype.dataProcessor = null;
    BaseController.Get = function (view, model) {
        ApplicationViewModelHolder().View(view);
        ApplicationViewModelHolder().Model(model);
    };
    BaseController.Post = function () {

    };
    BaseController.Put = function () {

    };
    BaseController.Delete = function () {

    };
    BaseController.prototype.addAction = function(name, action){
        this[name] = action;
    };
    return BaseController;
})(komvc.ApplicationViewModelHolder);
komvc.ControllerFactory = (function (BaseController) {
    var ControllerFactory = function () {
        this.Controllers[this._BaseControllerKey] = BaseController;
    };
    ControllerFactory.prototype._BaseControllerKey = "##BASE##";
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
        var controller = new komvc.BaseController();
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
})(komvc.BaseController);
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
komvc.ActionResult = (function () {
    var ActionResult = function () {

    };
    ActionResult.prototype.Action;
    ActionResult.prototype.RunAction = function (params) {

    };
    return ActionResult;
})();
    return komvc;
}));