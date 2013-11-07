mini.Module(
	"editor/editorgame"
)
.requires(
	"editor/script/editor",
	"engine/main"
)
.defines(function(
	_Editor,
	main
) {
	
	Editor = true;
	
	main(_Editor, "canvas");
	
	return {};
});
