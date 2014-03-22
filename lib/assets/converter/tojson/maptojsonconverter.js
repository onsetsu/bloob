define([
	"assets/converter/tojson/worldtojsonconverter",
	"engine/map/map"
], function(WorldToJsonConverter, Map) {
	var MapToJsonConverter = {};
	MapToJsonConverter.mapToJson = function(map) {
		var resultJson = {
			"name": map.mapName,
			"spawnPoints": {
				"default": {"x": 0, "y": 0}
			},
			"layers": []
		};

		// Convert Layers to json.
		for(var index in map.layers) {
			if(!map.layers.hasOwnProperty(index)) continue;
			resultJson.layers.push(map.layers[index].toJson());
		}
		
		return resultJson;
	};

	// add convenient method
	Map.prototype.toJson = function() {
		return MapToJsonConverter.mapToJson(this);
	};

	return MapToJsonConverter;
});
