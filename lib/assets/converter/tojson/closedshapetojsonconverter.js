define([
	"assets/converter/tojson/vector2tojsonconverter",
	"physics/jello"
], function(Vector2ToJsonConverter, Jello) {
	var ClosedShapeToJsonConverter = {};
	
	ClosedShapeToJsonConverter.closedShapeToJson = function(closedShape) {
		var resultJson = [];

		for(var i = 0; i < closedShape.getVertices().length; i++)
			resultJson.push(closedShape.getVertices()[i].toJson());

		return resultJson;
	};

	Jello.ClosedShape.prototype.toJson = function() {
		return ClosedShapeToJsonConverter.closedShapeToJson(this);
	};
	
	return ClosedShapeToJsonConverter;
});
