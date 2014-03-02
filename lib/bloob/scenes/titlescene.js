mini.Module(
	"bloob/scenes/titlescene"
)
.requires(
	"engine/scene",
	"bloob/scenes/mapscene",
	"engine/map/map",
	"assets/loader"
)
.defines(function(Scene, MapScene, Map, Loader) {
	var TitleScene = Scene.subclass({
		initialize: function() {
			Scene.prototype.initialize.apply(this, arguments);
		},
		
		update: function() {
			// check for transition to MapScene
			if(env.input.pressed(env.game.LeftButton)) {
				env.scene.stop();
				
				var map = new Map("twoMaps");
				Loader.load(function() {
					Bloob.log("TITLE TO MAP");
					new MapScene(env.game).setMap(map).run();
				});
			}

			env.input.clearPressed();
		}
	});
	
	return TitleScene;
});
