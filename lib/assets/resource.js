define(function(require) {
	var Loader = require('./loader');

	var Resource = mini.Class.subclass({
		initialize: function() {
			Loader.addResource(this);
		},
		load: function(callback) {
			
		}
	});
	
	return Resource;
});
