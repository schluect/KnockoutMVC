Controller("Home", function(){
    Action("Index", function index(params, context) {
        var model = {
            title: "HOME PAGE"
        };

        context.app.setLocation('#/home/hometest');

        //return this.Get("index", model);
    });
    Action("HomeTest", function index() {
        var model = (function(){
            var self = this;
            var model = function(){}
            model.prototype.title = ko.observable("HomeTest PAGE");
            model.prototype.afterRender = function(elements, model){
                model.title("HomeTest PAGE - Modified afterRender")
            };

            return model;
        })();
        var newModel = new model();
        return this.Get("hometest", newModel);
    });
});