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