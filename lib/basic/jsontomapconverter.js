Bloob.JsonToMapConverter = function(json, map) {
	this.convertJson(map, json);	
};

// TODO: rename to convertJsonToMap
Bloob.JsonToMapConverter.jsonToMap = function(json, map) {
	new Bloob.JsonToMapConverter(json, map);
};

Bloob.JsonToMapConverter.prototype.convertOneShape = function(oneShapeAsJson) {
	return Bloob.Converter.readShape(oneShapeAsJson);
};

Bloob.JsonToMapConverter.prototype.convertJson = function(map, mapJson) {
	// decompress mapJson if compressed
	var decompressedMapJson = Bloob.DecompressMapJson.decompressJson(mapJson);
	
	// build bodies for world
	this.createBodiesAndAttachToWorld(map, decompressedMapJson);
};

Bloob.JsonToMapConverter.prototype.createBodiesAndAttachToWorld = function(map, decompressedMapJson) {
	for(var bodyName in decompressedMapJson.world.bodies) {
		// TODO: move to BodyToJsonConverter
		var decompressedBodyJson = decompressedMapJson.world.bodies[bodyName];
		
		// read bluePrint
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[decompressedBodyJson.class] || Body);

		if(typeof decompressedBodyJson.shape !== "undefined")
			bluePrint.shape(this.convertOneShape(decompressedBodyJson.shape));

		this.readBodyParameters(bluePrint, decompressedBodyJson);
		
		var body = bluePrint
			.world(map.world)
			.build();
	};
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

//--------------------------------------------
// DecompressMapJson
//--------------------------------------------
Bloob.DecompressMapJson = function() {};

Bloob.DecompressMapJson.isCompressed = function(mapJson) {
	// compressed, when property "bodies" is directly available
	return typeof mapJson.bodies !== "undefined";
};

Bloob.DecompressMapJson.decompressJson = function(mapJson) {
	// do not decompress if map json is already decompressed
	if(!this.isCompressed(mapJson))
		return mapJson;
	
	var decompressedMapJson = {
		"world": {
			"bodies": {}
		}
	};

	// read bodies
	for(var bodyName in mapJson.bodies) {
		var bodySpecificDescription = mapJson.bodies[bodyName];
		var decompressedBodyJson = {};
		decompressedMapJson.world.bodies[bodyName] = decompressedBodyJson;
		
		if(bodySpecificDescription.bluePrint) {
			var oneBluePrintAsJson = mapJson.bluePrints[bodySpecificDescription.bluePrint];
			Bloob.DecompressMapJson.enhanceBodyJsonWithInformation(oneBluePrintAsJson, decompressedBodyJson, mapJson);
		};
		Bloob.DecompressMapJson.enhanceBodyJsonWithInformation(bodySpecificDescription, decompressedBodyJson, mapJson);
	};
	
	return decompressedMapJson;
};

Bloob.DecompressMapJson.enhanceBodyJsonWithInformation = function(oldBodyJson, newBodyJson, mapJson) {
	// set shape if present
	if(typeof oldBodyJson["shape"] !== "undefined") {
		newBodyJson["shape"] = mapJson.shapes[oldBodyJson["shape"]];
	};
	
	// set other properties
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
		if(typeof oldBodyJson[propertyName] !== "undefined") {
			newBodyJson[propertyName] = oldBodyJson[propertyName];
		};
	};
};

