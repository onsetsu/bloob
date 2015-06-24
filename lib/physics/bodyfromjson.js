define(function(require) {
    var Vector2 = require('num').Vector2,
        InternalSpring = require('./internalspring'),
        ClosedShape = require('./closedshape'),
        Body = require('./body'),
        BodyFactory = require('./bodyfactory');

	var JsonToBodyConverter = {};

	JsonToBodyConverter.convertJsonToBody = function(bodyJson, world) {
		// read bluePrint
		var bluePrint = BodyFactory.createBluePrint();

		if(typeof bodyJson.shape !== "undefined")
			bluePrint.shape(ClosedShape.fromJson(bodyJson.shape));

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

			var parameterValue;
			// if parameter is defined in json...
			if(typeof jsonWithParameters[parameterName] !== "undefined") {
				// annotate blueprint
				if(parameterName == "translate" || parameterName == "scale") {
					// need to convert into Vector2
					parameterValue = Vector2.fromJson(jsonWithParameters[parameterName]);
					bluePrint[parameterName](parameterValue);
				}
				else if(parameterName == "internalSprings") {
					// iterate over internalSprings array; attach each spring to bluePrint
					for(var index2 in jsonWithParameters.internalSprings) {
						if(!jsonWithParameters.internalSprings.hasOwnProperty(index2)) continue;
						var springParameters = jsonWithParameters.internalSprings[index2];
						InternalSpring.fromJson(springParameters, bluePrint);
					}
				}
				else
				{
					parameterValue = jsonWithParameters[parameterName];
					bluePrint[parameterName](parameterValue);
				}
			}
		}
	};

	Body.fromJson = function(bodyJson, world) {
		return JsonToBodyConverter.convertJsonToBody(bodyJson, world);
	};

	return JsonToBodyConverter;
});
