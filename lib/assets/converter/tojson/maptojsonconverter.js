mini.Module(
	"assets/converter/tojson/maptojsonconverter"
)
.requires(
	"assets/converter/tojson/worldtojsonconverter",
	"basic/map"
)
.defines(function(worldToJsonconverter, Map) {
	var MapToJsonConverter = {};
	MapToJsonConverter.mapToJson = function(map) {
		var resultJson = {
			"spawnPoints": {
				"default": {"x": 0, "y": 0}
			},
			"world": map.world.toJson()
		};

		return resultJson;
	};

	// add convenient method
	Map.prototype.toJson = function() {
		return Bloob.MapToJsonConverter.mapToJson(this);
	};

	Bloob.MapToJsonConverter = MapToJsonConverter;
	
	return MapToJsonConverter;
});
