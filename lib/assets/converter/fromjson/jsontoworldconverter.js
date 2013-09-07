Bloob.JsonToWorldConverter = {};

Bloob.JsonToWorldConverter.convertJsonToWorld = function(worldJson, world) {
	for(var bodyName in worldJson.bodies) {
		var bodyJson = worldJson.bodies[bodyName];
		Bloob.JsonToBodyConverter.convertJsonToBody(bodyJson, world);
	};
};

//add convenient method
World.fromJson = function(worldJson, world) {
	return Bloob.JsonToWorldConverter.convertJsonToWorld(worldJson, world);
};
