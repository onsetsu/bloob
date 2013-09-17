mini.Module(
		"assets/converter/fromjson/jsontoworldconverter"
)
.requires(
		"assets/converter/fromjson/jsontobodyconverter"
)
.defines(function() {
	var JsonToWorldConverter = {};

	JsonToWorldConverter.convertJsonToWorld = function(worldJson, world) {
		world = world || new Jello.World();
		
		for(var bodyName in worldJson.bodies) {
			var bodyJson = worldJson.bodies[bodyName];
			Jello.Body.fromJson(bodyJson, world);
		};
		
		return world;
	};

	//add convenient method
	Jello.World.fromJson = function(worldJson, world) {
		return Bloob.JsonToWorldConverter.convertJsonToWorld(worldJson, world);
	};
	
	Bloob.JsonToWorldConverter = JsonToWorldConverter;
	
	return JsonToWorldConverter;
});
