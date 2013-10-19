var Particle = function() {};

Particle.prototype.derivePositionAndAngle = function(timePassed) {
};

Particle.prototype.accumulateExternalForces = function() {
	this.pointMass.Force.addSelf(new Vector2(0.0, 9.81));
};

Particle.prototype.accumulateInternalForces = function() {
};

Particle.prototype.integrate = function(timePassed) {
};
