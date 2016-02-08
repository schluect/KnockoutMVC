komvc.ApplicationViewModelHolder = (function (ko) {
    var instance = null;
    var ApplicationViewModelHolder = function () { };
    ApplicationViewModelHolder.prototype.ApplicationState = ko.observable({
        View: null,
        Model: null
    });
    ApplicationViewModelHolder.prototype.UpdateApplicationState = function(view, model){
        if (typeof model.afterRender !== "function"){
            model.afterRender = function(){};
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