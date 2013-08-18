Bloob.JsonToMapConverter = function() {};
Bloob.JsonToMapConverter.jsonToMap = function(json, map) {
	var shapes = this.convertShapes(json.shapes);
	var bluePrints = map.convertBluePrints.call(map, json.bluePrints, shapes);
	var bodies = map.convertBodies.call(map, json.bodies, shapes, bluePrints);
};

Bloob.JsonToMapConverter.convertShapes = function(shapeJson) {
	var shapes = {};
	
	// read shapes
	for(var shapeName in shapeJson) {
		shapes[shapeName] = Bloob.Converter.readShape(shapeJson[shapeName]);
	};
	
	return shapes;
};

Bloob.Map.prototype.convertBluePrints = function(bluePrintJson, shapes) {
	var bluePrints = {};
	
	// read bluePrints
	for(var bluePrintName in bluePrintJson) {
		var bluePrintDescription = bluePrintJson[bluePrintName];
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
			.shape(shapes[bluePrintDescription.shape]);

		this.readBodyParameters(bluePrint, bluePrintDescription);
		this.readInternalSprings(bluePrint, bluePrintDescription);
		
		bluePrints[bluePrintName] = bluePrint;
	};
	
	return bluePrints;
};

Bloob.Map.prototype.convertBodies = function(bodiesJson, shapes, bluePrints) {
	var bodies = {};

	// read bodies
	for(var bodyName in bodiesJson) {
		var bodySpecificDescription = bodiesJson[bodyName];
		Scarlet.log(bodySpecificDescription.bluePrint);
		var bluePrint = bluePrints[bodySpecificDescription.bluePrint];

		this.readBodyParameters(bluePrint, bodySpecificDescription);
		this.readInternalSprings(bluePrint, bodySpecificDescription);
		
		var body = bluePrint
			.world(this.world)
			.build();

		bodies[bodyName] = body;
	};
	
	return bodies;
};

Bloob.Map.prototype.readBodyParameters = function(bluePrint, jsonWithParameters) {
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
	                       "gasPressure"
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
			}
			else
			{
				var parameterValue = jsonWithParameters[parameterName];
			}
			bluePrint[parameterName](parameterValue);
		};
	};
};
		
Bloob.Map.prototype.readInternalSprings = function(bluePrint, jsonWithParameters) {
	if(typeof jsonWithParameters["internalSprings"] !== "undefined") {
		for(var index in jsonWithParameters["internalSprings"]) {
			var springParameters = jsonWithParameters["internalSprings"][index];
			bluePrint.addInternalSpring(
				springParameters.pointA,
				springParameters.pointB,
				springParameters.springK,
				springParameters.springDamping
			);
		};
	};
};
