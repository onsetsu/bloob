Bloob.Mouse = function(world, camera, scene) {
	this.world = world;
	this.camera = camera;
	this.scene = scene;
	this.input = new Scarlet.Input(this.camera.canvasId);
	this.input.initMouse();
	this.input.bind(Scarlet.KEY.MOUSE1, "leftclick");
	this.input.bind(Scarlet.KEY.MOUSE2, "rightclick");
	
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
	
	this.leftTechnique = Bloob.Mouse.InteractionTechniques["DRAG_BODY"];
	this.rightTechnique = Bloob.Mouse.InteractionTechniques["DRAG_BODY"];
	this.initDatGui();
};

Bloob.Mouse.prototype.update = function(timePassed) {
	this.leftTechnique.fireCallback(this, timePassed, "leftclick");
	this.rightTechnique.fireCallback(this, timePassed, "rightclick");
	this.input.clearPressed();
};

Bloob.Mouse.prototype.getMousePositionInWorld = function() {
	return new Vector2(
		this.camera.scaleX.invert(this.input.mouse.x),
		this.camera.scaleY.invert(this.input.mouse.y)
	);
};

Bloob.Mouse.prototype.onLeftClick = function(interactionTechnique) {
	this.leftTechnique = interactionTechnique;
	return this;
};

Bloob.Mouse.prototype.onRightClick = function(interactionTechnique) {
	this.rightTechnique = interactionTechnique;
	return this;
};

// Interaction techniques:
Bloob.Mouse.InteractionTechniques = {
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
	"SPAWN_CUBE": new Bloob.InteractionHandler(function(timePassed, button) {
		if(this.input.pressed(button)) {
			// spawn a cube
			var jellyCubeBluePrint = Bloob.BodyFactory.createBluePrint(SpringBody)
				.world(this.world)
				.shape(Bloob.ShapeBuilder.Shapes.Cube)
				.pointMasses(1)
				.translate(this.getMousePositionInWorld())
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
	}),
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
				Scarlet.log("Restert");
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
	var interactionTechniques = [];
	for (var technique in Bloob.Mouse.InteractionTechniques) {
		interactionTechniques.push(technique);
	};
	
	// Enable all techniques to each button.
	var that = this;
	mouseFolder.add(this, 'leftTechnique', interactionTechniques).listen().onChange(function(techniqueName) { that.onLeftClick(techniqueName); });
	mouseFolder.add(this, 'rightTechnique', interactionTechniques).listen().onChange(function(techniqueName) { that.onRightClick(techniqueName); });
};