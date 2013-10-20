mini.Module(
	"engine/game"
)
.requires(
	"engine/loop",
	"basic/audio/audio",
	"basic/audio/music",
	"basic/audio/sound"
)
.defines(function(Loop, Audio, Track, Sound) {
	var Game = mini.Class.subclass({
		initialize: function() {
			console.log("NEW GAME");

			// prepare datGui
			this.datGui = new dat.GUI();
			
			// prepare stats
			this.stats = new Stats();
			$("body").prepend(this.stats.domElement);
			env.loop.add(this.stats, this.stats.update);
		}
	});
	
	return Game;
});
