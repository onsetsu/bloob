mini.Module(
	"bloob/scenes/titlescene"
)
.requires(
	"engine/scene",
	"bloob/scenes/editorscene",
	"bloob/scenes/mapscene",
	"basic/mouse",
	"basic/utils",
	"basic/interactionhandler",
	"basic/mapbuilder"
)
.defines(function(Scene, EditorScene, MapScene, Mouse, Utils, InteractionHandler, MapBuilder) {
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
						newMapScene
							.onMapLoaded(
								Utils.bind(function() {
									MapBuilder.setUpTestMap(this);
									this.map.spawnPlayerAt(this, this.datGuiFolder);
									this.run();
								}, newMapScene)
							)
							.loadMap(game.config.startLevel);
					}))
				.onRightClick(new InteractionHandler()
					.onPressed(function() {
						console.log("TITLE TO EDITOR");
						that.stop();
						var editorScene = new EditorScene(game, loop);
						editorScene
							.onMapLoaded(
								Utils.bind(function() {
									this.run();
								}, editorScene)
							)
							.loadMap(game.config.startLevel);
					}));
		},
		update: function(timePassed) {
			this.mouse.update(timePassed);
		}
	});
	
	return TitleScene;
});
