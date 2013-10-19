var BodyBluePrint = function(targetClass) {
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
