mini.Module(
		"engine/game"
)
.requires(
		"engine/loop",
		"engine/config",
		"basic/canvas",
		"basic/audio/audio",
		"basic/audio/music",
		"basic/audio/sound",
		"bloob/scenes/titlescene"
)
.defines(function(Loop, Config, Canvas, Audio, Track, Sound, TitleScene) {
	var Game = mini.Class.subclass({
		initialize: function(configuration) {
			this.config = configuration || Config.getDefault();
			this.id = Game.nextGameID++;
			console.log("NEW GAME: " + this.id);
			this.init();			
		},
		init: function() {
			// prepare datGui
			this.datGui = new dat.GUI();
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
			
			// prepare stats
			this.stats = new Stats();
			$("body").prepend(this.stats.domElement);
			
			// Configure and start the game loop.
			this.loop = new Loop()
				.clear()
				.add(this.stats, this.stats.update)
				.start();

			this.canvas = new Canvas({canvasId: "bloobCanvas" + this.id});
			this.audio = new Audio();
			
			var titleScene = new TitleScene(this, this.loop).run();
		}
	});

	Game.nextGameID = 0;
	
	return Game;
});
