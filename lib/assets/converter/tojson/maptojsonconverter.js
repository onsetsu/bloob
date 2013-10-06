mini.Module(
	"assets/converter/tojson/maptojsonconverter"
)
.requires(
	"assets/converter/tojson/worldtojsonconverter",
	"engine/map/map"
)
.defines(function(WorldToJsonConverter, Map) {
	var MapToJsonConverter = {};
	MapToJsonConverter.mapToJson = function(map) {
		var resultJson = {
			"spawnPoints": {
				"default": {"x": 0, "y": 0}
			},
			"world": map.getWorld().toJson()
		};

		return resultJson;
	};

	// add convenient method
	Map.prototype.toJson = function() {
		return MapToJsonConverter.mapToJson(this);
	};

	return MapToJsonConverter;
});
