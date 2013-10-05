(function(window, undefined){
	
	var Jello = {};var QueueItem = function(func, args) {
	this.func = func;
	this.args = args;
};

var Queue = function(obj) {

	this.__events__ = [];
	this.object = obj;
	
	// mimic objs interface
	for(var prop in obj) {
		(function(that, prop) {
			that[prop] = function() {
				// safe the call for later execution
				that.__events__.push(
					new QueueItem(
						prop,
						arguments
					)
				);
				// provide chainability
				return that;
			};
		})(this, prop);
	}
};

Queue.prototype.fire = function() {
	// process all collected events
	for(var i = 0; i < this.__events__.length; i++) {
		var func = this.object[this.__events__[i].func];
		var context = this.object;
		var args = this.__events__[i].args;
		func.apply(context, args);
	}
	
	// reset event
	this.__events__.length = 0;
};
var Bitmask = function() {
	this.clear();
};

Bitmask.prototype.clear = function() {
	this.mask = 0x00;
};

Bitmask.prototype.setOn = function(bit) {
	this.mask |= (0x01 << (bit));
};

Bitmask.prototype.setOff = function(bit) {
	this.mask &= ~(0x01 << (bit));
};

Bitmask.prototype.getBit = function(bit) {
	return ((this.mask & (0x01 << (bit))) != 0);
};
var InternalSpring = function(pmA, pmB, d, k, damp) {
	this.pointMassA = pmA || 0;
	this.pointMassB = pmB || 0;
	this.springD = d || 0.0;
	this.springK = k || 0.0;
	this.damping = damp || 0.0;
};

InternalSpring.prototype.debugDraw = function(debugDraw, body) {
	debugDraw.setOptions({
		"color": "green",
		"opacity": 0.6,
		"lineWidth": 1
	});

	debugDraw.drawPolyline([
		body.pointMasses[this.pointMassA].Position,
		body.pointMasses[this.pointMassB].Position
	]);
};
// TODO: List of Vectors?
// typedef std::vector<Vector2> Vector2List;

var PI = 3.14159265;
var TWO_PI = (3.14159265 * 2.0);
var HALF_PI = (3.14159265 * 0.5);
var PI_OVER_ONE_EIGHTY = (3.14159265 / 180.0);
var ONE_EIGHTY_OVER_PI = (180.0 / 3.14159265);

var absf = function(v) {
	return (v >= 0.0) ? v : -v;
};

Utils = {};
Utils.fillArray = function(value, length) {
	arr = [];
	for(var i = 0; i < length; i++)
		arr.push(value);
	return arr;
};
// TODO: initialize for 0 values
var Vector2 = function(x, y) {

	if(typeof x === "undefined" && typeof y === "undefined") {
		this.x = 0;
		this.y = 0;
	} else if(typeof y === "undefined") {
		this.x = x.x;
		this.y = x.y;
	} else {
		this.x = x;
		this.y = y;
	}
};

Vector2.Zero = new Vector2(0, 0);
Vector2.One = new Vector2(1, 1);

Vector2.prototype.copy = function() {
	return new Vector2(this.x, this.y);
};

Vector2.prototype.set = function(vector) {
	this.x = vector.x;
	this.y = vector.y;
	return this;
};

Vector2.prototype.equals = function(vector) {
	return this.x == vector.x && this.y == vector.y;
};

Vector2.prototype.notEquals = function(vector) {
	return this.x != vector.x || this.y != vector.y;
};

Vector2.prototype.add = function(vector) {
	return new Vector2(
		this.x + vector.x,
		this.y + vector.y
	);
};
Vector2.prototype.addSelf = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
	return this;
};
	
Vector2.prototype.sub = function(vector) {
	return new Vector2(
		this.x - vector.x,
		this.y - vector.y
	);
};
Vector2.prototype.subSelf = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	return this;
};
	
// scaling!
Vector2.prototype.mulFloat = function(right) {
	return new Vector2(
		this.x * right,
		this.y * right
	);
};
Vector2.prototype.mulFloatSelf = function(right) {
	this.x *= right;
	this.y *= right;
	return this;
};
	
Vector2.prototype.divFloat = function(right) {
	var inv = 1.0 / right;
	return new Vector2(
		this.x * inv,
		this.y * inv
	);
};
Vector2.prototype.divFloatSelf = function(right) {
	this.x /= right;
	this.y /= right;
	return this;
};

// per-element multiplication
Vector2.prototype.mulVector = function(right) {
	return new Vector2(
		this.x * right.x,
		this.y * right.y
	);
};
Vector2.prototype.mulVectorSelf = function(right) {
	this.x *= right.x;
	this.y *= right.y;
	return this;
};

Vector2.prototype.divVector = function(right) {
	return new Vector2(
		this.x / right.x,
		this.y / right.y
	);
};
Vector2.prototype.divVectorSelf = function(right) {
	this.x /= right.x;
	this.y /= right.y;
	return this;
};

Vector2.prototype.positive = function() { return this; };
Vector2.prototype.negative = function() {
	return new Vector2(-this.x, -this.y);
};

// helpers

Vector2.prototype.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
};
Vector2.prototype.lengthSquared = function() {
	return this.x*this.x + this.y*this.y;
};
Vector2.prototype.normalize = function() {
	var length = Math.sqrt(this.x*this.x + this.y*this.y);
	if(length > 1e-08) {
		var invL = 1.0 / length;
		this.x *= invL;
		this.y *= invL;
	}
	return length;
};

Vector2.prototype.normalizedCopy = function() {
	var ret = this.copy();
	ret.normalize();
	return ret;
};

Vector2.prototype.dotProduct = function(vector) {
	return this.x*vector.x + this.y*vector.y;
};

Vector2.prototype.getPerpendicular = function() {
	return this.getRightPerpendicular();
};

Vector2.prototype.getLeftPerpendicular = function() {
	var x = this.y;
	var y = -1 * this.x;
	return new Vector2(x, y);
};

Vector2.prototype.getRightPerpendicular = function() {
	var x = -1 * this.y;
	var y = this.x;
	return new Vector2(x, y);
};

Vector2.prototype.makePerpendicular = function() {
	var tempX = this.x;
	this.x = -this.y;
	this.y = tempX;
};

Vector2.prototype.crossProduct = function(vector) {
	return this.x * vector.y + this.y * vector.x;
};

Vector2.prototype.lerp = function(to, i) {
	return this.add(to.sub(this).mulFloat(i));
};

Vector2.prototype.slerp = function(to, i) {
	return this.add(to.sub(this).mulFloat(
		0.5 + (Math.sin((3.141592654 * i) - 1.570796) * 0.5)));
};

Vector2.prototype.reflectOnNormal = function(normal) {
	//v' = 2 * (v . n) * n - v
	var newVector =
		this.sub(
			normal
			.mulFloat(this.dotProduct(normal))
			.mulFloat(2)
		);
	return newVector;
	
};



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
};var Invalid = true;
var Valid = false;

var AABB = function(minPt, maxPt) {
	this.Min = minPt || new Vector2(0.0, 0.0);
	this.Max = maxPt || new Vector2(0.0, 0.0);
	this.Validity = typeof minPt === "undefined" ? Invalid : Valid;
};	

AABB.prototype.clear = function() {
	this.Min = new Vector2(0.0, 0.0);
	this.Max = new Vector2(0.0, 0.0);
	this.Validity = Invalid;
};	

AABB.prototype.expandToInclude = function(vectorOrAABB) {
	// check for vector
	if(typeof vectorOrAABB.x !== "undefined") {
		// vector
		var pt = vectorOrAABB;
		
		if (this.Validity == Valid) {
			if (pt.x < this.Min.x) { this.Min.x = pt.x; }
			else if (pt.x > this.Max.x) { this.Max.x = pt.x; }
			
			if (pt.y < this.Min.y) { this.Min.y = pt.y; }
			else if (pt.y > this.Max.y) { this.Max.y = pt.y; }
		} else {
			this.Min = pt.copy();
			this.Max = pt.copy();
			this.Validity = Valid;
		};
	} else {
		// AABB
		this.expandToInclude(vectorOrAABB.Min);
		this.expandToInclude(vectorOrAABB.Max);
	};
};	

AABB.prototype.contains = function(pt) {
		if (this.Validity == Invalid) { return false; };

		return ((pt.x >= this.Min.x) && (pt.x <= this.Max.x) && (pt.y >= this.Min.y) && (pt.y <= this.Max.y));
};

AABB.prototype.intersects = function(box) {
		var overlapX = ((this.Min.x <= box.Max.x) && (this.Max.x >= box.Min.x));
		var overlapY = ((this.Min.y <= box.Max.y) && (this.Max.y >= box.Min.y));
		
		return (overlapX && overlapY);
};	

AABB.prototype.getSize = function() { return this.Max.sub(this.Min); };

AABB.prototype.getTopLeft = function() {
	return this.Min;
};
AABB.prototype.getTopRight = function() {
	return new Vector2(this.Max.x, this.Min.y);
};
AABB.prototype.getBottomLeft = function() {
	return new Vector2(this.Min.x, this.Max.y);
};
AABB.prototype.getBottomRight = function() {
	return this.Max;
};

