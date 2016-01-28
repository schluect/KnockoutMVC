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
            date:  ko.observable("2013-01-28"),
            WasPosted: false
        };
        return this.Get("test", model);
    });
    Action("Test2", "post", function index(params) {
        var model = {
            title: "Test2 PAGE",
            date:  ko.observable("2013-01-28"),
            WasPosted: true,
            PostedDate: params.Date
        };
        return this.Get("test", model);
    });
});