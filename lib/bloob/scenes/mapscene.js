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
	"engine/camera",
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
	Camera,
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
			
			// choose, which height is projected from top of canvas to its bottom
			var heightToProject = 40; // or use world boundings: this.getWorld().mWorldLimits.Max.y - this.getWorld().mWorldLimits.Min.y;
			var desiredHeight = heightToProject * env.canvas.canvasHeight / env.canvas.canvasHeight;
			var desiredWidth = heightToProject * env.canvas.canvasWidth / env.canvas.canvasHeight;
			this.camera = new Camera(
				desiredHeight,
				desiredWidth
			);
			
			this.renderer = new DebugDraw(this.camera);

			this.mouse = new Mouse(this.game.canvas);
		},

		setMap: function(map) {
			this.map = map;
			this.map.initDatGui(this.datGuiFolder);
			this.renderer.setObjectToDraw(this.map);
		},

		update: function(timePassed) {
			// entities/map
			this.map.update(timePassed);
			// rendering
			this.camera.update(timePassed);
			this.renderer.draw(timePassed);
			// interaction
			this.mouse.update(timePassed);
		},
	
		// mouseInteraction
		loadMap: function(mapToLoadName, callback) {
			this.map.build(mapToLoadName, callback);
			return this;
		},
	
		initMouseInteraction: function() {
			return this.map.initMouseInteractionMap(this.mouse, this.camera, this.datGuiFolder);
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
