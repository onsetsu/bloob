Bloob.JsonToWorldConverter = {};

Bloob.JsonToWorldConverter.convertJsonToWorld = function(worldJson, world) {
	world = world || new World();
	
	for(var bodyName in worldJson.bodies) {
		var bodyJson = worldJson.bodies[bodyName];
		Jello.Body.fromJson(bodyJson, world);
	};
	
	return world;
};

//add convenient method
World.fromJson = function(worldJson, world) {
	return Bloob.JsonToWorldConverter.convertJsonToWorld(worldJson, world);
};
