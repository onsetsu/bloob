define([
	"engine/rendering/drawcallbacks/idrawcallback",
	"engine/rendering/vector/path",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback",
	"physics/jello"
], function(IDrawCallback, Path, AreaText, PathText, PointText, DrawCallback, Jello) {

	return IDrawCallback.subclass({
		draw: function(entity, renderer) {
			new PointText(new Jello.Vector2(2, 2), "HELLO BLOOB!!!").draw();
		}
	});
	
});
