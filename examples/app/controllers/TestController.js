Controller("Test",["DateService"], function(DateService){
    Action("Index", function index() {
        var model = {
            title: "Test PAGE"
        };
        return this.Get("index", model);
    });
    Action("Test2", function index() {
        var model = {
            title: "Test2 PAGE",
            date:  ko.observable(DateService.GetTestDate()),
            WasPosted: false
        };
        return this.Get("test", model);
    });
    Action("Test2", "post", function index(params) {
        var model = {
            title: "Test2 PAGE",
            date:  ko.observable(DateService.GetTestDate()),
            WasPosted: true,
            PostedDate: params.Date
        };
        return this.Get("test", model);
    });
});