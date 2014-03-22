define([
	"assets/converter/fromjson/jsontobodyconverter",
	"physics/jello"
], function(JsonToBodyConverter, Jello) {
	var JsonToWorldConverter = {};

	JsonToWorldConverter.convertJsonToWorld = function(worldJson) {
		var world = new Jello.World();
		
		/*
		for(var bodyName in worldJson.bodies) {
			if(!worldJson.bodies.hasOwnProperty(bodyName)) continue;
			var bodyJson = worldJson.bodies[bodyName];
			Jello.Body.fromJson(bodyJson, world);
		};
		*/
		
		return world;
	};

	//add convenient method
	Jello.World.fromJson = function(worldJson) {
		return JsonToWorldConverter.convertJsonToWorld(worldJson);
	};
	
	return JsonToWorldConverter;
});
