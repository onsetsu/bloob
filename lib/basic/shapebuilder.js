Bloob.ShapeBuilder = {
	"load": function(file, callback) {
		Bloob.Loader.loadShape(file, function(json) {
			var shape = new ClosedShape().begin();
			for(var i = 0; i < json.length; i++) {
				shape.addVertex(new Vector2(json[i].x, json[i].y));
			};
			shape.finish();
			
			callback(shape);
		});
	},
	"Shapes": {
		"Cube": new ClosedShape()
			.begin()
			.addVertex(new Vector2(-1, -1))
			.addVertex(new Vector2(-1,  1))
			.addVertex(new Vector2( 1,  1))
			.addVertex(new Vector2( 1, -1))
			.finish(),
		"Particle": new ClosedShape()
			.begin()
			.addVertex(Vector2.Zero.copy())
			.finish(),
		"Ball": (function() {
			var ballShape = new ClosedShape();
			ballShape.begin();
			for (var i = 0; i < 360; i += 20) {
				ballShape.addVertex(
					new Vector2(
						Math.cos(-i * (PI / 180)),
						Math.sin(-i * (PI / 180))
					)
				);
			}
			return ballShape.finish();
		})()
	},
	"cube": new ClosedShape()
	.begin()
	.addVertex(new Vector2(-1, -1))
	.addVertex(new Vector2(-1,  1))
	.addVertex(new Vector2( 1,  1))
	.addVertex(new Vector2( 1, -1))
	.finish(),
		
	"foo": "bar"
};
