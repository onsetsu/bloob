Bloob.ShapeBuilder = Bloob.ShapeBuilder || {};
Bloob.ShapeBuilder.Converter = {};
Bloob.ShapeBuilder.Converter.jsonToShape = function(json) {
	var shape = new ClosedShape().begin();
	for(var index in json) {
		shape.addVertex(Bloob.Converter.readVector2(json[index]));
	};
	return shape.finish();
};

Bloob.Converter = {};
Bloob.Converter.readVector2 = function(json) {
	return new Vector2(json.x, json.y);
};

Bloob.Converter.readShape = Bloob.ShapeBuilder.Converter.jsonToShape;

