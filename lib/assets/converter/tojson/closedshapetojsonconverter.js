Bloob.ClosedShapeToJsonConverter = {};
Bloob.ClosedShapeToJsonConverter.closedShapeToJson = function(closedShape) {
	var resultJson = [];

	for(var i = 0; i < closedShape.getVertices().length; i++)
		resultJson.push(closedShape.getVertices()[i].toJson());

	return resultJson;
};

Jello.ClosedShape.prototype.toJson = function() {
	return Bloob.ClosedShapeToJsonConverter.closedShapeToJson(this);
};
