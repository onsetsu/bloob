Bloob.BodyToJsonConverter = function() {};
Bloob.BodyToJsonConverter.bodyToJson = function(body) {
	var resultJson = {
		"class": "Body",
		// TODO: convert shape and point masses
		"shape": body.getBaseShape().toJson(),
		"pointMasses": undefined,
		"translate": body.getDerivedPosition().copy(),
		"rotate": body.getDerivedAngle(),
		"scale": body.getScale().copy(),
		"isKinematic": body.getIsKinematic()
	};

	return resultJson;
};

Body.prototype.toJson = function() {
	return Bloob.BodyToJsonConverter.bodyToJson(this);
};

SpringBody.prototype.toJson = function() {
	var resultJson = Body.prototype.toJson.apply(this, arguments);

	// adjustments for spring bodies
	resultJson.class = "SpringBody";
	resultJson.edgeSpringK = this.mEdgeSpringK;
	resultJson.edgeSpringDamp = this.mEdgeSpringDamp;
	resultJson.shapeSpringK = this.mShapeSpringK;
	resultJson.shapeSpringDamp = this.mShapeSpringDamp;

	resultJson.internalSprings = [];
	for (var i = this.mPointCount; i < this.mSprings.length; i++)
		resultJson.internalSprings.push(this.mSprings[i].toJson());

	return resultJson;
};

PressureBody.prototype.toJson = function() {
	var resultJson = SpringBody.prototype.toJson.apply(this, arguments);
	
	// adjustments for pressure bodies
	resultJson.class = "PressureBody";
	resultJson.gasPressure = this.getGasPressure();

	return resultJson;
};
