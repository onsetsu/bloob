define([
	"physics/jello"
], function(Jello) {
	var JsonToInternalSpringConverter = {};

	JsonToInternalSpringConverter.convertJsonToInternalSpring = function(springJson, bodyBluePrint) {
		bodyBluePrint.addInternalSpring(
			springJson.pointA,
			springJson.pointB,
			springJson.springK,
			springJson.damping
		);
	};

	//add convenient method
	Jello.InternalSpring.fromJson = function(springJson, bodyBluePrint) {
		return JsonToInternalSpringConverter.convertJsonToInternalSpring(springJson, bodyBluePrint);
	};
	
	return JsonToInternalSpringConverter;
});
