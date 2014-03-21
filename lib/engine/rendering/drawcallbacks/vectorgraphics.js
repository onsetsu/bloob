mini.Module(
	"engine/rendering/drawcallbacks/vectorgraphics"
)
.requires(
	"engine/rendering/vector/path",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback"
)
.defines(function(Path, AreaText, PathText, PointText, DrawCallback) {

	DrawCallback.Repository.add("vectorgraphics", function(entity, renderer) {
		new PointText(new Jello.Vector2(2, 2), "HELLO BLOOB!!!").draw();
	});
	
	
});
