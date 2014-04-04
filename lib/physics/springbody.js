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
	};

	// inheritance
	var chain = function() {};
	chain.prototype = Body.prototype;
	SpringBody.prototype = new chain();
	// enable static method inheritance
	SpringBody.__proto__ = Body;
	SpringBody.prototype.constructor = chain;
	SpringBody.prototype.parent = Body.prototype;

	SpringBody.prototype.type = "SpringBody";

	return SpringBody;
});
