mini.Module(
		"assets/converter/tojson/vector2tojsonconverter"
)
.requires(
		"assets/converter/fromjson/jsontomapconverter"
)
.defines(function() {
	var Vector2ToJsonConverter = {};
	
	Vector2ToJsonConverter.vector2ToJson = function(vector2) {
		var resultJson = {
			"x": vector2.x,
			"y": vector2.y
		};

		return resultJson;
	};

	Jello.Vector2.prototype.toJson = function() {
		return Bloob.Vector2ToJsonConverter.vector2ToJson(this);
	};

	Bloob.Vector2ToJsonConverter = Vector2ToJsonConverter;
	
	return Vector2ToJsonConverter;
});
