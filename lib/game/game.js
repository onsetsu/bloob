Bloob.Game = function() {
	this.config = Bloob.Config.read();
	this.init();
};

Bloob.Game.prototype.init = function() {
	// prepare stats
	this.stats = new Stats();
	$("body").prepend(this.stats.domElement);
	
	this.loop = new Bloob.Loop()
		.clear()
		.add(this.stats, this.stats.update)
		.start();

	this.canvas = new Bloob.Canvas();

	this.mapScene1 = new Bloob.MapScene(this, this.loop);

	// TODO: move loading and callback to MapScene
	var callback = Bloob.Utils.bind(this.start, this);
	this.mapScene1.map
		.onBuildFinished(callback)
		.build("MapToTestLoading");
};

// Configure and start the game loop.
Bloob.Game.prototype.start = function() {
	Bloob.MapBuilder.setUpTestMap(this.mapScene1);
	this.mapScene1.map.spawnPlayerAt(this.mapScene1);
	
	this.loop
		.add(this.mapScene1, this.mapScene1.update);
};

Bloob.Game.prototype.stop = function() {
	this.loop.stop();
};
