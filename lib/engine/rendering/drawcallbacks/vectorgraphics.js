define([
	"engine/rendering/drawcallbacks/idrawcallback",
	"engine/rendering/vector/path/path",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback",
	"physics/jello"
], function(IDrawCallback, Path, AreaText, PathText, PointText, DrawCallback, Jello) {

	return IDrawCallback.subclass({
		initialize: function() {
			this.pointText = new PointText(new Jello.Vector2(-40, 0), "HELLO BLOOB!!!");
			this.path = new Path([
				new Path.Segment(new Jello.Vector2(-20,  20), new Jello.Vector2(-20,  21), new Jello.Vector2(-20,   0)),
				new Path.Segment(new Jello.Vector2(-30,  15), new Jello.Vector2(-30,   5), new Jello.Vector2(-35,  25)),
				new Path.Segment(new Jello.Vector2(-40,   0), new Jello.Vector2(-37,  10), new Jello.Vector2(-42,  -2)),
				new Path.Segment(new Jello.Vector2(-50,  -5), new Jello.Vector2(-44,  -4), new Jello.Vector2(-51,  -6))
			]);
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
		}
	});
	
});
