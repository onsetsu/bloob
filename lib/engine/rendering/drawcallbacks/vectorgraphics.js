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
				new Path.Segment(new Jello.Vector2(-20,  20), new Jello.Vector2(-20, 0)),
				new Path.Segment(new Jello.Vector2(-30,  15)),
				new Path.Segment(new Jello.Vector2(-40,   0)),
				new Path.Segment(new Jello.Vector2(-50,  -5))
			]);
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
		}
	});
	
});
