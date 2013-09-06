Bloob.Vector2ToJsonConverter = {};
Bloob.Vector2ToJsonConverter.vector2ToJson = function(vector2) {
	var resultJson = {
		"x": vector2.x,
		"y": vector2.y
	};

	return resultJson;
};

Vector2.prototype.toJson = function() {
	return Bloob.Vector2ToJsonConverter.vector2ToJson(this);
};
