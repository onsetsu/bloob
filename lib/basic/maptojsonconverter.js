Bloob.MapToJsonConverter = function() {};
Bloob.MapToJsonConverter.mapToJson = function(map) {
	var resultJson = {
		"spawnPoints": {
			"default": {"x": 0, "y": 0}
		},
		"shapes": {},
		"bluePrints": {},
		"bodies": {}
	};
	
	var shapeIdGenerator = new Bloob.UniqueIdGenerator("shape");
	var bluePrintIdGenerator = new Bloob.UniqueIdGenerator("bluePrint");
	var bodyIdGenerator = new Bloob.UniqueIdGenerator("body");
	
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