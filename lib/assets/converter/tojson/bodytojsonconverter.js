define([
	"assets/converter/tojson/internalspringtojsonconverter",
	"assets/converter/tojson/vector2tojsonconverter",
	"physics/jello"
], function(InternalSpringToJsonConverter, Vector2ToJsonConverter, Jello) {
	var BodyToJsonConverter = {};
	
	BodyToJsonConverter.bodyToJson = function(body) {
		var resultJson = {
			"class": "Body",
			"shape": body.getBaseShape().toJson(),
			"pointMasses": [],
			"translate": body.getDerivedPosition().toJson(),
			"rotate": body.getDerivedAngle(),
			"scale": body.getScale().toJson(),
			"isKinematic": body.getIsKinematic()
		};

		for(var i = 0; i < body.pointMasses.length; i++)
			resultJson.pointMasses.push(body.pointMasses[i].Mass);
		
		return resultJson;
	};

	// add convenient methods
	Jello.Body.prototype.toJson = function() {
		return BodyToJsonConverter.bodyToJson(this);
	};

	Jello.SpringBody.prototype.toJson = function() {
		var resultJson = Jello.Body.prototype.toJson.apply(this, arguments);

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

	Jello.PressureBody.prototype.toJson = function() {
		var resultJson = Jello.SpringBody.prototype.toJson.apply(this, arguments);
		
		// adjustments for pressure bodies
		resultJson.class = "PressureBody";
		resultJson.gasPressure = this.getGasPressure();

		return resultJson;
	};
	
	return BodyToJsonConverter;
});
