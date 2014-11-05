define(function(require) {
    var Body = require('./body');

	var BodyBuilder = {
        build: function(bodyDefinition) {
            return new Body(bodyDefinition);
        }
	};

	return BodyBuilder;
});
