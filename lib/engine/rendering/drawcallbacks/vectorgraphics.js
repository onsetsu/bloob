define([
	"engine/rendering/drawcallbacks/idrawcallback",
	"geomath/geomath",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback",
	"physics/jello"
], function(IDrawCallback, GeoMath, AreaText, PathText, PointText, DrawCallback, Jello) {

	return IDrawCallback.subclass({
		initialize: function() {
			this.pointText = new PointText(new Jello.Vector2(-40, 0), "HELLO BLOOB!!!");
			this.path = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-20,   20), undefined, new Jello.Vector2(10, 10)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-20,    0), new Jello.Vector2(10,  -10), new Jello.Vector2(-5,  5)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-50,    0), new Jello.Vector2(3,  10), new Jello.Vector2(-9,  -30)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-50,   20), new Jello.Vector2(-1,  9), undefined))
				.remove(1)
				.lineBy(new Jello.Vector2(-10, 10))
				.cubicCurveBy(new Jello.Vector2(10, 15), new Jello.Vector2(20, 15), new Jello.Vector2(30, 0))
				.cubicCurveTo(new Jello.Vector2(10, 40), new Jello.Vector2(10, 40), new Jello.Vector2(20, 30))
				.quadraticCurveTo(new Jello.Vector2(30, 40), new Jello.Vector2(40, 30))
				.quadraticCurveBy(new Jello.Vector2(10, 10), new Jello.Vector2(20, 0))
				.close(true);
			this.path2 = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-40, 0)))
				.curveTo(new Jello.Vector2(-30, 10), new Jello.Vector2(-20, 0), 0.8)
				.curveBy(new Jello.Vector2(-10, -10), new Jello.Vector2(-20, 0), 0.8);
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
			this.path2.draw();
		}
	});
	
});
