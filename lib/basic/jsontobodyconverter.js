Bloob.JsonToBodyConverter = {};

Bloob.JsonToBodyConverter.convertJsonToBody = function(bodyJson, world) {
	// read bluePrint
	var bluePrint = Bloob.BodyFactory.createBluePrint(window[bodyJson.class] || Body);

	if(typeof bodyJson.shape !== "undefined")
		bluePrint.shape(Bloob.Converter.readShape(bodyJson.shape));

	Bloob.JsonToBodyConverter.readBodyParameters(bluePrint, bodyJson);
	
	var body = bluePrint
		.world(world)
		.build();

	return body;
};

Bloob.JsonToBodyConverter.readBodyParameters = function(bluePrint, jsonWithParameters) {
	var parameterNames = [
       "pointMasses",
       "translate",
       "rotate",
       "scale",
       "isKinematic",
       "edgeSpringK",
       "edgeSpringDamp",
       "shapeSpringK",
       "shapeSpringDamp",
       "gasPressure",
       "internalSprings"
	];
	
	// iterate all possible parameter names
	for(var index in parameterNames) {
		var parameterName = parameterNames[index];
		
		// if parameter is defined in json...
		if(typeof jsonWithParameters[parameterName] !== "undefined") {
			// annotate blueprint
			if(parameterName == "translate" || parameterName == "scale") {
				// need to convert into Vector2
				var parameterValue = Bloob.Converter.readVector2(jsonWithParameters[parameterName]);
				bluePrint[parameterName](parameterValue);
			}
			else if(parameterName == "internalSprings") {
				// iterate over internalSprings array; attach each spring to bluePrint
				for(var index in jsonWithParameters["internalSprings"]) {
					var springParameters = jsonWithParameters["internalSprings"][index];
					bluePrint.addInternalSpring(
						springParameters.pointA,
						springParameters.pointB,
						springParameters.springK,
						springParameters.springDamping
					);
				};
			}
			else
			{
				var parameterValue = jsonWithParameters[parameterName];
				bluePrint[parameterName](parameterValue);
			}
		};
	};
};
