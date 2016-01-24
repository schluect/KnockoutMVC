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