AABB.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"lineWidth": 1,
		"color": "red"
	});

	debugDraw.drawPolyline([
		this.Min,
		new Vector2(this.Min.x, this.Max.y),
		this.Max,
		new Vector2(this.Max.x, this.Min.y),
		this.Min
	]);
};
var VectorTools = {
	"rotateVector": function(vectorIn, angleRadiansOrCosAngle, sinAngle) {
		var ret = new Vector2();
		if(typeof sinAngle === "undefined") {
			var angleRadians = angleRadiansOrCosAngle;
			var c = Math.cos(angleRadians);
            var s = Math.sin(angleRadians);
            ret.x = (c * vectorIn.x) - (s * vectorIn.y);
            ret.y = (c * vectorIn.y) + (s * vectorIn.x);
		} else {
			var cosAngle = angleRadiansOrCosAngle;
			ret.x = (cosAngle * vectorIn.x) - (sinAngle * vectorIn.y);
            ret.y = (cosAngle * vectorIn.y) + (sinAngle * vectorIn.x);
		};
		return ret;
	},
	// should project v onto n and subtarct the vector twice to get the reflected vector
	// TODO: at least thats the plan
	"reflectVector": function(v, n, out) {
		throw Error("TODO: implement: reflect Vector");
		if(typeof out === "undefined") {
			var ret = v.sub(n.mulFloat(v.dotProduct(n) * 2.0));
			return ret;
		} else {
			var dot = v.dotProduct(n);
            out.set(v.sub(n.mulFloat(2.0 * dot)));
		};
	},
	"isCCW": function(a, b) {
		var perp = a.getPerpendicular();
		var dot = b.dotProduct(perp);
		return (dot >= 0.0);
	},
	"degToRad": function(deg) { return deg * (PI_OVER_ONE_EIGHTY); },
	"radToDeg": function(rad) { return rad * (ONE_EIGHTY_OVER_PI); },
	"lineIntersect": function(ptA, ptB, ptC, ptD, 
								hitPt, Ua, Ub) {
		Ua = 0.0;
		Ub = 0.0;
		
		var denom = ((ptD.y - ptC.y) * (ptB.x - ptA.x)) - ((ptD.x - ptC.x) * (ptB.y - ptA.y));
		
		// if denom == 0, lines are parallel - being a bit generous on this one..
		if (absf(denom) < 0.000001)
			return false;

		var UaTop = ((ptD.x - ptC.x) * (ptA.y - ptC.y)) - ((ptD.y - ptC.y) * (ptA.x - ptC.x));
		var UbTop = ((ptB.x - ptA.x) * (ptA.y - ptC.y)) - ((ptB.y - ptA.y) * (ptA.x - ptC.x));

		Ua = UaTop / denom;
		Ub = UbTop / denom;			
			
		if ((Ua >= 0.0) && (Ua <= 1.0) && (Ub >= 0.0) && (Ub <= 1.0))
		{
			// these lines intersect!
			// hitPt as out parameter
			hitPt.set(ptA.add((ptB.sub(ptA)).mulFloat(Ua)));
			return true;
		};
		
		hitPt.set(Vector2.Zero);
		return false;
	},
	"calculateSpringForceVelAVelB": function(posA, velA, posB, velB, springD, springK, damping) {
		var BtoA = new Vector2(posA.sub(posB));
		var dist = BtoA.length();
		if (dist > 0.0001)
			BtoA.divFloatSelf(dist);
		else
			BtoA.set(Vector2.Zero);
		
		dist = springD - dist;
		
		var relVel = new Vector2(velA.sub(velB));
		var totalRelVel = relVel.dotProduct(BtoA);
		
		//printf("calculateSpringForce: dist[%f] k[%f]  totalRelVel[%f] damp[%f]\n", dist, springK, totalRelVel, damping);
		
		return BtoA.mulFloat((dist * springK) - (totalRelVel * damping));  	
	}
};
var ClosedShape = function(input) {
	this.mLocalVertices = input || []; // Vectorlist
};
	
ClosedShape.prototype.begin = function() {
	this.mLocalVertices.length = 0; // clear()
	return this;
};

ClosedShape.prototype.addVertex = function(vec) {
	this.mLocalVertices.push(vec);
	//return this.mLocalVertices.length;
	return this;
};

ClosedShape.prototype.finish = function(recenter) {
	recenter = recenter || true;

	if(recenter) {
		// find the average location of all of the vertices, this is our geometrical center.
		var center = new Vector2(0.0, 0.0);
		
		for(var i = 0; i < this.mLocalVertices.length; i++)
			center.addSelf(this.mLocalVertices[i]);
		
		center.divFloatSelf(this.mLocalVertices.length);
		
		// now subtract this from each element, to get proper "local" coordinates.
		for (var i = 0; i < this.mLocalVertices.length; i++)
			this.mLocalVertices[i].subSelf(center);
	};
	return this;
};

ClosedShape.prototype.getVertices = function() { return this.mLocalVertices; };

ClosedShape.prototype.transformVertices = function(worldPos, angleInRadians, scale, outList) {
	outList = outList || [];

	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	var that = this;
	
	for(var i = 0; i < this.mLocalVertices.length; i++) {
		(function() {
			// apply scale vector
			var v = new Vector2(that.mLocalVertices[i].mulVector(scale));

			// rotate the point, and then translate.
			v = VectorTools.rotateVector(v, c, s);
			v.addSelf(worldPos);

			outList[i] = v;
		})();
	};
	
	return outList;
};

	
	
	
	
	
	// TODO: refactor body class
// keep an eye on performance

var EdgeInfo = function() {
	this.dir = new Vector2.Zero.copy();	// normalized direction vector for this edge.
	this.length = 0;	// length of the edge.
	this.slope = 0.0;	// slope of the line described by this edge.
};

//typedef std::vector<EdgeInfo> EdgeInfoList;
//typedef std::vector<PointMass> PointMassList;

var Body = function(w, shape, pointMasses, position, angleInRadians, scale, kinematic) {
	this._setDefaultValues();
	this._buildFromDefinition({
		"world": w,
		"shape": shape,
		"pointMasses": pointMasses instanceof Array ? pointMasses : Utils.fillArray(pointMasses, shape.getVertices().length),
		"position": position,
		"angleInRadians": angleInRadians,
		"scale": scale,
		"kinematic": kinematic
	});
};

Body.prototype._setDefaultValues = function() {
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
	this.mMaterial = Material.Default;
	this.mIsStatic = false;
	this.mKinematic = false;
	this.mObjectTag = null;
	this.mVelDamping = 0.0;

	this.mPointCount = 0;
	this.mInversePointCount = 0;

	this.mIgnoreMe = false;

	this.mBitMaskY = new Bitmask();

	this.externalForces = []; // array of force callbacks
	
	this.id = "body" + Body.nextBodyId++;
	this._userData = {};
	
	// contact listener callbacks
	this._onContactCallbacks = [];
	this._onStartContactCallbacks = [];
	this._onEndContactCallbacks = [];
	
	// callbacks called with every world update
	this._withUpdateCallbacks = [];
	this._beforeUpdateCallbacks = [];
	this._afterUpdateCallbacks = [];
};

Body.prototype._buildFromDefinition = function(bodyDefinition) {
	this.mWorld = bodyDefinition.world;
	this.mDerivedPos = bodyDefinition.position;
	this.mDerivedAngle = bodyDefinition.angleInRadians;
	this.mLastAngle = this.mDerivedAngle;
	this.mScale = bodyDefinition.scale;
	this.mMaterial = Material.Default;
	this.mPointCount = 0;
	this.mInversePointCount = 0.0;

	// TODO: check for all zero masses -> static
	this.mIsStatic = false; // || bodyDefinition.pointMasses.all == 0.0;
	this.mKinematic = bodyDefinition.kinematic;
	
	this.mVelDamping = 0.999;
	this.mObjectTag = null;

	this.mIgnoreMe = false;

	this.setShape(bodyDefinition.shape);

	// attach mass values to each pointMass in shape
	for (var i = 0; i < this.mPointCount; i++)
		this.pointMasses[i].Mass = bodyDefinition.pointMasses[i];
	
	this.updateAABB(0.0, true);
	this.updateEdgeInfo(true);

	// add body to world
	bodyDefinition.world.addBody(this);
};

Body.nextBodyId = 0;

Body.prototype.kill = function() {
	this.mWorld.removeBody(this);
};

Body.prototype.setShape = function(shape, forceUpdate) {
	forceUpdate = forceUpdate || false;
	
	this.mBaseShape = shape;
	
	if (this.mBaseShape.getVertices().length != this.mPointCount || forceUpdate)
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
		this.mInversePointCount = 1.0 / this.mPointCount;
	}
	
	this.updateAABB(0.0, true);
	this.updateEdgeInfo(true);
};

