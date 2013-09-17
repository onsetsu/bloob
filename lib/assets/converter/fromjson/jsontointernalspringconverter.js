mini.Module(
		"assets/converter/fromjson/jsontointernalspringconverter"
)
.requires(
		"assets/converter/fromjson/jsontovector2converter"
)
.defines(function() {
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
		return Bloob.JsonToInternalSpringConverter.convertJsonToInternalSpring(springJson, bodyBluePrint);
	};

	Bloob.JsonToInternalSpringConverter = JsonToInternalSpringConverter;
	
	return JsonToInternalSpringConverter;
});
