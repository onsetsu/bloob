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



