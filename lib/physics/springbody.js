var SpringBody = function(
	w, shape, massPerPoint, pos, angleInRadians, scale, kinematic,
	edgeSpringK, edgeSpringDamp, shapeSpringK, shapeSpringDamp
	// World*, const ClosedShape&, float, const Vector2&, float, const Vector2&, bool, 
	// float, float, float, float
) {
	Body.apply(this, arguments);
	
	// set some default values
	if(typeof shapeSpringK == "undefined") {
		this.mShapeMatchingOn = false; // bool
	}

	this.setPositionAngle(pos, angleInRadians, scale);
	
	if(typeof shapeSpringK != "undefined") {
		this.mShapeMatchingOn = true; // bool
	}

	this.mSprings = []; // SpringList
	this.mEdgeSpringK = edgeSpringK; // float
	this.mEdgeSpringDamp = edgeSpringDamp; // float
	this.mShapeSpringK = shapeSpringK || 0.0; // float
	this.mShapeSpringDamp = shapeSpringDamp || 0.0; // float

	this._buildDefaultSprings();
};

// inheritance
var chain = function() {};
chain.prototype = Body.prototype;
SpringBody.prototype = new chain();
// enable static method inheritance
SpringBody.__proto__ = Body;
SpringBody.prototype.constructor = chain;
SpringBody.prototype.parent = Body.prototype;

SpringBody.prototype._buildDefaultSprings = function() {
	for (var i = 0; i < this.mPointCount; i++)
	{
		if (i < (this.mPointCount - 1))
			this.addInternalSpring(i, i + 1, this.mEdgeSpringK, this.mEdgeSpringDamp);
		else
			this.addInternalSpring(i, 0, this.mEdgeSpringK, this.mEdgeSpringDamp);
	}
};

SpringBody.prototype.addInternalSpring = function(pointA, pointB, springK, damping ) { // int, int, float, float
	var dist = (this.pointMasses[pointB].Position.sub(this.pointMasses[pointA].Position)).length(); // float 
	var s = new InternalSpring(pointA, pointB, dist, springK, damping);
	
	this.mSprings.push(s);
};

SpringBody.prototype.clearAllSprings = function() {
	this.mSprings.length = 0;
	this._buildDefaultSprings();
};

SpringBody.prototype.setShapeMatching = function(onoff) { this.mShapeMatchingOn = onoff; }; // bool
SpringBody.prototype.setShapeMatchingConstants = function(springK, damping) { // float, float
	this.mShapeSpringK = springK;
	this.mShapeSpringDamp = damping;
};

SpringBody.prototype.setEdgeSpringConstants = function(edgeSpringK, edgeSpringDamp) { // float, float
	this.mEdgeSpringK = edgeSpringK;
	this.mEdgeSpringDamp = edgeSpringDamp;
	
	// we know that the first n springs in the list are the edge springs.
	for (var i = 0; i < this.mPointCount; i++)
	{
		this.mSprings[i].springK = edgeSpringK;
		this.mSprings[i].damping = edgeSpringDamp;
	}
};

SpringBody.prototype.setSpringConstants = function(springID, springK, springDamp) { // int, float, float
	// index is for all internal springs, AFTER the default internal springs.
	var index = this.mPointCount + springID; // int
	this.mSprings[index].springK = springK;
	this.mSprings[index].damping = springDamp;
};

SpringBody.prototype.getSpringK = function(springID) { // int
	var index = this.mPointCount + springID; // int
	return this.mSprings[index].springK;
};

SpringBody.prototype.getSpringDamping = function(springID) { // int
	var index = this.mPointCount + springID; // int
	return this.mSprings[index].damping;
};

SpringBody.prototype.accumulateInternalForces = function() {	
	// internal spring forces.
	var force = Vector2.Zero.copy(); // Vector2
	var i = 0; // int
	for (var it = 0; it < this.mSprings.length; it++)
	{
		var s = this.mSprings[it]; // InternalSpring
		var pmA = this.pointMasses[s.pointMassA]; // PointMass
		var pmB = this.pointMasses[s.pointMassB]; // PointMass
		
		if (false)//i < this.mPointCount)
		{
			// spring forces for the edges of the shape can used the cached edge information to reduce calculations...
			force = VectorTools.calculateSpringForce(
				this.mEdgeInfo[i].dir.negative(), this.mEdgeInfo[i].length, pmA.Velocity, pmB.Velocity,
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
		this.mBaseShape.transformVertices(
			this.mDerivedPos,
			this.mDerivedAngle,
			this.mScale,
			this.mGlobalShape
		);
		for (var i = 0; i < this.mPointCount; i++)
		{
			var pmA = this.pointMasses[i]; // PointMass
			
			if (this.mShapeSpringK > 0)
			{
				if (!this.mKinematic)
				{
					force = VectorTools.calculateSpringForceVelAVelB(
						pmA.Position, pmA.Velocity,
						this.mGlobalShape[i], pmA.Velocity,
						0.0, this.mShapeSpringK, this.mShapeSpringDamp
					);
				}
				else
				{
					force = VectorTools.calculateSpringForceVelAVelB(
						pmA.Position, pmA.Velocity,
						this.mGlobalShape[i], Vector2.Zero.copy(),
						0.0, this.mShapeSpringK, this.mShapeSpringDamp
					);
				}
				
				pmA.Force.addSelf(force);
			}
		}
	}
};

SpringBody.prototype.debugDraw = function(debugDraw) {
	for (var it = 0; it < this.mSprings.length; it++)
	{
		this.mSprings[it].debugDraw(debugDraw, this);
	};

	Body.prototype.debugDraw.apply(this, arguments);
};
