Bloob.Mouse = function(world, camera, scene) {
	this.world = world;
	this.camera = camera;
	this.scene = scene;
	this.input = new Scarlet.Input(this.camera.canvasId);
	this.input.initMouse();
	this.input.bind(Scarlet.KEY.MOUSE1, Bloob.Mouse.LeftButton);
	this.input.bind(Scarlet.KEY.MOUSE2, Bloob.Mouse.RightButton);
	
	this.body = {};
	this.pmId = -1;

	this.drag = Bloob.Utils.bind(function drag(body) {
		var mousePositionInWorldCoordinates = this.getMousePositionInWorld();
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
	"DRAG_BODY": new Bloob.InteractionHandler(function(timePassed, button) {
		if(this.input.pressed(button)) {
			var answer = this.world.getClosestPointMass(this.getMousePositionInWorld());
			this.body = this.world.getBody(answer.bodyId);
			this.body.addExternalForce(this.drag);
			this.pmId = answer.pointMassId;
		};
		if(this.input.released(button))
			this.body.removeExternalForce(this.drag);
	}),
	"SPAWN_CUBE": new Bloob.InteractionHandler(function(timePassed, button) {})
		.context(
			Bloob.BodyFactory.createBluePrint(SpringBody)
				.shape(Bloob.ShapeBuilder.Shapes.Cube)
				.pointMasses(1)
				.rotate(0)
				.scale(Vector2.One.copy())
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(5.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(5.0)
				.addInternalSpring(0, 2, 300, 10)
				.addInternalSpring(1, 3, 300, 10))
		.onPressed(function(timePassed, mouse) {
			this
				// TODO: set world with context
				.world(mouse.world)
				.translate(mouse.getMousePositionInWorld())
				.build();
			}
		),
	"SELECT_BODY": new Bloob.InteractionHandler(function(timePassed, button) {
		if(this.input.pressed(button)) {
			var answer = this.world.getClosestPointMass(this.getMousePositionInWorld());
			var body = this.world.getBody(answer.bodyId);
			Scarlet.log(body.aName);
		}
	}),
	// TODO: use scenes for pausing
	"PAUSE_GAME": new Bloob.InteractionHandler(function(timePassed, button) {
		if(this.input.pressed(button)) {
			if(typeof this.pause === "undefined") {
				this.pause = false;
			};
			if(this.pause) {
				Scarlet.log("Restart");
			}
			else
			{
				this.scene.stop();				
			};
			this.pause = !this.pause;
		}
	}),
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
