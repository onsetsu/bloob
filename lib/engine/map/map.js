mini.Module(
	"engine/map/map"
)
.requires(
	"engine/input",
	"assets/loader",
	"assets/converter/fromjson/jsontomapconverter",
	"basic/utils",
	"basic/shapebuilder",
	"logic/bodyenhancement",
	"basic/interactionhandler",
	"basic/interactionhandlerbuilder",
	"engine/map/layer"
)
.defines(function(
	Input,
	Loader,
	JsonToMapConverter,
	Utils,
	ShapeBuilder,
	BodyEnhancement,
	InteractionHandler,
	Builder,
	Layer
) {
	// Repository of loaded json-maps
	var MapRepository = {};

	var Map = mini.Class.subclass({
		initialize: function() {
			this.callbacks = [];
			this.layers = [];
		},
		
		getWorld: function() {
			if(typeof this.layers[0].world === "undefined")
				throw new Error("no world found");
			
			return this.layers[0].world;
		},
	
		build: function(mapName, callback) {
			callback = callback || function() {};
			// TODO: look, if already fetched from server (implemented by assetmanager)
			// if so: convert json to map and call callbacks
			// load otherwise
			Loader.loadMap(
				mapName,
				Utils.bind(
					function(json) {
						// convert given json to map
						JsonToMapConverter.convertJsonToMap(json, this);
						
						// fire callback
						callback(this);
					},
					this
				)
			);
			
			return this;
		},
		
		update: function(timePassed) {
			for(var index in this.layers)
				this.layers[index].update(timePassed);
		},
		
		draw: function() {
			
		},
		
		debugDraw: function(debugDraw) {
			for(var index in this.layers)
				this.layers[index].debugDraw(debugDraw);
		},
		
		addLayer: function(layer) {
			this.layers.push(layer);
		},
		
		spawnPlayerAt: function(scene, datGui) {
			/*
			 *  controllable blob:
			 */
			var pb = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(scene.getWorld())
				.shape(ShapeBuilder.Shapes.Ball)
				.pointMasses(1.0)
				.translate(new Jello.Vector2(-25, 15))
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(20.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(1.0)
				.gasPressure(100.0)
				.build();
			
			var foo = datGui.add(pb, 'mGasAmount').name('gasPressure').min(0).max(5000).listen().step(1);
			
			pb.aName = "Player";
			var input = new Input(scene.renderer.canvasId);
			input.initKeyboard();
			input.bind(Input.KEY.LEFT_ARROW, "left");
			input.bind(Input.KEY.RIGHT_ARROW, "right");
			input.bind(Input.KEY.UP_ARROW, "up");
			input.bind(Input.KEY.DOWN_ARROW, "down");
			input.bind(Input.KEY.DOWN_ARROW, "compress");
	
			pb.withUpdate(function(x) {
				if(input.state("left")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(-3, 0));
					this.addGlobalRotationForce(10);
				} else if(input.state("right")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(3, 0));
					this.addGlobalRotationForce(-10);
				} else if(input.state("up")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, 3));
				} else if(input.state("down")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, -3));
				};
				if(input.pressed("compress")) {
					this.setGasPressure(this.getGasPressure() / 10);
					this.setShapeMatchingConstants(250, 5);
				} else if(input.released("compress")) {
					this.setGasPressure(this.getGasPressure() * 10);
					this.setShapeMatchingConstants(150, 1);
				};
				input.clearPressed();
			});
	
			// make blob sticky
			// new BodyEnhancement(pb).makeSticky(datGui);
	
			// track camera focus on blob
			scene.camera.track(pb);
		},
		
		initDatGui: function(datGui) {
			var mapFolder = datGui.addFolder('Map');
			mapFolder.open();
			for(var index in this.layers)
				this.layers[index].initDatGui(mapFolder, index);
			
			return this;
		},
		
		initMouseInteractionMap: function(mouse, camera, datGuiFolder) {
			var tecDragBody = Builder.buildDragBodyInWorld(this.getWorld(), camera);
			var tecSpawnCube = Builder.buildSpawnCubeInWorld(this.getWorld(), camera);
			var tecSelectBody = Builder.buildSelectBodyInWorld(this.getWorld(), camera);

			var interactionTechniquesforDatGui = [
				tecDragBody,
				tecSpawnCube,
				tecSelectBody
			];
	
			mouse
				.onLeftClick(tecDragBody)
				.onRightClick(tecDragBody)
				.initDatGui(datGuiFolder, interactionTechniquesforDatGui);
	
			return mouse;
		},
		
		initMouseInteractionEditor: function(mouse, camera, datGuiFolder) {
			var that = this;
			
			// interaction techniques
			var setSpawnPoint = new InteractionHandler();
			var createBody = new InteractionHandler()
				.name("CREATE BODY")
				.onPressed(function(timePassed, mouse) {
					Jello.BodyFactory.createBluePrint(Jello.SpringBody)
						.world(that.getWorld())
						.shape(new Jello.ClosedShape()
							.begin()
							.addVertex(new Jello.Vector2(-1, -1))
							.addVertex(new Jello.Vector2(-1,  1))
							.addVertex(new Jello.Vector2( 1,  1))
							.addVertex(new Jello.Vector2( 1, -1))
							.finish())
						.pointMasses(1)
						.translate(camera.screenToWorldCoordinates(mouse.input.mouse))
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
				});
			var moveBody = new InteractionHandler()
				.name("MOVE BODY")
				.context({
					"camera": camera,
					"world": this.getWorld(),
					"body": undefined,
					"screenStartCoordinates": Jello.Vector2.Zero.copy(),
					"screenCurrentCoordinates": Jello.Vector2.Zero.copy()
				})
				.onPressed(function(timePassed, mouse) {
					// remenber body to move
					var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
					this.body = this.world.getBody(answer.bodyId);
					
					// remember start coordinate
					this.screenStartCoordinates.set(mouse.input.mouse);
					this.screenCurrentCoordinates = this.screenStartCoordinates.copy();
				})
				.onState(function(timePassed, mouse) {
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
			var deleteBody = new InteractionHandler()
				.name("DELETE BODY")
				.context({
					"camera": camera,
					"world": this.getWorld()
				})
				.onPressed(function(timePassed, mouse) {
					var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
					var body = this.world.getBody(answer.bodyId);
					this.world.removeBody(body);
				});
			var createPointMass = new InteractionHandler()
				.name("CREATE POINT MASS")
				.context({
					"camera": camera,
					"world": this.getWorld()
				})
				.onPressed(function(timePassed, mouse) {
					var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
					console.log(answer);
					var body = this.world.getBody(answer.bodyId);
					var baseShape = body.getBaseShape();
					body.setShape(baseShape.addVertex(new Jello.Vector2(0,0)));
				});
			var movePointMass = new InteractionHandler()
				.name("MOVE POINT MASS")
				.context({
					"camera": camera,
					"world": this.getWorld(),
					"body": undefined,
					"pointMassId": 0,
					"screenCurrentCoordinates": Jello.Vector2.Zero.copy()
				})
				.onPressed(function(timePassed, mouse) {
					var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
					this.body = this.world.getBody(answer.bodyId);
					this.pointMassId = answer.pointMassId;
					
					// remember current coordinates
					this.screenCurrentCoordinates.set(mouse.input.mouse);
				})
				.onState(function(timePassed, mouse) {
					var angleInRadians = -this.body.getDerivedAngle();
					var cursorOffsetInWorld = Jello.VectorTools.rotateVector(
						this.camera.screenToWorldCoordinates(mouse.input.mouse)
							.sub(this.camera.screenToWorldCoordinates(this.screenCurrentCoordinates)),
						Math.cos(angleInRadians),
						Math.sin(angleInRadians)
					).divVector(this.body.getScale());
					
					var baseShape = this.body.getBaseShape();
					baseShape.getVertices()[this.pointMassId].addSelf(cursorOffsetInWorld);
					this.body.setShape(baseShape, true);
					
					// remember current coordinates
					this.screenCurrentCoordinates.set(mouse.input.mouse);

					// adjustments for rendering
					this.body.updateAABB(0, true);
				});
			var deletePointMass = new InteractionHandler()
				.name("DELETE POINT MASS")
				.context({
					"camera": camera,
					"world": this.getWorld()
				})
				.onPressed(function(timePassed, mouse) {
					var answer = this.world.getClosestPointMass(this.camera.screenToWorldCoordinates(mouse.input.mouse));
					var body = this.world.getBody(answer.bodyId);
					var pointMassId = answer.pointMassId;
					var baseShape = body.getBaseShape();
					// do not delete the last point mass
					if(baseShape.getVertices().length > 1) {
						baseShape.mLocalVertices.splice( pointMassId, 1 );
						body.setShape(baseShape);
					};
				});
			var moveCamera = new InteractionHandler()
				.name("MOVE CAMERA")
				.context({
					"camera": camera,
					"screenStartCoordinates": Jello.Vector2.Zero.copy(),
					"screenCurrentCoordinates": Jello.Vector2.Zero.copy()
				})
				.onPressed(function(timePassed, mouse) {
					// init start position and current position to the same value
					this.screenStartCoordinates = new Jello.Vector2(
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

			var interactionTechniquesforDatGui = [
				setSpawnPoint,
				createBody,
				moveBody,
				deleteBody,
				createPointMass,
				movePointMass,
				deletePointMass,
				// TODO: create, delete Springs
				moveCamera
			];

			mouse
				.onLeftClick(movePointMass)
				.onRightClick(moveBody)
				.initDatGui(datGuiFolder, interactionTechniquesforDatGui);
			
			return mouse;
		},
		
		initDatGui: function(datGui) {
			var mapFolder = datGui.addFolder('Map');
			mapFolder.open();
			for(var index in this.layers)
				this.layers[index].initDatGui(mapFolder, index);
			
			return this;
		}
	});

	// TODO: move to JsonToMapConverter
	//add convenient method
	Map.fromJson = function(mapJson, map) {
		map = map || new Map();

		return JsonToMapConverter.convertJsonToMap(mapJson, map);
	};
	
	return Map;
});
