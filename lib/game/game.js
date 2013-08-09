Bloob.Game = function(config) {
	this.config = config || Bloob.Config.getDefault();
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

	var titleScene = new Bloob.TitleScene(this, this.loop).run();
};
