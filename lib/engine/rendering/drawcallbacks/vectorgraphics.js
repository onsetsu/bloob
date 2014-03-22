define([
	"engine/rendering/vector/path",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback",
	"physics/jello"
], function(Path, AreaText, PathText, PointText, DrawCallback, Jello) {

	return function(entity, renderer) {
		new PointText(new Jello.Vector2(2, 2), "HELLO BLOOB!!!").draw();
	};
	
});
