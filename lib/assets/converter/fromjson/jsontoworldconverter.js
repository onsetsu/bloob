mini.Module(
	"assets/converter/fromjson/jsontoworldconverter"
)
.requires(
	"assets/converter/fromjson/jsontobodyconverter"
)
.defines(function(JsonToBodyConverter) {
	var JsonToWorldConverter = {};

	JsonToWorldConverter.convertJsonToWorld = function(worldJson) {
		var world = new Jello.World();
		
		for(var bodyName in worldJson.bodies) {
			var bodyJson = worldJson.bodies[bodyName];
			Jello.Body.fromJson(bodyJson, world);
		};
		
		return world;
	};

	//add convenient method
	Jello.World.fromJson = function(worldJson) {
		return JsonToWorldConverter.convertJsonToWorld(worldJson);
	};
	
	return JsonToWorldConverter;
});
