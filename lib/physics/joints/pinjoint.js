var PinJoint = function(
	world,
	bodyA, pointMassIndexA,
	bodyB, pointMassIndexB
) {
	this.world = world;
	this.bodyA = bodyA;
	this.bodyB = bodyB;
	this.pointMassIndexA = pointMassIndexA || 0;
	this.pointMassIndexB = pointMassIndexB || 0;
	
	//this.bodyB.pointMasses[this.pointMassIndexB] = 
		//this.bodyA.pointMasses[this.pointMassIndexA];

	world.addJoint(this);
};

PinJoint.prototype.applyForce = function(timePassed) {
	var pointMassA = this.bodyA.pointMasses[this.pointMassIndexA];
	var pointMassB = this.bodyB.pointMasses[this.pointMassIndexB];

	pointMassA.Position.addSelf(pointMassB.Position).mulFloatSelf(0.5);
	pointMassB.Position.set(pointMassA.Position);

	pointMassA.Velocity.addSelf(pointMassB.Velocity).mulFloatSelf(0.5);
	pointMassB.Velocity.set(pointMassA.Velocity);

	pointMassA.Force.addSelf(pointMassB.Force).mulFloatSelf(0.5);
	pointMassB.Force.set(pointMassA.Force);
};

PinJoint.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "blue",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawDot(
		this.bodyA.pointMasses[this.pointMassIndexA].Position,
		6
	);
};
