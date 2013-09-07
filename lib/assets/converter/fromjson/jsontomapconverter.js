Bloob.JsonToMapConverter = {};

Bloob.JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
	map = map || new Bloob.Map();
	
	// decompress mapJson if compressed
	var decompressedMapJson = Bloob.DecompressMapJson.decompressJson(mapJson);
	
	// build bodies for world
	World.fromJson(decompressedMapJson.world, map.world);
};

//add convenient method
Bloob.Map.fromJson = function(mapJson, map) {
	return Bloob.JsonToMapConverter.convertJsonToMap(mapJson, map);
};