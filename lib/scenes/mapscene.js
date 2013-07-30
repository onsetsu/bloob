Bloob.MapScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.loop = loop;
	
	this.map = new Bloob.Map();
	this.logic = this.map.logic;
	this.world = this.map.world;
	
	this.camera = new Bloob.Camera(
			this.canvas,
			this.logic,
			this.world,
			this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
		);
	this.renderer = new DebugDraw(this.world, this.canvas, this.camera);
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

Bloob.MapScene.prototype.loadAndRun = function(mapToLoadName) {
	var callback = Bloob.Utils.bind(this.mapLoaded, this);
	this.map
		.onBuildFinished(callback)
		.build(mapToLoadName);

	return this;
};

Bloob.MapScene.prototype.mapLoaded = function() {
	//Bloob.MapBuilder.setUpTestMap(this);
	this.map.spawnPlayerAt(this);
	
	this.loop.add(this, this.update);
};

Bloob.MapScene.prototype.initMouseInteraction = function() {
	
	var interactionTechniques = {
			// TODO: move techniques to specific scene and make datGui specific for each mouse(+configurable)
			"NOTHING": new Bloob.InteractionHandler().name("NOTHING"),
			"DRAG_BODY": new Bloob.InteractionHandler()
				.name("DRAG_BODY")
				.context({body: {}, pmId: -1})
				.onPressed(function(timePassed, mouse) {
					// TODO: only init this once in context
					var world = mouse.world;
					
					// create force callback
					this.drag = Bloob.Utils.bind(function drag(body) {
						var mousePositionInWorldCoordinates = mouse.getMousePositionInWorld();
						var pointMass = body.pointMasses[this.pmId];
						var diff = VectorTools.calculateSpringForceVelAVelB(
							pointMass.Position,
							pointMass.Velocity,
							mousePositionInWorldCoordinates,
							Vector2.Zero.copy(), // velB,
							0.0, // springD,
							100.0, // springK,
							10.0 // damping
						);
						pointMass.Force.addSelf(diff);
					}, this);
		
					var answer = world.getClosestPointMass(mouse.getMousePositionInWorld());
					this.body = world.getBody(answer.bodyId);
					this.body.addExternalForce(this.drag);
					this.pmId = answer.pointMassId;
				})
				.onReleased(function(timePassed, mouse) {
					this.body.removeExternalForce(this.drag);
				}),
			"SPAWN_CUBE": new Bloob.InteractionHandler()
				.name("SPAWN_CUBE")
				.onPressed(function(timePassed, mouse) {
					Bloob.BodyFactory.createBluePrint(SpringBody)
						.world(mouse.world)
						.shape(Bloob.ShapeBuilder.Shapes.Cube)
						.pointMasses(1)
						.translate(mouse.getMousePositionInWorld())
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
					}
				),
			"SELECT_BODY": new Bloob.InteractionHandler()
				.name("SELECT_BODY")
				.onPressed(function(timePassed, mouse) {
					var answer = mouse.world.getClosestPointMass(mouse.getMousePositionInWorld());
					var body = mouse.world.getBody(answer.bodyId);
					Scarlet.log(body.aName);
				}
			),
			"PAUSE_GAME": new Bloob.InteractionHandler()
				.name("PAUSE_GAME")
				.context({"pause": false})
				.onPressed(function(timePassed, mouse) {
					if(this.pause) {
						Scarlet.log("Restart");
					}
					else
					{
						Scarlet.log("STOP!!!!");
						mouse.scene.stop();				
					};
					this.pause = !this.pause;
				}
			),
			"CALL_CALLBACK": new Bloob.InteractionHandler()
				.name("CALL_CALLBACK")
				.onPressed(function(timePassed, mouse) {
					if(typeof mouse.callback !== "undefined")
						mouse.callback();
				})
		};
	
	
	
	
	var mouse = new Bloob.Mouse(this.world, this.camera, this);
	
	mouse.selectibleTechniques = interactionTechniques;
	
	mouse.onLeftClick(mouse.selectibleTechniques["DRAG_BODY"], "DRAG_BODY");
	mouse.onRightClick(mouse.selectibleTechniques["SPAWN_CUBE"], "SPAWN_CUBE");
	mouse.callback = function() { Scarlet.log("hallo"); };

	//mouse.setSelectibleTechniques();
	mouse.initDatGui(interactionTechniques);

	return mouse;
};
