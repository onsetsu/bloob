mini.Module(
	"bloob/scenes/mapscene"
)
.requires(
	"engine/scene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/interactionhandlerbuilder",
	"engine/map/map",
	"assets/loader",
	"basic/audio/sound",
	"engine/rendering/debugdraw/debugdraw"
)
.defines(function(
	Scene,
	Mouse,
	Utils,
	InteractionHandler,
	Builder,
	Map,
	Loader,
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

		getMap: function() {
			return this.map;
		},

		setMap: function(map) {
			this.map = map;
			this.map.initDatGui(this.datGuiFolder);
			this.initMouseInteraction();
			return this;
		},

		update: function() {
			// entities/map
			if(Bloob.graph)
				Bloob.graph.beginClock('update');
			this.map.update();
			if(Bloob.graph)
				Bloob.graph.endClock('update');
			// rendering
			if(Bloob.graph)
				Bloob.graph.beginClock('draw');
			env.camera.update();
			env.renderer.draw(this.map);
			if(Bloob.graph)
				Bloob.graph.endClock('draw');
			// interaction
			this.mouse.update();
			env.input.clearPressed();
		},
	
		// TODO: remove, because this is just a guard expression
		initMouseInteraction: function() {
			return this.mouse;
		},
	
		testChangeMap: function() {
			console.log(arguments);
			var game = this.game;
			game.datGui.removeFolder(this.sceneID);
			env.scene.stop();
	
			var map = new Map("untitled");
			Loader.load(function() {
				new MapScene(game).setMap(map).run();
			});
		}
	});
	
	return MapScene;
});
