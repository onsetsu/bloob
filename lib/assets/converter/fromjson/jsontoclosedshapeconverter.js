define([
	"assets/converter/fromjson/jsontovector2converter",
	"physics/jello"
], function(JsonToVector2Converter, Jello) {
	JsonToClosedShapeConverter = {};

	JsonToClosedShapeConverter.convertJsonToClosedShape = function(shapeJson) {
		var shape = new Jello.ClosedShape().begin();
		
		for(var index in shapeJson) {
			if(!shapeJson.hasOwnProperty(index)) continue;
			shape.addVertex(Jello.Vector2.fromJson(shapeJson[index]));
		};
		
		return shape.finish();
	};

	//add convenient method
	Jello.ClosedShape.fromJson = function(shapeJson) {
		return JsonToClosedShapeConverter.convertJsonToClosedShape(shapeJson);
	};
	
	return JsonToClosedShapeConverter;
});
