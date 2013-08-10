Bloob.MapScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.loop = loop;
	
	this.map = new Bloob.Map().initDatGui(game.datGui);
	this.logic = this.map.logic;
	this.world = this.map.world;
	
	this.camera = new Bloob.Camera(
		this.canvas,
		this.logic,
		this.world,
		this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
	);
	this.renderer = new DebugDraw(this.canvas, this.camera)
		.setObjectToDraw(this.world);
	this.camera.update();

	// mouseInteraction
	this.mouse = this.initMouseInteraction();
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

// TODO: rename to onReady
Bloob.MapScene.prototype.onMapLoaded = function(callback) {
	this.map.onBuildFinished(callback);
	return this;
};

Bloob.MapScene.prototype.loadMap = function(mapToLoadName) {
	this.map.build(mapToLoadName);
	return this;
};

Bloob.MapScene.prototype.initMouseInteraction = function() {
	var tecDragBody = Bloob.InteractionHandler.Builder.buildDragBodyInWorld(this.world, this.camera);
	var tecSpawnCube = Bloob.InteractionHandler.Builder.buildSpawnCubeInWorld(this.world, this.camera);
	var tecSelectBody = Bloob.InteractionHandler.Builder.buildSelectBodyInWorld(this.world, this.camera);
	var tecPauseScene = Bloob.InteractionHandler.Builder.buildPauseScene(this);
	var tecCallCallback = new Bloob.InteractionHandler()
		.name("CALL_CALLBACK")
		.onPressed(function() {
			Scarlet.log("hallo");
		});
	var tecChangeMap = new Bloob.InteractionHandler()
		.name("CHANGE_MAP")
		.onPressed(function() {
			Scarlet.log("CHANGE_MAP");
		});
	
	var interactionTechniquesforDatGui = [
		tecDragBody,
		tecSpawnCube,
		tecSelectBody,
		tecPauseScene,
		tecCallCallback,
		tecChangeMap
	];

	var mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(tecDragBody)
		.onRightClick(tecSpawnCube)
		.initDatGui(this.game.datGui, interactionTechniquesforDatGui);

	return mouse;
};
