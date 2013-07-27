Bloob.Game = function() {
	this.config = Bloob.Config.read();
	this.init();
};

Bloob.Game.prototype.init = function() {
	// prepare stats
	this.stats = new Stats();
	$("body").prepend(this.stats.domElement);

	this.map = new Bloob.Map();
	this.logic = this.map.logic;
	this.world = this.map.world;
	this.renderer = new DebugDraw(this.world);
	this.camera = new Bloob.Camera(
		this.renderer,
		this.logic,
		this.world,
		this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
	);
	this.camera.update();
	
	// mouseInteraction
	this.mouse = new Bloob.Mouse(this.world, this.renderer)
		.onLeftClick("DRAG_BODY")
		.onRightClick("SPAWN_CUBE");
	
	this.loop = new Scarlet.Loop();

	var that = this;
	var callback = function firstMapLoaded() { that.start.call(that); };
	this.map
		.onBuildFinished(callback)
		.build("MapToTestLoading");
};

Bloob.Game.prototype.update = function(timePassed) {
	var that = this;
	timePassed = 1/60;
	this.stats.update();
	
	// entities
	this.world.update(timePassed);
	this.logic.update(timePassed);
	
	// rendering
	this.camera.update();
	this.renderer.draw();

	// interaction
	this.mouse.update(timePassed);
};

// Start the game loop.
Bloob.Game.prototype.start = function() {
	Bloob.MapBuilder.setUpTestMap(this);

	var that = this;
	var fn = function(timePassed) {
		that.update.call(that, timePassed);
	};
	this.__loopId__ = this.loop.start(fn);
};

Bloob.Game.prototype.stop = function() {
	this.loop.stop(this.__loopId__);
};



var Utils = {
	"fillArray": function(value, length) {
		arr = [];
		for(var i = 0; i < length; i++)
			arr.push(value);
		return arr;
	}
};
