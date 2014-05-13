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
			this.path = new GeoMath.Path([
				new GeoMath.Path.Segment(new Jello.Vector2(-20,   20), undefined, new Jello.Vector2(10, 10)),
				new GeoMath.Path.Segment(new Jello.Vector2(-20,    0), new Jello.Vector2(10,  -10), new Jello.Vector2(-5,  5)),
				new GeoMath.Path.Segment(new Jello.Vector2(-50,    0), new Jello.Vector2(3,  10), new Jello.Vector2(-9,  -30)),
				new GeoMath.Path.Segment(new Jello.Vector2(-50,   20), new Jello.Vector2(-1,  9), undefined)
			])
				.lineTo(new Jello.Vector2(-60, 30))
				.setIsClosed(true);

		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
		}
	});
	
});
