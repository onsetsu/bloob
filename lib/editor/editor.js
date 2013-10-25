mini.Module(
	"editor/editor"
)
.requires(
	"engine/main",
	"engine/game",
	"editor/editorscene",
	"basic/utils",
	"editor/action",
	"engine/map/map",
	"editor/server"
)
.defines(function(main, Game, EditorScene, Utils, Action, Map, Server) {
	
	Editor = true;

	var EditorGame = Game.subclass({
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);

			this.testServer();
			
			var that = this;
			var map = new Map("untitled");
			map.load(function() {
				new EditorScene(that).setMap(map).run();
			});
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
