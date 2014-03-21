mini.Module(
	"physics/particle"
)
.requires(
	"physics/vector2"
)
.defines(function(
	Vector2
) {
	Particle = function() {};

	Particle.prototype.derivePositionAndAngle = function(timePassed) {
	};

	Particle.prototype.accumulateExternalForces = function() {
		this.pointMass.Force.addSelf(new Vector2(0.0, 9.81));
	};

	Particle.prototype.accumulateInternalForces = function() {
	};

	Particle.prototype.integrate = function(timePassed) {
	};
	
	return Particle;
});
