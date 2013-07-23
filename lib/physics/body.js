var EdgeInfo = function() {
	this.dir = new Vector2(0.0, 0.0);	// normalized direction vector for this edge.
	this.length = 0;	// length of the edge.
	this.slope = 0.0;	// slope of the line described by this edge.
};

//typedef std::vector<EdgeInfo> EdgeInfoList;
//typedef std::vector<PointMass> PointMassList;

var bodyConstructorWorld = function(w) {
	this.mWorld = w;
	this.mScale = Vector2.One.copy();
	this.mIsStatic = false;
	this.mKinematic = false;

	this.mVelDamping = 0.999;
	this.mObjectTag = 0;

	this.mMaterial = Bloob.Material.Default;

	this.mPointCount = 0;
	this.mInvPC = 0.0;

	this.mIgnoreMe = false;

	w.addBody( this );
};

var bodyConstructorBasics = function(bodyDefinition) {
	this.mWorld = bodyDefinition.world;
	this.mDerivedPos = bodyDefinition.position;
	this.mDerivedAngle = bodyDefinition.angleInRadians;
	this.mLastAngle = this.mDerivedAngle;
	this.mScale = bodyDefinition.scale;
	this.mMaterial = Bloob.Material.Default;
	this.mPointCount = 0;
	this.mInvPC = 0.0;
};

var bodyConstructorBasics2 = function(bodyDefinition) {
	this.mVelDamping = 0.999;
	this.mObjectTag = null;

	this.mIgnoreMe = false;
};

var bodyConstructorBasics3 = function(bodyDefinition) {
	this.updateAABB(0.0, true);
	this.updateEdgeInfo(true);

	bodyDefinition.world.addBody(this);
};

var bodyConstructorMassPerPoint = function(bodyDefinition) {
	bodyConstructorBasics.apply(this, arguments);

	this.mIsStatic = (bodyDefinition.massPerPoint == 0.0);
	this.mKinematic = bodyDefinition.kinematic;

	bodyConstructorBasics2.apply(this, arguments);

	this.setShape(bodyDefinition.shape);
	for(var i = 0; i < this.mPointCount; i++)
		this.pointMasses[i].Mass = bodyDefinition.massPerPoint;

	bodyConstructorBasics3.apply(this, arguments);
};

var bodyConstructorPointMassList = function(bodyDefinition) {
	bodyConstructorBasics.apply(this, arguments);

	this.mIsStatic = false;
	this.mKinematic = bodyDefinition.kinematic;

	bodyConstructorBasics2.apply(this, arguments);

	this.setShape(bodyDefinition.shape);
	for (var i = 0; i < this.mPointCount; i++)
		this.pointMasses[i].Mass = bodyDefinition.pointMasses[i];

	bodyConstructorBasics3.apply(this, arguments);
};	

var Body = function(w, shape, pointMasses, position, angleInRadians, scale, kinematic) {
	// set default values
	this.mWorld = null;
	this.mBaseShape = new ClosedShape();
	this.mGlobalShape = [];
	this.pointMasses = [];
	this.mEdgeInfo = [];
	this.mScale = new Vector2(0.0, 0.0);
	this.mDerivedPos = new Vector2(0.0, 0.0);
	this.mDerivedVel = new Vector2(0.0, 0.0);
	this.mDerivedAngle = 0.0;
	this.mDerivedOmega = 0.0;
	this.mLastAngle = 0.0;
	this.mAABB = new AABB();
	this.mMaterial = Bloob.Material.Default;
	this.mIsStatic = false;
	this.mKinematic = false;
	this.mObjectTag = null;
	this.mVelDamping = 0.0;

	this.mPointCount = 0;
	this.mInvPC = 0;

	this.mIgnoreMe = false;

	this.mBitMaskY = new Bitmask();

	this.externalForces = []; // array of force callbacks
	
	this.id = Body.getID();
	
	// real constructors
	if(typeof arguments[2] === "undefined")
		var ret = bodyConstructorWorld.apply(this, arguments);
	if(arguments[2] instanceof Array)
		var ret = bodyConstructorPointMassList.call(this, {
			"world": w,
			"shape": shape,
			"pointMasses": pointMasses,
			"position": position,
			"angleInRadians": angleInRadians,
			"scale": scale,
			"kinematic": kinematic
		});
	else
		var ret = bodyConstructorMassPerPoint.call(this, {
			"world": w,
			"shape": shape,
			"massPerPoint": pointMasses,
			"position": position,
			"angleInRadians": angleInRadians,
			"scale": scale,
			"kinematic": kinematic
		});
		
	return ret;
};

