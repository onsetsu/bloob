mini.Module(
	"assets/converter/fromjson/jsontobodyconverter"
)
.requires(
	"assets/converter/fromjson/jsontoclosedshapeconverter",
	"assets/converter/fromjson/jsontointernalspringconverter"
)
.defines(function(JsonToClosedShapeConverter, JsonToInternalSpringConverter) {
	var JsonToBodyConverter = {};

	JsonToBodyConverter.convertJsonToBody = function(bodyJson, world) {
		// read bluePrint
		var bluePrint = Jello.BodyFactory.createBluePrint(Jello[bodyJson.class] || Jello.Body);

		if(typeof bodyJson.shape !== "undefined")
			bluePrint.shape(Jello.ClosedShape.fromJson(bodyJson.shape));

		JsonToBodyConverter.readBodyParameters(bluePrint, bodyJson);
		
		var body = bluePrint
			.world(world)
			.build();

		return body;
	};

	JsonToBodyConverter.readBodyParameters = function(bluePrint, jsonWithParameters) {
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
			if(!parameterNames.hasOwnProperty(index)) continue;

			var parameterName = parameterNames[index];
			
			// if parameter is defined in json...
			if(typeof jsonWithParameters[parameterName] !== "undefined") {
				// annotate blueprint
				if(parameterName == "translate" || parameterName == "scale") {
					// need to convert into Jello.Vector2
					var parameterValue = Jello.Vector2.fromJson(jsonWithParameters[parameterName]);
					bluePrint[parameterName](parameterValue);
				}
				else if(parameterName == "internalSprings") {
					// iterate over internalSprings array; attach each spring to bluePrint
					for(var index in jsonWithParameters["internalSprings"]) {
						if(!jsonWithParameters["internalSprings"].hasOwnProperty(index)) continue;
						var springParameters = jsonWithParameters["internalSprings"][index];
						Jello.InternalSpring.fromJson(springParameters, bluePrint);
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

	Jello.Body.fromJson = function(bodyJson, world) {
		JsonToBodyConverter.convertJsonToBody(bodyJson, world);
	};
	
	return JsonToBodyConverter;
});
