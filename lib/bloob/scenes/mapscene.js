mini.Module(
	"bloob/scenes/mapscene"
)
.requires(
	"engine/scene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/interactionhandlerbuilder",
	"basic/mapbuilder",
	"engine/map/map",
	"basic/audio/sound",
	"engine/rendering/debugdraw/debugdraw"
)
.defines(function(
	Scene,
	Mouse,
	Utils,
	InteractionHandler,
	Builder,
	MapBuilder,
	Map,
	Sound,
	DebugDraw
) {
	var MapScene = Scene.subclass({
		initialize: function(game) {
			Scene.prototype.initialize.apply(this, arguments);
			
			this.datGuiFolder = game.datGui.addFolder(this.sceneID);
			this.datGuiFolder.open();
			this.datGuiFolder.add(this, "testChangeMap").name('change map');
			
			this.game = game;
			
			this.mouse = new Mouse();
		},

		setMap: function(map) {
			this.map = map;
			this.map.initDatGui(this.datGuiFolder);
			this.initMouseInteraction();
			return this;
		},

		update: function(timePassed) {
			// entities/map
			this.map.update(timePassed);
			// rendering
			env.camera.update(timePassed);
			env.renderer.draw(this.map);
			// interaction
			this.mouse.update(timePassed);
			env.input.clearPressed();
		},
	
		initMouseInteraction: function() {
			return this.map.initMouseInteractionMap(this.mouse, this.datGuiFolder);
		},
	
		testChangeMap: function() {
			console.log(arguments);
			var game = this.game;
			game.datGui.removeFolder(this.sceneID);
			this.stop();
	
			var map = new Map("untitled");
			map.load(function() {
				new MapScene(game).setMap(map).run();
			});
		}
	});
	
	return MapScene;
});