Body.id = 0;
Body.getID = function() {
	return this.id++;
};

Body.prototype.kill = function() {
	this.mWorld.removeBody(this);
};

Body.prototype.setShape = function(shape) {
	this.mBaseShape = shape;
	
	if (this.mBaseShape.getVertices().length != this.mPointCount)
	{
		this.pointMasses.length = 0;
		this.mGlobalShape.length = 0;
		this.mEdgeInfo.length = 0;
		
		for(var i = 0; i < shape.getVertices().length; i++)
			this.mGlobalShape.push(new Vector2(0.0, 0.0));
		
		this.mBaseShape.transformVertices(this.mDerivedPos, this.mDerivedAngle, this.mScale, this.mGlobalShape);
		
		for(var i = 0; i < this.mBaseShape.getVertices().length; i++)
			this.pointMasses.push(new PointMass(0.0, this.mGlobalShape[i])); 
		
		var e = new EdgeInfo();
		e.dir = new Vector2(0.0, 0.0);
		e.length = 0.0;
		
		for(var i = 0; i < this.mBaseShape.getVertices().length; i++)
			this.mEdgeInfo.push(e);
		
		this.mPointCount = this.pointMasses.length;
		this.mInvPC = 1.0 / this.mPointCount;
	}
	
	this.updateAABB(0.0, true);
	this.updateEdgeInfo(true);
};

Body.prototype.setMassAll = function(mass) {
	for(var i = 0; i < this.mPointCount; i++)
		this.pointMasses[i].Mass = mass;
	
	if(mass == 0.0)
		mIsStatic = true;
};

Body.prototype.setMassIndividual = function(index, mass) {
	if((index >= 0) && (index < this.mPointCount))
		this.pointMasses[index].Mass = mass;
};

Body.prototype.setMassFromList = function(masses) {
	if (masses.length == this.mPointCount) {
		for (var i = 0; i < this.mPointCount; i++)
			this.pointMasses[i].Mass = masses[i];
	};
};

Body.prototype.getMaterial = function() { return this.mMaterial; };
Body.prototype.setMaterial = function(val) { this.mMaterial = val; };

Body.prototype.setPositionAngle = function(pos, angleInRadians, scale ) {
	this.mBaseShape.transformVertices(pos, angleInRadians, scale, this.mGlobalShape);
	for(var i = 0; i < this.mPointCount; i++)
		this.pointMasses[i].Position.set(this.mGlobalShape[i]);
	
	this.mDerivedPos = pos;
	this.mDerivedAngle = angleInRadians;
};

Body.prototype.setKinematicPosition = function(pos) { this.mDerivedPos = pos; };
Body.prototype.setKinematicAngle = function(angleInRadians) { this.mDerivedAngle = angleInRadians; };
Body.prototype.setKinematicScale = function(scale) { this.mScale = scale; };
		
