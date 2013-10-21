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
			
			this.map = new Map();
			
			this.renderer = new DebugDraw();

			this.mouse = new Mouse();
		},

		setMap: function(map) {
			this.map = map;
			this.map.initDatGui(this.datGuiFolder);
			//this.renderer.setObjectToDraw(this.map);
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
	
		// mouseInteraction
		loadMap: function(mapToLoadName, callback) {
			this.map.build(mapToLoadName, callback);
			return this;
		},
	
		initMouseInteraction: function() {
			return this.map.initMouseInteractionMap(this.mouse, this.datGuiFolder);
		},
	
		testChangeMap: function() {
			console.log(arguments);
			this.game.datGui.removeFolder(this.sceneID);
			this.stop();
	
			var newMapScene = new MapScene(this.game);
			newMapScene.loadMap(
				"untitled",
				Utils.bind(function blubmapLoaded(map) {
					this.setMap(map);
					this.initMouseInteraction();
					this.run();
				}, newMapScene)
			);
		}
	});
	
	return MapScene;
});
