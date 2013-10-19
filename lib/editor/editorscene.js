mini.Module(
	"editor/editorscene"
)
.requires(
	"bloob/scenes/mapscene",
	"engine/scene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/mapbuilder",
	"engine/map/map",
	"assets/converter/tojson/maptojsonconverter",
	"editor/server"
)
.defines(function(
	MapScene,
	Scene,
	Mouse,
	Utils,
	InteractionHandler,
	MapBuilder,
	Map,
	MapToJsonConverter,
	Server
) {
	var EditorScene = MapScene.subclass({
		initialize: function(game, loop) {
			// call parent
			MapScene.prototype.initialize.apply(this, arguments);

			// test for map to json conversion
			var that = this;
			var toJson = {
				"save as": "untitled.json",
				"SAVE": function() {
					Server.save(
						"data/maps/" + toJson["save as"],
						JSON.stringify(that.map.toJson())
					);
				}
			};
			this.datGuiFolder.add(toJson, "save as");
			this.datGuiFolder.add(toJson, "SAVE");
		},
		
		update: function(timePassed) {
			// rendering
			this.camera.update(timePassed);
			this.renderer.draw(timePassed);
			// interaction
			this.mouse.update(timePassed);
		},
		
		initMouseInteraction: function() {
			return this.map.initMouseInteractionEditor(this.mouse, this.camera, this.datGuiFolder);
		},

		testChangeMap: function() {
			console.log("This does nothing for editor");
		}
	});

	return EditorScene;
});
