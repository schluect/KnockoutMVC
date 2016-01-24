ko.components.register("komvccontainer", {
    template: "<!-- ko if: View() !== null --><!-- ko template: { name: View, data: Model } --><!-- /ko --><!-- /ko -->",
    viewModel: function(params) {
        this.View = komvc.ApplicationViewModelHolder().View;
        this.Model = komvc.ApplicationViewModelHolder().Model;
    }
});