Bloob.DecompressMapJson = {};

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