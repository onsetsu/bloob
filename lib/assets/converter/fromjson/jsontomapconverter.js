define([
	"engine/map/layer"
], function(Layer) {
	var JsonToMapConverter = {};

	JsonToMapConverter.convertJsonToMap = function(mapJson, map) {
		// TODO: remove map parameter (return new Map instead)
		
		// convert layers
		for(var index in mapJson.layers) {
			if(!mapJson.layers.hasOwnProperty(index)) continue;
		
			map.layers.push(Layer.fromJson(mapJson.layers[index]));
		}
		
		return map;
	};

	return JsonToMapConverter;
});
