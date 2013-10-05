mini.Module(
	"editor/editor"
)
.requires(
	"engine/main",
	"engine/game",
	"editor/editorscene",
	"basic/utils",
	"editor/action"
)
.defines(function(main, Game, EditorScene, Utils, Action) {
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

					var postString = 
						'path=' + encodeURIComponent( path ) +
						'&data=' + encodeURIComponent(dataString);

					var req = $.ajax({
						url: 'lib/weltmeister/api/save.php',
						type: 'POST',
						dataType: 'json',
						async: false,
						data: postString,
						success: function() {
							console.log("FILE SAVED");
						}
					});
				},
				testReadFiles: function() {
					var dir = '';
					var fileType = "scripts";
					
					var path = 'lib/weltmeister/api/browse.php' + '?dir=' + encodeURIComponent( dir || '' ) + '&type=' + fileType;
					var req = $.ajax({
						url: path,
						dataType: 'json',
						async: false,
						success: function(data) {
							console.log(data);
						}
					});
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
