define([
	"physics/internalspring",
	"physics/vector2",
	"physics/vectortools"
], function(
	InternalSpring,
	Vector2,
	VectorTools
) {
	var SpringPhysics = function(body, bodyDefinition) {
		this.body = body;
		
		var shapeSpringK = bodyDefinition.getShapeSpringK();

		// set some default values
		if(typeof shapeSpringK == "undefined") {
			this.mShapeMatchingOn = false; // bool
		}

		body.setPositionAngle(
			bodyDefinition.getPosition(),
			bodyDefinition.getAngleInRadians(),
			bodyDefinition.getScale()
		);
		
		if(typeof shapeSpringK != "undefined") {
			this.mShapeMatchingOn = true; // bool
		}

		this.mSprings = []; // SpringList
		this.mEdgeSpringK = bodyDefinition.getEdgeSpringK(); // float
		this.mEdgeSpringDamp = bodyDefinition.getEdgeSpringDamp(); // float
		this.mShapeSpringK = shapeSpringK || 0.0; // float
		this.mShapeSpringDamp = bodyDefinition.getShapeSpringDamp() || 0.0; // float

		this._buildDefaultSprings();

		for(var i = 0; i < bodyDefinition.internalSprings.length; i++)
			this.addInternalSpring.apply(this, bodyDefinition.internalSprings[i]);
	};

	SpringPhysics.prototype._buildDefaultSprings = function() {
		for (var i = 0; i < this.body.mPointCount; i++)
		{
			if (i < (this.body.mPointCount - 1))
				this.addInternalSpring(i, i + 1, this.mEdgeSpringK, this.mEdgeSpringDamp);
			else
				this.addInternalSpring(i, 0, this.mEdgeSpringK, this.mEdgeSpringDamp);
		}
	};

	SpringPhysics.prototype.addInternalSpring = function(pointA, pointB, springK, damping ) { // int, int, float, float
		var dist = (this.body.pointMasses[pointB].Position.sub(this.body.pointMasses[pointA].Position)).length(); // float 
		var s = new InternalSpring(pointA, pointB, dist, springK, damping);
		
		this.mSprings.push(s);
	};

	SpringPhysics.prototype.clearAllSprings = function() {
		this.mSprings.length = 0;
		this._buildDefaultSprings();
	};

	SpringPhysics.prototype.setShapeMatching = function(onoff) {
		this.mShapeMatchingOn = onoff;
	};
	
	SpringPhysics.prototype.setShapeMatchingConstants = function(springK, damping) { // float, float
		this.mShapeSpringK = springK;
		this.mShapeSpringDamp = damping;
	};

	SpringPhysics.prototype.setEdgeSpringConstants = function(edgeSpringK, edgeSpringDamp) { // float, float
		this.mEdgeSpringK = edgeSpringK;
		this.mEdgeSpringDamp = edgeSpringDamp;
		
		// we know that the first n springs in the list are the edge springs.
		for (var i = 0; i < this.body.mPointCount; i++)
		{
			this.mSprings[i].springK = edgeSpringK;
			this.mSprings[i].damping = edgeSpringDamp;
		}
	};

	SpringPhysics.prototype.setSpringConstants = function(springID, springK, springDamp) { // int, float, float
		// index is for all internal springs, AFTER the default internal springs.
		var index = this.body.mPointCount + springID; // int
		this.mSprings[index].springK = springK;
		this.mSprings[index].damping = springDamp;
	};

	SpringPhysics.prototype.getSpringK = function(springID) { // int
		var index = this.body.mPointCount + springID; // int
		return this.mSprings[index].springK;
	};

	SpringPhysics.prototype.getSpringDamping = function(springID) { // int
		var index = this.body.mPointCount + springID; // int
		return this.mSprings[index].damping;
	};

	SpringPhysics.prototype.accumulateInternalForces = function() {	
		// internal spring forces.
		var force = Vector2.Zero.copy(); // Vector2
		var i = 0; // int
		for (var it = 0; it < this.mSprings.length; it++)
		{
			var s = this.mSprings[it]; // InternalSpring
			var pmA = this.body.pointMasses[s.pointMassA]; // PointMass
			var pmB = this.body.pointMasses[s.pointMassB]; // PointMass
			
			if (false)//i < this.body.mPointCount)
			{
				// spring forces for the edges of the shape can used the cached edge information to reduce calculations...
				force = VectorTools.calculateSpringForce(
					this.body.mEdgeInfo[i].dir.negative(), this.body.mEdgeInfo[i].length, pmA.Velocity, pmB.Velocity,
					s.springD, s.springK, s.damping );				
			}
			else
			{
				// these are other internal springs, they must be fully calculated each frame.
				force = VectorTools.calculateSpringForceVelAVelB(
					pmA.Position, pmA.Velocity,
					pmB.Position, pmB.Velocity, 
					s.springD, s.springK, s.damping);
			}
			
			pmA.Force.addSelf(force);
			pmB.Force.subSelf(force);
			
			i++;
		}

		// shape matching forces.
		if (this.mShapeMatchingOn)
		{
			this.body.mBaseShape.transformVertices(
				this.body.mDerivedPos,
				this.body.mDerivedAngle,
				this.body.mScale,
				this.body.mGlobalShape
			);
			for (var i = 0; i < this.body.mPointCount; i++)
			{
				var pmA = this.body.pointMasses[i]; // PointMass
				
				if (this.mShapeSpringK > 0)
				{
					if (!this.body.mKinematic)
					{
						force = VectorTools.calculateSpringForceVelAVelB(
							pmA.Position, pmA.Velocity,
							this.body.mGlobalShape[i], pmA.Velocity,
							0.0, this.mShapeSpringK, this.mShapeSpringDamp
						);
					}
					else
					{
						force = VectorTools.calculateSpringForceVelAVelB(
							pmA.Position, pmA.Velocity,
							this.body.mGlobalShape[i], Vector2.Zero.copy(),
							0.0, this.mShapeSpringK, this.mShapeSpringDamp
						);
					}
					
					pmA.Force.addSelf(force);
				}
			}
		}
	};

	SpringPhysics.prototype.debugDraw = function(debugDraw, body) {
		if(!body.isVisible(debugDraw)) return;

		for (var it = 0; it < this.mSprings.length; it++)
		{
			this.mSprings[it].debugDraw(debugDraw, body);
		};
	};

	SpringPhysics.prototype.toJson = function(resultJson) {
		// adjustments for spring bodies
		resultJson.class = "SpringBody";
		resultJson.edgeSpringK = this.mEdgeSpringK;
		resultJson.edgeSpringDamp = this.mEdgeSpringDamp;
		resultJson.shapeSpringK = this.mShapeSpringK;
		resultJson.shapeSpringDamp = this.mShapeSpringDamp;

		resultJson.internalSprings = [];
		for (var i = this.body.mPointCount; i < this.mSprings.length; i++)
			resultJson.internalSprings.push(this.mSprings[i].toJson());

		return resultJson;
	};

	return SpringPhysics;
});
