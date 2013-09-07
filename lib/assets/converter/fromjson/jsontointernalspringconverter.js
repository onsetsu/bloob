Bloob.JsonToInternalSpringConverter = {};

Bloob.JsonToInternalSpringConverter.convertJsonToInternalSpring = function(springJson, bodyBluePrint) {
	bodyBluePrint.addInternalSpring(
		springJson.pointA,
		springJson.pointB,
		springJson.springK,
		springJson.damping
	);
};

//add convenient method
InternalSpring.fromJson = function(springJson, bodyBluePrint) {
	return Bloob.JsonToInternalSpringConverter.convertJsonToInternalSpring(springJson, bodyBluePrint);
};
