Bloob.Mouse = function(world, camera, scene) {
	this.world = world;
	this.camera = camera;
	this.scene = scene;
	this.input = new Scarlet.Input(this.camera.canvasId);
	this.input.initMouse();
	this.input.bind(Scarlet.KEY.MOUSE1, Bloob.Mouse.LeftButton);
	this.input.bind(Scarlet.KEY.MOUSE2, Bloob.Mouse.RightButton);
	
	this.onLeftClick(Bloob.Mouse.InteractionTechniques["DRAG_BODY"], "DRAG_BODY");
	this.onRightClick(Bloob.Mouse.InteractionTechniques["DRAG_BODY"], "DRAG_BODY");

	this.initDatGui();
};

Bloob.Mouse.LeftButton = "leftclick";
Bloob.Mouse.RightButton = "rightclick";

Bloob.Mouse.prototype.update = function(timePassed) {
	this.leftTechnique.fireCallback(this, timePassed, Bloob.Mouse.LeftButton);
	this.rightTechnique.fireCallback(this, timePassed, Bloob.Mouse.RightButton);
	this.input.clearPressed();
};

Bloob.Mouse.prototype.getMousePositionInWorld = function() {
	return new Vector2(
		this.camera.scaleX.invert(this.input.mouse.x),
		this.camera.scaleY.invert(this.input.mouse.y)
	);
};

Bloob.Mouse.prototype.onLeftClick = function(interactionTechnique, interactionTechniqueName) {
	this.leftTechnique = interactionTechnique;
	if(typeof interactionTechniqueName !== "undefined")
		this.leftTechniqueName = interactionTechniqueName;
	return this;
};

Bloob.Mouse.prototype.onRightClick = function(interactionTechnique, interactionTechniqueName) {
	this.rightTechnique = interactionTechnique;
	if(typeof interactionTechniqueName !== "undefined")
		this.rightTechniqueName = interactionTechniqueName;
	return this;
};

// Interaction techniques:
Bloob.Mouse.InteractionTechniques = {
	"NOTHING": new Bloob.InteractionHandler(),
	"DRAG_BODY": (function() {
		var context = {};
		context.body = {};
		context.pmId = -1;

		var handler = new Bloob.InteractionHandler(function(timePassed, button) {})
			.context(context)
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
			});

		return handler;
	})(),
	"SPAWN_CUBE": new Bloob.InteractionHandler()
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
		.onPressed(function(timePassed, mouse) {
			var answer = mouse.world.getClosestPointMass(mouse.getMousePositionInWorld());
			var body = mouse.world.getBody(answer.bodyId);
			Scarlet.log(body.aName);
		}
	),
	"PAUSE_GAME": new Bloob.InteractionHandler()
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
	"CALL_CALLBACK": new Bloob.InteractionHandler(function(timePassed, button) {
		if(this.input.pressed(button))
			if(typeof this.callback !== "undefined")
				this.callback();
	})
};

Bloob.Mouse.prototype.initDatGui = function() {
	var mouseFolder = gui.addFolder('Mouse');
	mouseFolder.open();
	
	// Get all interaction technique names.
	var interactionTechniqueNames = [];
	for (var technique in Bloob.Mouse.InteractionTechniques) {
		interactionTechniqueNames.push(technique);
	};
	
	// Enable all techniques to each button.
	var that = this;
	mouseFolder.add(this, 'leftTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onLeftClick(Bloob.Mouse.InteractionTechniques[techniqueName]); });
	mouseFolder.add(this, 'rightTechniqueName', interactionTechniqueNames).listen().onChange(function(techniqueName) { that.onRightClick(Bloob.Mouse.InteractionTechniques[techniqueName]); });
	
	return this;
};
