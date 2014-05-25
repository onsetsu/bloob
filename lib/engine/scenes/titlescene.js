define([
	"engine/scene",
	"engine/scenes/mapscene",
	"engine/map/map",
	"assets/loader"
], function(Scene, MapScene, Map, Loader) {
	var TitleScene = MapScene.subclass({
		initialize: function() {
			MapScene.prototype.initialize.apply(this, arguments);
			
			this.setMap(new Map());
		},
		
		update: function() {
			// check for transition to MapScene
			if(env.input.pressed(env.game.LeftButton)) {
				env.scene.stop();
				
				var map = new Map("twoMaps");
				Loader.load(function() {
					Bloob.log("TITLE TO MAP");
					new MapScene().setMap(map).run();
				});
				
				return;
			}

			MapScene.prototype.update.apply(this, arguments);
		}
	});
	
	return TitleScene;
});
