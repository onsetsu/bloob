define([
	"editor/script/editor",
	"engine/main"
], function(
	_Editor,
	main
) {
	
	Editor = true;
	
	main(_Editor, "canvas");
	
	return {};
});
