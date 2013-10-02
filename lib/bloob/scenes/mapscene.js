mini.Module(
		"bloob/scenes/mapscene"
)
.requires(
		"engine/scene"
)
.defines(function(Scene) {
	var MapScene = Scene.subclass({
		initialize: function(game, loop) {
			Scene.prototype.initialize.apply(this, arguments);
			
			this.datGuiFolder = game.datGui.addFolder(this.sceneID);
			this.datGuiFolder.open();
			this.datGuiFolder.add(this, "testChangeMap").name('change map');
			
			this.game = game;
			this.canvas = this.game.canvas;
			this.loop = loop;
			
			this.map = new Bloob.Map().initDatGui(this.datGuiFolder);
			this.world = this.map.world;
			
			this.camera = new Bloob.Camera(
				this.canvas,
				this.world,
				this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
			);
			this.renderer = new DebugDraw(this.canvas, this.camera)
				.setObjectToDraw(this.world);
			this.camera.update();

			// mouseInteraction
			this.mouse = this.initMouseInteraction();
		},


		update: function(timePassed) {
			// entities/map
			this.world.update(timePassed);
			// rendering
			this.camera.update(timePassed);
			this.renderer.draw(timePassed);
			// interaction
			this.mouse.update(timePassed);
		},
	
		// TODO: rename to onReady
		onMapLoaded: function(callback) {
			this.map.onBuildFinished(callback);
			return this;
		},
	
		loadMap: function(mapToLoadName) {
			this.map.build(mapToLoadName);
			return this;
		},
	
		initMouseInteraction: function() {
			var tecPlaySound = new Bloob.InteractionHandler()
				.name("PLAY_SOUND")
				.context({
					sound: new Bloob.Sound(this.game.audio, "data/audio/sounds/test/cursor_sounds/water-bubble-high.wav")
				})
				.onPressed(function(timePassed, mouse) {
					this.sound.play();
				});
			var tecDragBody = Bloob.InteractionHandler.Builder.buildDragBodyInWorld(this.world, this.camera);
			var tecSpawnCube = Bloob.InteractionHandler.Builder.buildSpawnCubeInWorld(this.world, this.camera);
			var tecSelectBody = Bloob.InteractionHandler.Builder.buildSelectBodyInWorld(this.world, this.camera);
			var tecPauseScene = Bloob.InteractionHandler.Builder.buildPauseScene(this);
			var tecCallCallback = new Bloob.InteractionHandler()
				.name("CALL_CALLBACK")
				.onPressed(function() {
					console.log("hallo");
				});
			var tecChangeMap = new Bloob.InteractionHandler()
				.name("CHANGE_MAP")
				.onPressed(function() {
					console.log("CHANGE_MAP");
				});
			var tecCreateGroundBody = new Bloob.InteractionHandler()
				.name("CREATE_GROUND_BODY")
				.context({
					world: this.world,
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
	
			var mouse = new Bloob.Mouse(this.game.canvas)
				.onLeftClick(tecDragBody)
				.onRightClick(tecPlaySound)
				.initDatGui(this.datGuiFolder, interactionTechniquesforDatGui);
	
			return mouse;
		},
	
		testChangeMap: function() {
			console.log(arguments);
			this.game.datGui.removeFolder(this.sceneID);
			this.stop();
	
			var newMapScene = new MapScene(this.game, this.loop);
			newMapScene
				.onMapLoaded(
					Bloob.Utils.bind(function blubmapLoaded() {
						Bloob.MapBuilder.setUpTestMap(this);
						this.map.spawnPlayerAt(this, newMapScene.datGuiFolder);
						this.run();
					}, newMapScene)
				)
				.loadMap(this.game.config.startLevel);
		}
	});
	
	return MapScene;
});
