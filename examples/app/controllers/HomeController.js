Controller("Home", function(){
    Action("Index", function index(params, context) {
        var model = {
            title: "HOME PAGE"
        };

        context.app.setLocation('#/home/hometest');

        //return this.Get("index", model);
    });
    Action("HomeTest", function index() {
        var model = {
            title: "HomeTest PAGE"
        };
        return this.Get("hometest", model);
    });
});