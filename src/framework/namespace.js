var komvc =  komvc || {};
komvc.ko = ko;
komvc.Sammy = Sammy;
komvc.$ = jQuery;
komvc.JSON = JSON;
komvc.config = {
    "ViewsLocation": "/app",
    "AppSelector": null,
    "UseRequire": false,
    "CustomRoutes": null,
    "SammyVerbs":["get", "post", "put", "delete"],
    "DefaultRoutes":["#/","#/:controller","#/:controller/:action"]
};