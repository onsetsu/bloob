define(['require', 'num', "assets/loader", "jello"], function(require, num, Loader, Jello) {
    var Vector2 = require('num').Vector2,
        ClosedShape = require('jello').ClosedShape;

	var ShapeBuilder = {
		"load": function(file, callback) {
			Loader.loadShape(file, function(json) {
				var shape = new ClosedShape().begin();
				for(var i = 0; i < json.length; i++) {
					shape.addVertex(new Vector2(json[i].x, json[i].y));
				}
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
							Math.cos(-i * (Math.PI / 180)),
							Math.sin(-i * (Math.PI / 180))
						)
					);
				}
				return ballShape.finish();
			})(),
			"I": new ClosedShape()
				.begin()
				.addVertex(new Vector2(-1.5, 2.0))
				.addVertex(new Vector2(-0.5, 2.0))
				.addVertex(new Vector2(0.5, 2.0))
				.addVertex(new Vector2(1.5, 2.0))
				.addVertex(new Vector2(1.5, 1.0))
				.addVertex(new Vector2(0.5, 1.0))
				.addVertex(new Vector2(0.5, -1.0))
				.addVertex(new Vector2(1.5, -1.0))
				.addVertex(new Vector2(1.5, -2.0))
				.addVertex(new Vector2(0.5, -2.0))
				.addVertex(new Vector2(-0.5, -2.0))
				.addVertex(new Vector2(-1.5, -2.0))
				.addVertex(new Vector2(-1.5, -1.0))
				.addVertex(new Vector2(-0.5, -1.0))
				.addVertex(new Vector2(-0.5, 1.0))
				.addVertex(new Vector2(-1.5, 1.0))
				.finish(),
			"Diamond": new ClosedShape()
				.begin()
				.addVertex(new Vector2( 0.5, 0.0))
				.addVertex(new Vector2( 0.0,-1.0))
				.addVertex(new Vector2(-0.5, 0.0))
				.addVertex(new Vector2( 0.0, 1.0))
				.finish()
		}
	};
	
	return ShapeBuilder;
});
