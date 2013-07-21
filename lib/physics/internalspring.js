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
