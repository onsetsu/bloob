mini.Module(
		"assets/converter/fromjson/jsontomapconverter"
)
.requires(
		"assets/converter/decompressmapjson"
)
.defines(function() {
	var JsonToMapConverter = {};

	JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
		map = map || new Bloob.Map();
		
		// decompress mapJson if compressed
		var decompressedMapJson = Bloob.DecompressMapJson.decompressJson(mapJson);
		
		// build bodies for world
		Jello.World.fromJson(decompressedMapJson.world, map.world);
		
		return map;
	};


	
	Bloob.JsonToMapConverter = JsonToMapConverter;
	
	return JsonToMapConverter;
});
