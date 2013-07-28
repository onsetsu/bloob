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
	this.canvas = new Bloob.Canvas();
	this.renderer = new DebugDraw(this.world, this.canvas);
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
	
	this.loop = new Bloob.Loop();

	var callback = Bloob.Utils.bind(this.start, this);
	this.map
		.onBuildFinished(callback)
		.build("MapToTestLoading");
};

// Configure and start the game loop.
Bloob.Game.prototype.start = function() {
	Bloob.MapBuilder.setUpTestMap(this);
	this.map.spawnPlayerAt(this);
	
	this.loop
		.clear()
		.add(this.stats, this.stats.update)
		// entities/map
		.add(this.world, this.world.update)
		.add(this.logic, this.logic.update)
		// rendering
		.add(this.camera, this.camera.update)
		.add(this.renderer, this.renderer.draw)
		// interaction
		.add(this.mouse, this.mouse.update)
		.start();
	
	// TODO: remove this
	this.mouse.loop = this.loop;
};

Bloob.Game.prototype.stop = function() {
	this.loop.stop();
};
