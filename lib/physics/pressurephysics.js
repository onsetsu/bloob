define(["physics/vector2"], function(Vector2) {
	var PressurePhysics = function(body, bodyDefinition) {
		this.mVolume = 0.0;
		this.mGasAmount = bodyDefinition.getGasPressure();

		this.mNormalList = [];
		this.mEdgeLengthList = [];
		for(var i = 0; i < body.mPointCount.length; i++) {
			this.mNormalList[i] = new Vector2.Zero.copy();
			this.mEdgeLengthList[i] = 0.0;
		};
	};

	PressurePhysics.prototype.kill = function() { this.mNormalList.length = 0; };

	PressurePhysics.prototype.setGasPressure = function(val) { this.mGasAmount = val; }; // float
	PressurePhysics.prototype.getGasPressure = function() { return this.mGasAmount; }; // returns float
	PressurePhysics.prototype.getVolume = function() { return this.mVolume; }; // returns float

	PressurePhysics.prototype.accumulateInternalForces = function(body) {
		
		// internal forces based on pressure equations.  we need 2 loops to do this:
		// 1. to find the overall volume of the body
		// 2. to apply forces
		// we will need the normals for the edges in both loops, so we will cache them and remember them.
		this.mVolume = 0.0;
		for (var i = 0; i < body.mPointCount; i++)
		{
			// get indices of neighbored point masses
			var prev = (i > 0) ? i-1 : body.mPointCount-1;
			var next = (i < body.mPointCount - 1) ? i + 1 : 0;
			
			// get all participating point masses
			var pmP = body.pointMasses[prev];
			var pmI = body.pointMasses[i];
			var pmN = body.pointMasses[next];
			
			// currently we are talking about the edge from i --> j.
			// first calculate the volume of the body, and cache normals as we go.
			var edge1N = pmI.Position.sub(pmP.Position);
			edge1N.makePerpendicular();
			
			var edge2N = pmN.Position.sub(pmI.Position);
			edge2N.makePerpendicular();
			
			var norm = edge1N.add(edge2N);

			norm.normalize();
			var edgeL = edge2N.length();

			// cache normal and edge length
			this.mNormalList[i] = norm;
			this.mEdgeLengthList[i] = edgeL;
			
			var xdist = Math.abs(pmI.Position.x - pmN.Position.x);
			var normX = Math.abs(norm.x);
			
			// add parallelogram area to volume
			this.mVolume += xdist * normX * edgeL; // = volumeProduct
		}
		// half the area because we always added the area of a parallelogram
		this.mVolume /= 2;

		var invVolume = 1.0 / this.mVolume;

		// now loop through all point masses to add corresponding forces!
		for (var i = 0; i < body.mPointCount; i++)
		{
			// get index of the next point mass
			var j = (i < body.mPointCount - 1) ? i + 1 : 0;

			var pressureV = (invVolume * this.mEdgeLengthList[i] * this.mGasAmount);
			body.pointMasses[i].Force.addSelf(this.mNormalList[i].mulFloat(pressureV));
			body.pointMasses[j].Force.addSelf(this.mNormalList[j].mulFloat(pressureV));
		}
	};

	return PressurePhysics;
});