Body.prototype.derivePositionAndAngle = function(elapsed) {
	// no need if this is a static body, or kinematically controlled.
	if (this.mIsStatic || this.mKinematic)
		return;

	// if we are being ignored, be ignored!
	if (this.mIgnoreMe)
		return;
	
	// find the geometric center.
	var center = new Vector2(0.0, 0.0);
	var vel = new Vector2(0.0, 0.0);
	
	for(var i = 0; i < this.pointMasses.length; i++)
	{
		center.addSelf(this.pointMasses[i].Position);
		vel.addSelf(this.pointMasses[i].Velocity);
	}
	
	center.mulFloatSelf(this.mInvPC);
	vel.mulFloatSelf(this.mInvPC);
	
	this.mDerivedPos = center;
	this.mDerivedVel = vel;
	
	// find the average angle of all of the masses.
	var angle = 0;
	var originalSign = 1;
	var originalAngle = 0;
	for(var i = 0; i < this.mPointCount; i++) {
		var baseNorm = this.mBaseShape.getVertices()[i].copy(); // Vector2
		baseNorm.normalize();
		
		var curNorm = this.pointMasses[i].Position.sub(this.mDerivedPos); // Vector2
		curNorm.normalize();
		
		var dot = baseNorm.dotProduct(curNorm); // float
		if (dot > 1.0) { dot = 1.0; };
		if (dot < -1.0) { dot = -1.0; };
		
		var thisAngle = Math.acos(dot); // float
		if (!VectorTools.isCCW(baseNorm, curNorm)) { thisAngle = -thisAngle; };
		
		if (i == 0) {
			originalSign = (thisAngle >= 0.0) ? 1 : -1;
			originalAngle = thisAngle;
		} else {
			var diff = (thisAngle - originalAngle); // float
			var thisSign = (thisAngle >= 0.0) ? 1 : -1; // int
			
			if ((absf(diff) > PI) && (thisSign != originalSign)) {
				thisAngle = (thisSign == -1) ? (PI + (PI + thisAngle)) : ((PI - thisAngle) - PI);
			};
		};
		
		angle += thisAngle;
	};
	
	angle *= this.mInvPC;
	this.mDerivedAngle = angle;
	
	// now calculate the derived Omega, based on change in angle over time.
	var angleChange = (this.mDerivedAngle - this.mLastAngle); // float
	if (absf(angleChange) >= PI)
	{
		if (angleChange < 0.0)
			angleChange = angleChange + TWO_PI;
		else
			angleChange = angleChange - TWO_PI;
	}

	this.mDerivedOmega = angleChange / elapsed;

	this.mLastAngle = this.mDerivedAngle;
};

Body.prototype.updateEdgeInfo = function(forceUpdate) { // bool(have to be updated?)
	if(((!this.mIsStatic) && (!this.mIgnoreMe)) || (forceUpdate)) {
		for (var i = 0; i < this.mPointCount; i++) {
			var j = (i < (this.mPointCount-1)) ? i + 1 : 0; // int

			var e = this.pointMasses[j].Position.sub(this.pointMasses[i].Position); // Vector2
			this.mEdgeInfo[i].length = e.normalize();
			this.mEdgeInfo[i].dir = e;
			// TODO: maybe here is a bug: if y is nearly zero slope should be infinite
			this.mEdgeInfo[i].slope = (absf(e.y) < 1.0e-08) ? 0.0 : (e.x / e.y);
		};
	};
};

Body.prototype.getDerivedPosition = function() { return this.mDerivedPos; };
Body.prototype.getDerivedAngle = function() { return this.mDerivedAngle; };
Body.prototype.getDerivedVelocity = function() { return this.mDerivedVel; };
Body.prototype.getDerivedOmega = function() { return this.mDerivedOmega; };

Body.prototype.getScale = function() { return this.mScale; };

Body.prototype.accumulateInternalForces = function() {};

// Handle external forces
Body.prototype.accumulateExternalForces = function() {
	var length = this.externalForces.length;
	for(var i = 0; i < length; i++) {
		this.externalForces[i].call(this, this);
	};
};

Body.prototype.addExternalForce = function(forceCallback) {
	if (this.externalForces.indexOf(forceCallback) === - 1) {
		this.externalForces.push(forceCallback);
	};
};

