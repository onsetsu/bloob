Bloob.ShapeBuilder = Bloob.ShapeBuilder || {};
Bloob.ShapeBuilder.Converter = {};
Bloob.ShapeBuilder.Converter.jsonToShape = ClosedShape.fromJson;

Bloob.Converter = {};
Bloob.Converter.readVector2 = Vector2.fromJson;

Bloob.Converter.readShape = Bloob.ShapeBuilder.Converter.jsonToShape;

