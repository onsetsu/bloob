mini.Module(
	"editor/editor"
)
.requires(
	"engine/main",
	"engine/game",
	"editor/editorscene",
	"basic/utils",
	"editor/action",
	"editor/server"
)
.defines(function(main, Game, EditorScene, Utils, Action, Server) {
	var EditorGame = Game.subclass({
		initialize: function(configuration) {
			Game.prototype.initialize.apply(this, arguments);

			this.testServer();
			
			var editorScene = new EditorScene(this, this.loop);
			editorScene
				.onMapLoaded(Utils.bind(editorScene.run, editorScene))
				.loadMap(this.config.startLevel);
		},

		testServer: function() {
			var obj = {
				testServerPost: function() {
					var path = "untitled.js";
					var dataString = "THIS IS THE DATA";
					
					Server.save(path, dataString);
				},
				testReadFiles: function() {
					var dir = '';
					var fileType = Server.types.scripts;
					
					Server.browse(dir, fileType);
				},
				testGlob: function() {
					
				}
			};
			this.datGui.add(obj, "testServerPost");
			this.datGui.add(obj, "testReadFiles");
			this.datGui.add(obj, "testGlob");
		}
	});
	
	main(EditorGame);
	
	var Editor = {};
	
	return Editor;
});
