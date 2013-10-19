var InterpolationJoint = function(
	world,
	bodyA, pointMassIndexA,
	bodyB, pointMassIndexB,
	interpolatedBody, interpolatedPointMassIndex,
	i
) {
	this.world = world;
	this.bodyA = bodyA;
	this.bodyB = bodyB;
	this.interpolatedBody = interpolatedBody;

	this.pointMassIndexA = pointMassIndexA || 0;
	this.pointMassIndexB = pointMassIndexB || 0;
	this.interpolatedPointMassIndex= interpolatedPointMassIndex || 0;

	this.i = i; // interpolation factor

	world.addJoint(this);
};

InterpolationJoint.prototype.applyForce = function(timePassed) {
	var pointMassA = this.bodyA.pointMasses[this.pointMassIndexA];
	var pointMassB = this.bodyB.pointMasses[this.pointMassIndexB];
	var interpolatedPointMass = this.interpolatedBody.pointMasses[this.interpolatedPointMassIndex];

	interpolatedPointMass.Position.set(
		pointMassA.Position.mulFloat(this.i).add(
			pointMassB.Position.mulFloat(1-this.i))
	);

	interpolatedPointMass.Velocity.set(
		pointMassA.Velocity.mulFloat(this.i).add(
			pointMassB.Velocity.mulFloat(1-this.i))
	);

	interpolatedPointMass.Force.set(
		pointMassA.Force.mulFloat(this.i).add(
			pointMassB.Force.mulFloat(1-this.i))
	);
};

InterpolationJoint.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "blue",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawPolyline([
		this.bodyA.pointMasses[this.pointMassIndexA].Position,
		this.bodyB.pointMasses[this.pointMassIndexB].Position
	]);
	debugDraw.drawDot(
		this.interpolatedBody.pointMasses[this.interpolatedPointMassIndex].Position,
		6
	);
};
