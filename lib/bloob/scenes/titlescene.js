mini.Module(
	"bloob/scenes/titlescene"
)
.requires(
	"engine/scene",
	"bloob/scenes/mapscene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"engine/map/map",
	"assets/loader"
)
.defines(function(Scene, MapScene, Mouse, Utils, InteractionHandler, Map, Loader) {
	var TitleScene = Scene.subclass({
		initialize: function(game) {
			Scene.prototype.initialize.apply(this, arguments);
			
			this.game = game;
			
			// mouseInteraction
			this.mouse = new Mouse();
		},
		update: function() {
			// check for transition to MapScene
			if(env.input.pressed("leftclick")) {
				env.scene.stop();
				var that = this;
				
				var map = new Map("twoMaps");
				Loader.load(function() {
					Bloob.log("TITLE TO MAP");
					new MapScene(that.game).setMap(map).run();
				});
			}

			env.input.clearPressed();
		}
	});
	
	return TitleScene;
});
