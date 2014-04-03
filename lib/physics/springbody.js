define([
	"physics/internalspring",
	"physics/vector2",
	"physics/vectortools",
	"physics/body",
	"physics/springphysics"
], function(
	InternalSpring,
	Vector2,
	VectorTools,
	Body,
	SpringPhysics
) {
	var SpringBody = function(bodyDefinition) {
		Body.apply(this, arguments);
		
		this.springPhysics = new SpringPhysics(this, bodyDefinition);
	};

	// inheritance
	var chain = function() {};
	chain.prototype = Body.prototype;
	SpringBody.prototype = new chain();
	// enable static method inheritance
	SpringBody.__proto__ = Body;
	SpringBody.prototype.constructor = chain;
	SpringBody.prototype.parent = Body.prototype;

	SpringBody.prototype.addInternalSpring = function(pointA, pointB, springK, damping ) { // int, int, float, float
		this.springPhysics.addInternalSpring.apply(this.springPhysics, arguments);
	};

	SpringBody.prototype.clearAllSprings = function() {
		this.springPhysics.clearAllSprings();
	};

	SpringBody.prototype.setShapeMatching = function(onoff) {
		this.springPhysics.setShapeMatching(onoff);
	};
	
	SpringBody.prototype.setShapeMatchingConstants = function(springK, damping) {
		this.springPhysics.setShapeMatching(springK, damping);
	};

	SpringBody.prototype.setEdgeSpringConstants = function(edgeSpringK, edgeSpringDamp) {
		this.springPhysics.setEdgeSpringConstants(edgeSpringK, edgeSpringDamp);
	};

	SpringBody.prototype.setSpringConstants = function(springID, springK, springDamp) { // int, float, float
		this.springPhysics.setSpringConstants(springID, springK, springDamp);
	};

	SpringBody.prototype.getSpringK = function(springID) {
		return this.springPhysics.getSpringK(springID);
	};

	SpringBody.prototype.getSpringDamping = function(springID) {
		return this.springPhysics.getSpringDamping(springID);
	};

	SpringBody.prototype.accumulateInternalForces = function() {	
		this.springPhysics.accumulateInternalForces();
	};

	SpringBody.prototype.debugDraw = function(debugDraw) {
		this.springPhysics.debugDraw(debugDraw, this);

		Body.prototype.debugDraw.apply(this, arguments);
	};

	SpringBody.prototype.toJson = function() {
		var resultJson = Body.prototype.toJson.apply(this, arguments);

		return this.springPhysics.toJson(resultJson);
	};
	
	SpringBody.prototype.type = "SpringBody";

	return SpringBody;
});