Body.prototype.getBaseShape = function() {
	return this.mBaseShape;
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
	
	center.mulFloatSelf(this.mInversePointCount);
	vel.mulFloatSelf(this.mInversePointCount);
	
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
	
	angle *= this.mInversePointCount;
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

/*
 * user data
 */
Body.prototype.setUserData = function(key, data) {
	this._userData[key] = data;
	return this;
};

Body.prototype.getUserData = function(key) {
	return this._userData[key];
};

/*
 * contact listeners
 */
// add callbacks
Body.prototype.onContact = function(callback) {
	this._onContactCallbacks.push(callback);
	return this;
};

Body.prototype.onStartContact = function(callback) {
	this._onStartContactCallbacks.push(callback);
	return this;
};

Body.prototype.onEndContact = function(callback) {
	this._onEndContactCallbacks.push(callback);
	return this;
};

// call callback (this reference points to one body)
Body.prototype.callOnContact = function(otherBody, contact) {
	for(var i = 0; i < this._onContactCallbacks.length; i++) {
		this._onContactCallbacks[i].apply(this, arguments);
	};
};

Body.prototype.callOnStartContact = function(otherBody, contact) {
	for(var i = 0; i < this._onStartContactCallbacks.length; i++) {
		this._onStartContactCallbacks[i].apply(this, arguments);
	};
};

Body.prototype.callOnEndContact = function(otherBody) {
	for(var i = 0; i < this._onEndContactCallbacks.length; i++) {
		this._onEndContactCallbacks[i].apply(this, arguments);
	};
};

/*
 * before/after update
 */
//add callbacks
Body.prototype.withUpdate = function(callback) {
	this._withUpdateCallbacks.push(callback);
	return this;
};

Body.prototype.beforeUpdate = function(callback) {
	this._beforeUpdateCallbacks.push(callback);
	return this;
};

Body.prototype.afterUpdate = function(callback) {
	this._afterUpdateCallbacks.push(callback);
	return this;
};

// call callback (this reference points to one body)
Body.prototype.callWithUpdate = function(timePassed) {
	for(var i = 0; i < this._withUpdateCallbacks.length; i++) {
		this._withUpdateCallbacks[i].apply(this, arguments);
	};
};

Body.prototype.callBeforeUpdate = function(timePassed) {
	for(var i = 0; i < this._beforeUpdateCallbacks.length; i++) {
		this._beforeUpdateCallbacks[i].apply(this, arguments);
	};
};

Body.prototype.callAfterUpdate = function(timePassed) {
	for(var i = 0; i < this._afterUpdateCallbacks.length; i++) {
		this._afterUpdateCallbacks[i].apply(this, arguments);
	};
};


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

Body.prototype.debugDrawMiddlePoint = function(debugDraw) {
	debugDraw.setOptions({
		"color": "lightgreen",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawRectangle(this.mDerivedPos, 5);//i+1);
};
var BodyCollisionInfo = function() {
	this.bodyA = 0; // Body
	this.bodyB = 0; // Body

	this.bodyApm = 0; // int
	this.bodyBpmA = 0; // int
	this.bodyBpmB = 0; // int

	this.hitPt = new Vector2(0.0, 0.0); // Vector2	
	this.edgeD = 0.0; // float
	this.norm = new Vector2(0.0, 0.0); // Vector2	
	this.penetration = 0.0; // float
};

BodyCollisionInfo.prototype.Clear = function() {
	this.bodyA = 0; // Body
	this.bodyB = 0; // Body

	this.bodyApm = -1; // int
	this.bodyBpmA = -1; // int
	this.bodyBpmB = -1; // int

	this.hitPt = new Vector2(0.0, 0.0); // Vector2	
	this.edgeD = 0.0; // float
	this.norm = new Vector2(0.0, 0.0); // Vector2	
	this.penetration = 0.0; // float
};

BodyCollisionInfo.prototype.Log = function() {
	//printf("BCI bodyA:%d bodyB:%d bApm:%d bBpmA:%d, bBpmB:%d\n", bodyA, bodyB, bodyApm, bodyBpmA, bodyBpmB);
	//printf("	hitPt[%f][%f] edgeD:%f norm[%f][%f] penetration:%f\n",
	//	   hitPt.X, hitPt.Y, edgeD, norm.X, norm.Y, penetration);
};

/*
 * Draw Collisions
 */
BodyCollisionInfo.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "green",
		"opacity": 1.0,
		"lineWidth": 1
	});

	var hitPoint = this.hitPt;
	var penetrationTill = this.bodyA.pointMasses[this.bodyApm].Position;

	debugDraw.drawPolyline([hitPoint, penetrationTill]);

	debugDraw.drawPlus(hitPoint);
	debugDraw.drawPlus(penetrationTill);
};var CollisionCallback = function() {};

CollisionCallback.prototype.collisionFilter = function(bA, bodyApm, bodyB, bodyBpm1, bodyBpm2, hitPt, normalVel) { // Body*, int, Body*, int, int, Vector2, float
	return true;
};

var Material = {
	"Default": 0,
	"Test1": 1,
	"Test2": 2,
	"Test3": 3,
	"Test4": 4,
	"Test5": 5,
	"Test6": 6
	//"Ground": 1,
	//"Slicky": 2
};

var MaterialPair = function() {
	this.Collide = true;
	this.Elasticity = 0.7;
	this.Friction = 0.3;
	this.Callback = new CollisionCallback();
};

var MaterialManager = function() {
	this.mMaterialPairs = []; // MaterialPair*	
	this.mDefaultMatPair = new MaterialPair(); // MaterialPair
	this.mMaterialCount = 0; // int

	// real constructor
	this.mMaterialCount = 1;
	this.mMaterialPairs = [new MaterialPair()];
	this.mDefaultMatPair.Friction = 0.3;
	this.mDefaultMatPair.Elasticity = 0.8;
	this.mDefaultMatPair.Collide = true;

	this.mMaterialPairs[0] = this.mDefaultMatPair;
	
	this.mMaterialPairs = {};
	this.addMaterial(Material.Default);
};

MaterialManager.prototype.getMaterialPair = function(materialA, materialB) {
	return this.mMaterialPairs[materialA][materialB];
	return this.mMaterialPairs[(materialA * this.mMaterialCount) + materialB];
};

MaterialManager.prototype.addMaterial = function(material)
{
	this.mMaterialCount++;
	
	for(mat in this.mMaterialPairs) {
		this.mMaterialPairs[mat][material] = new MaterialPair();
	};

	this.mMaterialPairs[material] = {};
	this.mMaterialPairs[material][material] = new MaterialPair();
	
	for(mat in this.mMaterialPairs) {
		this.mMaterialPairs[material][mat] = this.mMaterialPairs[mat][material];
	};
};

MaterialManager.prototype.setMaterialPairCollide = function(materialA, materialB, collide) {
	this.mMaterialPairs[materialA][materialB].Collide = collide;
	this.mMaterialPairs[materialB][materialA].Collide = collide;
};

MaterialManager.prototype.setMaterialPairData = function(materialA, materialB, friction, elasticity) {
	this.mMaterialPairs[materialA][materialB].Friction = friction;
	this.mMaterialPairs[materialA][materialB].Elasticity = elasticity;

	this.mMaterialPairs[materialB][materialA].Friction = friction;
	this.mMaterialPairs[materialB][materialA].Elasticity = elasticity;
};

MaterialManager.prototype.setMaterialPairFilterCallback = function(materialA, materialB, collisionCallback) {
	this.mMaterialPairs[materialB][materialA].Callback = collisionCallback;
	this.mMaterialPairs[materialA][materialB].Callback = collisionCallback;
};

MaterialManager.prototype.getMaterialCount = function() { return this.mMaterialCount; };var World = function() {
	// default values
	this.mBodies = []; // std::vector<Body*>
	this.mJoints = [];
	this.mParticleCannons = [];
	this.mRays = [];
	this._triggerFields = [];
	
	this.mWorldLimits = new AABB(); // AABB
	this.mWorldSize = new Vector2(0.0, 0.0); // Vector2
	this.mWorldGridStep = new Vector2(0.0, 0.0); // Vector2
		
	this.mPenetrationThreshold = 0.0; // float
	this.mPenetrationCount = 0; // int
	
	this.mCollisionList = []; //std::vector<BodyCollisionInfo>

	this.materialManager = new MaterialManager();
	this.contactManager = new ContactManager();

	this.setWorldLimits(new Vector2(-20,-20), new Vector2(20,20));
		
	this.mPenetrationThreshold = 0.3;
	this.mPenetrationCount = 0;
};

World.gravitation = new Vector2(0, -9.81);

World.prototype.setWorldLimits = function( min, max) { //  const Vector2& , const Vector2& 
	this.mWorldLimits = new AABB(min, max);
	this.mWorldSize = max.sub(min);
	this.mWorldGridStep = this.mWorldSize / 32;
		
	// update bitmasks for all bodies.
	for(var i = 0; i < this.mBodies.length; i++)
		this.updateBodyBitmask(this.mBodies[i]);
};