Body.prototype.removeExternalForce = function(forceCallback) {
	var index = this.externalForces.indexOf(forceCallback);
	if (index !== - 1) {
		this.externalForces.splice(index, 1);
	};
};

Body.prototype.clearExternalForces = function() {
	this.externalForces.length = 0;
};
// End of External forces



Body.prototype.integrate = function(elapsed) { // float
	if (this.mIsStatic || this.mIgnoreMe) { return; };
	
	for(var i = 0; i < this.pointMasses.length; i++)
		this.pointMasses[i].integrateForce(elapsed);
};

Body.prototype.dampenVelocity = function() {
	if (this.mIsStatic || this.mIgnoreMe) { return; }

	for(var i = 0; i < this.pointMasses.length; i++)
		this.pointMasses[i].Velocity.mulFloatSelf(this.mVelDamping);
};

Body.prototype.updateAABB = function(elapsed, forceUpdate) { // float, bool 
	forceUpdate = forceUpdate || false;
	if (((!this.mIsStatic) && (!this.mIgnoreMe)) || (forceUpdate)) {
		this.mAABB.clear();
		for(var i = 0; i < this.pointMasses.length; i++) {
			var p = this.pointMasses[i].Position.copy(); // Vector2
			this.mAABB.expandToInclude(p);
			
			// expanding for velocity only makes sense for dynamic objects.
			if (!this.mIsStatic) {
				p.addSelf(this.pointMasses[i].Velocity.mulFloat(elapsed));
				this.mAABB.expandToInclude(p);
			};
		};
		
		//printf("Body: %d AABB: min[%f][%f] max[%f][%f]\n", this, mAABB.Min.X, mAABB.Min.Y, mAABB.Max.X, mAABB.Max.Y);
	};
};

Body.prototype.getAABB = function() { return this.mAABB; };

Body.prototype.contains = function(pt) { // Vector2
	// basic idea: draw a line from the point to a point known to be outside the body.  count the number of
	// lines in the polygon it intersects.  if that number is odd, we are inside.  if it's even, we are outside.
	// in this implementation we will always use a line that moves off in the positive X direction from the point
	// to simplify things.
	var endPt = new Vector2(this.mAABB.Max.x + 0.1, pt.y); // Vector2
	
	// line we are testing against goes from pt -> endPt.
	var inside = false; // bool
	var edgeSt = this.pointMasses[0].Position; // Vector2
	var edgeEnd = new Vector2(0.0, 0.0); // Vector2
	var c = this.mPointCount; // int
	for(var i = 0; i < c; i++) {
		// the current edge is defined as the line from edgeSt -> edgeEnd.
		if(i < (c - 1))
			edgeEnd = this.pointMasses[i + 1].Position;
		else
			edgeEnd = this.pointMasses[0].Position;
		
		// perform check now...
		if(((edgeSt.y <= pt.y) && (edgeEnd.y > pt.y)) || ((edgeSt.y > pt.y) && (edgeEnd.y <= pt.y))) {
			// this line crosses the test line at some point... does it do so within our test range?
			var mult = (pt.y - edgeSt.y) / (edgeEnd.y - edgeSt.y);
			var hitX = edgeSt.x + (mult * (edgeEnd.x - edgeSt.x));
			//var slope = this.mEdgeInfo[i].slope; 
			//slope = (edgeEnd.x - edgeSt.x) / (edgeEnd.Y - edgeSt.Y); // float
			
			//var hitX = edgeSt.x + ((pt.y - edgeSt.y) * slope); // float
			
			if((hitX >= pt.x) && (hitX <= endPt.x))
				inside = !inside;
		};
		edgeSt = edgeEnd;
	};
	
	return inside;
};

