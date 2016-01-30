komvc.InitializeResources = function(requestedResources){
    var resources = [];
    $.each(requestedResources, function(index, resourceKey){
        if (typeof komvc.config.Resources[resourceKey] === "undefined"){
            throw "Resource: " + resourceKey + " is missing.";
        }
        resources.push(new komvc.config.Resources[resourceKey]());
    });

    return resources;
};
komvc.RegisterService = function(serviceKey, service) {
    komvc.config.Resources[serviceKey] = service;
};
