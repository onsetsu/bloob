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
		
		this.pressurePhysics = new PressurePhysics(this, bodyDefinition);
	};

	// inheritance
	var chain = function() {};
	chain.prototype = SpringBody.prototype;
	PressureBody.prototype = new chain();
	PressureBody.__proto__ = SpringBody;
	PressureBody.prototype.constructor = chain;
	PressureBody.prototype.parent = SpringBody.prototype;

	PressureBody.prototype.kill = function() { this.pressurePhysics.kill(); };

	PressureBody.prototype.setGasPressure = function(val) { this.pressurePhysics.setGasPressure(val); }; // float
	PressureBody.prototype.getGasPressure = function() { return this.pressurePhysics.getGasPressure(); }; // returns float
	PressureBody.prototype.getVolume = function() { return this.pressurePhysics.getVolume; }; // returns float

	PressureBody.prototype.accumulateInternalForces = function() {
		SpringBody.prototype.accumulateInternalForces.apply(this, arguments);
		
		this.pressurePhysics.accumulateInternalForces(this);
	};

	PressureBody.prototype.toJson = function() {
		var resultJson = SpringBody.prototype.toJson.apply(this, arguments);
		
		// adjustments for pressure bodies
		resultJson.class = "PressureBody";
		resultJson.gasPressure = this.getGasPressure();

		return resultJson;
	};
	
	PressureBody.prototype.type = "PressureBody";

	return PressureBody;
});
