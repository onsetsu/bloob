Bloob.WorldToJsonConverter = {};
Bloob.WorldToJsonConverter.worldToJson = function(world) {
	var resultJson = {
		"bodies": {}
	};

	// convert each body
	for(var index in world.mBodies) {
		var body = world.getBody(index);
		resultJson.bodies[body.id] = body.toJson();
	}
	
	return resultJson;
};

// add convenient method
Jello.World.prototype.toJson = function() {
	return Bloob.WorldToJsonConverter.worldToJson(this);
};
