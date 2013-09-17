mini.Module(
		"assets/converter/fromjson/jsontovector2converter"
)
.requires(
		"basic/map"
)
.defines(function() {
	JsonToVector2Converter = {};

	JsonToVector2Converter.convertJsonToVector2 = function(vectorJson) {
		return new Jello.Vector2(vectorJson.x, vectorJson.y);
	};

	//add convenient method
	Jello.Vector2.fromJson = function(vectorJson) {
		return Bloob.JsonToVector2Converter.convertJsonToVector2(vectorJson);
	};
	
	Bloob.JsonToVector2Converter = JsonToVector2Converter;
	
	return JsonToVector2Converter;
});
