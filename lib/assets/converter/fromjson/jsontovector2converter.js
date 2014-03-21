mini.Module(
		"assets/converter/fromjson/jsontovector2converter"
)
.requires(
	"physics/jello"
	//"basic/map"
)
.defines(function(Jello) {
	JsonToVector2Converter = {};

	JsonToVector2Converter.convertJsonToVector2 = function(vectorJson) {
		return new Jello.Vector2(vectorJson.x, vectorJson.y);
	};

	//add convenient method
	Jello.Vector2.fromJson = function(vectorJson) {
		return JsonToVector2Converter.convertJsonToVector2(vectorJson);
	};
	
	return JsonToVector2Converter;
});