Body.prototype.getClosestPoint = function(pt, hitPt, norm, pointA, pointB, edgeD) { // Vector2, Vector2, Vector2, int, int, float
	throw Error("TODO: allparameter are designed as out parameter");
	hitPt = new Vector2(0.0, 0.0);
	pointA = -1;
	pointB = -1;
	edgeD = 0.0;
	norm = new Vector2(0.0, 0.0);
	
	var closestD = 1000.0; // float

	for (var i = 0; i < this.mPointCount; i++) {
		var tempHit = new Vector2(0.0, 0.0); // Vector2
		var tempNorm = new Vector2(0.0, 0.0); // Vector2
		var tempEdgeD = 0.0; // float
		
		var dist = this.getClosestPointOnEdge(pt, i, tempHit, tempNorm, tempEdgeD); // float
		if (dist < closestD) {
			closestD = dist;
			pointA = i;
			if (i < (this.mPointCount - 1))
				pointB = i + 1;
			else
				pointB = 0;
			edgeD = tempEdgeD;
			norm = tempNorm;
			hitPt = tempHit;
		}
	}

	return closestD;
};

Body.prototype.getIsStatic = function() { return this.mIsStatic; };
Body.prototype.setIsStatic = function(val) { this.mIsStatic = val; }; // bool

Body.prototype.getIgnoreMe = function() { return this.mIgnoreMe; };
Body.prototype.setIgnoreMe = function(setting) { this.mIgnoreMe = setting; }; // bool

Body.prototype.getClosestPointOnEdgeSquared = function(outParams) {
//outParams = {
//	pt, // const Vector2&
//	edgeNum, // int
//	hitPt, // Vector2&
//	norm, // Vector2&
//	edgeD // float&
//}
//----------------------------------------------
	if(this.aName == "B")
	{
		hallo = 1;
	};
	outParams.hitPt = new Vector2(0.0, 0.0);
	outParams.norm = new Vector2(0.0, 0.0);
	
	outParams.edgeD = 0.0;
	var dist = 0.0; // float
	
	var ptA = this.pointMasses[outParams.edgeNum].Position; // Vector2
	var ptB; // Vector2
	
	if (outParams.edgeNum < (this.mPointCount - 1))
		ptB = this.pointMasses[outParams.edgeNum + 1].Position;
	else
		ptB = this.pointMasses[0].Position;
	
	var toP = outParams.pt.sub(ptA); // Vector2
	var E = this.mEdgeInfo[outParams.edgeNum].dir; // Vector2
	
	// get the length of the edge, and use that to normalize the vector.
	var edgeLength = this.mEdgeInfo[outParams.edgeNum].length; // float
	
	// normal
	var n = E.getPerpendicular(); // Vector2
	
	// calculate the distance!
	var x = toP.dotProduct(E); // float
	if (x <= 0.0)
	{
		// x is outside the line segment, distance is from pt to ptA.
		dist = (outParams.pt.sub(ptA)).lengthSquared();
		//Vector2.DistanceSquared(ref pt, ref ptA, out dist);
		outParams.hitPt = ptA;
		outParams.edgeD = 0.0;
		outParams.norm = n;
		
		//printf("getClosestPointonEdgeSquared - closest is ptA: %f\n", dist);
	}
	else if (x >= edgeLength)
	{
		// x is outside of the line segment, distance is from pt to ptB.
		dist = (outParams.pt.sub(ptB)).lengthSquared();
		//Vector2.DistanceSquared(ref pt, ref ptB, out dist);
		outParams.hitPt = ptB;
		outParams.edgeD = 1.0;
		outParams.norm = n;
		
		//printf("getClosestPointonEdgeSquared - closest is ptB: %f\n", dist);
	}
	else
	{
		// point lies somewhere on the line segment.			
		dist = toP.crossProduct(E);
		//Vector3.Cross(ref toP3, ref E3, out E3);
		dist = (dist * dist);
		outParams.hitPt = ptA.add(E.mulFloat(x));
		outParams.edgeD = x / edgeLength;
		outParams.norm = n;
		
		//printf("getClosestPointonEdgeSquared - closest is at %f: %f\n", edgeD, dist);
	}
	
	return dist;
};

