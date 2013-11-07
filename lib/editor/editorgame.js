mini.Module(
	"editor/editorgame"
)
.requires(
	"editor/script/editor",
	"engine/main",
	"engine/game",
	"editor/editorscene",
	"basic/utils",
	"editor/action",
	"engine/map/map",
	"assets/loader",
	"editor/server"
)
.defines(function(
	_Editor,
	main,
	Game,
	EditorScene,
	Utils,
	Action,
	Map,
	Loader,
	Server
) {
	
	Editor = true;
	
	main(_Editor, "canvas");
	
	return {};
});
