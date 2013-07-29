Bloob.Scene = function() {
	
};

Bloob.MapScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.loop = loop;
	
	this.map = new Bloob.Map();
	this.logic = this.map.logic;
	this.world = this.map.world;
	
	this.camera = new Bloob.Camera(
			this.canvas,
			this.logic,
			this.world,
			this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
		);
	this.renderer = new DebugDraw(this.world, this.canvas, this.camera);
	this.camera.update();

	// mouseInteraction
	this.mouse = new Bloob.Mouse(this.world, this.camera)
		.onLeftClick("DRAG_BODY")
		.onRightClick("SPAWN_CUBE");

	// TODO: remove this (call stop on Scene)
	this.mouse.loop = this.loop;
};

//inheritance
var chain = function() {};
chain.prototype = Bloob.Scene.prototype;
Bloob.MapScene.prototype = new chain();
// enable static method inheritance
Bloob.MapScene.__proto__ = Bloob.Scene;
Bloob.MapScene.prototype.constructor = chain;
Bloob.MapScene.prototype.parent = Bloob.Scene.prototype;

Bloob.MapScene.prototype.update = function(timePassed) {
	// entities/map
	this.world.update(timePassed);
	this.logic.update(timePassed);
	// rendering
	this.camera.update(timePassed);
	this.renderer.draw(timePassed);
	// interaction
	this.mouse.update(timePassed);
};

Bloob.MapScene.prototype.loadAndRun = function(mapToLoadName) {
	var callback = Bloob.Utils.bind(this.mapLoaded, this);
	this.map
		.onBuildFinished(callback)
		.build(mapToLoadName);

	return this;
};

Bloob.MapScene.prototype.mapLoaded = function() {
	Bloob.MapBuilder.setUpTestMap(this);
	this.map.spawnPlayerAt(this);
	
	this.loop.add(this, this.update);
};

Bloob.MapScene.prototype.stop = function() {
	// TODO: Stop differently
	this.loop.stop();
};
