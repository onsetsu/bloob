var Invalid = true;
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
