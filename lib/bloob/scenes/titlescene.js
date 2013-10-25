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
	"basic/mapbuilder"
)
.defines(function(Scene, MapScene, Mouse, Utils, InteractionHandler, Map, MapBuilder) {
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
						
						var map = new Map("untitled");
						map.load(function() {
							new MapScene(game).setMap(map).run();
						});
					}));
		},
		update: function(timePassed) {
			this.mouse.update(timePassed);
			env.input.clearPressed();
		}
	});
	
	return TitleScene;
});
