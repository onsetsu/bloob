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
			var tecPlaySound = new InteractionHandler()
				.name("PLAY_SOUND")
				.context({
					sound: new Sound(this.game.audio, "data/audio/sounds/test/cursor_sounds/water-bubble-high.wav")
				})
				.onPressed(function(timePassed, mouse) {
					this.sound.play();
				});
			var tecDragBody = Builder.buildDragBodyInWorld(this.getWorld(), this.camera);
			var tecSpawnCube = Builder.buildSpawnCubeInWorld(this.getWorld(), this.camera);
			var tecSelectBody = Builder.buildSelectBodyInWorld(this.getWorld(), this.camera);
			var tecPauseScene = Builder.buildPauseScene(this);
			var tecCallCallback = new InteractionHandler()
				.name("CALL_CALLBACK")
				.onPressed(function() {
					console.log("hallo");
				});
			var tecChangeMap = new InteractionHandler()
				.name("CHANGE_MAP")
				.onPressed(function() {
					console.log("CHANGE_MAP");
				});
			var tecCreateGroundBody = new InteractionHandler()
				.name("CREATE_GROUND_BODY")
				.context({
					world: this.getWorld(),
					camera: this.camera,
					shape: new Jello.ClosedShape().begin().addVertex(Jello.Vector2.Zero.copy()),
					counter: 0
				})
				.onPressed(function(timePassed, mouse) {
					var maxEdges = 4;
					if(this.counter == 0)
						this.shape = new Jello.ClosedShape().begin();
					if(this.counter < maxEdges) {
						this.shape.addVertex(this.camera.screenToWorldCoordinates(mouse.input.mouse));
						this.counter++;
					}
					else
					{
						Jello.BodyFactory.createBluePrint(Jello.SpringBody)
							.world(this.world)
							.shape(this.shape.finish())
							.pointMasses(1)
							.translate(this.camera.screenToWorldCoordinates(mouse.input.mouse))
							.rotate(0)
							.scale(Jello.Vector2.One.copy())
							.isKinematic(false)
							.edgeSpringK(300.0)
							.edgeSpringDamp(5.0)
							.shapeSpringK(150.0)
							.shapeSpringDamp(5.0)
							.addInternalSpring(0, 2, 300, 10)
							.addInternalSpring(1, 3, 300, 10)
							.build();
						
						this.counter = 0;
					}
				});
			var interactionTechniquesforDatGui = [
				tecPlaySound,
				tecDragBody,
				tecSpawnCube,
				tecSelectBody,
				tecPauseScene,
				tecCallCallback,
				tecChangeMap,
				tecCreateGroundBody
			];
	
			this.mouse
				.onLeftClick(tecDragBody)
				.onRightClick(tecPlaySound)
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
