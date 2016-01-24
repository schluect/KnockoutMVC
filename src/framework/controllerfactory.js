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
        controller.Name = name.toLowerCase();
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