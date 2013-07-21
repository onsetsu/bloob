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
