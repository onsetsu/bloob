var PointMass = function(mass, pos) {
	this.Mass = mass || 0;
	this.Position = pos || new Vector2(0.0, 0.0);
	this.Velocity = new Vector2(0.0, 0.0);
	this.Force = new Vector2(0.0, 0.0);
	this.lastElapsed = 0;
	this.lastElapMass = 1;
};

PointMass.prototype.integrateForce = function(elapsed) {
	if (this.Mass != 0.0) {
		if (this.lastElapsed != elapsed) {
			this.lastElapsed = elapsed;
			this.lastElapMass = elapsed / this.Mass;
		};
		
		this.Velocity.addSelf(this.Force.mulFloat(this.lastElapMass));
		this.Position.addSelf(this.Velocity.mulFloat(elapsed));
	};
	
	this.Force = new Vector2(0.0, 0.0);
};