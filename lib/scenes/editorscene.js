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
	
	// interaction techniques
	var setSpawnPoint = new Bloob.InteractionHandler();
	var createBody = new Bloob.InteractionHandler()
		.name("CREATE BODY")
		.onPressed(function(timePassed, mouse) {
			Bloob.BodyFactory.createBluePrint(SpringBody)
				.world(that.world)
				.shape(Bloob.ShapeBuilder.Shapes.Cube)
				.pointMasses(1)
				.translate(that.camera.screenToWorldCoordinates(mouse.input.mouse))
				.rotate(0)
				.scale(Vector2.One.copy())
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(5.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(5.0)
				.addInternalSpring(0, 2, 300, 10)
				.addInternalSpring(1, 3, 300, 10)
				.build();
		});
	var moveBody = new Bloob.InteractionHandler()
		.name("MOVE BODY")
		.context({
			"camera": this.camera,
			"world": this.world,
			"body": undefined,
			"screenStartCoordinates": Vector2.Zero.copy(),
			"screenCurrentCoordinates": Vector2.Zero.copy()
		})
		.onPressed(function() {
			// remenber body to move
			var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
			this.body = this.world.getBody(answer.bodyId);
			
			// remember start coordinate
			this.screenStartCoordinates.set(mouse.input.mouse);
			this.screenCurrentCoordinates = this.screenStartCoordinates.copy();

		})
		.onState(function() {
			if(typeof this.body !== "undefined") {
				// add the offset to the previous step of the cursor
				// to the body position (translated in world coordinates)
				var cursorOffsetInWorld = this.camera.screenToWorldCoordinates(mouse.input.mouse)
					.sub(this.camera.screenToWorldCoordinates(this.screenCurrentCoordinates));
				var pos = this.body.getDerivedPosition().copy().add(cursorOffsetInWorld);
				var angleInRadians = this.body.getDerivedAngle();
				var scale = this.body.getScale();
				
				// actual update of position (leave angle and scale unchanged)
				this.body.setPositionAngle(pos, angleInRadians, scale);

				// remember current coordinates
				this.screenCurrentCoordinates.set(mouse.input.mouse);

				// adjustments for rendering
				this.body.updateAABB(0, true);
			};
		});
	var deleteBody = new Bloob.InteractionHandler();
	var createPointMass = new Bloob.InteractionHandler();
	var movePointMass = new Bloob.InteractionHandler();
	var deletePointMass = new Bloob.InteractionHandler();
	var moveCamera = new Bloob.InteractionHandler()
		.name("MOVE CAMERA")
		.context({
			"camera": this.camera,
			"screenStartCoordinates": Vector2.Zero.copy(),
			"screenCurrentCoordinates": Vector2.Zero.copy()
		})
		.onPressed(function(timePassed, mouse) {
			// init start position and current position to the same value
			this.screenStartCoordinates = new Vector2(
					mouse.input.mouse.x,
					mouse.input.mouse.y
				);
			this.screenCurrentCoordinates = this.screenStartCoordinates.copy();
		})
		.onState(function(timePassed, mouse) {
			// retranslate back to starting point
			this.camera.translateBy(
				this.camera.screenToWorldCoordinates(this.screenCurrentCoordinates).sub(
					this.camera.screenToWorldCoordinates(this.screenStartCoordinates)
				)
			);
			// update current coordinates
			this.screenCurrentCoordinates.set(mouse.input.mouse);
			// actual translation from starting point
			this.camera.translateBy(
				this.camera.screenToWorldCoordinates(this.screenStartCoordinates).sub(
					this.camera.screenToWorldCoordinates(this.screenCurrentCoordinates)
				)
			);
		});
	var goToMapTechnique = new Bloob.InteractionHandler()
		.name("TEST MAP")
		.onPressed(function() {
			Scarlet.log("Test MAP");
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
		setSpawnPoint,
		createBody,
		moveBody,
		deleteBody,
		createPointMass,
		movePointMass,
		deletePointMass,
		// create, delete Springs
		moveCamera,
		goToMapTechnique,
		tecCallCallback
	];

	var mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(moveBody)
		.onRightClick(moveCamera)
		.initDatGui(this.datGuiFolder, interactionTechniquesforDatGui);

	return mouse;
};
