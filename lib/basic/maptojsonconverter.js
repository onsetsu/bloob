Bloob.MapToJsonConverter = function() {};
Bloob.MapToJsonConverter.mapToJson = function(map) {
	var resultJson = {
		"spawnPoints": {
			"default": {"x": 0, "y": 0}
		},
		"shapes": {},
		"bluePrints": {},
		"bodies": {}
	};
	
	return resultJson;
};