// Idea: Devide the world into a 32x32 grid
// determine in which grid spaces the object is present
// adjust its bitmask like this
World.prototype.updateBodyBitmask = function(body) { // Body* 
	var box = body.getAABB(); // AABB
	
	//var minX = Math.floor((box.Min.x - mWorldLimits.Min.x) / this.mWorldGridStep.x); // int
	//var maxX = Math.floor((box.Max.x - mWorldLimits.Min.x) / this.mWorldGridStep.x); // int
	
	//if (minX < 0) { minX = 0; } else if (minX > 31) { minX = 31; }
	//if (maxX < 0) { maxX = 0; } else if (maxX > 31) { maxX = 31; }
	
	// determine minimum and maximum grid 
	var minY = Math.floor((
		box.Min.y - 
		this.mWorldLimits.Min.y
	) / this.mWorldGridStep.y); // int
	var maxY = Math.floor((box.Max.y - this.mWorldLimits.Min.y) / this.mWorldGridStep.y); // int

	// Adjust if object have fallen out of the world
	if (minY < 0) { minY = 0; } else if (minY > 31) { minY = 31; };
	if (maxY < 0) { maxY = 0; } else if (maxY > 31) { maxY = 31; };
	
	
	//body->mBitMaskX.clear();
	//for (int i = minX; i <= maxX; i++)
	//	body->mBitMaskX.setOn(i);
	
	
	body.mBitMaskY.clear();
	for(var i = minY; i <= maxY; i++)
		body.mBitMaskY.setOn(i);
	
	//Console.WriteLine("Body bitmask: minX{0} maxX{1} minY{2} maxY{3}", minX, maxX, minY, minY, maxY);
};

World.prototype.addBody = function(b) { // Body
	DEBUG("addBody:", b);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mBodies.length; i++)
		if(this.mBodies[i] == b) {
			exists = true;
			break;
		};
	
	// do not add an already existing body
	if (!exists) {
		this.mBodies.push(b);
		// TODO: introduce possibility to not be affected by gravity
		b.addExternalForce(this.applyGravitationTo);
	}
};

World.prototype.removeBody = function(b) { // Body
	var index = this.mBodies.indexOf(b);
	if (index !== - 1) {
		this.mBodies.splice( index, 1 );
	}
};

World.prototype.addJoint = function(j) { // Joint
	DEBUG("addJoint:", j);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mJoints.length; i++)
		if(this.mJoints[i] == j) {
			exists = true;
			break;
		};
	
	// do not add an already existing joint
	if (!exists) {
		this.mJoints.push(j);
	}
};

World.prototype.removeJoint = function(j) { // Joint
	var index = this.mJoints.indexOf(j);
	if (index !== - 1) {
		this.mJoints.splice( index, 1 );
	}
};

World.prototype.addParticleCannon = function(pc) { // ParticleCannon
	DEBUG("addParticleCannon:", pc);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mParticleCannons.length; i++)
		if(this.mParticleCannons[i] == pc) {
			exists = true;
			break;
		};
	
	// do not add an already existing particle cannon
	if (!exists) {
		this.mParticleCannons.push(pc);
	}
};

World.prototype.addRay = function(r) { // Joint
	DEBUG("addRay:", r);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mRays.length; i++)
		if(this.mRays[i] == r) {
			exists = true;
			break;
		};
	
	// do not add an already existing joint
	if (!exists) {
		this.mRays.push(r);
	}
};

World.prototype.addTriggerField = function(field) { // TriggerField
	DEBUG("addTriggerField:", field);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this._triggerFields.length; i++)
		if(this._triggerFields[i] == field) {
			exists = true;
			break;
		};
	
	// do not add an already existing fields
	if (!exists) {
		this._triggerFields.push(field);
	}
};

World.prototype.removeTriggerField = function(field) { // TriggerField
	var index = this._triggerFields.indexOf(field);
	if (index !== - 1) {
		this._triggerFields.splice( index, 1 );
	}
};

World.prototype.getBody = function(index) { // int, returns Body
	if ((index >= 0) && (index < this.mBodies.length))
		return this.mBodies[index];
	return undefined;
};

World.prototype.applyGravitationTo = function(body) {
	body.addGlobalForce(
		new Vector2(0.0,0.0).add(body.mDerivedPos),
		World.gravitation
	);
};

World.prototype.update = function(timePassed) { // float
	this.mPenetrationCount = 0;
	this.mCollisionList.length = 0;

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callBeforeUpdate(timePassed);
	
	// first, accumulate all forces acting on PointMasses.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		var body = this.mBodies[i];

		if(body.getIsStatic() || body.getIgnoreMe()) { continue; }
		
		body.derivePositionAndAngle(timePassed);
		body.accumulateExternalForces();
		body.accumulateInternalForces();
	}
	
	// accumulate distance joints
	for(var i = 0; i < this.mJoints.length; i++)
	{
		var joint = this.mJoints[i];
		
		joint.applyForce(timePassed);
	}
	
	// now integrate.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		//if this.mBodies[i].getIsStatic()) { continue; }
		
		// hard coded force on first Pointmass
		//this.mBodies[i].pointMasses[0].Force = new Vector2(0.0,9.81);
		//this.mBodies[i].pointMasses[0].Mass = 1;
		
		this.mBodies[i].integrate(timePassed);
	}

	// update all bounding boxes, and then bitmasks.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		var body = this.mBodies[i];

		if(body.getIsStatic() || body.getIgnoreMe()) { continue; }
		
		body.updateAABB(timePassed);
		this.updateBodyBitmask(body);
		body.updateEdgeInfo();
	}

	// now check for collision.
	//for (var i = 0; i < this.mBodies.length; i++)
	//{
		//var bA = this.mBodies[i]; // Body* 
		//if (bA.getIsStatic() || bA.getIgnoreMe())
			//continue;
		
		
		// // OLD, BRUTE-FORCE COLLISION CHECKS USING BITMASKS ONLY FOR OPTIMIZATION.
		////for (int j = i + 1; j < mBodies.size(); j++)
		////{
		////	_goNarrowCheck( mBodies[i], mBodies[j] );
		////}
		
		
		//var bS = bA.mBoundStart; // Body::BodyBoundary*
		//var bE = bA.mBoundEnd; // Body::BodyBoundary*
		//var cur = bS.next; // Body::BodyBoundary*
		
		//var passedMyEnd = false; // bool
		//while (cur)
		//{
			//if (cur == bE)
			//{
			//	passedMyEnd = true;
			//}
			//else if ((cur.type == Begin) && (!passedMyEnd))
			//{
				// overlapping, do narrow-phase check on this body pair.
			//	this._goNarrowCheck(bA, cur.body);
			//}
			//else if (cur.type == End)
			//{
				// this is an end... the only situation in which we didn't already catch this body from its "begin",
				// is if the begin of this body starts before our own begin.
				//if (cur.body.mBoundStart.value <= bS.value)
				//{
					// overlapping, do narrow-phase check on this body pair.
				//	this._goNarrowCheck(bA, cur.body);
				//}
			//}
			//else if (cur.type == VoidMarker)
			//{
				//break;
			//}
			
			//cur = cur.next;
		//}
	//}
	// TODO: at the moment: only use simple collision check with AABB
	for (var i = 0; i < this.mBodies.length; i++) {
		var bA = this.mBodies[i]; // Body* 
		if (bA.getIsStatic() || bA.getIgnoreMe())
			continue;
		for (var j = i+1; j < this.mBodies.length; j++) {
			this._goNarrowCheck(this.mBodies[i], this.mBodies[j]);
		}
	}

	
	
	
	//printf("\n\n");
	
	// now handle all collisions found during the update at once.
	this._handleCollisions();

	this.contactManager.processCollisions(this);
	
	// now dampen velocities.
	for (var i = 0; i < this.mBodies.length; i++)
	{
		if(this.mBodies[i].getIsStatic()) { continue; }
		this.mBodies[i].dampenVelocity();
	}

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callWithUpdate(timePassed);

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callAfterUpdate(timePassed);
	
	// update rays
	for (var i = 0; i < this.mRays.length; i++)
	{
		this.mRays[i].update();
	}
	
	// update trigger fields
	for (var i = 0; i < this._triggerFields.length; i++)
	{
		this._triggerFields[i].update();
	}
	
	// fire queued events
	this.queue().fire();
	
};

World.prototype.queue = function() {
	if(typeof this.__queue__ === "undefined")
		this.__queue__ = new Queue(this);
	return this.__queue__;
};

World.prototype._goNarrowCheck = function(bI, bJ) { // Body*, Body*
	//printf("goNarrow %d vs. %d\n", bI, bJ);

	// TODO: something seems to went wrong here
	// - Bitmask do not work -> therefore outcommented
	// grid-based early out.
	//if ( //((bI->mBitMaskX.mask & bJ->mBitMaskX.mask) == 0) && 
		//((bI.mBitMaskY.mask & bJ.mBitMaskY.mask) == 0))
	//{
		//printf("update - no bitmask overlap.\n");
		//return;
	//}

	// early out - these bodies materials are set NOT to collide
	if (!this.materialManager.getMaterialPair(bI.getMaterial(), bJ.getMaterial()).Collide)
	{
		//printf("update - material early out: %d vs. %d\n", mBodies[i]->getMaterial(), mBodies[j]->getMaterial());
		return;
	}

	// broad-phase collision via AABB.
	var boxA = bI.getAABB(); // const AABB&
	var boxB = bJ.getAABB(); // const AABB& 

	// early out
	if (!boxA.intersects(boxB))
	{
		//printf("update - no AABB overlap.\n");
		return;
	}

	// okay, the AABB's of these 2 are intersecting.  now check for collision of A against B.
	this.bodyCollide(bI, bJ, this.mCollisionList);
	
	// and the opposite case, B colliding with A
	this.bodyCollide(bJ, bI, this.mCollisionList);
};

