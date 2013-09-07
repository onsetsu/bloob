Bloob.JsonToMapConverter = {};

Bloob.JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
	// decompress mapJson if compressed
	var decompressedMapJson = Bloob.DecompressMapJson.decompressJson(mapJson);
	
	// build bodies for world
	Bloob.JsonToMapConverter.createBodiesAndAttachToWorld(map, decompressedMapJson);
};

Bloob.JsonToMapConverter.createBodiesAndAttachToWorld = function(map, decompressedMapJson) {
	World.fromJson(decompressedMapJson.world, map.world);
};
