mini.Module(
	"assets/converter/tojson/worldtojsonconverter"
)
.requires(
	"assets/converter/tojson/bodytojsonconverter",
	"physics/jello"
)
.defines(function(BodyToJsonConverter, Jello) {
	var WorldToJsonConverter = {};
	WorldToJsonConverter.worldToJson = function(world) {
		var resultJson = {
			"bodies": {}
		};

		// convert each body
		/*
		for(var index in world.mBodies) {
			if(!world.mBodies.hasOwnProperty(index)) continue;

			var body = world.getBody(index);
			resultJson.bodies[body.id] = body.toJson();
		}
		*/
		
		return resultJson;
	};

	// add convenient method
	Jello.World.prototype.toJson = function() {
		return WorldToJsonConverter.worldToJson(this);
	};
	
	return WorldToJsonConverter;
});
