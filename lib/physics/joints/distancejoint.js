var DistanceJoint = function(
	world,
	bodyA, pointMassIndexA,
	bodyB, pointMassIndexB,
	distance, k, damp
) {
	this.world = world;
	this.bodyA = bodyA;
	this.bodyB = bodyB;
	this.pointMassIndexA = pointMassIndexA || 0;
	this.pointMassIndexB = pointMassIndexB || 0;
	this.springDistance = distance || 0.0;
	this.springK = k || 0.0;
	this.damping = damp || 0.0;
	
	world.addJoint(this);
};

DistanceJoint.prototype.applyForce = function(timePassed) {
	var pointMassA = this.bodyA.pointMasses[this.pointMassIndexA];
	var pointMassB = this.bodyB.pointMasses[this.pointMassIndexB];

	var force = VectorTools.calculateSpringForceVelAVelB(
		pointMassA.Position, pointMassA.Velocity,
		pointMassB.Position, pointMassB.Velocity, 
		this.springDistance, this.springK, this.damping
	);

	pointMassA.Force.addSelf(force);
	pointMassB.Force.subSelf(force);
};

DistanceJoint.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "lightgreen",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawPolyline([
		this.bodyA.pointMasses[this.pointMassIndexA].Position,
		this.bodyB.pointMasses[this.pointMassIndexB].Position
	]);
};
