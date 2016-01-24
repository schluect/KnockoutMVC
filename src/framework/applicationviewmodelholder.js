komvc.ApplicationViewModelHolder = (function (ko) {
    var instance = null;
    var ApplicationViewModelHolder = function () { };
    ApplicationViewModelHolder.prototype.View = ko.observable(null);
    ApplicationViewModelHolder.prototype.Model = ko.observable(null);
    ApplicationViewModelHolder.prototype.IsViewSet =  function(){
       return  typeof this.View() !== "undefined";
    };
    return function getInstance() {
        instance = instance || new ApplicationViewModelHolder();
        return instance;
    };
})(komvc.ko);