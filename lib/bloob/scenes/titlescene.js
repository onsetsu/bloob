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
			var that = this;
			this.mouse = new Mouse()
				.onLeftClick(new InteractionHandler()
					.onPressed(function() {
						console.log("TITLE TO MAP");
						env.scene.stop();
						
						var map = new Map("twoMaps");
						Loader.load(function() {
							new MapScene(game).setMap(map).run();
						});
					}));
		},
		update: function() {
			this.mouse.update();
			env.input.clearPressed();
		}
	});
	
	return TitleScene;
});
