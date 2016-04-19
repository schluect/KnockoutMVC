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