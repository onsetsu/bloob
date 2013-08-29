Bloob.BodyToJsonConverter = function() {};
Bloob.BodyToJsonConverter.bodyToJson = function(body) {
	return body.toJson();
	
	// first, use default blueprint
	resultJson.bluePrints.defaultBluePrint = {
		"class": "Body"
	};
	
	var world = map.world;
	for(var bodyIndex in world.mBodies) {
		var body = world.mBodies[bodyIndex];
		
		// generate base shape
		var shapeId = shapeIdGenerator.nextId();
		
		// build body information
		var bodyId = bodyIdGenerator.nextId();
		resultJson.bodies[bodyId] = {
			"shape": shapeId,
			"pointMasses": 0,
			"translate": body.mDerivedPos.copy(),
			"rotate": body.mDerivedAngle,
			"scale": {"x": 9, "y": 1.5},
			"isKinematic": body.mKinematic
		};
	}
	
	return resultJson;
};

Body.prototype.toJson = function() {
	return {
		"class": "Body",
		"shape": "i",
		"pointMasses": 1,
		"translate": {"x": 0, "y": 4},
		"rotate": 0,
		"isKinematic": false
	};
};

SpringBody.prototype.toJson = function() {
	var json = Body.prototype.toJson.apply(this, arguments);
	json.class = "SpringBody";
	json.edgeSpringK = 150.0;
	json.edgeSpringDamp = 5.0;
	json.shapeSpringK = 300.0;
	json.shapeSpringDamp = 15.0;
	json.internalSprings = [
		{
			"pointA": 0,
			"pointB": 14,
			"springK": 300,
			"damping": 10
		},
		{
			"pointA": 1,
			"pointB": 14,
			"springK": 300.0,
			"damping": 10.0
		}
	];
	return json;
};

PressureBody.prototype.toJson = function() {
	var json = SpringBody.prototype.toJson.apply(this, arguments);
	json.class = "PressureBody";
	json.gasPressure = 0.0;
	return json;
};
