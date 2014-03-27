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
			this.path = new Path();
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
		}
	});
	
});
