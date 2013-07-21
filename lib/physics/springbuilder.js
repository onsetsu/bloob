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
