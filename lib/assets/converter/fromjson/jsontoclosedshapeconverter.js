mini.Module(
	"assets/converter/fromjson/jsontoclosedshapeconverter"
)
.requires(
	"assets/converter/fromjson/jsontovector2converter"
)
.defines(function(JsonToVector2Converter) {
	JsonToClosedShapeConverter = {};

	JsonToClosedShapeConverter.convertJsonToClosedShape = function(shapeJson) {
		var shape = new Jello.ClosedShape().begin();
		
		for(var index in shapeJson) {
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
