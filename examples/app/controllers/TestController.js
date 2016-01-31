Controller("Test",["DateService", "DateServiceFactory"], function(DateService, DateServiceFactory){
    Action("Index", function index() {
        var model = {
            title: "Test PAGE"
        };
        return this.Get("index", model);
    });
    Action("Test2", function index() {
        var ds = DateServiceFactory.GetDateService();
        var model = {
            title: "Test2 PAGE",
            date:  ko.observable(ds.GetTestDate()),
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