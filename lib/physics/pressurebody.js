define([
	"physics/vector2",
	"physics/springbody",
	"physics/pressurephysics"
], function(
	Vector2,
	SpringBody,
	PressurePhysics
) {
	var PressureBody = function(bodyDefinition) {
		SpringBody.apply(this, arguments);
	};

	// inheritance
	var chain = function() {};
	chain.prototype = SpringBody.prototype;
	PressureBody.prototype = new chain();
	PressureBody.__proto__ = SpringBody;
	PressureBody.prototype.constructor = chain;
	PressureBody.prototype.parent = SpringBody.prototype;

	PressureBody.prototype.type = "PressureBody";

	return PressureBody;
});
