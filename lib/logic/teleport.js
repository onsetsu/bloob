define([
    'require',
	"engine/scene/mapscene",
	"engine/map/map",
	"basic/mapbuilder",
	"assets/loader",
	"jello",
	"num"
], function(
    require,
	MapScene,
	Map,
	MapBuilder,
	Loader,
	Jello,
	num
) {
    var Vector2 = require('num').Vector2,
        Jello = require('jello'),
        TriggerField = Jello.TriggerField,
        AABB = Jello.AABB;

	var Teleport = mini.Class.subclass({
		initialize: function(triggerField, targetMapName, targetLayerIndex, targetPosition) {
			//TODO: allow targetLayer and targetPosition
			triggerField.onOverlapBody(function(body) {
				if(!body.isPlayer) return;

				env.sceneStack.loadAndRun(targetMapName);
			});
		}
	});
	
	/*
	 * add sample Teleport to testMap
	 */
	MapBuilder.testMapExtensions.push(function(layer, world) {
		var teleportTrigger = new TriggerField(
			world,
			new AABB(
				new Vector2(-40, -45),
				new Vector2( 10, -40)
			));
		var teleport = new Teleport(teleportTrigger, "untitled");
	});

	return Teleport;
});
