mini.Module(
		"game/game"
)
.requires(
		"game/loop",
		"engine/config",
		"basic/canvas",
		"basic/audio/audio",
		"scenes/titlescene"
)
.defines(function(Loop, Config, Canvas, Audio, TitleScene) {
	var Game = function(configuration) {
		this.config = configuration || Config.getDefault();
		this.id = Game.nextGameID++;
		console.log("NEW GAME: " + this.id);
		this.init();
	};

	Game.nextGameID = 0;

	Game.prototype.init = function() {
		// prepare datGui
		this.datGui = new dat.GUI();

		// prepare stats
		this.stats = new Stats();
		$("body").prepend(this.stats.domElement);
		
		// Configure and start the game loop.
		this.loop = new Loop()
			.clear()
			.add(this.stats, this.stats.update)
			.start();

		this.canvas = new Canvas({canvasId: "bloobCanvas" + this.id});
		this.audio = new Audio(this);

		var titleScene = new TitleScene(this, this.loop).run();
	};
	
	return Game;
});
