mini.Module(
	"assets/converter/fromjson/jsontomapconverter"
)
.requires(
	"assets/converter/fromjson/jsontoworldconverter",
	"engine/map/layer"
)
.defines(function(DecompressMapJson, JsonToWorldConverter, Layer) {
	var JsonToMapConverter = {};

	JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
		// TODO: remove map parameter (return new Map instead)
		
		// decompress mapJson if compressed
		//var decompressedMapJson = DecompressMapJson.decompressJson(mapJson);
		
		// build bodies for world
		//Jello.World.fromJson(decompressedMapJson.world, map.getWorld());
		
		// convert layers
		for(var index in mapJson.layers)
			map.layers.push(Layer.fromJson(mapJson.layers[index]));
		
		return map;
	};

	return JsonToMapConverter;
});
