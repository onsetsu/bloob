mini.Module(
	"assets/converter/tojson/worldtojsonconverter"
)
.requires(
	"assets/converter/tojson/bodytojsonconverter"
)
.defines(function() {
	var WorldToJsonConverter = {};
	WorldToJsonConverter.worldToJson = function(world) {
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

	Bloob.WorldToJsonConverter = WorldToJsonConverter;
	
	return WorldToJsonConverter;
});
