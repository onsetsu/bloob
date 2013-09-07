Bloob.JsonToClosedShapeConverter = {};

Bloob.JsonToClosedShapeConverter.convertJsonToClosedShape = function(shapeJson) {
	var shape = new ClosedShape().begin();
	
	for(var index in shapeJson) {
		shape.addVertex(Vector2.fromJson(shapeJson[index]));
	};
	
	return shape.finish();
};

//add convenient method
ClosedShape.fromJson = function(shapeJson) {
	return Bloob.JsonToClosedShapeConverter.convertJsonToClosedShape(shapeJson);
};
