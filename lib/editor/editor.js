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
	
	Editor = true;

	var EditorGame = Game.subclass({
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);

			this.testServer();
			
			var editorScene = new EditorScene(this, this.loop);
			editorScene.loadMap(
				"untitled",
				Utils.bind(function(map) {
					this.setMap(map);
					this.initMouseInteraction();
					this.run();
				}, editorScene)
			);
		},

		testServer: function() {
			var obj = {
				testReadFiles: function() {
					var dir = '';
					var fileType = Server.types.scripts;
					
					Server.browse(dir, fileType);
				}
			};
			this.datGui.add(obj, "testReadFiles");
		}
	});
	
	main(EditorGame);
	
	return {};
});
