mini.Module(
	"physics/joints/interpolationjoint"
)
.requires(

)
.defines(function() {
	var InterpolationJoint = function(
		world,
		bodyA, pointMassIndexA,
		bodyB, pointMassIndexB,
		interpolatedBody, interpolatedPointMassIndex,
		i,
		strength
	) {
		this.world = world;
		this.bodyA = bodyA;
		this.bodyB = bodyB;
		this.interpolatedBody = interpolatedBody;

		this.pointMassIndexA = pointMassIndexA || 0;
		this.pointMassIndexB = pointMassIndexB || 0;
		this.interpolatedPointMassIndex= interpolatedPointMassIndex || 0;

		this.i = i; // interpolation factor
		this.strength = strength; // interpolation strength

		world.addJoint(this);
	};

	InterpolationJoint.prototype.applyForce = function(timePassed) {
		var pointMassA = this.bodyA.pointMasses[this.pointMassIndexA];
		var pointMassB = this.bodyB.pointMasses[this.pointMassIndexB];
		var interpolatedPointMass = this.interpolatedBody.pointMasses[this.interpolatedPointMassIndex];

		interpolatedPointMass.Position.lerpSelf(
			pointMassA.Position.lerp(pointMassB.Position, this.i),
			this.strength
		);

		interpolatedPointMass.Velocity.lerpSelf(
			pointMassA.Velocity.lerp(pointMassB.Velocity, this.i),
			this.strength
		);

		interpolatedPointMass.Force.lerpSelf(
			pointMassA.Force.lerp(pointMassB.Force, this.i),
			this.strength
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

	
	return InterpolationJoint;
});
