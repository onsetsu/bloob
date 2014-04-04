define([

], function() {
	var BodyBuilder = {};

	BodyBuilder.build = function(bodyDefinition) {
		return new bodyDefinition.targetClass(bodyDefinition);
	};

	return BodyBuilder;
});
