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