mini.Module(
	"bloob/scenes/mapscene"
)
.requires(
	"engine/scene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/interactionhandlerbuilder",
	"basic/mapbuilder",
	"engine/map/map",
	"engine/camera",
	"basic/audio/sound",
	"rendering/debugdraw/debugdraw"
)
.defines(function(
	Scene,
	Mouse,
	Utils,
	InteractionHandler,
	Builder,
	MapBuilder,
	Map,
	Camera,
	Sound,
	DebugDraw
) {
	var MapScene = Scene.subclass({
		initialize: function(game, loop) {
			Scene.prototype.initialize.apply(this, arguments);
			
			this.datGuiFolder = game.datGui.addFolder(this.sceneID);
			this.datGuiFolder.open();
			this.datGuiFolder.add(this, "testChangeMap").name('change map');
			
			this.game = game;
			this.canvas = this.game.canvas;
			this.loop = loop;
			
			this.map = new Map().initDatGui(this.datGuiFolder);
			//this._world = this.map.getWorld();
			
			// choose, which height is projected from top of canvas to its bottom
			var heightToProject = 40; // or use world boundings: this.getWorld().mWorldLimits.Max.y - this.getWorld().mWorldLimits.Min.y;
			var desiredHeight = heightToProject * this.canvas.canvasHeight / this.canvas.canvasHeight;
			var desiredWidth = heightToProject * this.canvas.canvasWidth / this.canvas.canvasHeight;
			this.camera = new Camera(
				this.canvas,
				desiredHeight,
				desiredWidth
			);
			
			this.renderer = new DebugDraw(this.canvas, this.camera)
				.setObjectToDraw(this.map);

			// mouseInteraction
			//this.mouse = this.initMouseInteraction();
			this.mouse = new Mouse(this.game.canvas);
		},

		getWorld: function() {
			return this.map.getWorld();
		},

		update: function(timePassed) {
			// entities/map
			this.map.update(timePassed);
			// rendering
			this.camera.update(timePassed);
			this.renderer.draw(timePassed);
			// interaction
			this.mouse.update(timePassed);
		},
	
		loadMap: function(mapToLoadName, callback) {
			this.map.build(mapToLoadName, callback);
			return this;
		},
	
		initMouseInteraction: function() {
			var tecDragBody = Builder.buildDragBodyInWorld(this.getWorld(), this.camera);
			var tecSpawnCube = Builder.buildSpawnCubeInWorld(this.getWorld(), this.camera);
			var tecSelectBody = Builder.buildSelectBodyInWorld(this.getWorld(), this.camera);

			var interactionTechniquesforDatGui = [
				tecDragBody,
				tecSpawnCube,
				tecSelectBody
			];
	
			this.mouse
				.onLeftClick(tecDragBody)
				.onRightClick(tecDragBody)
				.initDatGui(this.datGuiFolder, interactionTechniquesforDatGui);
	
			return this.mouse;
		},
	
		testChangeMap: function() {
			console.log(arguments);
			this.game.datGui.removeFolder(this.sceneID);
			this.stop();
	
			var newMapScene = new MapScene(this.game, this.loop);
			newMapScene.loadMap(
				this.game.config.startLevel,
				Utils.bind(function blubmapLoaded() {
					MapBuilder.setUpTestMap(this);
					this.map.spawnPlayerAt(this, newMapScene.datGuiFolder);
					this.initMouseInteraction();
					this.run();
				}, newMapScene)
			);
		}
	});
	
	return MapScene;
});
