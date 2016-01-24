Controller("Test", function(Action){
    Action("Index", function index() {
        var model = {
            title: "Test PAGE"
        };
        return this.Get("index", model);
    });
    Action("Test2", function index() {
        var model = {
            title: "Test2 PAGE",
            date: new Date().toUTCString()
        };
        return this.Get("test", model);
    });
});