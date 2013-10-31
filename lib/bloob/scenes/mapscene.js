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
	"assets/loader",
	"basic/audio/sound",
	"engine/rendering/debugdraw/debugdraw",
	"engine/firefly"
)
.defines(function(
	Scene,
	Mouse,
	Utils,
	InteractionHandler,
	Builder,
	MapBuilder,
	Map,
	Loader,
	Sound,
	DebugDraw,
	ff
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
			ff.graph.beginClock('update');
			this.map.update(timePassed);
			ff.graph.endClock('update');
			// rendering
			ff.graph.beginClock('draw');
			env.camera.update(timePassed);
			env.renderer.draw(this.map);
			ff.graph.endClock('draw');
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
			Loader.load(function() {
				new MapScene(game).setMap(map).run();
			});
		}
	});
	
	return MapScene;
});
