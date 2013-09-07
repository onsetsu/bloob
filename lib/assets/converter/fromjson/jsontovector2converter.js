Bloob.JsonToVector2Converter = {};

Bloob.JsonToVector2Converter.convertJsonToVector2 = function(vectorJson) {
	return new Vector2(vectorJson.x, vectorJson.y);
};

//add convenient method
Vector2.fromJson = function(vectorJson) {
	return Bloob.JsonToVector2Converter.convertJsonToVector2();
};
