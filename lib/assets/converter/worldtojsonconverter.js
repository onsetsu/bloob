Bloob.WorldToJsonConverter = {};
Bloob.WorldToJsonConverter.worldToJson = function(world) {
	var resultJson = {
		"bodies": {}
	};

	return resultJson;
};

// add convenient method
World.prototype.toJson = function() {
	return Bloob.WorldToJsonConverter.worldToJson(this);
};
