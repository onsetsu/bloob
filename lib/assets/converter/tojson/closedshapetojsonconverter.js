Bloob.ClosedShapeToJsonConverter = {};
Bloob.ClosedShapeToJsonConverter.closedShapeToJson = function(closedShape) {
	var resultJson = [];

	return resultJson;
};

ClosedShape.prototype.toJson = function() {
	return Bloob.ClosedShapeToJsonConverter.closedShapeToJson(this);
};