World.prototype.bodyCollide = function(bA, bB, infoList) { // Body*, Body*, std::vector<BodyCollisionInfo>&
	var bApmCount = bA.getPointMassCount(); // int
	
	var boxB = bB.getAABB(); // AABB
	
	// check all PointMasses on bodyA for collision against bodyB.  if there is a collision, return detailed info.
	for (var i = 0; i < bApmCount; i++)
	{
		var pt = bA.getPointMass(i).Position; // Vector2
		
		// early out - if this point is outside the bounding box for bodyB, skip it!
		if (!boxB.contains(pt))
		{
			//printf("bodyCollide - bodyB AABB does not contain pt\n");
			continue;
		}
		
		// early out - if this point is not inside bodyB, skip it!
		if (!bB.contains(pt))
		{
			//printf("bodyCollide - bodyB does not contain pt\n");
			continue;
		}
		
		var collisionInfo = this._collisionPointBody(bB, bA, i);
		if(collisionInfo)
			infoList.push(collisionInfo);
		continue;
	}
};

World.prototype._collisionPointBody = function(penetratedBody, bodyOfPoint, indexOfPoint) {
	
	// penetration point variables	
	var pointInPolygon = bodyOfPoint.getPointMass(indexOfPoint).Position;
	var normalForPointInPolygon = (function getNormalOfPenetrationPoint(body, i) {
	
		// get index of the previous and next point in pointmasslist
		var numberOfPointMasses = body.getPointMassCount();
		var previosPointIndex = (i > 0) ? i-1 : numberOfPointMasses - 1; // int
		var nextPointIndex = (i < numberOfPointMasses - 1) ? i + 1 : 0; // int
		
		// get previos and next point in pointmasslist
		var previosPoint = body.getPointMass(previosPointIndex).Position; // Vector2
		var nextPoint = body.getPointMass(nextPointIndex).Position; // Vector2
		
		// now get the normal for this point. (NOT A UNIT VECTOR)
		var fromPreviosPoint = pointInPolygon.sub(previosPoint); // Vector2
		var toNextPoint = nextPoint.sub(pointInPolygon); // Vector2
		
		var normalForPoint = fromPreviosPoint.add(toNextPoint); // Vector2
		normalForPoint.makePerpendicular();
	
		return normalForPoint;
	})(bodyOfPoint, indexOfPoint);
	
	// penetrated body variables
	var numberOfPointMasses = penetratedBody.getPointMassCount();
	var indexEdgeStart = numberOfPointMasses;
	var indexEdgeEnd = 0;
	var edgeStart;
	var edgeEnd;
	var normalForEdge;
	
	// result variables
	var resultIndexEdgeStart = -1;
	var resultIndexEdgeEnd = -1;
	var resultPercentageToClosestPoint;
	var resultClosestPointOnEdge;
	var resultDistance = 1000000000.0;
	var resultEdgeNormal;
	
	var opposingEdgeAlreadyFound = false;
	var opposingEdge = false;
	
	while(indexEdgeStart--) {
	
		// Calculate closest point on the line that is tangent to each edge of the polygon.
		edgeStart = penetratedBody.getPointMass(indexEdgeStart).Position;
		edgeEnd = penetratedBody.getPointMass(indexEdgeEnd).Position;
		
		var percentageToClosestPoint = 
			(
				((pointInPolygon.x - edgeStart.x)*(edgeEnd.x - edgeStart.x))
				+
				((pointInPolygon.y - edgeStart.y)*(edgeEnd.y - edgeStart.y))
			)
			/
			(
				Math.pow((edgeEnd.x - edgeStart.x), 2)
				+
				Math.pow((edgeEnd.y - edgeStart.y), 2)
			);
		
		// Calculate closest point on each line segment (edge of the polygon) to the point in question.
		if(percentageToClosestPoint < 0)
			var closestPointOnEdge = edgeStart.copy();
		else if(percentageToClosestPoint > 1)
			var closestPointOnEdge = edgeEnd.copy();
		else
			var closestPointOnEdge = new Vector2(
				edgeStart.x + percentageToClosestPoint * (edgeEnd.x - edgeStart.x),
				edgeStart.y + percentageToClosestPoint * (edgeEnd.y - edgeStart.y)
			);
		
		// Calculate the distance from the closest point on each line segment to the point in question.
		var distance = Math.sqrt(
			Math.pow((pointInPolygon.x - closestPointOnEdge.x), 2) +
			Math.pow((pointInPolygon.y - closestPointOnEdge.y), 2)
		);
		
		var edgeNormal = edgeEnd.sub(edgeStart);
		edgeNormal = /*new Vector2(edgeNormal.y * -1, edgeNormal.x).copy();//*/edgeNormal.getPerpendicular();
		edgeNormal.normalize();
		
		var dot = normalForPointInPolygon.dotProduct(edgeNormal); // float

		opposingEdge = dot <= 0.0;

		// Find the minimum distance.
		if(
			// TODO: is this condition right????
			((!(opposingEdgeAlreadyFound)) && (opposingEdge || distance < resultDistance)) ||
			(opposingEdgeAlreadyFound && opposingEdge && distance < resultDistance)
		) {
			resultDistance = distance;
			resultIndexEdgeStart = indexEdgeStart;
			resultIndexEdgeEnd = indexEdgeEnd;
			resultPercentageToClosestPoint = percentageToClosestPoint;
			resultClosestPointOnEdge = closestPointOnEdge;
			resultEdgeNormal = edgeNormal;
		};
		if(opposingEdge) opposingEdgeAlreadyFound = true;
		
		indexEdgeEnd = indexEdgeStart;
	}
	
	var collisionInfo = new BodyCollisionInfo();
	collisionInfo.bodyA = bodyOfPoint; // Body
	collisionInfo.bodyB = penetratedBody; // Body

	collisionInfo.bodyApm = indexOfPoint; // int
	collisionInfo.bodyBpmA = resultIndexEdgeStart; // int
	collisionInfo.bodyBpmB = resultIndexEdgeEnd; // int

	collisionInfo.hitPt = resultClosestPointOnEdge; // Vector2	
	collisionInfo.edgeD = resultPercentageToClosestPoint; // float
	collisionInfo.norm = resultEdgeNormal; // Vector2	
	collisionInfo.penetration = resultDistance; // float
	return collisionInfo;
};

World.prototype._handleCollisions = function() {
	//printf("handleCollisions - count %d\n", mCollisionList.size());
	
	// handle all collisions!
	for (var i = 0; i < this.mCollisionList.length; i++)
	{
		var info = this.mCollisionList[i]; // BodyCollisionInfo
		
		var A = info.bodyA.getPointMass(info.bodyApm); // PointMass*
		var B1 = info.bodyB.getPointMass(info.bodyBpmA); // PointMass*
		var B2 = info.bodyB.getPointMass(info.bodyBpmB); // PointMass*

		// velocity changes as a result of collision.
		var bVel = (B1.Velocity.add(B2.Velocity)).mulFloat(0.5); // Vector2
		var relVel = A.Velocity.sub(bVel); // Vector2

		var relDot = relVel.dotProduct(info.norm); // float

		//printf("handleCollisions - relVel:[x:%f][y:%f] relDot:%f\n",
		//	   relVel.X, relVel.Y, relDot);
		
		// collision filter!
		//if (!mMaterialPairs[info.bodyA.Material, info.bodyB.Material].CollisionFilter(info.bodyA, info.bodyApm, info.bodyB, info.bodyBpmA, info.bodyBpmB, info.hitPt, relDot))
		//	continue;
		var cf = this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Callback; // CollisionCallback*
		if (cf)
		{
			if (!cf.collisionFilter(info.bodyA, info.bodyApm, info.bodyB, info.bodyBpmA, info.bodyBpmB, info.hitPt, relDot))
				continue;
		}

		if (info.penetration > this.mPenetrationThreshold)
		{
			//Console.WriteLine("penetration above Penetration Threshold!!  penetration={0}  threshold={1} difference={2}",
			//    info.penetration, mPenetrationThreshold, info.penetration-mPenetrationThreshold);
			//printf("handleCollisions - penetration above threshold! threshold:%f penetration:%f diff:%f\n",
			//	   mPenetrationThreshold, info.penetration, info.penetration - mPenetrationThreshold);
			
			this.mPenetrationCount++;
			continue;
		}

		var b1inf = 1.0 - info.edgeD; // float
		var b2inf = info.edgeD; // float
		
		var b2MassSum = ((B1.Mass == 0.0) || (B2.Mass == 0.0)) ? 0.0 : (B1.Mass + B2.Mass); // float
		
		var massSum = A.Mass + b2MassSum; // float
		
		var Amove; // float
		var Bmove; // float
		if (A.Mass == 0.0)
		{
			Amove = 0.0;
			Bmove = (info.penetration) + 0.001;
		}
		else if (b2MassSum == 0.0)
		{
			Amove = (info.penetration) + 0.001;
			Bmove = 0.0;
		}
		else
		{
			Amove = (info.penetration * (b2MassSum / massSum));
			Bmove = (info.penetration * (A.Mass / massSum));
		}
		
		var B1move = Bmove * b1inf; // float
		var B2move = Bmove * b2inf; // float
		
		//printf("handleCollisions - Amove:%f B1move:%f B2move:%f\n",
		//	   Amove, B1move, B2move)
		//if(false) {
		if (A.Mass != 0.0)
		{
			A.Position.addSelf(info.norm.mulFloat(Amove));
		}
		
		if (B1.Mass != 0.0)
		{
			B1.Position.subSelf(info.norm.mulFloat(B1move));
		}
		
		if (B2.Mass != 0.0)
		{
			B2.Position.subSelf(info.norm.mulFloat(B2move));
		}
		//}
		var AinvMass = (A.Mass == 0.0) ? 0.0 : 1.0 / A.Mass; // float
		var BinvMass = (b2MassSum == 0.0) ? 0.0 : 1.0 / b2MassSum; // float
		
		var jDenom = AinvMass + BinvMass; // float
		var elas = 1.0 + this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Elasticity; // float
		var numV = relVel.mulFloat(elas); // Vector2
		
		var jNumerator = numV.dotProduct(info.norm); // float
		jNumerator = -jNumerator;
		
		var j = jNumerator / jDenom; // float
		
		
		var tangent = info.norm.getPerpendicular(); // Vector2
		var friction = this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Friction; // float
		var fNumerator = relVel.dotProduct(tangent); // float
		fNumerator *= friction;
		var f = fNumerator / jDenom; // float

		// adjust velocity if relative velocity is moving toward each other.
		if (relDot <= 0.0001)
		{
			if (A.Mass != 0.0)
			{
				A.Velocity.addSelf((info.norm.mulFloat(j / A.Mass)).sub(tangent.mulFloat(f / A.Mass)));
			}
			
			if (b2MassSum != 0.0)
			{
				B1.Velocity.subSelf((info.norm.mulFloat((j / b2MassSum) * b1inf)).sub(tangent.mulFloat((f / b2MassSum) * b1inf)));
			}
			
			if (b2MassSum != 0.0)
			{
				B2.Velocity.subSelf((info.norm.mulFloat((j / b2MassSum) * b2inf)).sub(tangent.mulFloat((f / b2MassSum) * b2inf)));
			}
		}
	}
};

