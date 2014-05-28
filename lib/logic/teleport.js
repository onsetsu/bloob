define([
	"engine/scene/mapscene",
	"engine/map/map",
	"basic/mapbuilder",
	"assets/loader",
	"engine/scene/transition",
	"physics/jello"
], function(
	MapScene,
	Map,
	MapBuilder,
	Loader,
	Transition,
	Jello
) {

	var Teleport = mini.Class.subclass({
		initialize: function(triggerField, targetMapName, targetLayerIndex, targetPosition) {
			//TODO: allow targetLayer and targetPosition
			triggerField.onOverlapBody(function(body) {
				if(!body.isPlayer) return;

				new Transition(env.scene, targetMapName).doIt();
			});
		}
	});
	
	/*
	 * add sample Teleport to testMap
	 */
	MapBuilder.testMapExtensions.push(function(layer, world) {
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
