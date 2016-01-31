komvc.InitializeResources = function(requestedResources){
    var resources = [];
    $.each(requestedResources, function(index, resourceKey){
        if (typeof komvc.config.Resources[resourceKey] === "undefined"){
            throw "Resource: " + resourceKey + " is missing.";
        }
        var resource = komvc.config.Resources[resourceKey];
        if (typeof resource === "function") {
            resources.push(new komvc.config.Resources[resourceKey]());
        } else {
            resources.push(resource);
        }
    });

    return resources;
};
komvc.RegisterService = function(serviceKey, service) {
    komvc.config.Resources[serviceKey] = service;
};
