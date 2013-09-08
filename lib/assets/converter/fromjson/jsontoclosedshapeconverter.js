Bloob.JsonToClosedShapeConverter = {};

Bloob.JsonToClosedShapeConverter.convertJsonToClosedShape = function(shapeJson) {
	var shape = new Jello.ClosedShape().begin();
	
	for(var index in shapeJson) {
		shape.addVertex(Vector2.fromJson(shapeJson[index]));
	};
	
	return shape.finish();
};

//add convenient method
Jello.ClosedShape.fromJson = function(shapeJson) {
	return Bloob.JsonToClosedShapeConverter.convertJsonToClosedShape(shapeJson);
};
