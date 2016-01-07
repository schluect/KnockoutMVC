komvc.ActionResult = (function (ApplicationViewModelHolder) {
    var ActionResult = function (controller, view, model) {
        this.ProcessView(view, controller);
        this.Model = model;
    };
    ActionResult.prototype.ViewKey = null;
    ActionResult.prototype.View = null;
    ActionResult.prototype.Model = null;
    ActionResult.prototype.ViewPath = null;
    ActionResult.prototype.ProcessView = function(view, controller){
        if(view !== null){
            var splitView = view.split("/");
            if(splitView.length > 1){
                this.ViewPath = view;
                this.View = splitView[splitView.length -1];
            } else {
                this.View = view;
                this.ViewPath = "/views/"+controller+"/"+this.View;
            }

            if (this.ViewPath.indexOf(".html")<0){
                this.ViewPath += ".html";
            }

            this.View = controller + "_"+this.View;
        }
    };
    ActionResult.prototype.Process = function(){
        komvc.utils.loadTemplate(this.View, this.ViewPath,function(){
            ApplicationViewModelHolder().View(this.View);
            ApplicationViewModelHolder().Model(this.Model);
        });
    };
    return ActionResult;
})(komvc.ApplicationViewModelHolder);