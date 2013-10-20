mini.Module(
	"bloob/scenes/titlescene"
)
.requires(
	"engine/scene",
	"bloob/scenes/mapscene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/mapbuilder"
)
.defines(function(Scene, MapScene, Mouse, Utils, InteractionHandler, MapBuilder) {
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
						that.stop();
						
						var newMapScene = new MapScene(game);
						newMapScene.loadMap(
							"untitled",
							Utils.bind(function(map) {
								this.setMap(map);
								this.initMouseInteraction();
								this.run();
							}, newMapScene)
						);
					}));
		},
		update: function(timePassed) {
			this.mouse.update(timePassed);
		}
	});
	
	return TitleScene;
});
