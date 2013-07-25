Bloob.Mouse = function(world, renderer) {
	this.world = world;
	this.renderer = renderer;
	this.input = new Scarlet.Input(this.renderer.canvasId);
	this.input.initMouse();
	this.input.bind(Scarlet.KEY.MOUSE1, "click");
	
	this.body = {};
	this.pmId = -1;

	this.drag = Bloob.Utils.bind(function drag(body) {
		var mousePositionInWorldCoordinates = new Vector2(
			this.renderer.scaleX.invert(this.input.mouse.x),
			this.renderer.scaleY.invert(this.input.mouse.y)
		);
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
	if(this.input.pressed("click")) {
		var answer = this.world.getClosestPointMass(new Vector2(
			this.renderer.scaleX.invert(this.input.mouse.x),
			this.renderer.scaleY.invert(this.input.mouse.y)
		));
		this.body = this.world.getBody(answer.bodyId);
		this.body.addExternalForce(this.drag);
		this.pmId = answer.pointMassId;
	};
	if(this.input.released("click"))
		this.body.removeExternalForce(this.drag);
	this.input.clearPressed();
};