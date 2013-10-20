mini.Module(
	"engine/game"
)
.requires(
	"engine/loop",
	"basic/canvas",
	"basic/audio/audio",
	"basic/audio/music",
	"basic/audio/sound"
)
.defines(function(Loop, Canvas, Audio, Track, Sound) {
	var Game = mini.Class.subclass({
		initialize: function() {
			this.id = Game.nextGameID++;
			console.log("NEW GAME: " + this.id);
			this.init();			
		},
		init: function() {
			// prepare datGui
			this.datGui = new dat.GUI();
			
			// prepare stats
			this.stats = new Stats();
			$("body").prepend(this.stats.domElement);
			env.loop.add(this.stats, this.stats.update);

			this.loop = env.loop;
			
			this.canvas = new Canvas({canvasId: "bloobCanvas" + this.id});
			this.audio = new Audio();
		}
	});

	Game.nextGameID = 0;
	
	return Game;
});
