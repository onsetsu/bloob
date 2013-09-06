Bloob.JsonToMapConverter = {};

Bloob.JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
	// decompress mapJson if compressed
	var decompressedMapJson = Bloob.DecompressMapJson.decompressJson(mapJson);
	
	// build bodies for world
	Bloob.JsonToMapConverter.createBodiesAndAttachToWorld(map, decompressedMapJson);
};

Bloob.JsonToMapConverter.createBodiesAndAttachToWorld = function(map, decompressedMapJson) {
	for(var bodyName in decompressedMapJson.world.bodies) {
		var decompressedBodyJson = decompressedMapJson.world.bodies[bodyName];
		Bloob.JsonToBodyConverter.convertJsonToBody(decompressedBodyJson, map.world);
	};
};
