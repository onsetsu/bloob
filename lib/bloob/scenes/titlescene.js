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
		initialize: function(game, loop) {
			Scene.prototype.initialize.apply(this, arguments);
			
			this.game = game;
			this.loop = loop;
			
			// mouseInteraction
			var that = this;
			this.mouse = new Mouse(this.game.canvas)
				.onLeftClick(new InteractionHandler()
					.onPressed(function() {
						console.log("TITLE TO MAP");
						that.stop();
						
						var newMapScene = new MapScene(game, loop);
						newMapScene.loadMap(
							game.config.startLevel,
							Utils.bind(function(map) {
								MapBuilder.setUpTestMap(this);
								this.map.spawnPlayerAt(this, this.datGuiFolder);
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
