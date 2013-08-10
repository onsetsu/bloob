Bloob.Game = function(config) {
	this.config = config || Bloob.Config.getDefault();
	this.id = Bloob.Game.nextGameID++;
	Scarlet.log("NEW GAME: " + this.id);
	this.init();
};

Bloob.Game.nextGameID = 0;

Bloob.Game.prototype.init = function() {
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

	var titleScene = new Bloob.TitleScene(this, this.loop).run();
};
