Bloob.Game = function() {
	this.config = Bloob.Config.read();
	this.init();
};

Bloob.Game.prototype.init = function() {
	// prepare stats
	this.stats = new Stats();
	$("body").prepend(this.stats.domElement);
	
	// Configure and start the game loop.
	this.loop = new Bloob.Loop()
		.clear()
		.add(this.stats, this.stats.update)
		.start();

	this.canvas = new Bloob.Canvas();

	var mapScene1 = new Bloob.MapScene(this, this.loop).loadAndRun("MapToTestLoading");
};
