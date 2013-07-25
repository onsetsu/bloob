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
};

Bloob.Mouse.prototype.update = function(timePassed) {
	if(this.input.pressed("leftclick")) {
		var answer = this.world.getClosestPointMass(this.getMousePositionInWorld());
		this.body = this.world.getBody(answer.bodyId);
		this.body.addExternalForce(this.drag);
		this.pmId = answer.pointMassId;
	};
	if(this.input.released("leftclick"))
		this.body.removeExternalForce(this.drag);
	if(this.input.pressed("rightclick")) {
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
	this.input.clearPressed();
};

Bloob.Mouse.prototype.getMousePositionInWorld = function() {
	return new Vector2(
		this.renderer.scaleX.invert(this.input.mouse.x),
		this.renderer.scaleY.invert(this.input.mouse.y)
	);
};