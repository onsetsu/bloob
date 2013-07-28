Bloob.Mouse = function(world, renderer) {
	this.world = world;
	this.renderer = renderer;
	this.input = new Scarlet.Input(this.renderer.canvasId);
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
	
	this.leftTechnique = "DRAG_BODY";
	this.rightTechnique = "DRAG_BODY";
	this.initDatGui();
};

Bloob.Mouse.prototype.update = function(timePassed) {
	Bloob.Mouse.InteractionTechniques[this.leftTechnique].call(this, timePassed, "leftclick");
	Bloob.Mouse.InteractionTechniques[this.rightTechnique].call(this, timePassed, "rightclick");
	this.input.clearPressed();
};

Bloob.Mouse.prototype.getMousePositionInWorld = function() {
	return new Vector2(
		this.renderer.scaleX.invert(this.input.mouse.x),
		this.renderer.scaleY.invert(this.input.mouse.y)
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
	"DRAG_BODY": function(timePassed, button) {
		if(this.input.pressed(button)) {
			var answer = this.world.getClosestPointMass(this.getMousePositionInWorld());
			this.body = this.world.getBody(answer.bodyId);
			this.body.addExternalForce(this.drag);
			this.pmId = answer.pointMassId;
		};
		if(this.input.released(button))
			this.body.removeExternalForce(this.drag);
	},
	"SPAWN_CUBE": function(timePassed, button) {
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
	},
	"SELECT_BODY": function(timePassed, button) {
		if(this.input.pressed(button)) {
			var answer = this.world.getClosestPointMass(this.getMousePositionInWorld());
			var body = this.world.getBody(answer.bodyId);
			Scarlet.log(body.aName);
		}
	},
	// TODO: use scenes for pausing
	"PAUSE_GAME": function(timePassed, button) {
		if(this.input.pressed(button)) {
			if(typeof this.pause === "undefined") {
				this.pause = false;
			};
			if(this.pause) {
				Scarlet.log("Restert");
			}
			else
			{
				this.loop.stop();				
			};
			this.pause = !this.pause;
		}
	}
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
	mouseFolder.add(this, 'leftTechnique', interactionTechniques).listen();
	mouseFolder.add(this, 'rightTechnique', interactionTechniques).listen();
};
