mini.Module(
		"game/game"
)
.requires(
		"game/loop",
		"engine/config",
		"scenes/titlescene"
)
.defines(function(Loop, Config, TitleScene) {
	var Game = function(configuration) {
		this.config = configuration || Config.getDefault();
		this.id = Bloob.Game.nextGameID++;
		Scarlet.log("NEW GAME: " + this.id);
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
		this.loop = new Bloob.Loop()
			.clear()
			.add(this.stats, this.stats.update)
			.start();

		this.canvas = new Bloob.Canvas({canvasId: "bloobCanvas" + this.id});
		this.audio = new Bloob.Audio(this);

		var titleScene = new TitleScene(this, this.loop).run();
	};

	Bloob.Game = Game;
	
	return Game;
});
