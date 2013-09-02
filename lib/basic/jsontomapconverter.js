Bloob.JsonToMapConverter = function(json, map) {
	//var decompressedJson = Bloob.DecompressJsonToMap.decompress(json);
	var bodies = this.convertBodies(map, json.bodies, json.shapes, json.bluePrints);	
};

// TODO: rename to convertJsonToMap
Bloob.JsonToMapConverter.jsonToMap = function(json, map) {
	new Bloob.JsonToMapConverter(json, map);
};

Bloob.JsonToMapConverter.prototype.convertOneShape = function(oneShapeAsJson) {
	return Bloob.Converter.readShape(oneShapeAsJson);
};

Bloob.JsonToMapConverter.prototype.convertBodies = function(map, bodiesJson, shapeJson, bluePrintJson) {
	var newBodiesAsJson = {};
	var bodies = {};

	// read bodies
	for(var bodyName in bodiesJson) {
		var bodySpecificDescription = bodiesJson[bodyName];
		var newBodyJson = {};
		newBodiesAsJson[bodyName] = newBodyJson;
		
		var oneBluePrintAsJson = bluePrintJson[bodySpecificDescription.bluePrint];
		// read bluePrint
		var bluePrint = this.constructBluePrintForActualBuilding(oneBluePrintAsJson, shapeJson);

		this.readBodyParameters(bluePrint, oneBluePrintAsJson);
		this.readInternalSprings(bluePrint, oneBluePrintAsJson);
		

		if(typeof bodySpecificDescription.shape !== "undefined")
			bluePrint.shape(this.convertOneShape(shapeJson[bodySpecificDescription.shape]));

		this.readBodyParameters(bluePrint, bodySpecificDescription);
		this.readInternalSprings(bluePrint, bodySpecificDescription);
		
		var body = bluePrint
			.world(map.world)
			.build();

		bodies[bodyName] = body;
	};
	
	return bodies;
};

Bloob.JsonToMapConverter.prototype.constructBluePrintForActualBuilding = function(oneBluePrintAsJson, shapeJson) {
	var bluePrint = Bloob.BodyFactory.createBluePrint(window[oneBluePrintAsJson.class] || Body);
	if(typeof shapeJson[oneBluePrintAsJson.shape] !== "undefined")
		bluePrint.shape(this.convertOneShape(shapeJson[oneBluePrintAsJson.shape]));

	return bluePrint;
};
		
Bloob.JsonToMapConverter.prototype.readBodyParameters = function(bluePrint, jsonWithParameters) {
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
		
Bloob.JsonToMapConverter.prototype.readInternalSprings = function(bluePrint, jsonWithParameters) {
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