World.prototype.getClosestPointMass = function(pt, bodyID, pmID ) { //  Vector2, int, int
	bodyID = -1;
	pmID = -1;
	
	var closestD = 100000.0; // float
	for (var i = 0; i < this.mBodies.length; i++)
	{
		var dist = 0.0; // float
		var answer = this.mBodies[i].getClosestPointMass(pt, dist);
		pm = answer.pointMassId; // int
		dist = answer.distance; // float
		if (dist < closestD)
		{
			closestD = dist;
			bodyID = i;
			pmID = pm;
		}
	}
	
	return {
		"bodyId": bodyID,
		"pointMassId": pmID
	};
};


World.prototype.debugDraw = function(debugDraw) {
	
	// draw Joints
	for(var i = 0; i < this.mJoints.length; i++) {
		this.mJoints[i].debugDraw(debugDraw);
	};
	
	// draw Bodies
	for(var i = 0; i < this.mBodies.length; i++) {
		this.mBodies[i].debugDraw(debugDraw);
	};
	
	// draw CollisionList
	for(var i = 0; i < this.mCollisionList.length; i++) {
		this.mCollisionList[i].debugDraw(debugDraw);
	};

	// draw Rays
	for(var i = 0; i < this.mRays.length; i++) {
		this.mRays[i].debugDraw(debugDraw);
	};

	// draw TriggerFields
	for(var i = 0; i < this._triggerFields.length; i++) {
		this._triggerFields[i].debugDraw(debugDraw);
	};
};


	
/*



#ifndef _WORLD_H
#define _WORLD_H

#include "JellyPrerequisites.h"
#include "Vector2.h"
#include "Body.h"


namespace JellyPhysics 
{

	class World 
	{
	public:
		

		
	private:
		
		
	public:
		
		World();
		~World();
		
		void killing();
		
		void setWorldLimits(const Vector2& min, const Vector2& max);
		
		int addMaterial();
		
		void setMaterialPairCollide(int a, int b, bool collide);
		void setMaterialPairData(int a, int b, float friction, float elasticity);
		void setMaterialPairFilterCallback(int a, int b, CollisionCallback* c);
		
		void addBody( Body* b );
		void removeBody( Body* b );
		Body* getBody( int index );
		
		void getClosestPointMass( const Vector2& pt, int& bodyID, int& pmID );
		Body* getBodyContaining( const Vector2& pt );
		
		void update( float elapsed );
		
	private:
		void updateBodyBitmask( Body* b );
		void sortBodyBoundaries();
		
		void _goNarrowCheck( Body* bI, Body* bJ );
		void bodyCollide( Body* bA, Body* bB, std::vector<BodyCollisionInfo>& infoList );
		void _handleCollisions();

		void _checkAndMoveBoundary( Body::BodyBoundary* bb );
		void _removeBoundary( Body::BodyBoundary* me );
		void _addBoundaryAfter( Body::BodyBoundary* me, Body::BodyBoundary* toAfterMe );
		void _addBoundaryBefore( Body::BodyBoundary* me, Body::BodyBoundary* toBeforeMe );
		
		void _logMaterialCollide();
		void _logBoundaries();
		
	public:			
		
		float getPenetrationThreshold() { return mPenetrationThreshold; }
		void setPenetrationThreshold( float val ) { mPenetrationThreshold = val; }
		
		int getPenetrationCount() { return mPenetrationCount; }
	};
}

#endif	// _WORLD_H








#include "World.h"


namespace JellyPhysics 
{	
	World::~World()
	{
		
		delete[] mMaterialPairs;
	}
										 
	 void World::killing()
	 {
		 // clear up all "VoidMarker" elements in the list...
		 if (mBodies.size() > 0)
		 {
			 Body::BodyBoundary* bb = &mBodies[0]->mBoundStart;
			 
			 while (bb->prev)
				 bb = bb->prev;
			 
			 while (bb)
			 {
				 if (bb->type == Body::BodyBoundary::VoidMarker)
				 {
					 // remove this one!
					 _removeBoundary(bb);
					 Body::BodyBoundary* theNext = bb->next;
					 
					 delete bb;
					 
					 bb = theNext;
					 continue;
				 }
				 
				 bb = bb->next;
			 }
		 }
	 }
		

	

	
	void World::removeBody( Body* b )
	{
#ifdef _DEBUG
		printf("removeBody: %d\n", b);
#endif
		
		std::vector<Body*>::iterator it = mBodies.begin();
		while (it != mBodies.end())
		{
			if ((*it) == b)
			{
				mBodies.erase( it );
				_removeBoundary(&b->mBoundStart);
				_removeBoundary(&b->mBoundEnd);
				
#ifdef _DEBUG
				_logBoundaries();
#endif
				
				break;
			}
			
			it++;
		}
	}
	
	
	

	
	Body* World::getBodyContaining( const Vector2& pt )
	{
		for (unsigned int i = 0; i < mBodies.size(); i++)
		{
			if (mBodies[i]->contains(pt))
				return mBodies[i];
		}
		
		return 0;
	}	

}

*/var SpringBody = function(
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
var PressureBody = function(
	w, s, massperpoint,
	pos, angleInRadians, scale,
	kinematic,
	edgeK, edgeD,
	shapeK, shapeD,
	gasPressure
	// World*, const ClosedShape&, float,
	// const Vector2&, float, const Vector2&,
	// bool
	// float, float,
	// float, float,
	// float
) {
	SpringBody.apply(this, arguments);

	this.mVolume = 0.0; //float
	this.mGasAmount = gasPressure;

	this.mNormalList = [];
	this.mEdgeLengthList = [];
	for(var i = 0; i < this.mPointCount.length; i++) {
		this.mNormalList[i] = new Vector2.Zero.copy();
		this.mEdgeLengthList[i] = 0.0;
	};
};

// inheritance
var chain = function() {};
chain.prototype = SpringBody.prototype;
PressureBody.prototype = new chain();
PressureBody.__proto__ = SpringBody;
PressureBody.prototype.constructor = chain;
PressureBody.prototype.parent = SpringBody.prototype;

PressureBody.prototype.kill = function()
{
	this.mNormalList.length = 0;
};

PressureBody.prototype.setGasPressure = function(val) { this.mGasAmount = val; }; // float
PressureBody.prototype.getGasPressure = function() { return this.mGasAmount; }; // returns float

PressureBody.prototype.getVolume = function() { return this.mVolume; }; // returns float

PressureBody.prototype.accumulateInternalForces = function() {

	SpringBody.prototype.accumulateInternalForces.apply(this, arguments);
	
	// internal forces based on pressure equations.  we need 2 loops to do this.  one to find the overall volume of the
	// body, and 1 to apply forces.  we will need the normals for the edges in both loops, so we will cache them and remember them.
	this.mVolume = 0.0;
	for (var i = 0; i < this.mPointCount; i++)
	{
		var prev = (i > 0) ? i-1 : this.mPointCount-1; // int
		var next = (i < this.mPointCount - 1) ? i + 1 : 0; // int
		
		var pmP = this.pointMasses[prev]; // PointMass&
		var pmI = this.pointMasses[i]; // PointMass&
		var pmN = this.pointMasses[next]; // PointMass&
		
		// currently we are talking about the edge from i --> j.
		// first calculate the volume of the body, and cache normals as we go.
		var edge1N = pmI.Position.sub(pmP.Position); // Vector2
		edge1N.makePerpendicular();
		
		var edge2N = pmN.Position.sub(pmI.Position);  // Vector2
		edge2N.makePerpendicular();
		
		var norm = edge1N.add(edge2N); // Vector2

		norm.normalize();
		var edgeL = edge2N.length(); // float

		// cache normal and edge length
		this.mNormalList[i] = (function(n) { return n; })(norm);
		this.mEdgeLengthList[i] = (function(l) { return l; })(edgeL);
		
		var xdist = Math.abs(pmI.Position.x - pmN.Position.x); // float
		var normX = Math.abs(norm.x); // float
		
		var volumeProduct = xdist * normX * edgeL; // float
		
		// add to volume
		this.mVolume += 0.5 * volumeProduct;
	}

	// now loop through, adding forces!
	var invVolume = 1.0 / this.mVolume; // float

	for (var i = 0; i < this.mPointCount; i++)
	{
		var j = (i < this.mPointCount - 1) ? i + 1 : 0; // int

		var pressureV = (invVolume * this.mEdgeLengthList[i] * this.mGasAmount); // float
		this.pointMasses[i].Force.addSelf(this.mNormalList[i].mulFloat(pressureV));
		this.pointMasses[j].Force.addSelf(this.mNormalList[j].mulFloat(pressureV));
	}
};
/*
 * Helpers
 */
var standardEpsilon = 0.0001;
var nearlyEquals = function(a, b, epsilon) {
	return Math.abs(a - b) <= epsilon;
};

/*
 * SingleIntersection
 */
var SingleIntersection = function(pos, body, edgeNumber) {
	this.position = pos;
	this.body = body;
	this.edgeNumber = edgeNumber;
};

/*
 * RayIntersectionObject
 */
var RayIntersectionObject = function(pos, body, edgeNumber) {
	this.intersections = [];
};

RayIntersectionObject.prototype.addIntersection = function(pos, body, edgeNumber) {
	this.intersections.push(new SingleIntersection(pos, body, edgeNumber));
};

RayIntersectionObject.prototype.sortByDistanceTo = function(point) {
	this.intersections = _.sortBy(
		this.intersections,
		function(intersection) {
			return intersection.position.sub(point).length();
		}
	);
};

RayIntersectionObject.prototype.flush = function() {
	this.intersections.length = 0;
};

/*
 * PrivateIntersectionObject
 */
var PrivateIntersectionObject = function() {
	this.points = [];
};

PrivateIntersectionObject.prototype.InsertSolution = function(v) { // Vector2
	this.points.push(v);
};

PrivateIntersectionObject.prototype.NumberOfSolutions = function() { // returns int
	return this.points.length;
};

/*
 * Ray
 */
var Ray = function(world, origin, direction) {
	this.world = world;
	this.origin = origin;
	this.direction = direction;
	
	this.intersections = new RayIntersectionObject();
	
	world.addRay(this);
};

Ray.prototype.update = function() {
	this.intersections.flush();

	this.intersectWorld(this.world);
};

Ray.prototype.intersectWorld = function(world) {
	for(var i = 0; i < world.mBodies.length; i++) {
		this.intersectBody(world.getBody(i));
	};
};

Ray.prototype.intersectBody = function(body) {
	if(!this.intersectAABB(body.mAABB))
		return;

	var intersects = false;
	for(var i = 0; i < body.mPointCount; i++) {
		var j = (i < (body.mPointCount-1)) ? i + 1 : 0;
		var answer = this.intersectLineSegment(
			body.pointMasses[i].Position,
			body.pointMasses[j].Position
		);
		if(answer.NumberOfSolutions() == 0)
			continue;
		intersects = true;
		this.intersections.addIntersection(answer.points[0], body, i);
	};

	return intersects;
};

Ray.prototype.intersectAABB = function(aabb) {
	if(this.intersectLineSegment(aabb.getTopLeft(), aabb.getTopRight()).NumberOfSolutions() > 0)
		return true;
	if(this.intersectLineSegment(aabb.getTopRight(), aabb.getBottomRight()).NumberOfSolutions() > 0)
		return true ;
	if(this.intersectLineSegment(aabb.getBottomRight(), aabb.getBottomLeft()).NumberOfSolutions() > 0)
		return true;
	if(this.intersectLineSegment(aabb.getBottomLeft(), aabb.getTopLeft()).NumberOfSolutions() > 0)
		return true;
	return false;
};

Ray.prototype.intersectLineSegment = function(startPoint, endPoint) {

	// Used only within this namespace
	var PrivateLineToLineIntersection = function(vertex1, vertex2, vertex3, vertex4) {
		var d; // float
		
		//Make sure the lines aren't parallel
		var vertex1to2 = vertex2.sub(vertex1); // Vector2
		var vertex3to4 = vertex4.sub(vertex3); // Vector2
		if(vertex1to2.y / vertex1to2.x != vertex3to4.y / vertex3to4.x)
		{
			d = vertex1to2.x * vertex3to4.y - vertex1to2.y * vertex3to4.x;
			if (d != 0)
			{
				var vertex3to1 = vertex1.sub(vertex3); // Vector2
				return {
					"intersects": true,
					"r": (vertex3to1.y * vertex3to4.x - vertex3to1.x * vertex3to4.y) / d,
					"s": (vertex3to1.y * vertex1to2.x - vertex3to1.x * vertex1to2.y) / d
				};
			}
		}
		return {
			"intersects": false,
			"r": 0,
			"s": 0
		};
	};

	// Ray to LineSegment
	var RayToLineSegmentIntersection = function(vertex1, vertex2, vertex3, vertex4) {
		var result = new PrivateIntersectionObject();
		
		var answer = PrivateLineToLineIntersection(vertex1, vertex2, vertex3, vertex4);
		if(answer.intersects)
		{
			if (answer.r >= 0)
			{
				if (answer.s >= 0 && answer.s <= 1)
				{
					result.InsertSolution(vertex1.add(vertex2.sub(vertex1).mulFloat(answer.r)));
				}
			}
		}
		return result;
	};

	return RayToLineSegmentIntersection(
		this.origin,
		this.origin.add(this.direction),
		startPoint,
		endPoint
	);
};

Ray.prototype.getReflection = function() {
	if(this.intersections.intersections.length == 0)
		return {
			"position": Vector2.Zero.copy(),
			"direction": Vector2.Zero.copy()
		};

	// get first intersection
	this.intersections.sortByDistanceTo(this.origin);
	var reflIntersection = this.intersections.intersections[0];
	
	var i = reflIntersection.edgeNumber;
	var j = (i < (reflIntersection.body.mPointCount-1)) ? i + 1 : 0;
	var vStart = reflIntersection.body.pointMasses[i].Position;
	var vEnd = reflIntersection.body.pointMasses[j].Position;
	var edgeDirection = vEnd.sub(vStart);
	var edgeNormal = edgeDirection.getPerpendicular();
	var reflectedDirection = this.direction.reflectOnNormal(edgeNormal);

	return {
		"position": reflIntersection.position,
		"direction": reflectedDirection
	};
};

Ray.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "yellow",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawDot(this.origin, 3);
	debugDraw.drawPolyline([
		this.origin,
		this.origin.add(this.direction.mulFloat(1000))
	]);
	
	this.intersections.sortByDistanceTo(this.origin);
	
	for(var i = 0; i < this.intersections.intersections.length; i++) {
		debugDraw.drawPlus(this.intersections.intersections[i].position, 5);
	};
	
	this.debugDrawReflection(debugDraw);
};

