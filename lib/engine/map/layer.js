mini.Module(
	"engine/map/layer"
)
.requires(
	"engine/map/entity",
	"basic/interactionhandler",
	"basic/interactionhandlerbuilder",
	"basic/mapbuilder",
	"assets/converter/fromjson/jsontoworldconverter"
)
.defines(function(
	Entity,
	InteractionHandler,
	Builder,
	MapBuilder,
	JsonToWorldConverter
) {
	var Layer = mini.Class.subclass({
		initialize: function(name) {
			this.name = name || "";
			this.entities = [];
			this.enabled = true;
			
			this.zIndex = 0;
			this.scrollFactor = Jello.Vector2.One.copy();
			this.scale = Jello.Vector2.One.copy();
		},
		
		// Update all entities.
		update: function() {
			if(this.enabled) {
				env.camera.pushLayer(this);
				env.renderer.updateCanvasWorldAABB();
				if(typeof this.world !== "undefined")
					this.world.update(1/60); // env.time.timePassed
				
				// TODO: adjust to use dedicated getter and setter
				// update Jiquid fluid system
				if(typeof this.fluidSystem !== "undefined")
					this.fluidSystem.update(); // env.time.timePassed

				for(var index in this.entities) {
					if(!this.entities.hasOwnProperty(index)) continue;
					
					this.entities[index].update();
				}
				env.camera.popLayer();
			}
		},

		draw: function(renderer) {
			if(this.enabled) {
				env.camera.pushLayer(this);
				env.renderer.updateCanvasWorldAABB();

				// TODO: adjust to use dedicated getter and setter
				// draw Jiquid fluid system
				if(typeof this.fluidSystem !== "undefined")
					this.fluidSystem.draw(renderer);

				// draw Entities
				for(var index in this.entities) {
					if(!this.entities.hasOwnProperty(index)) continue;
					
					this.entities[index].draw(renderer);
				}
				// reference rectangle
				renderer.setOptions({color: "darkgreen"});
				renderer.drawPolyline([
   					new Jello.Vector2(1, 1),
   					new Jello.Vector2(1, 25),
   					new Jello.Vector2(35, 25),
   					new Jello.Vector2(35, 1)
   				]);
				renderer.pushLayer(this);
				// test rectangle
				renderer.setOptions({color: "violet"});
				renderer.drawPolylineTEST([
					new Jello.Vector2(1, 1),
					new Jello.Vector2(1, 25),
					new Jello.Vector2(35, 25),
					new Jello.Vector2(35, 1)
				]);
				renderer.popLayer();
				env.camera.popLayer();
			}
		},

		debugDraw: function(debugDraw) {
			if(this.enabled) {
				env.camera.pushLayer(this);
				env.renderer.updateCanvasWorldAABB();
				env.renderer.pushLayer(this);

				for(var index in this.entities) {
					if(!this.entities.hasOwnProperty(index)) continue;

					this.entities[index].debugDraw(debugDraw);
				}

				if(typeof this.world !== "undefined")
					this.world.debugDraw(debugDraw);
				env.renderer.popLayer();
				env.camera.popLayer();
			}
		},

		setWorld: function(world) {
			this.world = world;
			if(typeof Editor === "undefined")
				MapBuilder.setUpTestMap(this, this.world);
			
			return this;
		},
		
		getWorld: function() {
			return this.world;
		},
		
		/*
		 * Manage Entities
		 */
		addEntity: function(entity) {
			this.entities.push(entity);

			return this;
		},
		
		getEntities: function() {
			return this.entities;
		},

		getEntityWithName: function(name) {
			return this.getEntitiesWithName(name)[0];
		},

		getEntitiesWithName: function(name) {
			return _.filter(this.entities, function(entity) {
				return entity.name == name;
			}, this);
		},

		getEntityWithTag: function(tag) {
			return this.getEntitiesWithTag(tag)[0];
		},

		getEntitiesWithTag: function(tag) {
			return _.filter(this.entities, function(entity) {
				return entity.hasTag(tag);
			}, this);
		},

		/*
		 * Interaction and debug
		 */
		initMouseInteractionMap: function(mouse, datGuiFolder) {
			if(typeof this.world === "undefined") return;
			var tecDragBody = Builder.buildDragBodyInWorld(this, this.world);
			var tecSpawnCube = Builder.buildSpawnCubeInWorld(this, this.world);
			var tecSelectBody = Builder.buildSelectBodyInWorld(this, this.world);

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
		
		// TODO: redo or remove
		initMouseInteractionEditor: function(mouse, datGuiFolder) {
			if(typeof this.world === "undefined") return;
			var that = this;
			
			// interaction techniques
			var setSpawnPoint = new InteractionHandler();
			
			var createBody = new InteractionHandler()
				.name("CREATE BODY")
				.onPressed(function() {
					Jello.BodyFactory.createBluePrint(Jello.SpringBody)
						.world(that.world)
						.shape(new Jello.ClosedShape()
							.begin()
							.addVertex(new Jello.Vector2(-1, -1))
							.addVertex(new Jello.Vector2(-1,  1))
							.addVertex(new Jello.Vector2( 1,  1))
							.addVertex(new Jello.Vector2( 1, -1))
							.finish())
						.pointMasses(1)
						.translate(env.camera.screenToWorldCoordinates(env.input.mouse))
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
					"world": this.world,
					"body": undefined,
					"screenStartCoordinates": Jello.Vector2.Zero.copy(),
					"screenCurrentCoordinates": Jello.Vector2.Zero.copy()
				})
				.onPressed(function() {
					// remenber body to move
					var answer = this.world.getClosestPointMass(env.camera.screenToWorldCoordinates(env.input.mouse));
					this.body = this.world.getBody(answer.bodyId);
					
					// remember start coordinate
					this.screenStartCoordinates.set(env.input.mouse);
					this.screenCurrentCoordinates = this.screenStartCoordinates.copy();
				})
				.onState(function() {
					if(typeof this.body !== "undefined") {
						// add the offset to the previous step of the cursor
						// to the body position (translated in world coordinates)
						var cursorOffsetInWorld = env.camera.screenToWorldCoordinates(env.input.mouse)
							.sub(env.camera.screenToWorldCoordinates(this.screenCurrentCoordinates));
						var pos = this.body.getDerivedPosition().copy().add(cursorOffsetInWorld);
						var angleInRadians = this.body.getDerivedAngle();
						var scale = this.body.getScale();
						
						// actual update of position (leave angle and scale unchanged)
						this.body.setPositionAngle(pos, angleInRadians, scale);

						// remember current coordinates
						this.screenCurrentCoordinates.set(env.input.mouse);

						// adjustments for rendering
						this.body.updateAABB(0, true);
					};
				});
			
			var deleteBody = new InteractionHandler()
				.name("DELETE BODY")
				.context({
					"world": this.world
				})
				.onPressed(function() {
					var answer = this.world.getClosestPointMass(env.camera.screenToWorldCoordinates(env.input.mouse));
					var body = this.world.getBody(answer.bodyId);
					this.world.removeBody(body);
				});
			
			var createPointMass = new InteractionHandler()
				.name("CREATE POINT MASS")
				.context({
					"world": this.world
				})
				.onPressed(function() {
					var answer = this.world.getClosestPointMass(env.camera.screenToWorldCoordinates(env.input.mouse));
					console.log(answer);
					var body = this.world.getBody(answer.bodyId);
					var baseShape = body.getBaseShape();
					body.setShape(baseShape.addVertex(new Jello.Vector2(0,0)));
				});
			
			var movePointMass = new InteractionHandler()
				.name("MOVE POINT MASS")
				.context({
					"world": this.world,
					"body": undefined,
					"pointMassId": 0,
					"screenCurrentCoordinates": Jello.Vector2.Zero.copy()
				})
				.onPressed(function() {
					var answer = this.world.getClosestPointMass(env.camera.screenToWorldCoordinates(env.input.mouse));
					this.body = this.world.getBody(answer.bodyId);
					this.pointMassId = answer.pointMassId;
					
					// remember current coordinates
					this.screenCurrentCoordinates.set(env.input.mouse);
				})
				.onState(function() {
					var angleInRadians = -this.body.getDerivedAngle();
					var cursorOffsetInWorld = Jello.VectorTools.rotateVector(
						env.camera.screenToWorldCoordinates(env.input.mouse)
							.sub(env.camera.screenToWorldCoordinates(this.screenCurrentCoordinates)),
						Math.cos(angleInRadians),
						Math.sin(angleInRadians)
					).divVector(this.body.getScale());
					
					var baseShape = this.body.getBaseShape();
					baseShape.getVertices()[this.pointMassId].addSelf(cursorOffsetInWorld);
					this.body.setShape(baseShape, true);
					
					// remember current coordinates
					this.screenCurrentCoordinates.set(env.input.mouse);

					// adjustments for rendering
					this.body.updateAABB(0, true);
				});
			
			var deletePointMass = new InteractionHandler()
				.name("DELETE POINT MASS")
				.context({
					"world": this.world
				})
				.onPressed(function() {
					var answer = this.world.getClosestPointMass(env.camera.screenToWorldCoordinates(env.input.mouse));
					var body = this.world.getBody(answer.bodyId);
					var pointMassId = answer.pointMassId;
					var baseShape = body.getBaseShape();
					// do not delete the last point mass
					if(baseShape.getVertices().length > 1) {
						baseShape.mLocalVertices.splice( pointMassId, 1 );
						body.setShape(baseShape);
					};
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
			];

			mouse
				.onLeftClick(movePointMass)
				.onRightClick(moveBody)
				.initDatGui(datGuiFolder, interactionTechniquesforDatGui);
			
			return mouse;
		},
		
		initDatGui: function(mapFolder, index) {
			if(typeof this.world === "undefined") return;
			var layerFolder = mapFolder.addFolder('Layer' + index);
			layerFolder.open();
			layerFolder.add(Jello.Material.Default, 'friction').name('Friction').min(-2).max(2).listen().step(0.1);
			layerFolder.add(Jello.Material.Default, 'elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
			layerFolder.add(this.world.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
			layerFolder.add(this.world.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
			layerFolder.add(this, 'zIndex').name('foo');
			layerFolder.add(this.scrollFactor, 'x').name('ScrollFactor_x').listen();
			layerFolder.add(this.scrollFactor, 'y').name('ScrollFactor_y').listen();
			layerFolder.add(this.scale, 'x').name('Scale_x').listen();
			layerFolder.add(this.scale, 'y').name('Scale_y').listen();
		}
	});
	
	Layer.prototype.toJson = function() {
		var json = {
			name: this.name,
			entities: []
		};
		
		// Serialize world if existing.
		if(typeof this.world !== "undefined")
			json.world = this.world.toJson();

		var entities = this.getEntities();
		for(var i = 0; i < entities.length; i++) {
			json.entities.push(entities[i].toJson());
		}
		return json;
	};

	Layer.fromJson = function(json) {
		var layer = new Layer(json.name);
		if(typeof json.world !== "undefined") {
			var world = Jello.World.fromJson(json.world);
			layer.setWorld(world);
		}
		if(typeof json.zIndex !== "undefined") {
			layer.zIndex = json.zIndex;
		}
		if(typeof json.scrollFactor !== "undefined") {
			layer.scrollFactor = Jello.Vector2.fromJson(json.scrollFactor);
		}
		if(typeof json.scale !== "undefined") {
			layer.scale = Jello.Vector2.fromJson(json.scale);
		}
		
		if(typeof json.entities !== "undefined") {
			for(var index in json.entities)
				Entity.fromJson(json.entities[index], layer.getWorld()).addToLayer(layer);
		}
		
		return layer;
	};

	Layer.WorldLayer = Layer;
	
	return Layer;
});
