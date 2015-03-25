define([

], function() {
    var serviceLocatorFactory = function() {
        var storage = {},
            locator = (function serviceLocator(key, newService) {
                if(arguments.length > 1) {
                    this[key] = newService;
                }
                var service = this[key];
                if(typeof service === "undefined") {
                    throw "no service for " + key;
                }
                return service;
           }).bind(storage);
        return locator;
    };

	var Environment = function() {};
	
	return Environment;
});
