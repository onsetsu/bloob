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

	
	
	
	
	
	