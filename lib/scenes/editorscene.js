Bloob.EditorScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.datGuiFolder = game.datGui.addFolder(this.sceneID);
	this.datGuiFolder.open();
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.loop = loop;
	
	this.map = new Bloob.Map().initDatGui(this.datGuiFolder);
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
Bloob.EditorScene.prototype = new chain();
// enable static method inheritance
Bloob.EditorScene.__proto__ = Bloob.Scene;
Bloob.EditorScene.prototype.constructor = chain;
Bloob.EditorScene.prototype.parent = Bloob.Scene.prototype;

Bloob.EditorScene.prototype.update = function(timePassed) {
	this.mouse.update(timePassed);
};

Bloob.EditorScene.prototype.update = function(timePassed) {
	// entities/map
	this.world.update(timePassed);
	this.logic.update(timePassed);
	// rendering
	this.camera.update(timePassed);
	this.renderer.draw(timePassed);
	// interaction
	this.mouse.update(timePassed);
};

Bloob.EditorScene.prototype.initMouseInteraction = function() {
	var that = this;
	var goToMapTechnique = new Bloob.InteractionHandler()
		.onPressed(function() {
			Scarlet.log("TITLE PRESSED");
			that.stop();
			
			var newMapScene = new Bloob.MapScene(that.game, that.loop);
			newMapScene
				.onMapLoaded(
					Bloob.Utils.bind(function blubmapLoaded() {
						Bloob.MapBuilder.setUpTestMap(this);
						this.map.spawnPlayerAt(this, this.datGuiFolder);
						this.run();
					}, newMapScene)
				)
				.loadMap(that.game.config.startLevel);
		});
	
	var tecCallCallback = new Bloob.InteractionHandler()
		.name("CALL_CALLBACK")
		.onPressed(function() {
			Scarlet.log("hallo");
		});

	var interactionTechniquesforDatGui = [
		goToMapTechnique,
		tecCallCallback
	];

	var mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(goToMapTechnique)
		.onRightClick(tecCallCallback)
		.initDatGui(this.datGuiFolder, interactionTechniquesforDatGui);

	return mouse;
};
