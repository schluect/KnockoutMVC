var HomeController = function () {
    return {
        name : "home",
        actions: {
            index: function index() {
                var model = {
                    title: "HOME PAGE"
                };
                return this.Get("index", model);
            }
        }
    };
}