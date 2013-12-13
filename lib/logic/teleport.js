mini.Module(
	"logic/teleport"
)
.requires(
	"bloob/scenes/mapscene",
	"engine/map/map",
	"basic/mapbuilder",
	"assets/loader"
)
.defines(function(
	MapScene,
	Map,
	MapBuilder,
	Loader
) {

	var Teleport = mini.Class.subclass({
		initialize: function(triggerField, targetMapName, targetLayerIndex, targetPosition) {
			//TODO: implement, include and use this
			return;
			env.scene.stop();
			
			var map = new Map("untitled");
			Loader.load(function() {
				new MapScene(env.game).setMap(map).run();
			});
		}
	});
	
	MapBuilder.testMapExtensions.push(function(layer, world) {
		/*
		 * add sample Teleport to testMap
		 */
		var teleportTrigger = new Jello.TriggerField(
			world,
			new Jello.AABB(
				new Jello.Vector2(-40, -45),
				new Jello.Vector2( 10, -40)
			));
		var teleport = new Teleport(teleportTrigger, "untitled");
	});

	return Teleport;
});
