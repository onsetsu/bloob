Bloob.JsonToMapConverter = function() {};
Bloob.JsonToMapConverter.jsonToMap = function(json, map) {
	//var decompressedJson = Bloob.DecompressJsonToMap.decompress(json);
	var bodies = this.convertBodies(map, json.bodies, json.shapes, json.bluePrints);
};

Bloob.JsonToMapConverter.convertOneShape = function(oneShapeAsJson) {
	return Bloob.Converter.readShape(oneShapeAsJson);
};

Bloob.JsonToMapConverter.convertOneBluePrint = function(oneBluePrintAsJson, shapeJson) {
	var bluePrints = {};
	
	// read bluePrints
	var bluePrintDescription = oneBluePrintAsJson;
	var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
		.shape(this.convertOneShape(
				shapeJson
				[
				 bluePrintDescription
				 .shape
				 ]));

	Bloob.JsonToMapConverter.readBodyParameters(bluePrint, bluePrintDescription);
	Bloob.JsonToMapConverter.readInternalSprings(bluePrint, bluePrintDescription);
	
	return bluePrint;
};

Bloob.JsonToMapConverter.convertBodies = function(map, bodiesJson, shapeJson, bluePrintJson) {
	var bodies = {};

	// read bodies
	for(var bodyName in bodiesJson) {
		var bodySpecificDescription = bodiesJson[bodyName];
		Scarlet.log(bodySpecificDescription.bluePrint);
		var bluePrint = this.convertOneBluePrint(bluePrintJson[bodySpecificDescription.bluePrint], shapeJson);

		if(typeof bodySpecificDescription.shape !== "undefined")
			bluePrint.shape(this.convertOneShape(shapeJson[bodySpecificDescription.shape]));

		Bloob.JsonToMapConverter.readBodyParameters(bluePrint, bodySpecificDescription);
		Bloob.JsonToMapConverter.readInternalSprings(bluePrint, bodySpecificDescription);
		
		var body = bluePrint
			.world(map.world)
			.build();

		bodies[bodyName] = body;
	};
	
	return bodies;
};

Bloob.JsonToMapConverter.readBodyParameters = function(bluePrint, jsonWithParameters) {
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
		
Bloob.JsonToMapConverter.readInternalSprings = function(bluePrint, jsonWithParameters) {
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

Bloob.DecompressJsonToMap = function(json) {
	var decompressedJson = json;
	decompressedJson.world = {
		"bodies": {}
	};

	for(var bodyName in json.bodies) {
		var oldBodyJson = bodiesJson[bodyName];
		var newBodyJson = {};
		
		// enhance with bluePrint information
		if(typeof oldBodyJson["bluePrint"] !== "undefined") {
			
		}
	};
	
	"..."

	return decompressedJson;
};

Bloob.DecompressJsonToMap.decompress = Bloob.DecompressJsonToMap;

Bloob.DecompressJsonToMap.enhanceBodyJsonWithInformation = function(oldBodyInfos, newBodyJson, shapes) {
	
	if(typeof oldBodyInfos["shape"] !== "undefined") {
		newBodyJson["shape"] = shapes[oldBodyInfos["shape"]];
	};
	
	var normalProperties = [
		"class",
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
	
	for(propertyIndex in normalProperties) {
		var propertyName = normalProperties[propertyIndex];
		if(typeof oldBodyInfos[propertyName] !== "undefined") {
			newBodyJson[propertyName] = oldBodyInfos[propertyName];
		};
	};
};

