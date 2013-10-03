mini.Module(
	"assets/converter/fromjson/jsontomapconverter"
)
.requires(
	"assets/converter/decompressmapjson",
	"assets/converter/fromjson/jsontoworldconverter"
)
.defines(function(DecompressMapJson) {
	var JsonToMapConverter = {};

	JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
		map = map || new Bloob.Map();
		
		// decompress mapJson if compressed
		var decompressedMapJson = DecompressMapJson.decompressJson(mapJson);
		
		// build bodies for world
		Jello.World.fromJson(decompressedMapJson.world, map.world);
		
		return map;
	};

	return JsonToMapConverter;
});