Ray.prototype.debugDrawReflection = function(debugDraw) {
	if(this.intersections.intersections.length == 0)
		return;

	debugDraw.setOptions({
		"color": "lightblue",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	var reflection = this.getReflection();

	debugDraw.drawDot(reflection.position, 3);
	debugDraw.drawPolyline([
		reflection.position,
		reflection.position.add(reflection.direction.mulFloat(1000))
	]);
};
var BodyBuilder = {};

BodyBuilder.build = function(bodyDefinition) {
	var newBody = new bodyDefinition.targetClass(
		bodyDefinition.world,
		bodyDefinition.shape,
		bodyDefinition.pointMasses,
		bodyDefinition.translate,
		bodyDefinition.rotate,
		bodyDefinition.scale,
		bodyDefinition.isKinematic,
		bodyDefinition.edgeSpringK,
		bodyDefinition.edgeSpringDamp,
		bodyDefinition.shapeSpringK,
		bodyDefinition.shapeSpringDamp,
		bodyDefinition.gasPressure
	);

	for(var i = 0; i < bodyDefinition.internalSprings.length; i++)
		newBody.addInternalSpring.apply(newBody, bodyDefinition.internalSprings[i]);

	return newBody;
};var BodyBluePrint = function(targetClass) {
	this.store = {};
	this.store.targetClass = targetClass;
	this.store.shape = new ClosedShape()
		.begin()
		.addVertex(new Vector2(0.0, 0.0))
		.finish();
	this.store.pointMasses = 1;
	this.store.translate = Vector2.Zero.copy();
	this.store.rotate = 0;
	this.store.scale = Vector2.One.copy();
	this.store.isKinematic = false;
	this.store.edgeSpringK = 0.0;
	this.store.edgeSpringDamp = 0.0;
	this.store.shapeSpringK = 0.0;
	this.store.shapeSpringDamp = 0.0;
	this.store.gasPressure = 1.0;
	
	this.store.internalSprings = [];
};

BodyBluePrint.prototype.world = function(world) {
	this.store.world = world;
	return this;
};

BodyBluePrint.prototype.shape = function(shape) {
	this.store.shape = shape;
	return this;
};

BodyBluePrint.prototype.pointMasses = function(pointMasses) {
	this.store.pointMasses = pointMasses;
	return this;
};

BodyBluePrint.prototype.translate = function(translate) {
	this.store.translate = translate;
	return this;
};

BodyBluePrint.prototype.rotate = function(rotate) {
	this.store.rotate = rotate;
	return this;
};

BodyBluePrint.prototype.scale = function(scale) {
	this.store.scale = scale;
	return this;
};

BodyBluePrint.prototype.isKinematic = function(isKinematic) {
	this.store.isKinematic = isKinematic;
	return this;
};

BodyBluePrint.prototype.edgeSpringK = function(edgeSpringK) {
	this.store.edgeSpringK = edgeSpringK;
	return this;
};

BodyBluePrint.prototype.edgeSpringDamp = function(edgeSpringDamp) {
	this.store.edgeSpringDamp = edgeSpringDamp;
	return this;
};

BodyBluePrint.prototype.shapeSpringK = function(shapeSpringK) {
	this.store.shapeSpringK = shapeSpringK;
	return this;
};

BodyBluePrint.prototype.shapeSpringDamp = function(shapeSpringDamp) {
	this.store.shapeSpringDamp = shapeSpringDamp;
	return this;
};

BodyBluePrint.prototype.gasPressure = function(gasPressure) {
	this.store.gasPressure = gasPressure;
	return this;
};

BodyBluePrint.prototype.addInternalSpring = function(pointA, pointB, springK, damping) {
	this.store.internalSprings.push(arguments);
	return this;
};

BodyBluePrint.prototype.build = function() {
	// TODO: define getter and use blueprint as parameter
	return BodyBuilder.build(this.store);
};
var BodyFactory = function() {};

BodyFactory.createBluePrint = function(targetClass) {
	return new BodyBluePrint(targetClass);
};
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
var ParticleCannon = function() {
	this.store = {};
	this.store.bluePrint = BodyFactory.createBluePrint();
};

ParticleCannon.prototype.world = function(world) {
	this.store.world = world;
	return this;
};

ParticleCannon.prototype.bluePrint = function(bluePrint) {
	this.store.bluePrint = bluePrint;
	return this;
};

ParticleCannon.prototype.setFireOptions = function(options) {

};

ParticleCannon.prototype.addToWorld = function(world) {
	world.queue().addParticleCannon(this);
	return this;
};

ParticleCannon.prototype.update = function(timePassed) {
};

//Spawn a new object
ParticleCannon.prototype.fire = function() {
};

ParticleCannon.prototype.debugDraw = function(debugDraw) {
};
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
var SpringBuilder = function(
	shape, springBody,
	edgeSpringK, edgeSpringDamp
) {
	this.shape = shape;
	this.body = springBody;
	this.edgeSpringK = edgeSpringK;
	this.edgeSpringDamp = edgeSpringDamp;

};

SpringBuilder.prototype.buildInternalSprings = function() {
	for(var i = 0; i < this.body.mPointCount - 1; i++) {
		var closestMasses = this.getNClosestPointMasses(
			this.body.pointMasses[i].Position
		);
		for(var j = 0; j < closestMasses.length; j++) {
			if(closestMasses[j].dist
				> this.body.mAABB.Min.sub(this.body.mAABB.Max).length() / 3) continue;
			this.addSpring(i, closestMasses[j].index);
		};
	};
};

SpringBuilder.prototype.addSpring = function(indexA, indexB) {
	if(nearlyEquals(indexA, indexB, 1.1))
		return;
	this.body.addInternalSpring(indexA, indexB, 300.0, 10.0);
};

SpringBuilder.prototype.getNClosestPointMasses = function(position, n) {
	var i = 0;
	var pointMasses = _.map(this.body.pointMasses, function(pm) {
		return {
			"pm": pm,
			"index": i++,
			"dist": pm.Position.sub(position).length()
		};
	});
	pointMasses = _.sortBy(
		pointMasses,
		function(pm) {
			return pm.dist;
		});
	//var sortedPointMassIndices = _.pluck(pointMasses, "index");
	return pointMasses;
};
var Contact = function(bodyA, bodyB) {
	this.bodyA = bodyA;
	this.bodyB = bodyB;
	this.isNew = false;
};

var ContactManager = function() {
	this.contacts = {};
};

ContactManager.prototype.processCollisions = function(world) {
	var currentCollisions = world.mCollisionList;
	
	var lastContacts = this.contacts;
	this.contacts = {};
	
	// Create contacts from collisions.
	for(var i = 0; i < currentCollisions.length; i++)
		this.addContact(
			currentCollisions[i].bodyA,
			currentCollisions[i].bodyB
		);
	
	// Look for new contacts.
	for(var keyA in this.contacts) {
		for(var keyB in this.contacts[keyA]) {
			if(typeof lastContacts[keyA] !== "undefined")
				if(typeof lastContacts[keyA][keyB] !== "undefined")
					continue;
			this.contacts[keyA][keyB].isNew = true;
		};
	};

	// Process contacts:
	for(var keyA in this.contacts) {
		for(var keyB in this.contacts[keyA]) {
			var contact = this.contacts[keyA][keyB];
			contact.bodyA.callOnContact(contact.bodyB, contact);
			contact.bodyB.callOnContact(contact.bodyA, contact);
			if(contact.isNew) {
				contact.bodyA.callOnStartContact(contact.bodyB, contact);
				contact.bodyB.callOnStartContact(contact.bodyA, contact);
			};
		};
	};
	for(var keyA in lastContacts) {
		for(var keyB in lastContacts[keyA]) {
			if(typeof this.contacts[keyA] !== "undefined") {
				if(typeof this.contacts[keyA][keyB] !== "undefined") {
					var contact = lastContacts[keyA][keyB];
					contact.bodyA.callOnEndContact(contact.bodyB, contact);
					contact.bodyB.callOnEndContact(contact.bodyA, contact);
				};
			};
		};
	};
};

ContactManager.prototype.addContact = function(bodyA, bodyB) {
	if(typeof this.contacts[bodyA.id] === "undefined") {
		this.contacts[bodyA.id] = {};
	};
	if(typeof this.contacts[bodyB.id] === "undefined") {
		this.contacts[bodyB.id] = {};
	};
	if(typeof this.contacts[bodyA.id][bodyB.id] === "undefined") {
		var contact = new Contact(bodyA, bodyB);
		this.contacts[bodyA.id][bodyB.id] = contact;
		this.contacts[bodyB.id][bodyA.id] = contact;
	};
	return this.contacts[bodyA.id][bodyB.id];
};
var QuadTree = function() {};
var TriggerField = function(world, aabb) {
	this.aabb = aabb;
	this._world = world;
	world.addTriggerField(this);
};

TriggerField.prototype.update = function() {
	// overlap Body (one pointMass should be inside the AABB)
	if(this._overlapBodyCallback || this._containBodyCallback) {
		for(var i = 0; i < this._world.mBodies.length; i++) {
			var body = this._world.getBody(i);
			
			var containsAllPointMasses = true;
			var containsAPointMass = false;
			// iterate each pointMass in given body
			for(var j = 0; j < body.getPointMassCount(); j++) {
				if(this.aabb.contains(body.getPointMass(j).Position))
					containsAPointMass = true;
				else
					containsAllPointMasses = false;
			}
			if(containsAPointMass && this._overlapBodyCallback)
				this._overlapBodyCallback(body);
			if(containsAllPointMasses && this._containBodyCallback)
				this._containBodyCallback(body);
		}
	}
};

TriggerField.prototype.onOverlapBody = function(callback) {
	this._overlapBodyCallback = callback;
	return this;
};

TriggerField.prototype.onContainBody = function(callback) {
	this._containBodyCallback = callback;
	return this;
};

TriggerField.prototype.debugDraw = function(debugDraw) {
	this.aabb.debugDraw(debugDraw);
};

	
	// define API for Jello
	window.Jello = {
		AABB: AABB,
		TriggerField: TriggerField,
		//BitMask: Bitmask,
		BodyBluePrint: BodyBluePrint,
		BodyFactory: BodyFactory,
		Body: Body,
		SpringBody: SpringBody,
		PressureBody: PressureBody,
		//BodyCollisionInfo: BodyCollisionInfo,
		ClosedShape: ClosedShape,
		//Contact: Contact,
		//ContactManager: ContactManager,
		InternalSpring: InternalSpring,
		CollisionCallback: CollisionCallback,
		Material: Material,
		ParticleCannon: ParticleCannon,
		Ray: Ray,
		Vector2: Vector2,
		VectorTools: VectorTools,
		World: World,
		DistanceJoint: DistanceJoint,
		InterpolationJoint: InterpolationJoint,
		PinJoint: PinJoint
	};
})(window);