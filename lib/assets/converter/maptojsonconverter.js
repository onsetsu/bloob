Bloob.MapToJsonConverter = {};
Bloob.MapToJsonConverter.mapToJson = function(map) {
	var resultJson = {
		"spawnPoints": {
			"default": {"x": 0, "y": 0}
		},
		"world": {},
		"bluePrints": {},
		"bodies": {}
	};

	return resultJson;
};

// add convenient method
Bloob.Map.prototype.toJson = function() {
	return Bloob.MapToJsonConverter.mapToJson(this);
};
