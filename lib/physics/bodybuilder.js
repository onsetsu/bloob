var BodyBuilder = {};

BodyBuilder.build = function(bodyDefinition) {
	var newBody = new bodyDefinition.targetClass(bodyDefinition);

	for(var i = 0; i < bodyDefinition.internalSprings.length; i++)
		newBody.addInternalSpring.apply(newBody, bodyDefinition.internalSprings[i]);

	return newBody;
};