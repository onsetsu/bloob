mini.Module(
	"bloob/scenes/mapscene"
)
.requires(
	"engine/scene",
	"basic/utils",
	"engine/map/map",
	"assets/loader",
	"basic/audio/sound",
	"engine/rendering/debugdraw/debugdraw"
)
.defines(function(
	Scene,
	Utils,
	Map,
	Loader,
	Sound,
	DebugDraw
) {
	var MapScene = Scene.subclass({
		initialize: function() {
			Scene.prototype.initialize.apply(this, arguments);
			
			if(Bloob.debug && Bloob.debug.datGui) {
				this.datGuiFolder = Bloob.debug.datGui.addFolder(this.sceneID);
				this.datGuiFolder.open();
				this.datGuiFolder.add(this, "testChangeMap").name('change map');
			}
		},

		getMap: function() {
			return this.map;
		},

		setMap: function(map) {
			this.map = map;
			if(Bloob.debug && Bloob.debug.datGui)
				this.map.initDatGui(this.datGuiFolder);
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
			env.input.clearPressed();
		},

		testChangeMap: function() {
			console.log(arguments);
			if(Bloob.debug && Bloob.debug.datGui)
				Bloob.debug.datGui.removeFolder(this.sceneID);
			env.scene.stop();
	
			var map = new Map("untitled");
			Loader.load(function() {
				new MapScene().setMap(map).run();
			});
		}
	});
	
	return MapScene;
});
