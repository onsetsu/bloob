var BodyBuilder = {};

BodyBuilder.build = function(bodyDefinition) {
	var newBody = new bodyDefinition.targetClass(
		bodyDefinition.world,
		bodyDefinition.shape,
		bodyDefinition.pointMasses,
		bodyDefinition.translate,
		bodyDefinition.rotate,
		bodyDefinition.scale,
		bodyDefinition.isKinematic,
		bodyDefinition.edgeSpringK,
		bodyDefinition.edgeSpringDamp,
		bodyDefinition.shapeSpringK,
		bodyDefinition.shapeSpringDamp,
		bodyDefinition.gasPressure
	);

	for(var i = 0; i < bodyDefinition.internalSprings.length; i++)
		newBody.addInternalSpring.apply(newBody, bodyDefinition.internalSprings[i]);

	return newBody;
};