Body.prototype.getPointMassCount = function() { return this.mPointCount; };
Body.prototype.getPointMass = function(index) { return this.pointMasses[index]; }; // int index, returns PointMass* 

Body.prototype.addGlobalForce = function(pt, force) { //  const Vector2&,  const Vector2&
	var R = this.mDerivedPos.sub(pt); // Vector2

	var torqueF = R.crossProduct(force); // float
	
	for (var i = 0; i < this.pointMasses.length; i++)
	{
		var massPoint = this.pointMasses[i];
		var toPt = massPoint.Position.sub(this.mDerivedPos); // Vector2
		var torque = VectorTools.rotateVector(toPt, -HALF_PI); // Vector2
		
		massPoint.Force.addSelf(torque.mulFloat(torqueF));
		massPoint.Force.addSelf(force);
	}
};

Body.prototype.addGlobalRotationForce = function(forceLength) { // float
	for (var i = 0; i < this.pointMasses.length; i++)
	{
		var massPoint = this.pointMasses[i];
		var toPt = massPoint.Position.sub(this.mDerivedPos); // Vector2
		var counterClockwiseDirection = toPt.getPerpendicular();

		massPoint.Force.addSelf(counterClockwiseDirection.mulFloat(forceLength));
	}
};

Body.prototype.getVelocityDamping = function() { return this.mVelDamping; }; // returns float
Body.prototype.setVelocityDamping = function(val) { this.mVelDamping = val; }; // float

Body.prototype.getClosestPointMass = function(pos, dist) { // Vector2, float
	var closestSQD = 100000.0; // float
	var closest = -1; // int

	for(var i = 0; i < this.mPointCount; i++)
	{
		var thisD = (pos.sub(this.pointMasses[i].Position)).lengthSquared(); // float
		if (thisD < closestSQD)
		{
			closestSQD = thisD;
			closest = i;
		}
	}
	
	dist = Math.sqrt(closestSQD); // float
	return {
		"pointMassId": closest,
		"distance": dist
	};
};

Body.prototype.getIsKinematic = function() { return this.mKinematic; }; // returns bool
Body.prototype.setIsKinematic = function(val) { this.mKinematic = val; }; // bool

Body.prototype.getObjectTag = function() { return this.mObjectTag; };
Body.prototype.setObjectTag = function(obj) { this.mObjectTag = obj; };

Body.prototype.setEntity = function(entity) {
	this.entity = entity;
	entity.body = this;
};
Body.prototype.getEntity = function() { return this.entity; };

/*
 * Drawing
 */
Body.prototype.debugDraw = function(debugDraw) {
	this.mAABB.debugDraw(debugDraw);
	this.debugDrawGlobalShape(debugDraw);
	this.debugDrawPointMasses(debugDraw);
	this.debugDrawMiddlePoint(debugDraw);
};

Body.prototype.debugDrawGlobalShape = function(debugDraw) {
	debugDraw.setOptions({
		"color": "gray",
		"opacity": 0.5,
		"lineWidth": 1
	});
	
	// draw a polyline
	debugDraw.drawPolyline(this.mGlobalShape);
};

Body.prototype.debugDrawPointMasses = function(debugDraw) {
	debugDraw.setOptions({
		"color": "white",
		"opacity": 1.0,
		"lineWidth": 1
	});

	// draw a polyline
	debugDraw.drawPolyline($.map(this.pointMasses, function(pMass) {return pMass.Position; }));

	for(var i = 0; i <  this.pointMasses.length; i++)
		debugDraw.drawRectangle(this.pointMasses[i].Position, 3);//i+1);
};

// TODO: impement
Body.prototype.debugDrawMiddlePoint = function(debugDraw) {
};

Bloob.BodyBluePrint = Body;