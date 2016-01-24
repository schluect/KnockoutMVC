ko.components.register("komvccontainer", {
    template: "{{view}}",
    viewModel: function(params) {
        this.View = komvc.ApplicationViewModelHolder().View;
        this.Model = komvc.ApplicationViewModelHolder().Model;
    }
});