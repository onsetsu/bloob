Bloob.EditorScene = function(game, loop) {
	Bloob.MapScene.apply(this, arguments);
};

//inheritance
var chain = function() {};
chain.prototype = Bloob.MapScene.prototype;
Bloob.EditorScene.prototype = new chain();
// enable static method inheritance
Bloob.EditorScene.__proto__ = Bloob.MapScene;
Bloob.EditorScene.prototype.constructor = chain;
Bloob.EditorScene.prototype.parent = Bloob.MapScene.prototype;

Bloob.EditorScene.prototype.update = function(timePassed) {
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
